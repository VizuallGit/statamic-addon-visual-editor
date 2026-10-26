# Grey text in the HTML dock — brief for Fable (wire, prove, release)

You are finishing **grey text**: Copilot-style suggestions at the caret in the
template dock's HTML pane. The author types, pauses, and grey text shows what
comes next — written against the section's fields, the house rules
(`ai-rules.md`) and the site's newest section. Tab takes it, ⌘→ takes a word,
Esc or typing on leaves it. The owner's example: `<h2 class="…" {{ visual_`
→ grey `edit field="title" inline_edit="true" }}`.

Opus built everything outside the dock kernel. Your part is the three wiring
lines in kernel files, a short review, the Live Preview proof and the release.
**Budget: at most $30.** Read only the files named here; do not explore the
codebase. If you get close to the budget, stop and report what is left.

- Worktree: `~/Sites/sve-dock-ghost`, branch `dock-ghost` (pushed), on top of
  `origin/main` 1171c946. Opus commit: `ce07ca44`.
- `node_modules` in the worktree is a symlink to the main checkout's.
- `resources/dist/lock.json` shows as modified: the PHP suite rewrote it on the
  bench. Not part of the change; your full build writes it anyway.

## Why Anthropic and not the site's Cursor key

Measured on vizuall-demo on 26 Oct 2026: the existing Cursor-based AI text
(`/!/sve/ai-copy`) takes **16.6 s and 13.0 s** for a two-word suggestion.
Grey text must arrive while the author pauses (< 1 s), so it calls Claude
Haiku 5.5 directly (`claude-haiku-5-5`, thinking off, effort low, cached
system prompt). It needs its own Anthropic key — the owner provides it.

## What exists (Opus, do not rewrite)

| File | What |
|---|---|
| `src/DockGhost.php`, `src/DockGhost/Prompt.php`, `Reply.php`, `Cases.php` | The call, the prompt (two cached system blocks), tidying the reply, the try-cases |
| `src/Http/Controllers/DockGhostController.php` | `POST /!/sve/dock-ghost`, gated `template_dock` + `dock_ghost`, **outside** `RecordEditorWrite` (not a write) |
| `src/Commands/GhostTry.php` | `php artisan sve:ghost-try [--count=6] [--section=hero/style_2]` — real cases, time and cost |
| `src/Features.php`, `config/…php`, `resources/blueprints/settings.yaml` | Feature `dock_ghost` (default off), `ghost_api_key` field, `ANTHROPIC_API_KEY` fallback |
| `resources/js/dock/ghost-state.js` | User default (`sve-code-dock-ghost`) + this Live Preview's switch; off unless `sveFeatures.dock_ghost === true` |
| `resources/js/dock/ghost-suggest.js` | Pure: when to ask, what to send, typing through, next word |
| `resources/js/dock/ghost-toggle.js` | The sparkle button, **appended** to `[data-sve-help-tools]` |
| `resources/js/dock/ghost-attach.js` | `attachGhost(win, view)` — lazy-loads the editor side |
| `resources/js/dock/ghost-editor.js` | CodeMirror: StateField + widget, Tab / Mod-ArrowRight / Escape at `Prec.highest` (false when no grey text), debounce 350 ms, abort, stale answers dropped |
| `lp-more-menu.js`, `LpSettingsTree.vue`, `chrome-prefs.js`, `ChromePrefsController.php` | LP settings → HTML tree: "Grey text (AI) in the HTML dock on from the start" |
| Tests | `tests/DockGhostTest.php` (21), `tests/js/ghost-*.test.js` (22), `tests/browser/ghost-harness.mjs` (`npm run test:ghost`, 22 checks in a real CodeMirror in headless Chrome) |

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

- `ghost-editor.js`: Tab precedence against help's `Prec.highest` keymap and
  the Tailwind/Antlers completion (grey text is never asked or shown while
  `completionStatus === 'active'` or `[data-sve-help-popup]` exists). The
  slice offset (`dockState.htmlScopeActive` / `htmlFocus.from`) as in
  `help-editor.js`. `finishHtmlEdit()` after Tab, as help does.
- `DockGhostController` + route: auth via `Features::allows('template_dock')`.
- Small bugs (a line or two): fix them and say so. Anything larger: write it
  under **Needs Opus** in your report and stop — do not rewrite Opus's files.

## 3. Tests (in the worktree)

`npm test` · `npm run isolate` · PHP suite (needs the main checkout's vendor;
`LiveReloadTest` spawns PHP that requires `./vendor/autoload.php`) ·
`npm run test:ghost`.

## 4. Live Preview proof — at most 20 minutes, Chrome

Needs the feature on and a key (the owner pastes it under Addons → Visual
Editor → "Grey text in the HTML dock" → "Anthropic API key").

1. Open a section in the dock, click the sparkle (pressed state).
2. In an `<h2>` that shows `{{ title }}`, type `{{ visual_`, pause → grey text
   with `field="title"`; Tab writes it; ⌘Z takes it back in one step.
3. Help's bulb still works and wins Tab while its popup is open; the Tailwind
   list still takes Tab.
4. Close and reopen Live Preview → the switch is back to the user's default.
5. Run `php artisan sve:ghost-try` on that site; note median ms and $/suggestion.

## 5. Build and release

Full `npm run cp:build` (never one entry), `npm run isolate`, commit dist,
fast-forward `dock-ghost` into `main`, push (the workflow tags), then the
site's `composer.lock` and the demo as you always do. **No composer change**:
the call uses Laravel's HTTP client, no new package. **Cuben: not without the
owner's go.**

## Report (in Danish, to the owner)

What you wired, test results, the proof (passed/failed per step), the
`sve:ghost-try` summary line (median ms, $ per suggestion), the version that
went to the demo, and anything under **Needs Opus**.
