/**
 * The section's toolbar on Build's canvas — the one the bridge draws on a page
 * section in Content (bridge/drag.js `showMoveControl`): drag, up, down, save as
 * a template, a section below, duplicate, remove.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: lib/i18n.js, lib/protocol.js, lib/publish-containers.js, lib/debug.js.
 * Bus: none. Every button is the message the bridge's button sends, posted to
 * the Control Panel's own window (add-section.js `isPreviewMessageSource` takes
 * `event.source === win`, as the HTML tree's section drag does): MSG.MOVE with
 * a direction or a place, SAVE_SECTION, ADD_SET, DUPLICATE_ROW, REMOVE_ROW with
 * its confirm. The canvas runs no script and the bridge is not on it, so the
 * bar is drawn here; what each button does stays the Control Panel's.
 *
 * A page section is what the bridge counts as one: `section_orderable`, or a
 * global section's wrapper (`data-sve-global-root`, whose row id is the page's
 * own `data-sve-global-row`). The bar sits in the section's top right corner,
 * inside it, as there; it hangs on the canvas's <html>, after the body the
 * canvas morphs. The drag is the canvas's own: a line before or after the
 * section under the pointer, and the move on letting go — its place counted in
 * the form's own rows (a hidden section is a row the canvas does not show).
 */

import { t } from '../lib/i18n.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { pageSectionRows } from '../lib/publish-containers.js';
import { note } from '../lib/debug.js';

const BAR_ID = '__sve-build-secbar';
const LINE_ID = '__sve-build-secbar-line';
const SECTION_ATTR = 'data-sid-section-orderable';
const GLOBAL_ROOT_ATTR = 'data-sve-global-root';
const GLOBAL_ROW_ATTR = 'data-sve-global-row';
const DIMMED = 'data-sve-build-secbar-moving';
/** How near the canvas's top or bottom edge a drag scrolls the page, in px. */
const EDGE = 56;

/** The bridge's icons (bridge/inline-edit.js `ICONS`), so the bar reads the same in every mode. */
const svg = (d) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" style="display:block;pointer-events:none"><path fill="currentColor" d="${d}"/></svg>`;
const ICONS = {
  bookmark: svg('M17 3H7a2 2 0 0 0-2 2v15a1 1 0 0 0 1.55.83L12 17.2l5.45 3.63A1 1 0 0 0 19 20V5a2 2 0 0 0-2-2Z'),
  duplicate: svg('M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z'),
  trash: svg('M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3-4h6l1 1h4v2H4V4h4l1-1Zm1 6v9h2V9H10Zm4 0v9h2V9h-2Z'),
};

/** The bridge's dark toolbar (inline-edit.js `toolbarThemeFor`), in the canvas's own sheet. */
export const SECTION_BAR_CSS = `#${BAR_ID}{position:fixed;z-index:2147483646;display:flex;gap:1px;padding:3px;background:#27272a;color:#e4e4e7;border:1px solid rgba(255,255,255,.12);border-radius:9px;box-shadow:0 6px 22px rgba(0,0,0,.55);font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;user-select:none;pointer-events:auto}
#${BAR_ID}[hidden]{display:none}
#${BAR_ID} button{all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;box-sizing:border-box;color:#e4e4e7;line-height:1;font-size:14px}
#${BAR_ID} button:hover{background:rgba(255,255,255,.10)}
#${BAR_ID} button[data-act="drag"]{cursor:grab;font-size:13px;touch-action:none}
#${BAR_ID} button[data-act="add"]{font-size:18px}
#${LINE_ID}{position:fixed;z-index:2147483646;height:3px;margin-top:-1.5px;border-radius:999px;background:#3858e9;pointer-events:none}
#${LINE_ID}[hidden]{display:none}
[${DIMMED}]{opacity:.4}`;

const elementOf = (node) => (node?.nodeType === 1 ? node : node?.parentElement || null);
const isPageSection = (el) => el?.hasAttribute?.(SECTION_ATTR) || el?.hasAttribute?.(GLOBAL_ROOT_ATTR);
/** The row id the form knows the section by: a global section's own row on this page, else its data-sid. */
const uidOf = (el) => el?.getAttribute(GLOBAL_ROW_ATTR) || el?.getAttribute('data-sid') || '';

/** The outermost page section `from` is in, or null. */
function sectionOf(from) {
  let hit = null;

  for (let el = elementOf(from); el; el = el.parentElement) {
    if (isPageSection(el)) {
      hit = el;
    }
  }

  return hit && uidOf(hit) ? hit : null;
}

/** What the section shows on screen: a global section's wrapper is display:contents, its first element is the box. */
function boxOf(el) {
  const r = el.getBoundingClientRect();

  return r.width || r.height ? r : (el.firstElementChild || el).getBoundingClientRect();
}

/**
 * @param {Window} win  the Control Panel window
 * @param {{ page: () => Document|null }} canvas
 * @returns {{ hover(node), owns(node), click(event), place(), hide(), stop() }}
 */
export function sectionBar(win, { page }) {
  let current = null;
  let drag = null;

  const post = (type, extra = {}) => {
    if (current) {
      win.postMessage({ source: SOURCE, type, uid: uidOf(current), ...extra }, win.location.origin);
    }
  };

  const peersOf = (el) => (el?.parentElement ? [...el.parentElement.children].filter(isPageSection) : []);

  function barIn(doc) {
    let bar = doc.getElementById(BAR_ID);

    if (!bar) {
      bar = doc.createElement('div');
      bar.id = BAR_ID;
      bar.setAttribute('data-sve-ui', '');
      bar.hidden = true;
      doc.documentElement.append(bar);
    }

    return bar;
  }

  /** The buttons for `el`: arrows only where it can step, the rest always — as the bridge draws them. */
  function fill(bar, el) {
    const peers = peersOf(el);
    const at = peers.indexOf(el);
    const button = (act, title, html) => `<button type="button" data-act="${act}" title="${title}" aria-label="${title}">${html}</button>`;
    const parts = [];

    if (peers.length > 1) {
      parts.push(button('drag', t(win, 'drag_section'), '⠿'));
    }

    if (at > 0) {
      parts.push(button('up', t(win, 'move_up'), '↑'));
    }

    if (at >= 0 && at < peers.length - 1) {
      parts.push(button('down', t(win, 'move_down'), '↓'));
    }

    parts.push(
      button('save', t(win, 'save_as_template'), ICONS.bookmark),
      button('add', t(win, 'add_section_below'), '+'),
      button('duplicate', t(win, 'duplicate_this'), ICONS.duplicate),
      button('remove', t(win, 'remove_section'), ICONS.trash)
    );
    bar.innerHTML = parts.join('');
    bar.dataset.uid = uidOf(el);
  }

  /** In the section's top right corner, inside it, kept on screen while the section is. */
  function place() {
    const doc = page();
    const bar = doc?.getElementById(BAR_ID);

    // A drag holds the bar away; the scroll it makes does not bring it back.
    if (!bar || !current || drag) {
      return;
    }

    // A morph may have put a new element in its place: the same row, found again.
    if (!current.isConnected) {
      const uid = bar.dataset.uid;

      current = [...doc.querySelectorAll(`[${SECTION_ATTR}], [${GLOBAL_ROOT_ATTR}]`)].find((el) => uidOf(el) === uid && sectionOf(el) === el) || null;

      if (!current) {
        bar.hidden = true;

        return;
      }
    }

    const r = boxOf(current);
    const view = doc.defaultView.innerHeight;

    bar.hidden = r.bottom < 0 || r.top > view;

    if (bar.hidden) {
      return;
    }

    const w = bar.offsetWidth || 200;
    const h = bar.offsetHeight || 32;

    bar.style.left = `${Math.max(r.right - w - 10, 10)}px`;
    bar.style.top = `${Math.min(Math.max(r.top + 10, 10), Math.max(r.bottom - h - 10, 10))}px`;
  }

  function show(el) {
    const doc = page();

    if (!doc) {
      return;
    }

    const bar = barIn(doc);

    if (el !== current || bar.hidden) {
      current = el;
      fill(bar, el);
      bar.hidden = false;
    }

    place();
  }

  function hide() {
    current = null;

    const bar = page()?.getElementById(BAR_ID);

    if (bar) {
      bar.hidden = true;
    }
  }

  const owns = (node) => !!elementOf(node)?.closest(`#${BAR_ID}`);

  /** The pointer over the page: the bar follows the section it is in. */
  function hover(node) {
    if (drag || owns(node)) {
      return;
    }

    const el = sectionOf(node);

    if (el) {
      show(el);
    } else {
      hide();
    }
  }

  /** A click on one of the bar's buttons: true when it was one. */
  function click(event) {
    const btn = elementOf(event.target)?.closest(`#${BAR_ID} button[data-act]`);

    if (!btn || !current) {
      return false;
    }

    const act = btn.dataset.act;

    if (act === 'up' || act === 'down') {
      post(MSG.MOVE, { direction: act === 'up' ? -1 : 1 });
    } else if (act === 'save') {
      post(MSG.SAVE_SECTION);
    } else if (act === 'add') {
      post(MSG.ADD_SET);
    } else if (act === 'duplicate') {
      post(MSG.DUPLICATE_ROW);
    } else if (act === 'remove') {
      post(MSG.REMOVE_ROW, { confirm: true });
    }

    if (act !== 'drag') {
      hide();
    }

    return true;
  }

  /* The drag handle: a line before or after the section under the pointer, the move on letting go. */

  function lineIn(doc) {
    let line = doc.getElementById(LINE_ID);

    if (!line) {
      line = doc.createElement('div');
      line.id = LINE_ID;
      line.hidden = true;
      doc.documentElement.append(line);
    }

    return line;
  }

  function endDrag(commit) {
    const done = drag;

    drag = null;

    if (!done) {
      return;
    }

    done.unhook();
    done.from.removeAttribute(DIMMED);
    lineIn(done.doc).hidden = true;

    if (commit && done.over) {
      // Counted by row id: the canvas may have morphed the elements away mid-drag.
      const rows = pageSectionRows(win, win.document).map((row) => row.ids);
      const indexOf = (el) => rows.findIndex((ids) => ids.includes(uidOf(el)));
      const fromIndex = indexOf(done.from);
      const overIndex = indexOf(done.over.el);
      let toIndex = overIndex + (done.over.where === 'after' ? 1 : 0);

      // The place counted once the section has left its own.
      if (fromIndex < toIndex) {
        toIndex -= 1;
      }

      note('build-secbar-move', { rows: rows.length, fromIndex, overIndex, toIndex });

      if (fromIndex >= 0 && overIndex >= 0 && toIndex !== fromIndex) {
        current = done.from;
        post(MSG.MOVE, { toIndex });
      }
    }

    hide();
  }

  function onPress(event) {
    const btn = elementOf(event.target)?.closest(`#${BAR_ID} button[data-act="drag"]`);
    const doc = page();

    if (!btn || !current || !doc || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const from = current;
    const line = lineIn(doc);
    const bar = doc.getElementById(BAR_ID);
    const view = doc.defaultView;
    let point = null;

    /** The page section under the pointer, and which half of it. */
    const track = () => {
      const el = point && drag ? sectionOf(doc.elementFromPoint(point.x, point.y)) : null;

      if (!el) {
        if (drag) {
          drag.over = null;
        }

        line.hidden = true;

        return;
      }

      const r = boxOf(el);
      const where = point.y - r.top < r.height / 2 ? 'before' : 'after';

      drag.over = { el, where };
      line.hidden = false;
      line.style.left = `${r.left}px`;
      line.style.width = `${r.width}px`;
      // Kept on screen: the edge it stands for may be scrolled away, the section is not.
      line.style.top = `${Math.min(Math.max(where === 'after' ? r.bottom : r.top, 2), view.innerHeight - 2)}px`;
    };

    // Near the canvas's top or bottom edge the page scrolls, faster the nearer:
    // a section is taller than the screen, and the one to drop beside is off it.
    const scroll = () => {
      if (!drag) {
        return;
      }

      drag.raf = 0;

      const h = view.innerHeight;
      const step = !point ? 0 : point.y < EDGE ? -(EDGE - point.y) / 2 : point.y > h - EDGE ? (point.y - (h - EDGE)) / 2 : 0;

      if (step) {
        view.scrollBy(0, step);
        track();
        drag.raf = win.requestAnimationFrame(scroll);
      }
    };

    const onMove = (e) => {
      e.preventDefault();
      point = { x: e.clientX, y: e.clientY };
      track();

      if (!drag.raf) {
        drag.raf = win.requestAnimationFrame(scroll);
      }
    };
    const onUp = () => endDrag(true);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        endDrag(false);
      }
    };

    doc.addEventListener('pointermove', onMove, true);
    doc.addEventListener('pointerup', onUp, true);
    doc.addEventListener('pointercancel', onUp, true);
    doc.addEventListener('keydown', onKey, true);
    win.document.addEventListener('keydown', onKey, true);

    drag = {
      doc,
      from,
      over: null,
      raf: 0,
      unhook() {
        win.cancelAnimationFrame(this.raf);
        doc.removeEventListener('pointermove', onMove, true);
        doc.removeEventListener('pointerup', onUp, true);
        doc.removeEventListener('pointercancel', onUp, true);
        doc.removeEventListener('keydown', onKey, true);
        win.document.removeEventListener('keydown', onKey, true);
      },
    };

    from.setAttribute(DIMMED, '');

    if (bar) {
      bar.hidden = true;
    }
  }

  let bound = null;

  /** The press listener on the canvas document there is now (a new document after a reload). */
  function bind() {
    const doc = page();

    if (doc && bound !== doc) {
      bound?.removeEventListener('pointerdown', onPress, true);
      doc.addEventListener('pointerdown', onPress, true);
      bound = doc;
    }
  }

  return {
    hover(node) {
      bind();
      hover(node);
    },
    owns,
    click,
    place,
    hide,
    stop() {
      endDrag(false);
      bound?.removeEventListener('pointerdown', onPress, true);
      bound = null;
      hide();
    },
  };
}
