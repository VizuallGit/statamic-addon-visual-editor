/**
 * The site's forms, from the Live Preview top bar.
 *
 * Statamic's own Forms screen, in the drawer the collections listing opens in.
 * Creating a form, naming it, adding its fields and wiring its email
 * notifications are all Statamic's screens, framed — there is no second form
 * builder here, and the blueprint an editor fills in is the one `{{ form:create }}`
 * renders from.
 *
 * Unlike the collections drawer, every move stays inside the frame: a form, its
 * fields, its submissions are all places to be while the page behind stays
 * open. Nothing in there navigates to an entry, so there is no `onNavigate`.
 *
 * Picking the new form into a section is the section's own form field; the
 * drawer does not reach into the publish form. The top bar's icon is in
 * cp-shell/header-toolbar.js.
 */
import { t } from './lib/i18n.js';
import { cpRoot } from './lib/config.js';

let opening = false;

/**
 * Can this user do anything useful on the Forms screen? `configure forms` is
 * the permission that creates a form and edits its fields — someone who may
 * only read submissions has no reason for the icon.
 */
export function formsAllowed(win) {
  return win.Statamic?.$permissions?.has?.('configure forms') === true;
}

/**
 * Open the drawer on the Forms screen, or on `url` — one form, its fields, its
 * submissions. The drawer is a chunk of its own, asked for on the click: this
 * file is loaded on every Control Panel page.
 */
export function openForms(win, { url = '', subtitle = '' } = {}) {
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

      openCpOverlay(win.document, FieldsetOverlay, {
        heading: t(win, 'lp_forms_heading'),
        subtitle,
        src: url || `${cpRoot(win)}/forms`,
        closeLabel: t(win, 'close'),
      });
    } catch (err) {
      console.error('[sve] open forms', err);
      win.Statamic?.$toast?.error(t(win, 'lp_forms_open_failed'));
    } finally {
      opening = false;
    }
  })();
}
