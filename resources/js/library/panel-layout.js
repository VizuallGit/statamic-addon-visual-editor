/**
 * section-library.js — the right-hand panels and the preview's inset (not the library).
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { sveState } from '../cp-state.js';
import { ask } from '../cp/bus.js';
import { syncCodeDock } from '../code-dock-lazy.js';
import { closeAiPanel } from '../ai-panel-lazy.js';
import {
  RIGHT_DOCK_PIN_STACK,
  beginRightShellSwap,
  endRightShellSwap,
  hideRightDock,
  pinnedKeepIds,
  releaseRightShellIfEmpty,
} from '../right-dock.js';
import {
  ZONE_SHELL_ATTR,
  CHROME_DESIGNS_ID,
  COMMENTS_PANEL_ID,
  GLOBALS_PANEL_ID,
  GLOBAL_SECTION_HOST_ID,
  HTML_TREE_PANEL_ID,
  LISTVIEW_PANEL_ID,
  LP_WIDTH_ID,
  OUTLINE_PANEL_ID,
  PERF_PANEL_ID,
  SECTION_PICKER_ID,
} from '../lib/ids.js';
import { livePreviewEditorEl, lpHeader } from '../lib/live-preview.js';
import { lpMode, setLpCollapsed } from '../lp-panel.js';
import { hideSettingsBar } from '../lp-width.js';
import { selectionPanelShowing } from '../selection-panel.js';
import { buildModeUi } from '../cp/build-mode/store.js';
import {
  activeChromeKind,
  closeChromeDesignsPanel,
  removeChromeModeToggles,
  setActiveChromeKind,
} from '../globals-panel.js';
import { closeGlobalSectionPanel, globalSectionEditorOpen } from '../global-section.js';
import { closeChromeInline } from '../chrome.js';
import { closeCommentsPanel, closeListViewPanel } from '../lazy/listview.js';
import { closeHtmlTreePanel } from '../lazy/html-tree.js';
import { closeOutlinePanel } from '../lazy/outline.js';
import { closePerformancePanel } from '../lazy/performance.js';
import { THEME_PANEL_ID, closeThemePanel } from '../theme-panel-lazy.js';
import {
  claimLivePreviewEditor,
  pinGlobalsPanelLeft,
  syncPreviewInset,
  syncSectionLibraryAvailability,
} from '../section-library.js';

export function closeSectionPicker(win) {
  const panel = win.document.getElementById(SECTION_PICKER_ID);

  panel?._sveLibRo?.disconnect?.();

  panel?.remove();
  releaseRightShellIfEmpty(win);
  syncPreviewInset(win);
}

/** True while editing header/footer chrome or a global section. */
export function isSectionLibraryLocked(win) {
  return !!activeChromeKind || globalSectionEditorOpen(win.document);
}

/** True while Theme Settings / Site settings covers the left editor. */
export function isGlobalsOverlayOpen(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  return !!(panel && !panel.hidden && !panel.hasAttribute('data-sve-chrome-hidden'));
}

/**
 * Park Theme Settings off-screen on document.body.
 *
 * Never reparent the iframe (that reloads it). Never put it in the right dock —
 * that is where the block tree / comments / library stack, and Theme Settings
 * is a full form, not one more pane in that stack.
 */
export function parkGlobalsOverlay(panel) {
  if (!panel) {
    return;
  }

  panel.hidden = true;
  panel.setAttribute('data-sve-chrome-hidden', '1');
  panel.style.cssText = 'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
}

/** Keep the iframe on body so showing it never moves it in the DOM. */
export function attachGlobalsOverlay(win, panel) {
  if (!panel || panel.parentElement === win.document.body) {
    return;
  }

  win.document.body.appendChild(panel);
}

/**
 * Cover the left Live Preview editor with Theme Settings.
 *
 * Same form as before (tabs, colour pickers, …) — just over Page Settings
 * instead of stacked in the right sidebar. Sits under the width-handle (z 62).
 * Page Settings/SEO is hidden for this overlay — same as header/footer.
 */
export function placeGlobalsOverlay(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel || panel.hidden || panel.hasAttribute('data-sve-chrome-hidden')) {
    return;
  }

  const editor = livePreviewEditorEl(win.document);

  if (!editor || sveState.lpCollapsed) {
    return;
  }

  const rect = editor.getBoundingClientRect();
  const handle = win.document.querySelector('.live-preview-resizer');
  const grip = handle ? Math.round(handle.getBoundingClientRect().width) || 16 : 16;
  const width = Math.max(0, Math.round(rect.width) - grip);

  panel.hidden = false;
  panel.removeAttribute('data-sve-chrome-hidden');
  panel.style.cssText =
    'position:fixed;z-index:61;display:flex;flex-direction:column;overflow:hidden;' +
    'background:var(--theme-color-content-bg,#fff);color:currentColor;border:0;box-shadow:none;' +
    'font-family:ui-sans-serif,system-ui,sans-serif;box-sizing:border-box;';
  hideSettingsBar(win);
  panel.style.left = `${Math.round(rect.left)}px`;
  panel.style.top = `${Math.round(rect.top)}px`;
  panel.style.width = `${width}px`;
  panel.style.height = `${Math.round(rect.height)}px`;
}

export function bindGlobalsOverlayLayout(win) {
  const editor = livePreviewEditorEl(win.document);

  if (!editor || typeof win.ResizeObserver !== 'function' || editor._sveGlobalsRo) {
    return;
  }

  editor._sveGlobalsRo = new win.ResizeObserver(() => placeGlobalsOverlay(win));
  editor._sveGlobalsRo.observe(editor);
}

/** Hide Theme Settings without destroying it (stash + form stay alive). */
export function hideGlobalsPanel(win, { release = true } = {}) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  parkGlobalsOverlay(panel);

  const tabs = win.document.getElementById(LP_WIDTH_ID);

  if (tabs) {
    tabs.style.visibility = '';
  }

  if (release) {
    releaseLeftEdgeIfFree(win);
  }

  syncPreviewInset(win);
}

/** Show Theme Settings again (left overlay). Page section form stays mounted underneath. */
export function showGlobalsPanel(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  // Never reparent the iframe — moving it in the DOM reloads it and refreshes
  // the Live Preview. It lives on body; we only change its box.
  pinGlobalsPanelLeft(win, panel);

  const designs = win.document.getElementById(CHROME_DESIGNS_ID);

  if (designs) {
    designs.style.cssText = 'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
    designs.setAttribute('data-sve-chrome-hidden', '1');
  }

  syncPreviewInset(win);
}

/**
 * Docked panels on the RIGHT: sections library, block tree, comments, AI.
 * Theme Settings lives on the left and is not closed from here.
 * `keep` is id(s) to leave open. Called with nothing to close them all (leaving Live Preview).
 */
export function closeRightPanels(win, keep = null) {
  const keepIds = keep == null ? [] : Array.isArray(keep) ? keep : [keep];
  const extra = keepIds.length && RIGHT_DOCK_PIN_STACK ? pinnedKeepIds(win) : [];
  // A tool taking the sidebar in a Build: the tree stays, parked (showInRightShell). Build picks through it.
  const tree =
    keep != null && buildModeUi.mode !== 'content' && win.document.getElementById(HTML_TREE_PANEL_ID)
      ? [HTML_TREE_PANEL_ID]
      : [];
  const allKeep = [...new Set([...keepIds, ...extra, ...tree])];

  beginRightShellSwap();

  try {
    closeRightPanelsInner(win, allKeep);
  } finally {
    endRightShellSwap();
  }

  if (!allKeep.length) {
    hideRightDock(win);
  }
}

export function closeRightPanelsInner(win, keepIds) {
  if (!keepIds.includes(SECTION_PICKER_ID)) {
    closeSectionPicker(win);
  }

  if (!keepIds.includes(OUTLINE_PANEL_ID)) {
    closeOutlinePanel(win);
  }

  if (!keepIds.includes(HTML_TREE_PANEL_ID)) {
    closeHtmlTreePanel(win);
  }

  if (!keepIds.includes(PERF_PANEL_ID)) {
    closePerformancePanel(win);
  }

  if (!keepIds.includes(THEME_PANEL_ID)) {
    // Another tool takes the sidebar: no question, unsaved changes kept for the next open.
    closeThemePanel(win, { force: true });
  }

  if (!keepIds.includes(LISTVIEW_PANEL_ID)) {
    closeListViewPanel(win);
  }

  if (!keepIds.includes(COMMENTS_PANEL_ID)) {
    closeCommentsPanel(win);
  }

  if (!keepIds.includes(GLOBAL_SECTION_HOST_ID)) {
    closeGlobalSectionPanel(win);
  }

  if (!keepIds.includes(CHROME_DESIGNS_ID)) {
    closeChromeDesignsPanel(win);
  }

  if (!keepIds.includes('__sve-ai-panel')) {
    closeAiPanel(win);
  }
}

/** Absolute fill CSS — only for designs cards that are not an iframe form. */
export function editorOverlayCss() {
  return (
    'position:absolute;inset:0;width:auto;height:auto;z-index:50;overflow:hidden;' +
    'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);' +
    'color:currentColor;border:0;box-shadow:none;font-family:ui-sans-serif,system-ui,sans-serif;'
  );
}

/** Designs panel (no iframe) can still mount inside the editor. */
export function mountInLivePreviewEditor(win, panel) {
  claimLivePreviewEditor(win);

  const doc = win.document;
  const editor = livePreviewEditorEl(doc);
  const visible = panel.style.display !== 'none' && !panel.hasAttribute('data-sve-chrome-hidden');

  panel.style.cssText = editorOverlayCss();
  panel.style.display = visible ? 'flex' : 'none';

  if (!editor) {
    doc.body.appendChild(panel);

    return;
  }

  if (win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }

  if (panel.parentElement !== editor) {
    editor.appendChild(panel);
  }
}

/** After chrome overlays close, follow LP mode — unless a solo section or Build needs the pane. */
export function releaseLeftEdgeIfFree(win) {
  const doc = win.document;

  if (dockedPanelWidth(doc, [GLOBALS_PANEL_ID, CHROME_DESIGNS_ID]) > 0) {
    return;
  }

  sveState.forcePanelOpen = false;

  if (!lpHeader(doc)) {
    return;
  }

  // Build holds the column for its panel (build-switch.js opens it); the HTML
  // tree that opens with Build's dock closes the right panels, and must not
  // fold the column away under it.
  if (selectionPanelShowing() || buildModeUi.on) {
    setLpCollapsed(win, false);

    return;
  }

  setLpCollapsed(win, lpMode(win) !== 'show');
}

/**
 * Leave header/footer chrome focus so a page section can use the left editor.
 * Theme Settings overlay is parked (form + stash intact) — only chrome designs
 * and tab-lock are cleared.
 */
export function dismissChromeForPageEdit(win, { syncDock = false } = {}) {
  hideGlobalsPanel(win, { release: false });
  win.document.getElementById(CHROME_DESIGNS_ID)?.remove();
  removeChromeModeToggles(win);
  setActiveChromeKind(null);
  // In this window the chrome form IS the left editor, so a page section can only
  // have it once that form is out of the way. Its stash stays until the section
  // click that got us here has been answered — the preview is still rendering the
  // header as it is being typed.
  const closedInline = closeChromeInline(win, { refresh: false }) !== false;

  sveState.forcePanelOpen = false;
  syncPreviewInset(win);
  syncSectionLibraryAvailability(win);

  // The inline form sends the dock back to the page as it closes. The
  // frame's form (the fallback a production build takes) does not, and the
  // dock — and the tree on it — stayed on the header after Close or Escape.
  // Only when asked: on a deliberate exit, where nothing else is about to
  // load. A section click dismisses too, with its own load right behind it —
  // syncing here as well loaded the PREVIOUS section over the clicked one.
  if (syncDock && !closedInline) {
    // Closed on purpose: back to the page's content. The dock decides it
    // outright; only when its module is not there yet does the plain sync do.
    if (!ask('dock:leave-part')) {
      syncCodeDock(win, win.document, null);
    }
  }
}

/** Visible width of the widest panel in `ids` (0 if none). */
export function dockedPanelWidth(doc, ids) {
  let px = 0;

  for (const id of ids) {
    const panel = doc.getElementById(id);

    if (
      !panel ||
      panel.style.display === 'none' ||
      panel.hasAttribute('data-sve-chrome-hidden') ||
      // The dock closed takes what stands in it with it.
      panel.closest('[data-sve-right-closed]') ||
      // Left or below the preview: its room is not at the preview's right.
      panel.closest(`[${ZONE_SHELL_ATTR}]`)
    ) {
      continue;
    }

    px = Math.max(px, Math.round(panel.getBoundingClientRect().width));
  }

  return px;
}
