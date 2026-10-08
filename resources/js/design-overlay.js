/**
 * Settings toggle: `design_overlay`
 * Design overlay: a designer's screenshot laid over Live Preview.
 *
 * A switch in the top bar. On, the page's design for the screen size the
 * preview is showing — Desktop, Tablet or Mobile, one image each, uploaded per
 * page — lies over the page at the preview's width, with its own opacity and a
 * difference view (what matches goes black, what differs lights up). A size
 * with no image shows nothing: a phone design is not the desktop one shrunk.
 * A small bar over the top of the preview picks, uploads and removes them;
 * an image dropped on the bar goes to the size on screen.
 *
 * Loaded only when the switch is first turned on (lazy-panels.js, key
 * `design_overlay`), reached by eager code through lazy/design-overlay.js. The
 * image is one `<img>` it owns in the preview document, outside <body> so a
 * morph never meets it; nothing on the page is changed, no kernel file knows
 * about it, and turned off every node and listener it added is gone again.
 * Files live on the server (DesignOverlayController, /!/sve/design-overlay).
 *
 * May import: lib/*, cp/design/*, breakpoints.js, lp-panel.js (the toolbar's painter).
 */
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';
import { previewFrame } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';
import { currentEntryId } from './lib/live-preview.js';
import { HEADER_TOOLBAR_ID, LP_PRIMARY_FLAT } from './lib/ids.js';
import { paintLpActiveControl } from './lp-panel.js';
import { bpFromWidth, breakpoints } from './breakpoints.js';
import { designAllowed, fitWidth, readDesignPrefs, writeDesignPrefs } from './cp/design/prefs.js';

export { designAllowed };

const IMG_ID = '__sve-design-overlay';
const BAR_ID = '__sve-design-bar';
const STYLE_ID = '__sve-design-style';

/**
 * The addon takes 20 MB, but PHP's own default is 2 MB and not every server
 * raises it. Anything over 1.5 MB is drawn down to a JPEG in the browser first
 * — through 50 % opacity nobody sees the difference — so an upload works on a
 * server nobody has tuned.
 */
const MAX_BYTES = 20 * 1024 * 1024;
const REENCODE_BYTES = 1.5 * 1024 * 1024;

const live = {
  win: null,
  frame: null,
  doc: null,
  pwin: null,
  off: [],
  frameResize: null,
  entry: null,
  /** `{ laptop: { url, width, height, version } | null, … }` for this page, from the server. */
  listing: null,
  /** The size the file picker is choosing for. */
  target: null,
  busy: false,
  status: '',
};

// --- The switch ------------------------------------------------------------

export function isDesignOn(win) {
  return readDesignPrefs(win).on;
}

export function toggleDesign(win) {
  setDesign(win, !isDesignOn(win));
}

export function setDesign(win, on) {
  writeDesignPrefs(win, { ...readDesignPrefs(win), on: !!on });

  if (on) {
    syncDesignToPreview(win);
  } else {
    teardown();
  }

  paintToolbarButton(win);
}

function paintToolbarButton(win) {
  const btn = win.document.querySelector(`#${HEADER_TOOLBAR_ID} button[data-tab="design_overlay"]`);

  if (btn) {
    paintLpActiveControl(btn, isDesignOn(win));
  }
}

/**
 * Put the overlay on the preview that is on screen now, for the page being
 * edited. Called by the top bar's pass on every Control Panel re-render.
 */
export function syncDesignToPreview(win) {
  if (!designAllowed(win) || !isDesignOn(win)) {
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

  if (!frame || !doc?.documentElement) {
    teardown();

    return;
  }

  if (live.doc !== doc || live.frame !== frame) {
    attach(win, frame, doc);
  }

  const entry = currentEntryId(win);

  if (entry !== live.entry) {
    live.entry = entry;
    live.listing = null;
    live.status = '';

    if (entry) {
      void load(win, entry);
    }
  }

  ensureBar(win);
  paint();
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
  live.frameResize?.disconnect();
  live.frameResize = null;
  live.doc?.getElementById(IMG_ID)?.remove();
  live.doc = live.pwin = live.frame = null;
}

function teardown() {
  detachPreview();

  const doc = live.win?.document;

  doc?.getElementById(BAR_ID)?.remove();
  doc?.getElementById(STYLE_ID)?.remove();
  live.entry = null;
  live.listing = null;
  live.status = '';
}

function attach(win, frame, doc) {
  detachPreview();

  live.frame = frame;
  live.doc = doc;
  live.pwin = doc.defaultView;

  // A new width can be a new size, and every size has its own image.
  listen(live.pwin, 'resize', paint);

  live.frameResize = new win.ResizeObserver(() => {
    if (!live.frame?.isConnected) {
      teardown();

      return;
    }

    placeBar();
    paint();
  });
  live.frameResize.observe(frame);

  listen(frame, 'load', () => syncDesignToPreview(win));
  listen(win, 'resize', placeBar);
}

/** The size the preview is showing, by its width — the same rule the rest of the editor uses. */
function currentSize() {
  return live.doc ? bpFromWidth(live.doc.documentElement.clientWidth, live.win) : null;
}

// --- The image -------------------------------------------------------------

function paint() {
  paintImage();
  paintBar();
}

function paintImage() {
  const doc = live.doc;

  if (!doc) {
    return;
  }

  const prefs = readDesignPrefs(live.win);
  const slot = live.listing?.[currentSize()] || null;
  let img = doc.getElementById(IMG_ID);

  if (!slot) {
    img?.remove();

    return;
  }

  if (!img) {
    img = doc.createElement('img');
    img.id = IMG_ID;
    img.alt = '';
    img.decoding = 'async';
    img.setAttribute('aria-hidden', 'true');
    // At the document's origin and as wide as the page, so it scrolls with the
    // page the way the design does. Under X-ray's lines, over everything else,
    // and never in the way of a click.
    img.style.cssText =
      'position:absolute;left:0;top:0;height:auto;max-width:none;margin:0;padding:0;border:0;pointer-events:none;z-index:2147482990;';
  }

  // Outside <body>: a morph rebuilds the body, never the root's other children.
  if (img.parentNode !== doc.documentElement) {
    doc.documentElement.appendChild(img);
  }

  if (img.getAttribute('src') !== slot.url) {
    img.setAttribute('src', slot.url);
  }

  const width = `${doc.documentElement.clientWidth}px`;
  const opacity = String(prefs.opacity / 100);
  const blend = prefs.diff ? 'difference' : 'normal';

  if (img.style.width !== width) {
    img.style.width = width;
  }

  if (img.style.opacity !== opacity) {
    img.style.opacity = opacity;
  }

  if (img.style.mixBlendMode !== blend) {
    img.style.mixBlendMode = blend;
  }
}

// --- The server ------------------------------------------------------------

function endpoint(entry, size = '') {
  return `/!/sve/design-overlay/${encodeURIComponent(entry)}${size ? `/${encodeURIComponent(size)}` : ''}`;
}

async function request(win, url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      Accept: 'application/json',
      'X-CSRF-TOKEN': csrfToken(win),
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // 413 comes from the web server or PHP before Laravel answers: no JSON, just "too large".
    throw new Error(response.status === 413 ? t(win, 'design_too_big') : data.message || t(win, 'design_failed'));
  }

  return data;
}

async function load(win, entry) {
  try {
    const data = await request(win, endpoint(entry));

    // The page may have changed while this was on its way.
    if (live.entry === entry) {
      live.listing = data.overlays || {};
    }
  } catch (err) {
    if (live.entry === entry) {
      live.status = err.message;
    }
  }

  paint();
}

/**
 * The file as it should travel: as picked, unless it is wider than 3000 px or
 * heavier than REENCODE_BYTES — then drawn down and sent as a JPEG. A design
 * screenshot is looked at through 50 % opacity; the last few percent of
 * quality are not worth a refused upload.
 */
async function prepare(win, file) {
  let bitmap = null;

  try {
    bitmap = await win.createImageBitmap(file);
  } catch {
    return file;
  }

  const fit = fitWidth(bitmap.width, bitmap.height);

  if (!fit.scaled && file.size <= REENCODE_BYTES) {
    bitmap.close?.();

    return file;
  }

  const canvas = win.document.createElement('canvas');

  canvas.width = fit.width;
  canvas.height = fit.height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, fit.width, fit.height);
  bitmap.close?.();

  // null when the canvas is past what the browser will encode (a very tall page in Safari).
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));

  return blob ? new win.File([blob], 'design.jpg', { type: 'image/jpeg' }) : file;
}

async function upload(win, size, file) {
  const entry = live.entry;

  if (!entry || !file) {
    return;
  }

  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    live.status = t(win, 'design_wrong_type');
    paint();

    return;
  }

  live.busy = true;
  live.status = t(win, 'design_uploading');
  paint();

  try {
    const sending = await prepare(win, file);

    if (sending.size > MAX_BYTES) {
      throw new Error(t(win, 'design_too_big'));
    }

    const form = new FormData();

    form.append('file', sending, sending.name || file.name);

    const data = await request(win, endpoint(entry, size), { method: 'POST', body: form });

    if (live.entry === entry) {
      live.listing = data.overlays || {};
      live.status = '';
    }
  } catch (err) {
    live.status = err.message || t(win, 'design_failed');
  } finally {
    live.busy = false;
    paint();
  }
}

async function remove(win, size) {
  const entry = live.entry;
  const label = sizeLabel(win, size);

  if (!entry || !live.listing?.[size] || !win.confirm(t(win, 'design_remove_confirm', { size: label }))) {
    return;
  }

  live.busy = true;
  paint();

  try {
    const data = await request(win, endpoint(entry, size), { method: 'DELETE' });

    if (live.entry === entry) {
      live.listing = data.overlays || {};
      live.status = '';
    }
  } catch (err) {
    live.status = err.message;
  } finally {
    live.busy = false;
    paint();
  }
}

// --- The bar ---------------------------------------------------------------

function sizeLabel(win, handle) {
  return breakpoints(win).find((row) => row.handle === handle)?.label || handle;
}

const BAR_CSS = `
#${BAR_ID} {
  position: fixed;
  z-index: 2147483000;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: .25rem;
  width: max-content;
  max-width: calc(100vw - 2rem);
  padding: .25rem;
  border-radius: 1.25rem;
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
#${BAR_ID}[data-drop] { box-shadow: 0 0 0 .125rem ${LP_PRIMARY_FLAT}, 0 .25rem 1rem rgba(0, 0, 0, .25); }
#${BAR_ID} [data-sve-design-title] { padding: 0 .5rem 0 .625rem; opacity: .7; letter-spacing: .02em; }
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
#${BAR_ID} button:hover:not(:disabled) { opacity: 1; background: rgba(255, 255, 255, .08); }
#${BAR_ID} button:disabled { cursor: default; opacity: .3; }
#${BAR_ID} button[aria-pressed="true"] { opacity: 1; background: ${LP_PRIMARY_FLAT}; }
#${BAR_ID} button[data-sve-design-size][aria-current="true"] { opacity: 1; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .55); }
#${BAR_ID} button[data-sve-design-size] [data-mark] { margin-left: .3rem; opacity: .7; }
#${BAR_ID} [data-sve-design-opacity] { display: inline-flex; align-items: center; gap: .375rem; padding: 0 .5rem; }
#${BAR_ID} input[type="range"] { width: 6rem; accent-color: ${LP_PRIMARY_FLAT}; margin: 0; }
#${BAR_ID} output { min-width: 2.25rem; text-align: right; opacity: .8; font-variant-numeric: tabular-nums; }
#${BAR_ID} [data-sve-design-sep] { width: 1px; align-self: stretch; margin: .25rem .125rem; background: rgba(255, 255, 255, .18); }
#${BAR_ID} [data-sve-design-status] { padding: 0 .625rem; font-weight: 500; opacity: .8; }
#${BAR_ID} [data-sve-design-status]:empty { display: none; }
`;

function ensureBar(win) {
  const doc = win.document;

  injectStyle(doc, STYLE_ID, BAR_CSS);

  let bar = doc.getElementById(BAR_ID);

  if (bar) {
    return;
  }

  bar = doc.createElement('div');
  bar.id = BAR_ID;
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', t(win, 'design_overlay'));

  const add = (tag, attrs = {}, text = '') => {
    const el = doc.createElement(tag);

    Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
    el.textContent = text;
    bar.appendChild(el);

    return el;
  };
  const sep = () => add('span', { 'data-sve-design-sep': '' });

  add('span', { 'data-sve-design-title': '' }, t(win, 'design_overlay'));

  for (const row of breakpoints(win)) {
    const btn = add('button', { type: 'button', 'data-sve-design-size': row.handle });

    btn.addEventListener('click', () => {
      live.target = row.handle;
      file.click();
    });
  }

  sep();

  const range = doc.createElement('label');

  range.setAttribute('data-sve-design-opacity', '');
  range.title = t(win, 'design_opacity');
  range.innerHTML = '<input type="range" min="0" max="100" step="5"><output></output>';
  bar.appendChild(range);
  range.querySelector('input').addEventListener('input', (e) => {
    writeDesignPrefs(win, { ...readDesignPrefs(win), opacity: Number(e.target.value) });
    paint();
  });

  add('button', { type: 'button', 'data-sve-design': 'diff', title: t(win, 'design_diff_tip') }, t(win, 'design_diff')).addEventListener(
    'click',
    () => {
      const prefs = readDesignPrefs(win);

      writeDesignPrefs(win, { ...prefs, diff: !prefs.diff });
      paint();
    },
  );
  add('button', { type: 'button', 'data-sve-design': 'remove' }, t(win, 'design_remove')).addEventListener('click', () => {
    void remove(win, currentSize());
  });
  add('span', { 'data-sve-design-status': '', role: 'status' });

  const file = add('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', hidden: '' });

  file.addEventListener('change', () => {
    const picked = file.files?.[0];

    file.value = '';
    void upload(win, live.target || currentSize(), picked);
  });

  // An image dragged onto the bar goes to the size on screen.
  bar.addEventListener('dragover', (e) => {
    if ([...(e.dataTransfer?.types || [])].includes('Files')) {
      e.preventDefault();
      bar.dataset.drop = '';
    }
  });
  bar.addEventListener('dragleave', () => delete bar.dataset.drop);
  bar.addEventListener('drop', (e) => {
    e.preventDefault();
    delete bar.dataset.drop;
    void upload(win, currentSize(), e.dataTransfer?.files?.[0]);
  });

  // Appended to <body>, never inside Live Preview's own markup: Statamic
  // re-renders that, and its stacking contexts would trap a fixed element.
  doc.body.appendChild(bar);
}

function paintBar() {
  const win = live.win;
  const bar = win?.document.getElementById(BAR_ID);

  if (!bar) {
    return;
  }

  const prefs = readDesignPrefs(win);
  const size = currentSize();
  const noEntry = !live.entry;

  bar.querySelectorAll('button[data-sve-design-size]').forEach((btn) => {
    const handle = btn.dataset.sveDesignSize;
    const has = !!live.listing?.[handle];
    const label = sizeLabel(win, handle);
    const text = `${label}<span data-mark>${has ? '✓' : '+'}</span>`;

    if (btn.innerHTML !== text) {
      btn.innerHTML = text;
    }

    btn.setAttribute('aria-current', handle === size ? 'true' : 'false');
    btn.title = t(win, has ? 'design_replace_for' : 'design_upload_for', { size: label });
    btn.disabled = noEntry || live.busy;
  });

  const range = bar.querySelector('[data-sve-design-opacity] input');

  if (range && win.document.activeElement !== range) {
    range.value = String(prefs.opacity);
  }

  bar.querySelector('[data-sve-design-opacity] output').textContent = `${prefs.opacity}%`;
  bar.querySelector('[data-sve-design="diff"]').setAttribute('aria-pressed', prefs.diff ? 'true' : 'false');

  const removeBtn = bar.querySelector('[data-sve-design="remove"]');

  removeBtn.disabled = noEntry || live.busy || !live.listing?.[size];
  removeBtn.title = t(win, 'design_remove_for', { size: sizeLabel(win, size) });

  let status = live.status;

  if (!status && noEntry) {
    status = t(win, 'design_no_entry');
  } else if (!status && live.listing && !live.listing[size]) {
    status = t(win, 'design_none_for', { size: sizeLabel(win, size) });
  }

  const line = bar.querySelector('[data-sve-design-status]');

  if (line.textContent !== status) {
    line.textContent = status;
  }
}

/** Top centre of the preview frame, in the Control Panel window's coordinates. */
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

  bar.hidden = false;
  bar.style.left = `${Math.round(dx + rect.left + rect.width / 2)}px`;
  bar.style.top = `${Math.round(dy + rect.top + 12)}px`;
}
