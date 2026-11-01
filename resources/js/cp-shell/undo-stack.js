/**
 * One history of whole states, for the top bar's back and forward (undo-redo.js).
 * Pure: no editor, no bus, no DOM.
 */
const LIMIT = 100;

/**
 * One history. `read()` is the state now, or null when there is none to keep;
 * `write(state)` puts one back, false when it could not; `same(a, b)` says two
 * states are one.
 */
export function createUndoStack({ read, write, same = (a, b) => a === b, limit = LIMIT }) {
  const past = [];
  let future = [];
  let now = null;

  function capture() {
    const next = read();

    if (next === null || next === undefined) {
      return false;
    }

    if (now === null) {
      now = next;

      return false;
    }

    if (same(next, now)) {
      return false;
    }

    past.push(now);

    if (past.length > limit) {
      past.shift();
    }

    future = [];
    now = next;

    return true;
  }

  function step(from, to) {
    capture();

    if (!from().length) {
      return false;
    }

    const state = from().pop();

    if (write(state) === false) {
      from().push(state);

      return false;
    }

    to().push(now);
    now = state;

    return true;
  }

  return {
    capture,
    /** What stands now is where the history is, without a step. */
    rebase() {
      const next = read();

      if (next !== null && next !== undefined) {
        now = next;
      }
    },
    undo: () => step(() => past, () => future),
    redo: () => step(() => future, () => past),
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
  };
}
