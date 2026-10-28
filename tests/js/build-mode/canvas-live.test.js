/**
 * build-mode/canvas-live.js — the canvas follows what the real preview shows.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pairByOrder, videoShouldPlay } from '../../../resources/js/build-mode/canvas-live.js';

test('a video plays on the canvas while its twin plays, or would: autoplay and not held', () => {
  assert.equal(videoShouldPlay({ paused: false, autoplay: true, held: false }), true);
  // The real preview stopped it for leaving its own viewport — the canvas is scrolled elsewhere.
  assert.equal(videoShouldPlay({ paused: true, autoplay: true, held: false }), true);
  // Held by the tree's video icon (the bridge sets autoplay aside).
  assert.equal(videoShouldPlay({ paused: true, autoplay: false, held: true }), false);
  // A popup's video Alpine starts and stops.
  assert.equal(videoShouldPlay({ paused: false, autoplay: false, held: false }), true);
  assert.equal(videoShouldPlay({ paused: true, autoplay: false, held: false }), false);
});

test('twins are paired by order within the same section', () => {
  assert.deepEqual(pairByOrder(['a', 'a', 'b'], ['a', 'b', 'a']), [0, 2, 1]);
  // A video typed into the open section before the real preview has it: the others keep their twins.
  assert.deepEqual(pairByOrder(['a', 'b', 'b'], ['a', 'b']), [0, 1, -1]);
  assert.deepEqual(pairByOrder(['', 'x'], ['']), [0, -1]);
});
