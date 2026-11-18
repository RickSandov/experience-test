# Calling Ethos and Data Connect pipelines from an extension

## The call

- `useData().authenticatedEthosFetch(resource, options)` comes from the Experience host
  (not in the SDK packages). The scaffold's `useConfiguredEthosFetch` wraps it and adds
  `cardId` and `cardPrefix` query params to every call; pipelines receive them and may
  ignore them.
- **`resource` is the bare pipeline name**: `my-pipeline?type=x&offset=0`. The host adds
  the base URL and its own `/`. A leading slash yields `…//my-pipeline` and the gateway
  answers 404 (seen 2026-11-12). Ellucian's own example passes the name bare:
  https://github.com/ellucian-developer/experience-extension-extras (`src/data/user-token-data-connect-query.js`).
- Send `headers: { Accept: 'application/json' }` (Ellucian examples always do).
- Pipelines are Data Connect **serverless APIs**, defined as GET for reads:
  https://resources.elluciancloud.com/bundle/dev_res_data_connect_acn_use/page/md_developing_serverless_apis.html
- The card's server configuration (`extension.js` → `cards[].configuration.server`)
  carries secrets such as `ethosApiKey`, set by an admin in Experience Setup.

## Reading the network tab

| What you see | Meaning |
|---|---|
| `OPTIONS` then `GET` | Normal: CORS preflight (the `Authorization` header forces it), then the call |
| Only `OPTIONS`, 404 | Wrong path: `//` in the URL, a misspelled or unpublished pipeline |
| Only `OPTIONS`, 4xx/405 with CORS error | The API rejects the preflight: platform/API configuration, not app code |
| `GET` 200 but the UI errors | Response shape differs from the contract: compare with the OpenAPI file |
| No request at all | That endpoint's `mock` flag is still `true` |

## Contract conventions that worked

- List: `GET <entity>-list?filters&order=desc|asc&offset&limit` →
  `{ total, offset, limit, data: [] }`; `limit` max 50, default 25; the response says the
  applied `offset`/`limit`.
- Detail rows: same envelope plus the parent summary; `?id=` or `?rowNumber=` returns one
  item and ignores paging (deep links).
- Per-item `result: { status, message }` set by the backend when processing can fail per
  row; the UI maps unknown statuses to a neutral label.
- Expensive lookups (Banner calls) only for the requested page; text search filters
  before those lookups.
- Downloads: `{ fileName, contentType, content }` JSON, saved with a Blob
  (`useFileDownload`); PII values blanked server-side.
- Never return PII fields the UI must not show (`ssn`, `birthdate`); the UI also strips
  them (`domain/redaction.js`) as a second guard.
