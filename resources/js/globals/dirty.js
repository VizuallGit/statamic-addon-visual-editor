/**
 * globals-panel.js — the values sent to the preview, not saved, discard, save, follow the saves (and the moment a header or footer opens, when value posts wait).
 * Split out of globals-panel.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. globals-panel.js re-exports this file.
 */
import { sveState } from '../cp-state.js';
import { csrfToken } from '../lib/csrf.js';
import { logCaught } from '../lib/caught.js';
import { GLOBALS_PANEL_ID, GLOBALS_PICKER_ID } from '../lib/ids.js';
import { humanizeHandle, unwrapRef } from '../lib/values.js';
import { sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { setMeta } from '../lib/row-meta.js';
import {
  libraryWentStale,
  releaseLeftEdgeIfFree,
  syncPreviewInset,
  syncSectionLibraryAvailability,
} from '../section-library.js';
import { hasUnsavedGlobalSection } from '../global-section.js';
import { chromeContainer, chromeHost, closeChromeInline, openChromeInline } from '../chrome.js';
import { hasUnsavedChanges } from '../open-in-preview.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { assertChromeFocusInPreview, notifyChromeDirty } from '../globals-panel.js';
import {
  GLOBALS_DEBOUNCE,
  activeChromeKind,
  clearGlobalsStash,
  globalSets,
  hearShortcutsIn,
  refreshPreview,
  scheduleChromeGlobalsPrefetch,
} from './panel.js';
import { chromeGlobalHandle, closeChromeDesignsPanel } from './chrome-mode.js';

let globalsSaveTimer = null;

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
function invalidateGlobalsPreviewStash() {
  clearTimeout(globalsSaveTimer);
  globalsSaveTimer = null;
  globalsStashEpoch += 1;
  sveState.globalsStashActive = false;
  globalsAcceptValues = false;
  sveState.chromeValuesBaseline = null;
}

/** Mark chrome form clean after open/save/discard settle. */
function markChromeFormClean(win) {
  sveState.globalsStashActive = false;
  clearGlobalsDirtyMarks(win);

  // Edited in this window the form is right here, and what it holds a moment
  // after a save is the saved thing: Statamic replaces its values with what the
  // server sent back, and that lands a beat after the request resolves. Read as
  // an edit, it put the bar back to "unsaved changes" a quarter of a second
  // after saving — and then Close asked whether to discard work that was already
  // on disk. The window covers the echo; the poll adopts it as the new baseline.
  const container = chromeHost(win.document) ? chromeContainer() : null;

  if (container) {
    const values = unwrapRef(container.values);

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
      for (const container of activeContainers(doc)) {
        const values = unwrapRef(container.values);

        if (values && typeof values === 'object') {
          sveState.chromeValuesBaseline = JSON.stringify(values);
        }

        break;
      }
    }
  } catch (error) {
    logCaught('globals-panel: baseline from the globals frame', error);
  }

  notifyChromeDirty(win);
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
  const rows = sveState.sectionPanelValues?.values?.[sectionField(win)];
  const row = Array.isArray(rows) && rows.length ? rows[0] : null;
  const type = row?.type;

  if (typeof type !== 'string' || !type) {
    return null;
  }

  const custom = typeof row._sve_label === 'string' ? row._sve_label.trim() : '';

  if (custom) {
    return custom;
  }

  return setMeta(win, type)?.display || humanizeHandle(type);
}

/** Listeners for Theme Settings / globals-panel save results (iframe). */
const globalsSaveListeners = [];

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
  if (chromeHost(win.document)) {
    return sveState.globalsStashActive;
  }

  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const hidden = !panel || panel.hasAttribute('data-sve-chrome-hidden') || panel.style.visibility === 'hidden';

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
    const list = unwrapRef(raw);

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
  return hasUnsavedChanges(win) || hasUnsavedGlobals(win) || hasUnsavedGlobalSection(win);
}

/** Clear Statamic.$dirty marks inside the Theme Settings iframe. */
function clearGlobalsDirtyMarks(win) {
  const iwin = globalsPanelFrame(win)?.contentWindow;

  if (!iwin) {
    return;
  }

  try {
    const dirty = iwin.Statamic?.$dirty;

    if (typeof dirty?.remove === 'function') {
      const names = new Set(['base']);
      const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
      const list = unwrapRef(raw);

      if (Array.isArray(list)) {
        list.forEach((name) => names.add(name));
      }

      names.forEach((name) => dirty.remove(name));
    }

    dirty?.disableWarning?.();
  } catch (error) {
    logCaught('globals-panel: clear dirty marks', error);
  }

  // Re-baseline the iframe value poll so the post-save form snapshot
  // doesn't immediately re-mark chrome as dirty.
  iwin.postMessage({ source: SOURCE, type: MSG.SVE_GLOBALS_SAVED }, win.location.origin);
}

/** Drop Theme Settings dirty marks + preview stash (discard path). */
export function discardGlobalsChanges(win, { refresh = false, reloadForm = false } = {}) {
  // Stop late value polls / debounced stash POSTs from re-marking dirty.
  invalidateGlobalsPreviewStash();

  if (reloadForm) {
    // In this window the form is rebuilt from the CP's own answer next time, so
    // taking it down IS the reload — and it takes every dirty mark with it.
    if (closeChromeInline(win, { refresh })) {
      globalsAcceptValues = true;

      return clearGlobalsStash(win, { refresh, force: true }).then(() => notifyChromeDirty(win));
    }

    // Destroy the dirty iframe entirely. In-place reload left Statamic.$dirty
    // (and stale polls) sticky, so re-entering chrome still showed Save.
    const panel = win.document.getElementById(GLOBALS_PANEL_ID);

    panel?._svePinRo?.disconnect?.();
    panel?.remove();
    globalsAcceptValues = true;
    releaseLeftEdgeIfFree(win);
    syncPreviewInset(win);

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
      libraryWentStale(parentWin);
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
        hearShortcutsIn(frame.contentWindow, win);
      }
    } catch (error) {
      logCaught('globals-panel: arm the save watch', error);
    }
  };

  arm();
  frame.addEventListener('load', arm);
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

  openChromeInline(win, kind);

  assertChromeFocusInPreview(win);

  // Entering chrome always starts clean — tab-lock must not look like user edits.
  sveState.globalsStashActive = false;
  chromeIgnoreValuePostsUntil = Date.now() + 900;
  sveState.chromeValuesBaseline = null;
  clearGlobalsDirtyMarks(win);
  notifyChromeDirty(win);
  syncSectionLibraryAvailability(win);

  win.setTimeout(() => markChromeFormClean(win), 500);
  win.setTimeout(() => markChromeFormClean(win), 1000);
}
