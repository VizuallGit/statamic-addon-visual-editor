/**
 * Animations in the preview, on the Control Panel's word.
 *
 * Live Preview settings → General, «Animationer kører» (setAnimationMode),
 * off unless the user turned it on (animation-mode.js). Still, every animated
 * element stands at its end frame (lib/anim-still.js): the sheet in the head,
 * which the morph's style sync leaves alone (the `__sve-` prefix, preview.js
 * isPreservedStyle), and the mark on <html>, which no morph redraws. Build's
 * canvas leaves the preview's `__sve-` sheets and its mark out (canvas.js) and
 * is held by the same setting under its own sheet (animation-mode.js).
 *
 * ▶ (playAnimation). The element the open file's rendering stamps `path` on
 * (html-pick-align.js), every rendering of it: its animation plays again, or
 * — on an element with none of its own, a section's root — every animation
 * inside it, alone (lib/anim-still.js playAlone). An element out of sight is
 * scrolled into view first, so it can be watched, and so an element held
 * until it is seen is let go. One the file keeps off stays off. A switch's
 * animation plays when the switch turns on, which the Control Panel does
 * through the Alpine state (bridge/alpine-state.js), not here.
 *
 * Nothing here reaches the file, and nothing of it is in the server's HTML.
 */
import { HT_PATH_ATTR } from '../html-pick-align.js';
import { applyStill, playAlone } from '../lib/anim-still.js';

const ANIMATED = '[data-anim]';

export function setAnimationMode(win, data) {
  applyStill(win.document, !!data.still);
}

function outOfSight(win, el) {
  const box = el.getBoundingClientRect();

  return box.bottom <= 0 || box.top >= win.innerHeight;
}

function replay(win, el) {
  if (el.hasAttribute('data-anim-off')) {
    return;
  }

  if (outOfSight(win, el)) {
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
  }

  playAlone(el);
}

export function playAnimation(win, data) {
  const path = typeof data.path === 'string' ? data.path : '';

  if (!path) {
    return;
  }

  for (const el of win.document.querySelectorAll(`[${HT_PATH_ATTR}="${CSS.escape(path)}"]`)) {
    const targets = el.matches(ANIMATED) ? [el] : [...el.querySelectorAll(ANIMATED)];

    targets.forEach((target) => replay(win, target));
  }
}
