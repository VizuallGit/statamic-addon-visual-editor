/**
 * Settings toggle: `xray`
 * X-ray: grid, subgrid, flex and box outlines drawn over Live Preview.
 *
 * A switch in the top bar, like AI text: on, the section being edited shows
 * its grid tracks (numbered lines, hatched gaps, empty cells), its flex rows
 * and — on request — every box, the way browser DevTools draw them, while the
 * dock is typing into it. A small bar over the bottom of the preview picks the
 * layers and whether it is the section or the whole page.
 *
 * Loaded only when the switch is first turned on (lazy-panels.js, key `xray`),
 * reached by eager code through lazy/xray.js. It reads the preview document
 * across the frame the way the accessibility tabs do and draws on one canvas it
 * owns there; it never writes to the page, sends no bus or postMessage, and no
 * kernel file knows it exists. Turned off, every node and listener it added is
 * gone again.
 *
 * May import: lib/*, cp/xray/*, lp-panel.js (the toolbar's painter).
 */
import { t } from './lib/i18n.js';
import { previewFrame } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';
import { HEADER_TOOLBAR_ID, LP_PRIMARY_FLAT } from './lib/ids.js';
import { paintLpActiveControl } from './lp-panel.js';
import { XRAY_LAYERS, readXrayPrefs, writeXrayPrefs, xrayAllowed } from './cp/xray/prefs.js';
import { isEditorNode, measureBoxModel, measureFlex, measureGrid, outermostSid, scanScope } from './cp/xray/scan.js';
import { drawXray, resetPatterns } from './cp/xray/draw.js';

export { xrayAllowed };

const CANVAS_ID = '__sve-xray-canvas';
const BAR_ID = '__sve-xray-bar';
const STYLE_ID = '__sve-xray-style';

/**
 * A burst of mutations (a morph, Alpine starting up, a slider) is one rescan:
 * the walk asks every element in scope its `display`, which is the one part
 * worth not doing sixty times a second. Drawing still happens every frame.
 */
const RESCAN_MS = 120;

const live = {
  win: null,
  frame: null,
  doc: null,
  pwin: null,
  canvas: null,
  ctx: null,
  observer: null,
  resize: null,
  frameResize: null,
  off: [],
  raf: 0,
  rescanTimer: 0,
  lastScan: 0,
  scanDue: true,
  found: { grids: [], flexes: [], boxes: [] },
  /** The element under the mouse in the preview, and the section it is in. */
  hoverEl: null,
  hoverSection: null,
};

// --- The switch ------------------------------------------------------------

export function isXrayOn(win) {
  return readXrayPrefs(win).on;
}

export function toggleXray(win) {
  setXray(win, !isXrayOn(win));
}

export function setXray(win, on) {
  writeXrayPrefs(win, { ...readXrayPrefs(win), on: !!on });

  if (on) {
    syncXrayToPreview(win);
  } else {
    teardown();
  }

  paintToolbarButton(win);
}

function paintToolbarButton(win) {
  const btn = win.document.querySelector(`#${HEADER_TOOLBAR_ID} button[data-tab="xray"]`);

  if (btn) {
    paintLpActiveControl(btn, isXrayOn(win));
  }
}

/**
 * Put the drawing on the preview that is on screen now.
 *
 * Called by the top bar's pass (it runs on every Control Panel re-render), so a
 * preview that was swapped for a new document, or a Live Preview opened again,
 * picks the drawing up without anybody remembering to ask.
 */
export function syncXrayToPreview(win) {
  if (!xrayAllowed(win) || !isXrayOn(win)) {
    teardown();

    return;
  }

  live.win = win;

  const frame = previewFrame(win);
  let doc = null;

  try {
    doc = frame?.contentDocument || null;
  } catch {
    doc = null;
  }

  if (!frame || !doc?.body) {
    teardown();

    return;
  }

  if (live.doc !== doc || live.frame !== frame || !live.canvas?.isConnected) {
    attach(win, frame, doc);
  }

  ensureBar(win);
  placeBar();
}

// --- Into the preview and out again ----------------------------------------

function listen(target, type, fn, opts) {
  target.addEventListener(type, fn, opts);
  live.off.push(() => target.removeEventListener(type, fn, opts));
}

function detachPreview() {
  live.off.splice(0).forEach((undo) => {
    try {
      undo();
    } catch {
      /* the document went with its window */
    }
  });
  live.observer?.disconnect();
  live.resize?.disconnect();
  live.frameResize?.disconnect();
  live.observer = live.resize = live.frameResize = null;

  if (live.raf && live.pwin) {
    try {
      live.pwin.cancelAnimationFrame(live.raf);
    } catch {
      /* closed */
    }
  }

  clearTimeout(live.rescanTimer);
  live.raf = 0;
  live.rescanTimer = 0;
  live.canvas?.remove();
  live.canvas = live.ctx = null;
  live.doc = live.pwin = live.frame = null;
  live.hoverEl = live.hoverSection = null;
  live.found = { grids: [], flexes: [], boxes: [] };
}

function teardown() {
  detachPreview();

  const doc = live.win?.document;

  doc?.getElementById(BAR_ID)?.remove();
  doc?.getElementById(STYLE_ID)?.remove();
}

function attach(win, frame, doc) {
  detachPreview();

  live.frame = frame;
  live.doc = doc;
  live.pwin = doc.defaultView;
  resetPatterns();
  ensureCanvas();

  const pwin = live.pwin;

  // Anything that changes the page — a morph, an Instant paint, a class from
  // the dock, the CSS pane's live <style> — is a mutation somewhere under
  // <html>. The canvas's own size attributes are the one change to ignore.
  live.observer = new pwin.MutationObserver((records) => {
    const page = records.filter((record) => record.target !== live.canvas);

    if (!page.length) {
      return;
    }

    // The bridge marks the element under the mouse with data-sid-hover on
    // every move. That changes no layout: redraw (the hover highlight), but
    // do not walk the page again for it.
    schedule(page.some((record) => record.attributeName !== 'data-sid-hover'));
  });
  live.observer.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });

  live.resize = new pwin.ResizeObserver(() => schedule(false));
  live.resize.observe(doc.documentElement);

  // The bar sits over the frame in the Control Panel's own window; it moves
  // when a dock opens or the breakpoint changes the frame's width.
  live.frameResize = new win.ResizeObserver(() => {
    if (!live.frame?.isConnected) {
      teardown();

      return;
    }

    placeBar();
    schedule(false);
  });
  live.frameResize.observe(frame);

  listen(pwin, 'resize', () => schedule(false));
  listen(doc, 'scroll', () => schedule(false), { capture: true, passive: true });
  listen(doc, 'mousemove', onMove, { capture: true, passive: true });
  listen(doc.documentElement, 'mouseleave', () => {
    live.hoverEl = null;
    schedule(false);
  });
  // A navigation in the frame is a new document: follow it.
  listen(frame, 'load', () => syncXrayToPreview(win));
  listen(win, 'resize', placeBar);

  schedule(true);
}

function ensureCanvas() {
  const doc = live.doc;
  let canvas = doc.getElementById(CANVAS_ID);

  if (!canvas) {
    canvas = doc.createElement('canvas');
    canvas.id = CANVAS_ID;
    canvas.setAttribute('aria-hidden', 'true');
    // Over everything the site can stack, under nothing that takes a click:
    // pointer-events none means the page and the editor's own controls get
    // every mouse event exactly as before.
    canvas.style.cssText =
      'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483000;margin:0;padding:0;border:0;background:transparent;';
  }

  // A morph may rebuild <body>; the canvas goes back where it was.
  if (canvas.parentNode !== doc.body) {
    doc.body.appendChild(canvas);
  }

  live.canvas = canvas;
  live.ctx = canvas.getContext('2d');
}

function onMove(e) {
  let el = e.target;

  if (isEditorNode(el)) {
    // The bridge's own toolbars sit on top of the page: look under them.
    el = live.doc.elementsFromPoint(e.clientX, e.clientY).find((hit) => !isEditorNode(hit)) || null;
  }

  if (el === live.hoverEl) {
    return;
  }

  live.hoverEl = el;

  const section = outermostSid(el);

  if (section && section !== live.hoverSection) {
    live.hoverSection = section;

    if (readXrayPrefs(live.win).scope === 'section' && !activeSection()) {
      schedule(true);
    }
  }

  schedule(false);
}

// --- Frames ----------------------------------------------------------------

function schedule(rescan) {
  if (rescan) {
    live.scanDue = true;
  }

  if (!live.raf && live.pwin) {
    live.raf = live.pwin.requestAnimationFrame(tick);
  }
}

/** The section being edited: the one the editor marked active, else the one under the mouse. */
function activeSection() {
  const active = live.doc?.querySelector('[data-sid-active]');

  return active ? outermostSid(active) : null;
}

function scopeRoots(prefs) {
  if (prefs.scope === 'section') {
    const section = activeSection() || (live.hoverSection?.isConnected ? live.hoverSection : null);

    if (section) {
      return [section];
    }
  }

  return [live.doc.body];
}

function tick() {
  live.raf = 0;

  if (!live.doc || !live.frame?.isConnected) {
    teardown();

    return;
  }

  if (!live.canvas?.isConnected) {
    ensureCanvas();
  }

  const prefs = readXrayPrefs(live.win);

  if (live.scanDue) {
    const wait = RESCAN_MS - (performance.now() - live.lastScan);

    if (wait > 0) {
      // Draw now with what we know; the rescan comes when the burst is over.
      clearTimeout(live.rescanTimer);
      live.rescanTimer = setTimeout(() => schedule(true), wait);
    } else {
      live.scanDue = false;
      live.lastScan = performance.now();
      live.found = scanScope(live.pwin, scopeRoots(prefs), prefs);
    }
  }

  draw(prefs);
}

function draw(prefs) {
  const { pwin, canvas, ctx, doc } = live;
  const dpr = pwin.devicePixelRatio || 1;
  // clientWidth leaves the page's scrollbar uncovered.
  const w = doc.documentElement.clientWidth || pwin.innerWidth;
  const h = pwin.innerHeight;

  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }

  // Only what is on screen is measured: on a long page in "whole page" most
  // containers are scrolled away, and measuring one reads every child's box.
  // The margin keeps a grid whose labels hang above the fold drawn.
  const onScreen = (el) => {
    if (!el.isConnected) {
      return false;
    }

    const r = el.getBoundingClientRect();

    return r.bottom > -40 && r.top < h + 40 && r.right > -40 && r.left < w + 40;
  };
  const measured = new Map();
  const grids = prefs.grid
    ? live.found.grids.filter(onScreen).map((el) => measureGrid(pwin, el, measured)).filter(Boolean)
    : [];
  const flexes = prefs.flex ? live.found.flexes.filter(onScreen).map((el) => measureFlex(pwin, el)).filter(Boolean) : [];
  const hover = hoverTarget(grids);
  const hoverEl = live.hoverEl?.isConnected && !isEditorNode(live.hoverEl) ? live.hoverEl : null;

  drawXray(
    ctx,
    { w, h, dpr },
    {
      grids,
      flexes,
      boxes: prefs.boxes ? live.found.boxes : [],
      boxModel: prefs.boxes && hoverEl ? measureBoxModel(pwin, hoverEl) : null,
    },
    { layers: prefs, hover, words: words(live.win) },
  );
}

/**
 * Which grid the mouse is in, and which of its items: the nearest grid above
 * the hovered element, and the child of that grid the element sits in.
 */
function hoverTarget(grids) {
  let el = live.hoverEl;

  if (!el?.isConnected) {
    return null;
  }

  const byEl = new Map(grids.map((grid) => [grid.el, grid]));

  while (el && el !== live.doc.body) {
    const parent = el.parentElement;

    if (byEl.has(el)) {
      return { grid: el, item: null };
    }

    if (parent && byEl.has(parent)) {
      return { grid: parent, item: el };
    }

    el = parent;
  }

  return null;
}

let cachedWords = null;

function words(win) {
  if (!cachedWords) {
    cachedWords = {
      col: t(win, 'xray_col'),
      row: t(win, 'xray_row'),
      grid: 'grid',
      subgridCols: t(win, 'xray_subgrid_cols'),
      subgridRows: t(win, 'xray_subgrid_rows'),
    };
  }

  return cachedWords;
}

// --- The layer bar ---------------------------------------------------------

const BAR_CSS = `
#${BAR_ID} {
  position: fixed;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  gap: .25rem;
  padding: .25rem;
  border-radius: 999rem;
  background: rgba(24, 24, 27, .92);
  backdrop-filter: blur(.375rem);
  box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .25);
  color: #fff;
  font: 600 .75rem/1 system-ui, -apple-system, "Segoe UI", sans-serif;
  transform: translateX(-50%);
  white-space: nowrap;
  user-select: none;
}
#${BAR_ID}[hidden] { display: none; }
#${BAR_ID} [data-sve-xray-title] {
  padding: 0 .5rem 0 .625rem;
  opacity: .7;
  letter-spacing: .02em;
}
#${BAR_ID} button {
  appearance: none;
  border: 0;
  margin: 0;
  padding: .375rem .625rem;
  border-radius: 999rem;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  opacity: .65;
}
#${BAR_ID} button:hover { opacity: 1; background: rgba(255, 255, 255, .08); }
#${BAR_ID} button[aria-pressed="true"] { opacity: 1; background: ${LP_PRIMARY_FLAT}; }
#${BAR_ID} [data-sve-xray-sep] {
  width: 1px;
  align-self: stretch;
  margin: .25rem .125rem;
  background: rgba(255, 255, 255, .18);
}
`;

function ensureBar(win) {
  const doc = win.document;

  injectStyle(doc, STYLE_ID, BAR_CSS);

  let bar = doc.getElementById(BAR_ID);

  if (!bar) {
    bar = doc.createElement('div');
    bar.id = BAR_ID;
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', t(win, 'xray'));

    const title = doc.createElement('span');

    title.dataset.sveXrayTitle = '';
    title.textContent = t(win, 'xray');
    bar.appendChild(title);

    for (const layer of XRAY_LAYERS) {
      bar.appendChild(barButton(win, `layer:${layer}`, t(win, `xray_${layer}`)));
    }

    const sep = doc.createElement('span');

    sep.dataset.sveXraySep = '';
    bar.appendChild(sep);
    bar.appendChild(barButton(win, 'scope:section', t(win, 'xray_scope_section')));
    bar.appendChild(barButton(win, 'scope:page', t(win, 'xray_scope_page')));
    // Appended to <body>, never inside Live Preview's own markup: Statamic
    // re-renders that, and its stacking contexts would trap a fixed element.
    doc.body.appendChild(bar);
  }

  paintBar(win);
}

function barButton(win, action, label) {
  const btn = win.document.createElement('button');

  btn.type = 'button';
  btn.dataset.sveXray = action;
  btn.textContent = label;
  btn.addEventListener('click', () => {
    const prefs = readXrayPrefs(win);
    const [kind, value] = action.split(':');

    if (kind === 'layer') {
      prefs[value] = !prefs[value];
    } else {
      prefs.scope = value;
    }

    writeXrayPrefs(win, prefs);
    paintBar(win);
    schedule(true);
  });

  return btn;
}

function paintBar(win) {
  const prefs = readXrayPrefs(win);

  win.document.querySelectorAll(`#${BAR_ID} button[data-sve-xray]`).forEach((btn) => {
    const [kind, value] = btn.dataset.sveXray.split(':');
    const on = kind === 'layer' ? !!prefs[value] : prefs.scope === value;

    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

/** Bottom centre of the preview frame, in the Control Panel window's coordinates. */
function placeBar() {
  const win = live.win;
  const bar = win?.document.getElementById(BAR_ID);
  const frame = live.frame;

  if (!bar) {
    return;
  }

  if (!frame?.isConnected) {
    bar.hidden = true;

    return;
  }

  const rect = frame.getBoundingClientRect();
  let dx = 0;
  let dy = 0;

  // The preview can sit one frame further in (the Control Panel inside the
  // overlay): add the offset of the frame that holds it.
  const host = frame.ownerDocument.defaultView;

  if (host && host !== win) {
    try {
      const outer = host.frameElement?.getBoundingClientRect();

      dx = outer?.left || 0;
      dy = outer?.top || 0;
    } catch {
      /* cross-origin — never the case for Live Preview */
    }
  }

  if (rect.width < 1 || rect.height < 1) {
    bar.hidden = true;

    return;
  }

  // Shown before it is measured: a hidden bar is 0 high and would sit too low.
  bar.hidden = false;
  bar.style.left = `${Math.round(dx + rect.left + rect.width / 2)}px`;
  bar.style.top = `${Math.round(dy + rect.bottom - bar.offsetHeight - 12)}px`;
}
