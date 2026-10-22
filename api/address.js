"use strict";

const { createHash } = require("node:crypto");

/**
 * Official MOIS JUSO road-name address search proxy.
 * NEVER forward a document, personal identifiers, or credentials to the browser.
 * JUSO approval key: JUSO_API_KEY (Vercel server environment only).
 */
const UPSTREAM = "https://business.juso.go.kr/addrlink/addrLinkApi.do";
const RESTRICTED = /(?:\b\d{6}[-\s]?\d{7}\b|\b01[016789][-.\\s]?\d{3,4}[-.\\s]?\d{4}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i;
const BAD_CHARS = /[\r\n<>%=[\]{};]/;

/*
 * Best-effort abuse control. Serverless instances are ephemeral and do not
 * share memory, so this per-instance limiter only blunts bursts from one
 * client; it is not a distributed quota. Bucket keys are SHA-256 hashes of
 * the client IP — raw IPs and address queries are never logged or stored.
 */
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map();

function clientKey(req) {
  const forwarded = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwarded || String(req.socket?.remoteAddress || "unknown");
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

function rateLimited(req, now = Date.now()) {
  const key = clientKey(req);
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.start >= RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { start: now, count: 1 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function invalidKeyword(keyword) {
  return keyword.length < 2 || keyword.length > 80 ||
    !/[^\d\s\-.,]/u.test(keyword) || BAD_CHARS.test(keyword);
}
function send(res, http, code, extra) {
  return res.status(http).json({ code, ...(extra || {}) });
}
function readBody(body) {
  if (typeof body !== "string") return body;
  try { return JSON.parse(body); } catch (_) { return null; }
}
async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, "METHOD_NOT_ALLOWED");
  }
  if (rateLimited(req)) {
    res.setHeader("Retry-After", "60");
    return send(res, 429, "RATE_LIMITED");
  }
  const contentType = req.headers?.["content-type"];
  if (contentType && !/^application\/json(?:\s*;|$)/i.test(contentType)) return send(res, 415, "UNSUPPORTED_MEDIA_TYPE");
  const len = Number(req.headers?.["content-length"]);
  if (Number.isFinite(len) && len > 2048) return send(res, 413, "REQUEST_TOO_LARGE");
  const payload = readBody(req.body);
  if (!payload || typeof payload !== "object" || Array.isArray(payload) ||
     typeof payload.keyword !== "string") return send(res, 400, "INVALID_QUERY");
  const keyword = payload.keyword.trim().replace(/\s+/gu, " ");
  if (RESTRICTED.test(keyword)) return send(res, 400, "SENSITIVE_QUERY");
  if (invalidKeyword(keyword)) return send(res, 400, "INVALID_QUERY");

  const key = String(process.env.JUSO_API_KEY || "").trim();
  if (!key) return send(res, 503, "NOT_CONFIGURED");
  try {
    const params = new URLSearchParams({
      confmKey: key,
      currentPage: "1",
      countPerPage: "8",
      keyword,
      resultType: "json"
    });
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Accept": "application/json" },
      body: params.toString(),
      signal: AbortSignal.timeout(7500),
      cache: "no-store"
    });
    if (!upstream.ok) return send(res, 502, "UPSTREAM_UNAVAILABLE");
    let json;
    try { json = await upstream.json(); } catch (_) { return send(res, 502, "UPSTREAM_BAD_RESPONSE"); }
    const common = json?.results?.common;
    if (!common || common.errorCode === undefined) return send(res, 502, "UPSTREAM_BAD_RESPONSE");
    const upstreamCode = String(common.errorCode);
    if (upstreamCode !== "0") {
      // Mapping follows the official search-API guide; E0001
      // ("승인되지 않은 KEY 입니다") was additionally confirmed live on
      // 2026-10-22 against business.juso.go.kr using an invalid key.
      if (["E0001", "E0002", "E0014"].includes(upstreamCode)) return send(res, 503, "JUSO_AUTH_FAILED");
      if (["E0005", "E0006", "E0008", "E0009", "E0010", "E0011", "E0012", "E0013", "E0015"].includes(upstreamCode))
        return send(res, 422, "JUSO_QUERY_REJECTED");
      return send(res, 502, "UPSTREAM_UNAVAILABLE");
    }
    const raw = Array.isArray(json.results.juso) ? json.results.juso : [];
    const results = raw.slice(0, 8).filter(item => item && typeof item === "object").map(item => ({
      // Prefer the official full road address (roadAddr, which includes the
      // reference item) and fall back to roadAddrPart1 when it is absent.
      roadAddr: String(item.roadAddr || item.roadAddrPart1 || "").slice(0, 300),
      roadAddrPart2: String(item.roadAddrPart2 || "").slice(0, 120),
      engAddr: String(item.engAddr || "").slice(0, 300),
      jibunAddr: String(item.jibunAddr || "").slice(0, 300),
      zipNo: String(item.zipNo || "").slice(0, 8),
      buildingName: String(item.bdNm || "").slice(0, 120)
    })).filter(item => item.roadAddr);
    const totalCount = Number.parseInt(String(common.totalCount ?? ""), 10);
    return res.status(200).json({
      code: "OK",
      results,
      totalCount: Number.isFinite(totalCount) ? totalCount : results.length,
      source: "MOIS_JUSO",
      verifiedBaseOnly: true
    });
  } catch (e) {
    if (e?.name === "TimeoutError" || e?.name === "AbortError") return send(res, 504, "UPSTREAM_TIMEOUT");
    return send(res, 502, "UPSTREAM_UNAVAILABLE");
  }
}
module.exports = handler;
module.exports.invalidKeyword = invalidKeyword;
module.exports._resetRateLimit = () => rateBuckets.clear();
