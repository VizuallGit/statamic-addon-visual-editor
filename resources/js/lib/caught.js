/**
 * An error the editor caught and carried on past, written to the console.
 *
 * A `catch` that does nothing hides the fault it caught; the quality gate
 * counts those (quality-baseline/catches.json). Where the editor rightly goes
 * on after an error (storage the browser blocks, a frame already on its way
 * out, a pointer let go before it was captured), the catch hands the error
 * here instead of dropping it, and says where it was caught.
 *
 * One line per place and message per page: a catch inside a loop or a stream
 * of pointer events cannot flood the console. Only text is logged, never the
 * error object. The console keeps what it is given, and an error made in a
 * closed frame would keep that frame's whole document alive.
 *
 * May import: nothing.
 */
const SEEN_MAX = 500;
const seen = new Set();

/** The error as one line: its name and message, or what was thrown. */
function describe(error) {
  if (error === null || typeof error !== 'object') {
    return String(error);
  }

  if (typeof error.message !== 'string') {
    return Object.prototype.toString.call(error);
  }

  return `${typeof error.name === 'string' ? error.name : 'Error'}: ${error.message}`;
}

/**
 * Log an error that was caught and lived with.
 *
 * @param {string} where the file and what it was doing, e.g. "globals-panel: dismiss menus"
 * @param {unknown} error what the catch received
 */
export function logCaught(where, error) {
  const line = `[sve] ${where}: ${describe(error)}`;

  if (seen.has(line)) {
    return;
  }

  if (seen.size >= SEEN_MAX) {
    seen.clear();
  }

  seen.add(line);
  console.warn(line);
}

/**
 * Run each function, in order. One that throws is logged and the rest still
 * run: a close must not stop half-way because one listener's window is gone.
 *
 * @param {Iterable<Function>} fns
 * @param {string} where who is running them, for the log
 */
export function runEach(fns, where) {
  for (const fn of fns) {
    try {
      fn();
    } catch (error) {
      logCaught(where, error);
    }
  }
}
