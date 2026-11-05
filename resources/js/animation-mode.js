/**
 * Whether animations run in Live Preview, and ▶ — the Control Panel talking
 * to the real preview document about animations.
 *
 * Live Preview settings → Top bar, «Animationer kører i Live Preview». Off
 * unless this user turned it on: every animation in Live Preview stands at
 * its end frame while the author moves about and scrolls the page, in Content
 * and in Build alike. ▶ in Build's Animation tab still plays one. The public
 * site is untouched. Stored per user (chrome-prefs syncs the key); only "on"
 * is written. Build's canvas has its own playback and is not held.
 *
 * The preview is told when the setting changes, and when a fresh preview's
 * bridge asks (`animation-mode:sync`, from the shell's message listener). The
 * breakpoint overview's copies hear it with the preview (protocol MIRRORED);
 * one opened later follows at the next change.
 *
 * ▶ names the element by the path the open file's rendering is stamped with
 * (html-pick-align.js): the preview finds every rendering of it and plays it
 * (bridge/animation-play.js).
 *
 * Owner: Live Preview settings (lp-more-menu.js); ▶ is Build's Animation tab's.
 * May import: cp/bus.js, chrome-prefs.js, lib/preview-frame.js, lib/protocol.js.
 * Bus: registers `animation-mode:sync`.
 */
import { register } from './cp/bus.js';
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { previewCopies, previewFrame } from './lib/preview-frame.js';
import { MSG, SOURCE } from './lib/protocol.js';

const KEY = 'sve-anim-run';

export function animationsRun(win) {
  return chromeGet(win, KEY) === 'on';
}

function post(target, message) {
  target?.postMessage({ source: SOURCE, ...message }, '*');
}

/** Every document that shows the page in Live Preview: the preview, and its copies while the overview is open. */
function frames(win) {
  return [previewFrame(win)?.contentWindow, ...previewCopies(win)].filter(Boolean);
}

function tell(win) {
  const message = { type: MSG.SVE_ANIM_MODE, still: !animationsRun(win) };

  frames(win).forEach((target) => post(target, message));
}

export function setAnimationsRun(win, on) {
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

// A fresh preview document asks at its bridge's boot (cp-shell's message listener).
register('animation-mode:sync', ({ win } = {}) => {
  if (win) {
    tell(win);
  }
});
