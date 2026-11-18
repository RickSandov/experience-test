# Project Guidelines

## Project Context
This is an Ellucian Experience SDK extension (React functional components + hooks, bundled via webpack, deployed as Dashboard cards/pages).

UI components come from `@ellucian/react-design-system` ("EDS"), styled similarly to Material Design but with its own distinct, versioned API. Icons come from `@ellucian/ds-icons/lib`. Card/data hooks come from `@ellucian/experience-extension-utils`.

**Do not assume MUI-compatible props, variants, or styling APIs.** Do not import from `@mui/*` or any other third-party UI/utility library unless the user explicitly approves it.

## Critical Workflow: Confirm Components & Data Before Coding
Before implementing any feature that uses an EDS component:

1. Check `src/components/examples/*.jsx` first — these are verified, working usage examples (imports, props, styling patterns) for components like `ActionMenu`, `AdvancedTable`, `Alert`, `Autocomplete`, `Breadcrumbs`, `Button`, `Card`, `Checkbox`, `Chip`, `CircularProgress&Backdrop`, `ConfirmationDialog`, `DatePicker`, `Divider`, `Drawer`, `Dropdown`, `Grid`, `Pagination`, `Search`, `StepProgress`, `Tabs`, `TextField`, `Tooltip`, `TreeView`, `Typography`.
2. For any component **not** covered by an example, ask the user for the EDS documentation (props, variants, imports) before writing code — do not invent component names, props, or behavior.
3. Ask for the exact API endpoint(s)/pipeline name(s) and the response shape needed for any new data-fetching feature.

**Your first reply to a new feature request must not contain the full implementation.** It should only:
1. Summarize your understanding of the request.
2. List the EDS components you expect to use, noting which are already covered by an example and which need docs.
3. Ask for docs for any component not already demonstrated in `src/components/examples/`.
4. Ask for missing API endpoint names / response shapes.

Only after component docs and API details are confirmed, produce: proposed component structure, the implementation, any helper hooks, a short state-flow explanation, and any assumptions made.

## State, Forms & Data Libraries
This project standardizes on a fixed set of libraries — do not introduce alternatives (e.g. Redux, Formik, SWR, plain Context for server state) without explicit approval.
- **Zustand** — client/UI state shared across components (e.g. selected filters, wizard step, drawer open state). Not for server data.
- **`@tanstack/react-form`** — all form state, validation, and submission handling.
- **`@tanstack/react-query`** — all HTTP/server-state fetching and caching. Use the `useEthosQuery` / `useEthosMutation` hooks ([src/hooks/useEthosQuery.js](../src/hooks/useEthosQuery.js), [src/hooks/useEthosMutation.js](../src/hooks/useEthosMutation.js)) instead of raw `useEffect` + `useState` fetching for anything that benefits from caching/refetching.
- **`react-router-dom` 5.2.0** — routing lives in [src/pages/router.jsx](../src/pages/router.jsx). This is the **v5** API (`Switch`/`Route`/`children`), not v6 — do not use v6-only APIs like `Routes`, the `element` prop, or `useRoutes`.

## Data Fetching
- Use the existing hook `useConfiguredEthosFetch` ([src/hooks/useConfiguredEthosFetch.js](../src/hooks/useConfiguredEthosFetch.js)) for all authenticated API calls — never call `fetch` directly.
- Prefer `useEthosQuery`/`useEthosMutation` (TanStack Query wrappers around `useConfiguredEthosFetch`) for anything cacheable. Every card/page entry root must be wrapped in `QueryProvider` ([src/contexts/QueryProvider.jsx](../src/contexts/QueryProvider.jsx)) — each entry bundle gets its own `QueryClient` singleton.
- Only fall back to manual `useEffect` fetching (loading state, error handling with a user-facing message, cleanup/mounted-guard) for one-off calls that don't fit the query/mutation model.
- Don't hardcode values that should come from the API/config, except clearly marked mock/fallback data.

## Code Style
- React functional components and hooks only.
- Prefer a clear state machine or step index for multi-step flows.
- Extract repeated text into constants or small content components instead of duplicating strings.
- Use accessible markup: semantic headings, table semantics, labeled buttons/links.

## Architecture
- `src/cards/` — Dashboard card entry components declared in [extension.js](../extension.js).
- `src/components/examples/` — reference-only EDS usage examples, not app code.
- `src/contexts/` — cross-cutting providers (e.g. `QueryProvider`).
- `src/hooks/` — shared hooks (e.g. `useConfiguredEthosFetch`, `useEthosQuery`, `useEthosMutation`).
- `src/pages/` — routed pages ([router.jsx](../src/pages/router.jsx)).

## Build & Test
- `npm run lint` — ESLint (flat config, [eslint.config.mjs](../eslint.config.mjs)).
- `npm run build-dev` / `npm run deploy-dev` — dev build / upload to Experience Dashboard.
- `npm start` — live-reload dev server.
- Re-run `deploy-dev` after changing `extension.js`, `package.json`, or adding a new card.
