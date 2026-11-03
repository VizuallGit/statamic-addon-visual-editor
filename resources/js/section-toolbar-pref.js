/**
 * Whether a page section wears its toolbar in Live Preview: drag, up and down,
 * save, a section below, duplicate, remove. Off unless this user turned it on
 * in Live Preview settings → Top bar.
 *
 * The answer lives on the Control Panel's <html>, where the bridge (Content) and
 * Build's canvas read it on every hover: neither has to be told, and a preview
 * that reloads or morphs still finds it. Stored per user (chrome-prefs syncs the
 * key); only "on" is written.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { SECTION_TOOLBAR_ATTR } from './lib/ids.js';

const KEY = 'sve-section-toolbar';

export function sectionToolbarOn(win) {
  return chromeGet(win, KEY) === 'on';
}

/** Runs with every pass over the Live Preview header, so the attribute follows the stored answer. */
export function applySectionToolbar(win) {
  win.document.documentElement.toggleAttribute(SECTION_TOOLBAR_ATTR, sectionToolbarOn(win));
}

export function setSectionToolbarOn(win, on) {
  if (on) {
    chromeSet(win, KEY, 'on');
  } else {
    chromeRemove(win, KEY);
  }

  applySectionToolbar(win);
}
