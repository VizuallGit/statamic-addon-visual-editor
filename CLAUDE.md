# Visual Editor (Vue addon) — Fable brief

> **Audience:** Claude Fable.  
> **This repo** is the source of truth for all Visual Editor code (PHP, JS, CP CSS, tags, dock, AI, comments). Packagist builds from here.  
> **The site** is `~/Sites/vizuall-skabelon`. Product intent, theme, Antlers, and fieldsets live there — read that [CLAUDE.md](file:///Users/flemmingmeyer/Sites/vizuall-skabelon/CLAUDE.md) too.  
> **Do not** paste secrets. Do not commit API keys.

When a VE change must run on the site: commit + push here (auto-tag), then `composer update statamic-addon/visual-editor` on the site. Do not symlink `vendor/statamic-addon/visual-editor`. Do not write VE logic into the site.

---

## What the human wants (read this first)

The product is a Statamic page builder **and** a place to write custom sections in the template dock. Both stay.

The authoring feel should be **Astro-like**: type HTML, CSS, or a class in the dock, and the focused Live Preview section updates in the **same frame**. Statamic + Antlers remain the published site. Instant is a **paint path**. PHP morph is the **source of truth** afterwards.

**Do not** rebuild the frontend in Astro, Blade, Nuxt, or headless GraphQL. **Do not** compile Antlers in the browser. **Do not** keep a second `.astro` / `.jsx` copy of a partial.

**This pass:** inventory this repo, tighten how the code is written (split god files, one source per concern, no stacked fallbacks), then make dock HTML Instant. Do **not** start by rewriting overlay / morph / bridge.

---

## Surfaces (a change touches one)

1. **Core preview runtime** — `resources/js/preview.js`, `overlay-host.js`, `bridge.js`, plus the CP-side Live Preview lifecycle in `lp-replay.js` (`lastPreviewUrl`, `watchPreviewRenders`, `replayLivePreview`) and `gotoOverlay` / `openOverlay` in `cp.js`. **Locked.** Open these only if the human says in the same message that the bug is overlay, morph, eject, or bridge.
2. **Annotations** — `{{ visual_edit }}` (PHP) + CP highlight.
3. **Set insertion** — plus in preview → Statamic’s own Search Sets (`handleAddBlockNative` / `openSetPickerOverPreview`). Do not replace with a custom picker.
4. **Panels** — focus, globals, library, chrome, performance, HTML tree.
5. **Dock** — `code-dock.js` (save) + `dock-instant-preview.js` (paint). Instant HTML lives here.
6. **AI / comments / sibling-sync / previews** — feature modules via bus only.

No import from panels/dock into overlay, preview, or `replayLivePreview`.

---

## Instant HTML paint (Astro-feel, still Antlers)

**File (only this unless a tiny helper must sit beside it):**  
`resources/js/dock-instant-preview.js`

Standalone CP script. Not `addon.js`. Instant mode is already named `astro`: classes and CSS paint in the same frame; PHP morph is **not** on the paint path.

**Since 17 September 2026 (WP3):** `paintLive()` runs `paintStructure()`: the template is parsed with plain `{{ field }}` / `{{ nested.path }}` replaced by the value from the publish form (`Statamic.$events` → `publish-container-created` → the row with the section's `data-sid`), every other Antlers tag becomes a marker, and `morphElement()` walks live section and template together: attributes and classes are synced (server-owned `data-sid*` / `data-sve-*` never touched, nothing removed), a renamed tag keeps the live node's attributes and children, a new wrapper takes the existing children in, new static markup is created, and a live node is removed only where its parent holds no marker. Anything with a marker waits for the morph. If the walk throws, `syncClasses()` runs instead. `window.__sveInstantTrace` says what the last paints decided. Proven by `tests/browser/instant-paint.mjs`, which serves the working-tree script into a real Live Preview and types a probe. The scoped-pane branch (`data-sve-html-scoped`) uses the same walk but is not covered by that test yet.

**Still true:** `stripAntlers()` does not evaluate anything but a field path; `{{ if }}`, loops, partials and `visual_edit` are the morph's. `htmlCmView()` reads the editor off `.cm-content.cmTile` (current @codemirror/view) with `cmView` as the older fallback.

**Done when:** a wrapper / heading tag / extra static HTML in the HTML pane updates the section immediately with current field text still visible; Instant class/CSS still works; real Antlers tags still wait for morph; kernel files untouched.

---

## How to rewrite without breaking the editor

1. Inventory. Read live behavior. Do not cargo-cult structure.
2. Instant HTML (above) — first concrete win, one surface.
3. Split god files behind `cp/bus.js` (`ask` / `emit` / `register`). `code-dock.js`, `cp.js`, `section-library.js`, `globals-panel.js` are the weight. Kernel stays non-Vue.
4. One data source per concern. No retries, DOM fallbacks, or timeouts that hide the wrong source.
5. Dist: four Vite entries; `addon.js` imports overlay-host by exact hash. `emptyOutDir: false`. Never build overlay-host / preview / bridge alone. `node scripts/assert-dist-integrity.mjs` if the toolbar vanishes; recover from `resources/dist/locked`.
6. Statamic field CP is sacred. Append config on **one** fieldtype, or a side script. Never subclass + `::register()` an existing handle. Never wrap native Vue field components.

**Do not use as source:** `~/Sites/statamic-addon-visual-editor` (restore), `… copy`, `…-app`, `…-vue-backup-*`, site `public/vendor/visual-editor`.

---

## Hard constraints

- Never replace native Statamic fieldtypes (text, integer, replicator, grid, bard, iconify, …).
- Plus under a block opens Statamic Search Sets. Keep `handle` on `groupedPickerSets` (not `all`). `isPreviewMessageSource` must accept `event.source === overlay`. Open the picker in `setTimeout(0)`.
- Overlay open → host swallows Vite `full-reload`. Site `npm run dev` stays on for the public frontend.
- Tags that must keep working on the site: `visual_edit`, `style_push` / `script_push`, `responsive_css`, `sve_tw`, `sve_props` / `sve_defaults`, `theme_color_scale`.
- Danish UI copy may remain; identifiers stay English.
- Ask instead of a second code path. Delete dead code. Stop at the boundary when something breaks far away.

---

## Sibling sync (works; do not commit unless asked)

Lives in this repo: `resources/js/sibling-sync.js`, `src/SiblingSync.php`, tests. Do not rewrite sync/badge/lock as a side effect of Instant or CSS work. Working copy: `.restore/sibling-sync-working/`.

---

## V2 working rules (since 17 September 2026)

The plan with measured numbers is `docs/v2-plan.md` on the site. These are the rules that came out of WP1 and WP2.

**One helper, one place — `resources/js/lib/`.** `csrf.js`, `preview-frame.js`, `style.js` (`injectStyle`), `i18n.js` (`t`, `statamicTranslate`), `vue-vm.js`, `drag.js`, `dock-host.js`, `codemirror.js`, and since WP4a: `ids.js` (every shared element id, attribute and storage key), `values.js` (`unwrapRef`, `dataGet`, `findPathByUid`, `firstEntryId`, `humanizeHandle`), `config.js` (`featureOn`, `sectionField`), `live-preview.js` (`lpHeader`, `livePreviewEditorEl`, `currentEntryId`, `currentCollection`), `dom.js` (`remToPx`), `publish-containers.js` (the one list of Statamic's publish containers: `registerContainerEvents`, `activeContainers`, `onContainer`, `addContainer`, `registerContainerSource`). A constant or a pure helper never goes on the `sve` registry: reading it there at module top level is how a late panel handed a neighbour `undefined`. Nor does anything nobody reads: 300 `sve.X = X` lines that no file referenced (not even as a string for a lazy stub) went in WP4c. Put a name on the registry only when another file calls it, and then prefer a direct import from `lib/` or the bus. No file may define its own copy of these. If a module needs the CSRF token, the preview iframe, a `<style>` tag, a translated string or CodeMirror, it imports from `lib/`. Every lib file starts with a header saying what it owns and what it may import; a new lib file follows the same shape.

**Standalone scripts cannot share yet.** The files in `ServiceProvider::$scripts` are served outside the Vite bundle and cannot `import`. Their copies of `t()`, `csrf()`, `ensureStyles()` stay until WP6 folds them into the bundle. Do not add new standalone scripts.

**Safety net runs before every push.**

```
npm run check          # isolation lint + dist integrity + node --test (tests/js)
npm run test:browser   # Live Preview smoke test against the site (see the file header for env vars)
SVE_WORKTREE=1 npm run test:browser   # same, but the CP loads THIS checkout's build — prove a bundle before release
npm run test:instant   # dock instant paint, likewise served from the working tree
```

`scripts/assert-isolation.mjs` covers all of `resources/js`: kernel may import only kernel; `cp/` may import neither kernel nor `cp.js`; panels are held by `scripts/isolation-allowlist.json`, which may only shrink (a stale entry fails the run). New coupling to `cp.js`, `lp-replay.js` or the kernel is a failed lint, not a judgement call.

**Release pipeline — nothing is copied by hand.** Edit here → `npm run cp:build` (one full build; dist is committed) → commit source + dist together → push (auto-tag) → on the site `composer update statamic-addon/visual-editor --no-cache` → `registerScript()` republishes the standalone scripts and `BuiltAssets::linkForControlPanel()` points `public/vendor/visual-editor/build` at the installed package. Verify with the manifest md5: repo, `vendor/` and `public/` must be identical. Never write into `vendor/` or `public/vendor/` by hand.

**Known baseline (17 Sep 2026):** 15 PHP tests fail before any V2 work (SveDefaults props_ rename, ComponentProps, StripVisualIds, InjectBridgeScript). The browser smoke test's "code dock" step is timing-sensitive on both v1.1.139 and v1.1.140; it retries once.
