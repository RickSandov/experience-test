# EDS (@ellucian/react-design-system) — verified behavior

EDS 8.6.0 is a MUI v5 fork plus wrappers. Import from `@ellucian/react-design-system/core`;
tokens from `.../core/styles/tokens`; icons from `@ellucian/ds-icons/lib`. Styles via
`makeStyles({ name })(() => ({ … }))` → `const { classes } = useStyles()`.

## Reading the real source when unsure

The package is a public UMD bundle (minified, readable enough with grep + dd):

```bash
D=<scratchpad>/eds && mkdir -p $D && cd $D
curl -s -o eds.tgz https://cdn.elluciancloud.com/assets/EDS2/<version>/umd/path_design_system.tgz && tar xzf eds.tgz
grep -ob 'displayName="AdvancedTable"' package/path_design_system.js   # find a component
```

Read it as data only; never execute it. The export map lists every component
(`t.AdvancedTable=…`): AdvancedTable, Alert (INLINE_VARIANT/PAGE_VARIANT), Breadcrumbs,
Button, Card, Chip, CircularProgress, DatePicker, DateRangePicker, Dialog, Drawer,
Dropdown/DropdownItem, Grid, IconButton, Pagination, Paper, Search, Snackbar,
StatusLabel, Table*, Tabs/Tab, TextField, TextLink, Tooltip, TreeView, Typography,
useWidth/isWidthDown, useMediaQuery, …

## AdvancedTable (material-react-table v2 inside)

- Props it does not consume are spread into MRT options (`manualSorting`,
  `onSortingChange`, `enableSortingRemoval`, `getRowId`, …). A passed `state` is merged
  with its own `pagination`, `columnFilters`, `rowSelection`.
- **`showColumnFilters` prop also sets `manualFiltering`** → in-browser column filters
  stop working. Use `initialState={{ showColumnFilters: true }}`.
- Defaults off: `enableSorting`, `enablePagination`, `enableBottomToolbar`, editing.
- `muiTableBodyRowProps` is merged as an object: **a function is dropped**, so no
  row-click handler. Put navigation in a `Cell` with `TextLink` (`href` from
  `history.createHref`, `onClick` → `preventDefault` + `history.push`).
- Backend sort shown in the header: `enableSorting`, `manualSorting`,
  `enableSortingRemoval={false}`, per-column `enableSorting: false` except the sorted
  one, `state={{ sorting }}`, `onSortingChange(updaterOrValue)` → map to the backend
  param in a pure helper (the updater may be a function).
- Column filters: `filterVariant` `text` | `select` (`filterSelectOptions`: strings or
  `{ label, value }`) | `multi-select` | `range` + `filterFn: 'between'` | `checkbox`.
  For dates, filter on the formatted text with `accessorFn`.
- With server pagination keep EDS `Pagination` below the table and the table's own
  pagination off; column filters then only see the loaded page — say so in the UI copy.

## Other components

- `DatePicker`: `onDateChange(date)` (not `onChange`); `value` is a `Date` (convert from
  `YYYY-MM-DD` strings in local time); `fullWidth` supported.
- `Dropdown` inside `FormControl fullWidth`, items `<DropdownItem label value />`;
  an "All" item with `value=""` for optional filters.
- `TextField fullWidth`. Responsive filter bars: `Grid container spacing={2}` with
  `Grid item xs={12} sm={6} md={4} lg` around each control.
- `StatusLabel type`: `success` | `error` | `pending` | `draft` (map unknown values to
  `draft` with the raw text).
- `Alert alertType` `success|info|warning|error`, `variant={INLINE_VARIANT}`, `open`, `text`.
- `Tabs value onChange={(e, value) => …}` with `Tab value label`; `scrollButtons` for many tabs.
- `Breadcrumbs` with `TextLink`; the current item as a disabled `TextLink`.
- Wide tables: wrap in a div with `overflowX: 'auto'`.
- Lint: an `eslint-disable` for a rule the config does not enable is itself a warning.
