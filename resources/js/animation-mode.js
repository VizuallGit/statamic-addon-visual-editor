/**
 * «Stille | Kører», and ▶ in Live Preview — Build's Animation tab talking to
 * the real preview document.
 *
 * «Stille» holds every animation in Live Preview at its end frame; «Kører»
 * plays them as the public site does. The choice is this user's, kept between
 * visits (chrome-prefs). It holds the real preview only — Build's canvas has
 * its own playback — and only while Build is open: the preview is told when
 * Build opens, when a fresh preview's bridge asks (`animation-mode:sync`, from
 * the shell's message listener), and let go when Build closes, so Content
 * shows the page as a visitor gets it. The breakpoint overview's copies hear
 * the toggle with the preview (protocol MIRRORED); one opened later follows
 * at the next toggle.
 *
 * ▶ names the element by the path the open file's rendering is stamped with
 * (html-pick-align.js): the preview finds every rendering of it and plays it
 * (bridge/animation-play.js).
 *
 * Owner: Build's Animation tab (BuildAnimation.vue).
 * May import: vue, cp/bus.js, cp/build-mode/store.js, chrome-prefs.js,
 *   lib/preview-frame.js, lib/protocol.js.
 * Bus: registers `animation-mode:sync`.
 */
import { ref, watch } from 'vue';
import { register } from './cp/bus.js';
import { buildModeUi } from './cp/build-mode/store.js';
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { previewCopies, previewFrame } from './lib/preview-frame.js';
import { MSG, SOURCE } from './lib/protocol.js';

const KEY = 'sve-anim-still';

/** Build's word for the preview: still while Build is open and the user chose it. */
const still = ref(chromeGet(window, KEY) === 'on');

export function animationStill() {
  return still;
}

function post(target, message) {
  target?.postMessage({ source: SOURCE, ...message }, '*');
}

/** Every document that shows the page in Live Preview: the preview, and its copies while the overview is open. */
function frames(win) {
  return [previewFrame(win)?.contentWindow, ...previewCopies(win)].filter(Boolean);
}

function tell(win) {
  const message = { type: MSG.SVE_ANIM_MODE, still: still.value && buildModeUi.mode !== 'content' };

  frames(win).forEach((target) => post(target, message));
}

export function setAnimationStill(win, on) {
  still.value = !!on;

  if (on) {
    chromeSet(win, KEY, 'on');
  } else {
    chromeRemove(win, KEY);
  }

  tell(win);
}

/** ▶: the element at `path` in the open file, played again in the real preview. */
export function playInPreview(win, path) {
  if (path) {
    post(previewFrame(win)?.contentWindow, { type: MSG.SVE_ANIM_PLAY, path });
  }
}

// Build opening or closing: the preview is told, with the choice or without it.
watch(() => buildModeUi.mode !== 'content', () => tell(window), { immediate: true });

// A fresh preview document asks at its bridge's boot (cp-shell's message listener).
register('animation-mode:sync', ({ win } = {}) => {
  if (win) {
    tell(win);
  }
});
