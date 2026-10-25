import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  NONE,
  actionFor,
  cleanShortcutMap,
  comboFromEvent,
  conflictsWith,
  formatCombo,
  isLocked,
  isMac,
  normalizeCombo,
  resolveShortcutLayers,
  resolveShortcuts,
  shortcutsConfig,
  siteShortcuts,
} from '../../resources/js/lib/shortcuts.js';

/** A keydown as the browser hands it over: nothing held, nothing handled, unless said. */
const key = (k, code, extra = {}) => ({
  key: k,
  code,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  repeat: false,
  isComposing: false,
  defaultPrevented: false,
  getModifierState: () => false,
  ...extra,
});

const LOCKED = ['mod+s', 'mod+t', 'mod+w', 'mod+shift+3', 'mod+a', 'mod+shift+i', 'ctrl+s'];

// ── The grammar, shared with PHP ────────────────────────────────────────

test('normalizeCombo agrees with every case PHP is held to (tests/js/fixtures/shortcut-combos.json)', () => {
  const cases = JSON.parse(readFileSync(new URL('./fixtures/shortcut-combos.json', import.meta.url), 'utf8'));

  assert.ok(cases.length > 20);

  cases.forEach(([input, expected]) => assert.equal(normalizeCombo(input), expected, JSON.stringify(input)));
  assert.equal(normalizeCombo(null), '');
  assert.equal(normalizeCombo(42), '');
});

// ── Platform ────────────────────────────────────────────────────────────

test('a Mac is told by userAgentData (macOS) or the older platform (MacIntel); Windows and Linux are not', () => {
  assert.equal(isMac({ userAgentData: { platform: 'macOS' } }), true);
  assert.equal(isMac({ platform: 'MacIntel' }), true);
  assert.equal(isMac({ userAgentData: { platform: 'Windows' }, platform: 'MacIntel' }), false, 'userAgentData is asked first');
  assert.equal(isMac({ platform: 'Win32' }), false);
  assert.equal(isMac({ platform: 'Linux x86_64' }), false);
  assert.equal(isMac(null), false, 'no navigator at all');
});

// ── A keydown ───────────────────────────────────────────────────────────

test('on a Mac ⌘ is mod and Control is ctrl, a key of its own', () => {
  assert.equal(comboFromEvent(key('g', 'KeyG', { metaKey: true }), true), 'mod+g');
  assert.equal(comboFromEvent(key('g', 'KeyG', { ctrlKey: true }), true), 'ctrl+g');
  assert.equal(comboFromEvent(key('G', 'KeyG', { metaKey: true, shiftKey: true }), true), 'mod+shift+g', 'Shift makes the letter upper case');
  assert.equal(comboFromEvent(key(',', 'Comma', { metaKey: true }), true), 'mod+comma');
});

test('on Windows Ctrl is mod, and the Windows key never makes a shortcut', () => {
  assert.equal(comboFromEvent(key('g', 'KeyG', { ctrlKey: true }), false), 'mod+g');
  assert.equal(comboFromEvent(key('g', 'KeyG', { metaKey: true }), false), '');
  assert.equal(comboFromEvent(key('g', 'KeyG', { metaKey: true, ctrlKey: true }), false), '');
});

test('with ⌥ the key is read from event.code: ⌥T on a Mac types «†»', () => {
  assert.equal(comboFromEvent(key('†', 'KeyT', { metaKey: true, altKey: true }), true), 'mod+alt+t');
  assert.equal(comboFromEvent(key('¡', 'Digit1', { metaKey: true, altKey: true }), true), 'mod+alt+1');
  assert.equal(comboFromEvent(key('≤', 'Comma', { altKey: true, ctrlKey: true }), true), 'ctrl+alt+comma');
});

test('without ⌥ the layout counts; event.code only when the key itself is not one a shortcut can have', () => {
  // Shift+1 is «!» on most layouts: the digit is read from the code.
  assert.equal(comboFromEvent(key('!', 'Digit1', { ctrlKey: true, shiftKey: true }), false), 'mod+shift+1');
  // A Danish «æ» sits where a US keyboard has «;».
  assert.equal(comboFromEvent(key('æ', 'Semicolon', { metaKey: true }), true), 'mod+semicolon');
  // A key at another place on this layout is that layout's key.
  assert.equal(comboFromEvent(key('z', 'KeyY', { ctrlKey: true }), false), 'mod+z');
});

test('AltGr is never a shortcut — on a Danish Windows keyboard AltGr+E is €', () => {
  const altGr = key('€', 'KeyE', { ctrlKey: true, altKey: true, getModifierState: (name) => name === 'AltGraph' });

  assert.equal(comboFromEvent(altGr, false), '');
});

test('a key a field has used, a repeat or an IME composing is not a shortcut', () => {
  assert.equal(comboFromEvent(key('b', 'KeyB', { metaKey: true, defaultPrevented: true }), true), '', '⌘B was bold in Bard');
  assert.equal(comboFromEvent(key('g', 'KeyG', { metaKey: true, repeat: true }), true), '');
  assert.equal(comboFromEvent(key('g', 'KeyG', { metaKey: true, isComposing: true }), true), '');
  assert.equal(comboFromEvent(null, true), '');
});

test('a plain key, Shift alone or a lone modifier is not a shortcut', () => {
  assert.equal(comboFromEvent(key('g', 'KeyG'), true), '');
  assert.equal(comboFromEvent(key('+', 'Equal'), true), '', 'the editor\'s own zoom key');
  assert.equal(comboFromEvent(key('G', 'KeyG', { shiftKey: true }), true), '');
  assert.equal(comboFromEvent(key('Meta', 'MetaLeft', { metaKey: true }), true), '');
  assert.equal(comboFromEvent(key('Shift', 'ShiftLeft', { metaKey: true, shiftKey: true }), true), '');
  assert.equal(comboFromEvent(key('F5', 'F5', { metaKey: true }), true), '', 'not a letter, a digit or a named key');
});

// ── Shown ───────────────────────────────────────────────────────────────

test('shown as the Mac writes it — ⌃⌥⇧⌘ in Apple\'s order — and as Windows writes it', () => {
  assert.equal(formatCombo('mod+shift+f', true), '⇧⌘F');
  assert.equal(formatCombo('mod+alt+t', true), '⌥⌘T');
  assert.equal(formatCombo('mod+comma', true), '⌘,');
  assert.equal(formatCombo('mod+ctrl+alt+shift+x', true), '⌃⌥⇧⌘X');
  assert.equal(formatCombo('mod+shift+f', false), 'Ctrl+Shift+F');
  assert.equal(formatCombo('mod+alt+t', false), 'Ctrl+Alt+T');
  assert.equal(formatCombo('mod+comma', false), 'Ctrl+,');
  assert.equal(formatCombo(NONE, true), '');
  assert.equal(formatCombo('', false), '');
});

// ── Locked ──────────────────────────────────────────────────────────────

test('a locked shortcut is locked however it is written; the list comes from PHP', () => {
  assert.equal(isLocked('mod+s', LOCKED), true);
  assert.equal(isLocked('Mod+S', LOCKED), true);
  assert.equal(isLocked('shift+mod+3', LOCKED), true);
  assert.equal(isLocked('mod+g', LOCKED), false);
  assert.equal(isLocked(NONE, LOCKED), false);
  assert.equal(isLocked('mod+s'), false, 'no list, nothing locked');
});

test('a layer is read back clean: unknown actions, broken and locked shortcuts dropped, none kept', () => {
  assert.deepEqual(
    cleanShortcutMap({ 'tool:pages': 'Mod+P', 'tool:globals': NONE, 'tool:forms': 'mod+s', 'size:laptop': 'p', pages: 'mod+p', 'tool:Bad': 'mod+b' }, LOCKED),
    { 'tool:pages': 'mod+p', 'tool:globals': NONE }
  );
  assert.deepEqual(cleanShortcutMap(null), {});
  assert.deepEqual(cleanShortcutMap(['mod+p']), {});
});

// ── The three layers ────────────────────────────────────────────────────

const BUILT_IN = { 'size:laptop': 'mod+d', 'size:tablet': 'mod+alt+t', 'tool:pages': 'mod+p', 'tool:globals': 'mod+g', 'tool:forms': 'mod+shift+f' };

test('the last layer that names an action wins: built in, then the site, then the user', () => {
  const map = resolveShortcuts(BUILT_IN, { 'tool:pages': 'mod+alt+9' }, { 'tool:globals': 'mod+alt+g' });

  assert.equal(map['tool:pages'], 'mod+alt+9');
  assert.equal(map['tool:globals'], 'mod+alt+g');
  assert.equal(map['tool:forms'], 'mod+shift+f');
});

test('none in a layer means no shortcut there, over what the layers below say', () => {
  const map = resolveShortcuts(BUILT_IN, { 'tool:pages': NONE }, { 'size:laptop': NONE });

  assert.equal('tool:pages' in map, false);
  assert.equal('size:laptop' in map, false);

  // A user's own over the site's none.
  assert.equal(resolveShortcuts(BUILT_IN, { 'tool:pages': NONE }, { 'tool:pages': 'mod+p' })['tool:pages'], 'mod+p');
});

test('a shortcut two actions would share goes to the higher layer, so one keypress is one action', () => {
  const { map, level } = resolveShortcutLayers(BUILT_IN, { 'size:wide': 'mod+d' }, { 'tool:forms': 'mod+g' });

  assert.equal(map['size:wide'], 'mod+d', 'the site\'s new size over the built-in Desktop');
  assert.equal('size:laptop' in map, false);
  assert.equal(map['tool:forms'], 'mod+g', 'the user\'s own over the built-in Globals');
  assert.equal('tool:globals' in map, false);
  assert.equal(level['tool:forms'], 2);
  assert.equal(level['size:wide'], 1);
  assert.equal(level['tool:pages'], 0);
  assert.equal(new Set(Object.values(map)).size, Object.values(map).length, 'no shortcut twice');
});

test('between two of one layer, the one the built-in list names first keeps it, then alphabetical order', () => {
  assert.deepEqual(
    resolveShortcuts(BUILT_IN, { 'tool:forms': 'mod+x', 'tool:pages': 'mod+x' }, {}),
    { 'size:laptop': 'mod+d', 'size:tablet': 'mod+alt+t', 'tool:pages': 'mod+x', 'tool:globals': 'mod+g' }
  );
  assert.equal(resolveShortcuts({}, { 'tool:zeta': 'mod+x', 'tool:alpha': 'mod+x' }, {})['tool:alpha'], 'mod+x');
});

test('the resolved map keeps the built-in order, then the rest alphabetically', () => {
  assert.deepEqual(Object.keys(resolveShortcuts(BUILT_IN, { 'tool:zeta': 'mod+z' }, { 'tool:alpha': 'mod+1' })), [
    'size:laptop',
    'size:tablet',
    'tool:pages',
    'tool:globals',
    'tool:forms',
    'tool:alpha',
    'tool:zeta',
  ]);
});

test('a size\'s own shortcut on its breakpoint row is the site\'s, over the setting', () => {
  const rows = [{ handle: 'laptop', shortcut: '' }, { handle: 'wide', shortcut: 'Mod+W' }, { handle: 'tablet', shortcut: NONE }, { handle: 'Bad', shortcut: 'mod+b' }];

  assert.deepEqual(siteShortcuts({ 'tool:pages': 'mod+alt+9', 'size:wide': 'mod+1' }, rows), {
    'tool:pages': 'mod+alt+9',
    'size:wide': 'mod+w',
    'size:tablet': NONE,
  });
  assert.deepEqual(siteShortcuts({}, [{ handle: 'wide', shortcut: 'mod+s' }], LOCKED), {}, 'locked on a row too');
});

// ── Lookups ─────────────────────────────────────────────────────────────

test('actionFor finds the action a keypress runs; conflictsWith names another holder, never the asker', () => {
  const map = resolveShortcuts(BUILT_IN, {}, {});

  assert.equal(actionFor(map, 'mod+g'), 'tool:globals');
  assert.equal(actionFor(map, 'Mod+G'), 'tool:globals');
  assert.equal(actionFor(map, 'mod+k'), null);
  assert.equal(actionFor(map, NONE), null);
  assert.equal(conflictsWith(map, 'mod+g', 'tool:pages'), 'tool:globals');
  assert.equal(conflictsWith(map, 'mod+g', 'tool:globals'), null);
  assert.equal(conflictsWith(map, 'mod+k', 'tool:pages'), null);
});

test('the config is read clean, and nothing when PHP sent nothing', () => {
  const win = (value) => ({ Statamic: { $config: { get: (k) => (k === 'sveShortcuts' ? value : undefined) } } });

  assert.deepEqual(
    shortcutsConfig(win({ builtIn: { 'tool:pages': 'mod+p' }, site: { 'tool:globals': 'mod+s', 'tool:forms': 'mod+f' }, locked: ['Mod+S', 'x'], labels: { 'tool:pages': 'Pages' } })),
    { builtIn: { 'tool:pages': 'mod+p' }, site: { 'tool:forms': 'mod+f' }, locked: ['mod+s'], labels: { 'tool:pages': 'Pages' } }
  );
  assert.deepEqual(shortcutsConfig(win(undefined)), { builtIn: {}, site: {}, locked: [], labels: {} });
  assert.deepEqual(shortcutsConfig(null), { builtIn: {}, site: {}, locked: [], labels: {} });
});
