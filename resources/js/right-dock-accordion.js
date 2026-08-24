/**
 * SNAPSHOT — stacked accordion right sidebar (several panes open, pin, reorder, split).
 *
 * Kept so we can restore it: in right-dock.js set the export to this file and
 * run `npm run cp:build`. Not imported while the tab layout is active.
 *
 * Accordion: every tool has a header; panes expand under it. Several can be
 * open at once. Pin a pane to have it open again next time. Drag a header to
 * reorder. Between two open panes, a dotted grip resizes their height.
 *
 * Placement — change this map to move a tool between the top bar and this dock:
 *
 *   'topbar'  icon in the header
 *   'right'   accordion section in this sidebar
 *
 * comments is 'right' and also a toolbar shortcut (badge + opens this pane).
 * settings / pages / globals stay in the top bar. code is the bottom dock.
 */

import RightDockAccordion from './cp/surfaces/RightDockAccordion.vue';
import { mountPane } from './cp/mount-pane.js';

export const TOOL_PLACEMENT = {
  settings: 'topbar',
  pages: 'topbar',
  globals: 'topbar',
  listview: 'right',
  outline: 'right',
  comments: 'right',
  sections: 'right',
  ai: 'topbar',
  code: 'topbar',
};

/** Right-dock tools that also keep an icon in the top bar. */
export const TOOLBAR_SHORTCUTS = ['comments'];

export const RIGHT_DOCK_ID = '__sve-right-dock';

const STYLE_ID = '__sve-right-dock-style';
const OPEN_KEY = 'sve-right-dock-open';
const PANES_KEY = 'sve-right-dock-open-panes-v2';
const WIDTH_KEY = 'sve-right-dock-width';
const HEIGHTS_KEY = 'sve-right-dock-heights';
const ORDER_KEY = 'sve-right-dock-order';
const PIN_KEY = 'sve-right-dock-pinned';

const MIN_WIDTH = 240;
const DEFAULT_WIDTH = 320;
const MIN_PANE = 88;

export const RIGHT_PANE_TOOLS = ['listview', 'outline', 'comments', 'sections', 'ai'];

const PANE_IDS = {
  listview: '__sve-listview-panel',
  outline: '__sve-outline-panel',
  comments: '__sve-comments-pane',
  sections: '__sve-section-picker',
  ai: '__sve-ai-panel',
};

const LABEL_KEYS = {
  listview: 'listview',
  outline: 'outline',
  comments: 'comments_pane',
  sections: 'sections',
  ai: 'ai_panel',
};

const GRIP_6 =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
  + '<circle cx="9" cy="6" r="1.7"/><circle cx="15" cy="6" r="1.7"/>'
  + '<circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/>'
  + '<circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></svg>';

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

const PIN_OFF =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1z"/></svg>';

const PIN_ON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" '
  + 'stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1z"/></svg>';

const hooks = {};

export function toolPlacement(key) {
  return TOOL_PLACEMENT[key] || 'topbar';
}

export function isRightDockTool(key) {
  return toolPlacement(key) === 'right' && RIGHT_PANE_TOOLS.includes(key);
}

export function isToolbarShortcut(key) {
  return TOOLBAR_SHORTCUTS.includes(key);
}

export function rightDockPaneKeys(win = window) {
  const allowed = RIGHT_PANE_TOOLS.filter((key) => isRightDockTool(key));
  const order = storedOrder(win).filter((key) => allowed.includes(key));

  allowed.forEach((key) => {
    if (!order.includes(key)) {
      order.push(key);
    }
  });

  return order;
}

export function registerRightDockHook(key, hook) {
  hooks[key] = hook || {};
}

function t(win, key) {
  return win.Statamic?.$config?.get?.('sveStrings')?.[key] ?? key;
}

function storedOpen(win) {
  try {
    const raw = win.localStorage.getItem(OPEN_KEY);

    if (raw === '0') {
      return false;
    }

    if (raw === '1') {
      return true;
    }
  } catch {
    /* private mode */
  }

  return true;
}

function storeOpen(win, open) {
  try {
    win.localStorage.setItem(OPEN_KEY, open ? '1' : '0');
  } catch {
    /* private mode */
  }
}

function storedOrder(win) {
  try {
    const raw = JSON.parse(win.localStorage.getItem(ORDER_KEY) || 'null');

    if (Array.isArray(raw)) {
      return raw.filter((key) => typeof key === 'string');
    }
  } catch {
    /* ignore */
  }

  return [];
}

function storeOrder(win, order) {
  try {
    win.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* private mode */
  }
}

function storedPinned(win) {
  const out = {};

  try {
    const raw = JSON.parse(win.localStorage.getItem(PIN_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      for (const key of RIGHT_PANE_TOOLS) {
        out[key] = raw[key] === true;
      }

      return out;
    }
  } catch {
    /* ignore */
  }

  return out;
}

function storePinned(win, pinned) {
  try {
    win.localStorage.setItem(PIN_KEY, JSON.stringify(pinned));
  } catch {
    /* private mode */
  }
}

function defaultPanes(win) {
  const panes = {};
  const keys = rightDockPaneKeys(win);
  const pinned = storedPinned(win);

  keys.forEach((key, i) => {
    panes[key] = pinned[key] === true || i === 0;
  });

  return panes;
}

function storedPanes(win) {
  const fallback = defaultPanes(win);

  try {
    const raw = JSON.parse(win.localStorage.getItem(PANES_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      const out = { ...fallback };

      for (const key of rightDockPaneKeys(win)) {
        if (typeof raw[key] === 'boolean') {
          out[key] = raw[key];
        }
      }

      if (!Object.values(out).some(Boolean) && rightDockPaneKeys(win)[0]) {
        out[rightDockPaneKeys(win)[0]] = true;
      }

      return out;
    }
  } catch {
    /* ignore */
  }

  return fallback;
}

function storePanes(win, panes) {
  try {
    win.localStorage.setItem(PANES_KEY, JSON.stringify(panes));
  } catch {
    /* private mode */
  }
}

function storedWidth(win) {
  try {
    const n = Number(win.localStorage.getItem(WIDTH_KEY));

    if (Number.isFinite(n) && n >= MIN_WIDTH) {
      return Math.min(n, Math.round(win.innerWidth * 0.6));
    }
  } catch {
    /* ignore */
  }

  return DEFAULT_WIDTH;
}

function storeWidth(win, px) {
  try {
    win.localStorage.setItem(WIDTH_KEY, String(px));
  } catch {
    /* private mode */
  }
}

function storedHeights(win) {
  try {
    const raw = JSON.parse(win.localStorage.getItem(HEIGHTS_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      const out = {};

      for (const key of rightDockPaneKeys(win)) {
        const n = Number(raw[key]);

        out[key] = Number.isFinite(n) && n > 0 ? n : 1;
      }

      return out;
    }
  } catch {
    /* ignore */
  }

  const out = {};

  for (const key of rightDockPaneKeys(win)) {
    out[key] = 1;
  }

  return out;
}

function storeHeights(win, heights) {
  try {
    win.localStorage.setItem(HEIGHTS_KEY, JSON.stringify(heights));
  } catch {
    /* private mode */
  }
}

function ensureStyle(doc) {
  let style = doc.getElementById(STYLE_ID);

  if (!style) {
    style = doc.createElement('style');
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }

  style.textContent = `
#${RIGHT_DOCK_ID} {
  position: fixed;
  right: 0;
  z-index: var(--z-index-above, 1);
  display: flex;
  flex-direction: column;
  overflow: visible;
  background: var(--theme-color-content-bg, #fff);
  color: currentColor;
  border-left: 1px solid rgba(128,128,128,.28);
  box-shadow: -8px 0 24px rgba(0,0,0,.18);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${RIGHT_DOCK_ID}[data-sve-right-closed] {
  display: none;
}
#${RIGHT_DOCK_ID} [data-sve-right-panes] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#${RIGHT_DOCK_ID} [data-sve-right-section] {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 0 0 auto;
}
#${RIGHT_DOCK_ID} [data-sve-right-section][data-open] {
  flex: 1 1 0;
}
#${RIGHT_DOCK_ID} [data-sve-right-head] {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px 0 6px;
  min-height: 36px;
  flex: 0 0 auto;
  border-bottom: 1px solid rgba(128,128,128,.16);
  background: rgba(128,128,128,.06);
  overflow: visible;
}
#${RIGHT_DOCK_ID} [data-sve-right-reorder] {
  all: unset;
  cursor: grab;
  width: 20px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: .4;
  flex: 0 0 auto;
}
#${RIGHT_DOCK_ID} [data-sve-right-reorder] svg {
  width: 12px;
  height: 12px;
}
#${RIGHT_DOCK_ID} [data-sve-right-reorder]:active {
  cursor: grabbing;
}
#${RIGHT_DOCK_ID} [data-sve-right-pane-btn] {
  all: unset;
  cursor: pointer;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  position: relative;
}
#${RIGHT_DOCK_ID} [data-sve-right-pane-btn] > span {
  display: flex;
  align-items: center;
  line-height: 1;
}
#${RIGHT_DOCK_ID} [data-sve-right-chevron] {
  width: 13px;
  height: 13px;
  opacity: .55;
  flex: 0 0 auto;
  display: block;
  transition: transform .12s ease;
}
#${RIGHT_DOCK_ID} [data-sve-right-section][data-open] [data-sve-right-chevron] {
  transform: rotate(90deg);
}
#${RIGHT_DOCK_ID} [data-sve-right-pin] {
  all: unset;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: .35;
  border-radius: 4px;
  flex: 0 0 auto;
}
#${RIGHT_DOCK_ID} [data-sve-right-pin] svg {
  width: 14px;
  height: 14px;
  display: block;
}
#${RIGHT_DOCK_ID} [data-sve-right-pin][aria-pressed="true"] {
  opacity: 1;
  color: var(--theme-color-primary, #4530D8);
}
#${RIGHT_DOCK_ID} [data-sve-right-pane] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#${RIGHT_DOCK_ID} [data-sve-right-pane][hidden] {
  display: none !important;
}
#${RIGHT_DOCK_ID} [data-sve-right-split] {
  flex: 0 0 16px;
  cursor: ns-resize;
  ${splitterFill('ns')}
}
#${RIGHT_DOCK_ID} [data-sve-right-split] svg {
  display: none;
}
#${RIGHT_DOCK_ID} [data-sve-right-split][hidden] {
  display: none !important;
}
#${RIGHT_DOCK_ID} [data-sve-right-split][data-active] {
  filter: brightness(1.15);
}
#${RIGHT_DOCK_ID} [data-sve-right-resize] {
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 16px;
  cursor: ew-resize;
  z-index: 2;
  ${splitterFill('ew')}
}
${splitterFillDark(`#${RIGHT_DOCK_ID} [data-sve-right-split]`)}
${splitterFillDark(`#${RIGHT_DOCK_ID} [data-sve-right-resize]`)}
#${RIGHT_DOCK_ID} [data-sve-right-section][data-dragging] {
  opacity: .55;
}
`;
}

function dockEl(doc) {
  return doc.getElementById(RIGHT_DOCK_ID);
}

export function isRightDockOpen(win) {
  const dock = dockEl(win.document);

  return !!dock && !dock.hasAttribute('data-sve-right-closed');
}

export function isRightPaneOn(win, key) {
  if (!isRightDockOpen(win)) {
    return false;
  }

  const pane = win.document.querySelector(`[data-sve-right-pane="${key}"]`);

  return !!pane && !pane.hidden;
}

function panesOf(win, dock) {
  const stored = storedPanes(win);
  const out = {};

  for (const key of rightDockPaneKeys(win)) {
    const pane = dock.querySelector(`[data-sve-right-pane="${key}"]`);

    out[key] = pane ? !pane.hidden : stored[key];
  }

  return out;
}

function notify(win) {
  const open = isRightDockOpen(win);
  const panes = {};

  for (const key of rightDockPaneKeys(win)) {
    panes[key] = open && isRightPaneOn(win, key);
  }

  win.dispatchEvent(
    new CustomEvent('sve-right-dock-change', {
      detail: { open, panes },
    })
  );
}

function applyHeights(win, dock) {
  const heights = storedHeights(win);

  for (const key of rightDockPaneKeys(win)) {
    const section = dock.querySelector(`[data-sve-right-section="${key}"]`);
    const pane = dock.querySelector(`[data-sve-right-pane="${key}"]`);

    if (!section) {
      continue;
    }

    if (pane && !pane.hidden) {
      section.style.flex = `${heights[key] || 1} 1 0`;
    } else {
      section.style.flex = '0 0 auto';
    }
  }
}

function paintPins(win, dock) {
  const pinned = storedPinned(win);

  dock.querySelectorAll('[data-sve-right-pin]').forEach((btn) => {
    const key = btn.getAttribute('data-sve-right-pin');
    const on = pinned[key] === true;

    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = t(win, on ? 'right_dock_unpin' : 'right_dock_pin');
    btn.innerHTML = on ? PIN_ON : PIN_OFF;
  });
}

function paintPanes(win, dock, panes) {
  const keys = rightDockPaneKeys(win);

  for (const key of keys) {
    const btn = dock.querySelector(`[data-sve-right-pane-btn="${key}"]`);
    const pane = dock.querySelector(`[data-sve-right-pane="${key}"]`);
    const section = dock.querySelector(`[data-sve-right-section="${key}"]`);
    const on = !!panes[key];

    if (btn) {
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    }

    if (section) {
      if (on) {
        section.setAttribute('data-open', '');
      } else {
        section.removeAttribute('data-open');
      }
    }

    if (pane) {
      const wasOn = !pane.hidden;

      pane.hidden = !on;

      if (on && !wasOn) {
        hooks[key]?.fill?.(win, pane);
        hooks[key]?.show?.(win, pane);
      } else if (!on && wasOn) {
        hooks[key]?.hide?.(win, pane);
      } else if (on) {
        hooks[key]?.show?.(win, pane);
      }
    }
  }

  const visible = keys.filter((key) => panes[key]);

  dock.querySelectorAll('[data-sve-right-split]').forEach((split) => {
    const after = split.getAttribute('data-sve-right-split-after');
    const i = visible.indexOf(after);

    split.hidden = !(i >= 0 && i < visible.length - 1);
  });

  applyHeights(win, dock);
  paintPins(win, dock);
  storePanes(win, panes);
}

function bindHeads(win, dock) {
  if (dock._sveRightHeadBound) {
    return;
  }

  dock._sveRightHeadBound = true;

  dock.addEventListener('click', (event) => {
    const pin = event.target.closest('[data-sve-right-pin]');

    if (pin && dock.contains(pin)) {
      event.preventDefault();
      event.stopPropagation();

      const key = pin.getAttribute('data-sve-right-pin');
      const pinned = storedPinned(win);

      pinned[key] = !pinned[key];
      storePinned(win, pinned);

      if (pinned[key]) {
        const panes = panesOf(win, dock);

        panes[key] = true;
        paintPanes(win, dock, panes);
        notify(win);
      } else {
        paintPins(win, dock);
      }

      return;
    }

    const btn = event.target.closest('[data-sve-right-pane-btn]');

    if (!btn || !dock.contains(btn) || event.target.closest('[data-sve-right-reorder]')) {
      return;
    }

    event.stopPropagation();

    const key = btn.getAttribute('data-sve-right-pane-btn');
    const panes = panesOf(win, dock);

    panes[key] = !panes[key];
    paintPanes(win, dock, panes);
    notify(win);
  });
}

function persistDomOrder(win, dock) {
  const order = [...dock.querySelectorAll('[data-sve-right-section]')].map(
    (el) => el.getAttribute('data-sve-right-section')
  );

  storeOrder(win, order);
}

function bindReorder(win, dock) {
  if (dock._sveRightReorderBound) {
    return;
  }

  dock._sveRightReorderBound = true;

  dock.addEventListener('mousedown', (event) => {
    const grip = event.target.closest('[data-sve-right-reorder]');

    if (!grip || !dock.contains(grip)) {
      return;
    }

    event.preventDefault();

    const section = grip.closest('[data-sve-right-section]');
    const stack = dock.querySelector('[data-sve-right-panes]');

    if (!section || !stack) {
      return;
    }

    section.setAttribute('data-dragging', '');

    const move = (e) => {
      const hover = [...stack.querySelectorAll('[data-sve-right-section]')].find((el) => {
        const r = el.getBoundingClientRect();

        return e.clientY >= r.top && e.clientY <= r.bottom;
      });

      if (!hover || hover === section) {
        return;
      }

      const r = hover.getBoundingClientRect();

      if (e.clientY < r.top + r.height / 2) {
        stack.insertBefore(section, hover);
      } else {
        stack.insertBefore(section, hover.nextElementSibling);
      }
    };

    const up = () => {
      section.removeAttribute('data-dragging');
      persistDomOrder(win, dock);
      paintPanes(win, dock, panesOf(win, dock));
      win.document.removeEventListener('mousemove', move);
      win.document.removeEventListener('mouseup', up);
    };

    win.document.addEventListener('mousemove', move);
    win.document.addEventListener('mouseup', up);
  });
}

function bindWidth(win, dock) {
  if (dock._sveRightWidthBound) {
    return;
  }

  dock._sveRightWidthBound = true;

  const handle = dock.querySelector('[data-sve-right-resize]');

  handle?.addEventListener('mousedown', (event) => {
    event.preventDefault();

    const startX = event.clientX;
    const startW = dock.getBoundingClientRect().width;

    const move = (e) => {
      const next = Math.min(
        Math.max(MIN_WIDTH, startW + (startX - e.clientX)),
        Math.round(win.innerWidth * 0.6)
      );

      storeWidth(win, next);
      dock.style.width = `${next}px`;
      win.dispatchEvent(new Event('resize'));
    };

    const up = () => {
      win.document.removeEventListener('mousemove', move);
      win.document.removeEventListener('mouseup', up);
    };

    win.document.addEventListener('mousemove', move);
    win.document.addEventListener('mouseup', up);
  });
}

function bindSplits(win, dock) {
  if (dock._sveRightSplitBound) {
    return;
  }

  dock._sveRightSplitBound = true;

  dock.addEventListener('mousedown', (event) => {
    const split = event.target.closest('[data-sve-right-split]');

    if (!split || !dock.contains(split) || split.hidden) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const after = split.getAttribute('data-sve-right-split-after');
    const visible = rightDockPaneKeys(win).filter((key) => panesOf(win, dock)[key]);
    const i = visible.indexOf(after);
    const topKey = visible[i];
    const bottomKey = visible[i + 1];

    if (!topKey || !bottomKey) {
      return;
    }

    const topEl = dock.querySelector(`[data-sve-right-section="${topKey}"]`);
    const bottomEl = dock.querySelector(`[data-sve-right-section="${bottomKey}"]`);
    const startY = event.clientY;
    const topH = topEl.getBoundingClientRect().height;
    const bottomH = bottomEl.getBoundingClientRect().height;
    const total = topH + bottomH;

    split.setAttribute('data-active', '');

    const move = (e) => {
      const dy = e.clientY - startY;
      let nextTop = Math.max(MIN_PANE, Math.min(total - MIN_PANE, topH + dy));
      let nextBottom = total - nextTop;

      if (total < MIN_PANE * 2) {
        nextTop = topH;
        nextBottom = bottomH;
      }

      const heights = storedHeights(win);

      heights[topKey] = nextTop;
      heights[bottomKey] = nextBottom;
      storeHeights(win, heights);
      applyHeights(win, dock);
    };

    const up = () => {
      split.removeAttribute('data-active');
      win.document.removeEventListener('mousemove', move);
      win.document.removeEventListener('mouseup', up);
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

export function placeRightDock(win) {
  const dock = dockEl(win.document);

  if (!dock || dock.hasAttribute('data-sve-right-closed')) {
    return;
  }

  dock.style.top = `${dockTop(win)}px`;
  dock.style.bottom = '0';
  dock.style.width = `${storedWidth(win)}px`;
}

function sectionMarkup(win, key) {
  const id = PANE_IDS[key] ? ` id="${PANE_IDS[key]}"` : '';
  const label = t(win, LABEL_KEYS[key]);

  return `
    <div data-sve-right-section="${key}">
      <div data-sve-right-head>
        <button type="button" data-sve-right-reorder title="${t(win, 'right_dock_reorder')}">${GRIP_6}</button>
        <button type="button" data-sve-right-pane-btn="${key}">
          <svg data-sve-right-chevron viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          <span>${label}</span>
        </button>
        <button type="button" data-sve-right-pin="${key}">${PIN_OFF}</button>
      </div>
      <div data-sve-right-pane="${key}"${id} hidden></div>
      <div data-sve-right-split data-sve-right-split-after="${key}" hidden></div>
    </div>
  `;
}

function buildDock(win) {
  const doc = win.document;
  const keys = rightDockPaneKeys(win);
  const dock = doc.createElement('div');

  dock.id = RIGHT_DOCK_ID;
  mountPane(dock, RightDockAccordion, {
    sections: keys.map((key) => ({
      key,
      id: PANE_IDS[key] || '',
      label: t(win, LABEL_KEYS[key]),
    })),
    grip: GRIP_6,
    pin: PIN_OFF,
    reorderTitle: t(win, 'right_dock_reorder'),
  });
  doc.body.appendChild(dock);

  return dock;
}

export function ensureRightDock(win) {
  ensureStyle(win.document);

  let dock = dockEl(win.document);

  if (!dock) {
    dock = buildDock(win);
    bindHeads(win, dock);
    bindReorder(win, dock);
    bindWidth(win, dock);
    bindSplits(win, dock);
  }

  return dock;
}

export function openRightDock(win) {
  const dock = ensureRightDock(win);

  dock.removeAttribute('data-sve-right-closed');
  storeOpen(win, true);
  placeRightDock(win);
  paintPanes(win, dock, storedPanes(win));
  notify(win);
  win.dispatchEvent(new Event('resize'));

  return dock;
}

export function hideRightDock(win) {
  const dock = dockEl(win.document);

  if (!dock) {
    return;
  }

  const panes = panesOf(win, dock);

  for (const key of rightDockPaneKeys(win)) {
    if (panes[key]) {
      hooks[key]?.hide?.(win, dock.querySelector(`[data-sve-right-pane="${key}"]`));
    }
  }

  dock.setAttribute('data-sve-right-closed', '');
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

  for (const key of rightDockPaneKeys(win)) {
    hooks[key]?.hide?.(win, dock.querySelector(`[data-sve-right-pane="${key}"]`));
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
  if (!rightDockPaneKeys(win).includes(key)) {
    return;
  }

  const dock = on ? openRightDock(win) : ensureRightDock(win);
  const panes = storedPanes(win);

  panes[key] = on;
  dock.removeAttribute('data-sve-right-closed');

  if (on) {
    storeOpen(win, true);
  }

  placeRightDock(win);
  paintPanes(win, dock, panes);
  notify(win);
  win.dispatchEvent(new Event('resize'));
}

export function revealRightPane(win, key) {
  setRightPane(win, key, true);
  win.document.querySelector(`[data-sve-right-section="${key}"]`)?.scrollIntoView({
    block: 'nearest',
  });
}

export function restoreRightDock(win) {
  if (!rightDockPaneKeys(win).length) {
    return;
  }

  const panes = storedPanes(win);
  const pinned = storedPinned(win);

  for (const key of rightDockPaneKeys(win)) {
    if (pinned[key]) {
      panes[key] = true;
    }
  }

  if (storedOpen(win)) {
    const dock = ensureRightDock(win);

    dock.removeAttribute('data-sve-right-closed');
    storeOpen(win, true);
    placeRightDock(win);
    paintPanes(win, dock, panes);
    notify(win);
    win.dispatchEvent(new Event('resize'));
  } else {
    ensureRightDock(win);
    hideRightDock(win);
  }
}

export function relayoutRightDock(win) {
  if (isRightDockOpen(win)) {
    placeRightDock(win);
  }
}
