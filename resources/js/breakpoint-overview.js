/**
 * Every screen size side by side in Live Preview: the preview in its row.
 *
 * Owns the breakpoint overview — one layer over the preview pane
 * (`#__sve-bp-overview`) holding one frame per breakpoint, its zoom and pan,
 * and the preview's place in that row. The top-bar button `[data-overview]`
 * (cp-shell/block-order.js) is the only way in: an `import()` on click. No
 * file imports this module statically, and it puts nothing on `window`.
 *
 * The size with the ring — the one the fields on the left edit — is the
 * preview itself, with the whole editor: the layer's scroller has a hole cut
 * where that size stands (a clip-path, so clicks fall through), and the preview iframe,
 * which never leaves `.live-preview-contents` (Statamic finds it there as
 * firstChild and would make a new one), is laid under the hole at the slot's
 * exact screen position, the breakpoint's width, the frames' height and the
 * row's scale. Only cp-shell/block-order.js writes those styles: the overview
 * hands it the slot on the bus (`lp:preview-slot`) on every pan, zoom and
 * resize, and null on close. The frame at that size is loaded like the
 * others and mirrors like the others — under the preview, clipped out by the
 * hole, so that a switch of size shows it at once (25 Sep 2026: the old size's
 * frame loading from the server after the switch read as a refresh — blank,
 * then the page again). A click in another size's frame makes that size the
 * active one, as the top-bar button does, and the preview moves there.
 *
 * Every frame is a viewport, not a page — as high as the pane shows at the
 * zoom (floorHeight) — and its document scrolls inside it, as in a browser.
 * Until 5 Oct 2026 every frame was page-high and the row panned up and down
 * by script, and two things went wrong. Scroll-driven CSS (`animation-timeline:
 * view()`, `timeline-trigger`) and reveals run by an IntersectionObserver never
 * ran, because a page-high document has nothing to scroll: icons animated in
 * on scroll stayed invisible in the copies. And the sizes drifted apart: a
 * page is a different height at each size, so the same pan showed another
 * section on mobile than on desktop. Now, as in Polypane, the row pans
 * sideways only and the frames scroll in step. The preview and every loaded
 * copy — the one under the preview too, so that it shows the right place the
 * moment the preview moves to another size — scroll together: the one that
 * scrolls (a wheel, the bridge's own scrollIntoView, the page's script) leads,
 * and every other one stands as far into the same page section as the leader
 * does, measured on a line that slides from the top edge of the viewport at
 * the top of the page to the bottom edge at its end (syncedScrollTop) — so
 * the sizes meet at both ends — or at the same share of the page when that
 * section is not there. A scroll the overview wrote itself is known by where it was
 * sent (`expectTop`) and is not passed on again.
 *
 * A wheel, over the layer or over the preview, scrolls the one frame under
 * the pointer (over a gutter, the preview) when it goes up or down, and pans
 * the row when it goes sideways — the row moved and the preview placed in the
 * same turn, so the two never drift a frame apart. FOCUS from the fields on
 * the left is the bridge's own: it scrolls the preview to the element, and
 * the copies follow. A section dragged in from the library is the bridge's
 * too: it zooms the page down inside the preview, as in one preview. For
 * either, the row only brings the active frame into view, sideways.
 *
 * The row's zoom has no control on the layer. While the overview is open the
 * top bar's zoom group — minus, the percent, plus, and a "Fit all" that only
 * the overview shows (cp-shell/block-order.js) — drives it through
 * `overviewZoom` and reads it through `overviewZoomLevel`, and every change,
 * whatever made it (a button, ctrl/wheel, a pinch, "Fit all", a resize), is
 * told to the CP window as `sve:overview-zoom` with the percent to show — and
 * null on close, when the group is the preview's own zoom again. Until 5 Oct
 * 2026 the row had a floating zoom bar of its own at the bottom right, and the
 * top bar's zoom did nothing while it was open (the preview's scale is the
 * slot's then): two zoom controls side by side, one of them dead.
 *
 * Closed, it costs nothing. Everything `openBreakpointOverview` binds —
 * listeners, the ResizeObserver, the sync's animation frame — is a function
 * in `overviewState.cleanups`, and `closeBreakpointOverview` runs them, blanks
 * and removes the frames, the layer and its `<style>`, and empties the state.
 * Nothing here binds any other way, and nothing here uses a timer or a
 * MutationObserver.
 *
 * The preview frame's src and window are never touched, and its styles only
 * through block-order.js, which owns them and writes them again on every
 * pass. The layer sits inside Live Preview's own stacking context,
 * as the last child of `.live-preview-main` with z-index 2 — above the pane
 * (1), below the editor column (3), the docks, the top bar, Statamic's modals
 * and every dropdown portal (measured 24 Sep 2026). Never inside
 * `.live-preview-contents`: Statamic finds its preview there as `firstChild`.
 * It covers the pane's content box — the docks pad the pane and sit on the
 * padding, so the layer never goes under a dock.
 *
 * View frames load the preview URL with `sve_view=<their size>` (one URL per
 * frame, see viewUrl); InjectBridgeScript answers any `sve_view` with
 * mirror.js alone — the preview's morph and the bridge's video hold, no
 * bridge — so they show the page but take no clicks and send nothing back.
 * They are copies, not previews of their own: while the overview is open the
 * preview's window carries `__sveMirror` (set here, taken away on close), and
 * preview.js calls it with each render it has just morphed to — the HTML, the
 * section, the chrome. The same render is posted to every frame in the row
 * (SVE_MIRROR), which morphs to it without a fetch of its own: one server
 * render per change however many sizes are open, and the copies a task behind
 * the preview rather than a round trip. A frame still loading gets the latest
 * render once it has loaded, and the remembered video holds with it
 * (`video-holds:sync` on the bus). The dock's Instant paint and the tree's
 * video hold reach every frame as well, through lib/preview-frame.js's list of
 * copies and the paint script's own.
 *
 * Which sizes stand in the row is a menu on the overview button's right-click
 * (openSizesMenu), open or closed: a checkbox per size. Unticked, the size is
 * out and its frame blank (a size not looked at costs nothing). Any size may
 * go but the last one ticked (sizeLock); when the size being edited goes, the
 * preview moves to the nearest size still in (nearestSize), and a size picked
 * in the top bar while out comes back in — it is the preview. The choice lives for
 * the page, never stored. (Until 27 Sep 2026 this was a dot on each size's
 * top-bar button.)
 *
 * Picking a size — a button in the top bar, or Full width crossing a
 * breakpoint — moves the ring and, when the row is wider than the pane,
 * scrolls the row sideways so that size's frame stands whole in view; a frame
 * wider than the pane stands with its left edge at the pane's left edge (the
 * owner's rule, 24 Sep 2026). Sideways only, and only the row's own scroll —
 * as a glide, not a jump, with the preview placed in every frame of it.
 *
 * May import: lib/, breakpoints.js, chrome-prefs.js (chromeGet), cp-state.js
 * (sveState, read only), cp/bus.js, lp-menu-dismiss.js (the sizes menu closes
 * as the top bar's other menus do). Not cp-shell/*: scripts/assert-isolation.mjs
 * holds every file outside the shell to the bus, so the sizes are read where
 * the shell reads them — `sveBreakpoints`, Statamic's `livePreview.devices`,
 * the stored device.
 *
 * Bus: asks `lp:lastPreviewUrl`, `lp:preview-slot` and `lp:set-device`;
 * emits `video-holds:sync` for a frame that has loaded. DOM events, only while
 * open: `statamic:preview-updated` and `scroll` on the view frames' windows,
 * `load` on the pane (capture), `sve:breakpoint` and `keydown` on the CP
 * window, `wheel` and `input` (capture) on the preview's document, `message`,
 * `scroll` and `sve:inline-edit-end` on its window — and `__sveMirror` on the
 * preview's window. It dispatches `sve:overview-zoom` on the CP window and
 * listens for none: the top bar's listener is block-order.js's own.
 *
 * The whole feature, to remove it without a trace: this file; the button and
 * the overview branch of the zoom group in cp-shell/block-order.js (the "Fit
 * all" button, `lpOverviewZoom` and its `sve:overview-zoom` listener);
 * `breakpoint_overview` in Features::KEYS and in
 * resources/blueprints/settings.yaml; `sve_view` in InjectBridgeScript;
 * mirror.js and scripts/vite-mirror-graph.js; the `__sveMirror` line in
 * preview.js; `SVE_MIRROR` and `MIRRORED` in lib/protocol.js; `previewCopies`
 * in lib/preview-frame.js and its use in sendToPreview; `video-holds:sync` in
 * video-holds.js; `previewDocuments` in dock-instant-preview.js; the
 * `bp_overview*` strings; the narrow-window rule at the end of
 * resources/css/addon.css; tests/js and tests/browser breakpoint-overview.
 * bridge/viewport.js may stay as it is: it lays the bridge's UI out by a
 * `__sveBand` that nothing has written since 5 Oct 2026, and without one by
 * the real viewport, as in one preview — idle.
 */
import { ask, emit } from './cp/bus.js';
import { bpForDevice, bpFromWidth, breakpoints } from './breakpoints.js';
import { chromeGet } from './chrome-prefs.js';
import { sveState } from './cp-state.js';
import { remToPx } from './lib/dom.js';
import { t } from './lib/i18n.js';
import { BP_OVERVIEW_ID, LP_PREVIEW_CHROME_ID, LP_PRIMARY_FLAT, SID_ATTR, SID_FIELD_ATTR } from './lib/ids.js';
import { previewFrame } from './lib/preview-frame.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { injectStyle } from './lib/style.js';
import { bindMenuDismiss } from './lp-menu-dismiss.js';

const LAYER_ID = BP_OVERVIEW_ID;
const STYLE_ID = '__sve-bp-overview-style';
const ON_CLASS = 'sve-bpo-on';

/**
 * Header and footer in the preview's documents: no sets, so no `data-sid`,
 * yet places the synced scroll can stand in (anchorsOf). The bridge spells it
 * in bridge/global-sections.js, which this file may not import.
 */
const CHROME_ATTR = 'data-sve-chrome';

/** The query flag InjectBridgeScript reads: preview.js, no bridge. */
export const VIEW_FLAG = 'sve_view';

/** Canvas pixels between the frames and around the row; they scale with the zoom. */
export const GAP = 64;
export const PAD = 48;

/** Room above the frames for their labels, on screen. Labels keep their size at every zoom. */
const LABEL_REM = 2;

/** What applyLpDevice gives the base size when the config names no width for it. */
const BASE_WIDTH = 1440;

/** The row's zoom bounds; the top bar's zoom group reads them too, to switch its minus and plus off at the ends. */
export const ZOOM_MIN = 0.05;
export const ZOOM_MAX = 2;
const ZOOM_STEPS = [0.1, 0.15, 0.2, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2];

/** The ring round the size the fields edit: this many screen pixels wide, and as many off the frame, at every zoom. */
const RING_PX = 2;
const SIZE_BLUE = 'rgb(96, 165, 250)';

/** The sizes menu (a right-click on the overview button): its portal and its `<style>`, both only while it is open. */
const MENU_ID = '__sve-bp-sizes-menu';
const MENU_STYLE_ID = '__sve-bp-sizes-menu-style';

// --- Pure helpers (tests/js/breakpoint-overview.test.js) ----------------------

/**
 * One frame per breakpoint, narrowest first — the device buttons' order,
 * without Full width. The width is the device's preset in Statamic's
 * `livePreview.devices`, the same one a device button sets; the base size
 * falls back to 1440 as in applyLpDevice. A size with no width is left out.
 */
export function overviewFrames(list, devices) {
  return [...(Array.isArray(list) ? list : [])]
    .reverse()
    .map((row) => ({
      handle: row.handle,
      device: row.device,
      label: row.label || row.device || row.handle,
      width: Math.round(Number(devices?.[row.device]?.width) || (row.base ? BASE_WIDTH : 0)),
    }))
    .filter((frame) => frame.handle && frame.device && frame.width > 0);
}

/**
 * The preview URL with the view flag set; every other parameter (the token)
 * is kept. The flag's value names the frame's size: InjectBridgeScript only
 * asks whether it is there, and one URL per frame matters — Chrome queues
 * concurrent requests for the same URL behind each other (its cache lock), so
 * three frames sharing one URL took three renders' time per keystroke, not one
 * (measured 24 Sep 2026: 411/805/1232 ms against 415 ms each).
 */
export function viewUrl(url, base, value = '1', flags = []) {
  if (!url) {
    return '';
  }

  try {
    const out = new URL(url, base);

    out.searchParams.set(VIEW_FLAG, value);

    for (const flag of flags) {
      out.searchParams.set(flag, '1');
    }

    return out.toString();
  } catch {
    return '';
  }
}

/**
 * The unsaved-work flags the preview itself fetches with, read where the
 * Control Panel sets them. While a global set is edited beside the page the
 * preview asks for the stash with `sve_globals=1`; while a global section is,
 * with `sve_sections=1`. A frame fetched without them would render the saved
 * values and disagree with the preview it stands in for. An empty stash on
 * the server renders as if the flag were not there, so a flag sent a moment
 * too early or late costs nothing.
 */
export function stashFlags(state = sveState) {
  const flags = [];

  if (state.globalsStashActive) {
    flags.push('sve_globals');
  }

  if (state.sectionPanelValues) {
    flags.push('sve_sections');
  }

  return flags;
}

export function clampZoom(z) {
  const n = Number(z);

  return Number.isFinite(n) && n > 0 ? Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, n)) : 1;
}

/** The row's width in canvas pixels: the frames, the gaps between them and the padding. */
export function rowWidth(widths) {
  return widths.reduce((sum, width) => sum + width, 0) + GAP * Math.max(0, widths.length - 1) + PAD * 2;
}

/** "Fit all": the zoom at which every frame's whole width is in view. Never above 100%. */
export function fitZoom(viewWidth, widths) {
  const total = rowWidth(widths);

  if (!(viewWidth > 0) || !(total > 0)) {
    return 1;
  }

  return clampZoom(Math.min(viewWidth / total, 1));
}

/** The next step on the buttons' ladder, up (`dir` > 0) or down. */
export function stepZoom(z, dir) {
  if (dir > 0) {
    return ZOOM_STEPS.find((step) => step > z + 0.001) ?? ZOOM_MAX;
  }

  return [...ZOOM_STEPS].reverse().find((step) => step < z - 0.001) ?? ZOOM_MIN;
}

/**
 * Where the frames start on screen, from the top of the canvas: the padding,
 * or the labels' room when that is more — the padding scales, the labels do not.
 */
export function framesTop(z, labelSpace) {
  return Math.max(PAD * z, labelSpace);
}

/**
 * The scroll position that keeps the point under the pointer where it is
 * across a zoom from `z0` to `z1`. `before` and `after` are where the zoomed
 * content starts on that axis at each zoom (a centring offset, the frames' top).
 */
export function anchoredScroll(scroll, pointer, before, after, z0, z1) {
  return after + ((scroll + pointer - before) / z0) * z1 - pointer;
}

/**
 * The scroll that shows a frame whole: the frame spans `left` to `right` in
 * scroll pixels, the view is `width` wide and scrolled to `scrollLeft`. A frame
 * already in view leaves the scroll alone; one off to a side comes in by the
 * shortest way; one wider than the view stands with its left edge at the
 * view's left edge. Not `scrollIntoView`: that leaves a frame wider than the
 * view where it is, and would scroll the Control Panel behind the row too.
 */
export function revealScroll(scrollLeft, width, left, right) {
  if (right - left >= width || left < scrollLeft) {
    return left;
  }

  if (right > scrollLeft + width) {
    return right - width;
  }

  return scrollLeft;
}

/**
 * The layer with a hole in it: a polygon that runs round the layer and then
 * round the hole, under the even-odd rule, so the hole is neither painted nor
 * hit — clicks there reach the preview beneath. All in layer pixels.
 */
export function holePolygon(width, height, hole) {
  const px = (n) => `${Math.round(n * 100) / 100}px`;
  const x1 = px(hole.left);
  const y1 = px(hole.top);
  const x2 = px(hole.left + hole.width);
  const y2 = px(hole.top + hole.height);

  return `polygon(evenodd, 0 0, ${px(width)} 0, ${px(width)} ${px(height)}, 0 ${px(height)}, 0 0, ${x1} ${y1}, ${x1} ${y2}, ${x2} ${y2}, ${x2} ${y1}, ${x1} ${y1})`;
}

/** How far along a glide is at time `t` of 1: fast off the mark, gentle at the end. */
export function glideEase(t) {
  const x = Math.min(1, Math.max(0, t));

  return 1 - (1 - x) ** 3;
}

/** Did the pointer move enough between down and up to be a pan rather than a click? */
export function isDrag(from, to, slop = 4) {
  return Math.abs(to.x - from.x) > slop || Math.abs(to.y - from.y) > slop;
}

/**
 * Where a frame scrolls to follow another: Polypane's synced scroll, by
 * element. `anchors` are a document's page sections, header and footer as
 * `{ id, top, height }` in its own pixels, in document order (anchorsOf).
 *
 * The place compared is a line through the viewport that slides with the
 * scroll: at the top of the page it is the top edge, at the end of the page
 * the bottom edge, and in between it is as far down the viewport as the page
 * is scrolled — `scrollTop / max` of the way. In the page's own pixels that
 * line stands at `scrollTop × scrollHeight / max`. The section under the
 * source's line is found in the target by its id, and the target is scrolled
 * so that its own line stands as far into that section as the source's does:
 * 40 % into the hero there, 40 % into the hero here, however tall each size
 * draws it. For a page position `y` of the target, its line stands there when
 * `scrollTop = y × max / scrollHeight`.
 *
 * Why a sliding line and not the top edge (which it was until 5 Oct 2026):
 * with the top edges matched, a page scrolled to its end on desktop left
 * mobile — where every section is drawn far taller — with most of its last
 * sections and the footer still below the fold, so the sizes never met at
 * the bottom. With the bottom edges matched there they do, and the tops still
 * meet at the top of the page. With no section under the line (none at all,
 * or the line above the first) or none of that id in the target: the same
 * share of the page that can be scrolled. Whole pixels, within what the
 * target can scroll.
 */
export function syncedScrollTop(source, target) {
  const max = Math.max(0, target.scrollHeight - target.viewport);
  const sourceMax = Math.max(0, source.scrollHeight - source.viewport);
  const top = source.scrollTop;
  const line = sourceMax > 0 ? (top * source.scrollHeight) / sourceMax : top;
  const from = (source.anchors || []).find((anchor) => anchor.top + anchor.height > line);
  const to = from && line >= from.top ? (target.anchors || []).find((anchor) => anchor.id === from.id) : null;
  let want = (max * top) / Math.max(1, sourceMax);

  if (to && target.scrollHeight > 0) {
    const share = Math.min(1, Math.max(0, (line - from.top) / from.height));

    want = ((to.top + share * to.height) * max) / target.scrollHeight;
  }

  return Math.round(Math.min(max, Math.max(0, want)));
}

/**
 * The pane's content box in viewport pixels. The docks push the preview away
 * with padding and sit on it, so the padding is not part of what is covered.
 */
export function contentBox(rect, style, clientWidth, clientHeight) {
  const px = (value) => parseFloat(value) || 0;

  return {
    left: Math.round(rect.left + px(style.borderLeftWidth) + px(style.paddingLeft)),
    top: Math.round(rect.top + px(style.borderTopWidth) + px(style.paddingTop)),
    width: Math.max(0, Math.round(clientWidth - px(style.paddingLeft) - px(style.paddingRight))),
    height: Math.max(0, Math.round(clientHeight - px(style.paddingTop) - px(style.paddingBottom))),
  };
}

/** A computed colour with nothing in it: `transparent`, `rgba(…, 0)`, `… / 0)`. */
export function isTransparent(color) {
  const value = String(color || '').trim().toLowerCase();

  if (!value || value === 'transparent') {
    return true;
  }

  const rgba = value.match(/^rgba\(([^)]+)\)$/);

  if (rgba) {
    const parts = rgba[1].split(/[\s,/]+/).filter(Boolean);

    return parts.length === 4 && Number(parts[3]) === 0;
  }

  return /\/\s*0%?\s*\)$/.test(value);
}

/**
 * Why a size may not leave the row, or '' when it may. `sizes` is every size
 * as `{ handle, hidden }`. Any size may go — the one being edited too (the
 * preview moves on, see nearestSize) — except the last one in the row, or the
 * overview is an empty grey pane ('last'). A size that is out may always come
 * back in. (Until 27 Sep 2026 the size being edited was locked as well; the
 * owner wants to choose freely, one at least.)
 */
export function sizeLock(sizes, handle) {
  const size = sizes.find((row) => row.handle === handle);

  if (!size || size.hidden) {
    return '';
  }

  return sizes.filter((row) => !row.hidden).length <= 1 ? 'last' : '';
}

/**
 * Where the preview goes when its size leaves the row: the size still in the
 * row nearest in width, the narrower on a tie. `sizes` as `{ handle, width,
 * hidden }`; '' when no other size is in.
 */
export function nearestSize(sizes, handle) {
  const from = sizes.find((row) => row.handle === handle);
  const width = Number(from?.width) || 0;
  let best = null;

  for (const row of sizes) {
    if (row.handle === handle || row.hidden) {
      continue;
    }

    const gap = Math.abs(row.width - width);

    if (!best || gap < best.gap || (gap === best.gap && row.width < best.width)) {
      best = { handle: row.handle, width: row.width, gap };
    }
  }

  return best?.handle || '';
}

/** Label colour that reads on the pane: light on a dark background, dark on a light one. */
export function labelColor(background) {
  const light = 'rgba(255, 255, 255, .8)';
  const dark = 'rgba(24, 24, 27, .8)';
  const value = String(background || '');
  const rgb = value.match(/^rgba?\(([^)]+)\)/);

  if (rgb) {
    const [r, g, b] = rgb[1].split(/[\s,/]+/).map(Number);

    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5 ? light : dark;
  }

  // oklch() / oklab() / lab() lead with lightness, as 0–1 or a percentage.
  const lab = value.match(/^(?:ok)?l(?:ab|ch)\(\s*([\d.]+)(%?)/);

  if (lab) {
    const lightness = Number(lab[1]) / (lab[2] ? 100 : value.startsWith('ok') ? 1 : 100);

    return lightness < 0.6 ? light : dark;
  }

  return light;
}

/**
 * Where a field wrapper stands in its document: its place among every field
 * wrapper, with its field name and the set it belongs to as a check. The
 * copies hold the same document as the preview, so the same place holds the
 * same wrapper there — and a copy that does not agree is left to the morph.
 */
export function fieldPlace(doc, wrapper) {
  const all = doc.querySelectorAll(`[${SID_FIELD_ATTR}]`);

  return {
    index: Array.prototype.indexOf.call(all, wrapper),
    field: wrapper.getAttribute(SID_FIELD_ATTR) || '',
    uid: wrapper.closest(`[${SID_ATTR}]`)?.getAttribute(SID_ATTR) || '',
  };
}

export function fieldAt(doc, place) {
  const el = place.index < 0 ? null : doc.querySelectorAll(`[${SID_FIELD_ATTR}]`)[place.index];

  if (!el || (el.getAttribute(SID_FIELD_ATTR) || '') !== place.field || (el.closest(`[${SID_ATTR}]`)?.getAttribute(SID_ATTR) || '') !== place.uid) {
    return null;
  }

  return el;
}

// --- State ---------------------------------------------------------------------

function emptyState() {
  return {
    win: null, // the Control Panel window the button lives in
    layer: null,
    frames: [], // { spec, item, label, el, src, ready, stale, height, unbind, hidden, active, expectTop }
    cleanups: [], // everything open bound; close runs them all
    styles: [],
    contents: null, // Statamic's `.live-preview-contents`
    scroller: null,
    sizer: null,
    canvas: null,
    zoomTold: null, // the percent the top bar was last told (tellZoom); null until the first
    main: null, // the preview iframe whose renders the frames mirror
    unbindMain: null,
    render: null, // the last render the preview handed over (see mirror)
    zoom: 1,
    labelSpace: 32,
    preview: '', // the preview URL the frames were last sent (each adds its own view flag)
    active: '', // breakpoint handle that has the ring — the preview's own slot
    dim: false, // a size is picked in the top bar: the other frames step back
    mainScroll: { expectTop: null }, // the scroll the overview last wrote to the preview (see onMemberScroll)
    sync: null, // { frame, source }: the animation frame that brings every other frame in line with `source`
    pan: null,
    glide: null, // the animation frame of a reveal under way
    editing: null, // the field wrapper an inline edit in the preview is typing into
  };
}

/** The frame the preview stands in: the active size's, when it is in the row. */
function activeEntry() {
  return overviewState.frames.find((entry) => entry.active && !entry.hidden) || null;
}

const overviewState = emptyState();

/** Sizes switched out of the row, by handle. Outlives a close, not the page. */
const hiddenSizes = new Set();

function listen(target, type, fn, options) {
  target.addEventListener(type, fn, options);
  overviewState.cleanups.push(() => target.removeEventListener(type, fn, options));
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

// --- Public ----------------------------------------------------------------------

/** One overview at a time, whichever Control Panel window asks. */
export function isBreakpointOverviewOpen(_win) {
  return !!overviewState.layer;
}

export function toggleBreakpointOverview(win) {
  if (isBreakpointOverviewOpen(win)) {
    closeBreakpointOverview(win);
  } else {
    openBreakpointOverview(win);
  }
}

export function openBreakpointOverview(win) {
  if (overviewState.layer) {
    return;
  }

  const main = previewFrame(win.document);
  const contents = main?.closest('.live-preview-contents');
  const host = contents?.parentElement;
  const specs = overviewFrames(breakpoints(win), win.Statamic?.$config?.get?.('livePreview.devices'));
  const preview = ask('lp:lastPreviewUrl') || documentHref(main);

  if (!main || !contents || !host || !specs.length || !viewUrl(preview, win.location.href)) {
    return;
  }

  const view = contents.ownerDocument.defaultView;

  Object.assign(overviewState, { win, main, contents, preview, labelSpace: remToPx(view, LABEL_REM) });

  let active = activeBreakpoint(win);

  // Opened on a size switched out in the menu: the preview starts at the
  // nearest size still in, as if its button had been picked. None left in
  // (the sizes changed since): the size being edited comes back.
  if (hiddenSizes.has(active)) {
    const next = specs.find((spec) => spec.handle === nearestSize(specs.map((spec) => ({ ...spec, hidden: hiddenSizes.has(spec.handle) })), active));

    if (next) {
      ask('lp:set-device', { win, key: next.device });
      active = activeBreakpoint(win);
    }

    hiddenSizes.delete(active);
  }

  try {
    build(win, host, specs);
    bind(win, view);
    paintActive(active);
    paintDim(sizePicked(chromeGet(win, 'sve-lp-device')));
    paintButton(win, true);
    // block-order.js writes the slot from here on, and puts the ordinary
    // geometry back when told the slot is gone — the last thing close does.
    overviewState.cleanups.push(() => ask('lp:preview-slot', { win, slot: null }));
    placePreview();

    for (const entry of overviewState.frames) {
      if (!entry.hidden) {
        navigate(entry, preview);
      }
    }
  } catch (error) {
    // Whatever got bound before the throw is undone too.
    teardown(win);

    throw error;
  }
}

export function closeBreakpointOverview(win) {
  if (overviewState.layer) {
    teardown(win);
  }
}

/**
 * The top bar's zoom group, while the overview is open (cp-shell/block-order.js):
 * `action` is 'in' or 'out' (a step on the ladder), 'fit' (every frame in
 * view) or 'actual' (100 %). Closed, nothing happens.
 */
export function overviewZoom(_win, action) {
  if (overviewState.layer) {
    zoomAction(action);
  }
}

/** The row's zoom as the top bar shows it — a whole percent — or null while the overview is closed. */
export function overviewZoomLevel(_win) {
  return overviewState.layer ? Math.round(overviewState.zoom * 100) : null;
}

/**
 * The top bar shows the row's zoom while the overview is open: it hears the
 * percent on the CP window, and null when the overview has closed. Dispatched
 * only, nothing bound — the listener is the top bar's.
 */
function tellZoom(win, percent) {
  win?.dispatchEvent(new CustomEvent('sve:overview-zoom', { detail: { percent } }));
}

/** Undo everything open did, last bound first, and forget it. */
function teardown(win) {
  const state = overviewState;
  const owner = state.win || win;
  const told = state.zoomTold;

  stopGlide();

  for (const cleanup of state.cleanups.splice(0).reverse()) {
    try {
      cleanup();
    } catch {
      /* a frame's window already gone */
    }
  }

  // Blank first, so the frames' network and video stop at once.
  for (const entry of state.frames) {
    entry.el.src = 'about:blank';
  }

  state.layer?.remove();
  state.styles.forEach((style) => style.remove());
  paintButton(owner, false);
  Object.assign(overviewState, emptyState());

  // Last, with the state empty: the top bar paints the preview's own zoom back
  // and, should it ask, finds the overview closed. Not told anything, it was
  // never showing the row's zoom.
  if (told !== null) {
    tellZoom(owner, null);
  }
}

// --- Building ----------------------------------------------------------------------

function build(win, host, specs) {
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  const background = paneBackground(view, overviewState.contents);
  const docs = [...new Set([doc, win.document])];

  overviewState.styles = docs.map((d) => injectStyle(d, STYLE_ID, overviewCss()));

  const layer = make(doc, 'div', 'sve-bpo');
  const scroller = make(doc, 'div', 'sve-bpo-scroll');
  const sizer = make(doc, 'div', 'sve-bpo-sizer');
  const canvas = make(doc, 'div', 'sve-bpo-canvas');

  layer.id = LAYER_ID;
  layer.setAttribute('role', 'region');
  layer.setAttribute('aria-label', t(win, 'bp_overview'));
  layer.style.setProperty('--sve-bpo-bg', background);
  layer.style.setProperty('--sve-bpo-fg', labelColor(background));
  canvas.setAttribute('aria-hidden', 'true');

  overviewState.frames = specs.map((spec) => {
    const item = make(doc, 'div', 'sve-bpo-item');
    const label = make(doc, 'div', 'sve-bpo-label');
    const el = make(doc, 'iframe', 'sve-bpo-frame');

    const hidden = hiddenSizes.has(spec.handle);

    item.dataset.bp = spec.handle;
    item.hidden = hidden;
    label.textContent = `${spec.label} · ${spec.width} px`;
    el.title = spec.label;
    el.tabIndex = -1;
    el.style.width = `${spec.width}px`;
    item.append(label, el);
    canvas.appendChild(item);

    return { spec, item, label, el, src: '', ready: false, stale: false, height: 0, unbind: null, hidden, active: false, expectTop: null };
  });

  sizer.appendChild(canvas);
  scroller.appendChild(sizer);
  layer.appendChild(scroller);
  Object.assign(overviewState, { layer, scroller, sizer, canvas });

  // In the DOM before any frame gets a src; sized before the first paint. The
  // first zoom is the first the top bar hears of the row (applyZoom).
  host.appendChild(layer);
  place();
  applyZoom(fitZoom(scroller.clientWidth, widths()));
}

/** Statamic's gutter colour as it is drawn: the pane's own, or the first ancestor that has one. */
function paneBackground(view, el) {
  for (let node = el; node?.nodeType === 1; node = node.parentElement) {
    const color = view.getComputedStyle(node).backgroundColor;

    if (!isTransparent(color)) {
      return color;
    }
  }

  return 'Canvas';
}

function overviewCss() {
  const L = `#${LAYER_ID}`;

  return `
${L} { position: fixed; z-index: 2; box-sizing: border-box; overflow: hidden; color: var(--sve-bpo-fg); font-family: inherit; pointer-events: none; }
${L} .sve-bpo-scroll { position: absolute; inset: 0; overflow: hidden; overscroll-behavior: contain; cursor: grab; background: var(--sve-bpo-bg); pointer-events: auto; }
${L} .sve-bpo-scroll[data-panning] { cursor: grabbing; }
${L} .sve-bpo-sizer { position: relative; margin: 0 auto; overflow: hidden; }
${L} .sve-bpo-canvas { --z: 1; position: absolute; left: 0; top: 0; box-sizing: border-box; display: flex; align-items: flex-start; gap: ${GAP}px; padding: ${PAD}px; transform-origin: 0 0; pointer-events: none; }
${L} .sve-bpo-item { position: relative; flex: none; }
${L} .sve-bpo-label { position: absolute; left: 0; bottom: 100%; margin-bottom: calc(.5rem / var(--z)); font-size: calc(.75rem / var(--z)); font-weight: 500; line-height: 1.3; white-space: nowrap; opacity: .85; pointer-events: auto; }
${L} .sve-bpo-item:not([data-active]) .sve-bpo-label { cursor: pointer; }
${L} .sve-bpo-item[data-active] .sve-bpo-label { opacity: 1; font-weight: 600; }
${L} .sve-bpo-frame { transition: opacity .15s; }
${L} .sve-bpo-canvas[data-dim] .sve-bpo-item:not([data-active]) .sve-bpo-frame { opacity: ${DIM_OPACITY}; }
${L} .sve-bpo-frame { display: block; border: 0; background: #fff; }
${L} .sve-bpo-item[data-active] .sve-bpo-frame { outline: calc(${RING_PX}px / var(--z)) solid ${SIZE_BLUE}; outline-offset: calc(${RING_PX}px / var(--z)); }
#${LP_PREVIEW_CHROME_ID} [data-overview].${ON_CLASS} { background: ${LP_PRIMARY_FLAT} !important; color: #fff !important; opacity: 1 !important; }
#${LP_PREVIEW_CHROME_ID} [data-overview].${ON_CLASS} svg { opacity: 1; }
`;
}

/** The sizes menu, dressed as the top bar's ⋮ menu (LpSettingsMenu.vue): same surface, type and checkbox colour. */
function menuCss() {
  const M = `#${MENU_ID}`;

  return `
${M} { position: fixed; z-index: 2147483001; box-sizing: border-box; min-width: 14rem; padding: .375rem; border-radius: .625rem; background: #343439; color: rgba(255, 255, 255, .92); box-shadow: 0 .75rem 2.5rem rgba(0, 0, 0, .55), 0 0 0 1px rgba(255, 255, 255, .12); font: 500 .8125rem/1.3 ui-sans-serif, system-ui, sans-serif; }
${M} .sve-bpo-menu-title { padding: .25rem .375rem .375rem; font-size: .75rem; font-weight: 600; opacity: .6; }
${M} label { display: flex; align-items: center; gap: .5rem; padding: .375rem; border-radius: .375rem; cursor: pointer; }
${M} label:hover { background: rgba(255, 255, 255, .08); }
${M} label[data-locked] { cursor: default; }
${M} label[data-locked]:hover { background: none; }
${M} input { flex: none; margin: 0; accent-color: var(--theme-color-primary, #4f46e5); cursor: inherit; }
${M} input:disabled { opacity: .5; }
${M} .sve-bpo-menu-name { flex: 1; white-space: nowrap; }
${M} .sve-bpo-menu-width { opacity: .5; font-variant-numeric: tabular-nums; white-space: nowrap; }
`;
}

// --- Geometry ------------------------------------------------------------------------

/** The frames in the row: every size not switched out. */
function shown() {
  return overviewState.frames.filter((entry) => !entry.hidden);
}

function widths() {
  return shown().map((entry) => entry.spec.width);
}

/** Follow the pane: a dock opening, the editor column, the window. */
function place() {
  const { contents, layer } = overviewState;
  const view = contents.ownerDocument.defaultView;
  const box = contentBox(contents.getBoundingClientRect(), view.getComputedStyle(contents), contents.clientWidth, contents.clientHeight);

  setStyle(layer, 'left', `${box.left}px`);
  setStyle(layer, 'top', `${box.top}px`);
  setStyle(layer, 'width', `${box.width}px`);
  setStyle(layer, 'height', `${box.height}px`);
}

/** The canvas height that fills the view at the current zoom: every frame's height. */
function floorHeight() {
  const { scroller, zoom, labelSpace } = overviewState;

  return Math.max(0, (scroller.clientHeight - framesTop(zoom, labelSpace) - PAD * zoom) / zoom);
}

/**
 * Zoom is one transform on the canvas plus the sizer the scroll area is
 * measured by. Every frame shown is as high as the view at this zoom — a
 * viewport its page scrolls in — so the row is exactly as high as the view
 * and pans sideways only. Floored: a pixel more would give it a vertical
 * scroll of its own. Every zoom passes through here, whatever made it, so
 * this is where the top bar is told the percent it shows — only when that
 * changes: a resize at the same zoom tells it nothing.
 */
function applyZoom(z) {
  const { canvas, sizer, labelSpace } = overviewState;
  const top = framesTop(z, labelSpace);
  const percent = Math.round(z * 100);

  overviewState.zoom = z;

  const height = floorHeight();

  for (const entry of shown()) {
    entry.height = height;
    setStyle(entry.el, 'height', `${height}px`);
  }

  setStyle(canvas, 'transform', `scale(${z})`);
  setStyle(canvas, '--z', String(z));
  setStyle(canvas, 'padding-top', `${top / z}px`);
  setStyle(sizer, 'width', `${Math.ceil(rowWidth(widths()) * z)}px`);
  setStyle(sizer, 'height', `${Math.floor(top + (height + PAD) * z)}px`);
  placePreview();

  if (overviewState.zoomTold !== percent) {
    overviewState.zoomTold = percent;
    tellZoom(overviewState.win, percent);
  }
}

/** Zoom to `next`, keeping the point at `anchor` (scroller pixels; default the middle) still — sideways, the row's only way to move. */
function setZoom(next, anchor = null) {
  const { scroller } = overviewState;
  const z0 = overviewState.zoom;
  const z1 = clampZoom(next);

  if (Math.abs(z1 - z0) < 0.0001) {
    return;
  }

  stopGlide();

  const x = anchor ? anchor.x : scroller.clientWidth / 2;
  const left = scroller.scrollLeft;
  const centring = (z) => Math.max(0, (scroller.clientWidth - rowWidth(widths()) * z) / 2);
  const x0 = centring(z0);

  applyZoom(z1);
  scroller.scrollLeft = anchoredScroll(left, x, x0, centring(z1), z0, z1);
  placePreview();
}

function zoomAction(action) {
  const z = overviewState.zoom;

  if (action === 'in') {
    setZoom(stepZoom(z, 1));
  } else if (action === 'out') {
    setZoom(stepZoom(z, -1));
  } else if (action === 'actual') {
    setZoom(1);
  } else if (action === 'fit') {
    setZoom(fitZoom(overviewState.scroller.clientWidth, widths()));
  }
}

// --- Frames ----------------------------------------------------------------------------

/**
 * The preview into its slot: block-order.js is told where the active frame
 * stands on screen and writes the iframe there, and the layer gets its hole
 * cut at the same rect. On every pan, zoom, resize and swap — in the same
 * turn as the row moves, so the preview never trails it.
 */
function placePreview() {
  const { win, layer, scroller, main, zoom } = overviewState;
  const entry = activeEntry();

  if (!layer || !main) {
    return;
  }

  if (!entry) {
    ask('lp:preview-slot', { win, slot: null });
    setStyle(scroller, 'clip-path', '');

    return;
  }

  const rect = entry.el.getBoundingClientRect();
  const view = scroller.getBoundingClientRect();

  ask('lp:preview-slot', { win, slot: { left: rect.left, top: rect.top, width: entry.spec.width, height: entry.height, scale: zoom } });
  // Cut in the scroller, not the layer: the layer takes no pointer events of
  // its own, the scroller paints the gutter and takes the clicks — the hole
  // has to be in it for the preview beneath to show and be hit.
  setStyle(scroller, 'clip-path', holePolygon(view.width, view.height, { left: rect.left - view.left, top: rect.top - view.top, width: rect.width, height: rect.height }));
}

/**
 * A frame's own URL for a preview URL: the view flag carries its size, and the
 * preview's unsaved-work flags ride along (see stashFlags).
 */
function frameUrl(entry, preview) {
  return viewUrl(preview, overviewState.win.location.href, entry.spec.handle, stashFlags());
}

function navigate(entry, preview) {
  entry.ready = false;
  entry.stale = false;
  entry.src = frameUrl(entry, preview);
  entry.el.src = entry.src;
}

/** The frame let go: no page, no morphs, no video. */
function blank(entry) {
  entry.unbind?.();
  entry.unbind = null;
  entry.ready = false;
  entry.stale = false;
  entry.src = '';
  entry.el.src = 'about:blank';
}

/**
 * Switch one size in or out of the row. Out, the frame is blanked at once —
 * no page, no morphs, no video — and comes back with the current preview when
 * switched in again. The zoom stays; the row re-packs and re-centres by itself.
 */
function toggleSize(entry) {
  if (sizeLock(openSizes(), entry.spec.handle)) {
    return;
  }

  // The size being edited goes out: first the preview moves to the nearest
  // size still in the row — the same door as that size's button in the top
  // bar, which answers at once (sve:breakpoint → paintActive) — so it is never
  // left without a slot.
  if (!entry.hidden && entry.active) {
    const next = overviewState.frames.find((row) => row.spec.handle === nearestSize(openSizes(), entry.spec.handle));

    if (next) {
      ask('lp:set-device', { win: overviewState.win, key: next.spec.device });
    }

    if (entry.active) {
      return;
    }
  }

  entry.hidden = !entry.hidden;
  entry.item.hidden = entry.hidden;

  if (entry.hidden) {
    hiddenSizes.add(entry.spec.handle);
    blank(entry);
  } else {
    hiddenSizes.delete(entry.spec.handle);
    navigate(entry, overviewState.preview);
  }

  applyZoom(overviewState.zoom);
}

/** The open row's sizes, as sizeLock and the sizes menu read them. */
function openSizes() {
  return overviewState.frames.map(({ spec, hidden, active }) => ({ ...spec, hidden, active }));
}

/** A frame still loading would miss the render: it gets the latest one when it has loaded. */
function post(entry, render) {
  if (entry.hidden || !render) {
    return;
  }

  if (!entry.ready) {
    entry.stale = true;

    return;
  }

  try {
    entry.el.contentWindow?.postMessage({ source: SOURCE, type: MSG.SVE_MIRROR, render }, new URL(entry.src).origin);
  } catch {
    /* the frame is on its way out */
  }
}

function frameLoaded(entry) {
  const frameWin = entry.el.contentWindow;
  let href = '';

  try {
    href = frameWin?.location?.href || '';
  } catch {
    return;
  }

  if (!href || href === 'about:blank') {
    return;
  }

  entry.ready = true;
  entry.expectTop = null;
  entry.unbind?.();

  // A new document is a new window. Its morphs may change the sections'
  // heights under the top edge: back in line with the preview after each. Its
  // scroll is passed on to the others unless the overview wrote it.
  const onUpdated = () => syncFromPreview();
  const onScroll = () => onMemberScroll(frameWin, entry);

  frameWin.addEventListener('statamic:preview-updated', onUpdated);
  frameWin.addEventListener('scroll', onScroll);
  entry.unbind = () => {
    frameWin.removeEventListener('statamic:preview-updated', onUpdated);
    frameWin.removeEventListener('scroll', onScroll);
  };

  // Fresh from the server, the copy knows no video holds; the panel remembers
  // them and answers to this window (video-holds.js).
  emit('video-holds:sync', { win: overviewState.win, target: frameWin });

  if (entry.stale) {
    entry.stale = false;
    post(entry, overviewState.render);
  }

  // Fresh from the server at the top of the page: to where the preview is.
  syncFromPreview();
}

/** The URL the preview iframe is showing, not a remembered one. */
function documentHref(frame) {
  try {
    const href = frame?.contentWindow?.location?.href || '';

    return href === 'about:blank' ? '' : href;
  } catch {
    return '';
  }
}

/**
 * The preview morphed to a render (preview.js calls this through
 * `__sveMirror`): every frame in the row morphs to the same one. The preview
 * URL is read again on the way, for a size switched in later.
 */
function mirror(render) {
  const { win, main } = overviewState;
  const preview = ask('lp:lastPreviewUrl') || documentHref(main);

  if (viewUrl(preview, win.location.href)) {
    overviewState.preview = preview;
  }

  overviewState.render = render;
  overviewState.frames.forEach((entry) => post(entry, render));
  syncFromPreview();
}

function bindMain(main) {
  overviewState.unbindMain?.();
  overviewState.unbindMain = null;
  overviewState.main = main;

  const mainWin = main?.contentWindow;

  if (!mainWin) {
    return;
  }

  // The hook preview.js calls after each render it morphs to (applyUpdate
  // there): on the preview's window for the while, gone with the overview.
  mainWin.__sveMirror = mirror;

  // The preview is a viewport in the row, as the copies are: a wheel over it
  // scrolls it (or pans the row sideways), and its scroll leads the copies.
  // FOCUS and a library drag are the bridge's — it scrolls the page to the
  // element, or zooms the page down inside the preview — and the copies
  // follow through the sync; the row only brings the active frame into view.
  // Keys in the preview stay the bridge's: Escape there ends an edit or a
  // menu, never the overview.
  const doc = mainWin.document;
  const onMessage = (event) => {
    if (event.data?.source !== SOURCE) {
      return;
    }

    if (event.data.type === MSG.FOCUS || event.data.type === MSG.EXT_DRAG_START) {
      revealActive();
    }
  };
  const onScroll = () => onMemberScroll(mainWin, overviewState.mainScroll);

  overviewState.mainScroll.expectTop = null;
  doc.addEventListener('wheel', onPreviewWheel, { passive: false });
  mainWin.addEventListener('message', onMessage);
  mainWin.addEventListener('scroll', onScroll);
  // An inline edit types into the preview alone; the frames take each keystroke (mirrorField).
  doc.addEventListener('input', onPreviewInput, true);
  mainWin.addEventListener('sve:inline-edit-end', onInlineEditEnd);

  overviewState.unbindMain = () => {
    try {
      doc.removeEventListener('wheel', onPreviewWheel, { passive: false });
      mainWin.removeEventListener('message', onMessage);
      mainWin.removeEventListener('scroll', onScroll);
      doc.removeEventListener('input', onPreviewInput, true);
      mainWin.removeEventListener('sve:inline-edit-end', onInlineEditEnd);
      overviewState.editing = null;
      delete mainWin.__sveMirror;
    } catch {
      /* the window is gone */
    }
  };
}

/**
 * An inline edit in the preview, painted into every frame as it is typed. The
 * preview holds back its morphs while the edit lasts (preview.js), so the
 * copies would show the old text until the edit ends. Each input paints the
 * edited field's wrapper into the same wrapper of every loaded frame; the
 * morph after the edit is the truth. The edit's end paints the wrapper once
 * more: a cancelled edit puts the old markup back without an input event.
 */
function onPreviewInput(event) {
  const wrapper = event.target?.closest?.(`[${SID_FIELD_ATTR}]`);

  if (!wrapper) {
    return;
  }

  overviewState.editing = wrapper;
  mirrorField(wrapper);
}

function onInlineEditEnd() {
  const wrapper = overviewState.editing;

  overviewState.editing = null;

  if (wrapper?.isConnected) {
    mirrorField(wrapper);
  }
}

function mirrorField(wrapper) {
  const place = fieldPlace(wrapper.ownerDocument, wrapper);
  const html = wrapper.innerHTML;

  for (const entry of shown()) {
    let target = null;

    if (!entry.ready) {
      continue;
    }

    try {
      target = fieldAt(entry.el.contentDocument, place);
    } catch {
      continue;
    }

    if (!target || target.innerHTML === html) {
      continue;
    }

    target.innerHTML = html;

    // The preview's editing marks stay in the preview.
    for (const el of target.querySelectorAll('[contenteditable], [data-sve-editing], [data-sve-locked]')) {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-sve-editing');
      el.removeAttribute('data-sve-locked');
    }
  }
}

function onKey(event) {
  if (event.key === 'Escape' && !event.defaultPrevented) {
    closeBreakpointOverview(overviewState.win);
  }
}

// --- Synced scroll ---------------------------------------------------------------------

/**
 * A document's anchors for syncedScrollTop: its page sections — the outermost
 * `[data-sid]`, not the sets inside them — and its header and footer, which
 * are no sets and are found by their own attribute. In the document's pixels
 * and order. One not drawn (no height) is no place to stand in, and neither
 * is one fixed or sticky: it stays put on screen while the page scrolls under
 * it, so a sticky header would be the anchor under the top edge at every
 * scroll, and every frame would be held where it already was.
 */
function anchorsOf(win) {
  const anchors = [];

  for (const el of win.document.querySelectorAll(`[${SID_ATTR}]:not([${SID_ATTR}] *), [${CHROME_ATTR}]`)) {
    const rect = el.getBoundingClientRect();
    const position = rect.height > 0 ? win.getComputedStyle(el).position : '';
    const chrome = el.getAttribute(CHROME_ATTR);

    if (position && position !== 'fixed' && position !== 'sticky') {
      anchors.push({ id: chrome === null ? el.getAttribute(SID_ATTR) : `chrome:${chrome}`, top: rect.top + win.scrollY, height: rect.height });
    }
  }

  return anchors;
}

/** Where a window is scrolled to and what it holds, as syncedScrollTop reads a source or a target. */
function scrollOf(win) {
  return {
    scrollTop: win.scrollY,
    scrollHeight: win.document.documentElement.scrollHeight,
    viewport: win.innerHeight,
    anchors: anchorsOf(win),
  };
}

/**
 * The windows that scroll together, each with the holder of the scroll the
 * overview last wrote to it: the preview, and every copy that has loaded —
 * the one under the preview too, so that it stands at the right place the
 * moment the preview moves to another size.
 */
function members() {
  const out = [];
  const mainWin = overviewState.main?.contentWindow;

  if (mainWin) {
    out.push({ win: mainWin, holder: overviewState.mainScroll });
  }

  for (const entry of shown()) {
    if (entry.ready && entry.el.contentWindow) {
      out.push({ win: entry.el.contentWindow, holder: entry });
    }
  }

  return out;
}

/**
 * A member scrolled. A scroll the overview wrote itself is known by where it
 * was sent and goes no further — or every frame would answer every other, for
 * ever. Any other — a wheel, the bridge's scrollIntoView, the page's own
 * script — makes this member the one the rest follow.
 */
function onMemberScroll(win, holder) {
  const ours = holder.expectTop !== null && Math.abs(win.scrollY - holder.expectTop) <= 1;

  holder.expectTop = null;

  if (!ours) {
    scheduleSync(win);
  }
}

/**
 * The rest brought in line with `source` in the next animation frame: once
 * per frame however many scroll events it fires, and from the latest member
 * to move when two do. Not a timer — cancelled on close (stopSync).
 */
function scheduleSync(source) {
  const { scroller, sync } = overviewState;

  if (!scroller || sync?.source === source) {
    return;
  }

  const view = scroller.ownerDocument.defaultView;

  stopSync();
  overviewState.sync = {
    source,
    frame: view.requestAnimationFrame(() => {
      overviewState.sync = null;
      syncFrom(source);
    }),
  };
}

/**
 * The copies to where the preview is: after a copy loads or morphs, a render,
 * a change of size. A sync already on its way brings every frame in line as
 * well, and is left to do so — it may be a copy the wheel is moving.
 */
function syncFromPreview() {
  const mainWin = overviewState.main?.contentWindow;

  if (mainWin && !overviewState.sync) {
    scheduleSync(mainWin);
  }
}

function stopSync() {
  const { scroller, sync } = overviewState;

  if (sync && scroller) {
    scroller.ownerDocument.defaultView.cancelAnimationFrame(sync.frame);
  }

  overviewState.sync = null;
}

/**
 * Every member but `source` scrolled to stand where `source` stands
 * (syncedScrollTop). Written only when it moves a member by more than a
 * pixel, and marked first, so that member's scroll event is known as ours.
 * Instantly, whatever the page's `scroll-behavior` says: a smooth scroll
 * would pass through places the mark does not know and be taken for a
 * scroll of the user's.
 */
function syncFrom(source) {
  const all = members();
  let from = null;

  if (!overviewState.layer || !all.some((member) => member.win === source)) {
    return;
  }

  try {
    from = scrollOf(source);
  } catch {
    return;
  }

  for (const { win, holder } of all) {
    if (win === source) {
      continue;
    }

    try {
      const want = syncedScrollTop(from, scrollOf(win));
      const before = win.scrollY;

      if (Math.abs(want - before) <= 1) {
        continue;
      }

      holder.expectTop = want;
      win.scrollTo({ top: want, behavior: 'instant' });
      // Where it landed: a page may scroll less far than measured (a
      // scrollbar across its foot), and a scroll that went nowhere fires no
      // event to clear the mark.
      holder.expectTop = win.scrollY === before ? null : win.scrollY;
    } catch {
      /* the frame is on its way out */
    }
  }
}

// --- Binding ---------------------------------------------------------------------------

function bind(win, view) {
  const { contents, scroller, frames } = overviewState;

  // Cancelled on close after the listeners below are gone, so none can ask
  // for another: no sync lands on a frame already blanked.
  overviewState.cleanups.push(stopSync);

  for (const entry of frames) {
    listen(entry.el, 'load', () => frameLoaded(entry));
    overviewState.cleanups.push(() => entry.unbind?.());
  }

  bindMain(overviewState.main);
  overviewState.cleanups.push(() => overviewState.unbindMain?.());

  // The preview loaded a document: another page, or Statamic swapped in a new
  // iframe (it does when the URL changes). Its window is new either way — hook
  // it again, and take the frames along. `load` does not bubble; capture sees it.
  listen(
    contents,
    'load',
    (event) => {
      const main = previewFrame(win.document);

      if (!main || event.target !== main) {
        return;
      }

      bindMain(main);
      placePreview();
      // The new document's own scroll: the copies follow it there.
      syncFromPreview();

      const preview = documentHref(main) || ask('lp:lastPreviewUrl');

      if (!viewUrl(preview, win.location.href)) {
        return;
      }

      overviewState.preview = preview;

      // Another page: the frames go there too. The same page: they show it
      // already, and the next render reaches them through the new window's hook.
      for (const entry of shown()) {
        if (entry.src !== frameUrl(entry, preview)) {
          navigate(entry, preview);
        }
      }
    },
    true
  );

  // Follows the pane; closes with Live Preview (the pane leaves the document).
  const observer = new view.ResizeObserver(() => {
    const rect = contents.isConnected ? contents.getBoundingClientRect() : null;

    if (!rect || (rect.width === 0 && rect.height === 0)) {
      closeBreakpointOverview(win);

      return;
    }

    place();
    // The frames' height follows the pane, and the preview its slot.
    applyZoom(overviewState.zoom);
    paintButton(win, true);
  });

  observer.observe(contents);
  overviewState.cleanups.push(() => observer.disconnect());

  [...new Set([view, win])].forEach((target) => listen(target, 'keydown', onKey));

  // The size the fields on the left are editing: the ring follows it, and the
  // row scrolls to it — on every pick, so a size picked again comes back into
  // view after a pan away from it. Not when the top bar merely says the size
  // again (a rebuild, a pane resize): during a library drag that once pulled
  // the row away from where it had just been put.
  listen(win, 'sve:breakpoint', (event) => {
    paintActive(event.detail?.bp);
    paintDim(sizePicked(event.detail?.device));

    if (event.detail?.reason === 'pick') {
      revealActive();
    }
  });

  listen(scroller, 'wheel', onWheel, { passive: false });
  listen(scroller, 'pointerdown', onPanStart);
  listen(scroller, 'pointermove', onPanMove);
  listen(scroller, 'pointerup', onPanEnd);
  listen(scroller, 'pointercancel', onPanEnd);
}

/** A wheel over the layer: the frame under the pointer scrolls, the row pans or zooms (see wheel). */
function onWheel(event) {
  const rect = overviewState.scroller.getBoundingClientRect();

  wheel(event, { x: event.clientX - rect.left, y: event.clientY - rect.top }, windowAt(event.clientX, event.clientY));
}

/** The same wheel over the preview: its pointer position, in its own pixels, put into the row's; the preview is what scrolls. */
function onPreviewWheel(event) {
  const entry = activeEntry();

  if (!entry) {
    return;
  }

  const slot = entry.el.getBoundingClientRect();
  const rect = overviewState.scroller.getBoundingClientRect();
  const z = overviewState.zoom;

  wheel(event, { x: slot.left - rect.left + event.clientX * z, y: slot.top - rect.top + event.clientY * z }, overviewState.main?.contentWindow);
}

/**
 * The window a wheel over the layer scrolls: the copy whose frame — or label —
 * is under the pointer, and the preview over a gutter or its own label (the
 * copy under it is out of sight). A copy still loading takes none.
 */
function windowAt(x, y) {
  const inside = (r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  const hit = shown().find((entry) => inside(entry.el.getBoundingClientRect()) || inside(entry.label.getBoundingClientRect()));

  if (!hit || hit.active) {
    return overviewState.main?.contentWindow || null;
  }

  return hit.ready ? hit.el.contentWindow : null;
}

/**
 * One wheel, three gestures, never the browser's own (it would scroll the
 * Control Panel behind the row, or zoom the whole page). Ctrl/Cmd, and a
 * trackpad pinch, zoom the row round the pointer. Mostly sideways, the row
 * pans, and the preview is placed in the same turn. Mostly up or down, one
 * window scrolls — `target`, the frame under the pointer — and the others
 * follow it through its scroll event (onMemberScroll).
 */
function wheel(event, anchor, target) {
  event.preventDefault();
  stopGlide();

  const { scroller, zoom } = overviewState;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1;

  if (event.ctrlKey || event.metaKey) {
    setZoom(zoom * Math.exp(-event.deltaY * unit * 0.0015), anchor);

    return;
  }

  if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
    scroller.scrollLeft += event.deltaX * unit;
    placePreview();

    return;
  }

  // Instantly, as the row moved before: a page's `scroll-behavior: smooth`
  // would start a fresh glide from wherever the last one had got to at every
  // event of a trackpad's stream, and fall behind the fingers.
  try {
    target?.scrollBy({ top: event.deltaY * unit, behavior: 'instant' });
  } catch {
    /* the frame is on its way out */
  }
}

function onPanStart(event) {
  const { scroller } = overviewState;
  const rect = scroller.getBoundingClientRect();

  // Not on a scrollbar: those keep working as scrollbars.
  if (event.button !== 0 || event.clientX - rect.left >= scroller.clientWidth || event.clientY - rect.top >= scroller.clientHeight) {
    return;
  }

  event.preventDefault();
  stopGlide();
  overviewState.pan = { id: event.pointerId, x: event.clientX, from: { x: event.clientX, y: event.clientY } };
  scroller.setPointerCapture(event.pointerId);
  scroller.dataset.panning = '';
}

function onPanMove(event) {
  const { pan, scroller } = overviewState;

  if (!pan || pan.id !== event.pointerId) {
    return;
  }

  // Sideways only: up and down, each frame scrolls its own page.
  scroller.scrollLeft -= event.clientX - pan.x;
  pan.x = event.clientX;
  placePreview();
}

function onPanEnd(event) {
  const { pan, scroller } = overviewState;

  if (!pan || pan.id !== event.pointerId) {
    return;
  }

  overviewState.pan = null;
  delete scroller.dataset.panning;

  if (scroller.hasPointerCapture(event.pointerId)) {
    scroller.releasePointerCapture(event.pointerId);
  }

  // A click, not a pan, on one of the other sizes: that size becomes the one
  // the fields edit — the same door as its button in the top bar — and the
  // preview moves into its place.
  if (event.type === 'pointerup' && !isDrag(pan.from, { x: event.clientX, y: event.clientY })) {
    const inside = (r) => event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    // The frame or the label above it (its name and width).
    const hit = shown().find((entry) => inside(entry.el.getBoundingClientRect()) || inside(entry.label.getBoundingClientRect()));

    if (hit && !hit.active) {
      ask('lp:set-device', { win: overviewState.win, key: hit.spec.device });
    }
  }
}

// --- Paint -------------------------------------------------------------------------------

/**
 * The size the fields on the left edit right now: a device's own, or — in
 * Full width — the one the pane's width falls in, read as dispatchLpBreakpoint
 * reads it. Later changes arrive as `sve:breakpoint`.
 */
function activeBreakpoint(win) {
  const row = bpForDevice(chromeGet(win, 'sve-lp-device'), win);

  if (row) {
    return row.handle;
  }

  const { contents } = overviewState;
  const view = contents.ownerDocument.defaultView;
  const box = contentBox(contents.getBoundingClientRect(), view.getComputedStyle(contents), contents.clientWidth, contents.clientHeight);

  return bpFromWidth(box.width || 1200, win);
}

// --- The sizes menu --------------------------------------------------------------------

/** The open sizes menu: its portal and the dismiss listeners it bound. */
let sizesMenu = null;

/** Every size, narrowest first, as the menu shows it — the open row's own state, or, closed, the choice that open will read. */
function menuSizes(win) {
  if (overviewState.layer) {
    return openSizes();
  }

  return overviewFrames(breakpoints(win), win.Statamic?.$config?.get?.('livePreview.devices')).map((spec) => ({
    ...spec,
    hidden: hiddenSizes.has(spec.handle),
  }));
}

/** One size in or out: the row's own switch while open; closed, only the choice open reads. */
function switchSize(win, handle) {
  const entry = overviewState.frames.find((row) => row.spec.handle === handle);

  if (entry) {
    toggleSize(entry);

    return;
  }

  if (sizeLock(menuSizes(win), handle)) {
    return;
  }

  if (hiddenSizes.has(handle)) {
    hiddenSizes.delete(handle);
  } else {
    hiddenSizes.add(handle);
  }
}

/**
 * The right-click on the overview button (cp-shell/block-order.js): which
 * sizes stand in the row, a checkbox each, open or closed. A portal on the
 * CP's body, under the button; it closes as the top bar's ⋮ menu does — a
 * pointer outside, a click in the preview, Escape (which the overview then
 * leaves alone). Its style and listeners go with it.
 */
export function openSizesMenu(win, anchor) {
  closeSizesMenu();

  const doc = win.document;
  const sizes = menuSizes(win);

  if (!sizes.length) {
    return;
  }

  const style = injectStyle(doc, MENU_STYLE_ID, menuCss());
  const menu = make(doc, 'div', 'sve-bpo-menu');
  const title = make(doc, 'div', 'sve-bpo-menu-title');

  menu.id = MENU_ID;
  menu.setAttribute('role', 'group');
  title.id = `${MENU_ID}-title`;
  title.textContent = t(win, 'bp_overview_sizes');
  menu.setAttribute('aria-labelledby', title.id);
  menu.appendChild(title);

  const rows = sizes.map((size) => {
    const row = doc.createElement('label');
    const box = doc.createElement('input');
    const name = make(doc, 'span', 'sve-bpo-menu-name');
    const width = make(doc, 'span', 'sve-bpo-menu-width');

    row.dataset.bp = size.handle;
    box.type = 'checkbox';
    name.textContent = size.label;
    width.textContent = `${size.width} px`;
    row.append(box, name, width);
    menu.appendChild(row);

    box.addEventListener('change', () => {
      switchSize(win, size.handle);
      paint();
    });

    return { row, box };
  });

  // Every row again after each switch: one size going can lock another (the last one ticked).
  const paint = () => {
    const now = menuSizes(win);

    rows.forEach(({ row, box }) => {
      const size = now.find((s) => s.handle === row.dataset.bp);
      const lock = size ? sizeLock(now, size.handle) : '';

      box.checked = !!size && !size.hidden;
      box.disabled = !!lock;
      row.toggleAttribute('data-locked', !!lock);
      row.title = lock === 'last' ? t(win, 'bp_overview_last') : '';
    });
  };

  paint();
  doc.body.appendChild(menu);

  // Under the button, its left edge on the button's, kept inside the window.
  const at = anchor.getBoundingClientRect();
  const gap = remToPx(win, 0.375);
  const room = win.innerWidth - menu.offsetWidth - gap;

  menu.style.left = `${Math.round(Math.max(gap, Math.min(at.left, room)))}px`;
  menu.style.top = `${Math.round(at.bottom + gap)}px`;

  sizesMenu = {
    menu,
    style,
    unbind: bindMenuDismiss(win, (target) => menu.contains(target), closeSizesMenu),
  };
}

export function closeSizesMenu() {
  if (!sizesMenu) {
    return;
  }

  const { menu, style, unbind } = sizesMenu;

  sizesMenu = null;
  unbind();
  menu.remove();
  style.remove();
}

/**
 * The ring: which size the Responsive fields on the left are editing — and
 * the preview's place. The frames stay as they are: the size that was active
 * shows its own copy the moment the preview leaves it, and the copy of the
 * size that is active now sits under the preview, out of sight.
 */
function paintActive(handle) {
  if (!handle || handle === overviewState.active) {
    return;
  }

  overviewState.active = handle;

  const title = t(overviewState.win, 'bp_overview_active');

  for (const entry of overviewState.frames) {
    const on = entry.spec.handle === handle;

    if (entry.item.hasAttribute('data-active') !== on) {
      entry.item.toggleAttribute('data-active', on);
    }

    if (entry.label.title !== (on ? title : '')) {
      entry.label.title = on ? title : '';
    }

    if (entry.active === on) {
      continue;
    }

    entry.active = on;
  }

  // Picked in the top bar while switched out: it comes back in. It is the
  // preview now, and a size out of the row has no slot to lay it in.
  const picked = overviewState.frames.find((entry) => entry.active);

  if (picked?.hidden) {
    toggleSize(picked);
  }

  if (overviewState.layer) {
    placePreview();
    // The preview is another width now, its page laid out anew: the copies
    // follow it to the place it shows.
    syncFromPreview();
  }
}

/** A device in the top bar, as against Responsive — the width of the pane, the strip's "All". */
function sizePicked(device) {
  return !!device && device !== 'Responsive';
}

function paintDim(on) {
  overviewState.dim = on;

  if (overviewState.canvas && overviewState.canvas.hasAttribute('data-dim') !== on) {
    overviewState.canvas.toggleAttribute('data-dim', on);
  }
}

const GLIDE_MS = 320;
/**
 * The frames that are not the picked size, while one is picked in the top
 * bar: stepped back to 70 %, so the eye lands on the one with the ring. With
 * no size picked — Responsive, the strip's "All" — every frame stands alike.
 */
const DIM_OPACITY = 0.7;

/**
 * The row scrolled sideways to `left` with an animation rather than a jump —
 * a size picked in the top bar, a section focused on the left, a library
 * drag. By script, one animation frame at a time, and the preview placed in
 * each: native smooth scrolling runs on the compositor, and the preview would
 * trail it a frame. A wheel, a drag, a zoom or a close cuts the glide short.
 * It glides whatever the system's motion setting says: the owner asked for
 * the movement, twice (25 Sep 2026) — a jump here read as a fault, not as calm.
 */
function glideTo(left) {
  const { scroller } = overviewState;
  const view = scroller.ownerDocument.defaultView;
  const from = scroller.scrollLeft;
  const delta = left - from;

  stopGlide();

  if (!delta) {
    return;
  }

  const started = view.performance.now();
  const step = (now) => {
    const t = (now - started) / GLIDE_MS;

    scroller.scrollLeft = from + delta * glideEase(t);
    placePreview();
    overviewState.glide = t < 1 ? view.requestAnimationFrame(step) : null;
  };

  overviewState.glide = view.requestAnimationFrame(step);
}

function stopGlide() {
  const { scroller, glide } = overviewState;

  if (glide && scroller) {
    scroller.ownerDocument.defaultView.cancelAnimationFrame(glide);
  }

  overviewState.glide = null;
}

/**
 * The active frame whole in view, ring included: the row glided sideways by
 * revealScroll, and only when that changes anything. A size switched out of
 * the row has no frame to show.
 */
function revealActive() {
  const { scroller, active } = overviewState;
  const entry = shown().find((item) => item.spec.handle === active);

  if (!entry) {
    return;
  }

  const view = scroller.getBoundingClientRect();
  const frame = entry.el.getBoundingClientRect();
  const start = scroller.scrollLeft;
  const ring = RING_PX * 2;
  const next = revealScroll(start, scroller.clientWidth, frame.left - view.left + start - ring, frame.right - view.left + start + ring);

  if (next !== start) {
    glideTo(next);
  }
}

/** The top-bar button says whether the overview is open. Compared before written. */
function paintButton(win, on) {
  const btn = win?.document?.getElementById(LP_PREVIEW_CHROME_ID)?.querySelector('[data-overview]');

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
