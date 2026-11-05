/**
 * Whether Style's class list starts open. Off unless this user turned it on in
 * Live Preview settings → General; the switch on the list itself shows or hides
 * it for the moment, and a Build that starts again starts from this.
 *
 * Its own file so the settings menu reads and writes it without loading Build.
 * Stored per user (chrome-prefs syncs the key); only "on" is written.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';

const KEY = 'sve-build-classes';

/** Said on the window when the setting changes: a Build already open follows it. */
export const CLASSES_DEFAULT_EVENT = 'sve:build-classes-default';

export function buildClassesShownByDefault(win) {
  return chromeGet(win, KEY) === 'on';
}

export function setBuildClassesShownByDefault(win, on) {
  if (on) {
    chromeSet(win, KEY, 'on');
  } else {
    chromeRemove(win, KEY);
  }

  win.dispatchEvent(new CustomEvent(CLASSES_DEFAULT_EVENT));
}
