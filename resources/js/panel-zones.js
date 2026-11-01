/**
 * Where the panels stand in Vizuall Build: left, right or bottom, and who stands
 * together with whom. Dragged by the grip in a panel's header, kept for this user.
 *
 * Owner: panel zones. The right zone is the right sidebar as it always was
 * (right-dock-tabs.js); the left and bottom zones are two more of the same shell,
 * so a panel keeps its pin, fold, order and height wherever it stands. Moving a
 * panel moves its element: nothing remounts, and only a panel with an iframe in
 * it reloads what that iframe shows.
 *
 *   left    in Statamic's column, the way Build holds it (build-mode-host.js):
 *           the form stays mounted behind it. The column's width is Statamic's.
 *   bottom  a band under the preview, as high as the dock is.
 *
 * Only while Build holds the column (`zonesOn`). In Content everything stands in
 * the right sidebar as before, and with the `panel_zones` setting off this file
 * does nothing at all. Nothing runs between two drags: the bottom band's one
 * observer exists only while the band is on screen.
 *
 * May import: chrome-prefs.js, lib/, cp/, right-dock-tabs.js, lp-panel.js,
 *   code-dock-lazy.js, section-library.js. Not the dock's own files, not the kernel.
 */
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { sveState } from './cp-state.js';
import { buildModeUi } from './cp/build-mode/store.js';
import { mountPane } from './cp/mount-pane.js';
import { CODE_KEYS, codeStaysTogether, dropTarget, isFixedPane, keysOf, orderWith, parseZones, withZone, zoneOf } from './cp/panel-zones/layout.js';
import RightDockShell from './cp/surfaces/RightDockShell.vue';
import { relayoutCodeDock } from './code-dock-lazy.js';
import { featureOn } from './lib/config.js';
import { attachDock } from './lib/dock-host.js';
import { remToPx } from './lib/dom.js';
import { beginOverlayDrag } from './lib/drag.js';
import { t } from './lib/i18n.js';
import { BOTTOM_ZONE_ID, BUILD_PANEL_ID, LEFT_ZONE_ID, ZONE_SHELL_ATTR } from './lib/ids.js';
import { setLpCollapsed } from './lp-panel.js';
import {
  RIGHT_DOCK_ID,
  bindShellStack,
  ensureRightDock,
  ensureShellStyle,
  hideRightDock,
  layoutShell,
  openRightDock,
  paneKeyOf,
  pinPane,
  shellPanes,
  shellSlot,
  storeOrder,
  storedOrder,
} from './right-dock-tabs.js';
import { syncPreviewInset } from './section-library.js';

const ZONES_KEY = 'sve-panel-zones';
/** The dock's own height key: the band under the preview has one height, whoever stands in it. */
const BAND_KEY = 'sve-code-dock-height';
const BAND_DEFAULT = 280;
const BAND_MIN = 120;
/** How wide a zone with nothing in it is to drop on, in rem. */
const EMPTY_ZONE_REM = 12;
const BELOW_ATTR = 'data-sve-zone-bottom';
const DROP_ATTR = 'data-sve-zone-drop';

let bandWatch = null;
/** The column shut because nothing stood in it: it opens again by itself when something does. */
let leftEmptied = false;

export function zonesOn(win) {
  return buildModeUi.on && featureOn(win, 'panel_zones');
}

/** Whether Build lends the column through a zone: the setting, before Build has it. */
export function zonesWanted(win) {
  return featureOn(win, 'panel_zones');
}

export function storedZones(win) {
  return parseZones(chromeGet(win, ZONES_KEY));
}

export function paneZone(win, key) {
  return zoneOf(storedZones(win), key);
}

function shells(doc) {
  return [doc.getElementById(LEFT_ZONE_ID), doc.getElementById(RIGHT_DOCK_ID), doc.getElementById(BOTTOM_ZONE_ID)].filter(Boolean);
}

export function zoneShells(doc) {
  return shells(doc);
}

function newShell(win, id, zone) {
  const doc = win.document;
  const shell = doc.createElement('div');

  ensureShellStyle(doc);
  shell.id = id;
  shell.setAttribute(ZONE_SHELL_ATTR, zone);
  mountPane(shell, RightDockShell, { chrome: zone });
  bindShellStack(win, shell);

  return shell;
}

/** The left zone in the column Build holds. A column Statamic rebuilt gets the same shell back, panels and all. */
let leftKept = null;

export function placeLeftZone(win, column) {
  if (!leftKept) {
    leftKept = newShell(win, LEFT_ZONE_ID, 'left');
  }

  if (leftKept.parentElement !== column) {
    column.appendChild(leftKept);
  }

  return leftKept;
}

function ensureBottomZone(win) {
  const doc = win.document;
  let shell = doc.getElementById(BOTTOM_ZONE_ID);

  if (!shell) {
    shell = newShell(win, BOTTOM_ZONE_ID, 'bottom');
    shell.setAttribute('data-sve-right-closed', '');
    bindBandHeight(win, shell);
    attachDock(doc, shell);
  }

  return shell;
}

/** The shell `key` goes in while Build holds the column; null for the right sidebar. */
export function zoneShellFor(win, key) {
  if (!key || !zonesOn(win)) {
    return null;
  }

  const zone = paneZone(win, key);

  if (zone === 'left') {
    return leftKept;
  }

  return zone === 'bottom' ? ensureBottomZone(win) : null;
}

function bandHeight(win) {
  const n = parseInt(chromeGet(win, BAND_KEY) ?? '', 10);
  const px = Number.isFinite(n) && n >= BAND_MIN ? n : BAND_DEFAULT;

  return Math.min(px, Math.round(win.innerHeight * 0.7));
}

function padBelow(doc, px) {
  const contents = doc.querySelector('.live-preview-contents');
  const value = px ? `${px}px` : '';

  if (contents && contents.style.paddingBottom !== value) {
    contents.style.paddingBottom = value;
  }
}

/** The band stands where the preview's room is: between the sidebars, under the page. */
function placeBand(win, shell, height = bandHeight(win)) {
  const doc = win.document;
  const contents = doc.querySelector('.live-preview-contents');

  if (!contents) {
    return;
  }

  const box = contents.getBoundingClientRect();
  const left = `${Math.round(box.left)}px`;
  const right = `${Math.max(0, Math.round(win.innerWidth - box.right + (parseFloat(contents.style.paddingRight) || 0)))}px`;

  if (shell.style.left !== left) {
    shell.style.left = left;
  }

  if (shell.style.right !== right) {
    shell.style.right = right;
  }

  shell.style.height = `${height}px`;
  padBelow(doc, height);
}

function bindBandHeight(win, shell) {
  shell.querySelector('[data-sve-right-resize]')?.addEventListener('mousedown', (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    const startY = event.clientY;
    const startH = shell.getBoundingClientRect().height;
    let next = startH;

    beginOverlayDrag(
      win,
      'ns-resize',
      (e) => {
        next = Math.min(Math.max(BAND_MIN, startH + (startY - e.clientY)), Math.round(win.innerHeight * 0.7));
        placeBand(win, shell, next);
      },
      () => {
        chromeSet(win, BAND_KEY, String(Math.round(next)));
        win.dispatchEvent(new win.Event('resize'));
      },
      'data-sve-zone-band-shield'
    );
  });
}

function syncBand(win) {
  const doc = win.document;
  const shell = doc.getElementById(BOTTOM_ZONE_ID);
  const open = !!shell && zonesOn(win) && shellPanes(shell).length > 0;
  const was = doc.documentElement.hasAttribute(BELOW_ATTR);

  doc.documentElement.toggleAttribute(BELOW_ATTR, open);

  if (!shell) {
    return;
  }

  shell.toggleAttribute('data-sve-right-closed', !open);

  if (open) {
    placeBand(win, shell);

    if (!bandWatch) {
      const contents = doc.querySelector('.live-preview-contents');

      if (contents) {
        bandWatch = new win.ResizeObserver(() => placeBand(win, shell));
        bandWatch.observe(contents);
      }
    }

    return;
  }

  bandWatch?.disconnect();
  bandWatch = null;

  // The dock, back as one piece under the preview, writes its own room again.
  if (was) {
    padBelow(doc, 0);
  }
}

/** Every shell as what stands in it says: drawn, opened, or out of the preview's way. */
export function settleZones(win) {
  const doc = win.document;

  shells(doc).forEach((shell) => layoutShell(win, shell));
  syncBand(win);

  const right = doc.getElementById(RIGHT_DOCK_ID);

  // Only empty shuts it. A sidebar closed with something in it was closed on purpose.
  if (right && !shellPanes(right).length && !right.hasAttribute('data-sve-right-closed')) {
    hideRightDock(win);
  }

  if (leftKept?.isConnected) {
    const empty = !shellPanes(leftKept).length;

    if (empty && sveState.lpCollapsed !== true) {
      leftEmptied = true;
      setLpCollapsed(win, true);
    } else if (!empty && leftEmptied) {
      leftEmptied = false;
      setLpCollapsed(win, false);
    }
  }

  syncPreviewInset(win);
}

/** A panel just put in a zone is there to be seen: its zone opens. */
export function revealZone(win, shell) {
  if (shell === leftKept && sveState.lpCollapsed === true) {
    leftEmptied = false;
    setLpCollapsed(win, false);
  }

  if (shell?.id === RIGHT_DOCK_ID && shell.hasAttribute('data-sve-right-closed')) {
    openRightDock(win);
  }
}

/** Put every open panel in the zone it belongs in, and tell the dock. */
export function applyZones(win) {
  if (!zonesOn(win)) {
    return;
  }

  const doc = win.document;
  const zones = storedZones(win);
  const moved = new Set();

  for (const shell of shells(doc)) {
    for (const pane of [...(shellSlot(shell)?.children || [])]) {
      const key = paneKeyOf(pane);

      if (!key) {
        continue;
      }

      const zone = zoneOf(zones, key);
      const target = zone === 'left' ? leftKept : zone === 'bottom' ? ensureBottomZone(win) : ensureRightDock(win);

      if (pane.parentElement !== shellSlot(target)) {
        shellSlot(target).appendChild(pane);
        moved.add(target);
      }
    }
  }

  moved.forEach((shell) => revealZone(win, shell));
  settleZones(win);
  relayoutCodeDock(win);
}

/**
 * Build gives the column back: what stands left or below goes to the right
 * sidebar, as the rest of the editor knows it, and the two extra shells go.
 */
export function leaveZones(win) {
  const doc = win.document;
  const bottom = doc.getElementById(BOTTOM_ZONE_ID);
  const tools = [leftKept, bottom].flatMap((shell) => [...(shellSlot(shell)?.children || [])]).filter((pane) => {
    const key = paneKeyOf(pane);

    return key && !isFixedPane(key);
  });

  if (tools.length) {
    const right = ensureRightDock(win);

    tools.forEach((pane) => shellSlot(right).appendChild(pane));
  }

  bandWatch?.disconnect();
  bandWatch = null;
  doc.documentElement.removeAttribute(BELOW_ATTR);
  padBelow(doc, 0);
  bottom?.remove();
  leftKept?.remove();
  leftKept = null;
  leftEmptied = false;

  const right = doc.getElementById(RIGHT_DOCK_ID);

  if (right) {
    layoutShell(win, right);

    if (tools.length && right.hasAttribute('data-sve-right-closed')) {
      openRightDock(win);
    } else if (!shellPanes(right).length && !right.hasAttribute('data-sve-right-closed')) {
      hideRightDock(win);
    }
  }

  relayoutCodeDock(win);
  syncPreviewInset(win);
}

/** Does the dock stand as one piece under the preview? What the dock asks before it places itself. */
export function codeTogether(win) {
  const shell = win.document.getElementById(BOTTOM_ZONE_ID);
  const othersBelow = !!shell && shellPanes(shell).some((pane) => !CODE_KEYS.includes(paneKeyOf(pane)));

  return codeStaysTogether(storedZones(win), othersBelow);
}

/** A slot of the dock's in its zone. It takes no one's place: it stands beside what is there. */
export function addToZone(win, pane, key) {
  const zone = paneZone(win, key);
  const shell = zone === 'left' ? leftKept : zone === 'bottom' ? ensureBottomZone(win) : ensureRightDock(win);

  if (shell && pane.parentElement !== shellSlot(shell)) {
    shellSlot(shell).appendChild(pane);
    revealZone(win, shell);
  }
}

// --- The drag ------------------------------------------------------------------

function rectOf(el) {
  const r = el.getBoundingClientRect();

  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
}

function dropAreas(win, keys) {
  const doc = win.document;
  const contents = doc.querySelector('.live-preview-contents');
  const header = doc.querySelector('.live-preview-header');
  const top = header ? header.getBoundingClientRect().bottom : 0;
  const box = contents.getBoundingClientRect();
  const strip = remToPx(win, EMPTY_ZONE_REM);
  const rightShell = doc.getElementById(RIGHT_DOCK_ID);
  const rightOpen = !!rightShell && !rightShell.hasAttribute('data-sve-right-closed');
  const leftOpen = box.left > 40;
  const left = leftOpen ? { left: 0, top, right: box.left, bottom: win.innerHeight } : { left: 0, top, right: strip, bottom: win.innerHeight };
  const right = rightOpen ? rectOf(rightShell) : { left: win.innerWidth - strip, top, right: win.innerWidth, bottom: win.innerHeight };
  const band = doc.getElementById(BOTTOM_ZONE_ID);
  const dock = doc.documentElement.hasAttribute('data-sve-build-dock-shown') && codeTogether(win) ? doc.getElementById('__sve-code-dock') : null;
  const below = band && !band.hasAttribute('data-sve-right-closed')
    ? rectOf(band)
    : dock
      ? rectOf(dock)
      : { left: left.right, top: win.innerHeight - strip, right: right.left, bottom: win.innerHeight };
  const panes = (shell) => (shell ? shellPanes(shell).filter((el) => !keys.includes(paneKeyOf(el))).map((el) => ({ key: paneKeyOf(el), rect: rectOf(el) })) : []);

  return {
    left: { rect: left, panes: panes(leftKept) },
    right: { rect: right, panes: panes(rightOpen ? rightShell : null) },
    bottom: { rect: below, row: true, panes: panes(band) },
  };
}

function paintBox(el, rect) {
  el.style.left = `${rect.left}px`;
  el.style.top = `${rect.top}px`;
  el.style.width = `${rect.right - rect.left}px`;
  el.style.height = `${rect.bottom - rect.top}px`;
}

/**
 * Drag `key` (a pane, or `code` for the whole dock) to where it should stand.
 * Over the preview nothing is lit, and letting go there moves nothing.
 */
export function beginPaneDrag(win, key, label) {
  const doc = win.document;
  const keys = keysOf(key);
  const areas = dropAreas(win, keys);
  const boxes = Object.entries(areas).map(([zone, area]) => {
    const el = doc.createElement('div');

    el.setAttribute(DROP_ATTR, zone);
    paintBox(el, area.rect);
    doc.body.appendChild(el);

    return el;
  });
  const chip = doc.createElement('div');

  chip.setAttribute(DROP_ATTR, 'chip');
  chip.textContent = label;
  doc.body.appendChild(chip);

  let target = null;

  beginOverlayDrag(
    win,
    'grabbing',
    (event) => {
      chip.style.left = `${event.clientX + 12}px`;
      chip.style.top = `${event.clientY + 12}px`;
      target = dropTarget({ x: event.clientX, y: event.clientY }, areas);
      boxes.forEach((el) => el.toggleAttribute('data-on', el.getAttribute(DROP_ATTR) === target?.zone));
    },
    () => {
      boxes.forEach((el) => el.remove());
      chip.remove();

      if (target) {
        movePane(win, key, target.zone, target.before);
      }
    },
    'data-sve-zone-drag-shield'
  );
}

/** What dropping does; the probes and the drag go through here. */
export function movePane(win, key, zone, before = '') {
  const doc = win.document;
  const keys = keysOf(key);
  const shell = zone === 'left' ? leftKept : zone === 'bottom' ? doc.getElementById(BOTTOM_ZONE_ID) : doc.getElementById(RIGHT_DOCK_ID);
  const inZone = shell ? shellPanes(shell).map(paneKeyOf).filter(Boolean) : [];

  chromeSet(win, ZONES_KEY, JSON.stringify(withZone(storedZones(win), key, zone)));
  storeOrder(win, orderWith(storedOrder(win), inZone, keys, before));
  // Put there by hand: it stays when another tool opens.
  keys.filter((one) => !isFixedPane(one)).forEach((one) => pinPane(win, one));
  applyZones(win);
}

/** The grip's words: in a zone it reaches the other zones too. */
export function zoneGripTitle(win) {
  return t(win, 'panel_zone_drag');
}

export function zoneCss() {
  return `
#${LEFT_ZONE_ID} {
  position: relative;
  right: auto;
  z-index: auto;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  border-left: 0;
  background: transparent;
}
#${LEFT_ZONE_ID} > [data-sve-right-resize] {
  display: none;
}
#${BOTTOM_ZONE_ID} {
  bottom: 0;
  flex-direction: column;
  border-left: 0;
  border-top: 1px solid rgba(128,128,128,.28);
}
#${BOTTOM_ZONE_ID} > [data-sve-right-resize] {
  flex: 0 0 0.75rem;
  width: auto;
  height: 0.75rem;
  cursor: ns-resize;
  background-size: 1.0625rem 0.4375rem;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 17 7'><g fill='%23a1a1aa' fill-rule='evenodd'><rect width='2' height='2' rx='1'/><rect width='2' height='2' x='5' rx='1'/><rect width='2' height='2' x='10' rx='1'/><rect width='2' height='2' x='15' rx='1'/><rect width='2' height='2' y='5' rx='1'/><rect width='2' height='2' x='5' y='5' rx='1'/><rect width='2' height='2' x='10' y='5' rx='1'/><rect width='2' height='2' x='15' y='5' rx='1'/></g></svg>");
}
#${BOTTOM_ZONE_ID} [data-sve-right-slot] {
  flex-direction: row;
}
#${BOTTOM_ZONE_ID} [data-sve-right-split] {
  flex: 0 0 0.75rem;
  cursor: ew-resize;
  background-size: 0.3125rem 0.6875rem;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 11'><g fill='%23a1a1aa' fill-rule='evenodd'><rect width='2' height='2' rx='1'/><rect width='2' height='2' y='3' rx='1'/><rect width='2' height='2' y='6' rx='1'/><rect width='2' height='2' y='9' rx='1'/><rect width='2' height='2' x='3' rx='1'/><rect width='2' height='2' x='3' y='3' rx='1'/><rect width='2' height='2' x='3' y='6' rx='1'/><rect width='2' height='2' x='3' y='9' rx='1'/></g></svg>");
}
[data-sve-code-slot] {
  padding: 0 !important;
}
#${BUILD_PANEL_ID} > [data-sve-build-wrap] > [data-sve-build-body] {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
[${DROP_ATTR}] {
  position: fixed;
  z-index: 2147483647;
  box-sizing: border-box;
  pointer-events: none;
  border: 1px dashed rgba(128,128,128,.6);
  background: rgba(56,88,233,.04);
}
[${DROP_ATTR}][data-on] {
  border: 2px solid var(--theme-color-primary, #3858e9);
  background: rgba(56,88,233,.18);
}
[${DROP_ATTR}="chip"] {
  left: -100rem;
  border: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: var(--theme-color-primary, #3858e9);
  color: #fff;
  font: 500 0.75rem ui-sans-serif, system-ui, sans-serif;
  white-space: nowrap;
}
`;
}
