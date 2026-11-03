/**
 * build-mode/canvas-empty.js — an empty grid cell's room on the canvas: one
 * row's for each row it spans, the gap between them included.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_CSS, ownHeight, roomOf, rowsSpanned } from '../../../resources/js/build-mode/canvas-empty.js';

test('the rows a cell spans, as the browser computes its grid-row', () => {
  assert.equal(rowsSpanned('span 2', 'span 2'), 2);
  assert.equal(rowsSpanned('1', 'span 3'), 3);
  assert.equal(rowsSpanned('2', '4'), 2);
  assert.equal(rowsSpanned('auto', 'auto'), 1);
  assert.equal(rowsSpanned('1', '-1'), 1);
});

test('a cell of one row has the plain placeholder; of more, a row\'s room each and the gaps between', () => {
  assert.equal(roomOf(1, '16px'), '');
  assert.equal(roomOf(2, '16px'), 'calc(2 * 4rem + 1 * 16px)');
  assert.equal(roomOf(3, 'normal'), 'calc(3 * 4rem + 2 * 0px)');
});

test('a cell spanning rows folds to the gaps between them: without those it has no height', () => {
  assert.equal(ownHeight(0), 0);
  assert.equal(ownHeight(56, 2, '56px'), 0);
  assert.equal(ownHeight(112, 3, '56px'), 0);
  assert.equal(ownHeight(120, 2, '56px'), 64);
  assert.equal(ownHeight(16, 1, '56px'), 16);
  assert.equal(ownHeight(16, 2, 'normal'), 16);
});

test('the placeholder reads the room, else one row', () => {
  assert.match(EMPTY_CSS, /\[data-sve-build-empty\]\{min-height:var\(--sve-build-room,4rem\)!important/);
});
