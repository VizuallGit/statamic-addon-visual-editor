/**
 * The layout's places in the Patterns panel: one header, one footer, and the
 * global sections drawn under every page's content.
 *
 * Only while Live Preview is on the layout itself — the template entry whose
 * view is `layout`. There is no page there to drop sections into, so the panel
 * has the layout's own tabs instead: Headers, Footers, Sections. What sits in
 * each place is stored on a global set (`statamic-visual-editor.layout`,
 * LayoutSlots on the server); a drop writes it there, the preview is drawn
 * again, and every page has it.
 *
 * Header and footer hold one each. While a place holds one, the other cards
 * stay in the list, greyed, saying the current one has to be deleted first —
 * a drop never replaces it. The card in use carries the trash that deletes it.
 *
 * May import: lib/, cp/. Talks to Live Preview through the bus only.
 */
import { t } from '../../lib/i18n.js';
import { csrfToken } from '../../lib/csrf.js';
import { collectionViewType } from '../../lib/collection-view.js';
import { LAYOUT_TEMPLATE_TYPE } from '../../lib/ids.js';
import { layoutCardStates } from './layout-cards.js';
import { ask } from '../bus.js';
import { openCpOverlay } from '../open-overlay.js';
import ChoiceDialog from '../surfaces/ChoiceDialog.vue';

const URL = '/!/sve/layout-slots';

/** The places, as the server last described them; null until asked. */
let slots = null;
let asking = null;
// Bumped by forget and by every write: an answer to a read that started
// before either is the state from before, and is dropped.
let epoch = 0;

/** True while Live Preview is on the layout. */
export function layoutOpen(win) {
  return collectionViewType(win) === LAYOUT_TEMPLATE_TYPE;
}

/** The panel's tabs on the layout, one per place. */
export function layoutTabs(win) {
  return ['header', 'footer', 'sections'].map((key) => ({ key, label: t(win, `layout_tab_${key}`) }));
}

/** The places as last read, or null before the first answer. */
export function layoutSlots() {
  return slots;
}

/**
 * Forget the last answer: the panel opening, or coming back to the layout,
 * asks again — the header may have been changed from the globals screen since.
 */
export function forgetLayoutSlots() {
  slots = null;
  asking = null;
  epoch++;
}

/** The site Live Preview edits — the CP's selected site — so a write lands in that site's globals. */
function site(win) {
  return String(win.Statamic?.$config?.get?.('selectedSite') || '');
}

/** Ask the server what is in the layout. One request at a time. */
export function loadLayoutSlots(win) {
  if (asking) {
    return asking;
  }

  const mine = epoch;
  const query = site(win) ? `?site=${encodeURIComponent(site(win))}` : '';
  const request = win
    .fetch(`${URL}${query}`, { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (mine === epoch) {
        slots = data?.slots && typeof data.slots === 'object' ? data.slots : {};
      }
    })
    .catch(() => {
      if (mine === epoch) {
        slots = {};
      }
    })
    .finally(() => {
      if (asking === request) {
        asking = null;
      }
    });

  asking = request;

  return request;
}

/**
 * The cards for one tab: `{ empty }` when there is nothing to show, else
 * `{ rows }` — each `{ key, title, item, opts }`, where `opts` says whether the
 * card is in use, greyed, removable, and what a drop of it does.
 *
 * `saved` is the library's saved sections (`/!/sve/saved-sections`); only the
 * global ones can go in the layout.
 */
export function layoutCards(win, tab, { query = '', saved = [], onChange = () => {} } = {}) {
  const cards = layoutCardStates(slots?.[tab], tab, { query, saved });

  if (cards === null) {
    return { empty: t(win, 'layout_no_place') };
  }

  if (!cards.length) {
    const none = tab === 'sections' ? 'no_global_sections' : 'layout_no_types';

    return { empty: t(win, query.trim() ? 'library_no_matches' : none) };
  }

  return {
    rows: cards.map((card) => {
      let opts;

      if (card.state === 'in') {
        opts = removable(win, tab, card.row, card.title, onChange, t(win, tab === 'sections' ? 'layout_in_layout' : 'layout_in_use'));
      } else if (card.state === 'blocked') {
        opts = { disabled: true, note: t(win, `layout_${tab}_taken`) };
      } else {
        opts = { onDrop: () => put(win, tab, card.value, onChange), dropLabel: t(win, 'layout_drop_here') };
      }

      return { ...card, opts };
    }),
  };
}

/** The card in use: a badge, and a trash that asks before it deletes. */
function removable(win, tab, row, name, onChange, badge) {
  return {
    badge,
    removeLabel: t(win, `layout_remove_${tab}`),
    onRemove: () => {
      const overlay = openCpOverlay(win.document, ChoiceDialog, {
        title: t(win, `layout_remove_title_${tab}`),
        body: t(win, `layout_remove_body_${tab}`, { name }),
        buttons: [
          { value: null, label: t(win, 'cancel'), variant: 'ghost' },
          { value: 'remove', label: t(win, 'layout_remove_confirm'), variant: 'danger' },
        ],
        onPick: (value) => {
          overlay.dismiss();

          if (value === 'remove') {
            void write(win, 'DELETE', { slot: tab, id: row.id }, onChange);
          }
        },
        onClose: () => {},
      });
    },
  };
}

function put(win, tab, value, onChange) {
  return write(win, 'POST', { slot: tab, value }, onChange);
}

/**
 * Write to the layout, then draw the preview again — the global set changed
 * on disk, and Live Preview only redraws by itself for changes made outside
 * the editor.
 *
 * The answer carries the dock's file for each half, too: after a header of
 * another set, stepping into the header opens that set's partial.
 */
async function write(win, method, body, onChange) {
  let data = null;

  epoch++;
  asking = null;

  try {
    const res = await win.fetch(URL, {
      method,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ ...body, site: site(win) }),
    });

    data = await res.json().catch(() => null);

    if (data?.slots) {
      slots = data.slots;
    }

    if (!res.ok || !data?.ok) {
      const taken = data?.error === 'taken' && (body.slot === 'header' || body.slot === 'footer');

      win.Statamic?.$toast?.error(t(win, taken ? `layout_${body.slot}_taken` : 'layout_failed'));
      onChange();

      return false;
    }
  } catch {
    win.Statamic?.$toast?.error(t(win, 'layout_failed'));

    return false;
  }

  const config = win.Statamic?.$config;

  if (data.chrome_templates && typeof config?.set === 'function') {
    config.set('sveChromeTemplates', data.chrome_templates);
  }

  onChange();
  ask('lp:replay', { win });

  return true;
}
