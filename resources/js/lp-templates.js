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
import { csrfToken } from './lib/csrf.js';
import { navigateFromLp } from './pages.js';

let opening = false;

/**
 * The board's own two gates, read as the server reads them: the feature is on
 * for this user (`sveFeatures` is already per user), and the utility is theirs
 * to open — Statamic's permission for every registered utility.
 */
export function templateBoardAllowed(win) {
  return (
    win.Statamic?.$config?.get?.('sveFeatures')?.collection_templates === true &&
    win.Statamic?.$permissions?.has?.('access template-board utility') === true
  );
}

/** An edit screen, arriving with Live Preview open. */
export function inLivePreview(win, url) {
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
 * Who is drawn with a template (`{ view }`), or which template draws an entry
 * (`{ entry }`): `{ view, name, everything, used_by, open }` from the server
 * (TemplateUsage), or null. Asked once per page load and kept: the answer
 * changes only when a collection is pointed at another template, and that is
 * a page load away anyway.
 */
const usages = new Map();

export function templateUsage(win, query) {
  const key = query.entry ? `entry:${query.entry}` : `view:${query.view}`;

  if (!usages.has(key)) {
    const params = new URLSearchParams(query.entry ? { entry: query.entry } : { view: query.view });

    usages.set(
      key,
      win
        .fetch(`/!/sve/template-usage?${params}`, {
          credentials: 'same-origin',
          headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
    );
  }

  return usages.get(key);
}

/**
 * Open one of the board's templates in Live Preview (`{ handle, slot }`, as
 * TemplateUsage names it), making its CP row first when it has none — the
 * request a card on the board makes. Unsaved work is asked about first.
 */
export async function openTemplateSlot(win, anchor, slot) {
  try {
    const res = await win.fetch('/!/sve/template-board', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
      },
      body: JSON.stringify({ handle: slot.handle, slot: slot.slot }),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok || !body.edit) {
      win.Statamic?.$toast?.error(t(win, 'html_tree_open_template_failed'));

      return;
    }

    navigateFromLp(win, anchor, inLivePreview(win, body.edit));
  } catch (err) {
    console.error('[sve] open template', err);
    win.Statamic?.$toast?.error(t(win, 'html_tree_open_template_failed'));
  }
}
