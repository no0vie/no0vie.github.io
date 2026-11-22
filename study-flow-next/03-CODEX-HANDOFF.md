# Codex execution prompt — Study Flow

Read `01-REFLECTION-AND-INTEGRATION.md` and the completed audit in `docs/study-flow/STATUS-AND-FUTURE-REPORT.md` (paths from the repository root), including its architecture, browser and legacy-registry appendices, plus the existing `.agents/skills/study-flow-content/SKILL.md`, `SPEC.md`, `STUDY_FLOW_SPEC.md`, `docs/DECISIONS.md` and relevant current source. Treat the attached `STUDY_FLOW_EXAMPLES_REPORT.md` as an audit hypothesis and evidence map, not an executable oracle.

**Execute in two checkpoints.**

Checkpoint 1 (completed 2026-11-22): current status, all 26 examples/93 fragments, quality gates, browser findings and extraction options are documented in `docs/study-flow/STATUS-AND-FUTURE-REPORT.md` and its appendices. The completed audit request was removed after consolidation. Do not rerun this as a new implementation phase or assume Phase 2 is complete. Revalidate evidence when source/environment changes; unresolved runtime defects and untested acceptance checks remain open.

Checkpoint 2 (only if Phase 2 is accepted and the pilot scope/publication policy are clear): implement the bounded Event Loop, `this`, and group-anagrams pilot test-first. Preserve URLs, stable IDs, progress and RU/EN parity. Never import raw examples into the browser runtime. If editorial or licensing questions block one pilot, mark it deferred and complete only safe work. No bulk content migration.

Deliver: changed files, source→canonical mapping, factual reflection on historical mistakes without diagnosing the author's current skill, migration coverage, failing-then-passing tests, actual commands/results, browser screenshots, unresolved questions, and a recommendation for the next increment. Do not commit or deploy without permission.
