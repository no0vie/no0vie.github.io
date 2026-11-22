# Study Flow supplementary browser audit

Run: 2026-11-22, starting 09:42:06 UTC. Audit only; no production fixes.

## Scope and execution

Used the existing `dist` supplied by the parent run (fresh build and 49 passing E2E tests reported by the parent, not independently rerun here). Actual browser: **headless Chromium 156.0.8078.4**, macOS ARM64, Playwright-managed `chromium-1248`. This is browser evidence, not a full-suite pass.

From the repository root, exact standalone command:

```sh
node playwright-report/checkpoint-1/audit.mjs
```

The script spawns the equivalent of the following command using `process.execPath`, with `BASE_PATH=/`:

```sh
BASE_PATH=/ node --import tsx scripts/server.ts
```

It refuses an occupied port 4173, polls readiness, launches isolated contexts, and closes the browser and owned server in `finally` (SIGTERM with a SIGKILL fallback). Internal deadline: 150 seconds; terminal bound: 170 seconds; server's own maximum lifetime: 180 seconds. Server exited with code 0. No `examples/` code was executed. No full suite, build, lint or typecheck was rerun for this documentation-only audit.

Only this document and ignored `playwright-report/checkpoint-1/` artifacts were created. Existing user changes were left untouched; `playwright-report/data` was not written. The standalone script does not use Playwright's test runner or HTML reporter.

## Matrix and source-confirmed cards

Full Cartesian product: **4 viewports × 2 locales × 2 themes × 4 cards = 64 captures**, all with `reducedMotion: 'reduce'`:

- Viewports: 375×812, 768×1024, 1024×768, 1440×900 CSS pixels.
- Locales: RU and EN; themes: light and dark.
- Route pattern: `/{locale}/interview/session/{session}?card={card}&seed=42`.

| Session                           | Card        | Rendered content            |
| --------------------------------- | ----------- | --------------------------- |
| `browser-event-loop-prediction`   | `generated` | Seeded code block           |
| `browser-event-loop-mechanics`    | `timeline`  | Event-loop diagram          |
| `browser-rendering-critical-path` | `pipeline`  | Rendering pipeline diagram  |
| `react-fiber-render-commit`       | `phases`    | React render/commit diagram |

IDs were inspected in `src/content/study-flow.ts`. In particular, `fiber` is a **concept** card, not the React diagram; `phases` is the correct diagram ID. Rendering selectors were checked in `src/features/study-flow/StudyFlowPage.tsx`.

**Layout checks: 64/64 passed.** Every route returned HTTP 200, retained its requested card, rendered the expected code/diagram selector, matched locale/theme and reduced-motion media state, and kept the card inside the viewport. Document and body widths did not exceed viewport width. All 16 code captures had internal `PRE` overflow with `overflow-x: auto`; no other measured card descendant had horizontal overflow. Thus the code requires internal horizontal scrolling, but does not widen the page.

Artifacts: `playwright-report/checkpoint-1/results.json`, `server.log`, and 64 full-page screenshots named `{width}-{locale}-{theme}-{card}.png`. Two screenshots were visually spot-checked: `375-ru-light-generated.png` and `375-en-dark-phases.png`; wrapping, navigation and diagram text were visible. This is not a manual visual review of all 64 captures.

## Findings

### Deep-link hydration errors — observed, not fixed

The matrix recorded **64 React error #418 events**, four in each of the 16 viewport/locale/theme contexts. The message identifies a text hydration mismatch. Cards subsequently rendered and passed the layout checks, but this is **not a clean runtime pass**. Raw messages are preserved in `results.json` as context-level error entries (separate from the 64 card records). The exact SSR/client mismatch was not isolated by this supplementary audit.

### Throwing `window.localStorage` getter — reproduced

In a fresh context, an init script replaced the `window.localStorage` getter with one throwing `DOMException('Audit: storage getter blocked', 'SecurityError')`, then opened the EN event-loop timeline deep link.

Observed after 700 ms: page error `Audit: storage getter blocked`, **zero `.study-card` elements and empty body text**. Screenshot: `throwing-getter.png`.

Source: `StudyFlowPage.tsx:92–94` evaluates `window.localStorage` before calling `readStudyProgress`; that property access cannot be caught inside the helper. The write call at lines 152–155 uses the same argument-evaluation pattern. This reproduces the getter failure path, not merely a throwing `getItem` method. The write failure path was not separately exercised. Fault injection demonstrates the risk; it does not establish how often real browser policies produce it.

### History leaves persisted resume card stale — reproduced

In another fresh context, on `browser-event-loop-prediction`:

| Action                       | URL card / visible progress        | Persisted `lastCardId` |
| ---------------------------- | ---------------------------------- | ---------------------- |
| Open `contract`, click Next  | `generated` / 2/5                  | `generated`            |
| Browser Back                 | `contract` / 1/5                   | `generated`            |
| Navigate to bare session URL | canonicalized to `generated` / 2/5 | `generated`            |

Screenshot: `history-back.png`; exact URLs and storage observations are in `results.json`.

Source: `StudyFlowPage.tsx:223–235` writes progress for `move`, whereas the `popstate` handler at lines 243–251 changes card/seed/mode without persisting the visit. Initial navigation at lines 174–183 uses the saved card as fallback. Browser Back restores the visible card correctly, but subsequent bare-route resume returns to the newer, stale persisted card. No fix was attempted.

## Limits

- Desktop Chromium viewport emulation only: **no physical touch-device testing**, mobile Safari, Firefox, WebKit, or real swipe/scroll ergonomics validation.
- Reduced-motion preference was asserted; this does not prove every animation respects it.
- Representative code and three diagram cards only: **not exhaustive card coverage or semantic/content correctness review**, translation review, screen-reader testing, or a fresh accessibility audit.
- Internal code scrolling was measured, not physically touch-tested; screenshots show its initial scroll position.
- Persistence probes used isolated contexts and synthetic storage denial; no user profile or real persisted progress was changed.
- Parent build/E2E results remain parent-reported evidence. These supplementary findings must not be summarized as “all browser checks passed.”
