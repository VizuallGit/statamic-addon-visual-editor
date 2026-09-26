/**
 * The Live Preview topbar as this user wants it: which icons show, in which
 * order, and the presets of their own.
 *
 * The row is drawn by cp-shell/header-toolbar.js, and its passes re-create
 * buttons and write their inline `display` over and over. So the icons are
 * neither removed, restyled nor moved there: one stylesheet hides and orders
 * them. `!important` in a sheet outranks every inline style a pass sets, and
 * the row is a flex box, so `order` places an icon without touching the DOM —
 * the buttons stay where their neighbours are placed after them, and "open"
 * below presses the real button, so a hidden tool opens the one way it always
 * did. Page settings is always first and always shown.
 *
 * The Live Preview settings menu (⋮ → Top bar) is the only writer. A tool this
 * user has no access to never gets a button, so it never reaches that list.
 *
 * May import: chrome-prefs.js and lib/ — header-toolbar.js imports this file.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import {
  HEADER_FRAME_PREFIX,
  HEADER_TOOLBAR_ID,
  TOOLBAR_HIDDEN_KEY,
  TOOLBAR_ORDER_KEY,
  TOOLBAR_PRESETS_KEY,
} from './lib/ids.js';
import { cleanPreset, inOrder } from './lib/toolbar-presets.js';

const STYLE_ID = '__sve-toolbar-hidden';

/** On a hidden tool's button (and frame) while it is open from the menu. */
export const PEEK_ATTR = 'data-sve-peek';

/** Page settings: the way to the page's own fields. Never hidden, never moved. */
const ALWAYS_SHOWN = ['settings'];

const TOOL_KEY = /^[a-z][a-z0-9_]*$/;

function validKey(key) {
  return typeof key === 'string' && TOOL_KEY.test(key) && !ALWAYS_SHOWN.includes(key);
}

function readKeys(win, storageKey) {
  let list;

  try {
    list = JSON.parse(chromeGet(win, storageKey) || '[]');
  } catch {
    list = [];
  }

  return Array.isArray(list) ? [...new Set(list.filter(validKey))] : [];
}

function writeKeys(win, storageKey, keys) {
  if (keys.length) {
    chromeSet(win, storageKey, JSON.stringify(keys));
  } else {
    chromeRemove(win, storageKey);
  }
}

/** The tab keys this user left out, as stored. */
export function readHiddenTools(win) {
  return readKeys(win, TOOLBAR_HIDDEN_KEY);
}

/** The tab keys in this user's order, as stored; empty = the order they are drawn in. */
export function readToolbarOrder(win) {
  return readKeys(win, TOOLBAR_ORDER_KEY);
}

/**
 * The sheet. A hidden framed tool (pages, globals) goes as a whole: its
 * control sits in the frame, and a control without its icon is a stray. An
 * ordered row pins Page settings in front; an icon the order does not know
 * (a tool added since) sits right after it.
 */
export function toolbarCss({ hidden = [], order = [] } = {}) {
  const rules = hidden
    .filter(validKey)
    .map(
      (key) =>
        `#${HEADER_TOOLBAR_ID} button[data-tab="${key}"]:not([${PEEK_ATTR}]),` +
        `#${HEADER_FRAME_PREFIX}${key}:not([${PEEK_ATTR}]){display:none!important}`
    );
  const ordered = order.filter(validKey);

  if (ordered.length) {
    rules.push(`#${HEADER_TOOLBAR_ID}>button[data-tab="settings"]{order:-1}`);
    ordered.forEach((key, index) => {
      rules.push(
        `#${HEADER_TOOLBAR_ID}>button[data-tab="${key}"],` +
          `#${HEADER_TOOLBAR_ID}>#${HEADER_FRAME_PREFIX}${key}{order:${index + 1}}`
      );
    });
  }

  return rules.join('\n');
}

/** Write the sheet for what is stored. Cheap enough for every toolbar pass. */
export function syncToolbarLayout(win) {
  const doc = win.document;
  const css = toolbarCss({ hidden: readHiddenTools(win), order: readToolbarOrder(win) });
  let style = doc.getElementById(STYLE_ID);

  if (!css) {
    style?.remove();

    return;
  }

  if (!style) {
    style = doc.createElement('style');
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }

  if (style.textContent !== css) {
    style.textContent = css;
  }
}

/** Replace the hidden list (a preset, Show all). */
export function setHiddenTools(win, keys) {
  writeKeys(win, TOOLBAR_HIDDEN_KEY, [...new Set(keys.filter(validKey))]);
  syncToolbarLayout(win);
}

export function setToolbarToolShown(win, key, shown) {
  const next = readHiddenTools(win).filter((item) => item !== key);

  if (!shown && validKey(key)) {
    next.push(key);
  }

  setHiddenTools(win, next);
}

export function showAllToolbarTools(win) {
  setHiddenTools(win, []);
}

/** Store the order; an empty list goes back to the order they are drawn in. */
export function setToolbarOrder(win, keys) {
  writeKeys(win, TOOLBAR_ORDER_KEY, [...new Set(keys.filter(validKey))]);
  syncToolbarLayout(win);
}

/** This user's own presets, as stored and cleaned. */
export function readUserPresets(win) {
  let list;

  try {
    list = JSON.parse(chromeGet(win, TOOLBAR_PRESETS_KEY) || '[]');
  } catch {
    list = [];
  }

  return Array.isArray(list) ? list.map((raw) => cleanPreset(raw, { user: true })).filter(Boolean) : [];
}

export function writeUserPresets(win, presets) {
  const clean = presets.map((raw) => cleanPreset(raw, { user: true })).filter(Boolean);

  if (clean.length) {
    chromeSet(win, TOOLBAR_PRESETS_KEY, JSON.stringify(clean));
  } else {
    chromeRemove(win, TOOLBAR_PRESETS_KEY);
  }
}

function toolbarButton(win, key) {
  return win.document.getElementById(HEADER_TOOLBAR_ID)?.querySelector(`button[data-tab="${key}"]`) || null;
}

/** The icons in the row, in this user's order, the way the menu lists them. */
export function toolbarTools(win) {
  const bar = win.document.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return [];
  }

  const hidden = readHiddenTools(win);
  const buttons = [...bar.querySelectorAll('button[data-tab]')].filter((btn) => validKey(btn.dataset.tab));
  const byKey = new Map(buttons.map((btn) => [btn.dataset.tab, btn]));

  return inOrder([...byKey.keys()], readToolbarOrder(win)).map((key) => {
    const btn = byKey.get(key);

    return {
      key,
      label: btn.title || btn.getAttribute('data-tip') || btn.getAttribute('aria-label') || key,
      icon: btn.querySelector('svg')?.outerHTML || '',
      shown: !hidden.includes(key),
      open: btn.getAttribute('aria-pressed') === 'true',
      // The toolbar's own `display:none` (Patterns on a page without a page
      // builder): the tool exists for this user but has nothing to do here.
      here: btn.style.display !== 'none',
    };
  });
}

/**
 * Press a tool's icon — also one the user hid.
 *
 * A hidden one is shown while it is open: pages and globals open their control
 * inside the icon's frame, and a panel or popover may be placed under its
 * icon. `aria-pressed` (painted by applyHeaderTab) says when it closes again;
 * a close before it was ever seen open is the pass that ran before the tool did.
 */
export function openToolbarTool(win, key) {
  const btn = toolbarButton(win, key);

  if (!btn) {
    return false;
  }

  if (readHiddenTools(win).includes(key) && btn.getAttribute('aria-pressed') !== 'true') {
    peek(win, btn, key);
  }

  btn.click();

  return true;
}

function peek(win, btn, key) {
  const frame = win.document.getElementById(`${HEADER_FRAME_PREFIX}${key}`);
  const els = frame ? [btn, frame] : [btn];
  let seenOpen = false;

  els.forEach((el) => el.setAttribute(PEEK_ATTR, ''));

  const observer = new win.MutationObserver(() => {
    if (btn.getAttribute('aria-pressed') === 'true') {
      seenOpen = true;

      return;
    }

    if (seenOpen) {
      els.forEach((el) => el.removeAttribute(PEEK_ATTR));
      observer.disconnect();
    }
  });

  observer.observe(btn, { attributes: true, attributeFilter: ['aria-pressed'] });
}
