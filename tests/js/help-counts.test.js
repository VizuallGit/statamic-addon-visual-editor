/**
 * help-counts.js: what the author takes is counted by tag and row, kept with
 * their editor preferences, and sorts the popup's middle — the class first
 * and the id last whatever is counted.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHROME_KEYS } from '../../resources/js/chrome-prefs.js';
import { HELP_COUNTS_KEY, countHelpUse, helpCounts } from '../../resources/js/dock/help-counts.js';
import { helpSuggestions } from '../../resources/js/dock/help-suggest.js';

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

const caret = (html, marker = '|') => ({ html: html.replace(marker, ''), at: html.indexOf(marker) });
const ids = (list) => list.map((item) => item.id);

test('nothing counted: an empty map, also from a blob that is not one', () => {
  const win = fakeWin();

  assert.deepEqual(helpCounts(win), {});
  assert.deepEqual(helpCounts(null), {});

  win.localStorage.setItem(HELP_COUNTS_KEY, '[1,2]');
  assert.deepEqual(helpCounts(win), {});

  win.localStorage.setItem(HELP_COUNTS_KEY, 'not json');
  assert.deepEqual(helpCounts(win), {});
});

test('a row taken is one more under its tag', () => {
  const win = fakeWin();

  countHelpUse(win, 'div', 'visual-edit');
  countHelpUse(win, 'div', 'visual-edit');
  countHelpUse(win, 'div', 'alpine:x-show');
  countHelpUse(win, 'a', 'url');
  countHelpUse(win, '', 'url');
  countHelpUse(win, 'a', '');

  assert.deepEqual(helpCounts(win), { div: { 'visual-edit': 2, 'alpine:x-show': 1 }, a: { url: 1 } });
});

test('the key is one the chrome prefs store — JS and PHP alike', () => {
  const php = readFileSync(new URL('../../src/Http/Controllers/ChromePrefsController.php', import.meta.url), 'utf8');

  assert.ok(CHROME_KEYS.includes(HELP_COUNTS_KEY));
  assert.ok(php.includes(`'${HELP_COUNTS_KEY}'`));
});

test('helpSuggestions: every row names its tag, and the counts sort the middle', () => {
  const fields = [
    { var: 'body', label: 'Body', type: 'bard' },
    { var: 'items', label: 'Items', type: 'grid', loop: true, value: '3 rows' },
    { var: 'title', label: 'Title', type: 'text', parent: 'items' },
  ];
  const { html, at } = caret('<div>|</div>');
  const plain = helpSuggestions(html, at, { fields });

  assert.ok(plain.every((row) => row.tag === 'div'));
  assert.deepEqual(ids(plain), ['class', 'visual-edit', 'loop:items', 'text:body', 'id']);

  const counted = helpSuggestions(html, at, { fields, counts: { div: { 'text:body': 5, 'loop:items': 2 } } });

  assert.deepEqual(ids(counted), ['class', 'text:body', 'loop:items', 'visual-edit', 'id']);

  // Counts on another tag move nothing here.
  assert.deepEqual(ids(helpSuggestions(html, at, { fields, counts: { a: { 'text:body': 5 } } })), ids(plain));
});
