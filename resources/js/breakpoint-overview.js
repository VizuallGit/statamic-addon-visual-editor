/**
 * Every screen size side by side in Live Preview: live frames, view only.
 *
 * Owns the breakpoint overview — one layer over the preview pane
 * (`#__sve-bp-overview`) holding one iframe per breakpoint ("view frames"),
 * its zoom and pan, and passing preview updates on to those frames. The
 * top-bar button `[data-overview]` (cp-shell/block-order.js) is the only way
 * in: an `import()` on click. No file imports this module statically, and it
 * puts nothing on `window` or the bus.
 *
 * Closed, it costs nothing. Everything `openBreakpointOverview` binds —
 * listeners, the ResizeObserver — is a function in `overviewState.cleanups`,
 * and `closeBreakpointOverview` runs them, blanks and removes the frames, the
 * layer and its `<style>`, and empties the state. Nothing here binds any other
 * way, and nothing here uses a timer or a MutationObserver.
 *
 * The preview frame is never touched: not its src, style, transform or window.
 * block-order.js owns those and writes them again on every pass; the layer
 * only covers the frame. It sits inside Live Preview's own stacking context,
 * as the last child of `.live-preview-main` with z-index 2 — above the pane
 * (1), below the editor column (3), the docks, the top bar, Statamic's modals
 * and every dropdown portal (measured 24 Sep 2026). Never inside
 * `.live-preview-contents`: Statamic finds its preview there as `firstChild`.
 * It covers the pane's content box — the docks pad the pane and sit on the
 * padding, so the layer never goes under a dock.
 *
 * View frames load the preview URL with `sve_view=<their size>` (one URL per
 * frame, see viewUrl); InjectBridgeScript answers any `sve_view` with
 * preview.js and no bridge.js, so they morph but show no
 * badges, hover or toolbar and send nothing back. Updates are forwarded, not
 * made up: once the preview's own preview.js has morphed it dispatches
 * `statamic:preview-updated` on its window, and each view frame is posted
 * Statamic's `statamic.preview.updated` with the latest URL and morphs itself.
 * The dock's Instant paint happens in the covered preview only, so the frames
 * show what the server rendered, about a second later.
 *
 * While open, each size's button in the top bar carries a mark at its icon's
 * top-right corner: filled, the size is in the row; a ring, it is out and its
 * frame is blank (a size not looked at costs nothing). The choice lives for
 * the page, never stored.
 *
 * May import: lib/, breakpoints.js, chrome-prefs.js (chromeGet), cp-state.js
 * (sveState, read only), cp/bus.js. Not cp-shell/*: scripts/assert-isolation.mjs
 * holds every file outside the shell to the bus, so the sizes are read where
 * the shell reads them — `sveBreakpoints`, Statamic's `livePreview.devices`,
 * the stored device.
 *
 * Bus: asks `lp:lastPreviewUrl`. DOM events, only while open:
 * `statamic:preview-updated` on the preview's and the view frames' windows,
 * `load` on the pane (capture), `sve:breakpoint` and `keydown` on the CP window.
 *
 * The whole feature, to remove it without a trace: this file; the button in
 * cp-shell/block-order.js; `breakpoint_overview` in Features::KEYS and in
 * resources/blueprints/settings.yaml; `sve_view` in InjectBridgeScript; the
 * `bp_overview*` strings; the narrow-window rule at the end of
 * resources/css/addon.css; tests/js and tests/browser breakpoint-overview.
 */
import { ask } from './cp/bus.js';
import { bpForDevice, bpFromWidth, breakpoints } from './breakpoints.js';
import { chromeGet } from './chrome-prefs.js';
import { sveState } from './cp-state.js';
import { remToPx } from './lib/dom.js';
import { t } from './lib/i18n.js';
import { LP_ICON_IDLE_OPACITY, LP_PREVIEW_CHROME_ID, LP_PRIMARY_FLAT } from './lib/ids.js';
import { previewFrame } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';

const LAYER_ID = '__sve-bp-overview';
const STYLE_ID = '__sve-bp-overview-style';
const ON_CLASS = 'sve-bpo-on';

/** The query flag InjectBridgeScript reads: preview.js, no bridge. */
export const VIEW_FLAG = 'sve_view';

/** Canvas pixels between the frames and around the row; they scale with the zoom. */
export const GAP = 64;
export const PAD = 48;

/** Room above the frames for their labels, on screen. Labels keep their size at every zoom. */
const LABEL_REM = 2;

/** A view frame is never taller than this. A longer page is cut, not rendered. */
export const HEIGHT_CAP = 8000;

/** What applyLpDevice gives the base size when the config names no width for it. */
const BASE_WIDTH = 1440;

export const ZOOM_MIN = 0.05;
export const ZOOM_MAX = 2;
const ZOOM_STEPS = [0.1, 0.15, 0.2, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2];

/** The 2px ring round the size the fields edit. */
const SIZE_BLUE = 'rgb(96, 165, 250)';

/**
 * Where a size mark sits on its top-bar button, from the owner's drawing
 * (24 Sep 2026): its centre this many pixels in from the button's left edge,
 * on the button's top edge — the icon's top-right corner, like a badge.
 */
const MARK_CENTER_X = 20;

/** The size marks take the icons' own resting tone: currentColor at the idle opacity. */
const MARK_TONE = Math.round(Number(LP_ICON_IDLE_OPACITY) * 100);

const MINUS_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="12" x2="18" y2="12"/></svg>';
const PLUS_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/></svg>';

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

/** A view frame's height: its document's, no lower than the view, no higher than the cap. */
export function frameHeight(docHeight, floor, cap = HEIGHT_CAP) {
  const height = Math.ceil(Number(docHeight) || 0);

  return Math.round(Math.min(cap, Math.max(Math.ceil(Number(floor) || 0), height)));
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
 * The colour `top` actually shows over the opaque `base`, as one opaque CSS
 * colour: a knock-out ring round a mark has to be the surface it sits on, and
 * the top bar's groups are a see-through grey over the header. `color-mix` in
 * sRGB is exactly alpha compositing, and it takes any `base` — rgb() or oklch().
 */
export function knockoutColor(top, base) {
  const value = String(top || '').trim();
  const rgba = value.match(/^rgba\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)[\s,/]+([\d.]+%?)\s*\)$/);

  if (!rgba) {
    return isTransparent(value) ? base : value;
  }

  const alpha = rgba[4].endsWith('%') ? parseFloat(rgba[4]) / 100 : Number(rgba[4]);
  const color = `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;

  if (alpha >= 1) {
    return color;
  }

  if (alpha <= 0) {
    return base;
  }

  return `color-mix(in srgb, ${color} ${Math.round(alpha * 1000) / 10}%, ${base})`;
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

// --- State ---------------------------------------------------------------------

function emptyState() {
  return {
    win: null, // the Control Panel window the button lives in
    layer: null,
    frames: [], // { spec, item, label, el, src, ready, stale, height, unbind, hidden, badge }
    cleanups: [], // everything open bound; close runs them all
    styles: [],
    contents: null, // Statamic's `.live-preview-contents`
    scroller: null,
    sizer: null,
    canvas: null,
    level: null,
    main: null, // the preview iframe updates are forwarded from
    unbindMain: null,
    zoom: 1,
    labelSpace: 32,
    preview: '', // the preview URL the frames were last sent (each adds its own view flag)
    active: '', // breakpoint handle that has the ring
    pan: null,
  };
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

  try {
    build(win, host, specs);
    bind(win, view);
    mountBadges(win);
    paintActive(activeBreakpoint(win));
    paintButton(win, true);

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

/** Undo everything open did, last bound first, and forget it. */
function teardown(win) {
  const state = overviewState;

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
  paintButton(state.win || win, false);
  Object.assign(overviewState, emptyState());
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

    return { spec, item, label, el, src: '', ready: false, stale: false, height: 0, unbind: null, hidden, badge: null };
  });

  sizer.appendChild(canvas);
  scroller.appendChild(sizer);
  layer.append(scroller, zoomBar(win, doc));
  Object.assign(overviewState, { layer, scroller, sizer, canvas });

  // In the DOM before any frame gets a src; sized before the first paint.
  host.appendChild(layer);
  place();

  const zoom = fitZoom(scroller.clientWidth, widths());

  overviewState.zoom = zoom;

  for (const entry of overviewState.frames) {
    entry.height = frameHeight(0, floorHeight());
    entry.el.style.height = `${entry.height}px`;
  }

  applyZoom(zoom);
}

function zoomBar(win, doc) {
  const bar = make(doc, 'div', 'sve-bpo-zoom');
  const button = (action, title, fill) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.bpo = action;
    btn.title = title;
    fill(btn);
    listen(btn, 'click', () => zoomAction(action));

    return btn;
  };

  const level = button('actual', t(win, 'bp_overview_actual'), () => {});

  overviewState.level = level;
  bar.append(
    button('out', t(win, 'zoom_out'), (btn) => { btn.innerHTML = MINUS_ICON; }),
    level,
    button('in', t(win, 'zoom_in'), (btn) => { btn.innerHTML = PLUS_ICON; }),
    button('fit', t(win, 'bp_overview_fit'), (btn) => { btn.textContent = t(win, 'bp_overview_fit'); })
  );

  return bar;
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
${L} { position: fixed; z-index: 2; box-sizing: border-box; overflow: hidden; background: var(--sve-bpo-bg); color: var(--sve-bpo-fg); font-family: inherit; }
${L} .sve-bpo-scroll { position: absolute; inset: 0; overflow: auto; overscroll-behavior: contain; cursor: grab; }
${L} .sve-bpo-scroll[data-panning] { cursor: grabbing; }
${L} .sve-bpo-sizer { position: relative; margin: 0 auto; overflow: hidden; }
${L} .sve-bpo-canvas { --z: 1; position: absolute; left: 0; top: 0; box-sizing: border-box; display: flex; align-items: flex-start; gap: ${GAP}px; padding: ${PAD}px; transform-origin: 0 0; pointer-events: none; }
${L} .sve-bpo-item { position: relative; flex: none; }
${L} .sve-bpo-label { position: absolute; left: 0; bottom: 100%; margin-bottom: calc(.5rem / var(--z)); font-size: calc(.75rem / var(--z)); font-weight: 500; line-height: 1.3; white-space: nowrap; opacity: .85; pointer-events: auto; }
${L} .sve-bpo-item[data-active] .sve-bpo-label { opacity: 1; font-weight: 600; }
${L} .sve-bpo-frame { display: block; border: 0; background: #fff; }
${L} .sve-bpo-item[data-active] .sve-bpo-frame { outline: calc(2px / var(--z)) solid ${SIZE_BLUE}; outline-offset: calc(2px / var(--z)); }
${L} .sve-bpo-zoom { position: absolute; right: .75rem; bottom: .75rem; display: inline-flex; align-items: center; gap: .125rem; padding: .25rem; border-radius: .5rem; background: rgba(24, 24, 27, .9); color: #fafafa; box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .3); font-size: .75rem; line-height: 1; }
${L} .sve-bpo-zoom button { box-sizing: border-box; min-width: 1.75rem; height: 1.75rem; padding: 0 .5rem; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: .375rem; background: transparent; color: inherit; font: inherit; font-weight: 500; white-space: nowrap; cursor: pointer; }
${L} .sve-bpo-zoom button:hover { background: rgba(255, 255, 255, .12); }
${L} .sve-bpo-zoom svg { width: 1.25em; height: 1.25em; }
#${LP_PREVIEW_CHROME_ID} [data-overview].${ON_CLASS} { background: ${LP_PRIMARY_FLAT} !important; color: #fff !important; opacity: 1 !important; }
#${LP_PREVIEW_CHROME_ID} [data-overview].${ON_CLASS} svg { opacity: 1; }
#${LP_PREVIEW_CHROME_ID} .sve-bpo-badge { --sve-bpo-mark: color-mix(in srgb, currentColor ${MARK_TONE}%, var(--sve-bpo-knock)); position: absolute; box-sizing: border-box; width: .375rem; height: .375rem; border-radius: 50%; border: 1.5px solid color-mix(in srgb, currentColor 40%, var(--sve-bpo-knock)); background: var(--sve-bpo-knock); box-shadow: 0 0 0 2.5px var(--sve-bpo-knock); cursor: pointer; }
#${LP_PREVIEW_CHROME_ID} .sve-bpo-badge::after { content: ''; position: absolute; inset: -.25rem -.25rem -.0625rem -.125rem; }
#${LP_PREVIEW_CHROME_ID} .sve-bpo-badge[data-on] { border-color: var(--sve-bpo-mark); background: var(--sve-bpo-mark); }
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

/** The canvas height that fills the view at the current zoom. */
function floorHeight() {
  const { scroller, zoom, labelSpace } = overviewState;

  return Math.max(0, (scroller.clientHeight - framesTop(zoom, labelSpace) - PAD * zoom) / zoom);
}

/** Zoom is one transform on the canvas plus the sizer the scroll area is measured by. */
function applyZoom(z) {
  const { canvas, sizer, level, labelSpace } = overviewState;
  const top = framesTop(z, labelSpace);
  const tallest = Math.max(0, ...shown().map((entry) => entry.height));
  const percent = `${Math.round(z * 100)}%`;

  overviewState.zoom = z;
  setStyle(canvas, 'transform', `scale(${z})`);
  setStyle(canvas, '--z', String(z));
  setStyle(canvas, 'padding-top', `${top / z}px`);
  setStyle(sizer, 'width', `${Math.ceil(rowWidth(widths()) * z)}px`);
  setStyle(sizer, 'height', `${Math.ceil(top + (tallest + PAD) * z)}px`);

  if (level.textContent !== percent) {
    level.textContent = percent;
  }
}

/** Zoom to `next`, keeping the point at `anchor` (scroller pixels; default the middle) still. */
function setZoom(next, anchor = null) {
  const { scroller, labelSpace } = overviewState;
  const z0 = overviewState.zoom;
  const z1 = clampZoom(next);

  if (Math.abs(z1 - z0) < 0.0001) {
    return;
  }

  const x = anchor ? anchor.x : scroller.clientWidth / 2;
  const y = anchor ? anchor.y : scroller.clientHeight / 2;
  const left = scroller.scrollLeft;
  const top = scroller.scrollTop;
  const centring = (z) => Math.max(0, (scroller.clientWidth - rowWidth(widths()) * z) / 2);
  const x0 = centring(z0);

  applyZoom(z1);
  scroller.scrollLeft = anchoredScroll(left, x, x0, centring(z1), z0, z1);
  scroller.scrollTop = anchoredScroll(top, y, framesTop(z0, labelSpace), framesTop(z1, labelSpace), z0, z1);
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
 * The height of what the document holds. Not `documentElement.scrollHeight`:
 * that is never less than the frame's own height, so a page that got shorter
 * would keep the frame it had.
 */
function documentHeight(doc) {
  const root = doc?.documentElement;

  return root ? Math.max(root.offsetHeight || 0, doc.body?.scrollHeight || 0) : 0;
}

function measure(entry) {
  let height = 0;

  if (entry.hidden) {
    return;
  }

  try {
    height = documentHeight(entry.el.contentDocument);
  } catch {
    return;
  }

  const next = frameHeight(height, floorHeight());

  if (next === entry.height) {
    return;
  }

  entry.height = next;
  entry.el.style.height = `${next}px`;
  applyZoom(overviewState.zoom);
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

/**
 * Switch one size in or out of the row. Out, the frame is blanked at once —
 * no page, no morphs, no video — and comes back with the current preview when
 * switched in again. The zoom stays; the row re-packs and re-centres by itself.
 */
function toggleSize(entry) {
  // The last size in the row stays: an empty overview is just a grey pane.
  if (!entry.hidden && shown().length === 1) {
    return;
  }

  entry.hidden = !entry.hidden;
  entry.item.hidden = entry.hidden;

  if (entry.hidden) {
    hiddenSizes.add(entry.spec.handle);
    entry.unbind?.();
    entry.unbind = null;
    entry.ready = false;
    entry.stale = false;
    entry.src = '';
    entry.el.src = 'about:blank';
  } else {
    hiddenSizes.delete(entry.spec.handle);
    navigate(entry, overviewState.preview);
  }

  applyZoom(overviewState.zoom);
  paintBadges();
}

/** A frame still loading would miss the message: it gets the newest URL when it has loaded. */
function post(entry, preview) {
  if (entry.hidden) {
    return;
  }

  if (!entry.ready) {
    entry.stale = true;

    return;
  }

  const url = frameUrl(entry, preview);

  try {
    entry.el.contentWindow?.postMessage({ name: 'statamic.preview.updated', url }, new URL(url).origin);
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
  entry.unbind?.();

  // A new document is a new window: its own morphs say when to measure again.
  const onUpdated = () => measure(entry);

  frameWin.addEventListener('statamic:preview-updated', onUpdated);
  entry.unbind = () => frameWin.removeEventListener('statamic:preview-updated', onUpdated);
  measure(entry);

  if (entry.stale) {
    entry.stale = false;
    post(entry, overviewState.preview);
  }
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

/** The preview morphed: send the frames the same update. */
function forward() {
  const { win, main } = overviewState;
  const preview = ask('lp:lastPreviewUrl') || documentHref(main);

  if (!viewUrl(preview, win.location.href)) {
    return;
  }

  overviewState.preview = preview;
  overviewState.frames.forEach((entry) => post(entry, preview));
}

function bindMain(main) {
  overviewState.unbindMain?.();
  overviewState.unbindMain = null;
  overviewState.main = main;

  const mainWin = main?.contentWindow;

  if (!mainWin) {
    return;
  }

  mainWin.addEventListener('statamic:preview-updated', forward);
  overviewState.unbindMain = () => mainWin.removeEventListener('statamic:preview-updated', forward);
}

// --- Binding ---------------------------------------------------------------------------

function bind(win, view) {
  const { contents, scroller, frames } = overviewState;

  for (const entry of frames) {
    listen(entry.el, 'load', () => frameLoaded(entry));
    overviewState.cleanups.push(() => entry.unbind?.());
  }

  bindMain(overviewState.main);
  overviewState.cleanups.push(() => overviewState.unbindMain?.());

  // The preview loaded a document: another page, or Statamic swapped in a new
  // iframe (it does when the URL changes). Its window is new either way — bind
  // again, and send the frames there. `load` does not bubble; capture sees it.
  listen(
    contents,
    'load',
    (event) => {
      const main = previewFrame(win.document);

      if (!main || event.target !== main) {
        return;
      }

      bindMain(main);

      const preview = documentHref(main) || ask('lp:lastPreviewUrl');

      if (!viewUrl(preview, win.location.href)) {
        return;
      }

      overviewState.preview = preview;

      for (const entry of shown()) {
        if (entry.src === frameUrl(entry, preview)) {
          post(entry, preview);
        } else {
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
    paintButton(win, true);
  });

  observer.observe(contents);
  overviewState.cleanups.push(() => observer.disconnect());

  const onKey = (event) => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      closeBreakpointOverview(win);
    }
  };

  [...new Set([view, win])].forEach((target) => listen(target, 'keydown', onKey));

  // The size the fields on the left are editing; the ring follows it.
  listen(win, 'sve:breakpoint', (event) => paintActive(event.detail?.bp));

  listen(scroller, 'wheel', onWheel, { passive: false });
  listen(scroller, 'pointerdown', onPanStart);
  listen(scroller, 'pointermove', onPanMove);
  listen(scroller, 'pointerup', onPanEnd);
  listen(scroller, 'pointercancel', onPanEnd);
}

/** Ctrl/Cmd + wheel and trackpad pinch zoom around the pointer; a plain wheel scrolls. */
function onWheel(event) {
  if (!event.ctrlKey && !event.metaKey) {
    return;
  }

  event.preventDefault();

  const { scroller, zoom } = overviewState;
  const rect = scroller.getBoundingClientRect();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1;

  setZoom(zoom * Math.exp(-event.deltaY * unit * 0.0015), { x: event.clientX - rect.left, y: event.clientY - rect.top });
}

function onPanStart(event) {
  const { scroller } = overviewState;
  const rect = scroller.getBoundingClientRect();

  // Not on a scrollbar: those keep working as scrollbars.
  if (event.button !== 0 || event.clientX - rect.left >= scroller.clientWidth || event.clientY - rect.top >= scroller.clientHeight) {
    return;
  }

  event.preventDefault();
  overviewState.pan = { id: event.pointerId, x: event.clientX, y: event.clientY };
  scroller.setPointerCapture(event.pointerId);
  scroller.dataset.panning = '';
}

function onPanMove(event) {
  const { pan, scroller } = overviewState;

  if (!pan || pan.id !== event.pointerId) {
    return;
  }

  scroller.scrollLeft -= event.clientX - pan.x;
  scroller.scrollTop -= event.clientY - pan.y;
  pan.x = event.clientX;
  pan.y = event.clientY;
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

/**
 * A mark on each size's top-bar button, at the icon's top-right corner: filled
 * in the icons' own resting grey, the size is in the row; a fainter ring, it is
 * out. A knock-out ring in the group's own colour keeps it clear of a lit
 * (purple) button. Clicking the mark switches the size and only that; the
 * button's click, which changes the size the fields edit, never sees it.
 *
 * The marks sit in the size group beside the buttons, not inside them: a button
 * at rest is drawn at 70% opacity and the lit one at 100%, and a mark inside
 * would take that on — grey on one button, white on the other. The group is
 * made their anchor for the while; its style is put back on close.
 */
function mountBadges(win) {
  const group = win.document.getElementById(LP_PREVIEW_CHROME_ID)?.querySelector('[data-sve-devices]');

  if (!group) {
    return;
  }

  const view = group.ownerDocument.defaultView;
  const knock = knockoutColor(view.getComputedStyle(group).backgroundColor, paneBackground(view, group.parentElement));
  const position = group.style.getPropertyValue('position');

  group.style.setProperty('position', 'relative');
  overviewState.cleanups.push(() => {
    if (position) {
      group.style.setProperty('position', position);
    } else {
      group.style.removeProperty('position');
    }
  });

  for (const entry of overviewState.frames) {
    const btn = group.querySelector(`[data-device="${win.CSS.escape(entry.spec.device)}"]`);

    if (!btn) {
      continue;
    }

    const badge = group.ownerDocument.createElement('span');

    badge.className = 'sve-bpo-badge';
    badge.dataset.bpoBadge = entry.spec.handle;
    badge.setAttribute('role', 'switch');
    badge.title = t(win, 'bp_overview_toggle', { size: entry.spec.label });
    badge.style.setProperty('--sve-bpo-knock', knock);
    // Centred on the measured point, whatever the mark's own size in rem.
    badge.style.left = `calc(${btn.offsetLeft + MARK_CENTER_X}px - .1875rem)`;
    badge.style.top = `calc(${btn.offsetTop}px - .1875rem)`;
    group.appendChild(badge);

    listen(badge, 'click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      toggleSize(entry);
    });

    overviewState.cleanups.push(() => badge.remove());
    entry.badge = badge;
  }

  paintBadges();
}

function paintBadges() {
  for (const entry of overviewState.frames) {
    const { badge } = entry;

    if (!badge) {
      continue;
    }

    const on = !entry.hidden;

    if (badge.hasAttribute('data-on') !== on) {
      badge.toggleAttribute('data-on', on);
    }

    if (badge.getAttribute('aria-checked') !== String(on)) {
      badge.setAttribute('aria-checked', String(on));
    }
  }
}

/** The ring: which size the Responsive fields on the left are editing. */
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
