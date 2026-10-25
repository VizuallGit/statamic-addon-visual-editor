/**
 * help-state.js: the user's default and the pane's switch are two answers —
 * the switch starts from the default and never writes it back.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHROME_KEYS } from '../../resources/js/chrome-prefs.js';
import {
  HELP_DEFAULT_KEY,
  forgetHelpSwitch,
  helpDefaultOn,
  helpOn,
  onHelpSwitch,
  setHelpDefault,
  setHelpOn,
} from '../../resources/js/dock/help-state.js';

function fakeWin() {
  const store = new Map();

  return {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    setTimeout: () => 0,
    clearTimeout: () => {},
    Statamic: { $config: { get: () => null } },
    store,
  };
}

test('off for everyone until the user ticks it', () => {
  const win = fakeWin();

  assert.equal(helpDefaultOn(win), false);
  assert.equal(helpOn(win), false);
});

test('the default ticked: help starts on', () => {
  const win = fakeWin();

  setHelpDefault(win, true);

  assert.equal(helpDefaultOn(win), true);
  assert.equal(helpOn(win), true);
});

test('the switch changes this Live Preview, never the default', () => {
  const win = fakeWin();

  setHelpDefault(win, true);
  setHelpOn(win, false);

  assert.equal(helpOn(win), false);
  assert.equal(helpDefaultOn(win), true);

  forgetHelpSwitch(win);

  assert.equal(helpOn(win), true, 'the next Live Preview starts from the default');
});

test('the switch tells who listens, and stops when asked', () => {
  const win = fakeWin();
  const heard = [];
  const stop = onHelpSwitch((changed, on) => heard.push([changed === win, on]));

  setHelpOn(win, true);
  stop();
  setHelpOn(win, false);

  assert.deepEqual(heard, [[true, true]]);
});

test('the default is a preference the server keeps', () => {
  assert.ok(CHROME_KEYS.includes(HELP_DEFAULT_KEY));

  const php = readFileSync(new URL('../../src/Http/Controllers/ChromePrefsController.php', import.meta.url), 'utf8');

  assert.ok(php.includes(`'${HELP_DEFAULT_KEY}'`), 'ChromePrefsController::KEYS');
});
