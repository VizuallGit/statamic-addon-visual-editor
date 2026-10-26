# Dock AI on Cursor: run in the background — brief for Opus

**No server change. Ever.** The demo (and every customer site on that
server) has nginx `fastcgi_read_timeout 30` and PHP-FPM
`request_terminate_timeout = 30`, both server-wide. We do not touch them.
The fix lives in the addon only.

**What is wrong today (v1.1.630 on the demo):** `DockGhost::askCursor()`
runs `CursorAgent::run()` *inside* the web request. The agent takes 13–26 s
(measured: 12.9 s, 20.1 s, 26.4 s via `sve:ghost-try`), so the request hits
the 30 s wall: two tries from Live Preview both ended in **504 Gateway
Time-out at 30.0 s**. «Writing …» shows (1.8 s), the answer never comes.
`sve:ghost-try` works because the CLI has no such wall.

**The fix:** the web request only *starts* the work and answers at once;
the work runs in a separate PHP process; the browser asks for the result
until it is there. Same pattern for grey text and ⌘K. The Claude path
(1–5 s) stays synchronous as it is.

Worktree `~/Sites/sve-dock-ghost`, branch `dock-ghost` (= `main` `909ccd07`,
v1.1.630). Your files from `77b7cb85` are the ones to change.

## 1. `src/DockGhost/Job.php` (new)

A job = one JSON file under `storage/statamic-visual-editor/ghost-jobs/`.

- `Job::start(string $kind, array $request): string` — `$kind` is `complete`
  or `edit`. Writes `{id}.json` with `{kind, request, user, state: 'pending',
  started: <ms>}`; `user` = `User::current()->id()` (the job runs as console,
  so `newest()`'s cache key and `Usage` must get the user's id from the file —
  see §3). Spawns the worker **detached** and returns the id.
- Spawn: `Process::fromShellCommandline(sprintf('nohup %s %s sve:ghost-job %s > /dev/null 2>&1 &', escapeshellarg(PHP_BINARY), escapeshellarg(base_path('artisan')), escapeshellarg($id)), base_path())->run()`.
  The shell backgrounds it and `run()` returns in milliseconds; the child
  survives the request's end (that is what the redirects and `nohup` are
  for — a plain Symfony `start()` dies with the FPM request). Use the same
  `PATH` env as `CursorAgent::process()` (`/opt/homebrew/bin:/usr/local/bin:…`).
- `Job::read(string $id): ?array` — the file, or null. `Job::finish(string $id, array $result)` — writes `state: 'done'` + the result. Ids are UUIDs; reject anything not matching `/^[0-9a-f-]{36}$/`.
- `Job::sweep()` — on each `start`, delete files older than 10 minutes.
- A job whose file still says `pending` after 200 s is answered as failed (`502`, `dock_ghost_error`) by `read()`'s caller — the runner's own deadline is 185 s.

## 2. `src/Commands/GhostJob.php` (new, `sve:ghost-job {id}`)

Reads the job; `abort` if missing. Calls `DockGhost::complete($request)` or
`DockGhost::edit($request)` exactly as the controller does today; writes
the result with `Job::finish()`. Register in `ServiceProvider::$commands`
beside `GhostTry::class`. Hidden from `artisan list` (`$hidden = true`).

## 3. `src/DockGhost.php`

- `complete()` / `edit()` unchanged in shape. The split happens in the
  controller (§4), not here, so `sve:ghost-try` and the tests keep calling
  `complete()`/`edit()` synchronously.
- `newest(string $mode)` and `Usage` key on the user: the job runs as
  console, so `User::current()` is null there. Let the request carry the
  author: `$request['user']` (set by the controller from the session; by
  `GhostJob` from the file). `newest()` uses `$request['user'] ?? User::current()?->id() ?? 'console'`.
  Nothing else in `askCursor()` changes — its 180 s and `$stopped` are now
  in a process no web server can kill.

## 4. `src/Http/Controllers/DockGhostController.php` + routes

- `store()` / `edit()`: after `authorize()`, when `DockGhost::provider() === 'cursor'`
  → `return response()->json(['ok' => true, 'job' => Job::start('complete'|'edit', $fields + ['user' => User::current()->id()])], 202);`
  Else as today (Claude, synchronous).
- New `GET /!/sve/dock-ghost/job/{id}` → `job()`: `authorize()`; the job
  must belong to this user (403 otherwise); `pending` → `['ok' => true, 'state' => 'pending']`;
  done → the stored result through `answer()` plus `'state' => 'done'`.
  Route beside the others in `src/Boot/EditorRoutes.php`, `->withoutMiddleware(RecordEditorWrite::class)` like `store`.
- Validation errors that `edit()` raises before asking (empty instruction,
  selection too long) must still come back **synchronously** as 422: call
  the two checks before starting a job (extract them from `DockGhost::edit()`
  into a public `DockGhost::editProblem(array $request): ?array` used by
  both).

## 5. `resources/js/dock/ghost-request.js` — only `ghostPost()`

`ghostPost(win, path, body, signal)` keeps its contract: resolves
`{ ok, status, body }`, rejects on abort/network. Inside:

- POST as now. If `res.status === 202 && body.job`: poll
  `GET /!/sve/dock-ghost/job/{job}` every **700 ms** (same headers, `signal`
  passed to each fetch) until `body.state === 'done'`, then resolve with
  `{ ok: body.ok !== false && res.ok, status: res.status, body }` — the done
  response carries `text`/`ms` (or `message` with its own status) exactly as
  the synchronous answer does, so `ghost-editor.js` and `ghost-edit.js` need
  **no change**. Stop polling after 200 s with `{ ok: false, status: 504, body: null }`.
- An abort (`signal.aborted`) stops polling and rejects, as today; the
  server-side job runs to its end and is dropped by `newest()` when the
  author asks again, or swept after 10 minutes.

Do not touch `ghost-editor.js`, `ghost-edit.js`, `ghost-suggest.js`,
`ghost-memory.js`, `ghost-state.js`, the three wiring lines, or any kernel
file.

## 6. Tests

- `tests/DockGhostJobTest.php`: start writes the file and returns a uuid;
  `GhostJob` on a job with the fake agent (your anonymous `CursorAgent`
  subclass) writes `done` with the reply; `read()` of an unknown id is null;
  a job of another user is 403 on the route; a pending job answers
  `state: pending`; stale jobs are swept.
- Controller: Cursor provider → 202 with `job`; Claude provider → 200 as
  before; `edit` with empty instruction → 422 synchronously, no job file.
- `tests/js/ghost-request.test.js`: 202 → polls → resolves with the done
  body; abort during polling rejects; `pending` forever → 504 after the limit
  (use fake timers).
- Existing: DockGhostTest 45, `npm test` 903, `npm run test:ghost` 40 — all
  stay green. The harness's fake server answers 200 directly; it is not
  changed.

## Do not

- No change to nginx, PHP-FPM, `.env`, Ploi — not on the demo, not anywhere.
- No `set_time_limit` tricks, no `ignore_user_abort`, no
  `fastcgi_finish_request` as the fix: FPM still kills the worker at 30 s.
- No queue driver / Horizon / supervisor: the site has none, and the owner
  will not add one. `nohup … &` is the whole mechanism.
- No `npm run cp:build`, no dist commit, no release, no `composer update`.

## Done when (local, with `SVE_WORKTREE=1` or on the demo later)

With the Cursor key only: sparkle on → type → «Writing …» → the grey text
arrives after 10–25 s with **no 504**; Tab takes it. ⌘K on a selection →
rewrite after 10–30 s. `storage/statamic-visual-editor/ghost-jobs/` holds
one small file per answer, swept after 10 minutes.

## Hand back

Commit on `dock-ghost`, one line per file. The owner has stopped Fable's
budget; the build and release (`npm run cp:build` → `isolate` → dist commit →
ff `main` → push → demo `composer update` + FPM reload + `composer.lock`) is
to be run by the owner or by Opus following `docs/genveje-opus-brief.md`
§«Byg og udgiv», which the owner already approved as the pattern. Cuben: no.
