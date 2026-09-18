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
export function mark(name) {
  window.__sveDebug?.ran?.push(name);
}
