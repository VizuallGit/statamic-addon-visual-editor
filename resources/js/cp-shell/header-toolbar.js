/**
 * cp.js — region "header-toolbar", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel cp.js for what the shell exports.
 */
import { aiTextIcon } from '../ai-text-icon.js';
import { bindTips } from '../cp/tip.js';
import { t } from '../lib/i18n.js';
import { sveState } from '../cp-state.js';
import { SELECTORS } from '../cp-selectors.js';
import { closeCodeDock, isCodeDockArmed, setCodeDockArmed, syncCodeDock, templateDockAllowed } from '../code-dock-lazy.js';
import { aiPanelAllowed, closeAiPanel, ensureAiPanel, isAiPanelOpen, toggleAiPanel } from '../ai-panel-lazy.js';
import { closeSiteCss, isSiteCssOpen, siteCssAllowed, toggleSiteCss } from '../site-css-lazy.js';
import { beginRightShellSwap, endRightShellSwap, isRightDockTool, isToolbarShortcut, relayoutRightDock, releaseRightShellIfEmpty, rememberedListViewTab, rememberedRightPaneKeys, revealRightPane } from '../right-dock.js';
import { chromeGet, chromeRemove, chromeSet } from '../chrome-prefs.js';
import { ensurePanel, hidePanelWait, isRightPanelInDom, showPanelWait, warmLivePreviewCore } from '../lazy-panels.js';
import { bindToolbarPrefetch } from '../toolbar-prefetch.js';
import { COLLECTION_PICKER_ID, FOCUS_LOCKED_TABS, GLOBALS_PICKER_ID, HEADER_SURFACE, HTML_TREE_PANEL_ID, LIBRARY_BUTTON_ID, LP_CHROME_H, LP_CONTROL_H, LP_CONTROL_PAD, LP_DOCKED_KEY, LP_ICON_LOCKED_OPACITY, LP_MODE_ID, LP_PRIMARY_FLAT, LP_TOGGLE_ID, LP_TOOLBAR_GAP, LP_WIDTH_ID, NEW_ENTRY_ID, OUTLINE_PANEL_ID, PERF_PANEL_ID, SECTION_PICKER_ID, SOLO_KEEP_ATTR, SOLO_PARENT_ATTR } from '../lib/ids.js';
import { unwrapRef } from '../lib/values.js';
import { featureOn, sectionField } from '../lib/config.js';
import { lpHeader } from '../lib/live-preview.js';
import { activeContainers } from '../lib/publish-containers.js';
import { lpHeaderBg, lpMode, lpModeSeparator, paintLpActiveControl, persistDockedPanel, setLpMode } from '../lp-panel.js';
import { focusFromPreview, focusPanelOn, leaveSolo, placeLpWidthPicker } from '../focus-panel.js';
import { closeRightPanels, closeSectionPicker, dismissChromeForPageEdit, formHasSectionField, isGlobalsOverlayOpen, isSectionLibraryLocked, openSectionPicker, paintFocusLockedTabs, rowLocation, syncPreviewInset, syncSectionLibraryAvailability } from '../section-library.js';
import { closeGlobalSectionPanel } from '../global-section.js';
import { blockRowUid, closeListViewPanel, commentsPanel, listViewPanel, toggleCommentsPanel, toggleListViewPanel } from '../lazy/listview.js';
import { armHtmlTreePrefetch, closeHtmlTreePanel, toggleHtmlTreePanel } from '../lazy/html-tree.js';
import { closeOutlinePanel, toggleOutlinePanel } from '../lazy/outline.js';
import { closePerformancePanel, togglePerformancePanel } from '../lazy/performance.js';
import { pageEditsOpen, togglePageEdits } from '../lazy/page-activity.js';
import { closeSchema, isSchemaOpen, schemaAllowed, toggleSchema } from '../lazy/schema.js';
import { aiTextAllowed, isAiTextOn, syncAiTextToPreview, toggleAiText } from '../lazy/ai-text.js';
import { sendToPreview } from './add-section.js';
import { MSG, SOURCE } from '../lib/protocol.js';

// ===== header-toolbar =====
// --- Header toolbar: one control at a time -------------------------------------
//
// The header used to show every control at once — the panel mode, the collection
// picker, the globals dropdown, the sections button. For an editor a customer
// uses, that's noise. This collapses them to a row of icons; clicking one reveals
// only its control and hides the rest. The settings icon is the important one: it
// opens the editor panel and mirrors its tabs (Main/SEO/Sidebar, read live so a
// renamed tab just follows) into the header, plus a Save — so "edit the SEO" is
// one obvious click, not a hunt.

export const HEADER_TOOLBAR_ID = '__sve-toolbar';

export const SETTINGS_TABS_ID = '__sve-settings-tabs';

/**
 * Ikoner der folder en kontrol ud ved siden af sig. De øvrige (sektioner,
 * disposition) åbner et panel i siden og står helt frit.
 */
export const FRAMED_TABS = ['pages', 'globals'];

/**
 * De to der samler ikon og kontrol i ét felt, delt op af gennemgående streger.
 *
 * Panelknappen gør det ikke: dér er kontrollen en tilstand knappen selv står i,
 * og de to skal kunne skelnes. Her er kontrollen et sted man navigerer hen — ét
 * sammenhængende værktøj, hvor stregerne siger hvor det ene stopper og det
 * næste begynder.
 */
export const MERGED_TABS = ['pages', 'globals'];

export const frameId = (key) => `__sve-frame-${key}`;
export const seamId = (key) => `__sve-seam-${key}`;

/**
 * Kvadratisk ikonknap i topbaren — samme flade/højde som device/zoom-grupperne
 * når den står alene (fx go-back). Ikoner inde i en gruppe bruger
 * LP_TOOLBAR_ICON_STYLE.
 */
export const LP_ICON_BTN_STYLE =
  `box-sizing:border-box;width:${LP_CHROME_H}px;height:${LP_CHROME_H}px;` +
  'display:inline-flex;align-items:center;justify-content:center;padding:0;' +
  `border:none;border-radius:.5rem;cursor:pointer;background:${HEADER_SURFACE};color:currentColor;`;

/** Luften mellem ikonknappen og dens kontrolgruppe, når de er to bokse. */
export const LP_ICON_GAP = 8;

/** Luften på hver side af en gennemgående streg. */
export const LP_SEAM_GAP = 6;

/** Pilen i vores egne selects. Native-pilen står klods op ad kanten. */
export const SELECT_CHEVRON =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' ' +
  "viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2.2' stroke-linecap='round' " +
  'stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")';

/** Selve gruppen om et sæt kontroller: fladen, hjørnerne og luften ud til dem. */
export const HEADER_GROUP_STYLE =
  `display:inline-flex;align-items:center;box-sizing:border-box;height:${LP_CHROME_H}px;` +
  `padding:${LP_CONTROL_PAD}px;border-radius:.5rem;` +
  `background:${HEADER_SURFACE};font-family:inherit;`;

/**
 * En kontrol inde i en gruppe. Lavere end gruppens indre mål, så den valgte
 * flade ikke går helt ud til kanten — den skal ligge i gruppen, ikke fylde den.
 */
export const FRAMED_CONTROL_STYLE =
  `box-sizing:border-box;height:${LP_CONTROL_H}px;border:none;border-radius:.375rem;` +
  'background:transparent;cursor:pointer;color:currentColor;' +
  'font-size:12px;font-weight:500;font-family:inherit;line-height:1;';

/** Ikon inde i en topbar-gruppe — samme mål som device-knapperne. */
export const LP_TOOLBAR_ICON_STYLE =
  `${FRAMED_CONTROL_STYLE}width:28px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;

/**
 * En select i et felt med streger: ingen flade om sig selv — stregerne er det
 * der skiller den fra naboen, og en flade oveni ville sige det samme igen.
 *
 * Pilen sidder .375rem fra kanten, og teksten stopper før den. Designet tegnede
 * den ikke, men uden den ligner en select et stykke tekst — man skal kunne se at
 * der er noget at folde ud. Den luft passer med stregens egen, så afstanden ind
 * til stregen bliver den samme fra begge sider.
 */
export const FRAMED_SELECT_STYLE =
  `${FRAMED_CONTROL_STYLE}padding:0 1.375rem 0 .375rem;appearance:none;-webkit-appearance:none;` +
  `background-image:${SELECT_CHEVRON};background-repeat:no-repeat;` +
  'background-position:right .375rem center;background-size:12px;';

/**
 * Sømmen mellem to dele af samme felt — ikke i brug i topbaren.
 */
export function headerSeam(doc) {
  return lpModeSeparator(doc);
}

/** Fjern lyse ikon-streger i topbaren, hvis en ældre session har sat dem ind. */
export function syncToolbarIconSeps(bar) {
  bar?.querySelectorAll('[data-sve-toolbar-sep]').forEach((el) => el.remove());
}

/**
 * Samme gruppe, men svævende over panelet i stedet for at ligge på topbaren.
 *
 * Gruppens flade er halvgennemsigtig, og panelet ruller under den — så den skal
 * have en tæt bund at ligge på, ellers læser man indholdet gennem knapperne. Et
 * fladt gradient-lag oven på panelfarven giver præcis samme nuance som oppe i
 * topbaren, bare uigennemsigtig.
 */
export const FLOATING_GROUP_STYLE =
  `${HEADER_GROUP_STYLE}background:linear-gradient(${HEADER_SURFACE},${HEADER_SURFACE}),` +
  'var(--theme-color-content-bg,#fff);box-shadow:0 1px 4px rgba(0,0,0,.18);color:currentColor;';

// null = nothing expanded (the simplest header). Persisted so it survives the
// header being rebuilt on every preview update.

/** The feature toggle behind each header tab — see ensureHeaderToolbar. */
export const HEADER_TAB_FEATURE = {
  settings: 'panel',
  pages: 'pages',
  globals: 'globals',
  sections: 'sections',
  outline: 'outline',
  html_tree: 'html_tree',
  performance: 'performance',
};

function formHasPageBuilder(win) {
  if (typeof formHasSectionField === 'function') {
    return formHasSectionField(win);
  }

  const field = sectionField(win) || 'page_sections';
  const doc = win.document;

  if (doc.querySelector(`.publish-field-${field}, [data-field="${field}"], #field_${field}`)) {
    return true;
  }

  const containers = typeof activeContainers === 'function' ? activeContainers(doc) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;

    if (values && Array.isArray(values[field])) {
      return true;
    }
  }

  return false;
}

export function headerTabAvailable(win, tab) {
  if (!tab) {
    return true;
  }

  if (tab === 'sections' && !formHasPageBuilder(win)) {
    return false;
  }

  return featureOn(win, HEADER_TAB_FEATURE[tab] ?? tab);
}

export function loadHeaderTab(win) {
  if (sveState.headerTab !== undefined) {
    return;
  }

  const stored = chromeGet(win, 'sve-header-tab');

  sveState.headerTab = stored && headerTabAvailable(win, stored) ? stored : null;
}

/** Re-open docked right panels that were showing last time — pins, order, extras. */

/**
 * While Live Preview is still booting inside the site overlay, remounting every
 * pinned right pane (AI + tree + comments + sections) races the preview open and
 * can prevent `lp-ready` — the host then looks like login failed. Pause until
 * the preview has painted.
 */

export function restoreRememberedCodeDock(win) {
  try {
    if (isCodeDockArmed(win) && templateDockAllowed(win)) {
      syncCodeDock(win, win.document, sveState.soloUid);
    }
  } catch (err) {
    console.error('[sve] restore code dock', err);
  }
}

export function restoreDockedHeaderPanels(win) {
  if (sveState.dockRestorePaused) {
    return;
  }

  // Once restored this session, stop. Re-running on every MutationObserver tick
  // remounts AI/tree/comments and races the frontend overlay open.
  if (sveState.dockedHeaderRestored) {
    return;
  }

  const showing = (key) => {
    if (key === 'listview') {
      return !!listViewPanel(win.document) || isRightPanelInDom(win, 'listview');
    }

    if (key === 'outline') {
      return !!win.document.getElementById(OUTLINE_PANEL_ID);
    }

    if (key === 'html_tree') {
      return !!win.document.getElementById(HTML_TREE_PANEL_ID);
    }

    if (key === 'performance') {
      return !!win.document.getElementById(PERF_PANEL_ID);
    }

    if (key === 'sections') {
      return !!win.document.getElementById(SECTION_PICKER_ID);
    }

    if (key === 'comments') {
      return !!commentsPanel(win.document) || isRightPanelInDom(win, 'comments');
    }

    if (key === 'ai') {
      return isAiPanelOpen(win.document);
    }

    return false;
  };

  let keys = [];

  try {
    keys = rememberedRightPaneKeys(win);
    const docked = chromeGet(win, LP_DOCKED_KEY) || '';

    if (docked && docked !== 'right') {
      const extra = docked;

      if (!keys.includes(extra)) {
        keys = [...keys, extra];
      }
    }

    if (rememberedListViewTab(win) === 'outline' && !keys.includes('outline')) {
      keys = keys.map((k) => (k === 'listview' ? 'outline' : k));

      if (!keys.includes('outline')) {
        keys = [...keys, 'outline'];
      }
    }
  } catch {
    keys = [];
  }

  keys = keys.filter((key) => key !== 'html_tree');
  keys = keys.filter((key) => key !== 'sections' || headerTabAvailable(win, 'sections'));

  if (!keys.length) {
    sveState.dockedHeaderRestored = true;
    // The dock remembers being open. If it has nothing to be open for — the
    // remembered tools are gone, switched off, or not this user's to see — then
    // an open, empty sidebar is just a stripe of nothing taking up the page.
    releaseRightShellIfEmpty(win);
    restoreRememberedCodeDock(win);

    return;
  }

  if (keys.every(showing)) {
    sveState.dockedHeaderRestored = true;
    restoreRememberedCodeDock(win);

    return;
  }

  sveState.dockedHeaderRestored = true;
  sveState.listViewTab = 'tree';

  beginRightShellSwap();

  void (async () => {
    try {
      for (const key of keys) {
        try {
          await ensureRightTool(win, key);
        } catch (err) {
          console.error('[sve] restore right pane', key, err);
        }
      }
    } finally {
      endRightShellSwap();
    }

    relayoutRightDock(win);
    releaseRightShellIfEmpty(win);
    persistDockedPanel(win);
    restoreRememberedCodeDock(win);
  })();
}

export async function ensureRightTool(win, key) {
  if (key === 'ai') {
    await ensureAiPanel(win);

    return;
  }

  if (!isRightPanelInDom(win, key) && key !== 'edits') {
    showPanelWait(win, key);
  }

  try {
    await ensurePanel(key);
  } finally {
    hidePanelWait(win);
  }

  if (key === 'listview') {
    if (!listViewPanel(win.document)) {
      toggleListViewPanel(win);
    }

    return;
  }

  if (key === 'outline') {
    if (!win.document.getElementById(OUTLINE_PANEL_ID)) {
      toggleOutlinePanel(win);
    }

    return;
  }

  if (key === 'html_tree') {
    if (!win.document.getElementById(HTML_TREE_PANEL_ID)) {
      toggleHtmlTreePanel(win);
    }

    return;
  }

  if (key === 'performance') {
    if (!win.document.getElementById(PERF_PANEL_ID)) {
      togglePerformancePanel(win);
    }

    return;
  }

  if (key === 'sections') {
    if (!win.document.getElementById(SECTION_PICKER_ID)) {
      openSectionPicker(win);
    }

    return;
  }

  if (key === 'comments') {
    if (!commentsPanel(win.document)) {
      toggleCommentsPanel(win);
    }

    return;
  }

  if (key === 'edits') {
    togglePageEdits(win);
  }
}

export function setHeaderTab(win, tab) {
  sveState.headerTab = tab;

  if (tab) {
    chromeSet(win, 'sve-header-tab', tab);
  } else {
    chromeRemove(win, 'sve-header-tab');
  }
}

export const TOOLBAR_ICONS = {
  // Soft panel-left — same stroke language as pages/globe/grid (not the old heavy box).
  settings:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M9 3v18"/></svg>',
  rightdock:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M15 3v18"/></svg>',
  pages:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="18" rx="2"/>' +
    '<line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  globals:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><circle cx="12" cy="12" r="9"/>' +
    '<line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
  sections:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  // The bars you sent — nesting, no page frame around them.
  listview:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<line x1="3" y1="6" x2="13" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/>' +
    '<line x1="11" y1="18" x2="21" y2="18"/></svg>',
  // The accessibility mark. The panel behind it started as the heading outline
  // and still opens on it, but the tool is the wider one now — and an icon that
  // says "table of contents" would send people looking for a different thing.
  // Key stays `outline`: the toggle, the stored panel and the dock all know it
  // by that name, and renaming it would only mean a migration nobody asked for.
  outline:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<circle cx="12" cy="12" r="9.2"/>' +
    '<circle cx="12" cy="7.1" r="1.15" fill="currentColor" stroke="none"/>' +
    '<path d="M6.9 10.3 12 11.6l5.1-1.3"/>' +
    '<path d="M12 11.6v3.1"/>' +
    '<path d="m9.3 19.2 2.7-4.5 2.7 4.5"/></svg>',
  // A gauge: the tool answers "how heavy is this page", and a needle on a dial
  // is the one picture everybody already reads as that. Deliberately unlike the
  // accessibility mark beside it — two circles in a row would be one icon twice.
  // A full dial rather than the half arc it was: the arc only filled the
  // middle band, so it sat visibly shorter than every icon beside it.
  performance:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<circle cx="12" cy="12" r="9"/>' +
    '<path d="M12 12 16.2 7.8"/>' +
    '<circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none"/></svg>',
  html_tree:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="7" rx="1.5"/>' +
    '<rect x="8" y="14" width="12" height="7" rx="1.5"/></svg>',
  code:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="display:block" aria-hidden="true">' +
    '<path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75-.232-2.718h10.059l.23-2.622H5.412l.698 8.01h9.02l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
  comments:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M7 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9.5L5 21.5V18H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"/></svg>',
  edits:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>' +
    '<path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  ai:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>' +
    '<path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>',
  // AI text. The chat's spark says "AI"; this says "AI on the words". Shared
  // with the marks in the preview — same tool, same glyph everywhere.
  aitext: aiTextIcon(15),
  // Structured data: a document with braces on it. It is data *about* the page,
  // which is why it is a page carrying a code mark rather than a plain file.
  schema:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>' +
    '<path d="M14 3v5h5"/>' +
    '<path d="M10.5 12.5 9 14l1.5 1.5"/><path d="m13.5 12.5 1.5 1.5-1.5 1.5"/></svg>',
  site_css:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M8 4c-3 1-4 3-4 6v1c0 1.2-1 2-2 2 1 0 2 .8 2 2v1c0 3 1 5 4 6"/>' +
    '<path d="M16 4c3 1 4 3 4 6v1c0 1.2 1 2 2 2-1 0-2 .8-2 2v1c0 3-1 5-4 6"/></svg>',
};

/** Keep toolbar glyphs in sync after icon redesigns (toolbar mounts once). */
export function syncToolbarIcons(doc) {
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  bar.querySelectorAll('button[data-tab]').forEach((btn) => {
    const key = btn.dataset.tab;
    const html = TOOLBAR_ICONS[key];

    if (!html || btn.dataset.iconVer === 'stairs-toc-20260821') {
      return;
    }

    const badge = btn.querySelector('[data-sc-badge]');

    btn.innerHTML = html;
    btn.dataset.iconVer = 'stairs-toc-20260821';

    if (badge) {
      btn.appendChild(badge);
    }
  });
}

/** The icon row at the far left of the Live Preview header. */
export function ensureHeaderToolbar(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header || doc.getElementById(HEADER_TOOLBAR_ID)) {
    doc.getElementById(HEADER_TOOLBAR_ID)?.querySelector('button[data-tab="rightdock"]')?.remove();
    ensureCodeDockToolbarButton(win);
    ensureSiteCssToolbarButton(win);
    ensureAiToolbarButton(win);
    ensureAiTextToolbarButton(win);
    ensureSchemaToolbarButton(win);
    ensureCommentsToolbarButton(win);
    ensurePageEditsToolbarButton(win);
    ensureOutlineToolbarButton(win);
    ensurePerformanceToolbarButton(win);
    ensureHtmlTreeToolbarButton(win);
    syncToolbarIconSeps(doc.getElementById(HEADER_TOOLBAR_ID));

    return;
  }

  bindToolbarPrefetch(win);

  const bar = doc.createElement('div');

  bar.id = HEADER_TOOLBAR_ID;
  bar.dataset.sveChrome = 'group-1';
  bindTips(win, bar);
  bar.style.cssText =
    `${HEADER_GROUP_STYLE}gap:4px;margin-right:${LP_TOOLBAR_GAP}px;`;

  // `feature` names the toggle on the settings screen; `key` is what the rest of
  // the header calls the tab. They differ for the panel because the toggle reads
  // as what it opens ("Page settings panel") while the tab is the icon's slot.
  [
    { key: 'settings', feature: 'panel', title: t(win, 'panel') },
    { key: 'pages', feature: 'pages', title: t(win, 'pages') },
    { key: 'globals', feature: 'globals', title: t(win, 'globals') },
    { key: 'sections', feature: 'sections', title: t(win, 'sections') },
    { key: 'listview', feature: 'listview', title: t(win, 'listview') },
    { key: 'outline', feature: 'outline', title: t(win, 'outline') },
    { key: 'performance', feature: 'performance', title: t(win, 'performance') },
    { key: 'code', title: t(win, 'code_dock_toggle') },
    { key: 'site_css', title: t(win, 'site_css_toggle') },
    { key: 'ai', title: t(win, 'ai_panel') },
    { key: 'comments', feature: 'comments', title: t(win, 'comments_pane') },
    { key: 'edits', feature: 'page_activity', title: t(win, 'page_edits_title') },
  ].forEach((tab) => {
    if (isToolbarShortcut(tab.key) && isRightDockTool(tab.key)) {
      // Right-dock pane with a header shortcut (comments badge).
    } else if (isRightDockTool(tab.key)) {
      return;
    } else if (tab.key === 'code') {
      if (!templateDockAllowed(win)) {
        return;
      }
    } else if (tab.key === 'site_css') {
      if (!siteCssAllowed(win)) {
        return;
      }
    } else if (tab.key === 'ai') {
      if (!aiPanelAllowed(win)) {
        return;
      }
    } else if (tab.key === 'comments') {
      if (!featureOn(win, 'comments')) {
        return;
      }
    } else if (tab.key === 'edits') {
      if (!featureOn(win, 'page_activity')) {
        return;
      }
    } else if (!featureOn(win, tab.feature)) {
      return;
    }

    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.tab = tab.key;
    btn.title = tab.title;
    btn.innerHTML = TOOLBAR_ICONS[tab.key];
    btn.dataset.iconVer = 'stairs-toc-20260821';
    // Same outer size as devices / zoom / go-back — one height across the bar.
    btn.style.cssText = LP_TOOLBAR_ICON_STYLE + (tab.key === 'comments' ? 'position:relative;' : '');
    btn.querySelector('svg')?.setAttribute('width', '15');
    btn.querySelector('svg')?.setAttribute('height', '15');
    btn.addEventListener('click', () => {
      if (tab.key === 'comments') {
        void (async () => {
          showPanelWait(win, 'comments');

          try {
            await ensurePanel('comments');
          } finally {
            hidePanelWait(win);
          }

          toggleCommentsPanel(win);
          persistDockedPanel(win);
          applyHeaderTab(win);
          syncPreviewInset(win);
        })();

        return;
      }

      if (tab.key === 'code') {
        toggleCodeDockButton(win);

        return;
      }

      if (tab.key === 'site_css') {
        toggleSiteCssButton(win);

        return;
      }

      if (tab.key === 'ai') {
        toggleAiPanelButton(win);

        return;
      }

      if (tab.key === 'edits') {
        void (async () => {
          await ensurePanel('edits');
          togglePageEdits(win);
          applyHeaderTab(win);
        })();

        return;
      }

      toggleHeaderTab(win, tab.key);
    });

    if (FRAMED_TABS.includes(tab.key)) {
      const wrap = doc.createElement('div');

      wrap.id = frameId(tab.key);

      if (MERGED_TABS.includes(tab.key)) {
        wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;';
        wrap.appendChild(btn);

        const seam = lpModeSeparator(doc);

        seam.id = seamId(tab.key);
        seam.style.display = 'none';
        wrap.appendChild(seam);
      } else {
        // To bokse med luft imellem: knappen er det man trykker på, kontrollen er
        // det der kommer frem, og de skal kunne skelnes — samme højde begge.
        wrap.style.cssText = `display:inline-flex;align-items:center;gap:${LP_ICON_GAP}px;`;
        wrap.appendChild(btn);
      }

      bar.appendChild(wrap);

      return;
    }

    bar.appendChild(btn);
  });

  header.insertBefore(bar, header.firstChild);
  syncToolbarIconSeps(bar);
}

export function toggleCodeDockButton(win) {
  const next = !isCodeDockArmed(win);

  setCodeDockArmed(win, next);

  if (next) {
    syncCodeDock(win, win.document, sveState.soloUid);
  } else {
    closeCodeDock(win.document);
  }

  applyHeaderTab(win);
}

export function toggleSiteCssButton(win) {
  if (!siteCssAllowed(win)) {
    return;
  }

  toggleSiteCss(win);
  applyHeaderTab(win);
}

/**
 * The code icon is added after the toolbar first mounts (feature flags can
 * arrive late) and sits after the block tree, last in the icon row.
 */
export function ensureCodeDockToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="code"]');

  if (!templateDockAllowed(win)) {
    existing?.remove();

    if (isCodeDockArmed(win)) {
      setCodeDockArmed(win, false);
      closeCodeDock(doc);
    }

    return;
  }

  if (existing) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'code';
  btn.dataset.iconVer = 'stroke-15-html5';
  btn.title = t(win, 'code_dock_toggle');
  btn.innerHTML = TOOLBAR_ICONS.code;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleCodeDockButton(win));

  const listview = bar.querySelector('button[data-tab="listview"]');
  const rightdock = bar.querySelector('button[data-tab="rightdock"]');

  if (listview) {
    listview.after(btn);
  } else if (rightdock) {
    rightdock.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

export function ensureSiteCssToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="site_css"]');

  if (!siteCssAllowed(win)) {
    existing?.remove();

    if (isSiteCssOpen(doc)) {
      closeSiteCss(win);
    }

    return;
  }

  if (existing) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'site_css';
  btn.dataset.iconVer = 'css-braces-20260831';
  btn.title = t(win, 'site_css_toggle');
  btn.innerHTML = TOOLBAR_ICONS.site_css;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleSiteCssButton(win));

  const code = bar.querySelector('button[data-tab="code"]');

  if (code) {
    code.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

export function ensureOutlineToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  if (!featureOn(win, 'outline')) {
    bar.querySelector('button[data-tab="outline"]')?.remove();

    return;
  }

  if (bar.querySelector('button[data-tab="outline"]')) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'outline';
  btn.dataset.iconVer = 'stairs-toc-20260821';
  btn.title = t(win, 'outline');
  btn.innerHTML = TOOLBAR_ICONS.outline;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleHeaderTab(win, 'outline'));

  const listview = bar.querySelector('button[data-tab="listview"]');

  if (listview) {
    listview.after(btn);
  } else {
    const code = bar.querySelector('button[data-tab="code"]');

    if (code) {
      code.before(btn);
    } else {
      bar.appendChild(btn);
    }
  }
}

export function ensurePerformanceToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  if (!featureOn(win, 'performance')) {
    bar.querySelector('button[data-tab="performance"]')?.remove();

    return;
  }

  if (bar.querySelector('button[data-tab="performance"]')) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'performance';
  btn.dataset.iconVer = 'stairs-toc-20260821';
  btn.title = t(win, 'performance');
  btn.innerHTML = TOOLBAR_ICONS.performance;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleHeaderTab(win, 'performance'));

  const outline = bar.querySelector('button[data-tab="outline"]');

  if (outline) {
    outline.after(btn);
  } else {
    const code = bar.querySelector('button[data-tab="code"]');

    if (code) {
      code.before(btn);
    } else {
      bar.appendChild(btn);
    }
  }
}

/** HTML tree opens with the template dock — no top-bar icon. */
export function ensureHtmlTreeToolbarButton(win) {
  win.document.getElementById(HEADER_TOOLBAR_ID)
    ?.querySelector('button[data-tab="html_tree"]')
    ?.remove();
}

export function ensureCommentsToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  if (!featureOn(win, 'comments')) {
    bar.querySelector('button[data-tab="comments"]')?.remove();

    return;
  }

  if (isRightDockTool('comments')) {
    if (!isToolbarShortcut('comments')) {
      bar.querySelector('button[data-tab="comments"]')?.remove();

      return;
    }

    if (bar.querySelector('button[data-tab="comments"]')) {
      bar.appendChild(bar.querySelector('button[data-tab="comments"]'));

      return;
    }

    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.tab = 'comments';
    btn.dataset.iconVer = 'stairs-toc-20260821';
    btn.title = t(win, 'comments_pane');
    btn.innerHTML = TOOLBAR_ICONS.comments;
    btn.style.cssText = `${LP_TOOLBAR_ICON_STYLE}position:relative;`;
    btn.querySelector('svg')?.setAttribute('width', '15');
    btn.querySelector('svg')?.setAttribute('height', '15');
    btn.addEventListener('click', () => {
      revealRightPane(win, 'comments');
      persistDockedPanel(win);
      applyHeaderTab(win);
      syncPreviewInset(win);
    });
    bar.appendChild(btn);
    win.dispatchEvent(new CustomEvent('sve-right-dock-change', { detail: {} }));

    return;
  }

  const comments = bar.querySelector('button[data-tab="comments"]');

  if (comments && comments !== bar.lastElementChild) {
    bar.appendChild(comments);
  }
}

export function ensurePageEditsToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  if (!featureOn(win, 'page_activity')) {
    bar.querySelector('button[data-tab="edits"]')?.remove();

    return;
  }

  if (bar.querySelector('button[data-tab="edits"]')) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'edits';
  btn.dataset.iconVer = 'stairs-toc-20260821';
  btn.title = t(win, 'page_edits_title');
  btn.innerHTML = TOOLBAR_ICONS.edits;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => {
    void (async () => {
      await ensurePanel('edits');
      togglePageEdits(win);
      applyHeaderTab(win);
    })();
  });

  const comments = bar.querySelector('button[data-tab="comments"]');

  if (comments) {
    comments.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

export function toggleAiPanelButton(win) {
  if (!aiPanelAllowed(win)) {
    return;
  }

  if (!isAiPanelOpen(win.document)) {
    closeRightPanels(win, ['__sve-ai-panel']);
  }

  toggleAiPanel(win);
  syncPreviewInset(win);
  applyHeaderTab(win);
}

export function ensureAiToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="ai"]');

  if (!aiPanelAllowed(win)) {
    existing?.remove();

    if (isAiPanelOpen(doc)) {
      closeAiPanel(win);
      syncPreviewInset(win);
    }

    return;
  }

  if (existing) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'ai';
  btn.dataset.iconVer = 'stroke-15-spark';
  btn.title = t(win, 'ai_panel');
  btn.innerHTML = TOOLBAR_ICONS.ai;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleAiPanelButton(win));

  const code = bar.querySelector('button[data-tab="code"]');

  if (code) {
    code.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

/**
 * Structured data: schema.org JSON-LD for this page and for the site.
 *
 * A panel, not a preview tool — what it edits is never visible on the page, so
 * there is nothing to point at and nothing to draw over.
 */
export function ensureSchemaToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="schema"]');

  if (!schemaAllowed(win)) {
    existing?.remove();

    if (isSchemaOpen(doc)) {
      closeSchema(win);
    }

    return;
  }

  if (existing) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'schema';
  btn.dataset.iconVer = 'stairs-toc-20260821';
  btn.title = t(win, 'schema');
  btn.innerHTML = TOOLBAR_ICONS.schema;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleSchema(win));

  const aitext = bar.querySelector('button[data-tab="aitext"]');

  if (aitext) {
    aitext.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

/**
 * AI text: the switch that puts a mark on every editable text on the page.
 *
 * A toggle rather than a panel — there is nothing to dock. What it opens is in
 * the preview, next to the words being rewritten, which is the only place a
 * heading's length can be judged. The state lives in chrome prefs, so an editor
 * working down a page keeps the marks through every re-render.
 */
export function ensureAiTextToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="aitext"]');

  if (!aiTextAllowed(win)) {
    existing?.remove();

    return;
  }

  if (existing) {
    // The highlight is applyHeaderTab's job, through paintLpActiveControl —
    // the same helper every other icon in this bar is painted by.
    syncAiTextToPreview(win);

    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'aitext';
  btn.dataset.iconVer = 'stairs-toc-20260821';
  btn.title = t(win, isAiTextOn(win) ? 'ai_text_on' : 'ai_text_off');
  btn.innerHTML = TOOLBAR_ICONS.aitext;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleAiText(win));

  const ai = bar.querySelector('button[data-tab="ai"]');

  if (ai) {
    ai.after(btn);
  } else {
    bar.appendChild(btn);
  }

  paintLpActiveControl(btn, !!isAiTextOn(win));

  if (isAiTextOn(win)) {
    syncAiTextToPreview(win);
  }
}

/**
 * Open or close a docked tool once its code has arrived.
 *
 * The click decides; the module turns up later. Before the panels were split
 * into chunks that gap did not exist — every tool was in the bundle, so a
 * toggle after the await was the same thing as a toggle at the click. Now the
 * page can move in between: a preview render, a dock restore, a swap. A toggle
 * applied to a state that has already changed undoes the click instead of
 * performing it, which is a click that visibly does nothing.
 *
 * So the intent is taken before the wait and driven home after it, and the
 * shell is held open across the gap — otherwise the spinner leaves and the
 * sidebar collapses a moment before the panel is ready to fill it.
 */
async function runDockedTool(win, { key, want, isOpen, open, close }) {
  beginRightShellSwap();
  showPanelWait(win, key);

  try {
    await ensurePanel(key);
  } catch (err) {
    // A chunk that will not load must not take the click with it: the spinner
    // has to come down and the shell has to be let go either way.
    console.error('[sve] open right pane', key, err);
  } finally {
    hidePanelWait(win);
    endRightShellSwap();
  }

  try {
    if (want && !isOpen()) {
      open();
    } else if (!want && isOpen()) {
      close();
    }
  } catch (err) {
    // A tool that throws on the way up must not take the sidebar with it: the
    // lines below still run, so an empty shell closes itself instead of sitting
    // open around nothing.
    console.error('[sve] open right pane', key, err);
  }

  // Said out loud, because the alternative is a click that looks ignored. If a
  // pane reports itself missing here, the fault is in that tool's own open —
  // not in the loading, which got far enough to call it.
  if (want && !isOpen()) {
    console.error('[sve] right pane did not mount', key);
  }

  persistDockedPanel(win);
  applyHeaderTab(win);
  releaseRightShellIfEmpty(win);
}

export function toggleHeaderTab(win, key) {
  if (key === 'sections' && !headerTabAvailable(win, 'sections')) {
    return;
  }

  const active = sveState.headerTab === key;

  if (key === 'settings') {
    // The icon follows the panel, not the remembered tab. Hidden leaves the tab
    // as "settings" while the sidebar is gone — using that as `active` made the
    // next click close a panel that was already closed.
    const open = sveState.lpCollapsed === false;
    const solo =
      sveState.soloUid != null ||
      !!win.document.querySelector(
        `[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`
      );

    // A section is selected: this icon is Page settings, so the first click
    // leaves the section and shows the page — not hide. A second click hides.
    if (open && solo) {
      fireTabClick(win, 1);
      settingsTabPressedAt = Date.now();
      settingsTabTries = 0;
      leaveSolo(win.document, win);
      applySectionsFieldVisibility(win);
      applyHeaderTab(win);

      return;
    }

    setLpMode(win, open ? 'hide' : 'show');
    applyHeaderTab(win);

    return;
  }

  if (key === 'outline') {
    // A docked panel, like the section library — the icon is the whole control,
    // there is nothing to unfold into the header beside it.
    setHeaderTab(win, active ? null : 'outline');
    void runDockedTool(win, {
      key: 'outline',
      want: !active,
      isOpen: () => !!win.document.getElementById(OUTLINE_PANEL_ID),
      open: () => toggleOutlinePanel(win),
      close: () => closeOutlinePanel(win),
    });

    return;
  }

  if (key === 'performance') {
    // Docked like the accessibility panel: the icon is the whole control, and
    // the reading starts when the panel opens rather than when the page does.
    setHeaderTab(win, active ? null : 'performance');
    void runDockedTool(win, {
      key: 'performance',
      want: !active,
      isOpen: () => !!win.document.getElementById(PERF_PANEL_ID),
      open: () => togglePerformancePanel(win),
      close: () => closePerformancePanel(win),
    });

    return;
  }

  if (key === 'html_tree') {
    setHeaderTab(win, active ? null : 'html_tree');
    void runDockedTool(win, {
      key: 'html_tree',
      want: !active,
      isOpen: () => !!win.document.getElementById(HTML_TREE_PANEL_ID),
      open: () => toggleHtmlTreePanel(win),
      close: () => closeHtmlTreePanel(win),
    });

    return;
  }

  if (key === 'listview') {
    const open = !!listViewPanel(win.document) || isRightPanelInDom(win, 'listview');

    setHeaderTab(win, open ? null : 'listview');
    void runDockedTool(win, {
      key: 'listview',
      want: !open,
      isOpen: () =>
        !!listViewPanel(win.document) || isRightPanelInDom(win, 'listview'),
      open: () => toggleListViewPanel(win),
      close: () => closeListViewPanel(win),
    });

    return;
  }

  if (key === 'sections') {
    // Clicking the icon is an explicit request for the library, so it always
    // opens. The lock only means something still owns the editor — leave it
    // first (chrome, a global section, or both) instead of going dead on the
    // click, which left the icon looking alive but doing nothing.
    const open = !!win.document.getElementById(SECTION_PICKER_ID);

    setHeaderTab(win, open ? null : 'sections');
    void (async () => {
      beginRightShellSwap();
      showPanelWait(win, 'sections');

      try {
        await ensurePanel('sections');
      } catch (err) {
        console.error('[sve] open right pane', 'sections', err);
      } finally {
        hidePanelWait(win);
        endRightShellSwap();
      }

      if (isSectionLibraryLocked(win)) {
        dismissChromeForPageEdit(win);
        closeGlobalSectionPanel(win);
        sendToPreview({ source: SOURCE, type: MSG.SVE_FORCE_EXIT_CHROME }, win);
        sendToPreview({ source: SOURCE, type: MSG.SVE_FORCE_EXIT_GLOBAL }, win);
        syncSectionLibraryAvailability(win);
      }

      openSectionPicker(win); // toggles
      persistDockedPanel(win);
      applyHeaderTab(win);
    })();

    return;
  }

  // Pages / Globals unfold in the header. They must not close a docked right
  // panel — changing page with the block tree open is a normal move.
  setHeaderTab(win, active ? null : key);
  applyHeaderTab(win);
}

/**
 * The publish tabs (Main / SEO / Sidebar…), mirrored into the header, plus Save.
 *
 * Read from the panel every time rather than remembered: the labels are the
 * blueprint's own, so a renamed tab follows for free, and different collections
 * have different tabs. The panel must be open for the native tabs to exist, which
 * is why this only shows under the settings tab.
 */
export function ensureSettingsTabs(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');
  const nativeTabs = nativeTabButtons(doc);
  const extra = nativeTabs.slice(1);

  hideNativePublishTabList(doc);

  let bar = doc.getElementById(LP_WIDTH_ID);

  if (!editor || sveState.lpCollapsed) {
    bar?.remove();

    if (editor) {
      editor.style.paddingTop = '';
      delete editor.dataset.sveTabPad;
    }

    return null;
  }

  // Tabs not found this tick (chrome form mid-mount). Keep the last bar —
  // removing it collapses padding and is the jump in the sidebar.
  if (extra.length === 0) {
    return doc.getElementById(SETTINGS_TABS_ID);
  }

  if (!bar) {
    bar = doc.createElement('div');
    bar.id = LP_WIDTH_ID;
    bar.setAttribute('data-sve-settings-bar', '');
    bar.style.cssText =
      'position:fixed;z-index:4;display:flex;align-items:stretch;' +
      'color:currentColor;font-family:inherit;box-sizing:border-box;';
    (doc.querySelector('.live-preview') || doc.body).appendChild(bar);
    win.addEventListener('resize', () => placeLpWidthPicker(win));
  }

  bar.setAttribute('data-sve-settings-bar', '');

  let group = doc.getElementById(SETTINGS_TABS_ID);

  if (!group) {
    group = doc.createElement('div');
    group.id = SETTINGS_TABS_ID;
    bar.appendChild(group);
  }

  group.removeAttribute('data-sve-section-track');
  group.removeAttribute('data-sve-fill');
  group.setAttribute('data-sve-settings-tabs', '');
  group.style.cssText = 'width:100%;max-width:100%;';

  const signature = `text|${extra.map((tabEl) => tabEl.textContent.trim()).join('|')}`;

  if (group.dataset.sig !== signature) {
    group.dataset.sig = signature;
    group.innerHTML = '';

    extra.forEach((tabEl, offset) => {
      const index = offset + 1;
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.tabIndex = String(index);
      btn.setAttribute('data-sve-settings-tab', '');
      btn.textContent = tabEl.textContent.trim();
      btn.addEventListener('click', () => {
        const selected = nativeTabButtons(win.document)[index]?.getAttribute('aria-selected') === 'true';

        clickNativeTab(win, selected ? 0 : index);
      });
      group.appendChild(btn);
    });
  }

  const panelOpen = !sveState.lpCollapsed;
  const inSection =
    sveState.soloUid != null ||
    !!doc.querySelector(
      `[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`
    );

  group.querySelectorAll('[data-tab-index]').forEach((btn) => {
    const selected =
      !inSection &&
      nativeTabs[Number(btn.dataset.tabIndex)]?.getAttribute('aria-selected') === 'true';

    btn.setAttribute('aria-pressed', panelOpen && selected ? 'true' : 'false');
  });

  return group;
}

export function nativePublishTabList(doc) {
  const editor = doc.querySelector('.live-preview-editor');

  if (!editor) {
    return null;
  }

  const skip = (list) =>
    list.closest('.replicator-fieldtype, .bard-fieldtype, .grid-fieldtype, .grid-table') ||
    list.closest('#__sve-chrome-host, #__sve-global-section-host');

  return (
    [...editor.querySelectorAll('.live-preview-fields [role="tablist"]')].find((list) => !skip(list)) ||
    [...editor.querySelectorAll('[role="tablist"]')].find((list) => !skip(list)) ||
    null
  );
}

/**
 * The publish tabs actually on the entry form — including when solo hides them.
 *
 * reka-ui renders a hidden measurement copy of the tab list, so we take the
 * first real tablist in the editor and skip fieldtype-internal tabs.
 */
export function nativeTabButtons(doc) {
  const list = nativePublishTabList(doc);

  if (!list) {
    return [];
  }

  return [...list.querySelectorAll('button[role="tab"]')];
}

export function hideNativePublishTabList(doc) {
  const list = nativePublishTabList(doc);

  if (list && list.style.display !== 'none') {
    list.style.display = 'none';
  }
}

/**
 * Press the index'th publish tab, and nothing else.
 *
 * reka-ui's tabs switch on the full pointer sequence, not a bare .click(), and
 * they want real PointerEvents. Returns whether there was a tab to press.
 */
export function fireTabClick(win, index) {
  const el = nativeTabButtons(win.document)[index];

  if (!el) {
    return false;
  }

  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
    el.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
  });

  return true;
}

/** Switch the editor panel to a publish tab by clicking its real tab button. */
export function clickNativeTab(win, index) {
  const notePress = () => {
    settingsTabPressedAt = Date.now();
    settingsTabTries = 0;
  };

  const fire = () => {
    const tabs = nativeTabButtons(win.document);

    if (tabs[index]?.getAttribute('aria-selected') === 'true') {
      notePress();
      ensureSettingsTabs(win);

      return;
    }

    if (!fireTabClick(win, index)) {
      return;
    }

    notePress();
    setTimeout(() => ensureSettingsTabs(win), 60); // re-highlight the new selection
  };

  // At bede om SEO mens man står inde i en overskrift er også at bede om at komme
  // ud af den: felterne hører til siden, ikke til blokken. Og solo-visningen
  // skjuler fanelisten, så der ville ikke være nogen fane at ramme.
  const leavingSolo = sveState.soloUid !== null;
  let asked = false;

  // Ask for the destination tab while isolation is still on. Dropping solo
  // first painted the sections list (or an empty Main tab) for a frame, and
  // the delayed click then hit Page Settings a second time — a visible jank.
  if (leavingSolo && index > 0) {
    asked = fireTabClick(win, index);
    notePress();
  }

  if (leavingSolo) {
    leaveSolo(win.document, win);
    applySectionsFieldVisibility(win);
  }

  // Asking for a tab means asking to see it — so an open panel is implied. On
  // Hide the panel is closed and its tabs aren't even rendered yet, so switch to
  // Show first and let them mount before clicking. Leaving the mode on Hide while
  // showing a tab would just be a contradiction.
  if (lpMode(win) === 'hide' || sveState.lpCollapsed) {
    setLpMode(win, 'show');
    setTimeout(fire, 140);
  } else if (asked) {
    setTimeout(() => ensureSettingsTabs(win), 60);
  } else {
    fire();
  }
}

/** Show the control for the active tab, hide the rest, light up the active icon. */
/** Hide Statamic's "Live Preview" header label — it names the obvious. */
export function hideLpLabel(doc) {
  const header = lpHeader(doc);

  if (!header) {
    return;
  }

  const label = [...header.querySelectorAll('*')].find(
    (el) => !el.firstElementChild && /^(live preview|forhåndsvisning)$/i.test((el.textContent || '').trim())
  );

  if (label && label.style.display !== 'none') {
    label.style.display = 'none';
  }
}

/** After the overlay has painted: fetch the other sections' templates one by one. */
export function scheduleHtmlTreePrefetch(win) {
  if (sveState.htmlTreePrefetchScheduled) {
    return;
  }

  sveState.htmlTreePrefetchScheduled = true;

  const arm = () => {
    sveState.htmlTreePrefetchArmed = true;
    armHtmlTreePrefetch(win);
  };

  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(arm, { timeout: 2500 });
  } else {
    win.setTimeout(arm, 400);
  }
}

export function applyHeaderTab(win) {
  const doc = win.document;

  warmLivePreviewCore(win);

  if (!sveState.dockRestorePaused) {
    scheduleHtmlTreePrefetch(win);
  }
  loadHeaderTab(win);
  hideLpLabel(doc);
  ensureCodeDockToolbarButton(win);
  ensureSiteCssToolbarButton(win);
  ensureCommentsToolbarButton(win);
  ensurePageEditsToolbarButton(win);
  ensureAiToolbarButton(win);
  ensureAiTextToolbarButton(win);
  ensureSchemaToolbarButton(win);
  ensureOutlineToolbarButton(win);
  ensureHtmlTreeToolbarButton(win);

  // The standalone panel glyph and the old Hide/Auto/Show group are gone.
  const glyph = doc.getElementById(LP_TOGGLE_ID);

  if (glyph) {
    glyph.style.display = 'none';
  }

  doc.getElementById(LP_MODE_ID)?.remove();

  // The sections icon in the toolbar replaces the old "Sektioner" text button.
  const lib = doc.getElementById(LIBRARY_BUTTON_ID);

  if (lib) {
    lib.style.display = 'none';
  }

  // Publish-fanerne er ikke med her: de er flyttet ned i panelets bundlinje, ved
  // siden af breddevælgeren — se ensureLpWidthPicker.
  const controls = {
    pages: doc.getElementById(COLLECTION_PICKER_ID)?.parentElement,
    globals: doc.getElementById(GLOBALS_PICKER_ID)?.parentElement,
  };

  const headerBg = lpHeaderBg(win) || 'rgba(0,0,0,.35)';

  // A control whose tool is off stays hidden whatever the active tab is — its
  // icon is gone, so there would be no way back out of it.
  Object.entries(controls).forEach(([key, el]) => {
    if (el) {
      el.style.display = sveState.headerTab === key && headerTabAvailable(win, key) ? 'inline-flex' : 'none';
    }
  });

  // MERGED frames (Pages / Globals): one group surface for icon + controls.
  // Icon itself stays transparent so it doesn’t stack a second pill on top.
  FRAMED_TABS.forEach((key) => {
    const frame = doc.getElementById(frameId(key));
    const seam = doc.getElementById(seamId(key));
    const expanded = sveState.headerTab === key && headerTabAvailable(win, key);

    if (frame) {
      // Kun toolbar-gap mellem items — ingen ekstra margin når feltet er foldet ud.
      frame.style.margin = '0';

      if (MERGED_TABS.includes(key)) {
        frame.style.background = 'transparent';
        frame.style.height = '';
        frame.style.padding = '0';
        frame.style.gap = '6px';
      }

      // Låsen sidder på feltet, ikke på glyffen inde i det. Sider og Globals bærer
      // deres flade på rammen, så da kun glyffen blev dæmpet, stod de to tilbage
      // som oplyste piller ved siden af et sektionsikon der var gået helt ud:
      // halvdelen af rækken så ud til stadig at kunne klikkes. Værktøjet er feltet,
      // så det er feltet der går ud.
      const locked = isSectionLibraryLocked(win) && FOCUS_LOCKED_TABS?.includes(key);

      frame.style.opacity = locked ? LP_ICON_LOCKED_OPACITY : '';
      frame.style.pointerEvents = locked ? 'none' : '';
    }

    if (seam) {
      seam.style.display = 'none';
    }
  });

  // Det man trykker på, det der er valgt, og hver søm har topbarens farve. Sat her
  // og ikke der hvor de bygges, så et CP-temaskift rammer dem alle samtidig.
  // New-page bruger flat primary (ikke inset) — spring den over.
  doc.querySelectorAll('[data-sve-inset],[data-sve-seam]').forEach((el) => {
    if (el.id === NEW_ENTRY_ID) {
      return;
    }

    el.style.backgroundColor = headerBg;
  });

  const newEntry = doc.getElementById(NEW_ENTRY_ID);

  if (newEntry) {
    newEntry.style.background = LP_PRIMARY_FLAT;
    newEntry.style.color = '#fff';
    newEntry.style.border = 'none';
    newEntry.style.boxShadow = 'none';
    newEntry.style.opacity = '1';
  }

  // Each control sits directly after the icon it belongs to, so it reads as
  // connected to it. Guarded — moving a node on every call would trip the
  // observer that re-runs this into a loop.
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (bar && bar.dataset.sveChrome !== 'group-1') {
    bar.dataset.sveChrome = 'group-1';
    bar.style.cssText = `${HEADER_GROUP_STYLE}gap:4px;margin-right:${LP_TOOLBAR_GAP}px;`;
  }

  if (bar) {
    bar.style.setProperty(
      '--sve-toolbar-ring',
      `color-mix(in srgb, rgb(128 128 128) 16%, ${headerBg})`
    );
  }

  const sectionsBtn = bar?.querySelector('button[data-tab="sections"]');

  if (sectionsBtn) {
    const show = headerTabAvailable(win, 'sections');

    sectionsBtn.style.display = show ? 'inline-flex' : 'none';

    if (!show && sveState.headerTab === 'sections') {
      setHeaderTab(win, null);
      closeSectionPicker(win);
    }
  }

  const iconOf = (tab) => bar?.querySelector(`button[data-tab="${tab}"]`);
  const place = (anchor, el) => {
    if (anchor && el && anchor.nextElementSibling !== el) {
      anchor.after(el);
    }
  };

  // I de sammensatte felter sættes kontrollen efter sømmen, ikke efter ikonet —
  // ellers ville den lande foran stregen der skiller dem.
  const anchorFor = (key) => doc.getElementById(seamId(key)) || iconOf(key);

  place(anchorFor('pages'), controls.pages);
  place(anchorFor('globals'), controls.globals);

  // A tab whose "open" state is a panel on screen is lit by that panel, not by
  // the remembered tab. The tab outlives the panel — it is stored, so it survives
  // a reload, and a closed panel under a lit icon is the icon telling a lie about
  // what is in front of you.
  const docked = {
    sections: !!doc.getElementById(SECTION_PICKER_ID),
    listview: !!listViewPanel(doc),
    outline: !!doc.getElementById(OUTLINE_PANEL_ID),
    html_tree: !!doc.getElementById(HTML_TREE_PANEL_ID),
    performance: !!doc.getElementById(PERF_PANEL_ID),
    comments: !!commentsPanel(doc),
    ai: isAiPanelOpen(doc),
  };

  // Only the icon buttons — the control groups now live inside the toolbar too,
  // and a bare querySelectorAll('button') would reach in and wipe the highlight
  // off Hide/Auto/Show and the tabs. `[data-tab]` er nok til at skelne, og
  // panelikonet ligger et niveau nede i sin egen ramme.
  syncToolbarIcons(doc);

  const sidebarOpen = sveState.lpCollapsed === false;

  bar?.querySelectorAll('button[data-tab]').forEach((btn) => {
    const tab = btn.dataset.tab;
    const on =
      tab === 'settings'
        ? sidebarOpen
        : tab === 'code'
          ? isCodeDockArmed(win)
          : tab === 'site_css'
            ? isSiteCssOpen(win.document)
          : tab === 'edits'
            ? !!pageEditsOpen()
          : tab === 'aitext'
            ? !!isAiTextOn(win)
          : tab === 'schema'
            ? !!isSchemaOpen(win.document)
          : tab === 'globals'
            ? sveState.headerTab === 'globals' || !!isGlobalsOverlayOpen(win)
          : tab in docked
            ? docked[tab]
            : tab === sveState.headerTab;

    if (btn.style.width !== '28px') {
      btn.style.width = '28px';
      btn.style.height = `${LP_CONTROL_H}px`;
      btn.style.borderRadius = '.375rem';
      btn.style.padding = '0';
    }

    paintLpActiveControl(btn, on);
    paintFocusLockedTabs(win, btn, tab, on);
  });

  syncToolbarIconSeps(bar);
  alignHeaderToolbarWithSidebar(win);
}

/**
 * Line the left top-bar icons up with the sidebar content (H tile, section rows,
 * tabs). Measure the content’s left edge and set header padding — more reliable
 * than shifting only the toolbar, which drifted when the mode group expanded.
 */
/** Whether this opening of the editor has already been sent into a section. */
export let firstSectionOpened = false;

/**
 * The page-sections field's own wrapper in the editor panel.
 *
 * Found by walking up from any section to the last element before
 * `.publish-fields` — that container holds every field on the tab, so its child
 * is the outermost thing that is still only this field. Measured rather than
 * guessed at a class name: `replicator-fieldtype` is on the nested replicators
 * too, and hiding one of those would take a section's own blocks with it.
 */
export function sectionsFieldWrapper(doc) {
  const editor = doc.querySelector('.live-preview-editor');
  const set = editor?.querySelector(SELECTORS.replicatorSet);

  if (!set) {
    return null;
  }

  let node = set;

  while (node.parentElement && !node.parentElement.classList?.contains('publish-fields')) {
    node = node.parentElement;

    if (node === editor) {
      return null; // no publish-fields on the way up — not the shape we expect
    }
  }

  return node.parentElement ? node : null;
}

/**
 * Takes the list of every section out of the sidebar.
 *
 * Only while nothing is open: a section's fields render inside this same
 * wrapper, so hiding it whenever the flag is on would hide the section you are
 * editing along with the list of the ones you are not.
 */
export function applySectionsFieldVisibility(win) {
  const doc = win.document;
  const wrapper = sectionsFieldWrapper(doc);

  if (!wrapper) {
    return;
  }

  const hide =
    featureOn(win, 'open_first_section')
    && focusPanelOn(win)
    && !doc.querySelector(`[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`);

  wrapper.style.display = hide ? 'none' : '';
}

/**
 * Opens the entry in its first section rather than on the list of all of them.
 *
 * Off unless the site asks for it (Addons → Visual Editor). Where the work
 * begins is a matter of how a team uses the editor: a page of three sections is
 * quicker from the list, a page of twenty is not.
 *
 * Once per opening, and never over a choice already made — a click that arrives
 * before this runs is the editor's answer to where you want to be, and it wins.
 */
export function openFirstSectionOnce(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');

  // The editor is gone, so this is between openings: arm it for the next one.
  if (!editor) {
    firstSectionOpened = false;

    return;
  }

  if (firstSectionOpened || !featureOn(win, 'open_first_section') || !focusPanelOn(win)) {
    return;
  }

  // Something is already soloed — a click got here first, and it says more about
  // where the author wants to be than a default does.
  if (doc.querySelector(`[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`)) {
    firstSectionOpened = true;

    return;
  }

  const field = sectionField(win) || 'page_sections';

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(rows)) {
      continue;
    }

    // A page with no sections has nothing to open onto, and an empty panel is
    // worse than none — so it starts closed and the preview has the window to
    // itself until there is something to edit.
    if (!rows.length) {
      firstSectionOpened = true;
      setLpMode(win, 'show');

      return;
    }

    // The values arrive before the form that draws them. Soloing then hides a
    // list of sets that do not exist yet and leaves the panel blank — which is
    // exactly what it did. This runs again on every pass of the header loop, so
    // declining now costs a frame and nothing else.
    if (!editor.querySelector(SELECTORS.replicatorSet)) {
      return;
    }

    const uid = blockRowUid(rows[0]) || rows[0]?._visual_id || rows[0]?.id || rows[0]?._id || '';

    if (!uid) {
      return;
    }

    firstSectionOpened = true;
    focusFromPreview(uid, doc, win);

    return;
  }
}

/** When the panel was last moved off the sections tab — see openSettingsTab. */
export let settingsTabPressedAt = 0;

/** Presses in a row that didn't take. Cleared the moment one does. */
export let settingsTabTries = 0;

/**
 * With nothing open in the panel, keeps it off the sections tab.
 *
 * The first publish tab holds the page sections, and those are edited on the page
 * itself — where the site opens straight into its first section, the list is even
 * taken out of the panel, which is what leaves the tab empty. So with nothing
 * selected in the preview, that tab is a blank column where the page's own
 * settings should be. Moving on one tab is what stops the panel from being empty.
 *
 * Not once per opening but on every pass of the header loop: "nothing is
 * selected" is a state the editor returns to — closing a section, stepping out of
 * the header, arriving on another page — and the panel should be useful every
 * time it does, not only the first.
 */
export function openSettingsTab(win) {
  const doc = win.document;

  if (!doc.querySelector('.live-preview-editor')) {
    settingsTabTries = 0;

    return;
  }

  // The one thing that counts as "something is selected": a section or a block
  // isolated in the panel. Its fields are on the first tab, so this must never
  // pull the panel off it while one is open.
  //
  // Nothing else is asked about. An earlier version also stood down for the
  // header, the footer and the globals panel, and that was simply wrong: the
  // globals panel is built and parked off screen the moment Live Preview opens,
  // so its element is always in the document and the rule never ran once.
  if (sveState.soloUid !== null || doc.querySelector(`[${SOLO_KEEP_ATTR}], [${SOLO_PARENT_ATTR}]`)) {
    settingsTabTries = 0; // closing this again is a fresh question, not a retry

    return;
  }

  const tabs = nativeTabButtons(doc);

  // The form hasn't drawn its tabs yet, or the blueprint has only the one and
  // there is nowhere to move on to.
  if (tabs.length < 2) {
    return;
  }

  // Off the sections tab already — which is the whole point, so there is nothing
  // to do and nothing to keep counting.
  if (tabs[0].getAttribute('aria-selected') !== 'true') {
    settingsTabTries = 0;

    return;
  }

  // This runs on every pass of the header loop, so a press that doesn't take
  // would have us pressing again on every mutation. Slowed to one attempt per
  // half second, and given up on after three: if the tab won't move, something
  // else is holding it and a click every half second forever is worse than
  // leaving it where it is.
  const now = Date.now();

  if (settingsTabTries >= 3 || now - settingsTabPressedAt < 500) {
    return;
  }

  settingsTabPressedAt = now;
  settingsTabTries += 1;

  fireTabClick(win, 1);
  setTimeout(() => ensureSettingsTabs(win), 60); // light the tab we just moved to
}

/**
 * Hand the field column back to the page, and let it land somewhere real.
 *
 * Stepping out of a header, a footer or a global section leaves the page's own
 * form with nothing isolated — and where the site opens straight into its first
 * section, the list of all of them is hidden while nothing is, so what is left is
 * a blank column. Arming the flag again is the whole fix: the next pass of the
 * header loop treats leaving exactly like an opening, which means the first
 * section, or a closed panel on a page that has none.
 *
 * Deliberately not a focus call of its own. Leaving and opening are the same
 * question — "where does the editor start?" — and answering it twice is how the
 * two drift apart.
 */
export function rearmFirstSection() {
  firstSectionOpened = false;
}


/**
 * Writes the starting values a template declared for a block, where the block
 * has none.
 *
 * `controls="tag:h2|font_size:text-600"` says what this *place* on the page
 * starts a block on. The toolbar has always drawn itself from that; the side
 * panel could not, because it renders the Statamic form and the form has never
 * seen the template. So the value is made real instead of pretended: written
 * once, and from then on it is simply the block's value, which is why all three
 * — form, toolbar and page — agree about it afterwards.
 *
 * Only ever into an empty field. A block that already says something keeps
 * saying it; nothing that exists is replaced. That is also what makes this safe
 * to run on every click rather than only on the first.
 *
 * It marks the entry dirty, which is honest: the block now holds a value it did
 * not hold before, and it should be saved.
 */
export function applyDeclaredDefaults(data, doc) {
  const declared = Array.isArray(data.controlDefaults) ? data.controlDefaults : [];
  const uid = data.scope || data.uid;

  if (!declared.length || !uid) {
    return;
  }

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const row = rows[index];

    if (!row) {
      return;
    }

    const blank = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);
    const missing = declared.filter((c) => blank(row[c.handle]));

    if (!missing.length) {
      return;
    }

    const next = JSON.parse(JSON.stringify(rows));

    // The declaration is text — `controls="uppercase:true"` cannot say what type
    // it means. A toggle wants a real boolean, and would store the string
    // "false" as a truthy value, which is the one wrong answer that looks right.
    const typed = (v) => (v === 'true' ? true : v === 'false' ? false : v);

    missing.forEach((c) => {
      next[index][c.handle] = typed(c.default);
    });

    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Luften fra vinduets kant ind til topbarens første/sidste kontrol.
 *
 * Samme 12px som sidebares indhold (`padding-inline` på højre dock og på
 * Page Settings/SEO-fanerne), så ikonerne står på linje med det der er
 * under dem — ikke Statamics gamle 1.75rem/1rem til "Live Preview"-etiketten.
 */
export const LP_TOOLBAR_LEFT = '12px';
export const LP_TOOLBAR_EDGE = '12px';

export function alignHeaderToolbarWithSidebar(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (!header || !bar || !editor) {
    return;
  }

  if (LP_TOOLBAR_LEFT !== null) {
    if (header.style.paddingLeft !== LP_TOOLBAR_EDGE) {
      header.style.paddingLeft = LP_TOOLBAR_EDGE;
    }

    if (header.style.paddingRight !== LP_TOOLBAR_EDGE) {
      header.style.paddingRight = LP_TOOLBAR_EDGE;
    }

    return;
  }

  // Panel off-screen (Hide) — don’t chase a bogus left edge.
  const editorRect = editor.getBoundingClientRect();

  if (editorRect.width < 40 || editorRect.left < -500) {
    return;
  }

  const candidates = [
    doc.querySelector('[data-sve-focus-tile]'),
    doc.querySelector('[data-tabs-track], [data-sve-section-track]'),
    editor.querySelector('.replicator-set'),
    editor.querySelector('[data-sve-solo-back], [data-sve-focus-head]'),
  ].filter((el) => el && el.getClientRects().length);

  let targetLeft = null;

  if (candidates.length) {
    targetLeft = Math.min(...candidates.map((el) => el.getBoundingClientRect().left));
  } else {
    const pad = parseFloat(win.getComputedStyle(editor).paddingLeft) || 0;

    targetLeft = editorRect.left + pad;
  }

  if (targetLeft == null) {
    return;
  }

  // Drop the old margin approach so we don’t double-offset.
  if (bar.style.marginLeft) {
    bar.style.marginLeft = '';
  }

  const barLeft = bar.getBoundingClientRect().left;
  const delta = targetLeft - barLeft;

  if (Math.abs(delta) < 0.5) {
    return;
  }

  const computed = parseFloat(win.getComputedStyle(header).paddingLeft) || 0;
  const current = header.style.paddingLeft ? parseFloat(header.style.paddingLeft) || 0 : computed;
  const next = Math.max(0, Math.round(current + delta));

  if (Math.abs(next - current) >= 0.5) {
    header.style.paddingLeft = `${next}px`;
  }
}
