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
 * With no Live Preview column to borrow — the dock opened from a collection
 * template screen, say — nothing here happens and the fields stay in the right
 * pane, which is where they were before any of this.
 */

import { sve } from './cp-registry.js';
import { ask } from './cp/bus.js';
import { mountStatamicSurface } from './cp/mount-statamic.js';
import { componentPropsUi as ui } from './cp/component-props/store.js';
import { paintComponentProps } from './component-props-panel.js';
import ComponentSidebar from './cp/surfaces/ComponentSidebar.vue';
import { injectStyle } from './lib/style.js';
import { FOCUS_HEADER_ID } from './lib/ids.js';
import { soloSection } from './focus-panel.js';

const HOST_ID = 'sve-cprops-host';
const AWAY_ATTR = 'data-sve-cprops-away';
const STYLE_ID = 'sve-cprops-host-css';

let app = null;

/**
 * Put the focused section back in the column we just handed over.
 *
 * Statamic rebuilds the column while the component has it, and the solo goes
 * with the nodes it was applied to — so letting go leaves the page's own
 * fields showing and the section you are standing in nowhere to be seen. The
 * dock still knows which section it was opened for, which is the one to solo.
 *
 * Twice, because the column is often still rebuilding on the way out: the
 * first attempt has nothing to mark, the second lands.
 */
function restoreSolo(win) {
  const uid = ask('dock:current-uid');

  if (!uid || typeof soloSection !== 'function') {
    return;
  }

  const go = () => {
    if (!win.document.getElementById(HOST_ID)) {
      soloSection(uid, win.document, win);
    }
  };

  go();
  win.setTimeout(go, 250);
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

    if (child.id === FOCUS_HEADER_ID?.('data-sve-focus-header')) {
      return;
    }

    child.setAttribute(AWAY_ATTR, '');
  });
}
