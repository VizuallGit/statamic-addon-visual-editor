/**
 * lib/selection.js — the one place that says which row is selected.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clearSelection, currentSelection, onSelection, select } from '../../resources/js/lib/selection.js';

test('select stores the row, the field and the source, and tells listeners once', () => {
  const seen = [];
  const off = onSelection((now, before) => seen.push([now?.uid ?? null, before?.uid ?? null]));

  select({ uid: 'a', field: 'headline', source: 'preview' });
  assert.deepEqual(currentSelection(), { uid: 'a', tab: null, ctxName: null, field: 'headline', source: 'preview' });
  // The very same thing again is not a change.
  select({ uid: 'a', field: 'headline', source: 'tree' });
  // The same row, another field, is.
  select({ uid: 'a', field: 'text' });
  assert.deepEqual(seen, [['a', null], ['a', 'a']]);
  off();
  clearSelection();
});

test('clearSelection empties once and is silent on an empty selection', () => {
  const seen = [];
  const off = onSelection((now, before) => seen.push([now, before?.clearedBy]));

  clearSelection('settings');
  select({ uid: 'b' });
  clearSelection('settings');
  clearSelection('settings');
  assert.deepEqual(seen, [[{ uid: 'b', tab: null, ctxName: null, field: null, source: 'preview' }, undefined], [null, 'settings']]);
  off();
});

test('an empty or missing uid clears rather than selecting nothing-in-particular', () => {
  select({ uid: 'c' });
  select({ uid: '' });
  assert.equal(currentSelection(), null);
  select({ uid: 'c' });
  select({});
  assert.equal(currentSelection(), null);
});

test('a tab of a form is a selection too, told apart from a row', () => {
  select({ tab: 'header', ctxName: 'sve-chrome', source: 'chrome' });
  assert.deepEqual(currentSelection(), { uid: null, tab: 'header', ctxName: 'sve-chrome', field: null, source: 'chrome' });
  select({ tab: 'header', ctxName: 'sve-chrome' }); // same tab again: no change
  select({ tab: 'footer', ctxName: 'sve-chrome' });
  assert.equal(currentSelection().tab, 'footer');
  clearSelection();
});
