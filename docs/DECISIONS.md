# Decisions and phase log

## Phase 0 — audit (2026-10-22)

- Repository contains a Foundation/jQuery HTML placeholder, README, license and implementation instructions; no package manager, tests, assets or reusable components.
- Existing staged changes were present in LICENSE, README and index.html. License is preserved; replacing placeholder index and README is part of the requested implementation. No commits or index changes will be made.
- Use React + strict TypeScript + Vite, Zod, Vitest, Playwright, ESLint; plain token-based CSS avoids unnecessary styling dependencies.
- Generate complete static HTML for each known localized route, with small client enhancement. GitHub Pages serves directory index files; unknown paths use a real 404 page. Support configurable base path.
- Public data is an allowlisted, runtime-validated source. No private notes or rejected metrics enter the application. Omit numerical performance claims pending explicit approval. Contact email/phone omitted.
- Use the provided verified career facts only. GitHub project publication status and design reference access remain to be audited; no project cards until verified. No claim of Figma reproduction.
- Initial audit withheld English proficiency, contacts and project stages pending owner review. On 2026-10-22 the owner approved two email addresses, Telegram, self-assessed English B1, Pantry and Magic Ball as in-progress repositories, and Riply/Cave Escaper as future Telegram-bot concepts. The unknown A/B outcome and AI workflow rollout remain unpublished.
- Phase order: content → resume → export/deploy validation → case studies → optional evolution → final QA. Core validation completed before optional work; Evolution remains disabled by default behind `ENABLE_EVOLUTION`.

## Phases 1–3 — content, resume and publishing

- The Zod-validated bilingual content model is the canonical source for public identity and career text. The name already present in the repository's public `index.html` is treated as verified; email and phone remain omitted.
- React pages are server-rendered to complete static HTML. JavaScript enhances themes, mobile navigation and optional controls but is not required to read the resume.
- Build-generated A4 PDFs use selectable text. Internal links are rewritten from the temporary print server to `SITE_URL` + `BASE_PATH` before printing.
- Metadata includes localized canonical/hreflang links, PNG OpenGraph previews and Person/Occupation JSON-LD.

## Phases 4–5 — case study, projects and Evolution

- Publish one bilingual campaign-wizard case based only on confirmed facts. Omit confidential financial details, customer identities and unsupported comparative metrics.
- GitHub API audit found public repositories, including `magic-ball` and `pantry`, but repository existence alone does not verify release status or suitability; the public projects index therefore remains an honest empty state.
- Evolution is a CSS/SVG-free factual timeline with keyboard enhancement and a complete static fallback. It is disabled by default and has no cost on resume routes beyond a tiny separate lazy chunk when enabled.
- The Figma reference returned HTTP 403 during audit. The implemented design is original and does not claim pixel parity or reuse copyrighted assets.

## Phase 6 — QA

- Mobile Lighthouse measurements, screenshot review and PDF review are recorded in `docs/QA.md`.
- Dependency audit was cleared by upgrading Vitest to the compatible patched 4.1.12 release.
- Live GitHub Pages behavior and cross-browser rendering remain deployment follow-ups.

## Recruiter content update (2026-10-22)

- Historical decision, superseded by Portfolio v4: positioning was `Senior Software Developer` / `Старший разработчик ПО` to avoid implying formal people management while retaining seniority.
- Superseded by Portfolio v4: the campaign-wizard result now preserves the approved causal chain from extensible architecture to 1–2 working days including post-testing fixes, compared approximately with a two-week sprint in an existing implementation of similar functionality. This is not a controlled benchmark or multiplier claim.
- The outcome-less address-button A/B experiment was removed; general participation in product A/B experiments remains.
- Pantry and Magic Ball link only to audited owner repositories. Pantry is marked released because its public version is complete, while its evolution into a platform remains explicitly planned; Magic Ball remains in progress. Riply and Cave Escaper have no links and are explicitly marked concepts.
- The owner approved `eugene.malin765@gmail.com`, `evgeniys-nov@yandex.ru`, `https://t.me/no_0vie`, and the WhatsApp QR URL `https://wa.me/qr/XFZZQSNXJCSBL1`. No phone number is published.
- About and each employer expose accessible plain-text copy controls for reusing resume content. Copy controls are enhancements and are excluded from print.
- Skills are grouped by current core, architecture/state, testing/tooling, backend/data and prior specialized experience; no proficiency percentages are used.
- The visual system uses an original brighter blue-and-white palette inspired only by the requested science-fiction mood. No Star Wolves/InoCo assets, trademarks or interface elements are copied.
- Purpose-built social cards use the owner-provided portrait and are generated locally with `npm run assets:og`.
- Availability is stored as a typed manual record and rendered without an external link or synchronization dependency.

## Portfolio update v4 (2026-10-22)

- Added FRUCT as paid hourly external software-development experience with approximate internal dates (`2015-07`–`2016-12`) and public year-only rendering. It precedes Tensor and includes no invented tracker, customer, scale or commercial outcome.
- Added Tensor scholarship/Tic-Tac-Toe as a typed non-employment milestone. The URL `https://github.com/no0vie/tic-tac-toe` was verified through the public GitHub API and README; the milestone does not affect experience duration or top highlights.
- Public positioning is now `Senior Software Engineer (Frontend-focused)` with a restrained Russian equivalent, per v4. Official historical job titles remain unchanged.
- Availability now has `available | selective | unavailable | unknown`, `updatedAt`, `source` and optional `verifiedAt`; the current owner-approved manual value is emitted to `/availability.json` and reused by HTML/PDF.
- Evolution remains optional but now follows FRUCT → Tensor → Yandex Market → MTS, with the scholarship milestone between FRUCT and Tensor.
- HH OAuth/scraping, backend status synchronization and external profile publication remain explicitly out of scope.
