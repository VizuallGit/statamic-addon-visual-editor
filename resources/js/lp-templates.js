/**
 * The site's templates, from the Live Preview top bar.
 *
 * The Templates board (template-board.js) is a Utilities page: open it and the
 * editor is gone. Here it opens in the drawer the page's blueprint opens in,
 * over the page being edited, and a template picked from it opens in Live
 * Preview the way the page picker's entries do — unsaved work asked about
 * first.
 *
 * Drawn into the drawer rather than framed like the blueprint: a card's click
 * moves the window it is in, and in a frame that would be the frame.
 */
import { t } from './lib/i18n.js';
import { lpHeader } from './lib/live-preview.js';
import { HEADER_SURFACE, LP_BACK_ID, LP_BLUEPRINT_ID, LP_CHROME_H, LP_ICON_BTN_STYLE, LP_TEMPLATES_ID } from './lib/ids.js';
import { navigateFromLp } from './pages.js';

const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
  '<path d="M3 9h18"></path>' +
  '<path d="M9 21V9"></path>' +
  '</svg>';

let opening = false;

/**
 * The board's own two gates, read as the server reads them: the feature is on
 * for this user (`sveFeatures` is already per user), and the utility is theirs
 * to open — Statamic's permission for every registered utility.
 */
function allowed(win) {
  return (
    win.Statamic?.$config?.get?.('sveFeatures')?.collection_templates === true &&
    win.Statamic?.$permissions?.has?.('access template-board utility') === true
  );
}

/** The template's edit screen, arriving with Live Preview open. */
function inLivePreview(win, url) {
  const next = new URL(url, win.location.href);

  next.searchParams.set('live-preview', '1');

  return next.toString();
}

/**
 * Open the board in the drawer. The drawer and the board are chunks of their
 * own, asked for on the click — this file is loaded on every Control Panel page.
 */
export function openTemplateBoard(win, anchor = null) {
  if (opening) {
    return;
  }

  opening = true;

  void (async () => {
    try {
      const [{ openCpOverlay }, { default: FieldsetOverlay }, board] = await Promise.all([
        import('./cp/open-overlay.js'),
        import('./cp/surfaces/FieldsetOverlay.vue'),
        import('./template-board.js'),
      ]);

      let drawer = null;

      drawer = openCpOverlay(win.document, FieldsetOverlay, {
        heading: t(win, 'template_board_title'),
        closeLabel: t(win, 'close'),
        mount: (host) => board.mountTemplateBoard(win, host, {
          // Shut before leaving: the unsaved question that may come next has
          // to be seen, and the drawer sits above everything.
          onOpen: (url) => {
            board.unmountTemplateBoard(win);
            drawer?.dismiss();
            navigateFromLp(win, anchor, inLivePreview(win, url));
          },
        }),
        onClose: () => board.unmountTemplateBoard(win),
      });
    } catch (err) {
      console.error('[sve] open templates', err);
      win.Statamic?.$toast?.error(t(win, 'template_board_open_failed'));
    } finally {
      opening = false;
    }
  })();
}

/**
 * The button. Made here and put in the bar once; where it stands after that is
 * syncLpRightBarGaps' (lp-panel.js) — templates, blueprint, Close — so the two
 * never take turns moving each other.
 */
export function ensureLpTemplatesButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const back = doc.getElementById(LP_BACK_ID);

  if (!header || !back || !allowed(win)) {
    return;
  }

  let pill = doc.getElementById(LP_TEMPLATES_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_TEMPLATES_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;
    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openTemplateBoard(win, pill);
    });
  }

  if (pill.innerHTML !== ICON) {
    pill.innerHTML = ICON;
  }

  pill.title = t(win, 'lp_templates_title');
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
    (doc.getElementById(LP_BLUEPRINT_ID) || back).before(pill);
  }
}
