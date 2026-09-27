/**
 * The Templates board: every template this site can render, one row per
 * collection and taxonomy, with the site's own row first.
 *
 * Read-mostly. The rows come from `/!/sve/template-board`, which builds them
 * from the views folder — so a template scaffolded anywhere else appears here
 * the next time the page is opened, without this file knowing about it.
 *
 * Plain DOM on purpose: the page is a list of links, and a Vue app on a
 * Utilities page would have to be mounted, unmounted and kept in step with
 * Inertia for no gain. Colours come from the CP's own custom properties, so
 * the board follows the panel's theme instead of carrying a second one.
 *
 * May import: lib/ only. Does not touch preview / overlay / bridge.
 */
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';

/** Kept in step with HOST_ID in template-board-boot.js. */
const BOARD_HOST = 'sve-template-board';
const STYLE_ID = '__sve-template-board-style';

/**
 * The stylesheet is written here rather than imported.
 *
 * An async chunk's imported CSS is injected from Vite's base path, which is
 * not where a published addon lives — the <link> 404s in silence and the page
 * renders naked. Sizes are em/rem so the board follows the CP's type scale;
 * px only for hairlines.
 */
const CSS = `
#${BOARD_HOST} { display: flex; flex-direction: column; gap: 1.75rem; }
#${BOARD_HOST} [data-sve-tb-row] { display: flex; flex-direction: column; gap: .625rem; }
#${BOARD_HOST} [data-sve-tb-head] {
  display: flex; align-items: baseline; gap: .5rem;
  padding-bottom: .375rem; border-bottom: 1px solid var(--c-border, rgba(127,127,127,.25));
}
#${BOARD_HOST} [data-sve-tb-title] { font-weight: 600; line-height: 1; }
#${BOARD_HOST} [data-sve-tb-kind] { font-size: .8em; opacity: .55; line-height: 1; }
#${BOARD_HOST} [data-sve-tb-cards] {
  display: grid; gap: .75rem;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
}
#${BOARD_HOST} [data-sve-tb-card] {
  display: flex; flex-direction: column; gap: .3125rem;
  min-height: 5.5rem; padding: .75rem;
  border: 1px solid var(--c-border, rgba(127,127,127,.25));
  border-radius: .5rem;
  text-align: left; font: inherit; color: inherit; background: none;
}
#${BOARD_HOST} [data-sve-tb-card][data-filled] { cursor: pointer; }
#${BOARD_HOST} [data-sve-tb-card][data-filled]:hover { border-color: currentColor; }
#${BOARD_HOST} [data-sve-tb-card][data-empty] { border-style: dashed; align-items: center; justify-content: center; }
#${BOARD_HOST} [data-sve-tb-card][data-broken] { border-color: var(--c-danger, #dc2626); }
#${BOARD_HOST} [data-sve-tb-slot] { font-weight: 600; line-height: 1.2; }
#${BOARD_HOST} [data-sve-tb-file] { font-size: .8em; opacity: .6; font-family: ui-monospace, monospace; word-break: break-all; }
#${BOARD_HOST} [data-sve-tb-note] { font-size: .8em; }
#${BOARD_HOST} [data-sve-tb-card][data-broken] [data-sve-tb-note] { color: var(--c-danger, #dc2626); }
#${BOARD_HOST} [data-sve-tb-busy] { opacity: .5; pointer-events: none; }
`;

function ensureStyle(win) {
  if (win.document.getElementById(STYLE_ID)) {
    return;
  }

  const style = win.document.createElement('style');

  style.id = STYLE_ID;
  style.textContent = CSS;
  win.document.head.appendChild(style);
}

/**
 * A slot's name on screen. Falls back to the slot key, which is what makes a
 * missing translation visible rather than blank.
 */
function slotLabel(win, slot) {
  return t(win, `template_board_slot_${slot}`);
}

function el(win, tag, attrs = {}, text = '') {
  const node = win.document.createElement(tag);

  for (const [name, value] of Object.entries(attrs)) {
    if (value === null || value === false) {
      continue;
    }

    node.setAttribute(name, value === true ? '' : String(value));
  }

  if (text) {
    node.textContent = text;
  }

  return node;
}

function cardNode(win, host, row, card) {
  const filled = card.exists && !card.broken;
  const node = el(win, 'button', {
    type: 'button',
    'data-sve-tb-card': '',
    'data-slot': card.slot,
    'data-filled': filled || null,
    'data-empty': !card.exists && !card.broken ? '' : null,
    'data-broken': card.broken ? '' : null,
  });

  node.appendChild(el(win, 'span', { 'data-sve-tb-slot': '' }, slotLabel(win, card.slot)));

  if (card.broken) {
    node.appendChild(el(win, 'span', { 'data-sve-tb-file': '' }, `${card.view}.antlers.html`));
    node.appendChild(el(win, 'span', { 'data-sve-tb-note': '' }, t(win, 'template_board_broken')));
  } else if (card.exists) {
    node.appendChild(el(win, 'span', { 'data-sve-tb-file': '' }, card.file));
  } else {
    node.appendChild(el(win, 'span', { 'data-sve-tb-note': '' }, t(win, 'template_board_empty')));
  }

  node.addEventListener('click', () => onCard(win, host, row, card, node));

  return node;
}

/**
 * A filled card opens its template; an empty one makes it.
 *
 * A template with a CP row opens that row, because the row is what carries the
 * Live Preview target — a view file on its own has no entry and cannot be
 * previewed. The site's own views have no row, so those open in Site Files,
 * which is the editor that can write them today.
 */
function onCard(win, host, row, card, node) {
  if (card.broken) {
    return;
  }

  if (card.exists) {
    win.location.href = card.edit || filesUrl(win);

    return;
  }

  create(win, host, row, card, node);
}

function filesUrl(win) {
  const cp = win.Statamic?.$config?.get?.('cpUrl') || '/cp';

  return `${String(cp).replace(/\/$/, '')}/utilities/site-files`;
}

async function create(win, host, row, card, node) {
  node.setAttribute('data-sve-tb-busy', '');

  try {
    const res = await win.fetch('/!/sve/template-board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ handle: row.handle, slot: card.slot }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok || !body.ok) {
      node.removeAttribute('data-sve-tb-busy');
      win.Statamic?.$toast?.error(body.reason === 'exists' ? body.view : t(win, 'template_board_empty'));

      return;
    }

    // Straight into the new template when it has a row to open; otherwise the
    // board redraws with the card now filled.
    if (body.edit) {
      win.location.href = body.edit;

      return;
    }

    await paint(win, host);
  } catch (err) {
    node.removeAttribute('data-sve-tb-busy');
    console.error('[sve] create template', err);
  }
}

function rowNode(win, host, row) {
  const node = el(win, 'section', { 'data-sve-tb-row': '', 'data-handle': row.handle });
  const head = el(win, 'header', { 'data-sve-tb-head': '' });

  head.appendChild(el(win, 'h2', { 'data-sve-tb-title': '' }, row.title));

  if (row.kind !== 'site') {
    head.appendChild(el(win, 'span', { 'data-sve-tb-kind': '' }, row.handle));
  }

  node.appendChild(head);

  const cards = el(win, 'div', { 'data-sve-tb-cards': '' });

  for (const card of row.cards) {
    cards.appendChild(cardNode(win, host, row, card));
  }

  node.appendChild(cards);

  return node;
}

async function paint(win, host) {
  const res = await win.fetch('/!/sve/template-board', {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!res.ok) {
    return;
  }

  const body = await res.json().catch(() => null);
  const rows = Array.isArray(body?.rows) ? body.rows : [];

  // The host can go while the request is in flight — the reader navigated on.
  if (!win.document.contains(host)) {
    return;
  }

  host.textContent = '';

  for (const row of rows) {
    host.appendChild(rowNode(win, host, row));
  }
}

/**
 * Draw the board when its page is open; forget it when the page is gone.
 *
 * Called on every CP navigation, so the guard is the host element: Inertia
 * replaces the page's DOM, and the div the last paint drew into is not the one
 * on screen now.
 */
export function syncTemplateBoard(win = window) {
  const host = win.document.getElementById(BOARD_HOST);

  if (!host) {
    return;
  }

  if (host.dataset.svePainted === '1') {
    return;
  }

  host.dataset.svePainted = '1';
  ensureStyle(win);

  void paint(win, host);
}
