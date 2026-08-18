/**
 * One right sidebar for Live Preview.
 *
 * Tools stay as icons in the top bar. Clicking one loads its content into this
 * shell — same width, same Statamic drag-dots handle. Theme Settings keeps its
 * iframe parked inside so switching away does not reload it.
 *
 * Accordion snapshot (several open, pin, reorder): right-dock-accordion.js
 */

export const TOOL_PLACEMENT = {
  settings: 'topbar',
  pages: 'topbar',
  globals: 'topbar',
  listview: 'topbar',
  outline: 'topbar',
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
const LEGACY_WIDTH_KEYS = ['sve-globals-panel-width', 'sve-listview-panel-width', 'sve-ai-panel-width'];

const MIN_WIDTH = 240;
const DEFAULT_WIDTH = 320;
const CHROME = 'shell-1';

export const RIGHT_PANE_TOOLS = ['listview', 'outline', 'comments', 'sections', 'ai'];

/** Inner panel fill — the shell owns position, width, border and the grip. */
export const RIGHT_PANEL_FILL =
  'flex:1 1 auto;min-height:0;min-width:0;width:100%;display:flex;flex-direction:column;' +
  'overflow:hidden;position:relative;background:transparent;border:0;box-shadow:none;';

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

  return false;
}

function storeOpen(win, open) {
  try {
    win.localStorage.setItem(OPEN_KEY, open ? '1' : '0');
  } catch {
    /* private mode */
  }
}

function readStoredPx(win, key) {
  try {
    const n = Number(win.localStorage.getItem(key));

    if (Number.isFinite(n) && n >= MIN_WIDTH) {
      return Math.min(n, Math.round(win.innerWidth * 0.6));
    }
  } catch {
    /* ignore */
  }

  return 0;
}

function storedWidth(win) {
  return readStoredPx(win, WIDTH_KEY) || LEGACY_WIDTH_KEYS.reduce((found, key) => found || readStoredPx(win, key), 0) || DEFAULT_WIDTH;
}

function storeWidth(win, px) {
  try {
    win.localStorage.setItem(WIDTH_KEY, String(px));
  } catch {
    /* private mode */
  }
}

export function rightDockWidth(win) {
  return storedWidth(win);
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
  z-index: 41;
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
  visibility: hidden !important;
  pointer-events: none !important;
  z-index: -1 !important;
}
#${RIGHT_DOCK_ID} [data-sve-right-slot] {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
${splitterFillDark(`#${RIGHT_DOCK_ID} [data-sve-right-resize]`)}
`;
}

function dockEl(doc) {
  return doc.getElementById(RIGHT_DOCK_ID);
}

function slotEl(dock) {
  return dock?.querySelector('[data-sve-right-slot]') || null;
}

function isVisibleChild(el) {
  return (
    !!el &&
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
    const frame = dock.querySelector('iframe');

    if (frame) {
      frame.style.pointerEvents = 'none';
    }

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

      if (frame) {
        frame.style.pointerEvents = '';
      }
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

  if (!dock || dock.hasAttribute('data-sve-right-closed')) {
    return;
  }

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
  dock.innerHTML = `
    <div data-sve-right-resize></div>
    <div data-sve-right-slot></div>
  `;
  parkDockOffscreen(dock);
  doc.body.appendChild(dock);

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
 * children marked `data-sve-right-keep` (Theme Settings iframe) which hide.
 */
export function showInRightShell(win, panel, { keep = false } = {}) {
  const dock = ensureRightDock(win);
  const slot = slotEl(dock);

  if (!slot || !panel) {
    return dock;
  }

  for (const child of [...slot.children]) {
    if (child === panel) {
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
  }
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
  if (isRightDockOpen(win)) {
    placeRightDock(win);
  }
}

export function isRightPaneOn(win, key) {
  if (!isRightDockOpen(win)) {
    return false;
  }

  const pane = win.document.querySelector(`[data-sve-right-pane="${key}"]`);

  return !!pane && isVisibleChild(pane);
}
