/**
 * How the editor takes the author somewhere: it jumps there, or it glides.
 *
 * Live Preview settings → General, «Smooth scrolling». Off unless this user
 * turned it on: a click on a section in the Control Panel jumps the preview to
 * it, a click in the preview jumps the form to its set, and every other «go
 * to» (a new section, the tree's header/footer, a comment, an accessibility or
 * performance finding, a link field) jumps too. On, they glide as before. The
 * site's own `scroll-behavior` is not this setting's (preview.js holds it at
 * `auto` in Live Preview). Stored per user (chrome-prefs syncs the key); only
 * "on" is written.
 *
 * The Control Panel reads it at every scroll (scrollBehavior). The preview
 * scrolls itself when the CP asks it to focus something, so it is told when the
 * setting changes, after a reset, and when a fresh preview's bridge asks
 * (cp-shell/add-section.js's message listener); bridge/scroll-mode.js keeps
 * the answer.
 *
 * Owner: Live Preview settings (lp-more-menu.js).
 * May import: chrome-prefs.js, lib/preview-frame.js, lib/protocol.js.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { previewFrame } from './lib/preview-frame.js';
import { MSG, SOURCE } from './lib/protocol.js';

const KEY = 'sve-smooth-scroll';

export function smoothScrollOn(win = window) {
  return chromeGet(win, KEY) === 'on';
}

/** What a scrollIntoView / scrollTo in the Control Panel passes as `behavior`. */
export function scrollBehavior(win = window) {
  return smoothScrollOn(win) ? 'smooth' : 'instant';
}

/** The preview hears the setting: it scrolls itself when it is asked to focus a section or a field. */
export function tellScrollMode(win) {
  previewFrame(win)?.contentWindow?.postMessage(
    { source: SOURCE, type: MSG.SVE_SCROLL_MODE, smooth: smoothScrollOn(win) },
    '*'
  );
}

export function setSmoothScrollOn(win, on) {
  if (on) {
    chromeSet(win, KEY, 'on');
  } else {
    chromeRemove(win, KEY);
  }

  tellScrollMode(win);
}
