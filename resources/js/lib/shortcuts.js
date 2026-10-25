/**
 * Keyboard shortcuts as plain data: what a shortcut is, how a keydown becomes
 * one, how it is shown, and which one an action has. Nothing else reads a
 * keydown for a shortcut.
 *
 * A shortcut is written `mod+ctrl+alt+shift+<key>`, in that order, lower case.
 * `mod` is ⌘ on a Mac and Ctrl elsewhere; `ctrl` is the Mac's own Control key.
 * Elsewhere Ctrl is `mod`, and the Windows key never makes a shortcut. The key
 * is a letter, a digit or a name (`comma`, `period`, `slash`, `semicolon`,
 * `quote`, `bracketleft`, `bracketright`, `backslash`, `minus`, `equal`). A
 * shortcut needs `mod`, `ctrl` or `alt`: a plain letter is typing, never a
 * shortcut. `none` is a layer saying "no shortcut here".
 *
 * An action is `tool:<data-tab>` for a top-bar icon and `size:<handle>` for a
 * screen size. Three layers say which shortcut an action has, the last that
 * names it winning: built in (PHP `Shortcuts::DEFAULTS`, the only copy of that
 * list), the site (the addon settings — a size's own on its breakpoint row) and
 * the user (the chrome preference `sve-shortcuts`). The locked list is PHP's
 * too (`Shortcuts::LOCKED`); both reach the Control Panel as `sveShortcuts`.
 *
 * The grammar is also PHP's `Shortcuts::normalize()`. The two are held in step
 * by tests/js/fixtures/shortcut-combos.json, which both test suites read.
 *
 * May import: nothing.
 */

export const NONE = 'none';

/** In the order a shortcut is written. */
const MODIFIERS = ['mod', 'ctrl', 'alt', 'shift'];

/** A key that is not a letter or a digit: its name → the character it is, and its `event.code`. */
const NAMED = {
  comma: [',', 'Comma'],
  period: ['.', 'Period'],
  slash: ['/', 'Slash'],
  semicolon: [';', 'Semicolon'],
  quote: ["'", 'Quote'],
  bracketleft: ['[', 'BracketLeft'],
  bracketright: [']', 'BracketRight'],
  backslash: ['\\', 'Backslash'],
  minus: ['-', 'Minus'],
  equal: ['=', 'Equal'],
};

const BY_CHAR = Object.fromEntries(Object.entries(NAMED).map(([name, [char]]) => [char, name]));
const BY_CODE = Object.fromEntries(Object.entries(NAMED).map(([name, [, code]]) => [code, name]));

const ACTION = /^(tool|size):[a-z][a-z0-9_]*$/;

/** Apple's order for the symbols: ⌃⌥⇧⌘. */
const MAC_ORDER = ['ctrl', 'alt', 'shift', 'mod'];
const MAC_SYMBOL = { ctrl: '⌃', alt: '⌥', shift: '⇧', mod: '⌘' };
const PC_WORD = { mod: 'Ctrl', ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift' };

const isKeyName = (key) => /^[a-z0-9]$/.test(key) || Object.hasOwn(NAMED, key);

/**
 * A Mac, by the platform the browser names — `macOS` in userAgentData,
 * `MacIntel` in the older `platform`.
 */
export function isMac(nav = globalThis.navigator) {
  const platform = nav?.userAgentData?.platform || nav?.platform || '';

  return /mac/i.test(String(platform));
}

/** `ctrl+Shift+ F` → `ctrl+shift+f`; '' when it is not a shortcut; `none` stays `none`. */
export function normalizeCombo(text) {
  if (typeof text !== 'string') {
    return '';
  }

  const parts = text.trim().toLowerCase().split('+').map((part) => part.trim());

  if (parts.length === 1 && parts[0] === NONE) {
    return NONE;
  }

  if (parts.length < 2 || parts.some((part) => !part)) {
    return '';
  }

  const key = parts.pop();

  if (!isKeyName(key) || new Set(parts).size !== parts.length || parts.some((part) => !MODIFIERS.includes(part))) {
    return '';
  }

  if (!parts.some((part) => part !== 'shift')) {
    return '';
  }

  return [...MODIFIERS.filter((mod) => parts.includes(mod)), key].join('+');
}

function keyFromKey(key) {
  if (typeof key !== 'string') {
    return '';
  }

  const lower = key.toLowerCase();

  return /^[a-z0-9]$/.test(lower) ? lower : BY_CHAR[key] || '';
}

function keyFromCode(code) {
  if (typeof code !== 'string') {
    return '';
  }

  const letter = code.match(/^Key([A-Z])$/);
  const digit = code.match(/^(?:Digit|Numpad)([0-9])$/);

  if (letter) {
    return letter[1].toLowerCase();
  }

  return digit ? digit[1] : BY_CODE[code] || '';
}

/**
 * The shortcut a keydown is, or '' when it is none.
 *
 * None when a field used the key already (`defaultPrevented` — ⌘B is bold in
 * Bard), when the key repeats or an IME is composing, when AltGr is down (on a
 * Danish Windows keyboard that is Ctrl+Alt: AltGr+E is €), when the Windows key
 * is down, and without `mod`, `ctrl` or `alt` — so typing and the editor's own
 * plain `+`/`-` are never touched. With ⌥ the key is read from `event.code`, as
 * ⌥ on a Mac changes `event.key` (⌥T is «†»); otherwise from `event.key`, so the
 * keyboard's own layout counts, and from `event.code` when the key is not one a
 * shortcut can have.
 */
export function comboFromEvent(event, mac = false) {
  if (!event || event.defaultPrevented || event.repeat || event.isComposing) {
    return '';
  }

  if (typeof event.getModifierState === 'function' && event.getModifierState('AltGraph')) {
    return '';
  }

  if (!mac && event.metaKey) {
    return '';
  }

  const mods = [];

  if (mac ? event.metaKey : event.ctrlKey) {
    mods.push('mod');
  }

  if (mac && event.ctrlKey) {
    mods.push('ctrl');
  }

  if (event.altKey) {
    mods.push('alt');
  }

  if (event.shiftKey) {
    mods.push('shift');
  }

  if (!mods.some((mod) => mod !== 'shift')) {
    return '';
  }

  const key = event.altKey ? keyFromCode(event.code) : keyFromKey(event.key) || keyFromCode(event.code);

  return key ? [...mods, key].join('+') : '';
}

/** `mod+shift+f` → `⇧⌘F` on a Mac, `Ctrl+Shift+F` elsewhere; '' for none. */
export function formatCombo(combo, mac = false) {
  const clean = normalizeCombo(combo);

  if (!clean || clean === NONE) {
    return '';
  }

  const mods = clean.split('+');
  const key = mods.pop();
  const shown = NAMED[key]?.[0] ?? key.toUpperCase();

  if (mac) {
    return MAC_ORDER.filter((mod) => mods.includes(mod)).map((mod) => MAC_SYMBOL[mod]).join('') + shown;
  }

  return [...new Set(mods.map((mod) => PC_WORD[mod])), shown].join('+');
}

/** Taken by the browser, Statamic, the system or text editing — never a shortcut of ours. */
export function isLocked(combo, locked = []) {
  const clean = normalizeCombo(combo);

  return !!clean && clean !== NONE && Array.isArray(locked) && locked.some((item) => normalizeCombo(item) === clean);
}

/** One layer, clean: { action: combo | 'none' } — unknown actions, broken and locked shortcuts dropped. */
export function cleanShortcutMap(raw, locked = []) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const out = {};

  Object.entries(raw).forEach(([action, value]) => {
    const combo = normalizeCombo(value);

    if (ACTION.test(action) && combo && !isLocked(combo, locked)) {
      out[action] = combo;
    }
  });

  return out;
}

/**
 * The site's layer: the addon setting, and each screen size's own shortcut
 * from its row in the breakpoint list (`size:<handle>`), which says it last.
 */
export function siteShortcuts(site, rows = [], locked = []) {
  const out = cleanShortcutMap(site, locked);

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const action = `size:${row?.handle}`;
    const combo = normalizeCombo(row?.shortcut);

    if (ACTION.test(action) && combo && !isLocked(combo, locked)) {
      out[action] = combo;
    }
  });

  return out;
}

/**
 * Which shortcut each action has, and the layer it comes from (0 built in,
 * 1 site, 2 user).
 *
 * The last layer that names an action wins, `none` meaning none. Then a
 * shortcut two actions would share goes to the one whose layer is higher — a
 * user's own over the site's, the site's over the built-in — and between two
 * of one layer to the one the built-in list names first, then alphabetically:
 * one keypress is always one action. Broken entries count as absent.
 */
export function resolveShortcutLayers(builtIn, site, user) {
  const maps = [builtIn, site, user].map((layer) => cleanShortcutMap(layer));
  const later = [...new Set([...Object.keys(maps[1]), ...Object.keys(maps[2])])].filter((action) => !Object.hasOwn(maps[0], action)).sort();
  const order = [...Object.keys(maps[0]), ...later];
  const holders = new Map();

  order.forEach((action) => {
    const from = maps.reduce((found, map, at) => (Object.hasOwn(map, action) ? at : found), -1);
    const combo = maps[from][action];

    if (combo === NONE) {
      return;
    }

    if (!holders.has(combo) || holders.get(combo).level < from) {
      holders.set(combo, { action, level: from });
    }
  });

  const map = {};
  const level = {};

  [...holders]
    .sort(([, a], [, b]) => order.indexOf(a.action) - order.indexOf(b.action))
    .forEach(([combo, holder]) => {
      map[holder.action] = combo;
      level[holder.action] = holder.level;
    });

  return { map, level };
}

/** `{ action: combo }` — every action that has a shortcut, one action per shortcut. */
export function resolveShortcuts(builtIn, site, user) {
  return resolveShortcutLayers(builtIn, site, user).map;
}

/** The action a shortcut runs in a resolved map, or null. */
export function actionFor(map, combo) {
  const clean = normalizeCombo(combo);

  if (!clean || clean === NONE || !map) {
    return null;
  }

  return Object.keys(map).find((action) => map[action] === clean) || null;
}

/** Another action that has `combo` in a resolved map — not `action` itself — or null. */
export function conflictsWith(map, combo, action) {
  const other = actionFor(map, combo);

  return other && other !== action ? other : null;
}

/**
 * `sveShortcuts` as PHP sent it, clean: { builtIn, site, locked, labels }.
 * `labels` names the top-bar tools in the CP user's language; a size is named
 * by its breakpoint row.
 */
export function shortcutsConfig(win) {
  const raw = win?.Statamic?.$config?.get?.('sveShortcuts');
  const locked = (Array.isArray(raw?.locked) ? raw.locked : []).map(normalizeCombo).filter((combo) => combo && combo !== NONE);

  return {
    builtIn: cleanShortcutMap(raw?.builtIn),
    site: cleanShortcutMap(raw?.site, locked),
    locked,
    labels: raw?.labels && typeof raw.labels === 'object' && !Array.isArray(raw.labels) ? { ...raw.labels } : {},
  };
}
