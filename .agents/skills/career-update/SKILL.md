---
name: career-update
description: Safely add or revise career achievements, roles, metrics, projects, and translations in the portfolio's canonical content; generate reviewable HH and LinkedIn updates.
---

# Career Update

## When to use

Use when the owner requests adding or revising an achievement, job, project, technology, case study, metric, or translation. The owner may invoke `$career-update` with a free-form description.

## Required workflow

1. Read `SPEC.md`, `AGENTS.md`, `docs/CONTENT_POLICY.md` (if present), and the typed content schema. Inspect current records before editing.
2. Convert the owner's description into atomic claims. For each claim record: employer/project, dates, action, technical contribution, observed outcome, metric and unit if any, evidence status (`measured`, `observed`, `reported`, `estimated`, `unverified`), confidentiality/publication approval, and RU/EN text.
3. Separate **verified public facts**, **approximate comparisons**, and **private/unverified details**. Never invent a number, benchmark, result, title, technology, customer, or repository URL. Ask only for essential missing facts; otherwise mark an internal TODO without publishing it.
4. Privacy gate: never write non-public contract amounts, customer identities, internal URLs, secrets, IP addresses, or unapproved personal contacts into the repository. `publishable=false` is NOT sufficient protection inside a public static site repository; keep private notes outside the repository and client build entirely. If uncertain, exclude.
5. Produce succinct Russian and natural English variants; preserve meaning without word-for-word translation. Do not imply leadership, commercial impact, adoption, or measured gains beyond the evidence.
6. Update canonical typed data and relevant case studies. Do not duplicate facts across multiple manually maintained documents: update the single canonical achievement and reuse it in Highlights, Experience, case studies, PDF and exports. Preserve stable IDs and existing verified project links.
7. Produce HH/LinkedIn review drafts only when the owner requests them, using the project's existing generated output paths if present. Never edit live HH or LinkedIn without explicit approval and a supported integration.
8. Run content validation, typecheck, tests, build, and print/PDF smoke checks if available. Report commands and actual results. If a check is unavailable, state that.
9. Summarize changed files, newly public claims, unverified items excluded, and exactly what the owner should review before merging.

## Guardrails and examples

- MTS wizard: first release supported SMS/MMS/Email; adding a channel or replacing a form typically took 1–2 working days including post-test fixes. The approved public comparison is **1–2 working days including post-test fixes versus approximately a two-week sprint in an existing implementation of similar functionality**. Explicitly connect this outcome to the extensible architecture; do not omit the comparison in highlights, case studies, resume or PDF. It is an approximate cross-implementation comparison, not a controlled benchmark. Never claim proven 5–10x acceleration.
- MTS contracts/ROI: confidential; omit payback numbers and first-contract comparisons.
- Yandex Memcached: reduced address-service load and modestly improved rendering; 10–15% is an uncertain recollection and must not be published as a measured result. Do not invent Web Vitals names.
- Yandex aviation delivery: experimental product; do not portray as a commercial success or assign blame to a partner without verified public evidence.
- AI/Playwright skills: verify implemented vs planned and individual vs team adoption before claiming impact.

## Completion criteria

- Both locales complete and consistent.
- Public content contains only approved, defensible claims.
- No private notes bundled or committed.
- HH and LinkedIn update drafts are clearly labeled for human review.
- Tests run and results reported accurately.

## Employment and milestone handling

- For every new employment record, capture the verified employment type, localized employer/role/overview/achievements, `start`/`end`, explicit `datePrecision`, technologies and case links. Keep reverse-chronological resume sorting correct and chronological Evolution sorting correct.
- FRUCT: paid hourly external software developer, publicly 2015–2016 (approx. July 2015–December 2016); precedes Tensor January 2017. Preserve `datePrecision: 'approximate'`; do not guess the task tracker name.
- Store scholarships, interviews and early projects as typed `careerMilestone` records, not employment or core senior achievements. Milestones must not increase experience duration. Verify repository ownership and content before adding a URL.
- After any employment edit, reconcile both RU/EN locales, resume HTML/no-JS output, clipboard/export text, case studies, structured metadata, both PDFs and Evolution (including its disabled fallback).
- For MTS cascade wizard, prefer the approved exact RU/EN wording in `PORTFOLIO_UPDATE_V4.md` §1. Update the canonical record rather than adding another variant; never drop the architecture → easier extension → 1–2 days versus approximately a two-week comparable existing implementation chain.
- Keep private notes, rejected wording and unverified links entirely outside public source/build files. Do not rely on `publishable=false` as a privacy boundary.
