# JUSOYUNO deployment

Source of truth: https://github.com/club-paradiso/jusoyuno (main)
Vercel team: Club Paradiso. Git-linked project ID: prj_6Z3z65L40CjVe1uIPK8V1RtO2N7H.

## Continuous deployment
Changes pushed to main trigger a Vercel production build. Other branches generate preview builds. GitHub Actions CI runs Node unit tests.

## Required environment configuration
JUSO_API_KEY: official Korean road-name address search API credential. Add directly in Vercel UI for production and preview. Never commit the key.
Without the key, official lookup returns NOT_CONFIGURED, and manually copied text is explicitly unverified.

## Release checklist
1. GitHub CI passes.
2. Vercel Git deployment is READY and references the expected Git SHA.
3. Preview using synthetic examples only.
4. Check /api/address errors and protection settings.
5. For agency use, self-host OCR assets, review CDN traffic, rate-limit address searches, and obtain permission.

Legacy independent deployment is retained separately as backup until source-to-domain migration is complete.