/**
 * Overflow menu to the right of Close: Live Preview defaults + reset, in three
 * tabs (sidebars, HTML tree, top bar icons). Does not import the kernel.
 */
import { t } from './lib/i18n.js';
import { sveState } from './cp-state.js';
import { LP_BACK_MENU_ID, LP_ICON_BTN_STYLE, applyHeaderTab, ensureRightTool, resetEditorLayout } from './cp.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { persistVisibleRightPanes, placeRightDock, relayoutRightDock } from './right-dock.js';
import { closeAiPanel } from './ai-panel-lazy.js';
import { closeCodeDock, isCodeDockArmed, setCodeDockArmed, syncCodeDock } from './code-dock-lazy.js';
import { bindMenuDismiss, dropMenu } from './lp-menu-dismiss.js';
import { mountSurface } from './cp/mount.js';
import LpSettingsMenu from './cp/surfaces/LpSettingsMenu.vue';
import { HEADER_SURFACE, LP_BACK_ID, LP_CHROME_H, LP_RELOAD_ID, LP_SIDE_DEFAULT_REM, LP_SIDE_MAX_REM, LP_SIDE_MIN_REM } from './lib/ids.js';
import { lpHeader } from './lib/live-preview.js';
import { remToPx } from './lib/dom.js';
import { featureOn } from './lib/config.js';
import { persistDockedPanel, setLpMode } from './lp-panel.js';
import { applyLpEditorWidth } from './focus-panel.js';
import { closeSectionPicker, syncPreviewInset } from './section-library.js';
import { closeCommentsPanel, closeListViewPanel } from './lazy/listview.js';
import { closeOutlinePanel } from './lazy/outline.js';
import { readHtmlTreeLook, setHtmlTreeLook } from './cp/html-tree/store.js';
import { familyColorRows, resetFamilyColors, setFamilyColor } from './family-colors.js';
import { openToolbarTool, setToolbarToolShown, showAllToolbarTools, syncHiddenToolbarIcons, toolbarTools } from './toolbar-visibility.js';

export const LP_MORE_ID = '__sve-lp-more';
export const LP_MORE_MENU_ID = '__sve-lp-more-menu';

const PIN_KEY = 'sve-right-dock-pinned';
const OPEN_PANES_KEY = 'sve-right-dock-open-panes';
const DOCK_WIDTH_KEY = 'sve-right-dock-width';
const SIDEBAR_TOOLS = [
  ['listview', 'listview'],
  ['outline', 'outline'],
  ['comments', 'comments_pane'],
  ['sections', 'sections'],
  ['ai', 'ai_panel'],
];

const LP_MORE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  '<circle cx="12" cy="5" r="1.85"></circle>' +
  '<circle cx="12" cy="12" r="1.85"></circle>' +
  '<circle cx="12" cy="19" r="1.85"></circle>' +
  '</svg>';

let menuApp = null;
let menuHost = null;
let awayHandler = null;
// The tab the menu opens on: the one it was left on, for this page load.
let lastTab = 'sidebars';

function parseJson(win, key, fallback) {
  try {
    const raw = JSON.parse(chromeGet(win, key) || 'null');

    return raw == null ? fallback : raw;
  } catch {
    return fallback;
  }
}

function paneOn(win, key) {
  const pinned = parseJson(win, PIN_KEY, {});
  const open = parseJson(win, OPEN_PANES_KEY, []);

  return pinned[key] === true || (Array.isArray(open) && open.includes(key));
}

function clampWidth(win, px) {
  const min = remToPx(win, LP_SIDE_MIN_REM);
  const max = remToPx(win, LP_SIDE_MAX_REM);
  const n = Number(px);

  if (!Number.isFinite(n) || n <= 0) {
    return remToPx(win, LP_SIDE_DEFAULT_REM);
  }

  return Math.round(Math.min(max, Math.max(min, n)));
}

function closeTool(win, key) {
  if (key === 'listview') {
    closeListViewPanel(win);
  } else if (key === 'outline') {
    closeOutlinePanel(win);
  } else if (key === 'comments') {
    closeCommentsPanel(win);
  } else if (key === 'sections') {
    closeSectionPicker(win);
  } else if (key === 'ai') {
    closeAiPanel(win);
  }
}

function setStartupPane(win, key, on) {
  const pinned = { ...parseJson(win, PIN_KEY, {}) };
  let open = parseJson(win, OPEN_PANES_KEY, []);

  pinned[key] = !!on;
  chromeSet(win, PIN_KEY, JSON.stringify(pinned));

  if (!Array.isArray(open)) {
    open = [];
  }

  open = open.filter((item) => item !== key);

  if (on) {
    open.push(key);
  }

  chromeSet(win, OPEN_PANES_KEY, JSON.stringify(open));

  if (key === 'outline') {
    chromeSet(win, 'sve-listview-tab', on ? 'outline' : 'tree');
  }

  if (on) {
    ensureRightTool(win, key);
  } else {
    closeTool(win, key);
  }

  persistVisibleRightPanes(win, open);
  persistDockedPanel(win);
  syncPreviewInset(win);
}

function setPanelMode(win, mode) {
  setLpMode(win, mode);
}

function setWidth(win, which, px) {
  const next = clampWidth(win, px);

  if (which === 'editor') {
    applyLpEditorWidth(win, next);
  } else {
    chromeSet(win, DOCK_WIDTH_KEY, String(next));
    placeRightDock(win);
    relayoutRightDock(win);
    syncPreviewInset(win);
  }
}

function setCodeDock(win, on) {
  setCodeDockArmed(win, on);

  if (on) {
    syncCodeDock(win, win.document, sveState.soloUid);
  } else {
    closeCodeDock(win.document);
  }

  applyHeaderTab(win);
}

function sidebarsProps(win) {
  const tools = SIDEBAR_TOOLS.filter(([id]) => {
    const key = id === 'ai' ? 'ai_panel' : id;

    return featureOn(win, key);
  }).map(([id, labelKey]) => ({
    id,
    label: t(win, labelKey),
    on: paneOn(win, id),
  }));

  return {
    panelLabel: t(win, 'panel'),
    modes: [
      { id: 'hide', label: t(win, 'lp_mode_hide') },
      { id: 'auto', label: t(win, 'lp_mode_auto') },
      { id: 'show', label: t(win, 'lp_mode_show') },
    ],
    panelMode: ['show', 'auto'].includes(chromeGet(win, 'sve-lp-panel-mode'))
      ? chromeGet(win, 'sve-lp-panel-mode')
      : 'hide',
    editorWidth: clampWidth(win, chromeGet(win, 'statamic.live-preview.editor-width')),
    sidebarLabel: t(win, 'lp_settings_sidebar'),
    tools,
    dockWidth: clampWidth(win, chromeGet(win, DOCK_WIDTH_KEY)),
    widthLabel: t(win, 'lp_settings_width'),
    widthMin: remToPx(win, LP_SIDE_MIN_REM),
    widthMax: remToPx(win, LP_SIDE_MAX_REM),
  };
}

function treeProps(win) {
  return {
    codeDock: {
      show: featureOn(win, 'template_dock'),
      on: isCodeDockArmed(win),
      label: t(win, 'lp_settings_code_dock'),
    },
    // The tree's face is a preference, not a feature: the panel reads it on
    // every paint, and the store flips it live while the panel is open.
    htmlTree: {
      show: featureOn(win, 'html_tree'),
      on: readHtmlTreeLook(win) === 'tags',
      label: t(win, 'lp_settings_html_tree_tags'),
    },
    // One picker per family; the tree and the HTML pane both follow.
    familyColors: {
      show: featureOn(win, 'html_tree') || featureOn(win, 'template_dock'),
      label: t(win, 'lp_settings_colors'),
      resetLabel: t(win, 'lp_settings_colors_reset'),
      rows: familyColorRows(win, (family) => t(win, `fam_${family}`)),
    },
  };
}

function toolbarProps(win) {
  return {
    label: t(win, 'lp_settings_toolbar'),
    hint: t(win, 'lp_settings_toolbar_hint'),
    emptyLabel: t(win, 'lp_settings_toolbar_empty'),
    openLabel: t(win, 'lp_settings_toolbar_open'),
    closeLabel: t(win, 'lp_settings_toolbar_close'),
    showAllLabel: t(win, 'lp_settings_toolbar_all'),
    tools: toolbarTools(win),
  };
}

function settingsProps(win, rect) {
  const tree = treeProps(win);
  const hasTree = tree.codeDock.show || tree.htmlTree.show || tree.familyColors.show;

  return {
    top: Math.round(rect.bottom + 8),
    right: Math.round(win.innerWidth - rect.right),
    title: t(win, 'lp_settings_title'),
    tabs: [
      { id: 'sidebars', label: t(win, 'lp_settings_tab_sidebars') },
      hasTree ? { id: 'tree', label: t(win, 'lp_settings_tab_tree') } : null,
      { id: 'toolbar', label: t(win, 'lp_settings_tab_toolbar') },
    ].filter(Boolean),
    tab: lastTab,
    sidebars: sidebarsProps(win),
    tree,
    toolbar: toolbarProps(win),
    resetLabel: t(win, 'reset_lp_settings'),
    resetTitle: t(win, 'reset_lp_settings_title'),
  };
}

export function dismissLpMoreMenu() {
  awayHandler?.();
  awayHandler = null;
  menuApp?.unmount();
  menuApp = null;
  menuHost?.remove();
  menuHost = null;
}

function bindSettingHandlers(win) {
  return {
    onTab: (id) => {
      lastTab = id;
    },
    on: {
      mode: (mode) => setPanelMode(win, mode),
      width: (which, px) => setWidth(win, which, px),
      tool: (key, on) => setStartupPane(win, key, on),
      codeDock: (on) => setCodeDock(win, on),
      htmlTree: (on) => setHtmlTreeLook(win, on ? 'tags' : 'classic'),
      familyColor: (family, hex) => setFamilyColor(win, family, hex),
      familyReset: () => resetFamilyColors(win),
      toolbarShown: (key, shown) => setToolbarToolShown(win, key, shown),
      toolbarShowAll: () => showAllToolbarTools(win),
      // The menu goes first: the tool opens where the menu was.
      toolbarOpen: (key) => {
        dismissLpMoreMenu();
        openToolbarTool(win, key);
      },
    },
    onReset: () => {
      dismissLpMoreMenu();
      resetEditorLayout(win);
      // The reset cleared the stored list with every other layout key.
      syncHiddenToolbarIcons(win);
    },
    onClose: dismissLpMoreMenu,
  };
}

function openMoreMenu(win, pill) {
  const doc = win.document;

  dropMenu(doc.getElementById(LP_BACK_MENU_ID));
  dismissLpMoreMenu();

  const rect = pill.getBoundingClientRect();
  const host = doc.createElement('div');

  host.id = `${LP_MORE_MENU_ID}-host`;
  doc.body.appendChild(host);

  menuHost = host;
  menuApp = mountSurface(LpSettingsMenu, host, {
    ...settingsProps(win, rect),
    ...bindSettingHandlers(win),
  });

  awayHandler = bindMenuDismiss(
    win,
    (target) => host.contains(target) || pill.contains(target),
    dismissLpMoreMenu
  );

  win.requestAnimationFrame(() => host.querySelector('.sve-lp-settings')?.focus());
}

export function ensureLpMoreButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const back = doc.getElementById(LP_BACK_ID);

  if (!header || !back) {
    return;
  }

  let pill = doc.getElementById(LP_MORE_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_MORE_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;
    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (doc.getElementById(LP_MORE_MENU_ID) || menuHost) {
        dismissLpMoreMenu();

        return;
      }

      openMoreMenu(win, pill);
    });
  }

  if (pill.innerHTML !== LP_MORE_ICON_SVG) {
    pill.innerHTML = LP_MORE_ICON_SVG;
  }

  pill.title = t(win, 'more_lp_title');
  pill.setAttribute('aria-label', pill.title);
  pill.style.opacity = '1';
  pill.style.background = HEADER_SURFACE;
  pill.style.padding = '0';
  pill.style.width = `${LP_CHROME_H - 4}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  // Last in the row: Close, then Reload, then this. Anchored on whichever of
  // the two is actually there, so the order holds if reload is ever absent.
  //
  const anchor = doc.getElementById(LP_RELOAD_ID) || back;

  if (pill.parentElement !== anchor.parentElement || pill.previousElementSibling !== anchor) {
    anchor.after(pill);
  }
}
