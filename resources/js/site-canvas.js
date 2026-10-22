/**
 * The site canvas (demo): the site's templates and pages as frames on one
 * surface in Live Preview, in the spirit of Shopify's Canvas overview. Pan and
 * zoom; a click on a frame closes the canvas and makes that entry the page
 * being edited — the Live Preview we have today, fields, overlay and all. The
 * canvas itself edits nothing.
 *
 * Owns one layer over the preview pane (`#__sve-site-canvas`), the frames on
 * it, its zoom and pan. The top-bar button `[data-canvas]`
 * (cp-shell/block-order.js, behind the `site_canvas` feature, off by default)
 * is the only way in: an `import()` on click. No file imports this module
 * statically, and it puts nothing on `window`.
 *
 * Two groups, laid out by rule, never by hand: the templates store's rows
 * under the collection they draw (index and show for Services, say; the site's
 * own views in a row of their own), and the pages collection's entries in the
 * order of their tree. What stands in them comes from one place, the
 * `/!/sve/site-canvas` endpoint (SiteCanvasController): id, title, the Live
 * Preview URL to show and the edit URL to go to. Nothing is scraped from the
 * Control Panel. The answer is kept for the life of this Control Panel page —
 * a click on a frame boots a new one — so a second open draws at once. The
 * frame of the entry being edited takes the preview's own last URL
 * (`lp:lastPreviewUrl`) instead of the endpoint's, every time the canvas
 * opens: it shows the page as the preview shows it, unsaved edits and all,
 * and is the one frame that changes between two opens. The others keep the
 * URL they were given.
 *
 * The sheet (one transform, `scale(z)`) lies in a scroll box with a view's
 * width and height of room round it on every side, so every pan is a scroll
 * position — drag, wheel in both directions — and a zoom round the pointer
 * keeps the point under it exactly (the nearest sheet point, for a pointer
 * in the room beside it); the room follows the pane's size. It opens fitted
 * and centred — from the top-left edge instead, where a small pane and
 * ZOOM_MIN leave the sheet bigger than the view. The scrollbars are not
 * drawn: the room would make them say "more" at every zoom.
 *
 * Every frame is an iframe at one desktop viewport of its page's top
 * (FRAME, 1440×900 CSS pixels), scaled down with the sheet's one transform —
 * not page-high. Its URL carries `sve_view=canvas`, which InjectBridgeScript
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
import { ask, register } from './cp/bus.js';
import { t } from './lib/i18n.js';
import { BP_OVERVIEW_ID, LP_PREVIEW_CHROME_ID, LP_PRIMARY_FLAT } from './lib/ids.js';
import { currentEntryId } from './lib/live-preview.js';
import { previewFrame } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';

export const SITE_CANVAS_ID = '__sve-site-canvas';
const STYLE_ID = '__sve-site-canvas-style';
const ON_CLASS = 'sve-sc-on';

/** The endpoint the list comes from. */
export const ENDPOINT = '/!/sve/site-canvas';

/** The query flag InjectBridgeScript reads (mirror.js, no bridge), and the value that names these frames. */
export const VIEW_FLAG = 'sve_view';
export const VIEW_VALUE = 'canvas';

/** One frame: a desktop viewport of the page's top, in CSS pixels. */
export const FRAME = { width: 1440, height: 900 };

/** Sheet pixels (they scale with the zoom): between frames, round the sheet, between the two groups. */
export const GAP = 96;
export const PAD = 96;
export const GROUP_GAP = 192;

/** Frames per line before a row wraps. */
export const COLS = 4;

/** Screen pixels, the same at every zoom: a group heading, a row heading, a frame's label above it. */
export const GROUP_HEAD_PX = 48;
export const ROW_HEAD_PX = 32;
export const LABEL_PX = 28;

export const ZOOM_MIN = 0.03;
export const ZOOM_MAX = 1;
const ZOOM_STEPS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.33, 0.5, 0.67, 0.75, 1];

/** Screen pixels kept clear round the sheet when it is fitted to the view. */
export const FIT_MARGIN_PX = 24;

/** Screen pixels beyond the view's edge at which a frame still counts as near, and loads. */
export const LOAD_MARGIN_PX = 200;

/** Frames loading at once: each is a page the server renders, and the preview's own requests must not queue behind them. */
export const LOAD_AT_ONCE = 4;

// --- Pure helpers (tests/js/site-canvas.test.js) ------------------------------------

/**
 * The endpoint's answer as the groups the canvas draws: `{ key, title,
 * rows: [{ key, title, frames: [{ id, title, preview, edit }] }] }`. A frame
 * without an id, a preview URL or an edit URL is left out, and a row or
 * group left empty by that goes with it.
 */
export function canvasGroups(payload) {
  const groups = Array.isArray(payload?.groups) ? payload.groups : [];

  return groups
    .map((group) => ({
      key: String(group?.key || ''),
      title: String(group?.title || ''),
      rows: (Array.isArray(group?.rows) ? group.rows : [])
        .map((row) => ({
          key: String(row?.key || ''),
          title: String(row?.title || ''),
          frames: (Array.isArray(row?.frames) ? row.frames : [])
            .filter((frame) => frame && frame.id && frame.preview && frame.edit)
            .map((frame) => ({
              id: String(frame.id),
              title: String(frame.title || frame.id),
              preview: String(frame.preview),
              edit: String(frame.edit),
            })),
        }))
        .filter((row) => row.frames.length > 0),
    }))
    .filter((group) => group.key && group.rows.length > 0);
}

/** Every frame of every group, in drawing order. */
export function canvasFrames(groups) {
  return groups.flatMap((group) => group.rows.flatMap((row) => row.frames));
}

/**
 * Where everything stands on the sheet at zoom `z`, in sheet pixels — the
 * sheet div's own, before its transform. Frames are FRAME-sized, `cols` to a
 * line. A group's rows flow along a line, each a block of its heading over
 * its frames, until the next block's columns would not fit, which starts a
 * new line (two short template rows share one line; a row of more than
 * `cols` frames wraps within itself). The groups stand apart by `groupGap`.
 * Headings and labels keep their screen size at every zoom, so the room they
 * take on the sheet is their pixels over `z`; `metrics` splits the sheet's
 * height into the part that scales (`fixedHeight`, sheet pixels) and the part
 * that does not (`screenHeight`, screen pixels), so that fitZoom can solve
 * for `z` in one step: height(z) = fixedHeight + screenHeight / z. A line's
 * height is its tallest block's, and the block with the most frame lines is
 * the tallest in both parts at once, so the split holds.
 */
export function canvasLayout(groups, z, options = {}) {
  const {
    cols = COLS,
    frame = FRAME,
    gap = GAP,
    pad = PAD,
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
  let maxCols = 0;
  // A line of blocks: its height is rowHead + lines × (label + frame + gap) − gap, for the most lines any block on it has.
  const lineHeight = (lines) => rowHead / scale + lines * (label / scale + frame.height + gap) - gap;

  groups.forEach((group, gi) => {
    if (gi > 0) {
      y += groupGap;
    }

    headings.push({ kind: 'group', key: group.key, title: group.title, x: pad, y, height: groupHead / scale });
    y += groupHead / scale;
    screen += groupHead;

    let used = 0; // columns taken on the current line
    let deepest = 0; // frame lines of the tallest block on it

    const closeLine = () => {
      y += lineHeight(deepest);
      screen += rowHead + deepest * label;
      used = 0;
      deepest = 0;
    };

    group.rows.forEach((row) => {
      const span = Math.min(cols, row.frames.length);
      const lines = Math.ceil(row.frames.length / cols);

      if (used > 0 && used + span > cols) {
        closeLine();
        y += gap;
      }

      const x0 = pad + used * (frame.width + gap);

      headings.push({ kind: 'row', key: `${group.key}/${row.key}`, title: row.title, x: x0, y, height: rowHead / scale });

      row.frames.forEach((item, i) => {
        const col = i % cols;
        const line = Math.floor(i / cols);

        items.push({
          id: item.id,
          title: item.title,
          group: group.key,
          row: row.key,
          x: x0 + col * (frame.width + gap),
          y: y + rowHead / scale + line * (label / scale + frame.height + gap) + label / scale,
          width: frame.width,
          height: frame.height,
        });
      });

      used += span;
      deepest = Math.max(deepest, lines);
      maxCols = Math.max(maxCols, used);
    });

    if (used > 0) {
      closeLine();
    }
  });

  const width = pad * 2 + Math.max(0, maxCols * (frame.width + gap) - gap);
  const height = items.length ? y + pad : pad * 2;

  return { width, height, items, headings, metrics: { fixedHeight: height - screen / scale, screenHeight: screen } };
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
    zoom: 1,
    pan: null,
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
    paintButton(win, true);
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
  paintButton(owner, false);
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
${L} .sve-sc-label { position: absolute; left: 0; right: 0; bottom: 100%; margin-bottom: calc(.375rem / var(--z)); font-size: calc(.75rem / var(--z)); line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: .85; pointer-events: none; }
${L} .sve-sc-item[data-current] .sve-sc-label { font-weight: 600; opacity: 1; }
${L} .sve-sc-frame { display: block; width: 100%; height: 100%; border: 0; background: #fff; pointer-events: none; }
${L} .sve-sc-hit { position: absolute; inset: 0; cursor: pointer; outline: 1px solid rgba(0, 0, 0, .12); }
${L} .sve-sc-hit:hover { outline: calc(.1875rem / var(--z)) solid ${ring}; }
${L} .sve-sc-item[data-current] .sve-sc-hit { outline: calc(.1875rem / var(--z)) solid rgb(96, 165, 250); outline-offset: calc(.1875rem / var(--z)); }
${L} .sve-sc-empty { position: absolute; inset: 0; display: grid; place-items: center; font-size: .875rem; opacity: .7; pointer-events: none; }
${L} .sve-sc-zoom { position: absolute; left: .75rem; bottom: .75rem; display: inline-flex; align-items: center; gap: .25rem; padding: .25rem; border-radius: .5rem; background: rgba(24, 24, 27, .88); color: #fff; box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .25); font: 500 .75rem/1 ui-sans-serif, system-ui, sans-serif; }
${L} .sve-sc-zoom button { display: inline-flex; align-items: center; justify-content: center; min-width: 1.75rem; height: 1.75rem; padding: 0 .5rem; border: 0; border-radius: .375rem; background: transparent; color: inherit; font: inherit; cursor: pointer; }
${L} .sve-sc-zoom button:hover { background: rgba(255, 255, 255, .12); }
${L} .sve-sc-zoom button:disabled { opacity: .4; cursor: default; }
${L} .sve-sc-zoom [data-sc-zoom="label"] { min-width: 3rem; font-variant-numeric: tabular-nums; }
#${LP_PREVIEW_CHROME_ID} [data-canvas].${ON_CLASS} { background: ${LP_PRIMARY_FLAT} !important; color: #fff !important; opacity: 1 !important; }
#${LP_PREVIEW_CHROME_ID} [data-canvas].${ON_CLASS} svg { opacity: 1; }
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
 * then the zoom that shows them all.
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

  for (const frame of frames) {
    const item = make(doc, 'div', 'sve-sc-item');
    const label = make(doc, 'div', 'sve-sc-label');
    const el = make(doc, 'iframe', 'sve-sc-frame');
    const hit = make(doc, 'div', 'sve-sc-hit');

    item.dataset.id = frame.id;
    item.style.width = `${FRAME.width}px`;
    item.style.height = `${FRAME.height}px`;
    label.textContent = frame.title;
    el.title = frame.title;
    el.tabIndex = -1;
    hit.title = frame.id === current ? t(win, 'site_canvas_current') : t(win, 'site_canvas_open', { title: frame.title });

    if (frame.id === current) {
      item.dataset.current = '';
    }

    item.append(label, el, hit);
    sheet.appendChild(item);
    canvasState.entries.set(frame.id, { frame, item, label, el, hit, url: frameSrc(frame, current, preview, win.location.href), src: '' });
  }

  applyZoom(fitZoom(fitView(), at1));
  centreSheet();
}

/**
 * Zoom is one transform on the sheet plus the sizer the scroll area is
 * measured by: the sheet's size at this zoom with a view's width and height
 * of room on every side. The headings and labels keep their screen size, so
 * the sheet is laid out again at every zoom (their room on it changes); the
 * frames then near the view get their page.
 */
function applyZoom(z) {
  const { sheet, sizer, scroller, groups, heads, entries, zoomLabel } = canvasState;
  const layout = canvasLayout(groups, z);
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

/** The sheet at rest after a fit: in the middle of the fit view, or from its top-left edge where it is bigger than that. */
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
  const { zoom, groups } = canvasState;

  if (action === 'in') {
    setZoom(stepZoom(zoom, 1));
  } else if (action === 'out') {
    setZoom(stepZoom(zoom, -1));
  } else if (action === 'actual') {
    setZoom(1);
  } else if (action === 'fit') {
    setZoom(fitZoom(fitView(), canvasLayout(groups, 1)));
    centreSheet();
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
      loadNear();
    }, { once: true });
    entry.el.src = entry.src;
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
  listen(scroller, 'scroll', scheduleLoad, { passive: true });
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

function onKey(event) {
  if (event.key === 'Escape' && !event.defaultPrevented) {
    closeSiteCanvas(canvasState.win);
  }
}

/**
 * Ctrl/Cmd and a trackpad pinch zoom the sheet round the pointer, never the
 * browser's own page zoom. Any other wheel is the scroller's own scroll, in
 * both directions — nothing to do here.
 */
function onWheel(event) {
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
  canvasState.pan = { id: event.pointerId, x: event.clientX, y: event.clientY, from: { x: event.clientX, y: event.clientY } };
  scroller.setPointerCapture(event.pointerId);
  scroller.dataset.panning = '';
}

function onPanMove(event) {
  const { pan, scroller } = canvasState;

  if (!pan || pan.id !== event.pointerId) {
    return;
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

/**
 * The one way Live Preview moves to another entry: close the canvas, then
 * navigateFromLp — unsaved work asked about first, the next editor booted
 * hidden and swapped in once it has painted. The entry already being edited
 * only closes the canvas: the page under it is that page.
 */
function openEntry(win, frame) {
  const same = frame.id === currentEntryId(win);

  closeSiteCanvas(win);

  if (same) {
    return;
  }

  Promise.all([import('./pages.js'), import('./lp-templates.js')]).then(([{ navigateFromLp }, { inLivePreview }]) => {
    navigateFromLp(win, null, inLivePreview(win, frame.edit));
  });
}

// --- Paint ---------------------------------------------------------------------------

/** The top-bar button says whether the canvas is open. Compared before written. */
function paintButton(win, on) {
  const btn = win?.document?.getElementById(LP_PREVIEW_CHROME_ID)?.querySelector('[data-canvas]');

  if (!btn) {
    return;
  }

  const pressed = on ? 'true' : 'false';

  if (btn.getAttribute('aria-pressed') !== pressed) {
    btn.setAttribute('aria-pressed', pressed);
  }

  if (btn.classList.contains(ON_CLASS) !== on) {
    btn.classList.toggle(ON_CLASS, on);
  }
}
