# QA evidence and open checks

## Documentation cleanup verification (2026-11-19)

- Only documentation and agent instructions changed; the completed navigation task package was deleted after consolidation.
- Prettier check of all seven edited Markdown files passed. `npm run format:check` itself failed because `scripts/check-format.mjs` passes deleted-but-still-indexed paths from `git ls-files` to Prettier. The index was not modified; the script was not changed as part of this documentation task.
- `npm run lint` and `npm run typecheck` passed; `npm test` passed all 104 tests across 14 files.
- Sandboxed `npm run build` failed at Chromium `browser.newPage` after Vite output. The approved unsandboxed retry passed, including mandatory RU/EN PDFs; `npm run test:e2e` then passed all 49 tests.
- Build retained non-fatal Zod annotation and large-chunk warnings. Removed task filenames have no remaining references; `git diff --check` passed.

## Study Flow navigation stabilization — historical verification (2026-11-19)

Consolidated from the completed task handoff, not a new run during documentation cleanup. Environment: macOS, Node 24.16.0, npm 11.13.0, Playwright 1.64.1, bundled Chromium 156.0.8078.4.

- Formatting, lint and typecheck passed; unit suite passed with 104 tests across 14 files.
- Five targeted Study Flow E2E tests and the full 48-test E2E suite passed outside the sandbox; the production build generated static pages, SEO and both mandatory PDFs.
- Sandboxed build/browser attempts failed or timed out due to Chromium Mach rendezvous registration being denied. These were not successful PDF/browser runs, and no build exception was added.
- Navigation fixes covered URL normalization, history restoration, locale query retention, boundary guards, keyboard/control isolation, swipe guards and closing explicit completion controls. No session/card IDs, storage keys or schema versions changed.
- Representative screenshots: 375×812 RU/dark prediction, 768×1024 EN/light Event Loop diagram, 1024×768 RU/light rendering diagram, 1440×900 EN/dark Fiber diagram. Assertions checked horizontal overflow and card bounds. This is not every card type in both themes at every viewport, nor an approved visual baseline.

### Open Study Flow work and verification gaps

Navigation stabilization is not completion of the full source migration in `STUDY_FLOW_SPEC.md`. Preserve these follow-ups; missing automated evidence does not by itself establish a runtime defect.

- Finish the original 16-topic/15-practice migration with explicit source coverage, preserved full references, review of the seven shallow topics and manually calibrated durations. Additional tracks do not prove original-source coverage.
- Complete or explicitly revise the planned scheduler diversity/path preferences, next-session flow, progress import/export/reset controls and remaining challenge generators/variant banks.
- Protect a newer stored schema from being replaced by a v1 fallback; current strict parsing alone does not provide that protection. Verify focus and scroll placement after card changes, including long cards and keyboard/screen-reader use.
- Expand history tests to distinct seed/mode states, cross-session/path navigation and duplicate-entry prevention at boundaries; verify repeated visits after completion do not create unintended completion events.
- Test vertical gestures, gestures originating on code/controls and selected text; blocked/quota storage, unknown IDs, stale/newer schemas and idempotent migration with both legacy keys retained.
- Verify all four 1/3/7/14-day intervals, boundary seeds and generator correctness against an independent oracle; the existing 100-seed checks are not a substitute for those cases.
- Review every card type at 375 and 1440 px in both themes, with 768/1024 px checks, diagram readability, focus, contrast, reduced motion and print. Representative screenshots alone do not close this matrix.

## Resume 2.0 verification (2026-11-13)

- `npm run format:check`: passed.
- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm test`: 95 tests passed across 14 files.
- `npm run build`: the sandboxed attempt generated the Vite/static output but Chromium was closed before PDF rendering; the required unsandboxed retry passed and generated static RU/EN pages, SEO and both validated PDFs dated `2026-11-13`.
- `npm run test:e2e`: 46 tests passed, covering RU/EN static content and downloads, print behavior, axe checks, keyboard navigation, reduced motion, themes, and responsive layouts from 320 to 1440 px.
- Editor diagnostics: no errors or warnings.
- Build retained pre-existing non-fatal Rollup warnings for Zod annotations and the main chunk size; no application-source build error was reported.

## Historical automated verification (2026-10-27)

The following results predate the dated updates above; they are not current test counts.

Environment: macOS, Node 24.16.0, Playwright Chromium. Production output is static HTML plus mandatory local RU/EN PDF generation; no remote print service is used.

| Command                        | Result                                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`         | Pass                                                                                                                             |
| `npm run lint`                 | Pass                                                                                                                             |
| `npm run typecheck`            | Pass                                                                                                                             |
| `npm test`                     | 81 tests passed across 12 files                                                                                                  |
| `npm run build`                | Pass outside the terminal OS sandbox; static pages including RU/EN Evolution, SEO, `/availability.json` and RU/EN PDFs generated |
| `npm run test:e2e`             | 44 tests passed with Evolution enabled by default                                                                                |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities after upgrading Zod to 4.6.7                                                                             |
| Editor diagnostics             | No errors or warnings                                                                                                            |
| `ENABLE_EVOLUTION=false`       | Explicit rollback path retained and covered by unit route behavior                                                               |

Sandboxed Chromium could build HTML but hung in `page.pdf()` until the build watchdog. The same build completed normally outside the terminal OS sandbox; this is recorded as an environment limitation, not a successful sandboxed PDF run.

### CI and analyzer remediation verification

- Corrected the Notes E2E URL assertion to match the canonical `notePath()` contract (`/notes?lang=…`, without a trailing slash). All three Notes browser scenarios and the complete 40-test Playwright suite passed.
- `npm run format:check`, `npm run lint`, `npm run typecheck` and `npm test` passed; unit result: 62 tests across 9 files.
- `npm run build` completed static generation and mandatory RU/EN PDF generation outside the terminal OS sandbox. Rollup removed two misplaced `@__PURE__` annotations from Zod's published JavaScript and reported no application-source warning.
- Zod 4.6.7 replaced vulnerable Zod 3.25.76; schemas, inferred types, static generation and browser behavior passed unchanged. `npm audit --audit-level=high` reports 0 vulnerabilities.
- All 25 unique external source URLs returned HTTP 200 in a point-in-time network check on 2026-10-23.

### Interview Preparation Hub verification

- Unified home, topics, practice and paths routes are generated for RU/EN, including direct topic/practice detail pages and retained legacy exercise/Notes URLs.
- Unit tests validate topic relations, manifest parity, six learning paths, stable catalog fallback navigation, selected-path navigation, four progress statuses, v1 migration and JSON import/export validation.
- Playwright verifies unified discovery, canonical practice URLs, previous/next controls, progressive hints, hidden solutions, persisted progress, no-JavaScript readability, accessibility and 320 px reduced-motion layout.
- The production build passed outside the terminal sandbox and generated both mandatory PDFs. The first sandboxed attempt again closed Chromium during PDF creation; no build defect was inferred from that environment-only failure.
- Editor diagnostics reported false unresolved-extension errors for existing extensionless TypeScript imports after `tsc --noEmit` passed; CLI typecheck, lint, unit tests and production build are the authoritative checks for this run.

## Coverage

Automated checks cover:

- complete RU/EN static resume and project pages without JavaScript;
- unit-validated Engineering Notes completeness, unique stable IDs/slugs, localized search, category filtering, base-path URLs and interview reveal reset;
- the campaign-wizard case, including the architecture → 1–2 working days → approximately two-week comparable baseline chain;
- FRUCT date precision and public `2015–2016` rendering;
- the non-employment Tensor scholarship/Tic-Tac-Toe milestone;
- structured manual availability and `/availability.json` parity;
- locale route retention, canonical/hreflang metadata, sitemap, assets, internal links and genuine 404 responses;
- system/light/dark themes and persisted explicit theme;
- keyboard navigation, skip links, axe checks and reduced motion;
- 320/375/768/1024/1280/1440 px layouts in light/dark themes without horizontal overflow;
- Evolution default-enabled and explicit rollback branches, canonical four-stage adapter, milestone, direct static deep links, selected-stage locale retention, keyboard tablist and pager controls, no-JS fallback, route-only lazy enhancement and sitemap inclusion;
- PDF HTTP status, `application/pdf` MIME, `%PDF-` signatures, dated suggested filenames, print visibility and hidden site navigation;
- the localized portrait, missing-image initials fallback, five contact channels and legacy `#contacts` anchor;
- copy mode off on load, no hover/query activation, triple portrait toggle, 700 ms touch hold, `Shift+Enter` keyboard alternative and 48 px targets;
- exactly one icon-only button per experience card, one About button, and no controls on projects, education, technology tags, highlights or case-study sections;
- canonical RU/EN HH clipboard serialization with normalized overview, ordered unique bullets and separate MTS outcome; employer, role, dates, technologies and links are excluded;
- independent repeatable 800 ms copy explosions, localized live-region success/failure feedback, no explosion on Clipboard API failure, and timer cleanup on mode exit;
- allowlisted OMNI, ORP and CRM Trends links with labeled accessible anchors and `noopener noreferrer`; all three targets responded during the 2026-10-23 point-in-time check;
- copy controls and particles excluded from print; reduced motion hides the explosion and retains a static check;
- the availability Ribbon Sweep placement, six-second cycle, reduced-motion and print behavior remain covered.

## Current PDF status

The latest generated files reported by macOS metadata:

| PDF | Pages |          Size |
| --- | ----: | ------------: |
| RU  |     5 | 563,401 bytes |
| EN  |     4 | 522,390 bytes |

The files are generated from the same server-rendered resume used by the locale pages. Build validation checks the final normalized artifact’s header, size, trailer, `%%EOF` and `startxref`; E2E verifies successful downloads, MIME, `%PDF-` signatures, suggested filenames, print content and hidden navigation.

This iteration did not repeat independent text/link extraction or page-by-page rendered visual inspection because `pypdf`, PyMuPDF, `pdfinfo` and `pdftotext` were unavailable. The previous visual review predates v4 and must not be treated as proof of current pagination quality.

## Historical Lighthouse measurements

These local mobile Lighthouse 13.5.0 measurements predate v4 and the expanded content. They are retained only as historical evidence, not current scores or field data.

| Route       | Performance | Accessibility | Best Practices | SEO |   FCP |   LCP |  TBT | CLS |
| ----------- | ----------: | ------------: | -------------: | --: | ----: | ----: | ---: | --: |
| `/` → `/ru` |          93 |           100 |            100 | 100 | 2.6 s | 2.6 s | 0 ms |   0 |
| `/ru`       |          94 |           100 |            100 | 100 | 2.4 s | 2.6 s | 0 ms |   0 |
| `/en`       |          94 |           100 |            100 | 100 | 2.4 s | 2.6 s | 0 ms |   0 |

The root result included the expected redirect and a qualified Lantern warning. Local-server cache/compression findings are not evidence of GitHub Pages production behavior. Lighthouse 100 accessibility is not full WCAG conformance or screen-reader certification.

## Remaining verification

- Smoke-test the live HTTPS GitHub Pages deployment: `/ru`, `/en`, `/notes`, all nine note refreshes, both Evolution routes and refreshes, case route, both PDFs, locale switching, canonical/hreflang, sitemap, 404 and social previews.
- Repeat Lighthouse after deployment or after another substantial layout/content change.
- Review every page of both current PDFs visually; test copy/search in common viewers and an ATS if privacy policy permits.
- Test Chrome, Safari and Firefox on physical devices and perform a short screen-reader pass.
- External-link checks are point-in-time only and do not guarantee future availability.
- Consider localized human-readable display of the content update date while preserving the ISO `dateTime` value.
- Consider page-specific social previews and pinning GitHub Actions to full commit SHAs.

Raw Lighthouse reports, screenshots, PDF renders and Playwright reports are reproducible local/CI artifacts and are intentionally not retained in the repository.
