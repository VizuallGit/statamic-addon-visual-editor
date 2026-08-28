/**
 * Settings toggle: `globals`
 * Globals beside Live Preview.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { COLLAPSE_SETTLE_MS, GLOBALS_PANEL_PARAM, SELECTORS } from './cp-selectors.js';
import {
  FRAMED_SELECT_STYLE,
  LP_SAVE_TIMEOUT,
  applyHeaderTab,
  autoPickSet,
  expandSet,
  findSetByUid,
  handleAddBlockNative,
  handleFieldFocus,
  isSetCollapsed,
  sendToPreview,
} from './cp.js';
import { rightDockWidth, splitterFill } from './right-dock.js';
import { chromeSet } from './chrome-prefs.js';
import { ensurePanel } from './lazy-panels.js';

// ===== globals-lp =====
// --- Globals beside Live Preview -------------------------------------------------
//
// A picker in the Live Preview header lists the global sets. Choosing one opens
// it over the left editor — as an iframe of Statamic's own globals screen, so
// every fieldtype, replicator and validation works exactly as it does in the CP.
// (The left editor pane belongs to Statamic's Vue tree; putting a second publish
// form in there tears the entry form down. An iframe overlay does not.)
//
// The right sidebar is left alone, so the block tree / comments / library can
// stay open. Closing the overlay parks the iframe off-screen; the page section
// form underneath is still there.
//
// Typing in that form re-renders the preview immediately: the values are posted
// to the addon, which stashes them for the session, and the preview is asked to
// render again with `sve_globals=1` — the middleware then swaps the saved globals
// for these unsaved ones. Statamic itself only re-renders when the ENTRY changes,
// so the re-render is triggered by replaying the last preview URL.

export const GLOBALS_PANEL_ID = '__sve-globals-panel';
export const GLOBALS_PICKER_ID = '__sve-globals-picker';
export const GLOBALS_DEBOUNCE = 200;

// The URL of the most recent preview render, replayed whenever a global changes.
export let lastPreviewUrl = null;
export let globalsSaveTimer = null;

export function globalSets(win) {
  const sets = win.Statamic?.$config?.get?.('sveGlobalSets');

  return Array.isArray(sets) ? sets : [];
}

/** Global sets the globe menu lists — not every set the editor can still open. */
export function pickerGlobalSets(win) {
  const sets = globalSets(win);
  const allowed = win.Statamic?.$config?.get?.('sveGlobalsPicker');
  const off = win.Statamic?.$config?.get?.('sveGlobalsPickerOff') || [];

  if (!Array.isArray(allowed)) {
    return sets.filter((set) => !off.includes(set.handle));
  }

  return sets.filter((set) => allowed.includes(set.handle));
}

export function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

/**
 * The live Live Preview header — never the frozen copy of it.
 *
 * While a move is in flight there are two on the page: the real bar, and the
 * still on the cover that keeps it from blinking out. They match selector for
 * selector, so anything reaching for the header by class alone stands a good
 * chance of finding the photograph — and our own pollers would then build the
 * pickers into a bar that's about to be thrown away.
 */
export function lpHeader(doc) {
  return (
    [...doc.querySelectorAll('.live-preview-header')].find((el) => !el.closest(`#${sve.LP_COVER_ID}`)) ??
    null
  );
}

export function previewFrame(doc) {
  return doc.getElementById('live-preview-iframe');
}

/**
 * Clicking the page closes what the sidebar has open.
 *
 * Every popover in the CP — the colour picker, the select and dropdown menus —
 * closes on a pointerdown somewhere else in the CP document. A click inside the
 * preview is a pointerdown in the *iframe's* document, which that check never
 * sees, so a picker opened in the sidebar stayed on screen over the panel while
 * you carried on working on the page. The iframe is same-origin, so the fix is
 * to let the CP have the event too: forward it as a bare pointerdown on the CP
 * body, which every one of those popovers reads as "outside" and dismisses.
 *
 * pointerdown only, never click. The CP's own click handler treats a click that
 * lands on no set as "nothing is selected any more" and clears the outline —
 * which is the outline the preview click just put there.
 */
export function ensurePreviewOutsideDismiss(win) {
  const frame = previewFrame(win.document);

  if (!frame) {
    return;
  }

  const forward = () => {
    try {
      win.document.body?.dispatchEvent(
        new win.PointerEvent('pointerdown', { bubbles: true, cancelable: true })
      );
    } catch {
      /* nothing to dismiss with */
    }
  };

  // Re-armed per document: the preview reloads on every render, and the new
  // document carries none of the old one's listeners.
  const arm = () => {
    let doc;

    try {
      doc = frame.contentDocument;
    } catch {
      return; // cross-origin — nothing we can read
    }

    if (!doc || doc.__sveOutsideDismiss) {
      return;
    }

    doc.__sveOutsideDismiss = true;
    doc.addEventListener('pointerdown', forward, true);
  };

  arm();

  if (!frame.__sveOutsideDismiss) {
    frame.__sveOutsideDismiss = true;
    frame.addEventListener('load', arm);
  }
}

/** Ask the preview to render again, with or without the unsaved globals. */
export function refreshPreview(win, active) {
  const frame = previewFrame(win.document);

  if (!frame?.contentWindow || !lastPreviewUrl) {
    return;
  }

  frame.contentWindow.postMessage(
    {
      name: 'sve.globals',
      active,
      url: lastPreviewUrl,
      // Authoritative for surgical morph — don't rely on html class races alone.
      chromeKind: active ? activeChromeKind : null,
    },
    win.location.origin
  );
}

/** The URL the preview iframe is actually showing, not a remembered one. */
export function frameDocumentUrl(frame) {
  try {
    const href = frame?.contentWindow?.location?.href;

    if (href && href !== 'about:blank') {
      return href;
    }
  } catch {
    /* cross-origin — Live Preview is same-origin */
  }

  return frame?.getAttribute('src') || frame?.src || '';
}

/**
 * A tokenised Live Preview document — never a screenshot route or the public site.
 *
 * Replaying those into the iframe paints the front end (with Rediger) over the
 * preview and looks exactly like Live Preview closed.
 */
export function isLivePreviewDocumentUrl(url, origin) {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url, origin);

    if (parsed.origin !== origin) {
      return false;
    }

    if (parsed.pathname.includes('/!/sve/')) {
      return false;
    }

    return (
      parsed.searchParams.has('token') ||
      parsed.searchParams.has('live-preview') ||
      parsed.searchParams.has('preview')
    );
  } catch {
    return false;
  }
}

/**
 * Replay the current Live Preview URL into the iframe.
 *
 * Must morph, never `location.reload()`: a full reload of the front-end in the
 * iframe ejects Live Preview (same failure Vite `refresh: true` used to cause).
 */
export function replayLivePreview(win) {
  const frame = previewFrame(win.document);

  if (!frame?.contentWindow) {
    return;
  }

  const origin = win.location.origin;
  let url = frameDocumentUrl(frame);

  if (!isLivePreviewDocumentUrl(url, origin)) {
    url = lastPreviewUrl || '';
  }

  if (!isLivePreviewDocumentUrl(url, origin)) {
    return;
  }

  frame.contentWindow.postMessage({ name: 'statamic.preview.updated', url }, '*');
}

/** Header/footer currently stepped into from Live Preview (null when not). */
export let activeChromeKind = null;

export function setActiveChromeKind(kind) {
  activeChromeKind = kind === 'footer' || kind === 'header' ? kind : null;
}

/** Tell the preview iframe to keep header/footer chrome focus (soft rebind). */
export function assertChromeFocusInPreview(win) {
  if (!activeChromeKind) {
    return;
  }

  const kind = activeChromeKind;

  // One quiet ping after morph settles — not a burst (that caused flicker).
  clearTimeout(assertChromeFocusInPreview._timer);
  assertChromeFocusInPreview._timer = setTimeout(() => {
    sendToPreview({ source: 'statamic-visual-editor', type: 'sve-restore-chrome', kind }, win);
  }, 120);
}

/**
 * Records the URL of each preview render. Statamic POSTs the entry's values and
 * gets back a tokenised URL; that URL is what the preview iframe loads, and what
 * we replay to re-render after a global changes.
 */
export function watchPreviewRenders(win) {
  const isPreviewCall = (url, method) => {
    if (typeof url !== 'string' || !/^POST$/i.test(method || 'GET')) {
      return false;
    }

    let path;

    try {
      path = new URL(url, win.location.origin).pathname;
    } catch {
      return false;
    }

    // Statamic's entry-preview POST. Addon routes also contain "/preview"
    // (`/!/sve/globals-preview`, screenshot URLs) and must not overwrite this.
    return path.includes('/preview') && !path.includes('/!/sve/');
  };

  const remember = (payload) => {
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const url = data?.url;

      if (typeof url === 'string' && isLivePreviewDocumentUrl(url, win.location.origin)) {
        lastPreviewUrl = url;
      }
    } catch {
      /* not the payload we expected */
    }
  };

  const { fetch: originalFetch } = win;

  win.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);
    const request = originalFetch.call(this, input, init);

    if (!isPreviewCall(url, method)) {
      return request;
    }

    return request.then((response) => {
      response.clone().json().then(remember).catch(() => {});

      return response;
    });
  };

  // Statamic's CP talks to the server through axios, i.e. XMLHttpRequest — the
  // preview render never goes through fetch at all.
  const { open: originalOpen } = win.XMLHttpRequest.prototype;

  win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (isPreviewCall(url, method)) {
      this.addEventListener('load', () => {
        if (this.status >= 200 && this.status < 300) {
          remember(this.response ?? this.responseText);
        }
      });
    }

    return originalOpen.call(this, method, url, ...rest);
  };
}

export function postGlobals(win, handle, values) {
  clearTimeout(globalsSaveTimer);

  const epoch = globalsStashEpoch;

  globalsSaveTimer = setTimeout(() => {
    if (epoch !== globalsStashEpoch || !globalsAcceptValues) {
      return;
    }

    sveState.globalsStashActive = true;
    notifyChromeDirty(win);
    win
      .fetch('/!/sve/globals-preview', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ handle, values }),
      })
      .then(() => {
        refreshPreview(win, true);
        // The render that just went out replaces nodes in the preview. Chrome
        // focus is the fade, the outline and the bar that says what you are
        // editing and whether it is saved — all of it lives on those nodes, and
        // a render that lands without this leaves you editing the header with
        // nothing on screen saying so. Entering chrome asserts it once; typing
        // is what renders after that, so it has to assert it too.
        assertChromeFocusInPreview(win);
      })
      .catch(() => {
        /* the preview simply keeps the last render */
      });
  }, GLOBALS_DEBOUNCE);
}

/** True after we've pushed unsaved globals into the preview stash. */

/** Bumped on discard/save-clear so late polls can't resurrect "unsaved". */
export let globalsStashEpoch = 0;

/** False while discarding/reloading so in-flight value polls are ignored. */
export let globalsAcceptValues = true;

/** Serialized form snapshot considered "saved" while chrome focus is active. */

/** Ignore value polls until this timestamp (tab-lock settle after chrome open). */
export let chromeIgnoreValuePostsUntil = 0;

/** Cancel pending stash POSTs and ignore value polls until re-enabled. */
export function invalidateGlobalsPreviewStash() {
  clearTimeout(globalsSaveTimer);
  globalsSaveTimer = null;
  globalsStashEpoch += 1;
  sveState.globalsStashActive = false;
  globalsAcceptValues = false;
  sveState.chromeValuesBaseline = null;
}

/** Mark chrome form clean after open/save/discard settle. */
export function markChromeFormClean(win) {
  sveState.globalsStashActive = false;
  clearGlobalsDirtyMarks(win);

  // Edited in this window the form is right here, and what it holds a moment
  // after a save is the saved thing: Statamic replaces its values with what the
  // server sent back, and that lands a beat after the request resolves. Read as
  // an edit, it put the bar back to "unsaved changes" a quarter of a second
  // after saving — and then Close asked whether to discard work that was already
  // on disk. The window covers the echo; the poll adopts it as the new baseline.
  const container = sve.chromeHost(win.document) ? sve.chromeContainer() : null;

  if (container) {
    const values = sve.unwrapRef(container.values);

    if (values && typeof values === 'object') {
      sveState.chromeValuesBaseline = JSON.stringify(values);
      sveState.chromeValuesSeen = sveState.chromeValuesBaseline;
    }

    chromeIgnoreValuePostsUntil = Date.now() + 2000;
    notifyChromeDirty(win);

    return;
  }

  try {
    const iwin = globalsPanelFrame(win)?.contentWindow;
    const doc = iwin?.document;

    if (doc) {
      for (const container of sve.activeContainers(doc)) {
        const values = sve.unwrapRef(container.values);

        if (values && typeof values === 'object') {
          sveState.chromeValuesBaseline = JSON.stringify(values);
        }

        break;
      }
    }
  } catch {
    /* ignore */
  }

  notifyChromeDirty(win);
}

/** Tell the preview whether the chrome Save button should show. */
export function notifyChromeDirty(win) {
  const dirty = hasUnsavedGlobals(win);
  const saveBtn = win.document.querySelector('[data-sve-globals-save-btn]');

  if (saveBtn) {
    saveBtn.style.display = '';
    saveBtn.style.opacity = dirty ? '1' : sve.LP_ICON_IDLE_OPACITY;
  }

  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-chrome-dirty',
      dirty,
    },
    win
  );
}

/**
 * What the open global section calls itself, for the bar in the preview.
 *
 * Read off the values the panel streams up rather than the entry's own title:
 * the bar names the same thing the panel's header does — "Hero style 5" — and
 * that is the set's display name, not what the section was filed under in the
 * library.
 */
export function globalSectionLabel(win) {
  const rows = sveState.sectionPanelValues?.values?.[sve.sectionField(win)];
  const row = Array.isArray(rows) && rows.length ? rows[0] : null;
  const type = row?.type;

  if (typeof type !== 'string' || !type) {
    return null;
  }

  const custom = typeof row._sve_label === 'string' ? row._sve_label.trim() : '';

  if (custom) {
    return custom;
  }

  return sve.setMeta(win, type)?.display || sve.humanizeHandle(type);
}

/** Tell the preview whether the global-section Save button should show. */
export function notifyGlobalSectionDirty(win) {
  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-global-dirty',
      dirty: sve.hasUnsavedGlobalSection(win),
      label: globalSectionLabel(win),
    },
    win
  );
}

/** Listeners for Theme Settings / globals-panel save results (iframe). */
export const globalsSaveListeners = [];

export function onGlobalsSave(callback) {
  globalsSaveListeners.push(callback);

  return () => {
    const index = globalsSaveListeners.indexOf(callback);

    if (index !== -1) {
      globalsSaveListeners.splice(index, 1);
    }
  };
}

export function globalsPanelFrame(win) {
  return win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe') || null;
}

/**
 * Theme Settings (and other globals panels) live in a separate iframe, so the
 * entry form's Statamic.$dirty never sees them. The preview stash is the other
 * signal: any keystroke that refreshed the preview left unsaved globals in cache.
 */
export function hasUnsavedGlobals(win) {
  // Edited in this window there is no second $dirty to ask — the form shares the
  // page's — so the value poll's stash is the whole answer, exactly as it is for
  // the docked panel while chrome focus is on.
  if (sve.chromeHost(win.document)) {
    return sveState.globalsStashActive;
  }

  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const hidden =
    !panel ||
    panel.hasAttribute('data-sve-chrome-hidden') ||
    panel.style.visibility === 'hidden';

  // Prefetch loads Theme Settings off-screen; its hydrate must not count as edits.
  if (hidden) {
    return false;
  }

  if (sveState.globalsStashActive) {
    return true;
  }

  // Header/footer chrome: Statamic $dirty stays sticky after tab-lock / remount
  // and falsely shows Save. Only our value-poll stash counts as real edits.
  if (activeChromeKind) {
    return false;
  }

  const iwin = globalsPanelFrame(win)?.contentWindow;

  if (!iwin) {
    return false;
  }

  try {
    const dirty = iwin.Statamic?.$dirty;

    if (typeof dirty?.has !== 'function') {
      return false;
    }

    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = sve.unwrapRef(raw);

    // Empty names ⇒ clean. Don't fall through to a bare `has('base')` which
    // can stay true after discard and falsely keep the chrome Save bar on.
    if (Array.isArray(list)) {
      return list.some((name) => dirty.has(name));
    }

    return dirty.has('base');
  } catch {
    return false;
  }
}

/** Entry form and/or Theme Settings / globals panel have edits not on disk. */
export function hasUnsavedWork(win) {
  return sve.hasUnsavedChanges(win) || hasUnsavedGlobals(win) || sve.hasUnsavedGlobalSection(win);
}

/** Clear Statamic.$dirty marks inside the Theme Settings iframe. */
export function clearGlobalsDirtyMarks(win) {
  const iwin = globalsPanelFrame(win)?.contentWindow;

  if (!iwin) {
    return;
  }

  try {
    const dirty = iwin.Statamic?.$dirty;

    if (typeof dirty?.remove === 'function') {
      const names = new Set(['base']);
      const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
      const list = sve.unwrapRef(raw);

      if (Array.isArray(list)) {
        list.forEach((name) => names.add(name));
      }

      names.forEach((name) => dirty.remove(name));
    }

    dirty?.disableWarning?.();
  } catch {
    /* best effort */
  }

  // Re-baseline the iframe value poll so the post-save form snapshot
  // doesn't immediately re-mark chrome as dirty.
  try {
    iwin.postMessage(
      { source: 'statamic-visual-editor', type: 'sve-globals-saved' },
      win.location.origin
    );
  } catch {
    /* ignore */
  }
}

/** Drop Theme Settings dirty marks + preview stash (discard path). */
export function discardGlobalsChanges(win, { refresh = false, reloadForm = false } = {}) {
  // Stop late value polls / debounced stash POSTs from re-marking dirty.
  invalidateGlobalsPreviewStash();

  if (reloadForm) {
    // In this window the form is rebuilt from the CP's own answer next time, so
    // taking it down IS the reload — and it takes every dirty mark with it.
    if (sve.closeChromeInline(win, { refresh })) {
      globalsAcceptValues = true;

      return clearGlobalsStash(win, { refresh, force: true }).then(() => notifyChromeDirty(win));
    }

    // Destroy the dirty iframe entirely. In-place reload left Statamic.$dirty
    // (and stale polls) sticky, so re-entering chrome still showed Save.
    const panel = win.document.getElementById(GLOBALS_PANEL_ID);

    panel?._svePinRo?.disconnect?.();
    panel?.remove();
    globalsAcceptValues = true;
    sve.releaseLeftEdgeIfFree(win);
    sve.syncPreviewInset(win);

    return clearGlobalsStash(win, { refresh, force: true }).then(() => {
      notifyChromeDirty(win);
      scheduleChromeGlobalsPrefetch(win);
    });
  }

  clearGlobalsDirtyMarks(win);
  globalsAcceptValues = true;

  return clearGlobalsStash(win, { refresh, force: true }).then(() => {
    notifyChromeDirty(win);
  });
}

/**
 * Click Theme Settings' Save (via the panel iframe) and wait for the network
 * result. Resolves true on success / nothing to save, false on failure/timeout.
 */
export function saveGlobalsPanel(win, done) {
  if (!hasUnsavedGlobals(win)) {
    done(true);

    return;
  }

  const host = sve.chromeHost(win.document);
  const iwin = globalsPanelFrame(win)?.contentWindow;

  // Nothing open to save into: whatever the stash still holds is not backed by a
  // form any more, so it goes.
  if (!host && !iwin) {
    clearGlobalsStash(win, { refresh: false }).finally(() => done(true));

    return;
  }

  let settled = false;

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    clearTimeout(timer);
    done(ok);
  };

  const stop = onGlobalsSave(finish);
  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  if (host) {
    sve.pressChromeSave(win);

    return;
  }

  iwin.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-globals-save' },
    win.location.origin
  );
}

/**
 * Watch POSTs to the globals edit URL inside the Theme Settings iframe so we
 * know when Save actually landed (and can clear the preview stash).
 * Must be installed from the parent CP window (stash + listeners live there).
 * Statamic saves via axios → XMLHttpRequest; also wrap fetch for completeness.
 */
export function watchGlobalsPanelSaves(iwin, parentWin, entryPath = null) {
  if (!iwin || !parentWin || iwin.__sveGlobalsSaveWatch) {
    return;
  }

  iwin.__sveGlobalsSaveWatch = true;

  // A function, not a string, because the window being watched can be this one:
  // the CP is not reloaded between one global and the next, so which path counts
  // as "the save" changes while the same patched fetch stays in place.
  const globalsPath = entryPath ?? (() => iwin.location.pathname);

  const isSave = (url, method) => {
    if (!url || !/^(POST|PUT|PATCH)$/i.test(method || 'GET')) {
      return false;
    }

    const base = globalsPath();

    if (!base) {
      return false;
    }

    let path;

    try {
      path = new URL(url, iwin.location.origin).pathname;
    } catch {
      return false;
    }

    return path.startsWith(base) && !path.includes('/preview');
  };

  const announce = (ok) => {
    if (ok) {
      // What the form holds is now what is on disk, so every read taken on the
      // way here is stale — including the debounced stash POST that may still be
      // waiting to go out. Dropped by bumping the epoch, and the reads that
      // arrive while the save settles are covered by the window below; without
      // both, the bar went back to "unsaved changes" moments after saving and
      // Close then offered to discard work that was already saved.
      globalsStashEpoch += 1;
      clearTimeout(globalsSaveTimer);
      chromeIgnoreValuePostsUntil = Date.now() + 2500;

      // Keep flag true so clearGlobalsStash still hits the server endpoint.
      sveState.globalsStashActive = true;
      globalsAcceptValues = true;
      clearGlobalsDirtyMarks(parentWin);
      clearGlobalsStash(parentWin, { refresh: false }).then(() => {
        markChromeFormClean(parentWin);
      });

      // Theme Settings are part of every preview's fingerprint, so saving them
      // makes every picture in the library wrong at once — and the server starts
      // retaking them. The library hears that here, asks once, and asks once more
      // when the screenshot for this save has had time to land.
      sve.libraryWentStale(parentWin);
    }

    [...globalsSaveListeners].forEach((listener) => listener(ok));
  };

  const { fetch: originalFetch } = iwin;

  iwin.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (!isSave(url, method)) {
      return originalFetch.call(this, input, init);
    }

    return originalFetch.call(this, input, init).then(
      (response) => {
        announce(response.ok);

        return response;
      },
      (error) => {
        announce(false);

        throw error;
      }
    );
  };

  // Axios uses XHR — without this, chrome Save never clears dirty UI.
  const { open: originalOpen, send: originalSend } = iwin.XMLHttpRequest.prototype;

  iwin.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__sveGlobalsMethod = method;
    this.__sveGlobalsUrl = url;

    return originalOpen.call(this, method, url, ...rest);
  };

  iwin.XMLHttpRequest.prototype.send = function (...args) {
    if (isSave(this.__sveGlobalsUrl, this.__sveGlobalsMethod)) {
      this.addEventListener('load', () => {
        announce(this.status >= 200 && this.status < 300);
      });
      this.addEventListener('error', () => announce(false));
    }

    return originalSend.apply(this, args);
  };
}

export function ensureGlobalsPanelSaveWatch(win) {
  const frame = globalsPanelFrame(win);

  if (!frame) {
    return;
  }

  const arm = () => {
    try {
      if (frame.contentWindow) {
        globalsAcceptValues = true;
        watchGlobalsPanelSaves(frame.contentWindow, win);
      }
    } catch {
      /* iframe not ready */
    }
  };

  arm();
  frame.addEventListener('load', arm);
}

export function clearGlobalsStash(win, { refresh = true, force = false } = {}) {
  if (!sveState.globalsStashActive && !force) {
    if (refresh) {
      // Nothing stashed — don't bounce the preview.
    }

    notifyChromeDirty(win);

    return Promise.resolve();
  }

  sveState.globalsStashActive = false;

  return win
    .fetch('/!/sve/globals-preview/clear', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-TOKEN': csrfToken(win), 'X-Requested-With': 'XMLHttpRequest' },
    })
    .catch(() => {})
    .then(() => {
      notifyChromeDirty(win);

      if (refresh) {
        refreshPreview(win, false);
      }
    });
}

export function closeGlobalsPanel(win) {
  // Whichever one is open. Only one ever is.
  if (sve.closeChromeInline(win)) {
    return;
  }

  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  panel._svePinRo?.disconnect?.();
  panel.remove();

  const tabs = win.document.getElementById(sve.LP_WIDTH_ID);

  if (tabs) {
    tabs.style.visibility = '';
  }

  sve.releaseLeftEdgeIfFree(win);
  sve.syncPreviewInset(win);
  clearGlobalsStash(win, { refresh: true });

  // Warm the next open so footer/header clicks stay instant after close.
  scheduleChromeGlobalsPrefetch(win);
}

/**
 * Keep the Theme Settings iframe mounted (off-screen) so the next open is
 * instant. Does NOT clear the preview stash — that only happens on explicit
 * discard / close / save-clear.
 */
export function parkGlobalsPanel(win) {
  const doc = win.document;

  // Nothing to park in this window: the form is built from the Control Panel's
  // own answer in a few hundred milliseconds, so stepping back in is quick
  // without keeping a copy of it alive behind the page.
  if (sve.closeChromeInline(win)) {
    return;
  }

  const panel = doc.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  sve.parkGlobalsOverlay(panel);
  sveState.forcePanelOpen = false;
  sve.syncPreviewInset(win);
}

export const GLOBALS_WIDTH_KEY = 'sve-globals-panel-width';
export const GLOBALS_MIN_WIDTH = 320;

export function globalsPanelWidth(win) {
  return rightDockWidth(win);
}

/**
 * Drag handle on a docked panel's inner edge; the width is remembered.
 * `side: 'right'` = panel on the right (handle on its left). `side: 'left'` =
 * panel on the left (handle on its right).
 */
export function panelResizer(win, panel, { side = 'right', storageKey = GLOBALS_WIDTH_KEY, onResize } = {}) {
  const handle = win.document.createElement('div');
  const grip = splitterFill('ew');

  handle.style.cssText =
    side === 'left'
      ? `position:absolute;right:-8px;top:0;bottom:0;width:16px;cursor:ew-resize;z-index:2;touch-action:none;${grip}`
      : `position:absolute;left:-8px;top:0;bottom:0;width:16px;cursor:ew-resize;z-index:2;touch-action:none;${grip}`;
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    handle.setPointerCapture(event.pointerId);

    const frame = panel.querySelector('iframe');

    if (frame) {
      frame.style.pointerEvents = 'none';
    }

    const onMove = (move) => {
      const max = Math.max(GLOBALS_MIN_WIDTH, win.innerWidth - 360);
      const width =
        side === 'left'
          ? Math.min(Math.max(move.clientX, GLOBALS_MIN_WIDTH), max)
          : Math.min(Math.max(win.innerWidth - move.clientX, GLOBALS_MIN_WIDTH), max);

      panel.style.width = `${width}px`;
      sve.syncPreviewInset(win);
      onResize?.(width);
    };

    const onUp = () => {
      win.removeEventListener('pointermove', onMove);
      win.removeEventListener('pointerup', onUp);

      if (frame) {
        frame.style.pointerEvents = '';
      }

      chromeSet(win, storageKey, String(parseInt(panel.style.width, 10)));
    };

    win.addEventListener('pointermove', onMove);
    win.addEventListener('pointerup', onUp);
  });

  return handle;
}

export function globalsPanelUrl(win, set) {
  const url = new URL(set.url, win.location.origin);

  url.searchParams.set(GLOBALS_PANEL_PARAM, '1');

  return url.toString();
}

/** Prefetch Theme Settings as early as possible (even before Live Preview). */

export function scheduleChromeGlobalsPrefetch(win) {
  if (
    win.Statamic?.$config?.get?.('sveEnabled') === false ||
    (typeof sve.featureOn === 'function' &&
      !sve.featureOn(win, 'globals') &&
      !sve.featureOn(win, 'chrome_header') &&
      !sve.featureOn(win, 'chrome_footer'))
  ) {
    return;
  }

  win.setTimeout(() => prefetchChromeGlobals(win), 0);
}

/**
 * Background-load theme_settings into a hidden iframe. Page sections feel instant
 * because their form is already mounted; chrome needs the same head start —
 * ideally before the user opens Live Preview at all.
 */
export function prefetchChromeGlobals(win) {
  const doc = win.document;

  // Don't run inside the panel iframe itself.
  if (new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)) {
    return;
  }

  // What a click actually opens is the in-window form, and until now this warmed
  // the docked iframe instead — the fallback, the one path a click almost never
  // takes. So the head start went to the wrong door and the panel was a second
  // or two behind the click, every time.
  if (sve.CHROME_INLINE) {
    sve.warmChromeInlinePages(win);

    return;
  }

  if (doc.getElementById(GLOBALS_PANEL_ID)) {
    return;
  }

  const handle = chromeGlobalHandle(win);
  const sets = globalSets(win);
  const set = sets.find((candidate) => candidate.handle === handle);

  if (!set) {
    return;
  }

  openGlobalsPanel(win, set, { prefetch: true });
}

export function openGlobalsPanel(win, set, options = {}) {
  const doc = win.document;
  const existing = doc.getElementById(GLOBALS_PANEL_ID);
  const prefetch = options.prefetch === true;
  const chromeLock = options.chromeLock === 'footer' || options.chromeLock === 'header' ? options.chromeLock : null;

  // Switching sets reuses the panel rather than replacing it. Tearing an iframe
  // out of the page discards its session-history entries, and the browser then
  // traverses the joint history to recover — which fires `popstate` on the top
  // window. In the front-end edit overlay that reads as "the user pressed Back",
  // and the whole editor closes a few seconds after you pick a second global set.
  if (existing) {
    if (prefetch) {
      return;
    }

    const frame = existing.querySelector('iframe');
    const title = existing.querySelector('[data-sve-globals-title]');

    if (frame && title) {
      const label = chromeLock === 'footer' ? 'Footer' : chromeLock === 'header' ? 'Header' : set.title;

      title.textContent = label;
      existing.querySelector('[data-sve-focus-tile]') &&
        (existing.querySelector('[data-sve-focus-tile]').textContent = (label || '?').trim().charAt(0).toUpperCase());
      frame.title = set.title;
      sve.showGlobalsPanel(win);
      ensureGlobalsPanelSaveWatch(win);

      // Same set already loaded: do NOT location.replace — a dirty form inside
      // the iframe triggers Chrome's "Leave site?" dialog and blocks the editor.
      if (existing.getAttribute('data-sve-globals-handle') === set.handle) {
        if (chromeLock) {
          lockChromeGlobalsTab(win, chromeLock);
        } else {
          setActiveChromeKind(null);
          unlockChromeGlobalsTabs(win);
        }

        return;
      }

      const previousHandle = existing.getAttribute('data-sve-globals-handle');
      const switchSet = () => {
        existing.setAttribute('data-sve-globals-handle', set.handle);
        // New document → need a fresh save watch on the next load.
        try {
          delete frame.contentWindow.__sveGlobalsSaveWatch;
        } catch {
          /* ignore */
        }
        frame.contentWindow.location.replace(globalsPanelUrl(win, set));

        if (chromeLock) {
          lockChromeGlobalsTab(win, chromeLock);
        } else {
          setActiveChromeKind(null);
          unlockChromeGlobalsTabs(win);
        }
      };

      sve.confirmLeaveGlobalsOverlay(
        win,
        switchSet,
        () => {
          const picker = win.document.getElementById(GLOBALS_PICKER_ID);

          if (picker && previousHandle) {
            picker.value = previousHandle;
          }
        }
      );

      return;
    }

    existing.remove();
  }

  const panel = doc.createElement('div');

  panel.id = GLOBALS_PANEL_ID;
  panel.setAttribute('data-sve-globals-handle', set.handle);
  panel.setAttribute('data-sve-chrome-hidden', '1');

  const bar = doc.createElement('div');

  bar.style.cssText =
    'display:flex;align-items:center;gap:10px;padding:11px 12px 9px;' +
    'border-bottom:1px solid rgba(128,128,128,.16);flex:0 0 auto;';

  const tile = doc.createElement('span');

  tile.setAttribute('data-sve-focus-tile', '');
  tile.textContent = (set.title || '?').trim().charAt(0).toUpperCase();
  bar.appendChild(tile);

  const title = doc.createElement('h2');

  title.setAttribute('data-sve-globals-title', '');
  title.setAttribute('data-sve-focus-title', '');
  title.textContent = chromeLock === 'footer' ? 'Footer' : chromeLock === 'header' ? 'Header' : set.title;
  title.style.cssText = 'flex:1 1 auto;min-width:0;';
  bar.appendChild(title);

  // The CP's own Save sits in the page header, which the panel strips away — so
  // the panel carries its own, wired to the real button inside the frame.
  const actions = doc.createElement('div');

  actions.style.cssText = 'display:flex;align-items:center;gap:6px;';

  const save = doc.createElement('button');

  save.type = 'button';
  save.setAttribute('data-sve-globals-save-btn', '');
  save.textContent = t(win, 'save');
  save.title = t(win, 'save_globals');
  save.style.cssText =
    'all:unset;cursor:pointer;padding:5px 12px;border-radius:6px;background:var(--theme-color-primary,#4f46e5);' +
    'color:#fff;font-size:12px;font-weight:600;line-height:1;';
  save.style.display = '';
  save.style.opacity = hasUnsavedGlobals(win) ? '1' : sve.LP_ICON_IDLE_OPACITY;
  save.addEventListener('click', () => {
    const frame = doc.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

    frame?.contentWindow?.postMessage(
      { source: 'statamic-visual-editor', type: 'sve-globals-save' },
      win.location.origin
    );
  });
  actions.appendChild(save);

  const close = doc.createElement('button');

  close.type = 'button';
  close.textContent = '✕';
  close.title = t(win, 'close');
  close.style.cssText =
    'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
    'justify-content:center;border-radius:6px;color:currentColor;opacity:.7;';
  close.addEventListener('mouseenter', () => (close.style.background = 'rgba(128,128,128,.18)'));
  close.addEventListener('mouseleave', () => (close.style.background = 'transparent'));
  close.addEventListener('click', () => {
    // Same close rules as the preview chrome bar (warn if dirty).
    if (activeChromeKind) {
      sve.handleRequestCloseChrome(win);

      return;
    }

    const picker = doc.getElementById(GLOBALS_PICKER_ID);

    sve.confirmLeaveGlobalsOverlay(
      win,
      () => {
        if (picker) {
          picker.value = '';
        }

        closeGlobalsPanel(win);
      },
      () => {}
    );
  });
  actions.appendChild(close);
  bar.appendChild(actions);

  const frame = doc.createElement('iframe');

  frame.src = globalsPanelUrl(win, set);
  frame.title = set.title;
  frame.style.cssText = 'flex:1 1 auto;width:100%;border:0;background:transparent;';

  panel.appendChild(bar);
  panel.appendChild(frame);
  ensureGlobalsPanelSaveWatch(win);

  // Stay on body so the iframe is never reparented. Prefetch parks off-screen;
  // a real open covers the left editor.
  sve.attachGlobalsOverlay(win, panel);

  if (prefetch) {
    sve.parkGlobalsOverlay(panel);
  } else {
    sve.pinGlobalsPanelLeft(win, panel);
    sve.syncPreviewInset(win);

    if (chromeLock) {
      lockChromeGlobalsTab(win, chromeLock);
    }
  }
}

/** The global-set picker, sat beside the panel-mode buttons in the LP header. */
export function ensureGlobalsPicker(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const sets = pickerGlobalSets(win);

  if (!header || !sets.length || doc.getElementById(GLOBALS_PICKER_ID)) {
    return;
  }

  const select = doc.createElement('select');

  select.id = GLOBALS_PICKER_ID;
  select.title = 'Rediger globale indstillinger ved siden af previewet';
  select.style.cssText = FRAMED_SELECT_STYLE;

  const placeholder = doc.createElement('option');

  placeholder.value = '';
  placeholder.textContent = t(win, 'globals');
  select.appendChild(placeholder);

  sets.forEach((set) => {
    const option = doc.createElement('option');

    option.value = set.handle;
    option.textContent = set.title;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const previous = doc.getElementById(GLOBALS_PANEL_ID)?.getAttribute('data-sve-globals-handle') || '';
    const set = sets.find((candidate) => candidate.handle === select.value);

    if (set) {
      openGlobalsPanel(win, set);
    } else {
      sve.confirmLeaveGlobalsOverlay(
        win,
        () => closeGlobalsPanel(win),
        () => {
          select.value = previous;
        }
      );
    }
  });

  // Same option already selected does not fire `change` — click re-shows a
  // parked Theme Settings panel without reloading the iframe.
  select.addEventListener('click', () => {
    const set = sets.find((candidate) => candidate.handle === select.value);

    if (!set) {
      return;
    }

    const panel = doc.getElementById(GLOBALS_PANEL_ID);

    if (!panel || panel.hasAttribute('data-sve-chrome-hidden')) {
      openGlobalsPanel(win, set);
    }
  });

  // Wrapperen bliver stående selv om der kun er én kontrol i den: applyHeaderTab
  // viser og skjuler kontrollerne på `parentElement`, og uden den ville selecten
  // selv være det der blev slået til og fra.
  const wrap = doc.createElement('div');

  wrap.style.cssText = 'display:inline-flex;align-items:center;font-family:inherit;';
  wrap.appendChild(select);
  header.appendChild(wrap);
}

export const LIBRARY_BUTTON_ID = '__sve-library-btn';

/** A "Sektioner" toggle in the LP header that opens/closes the section library. */
export function ensureSectionLibraryButton(win) {
  const doc = win.document;
  const group = doc.getElementById(sve.LP_MODE_ID);

  if (!group || doc.getElementById(LIBRARY_BUTTON_ID)) {
    return;
  }

  const btn = doc.createElement('button');

  btn.id = LIBRARY_BUTTON_ID;
  btn.type = 'button';
  btn.title = t(win, 'sections');
  btn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  btn.style.cssText =
    'height:28px;display:inline-flex;align-items:center;gap:6px;padding:0 10px;border-radius:8px;cursor:pointer;' +
    'color:currentColor;background:rgba(128,128,128,.16);border:none;font-size:12px;font-weight:500;font-family:inherit;';
  btn.append(t(win, 'sections'));
  btn.addEventListener('click', () => {
    void ensurePanel('sections').then(() => sve.openSectionPicker(win));
  });

  // After the globals picker if it exists, otherwise right after the mode group.
  (doc.getElementById(GLOBALS_PICKER_ID) || group).after(btn);
  sve.syncSectionLibraryAvailability(win);
}

/**
 * Runs inside the globals panel's iframe: strips the CP chrome down to the form,
 * and streams the form's values up to the Live Preview window as they're typed.
 */
export function initGlobalsPanelFrame(win) {
  const doc = win.document;

  if (!new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)) {
    return false;
  }

  const style = doc.createElement('style');

  style.textContent = `
    html, body {
      background: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
    }
    [data-sve-panel-hide] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
      min-height: 0 !important;
    }
    /* Synced-section entry: always hide library meta + Published, even before
       JS finds the exact wrappers (Statamic 6 markup varies / may omit field_*). */
    html[data-sve-entry-panel] #field_title,
    html[data-sve-entry-panel] #field_synced,
    html[data-sve-entry-panel] #field_section_type,
    html[data-sve-entry-panel] #field_preview_image,
    html[data-sve-entry-panel] [name="published"],
    html[data-sve-entry-panel] input[name="published"] {
      display: none !important;
    }
    /* Top-level title (library name) — not titles inside the section set. */
    html[data-sve-entry-panel] .publish-fields > [class*="title-fieldtype"],
    html[data-sve-entry-panel] .publish-form > * > [class*="title-fieldtype"] {
      display: none !important;
    }
    /* Hide the CP shell so the form is the panel. Do not restyle Statamic cards. */
    .h-14.bg-global-header-bg {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      min-height: 0 !important;
      overflow: hidden !important;
    }
    #main {
      top: 0 !important;
    }
    [data-ui-header] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
    }
    /* Only extra: 26px above the tabs. Left/right stay Statamic default. */
    #content-card {
      padding-top: 26px !important;
    }
    main {
      margin: 0 !important;
      padding-block: 0 !important;
      padding-inline: 0 !important;
    }
    main > *:first-child {
      margin-block-start: 0 !important;
      padding-block-start: 0 !important;
    }
    [role="tablist"],
    nav[role="tablist"],
    .tabs {
      margin-block: 0 !important;
      padding-block: 0 !important;
    }
    /* Chrome lock: kill every spacer above the fields — toggle sits outside the iframe. */
    html[data-sve-chrome-locked] [role="tablist"],
    html[data-sve-chrome-locked] [data-sve-chrome-tablist-lock],
    html[data-sve-chrome-locked] [data-sve-chrome-spacer] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
      min-height: 0 !important;
    }
    html[data-sve-chrome-locked],
    html[data-sve-chrome-locked] body {
      margin: 0 !important;
      padding: 0 !important;
    }
    html[data-sve-chrome-locked] main,
    html[data-sve-chrome-locked] main > *,
    html[data-sve-chrome-locked] .publish-form,
    html[data-sve-chrome-locked] .publish-sections,
    html[data-sve-chrome-locked] .tabs-container,
    html[data-sve-chrome-locked] [data-reka-tabs-root],
    html[data-sve-chrome-locked] [data-orientation] {
      margin-top: 0 !important;
      margin-block-start: 0 !important;
      padding-top: 0 !important;
      padding-block-start: 0 !important;
      gap: 0 !important;
      row-gap: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-sections > .card,
    html[data-sve-chrome-locked] main .card {
      margin: 0 !important;
      margin-top: 0 !important;
      padding-top: 10px !important;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-fields {
      padding-top: 0 !important;
      margin-top: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-section-header,
    html[data-sve-chrome-locked] .section-header,
    html[data-sve-chrome-locked] [data-section-header],
    html[data-sve-chrome-locked] .publish-fields > h2,
    html[data-sve-chrome-locked] .publish-fields > h3,
    html[data-sve-chrome-locked] .card > header,
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h1),
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h2),
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h3) {
      display: none !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
    }
  `;
  doc.head.appendChild(style);

  // The same panel serves a global SET (/cp/globals/<handle>) and a global
  // SECTION (/cp/collections/<c>/entries/<id>) — both are just a publish form in
  // an iframe. The path says which; each stashes through its own channel, and
  // only an entry brings its own Save button along.
  const isEntry = win.location.pathname.includes('/collections/');

  if (isEntry) {
    doc.documentElement.setAttribute('data-sve-entry-panel', '');
  }

  // Strip the CP's own chrome (top bar, main nav) but nothing else: the publish
  // form lives inside <main>, and it has plenty of its own <header>s (every
  // replicator set) and <nav>s (the tab bar) that must survive.
  const hideChrome = () => {
    const main = doc.querySelector('main');

    doc.querySelectorAll('nav, header').forEach((el) => {
      if (main && (main.contains(el) || el.contains(main))) {
        return;
      }

      el.setAttribute('data-sve-panel-hide', '');
    });

    // Inside <main>: hide the publish page toolbar (globe + title + Save) — the
    // outer SVE panel already has title/Save/✕. Leave replicator/Bard set headers
    // alone (they carry [data-drag-handle]).
    if (main) {
      main.querySelectorAll('h1').forEach((el) => {
        if (el.closest('[data-drag-handle], [data-replicator-set], [data-grid-row]')) {
          return;
        }

        el.setAttribute('data-sve-panel-hide', '');
      });

      main.querySelectorAll('header').forEach((el) => {
        if (el.querySelector('[data-drag-handle]')) {
          return;
        }

        const hasSave = [...el.querySelectorAll('button')].some((button) =>
          /^(save|gem)\b/i.test((button.textContent || '').trim())
        );

        if (hasSave) {
          el.setAttribute('data-sve-panel-hide', '');
        }
      });
    }

    // Statamic 6 page Header is a padded flex div (`data-ui-header`, py-6/py-8),
    // not <header>/h1 — hiding the title left the padding as an empty band.
    doc.querySelectorAll('[data-ui-header]').forEach((el) => {
      el.setAttribute('data-sve-panel-hide', '');
    });
    doc.querySelectorAll('button').forEach((button) => {
      if (!/^(save|gem)\b/i.test((button.textContent || '').trim())) {
        return;
      }

      button.setAttribute('data-sve-panel-hide', '');
      button.nextElementSibling?.setAttribute('data-sve-panel-hide', '');

      let node = button.parentElement;

      for (let depth = 0; node && node !== main && depth < 6; depth += 1, node = node.parentElement) {
        if (node.querySelector('[data-drag-handle]')) {
          break;
        }

        const hasTitle = node.querySelector('h1, h2');

        if (hasTitle) {
          node.setAttribute('data-sve-panel-hide', '');
          break;
        }
      }
    });

    // Synced-section entry: hide library meta + publish chrome so the panel
    // matches a normal section focus view (not Navn/Synced/Published/SEO).
    if (isEntry) {
      hideSavedSectionEntryChrome(doc);
    }
  };

  // When set (e.g. "header"), chrome focus hides every other publish tab so you
  // can't jump to Colors / Typography while editing the site header/footer.
  let lockedTabNeedle = null;

  // Tabs this global set never shows in the docked panel (see the addon's
  // `chrome.hidden_tabs`). Header and footer are edited by clicking them on the
  // page; the tab is a second way in that shows you nothing while you type.
  //
  // Hidden here only — the ordinary Control Panel globals screen is untouched,
  // so nothing becomes unreachable. And chrome focus still LOCKS to these tabs,
  // which is why they're only hidden while unlocked: a `display:none` tab has no
  // offsetParent, and the lock finds its tab among the visible ones.
  // Read per call, not once at boot: `Statamic.$config` is populated while the
  // CP boots, and this runs early enough that caching it could catch an empty
  // one and then never look again. A config get and an array lookup are cheap.
  const hiddenTabNeedles = () => {
    if (isEntry) {
      return [];
    }

    const map = win.Statamic?.$config?.get?.('sveHiddenGlobalsTabs') || {};
    const handle = win.location.pathname.split('/').filter(Boolean).pop();

    return Array.isArray(map[handle]) ? map[handle] : [];
  };

  const isHiddenTab = (tab, needles = hiddenTabNeedles()) => {
    const text = (tab.textContent || '').trim().toLowerCase();

    return needles.some((needle) => text === needle || text.startsWith(needle));
  };

  const activatePublishTab = (needle) => {
    if (!needle) {
      return false;
    }

    const tabs = [...doc.querySelectorAll('button[role="tab"]')].filter(
      (el) => el.offsetParent !== null
    );
    const tab = tabs.find((el) => {
      const text = (el.textContent || '').trim().toLowerCase();

      return text === needle || text.startsWith(needle);
    });

    if (!tab) {
      return false;
    }

    if (tab.getAttribute('aria-selected') !== 'true') {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
        tab.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
      });
    }

    return tab.getAttribute('aria-selected') === 'true';
  };

  const applyTabLock = () => {
    const tabs = [...doc.querySelectorAll('button[role="tab"]')];

    if (!lockedTabNeedle) {
      const needles = hiddenTabNeedles();

      doc.documentElement.removeAttribute('data-sve-chrome-locked');

      // Decided before anything is hidden, and from the tabs actually on screen:
      // reka-ui keeps a hidden measurement copy of every tab, and a tab we hide
      // ourselves stops being findable the same way.
      const visible = tabs.filter((tab) => tab.offsetParent !== null);
      const selected = visible.find((tab) => tab.getAttribute('aria-selected') === 'true');
      const fallback = visible.find((tab) => !isHiddenTab(tab, needles));
      const moveOff = selected && isHiddenTab(selected, needles) && fallback;

      tabs.forEach((tab) => {
        if (tab.hasAttribute('data-sve-chrome-tab-lock')) {
          tab.removeAttribute('data-sve-panel-hide');
          tab.removeAttribute('data-sve-chrome-tab-lock');
        }

        if (isHiddenTab(tab, needles)) {
          tab.setAttribute('data-sve-panel-hide', '');
          tab.setAttribute('data-sve-globals-tab-hide', '');
        }
      });

      // Statamic opens on the first tab — which is one of the ones just hidden.
      // Without this the panel shows the header's fields under no visible tab.
      if (moveOff) {
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
          fallback.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
        });
      }
      doc.querySelectorAll('[data-sve-chrome-tablist-lock]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-tablist-lock');
      });
      doc.querySelectorAll('[data-sve-chrome-section-title]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-section-title');
      });
      doc.querySelectorAll('[data-sve-chrome-spacer]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-spacer');
      });

      return;
    }

    const matchesLock = (tab) => {
      const text = (tab.textContent || '').trim().toLowerCase();

      return text === lockedTabNeedle || text.startsWith(lockedTabNeedle);
    };

    // Is the tab we lock to already the open one? Asked first, and this is the
    // ordinary case: the observer runs on every mutation, and typing in the form
    // is a stream of them. Only a pass that has somewhere to go may disturb the
    // lock — undoing and redoing it on each keystroke drops the panel out of
    // chrome focus between renders, which reads as a flicker.
    const selected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');

    if (!selected || !matchesLock(selected)) {
      // Everything that hides a tab comes off before the tab is looked for, and
      // the lock's own marker last of all — `html[data-sve-chrome-locked]` hides
      // every `[role="tablist"]` by stylesheet, so with it set there is no
      // visible tab left to find. That matters because `activatePublishTab`
      // searches the tabs actually on screen: reka-ui keeps a hidden measurement
      // twin of each one, and off-screen the real tab can't be told from its twin.
      doc.documentElement.removeAttribute('data-sve-chrome-locked');

      doc.querySelectorAll('[data-sve-globals-tab-hide]').forEach((tab) => {
        tab.removeAttribute('data-sve-panel-hide');
        tab.removeAttribute('data-sve-globals-tab-hide');
      });

      doc.querySelectorAll('[data-sve-chrome-tablist-lock]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-tablist-lock');
      });

      // Not mounted yet, or renamed away — or reka-ui hasn't settled the
      // selection this tick. Leave the panel as Statamic renders it, tabs and
      // all, and try again on the next mutation: a visible tab row the reader
      // can steer with beats a hidden one over the wrong fields.
      if (!activatePublishTab(lockedTabNeedle)) {
        return;
      }
    }

    doc.documentElement.setAttribute('data-sve-chrome-locked', '1');

    tabs.forEach((tab) => {
      if (matchesLock(tab)) {
        tab.removeAttribute('data-sve-panel-hide');
        tab.removeAttribute('data-sve-chrome-tab-lock');

        return;
      }

      tab.setAttribute('data-sve-panel-hide', '');
      tab.setAttribute('data-sve-chrome-tab-lock', '');
    });

    // Hide the whole tab row (incl. overflow "…" / lone "Design") so fields sit tight.
    doc.querySelectorAll('[role="tablist"]').forEach((list) => {
      const wrap = list.closest('nav') || list.parentElement || list;

      wrap.setAttribute('data-sve-panel-hide', '');
      wrap.setAttribute('data-sve-chrome-tablist-lock', '');
    });

    // Blueprint section titles like "Design" — redundant under chrome Design|Settings toggle.
    doc.querySelectorAll('h1, h2, h3').forEach((heading) => {
      const text = (heading.textContent || '').trim().toLowerCase();

      if (text !== 'design') {
        return;
      }

      const wrap = heading.closest('.publish-section-header, .section-header, header, .flex') || heading;

      wrap.setAttribute('data-sve-panel-hide', '');
      wrap.setAttribute('data-sve-chrome-section-title', '');
    });

    // Collapse every sibling above the first publish card — that empty band was the gap
    // under Design|Settings.
    const main = doc.querySelector('main');
    const card = main?.querySelector('.card, .publish-fields, .publish-sections');

    if (card) {
      let node = card;

      while (node && node !== main) {
        let sib = node.previousElementSibling;

        while (sib) {
          const prev = sib.previousElementSibling;

          if (!sib.hasAttribute('data-sve-chrome-spacer')) {
            sib.setAttribute('data-sve-panel-hide', '');
            sib.setAttribute('data-sve-chrome-spacer', '');
          }

          sib = prev;
        }

        node = node.parentElement;
      }
    }
  };

  hideChrome();
  applyTabLock();
  new win.MutationObserver(() => {
    hideChrome();
    applyTabLock();
  }).observe(doc.documentElement, { childList: true, subtree: true });

  // Style picks / tab jumps must not trip "Leave site?" from Statamic's dirty check.
  try {
    win.Statamic?.$dirty?.disableWarning?.();
  } catch {
    /* ignore */
  }

  // Statamic's own Save button lives in the page header the panel strips away.
  // It still works — it just can't be seen — so the panel's Save clicks it, and
  // the normal save (validation, revisions, toast) runs untouched.
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    if (event.data?.source !== 'statamic-visual-editor') {
      return;
    }

    // An inline edit in the page, on content this form owns: apply it to the real
    // container here. The value poll below streams it straight back out, so the
    // page re-renders with it — the edit never has to know it crossed a window.
    if (event.data.type === 'sve-section-set-value') {
      for (const container of sve.activeContainers(doc)) {
        container.setFieldValue(event.data.path, event.data.value);

        return;
      }

      return;
    }

    // The preview's "+" inside this global section. The blocks belong to this
    // form, so Statamic's own Add Set picker is opened here — the same call the
    // CP makes for a page's own sections, just in the document that has them.
    if (event.data.type === 'sve-section-add-block') {
      handleAddBlockNative(event.data, doc, win);
      autoPickSet(doc, win, event.data.setLabel);

      return;
    }

    // Header/footer design picker: write flattened `header_style` / `footer_style`.
    if (event.data.type === 'sve-chrome-set-style') {
      const kind = event.data.kind === 'footer' ? 'footer' : 'header';
      const style = event.data.style;

      for (const container of sve.activeContainers(doc)) {
        container.setFieldValue(`${kind}_style`, style);

        return;
      }

      return;
    }

    // Open the matching publish tab (Header / Footer / …). reka-ui ignores a
    // bare click() and keeps a hidden twin of each tab — only the visible one.
    if (event.data.type === 'sve-activate-tab') {
      activatePublishTab(
        String(event.data.label || event.data.kind || '')
          .trim()
          .toLowerCase()
      );

      return;
    }

    // Live Preview header/footer: only that tab's fields — hide Colors, etc.
    if (event.data.type === 'sve-lock-tab') {
      lockedTabNeedle = String(event.data.label || event.data.kind || '')
        .trim()
        .toLowerCase();

      if (lockedTabNeedle) {
        activatePublishTab(lockedTabNeedle);
        applyTabLock();
      }

      return;
    }

    if (event.data.type === 'sve-unlock-tabs') {
      lockedTabNeedle = null;
      applyTabLock();

      return;
    }

    // Parent confirmed a successful Save — treat current values as clean baseline.
    if (event.data.type === 'sve-globals-saved') {
      for (const container of sve.activeContainers(doc)) {
        const values = sve.unwrapRef(container.values);

        if (values && typeof values === 'object') {
          previous = JSON.stringify(values);
          seeded = true;
        }

        break;
      }

      return;
    }

    if (event.data.type !== 'sve-globals-save') {
      return;
    }

    // A global set's button reads "Save"; an entry's reads "Save & Publish" — so
    // match the start, not the whole label, or the panel's Save silently does
    // nothing for a global section. Clicking works even though it's hidden.
    [...doc.querySelectorAll('button')]
      .find((button) => /^(save|gem)\b/i.test((button.textContent || '').trim()))
      ?.click();
  });

  const handle = win.location.pathname.split('/').filter(Boolean).pop();
  let previous = null;
  let seeded = false;

  // Polled rather than watched: the container's `values` is a Vue ref, and a
  // 200ms compare is both cheaper and far more robust than reaching into Vue's
  // reactivity from outside its bundle.
  win.setInterval(() => {
    for (const container of sve.activeContainers(doc)) {
      const values = sve.unwrapRef(container.values);

      if (!values || typeof values !== 'object') {
        continue;
      }

      const serialized = JSON.stringify(values);

      if (serialized === previous) {
        return;
      }

      const changed = previous !== null;
      previous = serialized;

      // First snapshot: still push for entries so the parent can resolve inline
      // edit (sve.sectionPanelContainer). Parent treats the first poll as baseline
      // and does not mark dirty / stash. Globals keep the old "seed silent" path
      // — pushing them refreshed the Live Preview on every panel open.
      if (!seeded) {
        seeded = true;

        if (!isEntry) {
          return;
        }
      } else if (!changed) {
        return;
      }

      try {
        win.parent.postMessage(
          isEntry
            ? { source: 'statamic-visual-editor', type: 'sve-section-values', id: handle, values: JSON.parse(serialized) }
            : { source: 'statamic-visual-editor', type: 'sve-globals-values', handle, values: JSON.parse(serialized) },
          win.location.origin
        );
      } catch {
        /* the panel was closed */
      }

      return;
    }
  }, 250);

  // Preview asked to focus a field/block inside this synced section — same as
  // clicking it on a normal page (solo + field focus in THIS form).
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin || event.data?.source !== 'statamic-visual-editor') {
      return;
    }

    if (event.data.type === 'sve-section-focus') {
      const applyFocus = (attempt = 0) => {
        hideSavedSectionEntryChrome(doc);

        // Same path as a normal page click: open the block that owns the field,
        // not just the section scope (which may be a parent when block ids were
        // missing from saved YAML).
        if (event.data.field) {
          let opened = false;

          if (event.data.uid) {
            if (sve.focusPanelOn(win)) {
              opened = sve.focusFieldOwner(event.data.field, event.data.uid, doc, win);
            } else {
              opened = sve.soloSection(event.data.uid, doc, win);
            }
          }

          handleFieldFocus(event.data.field, doc, { scopeUid: event.data.uid });

          if (event.data.uid) {
            win.setTimeout(
              () => handleFieldFocus(event.data.field, doc, { animate: false, scopeUid: event.data.uid }),
              COLLAPSE_SETTLE_MS
            );
          }

          // Form still mounting / set collapsed — expand and retry a few times
          // so the sidebar does not stick on an empty Headline header.
          if (!opened && event.data.uid && attempt < 12) {
            expandTopLevelSectionSets(doc, sve.sectionField(win));
            win.setTimeout(() => applyFocus(attempt + 1), 120);
          }
        } else if (event.data.uid) {
          const opened = sve.soloSection(event.data.uid, doc, win);

          if (!opened && attempt < 12) {
            expandTopLevelSectionSets(doc, sve.sectionField(win));
            win.setTimeout(() => applyFocus(attempt + 1), 120);
          }
        }
      };

      applyFocus();
    }
  });

  // Entry form for a saved section: jump straight into the first page section so
  // the left panel matches a normal Hero/… focus view (not Navn/Synced meta).
  if (isEntry) {
    injectPanelFocusStyles(doc);
    bootSavedSectionSolo(win, doc);
    // Parent may have queued a click before this frame's listener existed.
    try {
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'sve-section-panel-ready' },
        win.location.origin
      );
    } catch {
      /* panel closed */
    }
  }

  return true;
}

/** Focus-panel CSS lives on the parent CP; the sve-panel iframe needs its own copy. */
export function injectPanelFocusStyles(doc) {
  if (doc.getElementById('__sve-panel-focus-styles')) {
    return;
  }

  const style = doc.createElement('style');

  style.id = '__sve-panel-focus-styles';
  style.textContent = `
    [data-sve-focus-header] {
      position: sticky; top: 0; z-index: 3; display: flex; flex-direction: column;
      gap: 0.5rem; margin-bottom: 0.75rem; padding: 0.875rem 0 1rem;
      border-bottom: 1px solid rgba(128,128,128,.16);
      background: var(--theme-color-content-bg, var(--color-white, #fff));
    }
    [data-sve-focus-id] { display: flex; align-items: center; gap: 0.7rem; }
    [data-sve-focus-tile] {
      flex: 0 0 auto; display: flex; align-items: center; justify-content: center;
      width: 2.1rem; height: 2.1rem; border-radius: 0.6rem;
      background: rgba(128,128,128,.16); font-size: 0.9rem; font-weight: 600; line-height: 1;
    }
    [data-sve-focus-title] { margin: 0; font-size: 1rem; font-weight: 600; line-height: 1.25; }
    [data-sve-focus-back] {
      all: unset; cursor: pointer; flex: 0 0 auto; display: inline-flex; align-items: center;
      gap: 0.55em; margin-left: auto; padding: 0.55em 0.95em; border-radius: 0.55rem;
      background: rgba(128,128,128,.16); font-size: 0.75rem; font-weight: 500; line-height: 1;
      white-space: nowrap;
    }
    [data-sve-focus-back]:hover { background: rgba(128,128,128,.28); }
    [data-sve-focus-back-arrow] {
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 1.2rem; line-height: 1; font-weight: 600;
      transform: translateY(-1.5px);
    }
    [data-sve-focus-desc] { margin: 0; font-size: 0.8125rem; line-height: 1.5; opacity: .6; }
    [data-sve-focus] [data-sve-focus-hide] { display: none !important; }
    [data-sve-focus] [data-sve-focus-set] > header { display: none !important; }
    [data-sve-focus-step] {
      all: unset; cursor: pointer; flex: 0 0 auto; display: inline-flex; align-items: center;
      justify-content: center; width: 1.6rem; height: 1.6rem; margin-left: 0.25rem;
      border-radius: 0.4rem; opacity: .45;
    }
    header:hover > [data-sve-focus-step] { opacity: .9; }
    [data-sve-focus] [data-sve-focus-flat] {
      border: 0 !important; border-radius: 0 !important; background: none !important;
      box-shadow: none !important; padding: 0 !important; margin: 0 !important;
    }
    [data-sve-focus] [data-sve-focus-flat] > hr { display: none !important; }
    [data-sve-focus] [data-sve-focus-flush] { padding-inline: 0 !important; }
    /* Entry Main/Sidebar tabs — redundant once we're inside the section. */
    [data-sve-focus] [role="tablist"] { display: none !important; }
  `;
  doc.head.appendChild(style);
}

/** Library-only fields on a saved_sections entry — not part of a normal section edit. */
export const SAVED_SECTION_META_HANDLES = ['title', 'synced', 'section_type', 'preview_image'];

/**
 * Hide entry chrome that a normal Live Preview section never shows: library
 * meta (Navn/Synced/…), Published, and SEO/Sidebar/Page settings tabs.
 */
export function hideSavedSectionEntryChrome(doc) {
  const hideRow = (el) => {
    if (!el) {
      return;
    }

    // Never hide fields that live inside the section being edited.
    if (el.closest?.(SELECTORS.replicatorSet)) {
      return;
    }

    // `[class*="publish-field"]` is deliberately not in this list. Statamic 6
    // renders no singular `.publish-field` at all — a field is a `*-fieldtype`
    // wrapper — so the substring match only ever found `.publish-fields`, the
    // whole field column, and hiding one meta field took the entire panel with
    // it: header showing, nothing under it.
    const row =
      el.closest('.publish-field') ||
      el.closest('[class*="-fieldtype"]') ||
      el.closest('label') ||
      (el.parentElement?.children.length === 1 ? el.parentElement : el);

    // A row holding the section itself is not a row — it is the column around
    // it. Asked in terms of what must survive rather than what to climb past,
    // so the next markup change cannot bring the blank panel back.
    if (!row || row.querySelector?.(SELECTORS.replicatorSet)) {
      return;
    }

    row.setAttribute('data-sve-panel-hide', '');
  };

  for (const handle of SAVED_SECTION_META_HANDLES) {
    const el =
      doc.getElementById(`field_${handle}`) ||
      doc.querySelector(`.publish-field-${handle}`) ||
      doc.querySelector(`[data-field="${handle}"]`) ||
      doc.querySelector(`[data-handle="${handle}"]`);

    if (el) {
      el.setAttribute('data-sve-panel-hide', '');
      hideRow(el);
    }

    // Statamic 6 often omits field_* ids — match bare name attributes outside sets.
    doc.querySelectorAll(`[name="${handle}"]`).forEach((input) => hideRow(input));
  }

  // Published toggle — Statamic 6 may render it outside field_* ids (switch /
  // reka). Match by label text, name, or aria.
  doc.querySelectorAll('label, .toggle-fieldtype, [class*="toggle-fieldtype"], [role="switch"]').forEach((el) => {
    if (el.closest?.(SELECTORS.replicatorSet)) {
      return;
    }

    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    const name = el.getAttribute('name') || el.querySelector?.('input')?.getAttribute('name') || '';

    if (
      /^(published|udgivet)\b/i.test(text) ||
      name === 'published' ||
      el.querySelector?.('input[name="published"]')
    ) {
      hideRow(el);
    }
  });

  doc.querySelectorAll('input[name="published"], [name="published"]').forEach(hideRow);

  // Extra publish tabs (Sidebar / SEO / Page settings) — keep Main only.
  // Section Content/Style use data-sve-section-seg (tabs addon), not role=tab.
  const tabs = [...doc.querySelectorAll('button[role="tab"]')];

  if (tabs.length > 1) {
    const first = tabs[0];

    if (first.getAttribute('aria-selected') !== 'true') {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
        first.dispatchEvent(
          new (doc.defaultView?.PointerEvent || PointerEvent)(type, {
            bubbles: true,
            cancelable: true,
          })
        );
      });
    }

    tabs.forEach((tab, index) => {
      if (index > 0) {
        tab.setAttribute('data-sve-panel-hide', '');
      }
    });

    const tablist = first.closest('[role="tablist"]');

    if (tablist) {
      tablist.setAttribute('data-sve-panel-hide', '');
    }
  }
}

/**
 * Expand top-level page_sections sets so their _visual_id inputs exist in the DOM.
 * Collapsed replicator sets render no fields — findSetByUid would otherwise fail.
 */
export function expandTopLevelSectionSets(doc, field) {
  const fieldEl = doc.getElementById(`field_${field}`);
  const root = fieldEl || doc.querySelector('main') || doc;
  let expanded = false;

  root.querySelectorAll(SELECTORS.replicatorSet).forEach((setEl) => {
    const ancestor = setEl.parentElement?.closest(SELECTORS.replicatorSet);

    if (ancestor && root.contains(ancestor)) {
      return; // nested block — leave for sve.focusFieldOwner / solo later
    }

    if (isSetCollapsed(setEl)) {
      expandSet(setEl);
      expanded = true;
    }
  });

  return expanded;
}

/** Solo the first page_sections row so the panel matches a normal section edit. */
export function bootSavedSectionSolo(win, doc) {
  const field = sve.sectionField(win);
  let attempts = 0;

  hideSavedSectionEntryChrome(doc);

  const tryBoot = () => {
    hideSavedSectionEntryChrome(doc);

    // Prefer event-captured containers; fall back to walking the Vue tree from
    // any mounted visual-id input (form may have mounted before we listened).
    const containers = sve.activeContainers(doc);

    for (const container of containers) {
      const values = sve.unwrapRef(container.values);
      const rows = values && typeof values === 'object' ? values[field] : null;

      if (!Array.isArray(rows) || !rows.length) {
        continue;
      }

      // Legacy synced entries stripped nested ids — assign them once so preview
      // scope="{{ id }}" and sve.focusFieldOwner can target Headline blocks.
      const next = JSON.parse(JSON.stringify(rows));

      if (ensureNestedRowIds(next)) {
        container.setFieldValue(field, next);

        // Wait for the write + value poll before soloing.
        win.setTimeout(tryBoot, 150);

        return;
      }

      const row = next[0];
      const uid = row?._visual_id || row?.id || row?._id;

      if (!uid) {
        // Section row with no id yet — mint one and retry.
        row.id = sve.newRowId();
        container.setFieldValue(field, next);
        win.setTimeout(tryBoot, 150);

        return;
      }

      // Collapsed sets have no visual-id inputs — expand first, then retry.
      if (!findSetByUid(uid, doc)) {
        expandTopLevelSectionSets(doc, field);
        // Also expand every replicator set we can see (ids may live on nested inputs).
        doc.querySelectorAll(SELECTORS.replicatorSet).forEach((setEl) => {
          if (isSetCollapsed(setEl)) {
            expandSet(setEl);
          }
        });

        if (attempts++ < 60) {
          win.setTimeout(tryBoot, COLLAPSE_SETTLE_MS);

          return;
        }

        continue;
      }

      const opened = sve.soloSection(uid, doc, win, { kind: 'section' });

      if (opened) {
        doc.documentElement.setAttribute('data-sve-boot', 'ok');

        return;
      }
    }

    // Form still mounting — keep expanding anything that appeared and retry.
    expandTopLevelSectionSets(doc, field);

    if (attempts++ < 60) {
      win.setTimeout(tryBoot, 120);
    } else {
      doc.documentElement.setAttribute('data-sve-boot', 'fail');
    }
  };

  tryBoot();
}

/**
 * Assign stable `id` on every set row that lacks one (synced sections saved
 * before nested ids were preserved). Returns true when anything changed.
 *
 * Only replicator/grid rows (`enabled` and/or section handles like `hero/style_1`)
 * — never Bard/ProseMirror nodes (`paragraph`, `text`, …).
 */
export function ensureNestedRowIds(node) {
  let changed = false;

  const isSetRow = (n) =>
    n &&
    typeof n === 'object' &&
    typeof n.type === 'string' &&
    n.type &&
    ('enabled' in n || 'blocks' in n || n.type.includes('/'));

  const walk = (n) => {
    if (Array.isArray(n)) {
      n.forEach(walk);
    } else if (n && typeof n === 'object') {
      if (isSetRow(n) && !n.id && !n._id) {
        n.id = sve.newRowId();
        changed = true;
      }

      Object.values(n).forEach(walk);
    }
  };

  walk(node);

  return changed;
}

/**
 * Clicking content that comes from a global (global_edit="site_settings.phone"):
 * open that set in the panel and jump to the field. Editing it there updates the
 * preview as you type — the same live path the panel already uses.
 */
export function handleOpenGlobal(data, doc, win) {
  const sets = globalSets(win);

  if (!sets.length) {
    return;
  }

  const [handle, field] = String(data.target || '').split('.');
  const set = sets.find((candidate) => candidate.handle === handle) ?? sets[0];
  const picker = doc.getElementById(GLOBALS_PICKER_ID);

  if (picker) {
    picker.value = set.handle;
  }

  openGlobalsPanel(win, set);

  if (field) {
    focusGlobalField(win, field);
  }
}

/**
 * The global set holding one half of the site frame.
 *
 * The two halves may share one set (`global`) or have one each
 * (`header.global` / `footer.global`). Every caller asks per half, and a shared
 * set simply answers with the same handle twice — so which layout the site uses
 * stops being something the rest of the file has to know.
 */
export function chromeGlobalHandle(win, kind = null) {
  const cfg = chromeConfig(win);
  const own = kind === 'footer' || kind === 'header' ? cfg[kind]?.global : null;

  // Asked without a half — a warm-up, not an open. A site that only names the two
  // separately still gets a real handle rather than the theme's.
  return own || cfg.global || cfg.header?.global || cfg.footer?.global || 'theme_settings';
}

export function chromeConfig(win) {
  const cfg = win.Statamic?.$config?.get?.('sveChrome');

  return cfg && typeof cfg === 'object' ? cfg : {};
}

/** Configured layout cards for header/footer (`sveChrome.header.styles` etc.). */
export function chromeStyles(win, kind) {
  const list = chromeConfig(win)[kind]?.styles;

  return Array.isArray(list) ? list : [];
}

export function closeChromeDesignsPanel(win) {
  win.document.getElementById(sve.CHROME_DESIGNS_ID)?.remove();
  sve.releaseLeftEdgeIfFree(win);
  sve.syncPreviewInset(win);
}

export const CHROME_MODE_TOGGLE_ATTR = 'data-sve-chrome-mode-toggle';

/** Which chrome sidebar view is visible: design picker vs Theme Settings. */
export function currentChromeSidebarMode(win) {
  const designs = win.document.getElementById(sve.CHROME_DESIGNS_ID);

  if (designs && !designs.hasAttribute('data-sve-chrome-hidden') && designs.style.display !== 'none') {
    return 'design';
  }

  return 'settings';
}

export function paintChromeModeToggle(row, mode) {
  if (!row) {
    return;
  }

  row.querySelectorAll('[data-sve-chrome-mode]').forEach((btn) => {
    const on = btn.getAttribute('data-sve-chrome-mode') === mode;

    btn.style.background = on ? 'rgba(128,128,128,.22)' : 'transparent';
    btn.style.fontWeight = on ? '600' : '500';
    btn.style.opacity = on ? '1' : '.72';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

export function paintAllChromeModeToggles(win, mode) {
  win.document.querySelectorAll(`[${CHROME_MODE_TOGGLE_ATTR}]`).forEach((row) => {
    paintChromeModeToggle(row, mode);
  });
}

export function removeChromeModeToggles(win) {
  win.document.querySelectorAll(`[${CHROME_MODE_TOGGLE_ATTR}]`).forEach((el) => el.remove());
}

/**
 * Segmented Design | Settings control for the chrome sidebar.
 * Replaces the old Designs/Settings buttons on the preview bottom bar.
 */
export function buildChromeModeToggle(win, mode) {
  const doc = win.document;
  const row = doc.createElement('div');

  row.setAttribute(CHROME_MODE_TOGGLE_ATTR, '');
  row.style.cssText =
    'display:flex;gap:4px;padding:2px 10px 0;flex:0 0 auto;';

  const track = doc.createElement('div');

  track.style.cssText =
    'display:flex;flex:1 1 auto;gap:2px;padding:3px;border-radius:10px;' +
    'background:rgba(128,128,128,.12);';

  const makeBtn = (key, label) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.setAttribute('data-sve-chrome-mode', key);
    btn.style.cssText =
      'all:unset;cursor:pointer;flex:1 1 0;text-align:center;padding:7px 10px;' +
      'border-radius:8px;font-size:12px;line-height:1.2;color:currentColor;';
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      setChromeSidebarMode(win, key);
    });
    track.appendChild(btn);
  };

  makeBtn('design', t(win, 'chrome_designs'));
  // Key stays 'settings' — it names the sidebar mode, which is the global set's
  // own form. The label says what that form is for: the header's content.
  makeBtn('settings', t(win, 'chrome_content'));
  row.appendChild(track);
  paintChromeModeToggle(row, mode);

  return row;
}

/** Insert (or refresh) the Design/Settings toggle under a panel header. */
export function ensureChromeModeToggle(win, panel, mode) {
  if (!panel) {
    return;
  }

  let row = panel.querySelector(`[${CHROME_MODE_TOGGLE_ATTR}]`);

  if (!row) {
    row = buildChromeModeToggle(win, mode);
    const header = panel.firstElementChild;

    if (header?.nextSibling) {
      panel.insertBefore(row, header.nextSibling);
    } else {
      panel.appendChild(row);
    }
  } else {
    paintChromeModeToggle(row, mode);
  }
}

/** Switch chrome sidebar between design picker and Theme Settings. */
export function setChromeSidebarMode(win, mode) {
  const kind =
    activeChromeKind ||
    win.document.getElementById(GLOBALS_PANEL_ID)?.getAttribute('data-sve-chrome-kind') ||
    win.document.getElementById(sve.CHROME_DESIGNS_ID)?.getAttribute('data-sve-chrome-kind') ||
    'header';
  const chromeKind = kind === 'footer' ? 'footer' : 'header';

  if (mode === 'design') {
    openChromeDesignsPanel(win, chromeKind);
    paintAllChromeModeToggles(win, 'design');

    return;
  }

  // Keep designs mounted (hidden) so toggling back is instant.
  const designs = win.document.getElementById(sve.CHROME_DESIGNS_ID);

  if (designs) {
    designs.style.cssText =
      'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
    designs.setAttribute('data-sve-chrome-hidden', '1');
  }

  // Edited in this window "settings" is simply the chrome's own tab again — the
  // fields never left, the design drawer was only sitting over them.
  if (sve.chromeHost(win.document)) {
    sveState.soloUid = null;
    sve.soloChromeTab(win, win.document, chromeKind);
    sve.watchChromeSolo(win, win.document, chromeKind);
    paintAllChromeModeToggles(win, 'settings');

    return;
  }

  sve.showGlobalsPanel(win);
  lockChromeGlobalsTab(win, chromeKind);
  ensureChromeModeToggle(win, win.document.getElementById(GLOBALS_PANEL_ID), 'settings');
  paintAllChromeModeToggles(win, 'settings');
}

/**
 * Design picker for header/footer — same shared LP editor as Theme Settings /
 * page sections. Hides Theme Settings while open; form stays mounted for writes.
 */
export function openChromeDesignsPanel(win, kind) {
  const doc = win.document;
  const chromeKind = kind === 'footer' ? 'footer' : 'header';
  const existing = doc.getElementById(sve.CHROME_DESIGNS_ID);

  if (existing) {
    existing.setAttribute('data-sve-chrome-kind', chromeKind);
    existing.dispatchEvent(new CustomEvent('sve-chrome-render'));
    sve.hideGlobalsPanel(win);
    existing.style.display = 'flex';
    existing.removeAttribute('data-sve-chrome-hidden');
    sve.mountInLivePreviewEditor(win, existing);
    ensureChromeModeToggle(win, existing, 'design');
    paintAllChromeModeToggles(win, 'design');
    sve.syncPreviewInset(win);

    return;
  }

  // Keep Theme Settings mounted (hidden) + sections library if open on the right.
  sve.closeRightPanels(win, [sve.CHROME_DESIGNS_ID, GLOBALS_PANEL_ID, sve.SECTION_PICKER_ID]);
  sve.hideGlobalsPanel(win);

  const panel = doc.createElement('div');

  panel.id = sve.CHROME_DESIGNS_ID;
  panel.setAttribute('data-sve-chrome-kind', chromeKind);
  panel.style.cssText = sve.editorOverlayCss();

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(128,128,128,.2);flex:0 0 auto;">
      <div style="font-size:14px;font-weight:600;" data-sve-title></div>
    </div>
    <div data-sve-hint style="padding:6px 14px;font-size:11px;opacity:.6;flex:0 0 auto;"></div>
    <div data-sve-search-wrap style="padding:8px 12px 0;flex:0 0 auto;">
      <input data-sve-search type="text" autocomplete="sve-off"
        style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid rgba(128,128,128,.3);
        background:rgba(128,128,128,.06);color:currentColor;font:inherit;font-size:12px;outline:none;">
    </div>
    <div data-sve-scroll style="flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px;">
      <div data-sve-grid style="column-gap:12px;"></div>
    </div>
  `;

  const applyLayout = () => {
    const w = panel.getBoundingClientRect().width || 400;
    const cols = w >= 720 ? 3 : w >= 480 ? 2 : 1;
    const grid = panel.querySelector('[data-sve-grid]');

    if (grid) {
      grid.style.columnCount = String(cols);
    }
  };

  sve.mountInLivePreviewEditor(win, panel);
  ensureChromeModeToggle(win, panel, 'design');
  applyLayout();
  sve.syncPreviewInset(win);

  // Recalc columns when the shared editor is resized.
  try {
    const ro = new win.ResizeObserver(() => applyLayout());

    ro.observe(panel);
  } catch {
    /* older browsers */
  }

  const titleEl = panel.querySelector('[data-sve-title]');
  const hintEl = panel.querySelector('[data-sve-hint]');
  const searchEl = panel.querySelector('[data-sve-search]');
  const gridEl = panel.querySelector('[data-sve-grid]');
  let query = '';

  const empty = (msg) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'padding:24px 8px;text-align:center;opacity:.55;font-size:13px;column-span:all;break-inside:avoid;';
    el.textContent = msg;

    return el;
  };

  const markSelected = (style) => {
    gridEl.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
      const on = el.getAttribute('data-sve-chrome-style') === style;

      el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
    });
  };

  const render = () => {
    const activeKind = panel.getAttribute('data-sve-chrome-kind') === 'footer' ? 'footer' : 'header';

    titleEl.textContent =
      activeKind === 'footer' ? t(win, 'tab_footer') : t(win, 'tab_header');
    hintEl.textContent = t(win, 'chrome_library_hint');
    searchEl.placeholder = t(win, 'chrome_search_placeholder');
    gridEl.innerHTML = '';

    const styles = chromeStyles(win, activeKind);

    if (!styles.length) {
      gridEl.appendChild(empty(t(win, 'chrome_no_styles')));

      return;
    }

    const filtered = styles.filter((item) =>
      sve.libraryMatchesQuery({ ...item, title: item.label || item.title }, query)
    );

    if (!filtered.length) {
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    filtered.forEach((item) => {
      const el = doc.createElement('div');
      const title = item.label || item.handle;
      const imageUrl = item.preview_url || item.image || '';

      el.setAttribute('data-sve-chrome-style', item.handle);
      el.style.cssText =
        'cursor:pointer;display:inline-block;width:100%;break-inside:avoid;margin:0 0 12px;border:1px solid rgba(128,128,128,.25);' +
        'border-radius:10px;overflow:hidden;background:rgba(128,128,128,.05);transition:border-color .12s;' +
        'user-select:none;vertical-align:top;';
      el.addEventListener('mouseenter', () => (el.style.borderColor = 'var(--theme-color-primary,#4f46e5)'));
      el.addEventListener('mouseleave', () => {
        const selected = el.style.boxShadow && el.style.boxShadow !== 'none';

        el.style.borderColor = selected ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      });
      el.innerHTML = `
        <div style="width:100%;background:rgba(128,128,128,.12);pointer-events:none;">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="" style="width:100%;height:auto;display:block;">`
              : `<div style="width:100%;aspect-ratio:16/5;min-height:56px;display:flex;align-items:center;justify-content:center;opacity:.45;font-size:12px;">${title}</div>`
          }
        </div>
        <div style="padding:8px 10px;font-size:12px;font-weight:500;pointer-events:none;">${title}</div>
      `;
      el.addEventListener('click', () => {
        markSelected(item.handle);
        setChromeStyle(win, activeKind, item.handle);
      });
      gridEl.appendChild(el);
    });
  };

  searchEl.addEventListener('input', () => {
    query = searchEl.value || '';
    render();
  });

  panel.addEventListener('sve-chrome-render', render);
  render();
  searchEl.focus();
}

/**
 * Clicking the site header/footer in Live Preview: open Theme Settings locked
 * to that chrome tab only (no Colors / Typography while you're in the header).
 */
export function handleOpenChrome(data, doc, win) {
  const kind = data.kind === 'footer' ? 'footer' : 'header';
  const handle = chromeGlobalHandle(win, kind);
  const sets = globalSets(win);
  const set = sets.find((candidate) => candidate.handle === handle);

  if (!set) {
    return;
  }

  const picker = doc.getElementById(GLOBALS_PICKER_ID);

  if (picker) {
    picker.value = set.handle;
  }

  closeChromeDesignsPanel(win);

  if (sve.CHROME_INLINE) {
    sve.openChromeInline(win, kind);
  } else {
    openGlobalsPanel(win, set, { chromeLock: kind });
    sve.showGlobalsPanel(win);
    lockChromeGlobalsTab(win, kind);
  }

  assertChromeFocusInPreview(win);

  // Entering chrome always starts clean — tab-lock must not look like user edits.
  sveState.globalsStashActive = false;
  chromeIgnoreValuePostsUntil = Date.now() + 900;
  sveState.chromeValuesBaseline = null;
  clearGlobalsDirtyMarks(win);
  notifyChromeDirty(win);
  sve.syncSectionLibraryAvailability(win);

  win.setTimeout(() => markChromeFormClean(win), 500);
  win.setTimeout(() => markChromeFormClean(win), 1000);
}

/** Writes header.style / footer.style into the open globals panel form. */
export function setChromeStyle(win, kind, style, attempt = 0) {
  const handle = chromeGlobalHandle(win, kind);
  const sets = globalSets(win);
  const set = sets.find((candidate) => candidate.handle === handle);

  // Edited in this window the field is right here — the same write the panel is
  // asked to make over postMessage, made directly.
  const container = sve.chromeHost(win.document) ? sve.chromeContainer() : null;

  if (container) {
    container.setFieldValue(`${kind === 'footer' ? 'footer' : 'header'}_style`, style);

    win.document.getElementById(sve.CHROME_DESIGNS_ID)?.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
      const on = el.getAttribute('data-sve-chrome-style') === style;

      el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
    });

    return;
  }

  const frame = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

  // Designs panel alone isn't enough — style changes must hit the theme_settings
  // form so the globals stash + preview refresh run. Keep the form mounted (hidden).
  if (!frame?.contentWindow) {
    if (set) {
      openGlobalsPanel(win, set, { keepLibrary: true, chromeLock: kind === 'footer' ? 'footer' : 'header' });
      sve.hideGlobalsPanel(win);
    }

    if (attempt < 25) {
      setTimeout(() => setChromeStyle(win, kind, style, attempt + 1), 200);
    }

    return;
  }

  frame.contentWindow.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-chrome-set-style', kind, style },
    win.location.origin
  );

  // Form may still be mounting — retry a few times.
  if (attempt < 15) {
    setTimeout(() => {
      const again = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

      again?.contentWindow?.postMessage(
        { source: 'statamic-visual-editor', type: 'sve-chrome-set-style', kind, style },
        win.location.origin
      );
    }, 250 * (attempt + 1));
  }

  // Mark the chosen card in the open designs panel.
  const panel = win.document.getElementById(sve.CHROME_DESIGNS_ID);

  panel?.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
    const on = el.getAttribute('data-sve-chrome-style') === style;

    el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
    el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
  });
}

/**
 * Lock Theme Settings to Header or Footer only (chrome focus from Live Preview).
 * reka-ui keeps a hidden measurement copy of each tab — only the visible one
 * switches — and it needs the full pointer sequence, not a bare `.click()`.
 */
export function lockChromeGlobalsTab(win, kind, attempts = 0) {
  const chromeKind = kind === 'footer' ? 'footer' : 'header';
  const label = chromeKind === 'footer' ? 'Footer' : 'Header';
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const frame = panel?.querySelector('iframe');
  const iwin = frame?.contentWindow;
  const inner = frame?.contentDocument;
  const title = panel?.querySelector('[data-sve-globals-title]');

  if (panel) {
    panel.setAttribute('data-sve-chrome-kind', chromeKind);
    panel.setAttribute('data-sve-chrome-locked', '1');
    ensureChromeModeToggle(win, panel, currentChromeSidebarMode(win));
  }

  setActiveChromeKind(chromeKind);

  if (title) {
    title.textContent = label;
  }

  if (!iwin || !inner) {
    if (attempts < 40) {
      setTimeout(() => lockChromeGlobalsTab(win, chromeKind, attempts + 1), 150);
    }

    return;
  }

  iwin.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-lock-tab', label, kind: chromeKind },
    win.location.origin
  );

  const tabs = [...inner.querySelectorAll('button[role="tab"]')].filter((el) => el.offsetParent !== null);
  const tab = tabs.find((el) => {
    const text = (el.textContent || '').trim().toLowerCase();
    const needle = label.toLowerCase();

    return text === needle || text.startsWith(needle);
  });

  if (tab?.getAttribute('aria-selected') === 'true') {
    // Tablist should already be hidden by the iframe lock — done.
    return;
  }

  if (tab) {
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      tab.dispatchEvent(new iwin.PointerEvent(type, { bubbles: true, cancelable: true }));
    });
  }

  if (attempts < 40) {
    setTimeout(() => lockChromeGlobalsTab(win, chromeKind, attempts + 1), 150);
  }
}

/** Full Theme Settings again — all publish tabs visible. */
export function unlockChromeGlobalsTabs(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const frame = panel?.querySelector('iframe');
  const title = panel?.querySelector('[data-sve-globals-title]');
  const handle = panel?.getAttribute('data-sve-globals-handle');
  const set = globalSets(win).find((candidate) => candidate.handle === handle);

  panel?.removeAttribute('data-sve-chrome-locked');
  panel?.removeAttribute('data-sve-chrome-kind');
  removeChromeModeToggles(win);

  if (title && set) {
    title.textContent = set.title;
  }

  frame?.contentWindow?.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-unlock-tabs' },
    win.location.origin
  );
}

/** Waits for the panel's form to mount, then scrolls the field into view. */
export function focusGlobalField(win, field, attempts = 0) {
  const frame = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');
  const inner = frame?.contentDocument;

  const input = inner?.querySelector(`[name="${field}"], #${CSS.escape(field)}`);

  if (input) {
    input.scrollIntoView({ block: 'center' });
    input.focus?.();

    return;
  }

  if (attempts < 30) {
    setTimeout(() => focusGlobalField(win, field, attempts + 1), 200);
  }
}

/** In the Live Preview window: take the values streamed up by the panel. */



sve.GLOBALS_PANEL_ID = GLOBALS_PANEL_ID;
sve.GLOBALS_PICKER_ID = GLOBALS_PICKER_ID;
sve.GLOBALS_DEBOUNCE = GLOBALS_DEBOUNCE;
Object.defineProperty(sve, 'lastPreviewUrl', { get() { return lastPreviewUrl; }, set(v) { lastPreviewUrl = v; } });
Object.defineProperty(sve, 'globalsSaveTimer', { get() { return globalsSaveTimer; }, set(v) { globalsSaveTimer = v; } });
sve.globalSets = globalSets;
sve.pickerGlobalSets = pickerGlobalSets;
sve.csrfToken = csrfToken;
sve.lpHeader = lpHeader;
sve.previewFrame = previewFrame;
sve.ensurePreviewOutsideDismiss = ensurePreviewOutsideDismiss;
sve.refreshPreview = refreshPreview;
sve.frameDocumentUrl = frameDocumentUrl;
sve.isLivePreviewDocumentUrl = isLivePreviewDocumentUrl;
sve.replayLivePreview = replayLivePreview;
Object.defineProperty(sve, 'activeChromeKind', { get() { return activeChromeKind; }, set(v) { activeChromeKind = v; } });
sve.setActiveChromeKind = setActiveChromeKind;
sve.assertChromeFocusInPreview = assertChromeFocusInPreview;
sve.watchPreviewRenders = watchPreviewRenders;
sve.postGlobals = postGlobals;
Object.defineProperty(sve, 'globalsStashEpoch', { get() { return globalsStashEpoch; }, set(v) { globalsStashEpoch = v; } });
Object.defineProperty(sve, 'globalsAcceptValues', { get() { return globalsAcceptValues; }, set(v) { globalsAcceptValues = v; } });
Object.defineProperty(sve, 'chromeIgnoreValuePostsUntil', { get() { return chromeIgnoreValuePostsUntil; }, set(v) { chromeIgnoreValuePostsUntil = v; } });
sve.invalidateGlobalsPreviewStash = invalidateGlobalsPreviewStash;
sve.markChromeFormClean = markChromeFormClean;
sve.notifyChromeDirty = notifyChromeDirty;
sve.globalSectionLabel = globalSectionLabel;
sve.notifyGlobalSectionDirty = notifyGlobalSectionDirty;
sve.globalsSaveListeners = globalsSaveListeners;
sve.onGlobalsSave = onGlobalsSave;
sve.globalsPanelFrame = globalsPanelFrame;
sve.hasUnsavedGlobals = hasUnsavedGlobals;
sve.hasUnsavedWork = hasUnsavedWork;
sve.clearGlobalsDirtyMarks = clearGlobalsDirtyMarks;
sve.discardGlobalsChanges = discardGlobalsChanges;
sve.saveGlobalsPanel = saveGlobalsPanel;
sve.watchGlobalsPanelSaves = watchGlobalsPanelSaves;
sve.ensureGlobalsPanelSaveWatch = ensureGlobalsPanelSaveWatch;
sve.clearGlobalsStash = clearGlobalsStash;
sve.closeGlobalsPanel = closeGlobalsPanel;
sve.parkGlobalsPanel = parkGlobalsPanel;
sve.GLOBALS_WIDTH_KEY = GLOBALS_WIDTH_KEY;
sve.GLOBALS_MIN_WIDTH = GLOBALS_MIN_WIDTH;
sve.globalsPanelWidth = globalsPanelWidth;
sve.panelResizer = panelResizer;
sve.globalsPanelUrl = globalsPanelUrl;
sve.scheduleChromeGlobalsPrefetch = scheduleChromeGlobalsPrefetch;
sve.prefetchChromeGlobals = prefetchChromeGlobals;
sve.openGlobalsPanel = openGlobalsPanel;
sve.ensureGlobalsPicker = ensureGlobalsPicker;
sve.LIBRARY_BUTTON_ID = LIBRARY_BUTTON_ID;
sve.ensureSectionLibraryButton = ensureSectionLibraryButton;
sve.initGlobalsPanelFrame = initGlobalsPanelFrame;
sve.injectPanelFocusStyles = injectPanelFocusStyles;
sve.SAVED_SECTION_META_HANDLES = SAVED_SECTION_META_HANDLES;
sve.hideSavedSectionEntryChrome = hideSavedSectionEntryChrome;
sve.expandTopLevelSectionSets = expandTopLevelSectionSets;
sve.bootSavedSectionSolo = bootSavedSectionSolo;
sve.ensureNestedRowIds = ensureNestedRowIds;
sve.handleOpenGlobal = handleOpenGlobal;
sve.chromeGlobalHandle = chromeGlobalHandle;
sve.chromeConfig = chromeConfig;
sve.chromeStyles = chromeStyles;
sve.closeChromeDesignsPanel = closeChromeDesignsPanel;
sve.CHROME_MODE_TOGGLE_ATTR = CHROME_MODE_TOGGLE_ATTR;
sve.currentChromeSidebarMode = currentChromeSidebarMode;
sve.paintChromeModeToggle = paintChromeModeToggle;
sve.paintAllChromeModeToggles = paintAllChromeModeToggles;
sve.removeChromeModeToggles = removeChromeModeToggles;
sve.buildChromeModeToggle = buildChromeModeToggle;
sve.ensureChromeModeToggle = ensureChromeModeToggle;
sve.setChromeSidebarMode = setChromeSidebarMode;
sve.openChromeDesignsPanel = openChromeDesignsPanel;
sve.handleOpenChrome = handleOpenChrome;
sve.setChromeStyle = setChromeStyle;
sve.lockChromeGlobalsTab = lockChromeGlobalsTab;
sve.unlockChromeGlobalsTabs = unlockChromeGlobalsTabs;
sve.focusGlobalField = focusGlobalField;
