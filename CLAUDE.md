# shuferpa-xmommst — map for Claude sessions

Read on every turn of every session in this repo: keep it under 4 KB. Point to sources
(file and doc paths); never restate what a file already says. Check it with
`python3 ~/.claude/roles/flowctl.py repo-doc check .`

## Purpose
Ellucian Experience extension (card + page) to manage Banner form XMOMMST records by
Banner ID. Design: `docs/superpowers/specs/2026-11-18-xmommst-admin-design.md`
(approved). Nothing is deployed.

## Map
- `extension.js` — manifest: card entries and `page.source` (`./src/pages/router.jsx`)
- `src/cards/` — card components, each wrapped in `QueryProvider`
- `src/pages/` — page router (react-router v5), `Home.jsx`, segment codec
- `src/domain/` — pure logic (format, pagination, redaction) + `*.test.mjs`
- `src/hooks/` — Ethos/Data Connect fetch hooks (`useEthosQuery`, `useMockableEthosQuery`, …)
- `src/contexts/QueryProvider.jsx` — one TanStack `QueryClient` per entry bundle
- `src/components/examples/` — verified EDS usage examples; copy from them
- `.github/copilot-instructions.md` — house rules (EDS only, TanStack Query, Zustand, no `fetch`)

## Commands
- `npm install` (user runs it; `@ellucian/*` are CDN tarballs)
- `npm run test:domain` — node tests, no `node_modules` needed
- `npm run lint`
- `npm run build-dev`
- `npm run deploy-dev` — needs `EXPERIENCE_EXTENSION_UPLOAD_TOKEN` in `.env`
- `npm start` — live reload on port 8082

## Invariants
- UI from EDS (the Ellucian React design system) only — `.github/copilot-instructions.md`
- Data only through `src/hooks/` (`authenticatedEthosFetch`), never raw `fetch`
- Secrets (e.g. `ethosApiKey`) live in `extension.js` `configuration.server`, never in source
- Logic that can be pure goes in `src/domain/` with a test

## Gotchas
- Pipeline names go bare to `authenticatedEthosFetch` (no leading `/`, else `//` and a 404 preflight)
- EDS AdvancedTable column filters need `initialState.showColumnFilters`, not the prop
- Route params with `%` break under history v4: use `src/pages/segmentCodec.js`

## Pointers
- Skill `experience-extension` (`~/.claude/skills/experience-extension/SKILL.md` and its reference folder);
  Copilot copy without Claude-only steps: `.github/skills/experience-extension/`
- Pipeline samples: `../samples/` (request/response JSON and the role hook `../samples/useRoleAccess.js`)
- API contract: `docs/api/xmommst.openapi.yaml` (the user builds the pipelines from it)
