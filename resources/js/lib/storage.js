/**
 * This browser's storage, for the editor's small remembered choices: a tab, a
 * unit, a view. The browser may refuse it (storage blocked for the site, or
 * full); then the choice lasts this visit, and why is logged (lib/caught.js).
 *
 * Every panel used to carry its own try/catch around `localStorage`, most of
 * them silent. These two are that copy.
 *
 * May import: lib/caught.js.
 */
import { logCaught } from './caught.js';

/** The stored text, or null when there is none or the browser refuses. */
export function readLocal(win, key) {
  try {
    return win.localStorage.getItem(key);
  } catch (error) {
    logCaught(`storage: read ${key}`, error);

    return null;
  }
}

/** Remember a text. Refused, it lasts this visit. */
export function keepLocal(win, key, value) {
  try {
    win.localStorage.setItem(key, value);
  } catch (error) {
    logCaught(`storage: keep ${key}`, error);
  }
}
