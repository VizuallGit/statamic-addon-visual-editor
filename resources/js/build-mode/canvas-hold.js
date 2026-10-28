/**
 * A menu's value held on Build's canvas while the pointer or the arrows are
 * on it, before anything is picked.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: cp/bus.js, lib/protocol.js, lib/element-kind.js,
 *   html-tree-parse.js, build-mode/canvas-paint.js, build-mode/place.js.
 * Bus: asks `dock:html`; listens to the `sve:tw-preview` event on the Control
 *   Panel's document.
 *
 * The Tailwind pane's menus — the ones Build's Style opens (`port.openValueMenu`,
 * the tools' menus) — say what a pick would write as they move
 * (tw-classes.js `sendPreview`: the tag's path and its would-be class value;
 * nothing when the menu moves off or closes; `keep` when the pick is being
 * written). The real preview's paint script holds that on the live page
 * (dock-instant-preview.js), and Build hides that page under its canvas — so
 * the canvas holds it too, on its own element for the same path. Only the
 * difference is applied (the classes the pick adds, and the ones it takes
 * away), never the raw value, which may carry Antlers the canvas has already
 * resolved. A paint of the section forgets the hold: the page's truth won.
 *
 * Switched with the dock's eye (dock-instant-preview.js, `sveInstantHover`):
 * off there, off here.
 */

import { ask } from '../cp/bus.js';
import { EVENT } from '../lib/protocol.js';
import { classesOf } from '../lib/element-kind.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import { CANVAS_PATH } from './canvas-paint.js';
import { findByPath } from './place.js';

/** The dock's eye: the key dock-instant-preview.js keeps it under (`HOVER_KEY`). */
const HOVER_KEY = 'sveInstantHover';

const tokens = (value) => String(value || '').split(/\s+/).filter(Boolean);

function hoverOn(win) {
  try {
    return win.localStorage.getItem(HOVER_KEY) !== 'off';
  } catch {
    return true;
  }
}

/**
 * @param {Window} win  the Control Panel window
 * @param {{ page: () => Document|null, compile: (classes: string) => void }} on
 *   `page` the canvas's document; `compile` the canvas's sheet with these
 *   classes beside the section's own ('' = the section's alone)
 */
export function canvasHold(win, { page, compile }) {
  let held = null;

  function restore() {
    if (!held) {
      return;
    }

    held.el.classList.remove(...held.added);
    held.el.classList.add(...held.removed);
    held = null;
    compile('');
  }

  function onPreview(event) {
    const detail = event?.detail;

    if (!detail) {
      restore();

      return;
    }

    // Being written: what shows stays until the paint brings the file's own.
    if (detail.keep) {
      held = null;

      return;
    }

    if (!detail.path || typeof detail.value !== 'string' || !hoverOn(win)) {
      return;
    }

    const doc = page();
    const el = doc?.querySelector(`[${CANVAS_PATH}="${win.CSS.escape(detail.path)}"]`);
    const html = ask('dock:html');
    const node = el && typeof html === 'string' ? findByPath(parseTemplateTree(html), detail.path) : null;

    restore();

    if (!node) {
      return;
    }

    const before = tokens(classesOf(html, node));
    const after = tokens(detail.value);
    const added = after.filter((name) => !before.includes(name) && !el.classList.contains(name));
    const removed = before.filter((name) => !after.includes(name) && el.classList.contains(name));

    if (!added.length && !removed.length) {
      return;
    }

    held = { el, added, removed };
    el.classList.remove(...removed);
    el.classList.add(...added);
    compile(added.join(' '));
  }

  win.document.addEventListener(EVENT.TW_PREVIEW, onPreview);

  return {
    /** The section was painted again: what it shows is the file's. */
    forget() {
      held = null;
    },
    stop() {
      win.document.removeEventListener(EVENT.TW_PREVIEW, onPreview);
      restore();
    },
  };
}
