/**
 * build-style-pref.js — Build's Style tab is on until this user turns it off;
 * off, the panel shows Content, Action and Animation, and Content stands where Style was.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STYLE_TAB_EVENT, buildStyleTabShown, setBuildStyleTabShown } from '../../resources/js/build-style-pref.js';
import { CHROME_KEYS } from '../../resources/js/chrome-prefs.js';

const read = (path) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), 'utf8');

function fakeWin() {
  const store = new Map();
  const said = [];

  return {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    setTimeout: () => 0,
    clearTimeout: () => {},
    dispatchEvent: (event) => said.push(event.type),
    Statamic: { $config: { get: () => null } },
    said,
  };
}

test('on by default; off is written and said, on again takes the key away', () => {
  const win = fakeWin();

  assert.equal(buildStyleTabShown(win), true);
  setBuildStyleTabShown(win, false);
  assert.equal(buildStyleTabShown(win), false);
  assert.deepEqual(win.said, [STYLE_TAB_EVENT]);
  setBuildStyleTabShown(win, true);
  assert.equal(buildStyleTabShown(win), true);
});

test("the key travels with the user's preferences, in the browser and on the server", () => {
  assert.ok(CHROME_KEYS.includes('sve-build-style-tab'));
  assert.match(read('src/Http/Controllers/ChromePrefsController.php'), /'sve-build-style-tab',/);
});

test('the panel leaves Style out when it is off, and shows Content where Style was', () => {
  const panel = read('resources/js/cp/surfaces/BuildPanel.vue');

  assert.match(panel, /\]\.filter\(\(\[value\]\) => value !== 'style' \|\| styleShown\.value\)/);
  assert.match(panel, /chosen\.value === 'style' && !styleShown\.value\)? \? 'content'/);
  assert.match(read('resources/js/lp-more-menu.js'), /styleTab: \(on\) => setBuildStyleTabShown\(win, on\)/);
});
