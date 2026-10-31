/**
 * build-mode/canvas-card-drop.js — where a card from Patterns lands, and how far the page zooms.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sectionBefore, zoomScale } from '../../../resources/js/build-mode/canvas-card-drop.js';

const boxes = [
  { top: 0, bottom: 100 },
  { top: 100, bottom: 300 },
  { top: 300, bottom: 400 },
];

test('above the first section\'s middle is the top of the page', () => {
  assert.equal(sectionBefore(boxes, 10), -1);
  assert.equal(sectionBefore(boxes, 50), -1);
});

test('the drop goes after the last section whose middle the pointer has passed', () => {
  assert.equal(sectionBefore(boxes, 51), 0);
  assert.equal(sectionBefore(boxes, 200), 0);
  assert.equal(sectionBefore(boxes, 201), 1);
  assert.equal(sectionBefore(boxes, 390), 2);
});

test('below the last section is after it, and no sections is the top', () => {
  assert.equal(sectionBefore(boxes, 5000), 2);
  assert.equal(sectionBefore([], 200), -1);
});

test('the whole page fits in the view with room to spare', () => {
  assert.equal(zoomScale(932, 3220), 900 / 3220);
});

test('a page that already fits does not zoom', () => {
  assert.equal(zoomScale(932, 900), 0);
  assert.equal(zoomScale(932, 400), 0);
});

test('a very long page stops at the bridge\'s floor', () => {
  assert.equal(zoomScale(932, 1000000), 0.02);
});
