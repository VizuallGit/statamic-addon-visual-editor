/**
 * A trace of what booted, for the browser tests only.
 *
 * The tests create `window.__sveDebug = { ran: [] }` before any script runs
 * (puppeteer's evaluateOnNewDocument); each side module then marks itself.
 * A normal Control Panel page never has the object, so nothing is recorded
 * and no global is created — the bundle only ever reads it.
 *
 * May import: nothing.
 */
/** The tests' object, or null — also when there is no window (node tests). */
function debugObject() {
  return typeof window === 'undefined' ? null : window.__sveDebug || null;
}

export function mark(name) {
  debugObject()?.ran?.push(name);
}

/**
 * A fact for the test to read (`window.__sveDebug.notes[name]`), kept only
 * while the tests' object is there. Small values only — what a step decided.
 */
export function note(name, data) {
  const debug = debugObject();

  if (!debug) {
    return;
  }

  (debug.notes ||= {})[name] = data;
}

/** One line in the test's log (`window.__sveDebug.log`), with the time. */
export function log(text) {
  const debug = debugObject();

  if (!debug) {
    return;
  }

  (debug.log ||= []).push(`${Math.round(performance.now())} ${text}`);
}
