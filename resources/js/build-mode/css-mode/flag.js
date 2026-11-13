/**
 * Which way Style writes: `tw` or `css`, this browser's choice, on Tailwind until
 * CSS is chosen. Style always has the switch.
 *
 * Owner: Build mode, the CSS mode (resources/js/build-mode/css-mode/).
 * May import: vue, cp/bus.js, lib/storage.js, css-mode/panel-look.js. No editor.
 * Bus: registers `css-mode:on` (the top bar's history asks).
 */

import { ref } from 'vue';
import { register } from '../../cp/bus.js';
import { keepLocal, readLocal } from '../../lib/storage.js';

const MODE_KEY = 'sve-style-mode';

register('css-mode:on', () => true);

/** `tw` or `css`, this browser's choice. */
export const styleMode = ref(readLocal(window, MODE_KEY) === 'css' ? 'css' : 'tw');

export function setStyleMode(mode) {
  styleMode.value = mode === 'css' ? 'css' : 'tw';
  keepLocal(window, MODE_KEY, styleMode.value);
}

if (typeof document !== 'undefined') {
  void import('./panel-look.js').then((module) => module.startPanelLook(document));
}
