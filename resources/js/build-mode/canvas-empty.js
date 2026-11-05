/**
 * Room for what is empty on Build's canvas. An element with nothing in it
 * stands open and dashed (`CANVAS_EMPTY`), so it can be seen, picked and
 * dropped into: in the open section the paint stamps it from the file
 * (canvas-paint.js); in every other section it is found here, on the page as
 * the real preview rendered it — so a grid built in one section keeps its
 * cells while another is open.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: build-mode/canvas-paint.js, build-mode/catalog.js, cp/xray/measure.js. The canvas's
 *   document is handed in; nothing else is read or written.
 * Bus messages: none.
 *
 * Found rather than stamped from a file, a box is stamped only where it would
 * fold to nothing — nothing inside, in the page's flow, no height of its own
 * (a grid cell spanning rows is as high as the gaps between them) — so a
 * drawn overlay or a spacer keeps its look. The header and footer are their
 * own (`data-sve-chrome`).
 *
 * A grid's empty cell has one row's room for each row it spans: a cell of two
 * rows stands as high as two cells of one, the gap between them included. An
 * empty grid has the same room for each row it has (`grid-rows-2`): its cells
 * stand as high as an empty cell, not squeezed into one placeholder's height.
 */

import { parseTracks } from '../cp/xray/measure.js';
import { CANVAS_EMPTY, CANVAS_ROOT } from './canvas-paint.js';
import { holdsElements } from './catalog.js';

/** An empty box's height: one row of an empty grid. */
const ROW = '4rem';
/** On a box found empty here, so the next look starts from the page again. */
const FOUND = 'data-sve-build-found';
/** An empty grid cell's room when it spans more than one row. */
const ROOM = '--sve-build-room';
const FLOWS = new Set(['static', 'relative', 'sticky']);

/** The placeholder, in the canvas's own sheet (canvas.js OWN_CSS). */
export const EMPTY_CSS = `[${CANVAS_EMPTY}]{min-height:var(${ROOM},${ROW})!important;outline:1px dashed rgba(56,88,233,.6);outline-offset:-1px}
[${CANVAS_EMPTY}="text"]{min-height:1.5em!important}
[${CANVAS_ROOT}][${CANVAS_EMPTY}]{min-height:8rem!important}`;

/** The rows a grid item spans, from its computed `grid-row-start` and `grid-row-end` (`span 2`, `1` and `3`). */
export function rowsSpanned(start, end) {
  const span = /^span (\d+)$/.exec(String(end ?? '').trim()) || /^span (\d+)$/.exec(String(start ?? '').trim());

  if (span) {
    return Number(span[1]);
  }

  const from = Number.parseInt(start, 10);
  const to = Number.parseInt(end, 10);

  return from > 0 && to > from ? to - from : 1;
}

/** The room of an empty cell spanning `rows`, the grid's computed `row-gap` between them; '' for one row. */
export function roomOf(rows, gap) {
  const between = /^\d/.test(String(gap ?? '')) ? gap : '0px';

  return rows > 1 ? `calc(${rows} * ${ROW} + ${rows - 1} * ${between})` : '';
}

/** A box's height without the gaps between the grid rows it spans (`gap` the computed `row-gap`): 0 for a cell folded to nothing. */
export function ownHeight(height, rows = 1, gap = '') {
  return height - Math.max(0, rows - 1) * (Number.parseFloat(gap) || 0);
}

/** The rows an empty grid has of its own, from its computed `grid-template-rows`: 0 when it is no grid or has none. */
function ownRows(own) {
  return /grid$/.test(own.display) ? parseTracks(own.gridTemplateRows).length : 0;
}

/** What a box found on the page stands as high as: a grid cell without its gaps, an empty grid without the gaps between its rows. */
function heightOf(el, view) {
  const height = el.getBoundingClientRect().height;
  const self = height > 0 ? view.getComputedStyle(el) : null;
  const rows = self ? ownRows(self) : 0;

  if (rows > 1) {
    return ownHeight(height, rows, self.rowGap);
  }

  const grid = height > 0 && el.parentElement ? view.getComputedStyle(el.parentElement) : null;

  if (!grid || !/grid$/.test(grid.display)) {
    return height;
  }

  return ownHeight(height, rowsSpanned(self.gridRowStart, self.gridRowEnd), grid.rowGap);
}

/**
 * The other sections' empty boxes, found again: the last look's stamps come
 * off, then every box with nothing in it that folds to nothing is stamped.
 * Every read comes before the first write: one layout.
 */
export function findEmpties(doc) {
  const body = doc?.body;
  const view = doc?.defaultView;

  if (!body || !view) {
    return;
  }

  body.querySelectorAll(`[${FOUND}]`).forEach((el) => {
    el.removeAttribute(FOUND);
    el.removeAttribute(CANVAS_EMPTY);
  });

  const folded = [...body.querySelectorAll('*')].filter(
    (el) =>
      !el.firstElementChild &&
      !el.hasAttribute(CANVAS_EMPTY) &&
      holdsElements({ tag: el.localName }) &&
      !el.textContent.trim() &&
      !el.closest(`[${CANVAS_ROOT}], [data-sve-chrome]`) &&
      FLOWS.has(view.getComputedStyle(el).position) &&
      el.getClientRects().length > 0 &&
      heightOf(el, view) < 0.5
  );

  folded.forEach((el) => {
    el.setAttribute(CANVAS_EMPTY, 'box');
    el.setAttribute(FOUND, '');
  });
}

/** Each empty grid cell and empty grid under `scope` (itself included) gets its rows' room; one of one row the plain placeholder. */
export function fitRows(scope) {
  const view = scope?.ownerDocument?.defaultView;

  if (!view) {
    return;
  }

  const cells = [...(scope.matches(`[${CANVAS_EMPTY}]`) ? [scope] : []), ...scope.querySelectorAll(`[${CANVAS_EMPTY}]`)];
  const rooms = cells.map((el) => {
    const own = view.getComputedStyle(el);
    const rows = ownRows(own);

    if (rows > 1) {
      return roomOf(rows, own.rowGap);
    }

    const grid = el.parentElement && view.getComputedStyle(el.parentElement);

    if (!grid || !/grid$/.test(grid.display)) {
      return '';
    }

    return roomOf(rowsSpanned(own.gridRowStart, own.gridRowEnd), grid.rowGap);
  });

  cells.forEach((el, i) => {
    if (rooms[i]) {
      if (el.style.getPropertyValue(ROOM) !== rooms[i]) {
        el.style.setProperty(ROOM, rooms[i]);
      }
    } else if (el.style.getPropertyValue(ROOM)) {
      el.style.removeProperty(ROOM);
    }
  });
}
