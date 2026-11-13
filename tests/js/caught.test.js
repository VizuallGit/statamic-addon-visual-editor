import { test } from 'node:test';
import assert from 'node:assert/strict';

import { logCaught } from '../../resources/js/lib/caught.js';

/** What logCaught wrote with console.warn while `run` ran. */
function warned(run) {
  const lines = [];
  const original = console.warn;

  console.warn = (...args) => lines.push(args);

  try {
    run();
  } finally {
    console.warn = original;
  }

  return lines;
}

test('a caught error is written as one line of text: where, name and message', () => {
  const lines = warned(() => logCaught('test: one line', new TypeError('frame is gone')));

  assert.deepEqual(lines, [['[sve] test: one line: TypeError: frame is gone']]);
});

test('the same error at the same place is written once, so a loop cannot flood the console', () => {
  const lines = warned(() => {
    for (let i = 0; i < 50; i++) {
      logCaught('test: in a loop', new Error('again'));
    }
  });

  assert.equal(lines.length, 1);
});

test('another message or another place is written again', () => {
  const lines = warned(() => {
    logCaught('test: two', new Error('first'));
    logCaught('test: two', new Error('second'));
    logCaught('test: other place', new Error('first'));
  });

  assert.equal(lines.length, 3);
});

test('only text reaches the console, never the error object', () => {
  const error = new DOMException('blocked', 'SecurityError');
  const lines = warned(() => logCaught('test: text only', error));

  assert.equal(lines.length, 1);
  assert.deepEqual(
    lines[0].map((arg) => typeof arg),
    ['string']
  );
  assert.equal(lines[0][0], '[sve] test: text only: SecurityError: blocked');
});

test('what is thrown need not be an Error', () => {
  const lines = warned(() => {
    logCaught('test: thrown', 'a string');
    logCaught('test: thrown', undefined);
    logCaught('test: thrown', Object.create(null));
  });

  assert.deepEqual(
    lines.map(([line]) => line),
    ['[sve] test: thrown: a string', '[sve] test: thrown: undefined', '[sve] test: thrown: [object Object]']
  );
});
