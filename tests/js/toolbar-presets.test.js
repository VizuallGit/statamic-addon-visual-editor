import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_NAME_MAX, cleanPreset, inOrder, moveKey, newPresetId, presetHidden, presetMatches } from '../../resources/js/lib/toolbar-presets.js';

const editor = { id: 'editor', tools: ['pages', 'globals', 'listview', 'edits'], dock: false };
const available = ['pages', 'globals', 'sections', 'listview', 'code', 'edits'];

test("a preset hides what it does not list, of the icons the user has", () => {
  assert.deepEqual(presetHidden(editor, available), ['sections', 'code']);
  assert.deepEqual(presetHidden({ id: 'x', tools: available, dock: true }, available), []);
});

test('a preset is on when the shown icons are its own, and the dock agrees where there is one', () => {
  const shown = ['pages', 'globals', 'listview', 'edits'];

  assert.equal(presetMatches(editor, { available, shown, dock: false, dockAllowed: true }), true);
  assert.equal(presetMatches(editor, { available, shown, dock: true, dockAllowed: true }), false);
  assert.equal(presetMatches(editor, { available, shown, dock: true, dockAllowed: false }), true);
  assert.equal(presetMatches(editor, { available, shown: [...shown, 'code'] }), false);
  assert.equal(presetMatches(editor, { available, shown: ['pages'] }), false);
});

test('an icon the user does not have does not count against a preset', () => {
  const lean = ['pages', 'globals', 'edits'];

  assert.equal(presetMatches(editor, { available: lean, shown: lean }), true);
});

test('presets are cleaned: site ones by id, own ones need a u- id and a name', () => {
  assert.deepEqual(cleanPreset({ id: 'developer', tools: ['pages', 1, 'pages'], dock: 1 }), { id: 'developer', tools: ['pages'], dock: false });
  assert.equal(cleanPreset({ id: 'u-1', name: 'x', tools: [] }), null, 'an own id is not a site preset');
  assert.deepEqual(cleanPreset({ id: 'u-1', name: ' x ', tools: ['pages'] }, { user: true }), { id: 'u-1', name: 'x', tools: ['pages'], dock: false });
  assert.equal(cleanPreset({ id: 'u-1', name: '  ', tools: [] }, { user: true }), null);
  assert.equal(cleanPreset({ id: 'bad id', name: 'x' }, { user: true }), null);
  assert.equal(cleanPreset({ id: 'u-1', name: 'x'.repeat(99), tools: [] }, { user: true }).name.length, PRESET_NAME_MAX);
  assert.equal(cleanPreset(null), null);
});

test('a new id never meets one already in the list', () => {
  const first = newPresetId(1000);

  assert.match(first, /^u-[a-z0-9]+$/);
  assert.notEqual(newPresetId(1000, [first]), first);
});

test('order: known keys first as ordered, new ones after as they came', () => {
  assert.deepEqual(inOrder(['a', 'b', 'c', 'd'], ['c', 'x', 'a']), ['c', 'a', 'b', 'd']);
  assert.deepEqual(inOrder(['a', 'b'], []), ['a', 'b']);
});

test('moving a key places it, clamped', () => {
  assert.deepEqual(moveKey(['a', 'b', 'c', 'd'], 'a', 2), ['b', 'c', 'a', 'd']);
  assert.deepEqual(moveKey(['a', 'b', 'c', 'd'], 'd', 0), ['d', 'a', 'b', 'c']);
  assert.deepEqual(moveKey(['a', 'b'], 'a', 99), ['b', 'a']);
  assert.deepEqual(moveKey(['a', 'b'], 'z', 0), ['a', 'b']);
});
