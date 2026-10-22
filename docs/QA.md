# Phase 6 QA — 2026-10-22

**Result:** local automated checks and mobile Lighthouse targets pass. The initially detected PDF-link failure was fixed and revalidated: generated PDF annotations now use the configured public origin and contain no loopback URLs.

## Environment and validation

Read the full SPEC, README, build/server scripts and Vite/Playwright configuration. Tested a fresh default build (`BASE_PATH=/`, Evolution disabled), not a live deployment. macOS, Node 24.16.0, Playwright-cached Chromium 156.0.0.0. Build emits prerendered HTML and mandatory PDFs; `scripts/server.ts` serves directory indexes and genuine 404 responses, unlike an SPA fallback.

| Command             | Actual result                                                                    |
| ------------------- | -------------------------------------------------------------------------------- |
| `npm run lint`      | Pass                                                                             |
| `npm run typecheck` | Pass                                                                             |
| `npm test`          | 40 tests passed across 5 files after removing a redundant Vite-server smoke test |
| `npm run build`     | Pass; static pages, metadata and RU/EN PDFs generated                            |
| `npm run test:e2e`  | 23 passed (5.6 s) on retry                                                       |

Initial E2E startup failed because port 4173 was occupied. No unrelated process was killed; the later normal retry succeeded. E2E owns its bounded server. Separate measurement server subprocesses used port 4187, a 180-second shutdown deadline, per-command timeouts and `finally` termination/wait cleanup.

Passing E2E covers axe checks on RU/EN resume, projects and campaign-wizard case pages; hydration; no-JS content; PDF responses; persisted theme; locale route retention; skip-link/anchor navigation; real missing-route 404s; internal links and SEO assets; root default/saved locale; and EN responsive/reduced-motion checks at 320/375/768/1280px. Evolution tests verified the **disabled** branch, not enabled keyboard interaction.

## Actual Lighthouse mobile measurements

Lighthouse **13.5.0**, installed using `npm exec --yes --package lighthouse --cache .npm-cache`, with Playwright Chromium supplied through `CHROME_PATH`. Default mobile simulation: 412×823, DPR 1.75, 150 ms RTT, 1,638.4 Kbps throughput, 4× CPU slowdown. CLI options: `--chrome-flags="--headless --no-sandbox" --no-enable-error-reporting --only-categories=performance,accessibility,best-practices,seo --output=json --output=html`. URLs served from `http://127.0.0.1:4187`.

Final retained runs: 2026-10-21 23:12:36–23:12:56 UTC (local session date October 22). Scores are individual lab runs, not medians or field data.

| Requested route | Performance | Accessibility | Best Practices | SEO |   FCP |   LCP | Speed index |  TBT | CLS |
| --------------- | ----------: | ------------: | -------------: | --: | ----: | ----: | ----------: | ---: | --: |
| `/` → `/ru`     |          93 |           100 |            100 | 100 | 2.6 s | 2.6 s |       2.6 s | 0 ms |   0 |
| `/ru`           |          94 |           100 |            100 | 100 | 2.4 s | 2.6 s |       2.4 s | 0 ms |   0 |
| `/en`           |          94 |           100 |            100 | 100 | 2.4 s | 2.6 s |       2.4 s | 0 ms |   0 |

All reported scores meet SPEC targets (90/95/95/95). Important qualifications:

- Root report warns about the expected client redirect and logs `LanternError: missing metric scores for specified navigation`. CLI exited 0 and report has no `runtimeError`, but treat root diagnostics as qualified, not a clean audit. Direct RU/EN reports have no run warnings or stderr errors.
- All three report approximately **176 KiB unused JavaScript**. Direct routes flag cache lifetimes (~308 KiB), render-blocking CSS (~150 ms), and document compression/latency opportunities. The local server supplies neither production cache headers nor compression; these findings are not proof of GitHub Pages behavior. Root flags ~600 ms redirect savings.
- An earlier successful run returned 93/95/94 performance; retained results above are the rerun, not best-score selection. Initial CLI attempts failed at its interactive telemetry prompt; disabling error reporting resolved that tooling failure.
- Lighthouse 100 accessibility is not full WCAG conformance or screen-reader certification.

## Screenshot and content review

Generated and opened **all eight full-page screenshots** using the image reader: RU/EN × 320/1280px × light/dark (900px viewport height). No observed clipping, overlapping sections or broken wrapping; mobile uses a single column, stacked highlights and wrapped technology tags, while desktop preserves the editorial grid. All eight also returned `document.documentElement.scrollWidth <= innerWidth`. Mobile names wrap to two lines. These are manual visual observations, not approved pixel-regression baselines; full-page images are downscaled in the review interface.

Reviewed resume/PDF content retains all three employers, their date ranges, education, restrained shared-architecture/cache claims and honest unpublished-project wording in both languages. No A/B success claim, invented performance percentage, confidential revenue, personal phone/email or unapproved English-level claim was observed in that reviewed content. This is a bounded rendered-content check plus the passing schema tests, not an exhaustive bundle/secrets audit or renewed verification of employer facts.

## PDF review — fixed issue and limitations

Inspected `dist/downloads/resume-{ru,en}.pdf` using pypdf 6.21.2 and PyMuPDF 1.26.5 installed temporarily outside the project. Rendered and opened **every page of both PDFs** using the image reader.

- Both contain **3 nonblank A4 pages** (~594.96 × 841.92 pt), tagged structure, selectable/extractable text, no site navigation and no visually clipped text or split experience cards. Page 1 contains intro/highlights/MTS; page 2 Yandex/Tensor/case summary; page 3 remaining supporting sections. English projects fit on page 2; Russian projects begin page 3.
- **Fixed after initial review:** case/project PDF link annotations are rewritten before printing to `SITE_URL` + `BASE_PATH`. The rebuilt PDFs contain public `https://no0vie.github.io/...` links and no `localhost` or `127.0.0.1` destinations. GitHub annotations target `https://github.com/no0vie`.
- **Polish:** third pages are sparse (RU ~483 extracted characters; EN ~364), leaving substantial whitespace. Not blank pages or lost content; consider tighter print pagination.
- **Extraction discrepancy, not a confirmed encoding defect:** pypdf renders Cyrillic `к` as `ĸ` in extracted text (e.g. `Новиĸов`), whereas PyMuPDF returns 98 Cyrillic `к` characters and no `ĸ`; rendered Russian glyphs look correct. Do not infer broken PDF text from one parser. Actual ATS/viewer copy/search interoperability remains unverified.

## Evidence and remaining scope

Local, ignored artifacts are retained under `.npm-cache/phase6/` (not committed): `{root,ru,en}.report.{json,html}`, corresponding `.log` files, `{ru,en}-{320,1280}-{light,dark}.png`, `{ru,en}-pdf-{1,2,3}.png`, and extracted `{ru,en}-pdf.txt`. Initial artifacts under `test-results` were removed by the E2E runner; final measurements/screenshots were regenerated in the stable cache directory. E2E HTML report remains in `playwright-report/`.

Remaining: validate live HTTPS deployment and real hosting headers; cross-browser/physical-device and screen-reader checks; external-link availability; ATS interoperability. Root-path/Evolution-off and `/career/`-base/Evolution-on builds and E2E suites pass locally. Internal-link checks do not certify external URLs. README, decisions and `docs/CONTENT_POLICY.md` have been reconciled with the final implementation.
