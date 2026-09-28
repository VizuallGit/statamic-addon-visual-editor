/**
 * The site's collections, from the Live Preview top bar.
 *
 * Statamic's own Collections screen, in the drawer the blueprint opens in —
 * framed, so the listing, its search and its filters are Statamic's and stay
 * so. The one move the frame does not keep is to an entry: a page picked from
 * the listing opens in Live Preview, the way a template picked from the board
 * does — unsaved work asked about first. Everything else (into a collection, a
 * filter, a new entry) moves the frame as it would move the Control Panel.
 *
 * The HTML tree's "Used by" chips open the same drawer, straight at their own
 * collection or taxonomy. The icon is the top bar's (cp-shell/header-toolbar.js).
 */
import { t } from './lib/i18n.js';
import { cpRoot } from './lib/config.js';
import { ENTRY_EDIT_PATH } from './lib/ids.js';
import { inLivePreview } from './lp-templates.js';
import { navigateFromLp } from './pages.js';

let opening = false;

/**
 * Open the drawer on the Collections screen, or on `url` — a collection's or a
 * taxonomy's own listing — with `subtitle` beside the heading. The drawer is a
 * chunk of its own, asked for on the click: this file is loaded on every
 * Control Panel page.
 */
export function openCollections(win, { anchor = null, url = '', subtitle = '' } = {}) {
  if (opening) {
    return;
  }

  opening = true;

  void (async () => {
    try {
      const [{ openCpOverlay }, { default: FieldsetOverlay }] = await Promise.all([
        import('./cp/open-overlay.js'),
        import('./cp/surfaces/FieldsetOverlay.vue'),
      ]);

      let drawer = null;

      drawer = openCpOverlay(win.document, FieldsetOverlay, {
        heading: t(win, 'lp_collections_heading'),
        subtitle,
        src: url || `${cpRoot(win)}/collections`,
        closeLabel: t(win, 'close'),
        onNavigate: (next) => {
          if (!ENTRY_EDIT_PATH.test(new URL(next, win.location.href).pathname)) {
            return false;
          }

          // Shut before leaving: the unsaved question that may come next has
          // to be seen, and the drawer sits above everything.
          drawer?.dismiss();
          navigateFromLp(win, anchor, inLivePreview(win, next));

          return true;
        },
      });
    } catch (err) {
      console.error('[sve] open collections', err);
      win.Statamic?.$toast?.error(t(win, 'lp_collections_open_failed'));
    } finally {
      opening = false;
    }
  })();
}
