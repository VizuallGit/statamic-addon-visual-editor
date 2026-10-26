/**
 * ghost-state.js: the user's default and the pane's switch are two answers —
 * the switch starts from the default and never writes it back — and both are
 * off on a site that has not switched grey text on.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHROME_KEYS } from '../../resources/js/chrome-prefs.js';
import {
  GHOST_DEFAULT_KEY,
  forgetGhostSwitch,
  ghostAllowed,
  ghostDefaultOn,
  ghostOn,
  onGhostSwitch,
  setGhostDefault,
  setGhostOn,
} from '../../resources/js/dock/ghost-state.js';

function fakeWin(features = { dock_ghost: true }) {
  const store = new Map();

  return {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    setTimeout: () => 0,
    clearTimeout: () => {},
    Statamic: { $config: { get: (key) => (key === 'sveFeatures' ? features : null) } },
    store,
  };
}

test('the default is stored with the editor preferences', () => {
  assert.ok(CHROME_KEYS.includes(GHOST_DEFAULT_KEY));
});

test('off for everyone until the user ticks it', () => {
  const win = fakeWin();

  assert.equal(ghostDefaultOn(win), false);
  assert.equal(ghostOn(win), false);
});

test('the default ticked: grey text starts on', () => {
  const win = fakeWin();

  setGhostDefault(win, true);

  assert.equal(ghostOn(win), true);
});

test('off on a site without the feature, whatever the user said', () => {
  const win = fakeWin({ dock_ghost: false });

  setGhostDefault(win, true);
  setGhostOn(win, true);

  assert.equal(ghostAllowed(win), false);
  assert.equal(ghostOn(win), false);
});

test('a site that does not know the feature yet has it off', () => {
  const win = fakeWin({});

  assert.equal(ghostAllowed(win), false);
});

test('the switch is this Live Preview\'s and never writes the default', () => {
  const win = fakeWin();
  const heard = [];
  const stop = onGhostSwitch((changed, on) => changed === win && heard.push(on));

  setGhostOn(win, true);

  assert.equal(ghostOn(win), true);
  assert.equal(ghostDefaultOn(win), false);
  assert.deepEqual(heard, [true]);

  stop();
});

test('Live Preview closing forgets the switch', () => {
  const win = fakeWin();
  const heard = [];
  const stop = onGhostSwitch((changed, on) => changed === win && heard.push(on));

  setGhostOn(win, true);
  forgetGhostSwitch(win);

  assert.equal(ghostOn(win), false);
  assert.deepEqual(heard, [true, false]);

  stop();
});

test('ticking the default is heard while the switch is untouched, not after', () => {
  const win = fakeWin();
  const heard = [];
  const stop = onGhostSwitch((changed, on) => changed === win && heard.push(on));

  setGhostDefault(win, true);
  setGhostOn(win, false);
  setGhostDefault(win, false);

  assert.deepEqual(heard, [true, false]);

  stop();
});
