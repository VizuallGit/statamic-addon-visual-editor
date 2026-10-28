/**
 * lib/beside.js: a popup opens outside the column it came from, on the side
 * with more room, level with what was clicked, and inside the window.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { besideSpot } from '../../resources/js/lib/beside.js';

const view = { width: 1440, height: 900 };
const size = { width: 272, height: 320 };

test('a tile in the left panel opens to the right of the panel', () => {
  const spot = besideSpot({ top: 200 }, { left: 0, right: 300 }, size, view);

  assert.deepEqual(spot, { left: 308, top: 200 });
});

test('a row in the right sidebar opens to the left of the sidebar', () => {
  const spot = besideSpot({ top: 150 }, { left: 1140, right: 1440 }, size, view);

  assert.deepEqual(spot, { left: 1140 - 272 - 8, top: 150 });
});

test('a row near the bottom is lifted so the popup stays in the window', () => {
  const spot = besideSpot({ top: 800 }, { left: 0, right: 300 }, size, view);

  assert.equal(spot.top, 900 - 320 - 8);
});

test('a popup taller than the window starts at its top', () => {
  const spot = besideSpot({ top: 400 }, { left: 0, right: 300 }, { width: 272, height: 1200 }, view);

  assert.equal(spot.top, 8);
});

test('no room on either side: kept inside the window', () => {
  const spot = besideSpot({ top: 10 }, { left: 0, right: 1400 }, size, view);

  assert.equal(spot.left, 1440 - 272 - 8);
});
