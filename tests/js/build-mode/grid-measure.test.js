/**
 * build-mode/grid-measure.js — the boxes a grid is outlined in: a child's
 * cells as one, every free cell alone.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cellAreas } from '../../../resources/js/build-mode/grid-measure.js';

test('a child spanning two columns and two rows is one box; the free cells are one each', () => {
  const grid = {
    items: [{ col: [0, 1], row: [0, 1] }],
    empty: [[2, 0], [3, 0], [2, 1], [3, 1]],
  };

  assert.deepEqual(cellAreas(grid), [
    { col: [0, 1], row: [0, 1] },
    { col: [2, 2], row: [0, 0] },
    { col: [3, 3], row: [0, 0] },
    { col: [2, 2], row: [1, 1] },
    { col: [3, 3], row: [1, 1] },
  ]);
});

test('two children on the same cells are one box; a child the frame has not placed is none', () => {
  const grid = {
    items: [{ col: [0, 0], row: [0, 0] }, { col: [0, 0], row: [0, 0] }, { col: null, row: null }],
    empty: [[1, 0]],
  };

  assert.deepEqual(cellAreas(grid), [{ col: [0, 0], row: [0, 0] }, { col: [1, 1], row: [0, 0] }]);
});
