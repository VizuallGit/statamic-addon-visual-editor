/**
 * Build's canvas: the page as the real preview shows it, with the section the
 * dock holds painted from the dock's file in the frame it is typed.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: vue, cp/bus.js, cp/panel/store.js, lib/values.js,
 *   lib/preview-frame.js, lib/style.js, lib/debug.js, html-pick-align.js,
 *   tw-compile.js (lazily), build-mode/canvas-paint.js, build-mode/canvas-ui.js,
 *   build-mode/canvas-hold.js, build-mode/canvas-fields.js,
 *   build-mode/canvas-live.js, cp/html-tree/store.js,
 *   Alpine's morph (its ES build under a query of Build's own — see below).
 * Bus: asks `dock:html`, `dock:current-uid`, `dock:component-src`,
 *   `dock:chrome-kind`, `html-tree:open-section`; listens to
 *   `dock:html-changed`, `tw:changed`.
 *
 * A frame of Build's own stands exactly over the real Live Preview. The real
 * one stays mounted and keeps rendering underneath, only invisible
 * (`visibility: hidden` — never `display: none`, never removed), and is read
 * the way the class strip reads it: same origin, straight out of its
 * document. Nothing in the kernel is touched and no message is sent to it.
 *
 *   The page     the real preview's stylesheets and styles, and its body,
 *                without scripts — the canvas is sandboxed, so neither Alpine
 *                nor the site's JS runs there. Copied again each time the real
 *                preview has rendered (`statamic:preview-updated`).
 *   The section  painted from `dock:html` on every `dock:html-changed` and
 *                `tw:changed` (canvas-paint.js), morphed into place, its
 *                classes compiled by Instant's kept Tailwind compiler — and
 *                painted again the frame the form is typed in: `{{ name }}` in
 *                text is the form's value, read when the plan is built, so the
 *                plan is what is watched (see the watch at the end).
 *   The islands  what only the server renders — loops, conditions, components,
 *                tags — read out of a copy of the real preview's section by the
 *                paths html-pick-align.js stamps, each time it has rendered.
 *                One that is a field's alone (a Bard document) is the form's
 *                editor's while that is typed in (canvas-fields.js).
 *   Its own      an element the file leaves empty stands open, dashed, until
 *                something is put in it (`CANVAS_EMPTY`, stamped by the paint);
 *                the + and the drags are canvas-ui.js's.
 *   What runs    the tree's video icon and Alpine toggle talk to the real
 *                preview, as in Content. Its videos and dialogs are followed
 *                on the canvas (canvas-live.js), and while the tree holds an
 *                Alpine state the file does not have, the open section is the
 *                real preview's own drawing, read again each time it changes:
 *                Alpine runs there, not here.
 *
 * The morph is Alpine's. preview.js and live-reload-morph.js import the
 * package already, each by a build of its own; a module two entries import
 * becomes a chunk preview.js would load too (scripts/vite-mirror-graph.js),
 * and the CommonJS build pulls Rollup's CommonJS helpers out into a chunk
 * of their own that Content then loads. So the ES build comes in under a
 * query of Build's own: to Rollup a module no one else imports, bundled into
 * this chunk only. It runs in the Control Panel's window and does two things
 * there: its first call lets `Element.prototype.setAttribute` take names with
 * `@` (every other name goes the way it went), and it hands each element it
 * patches to the CP's own `window.Alpine.cloneNode`. The canvas carries no
 * Alpine attribute (`inertAttr`), so that Alpine finds nothing to do.
 *
 * The section in the real preview is found by its `data-sid` (`sidElement`,
 * the lookup `findPickRoot` makes for a uid), with every identity the row has
 * in the order `topLevelSectionIds` tries them.
 *
 * Not in the prototype:
 *   - Instant-JS is unchanged and still paints the real preview underneath.
 *   - `previewFrame` still names the real preview, so the class strip does
 *     not show in Build. X-ray reads the canvas itself (`BUILD_CANVAS_ID`,
 *     and `BUILD_CANVAS_SHOWN_EVENT` when it comes to show or goes — xray.js).
 *   - Header and footer are a copy; Alpine and the site's JS do not run (what
 *     they show in the real preview does — see What runs).
 *   - An island whose own Antlers change (a loop's parameters) waits, empty,
 *     until the real preview has rendered it.
 *   - A tag in an attribute that the server answers otherwise than the form
 *     (a partial's parameter) shows the last render's value (`served`); in
 *     text, `{{ name }}` is always the form's — the row's, then the page's.
 */
import { shallowRef, watch } from 'vue';
import morphPlugin from '@alpinejs/morph/dist/module.esm.js?build-canvas';
import { ask, on } from '../cp/bus.js';
import { panelValues } from '../cp/panel/store.js';
import { containerContext } from '../lib/publish-containers.js';
import { canvasEdit, editedText } from './canvas-edit.js';
import { dataGet, findPathByUid } from '../lib/values.js';
import { previewFrame } from '../lib/preview-frame.js';
import { injectStyle } from '../lib/style.js';
import { note } from '../lib/debug.js';
import { BUILD_CANVAS_ID, BUILD_CANVAS_SHOWN_EVENT, BUILD_CANVAS_UNSTYLED_ATTR } from '../lib/build-canvas-ids.js';
import { HT_PATH_ATTR, serializePickTree, sidElement, stampHtmlPickAll } from '../html-pick-align.js';
import { CANVAS_EMPTY, CANVAS_PATH, CANVAS_ROOT, ISLAND_WAIT, fieldLookup, inertAttr, learnTags, pageClasses, paintPlan, planTemplate } from './canvas-paint.js';
import { UI_CSS, canvasUi } from './canvas-ui.js';
import { SECTION_BAR_CSS, sectionBar } from './canvas-section-bar.js';
import { canvasFocus } from './canvas-focus.js';
import { canvasHold } from './canvas-hold.js';
import { canvasFields, fieldDomId } from './canvas-fields.js';
import { followReal, sectionKeyOf } from './canvas-live.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';

const morph = (() => {
  const holder = {};

  morphPlugin(holder);

  return holder.morph;
})();

const FRAME_ID = BUILD_CANVAS_ID;
/** On the real preview's iframe while the canvas stands over it. */
const HIDDEN_ATTR = 'data-sve-build-hidden';
/** On the canvas until its stylesheets have loaded: until then the real preview is what shows. */
const UNSTYLED_ATTR = BUILD_CANVAS_UNSTYLED_ATTR;
/** The canvas came to show, or went: X-ray follows the page on screen (xray.js). */
const shownChanged = (win) => win.dispatchEvent(new Event(BUILD_CANVAS_SHOWN_EVENT));
const HOST_CSS_ID = '__sve-build-canvas-host';
const OWN_CSS_ID = '__sve-build-canvas-css';
const TW_ID = '__sve-build-canvas-tw';
const SELECTED = 'data-sve-build-sel';
const HOVERED = 'data-sve-build-hover';
const TARGET = 'data-sve-build-plus';
/** The page's own looks among the editor's styles: the theme's scale and the CSS pane's live sheet. */
const PAGE_STYLES = new Set(['__sve-theme-scale', '__sve-dock-css-live']);
/** Left off the canvas: what runs there (scripts and their preloads — the canvas runs none) and what the editor puts on the page. */
const LEFT_OFF = 'script, noscript, link[rel~="modulepreload"], link[as="script"], [id^="__sve"], [data-sve-menu]';
/** On the canvas's window after each paint, for what draws over the canvas. */
export const CANVAS_PAINTED = 'sve:build-canvas-painted';

// The placeholder first: a hover, a pick or a + target draws over its dashes.
// A video without `controls` wears none: the browser shows its own wherever scripts are off, as on the canvas.
const OWN_CSS = `img[src=""]{display:block!important;min-width:4rem;min-height:6rem!important;outline:1px dashed rgba(127,127,127,.6);outline-offset:-1px}
[${CANVAS_EMPTY}]{min-height:4rem!important;outline:1px dashed rgba(56,88,233,.6);outline-offset:-1px}
[${CANVAS_EMPTY}="text"]{min-height:1.5em!important}
[${CANVAS_ROOT}][${CANVAS_EMPTY}]{min-height:8rem!important}
[${HOVERED}]:not([${SELECTED}]){outline:1px dashed rgba(56,88,233,.75);outline-offset:-1px}
[${SELECTED}]{outline:.125rem solid #3858e9;outline-offset:-.125rem}
[${TARGET}]{outline:.125rem dashed #3858e9;outline-offset:-.125rem}
${ISLAND_WAIT}{display:inline-block;vertical-align:middle;min-width:2em;min-height:1em;border-radius:.25rem;background:rgba(56,88,233,.12)}
video:not([controls])::-webkit-media-controls{display:none!important}
${UI_CSS}
${SECTION_BAR_CSS}`;

/** The row in the form the dock's uid names: its values fill the section's fields. */
function rowIn(values, uid, cache) {
  if (cache.uid === uid) {
    const row = dataGet(values, cache.path);

    if (row && (row._visual_id === uid || row.id === uid || row._id === uid)) {
      return row;
    }
  }

  const path = findPathByUid(values, uid);

  cache.uid = uid;
  cache.path = path || '';

  return path === null ? null : dataGet(values, path);
}

function escapeText(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** An element as the canvas carries it: no scripts or editor nodes, no Alpine, the tree's paths under the canvas's name. */
function cleanTree(root) {
  root.querySelectorAll(LEFT_OFF).forEach((el) => el.remove());

  for (const el of [root, ...root.querySelectorAll('*')]) {
    for (const { name } of [...el.attributes]) {
      if (name === HT_PATH_ATTR) {
        el.setAttribute(CANVAS_PATH, el.getAttribute(name));
        el.removeAttribute(name);
      } else if (inertAttr(name)) {
        el.removeAttribute(name);
      }
    }
  }
}

/** Child nodes of the real preview's section, as HTML for an island. */
function islandHtml(nodes) {
  let out = '';

  for (const node of nodes) {
    if (node.nodeType === 3) {
      out += escapeText(node.data);
    } else if (node.nodeType === 1 && !node.matches(LEFT_OFF)) {
      cleanTree(node);
      out += node.outerHTML;
    }
  }

  return out;
}

/** The element in `toRoot` that stands where `el` stands under `fromRoot` (a deep copy of it). */
function counterpart(el, fromRoot, toRoot) {
  const steps = [];

  for (let node = el; node && node !== fromRoot; node = node.parentElement) {
    steps.unshift([...node.parentElement.children].indexOf(node));
  }

  return steps.reduce((node, i) => node?.children[i] || null, toRoot);
}

function copyAttributes(from, to) {
  for (const { name } of [...to.attributes]) {
    if (!from.hasAttribute(name)) {
      to.removeAttribute(name);
    }
  }

  for (const { name, value } of [...from.attributes]) {
    if (!inertAttr(name) && to.getAttribute(name) !== value) {
      to.setAttribute(name, value);
    }
  }
}

function pageHead(node) {
  switch (node.tagName) {
    case 'LINK':
      return /(^|\s)stylesheet(\s|$)/i.test(node.rel);
    case 'STYLE':
      return !node.id.startsWith('__sve') || PAGE_STYLES.has(node.id);
    case 'META':
      return node.hasAttribute('charset') || node.name === 'viewport';
    default:
      return false;
  }
}

const bySid = (el) => el.getAttribute('data-sid') || null;
const headKey = (el) => el.id || el.getAttribute('href') || null;

/** Resolves once every stylesheet in the head has loaded (or failed). */
function whenStyled(page) {
  const pending = [...page.head.querySelectorAll('link[rel~="stylesheet"]')].filter((link) => !link.sheet);

  return Promise.all(
    pending.map(
      (link) =>
        new Promise((resolve) => {
          link.addEventListener('load', resolve, { once: true });
          link.addEventListener('error', resolve, { once: true });
        })
    )
  );
}

/**
 * Stand the canvas over the real preview. Returns its handle:
 *
 *   frame()        the canvas `<iframe>`, or null while there is none
 *   attach(port)   the Build panel's port: picks and + targets are marked,
 *                  a click picks → detach
 *   dragNew(event, item)  a tile from Add pressed: dragged onto the canvas
 *   stop()         the canvas goes and the real preview is what shows
 *
 * @param {Window} win  the Control Panel window
 */
export function startCanvas(win) {
  const doc = win.document;
  const known = { learned: new Map(), served: new Set(), extras: new Map(), islands: new Map() };
  const forget = () => Object.values(known).forEach((store) => store.clear());
  // rootKey: the open section's key in the real preview, which its painted root stands for (canvas-live.js).
  const painted = { uid: null, html: null, sheet: null, rootKey: '' };
  // The open section's uid as a ref, so the form watch follows the dock to its next section.
  const current = shallowRef('');
  const rowCache = { uid: '', path: '' };
  const stats = { paints: 0, lastMs: 0, maxMs: 0, truths: 0, truthMs: 0, waiting: 0 };
  const queued = new Set();
  let real = null;
  let realDoc = null;
  let realWin = null;
  let headObserver = null;
  let frame = null;
  let twSheet = null;
  let shadow = null;
  let port = null;
  let stopMarks = null;
  let hovered = null;
  let tw = null;
  let buildTailwind = null;
  let observers = [];
  let liveObserver = null;
  let dialogObserver = null;
  let alive = true;

  const cdoc = () => frame?.contentDocument || null;

  /**
   * The tree's Alpine toggle is lit: the real preview shows a state the file
   * does not have. Alpine runs only there, so while it is lit the open section
   * is the real preview's own drawing, not the dock's painting.
   */
  const alpineLive = () => htmlTreeUi.rows.some((row) => row.alpineSet);

  /** One run per frame for each kind of work, whatever asked for it. */
  const schedule = (job) => {
    if (queued.has(job)) {
      return;
    }

    queued.add(job);
    win.requestAnimationFrame(() => {
      queued.delete(job);

      if (frame) {
        job();
      }
    });
  };

  const ui = canvasUi(win, { page: cdoc, frame: () => frame, port: () => port, hovered: () => hovered, schedule });
  // The section's toolbar, as the bridge draws it in Content (canvas-section-bar.js): in both Builds.
  const bar = sectionBar(win, { page: cdoc });
  // Inside the header, the footer, a global section or a component, as in Content — through the bridge (canvas-focus.js).
  const focus = canvasFocus(win, { page: cdoc, onState: () => schedule(truth) });
  // A menu's would-be classes on the canvas before they are picked, compiled beside the section's own (canvas-hold.js).
  const edit = canvasEdit({
    port: () => port,
    setField: (name, value) => {
      const path = currentSection()?.fieldPath?.(name);

      if (path) {
        containerContext()?.setFieldValue(path, value);
      }
    },
    paint: () => redraw(),
    find: (path) => cdoc()?.querySelector(`[${CANVAS_PATH}="${CSS.escape(path)}"]`) || null,
  });
  // Every morph of the canvas steps round the element being typed in.
  const morphing = {
    key: bySid,
    updating(from, to, childrenOnly, skip) {
      if (from === edit.editing()) {
        skip();
      }
    },
  };
  const hold = canvasHold(win, {
    page: cdoc,
    compile: (classes) => sheet(classes ? `${painted.html || ''}<i class="${classes.replace(/"/g, '&quot;')}"></i>` : painted.html),
  });
  // A field's island — a Bard document — from the form's own editor while it is typed in (canvas-fields.js).
  const fields = canvasFields(win, { islands: known.islands, paint: () => schedule(redraw), read: () => schedule(truth) });

  /* The frame */

  /** Where the real preview stands, read once a frame: read in the middle of the Control Panel's own changes, each read forces its layout. */
  const placeSoon = () => schedule(place);

  function place() {
    if (!frame || !real) {
      return;
    }

    // Every read before the first write: a write in between makes the next read lay the Control Panel out again.
    const style = win.getComputedStyle(real);
    // In the sizes' overview the real preview is fixed to the screen at its
    // frame's place (block-order.js `applyLpPreviewSlot`), to the fraction of
    // a pixel: the canvas stands there only when fixed too, on the same
    // numbers — offsets would be rounded.
    const fixed = style.position === 'fixed';
    const box = {
      position: fixed ? 'fixed' : '',
      left: fixed ? style.left : `${real.offsetLeft}px`,
      top: fixed ? style.top : `${real.offsetTop}px`,
      width: fixed ? style.width : `${real.offsetWidth}px`,
      height: fixed ? style.height : `${real.offsetHeight}px`,
      transform: style.transform === 'none' ? '' : style.transform,
      transformOrigin: style.transformOrigin,
      backgroundColor: style.backgroundColor,
    };

    Object.assign(frame.style, box);
  }

  function create(next) {
    real = next;
    injectStyle(
      doc,
      HOST_CSS_ID,
      `[${HIDDEN_ATTR}]{visibility:hidden!important}
#${FRAME_ID}{position:absolute;margin:0;padding:0;border:0;box-sizing:border-box;display:block}
#${FRAME_ID}[${UNSTYLED_ATTR}]{visibility:hidden}`
    );

    frame = doc.createElement('iframe');
    frame.id = FRAME_ID;
    frame.title = 'Build';
    frame.setAttribute(UNSTYLED_ATTR, '');
    // Same origin, so the editor reads and writes it; no scripts, so nothing
    // the page carries runs there — not even an inline handler.
    frame.setAttribute('sandbox', 'allow-same-origin');
    real.after(frame);

    const page = cdoc();

    page.open();
    page.write('<!doctype html><html><head></head><body></body></html>');
    page.close();

    // After the body, so a morph of the body never meets them and they come
    // last in the cascade — after the page's sheets, as Instant's do.
    const own = page.createElement('style');

    own.id = OWN_CSS_ID;
    own.textContent = OWN_CSS;
    twSheet = page.createElement('style');
    twSheet.id = TW_ID;
    page.documentElement.append(twSheet, own);

    page.addEventListener('click', onClick, true);
    page.addEventListener('auxclick', (event) => event.preventDefault(), true);
    page.addEventListener('submit', (event) => event.preventDefault(), true);
    page.addEventListener('mouseover', onHover);
    page.addEventListener('pointerdown', (event) => {
      if (!edit.holds(event.target)) {
        ui.grab(event);
      }
    }, true);
    page.addEventListener('scroll', ui.draw, true);
    page.addEventListener('scroll', bar.place, true);
    page.addEventListener('scroll', focus.place, true);
    page.addEventListener('keydown', onKey, true);
    frame.contentWindow.addEventListener('resize', ui.draw);
    frame.contentWindow.addEventListener('resize', bar.place);
    frame.contentWindow.addEventListener('resize', focus.place);
    page.documentElement.addEventListener('mouseleave', () => {
      setHover(null);
      bar.hide();
    });

    const resize = new win.ResizeObserver(placeSoon);
    // The overview moves the fixed preview from inside its own frame callback
    // as the row glides: a frame later the canvas would trail its hole. Its
    // writes are the only ones then, so the read here costs that one layout.
    const attrs = new win.MutationObserver(() => (real?.style.position === 'fixed' ? place() : placeSoon()));

    resize.observe(real);
    resize.observe(real.parentElement);
    attrs.observe(real, { attributes: true, attributeFilter: ['style', 'class'] });
    observers = [resize, attrs];
    win.addEventListener('resize', placeSoon);
    real.addEventListener('load', onRealLoad);
    placeSoon();
    loadCompiler();
  }

  /** The canvas in, the real preview out — once the canvas looks like the page, at the page's scroll. */
  function reveal() {
    const mine = frame;

    whenStyled(cdoc()).then(() => {
      if (frame !== mine || !real) {
        return;
      }

      // Instant: a site's `scroll-behavior: smooth` would glide the canvas down from the top.
      frame.contentWindow.scrollTo({ top: realWin?.scrollY || 0, behavior: 'instant' });
      frame.removeAttribute(UNSTYLED_ATTR);
      real.setAttribute(HIDDEN_ATTR, '');
      shownChanged(win);
    });
  }

  function teardown() {
    observers.forEach((observer) => observer.disconnect());
    observers = [];
    unbindReal();
    win.removeEventListener('resize', placeSoon);

    if (real) {
      real.removeEventListener('load', onRealLoad);
      real.removeAttribute(HIDDEN_ATTR);
    }

    const shown = !!frame;

    frame?.remove();
    frame = null;

    if (shown) {
      shownChanged(win);
    }

    twSheet = null;
    real = null;
    hovered = null;
    painted.uid = null;
    painted.html = null;
    painted.sheet = null;
  }

  /** The canvas stands over the preview there is now — a new frame when Statamic has mounted a new one. */
  function ensure() {
    const now = alive ? previewFrame(win) : null;

    if (!now) {
      return false;
    }

    if (now !== real || !frame?.isConnected) {
      teardown();
      create(now);
    }

    return bindReal();
  }

  /* The real preview */

  function bindReal() {
    let next = null;

    try {
      next = real.contentDocument;
    } catch {
      next = null;
    }

    if (next === realDoc) {
      return !!next?.body;
    }

    unbindReal();

    if (!next?.head || !next.body) {
      return false;
    }

    realDoc = next;
    realWin = next.defaultView;
    focus.bind(realDoc);
    realWin.addEventListener('statamic:preview-updated', onRealUpdated);
    headObserver = new win.MutationObserver(() => schedule(syncHead));
    headObserver.observe(realDoc.head, { childList: true, subtree: true, characterData: true, attributes: true });
    // A video started or held, a dialog opened or shut: the canvas follows (canvas-live.js).
    realDoc.addEventListener('play', onRealMedia, true);
    realDoc.addEventListener('pause', onRealMedia, true);
    dialogObserver = new win.MutationObserver(onRealMedia);
    dialogObserver.observe(realDoc.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    watchLive();
    forget();
    painted.uid = null;

    return true;
  }

  function unbindReal() {
    focus.unbind();
    headObserver?.disconnect();
    headObserver = null;
    dialogObserver?.disconnect();
    dialogObserver = null;
    liveObserver?.disconnect();
    liveObserver = null;

    try {
      realWin?.removeEventListener('statamic:preview-updated', onRealUpdated);
      realDoc?.removeEventListener('play', onRealMedia, true);
      realDoc?.removeEventListener('pause', onRealMedia, true);
    } catch {
      /* gone with its document */
    }

    realDoc = null;
    realWin = null;
  }

  function onRealUpdated() {
    schedule(truth);
  }

  function onRealLoad() {
    schedule(truth);
  }

  function onRealMedia() {
    schedule(follow);
  }

  /** The editor's own marks and nodes in the real preview: no reason to read the section again. */
  function editorOnly(record) {
    const target = record.target.nodeType === 1 ? record.target : record.target.parentElement;

    if (target?.closest(LEFT_OFF)) {
      return true;
    }

    if (record.type === 'attributes') {
      return record.attributeName.startsWith('data-sve');
    }

    if (record.type === 'childList') {
      return [...record.addedNodes, ...record.removedNodes].every((node) => node.nodeType === 1 && node.matches(LEFT_OFF));
    }

    return false;
  }

  /** While the Alpine toggle is lit, every change Alpine makes in the real preview is read onto the canvas. */
  function watchLive() {
    const want = alive && !!realDoc?.body && alpineLive();

    if (want === !!liveObserver) {
      return;
    }

    if (!want) {
      liveObserver.disconnect();
      liveObserver = null;

      return;
    }

    liveObserver = new win.MutationObserver((records) => {
      if (!records.every(editorOnly)) {
        schedule(truth);
      }
    });
    liveObserver.observe(realDoc.body, { subtree: true, childList: true, attributes: true, characterData: true });
  }

  /** The real preview's videos and dialogs, as they are now, on the canvas. */
  function follow() {
    followReal(cdoc(), realDoc, { root: cdoc()?.querySelector(`[${CANVAS_ROOT}]`) || null, rootKey: painted.rootKey, skip: LEFT_OFF });
  }

  /* What the dock holds */

  /**
   * The dock names a section before it holds its file (`dock:load-settled`):
   * read in between, the uid is the new one and the HTML the old. Until the
   * file has landed nothing is read; then what was asked for in between runs
   * once — the page read again if that was among it, else a paint (of the
   * form's fields, when only they were asked for).
   */
  let landing = null;
  const owed = new Set();

  function settled(job) {
    const load = ask('dock:load-settled');

    if (!load) {
      return true;
    }

    owed.add(job);

    if (landing !== load) {
      landing = load;
      load.then(() => {
        if (landing !== load) {
          return;
        }

        const job = owed.has(truth) ? truth : owed.has(paint) ? paint : redraw;

        landing = null;
        owed.clear();
        job();
      });
    }

    return false;
  }

  function currentSection() {
    if (ask('dock:component-src')) {
      return null;
    }

    const html = ask('dock:html');
    const chrome = String(ask('dock:chrome-kind') || '');

    // The header or the footer: the real preview's drawing, stamped with the
    // file's paths so picks, + and drags work on it (syncBody) — never painted,
    // its fields are the global's and not this form's.
    if (chrome) {
      if (typeof html !== 'string' || !html) {
        return null;
      }

      let plan;

      return {
        chrome,
        uid: `chrome:${chrome}`,
        ids: [],
        html,
        get plan() {
          plan ??= planTemplate(html, fieldLookup({}, {}));

          return plan;
        },
      };
    }

    const uid = ask('dock:current-uid') || '';

    if (!uid || typeof html !== 'string' || !html) {
      return null;
    }

    const values = panelValues() || {};
    const row = rowIn(values, uid, rowCache);
    // Every identity the row has, in the order `topLevelSectionIds` tries them: `data-sid` is `id` or `_id` first.
    const ids = [...new Set([row?.id, row?._id, row?._visual_id, uid].filter((id) => typeof id === 'string' && id))];
    let plan;

    return {
      uid,
      ids,
      html,
      get plan() {
        plan ??= planTemplate(html, fieldLookup(row || {}, values));

        return plan;
      },
      /** The id of a field's element in the form: the row's field when the row has it (as `fieldLookup` reads it), else the page's. */
      fieldId(name) {
        const own = !!row && rowCache.path && Object.hasOwn(row, name.split('.')[0]);

        return fieldDomId(own ? `${rowCache.path}.${name}` : name);
      },
      /** Where a field's value is in the form: the row's when the row has it or declares it, else the page's. */
      fieldPath(name) {
        return rowCache.path && !Object.hasOwn(values, name) ? `${rowCache.path}.${name}` : name;
      },
    };
  }

  /* Truth: the page and the islands, from what the real preview rendered */

  function learn(plan, realRoot) {
    shadow ||= doc.implementation.createHTMLDocument('');

    const copy = shadow.importNode(realRoot, true);

    shadow.body.replaceChildren(copy);
    stampHtmlPickAll([copy], serializePickTree([plan.node]), shadow);

    const byPath = new Map();

    for (const el of [copy, ...copy.querySelectorAll(`[${HT_PATH_ATTR}]`)]) {
      const path = el.getAttribute(HT_PATH_ATTR);

      if (path && !byPath.has(path)) {
        byPath.set(path, el);
      }
    }

    for (const el of plan.elements) {
      const dom = byPath.get(el.path);

      if (!dom) {
        continue;
      }

      for (const attr of el.attrs) {
        const tokens = attr.name.toLowerCase() === 'class';
        const rendered = dom.getAttribute(attr.name);
        const read = learnTags(attr.parts, tokens && rendered !== null ? pageClasses(rendered) : rendered, { tokens });

        if (!read) {
          continue;
        }

        read.values.forEach((value, tag) => known.learned.set(tag, value));

        for (const part of attr.parts) {
          if (part.value !== undefined) {
            known.served[read.served ? 'add' : 'delete'](part.tag);
          }
        }
      }

      if (el.loose) {
        const named = new Set(el.attrs.map((attr) => attr.name.toLowerCase()));

        known.extras.set(
          el.path,
          [...dom.attributes]
            .filter(({ name }) => !named.has(name) && name !== HT_PATH_ATTR && !name.startsWith('data-sve-build') && !inertAttr(name))
            .map(({ name, value }) => [name, value])
        );
      }
    }

    const stampOf = (node) => (node.nodeType === 1 ? node.getAttribute(HT_PATH_ATTR) : null);

    // Read every island before any is cleaned: cleaning renames the stamps the next one is found by.
    const found = [];

    for (const run of plan.islands) {
      const host = byPath.get(run.host);

      if (!host) {
        continue;
      }

      const kids = [...host.childNodes];
      let from = 0;
      let to = kids.length;

      if (run.prev) {
        from = kids.findLastIndex((kid) => stampOf(kid) === run.prev) + 1;

        if (!from) {
          continue;
        }
      }

      if (run.next) {
        const at = kids.findIndex((kid, i) => i >= from && stampOf(kid) === run.next);

        if (at === -1) {
          continue;
        }

        to = at;
      }

      found.push([run.key, kids.slice(from, to)]);
    }

    // An island whose editor is typed in stays the editor's: this render is behind it.
    found.forEach(([key, nodes]) => {
      if (!fields.holds(key)) {
        known.islands.set(key, islandHtml(nodes));
      }
    });
  }

  function syncHead() {
    const page = cdoc();

    if (!page || !realDoc?.head) {
      return;
    }

    const next = page.createElement('head');
    const base = page.createElement('base');

    base.setAttribute('href', realDoc.baseURI);
    next.appendChild(base);

    for (const node of realDoc.head.children) {
      if (pageHead(node)) {
        const copy = next.appendChild(page.importNode(node, true));

        for (const { name } of [...copy.attributes]) {
          if (inertAttr(name)) {
            copy.removeAttribute(name);
          }
        }
      }
    }

    morph(page.head, next, { key: headKey });
  }

  function syncBody(section, realRoot) {
    const page = cdoc();
    const next = page.importNode(realDoc.body, true);
    const slot = realRoot && section?.plan ? counterpart(realRoot, realDoc.body, next) : null;

    if (slot && (alpineLive() || section.chrome)) {
      // The real preview's drawing stays, stamped with the file's paths so picks, + and hover work on it.
      stampHtmlPickAll([slot], serializePickTree([section.plan.node]), page);
      slot.setAttribute(CANVAS_ROOT, '');
      stats.waiting = 0;
    } else if (slot) {
      const { html, waiting } = paintPlan(section.plan, known);
      const painting = parse(html);

      if (painting) {
        slot.replaceWith(painting);
      }

      stats.waiting = waiting.length;
    }

    cleanTree(next);
    copyAttributes(realDoc.documentElement, page.documentElement);
    morph(page.body, next, morphing);
  }

  function truth() {
    if (!ensure() || !settled(truth)) {
      return;
    }

    const t0 = win.performance.now();
    const first = painted.uid === null;
    const section = currentSection();
    const uid = section?.uid || '';

    if (uid !== painted.uid) {
      forget();
    }

    const realRoot = !section?.plan
      ? null
      : section.chrome
        ? realDoc.querySelector(`[data-sve-chrome="${CSS.escape(section.chrome)}"]`)
        : sidElement(realDoc, section.uid, section.ids);

    if (realRoot) {
      learn(section.plan, realRoot);
    }

    fields.follow(section?.chrome ? null : section?.plan, section?.fieldId);
    syncHead();
    syncBody(section, realRoot);

    const moved = uid !== painted.uid;

    painted.uid = uid;
    current.value = uid;
    painted.html = section?.html ?? null;
    painted.rootKey = sectionKeyOf(realRoot);
    sheet(painted.html);
    marks();
    rehover();
    follow();

    if (first) {
      reveal();
    } else if (moved) {
      showRoot();
    }

    stats.truths += 1;
    stats.truthMs = Math.round((win.performance.now() - t0) * 10) / 10;
    stats.uid = uid;
    stats.found = !!realRoot;
    report();
  }

  /* Paint: the section from the dock's file, the frame it is typed */

  function parse(html) {
    const box = cdoc().createElement('template');

    box.innerHTML = html;

    return box.content.firstElementChild;
  }

  function sheet(html) {
    if (!buildTailwind || !twSheet) {
      return;
    }

    const css = html ? buildTailwind(tw, html) : '';

    if (css !== painted.sheet) {
      painted.sheet = css;
      twSheet.textContent = css;
    }
  }

  function loadCompiler() {
    if (buildTailwind) {
      return;
    }

    import('../tw-compile.js')
      .then((mod) =>
        mod.loadTailwindCompiler(win).then((state) => {
          tw = state;
          buildTailwind = mod.buildTailwind;
          sheet(painted.html);
        })
      )
      .catch((error) => console.warn('[sve] Build canvas: no Tailwind compiler', error));
  }

  /** The dock's file changed: the section painted from it, unless the canvas already shows this file. */
  function paint() {
    draw(false);
  }

  /** The form changed: the same file, its fields read again — the classes are as they were. */
  function redraw() {
    draw(true);
  }

  function draw(form) {
    if (!ensure() || !settled(form ? redraw : paint)) {
      return;
    }

    const section = currentSection();

    // Another section in the dock: the page is read again first, then painted.
    if ((section?.uid || '') !== painted.uid) {
      truth();

      return;
    }

    // The Alpine toggle is lit, or the header / footer is open: the real preview's drawing, read again rather than painted.
    if (section && (alpineLive() || section.chrome)) {
      if (!form) {
        truth();
      }

      return;
    }

    fields.follow(section?.plan, section?.fieldId);

    // The file is new to the canvas, or the form is: else there is nothing to paint.
    const file = !!section && section.html !== painted.html;

    if (!section?.plan || !(file || form)) {
      marks();

      return;
    }

    const t0 = win.performance.now();
    const root = cdoc().querySelector(`[${CANVAS_ROOT}]`);

    painted.html = section.html;

    // A section the real preview has not rendered yet has no place on the page.
    if (root) {
      const { html, waiting } = paintPlan(section.plan, known);
      const next = parse(html);

      if (next) {
        hold.forget();
        morph(root, next, morphing);
      }

      stats.waiting = waiting.length;
    }

    // The classes are the file's: compiled when the file changed, not when a field did.
    if (file) {
      sheet(section.html);
    }

    marks();
    rehover();
    follow();

    const ms = Math.round((win.performance.now() - t0) * 10) / 10;

    stats.paints += 1;
    stats.lastMs = ms;
    stats.maxMs = Math.max(stats.maxMs, ms);
    report();
  }

  function report() {
    note('build-canvas', { ...stats, at: win.performance.now() });
    frame?.contentWindow?.dispatchEvent(new Event(CANVAS_PAINTED));
  }

  /* Picks and the + target */

  function marks() {
    const page = cdoc();

    if (!page) {
      return;
    }

    const want = [
      [SELECTED, port?.selectedPath() || ''],
      [TARGET, port?.plusPath() || ''],
    ];

    for (const [attr, path] of want) {
      page.querySelectorAll(`[${attr}]`).forEach((el) => {
        if (el.getAttribute(CANVAS_PATH) !== path) {
          el.removeAttribute(attr);
        }
      });

      if (path) {
        page.querySelectorAll(`[${CANVAS_PATH}="${CSS.escape(path)}"]`).forEach((el) => el.setAttribute(attr, ''));
      }
    }

    ui.draw();
    bar.place();
    focus.refresh();
  }

  /** The section the dock opened, brought into view when it is off screen. */
  function showRoot() {
    const root = cdoc()?.querySelector(`[${CANVAS_ROOT}]`);

    if (!root) {
      return;
    }

    const box = root.getBoundingClientRect();
    const height = frame.contentWindow.innerHeight;

    if (box.bottom < 0 || box.top > height) {
      root.scrollIntoView({ block: 'start' });
    }
  }

  function setHover(el) {
    if (el === hovered) {
      return;
    }

    hovered?.removeAttribute(HOVERED);
    hovered = el;
    hovered?.setAttribute(HOVERED, '');
    ui.draw();
  }

  /** A morph takes off every attribute the new HTML does not carry — the hover mark among them. */
  function rehover() {
    if (hovered?.isConnected) {
      hovered.setAttribute(HOVERED, '');
    } else {
      hovered = null;
    }
  }

  function onHover(event) {
    bar.hover(event.target);

    // On a + or the section's toolbar, the element it belongs to stays hovered.
    if (ui.owns(event.target) || bar.owns(event.target)) {
      return;
    }

    const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;

    setHover(target?.closest(`[${CANVAS_PATH}]`) || null);
  }

  /** Escape: Visual Build's panel lets go of the picked element first (`port.escape`), then the bridge's way out. */
  function onKey(event) {
    if (edit.key(event)) {
      return;
    }

    if (event.key === 'Escape' && port?.escape?.()) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    focus.key(event);
  }

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (edit.holds(event.target)) {
      return;
    }

    edit.finish();

    if (bar.click(event) || focus.click(event) || ui.click(event)) {
      return;
    }

    const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
    const el = target?.closest(`[${CANVAS_PATH}]`);

    if (el && port) {
      const path = el.getAttribute(CANVAS_PATH);

      // The element already picked and open in the panel: its words, where they
      // stand. One just added is picked with Add still showing: a click opens it first.
      if (path === port.selectedPath() && port.panel?.value === 'element' && port.inlineTarget && edit.start(el, path, event)) {
        return;
      }

      port.select(path);

      return;
    }

    // Another section: open it, as a click on its row in the list does.
    let section = null;

    for (let node = target?.closest('[data-sid]'); node; node = node.parentElement?.closest('[data-sid]')) {
      section = node;
    }

    if (section) {
      ask('html-tree:open-section', section.getAttribute('data-sid'));
    }
  }

  const unhooks = [
    on('dock:html-changed', paint),
    on('tw:changed', paint),
    // The form typed in: the plan reads the fields the file names (`fieldLookup`
    // — the row's, then the page's) and nothing else of the page's values, so
    // the plan is the source. It is built again the frame one of those fields
    // changes, and the section is painted from it the same frame. `current` is
    // read first so the watch follows the dock to its next section.
    watch(
      () => (current.value, currentSection()?.plan),
      () => schedule(redraw)
    ),
    // The toggle lit or put out: the section is read from the real preview, or painted again.
    watch(alpineLive, () => {
      watchLive();
      schedule(truth);
    }),
  ];

  schedule(truth);
  ensure();

  return {
    frame: () => frame,
    attach(next) {
      stopMarks?.();
      port = next;
      // Every pick bumps the port, and a pick is also how another section of
      // the same kind comes into the dock — one file, so no load announces it.
      stopMarks = watch(() => [next.rev.value, next.selectedPath(), next.plusPath()], () => paint());
      marks();

      return () => {
        if (port === next) {
          stopMarks();
          stopMarks = null;
          port = null;
          marks();
        }
      };
    },
    /** A tile from Add pressed: dragged onto the canvas (canvas-ui.js). */
    dragNew: (event, item) => ui.dragNew(event, item),
    /**
     * What an element shows: its words (`''`), an attribute, or `html`, its
     * markup without the canvas's marks. Null when the canvas has nothing of
     * the element's to show yet — it is not on the canvas, or an island inside
     * it still waits for the real preview: the placeholder is the canvas's own,
     * and read back into the file it would stand where the element's content was.
     */
    shownAt(path, what = '') {
      const el = cdoc()?.querySelector(`[${CANVAS_PATH}="${CSS.escape(path)}"]`);

      if (!el || el.querySelector(ISLAND_WAIT)) {
        return null;
      }

      if (what === 'html') {
        const copy = el.cloneNode(true);

        copy.querySelectorAll('*').forEach((kid) => {
          [...kid.attributes].filter((attr) => attr.name.startsWith('data-sve-')).forEach((attr) => kid.removeAttribute(attr.name));
        });

        return copy.innerHTML.trim();
      }

      return what ? el.getAttribute(what) || '' : editedText(el);
    },
    /** An element's inside, painted ahead of the file: what Bard holds as it is typed. */
    paintInner(path, markup) {
      const el = path ? cdoc()?.querySelector(`[${CANVAS_PATH}="${path}"]`) : null;

      if (el) {
        el.innerHTML = markup;
      }
    },
    stop() {
      alive = false;
      ui.stop();
      bar.stop();
      focus.stop();
      hold.stop();
      fields.stop();
      stopMarks?.();
      stopMarks = null;
      port = null;
      unhooks.forEach((unhook) => unhook());
      queued.clear();
      teardown();
    },
  };
}
