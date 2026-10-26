/**
 * Keyboard shortcuts in Live Preview: a keypress that presses a top-bar icon
 * or a screen-size button, exactly as a click on it would.
 *
 * The rules — what a keypress is, the three layers, which action a shortcut
 * runs — are lib/shortcuts.js. This file reads the layers where they live (the
 * config PHP sends, the breakpoint list, this user's chrome preference
 * `sve-shortcuts`), listens on the Control Panel window and runs the action:
 *
 *   - a tool → pressToolbarTool (toolbar-visibility.js), a click on its icon,
 *     so a second press closes what the first opened; hidden icons, groups
 *     and presets are never touched;
 *   - a size → `lp:set-device` on the bus, the same door the Tailwind row, the
 *     breakpoint overview and the CSS sizes use.
 *
 * The listener is on the window in the bubble phase, so a field's own shortcut
 * wins (⌘B is bold in Bard, ⌘D the next match in CodeMirror: they prevent the
 * default, and a key already used is never a shortcut), and only while Live
 * Preview's header is there. On a match it prevents the browser's own (print,
 * bookmark …) first. A recorder that is recording keeps the key to itself.
 *
 * The preview document listens too (bridge/shortcuts.js): after a click on
 * the page the keypress lands there, and the browser's own action can only be
 * stopped in that keydown. So the preview holds the list of combos that run
 * something, and sends a press up as `SVE_SHORTCUT`. The list goes down as
 * `SVE_SHORTCUTS` when the preview asks at boot (`SVE_SHORTCUTS_REQUEST`, which
 * the CP's message listener answers over the bus as `shortcuts:sync`), when
 * this user's own change, when the screen sizes change, and on every pass of
 * the top bar whose icons changed what the list holds.
 *
 * On the bus: `shortcuts:list` ({ win } → the active `{ action: combo }`),
 * `shortcuts:run` ({ win, combo } → true when it ran) and `shortcuts:sync`
 * ({ win } → the list sent to the preview). `shortcuts:changed` ({ win }) is
 * emitted when this user's own change.
 *
 * May import: toolbar-visibility.js, chrome-prefs.js, breakpoints.js, cp/bus.js and lib/.
 */
import { ask, emit, on, register } from './cp/bus.js';
import { BP_CHANGED_EVENT, breakpoints } from './breakpoints.js';
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { pressToolbarTool } from './toolbar-visibility.js';
import { HEADER_TOOLBAR_ID } from './lib/ids.js';
import { lpHeader } from './lib/live-preview.js';
import { previewFrame } from './lib/preview-frame.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { NONE, actionFor, cleanShortcutMap, comboFromEvent, isMac, resolveShortcuts, shortcutsConfig, siteShortcuts } from './lib/shortcuts.js';

const USER_KEY = 'sve-shortcuts';

const started = new WeakSet();
/** The list each window last sent its preview, as one string — nothing is sent again while it holds. */
const sentToPreview = new WeakMap();
let registered = false;

/** This user's own layer, as stored and cleaned. */
export function readUserShortcuts(win) {
  try {
    return cleanShortcutMap(JSON.parse(chromeGet(win, USER_KEY) || '{}'), shortcutsConfig(win).locked);
  } catch {
    return {};
  }
}

function writeUserShortcuts(win, map) {
  const clean = cleanShortcutMap(map, shortcutsConfig(win).locked);

  if (Object.keys(clean).length) {
    chromeSet(win, USER_KEY, JSON.stringify(clean));
  } else {
    chromeRemove(win, USER_KEY);
  }

  emit('shortcuts:changed', { win });
}

/**
 * One action's own shortcut for this user: '' back to the site's, `none` for
 * none, or a shortcut. `moveFrom` is the action that had it and gives it up —
 * `none` for that one, in this same layer.
 */
export function setUserShortcut(win, action, value, moveFrom = null) {
  const next = { ...readUserShortcuts(win) };

  if (value) {
    next[action] = value;
  } else {
    delete next[action];
  }

  if (moveFrom && moveFrom !== action) {
    next[moveFrom] = NONE;
  }

  writeUserShortcuts(win, next);
}

/** Every shortcut of this user's own gone: the site's apply again. */
export function resetUserShortcuts(win) {
  writeUserShortcuts(win, {});
}

/**
 * The actions this user has in this Live Preview: every icon in the top bar,
 * Page settings and hidden ones included — a tool this user may not use has
 * no icon — and every screen size.
 */
export function shortcutActions(win) {
  const bar = win.document.getElementById(HEADER_TOOLBAR_ID);
  const tools = bar ? [...bar.querySelectorAll('button[data-tab]')].map((btn) => `tool:${btn.dataset.tab}`) : [];

  return [...new Set(tools), ...breakpoints(win).map((row) => `size:${row.handle}`)];
}

/**
 * The three layers, each holding only the actions this user has here, so a
 * shortcut of a tool without an icon never takes a keypress from one with.
 * `locked` and `labels` as PHP sent them.
 */
export function shortcutLayers(win) {
  const config = shortcutsConfig(win);
  const actions = new Set(shortcutActions(win));
  const only = (map) => Object.fromEntries(Object.entries(map).filter(([action]) => actions.has(action)));

  return {
    builtIn: only(config.builtIn),
    site: only(siteShortcuts(config.site, breakpoints(win), config.locked)),
    user: only(readUserShortcuts(win)),
    locked: config.locked,
    labels: config.labels,
  };
}

/** `{ action: combo }` — what a keypress runs now. */
export function activeShortcuts(win) {
  const { builtIn, site, user } = shortcutLayers(win);

  return resolveShortcuts(builtIn, site, user);
}

function runAction(win, action) {
  if (action.startsWith('tool:')) {
    return pressToolbarTool(win, action.slice('tool:'.length));
  }

  const row = breakpoints(win).find((item) => `size:${item.handle}` === action);

  if (!row) {
    return false;
  }

  ask('lp:set-device', { win, key: row.device });

  return true;
}

/** Run what `combo` stands for, as a click would; false when it stands for nothing here. */
export function runShortcut(win, combo) {
  if (!lpHeader(win.document)) {
    return false;
  }

  const action = actionFor(activeShortcuts(win), combo);

  return action ? runAction(win, action) : false;
}

function onKeydown(win, event) {
  if (!lpHeader(win.document)) {
    return;
  }

  const combo = comboFromEvent(event, isMac(win.navigator));
  const action = combo ? actionFor(activeShortcuts(win), combo) : null;

  if (!action) {
    return;
  }

  event.preventDefault();
  runAction(win, action);
}

/**
 * The combos that run something now, told to the preview document, which
 * keeps exactly those from the browser. `onlyIfChanged` skips a list the
 * preview already has — for the top bar's passes, which are many and mostly
 * change nothing. A preview that asked (a fresh document) always gets it.
 * No preview on screen: nothing to tell, and nothing remembered as sent.
 */
export function syncPreviewShortcuts(win, { onlyIfChanged = false } = {}) {
  const target = previewFrame(win.document)?.contentWindow;

  if (!target) {
    sentToPreview.delete(win);

    return [];
  }

  const combos = [...new Set(Object.values(activeShortcuts(win)))].sort();
  const key = combos.join(' ');

  if (onlyIfChanged && sentToPreview.get(win) === key) {
    return combos;
  }

  sentToPreview.set(win, key);
  target.postMessage({ source: SOURCE, type: MSG.SVE_SHORTCUTS, combos }, win.location.origin);

  return combos;
}

/**
 * Where else a keypress can land in a Live Preview session. This window is
 * heard by onKeydown and the preview by bridge/shortcuts.js; two more
 * documents can have the focus, both same origin:
 *
 *   - the site page the editor stands on, when Live Preview was opened from
 *     the site (overlay-host.js): the focus stays there until the editor is
 *     clicked. Heard in capture, before the site's own handlers, and only
 *     while this editor is the open one — closed, ⌘P prints again;
 *   - an iframe in the editor (a drawer's screen, a panel's form), which
 *     takes the focus when it opens — straight from the site page, past this
 *     window. Heard from each load (a load event in capture on this document,
 *     as it does not bubble), in the bubble phase so a field's own shortcut
 *     still wins; once per document.
 */
const OVERLAY_CLASS = 'sve-edit-overlay';
const HEARD = '__sveShortcutsHeard';

function hearHost(win) {
  const frame = win.frameElement;

  if (!frame?.classList?.contains(OVERLAY_CLASS)) {
    return;
  }

  const host = win.parent;
  const onKey = (event) => {
    if (!frame.hasAttribute('data-open')) {
      return;
    }

    const combo = comboFromEvent(event, isMac(host.navigator));

    if (combo && runShortcut(win, combo)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  host.addEventListener('keydown', onKey, true);
  win.addEventListener('pagehide', () => host.removeEventListener('keydown', onKey, true));
}

function hearFrame(win, el) {
  // Null for a frame of another origin.
  const iwin = el?.tagName === 'IFRAME' && el !== previewFrame(win.document) && el.contentDocument ? el.contentWindow : null;

  if (!iwin || iwin[HEARD]) {
    return;
  }

  iwin[HEARD] = true;
  iwin.addEventListener('keydown', (event) => {
    const combo = comboFromEvent(event, isMac(iwin.navigator));

    if (combo && runShortcut(win, combo)) {
      event.preventDefault();
    }
  });
}

/**
 * Listen on this window, once; the bus answers from the first call on. Every
 * call — the top bar makes one per pass — brings the preview's list up to
 * date with the icons the bar has now.
 */
export function startShortcuts(win) {
  if (!registered) {
    registered = true;
    register('shortcuts:list', ({ win: target } = {}) => (target ? activeShortcuts(target) : {}));
    register('shortcuts:run', ({ win: target, combo } = {}) => (target ? runShortcut(target, combo) : false));
    register('shortcuts:sync', ({ win: target } = {}) => (target ? syncPreviewShortcuts(target) : []));
    on('shortcuts:changed', ({ win: target } = {}) => {
      if (target) {
        syncPreviewShortcuts(target);
      }
    });
  }

  if (!started.has(win)) {
    started.add(win);
    win.addEventListener('keydown', (event) => onKeydown(win, event));
    win.document.addEventListener?.('load', (event) => hearFrame(win, event.target), true);
    hearHost(win);
    // A size added or removed in Live Preview changes which actions there are.
    win.addEventListener(BP_CHANGED_EVENT, () => syncPreviewShortcuts(win));
  }

  syncPreviewShortcuts(win, { onlyIfChanged: true });
}
