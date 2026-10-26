/**
 * Overflow menu to the right of Close: the presets on top (a click switches),
 * then Live Preview defaults + reset in four tabs (sidebars, HTML tree, top
 * bar icons, keyboard shortcuts) — Sidebars and Top bar for the preset that
 * is on; Shortcuts for this user, whatever the preset. Right-click or
 * Shift-click on the button opens the short list instead: the presets, one
 * click to switch. Does not import the kernel.
 */
import { t } from './lib/i18n.js';
import { sveState } from './cp-state.js';
import { currentSelection } from './lib/selection.js';
import { LP_BACK_MENU_ID, LP_ICON_BTN_STYLE, applyHeaderTab, ensureRightTool, resetEditorLayout } from './cp.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { persistVisibleRightPanes, placeRightDock, relayoutRightDock } from './right-dock.js';
import { closeAiPanel } from './ai-panel-lazy.js';
import { closeCodeDock, isCodeDockArmed, setCodeDockArmed, syncCodeDock, templateDockAllowed } from './code-dock-lazy.js';
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
import { featureOn } from './lib/config.js';
import { persistDockedPanel, setLpMode } from './lp-panel.js';
import { applyLpEditorWidth } from './lp-width.js';
import { closeSectionPicker, syncPreviewInset } from './section-library.js';
import { closeCommentsPanel, closeListViewPanel } from './lazy/listview.js';
import { closeOutlinePanel } from './lazy/outline.js';
import { closePerformancePanel } from './lazy/performance.js';
import { closeThemePanel } from './theme-panel-lazy.js';
import { openHtmlTreePanel } from './lazy/html-tree.js';
import { readHtmlTreeLook, setHtmlTreeLook } from './cp/html-tree/store.js';
import { familyColorRows, resetFamilyColors, setFamilyColor } from './family-colors.js';
import {
  deleteToolbarGroup,
  moveToolbarGroup,
  moveToolbarTool,
  moveToolbarToolToNewGroup,
  openToolbarTool,
  readPaneChoices,
  readPickedPreset,
  readUserPresets,
  renameToolbarGroup,
  resetToolbarGroups,
  setHiddenTools,
  setToolbarToolShown,
  showAllToolbarTools,
  syncToolbarLayout,
  toolbarGrouped,
  toolbarGroups,
  toolbarTools,
  writePaneChoices,
  writePickedPreset,
  writeUserPresets,
} from './toolbar-visibility.js';
import { PRESET_NAME_MAX, SIDEBAR_TOOLS, activePreset, cleanPreset, newPresetId, presetHidden, presetPanes, presetSidebar } from './lib/toolbar-presets.js';
import { GROUP_NAME_MAX } from './lib/toolbar-groups.js';
import { breakpoints } from './breakpoints.js';
import { isMac } from './lib/shortcuts.js';
import { resetUserShortcuts, setUserShortcut, shortcutLayers } from './toolbar-shortcuts.js';

export const LP_MORE_ID = '__sve-lp-more';
export const LP_MORE_MENU_ID = '__sve-lp-more-menu';
export const LP_PRESET_MENU_ID = '__sve-lp-preset-menu';

const PIN_KEY = 'sve-right-dock-pinned';
const OPEN_PANES_KEY = 'sve-right-dock-open-panes';
const DOCK_WIDTH_KEY = 'sve-right-dock-width';

const LP_MORE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  '<circle cx="12" cy="5" r="1.85"></circle>' +
  '<circle cx="12" cy="12" r="1.85"></circle>' +
  '<circle cx="12" cy="19" r="1.85"></circle>' +
  '</svg>';

const CHECK_ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true" style="width:.625rem;height:.625rem;display:block"><path d="M20 6 9 17l-5-5"/></svg>';

// The short list's box in front of each preset: grey edge, or the CP's blue
// with a tick on the one that is on.
const PRESET_BOX = 'display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;' +
  'width:.875rem;height:.875rem;box-sizing:border-box;border-radius:.25rem;';
const PRESET_BOX_OFF = `${PRESET_BOX}border:1px solid rgba(255,255,255,.3);`;
const PRESET_BOX_ON = `${PRESET_BOX}border:1px solid var(--theme-color-primary,#4f46e5);` +
  'background:var(--theme-color-primary,#4f46e5);color:#fff;';

let menuApp = null;
let menuHost = null;
let awayHandler = null;
let presetMenu = null;
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

function setCodeDock(win, on) {
  setCodeDockArmed(win, on);

  if (on) {
    syncCodeDock(win, win.document, currentSelection()?.uid ?? null);
  } else {
    closeCodeDock(win.document);
  }

  applyHeaderTab(win);
}

/**
 * The sidebar tools this user has, in the order the Sidebars tab lists them:
 * those with an icon in the top bar — no icon, no access.
 */
function sidebarPanes(win) {
  const keys = toolbarTools(win).map((tool) => tool.key);

  return SIDEBAR_TOOLS.filter((key) => keys.includes(key));
}

/**
 * What the Sidebars tab shows for the preset that is on (`id`; anything else
 * is All) — read each time the tab opens. A preset lists its own sidebar
 * tools, ticked where it opens them; `keep` = it leaves the sidebar alone
 * until one is ticked. All lists every sidebar tool, ticked where it is
 * pinned or open now: the pins as before presets had panes.
 */
function sidebarState(win, id) {
  const tools = toolbarTools(win);
  const label = (key) => tools.find((tool) => tool.key === key)?.label || key;
  const available = sidebarPanes(win);
  const preset = id === 'all' ? null : allPresets(win).find((item) => item.id === id);

  if (!preset) {
    return { id: 'all', label: '', tools: available.map((key) => ({ id: key, label: label(key), on: paneOn(win, key) })), keep: false, tree: '' };
  }

  const panes = presetPanes(preset, readPaneChoices(win), available);

  return {
    id: preset.id,
    label: preset.label,
    tools: presetSidebar(preset, available).map((key) => ({ id: key, label: label(key), on: (panes || []).includes(key) })),
    keep: panes === null,
    // No choice: the HTML tree comes with the HTML dock.
    tree: preset.dock === true && templateDockAllowed(win) && featureOn(win, 'html_tree') ? t(win, 'html_tree') : '',
  };
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
    // ":name" is filled with the preset's name.
    presetHint: t(win, 'lp_settings_sidebar_preset_hint'),
    allHint: t(win, 'lp_settings_sidebar_all_hint'),
    keepHint: t(win, 'lp_settings_sidebar_keep_hint'),
    emptyHint: t(win, 'lp_settings_sidebar_empty'),
    treeHint: t(win, 'lp_settings_sidebar_tree_hint'),
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
    codeDock: {
      show: featureOn(win, 'template_dock'),
      on: isCodeDockArmed(win),
      label: t(win, 'lp_settings_code_dock'),
    },
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

/** The site's two presets (Settings → Top bar presets), named in the CP user's language. */
function sitePresets(win) {
  const list = win.Statamic?.$config?.get?.('sveToolbarPresets');

  return (Array.isArray(list) ? list : [])
    .map((raw) => cleanPreset(raw))
    .filter(Boolean)
    .map((preset) => ({ ...preset, label: t(win, `toolbar_preset_${preset.id}`), own: false }));
}

function allPresets(win) {
  return [
    // All: every icon, the dock left as it is — the bar nobody has changed,
    // so it is the one on until someone does.
    { id: 'all', tools: toolbarTools(win).map((tool) => tool.key), dock: null, panes: null, label: t(win, 'toolbar_preset_all'), own: false },
    ...sitePresets(win),
    ...readUserPresets(win).map((preset) => ({ ...preset, label: preset.name, own: true })),
  ];
}

/** What the Top bar tab shows — read each time the tab opens, as a preset may have changed it. */
function toolbarState(win) {
  return {
    groups: toolbarGroups(win),
    grouped: toolbarGrouped(win),
  };
}

/** The presets row on top of the menu: every preset, and the one that is on now. */
function presetState(win) {
  return {
    presets: allPresets(win).map(({ id, label, own }) => ({ id, label, own })),
    activeId: activePresetId(win),
  };
}

function presetsProps(win) {
  return {
    presetsLabel: t(win, 'lp_settings_presets'),
    newPresetLabel: t(win, 'lp_settings_preset_new'),
    namePlaceholder: t(win, 'lp_settings_preset_name'),
    saveLabel: t(win, 'lp_settings_preset_save'),
    cancelLabel: t(win, 'lp_settings_preset_cancel'),
    deleteLabel: t(win, 'lp_settings_preset_delete'),
    editLabel: t(win, 'lp_settings_preset_edit'),
    // Only for a user who may edit the addon's settings.
    editUrl: win.Statamic?.$config?.get?.('sveToolbarPresetsUrl') || '',
    nameMax: PRESET_NAME_MAX,
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

/** The preset that is on now — the one the presets row marks; '' when none is. */
function activePresetId(win) {
  const tools = toolbarTools(win);
  const state = {
    available: tools.map((tool) => tool.key),
    shown: tools.filter((tool) => tool.shown).map((tool) => tool.key),
    dock: isCodeDockArmed(win),
    dockAllowed: templateDockAllowed(win),
  };

  return activePreset(allPresets(win), state, readPickedPreset(win))?.id || '';
}

/**
 * Pin exactly `want` of the sidebar panes this user has and close the rest,
 * the way ticking them on the Sidebars tab one by one would.
 */
function pinPanes(win, want) {
  const keys = sidebarPanes(win);
  const pinned = { ...parseJson(win, PIN_KEY, {}) };
  const open = parseJson(win, OPEN_PANES_KEY, []);

  keys.forEach((key) => {
    pinned[key] = want.includes(key);
  });
  chromeSet(win, PIN_KEY, JSON.stringify(pinned));
  chromeSet(win, OPEN_PANES_KEY, JSON.stringify([...(Array.isArray(open) ? open : []).filter((key) => !keys.includes(key)), ...want]));
  // A reload reads this before the pins: 'outline' would put Accessibility
  // where the block tree was asked for.
  chromeSet(win, 'sve-listview-tab', want.includes('outline') ? 'outline' : 'tree');
  keys.filter((key) => !want.includes(key)).forEach((key) => closeTool(win, key));
}

/**
 * Pin `panes`, close the other sidebar panes, and open these, one at a time.
 *
 * A pane that opens closes every pane that is not pinned, the HTML tree among
 * them; the tree opening with the dock closes every pane that is not pinned in
 * turn. So the panes are pinned first and survive the tree — and where the
 * dock is open already, the caller opens the tree again once they are in.
 */
async function openPanes(win, panes) {
  pinPanes(win, panes);

  for (const key of panes) {
    await ensureRightTool(win, key);
  }

  persistDockedPanel(win);
  syncPreviewInset(win);
}

// Switches run one at a time, in order, the last one asked for drawn last. A
// pane that is opening cannot be stopped half-way — its first load may take a
// second — so the next switch waits for it, then closes what it does not want.
let switches = Promise.resolve();

function queueSwitch(job) {
  switches = switches.then(job).catch((error) => console.error(error));

  return switches;
}

/**
 * Show what a preset shows, open its panes, then open or close the HTML dock
 * the way it says (All leaves both). Which preset is on, its icons and the
 * dock's switch change at once — the menu reads them; the panes and the dock
 * itself wait their turn.
 */
function applyPreset(win, id) {
  const preset = allPresets(win).find((item) => item.id === id);

  if (!preset) {
    return switches;
  }

  const dock = preset.dock !== null && templateDockAllowed(win) ? preset.dock : null;
  const dockMoves = dock !== null && isCodeDockArmed(win) !== dock;

  writePickedPreset(win, preset.id);
  setHiddenTools(win, presetHidden(preset, toolbarTools(win).map((tool) => tool.key)));

  if (dockMoves) {
    setCodeDockArmed(win, dock);
  }

  return queueSwitch(async () => {
    const panes = presetPanes(preset, readPaneChoices(win), sidebarPanes(win));

    if (panes) {
      await openPanes(win, panes);
    }

    if (dockMoves) {
      if (dock) {
        syncCodeDock(win, win.document, currentSelection()?.uid ?? null);
      } else {
        closeCodeDock(win.document);
      }

      applyHeaderTab(win);
    }

    // A pane that opened has closed the HTML tree; with the dock open it comes
    // back (a dock still loading opens it itself).
    if (dock && panes?.length) {
      openHtmlTreePanel(win);
    }
  });
}

/** The bar as it is now, with the panes pinned now, under a name of the user's. */
function saveOwnPreset(win, name) {
  const own = readUserPresets(win);
  const preset = cleanPreset({
    id: newPresetId(Date.now(), own.map((item) => item.id)),
    name,
    tools: toolbarTools(win).filter((tool) => tool.shown).map((tool) => tool.key),
    dock: isCodeDockArmed(win),
    panes: sidebarPanes(win).filter((key) => paneOn(win, key)),
  }, { user: true });

  if (!preset) {
    return null;
  }

  writeUserPresets(win, [...own, preset]);

  return { id: preset.id, label: preset.name, own: true };
}

/**
 * Tick a pane on or off on the Sidebars tab, which lists the preset that is
 * on: the user's own choice for it, and the sidebar follows at once — a pane
 * that opened has closed the HTML tree, which comes back with the dock. On
 * All, the pins themselves, as before presets had panes.
 */
function setPresetPane(win, id, key, on) {
  const preset = id === 'all' ? null : allPresets(win).find((item) => item.id === id);

  if (!preset) {
    setStartupPane(win, key, on);

    return;
  }

  const available = sidebarPanes(win);
  const choices = readPaneChoices(win);
  const current = presetPanes(preset, choices, available) || [];
  const next = presetSidebar(preset, available).filter((pane) => (pane === key ? on : current.includes(pane)));

  writePaneChoices(win, { ...choices, [id]: next });

  void queueSwitch(async () => {
    await openPanes(win, next);

    if (on && isCodeDockArmed(win)) {
      openHtmlTreePanel(win);
    }
  });
}

/** Delete a preset of the user's own, and the panes chosen for it. */
function deleteOwnPreset(win, id) {
  const choices = readPaneChoices(win);

  delete choices[id];
  writeUserPresets(win, readUserPresets(win).filter((item) => item.id !== id));
  writePaneChoices(win, choices);

  if (readPickedPreset(win) === id) {
    writePickedPreset(win, '');
  }
}

function settingsProps(win, rect) {
  const tree = treeProps(win);
  const hasTree = tree.codeDock.show || tree.codeDockHelp.show || tree.htmlTree.show || tree.familyColors.show;

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
    presets: presetsProps(win),
    sidebars: sidebarsProps(win),
    tree,
    toolbar: toolbarProps(win),
    shortcuts: shortcutsProps(win),
    resetLabel: t(win, 'reset_lp_settings'),
    resetTitle: t(win, 'reset_lp_settings_title'),
  };
}

function dropPresetMenu() {
  dropMenu(presetMenu);
  presetMenu = null;
}

/** Whatever ⋮ has open: the full menu, or the short list of presets. */
export function dismissLpMoreMenu() {
  dropPresetMenu();
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
      sidebarState: (id) => sidebarState(win, id),
      presetPane: (id, key, on) => setPresetPane(win, id, key, on),
      presetState: () => presetState(win),
      activePreset: () => activePresetId(win),
      presetSwitch: (id) => {
        void applyPreset(win, id);
      },
      presetSave: (name) => saveOwnPreset(win, name),
      presetDelete: (id) => deleteOwnPreset(win, id),
      codeDock: (on) => setCodeDock(win, on),
      codeDockHelp: (on) => setHelpDefault(win, on),
      codeDockHelpClick: (on) => setHelpOnClick(win, on),
      codeDockHelpPicker: (on) => setHelpOpensPicker(win, on),
      codeDockGhost: (on) => setGhostDefault(win, on),
      ghostCost: () => ghostCostLine(win),
      htmlTree: (on) => setHtmlTreeLook(win, on ? 'tags' : 'classic'),
      familyColor: (family, hex) => setFamilyColor(win, family, hex),
      familyReset: () => resetFamilyColors(win),
      dockOn: () => isCodeDockArmed(win),
      toolbarState: () => toolbarState(win),
      toolbarShown: (key, shown) => setToolbarToolShown(win, key, shown),
      toolbarShowAll: () => showAllToolbarTools(win),
      toolbarMove: (key, groupId, index) => moveToolbarTool(win, key, groupId, index),
      toolbarMoveToNewGroup: (key, groupIndex, name) => moveToolbarToolToNewGroup(win, key, groupIndex, name),
      toolbarGroupRename: (id, name) => renameToolbarGroup(win, id, name),
      toolbarGroupMove: (id, index) => moveToolbarGroup(win, id, index),
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
      const own = readUserPresets(win);
      const choices = readPaneChoices(win);

      dismissLpMoreMenu();
      resetEditorLayout(win);
      // The reset clears every layout key, the icons and their groups with them.
      // A user's own presets, and the panes they chose for each preset, are not
      // layout: they are put back.
      writeUserPresets(win, own);
      writePaneChoices(win, choices);
      syncToolbarLayout(win);
      // The reset took this user's own shortcuts with the rest of the layout;
      // said here, so the preview hears the site's apply again.
      resetUserShortcuts(win);
    },
    onClose: dismissLpMoreMenu,
  };
}

/**
 * The short list under ⋮ (right-click or Shift-click): the presets, the one
 * on now ticked, one click to switch. Everything else is on the full menu.
 */
function openPresetMenu(win, pill) {
  const doc = win.document;

  dropMenu(doc.getElementById(LP_BACK_MENU_ID));
  dismissLpMoreMenu();

  const rect = pill.getBoundingClientRect();
  const on = activePresetId(win);
  const menu = doc.createElement('div');
  const head = doc.createElement('div');

  menu.id = LP_PRESET_MENU_ID;
  menu.tabIndex = -1;
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', t(win, 'lp_settings_presets'));
  menu.style.cssText =
    `position:fixed;z-index:2147483001;top:${Math.round(rect.bottom + 8)}px;` +
    `right:${Math.round(win.innerWidth - rect.right)}px;min-width:11rem;width:max-content;` +
    'display:flex;flex-direction:column;padding:.3125rem;border-radius:.625rem;outline:none;' +
    'background:#343439;box-shadow:0 .75rem 2.5rem rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.12);' +
    'font:500 .75rem/1.2 ui-sans-serif,system-ui,sans-serif;';
  head.textContent = t(win, 'lp_settings_presets');
  head.style.cssText =
    'padding:.375rem .75rem .25rem;font-size:.6875rem;font-weight:600;letter-spacing:.04em;' +
    'text-transform:uppercase;color:rgba(255,255,255,.5);';
  menu.appendChild(head);

  allPresets(win).forEach((preset, index) => {
    const btn = doc.createElement('button');
    const mark = doc.createElement('span');
    const text = doc.createElement('span');
    const isOn = preset.id === on;

    btn.type = 'button';
    btn.setAttribute('role', 'menuitemradio');
    btn.setAttribute('aria-checked', isOn ? 'true' : 'false');
    btn.setAttribute('data-sve-preset-switch', preset.id);
    btn.style.cssText =
      'all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:.625rem;' +
      `padding:.5rem .75rem;border-radius:.4375rem;white-space:nowrap;color:${isOn ? '#fff' : 'rgba(255,255,255,.82)'};`;
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = isOn ? PRESET_BOX_ON : PRESET_BOX_OFF;
    mark.innerHTML = isOn ? CHECK_ICON_SVG : '';
    text.textContent = preset.label;
    btn.append(mark, text);
    btn.addEventListener('mouseenter', () => (btn.style.background = '#2c2c31'));
    btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      dropPresetMenu();
      void applyPreset(win, preset.id);
    });

    if (index > 0) {
      const line = doc.createElement('div');

      line.setAttribute('aria-hidden', 'true');
      line.style.cssText = 'height:1px;margin:.125rem .75rem;background:rgba(255,255,255,.1);';
      menu.appendChild(line);
    }

    menu.appendChild(btn);
  });

  doc.body.appendChild(menu);
  menu._sveUnbind = bindMenuDismiss(
    win,
    (target) => menu.contains(target) || pill.contains(target),
    dropPresetMenu
  );
  presetMenu = menu;
  menu.focus();
}

function togglePresetMenu(win, pill) {
  if (presetMenu) {
    dropPresetMenu();

    return;
  }

  openPresetMenu(win, pill);
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

      if (event.shiftKey) {
        togglePresetMenu(win, pill);

        return;
      }

      if (doc.getElementById(LP_MORE_MENU_ID) || menuHost) {
        dismissLpMoreMenu();

        return;
      }

      openMoreMenu(win, pill);
    });
    pill.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePresetMenu(win, pill);
    });
  }

  if (pill.innerHTML !== LP_MORE_ICON_SVG) {
    pill.innerHTML = LP_MORE_ICON_SVG;
  }

  const title = `${t(win, 'more_lp_title')}\n${t(win, 'more_lp_presets_hint')}`;

  if (pill.title !== title) {
    pill.title = title;
    pill.setAttribute('aria-label', t(win, 'more_lp_title'));
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
