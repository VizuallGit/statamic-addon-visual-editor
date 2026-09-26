/**
 * Which icons in the Live Preview topbar this user keeps in view.
 *
 * The row is drawn by cp-shell/header-toolbar.js, and its passes re-create
 * buttons and write their inline `display` over and over. So an icon the user
 * left out is not removed or restyled there: one stylesheet hides it, and
 * `!important` in a sheet outranks every inline style a pass sets. The buttons
 * stay in the DOM — their neighbours are placed after them, and "open" below
 * presses the real button, so a hidden tool opens the one way it always did.
 *
 * The Live Preview settings menu (⋮ → Top bar) is the only writer. A tool this
 * user has no access to never gets a button, so it never reaches that list.
 *
 * May import: chrome-prefs.js and lib/ — header-toolbar.js imports this file.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { HEADER_FRAME_PREFIX, HEADER_TOOLBAR_ID, TOOLBAR_HIDDEN_KEY } from './lib/ids.js';

const STYLE_ID = '__sve-toolbar-hidden';

/** On a hidden tool's button (and frame) while it is open from the menu. */
export const PEEK_ATTR = 'data-sve-peek';

/** Page settings: the way to the page's own fields. Never hidden. */
const ALWAYS_SHOWN = ['settings'];

const TOOL_KEY = /^[a-z][a-z0-9_]*$/;

function validKey(key) {
  return typeof key === 'string' && TOOL_KEY.test(key) && !ALWAYS_SHOWN.includes(key);
}

/** The tab keys this user left out, as stored. */
export function readHiddenTools(win) {
  let list;

  try {
    list = JSON.parse(chromeGet(win, TOOLBAR_HIDDEN_KEY) || '[]');
  } catch {
    list = [];
  }

  return Array.isArray(list) ? [...new Set(list.filter(validKey))] : [];
}

/**
 * The sheet that hides them. A framed tool (pages, globals) goes as a whole:
 * its control sits in the frame, and a control without its icon is a stray.
 */
export function hiddenToolbarCss(keys) {
  return keys
    .filter(validKey)
    .map(
      (key) =>
        `#${HEADER_TOOLBAR_ID} button[data-tab="${key}"]:not([${PEEK_ATTR}]),` +
        `#${HEADER_FRAME_PREFIX}${key}:not([${PEEK_ATTR}]){display:none!important}`
    )
    .join('\n');
}

/** Write the sheet for the stored list. Cheap enough for every toolbar pass. */
export function syncHiddenToolbarIcons(win) {
  const doc = win.document;
  const css = hiddenToolbarCss(readHiddenTools(win));
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

function writeHidden(win, keys) {
  if (keys.length) {
    chromeSet(win, TOOLBAR_HIDDEN_KEY, JSON.stringify(keys));
  } else {
    chromeRemove(win, TOOLBAR_HIDDEN_KEY);
  }

  syncHiddenToolbarIcons(win);
}

export function setToolbarToolShown(win, key, shown) {
  const next = readHiddenTools(win).filter((item) => item !== key);

  if (!shown && validKey(key)) {
    next.push(key);
  }

  writeHidden(win, next);
}

export function showAllToolbarTools(win) {
  writeHidden(win, []);
}

function toolbarButton(win, key) {
  return win.document.getElementById(HEADER_TOOLBAR_ID)?.querySelector(`button[data-tab="${key}"]`) || null;
}

/** The icons in the row, left to right, the way the menu lists them. */
export function toolbarTools(win) {
  const bar = win.document.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return [];
  }

  const hidden = readHiddenTools(win);

  return [...bar.querySelectorAll('button[data-tab]')]
    .filter((btn) => validKey(btn.dataset.tab))
    .map((btn) => ({
      key: btn.dataset.tab,
      label: btn.title || btn.getAttribute('data-tip') || btn.getAttribute('aria-label') || btn.dataset.tab,
      icon: btn.querySelector('svg')?.outerHTML || '',
      shown: !hidden.includes(btn.dataset.tab),
      open: btn.getAttribute('aria-pressed') === 'true',
      // The toolbar's own `display:none` (Patterns on a page without a page
      // builder): the tool exists for this user but has nothing to do here.
      here: btn.style.display !== 'none',
    }));
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
