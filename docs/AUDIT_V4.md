# Portfolio v4 audit — 2026-10-22

## Scope inspected

- Canonical content and schemas: `src/content/schema.ts`, `src/content/seed.ts`, `src/content/cases.ts`, `src/content/index.ts`.
- Resume, locale UI, clipboard and Evolution: `src/app/App.tsx`, `src/app/copy.ts`, `src/app/resume-text.ts`, `src/app/evolution.ts`.
- Static publishing and PDF: `scripts/build.ts`, `scripts/publishing.ts`, `src/styles/print.css`.
- Unit/E2E coverage, Pages workflow, README, content policy, decisions and QA records.

## Confirmed gaps before implementation

1. The MTS highlight, experience and case mentioned 1–2 working days but omitted the approved comparison with an approximately two-week sprint in an existing comparable implementation. Highlights had no heading field.
2. FRUCT was absent from typed content, resume, PDF and Evolution; experience contained only MTS, Yandex Market and Tensor.
3. Tensor scholarship/Tic-Tac-Toe was absent. The public `no0vie/tic-tac-toe` repository existed and contained a React/TypeScript Tic-Tac-Toe implementation; the interview context remains an owner-approved fact from v4, not a repository-derived claim.
4. Availability was a localized string inside the profile. It had no status/source/update model and the build did not emit `/availability.json`.
5. Public positioning used `Senior Software Developer` rather than the v4 `Senior Software Engineer (Frontend-focused)` title.
6. Evolution and no-JS/PDF tests expected three employers. Existing responsive, theme, locale, axe, deep-link, SEO and PDF infrastructure was reusable and did not require a rewrite.
7. `docs/DECISIONS.md` preserved the superseded choice to omit the MTS baseline comparison.

## Content audit outcome

- Yandex claims remain restrained: no A/B outcome, no remembered percentage, no invented Web Vitals metric and no aviation-delivery commercial-success claim were added.
- MTS AI-assisted testing/team adoption remains unpublished because implementation and adoption were not verified.
- Existing project stages remain owner-approved as recorded in the repository. No new project card or inferred release status was added.
- No tracker product name, FRUCT customer identity, installation scale, commercial result, contract value, ROI or speed multiplier was added.
- The Tic-Tac-Toe URL was checked against the public GitHub API and repository README. The milestone is separate from employment and therefore does not affect experience duration.

## Implemented remediation

- Added one canonical bilingual MTS extensibility record and reused its text in Highlights, Experience and the case study.
- Added FRUCT with approximate internal months and public `2015–2016` rendering.
- Added a typed career milestone and verified GitHub URL for Tic-Tac-Toe; rendered only in optional Evolution.
- Added typed manual availability and build-generated `/availability.json`; HTML and PDF use the same object without runtime fetching.
- Updated SSR, clipboard, Evolution, unit and E2E expectations for four employment entries.

## Remaining verification boundaries

- External-link availability can change after this audit.
- Live GitHub Pages headers, physical devices, screen readers and non-Chromium browsers require deployment/manual follow-up.
- Lighthouse scores in `docs/QA.md` predate v4 and must not be represented as current measurements.
