# Study Flow — next-step discussion

Status: Phase 2R implementation handoff. This document proposes decisions; it does not authorize publication, content migration, a legacy pilot or extraction.

## Current position

- Runtime recovery now has regressions for direct card/seed/mode hydration, no default-card reveal, guarded storage, non-destructive newer-schema handling, visible-visit resume, mode history and cross-session Back/Forward.
- Provenance validation distinguishes canonical topics, exercises, algorithm patterns and immutable legacy-fragment metadata. Build validation rejects unknown references, broken prerequisites and cycles.
- Root and `/career/` builds generated static pages and both PDFs outside the sandbox. The final full root E2E suite passed 62/62; targeted `/career/` checks passed 42/42; the final focused Study Flow suite passed 18/18.
- Original migration remains incomplete: 3/16 original topics and 2/15 original exercises have explicit links, with exercise `08` partial. Seven canonical references remain shallow.
- The untracked `examples/` directory remains private and untouched. Repository-wide lint fails on 41 historical example errors until an archive/CI boundary is approved. The tracked format gate also has a pre-existing failure in `study-flow-next/01-REFLECTION-AND-INTEGRATION.md`.

## Decisions requested from the owner

### 1. Archive and lint boundary for `examples/`

**Recommended:** keep raw examples outside the public repository in an access-controlled, immutable archive; retain only hashes, fragment IDs and editorial derivatives in this repository. Once archived and rights-reviewed, approve a narrowly scoped ESLint boundary that does not imply the source passed lint.

Please decide:

1. Where the durable private archive will live and who can access it.
2. Retention/backup policy and immutable snapshot identifier.
3. Whether `examples/` should remain local-only, move to a private fixture repository, or be removed from this worktree after verified backup.
4. Whether a scoped lint exclusion is acceptable after the archive boundary is established.

### 2. Publication and derivative rights

**Recommended:** no raw fragment publication. Approve editorial derivatives fragment by fragment only after confidentiality and ownership review. Filenames, comments and corporate context are not publication clearance.

The proposed pilot candidates remain F04 (`async.js`) for Event Loop; F05 with selected F06/F01 for `this`; and F26 (`yandex5.js`) for group-anagrams. Rehash before use and define each exercise contract and independent oracle first.

### 3. Next product milestone

Choose one:

- **A — Complete R3 release evidence first (recommended).** Close tracked formatting, archive/lint policy, PDF visual/text/link review, complete storage-fault cases and remaining history boundaries. This gives a clean release baseline before content changes.
- **B — Begin original-source migration after archive approval.** Use `MIGRATION-ACCEPTANCE-MATRIX.md`; migrate in small source-backed slices with RU/EN review and stable IDs. Start with existing partial coverage rather than adding unrelated tracks.
- **C — Run the legacy pilot after rights approval.** Keep this independent from mass migration. The pilot should prove fragment identity, editorial transformation and oracle quality, not merely add source links.
- **D — Modularize.** Not recommended now. Retain option A (portfolio-hosted Study Flow); consider a same-host package only after a second consumer or independent ownership/release need exists.

## Recommended sequence

1. Approve the private archive, publication-rights policy and scoped lint boundary.
2. Finish R3 evidence and restore all repository gates to green; record any exception with owner, risk and expiry.
3. Review and approve the source migration matrix, reviewers and acceptance rubric.
4. Migrate one complete source chain—prefer Event Loop or exercise `08`—including the canonical reference, cards, assessment and progress compatibility.
5. Review that slice before scaling migration.
6. Consider the legacy pilot only after rights clearance and independent oracle review.
7. Revisit modularization only when there is a concrete second consumer or release-ownership requirement.

## Discussion questions

1. Do you approve the recommended private archive model, and what archive location should be used?
2. May editorial derivatives of any legacy fragments be published, or should all legacy material remain private reference input?
3. Should the next implementation target be R3 closure, one original-source migration slice, or the legacy pilot?
4. Who will approve RU/EN editorial parity and source completeness for migration rows?
5. Should the unrelated tracked format failure be fixed in the next cleanup change, or is `study-flow-next/` intentionally outside the maintained gate?
6. Is there a real second consumer or release-independence requirement that would justify package extraction?

## GO / NO-GO recommendation

- R3 evidence closure: **GO**, once the archive/lint decision is supplied.
- Original-source migration: **NO-GO** until archive/publication policy and matrix reviewers are approved.
- Legacy integration pilot: **NO-GO** until fragment-level publication clearance and contracts/oracles are approved.
- Modularization/extraction: **NO-GO**; retain the current host.
