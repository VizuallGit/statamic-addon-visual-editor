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

   **The kernel since WP5c:** `bridge.js` is a barrel of about 70 lines (imports, constants, `t`, `featureOn` and the boot call). Its code lives in `bridge/`, one file per region — `component-pick`, `messages`, `inline-edit`, `row-toolbar`, `global-sections`, `header-footer`, `row-caps-move`, `grid`, `drag`, `editing`, `sid-targets`, `outline-nav`, `inserters` — and the 24 module variables the regions wrote across each other are one object, `bridgeState` in `bridge/state.js`. The lint treats `bridge/` as kernel: those files may import only each other, the kernel-side modules and `lib/`. Same recipe and same tools as the dock; same rule that this stays locked unless the human names the bug.

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

**Panel APIs are direct imports of function declarations (WP4d, lp-panel first).** `cp.js` and fourteen other files import `setLpMode`, `persistDockedPanel`, `paintLpActiveControl` … from `lp-panel.js`; lp-panel's thirteen registry lines are gone. The cycle `cp.js ↔ lp-panel.js` is safe because only *function declarations* cross it (ESM initialises those before any module body runs) and nothing calls across it at module top level. Two rules keep it safe: a panel's shared constants live in `lib/ids.js`, never imported from a panel or from `cp.js`; and no top-level statement in any module may call into another module. focus-panel followed in WP4e (28 functions, eight of them still on the registry for lite-sections.js until WP6). Next: section-library, globals-panel, inline-edit. The step is scripted: the codemod lists a panel's read functions, rewrites every `sve.fn` into an import, drops dead registry lines and unread live properties, and keeps a compat line only where a standalone script reads the name. One panel per release, proven with `SVE_WORKTREE=1 npm run test:browser` — and check that `npm run cp:build` actually succeeded before trusting that run: a failed build leaves the previous dist on disk.

**The working-tree proof is only honest when entries are served by stem, on both routes.** The CP loads from `/vendor/visual-editor/build/…`; the preview document loads `bridge.js` from the addon's own route, `/!/sve/build/…`. The first version of the harness intercepted only the CP route, so v1.1.156's split bridge was "proven" against the installed bridge and shipped with a boot-time TDZ. Both routes are intercepted now; a passing run must show the bridge's messages (`bridge sent [hover… click]`), not `[]`.

**A region file must not run anything at evaluation time that reaches a sibling.** The bridge's `initBridge()` sat at the end of the last region; as a dependency of an earlier region that file was evaluated first, before the barrel's constants existed. `scripts/split-regions.mjs` now moves such statements into the barrel after every `export *`, where all regions have run.

**The working-tree harness serves one module URL per entry and the standalone scripts too.** Lazy chunks import the entry by *its* hashed name (`./addon-<hash>.js`); the CP's HTML names the *installed* hash. Served as-is, the browser would load the entry twice under two URLs — two copies of the editor's state — so `tests/browser/serve-worktree.mjs` rewrites this checkout's entry names to the installed ones in every body it serves, maps only the installed entry names by stem (any other `addon-*.js` request is served as itself, as production would), answers `/vendor/visual-editor/js/*.js` from `resources/js`, and 404s anything the checkout does not have rather than falling through to the installed copy. The smoke test's last step asserts that every build file the browser loaded is one the manifest names — that step is what caught the next paragraph's bug.

**Lazy panels are reached through `lazy/*.js` (WP4h).** block-tree, html-tree, outline-panel, performance-panel, page-activity, schema-panel and ai-text are lazy chunks. Eager code never imports them — that would pull them into the main bundle — it imports the facade (`lazy/listview.js`, `lazy/html-tree.js`, …). A facade answers from the loaded module (`loadedPanel(key)` in lazy-panels.js) and, while the panel is away, does what the old registry stub did: loads it first, answers a default, or skips. `ensurePanel(key)` resolves with the module and remembers it. Shared mutable state is never a registry property any more: readers import the live binding (`activeChromeKind` from globals-panel, `editSession` from inline-edit, `chromeInlineKind` from chrome), and what the replay core owns is asked on the bus (`ask('lp:lastPreviewUrl')`, registered by lp-replay.js).

**The `sve` registry is gone (WP6c).** `cp-registry.js` and `window.sve` no longer exist; every cross-feature call is an import, a `lazy/*` facade, shared state on `sveState` (cp-state.js) or a bus message (`lp:replay`, `lite:solo`, …). Nothing may be hung on a global object for another file to find: if two files need to share, one imports the other or both use the bus. No file may define its own copy of a `lib/` helper either. Every lib file starts with a header saying what it owns and what it may import; a new lib file follows the same shape.

**Side scripts live in `resources/js/side/` (WP6a/b).** Fourteen former standalone scripts are imported, verbatim IIFEs with their own run-once guards, by `side/index.js` — the first import in `addon.js`, in the order their script tags used to run. Two stay in `ServiceProvider::$scripts`: `dedupe-cp-fetch.js`, because Iconify's fieldtype captures `fetch` into a module variable when its own bundle evaluates (measured in its build: `let K = fetch`), so the patch must be in place before any module runs — only a classic script is; and `dock-instant-preview.js`, proven on its own by the instant-paint test. `disable-publish-stack-pin.js` was deleted in WP6c: the observer it neutralised lived in an old addon.js and exists in no build any more. `section-meta-prefetch.js` is a real module since WP6b-2a: it imports `fetchSetMeta` / `fetchNestedSetMeta` from the section library and is imported by `addon.js` right after it (not through `side/index.js` — pulling the library into the first import would change the module graph's evaluation order). Its `window.fetch` patch and its own URL-keyed JSON cache are gone; the library's `sectionMetaCache` is the one cache, and `invalidateFieldCaches` drops from it by import. The smoke test proves the prefetch: hovering a library card must issue `/!/sve/section-meta?…`. `lite-sections.js` is a real module since WP6b-2b, imported by `addon.js` right after `focus-panel.js`: it imports `isolateSoloSection`, `soloSectionSettingsNow`, `paintFocusHeader`, `focusRowMeta`, `focusBack`, `ensureFocusHeader` from the focus panel, and the focus panel reaches it only through the bus — `soloSection` / `soloSectionSettings` `ask('lite:solo' | 'lite:solo-settings', …)` before isolating (lite mounts the row first and answers true when it hosts the list), and `paintFocusHeader` emits `focus-header:painted` (lite stamps its "load all fields" button on it). No wrapper is put around any function at runtime any more; every caller of `soloSection`, including the ones WP4 turned into direct imports, gets the mount-first behaviour V1 had. html-tree.js and section-fields.js import `openLiteSection` / `refreshLiteSetFields` from it. The smoke test asserts `data-sve-lite=on` after the preview click. The side scripts import their helpers from `lib/` since WP6b-3 (`t`, `csrfToken`, `injectStyle`, `featureOn`, `collectionPresets`, `collectionTemplatesCollection`, and `bpBase` from breakpoints.js) — no file in `side/` defines its own `t()`, reads `$config` or creates a `<style>` tag by hand. Their bodies are still the IIFEs they were (4-space indented, `var`), which is deliberate: verbatim first, formatting later. None of them keeps a run-once flag on `window` any more: a module runs once. Each calls `mark('<name>')` from `lib/debug.js`, which records into `window.__sveDebug.ran` **only if** the page created that object before boot — the browser tests do (`evaluateOnNewDocument`); a real CP page never has it. That is the one sanctioned test hook; `grep window.__sve` must otherwise only hit the kernel (`__sveFeatures`/`__sveStrings` are PHP's handoff to the bridge) and the standalone paint script. Do not add new standalone scripts.

**The smoke test starts from a fixed layout and clicks like a person.** The editor hydrates docks, device and zoom from the user's `sve_chrome` preferences on the server and writes them back on every run; the test resets that block on the test account before and after each run (`SVE_PREFS='{…}'` seeds a layout to test). It waits for the preview DOM to settle, aims at an *uncovered* text field (scrolling it into view), waits until the point is hit-testable — while the overlay host's View Transition (`html.sve-morphing`, ~400 ms) runs, every click lands on `<html>` — and asserts a `click` message reached the CP. The preview's viewport varies between runs (docks open or not at boot); the test reports it. `SVE_DEBUG=1` prints which frame received the mouse and what the overlay had at the point.

**A standalone script must never `import()` a hashed build file.** `html-tree-section-sync.js` did — `import("/vendor/visual-editor/build/assets/addon-CwKv_5uQ.js")` to read the bus's `ask` off a minified export. The name froze at one build; `emptyOutDir: false` kept the file on disk, so every later release silently ran a second, stale copy of the whole CP bundle beside the live one (own `message` listeners, own state). On v1.1.157 that copy swallowed the preview's click. The script is gone (18 September 2026): `handleRemoveRow` emits `row:removed` on the bus, and `html-tree.js` and `dock/dock-api.js` each listen for what concerns them — no wrapper, no 500 ms poll, no registry line. Anything a standalone script needs from the bundle is a `window.sve` compat line until WP6, never a build file by name.

**Safety net runs before every push.**

```
npm run check          # isolation lint + dist integrity + node --test (tests/js)
npm run test:browser   # Live Preview smoke test against the site (see the file header for env vars)
SVE_WORKTREE=1 npm run test:browser   # same, but the CP loads THIS checkout's build — prove a bundle before release
SVE_WORKTREE=1 npm run test:instant   # likewise for the dock chunk
SVE_BUILD_DIR=<dir> …                 # serve another build, e.g. `vite build --minify false --outDir <dir>` for readable stack traces
SVE_PREFS='{"sve-lp-device":"Tablet"}' … # start the smoke test from a saved layout (keys as in chrome-prefs.js)
SVE_DEBUG=1 …                         # which frame got the mouse, the overlay's hit stack, a screenshot in the temp dir
npm run test:instant   # dock instant paint, likewise served from the working tree
npm run test:switch    # opening a section writes nothing: no save, no section reload (installed PHP; see the file header)
```

`scripts/assert-isolation.mjs` covers all of `resources/js`: kernel may import only kernel; `cp/` may import neither kernel nor `cp.js`; panels are held by `scripts/isolation-allowlist.json`, which may only shrink (a stale entry fails the run). New coupling to `cp.js`, `lp-replay.js` or the kernel is a failed lint, not a judgement call.

**Release pipeline — nothing is copied by hand.** Edit here → `npm run cp:build` (one full build, then `scripts/prune-dist.mjs` keeps only what the manifest names and refreshes `locked/` with the live addon and its imports — dist is committed and is ~5 MB, not the 550 MB of every hash ever built) → commit source + dist together → push (auto-tag) → on the site `composer update statamic-addon/visual-editor --no-cache` → `registerScript()` republishes the standalone scripts and `BuiltAssets::linkForControlPanel()` points `public/vendor/visual-editor/build` at the installed package. Verify with the manifest md5: repo, `vendor/` and `public/` must be identical. Never write into `vendor/` or `public/vendor/` by hand.

**Known baseline (17 Sep 2026):** 15 PHP tests fail before any V2 work (SveDefaults props_ rename, ComponentProps, StripVisualIds, InjectBridgeScript). The browser smoke test's "code dock" step is timing-sensitive on both v1.1.139 and v1.1.140; it retries once.

**The server is where editing happens.** `GET /!/sve/section-template` answers `writable.template` / `writable.tw` (can this server's PHP write the file and its baked CSS?) and the dock says so before the first keystroke; a save the server cannot write answers `{ error: 'not_writable' }` (500) and the dock names the cause; `tw_written: false` means the template landed but the Tailwind CSS did not — the dock keeps the compile dirty and says the classes will be missing on the site. A successful save flushes Statamic's static cache when a strategy is configured (Live Preview bypasses it; visitors do not). The site's `docs/server-checklist.md` is the operator's list; keep it true.

**PHP: `bootAddon()` is a table of contents (WP7a).** What used to be 458 lines in `ServiceProvider::bootAddon()` lives in `src/Boot/`, one class per job, each with a static `register()` and the code moved verbatim: `LivePreviewConfig` (request plumbing, preview config; `devices()` runs after the translations are loaded — the order in bootAddon is not tidiness), `ControlPanelScript` (everything `Statamic::provideToScript` tells addon.js, plus `strings()`), `StoreCollections` (the editor's own collections in the nav, template previews), `Routes` (every `/!/sve/…` route), `Utilities` (the Utility pages and who sees them). The provider keeps only what a provider must do. A Boot class in the `Boot\` namespace must `use` the root-namespace classes it calls (`Stores`, `SetMeta`, …) — the provider got them for free, a moved block does not; every one of the 511 tests errored at boot until they were added.

**PHP: `Tags\VisualEdit` resolves through `Tags\Resolve\*` (WP7b).** The tag keeps `index()` and the attribute builders; the lookups moved out verbatim: `BlueprintFields` (fields by handle, set and replicator config, the type chain — pure, static, with the `$fieldsByHandle` cache), `Icons` and `Placeholders` (pure, static), `Controls` and `BardConfig` (need the tag's params and context: `new Controls($this->params, $this->context)->resolve(…)`), and the trait `ResolvesScope` (section type, set chain, field type — the "where are we" every resolver and the tag share; each has `$this->params`/`$this->context`). Two traps a mechanical move must check for, because the tag's `catch (\Throwable)` blocks turn them into silently empty attributes rather than errors: a moved method that reads a *static property* or a constant declared on the old class (`self::$fieldsByHandle` — declare it where the method now lives), and a class in the root namespace used without `use` (fine in the provider, not in `Boot\` or `Tags\Resolve\`). The 65 VisualEdit tests are the proof; run them before trusting a move.

**WP7c: the tag is 199 lines; nothing in `Boot/` or `Tags/Resolve/` is over 315.** `Tags\VisualEdit` keeps `index()` and builds its attributes through `Resolve\Attributes` (the `data-sid-*` core for sets and fields) and `Resolve\SetAttributes` (insert control, outline, grid, global-edit, row template — composes `Attributes`); the remaining lookups are traits it and the resolvers share: `ResolvesScope`, `ResolvesFields` (field match, labels), `ResolvesIcons`, `ResolvesInserts` (replicator config + its cache). `Boot\Routes` is a table of contents for `PreviewRoutes`, `DockRoutes`, `EditorRoutes`; `Boot\ControlPanelScript` asks `ScriptCollections` and `ScriptChrome`; `Resolve\ReplicatorLookups` holds the two recursive set/replicator walks. One more trap for a mechanical move: a helper introduced into `index()` must not reuse a local name the method already has (`$sets` was the list of sets — the tests said "call to a member function on array"). Still over 300 lines: 26 domain classes (`SectionTemplate`, `FileManager`, `DataVars`, `SetPreviewGenerator`, …) — WP7d, one at a time, tests first.

**The protocol is written once: `lib/protocol.js` (WP6c-2).** `SOURCE` is the mark on every message, `MSG` holds every type the preview, the overlay host and the Control Panel send or handle (100, measured: every object that carries `source:` and every comparison on `data.type`; the first, broader count also caught Bard node types and `typeof x.type === 'string'` — those are not messages), `CHANNEL` the two named channels for publish values. Senders write `{ source: SOURCE, type: MSG.CLICK, … }`; receivers compare `data.type === MSG.CLICK`. `scripts/assert-protocol.mjs` (in `npm run check`) fails on a literal source mark, a literal `type:` in an object that carries `source:`, or a comparison of `data.type` / `e.data.type` / `msg.type` against a literal — Bard node types and `typeof x.type` are not messages and are left alone. The standalone paint script cannot import and keeps its literals. Since every entry imports the module, Vite emits it as one shared chunk (`assets/protocol-*.js`) that the bridge, preview and overlay host each load; the `/!/sve/build/{path}` route allows every manifest file, so that is fine — and the same was already true of `html-pick-align` and `ai-text-icon`. Names are the wire strings they always were; a new message adds a line to `MSG` first.
