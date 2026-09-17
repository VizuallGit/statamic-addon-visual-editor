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

   **The CP shell since WP5a:** `cp.js` is a 47-line barrel. Its code lives in `cp-shell/`, one file per former region — `sets.js`, `preview-chrome.js`, `block-order.js`, `header-toolbar.js`, `grid-rows.js`, `add-section.js`, `boot.js` — each importing exactly what it uses from its siblings, `lib/` and the panels. Panels keep importing from `cp.js`; a panel importing `cp-shell/*` directly fails the lint. The split was made by `scripts/split-regions.mjs` (verbatim slices along `// ===== region =====` markers; refuses when a top-level initializer reads a sibling region) after `scripts/measure-regions.mjs` showed no `let` written across regions. The recipe for the next god file: mark regions, `measure-regions`, hoist every cross-written `let` with `hoist-state`, measure again (its `let` report has no scope analysis, so confirm a leftover with `hoist-state` in dry-run before believing it), split, build, `npm run check`, both browser tests with `SVE_WORKTREE=1`.
2. **Annotations** — `{{ visual_edit }}` (PHP) + CP highlight.
3. **Set insertion** — plus in preview → Statamic’s own Search Sets (`handleAddBlockNative` / `openSetPickerOverPreview`). Do not replace with a custom picker.
4. **Panels** — focus, globals, library, chrome, performance, HTML tree.
5. **Dock** — `code-dock.js` (save) + `dock-instant-preview.js` (paint). Instant HTML lives here. Since WP5b `code-dock.js` is a barrel of about 540 lines (constants, the CodeMirror bindings and `loadCm`); the code lives in `dock/`, one file per region: `layout`, `scope`, `lock-autosave`, `css-tools`, `html-tools`, `history-strip`, `style-modes`, `css-sizes`, `alpine`, `toolbars`, `data-vars`, `save`, `editor`, `dock-api`. The 47 module variables those regions wrote across each other are one object, `dockState` in `dock/state.js` (`dockState.applying`, `dockState.lastLocked`, `dockState.htmlFull` …), hoisted scope-aware by `scripts/hoist-state.mjs`, which refuses to leave a listed name dangling and refuses an object name the file already uses as an identifier. That second guard exists because v1.1.154 shipped with the object called `dock` while 148 places already used `dock` for the dock element: `dock.lastType` became a property read on a local DOM node, and the dock died at boot with a TDZ error.
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

**One helper, one place — `resources/js/lib/`.** `csrf.js`, `preview-frame.js`, `style.js` (`injectStyle`), `i18n.js` (`t`, `statamicTranslate`), `vue-vm.js`, `drag.js`, `dock-host.js`, `codemirror.js`, and since WP4a: `ids.js` (every shared element id, attribute and storage key), `values.js` (`unwrapRef`, `dataGet`, `findPathByUid`, `firstEntryId`, `humanizeHandle`), `config.js` (`featureOn`, `sectionField`), `live-preview.js` (`lpHeader`, `livePreviewEditorEl`, `currentEntryId`, `currentCollection`), `dom.js` (`remToPx`), `publish-containers.js` (the one list of Statamic's publish containers: `registerContainerEvents`, `activeContainers`, `onContainer`, `addContainer`, `registerContainerSource`). A constant or a pure helper never goes on the `sve` registry: reading it there at module top level is how a late panel handed a neighbour `undefined`. Nor does anything nobody reads: 300 `sve.X = X` lines that no file referenced (not even as a string for a lazy stub) went in WP4c. Put a name on the registry only when another file calls it, and then prefer a direct import from `lib/` or the bus.

**Panel APIs are direct imports of function declarations (WP4d, lp-panel first).** `cp.js` and fourteen other files import `setLpMode`, `persistDockedPanel`, `paintLpActiveControl` … from `lp-panel.js`; lp-panel's thirteen registry lines are gone. The cycle `cp.js ↔ lp-panel.js` is safe because only *function declarations* cross it (ESM initialises those before any module body runs) and nothing calls across it at module top level. Two rules keep it safe: a panel's shared constants live in `lib/ids.js`, never imported from a panel or from `cp.js`; and no top-level statement in any module may call into another module. focus-panel followed in WP4e (28 functions, eight of them still on the registry for lite-sections.js and html-tree-section-sync.js until WP6). Next: section-library, globals-panel, inline-edit. The step is scripted: the codemod lists a panel's read functions, rewrites every `sve.fn` into an import, drops dead registry lines and unread live properties, and keeps a compat line only where a standalone script reads the name. One panel per release, proven with `SVE_WORKTREE=1 npm run test:browser` — and check that `npm run cp:build` actually succeeded before trusting that run: a failed build leaves the previous dist on disk.

**The working-tree proof is only honest when entries are served by stem.** `tests/browser/serve-worktree.mjs` answers requests for addon/bridge/preview/overlay-host (and their CSS) from this checkout's manifest whatever hash the installed CP asked for; every other chunk by exact name. Before that fix an old file of the requested name still on disk (`emptyOutDir: false`) was served, and two releases were "proven" against the previous build. When a test passes, check `N build files served from the working tree` is on the order of 35, not 13.

**Lazy panels are reached through `lazy/*.js` (WP4h).** block-tree, html-tree, outline-panel, performance-panel, page-activity, schema-panel and ai-text are lazy chunks. Eager code never imports them — that would pull them into the main bundle — it imports the facade (`lazy/listview.js`, `lazy/html-tree.js`, …). A facade answers from the loaded module (`loadedPanel(key)` in lazy-panels.js) and, while the panel is away, does what the old registry stub did: loads it first, answers a default, or skips. `ensurePanel(key)` resolves with the module and remembers it. Shared mutable state is never a registry property any more: readers import the live binding (`activeChromeKind` from globals-panel, `editSession` from inline-edit, `chromeInlineKind` from chrome), and what the replay core owns is asked on the bus (`ask('lp:lastPreviewUrl')`, registered by lp-replay.js).

**WP4 is done.** What remains on the `sve` registry (34 lines) is what the 18 standalone CP scripts read off `window.sve`; it goes with WP6. No file may define its own copy of these. If a module needs the CSRF token, the preview iframe, a `<style>` tag, a translated string or CodeMirror, it imports from `lib/`. Every lib file starts with a header saying what it owns and what it may import; a new lib file follows the same shape.

**Standalone scripts cannot share yet.** The files in `ServiceProvider::$scripts` are served outside the Vite bundle and cannot `import`. Their copies of `t()`, `csrf()`, `ensureStyles()` stay until WP6 folds them into the bundle. Do not add new standalone scripts.

**Safety net runs before every push.**

```
npm run check          # isolation lint + dist integrity + node --test (tests/js)
npm run test:browser   # Live Preview smoke test against the site (see the file header for env vars)
SVE_WORKTREE=1 npm run test:browser   # same, but the CP loads THIS checkout's build — prove a bundle before release
SVE_WORKTREE=1 npm run test:instant   # likewise for the dock chunk
SVE_BUILD_DIR=<dir> …                 # serve another build, e.g. `vite build --minify false --outDir <dir>` for readable stack traces
npm run test:instant   # dock instant paint, likewise served from the working tree
```

`scripts/assert-isolation.mjs` covers all of `resources/js`: kernel may import only kernel; `cp/` may import neither kernel nor `cp.js`; panels are held by `scripts/isolation-allowlist.json`, which may only shrink (a stale entry fails the run). New coupling to `cp.js`, `lp-replay.js` or the kernel is a failed lint, not a judgement call.

**Release pipeline — nothing is copied by hand.** Edit here → `npm run cp:build` (one full build; dist is committed) → commit source + dist together → push (auto-tag) → on the site `composer update statamic-addon/visual-editor --no-cache` → `registerScript()` republishes the standalone scripts and `BuiltAssets::linkForControlPanel()` points `public/vendor/visual-editor/build` at the installed package. Verify with the manifest md5: repo, `vendor/` and `public/` must be identical. Never write into `vendor/` or `public/vendor/` by hand.

**Known baseline (17 Sep 2026):** 15 PHP tests fail before any V2 work (SveDefaults props_ rename, ComponentProps, StripVisualIds, InjectBridgeScript). The browser smoke test's "code dock" step is timing-sensitive on both v1.1.139 and v1.1.140; it retries once.
