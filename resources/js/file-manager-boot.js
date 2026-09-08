/**
 * The file manager, waited for rather than carried.
 *
 * file-manager.js is a code editor — the same CodeMirror and Emmet the template
 * dock uses — and it has exactly one place to appear: its own Utilities page.
 * Loading it on every Control Panel page to find out whether that page is open
 * is the whole cost for none of the use.
 *
 * The page watch itself is cheap (see cp/page-watch.js — Inertia's own events,
 * not a standing observer), so it stays eager. What it guards is not.
 */
import { watchPage } from './cp/page-watch.js';

/** Kept in step with FILES_UTILITY_HOST in file-manager.js. */
const HOST_ID = 'sve-files-utility';

let files = null;
let loading = false;

export function initFileManager(win = window) {
  watchPage(win, () => {
    const here = !!win.document.getElementById(HOST_ID);

    if (files) {
      // Also on the way out: the module unmounts itself when its host is gone.
      files.syncFileManager(win);

      return;
    }

    if (!here || loading) {
      return;
    }

    loading = true;
    import('./file-manager.js')
      .then((mod) => {
        files = mod;
        mod.syncFileManager(win);
      })
      .catch((err) => {
        loading = false;
        console.error('[sve] load file manager', err);
      });
  });
}
