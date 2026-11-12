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

**This pass:** inventory this repo, tighten how the code is written (split god files, one source per concern, no stacked fallbacks). What is typed in the dock is painted by Build's canvas. Do **not** start by rewriting overlay / morph / bridge.

---

## Surfaces (a change touches one)

1. **Core preview runtime** — `resources/js/preview.js`, `overlay-host.js`, `bridge.js`, plus the CP-side Live Preview lifecycle in `lp-replay.js` (`lastPreviewUrl`, `watchPreviewRenders`, `replayLivePreview`) and `gotoOverlay` / `openOverlay` in `overlay-host.js` (`cp.js` only wraps `openOverlay` in a dynamic import). **Locked.** Open these only if the human says in the same message that the bug is overlay, morph, eject, or bridge.

   **The kernel since WP5c:** `bridge.js` is a barrel of about 75 lines (imports, constants, `t`, `featureOn` and the boot call). Its code lives in `bridge/`, one file per region — `component-pick`, `messages`, `inline-edit`, `row-toolbar`, `global-sections`, `header-footer`, `focus-frame` (the shared frame, import-free), `row-caps-move`, `grid`, `drag`, `editing`, `sid-targets`, `outline-nav`, `inserters`, and since then `alpine-state`, `animation-play`, `scroll-mode`, `shortcuts`, `site-inert`, `video-hold`, `viewport` — and the 24 module variables the regions wrote across each other are one object, `bridgeState` in `bridge/state.js`. The lint treats `bridge/` as kernel: those files may import only each other, the kernel-side modules and `lib/`. Same recipe and same tools as the dock; same rule that this stays locked unless the human names the bug.

   **The CP shell since WP5a:** `cp.js` is a 47-line barrel. Its code lives in `cp-shell/`, one file per former region — `sets.js`, `preview-chrome.js`, `block-order.js`, `header-toolbar.js`, `grid-rows.js`, `add-section.js`, `boot.js`, and since then `breakpoint-add.js`, `breakpoint-add-button.js`, `build-switch.js`, `preview-room.js`, `tab-place.js`, `undo-redo.js`, `undo-stack.js` — each importing exactly what it uses from its siblings, `lib/` and the panels. Panels keep importing from `cp.js`; a panel importing `cp-shell/*` directly fails the lint. The split was made by `scripts/split-regions.mjs` (verbatim slices along `// ===== region =====` markers; refuses when a top-level initializer reads a sibling region) after `scripts/measure-regions.mjs` showed no `let` written across regions. The recipe for the next god file: mark regions, `measure-regions`, hoist every cross-written `let` with `hoist-state`, measure again (its `let` report has no scope analysis, so confirm a leftover with `hoist-state` in dry-run before believing it), split, build, `npm run check`, both browser tests with `SVE_WORKTREE=1`.
2. **Annotations** — `{{ visual_edit }}` (PHP) + CP highlight.
3. **Set insertion** — plus in preview → Statamic’s own Search Sets (`handleAddBlockNative` / `openSetPickerOverPreview`). Do not replace with a custom picker.
4. **Panels** — focus, globals, library, chrome, performance, HTML tree.
5. **Dock** — `code-dock.js` (save); Build's canvas paints what is typed (`build-mode/canvas.js`). Since WP5b `code-dock.js` is a barrel of about 610 lines (constants, the CodeMirror bindings and `loadCm`); the code lives in `dock/`, one file per region: `layout`, `scope`, `lock-autosave`, `css-tools`, `html-tools`, `history-strip`, `style-modes`, `css-sizes`, `alpine`, `toolbars`, `data-vars`, `save`, `editor`, `dock-api`; files added since sit beside them (about 50 in all: `ghost-*` for ghost text, `help-*` for help mode, the class tools, `undo`, `snippets` …). The 47 module variables those regions wrote across each other are one object, `dockState` in `dock/state.js` (`dockState.applying`, `dockState.lastLocked`, `dockState.htmlFull` …), hoisted scope-aware by `scripts/hoist-state.mjs`, which refuses to leave a listed name dangling and refuses an object name the file already uses as an identifier. That second guard exists because v1.1.154 shipped with the object called `dock` while 148 places already used `dock` for the dock element: `dock.lastType` became a property read on a local DOM node, and the dock died at boot with a TDZ error.
6. **AI / comments / sibling-sync / previews** — feature modules via bus only.

No import from panels/dock into overlay, preview, or `replayLivePreview`.

---

## How to rewrite without breaking the editor

1. Inventory. Read live behavior. Do not cargo-cult structure.
2. Instant HTML — done, then superseded by Build's canvas and removed (see `docs/history.md`, 3 Nov 2026).
3. Split god files behind `cp/bus.js` (`ask` / `emit` / `register`). `code-dock.js`, `cp.js`, `section-library.js`, `globals-panel.js` are the weight. Kernel stays non-Vue.
4. One data source per concern. No retries, DOM fallbacks, or timeouts that hide the wrong source.
5. Dist: six Vite entries (`addon`, `bridge`, `preview`, `overlay-host`, `mirror`, `live-reload-morph`); `addon.js` imports overlay-host by exact hash. `emptyOutDir: false`. Never build overlay-host / preview / bridge alone. `node scripts/assert-dist-integrity.mjs` if the toolbar vanishes; recover from `resources/dist/locked`.
6. Statamic field CP is sacred. Append config on **one** fieldtype, or a side script. Never subclass + `::register()` an existing handle. Never wrap native Vue field components.

**Do not use as source:** `~/Sites/statamic-addon-visual-editor` (restore), `… copy`, `…-app`, `…-vue-backup-*`, site `public/vendor/visual-editor`.

---

## Hard constraints

- Never replace native Statamic fieldtypes (text, integer, replicator, grid, bard, iconify, …).
- Plus under a block opens Statamic Search Sets. Keep `handle` on `groupedPickerSets` (not `all`). `isPreviewMessageSource` must accept `event.source === overlay`. Open the picker in `setTimeout(0)`.
- Overlay open → host swallows Vite `full-reload`. Site `npm run dev` stays on for the public frontend.
- Tags that must keep working on the site: `visual_edit`, `style_push` / `script_push`, `responsive_css`, `sve_tw`, `sve_props` / `sve_defaults`, `theme_tokens` (the site's tag; it reads `site.css` `@theme`, which the Theme panel writes).
- Danish UI copy may remain; identifiers stay English.
- Ask instead of a second code path. Delete dead code. Stop at the boundary when something breaks far away.

---

## Sibling sync (works)

Lives in this repo: `resources/js/sibling-sync.js`, `src/SiblingSync.php`, tests. Do not rewrite sync/badge/lock as a side effect of Instant or CSS work. Working copy: `.restore/sibling-sync-working/`.

---

## Quality gate (since 12 November 2026)

- `git push` to main runs `scripts/hooks/pre-push`: the rollback guard, then
  `node scripts/quality.mjs all`, `npm test`, `vendor/bin/phpunit`. New code must
  pass; old debt is frozen in `quality-baseline/` (see its README).
- A JS/Vue file over 1000 lines or a PHP class over 300 may not grow: new code
  goes in a new file. A file that must grow needs the owner's yes in
  `quality-baseline/exceptions.json`.
- No silent `catch`: log or handle the error; a comment is not handling.
- No built entry or lazy chunk may grow more than 5 % (`quality-baseline/budgets.json`).
- Baselines only go down (`npm run quality:update`). Raising one is a hand edit
  with the owner's yes.
- A new surface gets a Playwright test in `tests/e2e/`; run `npm run e2e` on the
  bench (site `docs/kvalitetsrunde-brief.md` §7), never on the demo or Cuben.

---

## V2 working rules (since 17 September 2026)

The plan with measured numbers is `docs/v2-plan.md` on the site. These are the rules that came out of WP1 and WP2.

**One helper, one place — `resources/js/lib/`.** `csrf.js`, `preview-frame.js`, `style.js` (`injectStyle`), `i18n.js` (`t`, `statamicTranslate`), `vue-vm.js`, `drag.js`, `dock-host.js`, `codemirror.js`, and since WP4a: `ids.js` (every shared element id, attribute and storage key), `values.js` (`unwrapRef`, `dataGet`, `findPathByUid`, `firstEntryId`, `humanizeHandle`), `config.js` (`featureOn`, `sectionField`), `live-preview.js` (`lpHeader`, `livePreviewEditorEl`, `currentEntryId`, `currentCollection`), `dom.js` (`remToPx`), `publish-containers.js` (the one list of Statamic's publish containers: `registerContainerEvents`, `activeContainers`, `onContainer`, `addContainer`, `registerContainerSource`). A constant or a pure helper never goes on the `sve` registry: reading it there at module top level is how a late panel handed a neighbour `undefined`. Nor does anything nobody reads: 300 `sve.X = X` lines that no file referenced (not even as a string for a lazy stub) went in WP4c. Put a name on the registry only when another file calls it, and then prefer a direct import from `lib/` or the bus.

**Panel APIs are direct imports of function declarations (WP4d, lp-panel first).** Two rules keep it safe: a panel's shared constants live in `lib/ids.js`, never imported from a panel or from `cp.js`; and no top-level statement in any module may call into another module. The full story: `docs/history.md`.

**A region file must not run anything at evaluation time that reaches a sibling.** The bridge's `initBridge()` sat at the end of the last region; as a dependency of an earlier region that file was evaluated first, before the barrel's constants existed. `scripts/split-regions.mjs` now moves such statements into the barrel after every `export *`, where all regions have run.

**Lazy panels are reached through `lazy/*.js` (WP4h).** block-tree, html-tree, outline-panel, performance-panel, page-activity, schema-panel and ai-text are lazy chunks. Eager code never imports them — that would pull them into the main bundle — it imports the facade (`lazy/listview.js`, `lazy/html-tree.js`, …). A facade answers from the loaded module (`loadedPanel(key)` in lazy-panels.js) and, while the panel is away, does what the old registry stub did: loads it first, answers a default, or skips. `ensurePanel(key)` resolves with the module and remembers it. Shared mutable state is never a registry property any more: readers import the live binding (`activeChromeKind` from globals-panel, `editSession` from inline-edit, `chromeInlineKind` from chrome), and what the replay core owns is asked on the bus (`ask('lp:lastPreviewUrl')`, registered by lp-replay.js).

**The `sve` registry is gone (WP6c).** `cp-registry.js` and `window.sve` no longer exist; every cross-feature call is an import, a `lazy/*` facade, shared state on `sveState` (cp-state.js) or a bus message (`lp:replay`, `lite:solo`, …). Nothing may be hung on a global object for another file to find: if two files need to share, one imports the other or both use the bus. No file may define its own copy of a `lib/` helper either. Every lib file starts with a header saying what it owns and what it may import; a new lib file follows the same shape.

**Side scripts live in `resources/js/side/` (WP6a/b).** Fourteen former standalone scripts are imported, verbatim IIFEs with their own run-once guards, by `side/index.js` — the first import in `addon.js`, in the order their script tags used to run. Do not add new standalone scripts. The full story: `docs/history.md`.

**A standalone script must never `import()` a hashed build file.** `html-tree-section-sync.js` did — `import("/vendor/visual-editor/build/assets/addon-CwKv_5uQ.js")` to read the bus's `ask` off a minified export. The name froze at one build; `emptyOutDir: false` kept the file on disk, so every later release silently ran a second, stale copy of the whole CP bundle beside the live one (own `message` listeners, own state). On v1.1.157 that copy swallowed the preview's click. The script is gone (18 September 2026): `handleRemoveRow` emits `row:removed` on the bus, and `html-tree.js` and `dock/dock-api.js` each listen for what concerns them — no wrapper, no 500 ms poll, no registry line. Anything a standalone script needs from the bundle is a `window.sve` compat line until WP6, never a build file by name.

**Before every push: the quality gate above** (the pre-push hook runs it on main). Besides it:

```
npm run check          # isolation lint + dist integrity + protocol + node --test (tests/js) + npm run quality
npm run e2e            # Playwright, tests/e2e/, against the bench (site docs/kvalitetsrunde-brief.md §7)
npm run test:browser   # the older Puppeteer smoke test against the site (see the file header for env vars)
SVE_WORKTREE=1 npm run test:browser   # same, but the CP loads THIS checkout's build — prove a bundle before release
SVE_BUILD_DIR=<dir> …                 # serve another build, e.g. `vite build --minify false --outDir <dir>` for readable stack traces
SVE_PREFS='{"sve-lp-device":"Tablet"}' … # start the smoke test from a saved layout (keys as in chrome-prefs.js)
SVE_DEBUG=1 …                         # which frame got the mouse, the overlay's hit stack, a screenshot in the temp dir
npm run test:switch    # opening a section writes nothing: no save, no section reload (installed PHP; see the file header)
```

`scripts/assert-isolation.mjs` covers all of `resources/js`: kernel may import only kernel; `cp/` may import neither kernel nor `cp.js`; panels are held by `scripts/isolation-allowlist.json`, which may only shrink (a stale entry fails the run). New coupling to `cp.js`, `lp-replay.js` or the kernel is a failed lint, not a judgement call.

**Release pipeline — nothing is copied by hand.** Edit here → `npm run cp:build` (one full build, then `scripts/prune-dist.mjs` keeps only what the manifest names and refreshes `locked/` with the live addon and its imports — dist is committed and is ~5 MB, not the 550 MB of every hash ever built) → commit source + dist together → push (auto-tag) → on the site `composer update statamic-addon/visual-editor --no-cache` → `registerScript()` republishes the standalone scripts and `BuiltAssets::linkForControlPanel()` points `public/vendor/visual-editor/build` at the installed package. Verify with the manifest md5: repo, `vendor/` and `public/` must be identical. Never write into `vendor/` or `public/vendor/` by hand.

**Test baseline:** the PHP suite is green (1,124 tests on 12 Nov 2026, Statamic 6.35.1 / Laravel 13.34, the site's versions). The history: `docs/history.md`.

**The server is where editing happens.** `GET /!/sve/section-template` answers `writable.template` / `writable.tw` (can this server's PHP write the file and its baked CSS?) and the dock says so before the first keystroke; a save the server cannot write answers `{ error: 'not_writable' }` (500) and the dock names the cause; `tw_written: false` means the template landed but the Tailwind CSS did not — the dock keeps the compile dirty and says the classes will be missing on the site. A successful save flushes Statamic's static cache when a strategy is configured (Live Preview bypasses it; visitors do not). The site's `docs/server-checklist.md` is the operator's list; keep it true.

**The protocol is written once: `lib/protocol.js` (WP6c-2).** `SOURCE` is the mark on every message, `MSG` holds every type the preview, the overlay host and the Control Panel send or handle (100, measured: every object that carries `source:` and every comparison on `data.type`; the first, broader count also caught Bard node types and `typeof x.type === 'string'` — those are not messages), `CHANNEL` the two named channels for publish values. Senders write `{ source: SOURCE, type: MSG.CLICK, … }`; receivers compare `data.type === MSG.CLICK`. `scripts/assert-protocol.mjs` (in `npm run check`) fails on a literal source mark, a literal `type:` in an object that carries `source:`, or a comparison of `data.type` / `e.data.type` / `msg.type` against a literal — Bard node types and `typeof x.type` are not messages and are left alone. The standalone paint script cannot import and keeps its literals. Since every entry imports the module, Vite emits it as one shared chunk (`assets/protocol-*.js`) that the bridge, preview and overlay host each load; the `/!/sve/build/{path}` route allows every manifest file, so that is fine — and the same was already true of `html-pick-align` and `ai-text-icon`. Names are the wire strings they always were; a new message adds a line to `MSG` first.

---

## History: read before you touch

What happened when (dated decisions, measured traps, the V2 work packages) is in `docs/history.md`, sorted by date. Read the entry before you change the area:

| If you touch | Read in `docs/history.md` |
|---|---|
| Live reload (public site, Live Preview, a file saved outside the editor, Tailwind on the public page) | 12 Oct 2026 and 13 Oct 2026 (seven entries) |
| Components in the HTML tree, a section that is one component call | 23 Oct 2026 (two entries), 24 Oct 2026: A click on a section with no tag |
| The Theme panel's fonts (`public/fonts/fonts.css`) | 26 Sep 2026: The Theme panel's Fonts tab |
| The focus frame (header, footer, global section, component in focus) | One focus frame (since 24 October 2026) |
| The selection panel (`selection_panel`, `lib/selection.js`, `cp/panel/`) | The selection panel (phase 0, 19 October 2026) |
| PHP split into `Boot/`, `Tags/Resolve/`, facades, `scripts/split-php.py` | 18 Sep 2026: WP7a to WP7d-3 |
| Side scripts, `section-meta-prefetch.js`, `lite-sections.js` | 18 Sep 2026: Side scripts |
| The performance panel's Server tab, `{{ sve_cache }}`, field augmentation | 18 and 19 Sep 2026: WP9b |
| Browser tests with `SVE_WORKTREE=1` | 17 and 18 Sep 2026: the working-tree entries and the smoke test |
| Instant paint, the dock strip on a tag's own class | Instant HTML paint — removed 3 November 2026 |

---

## Er det en Fable-opgave? (til Cursor / Opus / andre agenter)

Spørger ejeren "kan du det, eller skal Fable?": **læs `.cursor/rules/hvornaar-fable.mdc` og svar ud fra den, før du rører noget.** Kort version: kernen (preview/overlay/bridge + `bridge/`, mirror, lp-replay, cp.js + `cp-shell/`, code-dock + `dock/`), protokollen og udgivelseskæden (cp:build, `resources/dist`, composer.lock, Packagist, server/SSH) → **vent på Fable**. Vue-surfaces, panel-CSS, lang-strenge, rene hjælpere med tests, docs → fri bane, men kør `npm test` + `npm run isolate` og stop før build/udgivelse. I tvivl → sig "vent på Fable".
