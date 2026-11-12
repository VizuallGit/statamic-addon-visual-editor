import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createUndoStack } from '../../resources/js/cp-shell/undo-stack.js';

function history(start = 'a') {
  let state = start;
  const stack = createUndoStack({
    read: () => state,
    write: (next) => {
      state = next;
    },
  });

  stack.capture();

  return {
    stack,
    set: (next) => {
      state = next;
    },
    get: () => state,
  };
}

test('nothing to go back to before a change', () => {
  const { stack } = history();

  assert.equal(stack.canUndo(), false);
  assert.equal(stack.undo(), false);
});

test('back and forward through the changes', () => {
  const { stack, set, get } = history();

  set('b');
  stack.capture();
  set('c');
  stack.capture();
  assert.equal(stack.undo(), true);
  assert.equal(get(), 'b');
  assert.equal(stack.undo(), true);
  assert.equal(get(), 'a');
  assert.equal(stack.canUndo(), false);
  assert.equal(stack.redo(), true);
  assert.equal(get(), 'b');
  assert.equal(stack.redo(), true);
  assert.equal(get(), 'c');
  assert.equal(stack.canRedo(), false);
});

test('a change not yet captured is a step before going back', () => {
  const { stack, set, get } = history();

  set('b');
  assert.equal(stack.undo(), true);
  assert.equal(get(), 'a');
  assert.equal(stack.redo(), true);
  assert.equal(get(), 'b');
});

test('a new change drops what lay ahead', () => {
  const { stack, set } = history();

  set('b');
  stack.capture();
  stack.undo();
  assert.equal(stack.canRedo(), true);
  set('c');
  stack.capture();
  assert.equal(stack.canRedo(), false);
});

test('a state the same as the last is no step', () => {
  const { stack, set } = history();

  set('a');
  assert.equal(stack.capture(), false);
  assert.equal(stack.canUndo(), false);
});

test('a write refused leaves the history where it was', () => {
  let state = 'a';
  let refuse = false;
  const stack = createUndoStack({
    read: () => state,
    write: (next) => {
      if (refuse) {
        return false;
      }

      state = next;

      return true;
    },
  });

  stack.capture();
  state = 'b';
  stack.capture();
  refuse = true;
  assert.equal(stack.undo(), false);
  assert.equal(state, 'b');
  assert.equal(stack.canUndo(), true);
  refuse = false;
  assert.equal(stack.undo(), true);
  assert.equal(state, 'a');
});

test('rebase moves the history without a step', () => {
  const { stack, set } = history();

  set('other file');
  stack.rebase();
  assert.equal(stack.canUndo(), false);
  assert.equal(stack.capture(), false);
});

test('the oldest step goes past the limit', () => {
  let state = 0;
  const stack = createUndoStack({
    read: () => state,
    write: (next) => {
      state = next;
    },
    limit: 2,
  });

  stack.capture();
  [1, 2, 3].forEach((next) => {
    state = next;
    stack.capture();
  });
  assert.equal(stack.undo(), true);
  assert.equal(stack.undo(), true);
  assert.equal(stack.undo(), false);
  assert.equal(state, 1);
});

test('a read with nothing to keep is no state', () => {
  let state = null;
  const stack = createUndoStack({ read: () => state, write: () => {} });

  assert.equal(stack.capture(), false);
  state = 'file';
  assert.equal(stack.capture(), false);
  assert.equal(stack.canUndo(), false);
});
