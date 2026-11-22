# Unstaged-file cleanup disposition

Reviewed 2026-11-22 against the current application, fragment registry and checkpoint report. This is a cleanup inventory, not authorization to publish raw examples or a claim of Phase 2 completion.

## Removal list

| File                                         | Decision                                                                          | Preserved information                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `study-flow-next/02-PROJECT-STATUS-AUDIT.md` | Removed: completed one-off audit request, not an implemented application feature. | `STATUS-AND-FUTURE-REPORT.md` preserves the acceptance checklist, actual gates, risk register, next increments and open questions; `architecture-audit.md` preserves coverage, navigation/build dependencies and extraction options; `browser-audit.md` preserves browser findings and verification limits. Untested physical-device, exhaustive editorial/accessibility and deployment checks remain explicitly open. |

**Application-source integration removal list: empty.** No untracked example or remaining specification is proven fully integrated and safe to delete on that basis.

## Keep list

| Files                                                                                                                     | Reason                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modified `README.md`, `docs/DECISIONS.md`, `docs/QA.md`                                                                   | Maintained documentation, not disposable specs. Preserve the existing user changes and current audit updates.                                                                                                                                                             |
| `docs/study-flow/STATUS-AND-FUTURE-REPORT.md`, `architecture-audit.md`, `browser-audit.md`, `legacy-examples-registry.md` | Current evidence, source hashes/mappings and unresolved work; not duplicated application implementations.                                                                                                                                                                 |
| `docs/STUDY_FLOW_EXAMPLES_REPORT.md`                                                                                      | Original supplied audit input with 11 stale filename/subject mappings. Keep as historical input, not an oracle; corrected identities are in the registry. Its unique historical context is not sufficient grounds for automatic deletion.                                 |
| `study-flow-next/01-REFLECTION-AND-INTEGRATION.md`                                                                        | Only the inventory/reflection stage is completed. The bounded pilot and curated backlog are not implemented; publication clearance and acceptance gates remain unresolved.                                                                                                |
| `study-flow-next/03-CODEX-HANDOFF.md`                                                                                     | Partially completed handoff. Checkpoint 1 is documented; Checkpoint 2 remains blocked. Updated to reference completed reports rather than rerun the removed audit request.                                                                                                |
| `study-flow-next/README.md`                                                                                               | Index for the remaining unfinished handoff; updated to reflect the completed audit.                                                                                                                                                                                       |
| All 26 `examples/` text files listed below                                                                                | Not integrated. The registry proposes 74 candidate fragments and defers/excludes 19, but proposals and topical matches are not shipped, tested replacements. No raw source publication clearance. Do not delete the only local source material merely to make lint green. |

The 26 retained files are:

- `examples/acync.js`
- `examples/anagramms.js`
- `examples/arrays.js`
- `examples/async.js`
- `examples/conntext.js`
- `examples/contexts.js`
- `examples/doubles.js`
- `examples/final.js`
- `examples/generators.js`
- `examples/index.html`
- `examples/jewels.js`
- `examples/mergedArrays.js`
- `examples/mts.ts`
- `examples/numbers.js`
- `examples/scopes.js`
- `examples/sorts.js`
- `examples/structures.js`
- `examples/test.js`
- `examples/trees.js`
- `examples/types.js`
- `examples/way.js`
- `examples/yandex1.js`
- `examples/yandex2.js`
- `examples/yandex3.js`
- `examples/yandex4.js`
- `examples/yandex5.js`

Ignored `.DS_Store`, `dist/`, `test-results/`, `playwright-report/` and `node_modules/` are outside the unstaged source-file list. No generated artifacts, browser evidence or machine metadata were removed.

## Future deletion gate

Delete another specification only after its implemented requirements, remaining exceptions, stable-ID/progress implications, decisions and verification evidence have permanent homes. Delete a legacy source only after all its fragments have approved replacements or explicit exclusions and the owner has an appropriate archive/retention decision. Matching a topic name is not proof of integration. The partially implemented root `STUDY_FLOW_SPEC.md` remains active and was not modified or removed.
