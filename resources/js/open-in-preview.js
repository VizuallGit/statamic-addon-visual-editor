/**
 * Settings toggle: `open_in_preview`
 * Open entries straight into Live Preview.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import { postToHost } from './cp.js';
import { openOverlay } from './overlay-host.js';

// ===== open-in-preview =====
// --- Opening an entry straight into the preview -------------------------------
//
// For the collections named on the settings screen, clicking an entry lands in
// Live Preview instead of the publish form behind it. Closing "back to admin"
// returns to the collection listing — never the entry form. Collections left
// off the list open exactly as Statamic ships them.
//
// The one thing every route in shares is the entry's own edit URL: the listing,
// the page tree, search, the dashboard. So that URL is what's watched, in two
// places, because a click is not always what makes the move. Both end in the
// same `?live-preview=1` the front-end edit button already uses.

/** `/cp/collections/{handle}/entries/{id}` — the screen this feature is about. */
export const ENTRY_EDIT_PATH = /\/collections\/([^/]+)\/entries\/(?!create(?:\/|$))[^/?#]+/;

export function openInPreviewCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveOpenInPreview');

  return Array.isArray(list) ? list : [];
}

/**
 * The URL to open instead, or null to leave the move alone.
 *
 * Already inside Live Preview, the answer is always null: moving between entries
 * in there is the picker's job, and it knows things this doesn't — whether there
 * is unsaved work, and what to do about it.
 */
export function previewUrlFor(win, href, collections) {
  if (sve.livePreviewEditorEl(win.document)) {
    return null;
  }

  let url;

  try {
    url = new URL(href, win.location.origin);
  } catch {
    return null;
  }

  if (url.origin !== win.location.origin || url.searchParams.get('live-preview') === '1') {
    return null;
  }

  const match = url.pathname.match(ENTRY_EDIT_PATH);

  if (!match || !collections.includes(match[1])) {
    return null;
  }

  url.searchParams.set('live-preview', '1');

  return url.toString();
}

// Where the entry was opened from, so the way out leads back there.
//
// Written to sessionStorage by the page making the move and claimed by the page
// arriving: the fallback path is a full page load, which takes any variable with
// it, so the note has to survive one document boundary — but no more than one.
export const OPEN_IN_PREVIEW_ORIGIN = 'sve-open-in-preview-origin';

// The note, once claimed: this document's preview and where it came from.
export let openedFrom = null;

export function rememberOrigin(win, entryPath, from) {
  try {
    win.sessionStorage.setItem(OPEN_IN_PREVIEW_ORIGIN, JSON.stringify({ entry: entryPath, from }));
  } catch {
    /* private mode — the way out is then the ordinary one */
  }
}

/**
 * Take the note left by the page that made the move, if this is the arrival it
 * was left for.
 *
 * Read once and deleted whether or not it matched. A note that outlived its own
 * arrival is worse than no note: open the same entry by hand a while later, press
 * ×, and you would be sent to a list you never came from.
 */
export function claimOrigin(win) {
  let note = null;

  try {
    note = JSON.parse(win.sessionStorage.getItem(OPEN_IN_PREVIEW_ORIGIN) ?? 'null');
    win.sessionStorage.removeItem(OPEN_IN_PREVIEW_ORIGIN);
  } catch {
    return;
  }

  if (note?.from && note.entry === win.location.pathname) {
    openedFrom = note;
  }
}

/**
 * The screen this entry was opened from, or null if it wasn't opened that way.
 *
 * Checked against the entry on screen, not just the session: the picker moves to
 * another entry without leaving the preview, and that one was not clicked in any
 * list.
 */
export function originForCurrentEntry(win) {
  return openedFrom?.entry === win.location.pathname ? openedFrom.from : null;
}

export function forgetOrigin(win) {
  openedFrom = null;

  try {
    win.sessionStorage.removeItem(OPEN_IN_PREVIEW_ORIGIN);
  } catch {
    /* nothing was stored either */
  }
}

/**
 * Opens the editor in the overlay iframe. The listing (or form) stays put
 * underneath — the same host the front-end edit button uses.
 */
export function goToPreview(win, url, fromEl) {
  try {
    const parsed = new URL(url, win.location.origin);

    rememberOrigin(win, parsed.pathname, win.location.href);
  } catch {
    /* ignore */
  }

  showEntryOpening(win.document, fromEl, url);
  openOverlay(win, url);
}

export const ENTRY_OPEN_STYLE_ID = '__sve-entry-open-style';
export const ENTRY_OPEN_ATTR = 'data-sve-entry-loading';

export function ensureEntryOpenStyles(doc) {
  if (doc.getElementById(ENTRY_OPEN_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = ENTRY_OPEN_STYLE_ID;
  style.textContent = `
[${ENTRY_OPEN_ATTR}] {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-inline-start: 8px;
  height: 8px;
  pointer-events: none;
  flex: 0 0 auto;
}
[${ENTRY_OPEN_ATTR}] i {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: currentColor;
  opacity: .22;
  animation: sve-entry-dots 1s ease-in-out infinite;
}
[${ENTRY_OPEN_ATTR}] i:nth-child(2) { animation-delay: .15s; }
[${ENTRY_OPEN_ATTR}] i:nth-child(3) { animation-delay: .3s; }
[${ENTRY_OPEN_ATTR}] i:nth-child(4) { animation-delay: .45s; }
@keyframes sve-entry-dots {
  0%, 100% { opacity: .22; }
  50% { opacity: .88; }
}
`;
  doc.head.appendChild(style);
}

export function clearEntryOpening(doc) {
  doc.querySelectorAll(`[${ENTRY_OPEN_ATTR}]`).forEach((el) => el.remove());
}

export function entryTitleAnchor(doc, fromEl, url) {
  if (fromEl?.closest) {
    const branch = fromEl.closest('.page-tree-branch');
    const inBranch = branch?.querySelector('a[href*="/entries/"]');

    if (inBranch) {
      return inBranch;
    }

    if (fromEl.matches?.('a[href]')) {
      return fromEl;
    }

    const nested = fromEl.querySelector?.('a[href*="/entries/"]');

    if (nested) {
      return nested;
    }
  }

  let path = '';

  try {
    path = new URL(url, doc.defaultView.location.origin).pathname;
  } catch {
    return null;
  }

  const links = [...doc.querySelectorAll(`a[href*="/entries/"]`)];

  return links.find((a) => {
    try {
      return new URL(a.href, doc.defaultView.location.origin).pathname === path;
    } catch {
      return false;
    }
  }) || null;
}

export function showEntryOpening(doc, fromEl, url) {
  ensureEntryOpenStyles(doc);
  clearEntryOpening(doc);

  const anchor = entryTitleAnchor(doc, fromEl, url);

  if (!anchor) {
    return;
  }

  const dots = doc.createElement('span');

  dots.setAttribute(ENTRY_OPEN_ATTR, '');
  dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = '<i></i><i></i><i></i><i></i>';
  anchor.after(dots);
}

export function initOpenInPreview(win) {
  const collections = openInPreviewCollections(win);

  if (!collections.length) {
    return;
  }

  // The link, caught on the way down so it never reaches Inertia's own handler.
  win.document.addEventListener(
    'click',
    (event) => {
      // Anything but a plain left click belongs to the browser: a middle click or
      // ⌘-click is asking for a tab, and a tab should open what the link says.
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = event.target?.closest?.('a[href]');

      if (!anchor || (anchor.target && anchor.target !== '_self')) {
        return;
      }

      const url = previewUrlFor(win, anchor.href, collections);

      if (!url) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      goToPreview(win, url, anchor);
    },
    true
  );

  // And the move that no link made: a row that navigates from JavaScript never
  // produces a click on an `<a>`, so it would otherwise slip past. Cancelled and
  // re-issued from the next tick, so the router isn't asked to start a visit
  // while it is still calling one off.
  //
  // Waited for rather than read once: this runs as the CP boots, and the router
  // is put on `__STATAMIC__` by Inertia's own start-up. Asking too early and
  // giving up would lose the net for the whole session.
  const hookRouter = (attempts = 0) => {
    const router = win.__STATAMIC__?.inertia?.router;

    if (typeof router?.on !== 'function') {
      if (attempts < 50) {
        win.setTimeout(() => hookRouter(attempts + 1), 100);
      }

      return;
    }

    router.on('before', (event) => {
      const visit = event.detail?.visit;

      if (!visit || (visit.method && String(visit.method).toLowerCase() !== 'get')) {
        return;
      }

      const url = previewUrlFor(win, String(visit.url), collections);

      if (!url) {
        return;
      }

      win.setTimeout(() => goToPreview(win, url), 0);

      return false;
    });
  };

  hookRouter();

  win.addEventListener('sve-overlay-idle', () => clearEntryOpening(win.document));
}

// Notified with `true`/`false` whenever the entry is written back (or fails to
// be). Watching the network rather than a Statamic event: `saved` is emitted on
// the publish component, not on a global bus, so there is nothing to listen to
// from out here.
export const saveListeners = [];

export function onEntrySave(callback) {
  saveListeners.push(callback);

  return () => {
    const index = saveListeners.indexOf(callback);

    if (index !== -1) {
      saveListeners.splice(index, 1);
    }
  };
}

/**
 * Watch for the entry being written back.
 *
 * Statamic saves an entry to the very URL its edit screen lives at, and publishes
 * to a path just below it. Anchoring on that path is what keeps the CP's other
 * chatter — Live Preview's own render POST, preference writes — from reading as a
 * save.
 */
export function watchEntrySaves(win) {
  const entryPath = win.location.pathname;

  const isSave = (url, method) => {
    if (!url || !/^(POST|PUT|PATCH)$/i.test(method || 'GET')) {
      return false;
    }

    let path;

    try {
      path = new URL(url, win.location.origin).pathname;
    } catch {
      return false;
    }

    return path.startsWith(entryPath) && !path.includes('/preview');
  };

  const announce = (ok, rearm) => {
    if (ok) {
      // The site under the editor overlay is now showing stale content.
      postToHost(win, 'lp-saved');
      sve.scheduleEntryBaselineAfterSave(win);
    } else {
      rearm();
    }

    [...saveListeners].forEach((listener) => listener(ok));
  };

  const { fetch: originalFetch } = win;

  win.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (!isSave(url, method)) {
      return originalFetch.call(this, input, init);
    }

    const rearm = disarmUnloadWarning(win);

    return originalFetch.call(this, input, init).then(
      (response) => {
        announce(response.ok, rearm);

        return response;
      },
      (error) => {
        announce(false, rearm);

        throw error;
      }
    );
  };

  const { open: originalOpen } = win.XMLHttpRequest.prototype;

  win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (isSave(url, method)) {
      const rearm = disarmUnloadWarning(win);

      this.addEventListener('load', () => announce(this.status >= 200 && this.status < 300, rearm));
      this.addEventListener('error', () => announce(false, rearm));
    }

    return originalOpen.call(this, method, url, ...rest);
  };
}

/**
 * Statamic guards against losing unsaved edits with beforeunload handlers. From
 * the moment a save request is in flight, that guard can only misfire: the
 * content is already written server-side by the time anything reacts to it — and
 * things do react. In dev, Vite's full-reload sees the content file change and
 * reloads the site (this page's host) before the save response is even back,
 * which put up a "changes you made may not be saved" prompt about changes that
 * were being saved.
 *
 * So: stand the guard down when a save starts. Returns a re-arm function for
 * when the save fails and the edits genuinely are unsaved again.
 */
export function disarmUnloadWarning(win) {
  const dirty = win.Statamic?.$dirty;

  if (!dirty) {
    return () => {};
  }

  let names = [];

  try {
    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = sve.unwrapRef(raw);

    names = Array.isArray(list) ? [...list] : [];
    dirty.disableWarning?.();
    names.forEach((name) => dirty.remove(name));
  } catch {
    /* best effort — worst case the browser asks */
  }

  return () => {
    try {
      names.forEach((name) => dirty.add(name));
    } catch {
      /* same */
    }
  };
}

/**
 * True when the open entry has edits that haven't been written back.
 *
 * Prefer a value snapshot taken when Live Preview settled (see
 * sve.scheduleEntryBaseline). Statamic's $dirty alone is unreliable here:
 * with revisions enabled, Save stays clickable even when clean (canSave ≠
 * isDirty), and mount/hydration often leaves a sticky dirty.has('base').
 */
export function hasUnsavedChanges(win) {
  // Save just landed; the form is being rewritten from the response. That
  // rewrite is not unsaved work — it's the saved values arriving.
  if (sve.entrySaveSettling) {
    return false;
  }

  // Value-diff against the clean baseline — the authoritative signal for the
  // back button. Falls through only before the baseline exists.
  if (sve.entryValuesBaseline != null) {
    const now = sve.serializeEntryValues();

    if (now != null) {
      return now !== sve.entryValuesBaseline;
    }
  }

  const dirty = win.Statamic?.$dirty;

  if (typeof dirty?.has !== 'function') {
    // No dirty API and no baseline yet — assume clean so Back doesn't trap.
    return false;
  }

  try {
    if (typeof dirty.count === 'function' && dirty.count() === 0) {
      return false;
    }

    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = sve.unwrapRef(raw);

    if (Array.isArray(list)) {
      if (!list.length) {
        return false;
      }

      const tracked = new Set(
        sve.publishContainers.map((container) => container.name).filter(Boolean)
      );

      tracked.add('base');

      return list.some((name) => tracked.has(name) && dirty.has(name));
    }
  } catch {
    /* fall through */
  }

  const tracked = new Set(
    sve.publishContainers.map((container) => container.name).filter(Boolean)
  );

  tracked.add('base');

  return [...tracked].some((name) => dirty.has(name));
}

/**
 * Drops the dirty marks — what discarding means. Left up, they'd re-arm the
 * warning on the *next* navigation, long after the edits they stood for are gone.
 */
export function discardChanges(win) {
  const dirty = win.Statamic?.$dirty;

  if (typeof dirty?.remove !== 'function') {
    return;
  }

  const names = new Set(sve.publishContainers.map((container) => container.name).filter(Boolean));

  names.add('base');

  // Statamic's own list — it knows about containers we never saw.
  if (typeof dirty.names === 'function') {
    (dirty.names() ?? []).forEach((name) => names.add(name));
  }

  names.forEach((name) => dirty.remove(name));
}

/**
 * Calls off Statamic's own unsaved-changes confirm for the navigation we're about
 * to make. We've already asked — in our own dialog, in the middle of the screen —
 * and a second, native "Are you sure?" on top of that is just the same question
 * twice.
 *
 * Clearing the dirty marks is not enough on its own: the guard is a router
 * listener that fires its confirm unconditionally, and it's only unhooked by a
 * Vue watcher on the dirty list — which flushes on the next tick, after our visit
 * has already been cancelled. This is Statamic's own synchronous escape hatch,
 * the one its actions use for `bypassesDirtyWarning`.
 */
export function dismissDirtyWarning(win) {
  win.Statamic?.$dirty?.disableWarning?.();
}

export function saveButtonIn(doc) {
  const header = sve.lpHeader(doc);

  return [...(header?.querySelectorAll('button') ?? [])].find((button) => {
    const text = (button.textContent || '').trim();

    if (isPublishButtonLabel(text)) {
      return false;
    }

    return /^(save|gem)\b/i.test(text);
  });
}

/**
 * "Publish…" / "Publicér…" — present only when revisions are enabled.
 */
export function publishButtonIn(doc) {
  const header = sve.lpHeader(doc);

  return [...(header?.querySelectorAll('button') ?? [])].find((button) =>
    isPublishButtonLabel((button.textContent || '').trim())
  );
}

export function isPublishButtonLabel(text) {
  return /^(publish|udgiv|public[eé]r)\b/i.test(text);
}

/**
 * Leaving right when the save response lands races Statamic's own handling of
 * it: the dirty flag is still up for a beat, and unloading in that window makes
 * the browser ask "changes you made may not be saved" — about changes that WERE
 * just saved. So wait for the flag to drop, and disarm Statamic's unload warning
 * (its own switch for exactly this) as a backstop before leaving.
 */
export function leaveQuietly(win, leave, attempts = 0) {
  if (hasUnsavedChanges(win) && attempts < 30) {
    setTimeout(() => leaveQuietly(win, leave, attempts + 1), 100);

    return;
  }

  try {
    // Force-clear leftover dirty marks so the browser / Statamic don't block leave.
    if (hasUnsavedChanges(win)) {
      discardChanges(win);
    }

    win.Statamic?.$dirty?.disableWarning?.();
  } catch {
    /* best effort — worst case the browser asks */
  }

  leave();
}



sve.ENTRY_EDIT_PATH = ENTRY_EDIT_PATH;
sve.openInPreviewCollections = openInPreviewCollections;
sve.previewUrlFor = previewUrlFor;
sve.OPEN_IN_PREVIEW_ORIGIN = OPEN_IN_PREVIEW_ORIGIN;
Object.defineProperty(sve, 'openedFrom', { get() { return openedFrom; }, set(v) { openedFrom = v; } });
sve.rememberOrigin = rememberOrigin;
sve.claimOrigin = claimOrigin;
sve.originForCurrentEntry = originForCurrentEntry;
sve.forgetOrigin = forgetOrigin;
sve.goToPreview = goToPreview;
sve.ENTRY_OPEN_STYLE_ID = ENTRY_OPEN_STYLE_ID;
sve.ENTRY_OPEN_ATTR = ENTRY_OPEN_ATTR;
sve.ensureEntryOpenStyles = ensureEntryOpenStyles;
sve.clearEntryOpening = clearEntryOpening;
sve.entryTitleAnchor = entryTitleAnchor;
sve.showEntryOpening = showEntryOpening;
sve.initOpenInPreview = initOpenInPreview;
sve.saveListeners = saveListeners;
sve.onEntrySave = onEntrySave;
sve.watchEntrySaves = watchEntrySaves;
sve.disarmUnloadWarning = disarmUnloadWarning;
sve.hasUnsavedChanges = hasUnsavedChanges;
sve.discardChanges = discardChanges;
sve.dismissDirtyWarning = dismissDirtyWarning;
sve.saveButtonIn = saveButtonIn;
sve.publishButtonIn = publishButtonIn;
sve.isPublishButtonLabel = isPublishButtonLabel;
sve.leaveQuietly = leaveQuietly;
