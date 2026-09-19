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
import { lpHeader, currentEntryId } from './lib/live-preview.js';
import { HEADER_SURFACE, LP_BACK_ID, LP_BLUEPRINT_ID, LP_CHROME_H, LP_ICON_BTN_STYLE } from './lib/ids.js';
import { reloadEverything } from './lp-reload.js';

const API = '/!/sve/entry-blueprint';

const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="3" y="4" width="18" height="6" rx="1.5"></rect>' +
  '<rect x="3" y="14" width="18" height="6" rx="1.5"></rect>' +
  '</svg>';

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

export function ensureLpBlueprintButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const back = doc.getElementById(LP_BACK_ID);

  if (!header || !back) {
    return;
  }

  // Writing a blueprint is the developer's permission, like the Fieldsets
  // screen — an editor never sees the button.
  if (win.Statamic?.$permissions?.has?.('configure fields') !== true) {
    return;
  }

  let pill = doc.getElementById(LP_BLUEPRINT_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_BLUEPRINT_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;
    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEntryBlueprint(win);
    });
  }

  if (pill.innerHTML !== ICON) {
    pill.innerHTML = ICON;
  }

  pill.title = t(win, 'blueprint_title');
  pill.setAttribute('aria-label', pill.title);
  pill.style.opacity = '1';
  pill.style.background = HEADER_SURFACE;
  pill.style.padding = '0';
  pill.style.width = `${LP_CHROME_H - 4}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  // Left of Close. Never moved when it is already there: a Node.before on
  // every observer pass freezes Live Preview.
  if (pill.parentElement !== back.parentElement || pill.nextElementSibling !== back) {
    back.before(pill);
  }
}
