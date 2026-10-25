/**
 * help-state.js: the user's default and the pane's switch are two answers —
 * the switch starts from the default and never writes it back.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHROME_KEYS } from '../../resources/js/chrome-prefs.js';
import {
  HELP_CLICK_KEY,
  HELP_DEFAULT_KEY,
  HELP_PICKER_KEY,
  forgetHelpSwitch,
  helpDefaultOn,
  helpOn,
  helpOnClick,
  helpOpensPicker,
  onHelpSwitch,
  setHelpDefault,
  setHelpOn,
  setHelpOnClick,
  setHelpOpensPicker,
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

test('the default ticked while the switch is untouched is heard like the switch', () => {
  const win = fakeWin();
  const heard = [];
  const stop = onHelpSwitch((changed, on) => heard.push([changed === win, on]));

  setHelpDefault(win, true);
  setHelpDefault(win, true, 'the same answer again says nothing');
  setHelpOn(win, false);
  // Switched off by hand: the default changing underneath says nothing now.
  setHelpDefault(win, false);
  setHelpDefault(win, true);
  stop();

  assert.deepEqual(heard, [[true, true], [true, false]]);
});

test('forgetting the switch is heard when it changes the answer', () => {
  const win = fakeWin();
  const heard = [];
  const stop = onHelpSwitch((changed, on) => heard.push(on));

  setHelpOn(win, true);
  forgetHelpSwitch(win);
  forgetHelpSwitch(win, 'nothing to forget twice');
  setHelpDefault(win, true);
  setHelpOn(win, true);
  forgetHelpSwitch(win, 'the default says the same: silence');
  stop();

  assert.deepEqual(heard, [true, false, true, true]);
});

test('the default and the two ways are preferences the server keeps', () => {
  const php = readFileSync(new URL('../../src/Http/Controllers/ChromePrefsController.php', import.meta.url), 'utf8');

  for (const key of [HELP_DEFAULT_KEY, HELP_CLICK_KEY, HELP_PICKER_KEY]) {
    assert.ok(CHROME_KEYS.includes(key), `CHROME_KEYS ${key}`);
    assert.ok(php.includes(`'${key}'`), `ChromePrefsController::KEYS ${key}`);
  }
});

test('how it behaves: on a click and into the picker, until the user says otherwise', () => {
  const win = fakeWin();

  assert.equal(helpOnClick(win), true);
  assert.equal(helpOpensPicker(win), true);

  setHelpOnClick(win, false);
  setHelpOpensPicker(win, false);
  assert.equal(helpOnClick(win), false);
  assert.equal(helpOpensPicker(win), false);

  setHelpOnClick(win, true);
  assert.equal(helpOnClick(win), true);
  assert.equal(helpOpensPicker(win), false, 'the two are not one setting');

  // Neither is the switch: help itself stays as it was.
  assert.equal(helpOn(win), false);
});
