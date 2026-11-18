# Study Flow Phase 2 — Handoff

## Environment and working tree

- Date: 2026-11-19; macOS; Node `v24.16.0`; npm `11.13.0`; Playwright `1.64.1`; bundled Chromium `156.0.8078.4`.
- Initial working tree contained only the untracked owner-provided `study-flow-phase-2-refresh/` task directory. It was not overwritten; this report was added there.
- `study-flow-phase-2-refresh/README.md` and `SOURCE_AUDIT.json`, both referenced by instructions, are absent. Canonical repository sources and the real catalog were inspected instead.
- Scope inventory: 44 total sessions. The four preserved Phase 1 sessions remain unchanged: `browser-event-loop-mechanics` (5 cards, 17 min), `browser-event-loop-prediction` (5 cards, 18 min), `browser-rendering-critical-path` (5 cards, 17 min), `react-fiber-render-commit` (5 cards, 18 min). Card sums are respectively 16/17/16/17 minutes plus one navigation/reflection minute. Source coverage remains topics `browser-event-loop`, `browser-rendering-pipeline`, `react-fiber` and exercise `01`.
- No content/session/card/source IDs, route paths, storage keys or schema versions changed. Migration map: none.

## Phase 2.0 baseline (commands/results)

| Command                                     | Result                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm run format:check`                      | PASS                                                                                 |
| `npm run lint`                              | PASS                                                                                 |
| `npm run typecheck`                         | PASS                                                                                 |
| `npm test`                                  | PASS, 101 tests before changes                                                       |
| `npm run build` (sandboxed)                 | FAIL after successful Vite output at PDF `browser.newPage`: browser closed           |
| `npm run test:e2e` (sandboxed)              | TIMEOUT; browser page setup timed out                                                |
| standalone Chromium with `DEBUG=pw:browser` | Confirmed environment cause: `MachPortRendezvousServer ... Permission denied (1100)` |

The sandboxed Chromium failure is tooling-specific. No PDF work was skipped and no build exception was introduced. Approved unsandboxed reruns are recorded below.

## Defect register (ID, repro, root cause, fix, test)

| ID     | Severity    | Reproduction / actual result                                                                                     | Root cause                                                                                   | Fix                                                                                                    | Regression evidence                                  |
| ------ | ----------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| SF-N01 | High        | Open missing/invalid `card` or malformed/oversized `seed`; UI selected fallback without canonical safe URL       | URL parsing was distributed across state initializers with permissive `Number(...)` handling | Central bounded parser and deterministic canonical URL; invalid card uses first card and seed uses `1` | Unit navigation policy; E2E invalid URL              |
| SF-N02 | High        | Navigate cards, then Back/Forward; only card changed while seed/mode stayed stale                                | `popstate` read only `card`                                                                  | Parse and restore card/seed/mode from URL; canonicalize invalid pop target with replace only           | E2E Back/Forward                                     |
| SF-N03 | Medium      | Press previous on first card or next on last through shortcuts; duplicate same-URL history entries were possible | Bounded move still called `pushState`                                                        | Return on unchanged bounded index and guard equal canonical URLs                                       | URL helper unit test; E2E focused/boundary behavior  |
| SF-N04 | High        | Switch RU↔EN on a seeded card; query was dropped                                                                 | Global locale link generated only the localized pathname                                     | Session locale click preserves canonical query                                                         | E2E locale switch retains card/seed                  |
| SF-N05 | Medium      | Arrow keys while a button/link/contenteditable control had focus could navigate cards                            | Keyboard filter covered only input/textarea/select                                           | Ignore modifiers, prevented events, contenteditable and interactive ancestors                          | E2E focused Finish button                            |
| SF-N06 | Medium      | Horizontal gesture beginning on controls/code could navigate; selected text was ignored                          | Swipe recognizer tracked coordinates only                                                    | Ignore interactive origins and active text selection; retain horizontal-intent threshold               | Existing touch test plus implementation guard        |
| SF-N07 | Medium      | Confidence action remained visible after completion and could be activated again                                 | Completion handler left completion controls open                                             | Close completion panel after writing one explicit event                                                | Existing explicit-completion E2E; full browser suite |
| SF-B01 | Environment | All Chromium setup/PDF attempts failed only in sandbox                                                           | macOS Mach service registration denied by terminal sandbox                                   | No application workaround or skipped stage; run browser checks unsandboxed                             | Build and all E2E pass unsandboxed                   |

No separate verified visual defect was found. The existing fluid layout, contained code overflow, 48px session controls and no fixed maximum card height passed the representative browser matrix, so no speculative CSS rewrite was made.

## Navigation policy implemented (deviations from contract)

- URL path plus `card`, bounded decimal `seed` (`0..2147483647`) and optional `mode` is authoritative for visible state.
- Missing or invalid URL state uses `replaceState`; explicit card moves and challenge regeneration use guarded `pushState`; mode changes use `replaceState` per the pre-existing mode policy.
- Storage is consulted for `lastCardId` only when URL omits `card`; it never overrides a valid deep link.
- Back/Forward derives state from the current URL and never pushes.
- Locale switching pushes a normal browser navigation to the equivalent locale while retaining query state.
- First/last boundaries are no-ops; final-card completion remains explicit.
- No route-semantic, storage-format or ID change requiring owner approval was made.

## Visual changes (screenshots by viewport/locale/theme)

No CSS changes were necessary after browser verification. Playwright report attachments were captured for this representative matrix:

| Viewport | Locale | Theme | Card type                          |
| -------- | ------ | ----- | ---------------------------------- |
| 375×812  | RU     | dark  | seeded interactive prediction/code |
| 768×1024 | EN     | light | Event Loop timing diagram          |
| 1024×768 | RU     | light | rendering pipeline diagram         |
| 1440×900 | EN     | dark  | Fiber architecture diagram         |

Each case asserts no document-level horizontal overflow and that the card bounding box remains inside the viewport. Existing full-suite responsive checks additionally cover 320/375/768/1024/1280/1440, light/dark and reduced motion.

## Progress and challenge compatibility

- Preserved `study-flow:v1`, `interview-lab-progress-v1`, `interview-lab-progress-v2`; migration remains non-destructive and legacy keys are not removed.
- Malformed/blocked storage remains nonfatal. Existing strict schema validation and in-memory fallback are unchanged.
- Explicit completion, confidence and 1/3/7/14-day scheduling remain distinct. A fresh completed session scores below new eligible sessions; legitimately due reviews still rank first.
- Event Loop generator/version/oracle are unchanged and remain deterministic across 100 tested seeds. URL seed now has explicit safe syntax/bounds and survives reload/history/locale.

## Test results (unit, lint, typecheck, E2E, build/PDF)

| Command                                                                  | Final result                                                          |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `npm run format:check`                                                   | PASS                                                                  |
| `npm run lint`                                                           | PASS                                                                  |
| `npm run typecheck`                                                      | PASS                                                                  |
| `npm test`                                                               | PASS, 14 files / 104 tests                                            |
| `npx playwright test e2e/study-flow.spec.ts --workers=1 --reporter=line` | PASS, 5 tests including visual matrix                                 |
| `npm run test:e2e`                                                       | PASS unsandboxed, 48 tests in 32.3s                                   |
| `npm run build`                                                          | PASS unsandboxed; static pages, SEO and both mandatory PDFs generated |

The final browser/build commands required unsandboxed execution solely because of the confirmed macOS Mach service restriction. Application validation itself is green.

## Files changed

- `src/features/study-flow/navigation.ts`
- `src/features/study-flow/StudyFlowPage.tsx`
- `src/app/App.tsx`
- `tests/study-flow.test.ts`
- `e2e/study-flow.spec.ts`
- `docs/DECISIONS.md`
- `README.md`
- `study-flow-phase-2-refresh/HANDOFF.md`

## Known issues / blocked checks / owner approvals required

- Browser/PDF processes cannot run inside the editor terminal sandbox; use approved unsandboxed execution on this macOS environment. This does not affect normal local/CI execution.
- The task package omitted its referenced README and repository has no `SOURCE_AUDIT.json`; no assumptions were derived from either missing artifact.
- No owner approval is required: route semantics, IDs, storage format and build requirements were preserved.
- No new content migration was performed. Broader source migration gaps documented in `docs/DECISIONS.md` remain independent future work.

## Phase 3 readiness: GO or NO-GO, with rationale

**GO.** URL/history/deep-link/seed/locale/keyboard/touch behavior is covered by unit and real-browser regressions; persistence, ranking and 100-seed generator checks pass; the representative visual matrix and full E2E suite pass; production output and both PDFs are generated. The only environment caveat is the diagnosed editor sandbox restriction, with successful unsandboxed verification and no build exception.
