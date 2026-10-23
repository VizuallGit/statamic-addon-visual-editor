/**
 * The site canvas (demo): the site's templates and pages as frames on one
 * surface in Live Preview, in the spirit of Shopify's Canvas overview. Pan and
 * zoom; a click on a frame closes the canvas and makes that entry the page
 * being edited — the Live Preview we have today, fields, overlay and all. The
 * canvas itself edits nothing.
 *
 * Owns one layer over the preview pane (`#__sve-site-canvas`), the frames on
 * it, its zoom and pan. The top bar's icon `button[data-tab="site_canvas"]`
 * (cp-shell/header-toolbar.js through lazy/site-canvas.js, behind the
 * `site_canvas` feature, off by default) is the only way in: lazy-panels.js
 * `import()`s this module on the click. No file imports it statically, and it
 * puts nothing on `window`. The icon is the bar's to paint: this module says
 * `site-canvas:state` on the bus as it opens and closes, and the bar follows.
 *
 * Two groups, laid out by rule, never by hand, each one line: a group's rows
 * are clusters along it, a wider gap between clusters than between frames;
 * a row's columns stand side by side, each a stack of frames. The templates
 * store's rows make the first line — the collection they draw (index and
 * show for Services, say), the site's own views (layout, the default page)
 * last — each cluster headed with its collection's name, one template a
 * column. The pages collection's entries make the second, under one heading
 * (a group of one row is headed once): its columns are the editors' own
 * arrangement over the tree's top pages — a page dragged into another's
 * column stands under it; dragged out between two columns it starts one of
 * its own (one page a column until someone moves one). A page under another
 * in the tree stands under its parent (`depth`, its label stepped in) and
 * goes where the parent goes: the parent and its children are one unit
 * (columnUnits) — picked up together, dropped among other units, never
 * split. That group is marked `arrange` by the endpoint, and only its top
 * frames can be picked up; a unit can be dropped on its own line only,
 * never among the templates. The columns — the units' ids — are posted
 * back as they are dropped, and kept for the site. What
 * stands in the groups comes from one place, the `/!/sve/site-canvas`
 * endpoint (SiteCanvasController): id, title, the Live Preview URL to show
 * and the edit URL to go to. Nothing is scraped from the Control Panel. The
 * answer is kept for the life of this Control Panel page — a click on a
 * frame boots a new one — so a second open draws at once. The frame of the
 * entry being edited takes the preview's own last URL (`lp:lastPreviewUrl`)
 * instead of the endpoint's, every time the canvas opens: it shows the page
 * as the preview shows it, unsaved edits and all, and is the one frame that
 * changes between two opens. The others keep the URL they were given.
 *
 * The sheet (one transform, `scale(z)`) lies in a scroll box with a view's
 * width and height of room round it on every side, so every pan is a scroll
 * position — drag, wheel in both directions — and a zoom round the pointer
 * keeps the point under it exactly (the nearest sheet point, for a pointer
 * in the room beside it); the bar's − and + and the plain `+`/`-` keys
 * (lib/zoom-keys.js, shared with the preview's own zoom) step the ladder
 * round the view's middle; the room follows the pane's size. It opens at
 * ZOOM_DEFAULT (25 %), the sheet's top-left corner a margin in from the
 * view's (in the middle, on an axis the sheet fits on); «Fit all» zooms the
 * whole sheet into the view. The scrollbars are not drawn: the room would
 * make them say "more" at every zoom.
 *
 * A drag on a page's frame — past DRAG_PX, on a group marked `arrange` —
 * picks the frame up: the sheet is laid out again without it as the
 * pointer moves, its drop line drawn where it would land (dropTarget: into
 * a column, above or below the frame under the pointer; or between two
 * columns, a new one), and the pan stands still meanwhile. Dropped, the
 * columns change (moveFrame), the sheet is laid out again, the columns are
 * posted to `/!/sve/site-canvas/arrangement`; the answer — the server's
 * columns over the pages as they are — is what is kept. A drag let go off
 * the line, or cancelled, puts the frame back. A drag that did not pick
 * anything up pans, as every drag did.
 *
 * Every frame is an iframe a desktop viewport wide (FRAME.width, 1440 CSS
 * pixels) and as tall as its page: its document's scrollHeight as its `load`
 * fires, never under FRAME.minHeight, which is also its height until then —
 * so a page is measured in a frame of the minimum height, where a body with
 * a viewport-high floor cannot report a height it was given — scaled down
 * with the sheet's one transform. A line is as tall as its tallest column.
 * As a page's height comes in, the sheet is laid out again at the zoom it
 * has, the view left where it is — the frames below the page move down, and
 * those then near the view load — unless «Fit all» was the last thing to
 * set the view (`fitted`, until a pan or a zoom): then the fit is made
 * again, so «Fit all» keeps meaning the whole sheet while pages still come.
 * Its URL carries `sve_view=canvas`, which InjectBridgeScript
 * answers with mirror.js alone: no bridge, so no badges, no hover, no inline
 * edit and nothing sent back; and nothing here ever posts to it, so it never
 * morphs — the canvas does not follow the fields while it is open. A
 * transparent layer over each frame takes the click. A frame gets its src
 * only once it is near the view (framesNear, on open, scroll, zoom and
 * resize), and a few at a time (LOAD_AT_ONCE, the next as one's `load`
 * fires): every frame is a Live Preview render on the server, and the
 * preview being edited keeps its share of the server's workers. The rest
 * are empty shells until their turn, and keep their page once they have it.
 *
 * A drag on a frame of the `arrange` group — a pointer that moves past the
 * click threshold on it, where the same movement on anything else pans —
 * lifts it: the frame follows the pointer (a translate on its element; the
 * sheet is not laid out again meanwhile), and a bar on the sheet says where
 * it would land (dropTarget: the middle of a column is "into it, above or
 * below the frames there", the edges and the gaps "a new column here";
 * anywhere above its group's heading is nowhere, and the frame goes back).
 * Dropped, the columns are the one thing that changes (moveFrame), the sheet
 * is laid out again (the fit made again if «Fit all» stood), and the columns
 * are posted; an answer that is not ok puts the columns back and says so.
 * Escape during a drag puts the frame back and keeps the canvas.
 *
 * Closed, it costs nothing but the button. Everything open binds — listeners,
 * the ResizeObserver, the one animation frame — is a function in
 * `canvasState.cleanups`, and close runs them, blanks and removes the frames,
 * the layer and its `<style>`, and empties the state. Nothing here binds any
 * other way, and nothing here uses a timer.
 *
 * Two states, one at a time: opening the canvas closes the breakpoint
 * overview (its public `closeBreakpointOverview`, imported only when its layer
 * is there), and the overview asks `site-canvas:close` on the bus as it opens.
 *
 * The preview iframe's src, styles and window are never touched: the layer
 * sits as the last child of `.live-preview-main` (z-index 2, as the breakpoint
 * overview's does — above the pane, below the editor column, the docks, the
 * top bar and every portal), never inside `.live-preview-contents`, where
 * Statamic finds its preview as firstChild.
 *
 * May import: lib/ and cp/bus.js. The one way Live Preview moves to another
 * entry — pages.js's navigateFromLp, unsaved work asked about first, with
 * lp-templates.js's inLivePreview for the URL — is import()ed on the click:
 * both are in the Control Panel's own bundle already, and a static import
 * here would drag their Vue surfaces into the pure helpers' Node tests.
 * Nothing from the kernel, nothing from cp-shell/.
 */
import { ask, emit, register } from './cp/bus.js';
import { csrfToken } from './lib/csrf.js';
import { t } from './lib/i18n.js';
import { BP_OVERVIEW_ID, SITE_CANVAS_ID } from './lib/ids.js';
import { currentEntryId } from './lib/live-preview.js';
import { previewFrame } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';
import { zoomKey } from './lib/zoom-keys.js';

export { SITE_CANVAS_ID };
const STYLE_ID = '__sve-site-canvas-style';

/** The endpoint the list comes from, and the one the pages' columns go back to as a frame is dropped. */
export const ENDPOINT = '/!/sve/site-canvas';
export const ARRANGE_ENDPOINT = '/!/sve/site-canvas/arrangement';

/** The query flag InjectBridgeScript reads (mirror.js, no bridge), and the value that names these frames. */
export const VIEW_FLAG = 'sve_view';
export const VIEW_VALUE = 'canvas';

/** One frame, in CSS pixels: a desktop viewport's width, and the least height a frame has — its height until its page has said how tall it is. */
export const FRAME = { width: 1440, minHeight: 600 };

/** Sheet pixels (they scale with the zoom): between frames, round the sheet, between two rows on a line (three frame gaps, so the clusters read as clusters), between the two groups. */
export const GAP = 96;
export const PAD = 96;
export const ROW_GAP = 288;
export const GROUP_GAP = 192;

/** Screen pixels, the same at every zoom: a group heading, a row heading, a frame's label above it. */
export const GROUP_HEAD_PX = 48;
export const ROW_HEAD_PX = 32;
export const LABEL_PX = 28;

export const ZOOM_MIN = 0.03;
export const ZOOM_MAX = 1;
const ZOOM_STEPS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.33, 0.5, 0.67, 0.75, 1];

/** The zoom the canvas opens at: a step on the ladder, the site's shape in one view. */
export const ZOOM_DEFAULT = 0.25;

/** Screen pixels kept clear round the sheet when it is fitted to the view. */
export const FIT_MARGIN_PX = 24;

/** Screen pixels beyond the view's edge at which a frame still counts as near, and loads. */
export const LOAD_MARGIN_PX = 200;

/** Frames loading at once: each is a page the server renders, and the preview's own requests must not queue behind them. */
export const LOAD_AT_ONCE = 4;

/** Of a column's width, the share at each edge where a dragged frame means "a new column beside this one" rather than "into it". */
export const DROP_EDGE = 0.15;

/** Screen pixels: the bar that says where a dragged frame would land. */
export const DROP_BAR_PX = 4;

// --- Pure helpers (tests/js/site-canvas.test.js) ------------------------------------

/**
 * The endpoint's answer as the groups the canvas draws: `{ key, title,
 * arrange, rows: [{ key, title, columns: [[{ id, title, preview, edit,
 * depth }]] }] }`. A frame without an id, a preview URL or an edit URL is
 * left out, and a column, row or group left empty by that goes with it.
 * `arrange` is true only where the endpoint says so. `depth` is how far
 * under the top page of its unit a frame stands — 0 for one that stands on
 * its own, which is every frame the endpoint does not mark.
 */
export function canvasGroups(payload) {
  const groups = Array.isArray(payload?.groups) ? payload.groups : [];

  return groups
    .map((group) => ({
      key: String(group?.key || ''),
      title: String(group?.title || ''),
      arrange: group?.arrange === true,
      rows: (Array.isArray(group?.rows) ? group.rows : [])
        .map((row) => ({
          key: String(row?.key || ''),
          title: String(row?.title || ''),
          columns: (Array.isArray(row?.columns) ? row.columns : [])
            .map((column) =>
              (Array.isArray(column) ? column : [])
                .filter((frame) => frame && frame.id && frame.preview && frame.edit)
                .map((frame) => ({
                  id: String(frame.id),
                  title: String(frame.title || frame.id),
                  note: typeof frame.note === 'string' ? frame.note : '',
                  preview: String(frame.preview),
                  edit: String(frame.edit),
                  depth: Number.isInteger(frame.depth) && frame.depth > 0 ? frame.depth : 0,
                }))
            )
            .filter((column) => column.length > 0),
        }))
        .filter((row) => row.columns.length > 0),
    }))
    .filter((group) => group.key && group.rows.length > 0);
}

/** Every frame of every group, in drawing order: along a line, each column top to bottom. */
export function canvasFrames(groups) {
  return groups.flatMap((group) => group.rows.flatMap((row) => row.columns.flat()));
}

/**
 * A column's units: each frame that stands on its own (depth 0) with the
 * frames under it (depth above 0) that follow, as the endpoint stacks
 * them. A unit is what a drag picks up and what a drop stands among: a
 * child never leaves its parent. A column that begins under something
 * (nothing at depth 0 before it) begins a unit all the same.
 */
export function columnUnits(column) {
  const units = [];

  for (const frame of column) {
    if (frame.depth === 0 || units.length === 0) {
      units.push([frame]);
    } else {
      units[units.length - 1].push(frame);
    }
  }

  return units;
}

/** A row's columns as the ids of their units — the top frame's id names a unit. */
export function columnIds(row) {
  return row.columns.map((column) => columnUnits(column).map((unit) => unit[0].id));
}

/** A row's units by id: the top frame first, those under it after. */
export function unitFrames(row) {
  return new Map(row.columns.flatMap((column) => columnUnits(column).map((unit) => [unit[0].id, unit])));
}

/**
 * Where a row's units stand, read off `items` (canvasLayout's, per frame):
 * one item a unit, with the top frame's id and left, from the top frame's
 * top to the last frame's bottom — so dropTarget and dropIndicator reckon
 * with a parent and its children as one thing.
 */
export function unitItems(row, items) {
  const at = new Map(items.map((item) => [item.id, item]));
  const out = [];

  for (const unit of unitFrames(row).values()) {
    const placed = unit.map((frame) => at.get(frame.id)).filter(Boolean);

    if (placed.length === 0) {
      continue;
    }

    const top = placed[0];
    const last = placed[placed.length - 1];

    out.push({ ...top, height: last.y + last.height - top.y });
  }

  return out;
}

/**
 * `columns` (ids) with `id` moved to `target`: into column `target.column`
 * at `target.row` — counted among that column's frames other than `id` —
 * or into a new column of its own at `target.newColumn`, counted among the
 * columns as they stand. A column left empty goes. The same columns back
 * for an id not in them or no target.
 */
export function moveFrame(columns, id, target) {
  if (!target || !columns.some((column) => column.includes(id))) {
    return columns;
  }

  const next = columns.map((column) => column.filter((other) => other !== id));

  if (Number.isInteger(target.column) && next[target.column]) {
    const column = [...next[target.column]];

    column.splice(Math.max(0, Math.min(column.length, target.row ?? column.length)), 0, id);
    next[target.column] = column;
  } else if (Number.isInteger(target.newColumn)) {
    next.splice(Math.max(0, Math.min(next.length, target.newColumn)), 0, [id]);
  } else {
    return columns;
  }

  return next.filter((column) => column.length > 0);
}

/** Two sets of columns say the same thing. */
export function sameColumns(a, b) {
  return a.length === b.length && a.every((column, i) => column.length === b[i].length && column.every((id, j) => id === b[i][j]));
}

/**
 * Where a frame held at `point` (sheet pixels) would land among `columns`
 * (ids), read off `items` (canvasLayout's, for where the columns stand):
 * over the middle of a column — its width less `edge` of it at each side —
 * it goes into that column, above the frames there whose middle is below
 * the point and below the rest (`draggedId` not counted: it is the one
 * moving); anywhere else it starts a new column, after every column whose
 * middle is left of the point. The templates' line, or anything else off
 * the group, is the caller's to rule out.
 */
export function dropTarget(columns, items, point, draggedId, options = {}) {
  const { frame = FRAME, edge = DROP_EDGE } = options;
  const at = new Map(items.map((item) => [item.id, item]));
  const lefts = columns.map((column) => at.get(column[0])?.x ?? 0);
  const into = lefts.findIndex((left) => point.x >= left + frame.width * edge && point.x <= left + frame.width * (1 - edge));

  if (into >= 0) {
    const others = columns[into].filter((id) => id !== draggedId);
    const row = others.filter((id) => {
      const item = at.get(id);

      return item && item.y + item.height / 2 < point.y;
    }).length;

    return { column: into, row };
  }

  return { newColumn: lefts.filter((left) => left + frame.width / 2 < point.x).length };
}

/**
 * The bar that shows `target` on the sheet, in sheet pixels: across a
 * column, midway in the gap above the frame the dragged one would stand
 * over (above the first's label for the top; under the last for the
 * bottom; where the dragged frame itself stands, for a column it would
 * leave empty); or down the line — `band.top` to `band.bottom` — midway in
 * the gap where a new column would open. `bar` screen pixels thick, so it
 * is `bar / z` on the sheet.
 */
export function dropIndicator(target, columns, items, draggedId, band, z, options = {}) {
  const { frame = FRAME, gap = GAP, label = LABEL_PX, bar = DROP_BAR_PX } = options;
  const scale = z > 0 ? z : 1;
  const thick = bar / scale;
  const at = new Map(items.map((item) => [item.id, item]));

  if (Number.isInteger(target?.column) && columns[target.column]) {
    const column = columns[target.column];
    const others = column.filter((id) => id !== draggedId);
    const left = at.get(column[0])?.x ?? 0;
    let y;

    if (others.length === 0) {
      y = (at.get(draggedId)?.y ?? 0) - label / scale - gap / 2;
    } else if (target.row < others.length) {
      y = at.get(others[target.row]).y - label / scale - gap / 2;
    } else {
      const last = at.get(others[others.length - 1]);

      y = last.y + last.height + gap / 2;
    }

    return { x: left, y: y - thick / 2, width: frame.width, height: thick };
  }

  if (Number.isInteger(target?.newColumn)) {
    const lefts = columns.map((column) => at.get(column[0])?.x ?? 0);
    const x = target.newColumn < lefts.length ? lefts[target.newColumn] - gap / 2 : lefts[lefts.length - 1] + frame.width + gap / 2;

    return { x: x - thick / 2, y: band.top, width: thick, height: Math.max(0, band.bottom - band.top) };
  }

  return null;
}

/**
 * Where everything stands on the sheet at zoom `z`, in sheet pixels — the
 * sheet div's own, before its transform. Frames are `frame.width` wide and
 * as tall as `heights` says of each (id → CSS pixels), `frame.minHeight`
 * for one it does not name. Each group is one line: its rows stand along it
 * in order, `rowGap` between one row and the next, so the rows read as
 * clusters; a row's columns stand `gap` apart, and a column's frames stack
 * top to bottom, each under its label, `gap` between them. The line is as
 * tall as its tallest column; the groups stand under one another, `groupGap`
 * apart. A group's heading stands over its line (`bottom` says where the
 * line ends); each row's over its first column — unless the group has one
 * row only, which its own heading names (a group of one row is headed
 * once). The sheet is as wide as its widest line. Headings and labels keep
 * their screen size at every zoom, so the room they take on the sheet is
 * their pixels over `z`; `metrics` splits the sheet's height into the part
 * that scales (`fixedHeight`, sheet pixels) and the part that does not
 * (`screenHeight`, screen pixels), so that fitZoom can solve for `z` in one
 * step: height(z) = fixedHeight + screenHeight / z. A line's height is its
 * columns' largest in each part on its own — the most labels, the tallest
 * stack of frames and gaps — so the split holds at every zoom; a column of
 * one tall page beside one of several short ones is at most a few labels
 * taller than either needs.
 */
export function canvasLayout(groups, z, options = {}) {
  const {
    frame = FRAME,
    heights = new Map(),
    gap = GAP,
    pad = PAD,
    rowGap = ROW_GAP,
    groupGap = GROUP_GAP,
    groupHead = GROUP_HEAD_PX,
    rowHead = ROW_HEAD_PX,
    label = LABEL_PX,
  } = options;
  const scale = z > 0 ? z : 1;
  const items = [];
  const headings = [];
  let y = pad;
  let screen = 0;
  let right = pad; // the right edge of the widest line
  const heightOf = (item) => heights.get(item.id) ?? frame.minHeight;

  groups.forEach((group, gi) => {
    if (gi > 0) {
      y += groupGap;
    }

    const heading = { kind: 'group', key: group.key, title: group.title, x: pad, y, height: groupHead / scale, bottom: y };

    headings.push(heading);
    y += groupHead / scale;
    screen += groupHead;

    const headed = group.rows.length > 1;
    const top = y + (headed ? rowHead / scale : 0); // the first label's top on this line
    let x = pad;
    let deepest = 0; // frames in the column with the most
    let tallest = 0; // sheet pixels of frames and gaps in the column with the most

    group.rows.forEach((row, ri) => {
      if (ri > 0) {
        x += rowGap;
      }

      if (headed) {
        headings.push({ kind: 'row', key: `${group.key}/${row.key}`, title: row.title, x, y, height: rowHead / scale });
      }

      row.columns.forEach((column, ci) => {
        if (ci > 0) {
          x += gap;
        }

        let cy = top;
        let stack = 0;

        column.forEach((item, i) => {
          if (i > 0) {
            cy += gap;
            stack += gap;
          }

          cy += label / scale;

          const height = heightOf(item);

          items.push({ id: item.id, title: item.title, group: group.key, row: row.key, column: ci, x, y: cy, width: frame.width, height });
          cy += height;
          stack += height;
        });

        deepest = Math.max(deepest, column.length);
        tallest = Math.max(tallest, stack);
        x += frame.width;
      });
    });

    right = Math.max(right, x);
    y = top + deepest * (label / scale) + tallest;
    screen += (headed ? rowHead : 0) + deepest * label;
    heading.bottom = y;
  });

  const width = right + pad;
  const height = items.length ? y + pad : pad * 2;

  return { width, height, items, headings, metrics: { fixedHeight: height - screen / scale, screenHeight: screen } };
}

/**
 * A frame's height from its page: the document's scroll height in whole
 * pixels, never under `min` — which is also the answer for a page that said
 * nothing (no document to read, a height that is not a number).
 */
export function frameHeight(scrollHeight, min = FRAME.minHeight) {
  return Number.isFinite(scrollHeight) && scrollHeight > min ? Math.ceil(scrollHeight) : min;
}

export function clampZoom(z) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number.isFinite(z) ? z : 1));
}

/**
 * The zoom at which the whole sheet stands in a view of `width` × `height`
 * screen pixels with `margin` clear round it: the smaller of what the width
 * allows and what the height allows, the headings' screen height taken off
 * the height first (they do not shrink). Never past ZOOM_MAX, never under
 * ZOOM_MIN; 1 for a sheet with nothing on it.
 */
export function fitZoom(view, layout, margin = FIT_MARGIN_PX) {
  const { width, metrics } = layout;

  if (!(width > 0) || !(metrics?.fixedHeight > 0)) {
    return 1;
  }

  const w = Math.max(1, view.width - 2 * margin);
  const h = Math.max(1, view.height - 2 * margin - metrics.screenHeight);

  return clampZoom(Math.min(w / width, h / metrics.fixedHeight));
}

/** The next step on the ladder from `z`: up for `dir` > 0, down otherwise. */
export function stepZoom(z, dir) {
  if (dir > 0) {
    return clampZoom(ZOOM_STEPS.find((step) => step > z + 1e-6) ?? ZOOM_MAX);
  }

  return clampZoom([...ZOOM_STEPS].reverse().find((step) => step < z - 1e-6) ?? ZOOM_MIN);
}

/**
 * The scroll (one axis) that keeps the sheet point under `pointer` (view
 * pixels from the scroller's edge) still across a zoom from `z0` to `z1`,
 * when the sheet's edge stood `offset0` into the scroll box before and stands
 * `offset1` into it after (the room round it). A pointer in the room beside
 * the sheet holds the nearest sheet point instead — the point is clamped to
 * `0 … extent` (the sheet's size on this axis) — so a zoom never leaves the
 * view in empty room with the sheet out of sight. Never under 0; the
 * scroller clamps the far end.
 */
export function anchoredScroll(scroll, pointer, offset0, offset1, z0, z1, extent = Infinity) {
  const sheet = Math.min(extent, Math.max(0, (scroll + pointer - offset0) / z0));

  return Math.max(0, sheet * z1 + offset1 - pointer);
}

/**
 * Where the scroll (one axis) rests after a fit: the sheet (`size` screen
 * pixels, its edge `room` into the scroll box) in the middle of a view of
 * `view` pixels when it fits, its start `margin` in from the view's edge when
 * it does not — a fit that ZOOM_MIN stops short still begins at the top.
 */
export function restingScroll(size, view, room, margin = FIT_MARGIN_PX) {
  if (size <= view) {
    return Math.max(0, room + size / 2 - view / 2);
  }

  return Math.max(0, room - margin);
}

/**
 * The frames near the view: those whose rect on the sheet, scaled by `z`,
 * crosses the view's scroll box — `scrollLeft`/`scrollTop` measured from the
 * sheet's edge (negative while that edge is inside the view), `width`/`height`
 * the view's — grown by `margin` screen pixels on every side. Their ids, in
 * drawing order.
 */
export function framesNear(items, z, view, margin = LOAD_MARGIN_PX) {
  const left = view.scrollLeft - margin;
  const top = view.scrollTop - margin;
  const right = view.scrollLeft + view.width + margin;
  const bottom = view.scrollTop + view.height + margin;

  return items
    .filter((item) => item.x * z < right && (item.x + item.width) * z > left && item.y * z < bottom && (item.y + item.height) * z > top)
    .map((item) => item.id);
}

/**
 * The frames to start loading now: those of `near` (in its order) that
 * `wants` says still have no page, as many as `cap` leaves over the
 * `loading` already under way. Empty while the cap is full.
 */
export function nextLoads(near, wants, loading, cap = LOAD_AT_ONCE) {
  const room = Math.max(0, cap - loading);
  const out = [];

  for (const id of near) {
    if (out.length >= room) {
      break;
    }

    if (wants(id)) {
      out.push(id);
    }
  }

  return out;
}

/** `url` with the view flag set; every other parameter (the token) is kept. '' for no URL. */
export function withViewFlag(url, base) {
  if (!url) {
    return '';
  }

  try {
    const out = new URL(url, base);

    out.searchParams.set(VIEW_FLAG, VIEW_VALUE);

    return out.toString();
  } catch {
    return '';
  }
}

/**
 * A frame's src: for the entry being edited (`current`), the preview's own
 * last URL when there is one — the page as the preview shows it; for every
 * other, the endpoint's. The view flag on both.
 */
export function frameSrc(frame, current, previewUrl, base) {
  const url = frame.id === current && previewUrl ? previewUrl : frame.preview;

  return withViewFlag(url, base);
}

/** A pointer that moved more than `slop` pixels either way is a pan, not a click. */
export function isDrag(from, to, slop = 4) {
  return Math.abs(to.x - from.x) > slop || Math.abs(to.y - from.y) > slop;
}

/** The pane's content box on screen: its rect less its padding. */
export function contentBox(rect, style, clientWidth, clientHeight) {
  const padLeft = parseFloat(style.paddingLeft) || 0;
  const padTop = parseFloat(style.paddingTop) || 0;
  const padRight = parseFloat(style.paddingRight) || 0;
  const padBottom = parseFloat(style.paddingBottom) || 0;

  return { left: rect.left + padLeft, top: rect.top + padTop, width: Math.max(0, clientWidth - padLeft - padRight), height: Math.max(0, clientHeight - padTop - padBottom) };
}

export function isTransparent(color) {
  return !color || color === 'transparent' || /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)$/.test(color);
}

// --- State --------------------------------------------------------------------------

function emptyState() {
  return {
    win: null, // the Control Panel window the button lives in
    layer: null,
    scroller: null,
    sizer: null,
    sheet: null,
    zoomLabel: null,
    zoomBar: null, // floats over the view's bottom-left corner; a fit keeps the sheet above it
    empty: null,
    contents: null, // Statamic's `.live-preview-contents`
    groups: [], // what is drawn (canvasGroups)
    layout: null, // canvasLayout at the current zoom
    entries: new Map(), // frame id -> { frame, item, label, el, hit, url, src: '' until the iframe has been given url }
    heads: new Map(), // heading key -> element
    heights: new Map(), // frame id -> its page's height (frameHeight), once its load has fired; absent until then
    zoom: 1,
    fitted: false, // «Fit all» set the view and nothing has moved it since: a page's height makes the fit again
    pan: null, // { id, x, y, from, lift }: the pointer down on the scroller; `lift` the frame it is on, if that frame can be dragged
    drag: null, // { entry, grab, pointer, target, bar }: a frame being dragged — grab its offset under the pointer (sheet px), bar the drop indicator
    loading: 0, // frames whose page is on its way (LOAD_AT_ONCE)
    loadFrame: 0, // the animation frame of a pending loadNear
    generation: 0, // bumped on every open; a fetch that lands after a close finds another
    cleanups: [], // everything open bound; close runs them all
    styles: [],
  };
}

const canvasState = emptyState();

/** The endpoint's answer for this Control Panel page, once it has come. */
let cachedGroups = null;

/** The breakpoint overview is on its way out before the canvas comes: one click at a time meanwhile. */
let opening = false;

function listen(target, type, fn, options) {
  target.addEventListener(type, fn, options);
  canvasState.cleanups.push(() => target.removeEventListener(type, fn, options));
}

function setStyle(el, prop, value) {
  if (el.style.getPropertyValue(prop) !== value) {
    el.style.setProperty(prop, value);
  }
}

function make(doc, tag, className) {
  const el = doc.createElement(tag);

  el.className = className;

  return el;
}

// --- Public -------------------------------------------------------------------------

/** One canvas at a time, whichever Control Panel window asks. */
export function isSiteCanvasOpen(_win) {
  return !!canvasState.layer;
}

export function toggleSiteCanvas(win) {
  if (isSiteCanvasOpen(win)) {
    closeSiteCanvas(win);
  } else {
    openSiteCanvas(win);
  }
}

export function openSiteCanvas(win) {
  if (canvasState.layer || opening) {
    return;
  }

  const main = previewFrame(win.document);
  const contents = main?.closest('.live-preview-contents');
  const host = contents?.parentElement;

  if (!main || !contents || !host) {
    return;
  }

  // Two states, one at a time: the breakpoint overview goes first. Its layer
  // in the document means its module is loaded; the import resolves at once.
  if (host.ownerDocument.getElementById(BP_OVERVIEW_ID)) {
    opening = true;
    import('./breakpoint-overview.js').then(
      (overview) => {
        opening = false;
        overview.closeBreakpointOverview(win);
        openSiteCanvas(win);
      },
      () => {
        opening = false;
      }
    );

    return;
  }

  const view = host.ownerDocument.defaultView;
  const generation = canvasState.generation + 1;

  Object.assign(canvasState, { win, contents, generation });

  try {
    build(win, host);
    bind(win, view);
    tellBar(win, true);
  } catch (error) {
    teardown(win);

    throw error;
  }

  if (cachedGroups) {
    populate(win, cachedGroups);

    return;
  }

  fetchGroups(win).then(
    (groups) => {
      // Kept whichever open it lands in: the list is the page's, not the open's.
      cachedGroups = groups;

      if (canvasState.generation !== generation || !canvasState.layer) {
        return;
      }

      populate(win, groups);
    },
    () => {
      if (canvasState.generation !== generation || !canvasState.layer) {
        return;
      }

      win.Statamic?.$toast?.error(t(win, 'site_canvas_failed'));
      closeSiteCanvas(win);
    }
  );
}

export function closeSiteCanvas(win) {
  if (canvasState.layer) {
    teardown(win);
  }
}

// The breakpoint overview asks this as it opens: two states, one at a time.
register('site-canvas:close', () => closeSiteCanvas(canvasState.win));

/** Undo everything open did, last bound first, and forget it. */
function teardown(win) {
  const state = canvasState;
  const owner = state.win || win;

  for (const cleanup of state.cleanups.splice(0).reverse()) {
    try {
      cleanup();
    } catch {
      /* a frame's window already gone */
    }
  }

  // Blank first, so the frames' network and video stop at once.
  for (const entry of state.entries.values()) {
    if (entry.src) {
      entry.el.src = 'about:blank';
    }
  }

  state.layer?.remove();
  state.styles.forEach((style) => style.remove());
  tellBar(owner, false);
  Object.assign(canvasState, emptyState(), { generation: state.generation });
}

// --- Data ---------------------------------------------------------------------------

async function fetchGroups(win) {
  const res = await win.fetch(ENDPOINT, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!res.ok) {
    throw new Error(`site canvas: ${res.status}`);
  }

  return canvasGroups(await res.json());
}

// --- Building ------------------------------------------------------------------------

function build(win, host) {
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const background = paneBackground(view, canvasState.contents);
  const docs = [...new Set([doc, win.document])];

  canvasState.styles = docs.map((d) => injectStyle(d, STYLE_ID, canvasCss()));

  const layer = make(doc, 'div', 'sve-sc');
  const scroller = make(doc, 'div', 'sve-sc-scroll');
  const sizer = make(doc, 'div', 'sve-sc-sizer');
  const sheet = make(doc, 'div', 'sve-sc-sheet');
  const empty = make(doc, 'div', 'sve-sc-empty');
  const zoom = make(doc, 'div', 'sve-sc-zoom');

  layer.id = SITE_CANVAS_ID;
  layer.setAttribute('role', 'region');
  layer.setAttribute('aria-label', t(win, 'site_canvas'));
  layer.style.setProperty('--sve-sc-bg', background);
  layer.style.setProperty('--sve-sc-fg', view.getComputedStyle(canvasState.contents).color || 'CanvasText');
  sheet.setAttribute('aria-hidden', 'true');
  empty.hidden = true;

  const zoomOut = zoomButton(doc, 'out', t(win, 'zoom_out'), '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>');
  const zoomLabel = zoomButton(doc, 'label', t(win, 'bp_overview_actual'), '100%');
  const zoomIn = zoomButton(doc, 'in', t(win, 'zoom_in'), '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>');
  const zoomFit = zoomButton(doc, 'fit', t(win, 'site_canvas_fit'), t(win, 'site_canvas_fit'));

  zoom.append(zoomOut, zoomLabel, zoomIn, zoomFit);
  sizer.appendChild(sheet);
  scroller.appendChild(sizer);
  layer.append(scroller, empty, zoom);
  Object.assign(canvasState, { layer, scroller, sizer, sheet, zoomLabel, zoomBar: zoom, empty });

  host.appendChild(layer);
  place();
}

function zoomButton(doc, action, title, html) {
  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.scZoom = action;
  btn.title = title;
  btn.innerHTML = html;

  return btn;
}

/** The pane's gutter colour as it is drawn: its own, or the first ancestor's that has one. */
function paneBackground(view, el) {
  for (let node = el; node?.nodeType === 1; node = node.parentElement) {
    const color = view.getComputedStyle(node).backgroundColor;

    if (!isTransparent(color)) {
      return color;
    }
  }

  return 'Canvas';
}

function canvasCss() {
  const L = `#${SITE_CANVAS_ID}`;
  const ring = 'color-mix(in oklab, var(--theme-color-primary, #4f46e5) 80%, transparent)';

  return `
${L} { position: fixed; z-index: 2; box-sizing: border-box; overflow: hidden; color: var(--sve-sc-fg); font-family: inherit; }
${L} .sve-sc-scroll { position: absolute; inset: 0; overflow: auto; overscroll-behavior: contain; scrollbar-width: none; cursor: grab; background: var(--sve-sc-bg); }
${L} .sve-sc-scroll::-webkit-scrollbar { display: none; }
${L} .sve-sc-scroll[data-panning] { cursor: grabbing; }
${L} .sve-sc-sizer { position: relative; }
${L} .sve-sc-sheet { --z: 1; position: absolute; left: 0; top: 0; transform-origin: 0 0; }
${L} .sve-sc-head { position: absolute; white-space: nowrap; line-height: 1.2; pointer-events: none; }
${L} .sve-sc-head[data-kind="group"] { font-size: calc(1.125rem / var(--z)); font-weight: 600; }
${L} .sve-sc-head[data-kind="row"] { font-size: calc(.8125rem / var(--z)); font-weight: 500; opacity: .7; }
${L} .sve-sc-item { position: absolute; }
${L} .sve-sc-label { position: absolute; left: 0; right: 0; bottom: 100%; margin-bottom: calc(.375rem / var(--z)); display: flex; align-items: baseline; gap: calc(.5rem / var(--z)); font-size: calc(.75rem / var(--z)); line-height: 1.3; white-space: nowrap; opacity: .85; pointer-events: none; }
${L} .sve-sc-title { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
${L} .sve-sc-note { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; opacity: .6; }
${L} .sve-sc-item[data-depth] .sve-sc-label { padding-left: calc(var(--depth) * 1.5rem / var(--z)); }
${L} .sve-sc-item[data-depth] .sve-sc-title::before { content: '↳ '; opacity: .6; }
${L} .sve-sc-item[data-current] .sve-sc-label { opacity: 1; }
${L} .sve-sc-item[data-current] .sve-sc-title { font-weight: 600; }
${L} .sve-sc-frame { display: block; width: 100%; height: 100%; border: 0; background: #fff; pointer-events: none; }
${L} .sve-sc-hit { position: absolute; inset: 0; cursor: pointer; outline: 1px solid rgba(0, 0, 0, .12); }
${L} .sve-sc-hit:hover { outline: calc(.1875rem / var(--z)) solid ${ring}; }
${L} .sve-sc-item[data-current] .sve-sc-hit { outline: calc(.1875rem / var(--z)) solid rgb(96, 165, 250); outline-offset: calc(.1875rem / var(--z)); }
${L} .sve-sc-item[data-arrange] .sve-sc-hit { cursor: grab; }
${L} .sve-sc-item[data-dragging] { z-index: 2; opacity: .85; }
${L} .sve-sc-scroll[data-dragging], ${L} .sve-sc-scroll[data-dragging] .sve-sc-hit { cursor: grabbing; }
${L} .sve-sc-drop { position: absolute; z-index: 1; border-radius: calc(.125rem / var(--z)); background: ${ring}; pointer-events: none; }
${L} .sve-sc-empty { position: absolute; inset: 0; display: grid; place-items: center; font-size: .875rem; opacity: .7; pointer-events: none; }
${L} .sve-sc-leaving { position: absolute; inset: 0; z-index: 3; display: grid; place-items: center; background: rgba(0, 0, 0, .6); animation: sve-sc-fade .38s cubic-bezier(.4, 0, .2, 1); }
${L} .sve-sc-leaving span { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 999px; background: #000; color: #fff; box-shadow: 0 .25rem .875rem rgba(0, 0, 0, .35); }
${L} .sve-sc-leaving svg { animation: sve-sc-spin 1s linear infinite; }
@keyframes sve-sc-fade { from { opacity: 0; } }
@keyframes sve-sc-spin { to { transform: rotate(360deg); } }
${L} .sve-sc-zoom { position: absolute; left: .75rem; bottom: .75rem; display: inline-flex; align-items: center; gap: .25rem; padding: .25rem; border-radius: .5rem; background: rgba(24, 24, 27, .88); color: #fff; box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .25); font: 500 .75rem/1 ui-sans-serif, system-ui, sans-serif; }
${L} .sve-sc-zoom button { display: inline-flex; align-items: center; justify-content: center; min-width: 1.75rem; height: 1.75rem; padding: 0 .5rem; border: 0; border-radius: .375rem; background: transparent; color: inherit; font: inherit; cursor: pointer; }
${L} .sve-sc-zoom button:hover { background: rgba(255, 255, 255, .12); }
${L} .sve-sc-zoom button:disabled { opacity: .4; cursor: default; }
${L} .sve-sc-zoom [data-sc-zoom="label"] { min-width: 3rem; font-variant-numeric: tabular-nums; }
`;
}

/** Follow the pane: a dock opening, the editor column, the window. */
function place() {
  const { contents, layer } = canvasState;
  const view = contents.ownerDocument.defaultView;
  const box = contentBox(contents.getBoundingClientRect(), view.getComputedStyle(contents), contents.clientWidth, contents.clientHeight);

  setStyle(layer, 'left', `${box.left}px`);
  setStyle(layer, 'top', `${box.top}px`);
  setStyle(layer, 'width', `${box.width}px`);
  setStyle(layer, 'height', `${box.height}px`);
}

// --- Frames --------------------------------------------------------------------------

/**
 * The groups onto the sheet: headings, labels, empty frames and their hit
 * layers, each frame with the URL it will load when its turn comes (the
 * preview's own for the entry being edited, the endpoint's for the rest);
 * at ZOOM_DEFAULT, the sheet at rest from its top-left corner.
 */
function populate(win, groups) {
  const { sheet, empty, scroller } = canvasState;
  const doc = sheet.ownerDocument;
  const current = currentEntryId(win);
  const preview = ask('lp:lastPreviewUrl') || '';

  canvasState.groups = groups;

  const frames = canvasFrames(groups);

  empty.hidden = frames.length > 0;
  empty.textContent = frames.length ? '' : t(win, 'site_canvas_empty');

  const at1 = canvasLayout(groups, 1);

  for (const heading of at1.headings) {
    const el = make(doc, 'div', 'sve-sc-head');

    el.dataset.kind = heading.kind;
    el.textContent = heading.title;
    sheet.appendChild(el);
    canvasState.heads.set(heading.key, el);
  }

  for (const group of groups) {
    for (const frame of canvasFrames([group])) {
      const item = make(doc, 'div', 'sve-sc-item');
      const label = make(doc, 'div', 'sve-sc-label');
      const el = make(doc, 'iframe', 'sve-sc-frame');
      const hit = make(doc, 'div', 'sve-sc-hit');

      item.dataset.id = frame.id;
      item.style.width = `${FRAME.width}px`;
      label.appendChild(make(doc, 'span', 'sve-sc-title')).textContent = frame.title;

      // Where the frame stands in the site: the template a page is drawn with, the page a template is drawn on.
      if (frame.note) {
        label.appendChild(make(doc, 'span', 'sve-sc-note')).textContent = frame.note;
      }

      // A page under another is picked up with its parent, never on its own.
      const arrange = group.arrange && frame.depth === 0;

      el.title = frame.note ? `${frame.title} — ${frame.note}` : frame.title;
      el.tabIndex = -1;
      hit.title = frame.id === current ? t(win, 'site_canvas_current') : t(win, arrange ? 'site_canvas_drag' : 'site_canvas_open', { title: frame.title });

      if (frame.id === current) {
        item.dataset.current = '';
      }

      if (arrange) {
        item.dataset.arrange = '';
      }

      if (frame.depth > 0) {
        item.dataset.depth = String(frame.depth);
        item.style.setProperty('--depth', String(frame.depth));
      }

      item.append(label, el, hit);
      sheet.appendChild(item);
      canvasState.entries.set(frame.id, { frame, group: group.key, arrange, item, label, el, hit, url: frameSrc(frame, current, preview, win.location.href), src: '' });
    }
  }

  applyZoom(ZOOM_DEFAULT);
  centreSheet();
}

/** «Fit all»: the whole sheet in the fit view, at rest — and kept so as pages' heights come, until the view is moved. */
function fitSheet() {
  const { groups, heights } = canvasState;

  applyZoom(fitZoom(fitView(), canvasLayout(groups, 1, { heights })));
  centreSheet();
  canvasState.fitted = true;
}

/**
 * Zoom is one transform on the sheet plus the sizer the scroll area is
 * measured by: the sheet's size at this zoom with a view's width and height
 * of room on every side. The headings and labels keep their screen size, so
 * the sheet is laid out again at every zoom (their room on it changes), and
 * again as a page's height comes in; the frames then near the view get
 * their page.
 */
function applyZoom(z) {
  const { sheet, sizer, scroller, groups, heights, heads, entries, zoomLabel } = canvasState;
  const layout = canvasLayout(groups, z, { heights });
  const room = { x: scroller.clientWidth, y: scroller.clientHeight };

  canvasState.zoom = z;
  canvasState.layout = layout;

  for (const heading of layout.headings) {
    const el = heads.get(heading.key);

    if (el) {
      setStyle(el, 'left', `${heading.x}px`);
      setStyle(el, 'top', `${heading.y}px`);
      setStyle(el, 'height', `${heading.height}px`);
    }
  }

  for (const item of layout.items) {
    const entry = entries.get(item.id);

    if (entry) {
      setStyle(entry.item, 'left', `${item.x}px`);
      setStyle(entry.item, 'top', `${item.y}px`);
      setStyle(entry.item, 'height', `${item.height}px`);
    }
  }

  setStyle(sheet, 'transform', `scale(${z})`);
  setStyle(sheet, '--z', String(z));
  setStyle(sheet, 'width', `${layout.width}px`);
  setStyle(sheet, 'height', `${layout.height}px`);
  setStyle(sheet, 'left', `${room.x}px`);
  setStyle(sheet, 'top', `${room.y}px`);
  setStyle(sizer, 'width', `${Math.ceil(layout.width * z) + 2 * room.x}px`);
  setStyle(sizer, 'height', `${Math.ceil(layout.height * z) + 2 * room.y}px`);

  const percent = `${Math.round(z * 100)}%`;

  if (zoomLabel.textContent !== percent) {
    zoomLabel.textContent = percent;
  }

  paintZoomButtons(z);
  loadNear();
}

function paintZoomButtons(z) {
  const { layer } = canvasState;
  const out = layer.querySelector('[data-sc-zoom="out"]');
  const zoomIn = layer.querySelector('[data-sc-zoom="in"]');

  if (out && out.disabled !== z <= ZOOM_MIN + 1e-6) {
    out.disabled = z <= ZOOM_MIN + 1e-6;
  }

  if (zoomIn && zoomIn.disabled !== z >= ZOOM_MAX - 1e-6) {
    zoomIn.disabled = z >= ZOOM_MAX - 1e-6;
  }
}

/** Where the sheet's edge stands in the scroll box: the room round it. */
function sheetOrigin() {
  const { sizer, sheet } = canvasState;

  return { x: sizer.offsetLeft + sheet.offsetLeft, y: sizer.offsetTop + sheet.offsetTop };
}

/** Zoom to `next`, keeping the point at `anchor` (view pixels; default the middle) still. */
function setZoom(next, anchor = null) {
  const { scroller } = canvasState;
  const z0 = canvasState.zoom;
  const z1 = clampZoom(next);

  if (Math.abs(z1 - z0) < 0.0001) {
    return;
  }

  const x = anchor ? anchor.x : scroller.clientWidth / 2;
  const y = anchor ? anchor.y : scroller.clientHeight / 2;
  const left = scroller.scrollLeft;
  const top = scroller.scrollTop;
  const offset0 = sheetOrigin();

  applyZoom(z1);

  const offset1 = sheetOrigin();
  const { layout } = canvasState;

  scroller.scrollLeft = anchoredScroll(left, x, offset0.x, offset1.x, z0, z1, layout.width);
  scroller.scrollTop = anchoredScroll(top, y, offset0.y, offset1.y, z0, z1, layout.height);
  loadNear();
}

/**
 * The view a fit fills: the scroll box less the strip along its bottom that
 * the zoom bar floats over, so a fitted sheet stands clear of the bar.
 */
function fitView() {
  const { scroller, layer, zoomBar } = canvasState;
  const strip = zoomBar ? Math.max(0, layer.clientHeight - zoomBar.offsetTop) : 0;

  return { width: scroller.clientWidth, height: Math.max(1, scroller.clientHeight - strip) };
}

/** The sheet at rest at the zoom it has: in the middle of the fit view on an axis it fits on, its edge a margin in from the view's on one it does not — the open at ZOOM_DEFAULT, a fit that ZOOM_MIN stopped short. */
function centreSheet() {
  const { scroller, layout, zoom } = canvasState;
  const origin = sheetOrigin();
  const view = fitView();

  scroller.scrollLeft = restingScroll(layout.width * zoom, view.width, origin.x);
  scroller.scrollTop = restingScroll(layout.height * zoom, view.height, origin.y);
  loadNear();
}

/** The pane changed size: the room round the sheet follows it, and the sheet stays where it is on screen. */
function keepRoom() {
  const { scroller, layout, zoom } = canvasState;

  if (!layout) {
    return;
  }

  const before = sheetOrigin();
  const left = scroller.scrollLeft;
  const top = scroller.scrollTop;

  applyZoom(zoom);

  const after = sheetOrigin();

  scroller.scrollLeft = left + (after.x - before.x);
  scroller.scrollTop = top + (after.y - before.y);
  loadNear();
}

function zoomAction(action) {
  const { zoom } = canvasState;

  canvasState.fitted = false;

  if (action === 'in') {
    setZoom(stepZoom(zoom, 1));
  } else if (action === 'out') {
    setZoom(stepZoom(zoom, -1));
  } else if (action === 'actual') {
    setZoom(1);
  } else if (action === 'fit') {
    fitSheet();
  }
}

/** Give the frames near the view their page, once each and a few at a time. The view box is the scroll box, measured from the sheet's edge. */
function loadNear() {
  const { scroller, layout, zoom, entries } = canvasState;

  if (!layout) {
    return;
  }

  const origin = sheetOrigin();
  const view = {
    scrollLeft: scroller.scrollLeft - origin.x,
    scrollTop: scroller.scrollTop - origin.y,
    width: scroller.clientWidth,
    height: scroller.clientHeight,
  };
  const wants = (id) => {
    const entry = entries.get(id);

    return !!entry?.url && !entry.src;
  };

  for (const id of nextLoads(framesNear(layout.items, zoom, view), wants, canvasState.loading)) {
    const entry = entries.get(id);

    entry.src = entry.url;
    canvasState.loading += 1;
    listen(entry.el, 'load', () => {
      canvasState.loading -= 1;
      measured(entry);
    }, { once: true });
    entry.el.src = entry.src;
  }
}

/**
 * A page has loaded: its frame takes the page's height, read once, now,
 * from the frame's own document (the preview is the same origin as the
 * Control Panel; a frame whose document cannot be read stays at the
 * minimum). The sheet is laid out again with it at the zoom it has, the
 * view left where it is — the frames below move down — and the frames
 * then near the view load; after a «Fit all» nothing has moved, the fit is
 * made again instead.
 */
function measured(entry) {
  const { heights, zoom, fitted } = canvasState;

  heights.set(entry.frame.id, frameHeight(entry.el.contentDocument?.documentElement?.scrollHeight));

  if (fitted) {
    fitSheet();
  } else {
    applyZoom(zoom);
  }
}

/** A scroll's loadNear, once per animation frame however many scroll events come in it. */
function scheduleLoad() {
  const { contents } = canvasState;
  const view = contents.ownerDocument.defaultView;

  if (canvasState.loadFrame) {
    return;
  }

  canvasState.loadFrame = view.requestAnimationFrame(() => {
    canvasState.loadFrame = 0;
    loadNear();
  });
}

// --- Binding -------------------------------------------------------------------------

function bind(win, view) {
  const { contents, scroller, layer } = canvasState;

  canvasState.cleanups.push(() => {
    if (canvasState.loadFrame) {
      view.cancelAnimationFrame(canvasState.loadFrame);
      canvasState.loadFrame = 0;
    }
  });

  // Follows the pane; closes with Live Preview (the pane leaves the document).
  const observer = new view.ResizeObserver(() => {
    const rect = contents.isConnected ? contents.getBoundingClientRect() : null;

    if (!rect || (rect.width === 0 && rect.height === 0)) {
      closeSiteCanvas(win);

      return;
    }

    place();
    keepRoom();
  });

  observer.observe(contents);
  canvasState.cleanups.push(() => observer.disconnect());

  [...new Set([view, win])].forEach((target) => listen(target, 'keydown', onKey));

  listen(scroller, 'wheel', onWheel, { passive: false });
  listen(scroller, 'scroll', onScroll, { passive: true });
  listen(scroller, 'pointerdown', onPanStart);
  listen(scroller, 'pointermove', onPanMove);
  listen(scroller, 'pointerup', onPanEnd);
  listen(scroller, 'pointercancel', onPanEnd);

  listen(layer, 'click', (event) => {
    const btn = event.target.closest?.('[data-sc-zoom]');

    if (btn && layer.contains(btn)) {
      zoomAction(btn.dataset.scZoom === 'label' ? 'actual' : btn.dataset.scZoom);
    }
  });
}

/** A scroll: the frames now near load; a frame being dragged stays under the pointer as the sheet moves beneath it. */
function onScroll() {
  scheduleLoad();

  if (canvasState.drag) {
    moveDrag(canvasState.drag.pointer.x, canvasState.drag.pointer.y);
  }
}

/** Escape puts a dragged frame back, else closes; a plain `+` or `-` (lib/zoom-keys.js: no modifier, no field being typed in) steps the zoom round the view's middle, as the bar's buttons do. */
function onKey(event) {
  if (event.key === 'Escape' && !event.defaultPrevented) {
    if (canvasState.drag) {
      event.preventDefault();
      endDrag(false);
    } else {
      closeSiteCanvas(canvasState.win);
    }

    return;
  }

  const dir = zoomKey(event);

  if (dir) {
    event.preventDefault();
    zoomAction(dir);
  }
}

/**
 * Ctrl/Cmd and a trackpad pinch zoom the sheet round the pointer, never the
 * browser's own page zoom. Any other wheel is the scroller's own scroll, in
 * both directions — nothing to do here.
 */
function onWheel(event) {
  // A scroll or a zoom: either moves the view off the fit.
  canvasState.fitted = false;

  if (!event.ctrlKey && !event.metaKey) {
    return;
  }

  event.preventDefault();

  const { scroller, zoom } = canvasState;
  const rect = scroller.getBoundingClientRect();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1;

  setZoom(zoom * Math.exp(-event.deltaY * unit * 0.0015), { x: event.clientX - rect.left, y: event.clientY - rect.top });
}

function onPanStart(event) {
  const { scroller } = canvasState;
  const rect = scroller.getBoundingClientRect();

  // Not on a scrollbar: those keep working as scrollbars. Not on the zoom bar.
  if (event.button !== 0 || event.clientX - rect.left >= scroller.clientWidth || event.clientY - rect.top >= scroller.clientHeight) {
    return;
  }

  event.preventDefault();

  // On a frame that can be dragged: a movement past the click threshold lifts it instead of panning.
  const item = event.target.closest?.('.sve-sc-item');
  const lift = item ? canvasState.entries.get(item.dataset.id) : null;

  canvasState.pan = { id: event.pointerId, x: event.clientX, y: event.clientY, from: { x: event.clientX, y: event.clientY }, lift: lift?.arrange && arrangeRow(lift) ? lift : null };
  scroller.setPointerCapture(event.pointerId);
  scroller.dataset.panning = '';
}

function onPanMove(event) {
  const { pan, scroller } = canvasState;

  if (!pan || pan.id !== event.pointerId) {
    return;
  }

  // A press on a frame that can be dragged is a click or a drag of that frame — never a pan, not
  // even the few pixels under the threshold: the sheet must stand still under the lifted frame.
  if (pan.lift) {
    if (!canvasState.drag && isDrag(pan.from, { x: event.clientX, y: event.clientY })) {
      startDrag(pan.lift, pan.from);
    }

    if (canvasState.drag) {
      moveDrag(event.clientX, event.clientY);
    }

    return;
  }

  if (isDrag(pan.from, { x: event.clientX, y: event.clientY })) {
    canvasState.fitted = false;
  }

  scroller.scrollLeft -= event.clientX - pan.x;
  scroller.scrollTop -= event.clientY - pan.y;
  pan.x = event.clientX;
  pan.y = event.clientY;
}

function onPanEnd(event) {
  const { pan, scroller, win } = canvasState;

  if (!pan || pan.id !== event.pointerId) {
    return;
  }

  canvasState.pan = null;
  delete scroller.dataset.panning;

  if (scroller.hasPointerCapture(event.pointerId)) {
    scroller.releasePointerCapture(event.pointerId);
  }

  if (canvasState.drag) {
    endDrag(event.type === 'pointerup');

    return;
  }

  // A click, not a pan, on a frame: that entry becomes the page being edited.
  if (event.type !== 'pointerup' || isDrag(pan.from, { x: event.clientX, y: event.clientY })) {
    return;
  }

  const hit = scroller.ownerDocument.elementFromPoint(event.clientX, event.clientY)?.closest?.('.sve-sc-item');
  const entry = hit ? canvasState.entries.get(hit.dataset.id) : null;

  if (entry) {
    openEntry(win, entry.frame);
  }
}

// --- Arranging -----------------------------------------------------------------------

/** A point on the screen as a point on the sheet, in sheet pixels. */
function toSheet(clientX, clientY) {
  const { scroller, zoom } = canvasState;
  const rect = scroller.getBoundingClientRect();
  const origin = sheetOrigin();

  return { x: (clientX - rect.left + scroller.scrollLeft - origin.x) / zoom, y: (clientY - rect.top + scroller.scrollTop - origin.y) / zoom };
}

/** The group a dragged frame belongs to, its one row, and where its line stands. */
function arrangeRow(entry) {
  const { groups, layout } = canvasState;
  const group = groups.find((candidate) => candidate.key === entry.group);
  const heading = layout?.headings.find((candidate) => candidate.kind === 'group' && candidate.key === entry.group);

  if (!group?.arrange || group.rows.length !== 1 || !heading) {
    return null;
  }

  return { group, row: group.rows[0], band: { top: heading.y, bottom: heading.bottom } };
}

/** The elements of `entry`'s unit — its own and those of the frames under it — which move as one. */
function unitElements(entry, row) {
  const unit = unitFrames(row).get(entry.frame.id) ?? [entry.frame];

  return unit.map((frame) => canvasState.entries.get(frame.id)?.item).filter(Boolean);
}

/** Lift `entry` and the frames under it: they follow the pointer from where it was grabbed; a bar on the sheet will say where they would land. */
function startDrag(entry, from) {
  const { scroller, sheet, layout } = canvasState;
  const item = layout?.items.find((candidate) => candidate.id === entry.frame.id);
  const place = arrangeRow(entry);

  if (!item || !place) {
    return;
  }

  const grabbed = toSheet(from.x, from.y);
  const bar = make(sheet.ownerDocument, 'div', 'sve-sc-drop');
  const elements = unitElements(entry, place.row);

  bar.hidden = true;
  sheet.appendChild(bar);
  elements.forEach((el) => (el.dataset.dragging = ''));
  scroller.dataset.dragging = '';
  canvasState.drag = { entry, elements, grab: { x: grabbed.x - item.x, y: grabbed.y - item.y }, pointer: { x: from.x, y: from.y }, target: null, bar };
}

/** The dragged unit under the pointer, and the bar where it would land — nowhere above its group's heading. */
function moveDrag(clientX, clientY) {
  const { drag, layout, zoom } = canvasState;
  const place = arrangeRow(drag.entry);
  const item = layout.items.find((candidate) => candidate.id === drag.entry.frame.id);

  drag.pointer = { x: clientX, y: clientY };

  if (!place || !item) {
    return;
  }

  const point = toSheet(clientX, clientY);
  const id = drag.entry.frame.id;
  const transform = `translate(${point.x - drag.grab.x - item.x}px, ${point.y - drag.grab.y - item.y}px)`;

  drag.elements.forEach((el) => setStyle(el, 'transform', transform));

  const columns = columnIds(place.row);
  const units = unitItems(place.row, layout.items);
  const target = point.y >= place.band.top ? dropTarget(columns, units, point, id) : null;
  const bar = target ? dropIndicator(target, columns, units, id, place.band, zoom) : null;

  drag.target = target;

  if (bar) {
    setStyle(drag.bar, 'left', `${bar.x}px`);
    setStyle(drag.bar, 'top', `${bar.y}px`);
    setStyle(drag.bar, 'width', `${bar.width}px`);
    setStyle(drag.bar, 'height', `${bar.height}px`);
  }

  if (drag.bar.hidden !== !bar) {
    drag.bar.hidden = !bar;
  }
}

/** Put the frame down: where the bar said, if `commit` and it said anywhere; back where it was otherwise. */
function endDrag(commit) {
  const { drag, scroller } = canvasState;

  if (!drag) {
    return;
  }

  canvasState.drag = null;
  drag.bar.remove();
  drag.elements.forEach((el) => {
    delete el.dataset.dragging;
    el.style.removeProperty('transform');
  });
  delete scroller.dataset.dragging;

  if (commit && drag.target) {
    arrangeTo(drag.entry, drag.target);
  }
}

/**
 * The columns with `entry`'s unit moved to `target`: drawn at once, kept
 * for a second open, posted for the site (the units' ids — the top pages').
 * The same columns back is nothing to do. An answer that is not ok puts the
 * columns back as they were and says so — the canvas shows what the site has.
 */
function arrangeTo(entry, target) {
  const { win } = canvasState;
  const place = arrangeRow(entry);

  if (!place) {
    return;
  }

  const before = canvasState.groups;
  const columns = moveFrame(columnIds(place.row), entry.frame.id, target);

  if (sameColumns(columns, columnIds(place.row))) {
    return;
  }

  const units = unitFrames(place.row);
  const after = before.map((group) => (group !== place.group ? group : { ...group, rows: [{ ...place.row, columns: columns.map((column) => column.flatMap((id) => units.get(id))) }] }));

  showGroups(after);

  saveArrangement(win, columns).catch(() => {
    if (cachedGroups === after) {
      showGroups(before);
    }

    win.Statamic?.$toast?.error(t(win, 'site_canvas_arrange_failed'));
  });
}

/** `groups` are what the canvas draws from now on, this open and the next: laid out again at the zoom it has — the fit made again if «Fit all» stood. */
function showGroups(groups) {
  cachedGroups = groups;

  if (!canvasState.layer) {
    return;
  }

  canvasState.groups = groups;

  if (canvasState.fitted) {
    fitSheet();
  } else {
    applyZoom(canvasState.zoom);
  }
}

async function saveArrangement(win, columns) {
  const res = await win.fetch(ARRANGE_ENDPOINT, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrfToken(win) },
    body: JSON.stringify({ columns }),
  });

  if (!res.ok) {
    throw new Error(`site canvas: ${res.status}`);
  }
}

/**
 * The one way Live Preview moves to another entry: navigateFromLp — unsaved
 * work asked about first, the next editor booted hidden and swapped in once
 * it has painted. The canvas stays up under a spinner meanwhile, so the page
 * being left is never seen again: the host's swap (or its full navigation if
 * the swap fails) replaces this document, canvas and all. Only a cancelled
 * unsaved question comes back here, and takes the spinner down. The entry
 * already being edited only closes the canvas: the page under it is that page.
 */
function openEntry(win, frame) {
  if (frame.id === currentEntryId(win)) {
    closeSiteCanvas(win);

    return;
  }

  const leaving = showLeaving(win);

  Promise.all([import('./pages.js'), import('./lp-templates.js')]).then(([{ navigateFromLp }, { inLivePreview }]) => {
    navigateFromLp(win, null, inLivePreview(win, frame.edit), () => leaving.remove());
  });
}

/** Dims the canvas and spins over it while the next page is on its way. */
function showLeaving(win) {
  const { layer } = canvasState;
  const leaving = make(layer.ownerDocument, 'div', 'sve-sc-leaving');

  leaving.setAttribute('role', 'status');
  leaving.setAttribute('aria-label', t(win, 'loading'));
  leaving.innerHTML =
    '<span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></span>';
  layer.appendChild(leaving);

  return leaving;
}

// --- Paint ---------------------------------------------------------------------------

/**
 * The top bar's icon says whether the canvas is open. Told on the bus and
 * painted by the bar (cp-shell/header-toolbar.js): the icon is the bar's, and
 * this module imports nothing of it.
 */
function tellBar(win, open) {
  emit('site-canvas:state', { win, open });
}
