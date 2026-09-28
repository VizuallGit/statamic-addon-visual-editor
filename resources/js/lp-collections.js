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
 * collection or taxonomy.
 */
import { t } from './lib/i18n.js';
import { cpRoot } from './lib/config.js';
import { lpHeader } from './lib/live-preview.js';
import {
  ENTRY_EDIT_PATH,
  HEADER_SURFACE,
  LP_BACK_ID,
  LP_BLUEPRINT_ID,
  LP_CHROME_H,
  LP_COLLECTIONS_ID,
  LP_ICON_BTN_STYLE,
  LP_TEMPLATES_ID,
} from './lib/ids.js';
import { inLivePreview } from './lp-templates.js';
import { navigateFromLp } from './pages.js';

// Books on a shelf: a collection, not a single page.
const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="m16 6 4 14"></path>' +
  '<path d="M12 6v14"></path>' +
  '<path d="M8 8v12"></path>' +
  '<path d="M4 4v16"></path>' +
  '</svg>';

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

/**
 * The button. Made here and put in the bar once; where it stands after that is
 * syncLpRightBarGaps' (lp-panel.js) — collections, templates, blueprint, Close
 * — so the buttons never take turns moving each other.
 *
 * No gate of its own: whoever is in Live Preview is editing an entry of some
 * collection, and the framed screen shows each person the collections
 * Statamic lets them see.
 */
export function ensureLpCollectionsButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const back = doc.getElementById(LP_BACK_ID);

  if (!header || !back) {
    return;
  }

  let pill = doc.getElementById(LP_COLLECTIONS_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_COLLECTIONS_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;
    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openCollections(win, { anchor: pill });
    });
  }

  if (pill.innerHTML !== ICON) {
    pill.innerHTML = ICON;
  }

  pill.title = t(win, 'lp_collections_title');
  pill.setAttribute('aria-label', pill.title);
  pill.style.opacity = '1';
  pill.style.background = HEADER_SURFACE;
  pill.style.padding = '0';
  pill.style.width = `${LP_CHROME_H - 4}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  if (!pill.isConnected) {
    (doc.getElementById(LP_TEMPLATES_ID) || doc.getElementById(LP_BLUEPRINT_ID) || back).before(pill);
  }
}
