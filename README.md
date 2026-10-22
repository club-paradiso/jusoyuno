# JUSOYUNO?

**Your address. Sorted.** Club Paradiso's independent, mobile-first Korean address helper.

## Features

- Korean, English, Simplified Chinese, Vietnamese, Indonesian and Hindi interface
- On-device Korean/English OCR with a movable and resizable image crop
- Official Korean/English address search via the Ministry of the Interior and Safety's JUSO API, once configured
- Korean/English address copying and separately entered, unverified building/unit information
- Honest manual fallback when the official API is unavailable. No fabricated address results

## Hosting and configuration

Deploy to Vercel using its default "Other" framework preset; this is plain HTML/CSS/JavaScript, with a Node serverless function in `api/address.js`. No build step or npm dependency installation is needed. Add **`JUSO_API_KEY`** to Vercel's environment variables after obtaining a valid JUSO search API key. Never commit credentials.

Run tests with Node 22+: `node --test tests/*.test.js`.

## Privacy

The original selected photo is processed within the browser and is never uploaded to JUSOYUNO servers. Tesseract.js and its OCR language files currently download from third-party CDNs. For official or government-office use, complete a privacy/security review and consider self-hosting all OCR assets before handling real documents. Only the typed or OCR-derived *address keyword* is sent through the serverless search proxy when official search is configured. Do not enter names, government identifiers, signatures or contract terms into the search. Base address records **do not verify tenancy, unit number, or residence**.

## Next milestones

1. Set up JUSO key and test official Korean and English lookups with synthetic addresses.
2. Test OCR on iPad/iPhone/Android with synthetic test documents; add automated e2e tests.
3. Validate translations, accessibility, client-side retention/privacy and API rate limits.
4. Obtain agency approval before any installation in a government office.

Independent utility; not an official immigration or government service.
