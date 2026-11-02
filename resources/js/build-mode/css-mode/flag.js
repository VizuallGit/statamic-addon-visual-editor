/**
 * Whether the CSS mode demo is on, and which way Style writes. Off by default:
 * with it off Style is what it was, and nothing else of css-mode/ is loaded.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: vue, cp/bus.js. No editor.
 * Bus: registers `css-mode:on` while the demo is on (the top bar's history asks).
 *
 * `?sve-css-demo=1` on the Control Panel's address turns it on in this browser,
 * `?sve-css-demo=0` off again.
 */

import { ref } from 'vue';
import { register } from '../../cp/bus.js';

const FLAG_KEY = 'sve-css-demo';
const MODE_KEY = 'sve-style-mode';

function stored(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function keep(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* lasts this visit */
  }
}

function askedInAddress() {
  for (const place of [window, window.parent, window.top]) {
    try {
      const said = new URLSearchParams(place.location.search).get(FLAG_KEY);

      if (said === '1' || said === '0') {
        return said;
      }
    } catch {
      /* another origin's window */
    }
  }

  return null;
}

export function cssDemoOn() {
  const said = askedInAddress();

  if (said) {
    keep(FLAG_KEY, said);
  }

  const on = (said || stored(FLAG_KEY)) === '1';

  register('css-mode:on', () => on);

  return on;
}

/** `tw` or `css`, this browser's choice. */
export const styleMode = ref(stored(MODE_KEY) === 'css' ? 'css' : 'tw');

export function setStyleMode(mode) {
  styleMode.value = mode === 'css' ? 'css' : 'tw';
  keep(MODE_KEY, styleMode.value);
}
