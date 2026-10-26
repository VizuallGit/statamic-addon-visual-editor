# Dock AI on the site's one key — brief for Opus

**The owner's rule, non-negotiable:** one place, one key, everything works.
The site already has a Cursor API key (Addons → Visual Editor → "Cursor API
key", `ai_api_key`; else `CURSOR_API_KEY` in `.env`). The AI panel and AI text
run on it. The AI in the HTML dock (grey text, comment → code, ⌘K) must run on
**the same key** with **no second field the owner has to fill in**. A Claude
key stays possible as an *optional* upgrade, never a requirement.

What is wrong today: `DockGhost` (v1.1.629, on the demo) knows only Anthropic.
`DockGhost::ask()` returns 422 *«Grey text needs an Anthropic API key»* when
`ghost_api_key` / `ANTHROPIC_API_KEY` is empty — even though the Cursor key is
there. The owner saw that message and is right that it is unacceptable.

Worktree `~/Sites/sve-dock-ghost`, branch `dock-ghost` (= `main` at
`bea7a5ff`, v1.1.629). Everything below is in `~/Sites/statamic-addon-visual-editor-vue`
code; Opus owns these files.

## What to build

`DockGhost` picks the way to ask by **which key the site has** — no new
setting, no switch the owner must know about:

| Keys present | Grey text (`line`, `comment`) | ⌘K (`edit`, `insert`) |
|---|---|---|
| Cursor key only (today's demo) | via `CursorAgent::run()` | via `CursorAgent::run()` |
| Cursor + Anthropic key | Anthropic (fast, as now) | Anthropic (as now) |
| Anthropic key only | Anthropic | Anthropic |
| Neither | 422, one message naming the **Cursor** field as the place to put a key | same |

Rule: Anthropic when `DockGhost::apiKey() !== ''`, else Cursor when
`AiChat::apiKey() !== ''`, else 422. `ready()` is true when **either** key is
set and `dock_ghost` is on.

### 1. `src/DockGhost.php`

- `ask()`: before the Anthropic branch, `if (static::apiKey() === '') { return static::askCursor($request); }` — the Anthropic code stays as it is.
- New `askCursor(array $request): array` (same return shape as `ask()`):
  - `if (AiChat::apiKey() === '') return failed(422, __('sve::messages.dock_ghost_need_key'))` — reword that message: *«The AI in the HTML dock needs a key: paste your Cursor API key under Addons → Visual Editor (or set CURSOR_API_KEY in .env).»* Mention Anthropic only as the optional faster path.
  - Prompt: one string = `Prompt::system($section)` text blocks joined + two newlines + `Prompt::user($request)`. `Prompt::system()` returns the array of Anthropic content blocks (`['type' => 'text', 'text' => …, 'cache_control' => …]`); take only each block's `text`. End the prompt with the same output instruction the system block already carries (reply with the HTML only, no fences, no prose) — the Cursor agent otherwise explains itself.
  - `set_time_limit(190)` as `AiCopy::suggest()` does; `CursorAgent::run($prompt)` with **no** `$write` (no file tools, no shell) and the site's default model (`CursorAgent::model(null)`). Measure `ms` around the call with `hrtime(true)` as `ask()` does.
  - `CursorAgent::run()` **aborts** (502) on failure instead of returning; wrap in `try { … } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) { return static::failed($e->getStatusCode(), $e->getMessage(), $ms); }` plus `\Throwable → failed(502, …)`.
  - Strip a Markdown fence if the agent wraps the answer anyway (`Reply::clean()` / `Reply::edit()` run afterwards in `complete()` / `edit()` as they do now — check whether they already drop ```` ``` ````; if not, add it to `Reply`, not here).
  - `Usage::record('cursor:'.$model, $mode, ['input' => 0, 'output' => 0])` so the month's count still rises; cost stays 0 (Cursor bills the Cursor account; we cannot see tokens).
- `ready()`: `Features::enabled('dock_ghost') && (static::apiKey() !== '' || AiChat::apiKey() !== '')`.
- Timeouts: the Cursor path takes 10–20 s (measured 16.6 s / 13.0 s on the demo for two words). `TIMEOUT['line'] = 8` must **not** apply to it: `askCursor` ignores `TIMEOUT` and relies on `CursorAgent::run()`'s own 180 s.

### 2. The grey text's wait on the slow path — `resources/js/dock/ghost-editor.js` (Opus's file)

With Cursor, a `line` answer comes after the author has typed on; the editor
already throws away an answer for a moved caret (`fresh`), so nothing wrong
shows — but the author sees nothing happen. Two small things, nothing else:

- Show the existing *«Writing …»* pending widget for **every** mode when the
  answer has not come within 1200 ms (`line` and `comment` alike), not only
  for `comment`. The widget is already there; `accept()` already waits on
  `pending`; Esc already stops it.
- Do not open a new question while one is on its way for the same caret
  (already: `cancel(state)` aborts on every keystroke — keep that).

No change to Tab / ⌘K / Escape bindings, to `quiet()` / `listOpen()`, or to
anything the harness (`npm run test:ghost`, 40 checks) asserts.

### 3. `src/Commands/GhostTry.php`

Print which path answered (`anthropic` / `cursor`) beside ms and $, so the
owner can read the difference. Works with the Cursor key alone.

### 4. Settings copy — `resources/blueprints/settings.yaml`

- `ghost_api_key` instructions: *«Optional. A Claude (Anthropic) key makes grey text answer in under a second. Empty: the dock AI uses the Cursor API key above.»*
- The "AI in the HTML dock" feature toggle's instructions: say it runs on the Cursor key by default.
- `resources/lang/*/messages.php`: `dock_ghost_need_key` as reworded above (Danish too).

### 5. Tests — `tests/DockGhostTest.php`

- `ready()` true with only `ai_api_key` set.
- `ask()` with no Anthropic key and a Cursor key calls `CursorAgent::run()` (fake it — `CursorAgent::process()` is protected; the suite already fakes the agent for `AiCopy`, use the same way) and returns `ok` with the agent's reply through `Reply::clean()`.
- No key at all: 422 with the new message, and the message names the Cursor field.
- Anthropic key set: the Anthropic branch is taken, `CursorAgent` is not called.
- Existing 34 tests keep passing.

## Do not

- Do not add a provider select or a second key field as a requirement. (A select may come later as its own task; the owner wants to be able to choose Cursor **or** Claude eventually — design `askCursor()` so a later `ghost.provider` config can force it, but do not add the setting now.)
- Do not touch `CursorAgent.php`, `AiChat.php`, `AiCopy.php`, the Node runner, `preview.js`, `overlay-host.js`, `bridge.js`, `code-dock.js`, the three wiring lines from the Fable pass (`dock-api.js`, `toolbars.js`, `lp-width.js`).
- Do not `npm run cp:build`, do not commit dist, do not release. Fable builds and releases after `npm test`, PHP suite, `npm run test:ghost` are green.

## Done when

On the demo with **only** the Cursor key present: sparkle on → ⌘K on a
selection returns a rewrite; a `{{# … #}}` comment + Enter returns a block
(after 10–20 s, with *«Writing …»* visible meanwhile); `php artisan
sve:ghost-try --count=3` and `--edit` print `cursor`, ms and $0.00 per
suggestion; no message ever mentions an Anthropic key unless the owner reads
the optional field's help text.

## Hand back to Fable

Commit on `dock-ghost` with a one-line note of what changed in each file. Fable
then: tests → full build → `isolate` → dist commit → ff `main` → push (tag) →
demo `composer update` + FPM reload + `composer.lock` → proof on the demo with
the Cursor key. **Budget for that pass: ≤ $10.** Cuben: not without the owner.

## What Opus built differently (26 Oct — the owner's word mid-task)

- **Cursor or Claude, picked — not "Claude when its key is there".** The owner
  asked for the choice now. `ghost_provider` (button group, Cursor | Claude,
  default Cursor) under the dock AI toggle; `DockGhost::provider()` reads it
  (setting → config `ghost.provider` → `cursor`). The way picked is the one
  asked; without its key, 422 naming that key (`dock_ghost_need_key` → the
  Cursor field, new `dock_ghost_need_claude_key` → the Claude field). The
  other way is never tried instead. The Claude key field shows only when
  Claude is picked; the Cursor key field now also shows when only
  `dock_ghost` is on. Results carry `via` = `cursor` | `claude`, and
  `sve:ghost-try` prints it.
- **A newer question stops the older one on the server** (`DockGhost::newest()`,
  through `CursorAgent::run()`'s existing `$stopped`). PHP does not notice the
  browser's abort, so each pause in typing would otherwise hold an FPM worker
  and a Node process for 10–20 s. Per user, grey text and ⌘K apart.
- `CursorAgent` is resolved with `app(CursorAgent::class)::run()` so the test
  stands in for it (an anonymous subclass overriding `process()`, the real
  `run()` around it). The suite had no agent fake for AiCopy to copy.
- «Writing …»: `comment` keeps showing it at once (harness check 11 reads it
  ~150 ms in); every other mode after `SLOW` = 1200 ms. A network error now
  clears it.
- Green: DockGhostTest 45/45 (34 + 11), `npm test` 903/903, `test:ghost` 40/40,
  `assert-isolation` ok. Full PHP suite 1005: 4 errors in LiveReloadTest —
  the same 4 on untouched `bea7a5ff` on this machine.
- `resources/dist/lock.json` was rewritten by the PHP suite to the committed
  dist (`addon-B0aiLomH.js`; HEAD's lock named `addon-CbCRJwox.js`). Left
  uncommitted — dist is Fable's.
- Demo proof: Cursor is the default, so "only the Cursor key present" needs no
  setting. Claude: pick Claude and paste a key.
- Not built: the AI chat and AI text on Claude. They run through
  `CursorAgent` / `AiChat` / `AiCopy` / the Node runner and the write gate,
  which this brief keeps out of Opus's hands — its own task.
