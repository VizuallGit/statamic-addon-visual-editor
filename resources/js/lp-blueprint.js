/**
 * The page's own fields, from the Live Preview top bar.
 *
 * A section's fields are a fieldset, opened from the section's row in the HTML
 * tree. A template's fields — a service page, a product — are the collection's
 * blueprint, and that belongs to the whole page rather than to one row of it.
 * So it sits in the top bar, beside the other things that are about the page.
 *
 * The Blueprints screen opens in the same drawer the fieldset does. What it
 * cannot do is change the form on screen: Statamic builds the publish form from
 * the blueprint at page load, so once the blueprint has been saved the page is
 * loaded again — the picker's own move, aimed at where we already are.
 */
import { t } from './lib/i18n.js';
import { currentEntryId } from './lib/live-preview.js';
import { reloadEverything } from './lp-reload.js';

const API = '/!/sve/entry-blueprint';

let opening = false;

function cpRoot(win) {
  return String(win.Statamic?.$config?.get?.('cpRoot') || '/cp').replace(/\/+$/, '');
}

/** Which blueprint this entry is edited with — the entry decides, a collection can have several. */
async function fetchEntryBlueprint(win) {
  const id = currentEntryId(win);

  if (!id) {
    return null;
  }

  const res = await win.fetch(`${API}?id=${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

/**
 * Open the blueprint in the drawer. The drawer and its overlay host are the
 * HTML tree's lazy chunk; asked for on the click, so this file — loaded on
 * every Control Panel page — does not pull them into the main bundle.
 */
export function openEntryBlueprint(win, { onClose } = {}) {
  if (opening) {
    return;
  }

  opening = true;

  void (async () => {
    try {
      const [found, { openCpOverlay }, { default: FieldsetOverlay }] = await Promise.all([
        fetchEntryBlueprint(win),
        import('./cp/open-overlay.js'),
        import('./cp/surfaces/FieldsetOverlay.vue'),
      ]);

      if (!found?.url) {
        win.Statamic?.$toast?.error(t(win, 'blueprint_open_failed'));

        return;
      }

      let saved = false;

      openCpOverlay(win.document, FieldsetOverlay, {
        heading: t(win, 'blueprint'),
        subtitle: found.title || found.handle,
        src: found.url.startsWith('http') ? found.url : `${cpRoot(win)}${found.url.replace(/^\/cp/, '')}`,
        closeLabel: t(win, 'close'),
        saveMatch: /\/blueprints\//,
        onSaved: () => {
          saved = true;
        },
        onClose: () => {
          onClose?.();

          // The form on screen was built from the blueprint as it was. Only a
          // real load shows the fields as they are now.
          if (saved) {
            reloadEverything(win);
          }
        },
      });
    } catch {
      win.Statamic?.$toast?.error(t(win, 'blueprint_open_failed'));
    } finally {
      opening = false;
    }
  })();
}

/**
 * Writing a blueprint is the developer's permission, like the Fieldsets
 * screen — an editor never gets the icon.
 */
export function blueprintAllowed(win) {
  return win.Statamic?.$permissions?.has?.('configure fields') === true;
}
