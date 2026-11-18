# Codex task — implement Study Flow Phase 2

You are working in the existing portfolio repository. Read `README.md`, `PHASE-2-SPEC.md`, `NAVIGATION-CONTRACT.md`, `QA-MATRIX.md` from this directory, plus `.agents/skills/study-flow-content/SKILL.md` if present. Inspect the real repository before making assumptions. No new content migration in this phase.

## Execution order (do not skip)
1. **2.0 Audit:** inspect working tree, architecture and scripts; run baseline checks; reproduce real browser defects and save a defect register. Do not treat assumptions as findings. State any environment limitations.
2. **2.1 Navigation:** write failing regression tests for reproduced issues; implement minimal fixes to URL/history/deep-link/seed/locale/keyboard/touch behavior; rerun targeted tests.
3. **2.2 Visual:** use real browser at required viewports, themes and locales; fix verified layout defects, capture before/after evidence. Do not truncate long cards or block normal scrolling.
4. **2.3 QA:** validate persistence/migration and recommendation logic, run full unit/E2E/build. Investigate Chromium/PDF failure with evidence; never silently skip PDF generation to report a green build.
5. **Handoff:** prepare complete report with checklist IDs, remaining risks and explicit Phase 3 go/no-go recommendation.

## Constraints
- Preserve all stable session/card IDs and original routes; preserve old storage keys and user progress.
- Prefer existing router/design system; avoid dependencies unless justified.
- No speculative broad rewrites; keep changes reviewable.
- Do not commit unless instructed. Do not overwrite unrelated local modifications.
- If an issue cannot be reproduced, mark unconfirmed; explain attempted reproduction.
- If browser tooling fails, distinguish tooling failure from application defect and provide exact commands/logs.

## Required report template
```md
# Study Flow Phase 2 — Handoff
## Environment and working tree
## Phase 2.0 baseline (commands/results)
## Defect register (ID, repro, root cause, fix, test)
## Navigation policy implemented (deviations from contract)
## Visual changes (screenshots by viewport/locale/theme)
## Progress and challenge compatibility
## Test results (unit, lint, typecheck, E2E, build/PDF)
## Files changed
## Known issues / blocked checks / owner approvals required
## Phase 3 readiness: GO or NO-GO, with rationale
```

If owner approval is needed for a change to route semantics, storage format, existing content IDs, or a build exception, stop that specific change and present options; continue independent safe work.
