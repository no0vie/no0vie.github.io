# Original-source migration acceptance matrix — planning only

Basis: [`architecture-audit.md`](../architecture-audit.md#original-source-coverage-16-topics--15-exercises--6-paths--9-notes) (2026-11-22), [`STUDY_FLOW_SPEC.md`](../../../STUDY_FLOW_SPEC.md) §§7–8. Current target IDs below are audit mappings, **not acceptance** or proof of complete editorial transfer. All source IDs/references remain available; no exclusion is approved. Reviewer: **content owner/editor TBD** for every row; evidence needed: compare full original against bilingual reference, cards and self-check; confirm conditions/hints/solution, source links, 15–20-minute session fit and learner timing. Status `slice` = explicit instructional slice only; `partial` = overlap without complete practice chain; `reference` = canonical full reference retained, not formally migrated. Decisions proposed, not executed.

## 16 original topics

| Original ID                  | Current flow target / status                                           | Proposed decision / acceptance gap                                |
| ---------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `url-navigation`             | none; reference                                                        | migrate; request lifecycle overlap is not provenance              |
| `browser-event-loop`         | `browser-event-loop-mechanics`, `browser-event-loop-prediction`; slice | enrich; compare full topic and retained notes to cards            |
| `browser-rendering-pipeline` | `browser-rendering-critical-path`; slice, **shallow reference 1/7**    | enrich; mechanism, example, counterexample, production trade-offs |
| `virtual-dom`                | none; reference                                                        | migrate; complete React comparison                                |
| `react-fiber`                | `react-fiber-render-commit`; slice                                     | enrich; review losslessness and card pedagogy                     |
| `mobx-redux`                 | none; reference                                                        | migrate; source-backed comparison                                 |
| `react-batching-closures`    | none; reference, **shallow 2/7**                                       | enrich then migrate; mechanism/example/trade-offs                 |
| `react-memoization`          | none; reference, **shallow 3/7**                                       | enrich then migrate; mechanism/example/trade-offs                 |
| `mv-patterns`                | none; reference                                                        | migrate; preserve full notes                                      |
| `microfrontends-tradeoffs`   | none; reference                                                        | migrate; keep caveats and full notes                              |
| `frontend-performance`       | none; reference                                                        | migrate; new performance track is not explicit source coverage    |
| `playwright-flakiness`       | none; reference                                                        | migrate; preserve full notes                                      |
| `node-event-loop`            | none; reference, **shallow 4/7**                                       | enrich then migrate; distinguish host from browser                |
| `postgresql-concurrency`     | none; reference, **shallow 5/7**                                       | enrich then migrate; Senior transaction overlap not credited      |
| `idempotency`                | none; reference, **shallow 6/7**                                       | enrich then migrate; resilience overlap not credited              |
| `reliable-messaging`         | none; reference, **shallow 7/7**                                       | enrich then migrate; outbox overlap not credited                  |

Result from dated audit: **3/16 explicitly linked**; 13 reference-only. None certified lossless by link alone; seven shallow references still need separate editorial remediation. Verify again against current catalog before migration.

## 15 original exercises

For each exercise, acceptance requires a bounded contract → algorithm → implementation → tests → review sequence (possibly several sessions), retained original full prompt/hints/solution, RU/EN editorial and stable progress mapping. No exercise may be excluded without owner approval.

| ID / original objective    | Flow target / status                             | Proposed decision / gap                                                            |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `01` Event Loop            | `browser-event-loop-prediction`; dedicated slice | enrich; compare entire original                                                    |
| `02` Promise.all           | none; reference                                  | migrate chain                                                                      |
| `03` concurrency limiter   | none; reference                                  | migrate chain                                                                      |
| `04` debounce              | none; reference                                  | migrate chain                                                                      |
| `05` autocomplete races    | none; reference                                  | migrate chain                                                                      |
| `06` discriminated union   | none; reference                                  | migrate chain                                                                      |
| `07` polymorphic button    | none; reference                                  | migrate chain                                                                      |
| `08` groupBy/indexBy       | `algorithm-hash-map-set`; partial                | enrich full generic implementation/test/review chain; pattern link is insufficient |
| `09` memory leak           | none; reference                                  | migrate chain                                                                      |
| `10` 100k rendering        | none; reference                                  | migrate chain                                                                      |
| `11` reactive store        | none; reference                                  | migrate chain                                                                      |
| `12` rendering performance | none; reference                                  | migrate chain                                                                      |
| `13` security review       | none; reference                                  | migrate chain                                                                      |
| `14` resumable upload      | none; reference                                  | migrate chain                                                                      |
| `15` realtime messenger    | none; reference                                  | migrate chain                                                                      |

Result: **2/15 linked**, only `01` dedicated; `08` partial, 13 reference-only. New AI exercises `16`–`19` do not change this denominator.

## Six original paths

| Path ID                     | Current flow sequence | Proposed decision / gap                                                                                   |
| --------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `senior-javascript-browser` | none; reference       | enrich with reviewed session order and RU/EN editorial title                                              |
| `senior-react-frontend`     | none; reference       | enrich with reviewed session order and RU/EN editorial title                                              |
| `senior-node-backend`       | none; reference       | enrich with reviewed session order and RU/EN editorial title                                              |
| `senior-system-design`      | none; reference       | enrich with reviewed session order and RU/EN editorial title                                              |
| `senior-fullstack`          | none; reference       | enrich with reviewed session order and RU/EN editorial title                                              |
| `weak-spots`                | none; reference       | enrich personalized choice wording without claiming objective skill assessment; disclaimer already exists |

All six retained their reference topic/exercise orders, but have no `sessionIds`; five mechanically named titles need editing. AI/Senior new paths are not replacements. Reviewer approval and route/ID preservation required.

## Nine original notes (mapped to existing original topics, not nine extra topics)

| Note slug                             | Canonical topic / flow status         | Proposed decision / gap             |
| ------------------------------------- | ------------------------------------- | ----------------------------------- |
| `what-happens-after-entering-a-url`   | `url-navigation`; reference           | retain original and migrate topic   |
| `mvc-mvp-mvvm`                        | `mv-patterns`; reference              | retain original and migrate topic   |
| `virtual-dom-relevant-today`          | `virtual-dom`; reference              | retain original and migrate topic   |
| `javascript-event-loop`               | `browser-event-loop`; linked slice    | retain original; check completeness |
| `react-fiber-render-and-commit`       | `react-fiber`; linked slice           | retain original; check completeness |
| `mobx-vs-redux`                       | `mobx-redux`; reference               | retain original and migrate topic   |
| `microfrontends-when-not-to-use-them` | `microfrontends-tradeoffs`; reference | retain original and migrate topic   |
| `frontend-performance-diagnosis`      | `frontend-performance`; reference     | retain original and migrate topic   |
| `playwright-e2e-and-flaky-tests`      | `playwright-flakiness`; reference     | retain original and migrate topic   |

**Gate:** 9/9 notes retained; only two mapped topics have explicit slices. Content owner must attach per-row review evidence, target session IDs or approved exclusions, bilingual depth and preservation tests before declaring original-source migration complete. No edits to content were made here.
