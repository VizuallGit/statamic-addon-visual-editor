/**
 * The Templates board: three columns — the site's own, the collections', the
 * taxonomies'.
 *
 * A column is a stack of cards; a card is a template you can open. That is the
 * whole screen: no paths to read and no settings on the face of it. What a
 * column is missing is offered under the + in its header, not drawn as a hole
 * in the stack.
 *
 * Read-mostly. The data comes from `/!/sve/template-board`, which builds it
 * from the views folder — so a template scaffolded anywhere else appears here
 * the next time the page is opened, without this file knowing about it.
 *
 * Plain DOM on purpose: the page is a grid of links, and a Vue app on a
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
const MENU_ID = '__sve-template-board-menu';

/**
 * The columns, in reading order: the site's own first, then one per collection
 * and one per taxonomy.
 *
 * A column per source, not one column holding them all. A new collection is a
 * new column, which is the question anyone opening this screen is asking —
 * "what templates does Services have" — and a single stack of every
 * collection's cards answers it by making you read the whole pile.
 */
function columns(win, rows) {
  const site = rows.filter((row) => row.kind === 'site');
  const rest = rows.filter((row) => row.kind !== 'site');

  return [
    { id: 'site', title: t(win, 'template_board_group_site'), rows: site },
    ...rest.map((row) => ({ id: row.handle, title: row.title, rows: [row] })),
  ];
}

/**
 * The stylesheet is written here rather than imported.
 *
 * An async chunk's imported CSS is injected from Vite's base path, which is
 * not where a published addon lives — the <link> 404s in silence and the page
 * renders naked. Sizes are em/rem so the board follows the CP's type scale;
 * px only for hairlines.
 */
const CSS = `
#${BOARD_HOST} { --sve-tb-card: 10.25rem; --sve-tb-line: 1px solid var(--c-border, rgba(127,127,127,.2)); }
#${BOARD_HOST} [data-sve-tb-board] { display: flex; align-items: stretch; min-height: 24rem; }
#${BOARD_HOST} [data-sve-tb-col] {
  display: flex; flex-direction: column; flex: 0 0 auto;
  width: calc(var(--sve-tb-card) + 3.25rem);
  border-right: var(--sve-tb-line);
}
#${BOARD_HOST} [data-sve-tb-col]:last-child { border-right: 0; }

/* The header band across the tops of the columns. */
#${BOARD_HOST} [data-sve-tb-head] {
  display: flex; align-items: center; gap: .4375rem;
  height: 2.875rem; padding: 0 1.125rem; line-height: 1;
  background: var(--c-bg-secondary, rgba(127,127,127,.07));
  border-right: var(--sve-tb-line);
}
#${BOARD_HOST} [data-sve-tb-col]:last-child [data-sve-tb-head] { border-right: 0; }
#${BOARD_HOST} [data-sve-tb-title] { font-size: .9375rem; white-space: nowrap; }
#${BOARD_HOST} [data-sve-tb-add] {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.375em; height: 1.375em; line-height: 1;
  font-size: 1em; border: 0; border-radius: .25rem;
  background: none; color: inherit; opacity: .6; cursor: pointer;
}
#${BOARD_HOST} [data-sve-tb-add]:hover { opacity: 1; background: rgba(127,127,127,.2); }

#${BOARD_HOST} [data-sve-tb-stack] { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem 1.125rem; }

/* A card: the thumbnail, with its name under it. */
#${BOARD_HOST} [data-sve-tb-card] {
  display: block; width: var(--sve-tb-card);
  padding: 0; border: 0; background: none; color: inherit;
  font: inherit; text-align: left; cursor: pointer;
}
#${BOARD_HOST} [data-sve-tb-shot] {
  display: block; height: 12.5rem; border-radius: .25rem;
  background-color: rgba(127,127,127,.08);
  background-image: repeating-linear-gradient(-45deg, rgba(127,127,127,.1) 0 .625rem, transparent .625rem 1.25rem);
}
#${BOARD_HOST} [data-sve-tb-card]:hover [data-sve-tb-shot] { outline: 1px solid currentColor; }
#${BOARD_HOST} [data-sve-tb-label] { display: block; margin-top: .625rem; font-size: .8125rem; font-weight: 600; line-height: 1.3; }
#${BOARD_HOST} [data-sve-tb-note] { display: block; font-size: .75rem; opacity: .45; line-height: 1.3; }
#${BOARD_HOST} [data-sve-tb-card][data-broken] [data-sve-tb-shot] { outline: 1px solid var(--c-danger, #dc2626); }
#${BOARD_HOST} [data-sve-tb-card][data-broken] [data-sve-tb-note] { color: var(--c-danger, #dc2626); opacity: 1; }

/* An empty column says so once, in the space a card would take. */
#${BOARD_HOST} [data-sve-tb-none] {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .875rem;
  width: var(--sve-tb-card); height: 12.5rem; padding: 1rem;
  border: var(--sve-tb-line); border-radius: .25rem;
  text-align: center; font-size: .8125rem; line-height: 1.45; opacity: .7;
}
#${BOARD_HOST} [data-sve-tb-busy] { opacity: .45; pointer-events: none; }

/* The add menu is appended to <body>: a panel's stacking context traps it. */
#${MENU_ID} {
  position: fixed; z-index: 99999; min-width: 12rem; max-height: 20rem; overflow-y: auto; padding: .3125rem;
  border: 1px solid var(--c-border, rgba(127,127,127,.3)); border-radius: .5rem;
  background: var(--c-bg, #262626); box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.4);
}
#${MENU_ID} button {
  display: block; width: 100%; padding: .5rem .625rem; line-height: 1.2;
  border: 0; border-radius: .3125rem; background: none;
  color: var(--c-text, inherit); font: inherit; text-align: left; cursor: pointer;
}
#${MENU_ID} button:hover { background: rgba(127,127,127,.22); }
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

/** A slot's name on screen; the key shows through when a string is missing. */
const slotLabel = (win, slot) => t(win, `template_board_slot_${slot}`);

/**
 * What a card calls itself.
 *
 * The site's templates are named by what they are — Layout, 404. A
 * collection's are named by whose they are, because a column full of cards
 * called "Show" says nothing.
 */
function cardLabel(win, row, card) {
  return slotLabel(win, card.slot);
}

// ===== the add menu =====

function closeMenu(win) {
  win.document.getElementById(MENU_ID)?.remove();
}

/**
 * What this column could still have, offered where the + was.
 *
 * Appended to <body> rather than to the column: a panel makes its own stacking
 * context, and a menu inside one is clipped by it.
 */
function openMenu(win, button, missing) {
  closeMenu(win);

  if (!missing.length) {
    return;
  }

  const menu = el(win, 'div', { id: MENU_ID });
  const box = button.getBoundingClientRect();

  menu.style.left = `${Math.round(box.left)}px`;
  menu.style.top = `${Math.round(box.bottom + 4)}px`;

  for (const { row, card } of missing) {
    const item = el(win, 'button', { type: 'button' }, cardLabel(win, row, card));

    item.addEventListener('click', () => {
      closeMenu(win);
      void open(win, row, card, button);
    });
    menu.appendChild(item);
  }

  win.document.body.appendChild(menu);

  const away = (event) => {
    if (!menu.contains(event.target) && event.target !== button) {
      closeMenu(win);
      win.removeEventListener('pointerdown', away, true);
    }
  };

  win.addEventListener('pointerdown', away, true);
}

// ===== cards =====

function cardNode(win, row, card) {
  const node = el(win, 'button', {
    type: 'button',
    'data-sve-tb-card': '',
    'data-slot': card.slot,
    'data-broken': card.broken ? '' : null,
    title: card.file || card.view,
  });

  node.appendChild(el(win, 'span', { 'data-sve-tb-shot': '' }));
  node.appendChild(el(win, 'span', { 'data-sve-tb-label': '' }, cardLabel(win, row, card)));

  if (card.broken) {
    node.appendChild(el(win, 'span', { 'data-sve-tb-note': '' }, t(win, 'template_board_broken')));
  } else if (card.shared) {
    node.appendChild(el(win, 'span', { 'data-sve-tb-note': '' }, t(win, 'template_board_shared_short')));
    node.title = t(win, 'template_board_shared');
  }

  node.addEventListener('click', () => {
    if (!card.broken) {
      void open(win, row, card, node);
    }
  });

  return node;
}

/**
 * Open a template — making its CP row first if it has none.
 *
 * A view file is not an entry, and Live Preview can only open an entry. The
 * row is the door; the board makes it on demand rather than asking anyone to
 * create one by hand.
 */
async function open(win, row, card, anchor) {
  if (card.edit) {
    win.location.href = card.edit;

    return;
  }

  anchor?.setAttribute('data-sve-tb-busy', '');

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

    if (!res.ok || !body.ok || !body.edit) {
      anchor?.removeAttribute('data-sve-tb-busy');
      win.Statamic?.$toast?.error(body.view || card.view);

      return;
    }

    win.location.href = body.edit;
  } catch (err) {
    anchor?.removeAttribute('data-sve-tb-busy');
    console.error('[sve] open template', err);
  }
}

// ===== columns =====

function columnNode(win, group) {
  const node = el(win, 'section', { 'data-sve-tb-col': '', 'data-group': group.id });
  const head = el(win, 'header', { 'data-sve-tb-head': '' });

  head.appendChild(el(win, 'span', { 'data-sve-tb-title': '' }, group.title));

  const here = [];
  const missing = [];

  for (const row of group.rows) {
    for (const card of row.cards) {
      (card.exists || card.broken ? here : missing).push({ row, card });
    }
  }

  if (missing.length) {
    const add = el(win, 'button', { type: 'button', 'data-sve-tb-add': '', title: t(win, 'template_board_create') }, '+');

    add.addEventListener('click', (event) => {
      event.stopPropagation();
      openMenu(win, add, missing);
    });
    head.appendChild(add);
  }

  node.appendChild(head);

  const stack = el(win, 'div', { 'data-sve-tb-stack': '' });

  for (const { row, card } of here) {
    stack.appendChild(cardNode(win, row, card));
  }

  if (!here.length) {
    const none = el(win, 'div', { 'data-sve-tb-none': '' });

    none.appendChild(el(win, 'span', {}, t(win, 'template_board_none')));

    const plus = el(win, 'button', { type: 'button', 'data-sve-tb-add': '', title: t(win, 'template_board_create') }, '+');

    plus.addEventListener('click', (event) => {
      event.stopPropagation();
      openMenu(win, plus, missing);
    });
    none.appendChild(plus);
    stack.appendChild(none);
  }

  node.appendChild(stack);

  return node;
}

async function paint(win, host) {
  if (!host) {
    return;
  }

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

  const board = el(win, 'div', { 'data-sve-tb-board': '' });

  for (const group of columns(win, rows)) {
    board.appendChild(columnNode(win, group));
  }

  host.appendChild(board);
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
    closeMenu(win);

    return;
  }

  if (host.dataset.svePainted === '1') {
    return;
  }

  host.dataset.svePainted = '1';
  ensureStyle(win);

  void paint(win, host);
}
