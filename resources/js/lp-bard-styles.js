/**
 * Bard styles, from the Live Preview top bar.
 *
 * The text styles Bard's toolbar offers — Title, the size dropdown, flow
 * spacing, a two-column wrapper — and the groups that gather styles into one
 * dropdown, made and changed in a popup instead of a PHP file.
 *
 * The list belongs to the bard-style addon: it stores it (the addon's settings
 * file, resources/addons/bard-style.yaml, which the starter kit ships) and
 * serves it at {cp}/bard-style/styles. This file asks for it and hands it to
 * the popup. Without the addon, or with one older than that API, there is no
 * icon. The top bar's icon is in cp-shell/header-toolbar.js.
 *
 * Bard builds its toolbar when the Control Panel loads, so a saved style
 * reaches the Bard buttons — and the Buttons list in a field's settings — on
 * the next load. The popup offers that load ("Reload now"): the reload
 * button's own, which lands back where the author was.
 */
import { t } from './lib/i18n.js';
import { cpRoot } from './lib/config.js';
import { csrfToken } from './lib/csrf.js';
import { reloadEverything } from './lp-reload.js';

let opening = false;

/**
 * The addon is there and new enough (it says where its list comes from), and
 * this user may change what a Bard field offers — `configure fields`, the
 * permission the server asks for on save.
 */
export function bardStylesAllowed(win) {
  return win.Statamic?.$config?.get?.('bard-styles-source') !== undefined
    && win.Statamic?.$permissions?.has?.('configure fields') === true;
}

function request(win, method, body) {
  return win
    .fetch(`${cpRoot(win)}/bard-style/styles`, {
      method,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    .then(async (res) => ({ ok: res.ok, status: res.status, data: await res.json().catch(() => null) }));
}

/** A list the popup offers values from; a missing addon (color-scheme) is an empty list. */
function list(win, path) {
  return win
    .fetch(`${cpRoot(win)}${path}`, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : []))
    .then((rows) => (Array.isArray(rows) ? rows : []))
    .catch(() => []);
}

/** The theme's fluid sizes (`size-500` …) and colors (`--primary-500` …). */
function tokens(win) {
  return Promise.all([list(win, '/bard-style/size-vars'), list(win, '/color-scheme/swatches')]).then(([sizes, swatches]) => ({
    sizes: sizes.map((row) => row?.handle).filter(Boolean),
    colors: swatches.map((row) => row?.var).filter(Boolean),
  }));
}

/**
 * Open the popup over the Control Panel. It is a chunk of its own, asked for
 * on the click: this file is loaded on every Control Panel page.
 */
export function openBardStyles(win) {
  if (opening || win.document.querySelector('[data-sve-bard-styles]')) {
    return;
  }

  opening = true;

  void (async () => {
    try {
      const [{ openCpOverlay }, { default: BardStyles }, { default: ChoiceDialog }] = await Promise.all([
        import('./cp/open-overlay.js'),
        import('./cp/surfaces/BardStyles.vue'),
        import('./cp/surfaces/ChoiceDialog.vue'),
      ]);

      const confirmClose = () =>
        new Promise((resolve) => {
          const dialog = openCpOverlay(win.document, ChoiceDialog, {
            title: t(win, 'bard_styles_unsaved_title'),
            body: t(win, 'bard_styles_unsaved_body'),
            buttons: [
              { value: 'cancel', label: t(win, 'cancel'), variant: 'muted' },
              { value: 'discard', label: t(win, 'bard_styles_discard'), variant: 'danger' },
              { value: 'save', label: t(win, 'bard_styles_save'), variant: 'primary' },
            ],
            onPick: (value) => {
              dialog.dismiss();
              resolve(value);
            },
            onClose: () => resolve('cancel'),
          });
        });

      openCpOverlay(win.document, BardStyles, {
        win,
        t: (key, replacements) => t(win, key, replacements),
        load: () => request(win, 'GET'),
        save: (payload) => request(win, 'PUT', payload),
        tokens: () => tokens(win),
        reload: () => reloadEverything(win),
        confirmClose,
        onClose: () => {},
      });
    } catch (err) {
      console.error('[sve] open bard styles', err);
      win.Statamic?.$toast?.error(t(win, 'bard_styles_load_failed'));
    } finally {
      opening = false;
    }
  })();
}
