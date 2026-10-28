/**
 * A loop's or a condition's settings in a popup beside what opened it.
 *
 * Owner: the HTML tree's inspector. Its model (htmlTreeUi.inspect, painted by
 * html-tree.js for the picked row) and its writes, drawn in the help popup's
 * look (LogicPopup.vue). The sidebar under the tree does not draw loops and
 * conditions; Build's Settings tab still does, from the same model.
 *
 * Opened by:
 *   - Build's Add → Loop / If (build-mode/boot.js `logic`), for the row just
 *     written, beside the Build panel;
 *   - a click on a loop or condition row in the HTML tree while help is on
 *     (html-tree.js), beside the tree.
 *
 * It shows once the tree stands on `path` — Build's write is picked by the
 * tree as part of the write, a row by its click — and from then on follows
 * that row by its key. The key survives edits to the tag; the path does not
 * (a loop switched from a field to a collection has a new name). Closed by
 * Escape, a pointer down outside it (the data menu it opens counts as its
 * own), or the pick moving to any other row.
 *
 * May import: cp/html-tree/store.js, cp/mount.js, cp/surfaces/LogicPopup.vue,
 *   dock/help-styles.js, lib/beside.js, lib/i18n.js.
 */
import { watch } from 'vue';
import { htmlTreeUi } from './cp/html-tree/store.js';
import { mountSurface } from './cp/mount.js';
import LogicPopup from './cp/surfaces/LogicPopup.vue';
import { ensureHelpStyles } from './dock/help-styles.js';
import { besideSpot } from './lib/beside.js';
import { t } from './lib/i18n.js';

const DATA_MENU = '[data-sve-data-menu]';

let current = null;

/**
 * @param {Window} win  the Control Panel's window
 * @param {{ path: string, at: Element, beside?: Element }} where
 *   `path`   the tree row the popup is for
 *   `at`     what was clicked; the popup stands level with it
 *   `beside` the column `at` sits in; the popup goes outside it. Without it,
 *            outside `at` itself.
 */
export function openLogicPopup(win, { path, at, beside } = {}) {
  closeLogicPopup();

  const doc = win?.document;

  if (!doc?.body || !path || !at) {
    return;
  }

  const mine = {
    win,
    row: at.getBoundingClientRect(),
    column: (beside || at).getBoundingClientRect(),
    key: '',
    host: null,
    app: null,
    el: null,
    observer: null,
    stop: null,
  };

  const onDown = (event) => {
    if (mine.el?.contains(event.target) || event.target.closest?.(DATA_MENU)) {
      return;
    }

    // What was typed in a box is committed on blur, as in the tree's panel;
    // the box goes away with the popup, so the blur is made to happen.
    if (mine.el?.contains(doc.activeElement)) {
      doc.activeElement.blur();
    }

    closeLogicPopup();
  };
  // On the window, ahead of the page's own Escape (Build's canvas lets go of
  // its pick on one). The data menu closes itself first.
  const onKey = (event) => {
    if (event.key !== 'Escape' || event.target?.closest?.(DATA_MENU)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    closeLogicPopup();
  };
  const onResize = () => place(mine);

  doc.addEventListener('pointerdown', onDown, true);
  win.addEventListener('keydown', onKey, true);
  win.addEventListener('resize', onResize);

  mine.unhook = () => {
    doc.removeEventListener('pointerdown', onDown, true);
    win.removeEventListener('keydown', onKey, true);
    win.removeEventListener('resize', onResize);
  };

  current = mine;

  mine.stop = watch(
    () => [htmlTreeUi.inspect?.logic, htmlTreeUi.inspect?.key, htmlTreeUi.inspect?.path],
    ([logic, key, rowPath]) => {
      if (!mine.key) {
        if (logic && rowPath === path) {
          mine.key = key;
          show(mine);
        }

        return;
      }

      if (!logic || key !== mine.key) {
        closeLogicPopup();
      }
    },
    { immediate: true }
  );
}

export function closeLogicPopup() {
  const mine = current;

  if (!mine) {
    return;
  }

  current = null;
  mine.stop?.();
  mine.unhook();
  mine.observer?.disconnect();
  mine.app?.unmount();
  mine.host?.remove();
}

function show(mine) {
  const doc = mine.win.document;

  ensureHelpStyles(doc);

  mine.host = doc.createElement('div');
  doc.body.appendChild(mine.host);
  mine.app = mountSurface(LogicPopup, mine.host, { closeLabel: t(mine.win, 'code_dock_help_close') });
  // The component's root is the fixed element the styles place; the host is
  // only where Vue was told to render.
  mine.el = mine.host.firstElementChild;

  if (!mine.el) {
    return;
  }

  mine.el.setAttribute('data-sve-logic-popup', '');
  // Choosing Collection over Field adds rows; the popup is placed again for
  // its new height, so it never runs off the bottom of the window.
  mine.observer = new mine.win.ResizeObserver(() => place(mine));
  mine.observer.observe(mine.el);
  place(mine);
}

function place(mine) {
  const { win, el } = mine;

  if (!el) {
    return;
  }

  const spot = besideSpot(
    mine.row,
    mine.column,
    { width: el.offsetWidth, height: el.offsetHeight },
    { width: win.innerWidth, height: win.innerHeight }
  );

  el.style.left = `${spot.left}px`;
  el.style.top = `${spot.top}px`;
}
