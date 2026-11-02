/**
 * Which way Style writes: `tw` or `css`, this browser's choice, on Tailwind until
 * CSS is chosen. Style always has the switch.
 *
 * Owner: Build mode, the CSS mode (resources/js/build-mode/css-mode/).
 * May import: vue, cp/bus.js, css-mode/panel-look.js. No editor.
 * Bus: registers `css-mode:on` (the top bar's history asks).
 * Says on the root whether Style writes CSS, for Tailwind's strip over the canvas.
 */

import { ref, watchEffect } from 'vue';
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

/*
 * Tailwind's strip over the canvas (tw-overlay.js) stays as it is, and in CSS mode
 * shows the tag alone: its chips and its + write classes, and on the canvas that
 * is this choice's to say. Said on the root, from here, as an element's Content
 * tab has the strip too and the rest of css-mode/ loads with Style. Without the
 * canvas (Edit content) it is not Build's, and keeps them. The dock's own Tailwind
 * pane is another door, and stays open.
 */
const STRIP_ATTR = 'data-sve-style-css-on';
const STRIP_STYLE = '__sve-style-css-strip';

if (typeof document !== 'undefined') {
  const style = document.createElement('style');

  style.id = STRIP_STYLE;
  style.textContent = `html[${STRIP_ATTR}]:has(#__sve-build-canvas) #__sve-tw-strip :is([data-group="classes"], [data-group="add"]) { display: none; }`;
  document.head.append(style);

  watchEffect(() => document.documentElement.toggleAttribute(STRIP_ATTR, styleMode.value === 'css'));

  void import('./panel-look.js').then((module) => module.startPanelLook(document));
}
