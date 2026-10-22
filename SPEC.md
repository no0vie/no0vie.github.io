# Personal Career Website — Codex implementation specification

Status: current canonical specification v4.1 (2026-10-22)
Owner: portfolio owner; GitHub: https://github.com/no0vie

This file incorporates the approved Portfolio Update v4 requirements and is the single product and public-fact specification. Historical implementation decisions belong in `docs/DECISIONS.md`; actual verification results belong in `docs/QA.md`.

## 1. Product definition

Build a fast, elegant, readable bilingual career website for a **Senior Software Engineer (Frontend-focused)**. Its primary purpose is to help recruiters and engineering managers understand experience and business impact in under 90 seconds. Secondary purpose: deeper exploration of engineering case studies, projects and optional Spore-inspired career evolution.

**Non-negotiable:** the resume is the default, not a gamified experience. Never require interaction or animation to read the complete career history. No unverified metrics, invented accomplishments, fictional project links, confidential commercial details or fake GitHub activity.

## 2. UX / routes

- `/` redirects to `/ru` (or uses stored explicit locale; no automatic geo detection).
- `/ru`, `/en`: canonical complete resume in respective language, one-page scrolling layout with accessible anchor navigation.
- `/ru/projects`, `/en/projects`: projects index; cards only for confirmed projects, with stage badges (released / in progress / concept).
- `/ru/projects/:slug`, `/en/projects/:slug`: verified project detail; 404 for missing slugs.
- `/ru/cases/:slug`, `/en/cases/:slug`: career case studies, with publication safety rules.
- `/ru/evolution`, `/en/evolution`: optional Spore-inspired career exploration. Link from primary resume; not the homepage.
- `/ru/print`, `/en/print` optional print-only view if needed; prefer CSS `@media print` on resume route.
- Header: name/role, Resume, Projects, Evolution, language switch, theme switch, Download PDF. Small-screen responsive menu.
- Footer: GitHub, owner-approved email and Telegram links, last content update, privacy-conscious credits.
- Locale switching retains the equivalent route/slug if available, otherwise navigates to locale home.
- Light and dark themes; system default; explicit choice persisted locally. Theme change must not cause a flash of incorrect theme.

## 3. Visual design

Use the selected Figma community design as _inspiration only_ if it can be inspected: https://www.figma.com/design/TFhlewl6ZfTLsNextLlCvc/Personal-Portfolio-Web-Template--Community- . Do not claim pixel-accurate replication without access. The colleague's https://alexkudelin.github.io/ is a functional reference for resume utility, not a visual template.

- Editorial, modern, restrained; comfortable typography, ample whitespace, coherent grid, polished micro-interactions.
- Desktop content width ~900–1100px; text column max ~72–80 characters; readable mobile down to 320px.
- Type scale, spacing and color tokens; WCAG AA contrast, focus indicators, keyboard navigation, semantic landmarks.
- Subtle accent color, consistent cards, minimal decorative icons; no large skill progress bars or meaningless percentages.
- Resume sections: Hero; About; Key outcomes (2–4 confirmed highlights); Experience timeline; Selected case studies; Projects; Skills; Education & languages; Contacts.
- Experience: full readable cards, each with title, employer, dates, product context, 4–7 strong bullets; optional expandable details, never hide critical facts by default.
- The resume is ATS-friendly when printed: linear DOM, selectable text, no text rendered as canvas/SVG, no essential content in tooltips.

## 4. Spore-inspired optional Evolution mode

- Concept: career growth from paid early software work at FRUCT (2015–2016), through frontend work at Tensor (2017–2021), product/platform engineering at Yandex Market (2021–2024), to architecture/ownership/automation at MTS Web Services (2024–present). A Tensor scholarship/Tic-Tac-Toe milestone may appear between FRUCT and Tensor but is not employment and does not increase experience duration.
- Inspiration is evolution/progression and branching skill acquisition; **do not copy Spore assets, trademarks, creatures, audio or UI**.
- SVG / CSS / React-driven interactive map or factual timeline; 4 employment nodes and optional milestone/child nodes for transitions, case studies and technologies.
- Click/tap/keyboard to focus nodes and show factual text panels. Optional guided autoplay, paused by interaction, default off. No forced animations; obey `prefers-reduced-motion`.
- Mobile fallback: vertical stepper / timeline, same data, same content. Full noninteractive textual fallback.
- Build only after core resume, bilingual content, print and accessibility are complete. Feature flag `ENABLE_EVOLUTION`; optional mode can be disabled without breaking routes/navigation.

## 5. Technical architecture

Recommended: Vite + React + TypeScript (strict), React Router, Tailwind CSS with CSS variables, Motion for optional animation, Vitest + Testing Library, Playwright for E2E, ESLint + Prettier, Zod for content validation. Prefer static generation or pre-rendering for indexable resume routes and SEO; if full SSG is costly, ship static HTML snapshots / prerender step, not empty JS shell. No backend required for MVP. Deploy on GitHub Pages with project/base-path support and documented custom domain migration.

Suggested structure:

```
portfolio/
  AGENTS.md
  README.md
  package.json
  public/{favicon.svg,og-ru.png,og-en.png,robots.txt}
  src/
    app/{router.tsx,App.tsx,providers.tsx}
    components/{Header,Footer,Section,ExperienceCard,Metric,LanguageSwitch,ThemeSwitch}
    features/{resume,projects,case-studies,evolution,export}
    content/{schema.ts,profile.ts,experience.ts,cases.ts,projects.ts,skills.ts,translations.ts}
    i18n/{ru.ts,en.ts}
    styles/{tokens.css,global.css,print.css}
    utils/{routes.ts,dates.ts,content.ts}
  scripts/{validate-content.ts,generate-resume.ts,generate-pdf.ts,generate-sitemap.ts}
  tests/{content.test.ts,accessibility.test.ts,locale.test.ts}
  e2e/{resume.spec.ts,theme.spec.ts,language.spec.ts,print.spec.ts,evolution.spec.ts}
  docs/{CONTENT_POLICY.md,DECISIONS.md}
  .github/workflows/{ci.yml,deploy.yml}
```

Do not introduce CMS, database, SSR server, analytics or third-party APIs in MVP unless justified. Use local content files as single source of truth. GitHub activity is optional; if added, avoid unauthenticated client-side dependence and provide a static fallback.

## 6. Typed content model

Use Zod runtime schemas + inferred TypeScript types. Every public text field is localized manually in RU/EN, not machine-translated at runtime. Preserve factual parity across languages.

```ts
type Locale = 'ru' | 'en';
type Localized = Record<Locale, string>;
type Evidence = 'confirmed' | 'observed' | 'reported' | 'estimated' | 'unverified';
type ProjectStage = 'released' | 'in-progress' | 'concept';
type Metric = {
  id: string;
  label: Localized;
  value: string;
  context: Localized;
  evidence: Evidence;
  publishable: boolean;
  approved: boolean;
};
type CareerItem = {
  id: string;
  employer: Localized;
  role: Localized;
  start: string; // YYYY-MM
  end?: string;
  datePrecision: 'exact' | 'approximate';
  overview: Localized;
  achievements: Array<{ id: string; text: Localized; evidence: Evidence; publishable: boolean }>;
  technologies: string[];
  caseStudySlugs: string[];
};
type CareerMilestone = {
  id: string;
  afterExperienceId: string;
  beforeExperienceId: string;
  title: Localized;
  text: Localized;
  githubUrl?: string; // verify ownership and content before publishing
};
type Availability = {
  status: 'available' | 'selective' | 'unavailable' | 'unknown';
  label: Localized;
  updatedAt: string; // YYYY-MM-DD
  source: 'manual' | 'hh';
  verifiedAt?: string;
};
type Project = {
  slug: string;
  title: Localized;
  summary: Localized;
  stage: ProjectStage;
  tech: string[];
  githubUrl?: string; // verify existence
  demoUrl?: string; // verify existence
  public: boolean;
};
```

`publishable=false` content must NEVER be emitted into client bundles, generated HTML, PDF, metadata, search index, source maps or static JSON. Better: store private notes outside the repository entirely; public content schema should accept only approved content. Build validator fails on unapproved metrics or unsupported public links. Do not commit personal phone/email without explicit user approval. Owner approval was granted for `eugene.malin765@gmail.com`, `evgeniys-nov@yandex.ru`, `https://t.me/no_0vie`, and the WhatsApp QR URL `https://wa.me/qr/XFZZQSNXJCSBL1`. The current owner-approved manual availability record is `available`, labeled “Рассматриваю предложения” / “Open to opportunities”, updated `2026-10-22`, source `manual`. HTML, both PDFs and build-generated `/availability.json` must use this one record without mandatory runtime fetching. Do not expose a phone number, link to external resume services, infer availability from HH publication state or automatically change it to `available`.

## 7. Seed career content — verified facts

### FRUCT Laboratory — 2015 to 2016

Public employer label: «Лаборатория FRUCT, Ярославский государственный университет им. П. Г. Демидова» / “FRUCT Laboratory, P. G. Demidov Yaroslavl State University”. Role: «Разработчик ПО (внештатная почасовая работа)» / “Software Developer (part-time, hourly paid contractor)”. Internally retain approximate dates `2015-07`–`2016-12` with `datePrecision: 'approximate'`; publicly show only `2015–2016`.

- Paid university-laboratory work on software for LED information displays.
- Implemented software for a glass factory in Gus-Khrustalny and contributed to petrol-station and sports-display solutions. Do not imply sole development of the entire system or hardware.
- Used Java and Kotlin, Mattermost and an unspecified task tracker. Do not publish “Redmine” as a fact.
- Participated in a hackathon developing an application for Aurora mobile OS using C++ and QML. This was a hackathon, not commercial OS development or a current core specialization.
- Do not invent customer/manufacturer identities, deployment scale or commercial outcomes.

### Tensor transition milestone

Not employment: joined Tensor through its student scholarship programme and built a Tic-Tac-Toe project for the final technical interview. The verified repository is `https://github.com/no0vie/tic-tac-toe`. Keep this out of top highlights and HH/LinkedIn core achievements; it must not increase experience duration.

### Tensor (Тензор) — Jan 2017 to Mar 2021

Role: Software Engineer / Инженер-программист. JavaScript, TypeScript, WaSaby, Less, Python, PostgreSQL, SQL. Corporate and HR workflows, business application interfaces, maintenance and mentoring beginners / Tensor Hack. Do not invent scale or numbers.

### Yandex Market — Mar 2021 to May 2024

Role: Interface Developer / Разработчик интерфейсов. React, TypeScript, Redux, Redux-Observable, Memcached, Jest, Testament, Webpack, Grafana, Apiary.

- Product work on cart, checkout and address management UX, including user address management panels.
- Participated in emergence and evolution of microfrontend architecture. Do not claim sole architect.
- Participated in Memcached address-data caching optimization: noticeable reduction in address service load, positive but modest effect on frontend page-render metrics. **Do not publish remembered 10–15% as fact**, nor invent LCP/FCP/CLS.
- Frontend map preloading to improve responsiveness of address flows; no fabricated performance delta.
- Participated in numerous A/B tests, independently conducted an experiment on faster address-button interaction. **Outcome unknown; do not claim positive result.**
- Aviation delivery experiment: UI offered faster/more expensive versus slower/cheaper options; launched spring 2022; project did not succeed commercially due to external circumstances. **Do not claim commercial success or independently verify the cause from memory.** Describe neutrally if published, without blaming a named partner absent verified public evidence.
- Production on-call: Grafana/RPS/service health across DCs, incident investigation, anomalous/bot traffic, coordination with security, throttling and instance scaling when applicable.
- Regular code reviews, releases, mentoring/onboarding. Did not design reviewer-assignment algorithm.

### MTS Web Services — May 2024 to present

Role: Lead Developer / Ведущий разработчик. OMNI and ORP products. React, TypeScript, MobX, NestJS, Next.js, Jest, Playwright, Webpack, Ant Design.

- Owned substantial frontend architecture and implementation of cascade campaigns wizard.
- First release supported **three channels: SMS, MMS, Email**.
- Common channel contract + isolated per-channel state/forms/business rules; extensible architecture.
- Canonical RU heading: **«Архитектура, рассчитанная на развитие»**.
- Canonical RU text: **«Спроектировал расширяемую архитектуру мастера каскадных кампаний, изолировав логику отдельных каналов и их формы от общего сценария. Благодаря этому добавление нового канала или замена редактора стали занимать 1–2 рабочих дня, включая исправления после тестирования, вместо примерно двухнедельного спринта в существовавшем механизме с аналогичной функциональностью.»**
- Canonical EN heading: **“Architecture designed for extensibility”**.
- Canonical EN text: **“Designed an extensible cascade campaign wizard architecture, separating channel-specific logic and forms from the shared workflow. This reduced the effort required to add a new channel or replace an editor to 1–2 working days, including post-testing fixes, compared with approximately a two-week sprint in the existing implementation of similar functionality.”**
- Reuse the canonical record in Highlights, Experience, case studies, clipboard/export text and PDF; do not maintain shortened conflicting copies.
- SMS and MMS later migrated to newer template editors without major architectural rework.
- UX constraints, client-side validation, mapping public API errors to human-readable feedback.
- Similar legacy campaign flow required roughly **one two-week sprint** for adding a channel; **not a controlled apples-to-apples benchmark**. If published, phrase explicitly as an approximate comparison of different modules, never as '10x proven acceleration'.
- Commercial success was reported by management, but contract values and financial estimates are confidential; **do not publish ROI, first-contract payback, revenue, customer names, or confidential pricing**.
- Node/NestJS used for data preparation/transformation. Do not claim ownership of broad backend architecture.
- Engineering scripts and deploy/Linux portability. Do not claim team-wide CI/CD rollout.
- AI-assisted Playwright skills/test-agent workflows: **implementation status must be verified** before claiming production/team-wide usage. Until confirmed, describe as personal initiative or omit.
- Microfrontend experiment was abandoned in favor of modular monolith. Never claim successful rollout.

### Education / language

Yaroslavl State University named after P. G. Demidov; Bachelor in Applied Mathematics and Informatics, 2018. English B1 is self-reported and owner-approved for publication only when clearly labeled as self-assessed; it may note reading technical documentation and communicating on work topics.

### Personal projects

GitHub: https://github.com/no0vie. Audited public repositories: Pantry (`https://github.com/no0vie/pantry`; public version complete, future evolution into a platform is planned) and Magic Ball (`https://github.com/no0vie/magic-ball`, in progress; main scenarios implemented, full cross-browser acceptance unfinished). Owner-approved future concepts: Riply fishing-game Telegram bot and Cave Escaper Telegram game bot; both must be labeled as concepts with no release claim or invented link. Never depict concepts as shipped. Privacy: no IPs, infrastructure secrets, sensitive diagrams or internal company code.

## 8. Content writing and bilingual editorial policy

- Public position: **Senior Software Engineer (Frontend-focused)** / **Старший разработчик ПО (фокус на фронтенде)**, not unqualified Fullstack Architect. Preserve official historical role titles in experience records.
- Russian and English are separately edited but semantically equivalent. No runtime machine translation.
- English wording must be idiomatic and restrained. For the MTS extensibility result, use the canonical text above so the architecture, 1–2 working days and approximate two-week baseline remain together.
- Each achievement should express action + technical decision + effect where confirmed. If no metric, emphasize scope, tradeoffs, experimentation or ownership.
- Avoid fabricated business numbers, cache hit ratios, traffic volumes, test coverage, growth, dates or causality.
- Public case studies: problem → constraints → approach → tradeoffs → results (verified) → lessons. Do not disclose proprietary code, internal diagrams or contract details.
- Link out to employer public sites only when relevant and verified. Personal project cards only link to verified GitHub/demo URLs.
- English B1 self-report is owner-approved when explicitly labeled as self-assessed.

## 9. Export and SEO

- PDF in RU/EN generated deterministically during CI/build using Playwright print-to-PDF from print route or static HTML. Bundle artifacts under `/downloads/resume-ru.pdf` and `/downloads/resume-en.pdf`; no remote print service.
- PDF: selectable text, A4, correct page breaks, no header navigation, no animation, no clipped content, no blank pages, links active. Print should preserve semantic order and not require JS interaction.
- Optional Markdown and TXT downloads from same canonical content; do not maintain duplicated text files manually.
- Locale-specific title/description, OpenGraph images, canonical URLs, hreflang ru/en, sitemap.xml, robots.txt, structured data Person/Occupation only with accurate facts.
- Accessible and stable shareable deep links. No SEO keyword stuffing.

## 10. Accessibility, performance, security

- WCAG 2.2 AA target, semantic headings, keyboard navigation, visible focus, skip link, reduced-motion, adequate target sizes, contrast, meaningful aria labels, no color-only communication.
- Lighthouse target on mobile: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 (targets, not guarantees; record measured results).
- Core resume content should be visible without client-side data fetching; avoid large bundles and excessive JS.
- Lazy-load evolution view and heavy visuals; do not load animation libraries on basic resume unnecessarily.
- No tracking cookies by default. No exposed secrets, tokens, personal phone/address, or confidential company data.
- External links `rel="noopener noreferrer"`; sanitize content; use Dependabot or equivalent dependency checks.

## 11. Testing and CI

- Unit: schema validation, RU/EN parity, date sorting, public-only metric filtering, route mapping, resume export transformations.
- E2E Playwright: locale switch retains route; theme persists; navigation/anchors; mobile at 320/375/768px; print PDF generation; reduced-motion; keyboard-only evolution; links; 404.
- Axe accessibility checks on home, projects, case and evolution. Snapshot or screenshot comparisons for dark/light and mobile/desktop.
- Build fails if translations missing, public project links invalid syntax, confidential/unapproved metrics included, invalid dates, broken internal routes.
- GitHub Actions: install with lockfile, lint, typecheck, unit, build, Playwright smoke, artifact upload; deploy GitHub Pages only after green checks.
- README: install, dev, test, content update, deploy, custom domain, add a case/project, regenerate PDF.

## 12. Implementation stages (Codex must follow)

**Phase 0 — Audit:** inspect repository; report current structure, dependencies, actual GitHub project state (if network accessible), design reference availability, and unresolved facts. Never silently overwrite existing code. Write `docs/DECISIONS.md`.

**Phase 1 — Content:** implement Zod schemas, validated bilingual seed data, evidence/publishability gates, editorial content; flag uncertain English level, A/B outcomes and AI-skills status as TODOs not public facts.

**Phase 2 — Resume-first MVP:** layout, RU/EN, dark/light, responsive, accessible content, routing, semantic sections. Keep it polished and usable without optional features.

**Phase 3 — Export and publishing:** PDF RU/EN, print CSS, SEO, GitHub Pages CI/CD, 404 handling, content links, README.

**Phase 4 — Projects and case studies:** confirmed public projects, career case pages, diagrams redrawn from non-confidential abstract concepts, no internal assets.

**Phase 5 — Optional Evolution:** Spore-inspired skill tree/timeline with keyboard/mobile/reduced-motion fallback. Feature flag. No impact on core performance.

**Phase 6 — QA:** accessibility, Lighthouse measurement, Playwright E2E, content audit, screenshot QA, dead-link check, PDF review, final report with verified and remaining TODOs.

## 13. Definition of Done

1. RU and EN resume pages are complete, factually aligned, include FRUCT before Tensor, and are readable without opening the evolution mode.
2. Both themes work and persist; system theme honored by default.
3. Mobile layouts work down to 320px with no horizontal scrolling.
4. Downloadable RU/EN PDF matches site content and contains selectable text.
5. Site deploys via GitHub Actions to GitHub Pages and works on deep links.
6. No unpublished/private metrics, confidential financial facts, secrets or unverified claims are bundled.
7. All content is editable through typed data; no hardcoded resume paragraphs scattered across JSX.
8. Tests and accessibility checks pass; measured Lighthouse scores documented.
9. Optional evolution view is keyboard-accessible, respects reduced motion and has mobile fallback.
10. README explains every setup step and content-editing workflow.

## 14. Instructions to Codex

Implement incrementally, with working checkpoints per phase. Start by inspecting the repository and writing a short plan. Make reasonable implementation decisions without repeatedly asking for cosmetic choices, but **ask for approval before publishing personal contact data, confidential company information, unverifiable performance metrics, or unverified external links**. Do not manufacture proof. Keep the project buildable at every phase. After each phase run available validation and report exact results. If a dependency, design reference or GitHub access is unavailable, document the limitation and continue with a graceful fallback. Avoid overengineering. When this specification changes, update `AGENTS.md`, the relevant project skill, README, decisions and QA only where their responsibilities are affected; do not add another competing current specification.
