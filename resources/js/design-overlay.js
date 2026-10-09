/**
 * Settings toggle: `design_overlay`
 * Design overlay: a designer's screenshot laid over Live Preview.
 *
 * Its top-bar icon opens a dropdown, the way the breakpoint overview's sizes
 * do: a switch that shows the design over the page, one row per screen size —
 * Mobile, Tablet, Desktop, narrowest first — to upload, replace or remove that
 * size's image, the opacity and a difference view (what matches goes black,
 * what differs lights up). On, the design for the size the preview is showing
 * lies over the page at the preview's width; a size with no image shows
 * nothing — a phone design is not the desktop one shrunk. An image dropped on
 * a row goes to that size. The icon is lit while the design is shown.
 *
 * Loaded only when the icon is first clicked (or the design was left on) —
 * lazy-panels.js, key `design_overlay`, through lazy/design-overlay.js. The
 * image is one `<img>` it owns in the preview document, outside <body> so a
 * morph never meets it; nothing on the page is changed, no kernel file knows
 * about it, and turned off every node and listener it added in the preview is
 * gone again. Files live on the server (DesignOverlayController, /!/sve/design-overlay).
 *
 * May import: lib/*, cp/design/*, breakpoints.js, lp-panel.js (the toolbar's
 * painter), lp-menu-dismiss.js (how every menu in the top bar closes).
 */
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';
import { remToPx } from './lib/dom.js';
import { previewFrame } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';
import { currentEntryId } from './lib/live-preview.js';
import { HEADER_TOOLBAR_ID } from './lib/ids.js';
import { paintLpActiveControl } from './lp-panel.js';
import { bindMenuDismiss } from './lp-menu-dismiss.js';
import { bpFromWidth, breakpoints } from './breakpoints.js';
import { designAllowed, fitWidth, readDesignPrefs, writeDesignPrefs } from './cp/design/prefs.js';

export { designAllowed };

const IMG_ID = '__sve-design-overlay';
const MENU_ID = '__sve-design-menu';
const MENU_STYLE_ID = '__sve-design-menu-style';

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
  /** The open dropdown: `{ el, style, unbind }`, or null. */
  menu: null,
  busy: false,
  status: '',
};

// --- The switch ------------------------------------------------------------

export function isDesignOn(win) {
  return readDesignPrefs(win).on;
}

/** Show the design over the page, or stop. The images stay on the server either way. */
export function setDesign(win, on) {
  writeDesignPrefs(win, { ...readDesignPrefs(win), on: !!on });

  if (on) {
    syncDesignToPreview(win);
  } else {
    detachPreview();
  }

  paintToolbarButton(win);
  paintMenu();
}

/** The top-bar icon: open the dropdown under it, or close it. */
export function toggleDesignMenu(win) {
  if (live.menu) {
    closeMenu();

    return;
  }

  openMenu(win);
}

function paintToolbarButton(win) {
  const btn = toolbarButton(win);

  if (btn) {
    paintLpActiveControl(btn, isDesignOn(win));
  }
}

function toolbarButton(win) {
  return win.document.querySelector(`#${HEADER_TOOLBAR_ID} button[data-tab="design_overlay"]`);
}

/** The page being edited and its images: asked for once per page. */
function followEntry(win) {
  live.win = win;

  const entry = currentEntryId(win);

  if (entry === live.entry) {
    return;
  }

  live.entry = entry;
  live.listing = null;
  live.status = '';

  if (entry) {
    void load(win, entry);
  }
}

/**
 * Put the overlay on the preview that is on screen now, for the page being
 * edited. Called by the top bar's pass on every Control Panel re-render.
 */
export function syncDesignToPreview(win) {
  if (!designAllowed(win)) {
    detachPreview();
    closeMenu();

    return;
  }

  followEntry(win);

  if (!isDesignOn(win)) {
    detachPreview();
    paintMenu();

    return;
  }

  const frame = previewFrame(win);
  let doc = null;

  try {
    doc = frame?.contentDocument || null;
  } catch {
    doc = null;
  }

  if (!frame || !doc?.documentElement) {
    detachPreview();

    return;
  }

  if (live.doc !== doc || live.frame !== frame) {
    attach(win, frame, doc);
  }

  paint();
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

function attach(win, frame, doc) {
  detachPreview();

  live.frame = frame;
  live.doc = doc;
  live.pwin = doc.defaultView;

  // A new width can be a new size, and every size has its own image.
  listen(live.pwin, 'resize', paint);

  live.frameResize = new win.ResizeObserver(() => {
    if (!live.frame?.isConnected) {
      detachPreview();

      return;
    }

    paint();
  });
  live.frameResize.observe(frame);

  listen(frame, 'load', () => syncDesignToPreview(win));
}

/** The size the preview is showing, by its width — the same rule the rest of the editor uses. */
function currentSize() {
  let doc = live.doc;

  if (!doc && live.win) {
    try {
      doc = previewFrame(live.win)?.contentDocument || null;
    } catch {
      doc = null;
    }
  }

  return doc ? bpFromWidth(doc.documentElement.clientWidth, live.win) : null;
}

// --- The image -------------------------------------------------------------

function paint() {
  paintImage();
  paintMenu();
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

    // An image just uploaded is an image you want to see.
    if (!isDesignOn(win)) {
      setDesign(win, true);
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

// --- The dropdown ----------------------------------------------------------

function sizeLabel(win, handle) {
  return breakpoints(win).find((row) => row.handle === handle)?.label || handle;
}

function menuCss() {
  const M = `#${MENU_ID}`;

  // The breakpoint overview's sizes menu, row for row: one look for the top bar's dropdowns.
  return `
${M} { position: fixed; z-index: 2147483001; box-sizing: border-box; width: 19rem; padding: .375rem; border-radius: .625rem; background: #343439; color: rgba(255, 255, 255, .92); box-shadow: 0 .75rem 2.5rem rgba(0, 0, 0, .55), 0 0 0 1px rgba(255, 255, 255, .12); font: 500 .8125rem/1.3 ui-sans-serif, system-ui, sans-serif; }
${M} [data-title] { padding: .25rem .375rem .375rem; font-size: .75rem; font-weight: 600; opacity: .6; }
${M} [data-row] { display: flex; align-items: center; gap: .5rem; min-height: 1.75rem; padding: .25rem .375rem; border-radius: .375rem; }
${M} label[data-row] { cursor: pointer; }
${M} label[data-row]:hover, ${M} [data-size]:hover, ${M} [data-size][data-drop] { background: rgba(255, 255, 255, .08); }
${M} input[type="checkbox"] { flex: none; margin: 0; accent-color: var(--theme-color-primary, #4f46e5); cursor: inherit; }
${M} [data-name] { flex: 1; white-space: nowrap; }
${M} [data-size][aria-current="true"] [data-name]::after { content: ""; display: inline-block; width: .375rem; height: .375rem; margin-left: .4rem; border-radius: 50%; background: var(--theme-color-primary, #4f46e5); vertical-align: middle; }
${M} [data-meta] { opacity: .5; font-variant-numeric: tabular-nums; white-space: nowrap; }
${M} button { appearance: none; border: 0; margin: 0; padding: .25rem .5rem; border-radius: .375rem; background: rgba(255, 255, 255, .08); color: inherit; font: inherit; font-size: .75rem; cursor: pointer; }
${M} button:hover:not(:disabled) { background: rgba(255, 255, 255, .16); }
${M} button:disabled { opacity: .35; cursor: default; }
${M} button[data-act="remove"] { padding: .25rem .4rem; }
${M} [data-sep] { height: 1px; margin: .375rem .25rem; background: rgba(255, 255, 255, .1); }
${M} input[type="range"] { flex: 1; min-width: 0; margin: 0; accent-color: var(--theme-color-primary, #4f46e5); }
${M} output { min-width: 2.5rem; text-align: right; opacity: .6; font-variant-numeric: tabular-nums; }
${M} [data-status] { padding: .375rem .375rem .125rem; font-size: .75rem; opacity: .7; }
${M} [data-status]:empty { display: none; }
`;
}

function openMenu(win) {
  closeMenu();
  followEntry(win);

  const doc = win.document;
  const anchor = toolbarButton(win);
  const style = injectStyle(doc, MENU_STYLE_ID, menuCss());
  const el = doc.createElement('div');
  const add = (parent, tag, attrs = {}, text = '') => {
    const node = doc.createElement(tag);

    Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, value));

    if (text) {
      node.textContent = text;
    }

    parent.appendChild(node);

    return node;
  };

  el.id = MENU_ID;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', t(win, 'design_overlay'));
  add(el, 'div', { 'data-title': '' }, t(win, 'design_overlay'));

  // Show over the page.
  const show = add(el, 'label', { 'data-row': '', 'data-show': '' });
  const showBox = add(show, 'input', { type: 'checkbox' });

  add(show, 'span', { 'data-name': '' }, t(win, 'design_show'));
  showBox.addEventListener('change', () => setDesign(win, showBox.checked));
  add(el, 'div', { 'data-sep': '' });

  // One row per size, narrowest first, as the overview lists them.
  for (const row of [...breakpoints(win)].reverse()) {
    const line = add(el, 'div', { 'data-row': '', 'data-size': row.handle });

    add(line, 'span', { 'data-name': '' }, row.label);
    add(line, 'span', { 'data-meta': '' });
    add(line, 'button', { type: 'button', 'data-act': 'upload' }).addEventListener('click', () => {
      live.target = row.handle;
      file.click();
    });
    add(line, 'button', { type: 'button', 'data-act': 'remove' }, '✕').addEventListener('click', () => {
      void remove(win, row.handle);
    });

    // An image dropped on a row goes to that size.
    line.addEventListener('dragover', (e) => {
      if ([...(e.dataTransfer?.types || [])].includes('Files')) {
        e.preventDefault();
        line.dataset.drop = '';
      }
    });
    line.addEventListener('dragleave', () => delete line.dataset.drop);
    line.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      delete line.dataset.drop;
      void upload(win, row.handle, e.dataTransfer?.files?.[0]);
    });
  }

  add(el, 'div', { 'data-sep': '' });

  // Opacity.
  const opacity = add(el, 'label', { 'data-row': '', 'data-opacity': '' });

  add(opacity, 'span', {}, t(win, 'design_opacity'));

  const range = add(opacity, 'input', { type: 'range', min: '0', max: '100', step: '5' });

  add(opacity, 'output');
  range.addEventListener('input', () => {
    writeDesignPrefs(win, { ...readDesignPrefs(win), opacity: Number(range.value) });
    paint();
  });

  // Difference.
  const diff = add(el, 'label', { 'data-row': '', 'data-diff': '', title: t(win, 'design_diff_tip') });
  const diffBox = add(diff, 'input', { type: 'checkbox' });

  add(diff, 'span', { 'data-name': '' }, t(win, 'design_diff'));
  diffBox.addEventListener('change', () => {
    writeDesignPrefs(win, { ...readDesignPrefs(win), diff: diffBox.checked });
    paint();
  });

  add(el, 'div', { 'data-status': '', role: 'status' });

  const file = add(el, 'input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', hidden: '' });

  file.addEventListener('change', () => {
    const picked = file.files?.[0];

    file.value = '';
    void upload(win, live.target || currentSize(), picked);
  });

  // An image dropped anywhere else in the dropdown goes to the size on screen.
  el.addEventListener('dragover', (e) => e.preventDefault());
  el.addEventListener('drop', (e) => {
    e.preventDefault();
    void upload(win, currentSize(), e.dataTransfer?.files?.[0]);
  });

  // A portal on the Control Panel's body, like every dropdown in the top bar:
  // Live Preview's stacking contexts would trap it anywhere else.
  doc.body.appendChild(el);

  // Under the icon, its left edge on the icon's, kept inside the window.
  if (anchor) {
    const at = anchor.getBoundingClientRect();
    const gap = remToPx(win, 0.375);
    const room = win.innerWidth - el.offsetWidth - gap;

    el.style.left = `${Math.round(Math.max(gap, Math.min(at.left, room)))}px`;
    el.style.top = `${Math.round(at.bottom + gap)}px`;
  }

  live.menu = {
    el,
    style,
    // The icon counts as inside: its own click toggles the dropdown shut.
    unbind: bindMenuDismiss(win, (target) => el.contains(target) || !!anchor?.contains(target), closeMenu),
  };

  paintMenu();
}

function closeMenu() {
  if (!live.menu) {
    return;
  }

  const { el, style, unbind } = live.menu;

  live.menu = null;
  unbind();
  el.remove();
  style.remove();
}

function paintMenu() {
  const el = live.menu?.el;
  const win = live.win;

  if (!el || !win) {
    return;
  }

  const prefs = readDesignPrefs(win);
  const size = currentSize();
  const noEntry = !live.entry;

  el.querySelector('[data-show] input').checked = prefs.on;

  el.querySelectorAll('[data-size]').forEach((line) => {
    const handle = line.dataset.size;
    const slot = live.listing?.[handle] || null;
    const label = sizeLabel(win, handle);
    const meta = slot ? `${slot.width} × ${slot.height}` : '—';
    const upload = line.querySelector('[data-act="upload"]');
    const removeBtn = line.querySelector('[data-act="remove"]');
    const action = t(win, slot ? 'design_replace' : 'design_upload');

    line.setAttribute('aria-current', handle === size ? 'true' : 'false');
    line.title = handle === size ? t(win, 'design_on_screen') : '';

    if (line.querySelector('[data-meta]').textContent !== meta) {
      line.querySelector('[data-meta]').textContent = meta;
    }

    if (upload.textContent !== action) {
      upload.textContent = action;
    }

    upload.title = t(win, slot ? 'design_replace_for' : 'design_upload_for', { size: label });
    upload.disabled = noEntry || live.busy;
    removeBtn.title = t(win, 'design_remove_for', { size: label });
    removeBtn.setAttribute('aria-label', removeBtn.title);
    removeBtn.disabled = noEntry || live.busy || !slot;
  });

  const range = el.querySelector('[data-opacity] input');

  if (el.ownerDocument.activeElement !== range) {
    range.value = String(prefs.opacity);
  }

  el.querySelector('[data-opacity] output').textContent = `${prefs.opacity}%`;
  el.querySelector('[data-diff] input').checked = prefs.diff;

  let status = live.status;

  if (!status && noEntry) {
    status = t(win, 'design_no_entry');
  } else if (!status && prefs.on && live.listing && size && !live.listing[size]) {
    status = t(win, 'design_none_for', { size: sizeLabel(win, size) });
  }

  const line = el.querySelector('[data-status]');

  if (line.textContent !== status) {
    line.textContent = status;
  }
}
