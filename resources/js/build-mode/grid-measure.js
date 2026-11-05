/**
 * A grid as the frame lays it out right now: its content box, the column and
 * row tracks the browser resolved (implicit ones included), and the cells each
 * child covers — at the width the preview has, so at the size being edited.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: cp/xray/measure.js. Reads the DOM it is handed; writes nothing.
 * Bus messages: none.
 *
 * The same reading for everything that shows a grid: the builder over the
 * preview (columns-overlay.js) and Style's grid fields and popup (the port's
 * `gridAround`). Boxes are in the frame's own CSS pixels, from its viewport.
 */

import { emptyCells, parseGap, parseTracks, spanOf, trackOffsets } from '../cp/xray/measure.js';

/** Whether an element lays its children out as a grid. */
export function isGrid(el) {
  if (!el?.ownerDocument?.defaultView) {
    return false;
  }

  return /^(inline-)?grid$/.test(el.ownerDocument.defaultView.getComputedStyle(el).display);
}

/** A child the grid places: in the flow, and drawn. */
function placed(kid) {
  const cs = kid.ownerDocument.defaultView.getComputedStyle(kid);

  return cs.display !== 'none' && cs.display !== 'contents' && cs.position !== 'absolute' && cs.position !== 'fixed';
}

/**
 * @param {Element} el    a grid (isGrid)
 * @param {string}  attr  the path attribute on the file's elements (`data-sve-build-path`)
 * @returns {{
 *   box: { x: number, y: number, w: number, h: number },
 *   cols: { start: number, end: number }[], rows: { start: number, end: number }[],
 *   items: { el: Element, path: string, col: number[]|null, row: number[]|null }[],
 *   empty: number[][], flow: string
 * }}
 *   `items` every child the grid places, `path` '' for one the file does not
 *   name (a loop's item); `empty` the cells no child covers, `[col, row]` —
 *   in an empty grid with no rows of its own, its one row's.
 */
export function measureGrid(el, attr) {
  const cs = el.ownerDocument.defaultView.getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const px = (value) => parseFloat(value) || 0;
  const x = r.left + px(cs.borderLeftWidth) + px(cs.paddingLeft);
  const y = r.top + px(cs.borderTopWidth) + px(cs.paddingTop);
  const w = r.width - px(cs.borderLeftWidth) - px(cs.paddingLeft) - px(cs.paddingRight) - px(cs.borderRightWidth);
  const h = r.height - px(cs.borderTopWidth) - px(cs.paddingTop) - px(cs.paddingBottom) - px(cs.borderBottomWidth);
  const cols = trackOffsets(parseTracks(cs.gridTemplateColumns), parseGap(cs.columnGap), w, cs.justifyContent);
  const kids = [...el.children].filter(placed);
  const tracks = trackOffsets(parseTracks(cs.gridTemplateRows), parseGap(cs.rowGap), h, cs.alignContent);
  // A grid with nothing in it and no rows of its own has no row for the browser
  // to name. It is one row — never none — the one its first child would make,
  // so its columns are cells, drawn and offered as any free cell is.
  const rows = tracks.length || kids.length || !cols.length ? tracks : [{ start: 0, end: Math.max(0, h) }];
  const items = kids.map((kid) => {
    const k = kid.getBoundingClientRect();

    return {
      el: kid,
      path: kid.getAttribute(attr) || '',
      col: spanOf(cols, k.left - x, k.right - x),
      row: spanOf(rows, k.top - y, k.bottom - y),
    };
  });

  return {
    box: { x, y, w, h },
    cols,
    rows,
    items,
    empty: emptyCells(cols.length, rows.length, items),
    flow: cs.gridAutoFlow,
  };
}

/**
 * The boxes a grid is outlined in: each child's cells as one — no line
 * through a child spanning two columns or two rows — and every free cell
 * alone. A measured grid (measureGrid) in; `[first, last]` tracks out.
 *
 * @returns {{ col: number[], row: number[] }[]}
 */
export function cellAreas(grid) {
  const seen = new Set();
  const areas = [];

  for (const { col, row } of grid.items) {
    const key = col && row ? `${col}:${row}` : '';

    if (key && !seen.has(key)) {
      seen.add(key);
      areas.push({ col, row });
    }
  }

  return [...areas, ...grid.empty.map(([c, r]) => ({ col: [c, c], row: [r, r] }))];
}

/**
 * Whether a new child with no start of its own would land in `cell`: the
 * grid fills row by row from after the last child, so the first free cell
 * after that one. A grid that fills by column, or packs (`dense`), is never
 * guessed at.
 */
export function nextFreeCell(grid, [col, row]) {
  if (/column|dense/.test(grid.flow || '')) {
    return false;
  }

  const count = grid.cols.length;
  const last = grid.items[grid.items.length - 1];
  const after = last?.col && last?.row ? last.row[0] * count + last.col[1] : -1;
  const first = grid.empty.find(([c, r]) => r * count + c > after);

  return !!first && first[0] === col && first[1] === row;
}
