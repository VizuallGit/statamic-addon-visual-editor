/**
 * Settings toggle: `open_in_preview`
 * An "Open in Live Preview" label on the rows of the named collections.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { t } from './lib/i18n.js';
import { postToHost } from './cp.js';
import { injectStyle } from './lib/style.js';
import { unwrapRef } from './lib/values.js';
import { isEmbeddedInSite, lpHeader } from './lib/live-preview.js';
import { previewUrlFor } from './lib/entry-open.js';
import { publishContainers } from './lib/publish-containers.js';
import { entrySaveSettling, entryValuesBaseline, scheduleEntryBaseline, scheduleEntryBaselineAfterSave, serializeEntryValues } from './inline-edit.js';

async function openOverlay(win, url) {
  const overlay = await import('./overlay-host.js');

  overlay.openOverlay(win, url);
}

// ===== open-in-preview =====
// --- A second door on the row: "Open in Live Preview" -------------------------
//
// For the collections named on the settings screen, every row in the
// collection listing and in the page tree carries a small label beside the
// title. The label opens the entry in Live Preview — in the overlay, with a
// note of where it was opened from, so × leads back to the list. The title
// itself does what Statamic ships: it opens the publish form.
//
// The label is a real link to `?live-preview=1`, so ⌘-click and the middle
// button open a tab the ordinary way; a plain click goes through goToPreview.
//
// Statamic's Vue draws the rows and redraws them — on sort, on paging, on a
// move in the tree — so the label is a sibling it never knows about: one
// observer sees the rows arrive and puts a label beside each title that has
// none. Nothing is wrapped, nothing is replaced, and no click is taken from
// Statamic's own elements.

export function openInPreviewCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveOpenInPreview');

  return Array.isArray(list) ? list : [];
}

export const OPEN_PREVIEW_LABEL_ATTR = 'data-sve-open-preview';
const OPEN_PREVIEW_STYLE_ID = '__sve-open-preview-style';

/**
 * The title link of a row, in the two places Statamic lists entries:
 *
 *   - the collection listing's title cell (`a.title-index-field`)
 *   - the page tree's branch (`.page-tree-branch` → its one `a[href]`)
 *
 * Both are named in CONTRACTS (scripts/statamic-update-check.py on the site).
 */
export const ROW_TITLE_LINKS = 'a.title-index-field[href], .page-tree-branch a[href]';

export function ensureOpenPreviewStyles(doc) {
  injectStyle(doc, OPEN_PREVIEW_STYLE_ID, `
@layer sve {
  [${OPEN_PREVIEW_LABEL_ATTR}] {
    display: inline-flex;
    align-items: center;
    gap: .3em;
    flex: 0 0 auto;
    margin-inline-start: .625rem;
    padding: .125em .5em;
    border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
    border-radius: .375rem;
    font-size: .6875rem;
    font-weight: 500;
    line-height: 1.4;
    white-space: nowrap;
    color: inherit;
    text-decoration: none;
    opacity: .65;
    transition: opacity .12s ease, border-color .12s ease;
  }
  [${OPEN_PREVIEW_LABEL_ATTR}]:hover,
  [${OPEN_PREVIEW_LABEL_ATTR}]:focus-visible {
    opacity: 1;
    border-color: color-mix(in srgb, currentColor 55%, transparent);
    text-decoration: none;
  }
  [${OPEN_PREVIEW_LABEL_ATTR}] svg {
    width: .875em;
    height: .875em;
    flex: 0 0 auto;
  }
}
`);
}

const OPEN_PREVIEW_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';

/**
 * The label standing beside `anchor`, if one does. The loading dots
 * (showEntryOpening) sit between the title and the label while the overlay
 * boots; they are stepped over.
 */
function labelAfter(anchor) {
  let next = anchor.nextElementSibling;

  while (next?.hasAttribute?.(ENTRY_OPEN_ATTR)) {
    next = next.nextElementSibling;
  }

  return next?.hasAttribute?.(OPEN_PREVIEW_LABEL_ATTR) ? next : null;
}

/**
 * Put the label beside every title link of a named collection under `root`,
 * and keep the ones already there true to the row they stand beside: Vue may
 * reuse a row's element for another entry after a sort, so an existing label
 * is re-pointed rather than trusted.
 */
export function labelRows(win, root, collections) {
  const doc = win.document;
  const origin = win.location.origin;

  for (const anchor of root.querySelectorAll(ROW_TITLE_LINKS)) {
    const url = previewUrlFor(anchor.getAttribute('href'), origin, collections);
    const existing = labelAfter(anchor);

    if (!url) {
      existing?.remove();

      continue;
    }

    const label = existing ?? doc.createElement('a');

    if (label.getAttribute('href') !== url) {
      const title = (anchor.textContent || '').trim();

      label.setAttribute('href', url);
      label.title = title ? t(win, 'open_in_live_preview_title', { title }) : t(win, 'open_in_live_preview');
    }

    if (existing) {
      continue;
    }

    label.setAttribute(OPEN_PREVIEW_LABEL_ATTR, '');
    label.innerHTML = `${OPEN_PREVIEW_ICON}<span>${t(win, 'open_in_live_preview')}</span>`;
    label.addEventListener('click', (event) => {
      // Anything but a plain left click belongs to the browser: a middle click
      // or ⌘-click is asking for a tab, and the link says where.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        event.stopPropagation();

        return;
      }

      // Ours alone: the row around it would otherwise read the click as its own
      // (the tree's branch opens the entry on any click inside it).
      event.preventDefault();
      event.stopPropagation();

      goToPreview(win, label.getAttribute('href'), label);
    });
    anchor.after(label);
  }
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
  injectStyle(doc, ENTRY_OPEN_STYLE_ID, `
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
`);
}

export const LP_OPENING_ATTR = 'data-sve-lp-opening';
const LP_OPENING_STYLE_ID = '__sve-lp-opening-style';

/**
 * The Live Preview button while the overlay boots.
 *
 * The overlay comes up hidden and swaps in once it has painted, so for a
 * second or two nothing on the form said the click had landed — and a second
 * click opened a second overlay. The button's own icon spins meanwhile: an
 * attribute on Statamic's element and a stylesheet, nothing replaced or
 * rewritten, so a Statamic update cannot break it. Cleared when the overlay
 * is idle or on screen, or after 20 s — a boot that failed must not leave a
 * spinner behind.
 */
export function markLivePreviewOpening(win, button) {
  const doc = win.document;

  if (!button || button.hasAttribute(LP_OPENING_ATTR)) {
    return;
  }

  injectStyle(doc, LP_OPENING_STYLE_ID, `
[${LP_OPENING_ATTR}] svg {
  transform-origin: 50% 50%;
  animation: sve-lp-opening-spin .9s linear infinite;
}
@keyframes sve-lp-opening-spin {
  to { transform: rotate(360deg); }
}
`);
  button.setAttribute(LP_OPENING_ATTR, '');

  // A button drawn without an icon gets the listing's dots instead.
  if (!button.querySelector('svg')) {
    ensureEntryOpenStyles(doc);

    const dots = doc.createElement('span');

    dots.setAttribute(ENTRY_OPEN_ATTR, '');
    dots.setAttribute('aria-hidden', 'true');
    dots.innerHTML = '<i></i><i></i><i></i><i></i>';
    button.appendChild(dots);
  }

  let poll = 0;
  let timer = 0;

  const done = () => {
    button.removeAttribute(LP_OPENING_ATTR);
    button.querySelector(`[${ENTRY_OPEN_ATTR}]`)?.remove();
    win.clearInterval(poll);
    win.clearTimeout(timer);
    win.removeEventListener('sve-overlay-idle', done);
  };

  poll = win.setInterval(() => {
    if (doc.querySelector('iframe.sve-edit-overlay[data-open]')) {
      done();
    }
  }, 200);
  timer = win.setTimeout(done, 20000);
  win.addEventListener('sve-overlay-idle', done);
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

  // Only on a Control Panel page of its own. Inside an iframe this document is
  // the editor in the overlay or a screen framed in a Live Preview drawer, and
  // neither is a list to put labels on — the drawer decides for itself where a
  // row opens (lp-collections.js).
  if (!collections.length || isEmbeddedInSite(win)) {
    return;
  }

  ensureOpenPreviewStyles(win.document);

  // The rows are Statamic's Vue, drawn after boot and redrawn on sort, paging
  // and every Inertia visit; the one honest signal that a row is on screen is
  // the DOM. One observer, one pass per animation frame; the pass only adds
  // what is missing, so its own writes are the last mutation it causes.
  let scheduled = false;

  const pass = () => {
    scheduled = false;
    labelRows(win, win.document, collections);
  };

  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      win.requestAnimationFrame(pass);
    }
  };

  new win.MutationObserver(schedule).observe(win.document.body, { childList: true, subtree: true });
  schedule();

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
      scheduleEntryBaselineAfterSave(win);
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
    const list = unwrapRef(raw);

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
 * scheduleEntryBaseline). Statamic's $dirty alone is unreliable here:
 * with revisions enabled, Save stays clickable even when clean (canSave ≠
 * isDirty), and mount/hydration often leaves a sticky dirty.has('base').
 */
export function hasUnsavedChanges(win) {
  // Save just landed; the form is being rewritten from the response. That
  // rewrite is not unsaved work — it's the saved values arriving.
  if (entrySaveSettling) {
    return false;
  }

  // Value-diff against the clean baseline — the authoritative signal for the
  // back button. Falls through only before the baseline exists.
  if (entryValuesBaseline != null) {
    const now = serializeEntryValues();

    if (now != null) {
      return now !== entryValuesBaseline;
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
    const list = unwrapRef(raw);

    if (Array.isArray(list)) {
      if (!list.length) {
        return false;
      }

      const tracked = new Set(
        publishContainers.map((container) => container.name).filter(Boolean)
      );

      tracked.add('base');

      return list.some((name) => tracked.has(name) && dirty.has(name));
    }
  } catch {
    /* fall through */
  }

  const tracked = new Set(
    publishContainers.map((container) => container.name).filter(Boolean)
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

  const names = new Set(publishContainers.map((container) => container.name).filter(Boolean));

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
  const header = lpHeader(doc);

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
  const header = lpHeader(doc);

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
