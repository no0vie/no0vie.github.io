# Study Flow — Phase 3A: Reflection & Legacy Examples Integration

Status: proposed specification, not implementation. Source: STUDY_FLOW_EXAMPLES_REPORT.md (2026-11-22). No source examples or repository code were independently executed in preparing this specification.

## Goal
Turn the 26 legacy `examples/` files into a curated, tested knowledge asset without importing raw files into the client bundle, duplicating canonical topics, or invalidating progress. First reflect on what each fragment reveals about knowledge gaps and common mistakes; only then integrate selected fragments.

## Hard constraints
- Phase 2 is **unverified** until fresh checks and browser evidence are produced. Do not presume completion.
- Preserve stable session/card/problem IDs, `/ru|en/interview/...` deep links, `study-flow:v1`, and legacy progress keys.
- No wholesale content migration, automatic publication, untrusted code execution, `eval`, external API/LLM calls in study runtime, or corporate attribution inferred from filenames.
- Keep full reference material separate from short 15–20 minute sessions. RU/EN semantic parity required.
- Do not silently correct ambiguous problem statements. Record uncertainty and exclude pending editorial decision.

## Stage A — Inventory, provenance and reflection (no production code changes)
1. Capture repository commit SHA, clean/dirty state, current branch, source hashes for all 26 files, and confirm whether `examples/` remains untracked. Never add the raw folder to the public bundle by default.
2. Split mixed files into atomic *fragments*, each with one learning objective; create `docs/study-flow/legacy-examples-registry.md` (or JSON/TS registry only if truly needed).
3. For each fragment record: `sourceId`, path, line range, SHA256, observed behavior, inferred vs explicit statement, runtime (`browser classic/sloppy`, ESM, Node CJS/ESM, TypeScript), status (verified / buggy / incomplete), target canonical topic/session/problem, integration action (enrich/new/debug/defer/exclude), risk and publication clearance.
4. Reflect on mistakes as learning signals, not judgments about the author: misunderstanding of `this`, microtask scheduling, coercion, hash-map prototype keys, mutation, edge cases, type-level vs runtime semantics, complexity and problem-contract ambiguity. Label each reflection as **evidence from snippet**, **hypothesis**, or **verified by tests**. Do not infer the user's current skill from old code.
5. Reconcile inventory: every one of the 26 files has a disposition; mixed files have fragment-level decisions. Report covered vs deferred fragments, not merely file counts.

## Stage B — Limited pilot, test-first
Pilot 1: `final.js` → enrich `browser-event-loop-prediction`. Confirm timer/microtask oracle in an explicit browser environment; retain stable IDs and session duration.

Pilot 2: `async.js`, `contexts.js`, and selected `acync.js` → new JS `this` and execution-context foundation, with browser classic/sloppy vs ESM clearly separated; isolate throwing examples; manually verified variant bank.

Pilot 3: `yandex5.js` → existing `algorithm-hash-map-set` / `group-anagrams`; present broken code as debugging exercise only. Cover `split()` misuse, safe map keys, duplicates, output ordering and agreed Unicode policy. Do not create a duplicate problem ID.

For each pilot: write a contract first (inputs, outputs, constraints, runtime, mutation, ordering, errors, complexity), create failing oracle/unit tests, implement reference and challenge, add RU/EN explanations/hints/rubric, test navigation and persistence. Reuse existing structured diagrams and existing challenge renderer; if a feature requires schema expansion, document and scope it before coding.

## Stage C — Curated backlog
- JS foundations: `types.js` coercion, `conntext.js` iterable/iterator, `arrays.js` sparse arrays and APIs, `yandex1.js` compose/curry.
- TS foundations: `mts.ts` generic indexed access, mapped types, union/intersection; use `tsc` negative type tests.
- Async: `yandex3.js`, `yandex4.js` Promise errors, allSettled and retry with fake transport/timers.
- Algorithms: `scopes.js` bracket generation, `trees.js` DFS orders, `doubles.js` median, `numbers.js` streak, `test.js` palindrome, `yandex3.js` RLE, `sorts.js` tradeoffs.
- Deferred: `generators.js` masonry DOM case, `way.js` unknown path problem, incomplete HTTP/CSS notes. Restore contracts before scheduling.

## Known hazards to test explicitly
- `final.js` conflicting comments; browser prediction from report: `1 7 3 5 2 6 4`, independently validate.
- `yandex1.js` conflicting `sum` declarations, mutable `reverse()` in compose, prototype-key hazards.
- `yandex3.js` incorrect closure comments and broken RLE.
- `yandex4.js` incomplete references, intervals and HTTP `fetch` status/retry semantics.
- `mts.ts` intended negative cases vs actual compiler errors; `K extends keyof T` and `T[K]`.
- Node CommonJS snippets in ESM project; never treat module-loader mismatch as algorithm failure.

## Acceptance
- Registry covers 26/26 files and atomic fragments, each with action and rationale; provenance hashes captured.
- Pilot has three independently reviewed objectives; no broken snippet presented as oracle.
- All included algorithms have boundary and adversarial tests; JS predictions state environment; TS examples have positive and negative compiler tests.
- New content meets current 4–8 cards and duration rule (card times + 1 minute), meaningful RU/EN parity, working references and prerequisites without cycles.
- Old deep links and progress preserved; content-version migration map supplied for any split or ID change.
- Baseline and final results: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, relevant Playwright and visual checks; failures documented, never labeled passed.
- Final report lists changes, test evidence, excluded/deferred material, editorial questions and migration coverage. No commit without explicit authorization.

## Editorial decisions before publication
Permission to publish source fragments; treatment of presumed company labels; string Unicode policy; taxonomy for foundational JS/TS; reference vs typed provenance registry. Defer uncertain fragments instead of blocking the safe pilot.
