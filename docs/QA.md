# Current QA status

Last updated: 2026-10-23 after Engineering Notes v1 implementation.

## Current automated verification

Environment: macOS, Node 24.16.0, Playwright Chromium. Production output is static HTML plus mandatory local RU/EN PDF generation; no remote print service is used.

| Command                  | Result                                                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`   | Pass                                                                                                                             |
| `npm run lint`           | Pass                                                                                                                             |
| `npm run typecheck`      | Pass                                                                                                                             |
| `npm test`               | 60 tests passed across 8 files after Engineering Notes v1                                                                        |
| `npm run build`          | Pass outside the terminal OS sandbox; static pages including RU/EN Evolution, SEO, `/availability.json` and RU/EN PDFs generated |
| `npm run test:e2e`       | 37 passed with Evolution enabled by default                                                                                      |
| `ENABLE_EVOLUTION=false` | Explicit rollback path retained and covered by unit route behavior                                                               |

Sandboxed Chromium could build HTML but hung in `page.pdf()` until the build watchdog. The same build completed normally outside the terminal OS sandbox; this is recorded as an environment limitation, not a successful sandboxed PDF run.

### Engineering Notes v1 verification in the current environment

- `npm run format:check`, `npm run lint`, `npm run typecheck` and `npm test` passed; unit result: 60 tests across 8 files.
- All 25 unique external source URLs returned HTTP 200 in a point-in-time network check on 2026-10-23.
- `npm run build` completed Vite/static HTML generation but failed twice when Playwright Chromium closed before `browser.newPage()` during mandatory PDF generation. No successful build or PDF result is claimed for this run.
- `npx playwright test e2e/notes.spec.ts` could not create the Playwright `page` fixture and timed out before navigation. The three new browser scenarios and the broader regression suite therefore remain unverified in this environment.

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

- Run the new Notes Playwright suite and the complete E2E regression suite in an environment where Chromium can create a page; verify navigation, `/notes/:slug` refreshes, history, axe, interview mode, mobile overflow, themes and reduced motion.
- Complete a successful production build with mandatory RU/EN PDF generation after resolving the current Chromium launch/closure issue.
- Smoke-test the live HTTPS GitHub Pages deployment: `/ru`, `/en`, `/notes`, all nine note refreshes, both Evolution routes and refreshes, case route, both PDFs, locale switching, canonical/hreflang, sitemap, 404 and social previews.
- Repeat Lighthouse after deployment or after another substantial layout/content change.
- Review every page of both current PDFs visually; test copy/search in common viewers and an ATS if privacy policy permits.
- Test Chrome, Safari and Firefox on physical devices and perform a short screen-reader pass.
- External-link checks are point-in-time only and do not guarantee future availability.
- Consider localized human-readable display of the content update date while preserving the ISO `dateTime` value.
- Consider page-specific social previews and pinning GitHub Actions to full commit SHAs.

Raw Lighthouse reports, screenshots, PDF renders and Playwright reports are reproducible local/CI artifacts and are intentionally not retained in the repository.
