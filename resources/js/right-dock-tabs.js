/**
 * One right sidebar for Live Preview.
 *
 * Tools stay as icons in the top bar. Clicking one loads its content into this
 * shell — same width, same Statamic drag-dots handle. Theme Settings is not
 * a pane here: it covers the left editor so the pin-stack stays for tools
 * like the block tree and comments.
 *
 * Pin (RIGHT_DOCK_PIN_STACK): a pin next to each panel's close keeps that
 * tool in the sidebar when you open another from the top bar. Several can
 * sit stacked, each foldable to its header so one library cannot eat the
 * column. A dotted grip reorders; a height grip sits between two open panes.
 * Unpin and they go back to one at a time. Set the flag to false and rebuild
 * to drop the experiment.
 *
 * Accordion snapshot (tools lived in the sidebar, not the top bar):
 * .restore/full-working-2026-08-27-1538/resources/js/right-dock-accordion.js
 */

import { chromeGet, chromeSet } from './chrome-prefs.js';
import { sve } from './cp-registry.js';
import RightDockShell from './cp/surfaces/RightDockShell.vue';
import { mountPane } from './cp/mount-pane.js';
import dockCss from '../css/right-dock.css?inline';

export const TOOL_PLACEMENT = {
  settings: 'topbar',
  pages: 'topbar',
  globals: 'topbar',
  listview: 'topbar',
  outline: 'topbar',
  html_tree: 'topbar',
  comments: 'topbar',
  sections: 'topbar',
  ai: 'topbar',
  code: 'topbar',
};

/** Right-dock tools that also keep an icon in the top bar. */
export const TOOLBAR_SHORTCUTS = [];

export const RIGHT_DOCK_ID = '__sve-right-dock';

const STYLE_ID = '__sve-right-dock-style';
const OPEN_KEY = 'sve-right-dock-open';
const WIDTH_KEY = 'sve-right-dock-width';
const OPEN_PANES_KEY = 'sve-right-dock-open-panes';
const FOLDED_KEY = 'sve-right-dock-folded';
const LEGACY_WIDTH_KEYS = ['sve-globals-panel-width', 'sve-listview-panel-width', 'sve-ai-panel-width'];

const MIN_WIDTH_REM = 16;
const MAX_WIDTH_REM = 50;
const DEFAULT_WIDTH_REM = 22;
const MIN_PANE = 76;

/**
 * Try: pin several top-bar tools in the right sidebar at once.
 * Set to `false` and run `npm run cp:build` to go back to one at a time.
 */
export const RIGHT_DOCK_PIN_STACK = true;

const CHROME = RIGHT_DOCK_PIN_STACK ? 'shell-pin-2' : 'shell-1';
const PIN_KEY = 'sve-right-dock-pinned';
const HEIGHTS_KEY = 'sve-right-dock-stack-heights';
const ORDER_KEY = 'sve-right-dock-stack-order';

const GRIP_6 =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
  + '<circle cx="9" cy="6" r="1.7"/><circle cx="15" cy="6" r="1.7"/>'
  + '<circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/>'
  + '<circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></svg>';

const PANE_BY_ID = {
  '__sve-listview-panel': 'listview',
  '__sve-outline-panel': 'outline',
  '__sve-html-tree-panel': 'html_tree',
  '__sve-comments-pane': 'comments',
  '__sve-section-picker': 'sections',
  '__sve-ai-panel': 'ai',
};

const PIN_OFF =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" '
  + 'stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1z"/></svg>';

const PIN_ON =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" '
  + 'stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1z"/></svg>';

const CLOSE_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" '
  + 'stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

const CHEVRON_ICON =
  '<svg data-sve-right-chevron viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" '
  + 'stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

export const RIGHT_PANE_TOOLS = ['listview', 'outline', 'html_tree', 'comments', 'sections', 'ai'];

/** Inner panel fill — the shell owns position, width, border and the grip. */
export const RIGHT_PANEL_FILL =
  'flex:1 1 auto;min-height:0;min-width:0;width:100%;display:flex;flex-direction:column;' +
  'overflow:hidden;position:relative;background:transparent;border:0;box-shadow:none;box-sizing:border-box;';

/** Same 2×4 dots as Statamic `.live-preview-resizer` (vendor `drag-dots.svg`). */
export const DRAG_DOTS_V =
  'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 7 17\'><g fill=\'%23a1a1aa\' fill-rule=\'evenodd\'><rect width=\'2\' height=\'2\' rx=\'1\'/><rect width=\'2\' height=\'2\' y=\'5\' rx=\'1\'/><rect width=\'2\' height=\'2\' y=\'10\' rx=\'1\'/><rect width=\'2\' height=\'2\' y=\'15\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'5\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'5\' y=\'5\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'5\' y=\'10\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'5\' y=\'15\' rx=\'1\'/></g></svg>")';

/** Horizontal twin (4×2) for ns-resize splitters. */
export const DRAG_DOTS_H =
  'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 17 7\'><g fill=\'%23a1a1aa\' fill-rule=\'evenodd\'><rect width=\'2\' height=\'2\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'5\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'10\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'15\' rx=\'1\'/><rect width=\'2\' height=\'2\' y=\'5\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'5\' y=\'5\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'10\' y=\'5\' rx=\'1\'/><rect width=\'2\' height=\'2\' x=\'15\' y=\'5\' rx=\'1\'/></g></svg>")';

/** Same 16px strip as Statamic `.live-preview-resizer`: grey fill + drag-dots. */
export function splitterFill(orientation) {
  const image = orientation === 'ns' ? DRAG_DOTS_H : DRAG_DOTS_V;
  const size = orientation === 'ns' ? '17px 7px' : '7px 17px';

  return (
    `background-color: var(--theme-color-gray-300, #d4d4d8);` +
    `background-image: ${image};` +
    `background-position: center;` +
    `background-repeat: no-repeat;` +
    `background-size: ${size};`
  );
}

export function splitterFillDark(selector) {
  return `
html.dark ${selector},
.dark ${selector} {
  background-color: var(--theme-color-gray-800, #27272a);
}
`;
}

const hooks = {};
let widthDragging = false;

export function isRightDockResizing() {
  return widthDragging;
}

export function toolPlacement(key) {
  return TOOL_PLACEMENT[key] || 'topbar';
}

export function isRightDockTool(key) {
  return toolPlacement(key) === 'right' && RIGHT_PANE_TOOLS.includes(key);
}

export function isToolbarShortcut(key) {
  return TOOLBAR_SHORTCUTS.includes(key);
}

export function registerRightDockHook(key, hook) {
  hooks[key] = hook || {};
}

function storedOpen(win) {
  const raw = chromeGet(win, OPEN_KEY);

  if (raw === '0') {
    return false;
  }

  if (raw === '1') {
    return true;
  }

  return false;
}

function storeOpen(win, open) {
  chromeSet(win, OPEN_KEY, open ? '1' : '0');
}

function remPx(win, rem) {
  const root = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;

  return Math.round(rem * root);
}

function clampDockWidth(win, px) {
  return Math.round(Math.min(remPx(win, MAX_WIDTH_REM), Math.max(remPx(win, MIN_WIDTH_REM), px)));
}

function readStoredPx(win, key) {
  const n = Number(chromeGet(win, key));

  if (Number.isFinite(n) && n > 0) {
    return clampDockWidth(win, n);
  }

  return 0;
}

function storedWidth(win) {
  return (
    readStoredPx(win, WIDTH_KEY) ||
    LEGACY_WIDTH_KEYS.reduce((found, key) => found || readStoredPx(win, key), 0) ||
    remPx(win, DEFAULT_WIDTH_REM)
  );
}

function storeWidth(win, px) {
  chromeSet(win, WIDTH_KEY, String(px));
}

export function rightDockWidth(win) {
  return storedWidth(win);
}

function t(win, key) {
  return win.Statamic?.$config?.get?.('sveStrings')?.[key] ?? key;
}

function paneKeyOf(el) {
  return el?.getAttribute?.('data-sve-right-pane') || PANE_BY_ID[el?.id] || '';
}

function storedPinned(win) {
  const out = {};

  try {
    const raw = JSON.parse(chromeGet(win, PIN_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      for (const key of Object.values(PANE_BY_ID)) {
        out[key] = raw[key] === true;
      }
    }
  } catch {
    /* ignore */
  }

  return out;
}

function storePinned(win, pinned) {
  chromeSet(win, PIN_KEY, JSON.stringify(pinned));
}

function storedFolded(win) {
  const out = {};

  try {
    const raw = JSON.parse(chromeGet(win, FOLDED_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      for (const key of Object.values(PANE_BY_ID)) {
        out[key] = raw[key] === true;
      }
    }
  } catch {
    /* ignore */
  }

  return out;
}

function storeFolded(win, folded) {
  chromeSet(win, FOLDED_KEY, JSON.stringify(folded));
}

function storedHeights(win) {
  try {
    const raw = JSON.parse(chromeGet(win, HEIGHTS_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      return raw;
    }
  } catch {
    /* ignore */
  }

  return {};
}

function storeHeights(win, heights) {
  chromeSet(win, HEIGHTS_KEY, JSON.stringify(heights));
}

function storedOrder(win) {
  try {
    const raw = JSON.parse(chromeGet(win, ORDER_KEY) || 'null');

    if (Array.isArray(raw)) {
      return raw.filter((key) => typeof key === 'string');
    }
  } catch {
    /* ignore */
  }

  return [];
}

function storeOrder(win, order) {
  chromeSet(win, ORDER_KEY, JSON.stringify(order));
}

function storedOpenPanes(win) {
  try {
    const raw = JSON.parse(chromeGet(win, OPEN_PANES_KEY) || 'null');

    if (Array.isArray(raw)) {
      return raw.filter((key) => typeof key === 'string' && Object.values(PANE_BY_ID).includes(key));
    }
  } catch {
    /* ignore */
  }

  return [];
}

export function visiblePaneKeys(win) {
  const slot = slotEl(dockEl(win.document));

  return [...(slot?.children || [])].filter(isVisibleChild).map(paneKeyOf).filter(Boolean);
}

export function persistVisibleRightPanes(win, keys = null) {
  const panes = keys || visiblePaneKeys(win);

  chromeSet(win, OPEN_PANES_KEY, JSON.stringify(panes));
}

/**
 * Panes to remount after a full reload: stack order, then pins, then last open.
 * Outline is its own right-dock pane (heading list), beside the block tree.
 */
export function rememberedRightPaneKeys(win) {
  const pinned = storedPinned(win);
  const open = storedOpenPanes(win);
  const want = new Set();

  for (const key of Object.keys(pinned)) {
    if (pinned[key]) {
      want.add(key);
    }
  }

  for (const key of open) {
    want.add(key);
  }

  const out = [];
  const seen = new Set();

  for (const key of [...storedOrder(win), ...open, ...want]) {
    if (!want.has(key) || seen.has(key)) {
      continue;
    }

    seen.add(key);
    out.push(key);
  }

  return out;
}

export function rememberedListViewTab(win) {
  const tab = chromeGet(win, 'sve-listview-tab');

  if (tab === 'outline' || storedOpenPanes(win).includes('outline')) {
    return 'outline';
  }

  return 'tree';
}

function persistStackOrder(win, slot) {
  const order = [...slot.children].filter(isVisibleChild).map(paneKeyOf).filter(Boolean);

  if (order.length) {
    storeOrder(win, order);
  }
}

function orderedKids(win, slot) {
  const kids = [...slot.children].filter(isVisibleChild);
  const order = storedOrder(win);

  if (!order.length) {
    return kids;
  }

  const rank = (el) => {
    const i = order.indexOf(paneKeyOf(el));

    return i < 0 ? order.length : i;
  };

  return [...kids].sort((a, b) => rank(a) - rank(b));
}

function isPinned(win, key) {
  return RIGHT_DOCK_PIN_STACK && !!key && storedPinned(win)[key] === true;
}

/** Panel ids that stay when another top-bar tool opens. Empty if the experiment is off. */
export function pinnedKeepIds(win) {
  if (!RIGHT_DOCK_PIN_STACK) {
    return [];
  }

  const pinned = storedPinned(win);

  return Object.entries(PANE_BY_ID)
    .filter(([, key]) => pinned[key])
    .map(([id]) => id);
}

function ensureStyle(doc) {
  let style = doc.getElementById(STYLE_ID);

  if (!style) {
    style = doc.createElement('style');
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }

  style.textContent = dockCss;
}

function dockEl(doc) {
  return doc.getElementById(RIGHT_DOCK_ID);
}

function dockParent(doc) {
  return doc.querySelector('.live-preview') || doc.body;
}

function attachDock(doc, dock) {
  const parent = dockParent(doc);

  if (dock.parentElement !== parent) {
    parent.appendChild(dock);
  }
}

function slotEl(dock) {
  return dock?.querySelector('[data-sve-right-slot]') || null;
}

function isVisibleChild(el) {
  return (
    !!el &&
    !el.hasAttribute('data-sve-right-split') &&
    !el.hidden &&
    !el.hasAttribute('data-sve-chrome-hidden') &&
    el.style.display !== 'none'
  );
}

export function isRightDockOpen(win) {
  const dock = dockEl(win.document);

  return !!dock && !dock.hasAttribute('data-sve-right-closed');
}

function notify(win) {
  win.dispatchEvent(
    new CustomEvent('sve-right-dock-change', {
      detail: { open: isRightDockOpen(win) },
    })
  );
}

function previewRightPad(doc, px) {
  const el = doc.querySelector('.live-preview-contents');

  if (!el) {
    return;
  }

  el.style.transition = 'none';
  el.style.paddingRight = px ? `${px}px` : '';
}

function beginOverlayDrag(win, cursor, onMove, onEnd) {
  const doc = win.document;
  const frames = [...doc.querySelectorAll('iframe')];

  frames.forEach((frame) => {
    frame.style.pointerEvents = 'none';
  });

  const shield = doc.createElement('div');
  shield.setAttribute('data-sve-right-drag-shield', '');
  shield.style.cssText =
    `position:fixed;inset:0;z-index:2147483646;cursor:${cursor};user-select:none;`;
  doc.body.appendChild(shield);

  let done = false;

  const move = (event) => {
    onMove(event);
  };

  const up = () => {
    if (done) {
      return;
    }

    done = true;
    doc.removeEventListener('mousemove', move);
    doc.removeEventListener('mouseup', up);
    win.removeEventListener('blur', up);
    frames.forEach((frame) => {
      frame.style.pointerEvents = '';
    });
    shield.remove();
    onEnd?.();
  };

  doc.addEventListener('mousemove', move);
  doc.addEventListener('mouseup', up);
  win.addEventListener('blur', up);
}

function bindWidth(win, dock) {
  if (dock._sveRightWidthBound) {
    return;
  }

  dock._sveRightWidthBound = true;

  const handle = dock.querySelector('[data-sve-right-resize]');

  handle?.addEventListener('mousedown', (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    const startX = event.clientX;
    const startW = dock.getBoundingClientRect().width;
    let next = startW;

    widthDragging = true;

    beginOverlayDrag(
      win,
      'ew-resize',
      (e) => {
        next = clampDockWidth(
          win,
          startW + (startX - e.clientX)
        );
        dock.style.width = `${next}px`;
        previewRightPad(win.document, next);
      },
      () => {
        widthDragging = false;
        storeWidth(win, next);
        placeRightDock(win);
        previewRightPad(win.document, next);
        win.dispatchEvent(new Event('resize'));
      }
    );
  });
}

function paintPinButton(win, btn, key) {
  const on = isPinned(win, key);

  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.title = t(win, on ? 'right_dock_unpin' : 'right_dock_pin');
  btn.innerHTML = on ? PIN_ON : PIN_OFF;
}

function paneHeader(panel) {
  return (
    panel.querySelector('[data-sve-lv-chrome]') ||
    panel.querySelector('[data-sve-pane-bar]') ||
    panel.querySelector('[data-sve-right-title]')?.parentElement ||
    panel.firstElementChild
  );
}

function ensurePinButton(win, panel) {
  if (!RIGHT_DOCK_PIN_STACK) {
    panel.querySelector('[data-sve-right-pin]')?.remove();

    return;
  }

  const key = paneKeyOf(panel);

  if (!key) {
    return;
  }

  const header = paneHeader(panel);
  let close = panel.querySelector('[data-sve-close]');

  if (!close && header) {
    close = win.document.createElement('button');
    close.type = 'button';
    close.setAttribute('data-sve-close', '');
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = CLOSE_ICON;
    header.appendChild(close);
  }

  if (!close) {
    return;
  }

  if (!close.querySelector('svg')) {
    close.innerHTML = CLOSE_ICON;
  }

  const home = close.closest('[data-sve-right-actions]') || header;
  let btn = home?.querySelector('[data-sve-right-pin]');

  if (!btn) {
    btn = win.document.createElement('button');
    btn.type = 'button';
    close.before(btn);
  }

  btn.setAttribute('data-sve-right-pin', key);
  paintPinButton(win, btn, key);
  ensureCloseButton(win, panel);
}

function closeDockPane(win, panel) {
  const key = paneKeyOf(panel);

  if (key === 'listview') {
    sve.closeListViewPanel?.(win);
  } else if (key === 'outline') {
    sve.closeOutlinePanel?.(win);
  } else if (key === 'html_tree') {
    sve.closeHtmlTreePanel?.(win);
  } else if (key === 'comments') {
    sve.closeCommentsPanel?.(win);
  } else if (key === 'sections') {
    sve.closeSectionPicker?.(win);
  } else {
    panel.remove();
    releaseRightShellIfEmpty(win);
  }
}

function ensureCloseButton(win, panel) {
  const header = paneHeader(panel);
  const pin = panel.querySelector('[data-sve-right-pin]');
  let close = panel.querySelector('[data-sve-close]');

  if (!close) {
    close = win.document.createElement('button');
    close.type = 'button';
    close.setAttribute('data-sve-close', '');
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = CLOSE_ICON;
    header?.appendChild(close);
  }

  if (!close.querySelector('svg')) {
    close.innerHTML = CLOSE_ICON;
  }

  if (pin) {
    pin.after(close);
  } else if (header && close.parentElement !== header) {
    header.appendChild(close);
  }

  if (!close._sveCloseBound) {
    close._sveCloseBound = true;
    close.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeDockPane(win, panel);
    });
  }
}

function ensureReorderGrip(win, panel, stacked) {
  const header = paneHeader(panel);

  if (!header) {
    return;
  }

  let grip = header.querySelector('[data-sve-right-reorder]');

  if (!stacked) {
    grip?.remove();

    return;
  }

  if (!grip) {
    grip = win.document.createElement('button');
    grip.type = 'button';
    grip.setAttribute('data-sve-right-reorder', '');
    grip.title = t(win, 'right_dock_reorder');
    grip.innerHTML = GRIP_6;
    header.insertBefore(grip, header.firstChild);
  } else if (header.firstElementChild !== grip) {
    header.insertBefore(grip, header.firstChild);
  }
}

function ensureFoldButton(win, panel, stacked) {
  const header = paneHeader(panel);

  if (!header) {
    return;
  }

  let btn = header.querySelector('[data-sve-right-fold]');

  if (!stacked) {
    btn?.remove();

    return;
  }

  if (!btn) {
    btn = win.document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-sve-right-fold', '');
    btn.innerHTML = CHEVRON_ICON;
    const grip = header.querySelector('[data-sve-right-reorder]');

    if (grip) {
      grip.after(btn);
    } else {
      header.insertBefore(btn, header.firstChild);
    }
  }

  const open = !panel.hasAttribute('data-sve-right-folded');

  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.title = t(win, open ? 'right_dock_fold' : 'right_dock_unfold');
}

function toggleFold(win, panel) {
  const key = paneKeyOf(panel);

  if (!key) {
    return;
  }

  const folded = storedFolded(win);

  folded[key] = !folded[key];
  storeFolded(win, folded);
  layoutStack(win, dockEl(win.document));
}

function layoutStack(win, dock) {
  const slot = slotEl(dock);

  if (!slot) {
    return;
  }

  const kids = orderedKids(win, slot);
  const current = [...slot.children].filter((el) => !el.hasAttribute('data-sve-right-split'));
  const orderSame = current.length === kids.length && kids.every((el, i) => current[i] === el);

  // Re-appending already-stacked panes reloads iframes. Skip that when the
  // order is already right — but still apply stack, grips and heights.
  slot.querySelectorAll('[data-sve-right-split]').forEach((el) => el.remove());

  if (!orderSame) {
    kids.forEach((el) => {
      if (el.hasAttribute('data-sve-right-keep') && el.parentElement === slot) {
        return;
      }

      slot.appendChild(el);
    });
  }

  const stacked = RIGHT_DOCK_PIN_STACK && kids.length > 1;

  if (stacked) {
    dock.setAttribute('data-sve-right-stack', '');
  } else {
    dock.removeAttribute('data-sve-right-stack');
  }

  kids.forEach((el) => {
    ensureReorderGrip(win, el, stacked);
    ensureFoldButton(win, el, stacked);
    ensurePinButton(win, el);
    ensureCloseButton(win, el);
  });

  if (!stacked) {
    kids.forEach((el) => {
      fillPanel(el);
      el.removeAttribute('data-sve-right-folded');
      el.style.flex = '';
      el.style.minHeight = '';
    });

    return;
  }

  const heights = storedHeights(win);
  const folded = storedFolded(win);

  kids.forEach((el) => {
    const key = paneKeyOf(el);

    fillPanel(el);

    if (key && folded[key]) {
      el.setAttribute('data-sve-right-folded', '');
      el.style.flex = '0 0 auto';
      el.style.minHeight = '0';
    } else {
      el.removeAttribute('data-sve-right-folded');
      const grow = key && Number.isFinite(heights[key]) ? heights[key] : 1;

      el.style.flex = `${Math.max(0.4, grow)} 1 0`;
      el.style.minHeight = `${MIN_PANE}px`;
    }

    ensureFoldButton(win, el, true);
  });

  for (let i = 0; i < kids.length - 1; i += 1) {
    const above = kids[i];
    const below = kids[i + 1];

    if (above.hasAttribute('data-sve-right-folded') || below.hasAttribute('data-sve-right-folded')) {
      continue;
    }

    const split = win.document.createElement('div');

    split.setAttribute('data-sve-right-split', '');
    split.setAttribute('data-sve-right-split-after', above.id);
    below.before(split);
  }
}

function beginStackReorder(win, dock, panel) {
  const slot = slotEl(dock);

  if (!panel || !slot || !isVisibleChild(panel)) {
    return;
  }

  panel.setAttribute('data-dragging', '');
  slot.querySelectorAll('[data-sve-right-split]').forEach((el) => el.remove());

  const frames = [...win.document.querySelectorAll('iframe')];

  frames.forEach((frame) => {
    frame.style.pointerEvents = 'none';
  });

  const move = (e) => {
    const hover = [...slot.children].filter(isVisibleChild).find((el) => {
      if (el === panel) {
        return false;
      }

      const r = el.getBoundingClientRect();

      return e.clientY >= r.top && e.clientY <= r.bottom;
    });

    if (!hover) {
      return;
    }

    const r = hover.getBoundingClientRect();

    if (e.clientY < r.top + r.height / 2) {
      slot.insertBefore(panel, hover);
    } else {
      slot.insertBefore(panel, hover.nextElementSibling);
    }
  };

  const up = () => {
    panel.removeAttribute('data-dragging');
    persistStackOrder(win, slot);
    layoutStack(win, dock);
    frames.forEach((frame) => {
      frame.style.pointerEvents = '';
    });
    win.document.removeEventListener('mousemove', move);
    win.document.removeEventListener('mouseup', up);
  };

  win.document.addEventListener('mousemove', move);
  win.document.addEventListener('mouseup', up);
}

function bindPinStack(win, dock) {
  if (!RIGHT_DOCK_PIN_STACK || dock._sveRightPinBound) {
    return;
  }

  dock._sveRightPinBound = true;

  dock.addEventListener('click', (event) => {
    const fold = event.target.closest('[data-sve-right-fold], [data-sve-right-title]');

    if (fold && dock.contains(fold) && dock.hasAttribute('data-sve-right-stack')) {
      event.preventDefault();
      event.stopPropagation();

      const pane = fold.closest('[data-sve-right-pane]');

      if (pane) {
        toggleFold(win, pane);
      }

      return;
    }

    const closeBtn = event.target.closest('[data-sve-close]');

    if (closeBtn && dock.contains(closeBtn)) {
      const pane = closeBtn.closest('[data-sve-right-pane]');

      if (pane && dock.contains(pane)) {
        event.stopPropagation();
      }

      return;
    }

    const pin = event.target.closest('[data-sve-right-pin]');

    if (!pin || !dock.contains(pin)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const key = pin.getAttribute('data-sve-right-pin');
    const pinned = storedPinned(win);

    pinned[key] = !pinned[key];
    storePinned(win, pinned);
    paintPinButton(win, pin, key);
  });

  dock.addEventListener('mousedown', (event) => {
    if (event.button !== 0) {
      return;
    }

    const grip = event.target.closest('[data-sve-right-reorder]');
    const panel = grip && dock.contains(grip) ? grip.closest('[data-sve-right-pane]') : null;

    if (panel) {
      event.preventDefault();
      event.stopPropagation();
      beginStackReorder(win, dock, panel);

      return;
    }

    const split = event.target.closest('[data-sve-right-split]');

    if (!split || !dock.contains(split) || event.button !== 0) {
      return;
    }

    event.preventDefault();

    const slot = slotEl(dock);
    const above = win.document.getElementById(split.getAttribute('data-sve-right-split-after'));
    const below = split.nextElementSibling;

    if (!slot || !isVisibleChild(above) || !isVisibleChild(below)) {
      return;
    }

    const startY = event.clientY;
    const aboveH = above.getBoundingClientRect().height;
    const belowH = below.getBoundingClientRect().height;
    const total = aboveH + belowH;
    const aboveKey = paneKeyOf(above);
    const belowKey = paneKeyOf(below);
    const frames = [...win.document.querySelectorAll('iframe')];

    frames.forEach((frame) => {
      frame.style.pointerEvents = 'none';
    });

    const move = (e) => {
      const dy = e.clientY - startY;
      let nextA = Math.max(MIN_PANE, Math.min(total - MIN_PANE, aboveH + dy));
      let nextB = total - nextA;

      if (total < MIN_PANE * 2) {
        nextA = aboveH;
        nextB = belowH;
      }

      above.style.flex = `${nextA} 1 0`;
      below.style.flex = `${nextB} 1 0`;

      if (aboveKey || belowKey) {
        const heights = storedHeights(win);

        if (aboveKey) {
          heights[aboveKey] = nextA;
        }

        if (belowKey) {
          heights[belowKey] = nextB;
        }

        storeHeights(win, heights);
      }
    };

    const up = () => {
      win.document.removeEventListener('mousemove', move);
      win.document.removeEventListener('mouseup', up);
      frames.forEach((frame) => {
        frame.style.pointerEvents = '';
      });
    };

    win.document.addEventListener('mousemove', move);
    win.document.addEventListener('mouseup', up);
  });
}

function dockTop(win) {
  const header = win.document.querySelector('.live-preview-header');

  if (header) {
    const bottom = Math.round(header.getBoundingClientRect().bottom);

    if (bottom > 8) {
      return bottom;
    }
  }

  return 56;
}

function parkDockOffscreen(dock) {
  dock.style.left = '-10000px';
  dock.style.right = 'auto';
  dock.style.top = '0';
  dock.style.bottom = 'auto';
  dock.style.height = '100vh';
}

export function placeRightDock(win) {
  const dock = dockEl(win.document);

  if (!dock || dock.hasAttribute('data-sve-right-closed') || widthDragging) {
    return;
  }

  attachDock(win.document, dock);
  dock.style.position = 'fixed';
  dock.style.zIndex = '';
  dock.style.display = 'flex';
  dock.style.top = `${dockTop(win)}px`;
  dock.style.right = '0';
  dock.style.left = 'auto';
  dock.style.bottom = '0';
  dock.style.height = '';
  dock.style.width = `${storedWidth(win)}px`;
  dock.style.visibility = 'visible';
  dock.style.pointerEvents = 'auto';
}

function buildDock(win) {
  const doc = win.document;
  const dock = doc.createElement('div');

  dock.id = RIGHT_DOCK_ID;
  dock.setAttribute('data-sve-right-chrome', CHROME);
  dock.setAttribute('data-sve-right-closed', '');
  mountPane(dock, RightDockShell, { chrome: CHROME });
  parkDockOffscreen(dock);
  attachDock(doc, dock);

  return dock;
}

export function ensureRightDock(win) {
  ensureStyle(win.document);

  let dock = dockEl(win.document);

  if (dock && dock.getAttribute('data-sve-right-chrome') !== CHROME) {
    dock.remove();
    dock = null;
  }

  if (!dock) {
    dock = buildDock(win);
    bindWidth(win, dock);
  }

  bindPinStack(win, dock);

  return dock;
}

function fillPanel(panel) {
  panel.style.cssText = RIGHT_PANEL_FILL;
}

function hideKeepChild(el) {
  el.hidden = true;
  el.setAttribute('data-sve-chrome-hidden', '1');
  el.style.display = 'none';
}

function showKeepChild(el) {
  el.hidden = false;
  el.removeAttribute('data-sve-chrome-hidden');
  fillPanel(el);
}

/**
 * Put `panel` in the shared right sidebar. Other tools are removed, except
 * children marked `data-sve-right-keep` (Theme Settings iframe) which hide,
 * and — when pin stack is on — panels the user has pinned.
 */
export function showInRightShell(win, panel, { keep = false } = {}) {
  const dock = ensureRightDock(win);
  const slot = slotEl(dock);

  if (!slot || !panel) {
    return dock;
  }

  const key = paneKeyOf(panel);

  if (key) {
    panel.setAttribute('data-sve-right-pane', key);

    const folded = storedFolded(win);

    if (folded[key]) {
      folded[key] = false;
      storeFolded(win, folded);
    }
  }

  for (const child of [...slot.children]) {
    if (child === panel || child.hasAttribute('data-sve-right-split')) {
      continue;
    }

    if (isPinned(win, paneKeyOf(child))) {
      continue;
    }

    if (child.hasAttribute('data-sve-right-keep')) {
      hideKeepChild(child);
    } else {
      child.remove();
    }
  }

  if (keep) {
    panel.setAttribute('data-sve-right-keep', '');
  }

  if (panel.parentElement !== slot) {
    slot.appendChild(panel);
  }

  showKeepChild(panel);
  ensurePinButton(win, panel);
  layoutStack(win, dock);
  dock.removeAttribute('data-sve-right-closed');
  storeOpen(win, true);
  placeRightDock(win);
  notify(win);
  win.dispatchEvent(new Event('resize'));

  return dock;
}

/** Hide a keep-child in place (do not reparent — that reloads iframes). */
export function parkInRightShell(win, panel) {
  if (!panel) {
    return;
  }

  const dock = ensureRightDock(win);
  const slot = slotEl(dock);

  panel.setAttribute('data-sve-right-keep', '');

  if (slot && panel.parentElement !== slot) {
    slot.appendChild(panel);
  }

  hideKeepChild(panel);
  layoutStack(win, dockEl(win.document));
  releaseRightShellIfEmpty(win);
}

export function visibleRightShellChild(win) {
  const slot = slotEl(dockEl(win.document));

  return [...(slot?.children || [])].find(isVisibleChild) || null;
}

let shellSwap = 0;

/** While swapping tools, do not collapse the shell — the next panel is about to mount. */
export function beginRightShellSwap() {
  shellSwap += 1;
}

export function endRightShellSwap() {
  shellSwap = Math.max(0, shellSwap - 1);
}

export function releaseRightShellIfEmpty(win) {
  if (shellSwap) {
    return;
  }

  const dock = dockEl(win.document);

  if (!dock) {
    return;
  }

  if (!visibleRightShellChild(win)) {
    hideRightDock(win);

    return;
  }

  layoutStack(win, dock);
}

export function openRightDock(win) {
  const dock = ensureRightDock(win);

  dock.removeAttribute('data-sve-right-closed');
  storeOpen(win, true);
  placeRightDock(win);
  notify(win);
  win.dispatchEvent(new Event('resize'));

  return dock;
}

export function hideRightDock(win) {
  const dock = dockEl(win.document);

  if (!dock) {
    return;
  }

  dock.setAttribute('data-sve-right-closed', '');
  parkDockOffscreen(dock);
  storeOpen(win, false);
  notify(win);
  win.dispatchEvent(new Event('resize'));
}

export function closeRightDock(win) {
  const dock = dockEl(win.document);

  if (!dock) {
    storeOpen(win, false);
    notify(win);

    return;
  }

  const slot = slotEl(dock);

  for (const child of [...(slot?.children || [])]) {
    if (child.hasAttribute('data-sve-right-keep')) {
      hideKeepChild(child);
    } else {
      child.remove();
    }
  }

  if (slot?.querySelector('[data-sve-right-keep]')) {
    hideRightDock(win);

    return;
  }

  dock.remove();
  storeOpen(win, false);
  notify(win);
  win.dispatchEvent(new Event('resize'));
}

export function toggleRightDock(win) {
  if (isRightDockOpen(win)) {
    hideRightDock(win);
  } else {
    openRightDock(win);
  }
}

export function setRightPane(win, key, on) {
  hooks[key]?.[on ? 'show' : 'hide']?.(win, null);
}

export function revealRightPane(win, key) {
  setRightPane(win, key, true);
}

export function restoreRightDock(win) {
  if (!storedOpen(win)) {
    return;
  }

  const dock = dockEl(win.document);

  if (dock && visibleRightShellChild(win)) {
    dock.removeAttribute('data-sve-right-closed');
    placeRightDock(win);
    notify(win);
  }
}

export function relayoutRightDock(win) {
  if (widthDragging) {
    return;
  }

  if (isRightDockOpen(win)) {
    placeRightDock(win);
    layoutStack(win, dockEl(win.document));
  }
}

export function isRightPaneOn(win, key) {
  if (!isRightDockOpen(win)) {
    return false;
  }

  const pane = win.document.querySelector(`[data-sve-right-pane="${key}"]`);

  return !!pane && isVisibleChild(pane);
}
