# Study Flow — status and future report

Audit date: 2026-11-22. **Checkpoint 1 complete; Checkpoint 2 BLOCKED.** This is an audit, not release acceptance or authorization to publish legacy snippets.

## Executive summary

The project builds and its existing tests pass except lint, but **Phase 2 Full migration is not complete**. Navigation stabilization and expansion to 44 sessions are separate milestones. Only 3/16 original topics and 2/15 original exercises have explicit session provenance; exercise `08` is partial. Seven shallow reference topics and the original learning-path editorial work remain unfinished.

Fresh supplemental browser checks also reproduced hydration errors, failure on a throwing storage getter, and stale persisted resume state after Back. These findings are not contradicted by 49 passing existing E2E tests: those tests do not assert these paths adequately.

The examples registry covers **26/26 text files, 93 fragments**, with exact-byte hashes and full non-overlapping line coverage. **11 filename/subject mappings differ from the supplied static report**. In this snapshot the event-loop candidate is `examples/async.js`, not `final.js`; the latter is masonry. No examples were executed, imported, published, renamed or committed.

**Decision:** stop before the pilot. Resolve acceptance scope, runtime/provenance defects and source publication clearance first. Keep Study Flow in the portfolio for now; extraction is analysis only.

## Snapshot and evidence boundaries

- Branch `main`; HEAD `a8f912dfc4d32d85ec56ac9d14b070847d7457e2`.
- Initially dirty: user-modified `README.md`; untracked `docs/STUDY_FLOW_EXAMPLES_REPORT.md`, `examples/`, `study-flow-next/`. New audit documents are also untracked. HEAD alone cannot identify these inputs.
- Environment: macOS ARM64, Node `v24.16.0`, npm `11.13.0`, installed Playwright `1.64.1`, measured Chromium `156.0.8078.4`. CI uses Node 22; it was not rerun remotely.
- `git ls-files examples` returns no paths. Registry records 26 text files plus ignored `.DS_Store` separately.
- No production code, canonical content, URLs, storage keys, dependencies or résumé facts changed. README's current problem count was corrected without removing the user's existing report link. Decisions/QA only gain dated audit entries.
- No failing-then-passing implementation tests: this checkpoint intentionally implements no behavior. Existing failures were retained rather than hidden with ignores or test skips.

Evidence documents:

1. [Architecture and source coverage](architecture-audit.md): exact source references, complete original topic/exercise/path/note tables, navigation trace, dependency map, options A–D.
2. [Legacy fragment registry](legacy-examples-registry.md): all 26 hashes and 93 source→canonical dispositions, runtime/contract uncertainty, reflection and publication boundaries.
3. [Supplemental browser audit](browser-audit.md): reproducible standalone command, 64-case matrix, runtime errors and isolated persistence probes.

## Phase 2 acceptance checklist

| Requirement                                                                       | Result                                                | Evidence / limitation                                                                                                                                        |
| --------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| All 16 original topics migrated or explicitly approved for exclusion              | **FAIL**                                              | Only 3 explicitly linked; no approved exclusions for the other 13. Links alone do not certify lossless migration.                                            |
| All 15 original exercises split into coherent session chains                      | **FAIL**                                              | `01` has a dedicated prediction slice; `08` partial; 13 reference-only.                                                                                      |
| Full original references retained                                                 | **PASS for inventory/routes**                         | 16 original topics, 15 exercises, six paths and nine notes remain; exhaustive semantic losslessness is not certified.                                        |
| Seven shallow references deepened                                                 | **FAIL**                                              | Compact factory still reuses summary/generic text; richer new tracks do not rewrite these sources.                                                           |
| Editorial original learning paths                                                 | **FAIL**                                              | Six retained reference paths lack session sequences; five titles remain mechanically generated.                                                              |
| Session structure, duration arithmetic, relations                                 | **PASS automated**                                    | 44 sessions, 4–8 cards, 15–20 minutes, card sum + one minute; existing 17 Study Flow unit tests pass. Real learner timing not tested.                        |
| RU/EN content                                                                     | **PASS structural / NOT TESTED exhaustive editorial** | Shared IDs and required localized fields; browser checks in both locales. Nonempty strings do not prove teaching parity.                                     |
| Source-ID resolution enforcement                                                  | **FAIL**                                              | Unresolved `algorithm-pattern-hash-map-set`; catalog accepts arbitrary provenance strings.                                                                   |
| Direct links, keyboard, explicit completion, locale, seed replay, synthetic swipe | **PASS existing cases**                               | Five Study Flow E2E cases pass; full suite 49/49. Physical touch and all gesture guard branches not tested.                                                  |
| Clean deep-link hydration                                                         | **FAIL**                                              | 64 React #418 events in supplementary matrix; root cause not isolated.                                                                                       |
| History and persisted resume agree                                                | **FAIL**                                              | Back restores visible card, but bare-route resume returns to stale stored card.                                                                              |
| Disabled-storage resilience                                                       | **FAIL**                                              | Throwing `window.localStorage` getter yields empty body under fault injection.                                                                               |
| Corrupt/newer progress and migration recovery                                     | **CONDITIONAL**                                       | Existing tests exercise some fallback/migration; source audit identifies destructive fallback/version gaps. No destructive user-data migration attempted.    |
| Target viewport/theme/locale layout                                               | **PASS representative matrix**                        | 64 checks at 375/768/1024/1440, RU/EN, light/dark, reduced motion; four selected code/diagram cards. Not every card.                                         |
| Accessibility / reduced motion / print                                            | **PARTIAL**                                           | Existing axe and keyboard cases pass; preference asserted in matrix. Screen reader, exhaustive contrast/animation and Study Flow print review not performed. |
| Quality gates all green                                                           | **FAIL**                                              | Lint: 41 errors in legacy examples. Format/typecheck/unit pass; build and E2E pass outside sandbox.                                                          |
| GitHub Pages live deployment and non-root base                                    | **NOT TESTED this checkpoint**                        | Local root-base production server/deep links pass; source and existing tests support base paths, but no fresh `/career/` build or live deployment.           |

## Canonical inventory and migration coverage

| Entity                        | Verified inventory                                                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sessions                      | **44 = 4 core + 6 AI + 16 Senior + 18 algorithm-pattern sessions**                                                                                  |
| Cards / structured diagrams   | **244 / 43**; ordered-step diagrams with textual alternatives                                                                                       |
| Categories                    | browser 3; react 1; ai-engineering 6; web-fundamentals 3; postgresql 4; backend-architecture 4; performance 2; behavioral 2; rails 1; algorithms 18 |
| Preparation topics            | **38 = 16 original + 22 AI**                                                                                                                        |
| Full exercises                | **19 = 15 original + 4 AI**, IDs `01`–`19`                                                                                                          |
| Paths / notes                 | **8 / 9**; six original paths retained as references                                                                                                |
| Patterns / unique problem IDs | **18 / 32**; README's previous 30 was stale, dated decisions remain historical                                                                      |
| Runtime generator             | `event-loop-order`, generator version 1; finite deterministic variants, not arbitrary-code execution                                                |
| Progress                      | `study-flow:v1`, schemaVersion 1; legacy `interview-lab-progress-v1` and `interview-lab-progress-v2` preserved                                      |

All 44 session IDs, source topic IDs, path IDs, note slugs, route families and aliases are enumerated in [the architecture audit](architecture-audit.md). The 32 algorithm problem IDs are:

`two-sum`, `contains-duplicate`, `group-anagrams`, `valid-palindrome`, `three-sum`, `container-with-most-water`, `longest-substring-without-repeating`, `minimum-window-substring`, `subarray-sum-equals-k`, `binary-search`, `search-rotated-array`, `valid-parentheses`, `daily-temperatures`, `merge-intervals`, `insert-interval`, `number-of-islands`, `binary-tree-level-order`, `course-schedule`, `kth-largest`, `top-k-frequent`, `jump-game`, `house-robber`, `coin-change`, `subsets`, `combination-sum`, `network-delay-time`, `connected-components`, `implement-trie`, `lru-cache`, `longest-increasing-subsequence`, `single-number`, `minimum-spanning-tree`.

| Original source set | Coverage conclusion                                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16 topics           | `browser-event-loop` → mechanics/prediction; `browser-rendering-pipeline` → critical path; `react-fiber` → render/commit. Remaining 13 reference-only by explicit provenance. |
| 15 exercises        | `01` → prediction; `08` → HashMap/Set partial overlap, not a generic groupBy/indexBy implementation chain. Remaining 13 reference-only.                                       |
| Six paths           | All retained, none has a flow `sessionIds` sequence.                                                                                                                          |
| Nine notes          | All retained and adapted into topics; Event Loop/Fiber linked, seven reference-only. These are not nine extra independent topics.                                             |

**Migration impact of this audit: none.** No session/card/problem/source IDs changed, no versions bumped, no storage rewrite, no redirect changes. Existing legacy migration maps only exercise `01`/its slug to prediction; untouched legacy exercises retain their existing progress store.

### Legacy integration disposition

93 fragments: **24 enrich + 32 new-objective candidates + 18 debug = 74 candidate fragments; 17 deferred + 2 excluded = 19 non-candidates**. This is proposed editorial coverage, not 74 published fragments or 32 new sessions. Every fragment still lacks publication clearance; zero verified executable oracles. Ignored machine metadata is excluded separately.

Corrected pilot mapping: F04 (`async.js`) → `browser-event-loop-prediction`; F05 (`conntext.js`) with selected F06 (`contexts.js`) and F01 (`acync.js`) → proposed `this` foundation; F26 (`yandex5.js`) → existing `algorithm-hash-map-set` / `group-anagrams`. Do not implement by the stale filenames in the supplied plan.

Reflection concerns receiver/environment distinctions, timer registration versus source order, coercion/output shapes, prototype keys, mutation, edge cases and incomplete contracts. The registry distinguishes snippet evidence from learning hypotheses; none diagnoses the author's current skill.

## Ranked defects and ownership

No P0 incident established. Priorities are suggested remediation order, not invented production impact metrics.

| Priority     | Finding                                                                               | Owner / next action                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1           | Full migration incomplete                                                             | Content owner: accept source-by-source migration/exclusion matrix; deepen seven references and migrate bounded chains.                                                 |
| P1           | Blank page with throwing storage getter                                               | UI/storage owner: acquire storage inside guarded adapter; regression-test getter denial as well as method failures.                                                    |
| P1           | Deep-link hydration errors                                                            | Rendering owner: isolate SSR/client first-render divergence; assert no page errors for non-default card/seed/mode and saved progress. Do not suppress error reporting. |
| P1           | Unresolved source provenance accepted                                                 | Content/schema owner: decide typed topic/exercise/pattern source model and add negative resolution tests.                                                              |
| P1 gate      | Full lint fails on untracked examples                                                 | Repository owner: decide private archive/quarantine policy separately; do not rewrite historical examples or silently ignore failures to claim green.                  |
| P1 editorial | Unknown publication rights and 11 stale filename mappings                             | Owner/editor: confirm source identities and per-fragment clearance before pilot. Filename labels do not establish employer origin.                                     |
| P2           | History-to-resume mismatch; initial visit not persisted                               | Navigation owner: define visible-visit semantics and test Back → bare URL.                                                                                             |
| P2           | Recovery/version handling; absent import/export/reset UI; incomplete scheduler policy | Progress owner: protect unknown/newer payloads, define recovery and transfer, separate resume from recommendation.                                                     |
| P2           | Algorithm contracts and oracle coverage too generic                                   | Content owner: specific bilingual contracts and adversarial executable fixtures before reusing as pilot oracles.                                                       |
| P2           | Session SEO fallback and broad route→catalog import                                   | Build owner: derive learning metadata; consider lightweight route manifest when authorized. Main client chunk measured 635.26 kB / gzip 196.99 kB.                     |
| P2           | PDF font readiness timeout swallowed                                                  | Build owner: assess explicit failure/diagnostic policy; current structural PDF checks do not prove typography.                                                         |

## Dependency map and future options

```text
Portfolio App / locale / routes / global styles
  -> Study Flow UI -> content + algorithm catalog + progress/navigation/challenge
  -> full references -> notes + exercises + AI/Senior data
  -> Evolution -> resume graph adapter -> vendored brnchly core/react
Shared build/CI -> SSR + static deep links + SEO + mandatory resume PDFs -> Pages
```

There is no identified Study Flow→brnchly dependency. brnchly is a pinned **build-time package integration**, not a remote microfrontend. Shared routing currently imports the full session catalog; UI lazy loading does not establish a clean content boundary.

| Option                                       | Benefit / cost / migration hazard                                                                                                                                                                            | Effort assumption and reversibility                                                                                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A: retain portfolio**                      | Least disruption; same URLs, storage origin and host locale/styles. PDF/Chromium and shared release coupling remain.                                                                                         | 1–3 engineer-days for a small seam/metadata checkpoint, not migration completion; highly reversible. **Recommended now.**                                |
| **B: package/workspace, same host**          | brnchly-like reusable exports; host adapters for routes/locale/storage/theme. Must untangle references, CSS and SSR; host PDF gate remains.                                                                  | 1–2 engineer-weeks, one familiar engineer, no bulk content migration; reversible if URL/key contracts stay fixed. Choose for real reuse/ownership needs. |
| **C: separate static app, link integration** | Independent release and learning metadata; separate shell/CI/reference ownership. Preserve old deep links and decide same-origin versus cross-origin transfer.                                               | 2–4 engineer-weeks under static-app assumptions; medium reversibility, retain compatibility routes and rollback.                                         |
| **D: separately deployed federation**        | Independent remote releases embedded in host, but remote availability/cache skew, React compatibility, routing/style/CSP contracts and fallback add operational cost. Pages serves files, not orchestration. | 4–8+ engineer-weeks; least reversible without local fallback. No demonstrated requirement justifies it.                                                  |

Bands are planning estimates, not delivery commitments; exclude editorial backlog and may grow with runtime findings. Full option evidence and assumptions are in the architecture audit. Repository extraction and deployment separation solve different problems. localStorage is origin-scoped, not path-scoped: a new origin requires consented transfer/import; same-origin copies can collide on the existing key. Federation executing in the host uses host-origin storage, unlike an iframe model.

## Next increments and stop/go gates

1. **Reliability/provenance checkpoint:** test-first fixes for hydration, guarded storage acquisition, visit/resume semantics and source-resolution contract. Decide raw archive placement without executing or publishing it. Go only with regression tests, clean runtime evidence and an honestly green full gate in the intended repository layout.
2. **Migration acceptance checkpoint:** owner approves the original-source matrix, reference depth and editorial paths; migrate one coherent chain at a time, preserving full references and progress. Stop calling Phase 2 complete until its full-migration criteria are met or explicitly revised by the owner.
3. **Bounded pilot decision:** only after acceptance and publication clearance, approve corrected fragment identities, runtime/Unicode contracts and foundational JS/TS taxonomy. Then use independent failing→passing oracles for Event Loop, `this` and group-anagrams; defer any uncleared fragment. No extraction implementation in these increments.

Questions for the owner:

- Does the acceptance gate mean original **Phase 2 Full migration**, or a deliberately narrower navigation/reliability checkpoint? The current handoff does not authorize silently substituting one for the other.
- May selected snippets be published, and who owns their rights? Confirm corrected filename identities and neutral attribution.
- For strings, what alphabet/normalization/case/grapheme and output-order policy is intended? Where should foundational JS/TS fit?
- Is extraction wanted for reuse, ownership, independent releases or a standalone product? Which origin and old-link policy would apply?
- What specific résumé/portfolio corrections are wanted? None have been supplied; no career content was changed.

## Test appendix — fresh results

Commands executed from repository root, 2026-11-22:

| Command                                         | Exit / actual result                                                                                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`                          | **0**, tracked files only; script uses `git ls-files`, so untracked audit documents require a separate explicit Prettier check.                                              |
| `npm run lint`                                  | **1**, 41 errors, all reported under `examples/`; includes unused variables, intentional sparse/coercion demonstrations and parse errors. No excludes or source fixes added. |
| `npm run typecheck`                             | **0**.                                                                                                                                                                       |
| `npm test`                                      | **0**, 104 tests in 14 files, including 17 Study Flow tests. Does not execute the legacy snippets.                                                                           |
| `npm run build` (sandbox)                       | **1**, `browser.newPage: Target page, context or browser has been closed` after Vite output. Not a successful build.                                                         |
| `npm run build` (approved outside sandbox)      | **0**, static pages, SEO and both mandatory PDFs generated. No stage skipped.                                                                                                |
| `npm run test:e2e` (outside sandbox)            | **0**, 49/49 tests, 17.8 seconds, two workers. Includes five Study Flow tests.                                                                                               |
| `node playwright-report/checkpoint-1/audit.mjs` | **0 collection completed**, 64/64 layout assertions; **runtime findings remain failures**, not a clean browser acceptance pass. See browser audit.                           |
| Metadata-only Python verification               | **0**, 26 exact-byte hashes/sizes/line counts match; 93 unique fragment ranges partition every text line without gaps/overlaps. No snippet execution.                        |

Final documentation validation: explicit `npx prettier --check` on README, decisions, QA and all four audit documents passed (exit 0), as did `git --no-pager diff --check` (exit 0). Format/typecheck/unit gates were rerun after documentation edits and passed; lint still reported the same 41 legacy-example errors. Logs `playwright-report/checkpoint-1/gate-0.log` through `gate-5.log` correspond respectively to tracked formatting, lint, typecheck, unit, explicit document formatting and diff whitespace checks. Documentation review corrected missing AI/path ID enumeration, route-table formatting and prediction-card identifiers; no behavior mutation test applies to this documentation-only change.

Build warnings remain: Zod annotation placement and >500 kB client chunk. No dependency changes attempted. `npm run validate` as a whole is **not green** because lint fails.

Artifacts (local/ignored, not committed): `playwright-report/index.html`; four existing-suite attachments in `playwright-report/data/`; `playwright-report/checkpoint-1/results.json`, `server.log`, `audit.mjs` and 66 screenshots. Example screenshots: `375-ru-light-generated.png`, `375-en-dark-phases.png`, `throwing-getter.png`, `history-back.png`. The 768 EN/light Event Loop and 1024 RU/light rendering screenshots from the full suite were visually inspected as well. No trace was retained by the passing E2E suite; the supplemental script records JSON/errors/screenshots, not Playwright traces. Artifacts can be overwritten by a later run; preserve externally if needed for review.

Both generated PDFs pass build structural validation and existing download checks. **No fresh visual PDF pagination review**, physical-device test, exhaustive screen-reader/translation review, alternate-browser run, live deployment check or performance benchmark was performed. Screenshots are evidence, not approved visual-regression baselines.
