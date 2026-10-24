/**
 * The site's collections, from the Live Preview top bar.
 *
 * Statamic's own Collections screen, in the drawer the blueprint opens in —
 * framed, so the listing, its search and its filters are Statamic's and stay
 * so. The one move the frame does not keep is to an entry — unsaved work asked
 * about first, either way:
 *
 *   - an entry that can be previewed (a routed collection, or a template of
 *     the editor's own stores) opens in Live Preview, the way a template
 *     picked from the board does;
 *   - an entry that cannot (a collection with no route: a form's messages, a
 *     set of testimonials) has no page to preview, so Live Preview is left for
 *     its ordinary publish form in the Control Panel.
 *
 * Which is which is the server's word (`svePreviewable`), not a guess here.
 * Everything else (into a collection, a filter, a new entry) moves the frame
 * as it would move the Control Panel.
 *
 * The HTML tree's "Used by" chips open the same drawer, straight at their own
 * collection or taxonomy. The icon is the top bar's (cp-shell/header-toolbar.js).
 */
import { t } from './lib/i18n.js';
import { cpRoot } from './lib/config.js';
import { entryOpenDecision } from './lib/entry-open.js';
import { inLivePreview } from './lp-templates.js';
import { leaveLpTo, navigateFromLp, previewableCollections } from './pages.js';

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
          const decision = entryOpenDecision(next, win.location.origin, previewableCollections(win));

          if (!decision) {
            return false;
          }

          // Shut before leaving: the unsaved question that may come next has
          // to be seen, and the drawer sits above everything.
          drawer?.dismiss();

          if (decision === 'preview') {
            navigateFromLp(win, anchor, inLivePreview(win, next));
          } else {
            leaveLpTo(win, new URL(next, win.location.href).toString());
          }

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
