/**
 * The dock's panes apart: HTML in one zone, CSS in another, each where the user
 * dragged it.
 *
 * Owner: the dock, for panel zones (panel-zones.js). The panes never leave the
 * dock in the DOM. Everything that finds them, the dock's 190 rules, Instant, the
 * tree, keeps finding them, and an editor keeps its text, cursor and undo. What
 * stands in a zone is a slot: an empty pane of the sidebar stack, with the pane
 * laid over it `position: fixed`, following it by one ResizeObserver.
 *
 * Together (all of it below, alone) none of this runs and the dock places itself
 * as it always has. The row of switches goes with the first pane that is shown.
 *
 * May import: panel-zones.js, cp/panel-zones/, lib/.
 */
import { CODE_PANES } from '../cp/panel-zones/layout.js';
import { BOTTOM_ZONE_ID, CODE_SLOT_ID, RIGHT_DOCK_ID } from '../lib/ids.js';
import { addToZone, beginPaneDrag, codeTogether, settleZones, storedZones, zoneGripTitle, zonesOn } from '../panel-zones.js';
import { t } from '../lib/i18n.js';

export const SPLIT_ATTR = 'data-sve-dock-split';
const GRIP_ATTR = 'data-sve-zone-grip';
const OFF_ATTR = 'data-sve-zone-off';

const GRIP =
  '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
  + '<circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/>'
  + '<circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/>'
  + '<circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>';

let watch = null;

export function isSplit(dock) {
  return !!dock?.hasAttribute(SPLIT_ATTR);
}

function shown(doc) {
  return doc.documentElement.hasAttribute('data-sve-build-dock-shown');
}

function paneEl(dock, handle) {
  return dock.querySelector(`[data-sve-code-pane="${handle}"]`);
}

function slotOf(doc, handle) {
  return doc.getElementById(CODE_SLOT_ID(handle));
}

function visibleHandles(dock) {
  return CODE_PANES.filter((handle) => paneEl(dock, handle)?.style.display !== 'none');
}

/** The grips: one in the row of switches for the whole dock, one in each pane's label for that pane. */
function syncGrips(win, dock) {
  const on = zonesOn(win);
  const place = (holder, key) => {
    let grip = holder?.querySelector(`:scope > [${GRIP_ATTR}]`);

    if (!on) {
      grip?.remove();

      return;
    }

    if (holder && !grip) {
      grip = dock.ownerDocument.createElement('button');
      grip.type = 'button';
      grip.setAttribute(GRIP_ATTR, key);
      grip.innerHTML = GRIP;
      grip.title = zoneGripTitle(win);
      holder.insertBefore(grip, holder.firstChild);
    }
  };

  place(dock.querySelector('[data-sve-code-bar]'), 'code');
  CODE_PANES.forEach((handle) => place(paneEl(dock, handle)?.querySelector('[data-sve-code-pane-label]'), `code_${handle}`));

  if (dock._sveZoneGripBound) {
    return;
  }

  dock._sveZoneGripBound = true;
  dock.addEventListener('mousedown', (event) => {
    const grip = event.target.closest?.(`[${GRIP_ATTR}]`);

    if (!grip || event.button !== 0) {
      return;
    }

    event.preventDefault();

    const key = grip.getAttribute(GRIP_ATTR);
    const word = key === 'code' ? 'panel_zone_dock' : `code_dock_${key.slice(5)}`;

    beginPaneDrag(win, key, t(win, word));
  });
}

function position(win, dock) {
  const doc = win.document;

  for (const handle of CODE_PANES) {
    const pane = paneEl(dock, handle);
    const slot = slotOf(doc, handle);

    if (!pane || !slot) {
      continue;
    }

    const r = slot.getBoundingClientRect();

    pane.toggleAttribute(OFF_ATTR, r.width < 2 || r.height < 2);
    pane.style.left = `${Math.round(r.left)}px`;
    pane.style.top = `${Math.round(r.top)}px`;
    pane.style.width = `${Math.round(r.width)}px`;
    pane.style.height = `${Math.round(r.height)}px`;
  }
}

function stopWatching() {
  watch?.observer.disconnect();
  watch = null;
}

/**
 * A pane lies over a shell in the same band, so the dock has to come later in the
 * page. A shell made after it would be drawn over its panes.
 */
function keepOverShells(dock) {
  const parent = dock.parentElement;
  const shells = parent ? [...parent.querySelectorAll(`:scope > #${RIGHT_DOCK_ID}, :scope > #${BOTTOM_ZONE_ID}`)] : [];

  if (shells.some((el) => dock.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) {
    parent.appendChild(dock);
  }
}

function barHome(dock) {
  return paneEl(dock, visibleHandles(dock)[0] || 'html');
}

function split(win, dock, afterMove) {
  const doc = win.document;
  const wanted = visibleHandles(dock);
  // Placing asks often (every sidebar move does): the same panes in the same zones only follow.
  const shape = JSON.stringify([wanted, storedZones(win)]);

  if (dock._sveSplitShape === shape && isSplit(dock)) {
    keepOverShells(dock);
    position(win, dock);

    return;
  }

  dock._sveSplitShape = shape;
  dock.setAttribute(SPLIT_ATTR, '');
  doc.querySelector('.live-preview-contents')?.style.removeProperty('padding-bottom');

  CODE_PANES.forEach((handle) => {
    let slot = slotOf(doc, handle);

    if (!wanted.includes(handle)) {
      slot?.remove();

      return;
    }

    if (!slot) {
      slot = doc.createElement('div');
      slot.id = CODE_SLOT_ID(handle);
      slot.setAttribute('data-sve-code-slot', handle);
    }

    addToZone(win, slot, `code_${handle}`);
  });

  const home = barHome(dock);
  const bar = dock.querySelector('[data-sve-code-bar]');
  const banner = dock.querySelector('[data-sve-code-lock-banner]');

  if (home && bar && bar.parentElement !== home) {
    home.prepend(bar, banner);
  }

  keepOverShells(dock);
  settleZones(win);
  stopWatching();

  const observer = new win.ResizeObserver(() => {
    position(win, dock);
    afterMove();
  });

  wanted.forEach((handle) => observer.observe(slotOf(doc, handle)));
  watch = { observer };
  position(win, dock);
}

function join(win, dock) {
  const doc = win.document;

  stopWatching();
  dock._sveSplitShape = '';
  dock.removeAttribute(SPLIT_ATTR);

  const root = dock.querySelector('.sve-code-dock');
  const panes = dock.querySelector('[data-sve-code-panes]');
  const bar = dock.querySelector('[data-sve-code-bar]');
  const banner = dock.querySelector('[data-sve-code-lock-banner]');

  if (root && panes && bar && bar.parentElement !== root) {
    root.insertBefore(bar, panes);
    root.insertBefore(banner, panes);
  }

  CODE_PANES.forEach((handle) => {
    const pane = paneEl(dock, handle);

    if (pane) {
      pane.removeAttribute(OFF_ATTR);
      pane.style.left = '';
      pane.style.top = '';
      pane.style.width = '';
      pane.style.height = '';
    }

    slotOf(doc, handle)?.remove();
  });

  settleZones(win);
}

/** The dock closed: the slots it held in the zones go with it. */
export function removeDockSlots(doc) {
  if (!doc) {
    return;
  }

  stopWatching();

  const win = doc.defaultView;
  const had = CODE_PANES.map((handle) => slotOf(doc, handle)).filter(Boolean);

  had.forEach((slot) => slot.remove());

  if (had.length && zonesOn(win)) {
    settleZones(win);
  }
}

/**
 * Answers true when the panes stand apart, and the caller's own placing is not
 * wanted. `afterMove` sizes the editors, each time the panes have followed a slot.
 */
export function placeDockPanes(win, dock, afterMove) {
  syncGrips(win, dock);

  const apart = zonesOn(win) && shown(win.document) && !codeTogether(win);

  if (apart) {
    split(win, dock, afterMove);

    return true;
  }

  if (isSplit(dock)) {
    join(win, dock);
  }

  return false;
}
