import test from 'node:test';
import assert from 'node:assert/strict';
import { ask, on, register } from '../../resources/js/cp/bus.js';
import { BP_CHANGED_EVENT } from '../../resources/js/breakpoints.js';
import { HEADER_TOOLBAR_ID, TOOLBAR_HIDDEN_KEYS } from '../../resources/js/lib/ids.js';
import { followToolbarMode } from '../../resources/js/toolbar-visibility.js';
import { MSG, SOURCE } from '../../resources/js/lib/protocol.js';
import {
  activeShortcuts,
  readUserShortcuts,
  resetUserShortcuts,
  runShortcut,
  setUserShortcut,
  shortcutActions,
  shortcutLayers,
  startShortcuts,
  syncPreviewShortcuts,
} from '../../resources/js/toolbar-shortcuts.js';

/** Content's own hidden icons. */
const TOOLBAR_HIDDEN_KEY = TOOLBAR_HIDDEN_KEYS.content;

// ── Just enough Control Panel ───────────────────────────────────────────

const BUILT_IN = {
  'size:laptop': 'mod+d',
  'size:tablet': 'mod+alt+t',
  'size:mobile': 'mod+m',
  'tool:settings': 'mod+comma',
  'tool:pages': 'mod+p',
  'tool:globals': 'mod+g',
  'tool:xray': 'mod+shift+x',
  'tool:ai': 'mod+alt+a',
};

const ROWS = [
  { handle: 'laptop', label: 'Desktop', device: 'Desktop', icon: 'desktop', min: 64 },
  { handle: 'tablet', label: 'Tablet', device: 'Tablet', icon: 'tablet', min: 48 },
  { handle: 'mobile', label: 'Mobile', device: 'Mobile', icon: 'mobile', min: 0 },
];

function button(tab) {
  return {
    dataset: { tab },
    style: { display: '' },
    clicks: 0,
    click() {
      this.clicks += 1;
    },
  };
}

/**
 * A window with Live Preview's header, a top bar of `tabs`, and what PHP
 * sends. With `preview`, a preview iframe whose window collects what the CP
 * posts to it (`win.toPreview`).
 */
function fakeWin({ tabs = ['settings', 'pages', 'globals', 'xray'], site = {}, rows = ROWS, stored = {}, header = true, mac = true, preview = false, modes = null } = {}) {
  const store = new Map(Object.entries(stored));
  const buttons = Object.fromEntries(tabs.map((tab) => [tab, button(tab)]));
  const bar = {
    querySelectorAll: (sel) => (sel === 'button[data-tab]' ? Object.values(buttons) : []),
    querySelector: (sel) => buttons[sel.match(/^button\[data-tab="([^"]+)"\]$/)?.[1]] || null,
  };
  const listeners = [];
  const toPreview = [];
  const frame = preview ? { contentDocument: null, contentWindow: { postMessage: (message, origin) => toPreview.push({ message, origin }) } } : null;
  const config = {
    sveShortcuts: { builtIn: BUILT_IN, site, locked: ['mod+s', 'mod+t'], labels: { 'tool:pages': 'Pages' } },
    sveBreakpoints: rows,
    sveToolbarModes: modes,
  };

  return {
    buttons,
    store,
    toPreview,
    location: { origin: 'http://cp.test' },
    /** Fire the window's listeners of `type` (for the breakpoint event). */
    fire(type) {
      listeners.filter((item) => item.type === type).forEach((item) => item.fn({ type }));
    },
    navigator: { platform: mac ? 'MacIntel' : 'Win32' },
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    Statamic: { $config: { get: (key) => config[key] } },
    setTimeout: () => 1,
    clearTimeout: () => {},
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    document: {
      getElementById: (id) => (id === HEADER_TOOLBAR_ID ? bar : id === 'live-preview-iframe' ? frame : null),
      querySelectorAll: (sel) => (sel === '.live-preview-header' && header ? [{ closest: () => null }] : []),
    },
    /** A keydown as the browser hands it to the window's listeners. */
    press(init) {
      const event = {
        key: '',
        code: '',
        metaKey: false,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        repeat: false,
        isComposing: false,
        defaultPrevented: false,
        getModifierState: () => false,
        preventDefault() {
          this.defaultPrevented = true;
        },
        ...init,
      };
      const was = event.defaultPrevented;

      listeners.filter((item) => item.type === 'keydown').forEach((item) => item.fn(event));

      return { prevented: !was && event.defaultPrevented };
    },
  };
}

const devices = [];

register('lp:set-device', (payload) => devices.push(payload.key));

// ── The actions and the layers ──────────────────────────────────────────

test('the actions are every icon in the bar, Page settings and hidden ones included, and every size', () => {
  const win = fakeWin({ stored: { [TOOLBAR_HIDDEN_KEY]: '["xray"]' } });

  assert.deepEqual(shortcutActions(win), ['tool:settings', 'tool:pages', 'tool:globals', 'tool:xray', 'size:laptop', 'size:tablet', 'size:mobile']);
});

test('a tool without an icon here has no shortcut: AI is not in the bar', () => {
  const active = activeShortcuts(fakeWin());

  assert.equal('tool:ai' in active, false);
  assert.equal(active['tool:globals'], 'mod+g');
});

test('the site\'s layer is the setting and each size\'s row; the user\'s is their own preference', () => {
  const win = fakeWin({
    site: { 'tool:pages': 'mod+alt+9' },
    rows: [{ ...ROWS[0], shortcut: 'mod+1' }, ROWS[1], ROWS[2]],
    stored: { 'sve-shortcuts': JSON.stringify({ 'tool:globals': 'mod+alt+g', 'tool:forms': 'mod+f', 'size:tablet': 'mod+s' }) },
  });
  const layers = shortcutLayers(win);

  assert.deepEqual(layers.site, { 'tool:pages': 'mod+alt+9', 'size:laptop': 'mod+1' });
  assert.deepEqual(layers.user, { 'tool:globals': 'mod+alt+g' }, 'no Forms icon here; a locked one is never read');
  assert.deepEqual(activeShortcuts(win), {
    'size:laptop': 'mod+1',
    'size:tablet': 'mod+alt+t',
    'size:mobile': 'mod+m',
    'tool:settings': 'mod+comma',
    'tool:pages': 'mod+alt+9',
    'tool:globals': 'mod+alt+g',
    'tool:xray': 'mod+shift+x',
  });
});

test('a user\'s own: set, moved here from another action (none there, same layer), back to the site\'s, all reset', () => {
  const win = fakeWin();
  const changed = [];
  const off = on('shortcuts:changed', ({ win: target }) => changed.push(target));

  setUserShortcut(win, 'tool:pages', 'mod+g', 'tool:globals');
  assert.deepEqual(readUserShortcuts(win), { 'tool:pages': 'mod+g', 'tool:globals': 'none' });
  assert.equal(activeShortcuts(win)['tool:pages'], 'mod+g');
  assert.equal('tool:globals' in activeShortcuts(win), false);

  setUserShortcut(win, 'tool:pages', '');
  assert.deepEqual(readUserShortcuts(win), { 'tool:globals': 'none' });

  resetUserShortcuts(win);
  assert.deepEqual(readUserShortcuts(win), {});
  assert.equal(win.store.has('sve-shortcuts'), false, 'an empty layer is not stored');
  assert.equal(changed.length, 3);
  assert.ok(changed.every((target) => target === win));
  off();
});

test('a tool the mode may not have has no shortcut, and its keys press nothing; in the mode that has it, they do', () => {
  const modes = { content: ['pages', 'globals'], build: ['pages', 'globals', 'xray'] };
  const win = fakeWin({ modes });

  assert.deepEqual(shortcutActions(win), ['tool:settings', 'tool:pages', 'tool:globals', 'size:laptop', 'size:tablet', 'size:mobile']);
  startShortcuts(win);
  win.press({ key: 'X', code: 'KeyX', metaKey: true, shiftKey: true });
  assert.equal(win.buttons.xray.clicks, 0);

  // Visual Build — its list is stored as `build`.
  followToolbarMode(() => 'visual');

  try {
    assert.ok(shortcutActions(win).includes('tool:xray'));
    win.press({ key: 'X', code: 'KeyX', metaKey: true, shiftKey: true });
    assert.equal(win.buttons.xray.clicks, 1);
  } finally {
    followToolbarMode(() => 'content');
  }
});

// ── A keypress ──────────────────────────────────────────────────────────

test('⌘G presses Globals, and a second ⌘G presses it again — the icon closes what it opened', () => {
  const win = fakeWin();

  startShortcuts(win);

  assert.equal(win.press({ key: 'g', code: 'KeyG', metaKey: true }).prevented, true);
  win.press({ key: 'g', code: 'KeyG', metaKey: true });
  assert.equal(win.buttons.globals.clicks, 2);
});

test('a hidden tool opens by its shortcut, and stays hidden', () => {
  const win = fakeWin({ stored: { [TOOLBAR_HIDDEN_KEY]: '["xray"]' } });

  startShortcuts(win);
  win.press({ key: 'X', code: 'KeyX', metaKey: true, shiftKey: true });

  assert.equal(win.buttons.xray.clicks, 1);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["xray"]');
});

test('a hidden Globals is pressed too — its control stands under the bar while the icon stays hidden (header-toolbar.js)', () => {
  const win = fakeWin({ stored: { [TOOLBAR_HIDDEN_KEY]: '["globals"]' } });

  startShortcuts(win);

  assert.equal(win.press({ key: 'g', code: 'KeyG', metaKey: true }).prevented, true);
  assert.equal(win.buttons.globals.clicks, 1);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["globals"]');
});

test('⌘M asks for Mobile on the bus, the door the size buttons share; ⌥⌘T for Tablet by its code', () => {
  const win = fakeWin();

  devices.length = 0;
  startShortcuts(win);
  win.press({ key: 'm', code: 'KeyM', metaKey: true });
  win.press({ key: '†', code: 'KeyT', metaKey: true, altKey: true });

  assert.deepEqual(devices, ['Mobile', 'Tablet']);
});

test('Windows: Ctrl is mod, the Windows key is nothing', () => {
  const win = fakeWin({ mac: false });

  startShortcuts(win);
  win.press({ key: 'g', code: 'KeyG', ctrlKey: true });
  win.press({ key: 'g', code: 'KeyG', metaKey: true });

  assert.equal(win.buttons.globals.clicks, 1);
});

test('a key a field used, a key that is no shortcut, or no Live Preview: the browser keeps it', () => {
  const win = fakeWin();
  const away = fakeWin({ header: false });

  startShortcuts(win);
  startShortcuts(away);

  assert.equal(win.press({ key: 'g', code: 'KeyG', metaKey: true, defaultPrevented: true }).prevented, false);
  assert.equal(win.press({ key: 'k', code: 'KeyK', metaKey: true }).prevented, false, 'no action has ⌘K');
  assert.equal(win.press({ key: 'g', code: 'KeyG' }).prevented, false, 'typing');
  assert.equal(away.press({ key: 'g', code: 'KeyG', metaKey: true }).prevented, false);
  assert.equal(win.buttons.globals.clicks + away.buttons.globals.clicks, 0);
});

test('started twice, one listener: one press is one click', () => {
  const win = fakeWin();

  startShortcuts(win);
  startShortcuts(win);
  win.press({ key: 'p', code: 'KeyP', metaKey: true });

  assert.equal(win.buttons.pages.clicks, 1);
});

// ── On the bus, for the preview ─────────────────────────────────────────

test('shortcuts:list answers the active shortcuts; shortcuts:run runs one as a keypress would', () => {
  const win = fakeWin();

  startShortcuts(win);

  assert.equal(ask('shortcuts:list', { win })['tool:pages'], 'mod+p');
  assert.equal(ask('shortcuts:run', { win, combo: 'mod+p' }), true);
  assert.equal(win.buttons.pages.clicks, 1);
  assert.equal(ask('shortcuts:run', { win, combo: 'mod+k' }), false);
  assert.equal(runShortcut(fakeWin({ header: false }), 'mod+p'), false, 'not outside Live Preview');
});

// ── The list the preview document holds ─────────────────────────────────

const comboList = (win) => win.toPreview.map((item) => item.message.combos);

test('the preview gets the combos that run something — once per list: a pass that changes nothing sends nothing, a new icon sends anew', () => {
  const win = fakeWin({ preview: true });

  startShortcuts(win);
  startShortcuts(win);

  assert.deepEqual(comboList(win), [['mod+alt+t', 'mod+comma', 'mod+d', 'mod+g', 'mod+m', 'mod+p', 'mod+shift+x']]);
  assert.deepEqual(win.toPreview[0].message, { source: SOURCE, type: MSG.SVE_SHORTCUTS, combos: win.toPreview[0].message.combos });
  assert.equal(win.toPreview[0].origin, 'http://cp.test');

  win.buttons.ai = button('ai');
  startShortcuts(win);

  assert.equal(win.toPreview.length, 2);
  assert.ok(comboList(win)[1].includes('mod+alt+a'));
});

test('a preview that asks always gets the list; a size added and a shortcut of the user\'s own send it again; no preview, nothing', () => {
  const win = fakeWin({ preview: true });

  startShortcuts(win);
  assert.deepEqual(ask('shortcuts:sync', { win }), comboList(win)[0]);
  assert.equal(win.toPreview.length, 2, 'asked: sent though nothing changed');

  win.fire(BP_CHANGED_EVENT);
  assert.equal(win.toPreview.length, 3);

  setUserShortcut(win, 'tool:pages', 'mod+alt+9');
  assert.equal(win.toPreview.length, 4);
  assert.ok(comboList(win)[3].includes('mod+alt+9'));
  assert.equal(comboList(win)[3].includes('mod+p'), false);

  const away = fakeWin();

  assert.deepEqual(syncPreviewShortcuts(away), []);
  assert.deepEqual(ask('shortcuts:sync', { win: away }), []);
});

test('Live Preview opened from the site: a key on the site page runs too — only while the editor is open', () => {
  const heard = [];
  const host = { navigator: { platform: 'MacIntel' }, addEventListener: (type, fn, capture) => heard.push({ type, fn, capture }), removeEventListener: () => {} };
  let open = true;
  const win = fakeWin();

  win.parent = host;
  win.frameElement = { classList: { contains: (name) => name === 'sve-edit-overlay' }, hasAttribute: (name) => name === 'data-open' && open };
  startShortcuts(win);

  const onKey = heard.find((item) => item.type === 'keydown');
  const press = () => {
    const event = {
      key: 'p', code: 'KeyP', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false, prevented: false, stopped: false,
      preventDefault() { this.prevented = true; },
      stopPropagation() { this.stopped = true; },
    };

    onKey.fn(event);

    return event;
  };

  assert.equal(onKey.capture, true, 'before the site’s own handlers');

  const pressed = press();

  assert.equal(pressed.prevented && pressed.stopped, true, 'the browser does not print, the site hears nothing');
  assert.equal(win.buttons.pages.clicks, 1);

  open = false;
  assert.equal(press().prevented, false, 'Live Preview closed: ⌘P prints again');
  assert.equal(win.buttons.pages.clicks, 1);
});
