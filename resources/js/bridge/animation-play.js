/**
 * Animations in the preview, on Build's word.
 *
 * «Stille | Kører» (setAnimationMode). Still, every animated element stands
 * at its end frame: one sheet in the head, which the morph's style sync
 * leaves alone (the `__sve-` prefix, preview.js isPreservedStyle), and a mark
 * on <html>, which no morph redraws. Build's canvas copies the preview's head
 * and leaves the `__sve-` sheets out (canvas.js LEFT_OFF), and its own <html>
 * carries no mark: the canvas keeps its own playback. The sheet is unlayered,
 * so it beats runtime.css's `anim-runtime` and reduced-motion.css's
 * `anim-reduced` layers whatever they say, and it names the runtime's own
 * selectors and nothing of the site's. A hover's transition is the visitor's
 * own gesture and is left as it is; an element that follows the mouse stands
 * where the file put it, so the pointer over the preview moves nothing.
 *
 * ▶ (playAnimation). The element the open file's rendering stamps `path` on
 * (html-pick-align.js), every rendering of it: its animation plays again, or
 * — on an element with none of its own, a section's root — every animation
 * inside it. Played as runtime.js plays a repeat: `data-anim-off` on and off
 * across a style flush. An element out of sight is scrolled into view first,
 * so it can be watched, and so an element held until it is seen is let go.
 * One the file keeps off stays off. In «Stille» the element plays alone,
 * marked out of the sheet's rule while the animations it started run — a
 * ticker's never end, and it runs until Kører or the next ▶. A switch's
 * animation plays when the switch turns on, which the Control Panel does
 * through the Alpine state (bridge/alpine-state.js), not here.
 *
 * Nothing here reaches the file, and nothing of it is in the server's HTML.
 */
import { HT_PATH_ATTR } from '../html-pick-align.js';

const STILL_ATTR = 'data-sve-anim-still';
const PLAYING_ATTR = 'data-sve-anim-playing';
const STILL_SHEET_ID = '__sve-anim-still';
const ANIMATED = '[data-anim]';
/** What runtime.css animates: the element, each child of one that animates its children, each word of one that animates its words. */
const RUNS = ':is([data-anim="self"], [data-anim="parallax"], [data-anim="ticker"], [data-anim="children"] > *, [data-anim="words"] [data-anim-word])';
const STILL_CSS = [
  `html[${STILL_ATTR}] ${RUNS}:not([${PLAYING_ATTR}], [${PLAYING_ATTR}] > *, [${PLAYING_ATTR}] [data-anim-word]) { animation: none; }`,
  `html[${STILL_ATTR}] [data-anim="mouse"] { translate: none; transition: none; }`,
].join('\n');

function still(win) {
  return win.document.documentElement.hasAttribute(STILL_ATTR);
}

export function setAnimationMode(win, data) {
  const doc = win.document;
  const on = !!data.still;

  if (on && !doc.getElementById(STILL_SHEET_ID)) {
    const sheet = doc.createElement('style');

    sheet.id = STILL_SHEET_ID;
    sheet.textContent = STILL_CSS;
    doc.head.appendChild(sheet);
  }

  doc.documentElement.toggleAttribute(STILL_ATTR, on);

  if (!on) {
    doc.querySelectorAll(`[${PLAYING_ATTR}]`).forEach((el) => el.removeAttribute(PLAYING_ATTR));
  }
}

function outOfSight(win, el) {
  const box = el.getBoundingClientRect();

  return box.bottom <= 0 || box.top >= win.innerHeight;
}

/** Element → the play it is on; a ▶ pressed again cancels the last play's animations, whose end says nothing. */
const plays = new WeakMap();

/** The mark that lets the element play in «Stille» goes once the animations the play started are done. */
function untilDone(el) {
  const play = (plays.get(el) || 0) + 1;
  const running = el.getAnimations({ subtree: true });

  plays.set(el, play);

  if (!running.length) {
    el.removeAttribute(PLAYING_ATTR);

    return;
  }

  Promise.allSettled(running.map((animation) => animation.finished)).then(() => {
    if (plays.get(el) === play) {
      el.removeAttribute(PLAYING_ATTR);
    }
  });
}

function replay(win, el) {
  if (el.hasAttribute('data-anim-off')) {
    return;
  }

  if (outOfSight(win, el)) {
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
  }

  const alone = still(win);

  if (alone) {
    el.setAttribute(PLAYING_ATTR, '');
  }

  el.setAttribute('data-anim-off', '');
  void el.offsetWidth;
  el.removeAttribute('data-anim-off');

  if (alone) {
    untilDone(el);
  }
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
