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

## Profile introduction redesign (2026-10-22)

- Keep the established name/role hero, single canonical availability badge and PDF action. The About area directly below navigation now combines the owner-provided portrait, concise approved bilingual introduction and five compact contact chips.
- Reuse `public/profile.jpg`, already approved for social cards, with a CSS focal-position token and an initials fallback on load failure. No synthetic likeness or additional image dependency is introduced.
- `#about` remains the section entry point and nested `#contacts` preserves legacy links. The former standalone contact section is removed; the footer links to `#contacts` instead of duplicating contact records.
- Contact URLs remain sourced only from the validated profile record. Visible labels identify Gmail, Yandex Mail, Telegram, WhatsApp and GitHub without exposing a phone number.

## Documentation consolidation (2026-10-22)

- `SPEC.md` is the single current product and public-fact specification and incorporates Portfolio Update v4. New updates must revise it rather than add another competing current spec.
- One-time task instructions and completed migration audits are removed after their durable decisions and verification boundaries have been moved into `docs/DECISIONS.md` and `docs/QA.md`.
- `docs/QA.md` keeps current reproducible results first and labels older Lighthouse evidence as historical. Recruiter-readiness follow-ups now live in QA instead of a separate stale audit.
- `README.md` remains operational documentation; `docs/CONTENT_POLICY.md` remains the publication/privacy policy; `.agents/skills/career-update/SKILL.md` remains the reusable career-editing workflow.

## Career content revision (2026-10-23)

- Updated the canonical bilingual records for MTS Web Services, Tensor and FRUCT without changing dates, historical role titles, Yandex Market content, visual styling, animation timing or copy-control interaction.
- The homepage keeps a deliberately shorter MTS architecture highlight. The experience record and campaign-wizard case reuse one full architecture/comparison record, while the qualitative commercial outcome is a separate localized field.
- Experience links use a strict allowlist for OMNI, ORP and CRM Trends and render as labeled external links with `rel="noopener noreferrer"`. They are active in HTML/PDF and intentionally omitted from clipboard text.
- Removed the public FRUCT Mattermost/task-tracker detail in favor of the approved Spring Boot/Foundation web-interface work. Tensor now records the approved PostgreSQL query/index work and the limited “one of the mentors/curators” Tensor Hack role.
- No confidential economics, ROI/payback claim, customer identity, measured speedup or external-profile publication was added.

## Microinteractions and copy tools (2026-10-22)

- Copy controls are progressive client enhancements over complete static resume content. Normal pointer use requires five seconds of continuous hover; keyboard focus and explicit copy mode reveal controls immediately.
- `?edit=1` enables copy mode for the current page without implying authentication or exposing additional content. The visible utility toggle was removed; three consecutive portrait activations enable the same client-side mode, which remains off by default.
- Clipboard text is serialized from the validated localized content model. About, highlights, individual achievements, experience summaries/full entries, case summaries/sections and project descriptions are explicit targets; navigation and decorative numbering are excluded.
- CSS-only opacity, color, border, shadow and 1–2 px contact movement provide restrained motion. Successful copy feedback keeps the visible label unchanged and scales the button to 200% for two seconds while retaining nonvisual live-region feedback. Reduced-motion preferences disable transitions, and initial theme transitions are enabled only after hydration.
- The availability badge is positioned beside the hero name. Only the `available` status receives a CSS pseudo-element Ribbon Sweep: `#F2FAFF` → `#68BBFF` → `#195EA8`, −18° skew, 2.4-second traversal in a six-second cycle. It is static in print/reduced-motion and absent for other statuses.
- Copy UI is absolutely overlaid to avoid content reflow and is omitted from print/PDF. The portrait trigger uses a 1.5-second sequence timeout and supports pointer, touch and keyboard activation. No career text, dates, claims, links or Spore Evolution behavior changed.
- PDF links and build output share the single `pdfFileName()` source of truth. Public names follow `eugene-novikov-sse-{profile.updated}-{locale}.pdf`; explicit `download` attributes provide the browser filename, while E2E verifies HTTP 200, `application/pdf`, `%PDF-` and the download event to prevent HTML 404 fallbacks. Build validation also checks the normalized artifact’s trailer, `%%EOF` and `startxref` target before writing it.
