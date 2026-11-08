/**
 * lib/stale-chunk.js — a lazy tool's file gone after a release (a tab older
 * than the editor) says "reload" in Statamic's toast; any other failure is
 * left to the console. Against a fake window with a fake $toast.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isStaleChunkError, reportStaleChunk } from '../../resources/js/lib/stale-chunk.js';

const fakeWin = () => {
  const shown = [];

  return {
    shown,
    Statamic: {
      $config: { get: (key) => (key === 'sveStrings' ? { editor_updated_reload: 'Reload me' } : undefined) },
      $toast: { error: (message) => shown.push(message) },
    },
  };
};

test('each browser’s words for a file that could not be fetched count', () => {
  assert.equal(isStaleChunkError(new TypeError('Failed to fetch dynamically imported module: https://x.test/build/assets/xray-Dls3mBiA.js')), true);
  assert.equal(isStaleChunkError(new TypeError('error loading dynamically imported module: https://x.test/build/assets/xray-Dls3mBiA.js')), true);
  assert.equal(isStaleChunkError(new TypeError('Importing a module script failed.')), true);
  assert.equal(isStaleChunkError(new Error('Unable to preload CSS for /build/assets/lp-cluster-CwGFA4UX.css')), true);
});

test('an error thrown while a module runs is not an update', () => {
  assert.equal(isStaleChunkError(new TypeError("Cannot read properties of null (reading 'body')")), false);
  assert.equal(isStaleChunkError(new ReferenceError('Cannot access TOOLBAR_ICONS before initialization')), false);
  assert.equal(isStaleChunkError(undefined), false);
  assert.equal(isStaleChunkError(null), false);
});

test('a gone file shows the toast in the user’s words; another error shows nothing', () => {
  const win = fakeWin();

  assert.equal(reportStaleChunk(win, new TypeError('Failed to fetch dynamically imported module: /a.js'), 1_000_000), true);
  assert.deepEqual(win.shown, ['Reload me']);

  assert.equal(reportStaleChunk(win, new TypeError('x is not a function'), 1_100_000), false);
  assert.deepEqual(win.shown, ['Reload me']);
});

test('a burst says it once, a later click says it again', () => {
  const win = fakeWin();
  const gone = new TypeError('Failed to fetch dynamically imported module: /b.js');

  reportStaleChunk(win, gone, 2_000_000);
  reportStaleChunk(win, gone, 2_000_500);
  assert.equal(win.shown.length, 1);

  reportStaleChunk(win, gone, 2_004_000);
  assert.equal(win.shown.length, 2);
});

test('no Statamic on the window: nothing thrown', () => {
  assert.equal(reportStaleChunk({}, new TypeError('Importing a module script failed.'), 3_000_000), true);
  assert.equal(reportStaleChunk(undefined, new TypeError('Importing a module script failed.'), 3_010_000), true);
});
