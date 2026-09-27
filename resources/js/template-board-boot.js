/**
 * The Templates board, waited for rather than carried.
 *
 * Same shape as file-manager-boot.js and for the same reason: the board has
 * exactly one place to appear — its own Utilities page — so loading it on
 * every Control Panel page to find out whether that page is open is the whole
 * cost for none of the use.
 *
 * The page watch itself is cheap (cp/page-watch.js — Inertia's own events, not
 * a standing observer), so it stays eager. What it guards is not.
 */
import { watchPage } from './cp/page-watch.js';

/** Kept in step with BOARD_HOST in template-board.js. */
const HOST_ID = 'sve-template-board';

let board = null;
let loading = false;

export function initTemplateBoard(win = window) {
  watchPage(win, () => {
    const here = !!win.document.getElementById(HOST_ID);

    if (board) {
      // Also on the way out: the module unmounts itself when its host is gone.
      board.syncTemplateBoard(win);

      return;
    }

    if (!here || loading) {
      return;
    }

    loading = true;
    import('./template-board.js')
      .then((mod) => {
        board = mod;
        mod.syncTemplateBoard(win);
      })
      .catch((err) => {
        loading = false;
        console.error('[sve] load template board', err);
      });
  });
}
