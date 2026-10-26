/**
 * Where the component's fields are drawn.
 *
 * Inside a component, the left column is showing the fields of the *section*
 * the component sits in — which is not what you are working on. So while a
 * component is open the column is lent to the component: its fields, and the
 * way back out, in the place the eye already goes for "what am I editing".
 *
 * Lent, not taken. The page's own fields are hidden by an attribute of this
 * module's own, never removed, and the attribute goes when the component
 * closes. It is deliberately not the one the global-section route uses: both
 * can be up at once, and one letting go must not speak for the other.
 *
 * The selection panel (selection-panel.js) draws the selected row in the same
 * column. It reads the same store this host draws from, and while `open` or
 * `callOpen` is set it gives up the column's mark — so its rule never covers
 * this host, and this host's attribute is the one thing hiding the panel.
 * Nothing is said to it from here; the store is the word.
 *
 * With no Live Preview column to borrow — the dock opened from a collection
 * template screen, say — nothing here happens and the fields stay in the right
 * pane, which is where they were before any of this.
 */

import { ask } from './cp/bus.js';
import { mountStatamicSurface } from './cp/mount-statamic.js';
import { componentPropsUi as ui } from './cp/component-props/store.js';
import { paintComponentProps } from './component-props-panel.js';
import ComponentSidebar from './cp/surfaces/ComponentSidebar.vue';
import { injectStyle } from './lib/style.js';
import { selectRow } from './selection-panel.js';

const HOST_ID = 'sve-cprops-host';
const AWAY_ATTR = 'data-sve-cprops-away';
const STYLE_ID = 'sve-cprops-host-css';

let app = null;

/**
 * Put the section back in the column we just handed over: the dock still
 * knows which section the component was opened for, and the panel draws it
 * from the form's values — no column to mark, nothing to wait for.
 *
 * As the tree, not as the panel. 'panel' is the back arrow — the one source
 * that has not told the others — and the selection panel answers it by
 * activating the row in the preview (selection-panel.js `paint`). This is
 * not a new choice: the preview already marks this section and the dock
 * already holds its file. Said as 'panel', every click from a component row
 * onto a plain tag scrolled the preview to the section and opened an inline
 * edit on its first field — the panel jumped to "Link" and the page moved.
 */
function restoreSolo(win) {
  const uid = ask('dock:current-uid');

  if (uid && !win.document.getElementById(HOST_ID)) {
    selectRow(win, uid, 'tree');
  }
}

function drop(host) {
  try {
    app?.unmount();
  } catch {
    /* already gone */
  }

  app = null;
  host?.remove();
}

function column(doc) {
  return doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');
}

function ensureStyles(doc) {
  // Flows in the column rather than filling it: the column's own height is not
  // ours to assume, and a panel stretched against a height that is not there
  // collapses to nothing.
  injectStyle(doc, STYLE_ID, `[${AWAY_ATTR}]{display:none!important}#${HOST_ID}{display:block;min-width:0;flex:1 1 auto}`);
}

/**
 * Paint the fields, and put them where they belong.
 *
 * One call for both, so there is no state where the panel has been repainted
 * and the column has not — that gap is what leaves an empty sidebar behind.
 */
export function syncComponentProps(win) {
  paintComponentProps(win);
  syncComponentPropsHost(win);
}

export function syncComponentPropsHost(win) {
  const doc = win?.document;

  if (!doc) {
    return;
  }

  const host = doc.getElementById(HOST_ID);

  if (!ui.open && !ui.callOpen) {
    stopWatching();

    if (host) {
      drop(host);
      doc.querySelectorAll(`[${AWAY_ATTR}]`).forEach((el) => el.removeAttribute(AWAY_ATTR));

      restoreSolo(win);
    }

    ui.inSidebar = false;

    return;
  }

  const col = column(doc);

  if (!col) {
    // Nothing to borrow. The right pane draws them instead — same panel, same
    // store, so this is a change of address and not a second implementation.
    stopWatching();
    drop(host);
    ui.inSidebar = false;

    return;
  }

  ensureStyles(doc);

  // Mounted once and left alone. The panel reads a reactive store, so a repaint
  // is the store changing — remounting it on every keystroke would take the
  // caret out of whichever box was being typed in.
  if (!host || host.parentElement !== col) {
    stopWatching();
    drop(host);

    const made = doc.createElement('div');

    made.id = HOST_ID;
    col.appendChild(made);
    // Statamic's own registry, because the fields inside this panel are
    // Statamic's own — Bard, the asset browser, the page picker. Mounting them
    // as a second app inside this one's DOM is what threw `insertBefore`.
    app = mountStatamicSurface(ComponentSidebar, made);
  }

  ui.inSidebar = true;
  hideTheRest(col, doc.getElementById(HOST_ID));
  watchColumn(win);
}

/**
 * The column is Statamic's, and it re-renders on its own — a tab switch, a
 * saved value, a Live Preview replay after the component file is saved.
 * Anything that arrives while the component has the column has to step aside
 * too, or the section's fields come back underneath the panel.
 */
let unwatch = null;
let queued = false;

function watchColumn(win) {
  if (unwatch) {
    return;
  }

  // `document.body`, not `.live-preview-editor`. Saving a prop refreshes the
  // preview, and that replaces the editor node. An observer on the editor was
  // then watching a node that was no longer on the page — the panel stayed
  // gone, and the only way back in was to click the component again.
  const root = win.document.body;

  const observer = new win.MutationObserver(() => {
    if (queued) {
      return;
    }

    // Coalesced: this fires on every keystroke inside a Bard field down in the
    // same editor, and the answer to all of them is the same one check.
    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;

      if (!ui.open && !ui.callOpen) {
        return;
      }

      const host = win.document.getElementById(HOST_ID);
      const col = column(win.document);

      if (!col) {
        return;
      }

      if (!host || host.parentElement !== col) {
        syncComponentPropsHost(win);

        return;
      }

      hideTheRest(col, host);
    });
  });

  observer.observe(root, { childList: true, subtree: true });
  unwatch = () => observer.disconnect();
}

function stopWatching() {
  unwatch?.();
  unwatch = null;
}

/**
 * The column's other children step aside.
 *
 * The focus header is left alone — it names what is being edited, and every
 * other route in the column keeps it for the same reason.
 */
function hideTheRest(col, host) {
  [...col.children].forEach((child) => {
    if (child === host || child.id === STYLE_ID) {
      return;
    }

    child.setAttribute(AWAY_ATTR, '');
  });
}
