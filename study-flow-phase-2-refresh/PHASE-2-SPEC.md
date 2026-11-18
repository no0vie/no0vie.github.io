# Study Flow — Phase 2: UX Stabilization & Navigation

**Target:** portfolio RU/EN interview routes. **Scope:** existing four Phase 1 sessions and infrastructure. **Out of scope:** mass migration, new learning paths, backend, analytics, design overhaul.

## 0. Baseline and invariants

Existing session IDs: `browser-event-loop-mechanics`, `browser-event-loop-prediction`, `browser-rendering-critical-path`, `react-fiber-render-commit`. Preserve stable IDs, cards, learning links, original material, and both locales. Preserve `study-flow:v1`, `interview-lab-progress-v1`, `interview-lab-progress-v2`; never destructively rewrite legacy data. Existing `/interview/topics`, `/interview/practice`, `/interview/paths`, `/notes` remain reachable.

Existing code to inspect first: `src/content/study-flow.ts`, `src/features/study-flow/StudyFlowPage.tsx`, `src/features/study-flow/progress.ts`, `src/features/study-flow/challenges.ts`, `src/features/interview/InterviewPage.tsx`, `src/app/routes.ts`, `src/app/App.tsx`, `scripts/build.ts`, `src/styles/global.css`, `tests/study-flow.test.ts`, `tests/routes.test.ts`, `e2e/study-flow.spec.ts`, `.agents/skills/study-flow-content/SKILL.md`.

## 2.0 Audit (mandatory before changes)

1. Inspect package scripts, router, rendering mode, existing tests, PDF build step, browser launch configuration and CSS.
2. Run baseline lint, typecheck, unit tests, production build and E2E separately; record exact commands, versions, exit codes, errors, timeouts and environment.
3. Reproduce navigation defects in a real browser, including exact starting URL, actions, expected vs actual result and screenshot/trace. If unreproducible, mark unconfirmed, do not invent a fix.
4. Create a small defect register with severity, cause hypothesis, confirmed root cause, impacted files and regression test ID.
5. Check working tree first. Never discard unrelated changes; no commits unless requested.

## 2.1 Navigation

Implement the policy in `NAVIGATION-CONTRACT.md` using the current router rather than introducing a second routing system. Ensure Next/Previous, last-card behavior, session-to-session navigation, paths/collections, deep links, Back/Forward, reload, keyboard and touch are coherent. Preserve unrelated query params only where existing routing contracts require them; do not create ambiguous card or seed parameters. Invalid IDs and malformed seeds must fail safely and predictably. A locale change should preserve equivalent content when possible.

Avoid state loops: URL is authoritative for _which card/seed is open_, in-memory state can cache derived view data, storage is authoritative for _completed/review history_ only. Use guarded hydration and schema validation. Completion requires explicit user action; no automatic completion on viewing final card. Maintain accessible focus and scroll positioning after navigation.

## 2.2 Visual polish

Audit spacing scale, content max width, min/max card layout, diagram overflow, code wrapping or horizontal scroll within code region, progress indicator, touch targets and focus outlines. Avoid fixed heights that clip content; preserve normal page scrolling. Diagram must be legible at 375/768/1024/1440 CSS px, in RU/EN and light/dark. Prefer existing design tokens; avoid global CSS regressions. Respect `prefers-reduced-motion`. Ensure swipe recognition does not hijack vertical scrolling, selection, code interaction or browser gestures.

## 2.3 Progress, browser QA, build

- Read and validate `study-flow:v1`; recover gracefully from invalid JSON, unknown IDs, stale versions and blocked storage without crashing. Keep backups/legacy keys untouched.
- Completion and confidence (`again`, `hard`, `good`, `easy`) remain distinct; review intervals 1/3/7/14 days follow current documented semantics. Verify due dates, recommendations and avoidance of immediate resurfacing of a freshly completed session unless legitimately due.
- Validate deterministic challenge generation: seed retained in URL, reload, locale switch and Back/Forward; oracle and tests remain stable.
- Add or update unit/integration and Playwright tests; screenshots for representative card types at each target width and theme. Check both locales, keyboard, touch, reduced motion, deep link, storage corruption.
- Investigate Chromium crash in PDF production step separately from UI defects. Diagnose browser installation, memory, sandbox, headless flags, lifecycle and timeout; fix actual cause if possible. Do not silently disable PDF output or mark build green by skipping work. Any approved exception must name the failing stage, reproduction, impact, workaround and follow-up.

## Deliverables

1. Audit and defect register (before/after), including unreproduced issues.
2. Minimal code fixes and regression tests mapped to defects.
3. Screenshot/trace evidence and exact browser/environment versions.
4. Build/test commands and pass/fail summary; failures cannot be reported as successes.
5. Known limitations, risks and proposed Phase 3 readiness decision.

## Acceptance gate

- User can open any of the four sessions, traverse cards, explicitly complete, navigate to another session/collection, Back/Forward and reload without losing selection, seed or progress.
- All critical navigation cases pass in a real browser; no unhandled runtime errors.
- No clipping/horizontal page overflow at 375/768/1024/1440; both locales and themes checked; keyboard, touch and reduced motion checked.
- Lint, typecheck, unit tests, E2E and production build pass, OR each remaining blocker is documented and explicitly accepted by the project owner. A failed run is not an accepted exception by default.
- Legacy routes and progress keys preserved; no bulk content migration.
