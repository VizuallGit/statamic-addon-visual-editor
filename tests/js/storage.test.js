import { test } from 'node:test';
import assert from 'node:assert/strict';

import { keepLocal, readLocal } from '../../resources/js/lib/storage.js';

/** A window whose localStorage works, or throws as a blocked one does. */
function fakeWindow({ blocked = false } = {}) {
  const items = new Map();
  const refuse = () => {
    throw new DOMException('The operation is insecure.', 'SecurityError');
  };

  return {
    items,
    localStorage: {
      getItem: blocked ? refuse : (key) => (items.has(key) ? items.get(key) : null),
      setItem: blocked ? refuse : (key, value) => items.set(key, String(value)),
    },
  };
}

/** What was written with console.warn while `run` ran. */
function warned(run) {
  const lines = [];
  const original = console.warn;

  console.warn = (line) => lines.push(line);

  try {
    run();
  } finally {
    console.warn = original;
  }

  return lines;
}

test('a choice is kept and read back', () => {
  const win = fakeWindow();

  keepLocal(win, 'sve-test-tab', 'style');

  assert.equal(readLocal(win, 'sve-test-tab'), 'style');
  assert.equal(readLocal(win, 'sve-test-none'), null);
});

test('refused storage: reading gives null, keeping goes on, and both say why in the console', () => {
  const win = fakeWindow({ blocked: true });
  let read;
  const lines = warned(() => {
    read = readLocal(win, 'sve-test-blocked');
    keepLocal(win, 'sve-test-blocked', 'x');
  });

  assert.equal(read, null);
  assert.deepEqual(lines, [
    '[sve] storage: read sve-test-blocked: SecurityError: The operation is insecure.',
    '[sve] storage: keep sve-test-blocked: SecurityError: The operation is insecure.',
  ]);
});
