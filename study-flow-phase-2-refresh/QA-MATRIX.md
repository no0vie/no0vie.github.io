# Phase 2 — QA matrix and evidence

## Test axes
- Viewport widths: **375, 768, 1024, 1440 CSS px** (record heights and device scale factor).
- Locales: **RU, EN**; themes: **light, dark**.
- Input: mouse, keyboard, touch emulation; motion: normal and `prefers-reduced-motion`.
- Content: Event Loop explanation, seeded challenge, browser rendering diagram, Fiber diagram, long text/code and self-check.

Use a **representative pairwise matrix** for visual screenshots rather than blindly generating every combination; run core navigation assertions across locales and major viewports. At minimum take screenshots of each card type at 375 and 1440, both themes, and one 768/1024 run; inspect RU/EN text expansion. Record coverage explicitly.

## Functional cases
| ID | Test | Expected |
| --- | --- | --- |
| N01 | Next then Previous | Exact prior card, no progress loss |
| N02 | First/last card boundary | No invalid route, explicit completion |
| N03 | Next session | Correct session and selected starting card |
| N04 | Collection/path link | Correct route and browser return |
| N05 | Back twice, Forward twice | URL and visible card stay synchronized |
| N06 | Reload on nonfirst card | Same card, seed and review state |
| N07 | Direct link with valid card/seed | Identical challenge and oracle |
| N08 | Unknown card/session | Recoverable fallback, no blank page |
| N09 | Bad/oversized seed | Validated safe canonical state |
| N10 | Switch RU↔EN | Same logical session/card/seed |
| N11 | Complete and revisit | Completion persists; no accidental duplicate event |
| N12 | Swipe on card, vertical scroll in long text | Horizontal swipe navigates; vertical scroll does not |
| N13 | Keyboard shortcuts with input focus | No accidental card change |
| N14 | Storage card differs from URL | URL selection wins |
| N15 | Repeated rerenders | No duplicate history entries |
| P01 | Malformed storage JSON | UI loads without crash |
| P02 | Unknown/stale storage IDs | Valid data retained, invalid entries handled |
| P03 | Storage blocked/quota exceeded | Nonfatal fallback |
| P04 | Legacy progress keys present | No deletion or destructive rewrite |
| P05 | Confidence levels/review intervals | Existing 1/3/7/14-day semantics maintained |
| P06 | Completed session recommendation | Not immediately recommended without due reason |
| C01 | Same seed across reload/locale/history | Same generated variant and oracle |
| C02 | Generator edge seeds | Deterministic, valid, tested outputs |
| V01 | No page overflow or clipped content | All target widths pass |
| V02 | Diagrams and code legible | Scroll contained where needed |
| V03 | Contrast, focus, targets | Accessible light/dark and keyboard |
| V04 | Reduced motion | No essential meaning depends on animation |
| B01 | Production build and PDF stage | Success or separately approved documented blocker |
| B02 | Playwright run | Stable, repeatable browser tests |

## Evidence protocol
For each defect record: ID, severity, route, viewport, locale/theme, starting storage/seed, steps, expected/actual, console errors, screenshot/trace, root cause, fix commit or file diff, regression test. Capture *before* and *after* where possible. Redact private data from screenshots/logs.

Run and report: `npm run lint`, `npm run typecheck`, `npm test`, the actual repository's Playwright command, and the actual production build command (discover scripts in `package.json`, do not assume names). Separate app-build errors from PDF generator failures. Include command, duration, exit code, environment and log excerpt. A skipped test must be labeled skipped.

## Final signoff checklist
- [ ] 2.0 baseline and reproduced defects attached
- [ ] N01–N15 verified
- [ ] P01–P06 and C01–C02 verified
- [ ] V01–V04 visually inspected
- [ ] B01–B02 passed or owner-approved exception documented
- [ ] RU/EN, themes and target widths covered
- [ ] Legacy routes and keys unchanged
- [ ] No unrelated refactors or mass content additions
- [ ] Known limitations and Phase 3 readiness recorded
