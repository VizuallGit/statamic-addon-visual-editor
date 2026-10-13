/**
 * Overflow menu to the right of Close: Live Preview defaults + reset, in three
 * tabs (sidebars, HTML tree, top bar icons). Right-click or Shift-click on the
 * button opens the short list instead: the presets, one click to switch.
 * Does not import the kernel.
 */
import { t } from './lib/i18n.js';
import { sveState } from './cp-state.js';
import { LP_BACK_MENU_ID, LP_ICON_BTN_STYLE, applyHeaderTab, ensureRightTool, resetEditorLayout } from './cp.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { persistVisibleRightPanes, placeRightDock, relayoutRightDock } from './right-dock.js';
import { closeAiPanel } from './ai-panel-lazy.js';
import { closeCodeDock, isCodeDockArmed, setCodeDockArmed, syncCodeDock, templateDockAllowed } from './code-dock-lazy.js';
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
import { openHtmlTreePanel } from './lazy/html-tree.js';
import { readHtmlTreeLook, setHtmlTreeLook } from './cp/html-tree/store.js';
import { familyColorRows, resetFamilyColors, setFamilyColor } from './family-colors.js';
import {
  openToolbarTool,
  readPaneChoices,
  readPickedPreset,
  readToolbarOrder,
  readUserPresets,
  setHiddenTools,
  setToolbarOrder,
  setToolbarToolShown,
  showAllToolbarTools,
  syncToolbarLayout,
  toolbarTools,
  writePaneChoices,
  writePickedPreset,
  writeUserPresets,
} from './toolbar-visibility.js';
import { PRESET_NAME_MAX, activePreset, cleanPreset, newPresetId, presetHidden, presetPanes } from './lib/toolbar-presets.js';

export const LP_MORE_ID = '__sve-lp-more';
export const LP_MORE_MENU_ID = '__sve-lp-more-menu';
export const LP_PRESET_MENU_ID = '__sve-lp-preset-menu';

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

const CHECK_ICON_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

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

/** The sidebar panes this user has, in the order the Sidebars tab lists them. */
function sidebarPanes(win) {
  return SIDEBAR_TOOLS.filter(([id]) => featureOn(win, id === 'ai' ? 'ai_panel' : id));
}

/**
 * What the Sidebars tab shows — read each time the tab opens, as a preset
 * picked on the Top bar tab may have changed both the pins and which preset
 * is on. Per preset: the panes it opens (null = it leaves the sidebar alone).
 */
function sidebarState(win) {
  const panes = sidebarPanes(win);
  const keys = panes.map(([id]) => id);
  const choices = readPaneChoices(win);
  const presets = allPresets(win);

  return {
    tools: panes.map(([id, labelKey]) => ({ id, label: t(win, labelKey), on: paneOn(win, id) })),
    presets: presets.map(({ id, label }) => ({ id, label })),
    presetId: activePresetId(win) || 'all',
    presetPanes: Object.fromEntries(presets.filter((preset) => preset.id !== 'all').map((preset) => [preset.id, presetPanes(preset, choices, keys)])),
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
    tools: toolbarTools(win),
    presets: allPresets(win),
    dock: isCodeDockArmed(win),
    ordered: readToolbarOrder(win).length > 0,
    picked: readPickedPreset(win),
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
    orderResetLabel: t(win, 'lp_settings_toolbar_order_reset'),
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
    dockAllowed: templateDockAllowed(win),
  };
}

/** The preset that is on now — the one the Top bar tab marks; '' when none is. */
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
  const keys = sidebarPanes(win).map(([id]) => id);
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
 * the way it says (All leaves both). The icons and which preset is picked
 * change at once; the panes and the dock wait their turn.
 */
function applyPreset(win, id) {
  const preset = allPresets(win).find((item) => item.id === id);

  if (!preset) {
    return switches;
  }

  writePickedPreset(win, preset.id);
  setHiddenTools(win, presetHidden(preset, toolbarTools(win).map((tool) => tool.key)));

  return queueSwitch(async () => {
    const panes = presetPanes(preset, readPaneChoices(win), sidebarPanes(win).map(([key]) => key));

    if (panes) {
      await openPanes(win, panes);
    }

    if (preset.dock === null || !templateDockAllowed(win)) {
      return;
    }

    if (isCodeDockArmed(win) !== preset.dock) {
      setCodeDock(win, preset.dock);
    } else if (preset.dock && panes?.length) {
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
    panes: sidebarPanes(win).map(([key]) => key).filter((key) => paneOn(win, key)),
  }, { user: true });

  if (!preset) {
    return null;
  }

  writeUserPresets(win, [...own, preset]);

  return { ...preset, label: preset.name, own: true };
}

/**
 * Tick a pane on or off for a preset (All = the pins as they are, as before
 * presets had panes). The user's own choice for that preset; on the preset
 * that is on now, the sidebar follows at once. Answers whether it did.
 */
function setPresetPane(win, id, key, on) {
  if (id === 'all') {
    setStartupPane(win, key, on);

    return true;
  }

  const preset = allPresets(win).find((item) => item.id === id);

  if (!preset) {
    return false;
  }

  const keys = sidebarPanes(win).map(([pane]) => pane);
  const choices = readPaneChoices(win);
  const current = presetPanes(preset, choices, keys) || [];
  const next = keys.filter((pane) => (pane === key ? on : current.includes(pane)));

  writePaneChoices(win, { ...choices, [id]: next });

  if (activePresetId(win) !== id) {
    return false;
  }

  // The sidebar becomes the preset's, the way picking it would make it; a
  // pane that opened has closed the HTML tree, which comes back with the dock.
  void queueSwitch(async () => {
    await openPanes(win, next);

    if (on && isCodeDockArmed(win)) {
      openHtmlTreePanel(win);
    }
  });

  return true;
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
      tool: (key, on) => setStartupPane(win, key, on),
      sidebarState: () => sidebarState(win),
      presetPane: (id, key, on) => setPresetPane(win, id, key, on),
      codeDock: (on) => setCodeDock(win, on),
      htmlTree: (on) => setHtmlTreeLook(win, on ? 'tags' : 'classic'),
      familyColor: (family, hex) => setFamilyColor(win, family, hex),
      familyReset: () => resetFamilyColors(win),
      dockOn: () => isCodeDockArmed(win),
      toolbarState: () => toolbarState(win),
      toolbarShown: (key, shown) => setToolbarToolShown(win, key, shown),
      toolbarShowAll: () => showAllToolbarTools(win),
      toolbarOrder: (keys) => setToolbarOrder(win, keys),
      toolbarOrderReset: () => setToolbarOrder(win, []),
      toolbarPreset: (id) => {
        void applyPreset(win, id);
      },
      toolbarPresetSave: (name) => saveOwnPreset(win, name),
      toolbarPresetDelete: (id) => {
        const choices = readPaneChoices(win);

        delete choices[id];
        writeUserPresets(win, readUserPresets(win).filter((item) => item.id !== id));
        writePaneChoices(win, choices);

        if (readPickedPreset(win) === id) {
          writePickedPreset(win, '');
        }
      },
      // The menu goes first: the tool opens where the menu was.
      toolbarOpen: (key) => {
        dismissLpMoreMenu();
        openToolbarTool(win, key);
      },
    },
    onReset: () => {
      const own = readUserPresets(win);
      const choices = readPaneChoices(win);

      dismissLpMoreMenu();
      resetEditorLayout(win);
      // The reset clears every layout key, the icons and their order with them.
      // A user's own presets, and the panes they chose for each preset, are not
      // layout: they are put back.
      writeUserPresets(win, own);
      writePaneChoices(win, choices);
      syncToolbarLayout(win);
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
    'font:500 .8125rem/1.2 ui-sans-serif,system-ui,sans-serif;';
  head.textContent = t(win, 'lp_settings_presets');
  head.style.cssText =
    'padding:.375rem .75rem .25rem;font-size:.6875rem;font-weight:600;letter-spacing:.04em;' +
    'text-transform:uppercase;color:rgba(255,255,255,.5);';
  menu.appendChild(head);

  allPresets(win).forEach((preset) => {
    const btn = doc.createElement('button');
    const mark = doc.createElement('span');
    const text = doc.createElement('span');
    const isOn = preset.id === on;

    btn.type = 'button';
    btn.setAttribute('role', 'menuitemradio');
    btn.setAttribute('aria-checked', isOn ? 'true' : 'false');
    btn.setAttribute('data-sve-preset-switch', preset.id);
    btn.style.cssText =
      'all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:.5rem;' +
      'padding:.5625rem .75rem;border-radius:.4375rem;white-space:nowrap;color:rgba(255,255,255,.88);';
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'display:inline-flex;width:.875rem;flex-shrink:0;';
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

  // Last in the row: Close, then Reload, then this. Anchored on whichever of
  // the two is actually there, so the order holds if reload is ever absent.
  //
  const anchor = doc.getElementById(LP_RELOAD_ID) || back;

  if (pill.parentElement !== anchor.parentElement || pill.previousElementSibling !== anchor) {
    anchor.after(pill);
  }
}
