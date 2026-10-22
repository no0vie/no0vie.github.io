# Recruiter-readiness audit

Date: 2026-10-22

## Current verdict

The site has a strong technical foundation and the owner-approved recruiter-content pass is implemented. Approved email, Telegram and WhatsApp contacts, a static availability signal, intentional social cards, audited projects, stronger verified achievement framing, reusable copy controls, grouped skills and a brighter visual scheme are now present. Live deployment verification remains outstanding.

## What is ready

- A recruiter can immediately identify the candidate, frontend-focused senior positioning, employers, dates and core React/TypeScript stack.
- Complete RU/EN resumes render without JavaScript and preserve factual parity.
- The campaign-wizard case demonstrates architectural ownership without exposing proprietary code, customer identities or financial data.
- PDF exports contain selectable text and public links; no loopback links remain.
- Themes, 320 px layouts, keyboard navigation, reduced motion, genuine 404s and locale deep links have automated coverage.
- Local Lighthouse mobile results meet the documented targets.
- Content schemas reject private fields, unsupported evidence, undeclared metrics and arbitrary project links.
- CI validates formatting, lint, types, unit tests, build, PDFs and browser tests before deployment.

## Implemented after the audit

### 1. Approved direct contact channels

Two owner-approved email addresses, Telegram and the approved WhatsApp QR URL are included in both locales and PDFs. The availability signal is static and has no external link or runtime synchronization dependency.

### 2. Replaced the OpenGraph previews

Intentional 1200×630 cards now use the owner-provided portrait, name, role and frontend positioning. Width, height, alt and large Twitter card metadata are generated.

### 3. Filled the Projects section with audited statuses

Pantry and Magic Ball use verified owner repository URLs. Pantry is marked released for its completed public version, with platform evolution clearly described as planned; Magic Ball remains in progress. Riply and Cave Escaper are explicitly marked future Telegram-bot concepts with no invented links or release claims.

### 4. Published the strongest already-verified outcome

The qualified 1–2 working-day statement now appears in the MTS achievement, highlight and campaign case without a multiplier or direct legacy comparison.

## Remaining before distribution

### 1. Smoke-test the live deployment

After publishing, verify `/ru`, `/en`, the case route, both PDFs, locale switching, canonical/hreflang URLs, a missing route, HTTPS and social previews on the actual GitHub Pages origin. Send recruiters a locale-specific URL rather than relying on the root redirect.

## Should complete

1. Tighten print layout if desired later: the expanded project content produces four nonblank pages in both locales; the owner explicitly deferred this work.
2. Render the content-updated date in localized human-readable form while retaining the ISO `dateTime` value.
3. Test copy/search in common PDF viewers and an actual recruiting ATS if privacy policy permits. Local pypdf extraction finds the name, MTS, approved email, Telegram and the 1–2 day statement in both four-page PDFs.

## Could improve

- Derive an experience-duration summary from canonical dates instead of hardcoding a number.

- Add a page-specific social preview for the case study.
- Pin GitHub Actions to full commit SHAs for stronger supply-chain hardening; keep Dependabot updates enabled.
- Run production smoke tests in Chrome, Safari and Firefox and perform a short screen-reader pass.

## Repository cleanup decisions

### Removed

- `CODEX_PROMPT.md`: completed one-time bootstrap prompt, duplicated by `SPEC.md`, `AGENTS.md` and the decision log.
- `.DS_Store`: operating-system artifact.
- `dist/`: reproducible build output.
- `playwright-report/` and `test-results/`: reproducible local test artifacts; CI publishes fresh reports.
- `.npm-cache/`: disposable package/Lighthouse cache. Durable QA conclusions remain in `docs/QA.md`.

### Keep

- `AGENTS.md`: repository-specific safety and implementation rules.
- `SPEC.md`: product requirements and factual source referenced by code and documentation.
- `docs/CONTENT_POLICY.md`, `docs/DECISIONS.md`, `docs/QA.md`: publication policy, architectural history and measured QA summary.
- All source, build scripts and tests: each has active runtime, publishing or validation responsibility.
- `public/favicon.svg`, `public/profile.jpg` and both generated OpenGraph cards: referenced public assets with a reproducible local generator.

`node_modules/` is not repository content and remains ignored. It may be removed locally at any time and restored with `npm ci`.

## Owner decisions resolved

- The WhatsApp QR URL is approved; no phone number is exposed.
- The explicit availability statement remains public without an external resume link.
- `Interface Developer` remains the approved English rendering of the historical Yandex title.
- PDF pagination tightening is deferred.
