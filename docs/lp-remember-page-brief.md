# Live Preview remembers the page you were on — brief for Fable

**The owner's ask:** switching pages inside Live Preview (the Pages / entry
picker in the top bar) must not be forgotten. Today, after switching from the
front page to e.g. Kontakt, every way back lands on the front page again:
the CP's Live Preview button, a browser refresh, a trip to the admin and back.
For pages with a URL, the address bar should show the page being edited.
Pages without a route (templates, saved sections) do not need a URL, but must
not break.

Worktree `~/Sites/sve-lp-last-page`, branch `lp-last-page`, based on
`origin/main` = **v1.1.716** (37c3cdc5). Part 1 below is written there,
uncommitted. Parts 2 and 3 touch the kernel and are yours.

## Repo state — read before you commit anything

- The site runs **v1.1.652** (`composer.lock`). Shipping this brings in every
  tag up to v1.1.716 as well — smoke-test the whole editor, not only this.
- The main checkout `~/Sites/statamic-addon-visual-editor-vue` is on
  **v1.1.654** (local `main`, 190 commits behind `origin/main`) and carries
  work that is not part of this task: modified `package.json`
  (`test:panel-race`), `resources/dist/lock.json`, untracked
  `tests/browser/selection-panel-race.mjs` and `tests/__fixtures__/…`. Do not
  lose it when you fast-forward `main`.
- `~/Sites/sve-lp-last-page/node_modules` is a symlink to
  `~/Sites/sve-grid-builder/node_modules` (gitignored), only so the tests run.
- `git worktree add` set `lp-last-page` to track `origin/main`. Push it by name.

## What happens today

The picker never leaves the overlay host; only the overlay iframe changes.

- `pages.js` `openEntryFromLp` (729) → `navigateFromLp` (614) →
  `gotoOverlay(win, url)` (`overlay-host.js` 822) → `LP_GOTO` to the host →
  host `goto(url)` (513) boots `next = editor(url)` hidden and swaps on
  `LP_READY` from `next` (737–753).
- The host document — a CP page, or the public page whose «Rediger» button
  opened the editor — keeps its URL. `show()` (493) pushes one `sveEditing`
  history entry with the **same** URL (501); nothing updates it on a swap.
- `rememberOverlaySrc` / `rememberCollectionOrigin` run only in `boot()`
  (472), not in `goto()`, so `sve-overlay-src` and the origin note still name
  the first page after a switch.
- Refresh on a **site host** loads the original public page; the editor is
  not reopened — `bindEditButton` (891–903) only pre-boots it hidden
  (`hadOverlayThisSession`) for that page's own edit URL.
- Refresh on a **CP host** loads the CP page underneath; the overlay is gone.
  When the CP host was reached by landing on `…/entries/{id}?live-preview=1`
  (`autoOpenLivePreview`, `cp-shell/add-section.js` 2976), the host is the
  *first* entry's publish form with `live-preview` stripped.
- The CP top bar's Live Preview button (`home-preview-button.js`) always
  opened the front page (`sveHomePreview`, `ScriptCollections::homePreview()`).
  → fixed by Part 1.
- `leaveToAdmin` (`cp-shell/grid-rows.js` 1109): on a CP host it only lifts the
  overlay, so after a switch you land on whatever was underneath — e.g. the
  front page's publish form. → Part 3.

## 1. Review and ship — the button opens the last page (written, not shipped)

Surface: the CP top bar's Live Preview button (feature `home_preview_button`).
No kernel file, no new message type, no build.

Files:

- `resources/js/lib/last-page.js` (new, pure) — `rememberLastPage(storage,
  href, origin, { site, user, title })`, `lastPage(storage, origin, { site,
  user, previewable })`, key `sve-lp-last-page` in `localStorage`.
- `resources/js/home-preview-button.js` — in the overlay's editor document
  (embedded) it writes the note once on `sve-lp-ready` (title from the `base`
  entry in `publishContainers`, i.e. Statamic's own publish container); on the
  CP page it paints the button's `href` / title from the note, else from
  `sveHomePreview`, and repaints on the `storage` event (the note is written
  in another document). The click uses the link's own `href`.
- `tests/js/last-page.test.js` (new) — 7 cases. `npm test` 1340/1340,
  `assert-isolation` and `assert-protocol` green.

Rules held by the note: same CP user (`$config.user.id`) and selected site
(`$config.selectedSite`); its collection must still be `true` in
`svePreviewable`; only an entry edit path (`ENTRY_EDIT_PATH`) is written.

Known limit: a deleted entry stays in the note until another page is opened
in Live Preview (the button then opens a 404 in the overlay). If that matters,
the clean fix is server-side — the note in user preferences and
`homePreview()` answering with it — not a client check.

Check in the browser before shipping:

1. CP dashboard → Live Preview → front page → picker → Kontakt → «Tilbage til
   admin». Hover the button: «Åbn Kontakt i Live Preview». Click: Kontakt.
2. Reload the CP: still Kontakt. ⌘-click: Kontakt in a new tab.
3. Public `/kontakt` → «Rediger» → picker → Om os → back to admin → button:
   Om os.
4. Another CP user in the same browser, or another selected site: front page.
5. Templates-collection entries open in Live Preview too, so they count as
   «last page». Confirm with the owner that this is wanted.

If Part 2 gives the host its own «current page» record, decide whether the
button's note should be written from that same place — one source for
«which page is being edited» — and move it if so.

## 2. The host follows the page — address bar and refresh (kernel)

Surface: overlay host (`overlay-host.js`), plus the `lp-ready` payload and
possibly the edit-button script (`src/Http/Middleware/InjectEditButton/Button.php`).
The owner wants it done now; it is kernel work, so it is yours.

Wanted:

- After a swap, the `sveEditing` history entry (only that one — the host's own
  entry underneath stays as it is) carries the page being edited, by
  `history.replaceState`, never another `pushState`:
  - **site host:** the entry's public URL, when it has one;
  - **CP host:** the entry's CP URL with `?live-preview=1`, so a refresh lands
    through `autoOpenLivePreview` straight back into the editor on that page;
  - **no route** (templates, saved sections): leave the URL alone.
- A refresh while the editor is open reopens it on the page being edited.
  On a site host that needs an «editor was open» mark the reloaded page can
  read (sessionStorage, as `sve-overlay-src` already is) — then `host.open()`
  for the page's own edit URL, the same move `__sveWantEditor` makes.
- `sve-overlay-src` (and the origin note, if Part 3 needs it) follow swaps,
  not only `boot()`.

Source of the public URL: the server, not the DOM. Statamic's entry edit
props carry `permalink` (`$entry->absoluteUrl()`, `EntriesController@edit`);
the editor can send it with `lp-ready` (`postToHost(win, 'lp-ready', …)`,
`cp-shell/add-section.js` 3065), or the addon can hand it out itself. Not
`visitUrlOf()` (`grid-rows.js` 1033): it matches the «Visit URL» link text and
returns null for `/`. Reaching into Statamic's props means an entry in
`CONTRACTS` (`scripts/statamic-update-check.py` on the site).

Edge cases to hold:

- **Close after a save** on a site host calls `location.reload()` (`close()`,
  592–666) while the `sveEditing` entry is current — it would reload the
  *replaced* URL. Decide where that close should land, and clear the «editor
  was open» mark on every deliberate close, or the reload reopens the editor.
- Close without a save pops the `sveEditing` entry (`quietlyPopOverlayHistory`)
  — the host's original URL must come back with it.
- The capture `popstate` guard (784–798) and Statamic's
  `dirty_navigation_warning` must not start asking on a swap or a close.
- Inertia on a CP host: a replaced URL on our own history entry must not
  confuse Inertia's back/forward or its page state.
- The Vite `full-reload` guard (`guardHostReload`) stays exactly as it is.

## 3. The way out matches the page you are on (decision for the owner)

On a CP host, «Tilbage til admin» (`leaveToAdmin`) and × only lift the overlay.
After a switch, that shows the page that was underneath — possibly the
*first* entry's publish form. Proposal: when the entry in the overlay is not
the host's own entry form, close onto the current entry's collection listing
(`collectionListingUrl`), as the site host already does — unless the overlay
was opened from a listing (origin note), which stays the way back. Ask the
owner before changing it.

## Boundaries

- Do not touch `preview.js`, `bridge.js`, morph, or `replayLivePreview` /
  `watchPreviewRenders` for this. `openOverlay` / `gotoOverlay` are in scope
  for Part 2 only.
- Never `refresh: false` or an ignored `resources/views` in the site's
  `vite.config.js`. The site's `npm run dev` keeps refreshing the front end.
- No retries, timeouts or DOM fallbacks to make a swap «stick». One source
  per fact: the publish values / server for the page, the host for history.
- Plus → Statamic's Search Sets path (`handleAddBlockNative`) is untouched.

## Ship

Build in the addon (`npm run cp:build`, then `npm run isolate`), commit, merge
to `main`, push (auto-tag). On the site: `composer update
statamic-addon/visual-editor`, commit `composer.lock`. Then the smoke test in
Part 1, Part 2's refresh / close / back cases on both a site host and a CP
host, and a general Live Preview pass for v1.1.652 → current.
