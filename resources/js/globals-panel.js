/**
 * Settings toggle: `globals`
 * Globals beside Live Preview.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { t } from './lib/i18n.js';
import { COLLAPSE_SETTLE_MS, SELECTORS } from './cp-selectors.js';
import {
  FRAMED_SELECT_STYLE,
  LP_SAVE_TIMEOUT,
  applyHeaderTab,
  expandSet,
  findSetByUid,
  handleFieldFocus,
  isSetCollapsed,
  sendToPreview,
} from './cp.js';
import { injectStyle } from './lib/style.js';
import { GLOBALS_PANEL_ID, GLOBALS_PICKER_ID, LP_ICON_IDLE_OPACITY } from './lib/ids.js';
import { lpHeader } from './lib/live-preview.js';
import { isSectionLibraryLocked, leaveFocusLock } from './section-library.js';
import { hasUnsavedGlobalSection } from './global-section.js';
import { chromeHost, pressChromeSave } from './chrome.js';
import { confirmLeaveGlobalsOverlay } from './pages.js';
import { MSG, SOURCE } from './lib/protocol.js';
import {
  activeChromeKind,
  clearGlobalsStash,
  closeGlobalsPanel,
  openGlobalsPanel,
  pickerGlobalSets,
} from './globals/panel.js';
import { globalSectionLabel, globalsPanelFrame, hasUnsavedGlobals, onGlobalsSave } from './globals/dirty.js';

export * from './globals/panel.js';
export * from './globals/dirty.js';
export * from './globals/frame.js';
export * from './globals/chrome-mode.js';

/** Tell the preview iframe to keep header/footer chrome focus (soft rebind). */
export function assertChromeFocusInPreview(win) {
  if (!activeChromeKind) {
    return;
  }

  const kind = activeChromeKind;

  // One quiet ping after morph settles — not a burst (that caused flicker).
  clearTimeout(assertChromeFocusInPreview._timer);
  assertChromeFocusInPreview._timer = setTimeout(() => {
    sendToPreview({ source: SOURCE, type: MSG.SVE_RESTORE_CHROME, kind }, win);
  }, 120);
}

/** Tell the preview whether the chrome Save button should show. */
export function notifyChromeDirty(win) {
  const dirty = hasUnsavedGlobals(win);
  const saveBtn = win.document.querySelector('[data-sve-globals-save-btn]');

  if (saveBtn) {
    saveBtn.style.display = '';
    saveBtn.style.opacity = dirty ? '1' : LP_ICON_IDLE_OPACITY;
  }

  // Only the state rides along. A half whose global set has no fields is never
  // dirty, so its frame simply never shows Save — the frame needs no field
  // count to know that.
  sendToPreview({ source: SOURCE, type: MSG.SVE_CHROME_DIRTY, dirty }, win);
}

/** Tell the preview whether the global-section Save button should show. */
export function notifyGlobalSectionDirty(win) {
  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_GLOBAL_DIRTY,
      dirty: hasUnsavedGlobalSection(win),
      label: globalSectionLabel(win),
    },
    win
  );
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

  const host = chromeHost(win.document);
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
    pressChromeSave(win);

    return;
  }

  iwin.postMessage({ source: SOURCE, type: MSG.SVE_GLOBALS_SAVE }, win.location.origin);
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
      leaveFocusLock(win);
      openGlobalsPanel(win, set);
    } else {
      confirmLeaveGlobalsOverlay(
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

    // Inside chrome the picker already reads the header's or footer's own set,
    // and its form is the inline editor — opening the parked panel on the click
    // that merely unfolds the menu would put a second copy of it on screen.
    // Choosing a set is `change`, and that is where the owner is left.
    if (!set || isSectionLibraryLocked(win)) {
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

/** In the Live Preview window: take the values streamed up by the panel. */
