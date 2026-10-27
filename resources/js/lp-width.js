/**
 * The left column's frame in Live Preview: its width (remembered, 16–50 rem,
 * our own drag handle), the Page Settings/SEO bar above it, the panel toggle
 * that re-asserts the collapse state on every mount, and the sections tab.
 *
 * Was the tail of focus-panel.js; the focus panel itself (isolating Statamic's
 * form to one row) is gone — the selection panel draws the row.
 *
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { buildModeUi } from './cp/build-mode/store.js';
import { remToPx } from './lib/dom.js';
import { t } from './lib/i18n.js';
import { LP_COLLAPSED_KEY, LP_MODE_ID, LP_SIDE_DEFAULT_REM, LP_SIDE_MAX_REM, LP_SIDE_MIN_REM, LP_TOGGLE_ID, LP_WIDTH_ID, LP_WIDTH_KEY } from './lib/ids.js';
import { lpHeader } from './lib/live-preview.js';
import { clearSelection } from './lib/selection.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { relayoutCodeDock } from './code-dock-lazy.js';
import { forgetHelpSwitch } from './dock/help-state.js';
import { forgetGhostSwitch } from './dock/ghost-state.js';
import { sveState } from './cp-state.js';
import { applyHeaderTab, enhanceGrids, ensureHeaderToolbar, ensureLpBackButton, ensureLpPreviewChrome, ensureSettingsTabs, fireTabClick, nativeTabButtons, openSettingsTab, positionLpBackButton, removeLpBackButton, restoreDockedHeaderPanels, watchStatamicLpClose } from './cp.js';
import { ensureGlobalsPicker, ensureSectionLibraryButton, parkGlobalsPanel } from './globals-panel.js';
import { pinDockedPanelsUnderHeader } from './lazy/listview.js';
import { ensureLpMoreButton } from './lp-more-menu.js';
import { persistDockedPanel, setLpMode, storedLpCollapsed } from './lp-panel.js';
import { bindToolbarAddMenu } from './toolbar-add-menu.js';
import { bindToolbarDrag } from './toolbar-drag.js';
import { ensureLpReloadButton } from './lp-reload.js';
import { ensureCollectionPicker } from './pages.js';
import { closeRightPanels, isGlobalsOverlayOpen, placeGlobalsOverlay } from './section-library.js';

/**
 * Make the sections tab the one on screen.
 *
 * Sections live in the first publish tab. If another tab (SEO, Sidebar) is
 * selected when you open a section, its fields sit in a tab panel the CP has
 * hidden — so isolating them shows nothing. Switching back first is what keeps the
 * section from opening into a blank panel.
 */
export function activateSectionsTab(win) {
  const first = nativeTabButtons(win.document)[0];

  if (first && first.getAttribute('aria-selected') !== 'true') {
    fireTabClick(win, 0);
  }

  // Native aria-selected lags a tick. Don't leave Page Settings/SEO lit.
  win.document.querySelectorAll('[data-sve-settings-tab]').forEach((btn) => {
    btn.setAttribute('aria-pressed', 'false');
  });
}

// Tracks whether Live Preview was open, so teardown (and stash clear) runs once
// when leaving — not on every MutationObserver tick outside LP.
export let lpWasOpen = false;

// Den gemte bredde sættes én gang pr. besøg i Live Preview, ikke på hvert tjek.
// Håndtaget skriver i den samme inline-style mens der trækkes, og en regel der
// blev hævdet hvert øjeblik ville trække tilbage under fingeren.
export let lpWidthApplied = false;

/**
 * Injects the panel toggle when the Live Preview screen is (re)mounted, and
 * enforces the desired collapse state. Called from initCp's MutationObserver:
 * the editor pane mounts AFTER the header, so the state must be re-asserted on
 * subsequent mutations rather than applied once at injection time.
 */
export function clampSideWidth(win, px) {
  return Math.round(
    Math.min(remToPx(win, LP_SIDE_MAX_REM), Math.max(remToPx(win, LP_SIDE_MIN_REM), px))
  );
}

/** Bredden panelet står i, som den er gemt. Intet gemt: standarden. */
export function lpStoredWidth(win) {
  const stored = parseInt(chromeGet(win, LP_WIDTH_KEY) ?? '', 10);
  const fallback = remToPx(win, LP_SIDE_DEFAULT_REM);

  return clampSideWidth(win, Number.isFinite(stored) && stored > 0 ? stored : fallback);
}

export function persistLpWidth(win, px) {
  const next = clampSideWidth(win, px);

  chromeSet(win, LP_WIDTH_KEY, String(next));

  return next;
}

export function applyLpEditorWidth(win, px) {
  const editor = win.document.querySelector('.live-preview-editor');

  if (!editor || sveState.lpCollapsed) {
    return persistLpWidth(win, px);
  }

  const next = persistLpWidth(win, px);

  editor.style.width = `${next}px`;

  return next;
}

/**
 * Own the left resizer so we can sit at 16–50 rem. Statamic's own handle
 * floors at 350px and would ignore a narrower stored width.
 */
export function bindLpEditorResize(win) {
  const doc = win.document;
  const handle = doc.querySelector('.live-preview-resizer');
  const editor = doc.querySelector('.live-preview-editor');

  if (!handle || !editor || handle._sveWidthBound) {
    return;
  }

  handle._sveWidthBound = true;

  handle.addEventListener(
    'mousedown',
    (event) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startW = editor.getBoundingClientRect().width;
      let next = startW;
      const frames = [...doc.querySelectorAll('iframe')];

      frames.forEach((frame) => {
        frame.style.pointerEvents = 'none';
      });

      sveState.lpWidthDragging = true;
      doc.body.style.cursor = 'ew-resize';
      doc.body.style.userSelect = 'none';

      const move = (e) => {
        next = applyLpEditorWidth(win, startW + (e.clientX - startX));
        placeLpWidthPicker(win);
        placeGlobalsOverlay(win);
      };

      const up = () => {
        sveState.lpWidthDragging = false;
        doc.body.style.cursor = '';
        doc.body.style.userSelect = '';
        frames.forEach((frame) => {
          frame.style.pointerEvents = '';
        });
        doc.removeEventListener('mousemove', move, true);
        doc.removeEventListener('mouseup', up, true);
        applyLpEditorWidth(win, next);
        win.dispatchEvent(new Event('resize'));
      };

      doc.addEventListener('mousemove', move, true);
      doc.addEventListener('mouseup', up, true);
    },
    true
  );
}

/** The globals overlay, or Build mode (build-mode-host.js), owns the column — Page Settings/SEO stay off. */
export function settingsBarTakeover(win) {
  return !!isGlobalsOverlayOpen(win) || buildModeUi.on;
}

/** Hide Page Settings/SEO and drop their reserved space in one go. */
export function hideSettingsBar(win) {
  const doc = win.document;
  const bar = doc.getElementById(LP_WIDTH_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (bar) {
    bar.style.visibility = 'hidden';
    bar.style.pointerEvents = 'none';
  }

  if (editor) {
    editor.style.paddingTop = '';
  }
}

/**
 * Fanerne sidder over panelet, så de følger med når det ændrer bredde.
 * Drag-striben går i fuld højde (inkl. fanerækken) — baren stopper før den.
 */
export function placeLpWidthPicker(win) {
  const doc = win.document;
  const bar = doc.getElementById(LP_WIDTH_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (settingsBarTakeover(win)) {
    hideSettingsBar(win);
    placeLpResizer(win);

    return;
  }

  if (!bar || !editor) {
    if (editor && !bar) {
      editor.style.paddingTop = '';
    }

    placeLpResizer(win);

    return;
  }

  const parent = doc.querySelector('.live-preview') || doc.body;

  if (bar.parentElement !== parent) {
    parent.appendChild(bar);
  }

  bar.style.visibility = '';
  bar.style.pointerEvents = '';
  bar.style.zIndex = '4';
  bar.style.position = 'fixed';

  const rect = editor.getBoundingClientRect();
  const handle = doc.querySelector('.live-preview-resizer');
  const grip = handle ? Math.round(handle.getBoundingClientRect().width) || 16 : 16;
  const width = Math.max(0, Math.round(rect.width) - grip);

  bar.style.left = `${Math.round(rect.left)}px`;
  bar.style.top = `${Math.round(rect.top)}px`;
  bar.style.width = `${width}px`;
  bar.style.maxWidth = `${width}px`;
  bar.style.background = win.getComputedStyle(editor).backgroundColor;

  const measured = Math.round(bar.offsetHeight);
  const pad = Number(editor.dataset.sveTabPad) || measured;

  if (pad > 0 && !editor.dataset.sveTabPad) {
    editor.dataset.sveTabPad = String(pad);
  }

  if (pad > 0) {
    editor.style.paddingTop = `${pad}px`;
  }

  placeLpResizer(win);
}

/**
 * Statamic's drag strip sits in the flex content box under our tab padding.
 * Pin it absolute so it runs from the editor top (under the header) to the bottom.
 */
export function placeLpResizer(win) {
  const handle = win.document.querySelector('.live-preview-resizer');
  const editor = win.document.querySelector('.live-preview-editor');

  if (!handle || !editor || sveState.lpCollapsed) {
    if (handle) {
      handle.style.position = '';
      handle.style.top = '';
      handle.style.right = '';
      handle.style.bottom = '';
      handle.style.height = '';
      handle.style.marginTop = '';
      handle.style.paddingTop = '';
      handle.style.zIndex = '';
      handle.style.alignSelf = '';
    }

    return;
  }

  handle.style.position = 'absolute';
  handle.style.top = '0';
  handle.style.right = '0';
  handle.style.bottom = '0';
  handle.style.height = 'auto';
  handle.style.marginTop = '0';
  handle.style.paddingTop = '0';
  handle.style.zIndex = '62';
  handle.style.alignSelf = 'stretch';
}

/**
 * Publish-fanerne (Page Settings, SEO, …) øverst i venstre panel.
 *
 * S/M/L-bredderne er væk — panelet husker det sidste træk i stedet. Fanerne
 * sidder i `.live-preview` (ikke i editoren), så solo-visningen ikke skjuler
 * dem. Header, footer og globale sektioner tager fanerne af i samme frame
 * som feltkolonnen skifter — ikke bagefter.
 */
export function ensureLpWidthPicker(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');
  const bar = doc.getElementById(LP_WIDTH_ID);

  if (!editor || sveState.lpCollapsed) {
    bar?.remove();

    if (editor) {
      editor.style.paddingTop = '';
      delete editor.dataset.sveTabPad;
    }

    placeLpResizer(win);

    return;
  }

  bindLpEditorResize(win);

  if (settingsBarTakeover(win)) {
    hideSettingsBar(win);
    placeLpResizer(win);

    return;
  }

  ensureSettingsTabs(win);
  placeLpWidthPicker(win);
}

export let lpPanelToggleBusy = false;

export function ensureLpPanelToggle(win) {
  // Re-entry guard: our own DOM writes (toolbar, chrome, width bar) fire the
  // body MutationObserver that calls us. Without this the stack re-enters on
  // every tick and Live Preview freezes — including the open-preview button.
  if (lpPanelToggleBusy) {
    return;
  }

  lpPanelToggleBusy = true;

  try {
    ensureLpPanelToggleInner(win);
  } catch (err) {
    console.error('[sve] ensureLpPanelToggle', err);
  } finally {
    lpPanelToggleBusy = false;
  }
}

export function ensureLpPanelToggleInner(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header) {
    if (lpWasOpen) {
      lpWasOpen = false;
      lpWidthApplied = false;
      sveState.lpCollapsed = null;
      sveState.lpHeaderBgCache = null; // næste åbning kan være i et andet CP-tema
      doc.getElementById(LP_WIDTH_ID)?.remove();
      sveState.chromePrefetchArmed = false;
      persistDockedPanel(win);
      clearSelection('settings');
      closeRightPanels(win);
      parkGlobalsPanel(win);
      sveState.dockedHeaderRestored = false;
      sveState.headerTab = undefined;
      sveState.lpEnterSidebarClosed = null;
      removeLpBackButton(doc);
      sveState.lpCloseHideObserver?.disconnect();
      sveState.lpCloseHideObserver = null;
      // The HTML pane's help switch was this Live Preview's; the next starts from the default.
      forgetHelpSwitch(win);
      forgetGhostSwitch(win);
    }

    return;
  }

  // Fresh Live Preview session — keep this user's device, collapse choice, pins.
  if (!lpWasOpen) {
    sveState.lpEnterSidebarClosed = storedLpCollapsed(win);
  }

  lpWasOpen = true;

  if (sveState.lpCollapsed === null) {
    sveState.lpCollapsed = storedLpCollapsed(win);
  }

  // Opening a section's settings holds the panel open for as long as they're
  // shown, whatever the mode says — otherwise the observer that re-applies the
  // mode on every Vue re-render slams it shut again a moment later.
  if (sveState.forcePanelOpen) {
    sveState.lpCollapsed = false;
  }

  doc.getElementById(LP_TOGGLE_ID)?.remove();
  doc.getElementById(LP_MODE_ID)?.remove();

  ensureGlobalsPicker(win);
  ensureSectionLibraryButton(win);
  ensureCollectionPicker(win);
  enhanceGrids(win);

  // Collapse all of the above into the icon toolbar — one control at a time.
  ensureHeaderToolbar(win);
  applyHeaderTab(win);

  // "They started with it closed" holds unless sveState.forcePanelOpen (chrome /
  // global) or setLpMode (the toolbar icon) says otherwise.
  if (!sveState.forcePanelOpen && sveState.lpEnterSidebarClosed && sveState.lpCollapsed === false) {
    sveState.lpCollapsed = true;
    chromeSet(win, LP_COLLAPSED_KEY, '1');
  }

  restoreDockedHeaderPanels(win);
  pinDockedPanelsUnderHeader(win);
  applyHeaderTab(win);
  openSettingsTab(win);

  const editor = doc.querySelector('.live-preview-editor');

  if (editor) {
    const want = sveState.lpCollapsed ? '-10000px' : '';

    editor.style.position = sveState.lpCollapsed ? 'absolute' : '';
    editor.style.left = want;
    editor.style.top = sveState.lpCollapsed ? '0' : '';

    // Den sidst trukne bredde, klemmet til 16–50 rem. Under træk lader vi
    // håndtaget styre, ellers ville loopet trække tilbage under fingeren.
    if (!sveState.lpWidthDragging) {
      editor.style.width = `${lpStoredWidth(win)}px`;
    }
  }

  ensureLpWidthPicker(win);
  placeGlobalsOverlay(win);
  ensureLpBackButton(win);
  // Reload before More: More anchors on it, so it has to exist first.
  ensureLpReloadButton(win);
  ensureLpMoreButton(win);
  // Drag an icon, press a group's «+»: bound once on the icon row, which is
  // in by now (ensureHeaderToolbar above).
  bindToolbarDrag(win);
  bindToolbarAddMenu(win);
  positionLpBackButton(win);
  watchStatamicLpClose(win);
  ensureLpPreviewChrome(win);
  // Closing parks the editor off-screen, so the dock goes full-width. Opening
  // it again has to re-measure — otherwise the dock stays at left:0 and the
  // sidebar footer sits on top of HTML/CSS/JS.
  relayoutCodeDock(win);
}
