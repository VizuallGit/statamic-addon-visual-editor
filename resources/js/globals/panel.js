/**
 * globals-panel.js — open, close, drag the edge, the picker.
 * Split out of globals-panel.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. globals-panel.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { sveState } from '../cp-state.js';
import { GLOBALS_PANEL_PARAM } from '../cp-selectors.js';
import { ensurePanel } from '../lazy-panels.js';
import { csrfToken } from '../lib/csrf.js';
import { previewFrame } from '../lib/preview-frame.js';
import {
  GLOBALS_PANEL_ID,
  GLOBALS_PICKER_ID,
  LIBRARY_BUTTON_ID,
  LP_ICON_IDLE_OPACITY,
  LP_MODE_ID,
  LP_WIDTH_ID,
} from '../lib/ids.js';
import { featureOn } from '../lib/config.js';
import {
  attachGlobalsOverlay,
  leaveFocusLock,
  openSectionPicker,
  parkGlobalsOverlay,
  pinGlobalsPanelLeft,
  releaseLeftEdgeIfFree,
  showGlobalsPanel,
  syncPreviewInset,
  syncSectionLibraryAvailability,
} from '../section-library.js';
import { closeChromeInline, warmChromeInlinePages } from '../chrome.js';
import { confirmLeaveGlobalsOverlay, handleRequestCloseChrome } from '../pages.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { comboFromEvent, isMac } from '../lib/shortcuts.js';
import { ask } from '../cp/bus.js';
import { notifyChromeDirty } from '../globals-panel.js';
import { ensureGlobalsPanelSaveWatch, hasUnsavedGlobals } from './dirty.js';

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

export const GLOBALS_DEBOUNCE = 200;

// How many 250ms poll ticks a parked panel keeps comparing after a message,
// so an asynchronous setFieldValue is never missed (~5 s).
export const PARKED_SYNC_TICKS = 20;

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

/**
 * The one set the globe menu would list, or null when it lists more (or none).
 * One set is nothing to pick between: the globe icon opens it instead of
 * unfolding a menu with a single choice in it.
 */
export function soleGlobalSet(win) {
  const sets = pickerGlobalSets(win);

  return sets.length === 1 ? sets[0] : null;
}

/**
 * The globe icon when there is one set: open it, or close it when it is the
 * panel on screen — unsaved changes asked about first, as the panel's own
 * close does. False when there is a menu to unfold instead.
 */
export function toggleSoleGlobalSet(win) {
  const set = soleGlobalSet(win);

  if (!set) {
    return false;
  }

  const panel = win.document.getElementById(GLOBALS_PANEL_ID);
  const showing =
    !!panel &&
    !panel.hidden &&
    !panel.hasAttribute('data-sve-chrome-hidden') &&
    panel.getAttribute('data-sve-globals-handle') === set.handle;

  if (showing) {
    confirmLeaveGlobalsOverlay(win, () => closeGlobalsPanel(win));
  } else {
    // Inside a header, a footer or a global section the set is still a click
    // away: that owner is left first, so the set opens over the page.
    leaveFocusLock(win);
    openGlobalsPanel(win, set);
  }

  return true;
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

  const forward = (event) => {
    if (event?.target?.closest?.('#__sve-inserters button')) {
      return;
    }

    win.document.body?.dispatchEvent(new win.PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
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
  const url = ask('lp:lastPreviewUrl');

  if (!frame?.contentWindow || !url) {
    return;
  }

  frame.contentWindow.postMessage(
    {
      name: 'sve.globals',
      active,
      url,
      // Authoritative for surgical morph — don't rely on html class races alone.
      chromeKind: active ? activeChromeKind : null,
    },
    win.location.origin
  );
}

/** Header/footer currently stepped into from Live Preview (null when not). */
export let activeChromeKind = null;

export function setActiveChromeKind(kind) {
  activeChromeKind = kind === 'footer' || kind === 'header' ? kind : null;
}

/**
 * The panel's form takes the focus when it opens, so the next keypress lands
 * in its document, not Live Preview's. Same origin: listen there, in the
 * bubble phase so a field's own shortcut (⌘B in Bard) still wins, and run
 * the shortcut over the bus (toolbar-shortcuts.js owns the list) — ⌘G closes
 * the panel its first press opened. Once per document: the frame loads anew
 * for every set.
 */
export function hearShortcutsIn(iwin, win) {
  if (!iwin || iwin.__sveShortcutsHeard) {
    return;
  }

  iwin.__sveShortcutsHeard = true;
  iwin.addEventListener('keydown', (event) => {
    const combo = comboFromEvent(event, isMac(iwin.navigator));

    if (combo && ask('shortcuts:run', { win, combo })) {
      event.preventDefault();
    }
  });
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
  if (closeChromeInline(win)) {
    return;
  }

  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  panel._svePinRo?.disconnect?.();
  panel.remove();

  const tabs = win.document.getElementById(LP_WIDTH_ID);

  if (tabs) {
    tabs.style.visibility = '';
  }

  releaseLeftEdgeIfFree(win);
  syncPreviewInset(win);
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
  if (closeChromeInline(win)) {
    return;
  }

  const panel = doc.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  parkGlobalsOverlay(panel);
  sveState.forcePanelOpen = false;
  syncPreviewInset(win);
}

function globalsPanelUrl(win, set) {
  const url = new URL(set.url, win.location.origin);

  url.searchParams.set(GLOBALS_PANEL_PARAM, '1');

  return url.toString();
}

/** Prefetch Theme Settings as early as possible (even before Live Preview). */

export function scheduleChromeGlobalsPrefetch(win) {
  if (
    win.Statamic?.$config?.get?.('sveEnabled') === false ||
    (typeof featureOn === 'function' &&
      !featureOn(win, 'globals') &&
      !featureOn(win, 'chrome_header') &&
      !featureOn(win, 'chrome_footer'))
  ) {
    return;
  }

  // After idle, not at timeout 0: the warm-up must not compete with the page's
  // own mount — a publish form with many sections needs the main thread first.
  // The timeout still guarantees it runs well before a Live Preview click.
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(() => prefetchChromeGlobals(win), { timeout: 4000 });
  } else {
    win.setTimeout(() => prefetchChromeGlobals(win), 1500);
  }
}

/**
 * Background-load theme_settings into a hidden iframe. Page sections feel instant
 * because their form is already mounted; chrome needs the same head start —
 * ideally before the user opens Live Preview at all.
 */
function prefetchChromeGlobals(win) {
  const doc = win.document;

  // Don't run inside the panel iframe itself.
  if (new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)) {
    return;
  }

  // What a click opens is the in-window form: its globals screens are what
  // get the head start.
  warmChromeInlinePages(win);
}

export function openGlobalsPanel(win, set, options = {}) {
  const doc = win.document;
  const existing = doc.getElementById(GLOBALS_PANEL_ID);
  const prefetch = options.prefetch === true;

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
      const label = set.title;

      title.textContent = label;
      existing.querySelector('[data-sve-focus-tile]') &&
        (existing.querySelector('[data-sve-focus-tile]').textContent = (label || '?').trim().charAt(0).toUpperCase());
      frame.title = set.title;
      showGlobalsPanel(win);
      ensureGlobalsPanelSaveWatch(win);

      // Same set already loaded: do NOT location.replace — a dirty form inside
      // the iframe triggers Chrome's "Leave site?" dialog and blocks the editor.
      if (existing.getAttribute('data-sve-globals-handle') === set.handle) {
        setActiveChromeKind(null);

        return;
      }

      const previousHandle = existing.getAttribute('data-sve-globals-handle');
      const switchSet = () => {
        existing.setAttribute('data-sve-globals-handle', set.handle);
        // New document → need a fresh save watch on the next load.
        delete frame.contentWindow.__sveGlobalsSaveWatch;
        frame.contentWindow.location.replace(globalsPanelUrl(win, set));
        setActiveChromeKind(null);
      };

      confirmLeaveGlobalsOverlay(win, switchSet, () => {
        const picker = win.document.getElementById(GLOBALS_PICKER_ID);

        if (picker && previousHandle) {
          picker.value = previousHandle;
        }
      });

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
  title.textContent = set.title;
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
  save.style.opacity = hasUnsavedGlobals(win) ? '1' : LP_ICON_IDLE_OPACITY;
  save.addEventListener('click', () => {
    const frame = doc.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

    frame?.contentWindow?.postMessage({ source: SOURCE, type: MSG.SVE_GLOBALS_SAVE }, win.location.origin);
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
      handleRequestCloseChrome(win);

      return;
    }

    const picker = doc.getElementById(GLOBALS_PICKER_ID);

    confirmLeaveGlobalsOverlay(
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
  attachGlobalsOverlay(win, panel);

  if (prefetch) {
    parkGlobalsOverlay(panel);
  } else {
    pinGlobalsPanelLeft(win, panel);
    syncPreviewInset(win);
  }
}

/** A "Sektioner" toggle in the LP header that opens/closes the section library. */
export function ensureSectionLibraryButton(win) {
  const doc = win.document;
  const group = doc.getElementById(LP_MODE_ID);

  if (!group || doc.getElementById(LIBRARY_BUTTON_ID)) {
    return;
  }

  const btn = doc.createElement('button');

  btn.id = LIBRARY_BUTTON_ID;
  btn.type = 'button';
  btn.title = t(win, 'sections');
  btn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="14" y="3" width="7" height="7" rx="1"/>' +
    '<path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/></svg>';
  btn.style.cssText =
    'height:28px;display:inline-flex;align-items:center;gap:6px;padding:0 10px;border-radius:8px;cursor:pointer;' +
    'color:currentColor;background:rgba(128,128,128,.16);border:none;font-size:12px;font-weight:500;font-family:inherit;';
  btn.append(t(win, 'sections'));
  btn.addEventListener('click', () => {
    void ensurePanel('sections').then(() => openSectionPicker(win));
  });

  // After the globals picker if it exists, otherwise right after the mode group.
  (doc.getElementById(GLOBALS_PICKER_ID) || group).after(btn);
  syncSectionLibraryAvailability(win);
}
