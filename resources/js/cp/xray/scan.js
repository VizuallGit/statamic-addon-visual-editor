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
  firstFamily,
  flexArrow,
  isSubgridValue,
  parseGap,
  parseTracks,
  spanOf,
  trackOffsets,
} from './measure.js';

/** Past this, the boxes layer stops adding outlines: a wall of lines says nothing. */
const MAX_BOXES = 3000;

/** Past this, the type layer stops adding labels. */
const MAX_TEXTS = 400;

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

/** Does the element hold words of its own (not only through children)? */
function ownsText(el) {
  for (const node of el.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) {
      return true;
    }
  }

  return false;
}

/**
 * Does something above clip this element sideways? Then it cannot push the
 * page wider, whatever its box says — a slider's track is meant to run on.
 */
function clippedSideways(pwin, el) {
  for (let up = el.parentElement; up && up !== el.ownerDocument.documentElement; up = up.parentElement) {
    const x = pwin.getComputedStyle(up).overflowX;

    if (x !== 'visible') {
      return true;
    }
  }

  return false;
}

/**
 * Walk the roots once and sort what is there.
 *
 * `texts` are the elements a type label goes on: they hold words of their own,
 * and are blocks — or inline runs set in a different size than their parent
 * (a `<b>` inside a `<p>` is the paragraph's type, a `<small>` is not).
 * `overflow` are the ones that reach past the page's edge and are not clipped
 * by anything above them: the ones that make a phone scroll sideways.
 *
 * @returns {{ grids: Element[], flexes: Element[], boxes: Element[], texts: Element[], overflow: Element[] }}
 */
export function scanScope(pwin, roots, layers) {
  const grids = [];
  const flexes = [];
  const boxes = [];
  const texts = [];
  const overflow = [];
  const seen = new Set();
  const doc = roots[0]?.ownerDocument;
  const pageWidth = doc ? doc.documentElement.clientWidth : 0;

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

      const cs = pwin.getComputedStyle(el);
      const display = cs.display;

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

      if (layers.type && texts.length < MAX_TEXTS && ownsText(el)) {
        const inline = display.startsWith('inline') && !display.includes('block') && !display.includes('flex') && !display.includes('grid');
        const parent = el.parentElement;

        if (!inline || !parent || pwin.getComputedStyle(parent).fontSize !== cs.fontSize) {
          texts.push(el);
        }
      }

      if (layers.overflow && cs.position !== 'fixed' && pageWidth) {
        const r = el.getBoundingClientRect();

        if (r.width > 0 && (r.right > pageWidth + 0.5 || r.left < -0.5) && !clippedSideways(pwin, el)) {
          overflow.push(el);
        }
      }
    }
  }

  // Only the outermost offender: its children overflow because it does.
  const outermost = overflow.filter((el) => !overflow.some((other) => other !== el && other.contains(el)));

  return { grids, flexes, boxes, texts, overflow: outermost };
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

/** The type an element is set in, for its label. */
export function measureText(pwin, el) {
  const rect = el.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const cs = pwin.getComputedStyle(el);
  const size = parseFloat(cs.fontSize) || 0;
  const leading = cs.lineHeight === 'normal' ? 0 : parseFloat(cs.lineHeight) || 0;

  return {
    el,
    rect,
    tag: el.tagName.toLowerCase(),
    size,
    leading,
    family: firstFamily(cs.fontFamily),
    weight: Number(cs.fontWeight) || 400,
  };
}

/** How far past the page's edge an element reaches, on each side. */
export function measureOverflow(el, pageWidth) {
  const rect = el.getBoundingClientRect();

  return {
    el,
    rect,
    right: Math.max(0, rect.right - pageWidth),
    left: Math.max(0, -rect.left),
    label: elementLabel(el.tagName, el.getAttribute('class')),
  };
}

/**
 * The space around one element, the way Figma's red lines show it: up to the
 * nearest neighbour on each side that faces it, or to the inside of the parent
 * when there is none.
 *
 * @returns {{ rect: DOMRect, lines: { axis: 'x'|'y', from: number, to: number, at: number, size: number }[] }}
 */
export function measureSpacing(pwin, el) {
  const rect = el.getBoundingClientRect();
  const parent = el.parentElement;

  if (!parent || rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const pr = parent.getBoundingClientRect();
  const pcs = pwin.getComputedStyle(parent);
  const inner = {
    top: pr.top + (parseFloat(pcs.borderTopWidth) || 0),
    bottom: pr.bottom - (parseFloat(pcs.borderBottomWidth) || 0),
    left: pr.left + (parseFloat(pcs.borderLeftWidth) || 0),
    right: pr.right - (parseFloat(pcs.borderRightWidth) || 0),
  };
  const peers = laidOutChildren(pwin, parent).filter((peer) => peer.el !== el).map((peer) => peer.rect);
  const acrossX = (r) => r.left < rect.right && r.right > rect.left;
  const acrossY = (r) => r.top < rect.bottom && r.bottom > rect.top;
  const midX = (rect.left + rect.right) / 2;
  const midY = (rect.top + rect.bottom) / 2;

  const above = Math.max(inner.top, ...peers.filter((r) => acrossX(r) && r.bottom <= rect.top + 0.5).map((r) => r.bottom));
  const below = Math.min(inner.bottom, ...peers.filter((r) => acrossX(r) && r.top >= rect.bottom - 0.5).map((r) => r.top));
  const before = Math.max(inner.left, ...peers.filter((r) => acrossY(r) && r.right <= rect.left + 0.5).map((r) => r.right));
  const after = Math.min(inner.right, ...peers.filter((r) => acrossY(r) && r.left >= rect.right - 0.5).map((r) => r.left));

  const lines = [
    { axis: 'y', from: above, to: rect.top, at: midX },
    { axis: 'y', from: rect.bottom, to: below, at: midX },
    { axis: 'x', from: before, to: rect.left, at: midY },
    { axis: 'x', from: rect.right, to: after, at: midY },
  ]
    .map((line) => ({ ...line, size: line.to - line.from }))
    .filter((line) => line.size > 0.5);

  return { el, rect, lines };
}
