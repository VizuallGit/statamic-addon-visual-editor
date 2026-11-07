/**
 * Whether Build's element panel has its Style tab. On unless this user turned
 * it off in Live Preview settings → General: someone who styles in the HTML
 * dock keeps Content, Action and Animation, without Style beside them.
 *
 * Its own file so the settings menu reads and writes it without loading Build.
 * Stored per user (chrome-prefs syncs the key); only "off" is written.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';

const KEY = 'sve-build-style-tab';

/** Said on the window when the setting changes: a Build already open follows it. */
export const STYLE_TAB_EVENT = 'sve:build-style-tab';

export function buildStyleTabShown(win) {
  return chromeGet(win, KEY) !== 'off';
}

export function setBuildStyleTabShown(win, on) {
  if (on) {
    chromeRemove(win, KEY);
  } else {
    chromeSet(win, KEY, 'off');
  }

  win.dispatchEvent(new CustomEvent(STYLE_TAB_EVENT));
}
