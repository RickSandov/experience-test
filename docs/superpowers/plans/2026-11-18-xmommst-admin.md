# XMOMMST admin — implementation plan

**Spec:** docs/superpowers/specs/2026-11-18-xmommst-admin-design.md · **Contract:** docs/api/xmommst.openapi.yaml
**Goal:** a card + page that looks up one Banner ID and lists, creates, edits and deletes its XMOMMST records, gated by card-configured roles.
**Architecture:** pure rules in `src/domain/` (node --test), pipeline names/URLs and contract-shaped mocks in `src/api/` and `src/mocks/`, thin TanStack hooks in `src/hooks/`, EDS components in `src/components/xmommst/`, one page `src/pages/Home.jsx`.
**Global constraints:** EDS only (copy from `src/components/examples/`); data only via `src/hooks/`, bare pipeline names; English UI and code; form rules F1–F9 and decisions 11–14 verbatim from the spec; no pagination; no field hidden; backend owns dates, `xmommstLastUpdatedBy`, `id` on create; no AI attribution in commits.
**Slices:** s1 = units 1–4 (~70k, pure + mocks, no `node_modules` needed) · s2 = units 5–8 (~70k, after s1; needs the user's `npm install` for lint/build).

### Unit 1: search and access rules — ~20k

**Files:** create `src/domain/bannerId.js`, `src/domain/person.js`, `src/domain/access.js` · **Tests:** same names `.test.mjs`
**Interfaces:** produces `normalizeBannerIdInput(raw) → string` (digits only, max 8) · `isValidBannerId(s) → boolean` (`/^\d{8}$/`) · `isPersonFound(resp) → boolean` · `personHeading(bannerId, resp) → string` (`"12636344 - Sandoval, Ricardo Javier"`; one missing name part drops its comma) · `parseRoleList(value) → string[]` · `resolveAccess(userRoles, { writeAccessRoles, readAccessRoles }) → { canRead, canWrite }`
**Invariants:** empty/missing role config denies (ruling 1); `canWrite` implies `canRead`; role match is exact string equality.
**Tests first:**
- normalize strips non-digits and caps at 8 · fails if the cap is removed
- isValid rejects 7 and 9 digits and letters · fails with `\d+`
- isPersonFound false for `{}`, `null`, `''`, names blank · fails if `{}` counts as found (decision 4)
- personHeading formats `bannerId - last, first`
- parseRoleList takes `"A, B,,"` → `['A','B']` and arrays as-is · fails without trim/empty-drop
- resolveAccess: empty config → both false · fails with sample `hasAccess([])` semantics
- resolveAccess: write role only → canRead true · fails if read is not derived
**Acceptance:** `npm run test:domain` → all pass, count up from 26.
**Commit:** `feat: add banner id, person and access rules`

### Unit 2: record rows — ~15k

**Files:** create `src/domain/records.js` · **Tests:** `src/domain/records.test.mjs`
**Interfaces:** consumes `formatDate`, `displayValue` from `format.js` · produces `cleanDate(s) → string` (whitespace removed) · `codeLabel(code, codes, codeKey, descKey) → string` (desc, else raw code) · `toRecordRow(record, { rel, acc }) → { id, name, relationship, relationshipDescription, access, pin, status: 'Active'|'Inactive', created, lastActivity, inactive, lastUpdatedBy, record }`
**Invariants:** `relationshipDescription` only when `xmommstRelCode === 'O'`; status from the string `"true"`; `record` keeps the raw object for edit/delete.
**Tests first:**
- cleanDate `"2026-11 - 18"` → `"2026-11-18"` · fails without whitespace strip
- toRecordRow dates go through formatDate after cleanDate · fails if raw string shown
- codeLabel unknown code → raw code (decision 10) · fails if it returns `—`
- status `"false"` → Inactive, `"true"` → Active · fails on truthy-string check
- description shown for `O`, empty otherwise · fails if shown for `M`
**Acceptance:** `npm run test:domain` all pass.
**Commit:** `feat: add xmommst record row view model`

### Unit 3: record form rules and bodies — ~20k

**Files:** create `src/domain/recordForm.js` · **Tests:** `src/domain/recordForm.test.mjs`
**Interfaces:** produces `NAME_PATTERN` (string for the input `pattern`, `[A-Za-z'’. -]+`) · `HIDDEN_CODES = ['D','E']` · `cleanName(s) → string` · `isValidName(s) → boolean` · `codeOptions(codes, codeKey, descKey, current?) → { value, label }[]` · `emptyForm()` / `formFromRecord(record)` · `onRelationshipChange(form, code) → form` · `validateRecordForm(form) → { field: message }` · `toCreateBody(form, bannerId)` · `toUpdateBody(form, record)` · `toDeleteBody(record) → { id }`
**Invariants:** bodies never carry a field outside the contract's `EditableFields`/`XmommstRecord`; message trimmed, `""` when rel ≠ `O`; update echoes dates and `xmommstLastUpdatedBy` from the record; create sends no status/dates/id.
**Tests first:**
- IB-create.1.xbannerId · body takes the searched id · fails if read from the form
- IB-create.2.xmommstRelCode · F1 missing → error · fails without the required check
- IB-create.2.xmommstMessage · rel `O` + blank/whitespace → F2 error · fails without trim
- IB-create.1.xmommstMessage (≠ O) · body `""` even if the form held text · fails if the stale text is sent
- IB-create.1.xmommstName · trimmed · IB-create.2.xmommstName · F3 blank and F4/F5 `"Ann3"` rejected, `"O'Neil-Smith Jr."` and `’` accepted · fails on narrowed pattern
- IB-create.2.xmommstPin · F6 `"123"`, `"12345"`, `"12a4"` rejected · fails with `\d{4,}`
- IB-create.1.xmommstAccCode / IB-create.2.xmommstAccCode · F7 required; codeOptions without current drops D, E · fails if filter removed
- IB-update.1.xmommstAccCode · codeOptions with current `D` keeps D only · fails if current ignored
- IB-update.1.id · IB-update.1.xmommstStatus · IB-update.1.dates · body carries id, status string, echoed dates · fails on boolean status or dropped dates
- onRelationshipChange to non-O clears message (F2) · fails if kept
- IB-delete.1.id · `{ id }` only · fails with extra fields
**Acceptance:** `npm run test:domain` all pass; each guard broken once, catching test named in the commit body.
**Commit:** `feat: add xmommst form rules and request bodies`

### Unit 4: endpoints and mocks — ~15k

**Files:** create `src/api/endpoints.js`, `src/mocks/fixtures.js`, `src/mocks/mockStore.js` · **Tests:** `src/api/endpoints.test.mjs`, `src/mocks/mockStore.test.mjs`
**Interfaces:** produces `PIPELINES` (seven names from the contract) · `MOCK` (`{ username, zmommst, zmomrel, zmomacc, write }`, all `true`) · `usernameUrl(id)`, `zmommstUrl(id)` · `requestErrorMessage(status, body) → string` (`body.message` else `Request failed (<status>)`) · `createMockStore(fixtures)` with `username(id)`, `list(id)`, `create(body)`, `update(body)`, `remove({ id })`, each throwing `{ message }` for unknown ids
**Invariants:** no leading `/`; bannerId URL-encoded; fixtures from `../samples/` (dates/ids cleaned, `xmommstMessage` added), plus one Banner ID with no records and one unknown.
**Tests first:**
- every pipeline name has no leading `/` · fails with `/shu-…`
- zmommstUrl → `shu-admin-get-zmommst?bannerId=12636344` · fails on wrong param name
- requestErrorMessage with and without `message` · fails if generic always
- mock create then list shows the record with backend-owned fields set · fails if store ignores create
- mock update/remove unknown id throws · fails if silent
**Acceptance:** `npm run test:domain` all pass.
**Commit:** `feat: add pipeline endpoints and mock store`

### Unit 5: data hooks — ~15k

**Files:** create `src/hooks/useDebouncedValue.js`, `src/hooks/useXmommst.js`, `src/hooks/useXmommstAccess.js`; modify `src/hooks/useEthosMutation.js`, `src/hooks/index.js` · **Tests:** lint only (no React test runner)
**Interfaces:** consumes units 1, 3, 4 · produces `useDebouncedValue(value, ms=500)` · `useXmommstAccess() → { canRead, canWrite }` (from `useUserInfo().roles` and `useCardInfo().configuration`) · `usePerson(bannerId)`, `useRecords(bannerId)`, `useCodes()` (each `useMockableEthosQuery`, enabled only for a valid id and `canRead`) · `useSaveRecord()`, `useDeleteRecord()` (mock store when `MOCK.write`, else `useEthosMutation`; invalidate `['zmommst', bannerId]`)
**Invariants:** `useEthosMutation` accepts 200/201 with an empty body and throws `Error(requestErrorMessage(status, body))` on ≥ 400 (fixes the current `response.json()` on empty bodies); `usePerson` treats an empty 200 body as `{}`.
**Implementation:** follow `useMockableEthosQuery.js`; query keys `['username', id]`, `['zmommst', id]`, `['codes', 'rel'|'acc']`.
**Acceptance:** `npm run lint` clean; `npm run test:domain` still green.
**Commit:** `feat: add xmommst data and access hooks`

### Unit 6: manifest and card — ~10k

**Files:** modify `extension.js`, `src/cards/ShuferpaXmommstCard.jsx` · **Tests:** lint, build
**Implementation:** `extension.js`: publisher, card title "XMOMMST Admin", description, `configuration.client` with text fields `writeAccessRoles`, `readAccessRoles` (labels say comma-separated). Card: Typography sentence + Button "Open" navigating to the page (`navigateToPage({ route: '/' })` from the card props), per `examples/Button.jsx`.
**Acceptance:** `npm run lint` and `npm run build-dev` clean.
**Commit:** `feat: add xmommst card and card configuration`

### Unit 7: search page and table — ~20k

**Files:** modify `src/pages/Home.jsx`; create `src/components/xmommst/SearchField.jsx`, `RecordsTable.jsx` · **Tests:** lint, build, browser on mocks
**Interfaces:** consumes units 1, 2, 5.
**Implementation:** TextField with `inputMode="numeric"`, value normalized by unit 1, synced to `?bannerId=` (`useLocation`/`useHistory`, router v5); debounced value drives `usePerson` + `useRecords`; states: no access Alert, helper text, CircularProgress, not-found Alert, error Alert, heading (unit 1), empty message (decision 14), AdvancedTable of `toRecordRow` rows, actions column and "Add record" only with `canWrite`.
**Acceptance:** lint + build clean; on mocks: 7 digits → no request, unknown id → not found, empty id → decision 14 message, reload keeps the id.
**Commit:** `feat: add xmommst search page and records table`

### Unit 8: record dialog and delete — ~20k

**Files:** create `src/components/xmommst/RecordDialog.jsx`, `DeleteRecordDialog.jsx`; modify `src/pages/Home.jsx` · **Tests:** lint, build, browser on mocks
**Interfaces:** consumes units 3, 5.
**Implementation:** TanStack Form in an EDS Dialog; Dropdowns with `required` fed by `codeOptions` (current code on edit); description field only for `O`; name input `pattern={NAME_PATTERN}`, `cleanName` + `isValidName` on save with a 10-second Snackbar on failure (F5); PIN `minLength`/`maxLength` 4, `pattern="[0-9]*"`, `inputMode="numeric"`; Status switch on edit; Save/Cancel `disabled={saving}`; success/error Snackbar (F9). Delete: `examples/ConfirmationDialog.jsx` with decision 13 copy, same Snackbars.
**Acceptance:** lint + build clean; on mocks the user walks create (O and non-O), edit (D record), delete cancel/confirm, write error, read-only role.
**Commit:** `feat: add xmommst record dialog and delete`

### After unit 8

Read-only review of units 5–8, one fix pass. Then the user flips one `MOCK` flag at a time as pipelines go live.
