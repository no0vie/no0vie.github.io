---
name: study-flow-content
description: Adds, splits, or reorganizes bilingual Study Flow sessions, source provenance, concept relations, deterministic challenges, and progress migrations in this portfolio. Use for interview preparation content changes or mock-interview findings.
---

# Study Flow content workflow

1. Read `STUDY_FLOW_SPEC.md`, `src/content/study-flow.ts`, canonical source content, and `SOURCE_AUDIT.json`. Treat the JSON as inventory only; derive claims and solutions from canonical source files.
2. Inventory source topic/exercise IDs, current sessions, durations, prerequisites, related links, concepts, generators, and localStorage versions. Report source coverage before editing.
3. Decide whether new input should enrich an existing card/session, split an overloaded session, or create a session. One session has one objective, 4–8 cards, and 15–20 total minutes including one reflection/navigation minute.
4. Preserve stable session/card/source IDs. If an ID or version must change, add an explicit migration map and keep old deep links compatible. Never erase progress merely because content was reordered.
5. Keep RU/EN IDs, concepts, diagrams, assessments, and meaning in parity. Edit each locale naturally; do not publish empty fallback text.
6. Preserve full original conditions, hints, verified solution, explanation, and sources in the reference layer. Split long exercises into independently useful contract, algorithm, implementation, tests, and review sessions rather than truncating them.
7. Add prerequisites only for real dependencies. Validate every prerequisite/related/source link, reject cycles in prerequisites, and update source-ID → session-ID coverage.
8. Add diagrams for timing, state, flow, and architecture only when they answer a learning question. Store structured steps plus a textual alternative; verify order, labels, print, theme, and both locales.
9. For suitable coding practice, implement a declarative deterministic generator with stable template/generator versions, seed replay, validator/oracle, hints, explanation, and a bounded variant space. Prefer a reviewed variant bank if solvability cannot be guaranteed. Never execute arbitrary learner code or call an LLM/API at runtime.
10. Use TDD. Add failing tests for schema/duration/relations, migration, ranking, and generator reproducibility/validity across at least 100 seeds before implementation. Add E2E coverage for direct links, keyboard/swipe, reload, explicit completion, themes/mobile, and accessibility when UI changes.
11. Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and relevant Playwright tests. Report exact results and any environment limitation.
12. Report added/split/moved sessions, duration sums, source migration map, generator seeds/examples, uncovered topics, unresolved factual gaps, and next independent PRs. Never describe a Phase 1 vertical slice as full migration.
