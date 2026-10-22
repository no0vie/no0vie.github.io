# Public content policy

## Source of truth

Public career content lives in `src/content/` and must pass the strict Zod schemas and parity tests. Russian and English text are edited together and must make equivalent factual claims. UI labels live in `src/app/copy.ts`.

## Publication rules

Publish only facts supported by `SPEC.md`, an existing public repository artifact, or explicit owner approval. Content must use `evidence: 'confirmed'` and `publishable: true`; schemas reject private achievements, arbitrary links, undeclared metrics and extra fields.

Never commit or bundle:

- private notes, customer identities, contract values, pricing or financial estimates;
- personal email, phone, address or infrastructure details without explicit approval;
- remembered percentages, invented outcomes, unsupported causality or confidential employer material;
- unverified project links, release stages, language levels or team-wide adoption claims.

Treat uncertain facts as owner-review TODOs in documentation or private notes outside the repository. Do not place rejected text in client-side files, comments, generated JSON, metadata, PDFs or source maps.

## Cases and projects

Career cases use the structure problem → constraints → approach → tradeoffs → verified results → lessons. Redraw only abstract, non-confidential concepts; never copy internal diagrams or code.

A public GitHub repository is not sufficient proof that a project is released or appropriate for the portfolio. Verify its ownership, purpose, stage, link and safe public description before adding it to the allowlist and routes.

## Review checklist

1. Confirm RU/EN factual parity and restrained wording.
2. Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:e2e`.
3. Inspect rendered pages, metadata and both PDFs; verify PDF links use the public site origin.
4. Check that generated output contains no secrets, loopback links, unpublished claims or source maps.
5. Record changed decisions and remaining owner-review TODOs in `docs/DECISIONS.md`.
