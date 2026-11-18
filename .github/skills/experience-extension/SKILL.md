---
name: experience-extension
description: Use when building or changing an Ellucian Experience extension (Experience SDK cards and pages, EDS / @ellucian/react-design-system, Ethos or Data Connect pipelines) — from the boilerplate that `create-experience-extension` generates up to a working, tested card or page. Triggers on "experience extension", "Experience card", "extensión de Experience", "card de Experience", "Ellucian SDK", "EDS", "authenticatedEthosFetch", "pipeline de Data Connect", or a repo with `extension.js` and `@ellucian/experience-extension` in package.json.
---

# Experience extension — from boilerplate to a working card

Distilled from slate_banner_dashboard (2026-11). Phases in order; each one ends in
something you can run. Read `reference/eds.md` before writing EDS code and
`reference/ethos-data-connect.md` before the first live call.

## 0. Scaffold (the user runs it, it needs their Ellucian setup)

```bash
npx https://cdn.elluciancloud.com/assets/SDK/latest/ellucian-create-experience-extension-latest.tgz <name>
cd <name> && npm install && cp sample.env .env
```

It creates the folder `<name>/` in the current directory; that folder is the repo.

- Node version: `.nvmrc` of the scaffold (24.x at the time of writing).
- `.env` needs `EXPERIENCE_EXTENSION_UPLOAD_TOKEN` (from Experience Setup) to deploy.
- What the scaffold gives (checked against a fresh one, 2026-11-18): `extension.js` (the
  manifest: card entries and the page entry, `page.source`), `src/cards/<Name>Card.jsx`
  (a hello-world card), the page component in `src/page/router.jsx` + `src/page/Home.jsx`
  (a props-and-hooks demo), `webpack.config.js` (`webpackConfigBuilder`), ESLint flat
  config, `.babelrc`, `.nvmrc`, `sample.env`, `readme.md`.
- What it does **not** give: a git repo, `src/hooks/` (no `useConfiguredEthosFetch`),
  `src/components/examples/`, `@tanstack/*`, `zustand`. All of that is §1.
- The `@ellucian/*` dependencies are CDN tarballs. In a session without access to the
  user's install, do not run `npm install`: logic goes in pure modules (§3) so
  `node --test` runs without `node_modules`.

## 1. The template layer (already applied in this repo)

The files below were copied into this repo on top of the untouched scaffold
(commit `chore: apply experience-extension template layer`). In a new repo, copy them
from an existing extension that has them, after committing the scaffold alone:

| File | Where | Why |
|---|---|---|
| `.github/copilot-instructions.md` | same | House rules: EDS only, TanStack Query, Zustand, router v5, no `fetch` |
| `src/contexts/QueryProvider.jsx` | same | One `QueryClient` per entry bundle; wrap every card and the page |
| `src/components/examples/*` | same | 24 verified EDS usage examples; the house rules tell every session to copy from them |
| `src/hooks/*` | same — copy all of them together (`index.js` imports every hook; `useConfiguredEthosFetch` adds `cardId`/`cardPrefix`) | `useEthosQuery`, `useEthosMutation`, `useMockableEthosQuery`, `useFileDownload` |
| `src/pages/router.jsx` | first move the scaffold's `src/page/` to `src/pages/` (keeps its `Home.jsx`, which the router imports), then replace `router.jsx`; set `extension.js` `page.source` to `./src/pages/router.jsx` | Router wrapped in `QueryProvider` |
| `src/pages/segmentCodec.js` (+test) | same | Route params that survive history v4 decoding |
| `src/domain/{format,pagination,redaction}.js` (+tests) | same | Readable dates, server paging, PII guard |
| `eslint.config.mjs` | replace (adds `**/*.mjs` and the `URLSearchParams` global) | Includes `**/*.mjs` (tests) in the parsed files. Flat config ignores the script's `--ext`, so `npm run lint` covers them |

Then:
- The user runs `npm install @tanstack/react-query@^5 @tanstack/react-form@^1 zustand@^5`
  (the house rules standardize on all three; none comes with the scaffold).
- Add to package.json: `"test:domain": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test 'src/**/*.test.mjs'"`.
- Wrap the card component in `<QueryProvider>`.
- Card server configuration in `extension.js` (`configuration.server`) holds secrets such
  as `ethosApiKey`; never put them in source.
- Keep a short repo map (`CLAUDE.md` in this repo) pointing to these files.

## 2. Spec, then the contract — before any screen

- Write a design spec in `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and get
  the user's approval before code. Settle: entities and their status values, list → detail navigation, which
  filters/sorts are backend vs in-browser, max sizes (decides server pagination), PII
  fields never shown, downloads.
- Write the API contract first: `docs/api/<name>.openapi.yaml`. The user usually builds
  the pipelines; the contract is what you hand them. Per endpoint: GET, query params,
  `{ total, offset, limit, data }` envelopes for lists, an error `{ message }` shape.
- Name pipelines in kebab-case; they are called by bare name (see reference).
- Then an implementation plan (`docs/superpowers/plans/…md`), with units of: domain + tests → mocks → config → list → detail pages.

## 3. Architecture that worked

```
src/domain/      pure logic (format, paging, matchers, redaction, view models) + *.test.mjs
src/mocks/       contract-shaped mock data + a pure pager mirroring backend rules
src/store/       Zustand store wrapping pure transitions (state.js tested, useStore.js thin)
src/components/organisms/<Feature>/config/   one config per entity type
src/components/{molecules,organisms}/        EDS-only components
src/pages/       router.jsx, routes.js (paths, segment codec), one page per route
```

Patterns to implement (not part of the template layer; the reference implementation is
the slate_banner_dashboard repo, `src/components/organisms/Dashboard/config/fileTypeConfig.js`,
`src/mocks/mockPager.js`, `src/store/dashboardState.js`):

- **Config-driven types.** `makeXConfig({ type, title, pipeline, columns, … })` returns
  `{ listUrl(filters), detailUrl(id, params), columns, mock: { list, detail }, mockList, … }`.
  Generic pages read the config; adding a type is one file.
- **Mock switch per endpoint.** `useMockableEthosQuery(key, url, { mock, mockData })`,
  where `mockData` is a function called at query time (pages and filters work on mocks).
  Each `mock` flag flips to `false` when that pipeline is live.
- **Pure first.** Everything that can be a function of data goes in `src/domain/` and is
  tested with `node --test` (relative imports with `.js` extension). Components stay thin:
  JSX can only be checked by lint, build and the browser.
- **Server pagination** follows the `offset`/`limit` the response applied
  (`domain/pagination.js`), since the backend caps `limit`.
- **Detail pages** fetch by id (`?rowNumber=N`, `?id=`) instead of trusting the list
  cache, so deep links and reloads work. Breadcrumbs from a pure `breadcrumbItems()`.
- **PII**: the backend omits the fields; the UI still filters them deep and
  case-insensitively (`domain/redaction.js`), including downloads.

## 4. Build loop

- Test-first for every domain module: test seen failing, then code; then break each
  new guard on purpose and name the test that catches it (mutation check).
- After each unit: `npm run test:domain`, and lint when `node_modules` exists. Without
  it, install public ESLint into a scratch dir and symlink `node_modules` temporarily
  (versions from package.json; `import/no-unresolved` for `@ellucian/*` is expected).
- Get a second review of each JSX-heavy unit: it cannot be run outside Experience.
- Commit per unit; never commit the user's own edits to `extension.js`/`package.json`
  unless asked (stage hunks only).

## 5. Verify in the real host (the user, or you with access)

1. `npm run lint` and `npm run build-dev` — clean.
2. `npm run deploy-dev` once — needs `EXPERIENCE_EXTENSION_UPLOAD_TOKEN` in `.env` (§0) — (and after changing `extension.js`, `package.json` or adding
   a card), then `npm start` (live reload, port 8082) with Experience in live-reload mode.
3. Walk list → detail → back, deep-link reload, filters, paging, downloads, phone width.
4. Ask for console output and screenshots when the user runs it; never claim UI works
   from tests alone.

## 6. Going live

- Flip one `mock` flag at a time. In DevTools → Network, an `OPTIONS` followed by the
  `GET` is normal (CORS preflight). Only `OPTIONS` with 404 means a wrong URL or an
  unpublished pipeline: check for `//` in the path first (reference).
- Hand the user the contract in chat when asked, plus its path.

## Red flags

| Thought | Reality |
|---|---|
| "EDS is MUI, so this MUI prop works" | Check `src/components/examples/` or the EDS bundle (reference). Several props differ or are dropped. |
| "I'll call the pipeline as `/name`" | Bare name only. The slash produces `//name` and a 404 preflight. |
| "Sorting/filtering in the table is enough" | With server paging it only sees the current page. Say which filters are backend. |
| "useParams gives me the file name" | Not with `%` in it under history v4: use the segment codec. |
| "I'll test the component later" | Move the logic to `src/domain/` and test it now. |
