/**
 * What Build draws on its canvas over the page, and the drags it takes.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: lib/style.js, html-tree-parse.js, build-mode/canvas-paint.js,
 *   build-mode/drop.js, build-mode/place.js, build-mode/columns-overlay.js.
 * Bus: none. The file is written through the port (`write`, `openPlus`), as
 *   Add writes it.
 *
 *   The +        on the hovered and the picked element, and in each empty
 *                cell of the picked Grid: a press makes it the place Add puts
 *                the next element, and the panel opens Add and flashes it
 *                (`port.openPlus`). An empty element wears
 *                it in its middle, any other on its bottom edge. Nothing
 *                locked wears one.
 *   A drag       a tile from Add (`dragNew`, pressed in the panel) or an
 *                element of the section (`grab`, pressed on the canvas), once
 *                it has moved 5px, as a row in the HTML tree. A line before or
 *                after the element under the pointer, or a box round the one
 *                it would go into, says where it lands (drop.js); letting go
 *                writes it there and picks it. Escape lets go of nothing.
 *                A tile that makes a section of its own (new-section.js) —
 *                Section anywhere, the others outside the open section — is
 *                a line before or after the page's section under the pointer,
 *                and letting go asks for the section (`port.dropSection`).
 *
 * Both are for a port that writes — Visual Build's. HTML Build's port only
 * shows and picks (boot.js `mountBuildView`): no +, and nothing is dragged.
 *
 * The layer is a child of the canvas's <html> after the body, so a morph of
 * the body never meets it. It is drawn at most once a frame, every box read
 * before anything is written (the canvas's `schedule`). A tile's drag starts
 * in the Control Panel: the frame's box is read once as it starts, and each
 * frame after reads only the canvas and moves the ghost last.
 */
import { injectStyle } from '../lib/style.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import { CANVAS_EMPTY, CANVAS_PATH } from './canvas-paint.js';
import { dropInto, dropMove, dropNew, dropWhere, dropZones, movable, sectionLanding } from './drop.js';
import { holdsElements } from './catalog.js';
import { columnsFor, findByPath } from './place.js';
import { PLUS } from './columns-overlay.js';

const UI_ID = '__sve-build-ui';
const ADD = 'data-sve-build-add';
const DROP = 'data-sve-build-drop';
/** On the element being moved. */
const DRAGGING = 'data-sve-build-dragging';
/** On the layer while a drag is on: the +s step aside. */
const BUSY = 'data-sve-build-busy';
const GHOST_ID = '__sve-build-ghost';
const GHOST_CSS_ID = '__sve-build-ghost-css';
/** How far a press moves before it is a drag — the HTML tree's 5px. */
const SLOP = 25;
/** Half the +, so one on the bottom edge of a tall element stays in view. */
const EDGE = 14;

/** The layer's looks, in the canvas's own sheet (canvas.js). */
export const UI_CSS = `#${UI_ID}{position:fixed;inset:0;margin:0;padding:0;border:0;pointer-events:none;z-index:2147483647}
#${UI_ID} [${ADD}]{all:unset;position:fixed;pointer-events:auto;box-sizing:border-box;width:1.5rem;height:1.5rem;margin:-.75rem 0 0 -.75rem;border-radius:999px;display:flex;align-items:center;justify-content:center;background:#3858e9;color:#fff;cursor:pointer;box-shadow:0 .0625rem .1875rem rgba(0,0,0,.3)}
#${UI_ID} [${ADD}]:hover{background:#4a68ee}
#${UI_ID}[${BUSY}] [${ADD}]{display:none}
#${UI_ID} [${DROP}]{position:fixed;box-sizing:border-box;pointer-events:none}
#${UI_ID} [${DROP}][hidden]{display:none}
#${UI_ID} [${DROP}="before"],#${UI_ID} [${DROP}="after"]{height:.1875rem;margin-top:-.09375rem;border-radius:999px;background:#3858e9}
#${UI_ID} [${DROP}="inside"]{outline:.125rem solid #3858e9;outline-offset:-.125rem;background:rgba(56,88,233,.08)}
[${CANVAS_PATH}][${DRAGGING}]{opacity:.4}`;

const GHOST_CSS = `#${GHOST_ID}{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;padding:.25rem .625rem;border-radius:999px;background:#3858e9;color:#fff;font:600 .75rem/1.4 system-ui,sans-serif;white-space:nowrap;box-shadow:0 .125rem .5rem rgba(0,0,0,.25);margin:.75rem 0 0 .75rem}`;

const elementOf = (node) => (node?.nodeType === 1 ? node : node?.parentElement || null);
const byPath = (root, path) => root.querySelector(`[${CANVAS_PATH}="${CSS.escape(path)}"]`);

/**
 * @param {Window} win  the Control Panel window
 * @param {object} the canvas's own:
 *   page()       its document, or null
 *   frame()      its <iframe>
 *   port()       the Build panel's port, or null
 *   hovered()    the element the pointer is over
 *   schedule(fn) once a frame, before the next paint
 * @returns {{ draw, owns, click, grab, dragNew, stop }}
 */
export function canvasUi(win, { page, frame, port, hovered, schedule }) {
  const tree = { html: null, roots: [] };
  /** The port when it writes; null for one that only shows and picks. */
  const writer = () => {
    const p = port();

    return typeof p?.write === 'function' ? p : null;
  };
  let drag = null;
  let swallow = false;
  let cancel = null;

  /** The file's rows, parsed once for each file. */
  const roots = () => {
    const html = port()?.html() || '';

    if (html !== tree.html) {
      tree.html = html;
      tree.roots = parseTemplateTree(html);
    }

    return tree.roots;
  };

  const layerIn = (doc) => doc.getElementById(UI_ID);

  /** Written, never read before: creating it in the middle of the reads would lay the canvas out again. */
  function ensureLayer(doc) {
    let layer = layerIn(doc);

    if (!layer) {
      layer = doc.createElement('div');
      layer.id = UI_ID;
      layer.setAttribute('data-sve-ui', '');

      const drop = doc.createElement('div');

      drop.setAttribute(DROP, '');
      drop.hidden = true;
      layer.append(drop);
      doc.documentElement.append(layer);
    }

    return layer;
  }

  /* The + */

  /** The elements that wear a +: the hovered, the picked, the picked Columns' empty columns. */
  function plusTargets(doc) {
    const p = writer();

    if (!p || drag) {
      return [];
    }

    const out = [];
    const seen = new Set();
    const take = (el, middle = false) => {
      const path = el?.getAttribute(CANVAS_PATH);
      const node = path && !seen.has(el) ? findByPath(roots(), path) : null;

      // Only what can hold others: a link, a heading or an image has the panel's + to add after it.
      if (holdsElements(node)) {
        seen.add(el);
        out.push({ el, path, middle: middle || el.hasAttribute(CANVAS_EMPTY) });
      }
    };
    const picked = p.selectedPath();

    take(hovered());

    if (picked) {
      take(byPath(doc, picked));

      for (const column of columnsFor(p.html(), picked)?.columns || []) {
        if (column.empty) {
          take(byPath(doc, column.path), true);
        }
      }
    }

    return out;
  }

  function drawNow() {
    const doc = page();

    if (!doc) {
      return;
    }

    // Read everything first.
    const view = { w: doc.documentElement.clientWidth, h: doc.defaultView.innerHeight };
    const spots = [];

    for (const { el, path, middle } of plusTargets(doc)) {
      const r = el.getBoundingClientRect();

      if (r.bottom < 0 || r.top > view.h || r.right < 0 || r.left > view.w || (!r.width && !r.height)) {
        continue;
      }

      const x = Math.round(r.left + r.width / 2);
      const y = Math.round(middle ? r.top + r.height / 2 : Math.min(r.bottom, view.h - EDGE));

      spots.push({ path, x, y, key: `${path}|${x}|${y}` });
    }

    if (!spots.length && !layerIn(doc)?.querySelector(`[${ADD}]`)) {
      return;
    }

    // Then write: a + that has not moved stays the same button, so a press on it is never lost to a redraw.
    const layer = ensureLayer(doc);
    const kept = new Map([...layer.querySelectorAll(`[${ADD}]`)].map((btn) => [btn.dataset.key, btn]));
    // HTML Build's port only shows and picks: it has no words, and the +s left from Visual Build are taken off below.
    const label = port()?.t?.('tab_add') || '+';

    for (const spot of spots) {
      if (kept.has(spot.key)) {
        kept.delete(spot.key);
        continue;
      }

      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.setAttribute(ADD, spot.path);
      btn.dataset.key = spot.key;
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.style.left = `${spot.x}px`;
      btn.style.top = `${spot.y}px`;
      btn.innerHTML = PLUS;
      layer.append(btn);
    }

    kept.forEach((btn) => btn.remove());
  }

  const draw = () => schedule(drawNow);

  /* Drags */

  function showDrop(doc, over) {
    const box = layerIn(doc)?.querySelector(`[${DROP}]`) || (over ? ensureLayer(doc).querySelector(`[${DROP}]`) : null);

    if (!box) {
      return;
    }

    if (!over) {
      box.hidden = true;

      return;
    }

    const { where, rect } = over;
    const line = where !== 'inside';

    box.setAttribute(DROP, where);
    box.hidden = false;
    Object.assign(box.style, {
      left: `${rect.left}px`,
      top: `${where === 'after' ? rect.bottom : rect.top}px`,
      width: `${rect.width}px`,
      height: line ? '' : `${rect.height}px`,
    });
  }

  /** Where the pointer would drop now: read off the canvas, then drawn — once a frame. */
  function track() {
    const doc = page();

    if (!drag || !doc) {
      return;
    }

    let over = null;
    const at = drag.point ? drag.toCanvas(drag.point) : null;
    const hit = at ? elementOf(doc.elementFromPoint(at.x, at.y)) : null;
    const el = hit?.closest(`[${CANVAS_PATH}]`) || null;

    if (drag.section && (drag.section === 'always' || !el)) {
      over = besideSection(hit, at);
    } else if (el) {
      const path = el.getAttribute(CANVAS_PATH);
      const r = el.getBoundingClientRect();
      const where = dropWhere(dropZones(roots(), path, drag.moving), at.y - r.top, r.height);

      if (where) {
        let rect = r;

        if (where === 'inside') {
          if (!drag.into.has(path)) {
            drag.into.set(path, dropInto(tree.html, path, drag.moving));
          }

          const into = drag.into.get(path);

          rect = (into === path ? el : byPath(el, into) || el).getBoundingClientRect();
        }

        over = { path, where, rect };
      }
    }

    drag.over = over;
    showDrop(doc, over);

    // The real preview may render mid-drag, and its morph takes the mark off — or puts a new element in its place.
    if (drag.moving) {
      if (!drag.source?.isConnected) {
        drag.source = byPath(doc, drag.moving);
      }

      drag.source?.setAttribute(DRAGGING, '');
    }

    // The ghost is the Control Panel's: moved last, after every read.
    if (drag.ghost && drag.point) {
      drag.ghost.style.transform = `translate(${drag.point.x}px, ${drag.point.y}px)`;
    }
  }

  /**
   * Beside the page's section under the pointer — the outermost element whose
   * `data-sid` is one of the page's rows: a line before it (its top half) or
   * after it, and the row the new section lands after. Null off every section.
   */
  function besideSection(hit, at) {
    let section = null;
    let ids = null;

    for (let node = hit?.closest('[data-sid]'); node; node = node.parentElement?.closest('[data-sid]')) {
      const sid = node.getAttribute('data-sid');
      const row = drag.rows.find((item) => item.includes(sid));

      if (row) {
        section = node;
        ids = row;
      }
    }

    if (!section) {
      return null;
    }

    const rect = section.getBoundingClientRect();
    const where = at.y - rect.top < rect.height / 2 ? 'before' : 'after';

    return { where, rect, section: true, afterUid: sectionLanding(drag.rows, ids, where) };
  }

  /**
   * A press that becomes a drag once it has moved. `events` is the document
   * the pointer is followed in, `capture` the element that keeps it.
   */
  function press(event, { events, capture, toCanvas, moving = '', label = '', source = null, section = '', land }) {
    const origin = { x: event.clientX, y: event.clientY };
    const pointerId = event.pointerId;
    let started = false;

    const begin = () => {
      started = true;

      try {
        capture.setPointerCapture(pointerId);
      } catch {
        /* the document listeners follow the pointer anyway */
      }

      // `section`: the tile's kind (new-section.js); `rows`: the page's sections, read once for the drag.
      drag = { moving, toCanvas: toCanvas(), point: null, over: null, into: new Map(), ghost: null, source, section, rows: section ? port()?.sectionRows?.() || [] : [] };
      roots();
      ensureLayer(page()).setAttribute(BUSY, '');
      source?.setAttribute(DRAGGING, '');

      if (label) {
        injectStyle(win.document, GHOST_CSS_ID, GHOST_CSS);
        drag.ghost = win.document.createElement('div');
        drag.ghost.id = GHOST_ID;
        drag.ghost.textContent = label;
        win.document.body.append(drag.ghost);
      }
    };

    const onMove = (e) => {
      if (e.pointerId !== pointerId) {
        return;
      }

      if (!started) {
        const dx = e.clientX - origin.x;
        const dy = e.clientY - origin.y;

        if (dx * dx + dy * dy < SLOP || !page()) {
          return;
        }

        begin();
      }

      e.preventDefault();
      drag.point = { x: e.clientX, y: e.clientY };
      schedule(track);
    };

    const finish = (commit, held = false) => {
      unhook();
      cancel = null;

      if (!started) {
        return;
      }

      const done = drag;

      drag = null;

      try {
        capture.releasePointerCapture(pointerId);
      } catch {
        /* already released */
      }

      done.ghost?.remove();
      done.source?.removeAttribute(DRAGGING);
      page()?.querySelectorAll(`[${DRAGGING}]`).forEach((el) => el.removeAttribute(DRAGGING));

      const doc = page();

      if (doc) {
        layerIn(doc)?.removeAttribute(BUSY);
        showDrop(doc, null);
      }

      // The click that ends a drag is not a pick (click), nor a tile's add (swallowClick).
      swallow = true;
      win.addEventListener('click', swallowClick, true);

      if (held) {
        // Esc: the button is still down, and that click comes with the release.
        // A release none of our documents hears is ended by the next press instead.
        const over = (e) => {
          docs.forEach((doc) => {
            doc.removeEventListener('pointerup', over, true);
            doc.removeEventListener('pointerdown', over, true);
          });

          if (e.type === 'pointerdown') {
            unswallow();
          } else {
            win.setTimeout(unswallow, 0);
          }
        };

        docs.forEach((doc) => {
          doc.addEventListener('pointerup', over, true);
          doc.addEventListener('pointerdown', over, true);
        });
      } else {
        win.setTimeout(unswallow, 0);
      }

      if (commit && done.over) {
        land(done.over);
      }

      draw();
    };

    const onUp = (e) => {
      if (e.pointerId === pointerId) {
        finish(e.type === 'pointerup');
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && started) {
        e.preventDefault();
        finish(false, true);
      }
    };
    // From the press on: a drag across the page's text selects none of it.
    const noSelect = (e) => e.preventDefault();
    const docs = [...new Set([events, win.document, page()].filter(Boolean))];

    function unhook() {
      events.removeEventListener('pointermove', onMove, true);
      events.removeEventListener('pointerup', onUp, true);
      events.removeEventListener('pointercancel', onUp, true);
      docs.forEach((doc) => {
        doc.removeEventListener('keydown', onKey, true);
        doc.removeEventListener('selectstart', noSelect, true);
      });
    }

    events.addEventListener('pointermove', onMove, true);
    events.addEventListener('pointerup', onUp, true);
    events.addEventListener('pointercancel', onUp, true);
    docs.forEach((doc) => {
      doc.addEventListener('keydown', onKey, true);
      doc.addEventListener('selectstart', noSelect, true);
    });
    cancel = () => finish(false);
  }

  /** In the Control Panel: the click a tile gets when its drag ends. */
  function swallowClick(event) {
    if (swallow) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function unswallow() {
    swallow = false;
    win.removeEventListener('click', swallowClick, true);
  }

  const write = (out) => {
    if (out) {
      port()?.write(out.html, { select: out.path });
    }
  };

  /**
   * A tile from Add pressed: dragged onto the canvas and dropped where the
   * pointer lets go. False when there is nothing to drop on.
   *
   * @param {PointerEvent} event  the tile's pointerdown
   * @param {{ label: string, markup: () => string, section?: string }} item
   *   `section` the tile's kind on a page built from sections (new-section.js)
   */
  function dragNew(event, item) {
    if (event.button !== 0 || drag || !page() || !writer() || !frame()) {
      return false;
    }

    const tile = event.currentTarget;

    press(event, {
      events: win.document,
      capture: tile,
      label: item.label,
      section: item.section || '',
      // The frame's box, read once as the drag starts: from the panel's
      // pointer to the canvas's own coordinates (Live Preview may scale it).
      toCanvas() {
        const el = frame();
        const box = el.getBoundingClientRect();
        const scale = el.offsetWidth ? box.width / el.offsetWidth : 1;

        return ({ x, y }) =>
          x < box.left || x > box.right || y < box.top || y > box.bottom ? null : { x: (x - box.left) / scale, y: (y - box.top) / scale };
      },
      land: (over) =>
        over.section
          ? port()?.dropSection(item.section, item.markup(), over.afterUid)
          : write(dropNew(port()?.html() || '', over.path, over.where, item.markup())),
    });

    return true;
  }

  /** A press on the canvas: an element of the section that may move, picked up once the pointer moves. */
  function grab(event) {
    const doc = page();

    if (event.button !== 0 || drag || !doc || !writer() || owns(event.target)) {
      return;
    }

    const el = elementOf(event.target)?.closest(`[${CANVAS_PATH}]`);
    const from = el?.getAttribute(CANVAS_PATH);

    if (!from || !movable(roots(), from)) {
      return;
    }

    press(event, {
      events: doc,
      capture: el,
      moving: from,
      source: el,
      toCanvas: () => (point) => point,
      land: (over) => write(dropMove(port()?.html() || '', from, over.path, over.where)),
    });
  }

  /** Whether a node is the layer's (a +), not the page's. */
  function owns(node) {
    return !!elementOf(node)?.closest(`#${UI_ID}`);
  }

  /** A click on the canvas the layer answers: a + (Add's place, shown in the panel), or the end of a drag. */
  function click(event) {
    if (swallow) {
      return true;
    }

    const btn = elementOf(event.target)?.closest(`[${ADD}]`);

    if (!btn) {
      return false;
    }

    writer()?.openPlus(btn.getAttribute(ADD));

    return true;
  }

  return {
    draw,
    owns,
    click,
    grab,
    dragNew,
    stop() {
      cancel?.();
      tree.html = null;
      tree.roots = [];
    },
  };
}
