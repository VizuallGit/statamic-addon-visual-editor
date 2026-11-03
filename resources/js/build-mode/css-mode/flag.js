/**
 * Which way Style writes: `tw` or `css`, this browser's choice, on Tailwind until
 * CSS is chosen. Style always has the switch.
 *
 * Owner: Build mode, the CSS mode (resources/js/build-mode/css-mode/).
 * May import: vue, cp/bus.js, css-mode/panel-look.js. No editor.
 * Bus: registers `css-mode:on` (the top bar's history asks).
 */

import { ref } from 'vue';
import { register } from '../../cp/bus.js';

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

register('css-mode:on', () => true);

/** `tw` or `css`, this browser's choice. */
export const styleMode = ref(stored(MODE_KEY) === 'css' ? 'css' : 'tw');

export function setStyleMode(mode) {
  styleMode.value = mode === 'css' ? 'css' : 'tw';
  keep(MODE_KEY, styleMode.value);
}

if (typeof document !== 'undefined') {
  void import('./panel-look.js').then((module) => module.startPanelLook(document));
}
