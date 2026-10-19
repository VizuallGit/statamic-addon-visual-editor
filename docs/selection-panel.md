# The selection panel (the left column in Live Preview)

Since 1.1.553 the left column has one route: **what is selected is drawn, from
the form's values, with Statamic's own fields.** Nothing of Statamic's form is
isolated, marked, mounted on demand or waited for.

## The pieces

| File | Job |
|---|---|
| `resources/js/lib/selection.js` | The one selection: `select({ uid \| tab, ctxName, field, source })`, `clearSelection`, `currentSelection`, `onSelection`. |
| `resources/js/lib/publish-containers.js` | The forms' publish contexts, registered from inside each form (`registerContainerContext`), named by container: `base` (the page), `sve-global-section`, `sve-chrome`. `whenContainerContext(name, ms)` waits for one. |
| `resources/js/cp/panel/resolve.js` | Pure: a row's id → its values path, meta path and field definitions (Replicator set, Bard set, Grid row) or a whole tab (header, footer). |
| `resources/js/cp/panel/store.js` | Reactive: the selection resolved against the registered contexts, newest first. |
| `resources/js/cp/surfaces/SelectionPanel.vue` | Draws the row: header (icon, name, back), then `PublishFieldsProvider` + `PublishFields` from `@statamic/cms/ui` on the owning form's own `PublishContainerContext`. |
| `resources/js/selection-panel.js` | The host in `.live-preview-fields`; hides Statamic's form (not `display:none` — see below); routes: `selectFromPreview`, `selectRow`, `selectTab`, `leaveSelection`. |
| `resources/js/lp-width.js` | The column's frame: width, the Page Settings/SEO bar, the panel toggle, `activateSectionsTab`. |

## Who writes the selection

- A click in the preview → `cp-shell/add-section.js` → `selectFromPreview(win, { uid, scope, field })`.
- The block tree, the outline, the accessibility scan, the HTML tree, the library's gear, a component's props host → `selectRow` / `selectFromPreview`.
- The panel's own back arrow → the parent row, the tab it was opened from, or the page.
- The Page Settings icon, the Hide/Show toggle → `leaveSelection` / `clearSelection`.
- The reload button → `lp-resume.js` remembers the selected page row and selects it again once the page's context is back.

## The three forms

- **Page**: the `sve_lite_sections` field (`side/lite-sections.js`) sits in the page form, injects its publish context and registers it. It draws nothing. It also holds the set configs a fieldset edit or a new set writes into (`refreshLiteSetFields`, `addLiteSetConfig`).
- **Global section** (`global-section.js`): Statamic's `EntryPublishForm` mounted headless in the column with the entry's Inertia props; its sets register the context; the first row is selected; a Vue watch on the values (debounced 250 ms) stashes them for the preview; Save presses the form's own Save.
- **Header / footer** (`chrome.js` + `cp/surfaces/ChromeForm.vue`): Statamic's `PublishContainer` on the globals screen's Inertia props under the name `sve-chrome`; the half is a tab of that form, a widget a row in it. Changes arrive on `onChange` and go to the globals stash; Save runs Statamic's save pipeline (`@statamic/cms/save-pipeline`).

## Rules learned the hard way

1. Hide Statamic's form with `position:absolute; visibility:hidden` at the column's width — `display:none` zeroed the publish tabs, their overflow check re-rendered, and the active tab's content (the lite field, and with it the page's context) unmounted.
2. `_visual_id` (auto_uuid) renames a row drawn twice at once. The panel filters that field out and switches its field tree one tick later.
3. A field still focused when its tree goes throws in Bard's blur handler — blur first, switch a few ms later.
4. A production Vue keeps no component on DOM nodes (`__vueParentComponent` is dev-only) and `app._instance` is null on publish screens. Read nothing off the DOM; the forms register their context from inside.
5. A `<script setup>` page has no `render` to patch in a production build — never borrow a CP page component; mount Statamic's `PublishContainer` with the page's props instead.

## Proving it

- `npm run check` — isolation (no panel may import the kernel), dist integrity, protocol, node tests (`tests/js/selection.test.js`, `panel-resolve.test.js`, `publish-contexts.test.js`).
- `node tests/browser/selection-panel.mjs` — against a site with the production CP build (`APP_DEBUG=false`): every kind of click three times gives the same panel, timings, back arrows, trees open with the panel standing, Page Settings, header as a tab and widget as a row, a global section's rows.
