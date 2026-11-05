import test from 'node:test';
import assert from 'node:assert/strict';
import { revealOptions, scrollBehavior, setScrollMode } from '../../resources/js/bridge/scroll-mode.js';

const rect = (top, height) => ({ top, bottom: top + height, height });

test('a fresh preview jumps; the CP turns gliding on and off', () => {
  assert.equal(scrollBehavior(), 'instant');

  setScrollMode({ smooth: true });
  assert.equal(scrollBehavior(), 'smooth');

  setScrollMode({ smooth: false });
  assert.equal(scrollBehavior(), 'instant');

  setScrollMode({ smooth: 'yes' });
  assert.equal(scrollBehavior(), 'instant');
});

test('an element wholly on screen is left where it is', () => {
  assert.equal(revealOptions(rect(100, 200), 800), null);
  assert.equal(revealOptions(rect(0, 800), 800), null);
});

test('an element off screen, or partly, is centred', () => {
  assert.deepEqual(revealOptions(rect(4453, 300), 800), { block: 'center' });
  assert.deepEqual(revealOptions(rect(-50, 300), 800), { block: 'center' });
  assert.deepEqual(revealOptions(rect(700, 300), 800), { block: 'center' });
});

test('an element taller than the viewport is aligned to its top', () => {
  assert.deepEqual(revealOptions(rect(2000, 1600), 800), { block: 'start' });
  assert.deepEqual(revealOptions(rect(-200, 1600), 800), { block: 'start' });
});

test('nothing to measure against: no scroll', () => {
  assert.equal(revealOptions(null, 800), null);
  assert.equal(revealOptions(rect(2000, 100), 0), null);
});
