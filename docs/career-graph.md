# Career graph

## Architecture

The graph is derived from the same validated resume data that renders the regular résumé:

```text
src/content/seed.ts
  → validateContent()
  → resumeData
  → buildCareerGraph()
  → EvolutionGraph schema v2
  → @no0vie/brnchly-react GraphRenderer
```

There is no separately maintained graph JSON. Employer names, dates, descriptions and evidence remain in `src/content/seed.ts`. Career-graph presentation rules live under `src/features/career-graph/`.

## Data locations

- Skill registry: `careerSkills` in `src/content/skills.ts`.
- Confirmed skill usage: each `experience[].skills` entry in `src/content/seed.ts`.
- Stage/lane/branch configuration: `src/features/career-graph/config/careerGraphConfig.ts`.
- Pure adapter: `src/features/career-graph/adapter/buildCareerGraph.ts`.
- Client-only renderer and playback: `src/features/career-graph/components/CareerGraph.tsx`.

## Add a capability

1. Add a stable, language-independent kebab-case ID to `careerSkills`.
2. Set its `category` to `frontend`, `management`, or `backend`. This chooses the lane; it does not express seniority.
3. Set a semantic `branchId`: `web-ui`, `application-architecture`, `data-services`, or `engineering-practices`.
4. Add both `ru` and `en` titles and, when useful, a short bilingual description.
5. Add `{ skillId: "..." }` to the relevant canonical experience record. Prefer `achievementId` when a verified achievement supplies the node description/evidence.

A visible stage-specific node is generated automatically as `${stageId}:${skillId}`. Missing translations and unknown IDs fail validation/tests.

## Evolution and other relations

Repeated confirmed use of the same skill automatically creates an `evolution` edge between consecutive included stages. A skipped stage does not receive an invented node.

`related` and `dependency` edges are never inferred from titles or categories. Add verified skill-level pairs to `careerGraphConfig.related` or `careerGraphConfig.dependencies`. The adapter emits a relation only in stages containing both skills. `validateEvolutionGraph` rejects dependency cycles.

Branches classify real development directions and do not duplicate lanes. Do not create one branch per skill.

## Descriptions and links

An experience usage can provide a bilingual `description`; otherwise the adapter uses the registry description or the referenced canonical achievement. Node details link to the existing `#experience-${stageId}` anchor. Do not add a link when there is no matching résumé section.

## Hide a capability

Set `graphVisible: false` on that experience's skill usage. This is an explicit presentation exclusion only; the canonical résumé fact remains available to the normal résumé UI.

## Localization and theme

IDs, ordering, topology, lane coordinates and relations are locale-independent. Only titles/descriptions change between RU and EN. The renderer maps its public CSS custom properties to the portfolio's existing light/dark tokens; it has no separate theme switcher.

## Packages

Until npm publication, the release-candidate packages are checked in as immutable tarballs under `vendor/brnchly/` and referenced by `file:` dependencies. Imports use only public package entries:

```ts
import { validateEvolutionGraph, createPlaybackPlan } from '@no0vie/brnchly-core';
import { GraphRenderer } from '@no0vie/brnchly-react';
import '@no0vie/brnchly-react/styles.css';
```

Do not import package internals or copy renderer source. The renderer's current `readonly` prop is not an enforcement boundary; the portfolio explicitly sets `editingEnabled={false}` and supplies no edit callbacks.

### Upstream API limitation

The current renderer does not expose localized labels or a public option to replace/disable its built-in toolbar, legend and accessibility strings. Therefore its embedded chrome remains English on the RU route. Do not hide internal classes with consumer CSS: those classes are not public API and doing so can leave inaccessible controls in the accessibility tree. The proposed minimal backward-compatible brnchly addition is an optional `labels` prop (with current English defaults) plus public `showToolbar`/`showLegend` flags. After that release, the portfolio can supply RU/EN labels without changing graph data or topology.

## Validation

Run:

```sh
npm run typecheck
npm test
npm run lint
npm run build
npm run test:e2e
```

`tests/career-graph.test.ts` verifies schema v2, exact stages/lanes, deterministic output, unique/stable IDs, localization topology, non-mutation and automatic propagation when skill usages are added or removed.
