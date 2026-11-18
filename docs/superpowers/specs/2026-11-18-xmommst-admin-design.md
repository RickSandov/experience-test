---
status: approved 2026-11-18
date: 2026-11-18
---

# XMOMMST admin — design

## Goal

An Experience card + page to manage the Banner form XMOMMST records of one person
(proxy/"mom" access records). An admin types a Banner ID; the page shows
`bannerId - lastName, firstName` and a table of that person's XMOMMST records.
Users with a write role can create, edit and delete records; users with a read role
can only look.

## Non-goals

- Pagination (record counts per Banner ID are small), server or client.
- Hiding or redacting any field: every field the API returns is shown (PIN included).
- Searching by name; listing records across people.
- Computing dates, status changes or `xmommstLastUpdatedBy` in the UI (backend owns them).
- Role-per-route access; the extension has one page.

## Decisions

1. **Single page, search-driven.** The card shows a short description and an
   "Open" button to the page (`pageRoute` `/`). The page holds the Banner ID input.
2. **Search input.** Digits only, exactly 8 characters (`/^\d{8}$/`). Requests fire
   500 ms after the last keystroke, only with a valid value. Invalid → helper text,
   no request.
3. **Two parallel lookups** per valid Banner ID: `shu-admin-get-username` and
   `shu-admin-get-zmommst`. Header and table render only when the username lookup
   has a `firstName` or `lastName`.
4. **Not found.** `shu-admin-get-username` answers 200 with `{}` (or empty body) for
   an unknown Banner ID → "No person found with Banner ID X"; no table, no Create.
5. **Roles from card configuration.** `useCardInfo().configuration.{writeAccessRoles,
   readAccessRoles}` (card client configuration in `extension.js`). `canWrite` =
   user has any write role; `canRead` = `canWrite` or any read role. Neither →
   "You don't have access" and no request is sent.
6. **Writes via three pipelines**, each with its own method: `POST
   shu-admin-post-zmommst`, `PUT shu-admin-put-zmommst`, `DELETE shu-delete-zmommst`
   (no `admin` in the name) with JSON body `{ id }`. After any successful write the
   zmommst list for that Banner ID refetches.
7. **Backend owns** `xmommstCreatedDt`, `xmommstLastActivityDt`,
   `xmommstInactiveDt`, `xmommstLastUpdatedBy`, `id` (on create) and the default
   status on create. PUT sends the three dates back exactly as received.
8. **`xmommstMessage` is the "Relationship description"** (samples had a typo,
   `xmommsMessage`). It only exists when Relationship = `O` (Other); there is no
   other message field.
9. **UI copy in English.**
10. **Code lookups.** Rel and Acc codes are shown as descriptions and picked from
    dropdowns fed by `shu-get-zmomrel` and `shu-get-zmomacc` (both GET, no params).
    An unknown code shows the raw code.
11. **Codes `D` and `E` are left out of both dropdowns.** On edit, the record's
    current code stays selectable even if it is `D` or `E`, so it saves unchanged;
    on create they never appear.
12. **Form rules** (the user's table, binding):
    | # | Field (label) | Rule |
    |---|---|---|
    | F1 | Relationship to You (`xmommstRelCode`) | Required (dropdown `required`) |
    | F2 | Relationship description (`xmommstMessage`) | Shown and required only when Relationship = `O`; cleared when another relationship is picked |
    | F3 | Parent/Guardian Name (`xmommstName`) | Required |
    | F4 | Parent/Guardian Name | Browser `pattern="[A-Za-z'’. -]+"` (letters, apostrophe, hyphen, period, space) |
    | F5 | Parent/Guardian Name | On save: trim ends, re-check F4 in code; on failure a 10-second error message "The name has invalid characters" and nothing is sent |
    | F6 | PIN (`xmommstPin`) | Required, exactly 4 digits: `minLength`/`maxLength` 4, `pattern="[0-9]*"`, `inputMode="numeric"` |
    | F7 | Scope of Access (`xmommstAccCode`) | Required (dropdown `required`) |
    | F8 | Save / Cancel | Disabled while saving (no double submit) |
    | F9 | Save result | Success message when the response is OK; error message when it is not OK or the call throws |
13. **Delete** asks "Are you sure you want to remove <name>? This action can't be
    undone." and then shows a success or error message the same way as F9.
14. **Empty list** shows "This user has not yet granted any individuals FERPA
    authorization." instead of the table.

Rulings (decided here; change any before approval):

- **Ruling: empty or missing role configuration denies access** — unlike the sample
  `useRoleAccess`, where `hasAccess([])` is `true` — so a misconfigured card cannot
  expose writes to everyone. Cost if wrong: one line in `domain/access.js`.
- **Ruling: role lists accept an array or a comma-separated string**, trimmed,
  empty entries dropped — Experience Setup text fields arrive as strings. Cost if
  wrong: none (both shapes work).
- **`xmommstMessage` comes back in the GET** (the user adds it to
  `shu-admin-get-zmommst`): the edit form prefills it and the table shows it under
  Relationship for `O` records. Until the pipeline returns it, the form starts it empty.
- **Ruling: "cleared" means sent as `""`** when Relationship ≠ `O`, on create and
  update, so an update that moves away from `O` erases the old description. The
  description is trimmed; blank counts as missing. Cost if wrong: one line.
- **Ruling: the apostrophe in F4/F5 accepts both `'` and `’`** (the rule was written
  with a typographic `’`; keyboards type `'`). Cost if wrong: one character.
- **Browser validation stays on** (user, 2026-11-18): the form keeps native
  `required`/`pattern`/`minLength` checks, so the browser blocks an invalid name
  before F5 runs; F5's code check and 10-second message are a backstop, not the
  primary path. No `noValidate`.
- **Ruling: Banner ID in the URL** (`?bannerId=12636344`) so a reload or shared link
  reopens the same person. Cost if wrong: drop the sync.
- **Ruling: status is a string** `"true"`/`"false"` on the wire (as in the samples);
  the table shows Active/Inactive, the edit form a switch. Create sends no status.
- **Ruling: dates are shown as received, whitespace removed** (`"2026-11 - 18"` →
  `"2026-11-18"`, an artifact in the samples), then formatted by `domain/format.js`.

## Design

### Screens

**Card** — Typography with one sentence ("Look up and manage XMOMMST access records
by Banner ID.") and a Button "Open" → page `/`.

**Page `/`**
1. TextField "Banner ID" (numeric keyboard, max 8). Helper: "Enter an 8-digit
   Banner ID".
2. While loading: CircularProgress.
3. Found: heading `12636344 - Sandoval, Ricardo Javier`; if `canWrite`, Button
   "Add record".
4. Table (EDS AdvancedTable, no pagination): Name · Relationship (plus the
   description for `O`) · Access · PIN ·
   Status · Created · Last activity · Inactive · Last updated by · actions column
   (Edit, Delete) only if `canWrite`. Empty → decision 14 message.
5. Not found / no access / request error → Alert with the message.

**Record dialog** (create and edit, TanStack Form), rules F1–F9: Relationship to
You, Relationship description (only for `O`), Parent/Guardian Name, PIN, Scope of
Access; edit adds a Status switch. Save and Cancel disabled while saving. Success →
snackbar, dialog closes, list refetches. Error → error message, dialog stays open.

**Delete** — ConfirmationDialog (decision 13); success → snackbar and refetch;
error → error message, row stays.

### Units

| Unit | Purpose | Tested by |
|---|---|---|
| `src/domain/bannerId.js` | `normalizeBannerIdInput`, `isValidBannerId` | node --test |
| `src/domain/access.js` | `parseRoleList`, `resolveAccess(userRoles, config) → { canRead, canWrite }` | node --test |
| `src/domain/person.js` | `isPersonFound(resp)`, `personHeading(bannerId, resp)` | node --test |
| `src/domain/records.js` | `toRecordRow(record, lookups)`, `cleanDate`, `codeLabel` | node --test |
| `src/domain/recordForm.js` | `NAME_PATTERN`, `validateRecordForm` (F1–F7), `cleanName` (F5), `relOptions`/`accOptions(current)` (decision 11), `toCreateBody`, `toUpdateBody`, `toDeleteBody` | node --test |
| `src/api/endpoints.js` | pipeline names, URL builders, `mock` flag per endpoint | node --test (URLs) |
| `src/mocks/` | contract-shaped fixtures (from `samples/`) + in-memory store for writes | node --test |
| `src/hooks/useDebouncedValue.js` | 500 ms debounce | lint + browser |
| `src/hooks/useXmommst*.js` | queries/mutations over the endpoints, mock-switchable | lint + browser |
| `src/components/…` + `src/pages/Home.jsx` | EDS UI | lint, build, browser |

No Zustand store: the only client state is the input value (URL) and dialog state
(local). Query cache holds server state.

## Data and migrations

None in this repo. Data lives in Banner; the user builds/owns the pipelines.

## Interfaces

Pipelines, called by bare name through `useConfiguredEthosFetch` (adds `cardId`,
`cardPrefix`). Full contract: `docs/api/xmommst.openapi.yaml`.

| Pipeline | Method | Input | 200 response |
|---|---|---|---|
| `shu-admin-get-username` | GET | `?bannerId=` | `{ firstName, lastName }` or `{}` |
| `shu-admin-get-zmommst` | GET | `?bannerId=` | `XmommstRecord[]` (`[]` when none) |
| `shu-get-zmomrel` | GET | — | `[{ zmomrelRelCode, zmomrelDesc, id }]` |
| `shu-get-zmomacc` | GET | — | `[{ zmomaccAccCode, zmomaccDesc, id }]` |
| `shu-admin-post-zmommst` | POST | body: create | created record or empty |
| `shu-admin-put-zmommst` | PUT | body: full record | updated record or empty |
| `shu-delete-zmommst` | DELETE | body `{ id }` | empty or `{}` |

Errors: any status ≥ 400 → `{ message }` if present, otherwise a generic
"Request failed (<status>)".

`XmommstRecord`: `id`, `xbannerId`, `xmommstName`, `xmommstRelCode`,
`xmommstAccCode`, `xmommstPin`, `xmommstStatus` (`"true"|"false"`),
`xmommstCreatedDt`, `xmommstLastActivityDt`, `xmommstInactiveDt?`,
`xmommstLastUpdatedBy`, `xmommstMessage?`.

Card configuration (`extension.js` `cards[0].configuration.client`):
`writeAccessRoles`, `readAccessRoles` (text, comma-separated).

### Input × branch

Branches: 1 valid · 2 invalid form · 3 pipeline error (≥ 400) · 4 no write role.

**IB-create** | 1 valid | 2 invalid | 3 pipeline error | 4 no write role
---|---|---|---|---
xbannerId (from search, not editable) | A | R (not sent) | A sent, error shown | R (no button)
xmommstRelCode | A | R F1 required | A sent, error shown | R
xmommstMessage, Rel = `O` | A (trimmed) | R F2 required | A sent, error shown | R
xmommstMessage, Rel ≠ `O` | A as `""` (cleared, field hidden) | — | A sent, error shown | R
xmommstName | A (trimmed) | R F3 required / F4–F5 invalid characters (10 s message) | A sent, error shown | R
xmommstPin | A | R F6 exactly 4 digits | A sent, error shown | R
xmommstAccCode | A (not `D`/`E`) | R F7 required | A sent, error shown | R

**IB-update** | 1 valid | 2 invalid | 3 pipeline error | 4 no write role
---|---|---|---|---
id, xbannerId | A (from record, not editable) | R (not sent) | A sent, error shown | R (no action)
xmommstRelCode, Message, Name, Pin | A, as IB-create | R, as IB-create | A sent, error shown | R
xmommstAccCode | A (current `D`/`E` allowed, decision 11) | R F7 required | A sent, error shown | R
xmommstStatus | A (`"true"`/`"false"`) | — (switch, always valid) | A sent, error shown | R
Created/LastActivity/Inactive dates, LastUpdatedBy | A (echoed as received, not editable; backend decides) | R (not sent) | A sent | R

**IB-delete** | 1 confirmed | 2 cancelled | 3 pipeline error | 4 no write role
---|---|---|---|---
id | A | I (user cancelled; nothing sent) | A sent, error shown, row stays | R (no action)

## Test strategy

- `tdd` for every `src/domain/` unit, `src/api/endpoints.js` and the mock store:
  failing test first, then mutants (break each guard, name the catching test). Cite
  `IB-*` cell IDs and rules F1–F9 in the recordForm tests. `npm run test:domain` green after each unit.
- Mocks first: each endpoint has a `mock` flag; the full flow (search, not found,
  create, edit, delete, errors) runs on mocks before any pipeline exists.
- JSX: `npm run lint`, `npm run build-dev` (after the user's `npm install`), a
  read-only review of each JSX-heavy unit, then the user walks it in Experience
  (live reload): search, not found, read-only role, write role CRUD, reload with
  `?bannerId=`, phone width.

## Risks

- `useCardInfo().configuration` shape in a page context: checked in the browser at
  the first live run; fallback is the card's `cardConfiguration` prop.
- Pipelines may answer writes with 200 and an error payload; the contract fixes the
  ≥ 400 + `{ message }` rule, and the user's pipelines must follow it.
- DELETE with a body: some proxies drop it. If the preflight/DELETE fails live,
  fall back to `?id=` (one line in `endpoints.js`, a contract change).
- PIN is shown in clear by request; anyone with a read role sees it.

## Open questions

None.
