# AI in the HTML dock — brief for Fable (wire, prove, release)

You are finishing the AI in the template dock's HTML pane. Opus built all of
it outside the dock kernel; your part is the three wiring lines in kernel
files, a short review, the Live Preview proof and the release.
**Budget: at most $30.** Read only the files named here; do not explore the
codebase. If you get close to the budget, stop and report what is left.

What the author gets (one sparkle switch in the pane, feature `dock_ghost`):

1. **Grey text** at the caret, Copilot-style: `<h2 class="…" {{ visual_` →
   grey `edit field="title" inline_edit="true" }}`. Tab takes it, ⌘→ a word,
   Esc or typing on leaves it.
2. **Comment → code**: `{{# card: image left, text right #}}` + Enter →
   "Writing …" at the caret, then the whole block in grey. Tab waits while
   it is writing; Esc stops it.
3. **⌘K**: select markup, press ⌘K, say what should change → the answer
   replaces the selection and is selected; Enter keeps, Esc puts it back.
   Nothing selected: written at the caret. Statamic's ⌘K command palette is
   held back (`Statamic.$commandPalette.preventIf`) only while the pane or
   the box has the focus.
4. Suggestions are written against the section's fields, the site's own
   tokens and classes (read again at most every 15 s), the house rules, the
   newest section, and the last six suggestions this author took.
5. LP settings → HTML tree shows this author's month (taken / shown, ⌘K
   kept / asked) and what the site has spent this month.

- Worktree: `~/Sites/sve-dock-ghost`, branch `dock-ghost` (pushed), on top of
  `origin/main` 1171c946. Opus commits: `ce07ca44`, `fae75a65`.
- `node_modules` in the worktree is a symlink to the main checkout's.
- `resources/dist/lock.json` shows as modified: the PHP suite rewrote it on the
  bench. Not part of the change; your full build writes it anyway.

## Why Anthropic and not the site's Cursor key

Measured on vizuall-demo on 26 Oct 2026: the existing Cursor-based AI text
(`/!/sve/ai-copy`) takes **16.6 s and 13.0 s** for a two-word suggestion.
Grey text calls Claude Haiku 5.5 directly (thinking off, effort low, cached
system prompt); ⌘K calls Claude Opus 5.5 (effort low, `fallbacks: "default"`
with beta `server-side-fallback-2026-07-01`). The owner provides the key.

## What exists (Opus — do not rewrite)

| File | What |
|---|---|
| `src/DockGhost.php` | `complete()` (grey text: `line`, `comment`), `edit()` (⌘K: `edit`, `insert`), model per mode, usage recorded |
| `src/DockGhost/Prompt.php` | Two cached system blocks (context + reference + rules + tokens; example section); the task in the user turn |
| `src/DockGhost/Reply.php`, `Tokens.php`, `Usage.php`, `Cases.php` | Tidying, the site's words, the month's account (`storage/statamic-visual-editor/ghost-usage/`), try-cases |
| `src/Http/Controllers/DockGhostController.php` | `POST /!/sve/dock-ghost`, `POST …/edit` (both outside `RecordEditorWrite`), `GET …/usage`; gated `template_dock` + `dock_ghost` |
| `src/Commands/GhostTry.php` | `php artisan sve:ghost-try [--count=6] [--section=…] [--edit]` |
| `src/Features.php`, `config/…php`, `resources/blueprints/settings.yaml` | `dock_ghost` (default off), `ghost_api_key`, `ghost.model`, `ghost.edit_model`, `ghost.fallbacks` |
| `resources/js/dock/ghost-state.js` | User default + this Live Preview's switch; off unless `sveFeatures.dock_ghost === true` |
| `resources/js/dock/ghost-suggest.js` | Pure rules: when to ask, mode, what to send, typing through |
| `resources/js/dock/ghost-request.js` | The one way to ask (payload incl. slice offset, POST) |
| `resources/js/dock/ghost-memory.js` | Taken suggestions + monthly counts in the user's prefs |
| `resources/js/dock/ghost-toggle.js` | The sparkle, **appended** to `[data-sve-help-tools]` |
| `resources/js/dock/ghost-attach.js` | `attachGhost(win, view)` — lazy-loads the editor side |
| `resources/js/dock/ghost-editor.js` | CodeMirror: field + widget, Tab / Mod-ArrowRight / Mod-k / Escape at `Prec.highest` (false when idle), palette hold |
| `resources/js/dock/ghost-edit.js` | The ⌘K box (portal on the CP body, follows scroll) |
| `lp-more-menu.js`, `LpSettingsTree.vue`, `chrome-prefs.js`, `ChromePrefsController.php` | The default tick, the month's numbers |
| Tests | `tests/DockGhostTest.php` (34), `tests/js/ghost-*.test.js` (30), `tests/browser/ghost-harness.mjs` (`npm run test:ghost`, 40 checks in a real CodeMirror in headless Chrome) |

## 1. Wire it (three lines + three imports, each beside help mode's)

1. `resources/js/dock/dock-api.js` ~L200, after `attachHelp(win, editors.html);`:
   `attachGhost(win, editors.html);` — `import { attachGhost } from './ghost-attach.js';`
2. `resources/js/dock/toolbars.js` ~L364, **after** `bindHelpToggle(win, dock);`:
   `bindGhostToggle(win, dock);` — `import { bindGhostToggle } from './ghost-toggle.js';`
   Order matters: `bindHelpToggle` fills the host with `replaceChildren`.
3. `resources/js/lp-width.js` ~L368, after `forgetHelpSwitch(win);`:
   `forgetGhostSwitch(win);` — `import { forgetGhostSwitch } from './dock/ghost-state.js';`

The sparkle wears `data-sve-help-btn` (for the row's look in `dock/layout.js`)
plus `data-sve-ghost-btn`. No layout.js change is needed.

## 2. Review (short — the risky parts only)

- `ghost-editor.js`: Tab and ⌘K precedence against help's `Prec.highest`
  keymap and the Tailwind/Antlers completion (nothing is asked or shown while
  `completionStatus === 'active'` or `[data-sve-help-popup]` exists); the
  palette hold; `finishHtmlEdit()` after a write, as help does.
- `ghost-edit.js`: focus moves to the box and back; review keys; the revert
  only while the answer still stands as written.
- `DockGhostController` + routes: auth via `Features::allows('template_dock')`.
- Small bugs (a line or two): fix them and say so. Anything larger: write it
  under **Needs Opus** in your report and stop — do not rewrite Opus's files.

## 3. Tests (in the worktree)

`npm test` · `npm run isolate` · PHP suite (needs the main checkout's vendor;
`LiveReloadTest` spawns PHP that requires `./vendor/autoload.php`) ·
`npm run test:ghost`.

## 4. Live Preview proof — at most 20 minutes, Chrome

Needs the feature on (Addons → Visual Editor → "AI in the HTML dock") and the
key (`ANTHROPIC_API_KEY` in the demo's `.env`, or the settings field).

1. Open a section in the dock, click the sparkle (pressed state).
2. In an `<h2>` showing `{{ title }}`, type `{{ visual_`, pause → grey text
   with `field="title"`; Tab writes it; ⌘Z takes it back in one step.
3. On a new line write `{{# card with image left and text right #}}`, Enter →
   "Writing …", then a block; Tab writes it; Live Preview paints it.
4. Select the `<h2>…</h2>`, ⌘K, "make it an h3 in the secondary colour",
   Enter → replaced; Esc puts it back; again and Enter keeps it. ⌘K outside
   the dock still opens Statamic's command palette.
5. Help's bulb still works and wins Tab while its popup is open; the Tailwind
   list still takes Tab.
6. Close and reopen Live Preview → the switch is back to the user's default.
   LP settings → HTML tree shows the month's numbers.
7. `php artisan sve:ghost-try` and `php artisan sve:ghost-try --edit` on that
   site; note median ms and $ per suggestion, and ⌘K's ms and $.

If ⌘K's request is refused for the `fallbacks` parameter, set
`'fallbacks' => false` under `ghost` in the site's config and say so.

## 5. Build and release

Full `npm run cp:build` (never one entry), `npm run isolate`, commit dist,
fast-forward `dock-ghost` into `main`, push (the workflow tags), then the
site's `composer.lock` and the demo as you always do. **No composer change**:
the calls use Laravel's HTTP client, no new package. **Cuben: not without the
owner's go.**

For whoever keeps the site's `scripts/statamic-update-check.py` (it is
uncommitted in the site's checkout, so Opus left it alone): add
`'command palette hold (⌘K in the HTML dock)': ['preventIf', 'shouldPreventOpening']`
to `CONTRACTS`.

## Report (in Danish, to the owner)

What you wired, test results, the proof (passed/failed per step), the
`sve:ghost-try` lines (median ms, $ per suggestion; ⌘K ms and $), the version
that went to the demo, and anything under **Needs Opus**.
