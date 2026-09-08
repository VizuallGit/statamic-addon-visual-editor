/**
 * The template dock, as everything else is allowed to see it.
 *
 * Same export names as code-dock.js, so the call sites read as they did. The
 * difference is when the editor arrives: `syncCodeDock` is the only door that
 * opens it, and it only opens it when the dock is both allowed and armed.
 *
 * Everything else here is a question about a dock that may not exist. Closing a
 * dock that was never opened, laying out one that is not on screen, dismissing
 * popups that were never shown — all no-ops, and answering them without the
 * editor loaded is the entire saving. A Control Panel page where nobody touches
 * the dock now never sees CodeMirror at all.
 */
import { isCodeDockArmed, templateDockAllowed } from './code-dock-state.js';

export { ARMED_KEY, isCodeDockArmed, setCodeDockArmed, templateDockAllowed } from './code-dock-state.js';

/** The real module, once something has genuinely needed it. */
let dock = null;
let loading = null;

/** True once the editor is here — the call sites never need to ask. */
export function codeDockLoaded() {
  return !!dock;
}

export function loadCodeDock() {
  if (dock) {
    return Promise.resolve(dock);
  }

  if (!loading) {
    loading = import('./code-dock.js')
      .then((mod) => {
        dock = mod;

        return mod;
      })
      .catch((err) => {
        loading = null;
        console.error('[sve] load template dock', err);

        throw err;
      });
  }

  return loading;
}

/**
 * Fetch the editor without opening anything — for a hover over the dock's
 * button, where the click is a fraction of a second away and the wait is the
 * whole complaint.
 */
export function prefetchCodeDock(win) {
  if (dock || loading || !templateDockAllowed(win)) {
    return;
  }

  void loadCodeDock().catch(() => {});
}

/**
 * The one call that may load the editor — and only when the dock is on. Every
 * preview render asks; a site with the dock switched off must never pay.
 */
export function syncCodeDock(win, doc, uid) {
  if (dock) {
    dock.syncCodeDock(win, doc, uid);

    return;
  }

  if (!win || !doc || !templateDockAllowed(win) || !isCodeDockArmed(win)) {
    return;
  }

  void loadCodeDock().then((mod) => mod.syncCodeDock(win, doc, uid));
}

export function closeCodeDock(doc) {
  dock?.closeCodeDock(doc);
}

export function closeCodeDockPopups(doc) {
  dock?.closeCodeDockPopups(doc);
}

export function relayoutCodeDock(win) {
  dock?.relayoutCodeDock(win);
}
