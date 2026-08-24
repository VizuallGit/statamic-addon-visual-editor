/**
 * Overflow menu to the right of Close: Live Preview defaults + reset.
 * Does not import the kernel.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import {
  HEADER_SURFACE,
  LP_BACK_ID,
  LP_BACK_MENU_ID,
  LP_CHROME_H,
  LP_ICON_BTN_STYLE,
  applyHeaderTab,
  ensureRightTool,
  resetEditorLayout,
} from './cp.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { persistVisibleRightPanes, placeRightDock, relayoutRightDock } from './right-dock.js';
import { closeAiPanel } from './ai-panel.js';
import { closeCodeDock, isCodeDockArmed, setCodeDockArmed, syncCodeDock } from './code-dock.js';
import { bindMenuDismiss, dropMenu } from './lp-menu-dismiss.js';
import { mountSurface } from './cp/mount.js';
import LpSettingsMenu from './cp/surfaces/LpSettingsMenu.vue';

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

function featureOn(win, key) {
  const features = win.Statamic?.$config?.get?.('sveFeatures') || {};

  if (key === 'ai_panel' || key === 'template_dock') {
    return features[key] === true;
  }

  return features[key] !== false;
}

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
  const min = sve.remToPx(win, sve.LP_SIDE_MIN_REM);
  const max = sve.remToPx(win, sve.LP_SIDE_MAX_REM);
  const n = Number(px);

  if (!Number.isFinite(n) || n <= 0) {
    return sve.remToPx(win, sve.LP_SIDE_DEFAULT_REM);
  }

  return Math.round(Math.min(max, Math.max(min, n)));
}

function closeTool(win, key) {
  if (key === 'listview') {
    sve.closeListViewPanel?.(win);
  } else if (key === 'outline') {
    sve.closeOutlinePanel?.(win);
  } else if (key === 'comments') {
    sve.closeCommentsPanel?.(win);
  } else if (key === 'sections') {
    sve.closeSectionPicker?.(win);
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
  sve.persistDockedPanel?.(win);
  sve.syncPreviewInset?.(win);
}

function setPanelMode(win, mode) {
  sve.setLpMode?.(win, mode);
}

function setWidth(win, which, px) {
  const next = clampWidth(win, px);

  if (which === 'editor') {
    sve.applyLpEditorWidth?.(win, next);
  } else {
    chromeSet(win, DOCK_WIDTH_KEY, String(next));
    placeRightDock(win);
    relayoutRightDock(win);
    sve.syncPreviewInset?.(win);
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

function settingsProps(win, rect) {
  const tools = SIDEBAR_TOOLS.filter(([id]) => {
    const key = id === 'ai' ? 'ai_panel' : id;

    return featureOn(win, key);
  }).map(([id, labelKey]) => ({
    id,
    label: t(win, labelKey),
    on: paneOn(win, id),
  }));

  return {
    top: Math.round(rect.bottom + 8),
    right: Math.round(win.innerWidth - rect.right),
    title: t(win, 'lp_settings_title'),
    panelLabel: t(win, 'panel'),
    sidebarLabel: t(win, 'lp_settings_sidebar'),
    widthLabel: t(win, 'lp_settings_width'),
    resetLabel: t(win, 'reset_lp_settings'),
    resetTitle: t(win, 'reset_lp_settings_title'),
    modes: [
      { id: 'hide', label: t(win, 'lp_mode_hide') },
      { id: 'auto', label: t(win, 'lp_mode_auto') },
      { id: 'show', label: t(win, 'lp_mode_show') },
    ],
    panelMode: ['show', 'auto'].includes(chromeGet(win, 'sve-lp-panel-mode'))
      ? chromeGet(win, 'sve-lp-panel-mode')
      : 'hide',
    editorWidth: clampWidth(win, chromeGet(win, 'statamic.live-preview.editor-width')),
    dockWidth: clampWidth(win, chromeGet(win, DOCK_WIDTH_KEY)),
    widthMin: sve.remToPx(win, sve.LP_SIDE_MIN_REM),
    widthMax: sve.remToPx(win, sve.LP_SIDE_MAX_REM),
    tools,
    codeDock: {
      show: featureOn(win, 'template_dock'),
      on: isCodeDockArmed(win),
      label: t(win, 'lp_settings_code_dock'),
    },
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
    onMode: (mode) => setPanelMode(win, mode),
    onWidth: (which, px) => setWidth(win, which, px),
    onTool: (key, on) => setStartupPane(win, key, on),
    onCodeDock: (on) => setCodeDock(win, on),
    onReset: () => {
      dismissLpMoreMenu();
      resetEditorLayout(win);
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
  const header = sve.lpHeader(doc);
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

  if (pill.parentElement !== back.parentElement || pill.previousElementSibling !== back) {
    back.after(pill);
  }
}

sve.ensureLpMoreButton = ensureLpMoreButton;
sve.dismissLpMoreMenu = dismissLpMoreMenu;
