/**
 * ghost-memory.js: what the dock's AI remembers of one author — the
 * suggestions they took (short, newest last, no repeats) and this month's
 * counts, which start over with the month.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHROME_KEYS } from '../../resources/js/chrome-prefs.js';
import {
  GHOST_COUNTS_KEY,
  GHOST_TAKEN_KEY,
  LINE_CHARS,
  MAX_TAKEN,
  TAKEN_CHARS,
  countGhost,
  ghostCounts,
  monthOf,
  rememberTaken,
  takenRate,
  takenRows,
} from '../../resources/js/dock/ghost-memory.js';

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

test('both are stored with the editor preferences', () => {
  assert.ok(CHROME_KEYS.includes(GHOST_TAKEN_KEY));
  assert.ok(CHROME_KEYS.includes(GHOST_COUNTS_KEY));
});

test('taken suggestions are kept newest last, short, and at most a handful', () => {
  const win = fakeWin();

  for (let i = 1; i <= MAX_TAKEN + 3; i++) {
    rememberTaken(win, `<h2 ${i}`, `edit field="t${i}" }}`);
  }

  const rows = takenRows(win);

  assert.equal(rows.length, MAX_TAKEN);
  assert.equal(rows.at(-1).text, `edit field="t${MAX_TAKEN + 3}" }}`);

  rememberTaken(win, 'x'.repeat(LINE_CHARS + 50), 'y'.repeat(TAKEN_CHARS + 50));

  assert.equal(takenRows(win).at(-1).line.length, LINE_CHARS);
  assert.equal(takenRows(win).at(-1).text.length, TAKEN_CHARS);
});

test('the same suggestion taken again is kept once, moved to the end', () => {
  const win = fakeWin();

  rememberTaken(win, 'a', 'one');
  rememberTaken(win, 'b', 'two');
  rememberTaken(win, 'c', 'one');

  assert.deepEqual(takenRows(win).map((row) => row.text), ['two', 'one']);
});

test('nothing taken, nothing kept', () => {
  const win = fakeWin();

  rememberTaken(win, 'a', '   ');

  assert.deepEqual(takenRows(win), []);
});

test('counts add up within a month and start over in the next', () => {
  const win = fakeWin();
  const october = new Date(2026, 9, 26);
  const november = new Date(2026, 10, 1);

  countGhost(win, 'shown', october);
  countGhost(win, 'shown', october);
  countGhost(win, 'taken', october);
  countGhost(win, 'nonsense', october);

  assert.deepEqual(ghostCounts(win, october), { month: '2026-10', shown: 2, taken: 1, edits: 0, kept: 0 });
  assert.equal(takenRate(ghostCounts(win, october)), 50);
  assert.deepEqual(ghostCounts(win, november), { month: '2026-11', shown: 0, taken: 0, edits: 0, kept: 0 });
  assert.equal(takenRate(ghostCounts(win, november)), 0);
  assert.equal(monthOf(october), '2026-10');
});
