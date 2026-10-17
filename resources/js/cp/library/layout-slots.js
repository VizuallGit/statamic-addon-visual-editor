/**
 * Patterns on the layout: headers, footers and sections.
 *
 * Only while Live Preview is on the layout itself — the template entry whose
 * view is `layout`. The panel's tabs are then Headers, Footers and Sections.
 * A header or footer dragged onto the page is copied into the site's own
 * header or footer file and its fields into that global set (LayoutPatterns
 * on the server); one already there is replaced after asking. A section is
 * copied into the layout, inside `<main>` under the page's content, and can
 * only be dropped there.
 *
 * May import: lib/, cp/. Talks to Live Preview and the dock through the bus.
 */
import { t } from '../../lib/i18n.js';
import { csrfToken } from '../../lib/csrf.js';
import { collectionViewType } from '../../lib/collection-view.js';
import { LAYOUT_TEMPLATE_TYPE } from '../../lib/ids.js';
import { layoutCardStates } from './layout-cards.js';
import { ask } from '../bus.js';
import { openCpOverlay } from '../open-overlay.js';
import ChoiceDialog from '../surfaces/ChoiceDialog.vue';

const URL = '/!/sve/layout-patterns';
const PREVIEW_URL = '/!/sve/layout-pattern-preview';

/** The patterns, as the server last described them; null until asked. */
let slots = null;
let asking = null;
// Bumped by forget and by every write: an answer to a read that started
// before either is the state from before, and is dropped.
let epoch = 0;

/** True while Live Preview is on the layout. */
export function layoutOpen(win) {
  return collectionViewType(win) === LAYOUT_TEMPLATE_TYPE;
}

/** The panel's tabs on the layout. */
export function layoutTabs(win) {
  return ['header', 'footer', 'sections'].map((key) => ({ key, label: t(win, `layout_tab_${key}`) }));
}

/** The patterns as last read, or null before the first answer. */
export function layoutSlots() {
  return slots;
}

/** Forget the last answer: opening the panel on the layout asks again. */
export function forgetLayoutSlots() {
  slots = null;
  asking = null;
  epoch++;
}

/** Ask the server for the layout's patterns. One request at a time. */
export function loadLayoutSlots(win) {
  if (asking) {
    return asking;
  }

  const mine = epoch;
  const request = win
    .fetch(URL, { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (mine === epoch) {
        slots = data?.patterns && typeof data.patterns === 'object' ? data.patterns : {};
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
 * `{ rows }` — each `{ key, title, item, opts }`, `opts` saying what a drop
 * does and where it may land.
 */
export function layoutCards(win, tab, { query = '', onChange = () => {} } = {}) {
  const cards = layoutCardStates(slots, tab, { query });

  if (cards === null) {
    return { empty: t(win, 'layout_no_place') };
  }

  if (!cards.length) {
    return { empty: t(win, query.trim() ? 'library_no_matches' : 'layout_no_types') };
  }

  return {
    rows: cards.map((card) => {
      const previewUrl = `${PREVIEW_URL}?kind=${card.kind}&pattern=${encodeURIComponent(card.value)}`;

      return {
        ...card,
        // In use (or already in the layout): faded, not draggable.
        opts: card.state === 'in'
          ? { disabled: true, previewUrl }
          : {
              previewUrl,
              onDrop: () => drop(win, card, onChange),
              dropLabel: t(win, card.kind === 'section' ? 'layout_drop_main' : 'layout_drop_here'),
              target: card.kind === 'section' ? 'main' : 'frame',
            },
      };
    }),
  };
}

/** A header or footer over one already there asks first; then it is written. */
async function drop(win, card, onChange) {
  if (card.replaces && !(await askReplace(win, card))) {
    return;
  }

  await write(win, { kind: card.kind, pattern: card.value, replace: card.replaces }, onChange);
}

function askReplace(win, card) {
  return new Promise((resolve) => {
    const overlay = openCpOverlay(win.document, ChoiceDialog, {
      title: t(win, `layout_replace_title_${card.kind}`),
      body: t(win, `layout_replace_body_${card.kind}`, { name: card.title }),
      buttons: [
        { value: false, label: t(win, 'cancel'), variant: 'ghost' },
        { value: true, label: t(win, 'layout_replace_confirm'), variant: 'primary' },
      ],
      onPick: (value) => {
        overlay.dismiss();
        resolve(value === true);
      },
      onClose: () => resolve(false),
    });
  });
}

/**
 * Write, then draw the preview again and read the open file from disk — the
 * header, footer or layout file just changed under the dock.
 */
async function write(win, body, onChange) {
  epoch++;
  asking = null;

  try {
    const res = await win.fetch(URL, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);

    if (data?.patterns) {
      slots = data.patterns;
    }

    if (!res.ok || !data?.ok) {
      win.Statamic?.$toast?.error(t(win, 'layout_failed'));
      onChange();

      return false;
    }
  } catch {
    win.Statamic?.$toast?.error(t(win, 'layout_failed'));

    return false;
  }

  onChange();
  ask('lp:replay', { win });
  ask('dock:refresh', win);

  return true;
}
