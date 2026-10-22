# Decisions and phase log

## Phase 0 — audit (2026-10-22)

- Repository contains a Foundation/jQuery HTML placeholder, README, license and implementation instructions; no package manager, tests, assets or reusable components.
- Existing staged changes were present in LICENSE, README and index.html. License is preserved; replacing placeholder index and README is part of the requested implementation. No commits or index changes will be made.
- Use React + strict TypeScript + Vite, Zod, Vitest, Playwright, ESLint; plain token-based CSS avoids unnecessary styling dependencies.
- Generate complete static HTML for each known localized route, with small client enhancement. GitHub Pages serves directory index files; unknown paths use a real 404 page. Support configurable base path.
- Public data is an allowlisted, runtime-validated source. No private notes or rejected metrics enter the application. Omit numerical performance claims pending explicit approval. Contact email/phone omitted.
- Use the provided verified career facts only. GitHub project publication status and design reference access remain to be audited; no project cards until verified. No claim of Figma reproduction.
- English proficiency, experiment results, AI workflow rollout and candidate project stages require owner review; omit from public content.
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
