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
- API results: `roadAddrPart1`, `engAddr`, `zipNo`, `jibunAddr`, `bdNm`.
- Only base address is officially matched; building/unit fields are user-provided, not proof of residence.
- `GET /api/address-status` returns `configured` without ever revealing the secret; this is only presence, not validity.
- Normalized errors: `NOT_CONFIGURED` (503); `JUSO_AUTH_FAILED` (503); `JUSO_QUERY_REJECTED` (422); `UPSTREAM_TIMEOUT` (504); `UPSTREAM_UNAVAILABLE` (502).

**Acceptance gates:** Use synthetic/sample addresses only. After supplying the key, test one exact road name/number, one building-name query, empty response, invalid-key handling, and mobile user flow. Never send a full scanned lease document to the backend. Searches may still include personal location information, so avoid request logging and review Vercel and upstream retention policies.

## Current limitations

Approval key must be installed by the authorized owner using Vercel controls. No key is supplied in the source. The application has not passed real provider-backed validation until successful live queries are observed. This app is not approved for immigration-office use; security review, native-speaker QA, API abuse controls and OCR/CDN privacy review are required.
