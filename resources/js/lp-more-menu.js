/**
 * Overflow menu to the right of Close: Live Preview defaults + reset in four
 * tabs (sidebars, HTML tree, top bar icons, keyboard shortcuts). Sidebars,
 * Top bar and Shortcuts list what the mode Live Preview is in may have
 * (Content or Build — toolbar-visibility.js). Does not import the kernel.
 */
import { t } from './lib/i18n.js';
import { sveState } from './cp-state.js';
import { LP_BACK_MENU_ID, LP_ICON_BTN_STYLE, ensureRightTool, resetEditorLayout } from './cp.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { persistVisibleRightPanes, placeRightDock, relayoutRightDock } from './right-dock.js';
import { closeAiPanel } from './ai-panel-lazy.js';
import { helpDefaultOn, helpOnClick, helpOpensPicker, setHelpDefault, setHelpOnClick, setHelpOpensPicker } from './dock/help-state.js';
import { ghostAllowed, ghostDefaultOn, setGhostDefault } from './dock/ghost-state.js';
import { ghostCounts, takenRate } from './dock/ghost-memory.js';
import { bindMenuDismiss, dropMenu } from './lp-menu-dismiss.js';
import { mountSurface } from './cp/mount.js';
import LpSettingsMenu from './cp/surfaces/LpSettingsMenu.vue';
import {
  HEADER_SURFACE,
  HEADER_TOOLBAR_ID,
  LP_BACK_ID,
  LP_CHROME_H,
  LP_PREVIEW_CHROME_ID,
  LP_PUBLISH_ID,
  LP_RELOAD_ID,
  LP_SIDE_DEFAULT_REM,
  LP_SIDE_MAX_REM,
  LP_SIDE_MIN_REM,
} from './lib/ids.js';
import { lpHeader } from './lib/live-preview.js';
import { remToPx } from './lib/dom.js';
import { featureOn, featureSaidOn } from './lib/config.js';
import { persistDockedPanel, setLpMode } from './lp-panel.js';
import { applyLpEditorWidth } from './lp-width.js';
import { closeSectionPicker, syncPreviewInset } from './section-library.js';
import { closeCommentsPanel, closeListViewPanel } from './lazy/listview.js';
import { closeOutlinePanel } from './lazy/outline.js';
import { closePerformancePanel } from './lazy/performance.js';
import { closeThemePanel } from './theme-panel-lazy.js';
import { readHtmlTreeLook, setHtmlTreeLook } from './cp/html-tree/store.js';
import { familyColorRows, resetFamilyColors, setFamilyColor } from './family-colors.js';
import {
  deleteToolbarGroup,
  moveModeGroup,
  moveModeTool,
  moveModeToolToNewGroup,
  openToolbarTool,
  renameToolbarGroup,
  resetToolbarGroups,
  setToolbarToolShown,
  showAllToolbarTools,
  syncToolbarLayout,
  toolbarGrouped,
  toolbarGroups,
  toolbarMode,
  toolbarTools,
} from './toolbar-visibility.js';
import { GROUP_NAME_MAX } from './lib/toolbar-groups.js';
import { breakpoints } from './breakpoints.js';
import { isMac } from './lib/shortcuts.js';
import { resetUserShortcuts, setUserShortcut, shortcutLayers } from './toolbar-shortcuts.js';

export const LP_MORE_ID = '__sve-lp-more';
export const LP_MORE_MENU_ID = '__sve-lp-more-menu';

/** The top-bar tools that open in the right sidebar, in the order the Sidebars tab lists them. */
const SIDEBAR_TOOLS = ['listview', 'outline', 'comments', 'sections', 'ai', 'performance', 'theme'];

const PIN_KEY = 'sve-right-dock-pinned';
const OPEN_PANES_KEY = 'sve-right-dock-open-panes';
const DOCK_WIDTH_KEY = 'sve-right-dock-width';

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
  } else if (key === 'performance') {
    closePerformancePanel(win);
  } else if (key === 'theme') {
    // Another tool takes the sidebar: no question, unsaved values kept.
    closeThemePanel(win, { force: true });
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

/**
 * The sidebar tools this user has in this mode, in the order the Sidebars tab
 * lists them: those with an icon in the top bar — no icon, no access.
 */
function sidebarPanes(win) {
  const keys = toolbarTools(win).map((tool) => tool.key);

  return SIDEBAR_TOOLS.filter((key) => keys.includes(key));
}

/**
 * What the Sidebars tab lists — read each time the tab opens: every sidebar
 * tool of this mode, ticked where it is pinned or open now.
 */
function sidebarState(win) {
  const tools = toolbarTools(win);
  const label = (key) => tools.find((tool) => tool.key === key)?.label || key;

  return { tools: sidebarPanes(win).map((key) => ({ id: key, label: label(key), on: paneOn(win, key) })) };
}

function sidebarsProps(win) {
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
    hint: t(win, 'lp_settings_sidebar_hint'),
    emptyHint: t(win, 'lp_settings_sidebar_empty'),
    dockWidth: clampWidth(win, chromeGet(win, DOCK_WIDTH_KEY)),
    widthLabel: t(win, 'lp_settings_width'),
    widthMin: remToPx(win, LP_SIDE_MIN_REM),
    widthMax: remToPx(win, LP_SIDE_MAX_REM),
  };
}

/** This author's month with the dock's AI, or '' before it has shown anything. */
function ghostStatsLine(win) {
  const counts = ghostCounts(win);

  if (!counts.shown && !counts.edits) {
    return '';
  }

  return t(win, 'lp_settings_code_dock_ghost_stats', {
    taken: counts.taken,
    shown: counts.shown,
    rate: takenRate(counts),
    kept: counts.kept,
    edits: counts.edits,
  });
}

/** What the dock's AI has cost the site this month, or '' when nothing yet or not asked. */
function ghostCostLine(win) {
  return win
    .fetch('/!/sve/dock-ghost/usage', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
    .then((res) => (res.ok ? res.json() : null))
    .then((month) => {
      if (!month?.requests) {
        return '';
      }

      const cost = Number(month.cost) || 0;

      return t(win, 'lp_settings_code_dock_ghost_cost', {
        cost: cost < 1 ? cost.toFixed(3) : cost.toFixed(2),
        requests: month.requests,
      });
    })
    .catch(() => '');
}

function treeProps(win) {
  return {
    // Help in the HTML pane, on from the start or not. The user's default:
    // the pane's own switch changes one Live Preview and never writes this.
    codeDockHelp: {
      show: featureOn(win, 'template_dock'),
      on: helpDefaultOn(win),
      label: t(win, 'lp_settings_code_dock_help'),
      // How it behaves once on: the user's too, read by the help as it goes.
      click: { on: helpOnClick(win), label: t(win, 'lp_settings_code_dock_help_click') },
      picker: { on: helpOpensPicker(win), label: t(win, 'lp_settings_code_dock_help_picker') },
    },
    // Grey text (AI) in the HTML pane, on from the start or not — the same
    // kind of default as help's, shown only where the site has grey text.
    codeDockGhost: {
      show: featureOn(win, 'template_dock') && ghostAllowed(win),
      on: ghostDefaultOn(win),
      label: t(win, 'lp_settings_code_dock_ghost'),
      // Whether it helps, in numbers: this author's month, from their own
      // preferences. What it cost the site is asked when the tab is shown.
      stats: ghostStatsLine(win),
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

/** What the Top bar tab shows — read each time the tab opens. */
function toolbarState(win) {
  return {
    groups: toolbarGroups(win),
    grouped: toolbarGrouped(win),
  };
}

/**
 * The mode the Top bar tab is for, said only to someone who has Build — in
 * Content alone there is nothing to tell apart.
 */
function modeLabel(win) {
  if (!featureSaidOn(win, 'build_mode')) {
    return '';
  }

  const strings = win.Statamic?.$config?.get?.('sveBuildStrings') || {};
  const mode = toolbarMode();

  return strings[`mode_${mode}`] || { build: 'Vizuall Build', html: 'HTML Build' }[mode] || 'Content';
}

function toolbarProps(win) {
  return {
    label: t(win, 'lp_settings_toolbar'),
    modeLabel: modeLabel(win),
    hint: t(win, 'lp_settings_toolbar_hint'),
    // Where the site says what each mode may have — only for someone who may edit it.
    editUrl: win.Statamic?.$config?.get?.('sveToolbarModesUrl') || '',
    editLabel: t(win, 'lp_settings_toolbar_edit'),
    emptyLabel: t(win, 'lp_settings_toolbar_empty'),
    openLabel: t(win, 'lp_settings_toolbar_open'),
    closeLabel: t(win, 'lp_settings_toolbar_close'),
    showAllLabel: t(win, 'lp_settings_toolbar_all'),
    dragLabel: t(win, 'lp_settings_toolbar_drag'),
    groupsResetLabel: t(win, 'lp_settings_toolbar_groups_reset'),
    newGroupLabel: t(win, 'lp_settings_toolbar_group_new'),
    groupNamePlaceholder: t(win, 'lp_settings_toolbar_group_name'),
    // ":n" is filled with the group's number, ":name" with its name.
    groupUnnamedLabel: t(win, 'lp_settings_toolbar_group_unnamed'),
    groupMoveLabel: t(win, 'lp_settings_toolbar_group_move'),
    groupDeleteLabel: t(win, 'lp_settings_toolbar_group_delete'),
    groupDropHint: t(win, 'lp_settings_toolbar_group_drop'),
    nameMax: GROUP_NAME_MAX,
  };
}

/**
 * What the Shortcuts tab lists: Page settings and every icon in the bar,
 * hidden ones too, as the Top bar tab shows them; then the screen sizes,
 * each with its button's picture. Read off the bar and the size buttons, so a
 * tool this user has no icon for is not there.
 */
function shortcutsProps(win) {
  const doc = win.document;
  const settings = doc.querySelector(`#${HEADER_TOOLBAR_ID} button[data-tab="settings"]`);
  const sizeIcon = (device) =>
    doc.querySelector(`#${LP_PREVIEW_CHROME_ID} [data-sve-devices] > button[data-device="${device}"] svg`)?.outerHTML || '';

  return {
    toolbarLabel: t(win, 'lp_settings_shortcuts_toolbar'),
    sizesLabel: t(win, 'lp_settings_shortcuts_sizes'),
    hint: t(win, 'lp_settings_shortcuts_hint'),
    resetLabel: t(win, 'lp_settings_shortcuts_reset'),
    emptyLabel: t(win, 'lp_settings_toolbar_empty'),
    mac: isMac(win.navigator),
    tools: [
      settings ? { action: 'tool:settings', label: settings.title || t(win, 'panel'), icon: settings.querySelector('svg')?.outerHTML || '' } : null,
      ...toolbarTools(win).map((tool) => ({ action: `tool:${tool.key}`, label: tool.label, icon: tool.icon })),
    ].filter(Boolean),
    sizes: breakpoints(win).map((row) => ({ action: `size:${row.handle}`, label: row.label, icon: sizeIcon(row.device) })),
  };
}

function settingsProps(win, rect) {
  const tree = treeProps(win);
  const hasTree = tree.codeDockHelp.show || tree.htmlTree.show || tree.familyColors.show;

  return {
    top: Math.round(rect.bottom + 8),
    right: Math.round(win.innerWidth - rect.right),
    title: t(win, 'lp_settings_title'),
    tabs: [
      { id: 'sidebars', label: t(win, 'lp_settings_tab_sidebars') },
      hasTree ? { id: 'tree', label: t(win, 'lp_settings_tab_tree') } : null,
      { id: 'toolbar', label: t(win, 'lp_settings_tab_toolbar') },
      { id: 'shortcuts', label: t(win, 'lp_settings_tab_shortcuts') },
    ].filter(Boolean),
    tab: lastTab,
    sidebars: sidebarsProps(win),
    tree,
    toolbar: toolbarProps(win),
    shortcuts: shortcutsProps(win),
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
      sidebarState: () => sidebarState(win),
      pane: (key, on) => setStartupPane(win, key, on),
      codeDockHelp: (on) => setHelpDefault(win, on),
      codeDockHelpClick: (on) => setHelpOnClick(win, on),
      codeDockHelpPicker: (on) => setHelpOpensPicker(win, on),
      codeDockGhost: (on) => setGhostDefault(win, on),
      ghostCost: () => ghostCostLine(win),
      htmlTree: (on) => setHtmlTreeLook(win, on ? 'tags' : 'classic'),
      familyColor: (family, hex) => setFamilyColor(win, family, hex),
      familyReset: () => resetFamilyColors(win),
      toolbarState: () => toolbarState(win),
      toolbarShown: (key, shown) => setToolbarToolShown(win, key, shown),
      toolbarShowAll: () => showAllToolbarTools(win),
      // The tab counts places among what this mode has; these make them places among all.
      toolbarMove: (key, groupId, index) => moveModeTool(win, key, groupId, index),
      toolbarMoveToNewGroup: (key, groupIndex, name) => moveModeToolToNewGroup(win, key, groupIndex, name),
      toolbarGroupRename: (id, name) => renameToolbarGroup(win, id, name),
      toolbarGroupMove: (id, index) => moveModeGroup(win, id, index),
      toolbarGroupDelete: (id) => deleteToolbarGroup(win, id),
      toolbarGroupsReset: () => resetToolbarGroups(win),
      // The menu goes first: the tool opens where the menu was.
      toolbarOpen: (key) => {
        dismissLpMoreMenu();
        openToolbarTool(win, key);
      },
      // This user's own keyboard shortcuts — the layers read back after each write.
      shortcutLayers: () => shortcutLayers(win),
      shortcutSet: (action, value, moveFrom) => setUserShortcut(win, action, value, moveFrom),
      shortcutsReset: () => resetUserShortcuts(win),
    },
    onReset: () => {
      dismissLpMoreMenu();
      // Every layout key goes, the icons of both modes and their groups with them.
      resetEditorLayout(win);
      syncToolbarLayout(win);
      // The reset took this user's own shortcuts with the rest of the layout;
      // said here, so the preview hears the site's apply again.
      resetUserShortcuts(win);
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
    pill.setAttribute('aria-haspopup', 'menu');
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

  const title = t(win, 'more_lp_title');

  if (pill.title !== title) {
    pill.title = title;
    pill.setAttribute('aria-label', title);
  }
  pill.style.opacity = '1';
  pill.style.background = HEADER_SURFACE;
  pill.style.padding = '0';
  pill.style.width = `${LP_CHROME_H - 4}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  // Last in the row: Close, Reload, Publish static, then this — the same
  // anchor syncLpRightBarGaps uses. Anchoring on Reload while the gap-sync
  // anchored on Publish moved this pill twice per layout pass.
  const anchor = doc.getElementById(LP_PUBLISH_ID) || doc.getElementById(LP_RELOAD_ID) || back;

  if (pill.parentElement !== anchor.parentElement || pill.previousElementSibling !== anchor) {
    anchor.after(pill);
  }
}
