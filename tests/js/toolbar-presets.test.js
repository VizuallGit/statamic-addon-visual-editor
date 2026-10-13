import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_NAME_MAX, activePreset, cleanPaneChoices, cleanPreset, inOrder, moveKey, newPresetId, presetHidden, presetMatches, presetPanes, presetSidebar } from '../../resources/js/lib/toolbar-presets.js';

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

test('All leaves the dock alone, so either dock state is All', () => {
  const all = { id: 'all', tools: available, dock: null };

  assert.equal(presetMatches(all, { available, shown: available, dock: true, dockAllowed: true }), true);
  assert.equal(presetMatches(all, { available, shown: available, dock: false, dockAllowed: true }), true);
  assert.deepEqual(presetHidden(all, available), []);
});

test('an icon the user does not have does not count against a preset', () => {
  const lean = ['pages', 'globals', 'edits'];

  assert.equal(presetMatches(editor, { available: lean, shown: lean }), true);
});

test('presets are cleaned: site ones by id, own ones need a u- id and a name', () => {
  assert.deepEqual(cleanPreset({ id: 'developer', tools: ['pages', 1, 'pages'], dock: 1 }), { id: 'developer', tools: ['pages'], dock: false, panes: null });
  assert.deepEqual(cleanPreset({ id: 'editor', tools: [], panes: ['listview', 'listview', 2] }).panes, ['listview']);
  assert.equal(cleanPreset({ id: 'u-1', name: 'x', tools: [] }), null, 'an own id is not a site preset');
  assert.deepEqual(cleanPreset({ id: 'u-1', name: ' x ', tools: ['pages'] }, { user: true }), { id: 'u-1', name: 'x', tools: ['pages'], dock: false, panes: null });
  assert.deepEqual(cleanPreset({ id: 'u-1', name: 'x', tools: [], panes: [] }, { user: true }).panes, [], 'no panes is a choice: close them all');
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

test('of two presets that are the same bar, the picked one is on', () => {
  const developer = { id: 'developer', tools: ['sections', 'code'], dock: true };
  const copy = { id: 'u-cosom', name: 'Cosom', tools: ['sections', 'code'], dock: true };
  const state = { available: ['pages', 'sections', 'code'], shown: ['sections', 'code'], dock: true, dockAllowed: true };

  assert.equal(activePreset([developer, copy], state).id, 'developer');
  assert.equal(activePreset([developer, copy], state, 'u-cosom').id, 'u-cosom');
  // Picked but no longer the bar: the first that is takes over.
  assert.equal(activePreset([developer, copy], { ...state, shown: ['sections'] }, 'u-cosom'), null);
  assert.equal(activePreset([developer, copy], state, 'gone').id, 'developer');
});

test("a preset's panes: the user's own choice first, else the preset's, of those the user has", () => {
  const panes = ['listview', 'outline', 'sections', 'ai'];
  const editor = { id: 'editor', tools: ['listview', 'sections', 'ai', 'comments'], dock: false, panes: ['sections', 'listview', 'comments'] };

  // In the Sidebars tab's order; comments is switched off on this site.
  assert.deepEqual(presetPanes(editor, {}, panes), ['listview', 'sections']);
  assert.deepEqual(presetPanes(editor, { editor: ['ai'] }, panes), ['ai']);
  assert.deepEqual(presetPanes(editor, { editor: [] }, panes), [], 'an empty choice closes them all');
  assert.deepEqual(presetPanes(editor, { developer: ['ai'] }, panes), ['listview', 'sections'], "another preset's choice is not this one's");
});

test('All, and an own preset from before panes, leave the sidebar alone until the user chooses', () => {
  const panes = ['listview', 'ai'];

  assert.equal(presetPanes({ id: 'all', tools: panes, panes: null }, {}, panes), null);
  assert.equal(presetPanes({ id: 'u-old', tools: panes, panes: null }, {}, panes), null);
  assert.deepEqual(presetPanes({ id: 'u-old', tools: panes, panes: null }, { 'u-old': ['ai'] }, panes), ['ai']);
});

test("a preset's sidebar is its own icons that can sit there; a pane without its icon never opens", () => {
  const available = ['listview', 'outline', 'sections', 'theme'];
  const developer = { id: 'developer', tools: ['collections', 'sections', 'code', 'theme'], dock: true, panes: ['listview', 'theme'] };

  assert.deepEqual(presetSidebar(developer, available), ['sections', 'theme']);
  assert.deepEqual(presetPanes(developer, {}, available), ['theme'], 'Block tree is not one of its icons');
  assert.deepEqual(presetPanes(developer, { developer: ['sections', 'outline'] }, available), ['sections']);
});

test('pane choices are cleaned: a known id shape, lists of keys only', () => {
  assert.deepEqual(cleanPaneChoices({ developer: ['ai', 'ai', 3], 'u-x1': [], 'no way': ['ai'], editor: 'ai' }), { developer: ['ai'], 'u-x1': [] });
  assert.deepEqual(cleanPaneChoices(null), {});
  assert.deepEqual(cleanPaneChoices(['ai']), {});
});

test('panes never decide which preset is on: pinning by hand keeps it marked', () => {
  const editor = { id: 'editor', tools: ['pages'], dock: false, panes: ['listview'] };
  const state = { available: ['pages', 'code'], shown: ['pages'], dock: false, dockAllowed: true };

  assert.equal(activePreset([editor], state).id, 'editor');
});
