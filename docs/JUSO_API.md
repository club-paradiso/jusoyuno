# Phase 2 — Official JUSO search API integration

JUSOYUNO uses the **행정안전부 도로명주소 검색 API**. This is NOT the popup API, the coordinate API, a law API, nor the detailed-building-unit lookup API.

Official portal: https://business.juso.go.kr/

## Apply for the correct key

1. Go to the official address platform. Open **주소정보 API 연계** → **API 신청하기** (the portal may label this 개발자센터 → OpenAPI 연계 등록/확인).
2. Choose **검색 API** → **도로명주소** and request the development key. Do not accidentally select 팝업 API.
3. Use the app URL `https://jusoyuno.vercel.app` for the application’s site field, if requested.
4. Sign in/complete identity verification if you want to retrieve the issued key later. Check the provider's latest operating-approval and traffic terms before production.
5. In Vercel's **Club Paradiso → jusoyuno → Settings → Environment Variables**, add:
   - Name: `JUSO_API_KEY`
   - Value: the approved search-API key
   - Type: Sensitive/Encrypted
   - Environments: Preview and Production (Development optional)
6. Redeploy the Git-connected project so new functions receive the key. **Never paste the key in GitHub, an issue, screenshot, this chat or a public URL.**

Vercel project id: `prj_6Z3z65L40CjVe1uIPK8V1RtO2N7H`.
The independent backup project `prj_e02QbOEHh7R3vchx7aO8p90AZ1sc` is not the one to configure.

## Technical contract

- Browser POST `/api/address` with JSON `{"keyword":"제주시 중앙로 1"}`.
- Backend POST to `https://business.juso.go.kr/addrlink/addrLinkApi.do` using URL-encoded `confmKey`, `keyword`, `resultType=json`, `currentPage`, `countPerPage`.
- API results: `roadAddr` (full road address, preferred), `roadAddrPart1`, `roadAddrPart2`, `engAddr`, `zipNo`, `jibunAddr`, `bdNm`. The standard search response already contains the English address (`engAddr`); no separate English-search API is used.
- Responses also include the official `totalCount`; at most 8 candidates are returned per search.
- Only base address is officially matched; building/unit fields are user-provided, not proof of residence.
- `GET /api/address-status` returns `configured` without ever revealing the secret; this is only presence, not validity.
- Normalized errors: `NOT_CONFIGURED` (503); `JUSO_AUTH_FAILED` (503); `JUSO_QUERY_REJECTED` (422); `UPSTREAM_TIMEOUT` (504); `UPSTREAM_UNAVAILABLE` / `UPSTREAM_BAD_RESPONSE` (502); `RATE_LIMITED` (429, with `Retry-After: 60`); `INVALID_QUERY` / `SENSITIVE_QUERY` (400); `REQUEST_TOO_LARGE` (413); `UNSUPPORTED_MEDIA_TYPE` (415); `METHOD_NOT_ALLOWED` (405).
- Upstream error-code mapping follows the official search-API guide. `E0001` ("승인되지 않은 KEY 입니다") was confirmed live against `business.juso.go.kr` on 2026-10-22: an invalid key returns `E0001`, which this proxy maps to `JUSO_AUTH_FAILED`.
- Abuse control: best-effort per-client rate limit of 30 searches/minute, keyed by a SHA-256 hash of the client IP inside each serverless instance. Instances do not share state, so this blunts bursts but is not a distributed quota; add a shared store or Vercel Firewall rule before public roll-out. Address queries and raw IPs are never logged.

**Acceptance gates:** Use synthetic/sample addresses only. After supplying the key, test one exact road name/number, one building-name query, empty response, invalid-key handling, and mobile user flow. Never send a full scanned lease document to the backend. Searches may still include personal location information, so avoid request logging and review Vercel and upstream retention policies.

## Current limitations

Approval key must be installed by the authorized owner using Vercel controls. No key is supplied in the source. The application has not passed real provider-backed validation until successful live queries are observed. This app is not approved for immigration-office use; security review, native-speaker QA, API abuse controls and OCR/CDN privacy review are required.
