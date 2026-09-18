/**
 * bridge.js — region "grid", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { orderablePeers, parseCssColor, solidBackgroundFor } from './drag.js';
import { peerRect } from './row-toolbar.js';
import { SID_ATTR, t } from '../bridge.js';
import { MSG, SOURCE } from '../lib/protocol.js';

// ===== grid =====
/** True when el's siblings sit side by side (flex-row, multi-column grid, …). */
export function isHorizontalFlow(win, el) {
  const peers = orderablePeers(el);

  if (peers.length >= 2) {
    const a = peerRect(peers[0]);
    const b = peerRect(peers[1]);

    return Math.abs(a.left - b.left) > Math.abs(a.top - b.top);
  }

  const parent = el.parentElement;

  if (!parent) {
    return false;
  }

  const style = win.getComputedStyle(parent);

  if (style.display.includes('flex') && !style.flexDirection.startsWith('column')) {
    return true;
  }

  if (style.display.includes('grid')) {
    const cols = style.gridTemplateColumns;

    return Boolean(cols) && cols !== 'none' && cols.trim().split(/\s+/).length > 1;
  }

  return false;
}

// --- Column builder: visual width drag + add column ------------------------------
//
// Column blocks live in a CSS grid inside a section annotated with
// data-sid-type="columns". Hovering a block shows a resize handle on the
// boundary to its row neighbour; dragging it snaps both blocks to the grid's
// tracks (live, via inline grid-column) and a badge reads out the split.
// Releasing posts the new spans to the CP, which writes the breakpoint's
// col_w_* fields (m <768, t <1024, d otherwise — the same buckets the column
// builder's own width widget uses). A "+" pill in the grid's corner asks the CP
// to click the column builder's own "Add column" button.
//
// The same handle serves a second kind of grid: any container a template opts in
// with `{{ visual_edit grid_view="true" }}`. There the blocks are ordinary
// replicator rows, and what gets written is a span field on the row (per
// breakpoint, if the field is responsive) rather than column-builder classes.
// Two things differ, and only two: what a release writes, and that the tracks
// are drawn while you drag — a column builder row IS the grid, but a hero block
// sits in a grid nobody can see.

const COL_SECTION_SELECTOR = '[data-sid-type="columns"]';

/** `{{ visual_edit grid_view="true" grid="12" }}` on the blocks' container. */
export const GRID_ATTR = 'data-sid-grid';
const GRID_FIELD_ATTR = 'data-sid-grid-field';
const GRID_MIN_ATTR = 'data-sid-grid-min';
const GRID_RESIZE_ATTR = 'data-sid-grid-resize';
const GRID_HANDLES_ATTR = 'data-sid-grid-handles';
const GRID_PREVIEW_ATTR = 'data-sid-grid-preview';
const GRID_OVERLAP_ATTR = 'data-sid-grid-overlap';

let colChrome = null; // { handle, addBtn, pair, grid, mode, lines }
export let widthDrag = null;
export let widthDragJustEnded = false;

function bpFieldForWidth(width) {
  if (width < 768) {
    return { field: 'col_w_m', prefix: '' };
  }

  if (width < 1024) {
    return { field: 'col_w_t', prefix: 'md:' };
  }

  return { field: 'col_w_d', prefix: 'lg:' };
}

/** Track/gap geometry of a resolved CSS grid, in screen pixels. */
function columnGridInfo(win, grid) {
  const style = win.getComputedStyle(grid);
  const tracks = style.gridTemplateColumns.split(' ').length;
  const gap = parseFloat(style.columnGap) || 0;
  const rect = grid.getBoundingClientRect();
  const padLeft = parseFloat(style.paddingLeft) || 0;
  const padRight = parseFloat(style.paddingRight) || 0;
  const width = rect.width - padLeft - padRight;

  return { tracks, gap, unit: (width + gap) / tracks, left: rect.left + padLeft };
}

function spanOf(el, info) {
  return Math.max(1, Math.round((el.getBoundingClientRect().width + info.gap) / info.unit));
}

/**
 * Which column a block currently begins in, counted from 1.
 *
 * Measured off the screen like the span is, and for the same reason: where the
 * block *is* covers both the case where someone put it there and the case where
 * the row simply flowed it there — and the second is what a first drag starts
 * from. Read once at the start of a drag; the pointer moves far too often for
 * this to belong anywhere near it.
 */
function startOf(el, info) {
  return Math.max(1, Math.round((el.getBoundingClientRect().left - info.left) / info.unit) + 1);
}

function onSameRow(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();

  return rb.top < ra.bottom && rb.bottom > ra.top;
}

function visibleColumnsOf(grid, win) {
  return [...grid.children].filter(
    (el) => el.hasAttribute(SID_ATTR) && win.getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0
  );
}

/**
 * The block under the pointer, seen from the grid: the child of an opted-in
 * container that the pointer is somewhere inside.
 *
 * Climbing beats `closest('[data-sid]')` here. A hero block holds annotated
 * elements of its own — a headline, an image — and the nearest one of those has
 * a parent that is no grid, so a pointer over the actual content would find
 * nothing to resize. What matters is which of the grid's own children the
 * pointer is in, however deep.
 */
function gridBlockFor(win, event) {
  const target = event.target;
  let node = target?.nodeType === 1 ? target : (target?.parentElement ?? null);

  for (let i = 0; node && i < 20; i++) {
    const parent = node.parentElement;

    if (parent?.hasAttribute(GRID_ATTR) && node.hasAttribute(SID_ATTR)) {
      return { block: node, grid: parent };
    }

    node = parent;
  }

  // The gap between two blocks belongs to the container, not to either block —
  // and it is exactly what the pointer crosses on its way to the handle. Without
  // falling back to the nearest block here, the chrome is taken down the moment
  // you reach for it, and the handle can never be grabbed at all.
  const grid = target?.closest?.(`[${GRID_ATTR}]`);
  const block = grid ? nearestGridChild(grid, win, event) : null;

  return block ? { block, grid } : null;
}

/** The grid child the pointer is in, or — over a gap — the one it is nearest. */
function nearestGridChild(grid, win, event) {
  let best = null;
  let bestDistance = Infinity;

  for (const el of visibleColumnsOf(grid, win)) {
    const rect = el.getBoundingClientRect();
    const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
    const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
    const distance = dx * dx + dy * dy;

    if (distance < bestDistance) {
      bestDistance = distance;
      best = el;
    }
  }

  return best;
}

/**
 * How many columns to write to, the fewest a block may keep, and which of the
 * two ways of resizing this container asked for.
 *
 * `free` — each block owns its width. Drag it wide enough and the row runs out
 * of room, so the next block wraps underneath; you then go and set that one too.
 *
 * `split` — the boundary between two blocks is what moves. What one gains the
 * other gives up, the row stays full, and 50/50 becomes 66/33 in one gesture.
 *
 * Neither is the right answer everywhere, which is why it is the template that
 * says: a hero of two halves wants `split`, a row of cards wants `free`.
 */
function gridConfig(grid) {
  const declared = parseInt(grid.getAttribute(GRID_ATTR) || '', 10);
  const min = parseInt(grid.getAttribute(GRID_MIN_ATTR) || '', 10);

  return {
    columns: Number.isFinite(declared) && declared > 0 ? declared : null,
    field: grid.getAttribute(GRID_FIELD_ATTR) || 'span',
    min: Number.isFinite(min) && min > 0 ? min : 1,
    split: (grid.getAttribute(GRID_RESIZE_ATTR) || 'free') === 'split',
    // `both` — a handle on each edge, and only where dragging can still change
    // something. `right` — one handle on the trailing edge, always.
    handles: (grid.getAttribute(GRID_HANDLES_ATTR) || 'both') === 'right' ? 'right' : 'both',
    // `live` — the block takes its new width as you drag, row breaks and all.
    // `outline` — only an outline follows the pointer, and the layout is left
    // alone until you let go. Steadier to aim with, at the cost of not seeing
    // what the row does until it is done.
    preview: (grid.getAttribute(GRID_PREVIEW_ATTR) || 'live') === 'outline' ? 'outline' : 'live',
    // Blocks may lie on top of each other, so the leading edge moves the block's
    // starting column instead of only resizing it. Off, a left-edge drag is what
    // it has always been: the same width written with the sign turned round.
    overlap: grid.hasAttribute(GRID_OVERLAP_ATTR),
  };
}

/**
 * White on a dark section, black on a light one — the same reading the hover
 * outlines take, so the two never disagree about which way the page leans.
 *
 * A fixed colour cannot work here: the tracks lie on whatever background the
 * section happens to have, and any hue picked in advance is invisible against
 * some of them. Plain black and white at low opacity are the two that always
 * have somewhere to go.
 */
function gridTone(win, el) {
  const parsed = parseCssColor(solidBackgroundFor(win, el), win);
  const luminance = parsed ? (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255 : 1;

  // White gets a touch less than black: dark overlays on a light page read
  // heavier than light ones on a dark page at the same alpha. `outline` is the
  // same 30% the hover rings use, so a drag outline and a block edge match.
  return luminance < 0.45
    ? { fill: 'rgba(255,255,255,.03)', outline: 'rgba(255, 255, 255, 0.3)', ambient: 'rgba(255, 255, 255, 0.12)' }
    : { fill: 'rgba(0,0,0,.04)', outline: 'rgba(0, 0, 0, 0.3)', ambient: 'rgba(0, 0, 0, 0.12)' };
}

/**
 * The dashed ring, as an inline background.
 *
 * Same four gradients the stylesheet paints around a hovered block, in the same
 * dash and gap. The drag outline is the same kind of thing — "this is the piece
 * we are talking about" — so it should not be a second visual language.
 */
function dashedRing(colour) {
  const stripe = (deg) =>
    `repeating-linear-gradient(${deg}deg, ${colour} 0 8px, transparent 8px 14px)`;

  return [
    `${stripe(90)} top left / 100% 1px no-repeat`,
    `${stripe(90)} bottom left / 100% 1px no-repeat`,
    `${stripe(180)} top left / 1px 100% no-repeat`,
    `${stripe(180)} top right / 1px 100% no-repeat`,
  ].join(',');
}

/**
 * The always-on outline takes its colour once, on the container.
 *
 * Set there rather than on each block because a custom property inherits: one
 * reading of the section's background answers for every block in it, however
 * many get added later.
 */
export function toneOutlineContainer(win, event) {
  const el = event.target?.closest?.('[data-sid-outline]');

  if (!el || el.dataset.sveOutlineToned) {
    return;
  }

  const tone = gridTone(win, el);

  el.dataset.sveOutlineToned = '1';
  el.style.setProperty('--sve-outline-color', tone.outline);
  el.style.setProperty('--sve-outline-ambient', tone.ambient);
}

// The tracks outlive the chrome around them. Moving from one block to the next
// tears the handle down and builds a new one, and lines rebuilt along with it
// would blink at every crossing — so they live here, keyed to their grid, and
// are only really taken down when the pointer leaves for good.
let gridLines = null; // { el, grid, timer }

function removeGridLinesNow() {
  if (!gridLines) {
    return;
  }

  clearTimeout(gridLines.timer);
  gridLines.el.remove();
  gridLines = null;
}

/**
 * How tall the tracks are drawn: the section around the grid, not the grid.
 *
 * The columns only ever came from the grid horizontally — where a track starts
 * and how wide it is. Vertically there is nothing to inherit, so they may as
 * well run the section's full height and read as part of it, instead of
 * stopping short at the padding the blocks happen to sit inside.
 *
 * Deliberately measured rather than fixed by moving the padding onto the blocks:
 * that would change the page itself to suit a ruler that is only on screen while
 * somebody hovers.
 */
function gridLinesBox(grid) {
  const host = grid.parentElement?.closest(`[${SID_ATTR}]`) ?? grid;

  return host.getBoundingClientRect();
}

function positionGridLines() {
  if (!gridLines) {
    return;
  }

  const { el, grid } = gridLines;
  const box = gridLinesBox(grid);
  const info = columnGridInfo(grid.ownerDocument.defaultView, grid);

  el.style.left = `${info.left}px`;
  el.style.top = `${box.top}px`;
  el.style.height = `${box.height}px`;
}

/** Fades out, then goes. `immediate` is for a morph, where the grid it measured is gone. */
export function hideGridLines(immediate = false) {
  if (!gridLines) {
    return;
  }

  if (immediate) {
    removeGridLinesNow();

    return;
  }

  if (gridLines.timer) {
    return; // already on its way out
  }

  const { el } = gridLines;

  el.style.opacity = '0';
  gridLines.timer = setTimeout(() => {
    if (gridLines?.el === el) {
      removeGridLinesNow();
    }
  }, 220);
}

/**
 * The tracks, drawn over the grid.
 *
 * Measured from the resolved grid rather than from the declared column count, so
 * the lines land on the boundaries the browser actually used — gap, padding and
 * a scaled preview included. Faint on purpose: this is a ruler held up against
 * the page, not part of it.
 *
 * Calling it again for the same grid is how a fade already under way is called
 * back — which is what makes crossing from one block to another look like
 * nothing happened at all.
 */
function showGridLines(win, grid, info) {
  if (gridLines && gridLines.grid === grid) {
    clearTimeout(gridLines.timer);
    gridLines.timer = null;
    gridLines.el.style.opacity = '1';
    positionGridLines();

    return;
  }

  removeGridLinesNow();

  const doc = win.document;
  const rect = gridLinesBox(grid);
  const tone = gridTone(win, grid);
  const box = doc.createElement('div');

  box.style.cssText =
    `position:fixed;z-index:2147483644;pointer-events:none;opacity:0;transition:opacity .14s ease;` +
    `left:${info.left}px;top:${rect.top}px;` +
    `width:${info.unit * info.tracks - info.gap}px;height:${rect.height}px;`;

  // The seam between two tracks is what makes them readable as separate columns.
  // Normally the grid's own gap draws it, but a grid with no gap would leave the
  // tracks touching — six of them in one tone is one flat field, and you cannot
  // aim at a column you cannot see the edge of. Below that, the seam is drawn
  // anyway; the tracks stay where they are and only give up a hair of width.
  const seam = Math.max(info.gap, 2);

  for (let i = 0; i < info.tracks; i++) {
    const track = doc.createElement('div');

    track.style.cssText =
      `position:absolute;top:0;bottom:0;left:${i * info.unit}px;width:${info.unit - seam}px;` +
      `background:${tone.fill};`;
    box.appendChild(track);
  }

  doc.documentElement.appendChild(box);
  gridLines = { el: box, grid, timer: null };

  // Next frame: a transition needs a value to move away from, and one set in the
  // same frame as the element is inserted has nothing to move away from.
  win.requestAnimationFrame(() => {
    if (gridLines?.el === box) {
      box.style.opacity = '1';
    }
  });
}

export function hideColumnChrome(win) {
  hideGridLines();

  if (!colChrome) {
    return;
  }

  colChrome.handles.forEach(({ el }) => el.remove());
  colChrome.addBtn?.remove();
  colChrome.grid?.removeAttribute('data-sid-outline-on');
  win.removeEventListener('scroll', colChrome.onScroll, true);
  colChrome = null;
}

function positionColumnChrome() {
  if (!colChrome) {
    return;
  }

  const { handles, addBtn, grid, block } = colChrome;

  positionGridLines();

  for (const { el, side, pair } of handles) {
    let x;
    let top;
    let bottom;

    if (pair) {
      const ra = pair.a.getBoundingClientRect();
      const rb = pair.b.getBoundingClientRect();

      x = (ra.right + rb.left) / 2;
      top = Math.max(ra.top, rb.top);
      bottom = Math.min(ra.bottom, rb.bottom);
    } else {
      // A block owns its own width, so its handle sits on its own edge — not on
      // a boundary shared with a neighbour. Dragging it takes nothing from
      // anyone; the row simply runs out of room and the next block wraps.
      const rect = block.getBoundingClientRect();

      x = side === 'left' ? rect.left : rect.right;
      top = rect.top;
      bottom = rect.bottom;
    }

    // Centred on its own box, so a handle with a bigger grab area than its bar
    // still sits exactly on the edge.
    el.style.left = `${x - el.offsetWidth / 2}px`;
    el.style.top = `${(top + bottom) / 2 - el.offsetHeight / 2}px`;
  }

  if (addBtn) {
    const rect = grid.getBoundingClientRect();

    addBtn.style.left = `${rect.right - 40}px`;
    addBtn.style.top = `${rect.bottom - 40}px`;
  }
}

/**
 * Stay on the block the chrome belongs to while the pointer is still inside it.
 *
 * Where blocks may overlap, the block under the pointer is the topmost one, and
 * that is the wrong answer as soon as one block lies over another: reaching for
 * the handle on the lower block's edge means crossing the upper block, the
 * chrome switches, and the handle is taken down in the very moment you go for
 * it. It cannot be grabbed at all.
 *
 * So the block being worked on keeps the chrome until the pointer leaves its
 * box, whatever is painted on top. Getting to the upper block's own handle means
 * moving into the part of it that isn't shared — which is most of it, since two
 * blocks that overlapped completely would leave nothing to aim at anyway.
 *
 * Only asked where the template opted into overlapping. Everywhere else the
 * topmost block is the only block, and this measures nothing.
 */
function stayOnOverlappedBlock(chrome, event) {
  if (!chrome.grid?.hasAttribute(GRID_OVERLAP_ATTR) || !chrome.block) {
    return false;
  }

  const rect = chrome.block.getBoundingClientRect();

  return (
    event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
  );
}

/**
 * Hovering a column block summons its chrome: the resize handle on the boundary
 * to its row neighbour (right one preferred) and the add-column pill.
 */
export function maybeShowColumnChrome(win, event) {
  if (widthDrag) {
    return;
  }

  if (
    colChrome &&
    (colChrome.handles.some(({ el }) => el.contains(event.target)) ||
      colChrome.addBtn?.contains(event.target) ||
      stayOnOverlappedBlock(colChrome, event))
  ) {
    return;
  }

  // Two ways to be a resizable block, asked in order of how specific they are:
  // a child of a container that opted in with grid_view, or a column-builder
  // column. The first is looked up by climbing, because the pointer is usually
  // over the block's contents rather than the block itself.
  const spanned = gridBlockFor(win, event);
  const block = spanned?.block ?? event.target.closest?.(`[${SID_ATTR}]`);
  const grid = spanned?.grid ?? block?.parentElement;
  const mode = spanned ? 'span' : block?.closest(COL_SECTION_SELECTOR) ? 'columns' : null;

  if (!block || !mode || !grid || win.getComputedStyle(grid).display !== 'grid') {
    hideColumnChrome(win);

    return;
  }

  const config = mode === 'span' ? gridConfig(grid) : null;

  // VISUAL order, not DOM order: per-breakpoint `order` CSS (order_m/t/d) can
  // render the DOM's first column on the right. Neighbours are read left to
  // right off the screen, so the drag math and the written uids follow what the
  // user actually sees.
  const rowMates = visibleColumnsOf(grid, win)
    .filter((el) => el === block || onSameRow(block, el))
    .sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left);
  const index = rowMates.indexOf(block);

  if (index === -1) {
    hideColumnChrome(win);

    return;
  }

  const next = rowMates[index + 1] ?? null;
  const prev = rowMates[index - 1] ?? null;

  // Which edges are worth offering. An edge already flush against the grid has
  // nowhere left to grow, so its handle is dropped — but only as long as the
  // other one survives. A block filling the whole row is flush on both sides,
  // and dropping both would leave it with no way back: it could never be made
  // narrower again. Stranding beats tidiness, so in that case both stay.
  const sides = [];

  if (mode === 'span' && config.handles === 'both') {
    const info = columnGridInfo(win, grid);
    const rect = block.getBoundingClientRect();

    if (rect.left > info.left + 2) {
      sides.push('left');
    }

    if (rect.right < info.left + info.unit * info.tracks - info.gap - 2) {
      sides.push('right');
    }

    if (sides.length === 0) {
      sides.push('left', 'right');
    }
  } else {
    sides.push('right');
  }

  // `split` borrows the column builder's pairing wholesale: same boundary, same
  // give-and-take. Only what gets written at the end differs.
  const pairFor = (side) => {
    if (mode !== 'columns' && !config?.split) {
      return null;
    }

    if (side === 'left') {
      return prev ? { a: prev, b: block } : null;
    }

    return next ? { a: block, b: next } : prev ? { a: prev, b: block } : null;
  };

  const wanted = sides.map((side) => ({ side, pair: pairFor(side) }));

  // Column builder: a lone column has no boundary to drag, so it gets nothing.
  const live = mode === 'columns' ? wanted.filter((w) => w.pair) : wanted;

  if (
    colChrome &&
    colChrome.grid === grid &&
    colChrome.mode === mode &&
    colChrome.block === block &&
    colChrome.handles.length === live.length &&
    colChrome.handles.every((h, i) => h.side === live[i].side && h.pair?.a === live[i].pair?.a && h.pair?.b === live[i].pair?.b)
  ) {
    return; // already showing exactly this
  }

  hideColumnChrome(win);

  const doc = win.document;
  const handles = live.map(({ side, pair }) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'position:fixed;z-index:2147483646;width:10px;height:48px;border-radius:6px;' +
      'background:#1f2937;box-shadow:0 2px 10px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.18);' +
      'cursor:col-resize;touch-action:none;';
    el.title = t('drag_columns');

    // A hero's blocks sit far apart, and 10px of grab area in the middle of all
    // that space is a target you aim at rather than reach for. The bar keeps its
    // size; what grows is the invisible box around it.
    if (mode === 'span') {
      const bar = doc.createElement('div');

      bar.style.cssText =
        'width:10px;height:48px;border-radius:6px;pointer-events:none;' +
        'background:#1f2937;box-shadow:0 2px 10px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.18);';
      el.style.cssText =
        'position:fixed;z-index:2147483646;width:28px;height:64px;background:transparent;' +
        'display:flex;align-items:center;justify-content:center;cursor:col-resize;touch-action:none;';
      el.appendChild(bar);
    }

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || widthDrag) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      beginWidthDrag(win, pair ?? { a: block, b: null }, grid, mode, e.clientX, side, el);
    });

    // The tracks belong to the handle, not to the section: they answer "where
    // can this land", which is only a question once you have reached for it.
    // A column builder block draws its own edges and has never needed them.
    if (mode === 'span') {
      el.addEventListener('pointerenter', () => showGridLines(win, grid, columnGridInfo(win, grid)));
      el.addEventListener('pointerleave', () => {
        if (!widthDrag) {
          hideGridLines();
        }
      });
    }

    doc.documentElement.appendChild(el);

    return { el, side, pair };
  });

  let addBtn = null;

  if (mode === 'columns') {
    const section = block.closest(COL_SECTION_SELECTOR);

    addBtn = doc.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = '+';
    addBtn.title = t('add_column');
    addBtn.style.cssText =
      'position:fixed;z-index:2147483646;width:28px;height:28px;border:none;border-radius:50%;' +
      'background:#1f2937;color:#fff;font-size:18px;line-height:1;cursor:pointer;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.35);display:inline-flex;align-items:center;justify-content:center;';
    addBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.parent.postMessage(
        { source: SOURCE, type: MSG.CB_ADD_COLUMN, uid: section?.getAttribute(SID_ATTR) },
        win.location.origin
      );
    });
    doc.documentElement.appendChild(addBtn);
  }

  // The handle lives outside the container, so reaching for it ends the
  // container's :hover and would take every block's edge down with it — right
  // when you need to see what you are about to resize. The chrome's own lifetime
  // is the honest answer to "is this section being worked on", so it carries the
  // rings: raised here, dropped in hideColumnChrome, and untouched for as long
  // as the pointer is on a handle or a drag is running.
  if (mode === 'span') {
    grid.setAttribute('data-sid-outline-on', '');
  }

  colChrome = { handles, addBtn, block, grid, mode, onScroll: () => positionColumnChrome() };
  win.addEventListener('scroll', colChrome.onScroll, true);
  positionColumnChrome();
}

/**
 * Where the outline sits for a given span, in screen pixels.
 *
 * Anchored on the edge you did NOT grab, so the outline grows the way your hand
 * moves. That the block itself may end up somewhere else entirely — wrapped onto
 * the next row — is the trade this mode makes: a steady thing to aim at while
 * dragging, and the truth on release.
 */
function updateDragGhost(span) {
  const { ghost, handleEl, info, side, anchorLeft, anchorRight, blockTop, blockHeight } = widthDrag;
  const width = Math.max(0, span * info.unit - info.gap);
  const left = side === 'left' ? anchorRight - width : anchorLeft;

  // Sat 6px outside the columns it stands for, which is where a block's own ring
  // sits. Drawn flush instead, the same width would look a hair narrower than
  // the block it is about to become.
  ghost.style.left = `${left - 6}px`;
  ghost.style.top = `${blockTop - 6}px`;
  ghost.style.width = `${width + 12}px`;
  ghost.style.height = `${blockHeight + 12}px`;

  // The handle travels with the outline's dragged edge, so what you are holding
  // and what you are aiming stay the same thing.
  if (handleEl) {
    const edge = side === 'left' ? left : left + width;

    handleEl.style.left = `${edge - handleEl.offsetWidth / 2}px`;
  }
}

function beginWidthDrag(win, pair, grid, mode = 'columns', startX = 0, side = 'right', handleEl = null) {
  const info = columnGridInfo(win, grid);
  const spanA = spanOf(pair.a, info);
  const spanB = pair.b ? spanOf(pair.b, info) : 0;
  const config = mode === 'span' ? gridConfig(grid) : { field: null, min: 1, preview: 'live' };
  const rectA = pair.a.getBoundingClientRect();

  // Dragging the leading edge of a block in a container that allows overlap
  // moves where the block begins and leaves its trailing edge alone. Only then
  // is the starting column worth measuring — everywhere else the block flows,
  // and where it happens to sit right now is not something to write down.
  const movesStart = mode === 'span' && config.overlap && side === 'left' && !pair.b;
  const startA = movesStart ? startOf(pair.a, info) : null;

  // Only a block resized on its own gets the outline. A paired drag is about the
  // boundary between two blocks, and one of the two standing still while the
  // other is outlined says nothing useful.
  let ghost = null;

  if (config.preview === 'outline' && !pair.b) {
    const tone = gridTone(win, grid);

    ghost = win.document.createElement('div');
    ghost.style.cssText =
      'position:fixed;z-index:2147483645;pointer-events:none;border-radius:4px;' +
      `background:${dashedRing(tone.outline)};`;
    win.document.documentElement.appendChild(ghost);
  }

  const badge = win.document.createElement('div');

  badge.style.cssText =
    'position:fixed;z-index:2147483647;pointer-events:none;padding:5px 10px;border-radius:6px;' +
    'background:#1f2937;color:#fff;font:600 12px/1 ui-sans-serif,system-ui,sans-serif;' +
    'box-shadow:0 4px 16px rgba(0,0,0,.35);white-space:nowrap;';
  win.document.documentElement.appendChild(badge);

  // The tracks are already up if the chrome is; a drag started any other way
  // still gets to see them.
  if (mode === 'span') {
    showGridLines(win, grid, info);
  }

  widthDrag = {
    ...pair,
    grid,
    info,
    mode,
    field: config.field,
    // Resized on its own, a block may go as narrow as the grid allows and as
    // wide as the whole row. Paired, it has to leave the other half room to
    // exist — its ceiling is what the two of them share.
    min: mode === 'span' ? Math.min(config.min, info.tracks) : 1,
    // Moving the leading edge, the block runs out of room at the grid's first
    // column: its trailing edge stands still, so how much wider it can get is
    // exactly how far its left edge has left to travel.
    max: pair.b
      ? spanA + spanB - (mode === 'span' ? Math.min(config.min, info.tracks) : 1)
      : Math.min(info.tracks, config.columns ?? info.tracks, movesStart ? startA + spanA - 1 : Infinity),
    total: spanA + spanB,
    spanA,
    applied: spanA,
    aLeft: rectA.left,
    startX,
    // Grabbed on the left, the block gets wider as the pointer goes left.
    // Both edges write the same number; the side only says which way is bigger.
    sign: side === 'left' ? -1 : 1,
    side,
    movesStart,
    startA,
    ghost,
    handleEl,
    anchorLeft: rectA.left,
    anchorRight: rectA.right,
    blockTop: rectA.top,
    blockHeight: rectA.height,
    badge,
  };

  if (ghost) {
    updateDragGhost(spanA);
  }

  win.document.documentElement.classList.add('sve-col-resizing');
}

export function updateWidthDrag(win, event) {
  const { a, b, info, total, aLeft, badge, min, max, spanA, startX, sign, movesStart, startA } = widthDrag;

  // Where the block would begin at a given width, with its trailing edge nailed
  // down. Arithmetic on numbers read once at the start of the drag — nothing
  // here measures the page, which is the whole point of doing it this way.
  const placed = (span) => (movesStart ? `${startA + spanA - span} / span ${span}` : `span ${span} / span ${span}`);

  event.preventDefault();

  // Paired, the pointer IS the boundary, so the width is read off its position.
  // Alone, it is read as a distance travelled instead: a block that outgrows its
  // row wraps mid-drag and its left edge moves out from under the pointer — as a
  // position, the width would jump the moment the row broke.
  let next = b
    ? Math.round((event.clientX - aLeft + info.gap / 2) / info.unit)
    : spanA + sign * Math.round((event.clientX - startX) / info.unit);

  next = Math.max(min, Math.min(max, next));

  if (next !== widthDrag.applied) {
    widthDrag.applied = next;

    if (widthDrag.ghost) {
      // The layout is left alone until release; only the outline moves.
      updateDragGhost(next);
    } else {
      // Inline styles for instant feedback — they also don't depend on every
      // col-span-* class being present in the site's compiled CSS. The morph
      // after the CP write replaces them with the real classes.
      a.style.gridColumn = placed(next);

      if (b) {
        b.style.gridColumn = `span ${total - next} / span ${total - next}`;
      }

      positionColumnChrome();
    }
  }

  const pct = (n) => `${Math.round((n / info.tracks) * 100)}%`;
  const applied = widthDrag.applied;

  badge.textContent = b
    ? `${applied}/${info.tracks} · ${pct(applied)}  |  ${total - applied}/${info.tracks} · ${pct(total - applied)}`
    : `${applied}/${info.tracks} · ${pct(applied)}`;
  badge.style.left = `${event.clientX + 14}px`;
  badge.style.top = `${event.clientY + 16}px`;
}

export function finishWidthDrag(win, cancelled) {
  const { a, b, total, spanA, applied, badge, mode, field, ghost, movesStart, startA } = widthDrag;

  // The column the block ends up beginning in: its trailing edge stayed put, so
  // every column it gained, it gained on the left.
  const start = movesStart ? startA + spanA - applied : null;

  badge.remove();
  ghost?.remove();
  win.document.documentElement.classList.remove('sve-col-resizing');
  widthDrag = null;

  // Outlined drags have left the layout untouched so far. This is the jump the
  // mode trades for: the block takes its width now, in one move, and the write
  // that follows only confirms what is already on screen.
  if (ghost && !cancelled && applied !== spanA) {
    a.style.gridColumn = movesStart ? `${start} / span ${applied}` : `span ${applied} / span ${applied}`;
  }

  positionColumnChrome();

  // Let go still holding the handle and the tracks stay — no pointerenter is
  // coming to bring them back, and blinking them out under a pointer that never
  // moved would read as something breaking.
  if (!colChrome?.handles.some(({ el }) => el.matches(':hover'))) {
    hideGridLines();
  }

  widthDragJustEnded = true;
  setTimeout(() => (widthDragJustEnded = false), 250);

  if (cancelled || applied === spanA) {
    a.style.gridColumn = '';

    if (b) {
      b.style.gridColumn = '';
    }

    return;
  }

  // Written once, on release. Every write re-renders the page builder in the CP,
  // and one landing mid-request leaves a promise unsettled — which is a spinner
  // that never stops. During the drag the inline grid-column is the whole story.
  if (mode === 'span') {
    // `start` only travels when the drag was about where the block begins. Left
    // out, the CP keeps whatever start the block already had and writes the
    // width alone — which is every drag that has ever been made until now.
    const changes = [{ uid: a.getAttribute(SID_ATTR), span: applied, ...(start === null ? {} : { start }) }];

    if (b) {
      changes.push({ uid: b.getAttribute(SID_ATTR), span: total - applied });
    }

    win.parent.postMessage(
      { source: SOURCE, type: MSG.SVE_GRID_SPAN, field, changes },
      win.location.origin
    );

    return;
  }

  const bp = bpFieldForWidth(win.innerWidth);
  const value = (n) => `${bp.prefix}col-span-${n}`;

  // The inline styles stay on until the CP write comes back through the morph —
  // removing them now would snap the columns back for a beat.
  win.parent.postMessage(
    {
      source: SOURCE,
      type: MSG.CB_COL_WIDTH,
      changes: [
        { uid: a.getAttribute(SID_ATTR), field: bp.field, value: value(applied) },
        { uid: b.getAttribute(SID_ATTR), field: bp.field, value: value(total - applied) },
      ],
    },
    win.location.origin
  );
}

// --- Drag & drop reordering ([data-sid-orderable]) -------------------------------
//
// Rows opted in via orderable="true" can be dragged among their sibling rows
// (grid/replicator items rendered in a loop). A pointer-based drag with a
// threshold keeps clicks working: below the threshold the pointerdown is a
// normal click (inline edit, focus); beyond it a drag starts, the row dims, a
// dashed slot marks the landing place (same language as the hover rings; a
// section drag still uses the thin insertion line), and releasing posts the
// target index to the CP, which reorders the underlying values array (same
// machinery as the move arrows). The morphed re-render then shows the new order.

export const ORDERABLE_ATTR = 'data-sid-orderable';
export const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag

 // one-shot: swallow the click that follows a drag
