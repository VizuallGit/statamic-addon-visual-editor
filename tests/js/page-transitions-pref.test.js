import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  PAGE_TRANSITIONS_KEY,
  pageTransitionsOn,
  setPageTransitionsOn,
} from '../../resources/js/page-transitions-pref.js';
import { CHROME_KEYS } from '../../resources/js/chrome-prefs.js';

const read = (path) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), 'utf8');

function fakeWin() {
  const store = new Map();
  const posts = [];

  return {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    setTimeout: () => 0,
    clearTimeout: () => {},
    fetch: (url, init) => {
      posts.push({ url, prefs: JSON.parse(init.body).prefs });
      return Promise.resolve();
    },
    document: { querySelector: () => null },
    Statamic: { $config: { get: () => null } },
    posts,
  };
}

test('off by default; on is written, off takes the key away', () => {
  const win = fakeWin();

  assert.equal(pageTransitionsOn(win), false);
  setPageTransitionsOn(win, true);
  assert.equal(pageTransitionsOn(win), true);
  setPageTransitionsOn(win, false);
  assert.equal(pageTransitionsOn(win), false);
});

test('a change is saved to the server at once, so the next preview render has it', () => {
  const win = fakeWin();

  setPageTransitionsOn(win, true);
  assert.equal(win.posts.length, 1);
  assert.equal(win.posts[0].url, '/!/sve/chrome-prefs');
  assert.equal(win.posts[0].prefs[PAGE_TRANSITIONS_KEY], 'on');

  setPageTransitionsOn(win, false);
  assert.equal(win.posts.length, 2);
  assert.equal(win.posts[1].prefs[PAGE_TRANSITIONS_KEY], undefined);
});

test("the key travels with the user's preferences, in the browser and on the server", () => {
  assert.ok(CHROME_KEYS.includes(PAGE_TRANSITIONS_KEY));
  assert.match(read('src/Http/Controllers/ChromePrefsController.php'), /'sve-page-transitions',/);
  assert.match(read('src/Http/Middleware/InjectBridgeScript.php'), /PAGE_TRANSITIONS_KEY = 'sve-page-transitions'/);
});

test('the switch stands in General with the other Live Preview switches', () => {
  assert.match(read('resources/js/cp/surfaces/LpSettingsGeneral.vue'), /data-sve-page-transitions-setting/);
  assert.match(read('resources/js/lp-more-menu.js'), /pageTransitions: \(on\) => setPageTransitionsOn\(win, on\)/);
  assert.match(read('resources/lang/en/messages.php'), /'lp_settings_page_transitions' =>/);
});
