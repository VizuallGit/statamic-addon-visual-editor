/**
 * X-ray: reading the preview document — which elements are grids, flex rows
 * and boxes, and where their lines are right now.
 *
 * Two steps on purpose. `scanScope` walks the DOM and asks every element its
 * `display`; that is the expensive half and runs only when the page changed.
 * `measureGrid` / `measureFlex` read the rects and the resolved tracks of the
 * few containers found; that is cheap and runs on every frame that draws, so
 * scrolling and typing follow without a rescan.
 *
 * Everything here reads; nothing writes to the page.
 *
 * May import: cp/xray/measure.js.
 */
import {
  declaredSpan,
  elementLabel,
  emptyCells,
  flexArrow,
  isSubgridValue,
  parseGap,
  parseTracks,
  spanOf,
  trackOffsets,
} from './measure.js';

/** Past this, the boxes layer stops adding outlines: a wall of lines says nothing. */
const MAX_BOXES = 3000;

/**
 * The editor's own nodes in the preview: toolbars and belts (`__sve-*` ids),
 * drag ghosts and drop slots, global-section badges, this canvas. Not
 * `sve-*` classes — the bridge adds those to the site's own elements
 * (`sve-dragging`, `sve-global-focus`), and those are the page.
 */
const EDITOR_NODES =
  '[id^="__sve"], [data-sve-ghost], [data-sve-drop-slot], [data-sve-global-badge], [data-sve-global-label], [data-sve-bard-set-inserter]';

export function isEditorNode(el) {
  return !!el?.closest?.(EDITOR_NODES);
}

/** The outermost element carrying `data-sid` above `from` — the section. */
export function outermostSid(from) {
  let last = from?.hasAttribute?.('data-sid') ? from : null;
  let el = from?.parentElement || null;

  while (el) {
    if (el.hasAttribute?.('data-sid')) {
      last = el;
    }

    el = el.parentElement;
  }

  return last;
}

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'TEMPLATE', 'NOSCRIPT', 'BR', 'WBR']);

/**
 * Walk the roots once and sort what is there.
 *
 * @returns {{ grids: Element[], flexes: Element[], boxes: Element[] }}
 */
export function scanScope(pwin, roots, layers) {
  const grids = [];
  const flexes = [];
  const boxes = [];
  const seen = new Set();

  for (const root of roots) {
    if (!root) {
      continue;
    }

    const all = [root, ...root.querySelectorAll('*')];

    for (const el of all) {
      // An icon's inner paths are the icon, not layout.
      const insideSvg = el.tagName.toLowerCase() !== 'svg' && el.closest('svg') !== null;

      if (seen.has(el) || SKIP_TAGS.has(el.tagName) || insideSvg) {
        continue;
      }

      seen.add(el);

      if (isEditorNode(el)) {
        continue;
      }

      const display = pwin.getComputedStyle(el).display;

      if (display === 'none' || display === 'contents') {
        continue;
      }

      if (layers.grid && display.includes('grid')) {
        grids.push(el);
      } else if (layers.flex && display.includes('flex')) {
        flexes.push(el);
      }

      if (layers.boxes && boxes.length < MAX_BOXES) {
        boxes.push(el);
      }
    }
  }

  return { grids, flexes, boxes };
}

/** The content box inside border and padding, in the preview's viewport. */
export function contentBox(rect, cs) {
  const bl = parseFloat(cs.borderLeftWidth) || 0;
  const br = parseFloat(cs.borderRightWidth) || 0;
  const bt = parseFloat(cs.borderTopWidth) || 0;
  const bb = parseFloat(cs.borderBottomWidth) || 0;
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pr = parseFloat(cs.paddingRight) || 0;
  const pt = parseFloat(cs.paddingTop) || 0;
  const pb = parseFloat(cs.paddingBottom) || 0;

  return {
    x: rect.left + bl + pl,
    y: rect.top + bt + pt,
    w: Math.max(0, rect.width - bl - br - pl - pr),
    h: Math.max(0, rect.height - bt - bb - pt - pb),
  };
}

/** In-flow children: the ones the grid or flex row actually lays out. */
function laidOutChildren(pwin, el) {
  const out = [];

  for (const child of el.children) {
    if (SKIP_TAGS.has(child.tagName) || isEditorNode(child)) {
      continue;
    }

    const cs = pwin.getComputedStyle(child);

    if (cs.display === 'none' || cs.position === 'absolute' || cs.position === 'fixed') {
      continue;
    }

    const rect = child.getBoundingClientRect();

    if (rect.width <= 0 && rect.height <= 0) {
      continue;
    }

    out.push({ el: child, cs, rect });
  }

  return out;
}

/** Absolute tracks from offsets measured off the content edge. */
const shift = (tracks, by) => tracks.map((track) => ({ start: track.start + by, end: track.end + by }));

/**
 * A subgridded axis has no tracks of its own: they are the parent's, over the
 * stretch of the parent the subgrid spans. Read them off the parent's measured
 * lines rather than guessed from the child's styles — and over the subgrid's
 * border box, not its content box: the spec folds a subgrid's padding into
 * its edge tracks, so a card with `p-600` still spans all four of its rows
 * (measured: the content box missed the last one).
 */
function borrowedTracks(parentTracks, from, to) {
  const span = parentTracks ? spanOf(parentTracks, from, to) : null;

  if (!span) {
    return [];
  }

  return parentTracks.slice(span[0], span[1] + 1).map((track) => ({
    start: Math.max(track.start, from),
    end: Math.min(track.end, to),
  }));
}

/**
 * Where one grid's lines are, which tracks each child covers and which cells
 * are empty.
 *
 * `measured` maps an already measured grid element to its result, so a
 * subgrid finds its parent's lines (parents are measured first — `scanScope`
 * lists them in document order).
 */
export function measureGrid(pwin, el, measured = new Map()) {
  const rect = el.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const cs = pwin.getComputedStyle(el);
  const box = contentBox(rect, cs);
  const colGap = parseGap(cs.columnGap);
  const rowGap = parseGap(cs.rowGap);
  const parent = measured.get(el.parentElement) || null;
  const subCols = isSubgridValue(cs.gridTemplateColumns);
  const subRows = isSubgridValue(cs.gridTemplateRows);

  // A grid that scrolls its own content (overflow: auto) carries its tracks
  // with the scroll. Right-to-left grids are not mirrored yet.
  let cols = subCols
    ? borrowedTracks(parent?.cols, rect.left, rect.right)
    : shift(trackOffsets(parseTracks(cs.gridTemplateColumns), colGap, box.w, cs.justifyContent), box.x - el.scrollLeft);
  let rows = subRows
    ? borrowedTracks(parent?.rows, rect.top, rect.bottom)
    : shift(trackOffsets(parseTracks(cs.gridTemplateRows), rowGap, box.h, cs.alignContent), box.y - el.scrollTop);

  // A grid with nothing resolved on an axis (no tracks reported) is one track
  // the size of the box — still a grid, and still worth its outline.
  if (!cols.length) {
    cols = [{ start: box.x, end: box.x + box.w }];
  }

  if (!rows.length) {
    rows = [{ start: box.y, end: box.y + box.h }];
  }

  const items = laidOutChildren(pwin, el).map(({ el: child, cs: childCs, rect: childRect }) => {
    let col = spanOf(cols, childRect.left, childRect.right);
    let row = spanOf(rows, childRect.top, childRect.bottom);
    const colSpan = declaredSpan(childCs.gridColumnStart, childCs.gridColumnEnd);
    const rowSpan = declaredSpan(childCs.gridRowStart, childCs.gridRowEnd);

    // An item narrower than its area (justify-self: start, a max-width) only
    // overlaps its first track; a declared span says how far the area reaches.
    if (col && colSpan) {
      col = [col[0], Math.min(cols.length - 1, col[0] + colSpan - 1)];
    }

    if (row && rowSpan) {
      row = [row[0], Math.min(rows.length - 1, row[0] + rowSpan - 1)];
    }

    return { el: child, rect: childRect, col, row };
  });

  const result = {
    el,
    rect,
    box,
    cols,
    rows,
    colGap,
    rowGap,
    subCols,
    subRows,
    items,
    empty: emptyCells(cols.length, rows.length, items),
    label: elementLabel(el.tagName, el.getAttribute('class')),
  };

  measured.set(el, result);

  return result;
}

/** A flex row or column: its box, its direction and the space between its items. */
export function measureFlex(pwin, el) {
  const rect = el.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const cs = pwin.getComputedStyle(el);
  const column = cs.flexDirection.startsWith('column');
  const children = laidOutChildren(pwin, el);
  const gaps = [];

  // Neighbours in the source are neighbours on the line (reversed or not);
  // two that do not overlap across the main axis are on different lines.
  for (let i = 1; i < children.length; i++) {
    const a = children[i - 1].rect;
    const b = children[i].rect;

    if (column) {
      const left = Math.max(a.left, b.left);
      const right = Math.min(a.right, b.right);
      const top = b.top >= a.bottom ? a.bottom : a.top >= b.bottom ? b.bottom : null;
      const bottom = b.top >= a.bottom ? b.top : a.top >= b.bottom ? a.top : null;

      if (right > left && top !== null && bottom - top > 0.5) {
        gaps.push({ x: left, y: top, w: right - left, h: bottom - top });
      }
    } else {
      const top = Math.max(a.top, b.top);
      const bottom = Math.min(a.bottom, b.bottom);
      const left = b.left >= a.right ? a.right : a.left >= b.right ? b.right : null;
      const right = b.left >= a.right ? b.left : a.left >= b.right ? a.left : null;

      if (bottom > top && left !== null && right - left > 0.5) {
        gaps.push({ x: left, y: top, w: right - left, h: bottom - top });
      }
    }
  }

  return {
    el,
    rect,
    gaps,
    arrow: flexArrow(cs.flexDirection),
    wrap: cs.flexWrap !== 'nowrap',
    label: elementLabel(el.tagName, el.getAttribute('class')),
  };
}

/** Margin, border, padding and content of one element — the hover picture. */
export function measureBoxModel(pwin, el) {
  const rect = el.getBoundingClientRect();
  const cs = pwin.getComputedStyle(el);
  const num = (value) => parseFloat(value) || 0;
  const m = { t: num(cs.marginTop), r: num(cs.marginRight), b: num(cs.marginBottom), l: num(cs.marginLeft) };
  const bd = { t: num(cs.borderTopWidth), r: num(cs.borderRightWidth), b: num(cs.borderBottomWidth), l: num(cs.borderLeftWidth) };
  const p = { t: num(cs.paddingTop), r: num(cs.paddingRight), b: num(cs.paddingBottom), l: num(cs.paddingLeft) };

  return {
    el,
    rect,
    margin: m,
    border: bd,
    padding: p,
    label: elementLabel(el.tagName, el.getAttribute('class')),
  };
}
