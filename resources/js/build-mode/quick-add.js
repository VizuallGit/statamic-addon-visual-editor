/**
 * The menu at a + on Build's canvas (BuildQuickAdd.vue): opened by the port's
 * `openPlus`, one at a time, and closed on a pick, a press outside it, Esc, a
 * scroll of the canvas or a resize.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: cp/mount.js, cp/surfaces/BuildQuickAdd.vue.
 * Bus messages: none.
 *
 * Its own app in a div on the Control Panel's body, as the CP's other
 * dropdowns are: Live Preview's stacking contexts would trap a fixed child of
 * the panel. Presses are watched in the Control Panel and in the canvas, which
 * is a document of its own.
 */

import { mountSurface } from '../cp/mount.js';
import BuildQuickAdd from '../cp/surfaces/BuildQuickAdd.vue';

export function quickAdd(win) {
  let app = null;
  let host = null;
  let unhooks = [];

  function close() {
    unhooks.forEach((unhook) => unhook());
    unhooks = [];
    app?.unmount();
    app = null;
    host?.remove();
    host = null;
  }

  const listen = (target, type, fn) => {
    target.addEventListener(type, fn, true);
    unhooks.push(() => target.removeEventListener(type, fn, true));
  };

  /**
   * @param {object} port
   * @param {string} path               where the pick goes (place.js)
   * @param {{ x: number, top: number, bottom: number }} at  the + in the Control Panel's coordinates
   * @param {Document[]} [docs]         other documents a press in closes it (the canvas)
   */
  function open(port, path, at, docs = []) {
    close();
    host = win.document.createElement('div');
    win.document.body.append(host);
    app = mountSurface(BuildQuickAdd, host, { port, path, at, onClose: close });

    const outside = (event) => {
      if (!host?.contains(event.target)) {
        close();
      }
    };
    const escape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    };

    for (const doc of new Set([win.document, ...docs])) {
      listen(doc, 'pointerdown', outside);
      listen(doc, 'keydown', escape);
    }

    docs.forEach((doc) => doc.defaultView && listen(doc.defaultView, 'scroll', close));
    listen(win, 'resize', close);
  }

  return { open, close };
}
