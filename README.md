# Bilingual career website

Resume-first React/TypeScript site, statically published with Vite. It includes complete Russian/English resumes, a verified career case study, audited projects with honest stage labels, recruiter contacts, SEO, PDF exports, GitHub Pages publishing, and an optional feature-gated career Evolution view.

## Install and develop

Use Node.js 22+ and the committed lockfile:

```sh
npm ci
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium
npm run dev
```

On Linux/CI use `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install --with-deps chromium`. The browser cache stays under `node_modules`, not the home directory. Chromium must be permitted to launch by the host sandbox. No remote PDF service is used. Development renders the existing App before hydration; production HTML and metadata are generated during build.

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

`npm run build` invokes `tsx scripts/build.ts`: Vite client build → Vite SSR of validated App content → static HTML and SEO → mandatory RU/EN PDFs. Missing Chromium, invalid content or PDF errors fail the build. `npm run preview` is convenient for browsing, but Vite preview is not a Pages 404 emulator. For production-faithful status codes use `npx tsx scripts/server.ts` (localhost:4173, automatically stops after three minutes). E2E starts/stops this server itself.

## Static output and PDF

- `dist/ru/index.html`, `dist/en/index.html`: complete resumes without JavaScript.
- `dist/{ru,en}/projects/index.html`: audited Pantry and Magic Ball repositories plus clearly labeled Riply and Cave Escaper concepts.
- `dist/{ru,en}/cases/campaign-wizard/index.html`: bilingual, publication-safe career case study.
- `dist/{ru,en}/evolution/index.html`: generated only with `ENABLE_EVOLUTION=true`; the feature is disabled by default.
- `dist/index.html`: locale redirect, Russian by default; honors an existing explicit `localStorage.locale = 'en'`. Readable bilingual links remain without JavaScript. The current UI locale links do not save that preference.
- `dist/404.html`: real not-found content, `noindex`, no SPA redirect. GitHub Pages supplies the 404 HTTP status. A single Russian fallback is used for all missing URLs.
- `dist/downloads/resume-{ru,en}.pdf`: A4, tagged/selectable text, active links, existing print CSS, no navigation. Regenerate with `npm run build`; do not edit PDFs manually.
- Canonical/hreflang links, localized descriptions, Person/Occupation JSON-LD, purpose-built 1200×630 OpenGraph cards generated from the approved portrait, `sitemap.xml`, `robots.txt`, favicon and `.nojekyll` are emitted/copied at build time.

PDF rendering uses a temporary loopback server, JavaScript disabled, UTC, a fixed light theme and reduced motion. Before printing, internal link targets are rewritten to the configured public `SITE_URL` and `BASE_PATH`; loopback addresses are never retained in PDF annotations. Browser work is bounded to 90 seconds, and browser/server cleanup runs in `finally`. Volatile PDF creation/modification dates are normalized without changing cross-reference offsets. Byte-identical output was verified across two builds on the same Chromium/OS; different OS fonts or browser revisions can change bytes/layout. Keep the lockfile and CI platform consistent. Review both PDFs visually after editorial changes; automated export checks are not a substitute for pagination review.

## Content editing

Canonical public content lives in `src/content/seed.ts`; schemas and publication checks are in `src/content/schema.ts`, validated by `src/content/index.ts`. UI translations live in `src/app/copy.ts`. Skill categories live in `src/content/skills.ts`; HH.ru clipboard formatting is isolated in `src/app/resume-text.ts`.

1. Edit both languages together, preserving factual parity and the evidence/publication policy in `SPEC.md` and `docs/CONTENT_POLICY.md`.
2. Do not add private notes, contact details without approval, unapproved metrics or guessed links to public source files. SSR is not a privacy boundary: imported content can also enter client bundles.
3. Run unit tests and the full build, inspect both locales and PDFs. Regenerate social cards after changing the approved portrait or headline with `npm run assets:og`.
4. Projects must have verified repositories and release status before publication. Update the content model, App/routes and static generation route list together, then add direct-link/404/locale tests. Merely finding a public repository is not sufficient evidence that it should be presented as a released portfolio project.

## GitHub Pages and base paths

In repository Settings → Pages, choose **GitHub Actions**. `.github/workflows/publish.yml` runs locked install, Chromium install, formatting, lint, typecheck, unit tests, build and E2E. Only successful `main` runs may deploy; pull requests validate but never deploy. Screenshot/report artifacts are uploaded even on failure. Dependency alerts are configured with Dependabot; existing audit findings and dependency remediation remain the parent integration task, not silently ignored or repaired here.

Default user-site deployment:

```sh
SITE_URL=https://no0vie.github.io BASE_PATH=/ npm run build
```

Project Pages (set matching GitHub Actions repository variables `SITE_URL` and `BASE_PATH`):

```sh
SITE_URL=https://no0vie.github.io BASE_PATH=/career/ npm run build
BASE_PATH=/career/ npm run test:e2e
```

`SITE_URL` is an origin only, without a path/query; `BASE_PATH` is `/` or slash-separated alphanumeric/hyphen/underscore segments. Generated assets, navigation, downloads, root fallback, canonical URLs and sitemap all use the configured base. Both slashless and trailing-slash deep links work through directory indexes. Do not add an SPA 404 rewrite.

For a custom domain: configure DNS and the domain in Pages settings, enforce HTTPS, set `SITE_URL=https://your-domain.example` and `BASE_PATH=/`, and rebuild. If a `CNAME` file is needed for your hosting setup, add the approved domain alone to `public/CNAME`; Vite copies it into `dist`. Do not commit an unapproved placeholder domain.

## Infrastructure decisions and limitations

Architecture and publication decisions are maintained in `docs/DECISIONS.md`; measured quality results and remaining limitations are recorded in `docs/QA.md`.

- Reuse existing React App and Vite SSR rather than add an SSG dependency or maintain duplicate resume templates.
- Inline head theme initialization uses the same `theme` storage key as the UI, before CSS rendering; invalid/blocked storage falls back to system styling.
- OpenGraph previews are local 1200×630 PNG files generated by `scripts/generate-og.ts` from `public/profile.jpg`; the deployed application requires no remote image service.
- No runtime APIs, HH.ru scraping or analytics. Availability is static typed content linked to the approved HH.ru resume because anonymous resume access requires authentication. The Evolution view is generated only when `ENABLE_EVOLUTION=true`; it remains disabled by default and its enhancement is lazy-loaded.
- Browser tests cover axe on all four pages, hydration errors, locale route retention, persisted theme, keyboard/anchors, 320/375/768/1280px layouts, light/dark screenshot artifacts, reduced motion, no-JS resume/projects, downloads and genuine 404s. Screenshots are artifacts, not approved visual-regression baselines.
- Local mobile Lighthouse results and visual/PDF review are recorded in `docs/QA.md`. Live GitHub Pages deployment and cross-browser rendering remain unverified.
