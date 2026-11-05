/**
 * The grids in the preview while Build is on, and the builder on the one
 * being worked on.
 *
 * Every grid of the open section — an element the frame lays out as a grid,
 * by Flow: grid or by the site's CSS — has its cells outlined faintly,
 * whatever is picked, so a grid stays visible as one at every size. The cells
 * a child covers are one box: no line runs through a child spanning two.
 *
 * The pick's grid — the pick itself, or the grid it stands in — is the
 * builder: its cells outlined, a − / + for its columns and one for its rows,
 * each child outlined with a tab (top left: its tag and the cells it covers)
 * that moves it to another cell, or picks it when pressed, and a corner
 * (bottom right) that drags the cells it covers, and a + in every free cell
 * that puts an empty element there. While a handle is held a sheet lies over
 * the frame, so its moves reach the Control Panel. All of it writes a class
 * at the size the panel edits, through the port (`setGridAt`, `addGridCell` —
 * grid.js): on Tablet a drag writes Tablet's span and leaves Desktop's. The
 * pill names that size. Typed numbers are Style's (BuildStyle.vue), not here.
 *
 * A picked Columns drawn over the real preview — no canvas, whose + is its
 * own (canvas-ui.js, `plus: false`) — keeps a + in each empty column, which
 * makes it the place Add puts the next element.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: vue, lib/build-canvas-ids.js, lib/preview-frame.js, lib/style.js, html-pick-align.js,
 *   build-mode/place.js, build-mode/grid.js, build-mode/grid-measure.js, cp/xray/measure.js.
 *   Drawn from the Control Panel over the frame: the frame is same origin, so
 *   the boxes are read straight out of it by the paths stamped on its
 *   elements — the preview's (`data-sve-ht-path`, html-pick-align.js) or the
 *   canvas's (`data-sve-build-path`, canvas.js), whichever frame it is given.
 *   Nothing in the kernel is touched, no message sent.
 * Bus: none.
 *
 * Never a loop: a ResizeObserver on the grids and the frame's own scroll move
 * the boxes; a new file (the port's `rev`), a new pick or a frame that has
 * drawn again (`updated` on its window) finds the grids again — after a drag,
 * not during one.
 */
import { watch } from 'vue';
import { BUILD_COLUMNS_LAYER_ID } from '../lib/build-canvas-ids.js';
import { previewFrame } from '../lib/preview-frame.js';
import { injectStyle } from '../lib/style.js';
import { HT_PATH_ATTR } from '../html-pick-align.js';
import { columnsFor, selfAndParent } from './place.js';
import { MAX_TRACKS, fewestTracks, spanTo, startAt } from './grid.js';
import { cellAreas, isGrid, measureGrid, nextFreeCell } from './grid-measure.js';
import { placementLabel } from '../cp/xray/measure.js';

const LAYER_ID = BUILD_COLUMNS_LAYER_ID;
const STYLE_ID = '__sve-build-columns-css';
export const PLUS =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const MINUS = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>';
const GRIP =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.7"/><circle cx="15" cy="6" r="1.7"/><circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></svg>';
/** How far a pressed handle moves before it is a drag, not a click. */
const DRAG_FROM = 4;
/** Over this many cells a grid is a list: its cells are not drawn one by one, nor given a +. */
const CELL_CAP = 240;
/** The least a cell is drawn: an empty row still has room for its +. */
const MIN_CELL = 32;

/*
 * Drawn inside the canvas (`inside`): the layer is a child of the canvas's
 * <html>, after the body, in the page's own coordinates — it scrolls with the
 * page by itself, with no script on the scroll, so nothing trails behind it.
 * The canvas may be zoomed: what is held and read (tabs, pills, +s) is scaled
 * back by --k so it keeps its size, and the lines keep their width.
 */
const INSIDE_CSS = `#${LAYER_ID}{position:absolute;inset:auto;left:0;top:0;width:0;height:0;overflow:visible;margin:0;padding:0;border:0}
#${LAYER_ID} [data-k]{position:absolute}
#${LAYER_ID} [data-k="cell"],#${LAYER_ID} [data-col]{border-width:calc(1px * var(--k,1))}
#${LAYER_ID} [data-k="ghost"]{border-width:calc(2px * var(--k,1))}
#${LAYER_ID} [data-k^="pill"]{transform-origin:0 0;scale:var(--k,1)}
#${LAYER_ID} [data-k="pill-cols"]{transform-origin:100% 0}
#${LAYER_ID} [data-grid-grip]{transform-origin:0 0;scale:var(--k,1)}
#${LAYER_ID} [data-grid-corner]{transform-origin:100% 100%;scale:var(--k,1)}
#${LAYER_ID} [data-k="add"] button,#${LAYER_ID} [data-col] > button{scale:var(--k,1)}
#${LAYER_ID} [data-k="ghost"] span{transform-origin:0 0;scale:var(--k,1)}`;

/** A style of the layer's on the canvas's <html>, not its <head>: the head is the page's, and is drawn again with it. */
function ownStyle(doc, id, css) {
  let el = doc.getElementById(id);

  if (!el) {
    el = doc.createElement('style');
    el.id = id;
    doc.documentElement.appendChild(el);
  }

  if (el.textContent !== css) {
    el.textContent = css;
  }
}

function ensureStyles(doc, inside = false) {
  (inside ? ownStyle : injectStyle)(
    doc,
    STYLE_ID,
    // Above the canvas, so above Statamic's stacks too, which stand on z-index 2: gone while one is open.
    `#${LAYER_ID}{position:fixed;inset:0;pointer-events:none;z-index:99990}
:root:has(.stack-content) #${LAYER_ID}{display:none}
#${LAYER_ID} [data-k]{position:fixed;box-sizing:border-box}
#${LAYER_ID} [data-k="cell"]{border:1px dashed rgba(56,88,233,.6)}
#${LAYER_ID} [data-faint] [data-k="cell"]{border-color:rgba(56,88,233,.3)}
#${LAYER_ID} [data-col]{border:1px solid rgba(56,88,233,.9);border-radius:2px;display:flex;align-items:center;justify-content:center}
#${LAYER_ID} [data-col][data-target]{background:rgba(56,88,233,.08)}
#${LAYER_ID} button{all:unset;pointer-events:auto;box-sizing:border-box;width:1.5rem;height:1.5rem;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#3858e9;color:#fff;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.3)}
#${LAYER_ID} button:hover{background:#4a68ee}
#${LAYER_ID} [data-k="add"]{display:flex;align-items:center;justify-content:center}
#${LAYER_ID} [data-k="add"] button{opacity:.55}
#${LAYER_ID} [data-k="add"] button:hover{opacity:1}
#${LAYER_ID} [data-col][data-picked]{box-shadow:inset 0 0 0 1px #3858e9}
#${LAYER_ID} [data-grid-grip],#${LAYER_ID} [data-grid-corner]{position:absolute;pointer-events:auto;box-sizing:border-box;touch-action:none;user-select:none;box-shadow:0 1px 3px rgba(0,0,0,.3)}
#${LAYER_ID} [data-grid-grip]{left:.25rem;top:.25rem;display:inline-flex;align-items:center;gap:.25rem;height:1.375rem;padding:0 .5rem 0 .25rem;border-radius:999px;background:#3858e9;border:1px solid #3858e9;color:#fff;font:600 .6875rem/1 system-ui,sans-serif;white-space:nowrap;cursor:grab}
#${LAYER_ID} [data-grid-grip]:hover{background:#4a68ee;border-color:#4a68ee}
#${LAYER_ID} [data-grid-grip] svg{width:.875rem;height:.875rem;flex:none}
#${LAYER_ID} [data-grid-grip] i{font-style:normal;font-weight:500;opacity:.75}
#${LAYER_ID} [data-col][data-picked] [data-grid-grip]{box-shadow:0 0 0 .125rem #fff,0 1px 3px rgba(0,0,0,.3)}
#${LAYER_ID} [data-grid-corner]{right:.25rem;bottom:.25rem;width:1.125rem;height:1.125rem;border-radius:.3rem;background:#3858e9;cursor:nwse-resize}
#${LAYER_ID} [data-grid-corner]:hover{background:#4a68ee}
#${LAYER_ID} [data-grid-corner]::after{content:"";position:absolute;right:.25rem;bottom:.25rem;width:.45rem;height:.45rem;box-sizing:border-box;border-right:.125rem solid #fff;border-bottom:.125rem solid #fff;border-bottom-right-radius:.1rem}
#${LAYER_ID} [data-k="shield"]{inset:0;pointer-events:auto;cursor:grabbing}
#${LAYER_ID} [data-k="shield"][data-kind="corner"]{cursor:nwse-resize}
#${LAYER_ID} [data-k^="pill"]{pointer-events:auto;display:flex;align-items:center;gap:.125rem;padding:.125rem;border-radius:999px;background:#3858e9;color:#fff;font:600 .6875rem/1 system-ui,sans-serif;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.3)}
#${LAYER_ID} [data-k^="pill"] button{width:1.25rem;height:1.25rem;background:transparent;box-shadow:none}
#${LAYER_ID} [data-k^="pill"] button:hover{background:rgba(255,255,255,.22)}
#${LAYER_ID} [data-k^="pill"] button[aria-disabled="true"]{opacity:.4;cursor:default;background:transparent}
#${LAYER_ID} [data-k^="pill"] span{padding:0 .25rem}
#${LAYER_ID} [data-k^="pill"] [data-grid-size]{margin-right:.125rem;padding:.25rem .5rem;border-radius:999px;background:rgba(255,255,255,.2)}
#${LAYER_ID} [data-k="ghost"]{border:2px solid #3858e9;background:rgba(56,88,233,.16);border-radius:2px}
#${LAYER_ID} [data-k="ghost"] span{position:absolute;left:.25rem;top:.25rem;padding:.125rem .375rem;border-radius:.25rem;background:#3858e9;color:#fff;font:600 .625rem/1.3 system-ui,sans-serif;white-space:nowrap}`
  );

  if (inside) {
    ownStyle(doc, `${STYLE_ID}-inside`, INSIDE_CSS);
  }
}

/** Exactly `n` children of a kind in `wrap`, made by `make` and kept while the count holds — a drag's grip with them. */
function pool(wrap, kind, n, make) {
  const have = [...wrap.children].filter((el) => el.dataset.k === kind);

  while (have.length > n) {
    have.pop().remove();
  }

  while (have.length < n) {
    const el = make();

    el.dataset.k = kind;
    wrap.appendChild(el);
    have.push(el);
  }

  return have;
}

function box(el, left, top, width, height) {
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
}

/**
 * Start drawing for the port's pick. Returns a stop function.
 *
 * @param {Window} win   the Control Panel window
 * @param {object} port  html(), selectedPath(), select(path), plusPath(), setPlus(path), rev, t(key), sizes(), size(),
 *                       setGridAt(path, changes, { select }), addGridCell(path, cell, next), gridPartsAt(path)
 * @param {object} [on]
 * @param {() => HTMLIFrameElement|null} [on.frame]  the frame drawn over; the Live Preview's by default
 * @param {string} [on.attr]                         the path attribute on its elements
 * @param {string} [on.updated]                      the event its window fires once it has drawn again
 * @param {boolean} [on.plus]                        a + in each empty column; the canvas draws its own
 */
export function startColumnsOverlay(
  win,
  port,
  { frame: frameOf = () => previewFrame(win), attr = HT_PATH_ATTR, updated = 'statamic:preview-updated', plus: withPlus = true, inside = false } = {}
) {
  const doc = win.document;
  /** The document the layer is drawn in: the canvas's own (`inside`), else the Control Panel's over the frame. */
  const host = () => (inside ? frameOf()?.contentDocument || null : doc);
  // `{ el, path, wrap, faint, columns }` — `columns` the file's Columns (place.js) for a picked one.
  let grids = [];
  let observer = null;
  let frameWin = null;
  let queued = false;
  let drag = null;
  let findAfterDrag = false;

  const layer = () => host()?.getElementById(LAYER_ID) || null;
  const active = () => grids.find((grid) => !grid.faint) || null;
  const t = (key, replace) => port.t?.(key, replace) ?? key;

  const clear = () => {
    layer()?.remove();
    observer?.disconnect();
    observer = null;
    grids = [];
  };

  /** Where the frame stands, and how a box read in it lands in the Control Panel. */
  const view = () => {
    const frame = frameOf();

    if (!frame) {
      return null;
    }

    const at = frame.getBoundingClientRect();
    const scale = frame.clientWidth ? at.width / frame.clientWidth : 1;

    if (inside) {
      // The page's own coordinates: a box read on screen in the frame, plus how far the page is scrolled.
      const page = frame.contentWindow;
      const root = frame.contentDocument?.documentElement;
      const sx = page?.scrollX || 0;
      const sy = page?.scrollY || 0;
      const k = scale ? 1 / scale : 1;

      return {
        at: { left: 0, top: 0, right: root?.scrollWidth || 0, bottom: root?.scrollHeight || 0 },
        scale: 1,
        k,
        min: MIN_CELL * k,
        x: (x) => x + sx,
        y: (y) => y + sy,
        // Where a pointer read in the frame stands, as the boxes are measured.
        fromEvent: (event) => ({ x: event.clientX, y: event.clientY }),
      };
    }

    return { at, scale, k: 1, min: MIN_CELL, x: (x) => at.left + x * scale, y: (y) => at.top + y * scale, fromEvent: (event) => ({ x: (event.clientX - at.left) / scale, y: (event.clientY - at.top) / scale }) };
  };

  const sizeLabel = () => {
    const handle = port.size?.();
    const row = handle ? port.sizes?.().find((one) => one.handle === handle) : null;

    return row?.label || t('size_all');
  };

  /** The cells of one grid, faint or the builder's, and nothing more: a child's cells as one box (`cellAreas`). */
  const placeCells = (grid, m, v) => {
    const count = m.cols.length * m.rows.length;
    const areas = count && count <= CELL_CAP ? cellAreas(m) : [];
    const cells = pool(grid.wrap, 'cell', areas.length, () => doc.createElement('div'));

    cells.forEach((cell, n) => box(cell, ...areaBox(m, v, areas[n].col, areas[n].row)));

    // A grid with no tracks to read (none resolved yet): its box, so it still shows.
    if (!count) {
      box(pool(grid.wrap, 'cell', 1, () => doc.createElement('div'))[0], v.x(m.box.x), v.y(m.box.y), m.box.w * v.scale, Math.max(m.box.h * v.scale, v.min));
    }
  };

  /** A child's cells as a box in the Control Panel: from its first track's start to its last one's end. */
  const areaBox = (m, v, col, row) => {
    const rows = m.rows.length ? m.rows : [{ start: 0, end: m.box.h }];
    const c0 = m.cols[col[0]] || m.cols[0];
    const c1 = m.cols[Math.min(col[1], m.cols.length - 1)] || c0;
    const r0 = rows[Math.min(row[0], rows.length - 1)];
    const r1 = rows[Math.min(row[1], rows.length - 1)];

    return [v.x(m.box.x + c0.start), v.y(m.box.y + r0.start), (c1.end - c0.start) * v.scale, Math.max((r1.end - r0.start) * v.scale, v.min)];
  };

  const pill = (wrap, n, make) => pool(wrap, `pill-${n}`, 1, make)[0];

  /**
   * The columns and rows a step goes from: what the grid's classes say at the
   * size picked, as Style's steppers read them, else what the frame lays out.
   */
  const countsOf = (grid, m) => {
    const parts = port.gridPartsAt?.(grid.path);

    return { cols: parts?.cols?.n ?? m.cols.length, rows: parts?.rows?.n ?? m.rows.length };
  };

  const pillButtons = (el, kind, count, least) => {
    const [less, more] = el.querySelectorAll('button');

    less.setAttribute('aria-disabled', String(count <= least));
    more.setAttribute('aria-disabled', String(kind === 'cols' && count >= MAX_TRACKS));
    el.querySelector('[data-grid-count]').textContent = `${t(kind === 'cols' ? 'grid_columns' : 'grid_rows')} ${count}`;
  };

  const makePill = (kind) => () => {
    const el = doc.createElement('div');
    const step = (sign, icon, key) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.innerHTML = icon;
      btn.title = t(key);
      btn.setAttribute('aria-label', t(key));
      btn.dataset.sveBuildGridStep = `${kind}${sign > 0 ? '+' : '-'}`;
      btn.addEventListener('click', () => {
        const grid = active();

        if (!grid || btn.getAttribute('aria-disabled') === 'true') {
          return;
        }

        const count = countsOf(grid, measureGrid(grid.el, attr))[kind];

        port.setGridAt(grid.path, { [kind]: Math.max(1, Math.min(kind === 'cols' ? MAX_TRACKS : Infinity, count + sign)) });
      });

      return btn;
    };

    if (kind === 'cols') {
      const size = doc.createElement('span');

      size.dataset.gridSize = '';
      el.append(size);
    }

    const count = doc.createElement('span');

    count.dataset.gridCount = '';
    el.append(step(-1, MINUS, `grid_${kind}_less`), count, step(1, PLUS, `grid_${kind}_more`));

    return el;
  };

  /** The builder on the pick's grid: cells, the two pills, each child's box and handles, a + in each free cell. */
  const placeBuilder = (grid, m, v) => {
    placeCells(grid, m, v);

    const top = v.y(m.box.y);
    const bottom = top + Math.max(m.box.h * v.scale, v.min);
    const right = v.x(m.box.x + m.box.w);
    const left = v.x(m.box.x);
    // Each pill outside its edge when the frame has room there, else just inside.
    const cols = pill(grid.wrap, 'cols', makePill('cols'));
    const rows = pill(grid.wrap, 'rows', makePill('rows'));
    const least = fewestTracks(m.items);
    const counts = countsOf(grid, m);

    cols.querySelector('[data-grid-size]').textContent = sizeLabel();
    pillButtons(cols, 'cols', counts.cols, least.cols);
    pillButtons(rows, 'rows', counts.rows, least.rows);

    // Sizes as they show: a pill scaled back on a zoomed canvas is `k` of its own box.
    const k = v.k;
    const colsH = (cols.offsetHeight || 24) * k;
    const rowsH = (rows.offsetHeight || 24) * k;
    const colsTop = top - colsH - 6 * k >= v.at.top + 2 * k ? top - colsH - 6 * k : top + 4 * k;
    const rowsTop = bottom + 6 * k + rowsH <= v.at.bottom - 2 * k ? bottom + 6 * k : bottom - rowsH - 4 * k;

    // The columns pill is scaled from its right edge, so its own box ends where the grid does.
    cols.style.left = `${Math.max(v.at.left + 2 * k, right - (cols.offsetWidth || 160) * (inside ? 1 : k))}px`;
    cols.style.top = `${colsTop}px`;
    rows.style.left = `${left}px`;
    rows.style.top = `${rowsTop}px`;

    const named = m.items.filter((item) => item.path && item.col && item.row);
    const kids = pool(grid.wrap, 'kid', named.length, () => {
      const el = doc.createElement('div');

      el.dataset.col = '';

      return el;
    });
    const plusAt = port.plusPath();
    const picked = port.selectedPath();

    kids.forEach((el, n) => {
      const item = named[n];

      if (el.dataset.col !== item.path) {
        el.replaceChildren();
        el.dataset.col = item.path;

        if (writes()) {
          el.append(handle('grip', item.path), handle('corner', item.path));
        }

        if (withPlus && grid.columns?.columns.some((column) => column.path === item.path && column.empty)) {
          const btn = doc.createElement('button');

          btn.type = 'button';
          btn.dataset.sveBuildColumnPlus = item.path;
          btn.innerHTML = PLUS;
          btn.addEventListener('click', () => port.setPlus(item.path));
          el.appendChild(btn);
        }
      }

      el.toggleAttribute('data-target', plusAt === item.path);
      el.toggleAttribute('data-picked', picked === item.path);

      const tab = el.querySelector('[data-grid-grip]');

      // The handle names what it holds: its tag, and the columns × rows it covers.
      if (tab) {
        tab.querySelector('b').textContent = item.el.tagName.toLowerCase();
        tab.querySelector('i').textContent = `${item.col[1] - item.col[0] + 1}×${item.row[1] - item.row[0] + 1}`;
      }

      box(el, ...areaBox(m, v, item.col, item.row));
    });

    const free = writes() && m.cols.length * m.rows.length <= CELL_CAP ? m.empty : [];
    const adds = pool(grid.wrap, 'add', free.length, () => {
      const el = doc.createElement('div');
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.innerHTML = PLUS;
      btn.title = t('grid_add_cell');
      btn.setAttribute('aria-label', t('grid_add_cell'));
      btn.addEventListener('click', () => {
        const at = active();
        const cell = el.dataset.cell.split(':').map(Number);

        if (at) {
          port.addGridCell(at.path, cell, nextFreeCell(measureGrid(at.el, attr), cell));
        }
      });
      el.appendChild(btn);

      return el;
    });

    adds.forEach((el, n) => {
      const [c, r] = free[n];

      el.dataset.cell = `${c}:${r}`;
      el.firstElementChild.dataset.sveBuildGridAdd = el.dataset.cell;
      box(el, ...areaBox(m, v, [c, c], [r, r]));
    });

    if (drag?.target) {
      const ghost = pool(grid.wrap, 'ghost', 1, () => {
        const el = doc.createElement('div');

        el.appendChild(doc.createElement('span'));

        return el;
      })[0];

      box(ghost, ...areaBox(m, v, drag.target.col, drag.target.row));
      ghost.firstElementChild.textContent = placementLabel(drag.target.col, drag.target.row);
    } else {
      pool(grid.wrap, 'ghost', 0);
    }
  };

  /** Only a port that writes gets handles and +s — Visual Build's. */
  const writes = () => typeof port.setGridAt === 'function';

  const place = () => {
    const v = view();
    const wrap = layer();

    if (!v || !wrap || !grids.length) {
      return;
    }

    if (inside) {
      wrap.style.setProperty('--k', String(v.k));
    } else {
      // Nothing drawn past the frame's edges: a grid scrolled half out is cut where the page is.
      wrap.style.clipPath = `inset(${v.at.top}px ${win.innerWidth - v.at.right}px ${win.innerHeight - v.at.bottom}px ${v.at.left}px)`;
    }

    for (const grid of grids) {
      if (!grid.el.isConnected) {
        continue;
      }

      const m = measureGrid(grid.el, attr);

      if (grid.faint) {
        placeCells(grid, m, v);
      } else {
        placeBuilder(grid, m, v);
      }
    }
  };

  const schedule = () => {
    if (queued) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;
      place();
    });
  };

  /* ---------------- dragging a child: its tab moves it (or, pressed, picks it), its corner spans it ---------------- */

  function handle(kind, path) {
    const el = doc.createElement('span');

    if (kind === 'grip') {
      el.dataset.gridGrip = path;
      el.innerHTML = `${GRIP}<b></b><i></i>`;
    } else {
      el.dataset.gridCorner = path;
    }

    el.title = t(kind === 'grip' ? 'grid_move' : 'grid_span');
    el.addEventListener('pointerdown', (event) => startDrag(event, kind, path));

    return el;
  }

  function startDrag(event, kind, path) {
    const grid = active();
    const item = grid && measureGrid(grid.el, attr).items.find((one) => one.path === path);

    if (event.button !== 0 || !item?.col || !item?.row) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    drag = { kind, path, from: { col: item.col, row: item.row }, down: { x: event.clientX, y: event.clientY }, moved: false, target: null, on: inside ? frameWin || win : win };

    // A sheet over the frame while the handle is held: the frame under the pointer would take its moves.
    // Inside the canvas the handle holds the pointer itself (its moves are the page's), and the sheet keeps the cursor.
    const shield = doc.createElement('div');

    shield.dataset.k = 'shield';
    shield.dataset.kind = kind;
    layer()?.appendChild(shield);

    if (inside) {
      const page = frameOf()?.contentWindow;

      box(shield, page?.scrollX || 0, page?.scrollY || 0, page?.innerWidth || 0, page?.innerHeight || 0);

      try {
        event.target.setPointerCapture?.(event.pointerId);
      } catch {
        /* a pointer already let go */
      }
    }

    drag.on.addEventListener('pointermove', onMove, true);
    drag.on.addEventListener('pointerup', onUp, true);
    drag.on.addEventListener('pointercancel', endDrag, true);
    drag.on.addEventListener('keydown', onKey, true);
    win.addEventListener('keydown', onKey, true);
  }

  function onMove(event) {
    const grid = active();
    const v = view();

    if (!drag || !grid || !v) {
      return;
    }

    if (!drag.moved && Math.hypot(event.clientX - drag.down.x, event.clientY - drag.down.y) < DRAG_FROM) {
      return;
    }

    drag.moved = true;

    const m = measureGrid(grid.el, attr);
    const point = v.fromEvent(event);
    const fx = point.x - m.box.x;
    const fy = point.y - m.box.y;
    const { col, row } = drag.from;
    const rows = m.rows.length ? m.rows : [{ start: 0, end: m.box.h }];

    if (drag.kind === 'corner') {
      drag.target = { col: [col[0], col[0] + spanTo(col[0], m.cols, fx) - 1], row: [row[0], row[0] + spanTo(row[0], rows, fy) - 1] };
    } else {
      const wide = col[1] - col[0] + 1;
      const tall = row[1] - row[0] + 1;
      const c = startAt(m.cols, fx, wide);
      const r = startAt(rows, fy, tall, Infinity);

      drag.target = { col: [c, c + wide - 1], row: [r, r + tall - 1] };
    }

    schedule();
  }

  function onUp() {
    const done = drag;

    endDrag();

    // A tab pressed and let go where it was: the child is picked.
    if (done && !done.moved && done.kind === 'grip') {
      port.select?.(done.path);

      return;
    }

    if (!done?.target) {
      return;
    }

    const { col, row } = done.target;
    const from = done.from;
    const changes = {};

    if (done.kind === 'corner') {
      if (col[1] - col[0] !== from.col[1] - from.col[0]) {
        changes.colSpan = col[1] - col[0] + 1;
      }

      if (row[1] - row[0] !== from.row[1] - from.row[0]) {
        changes.rowSpan = row[1] - row[0] + 1;
      }
    } else if (col[0] !== from.col[0] || row[0] !== from.row[0]) {
      // Both lines: a cell is two numbers, and one alone lets the browser move the other.
      changes.colStart = col[0] + 1;
      changes.rowStart = row[0] + 1;
    }

    if (Object.keys(changes).length) {
      port.setGridAt(done.path, changes, { select: done.path });
    }
  }

  function onKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      endDrag();
    }
  }

  function endDrag() {
    const on = drag?.on;

    drag = null;
    layer()?.querySelector(':scope > [data-k="shield"]')?.remove();

    for (const target of new Set([on, win].filter(Boolean))) {
      try {
        target.removeEventListener('pointermove', onMove, true);
        target.removeEventListener('pointerup', onUp, true);
        target.removeEventListener('pointercancel', endDrag, true);
        target.removeEventListener('keydown', onKey, true);
      } catch {
        /* the canvas's window is gone with its document */
      }
    }
    schedule();

    if (findAfterDrag) {
      findAfterDrag = false;
      win.requestAnimationFrame(find);
    }
  }

  /* ---------------- finding the grids ---------------- */

  const bindFrame = () => {
    const next = frameOf()?.contentWindow || null;

    if (next === frameWin) {
      return;
    }

    try {
      frameWin?.removeEventListener('scroll', schedule, true);
      frameWin?.removeEventListener(updated, find);
    } catch {
      /* the old document is gone */
    }

    frameWin = next;

    try {
      // Inside the canvas the layer scrolls with the page: nothing to do on a scroll.
      if (!inside) {
        frameWin?.addEventListener('scroll', schedule, true);
      }

      frameWin?.addEventListener(updated, find);
    } catch {
      frameWin = null;
    }
  };

  /** The pick, or the row it stands in, when the frame lays it out as a grid. */
  const gridAround = (inner, html, path) =>
    selfAndParent(html, path)
      .map((at) => inner.querySelector(`[${attr}="${CSS.escape(at)}"]`))
      .find((el) => el && isGrid(el)) || null;

  function find() {
    if (drag) {
      findAfterDrag = true;

      return;
    }

    clear();
    bindFrame();

    const inner = frameOf()?.contentDocument;

    if (!inner) {
      return;
    }

    const html = port.html();
    const path = port.selectedPath();
    const pick = path ? gridAround(inner, html, path) : null;
    const all = [...inner.querySelectorAll(`[${attr}]`)].filter(isGrid);

    if (!all.length && !pick) {
      return;
    }

    ensureStyles(inside ? inner : doc, inside);

    const wrap = doc.createElement('div');

    wrap.id = LAYER_ID;
    // Inside: after the canvas's body, where a repaint of the body never meets it (as canvas-ui.js's layer).
    (inside ? inner.documentElement : doc.body).appendChild(wrap);
    observer = new win.ResizeObserver(schedule);

    grids = (pick && !all.includes(pick) ? [pick, ...all] : all).map((el) => {
      const own = doc.createElement('div');
      const at = el.getAttribute(attr) || '';

      own.dataset.grid = at;
      own.toggleAttribute('data-faint', el !== pick);
      wrap.appendChild(own);
      observer.observe(el);

      return { el, path: at, wrap: own, faint: el !== pick, columns: el === pick ? columnsFor(html, path) : null };
    });

    place();
  }

  const stopWatch = watch(() => [port.rev.value, port.selectedPath(), port.plusPath(), port.size?.()], () => win.requestAnimationFrame(find));

  win.addEventListener('resize', schedule);
  win.addEventListener('scroll', schedule, true);
  find();

  return () => {
    stopWatch();
    endDrag();
    win.removeEventListener('resize', schedule);
    win.removeEventListener('scroll', schedule, true);

    try {
      frameWin?.removeEventListener('scroll', schedule, true);
      frameWin?.removeEventListener(updated, find);
    } catch {
      /* gone with its document */
    }

    clear();
  };
}
