/**
 * Whether the CSS mode demo is on, and which way Style writes. Off by default:
 * with it off Style is what it was, and nothing else of css-mode/ is loaded.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: vue, cp/bus.js, and css-mode/contrast.js and panel-look.js when it is on. No editor.
 * Bus: registers `css-mode:on` while the demo is on (the top bar's history asks).
 * Says on the root whether Style writes CSS, for Tailwind's strip over the canvas.
 *
 * `?sve-css-demo=1` on the Control Panel's address turns it on in this browser,
 * `?sve-css-demo=0` off again.
 */

import { ref, watchEffect } from 'vue';
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

if (typeof document !== 'undefined' && (askedInAddress() || stored(FLAG_KEY)) === '1') {
  const style = document.createElement('style');

  style.id = STRIP_STYLE;
  style.textContent = `html[${STRIP_ATTR}]:has(#__sve-build-canvas) #__sve-tw-strip :is([data-group="classes"], [data-group="add"]) { display: none; }`;
  document.head.append(style);

  watchEffect(() => document.documentElement.toggleAttribute(STRIP_ATTR, styleMode.value === 'css'));

  // A chunk of its own: with the flag off none of this is loaded.
  void import('./contrast.js').then((module) => module.followContrast(window));
  void import('./panel-look.js').then((module) => module.startPanelLook(document));
}
