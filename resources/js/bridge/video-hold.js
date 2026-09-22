/**
 * A video held still in the preview.
 *
 * A video that autoplays plays in the editor too, over the section being
 * built, and the only way to stop it used to be taking `autoplay` out of
 * the file and putting it back before going live. The tree's video icon
 * holds it instead: paused, autoplay set aside, and a press on the controls
 * pauses it again. The hold lives in the bridge, keyed by section and by
 * which of its videos, so a morph — which redraws the section and would
 * start the video afresh — puts it back.
 *
 * Nothing here reaches the file; the site keeps its autoplay.
 */
import { bridgeState } from './state.js';
import { SID_ATTR } from '../bridge.js';

export const VIDEO_HOLD_ATTR = 'data-sve-video-hold';
const AUTOPLAY_ATTR = 'data-sve-video-autoplay';

function pauseAgain(event) {
  event.target.pause();
}

function hold(el) {
  if (!el.hasAttribute(VIDEO_HOLD_ATTR)) {
    el.setAttribute(VIDEO_HOLD_ATTR, '');
    el.addEventListener('play', pauseAgain);
  }

  if (el.hasAttribute('autoplay')) {
    el.setAttribute(AUTOPLAY_ATTR, '');
    el.removeAttribute('autoplay');
  }

  el.autoplay = false;

  if (!el.paused) {
    el.pause();
  }
}

function release(el) {
  el.removeAttribute(VIDEO_HOLD_ATTR);
  el.removeEventListener('play', pauseAgain);

  if (el.hasAttribute(AUTOPLAY_ATTR)) {
    el.removeAttribute(AUTOPLAY_ATTR);
    el.setAttribute('autoplay', '');
    el.autoplay = true;

    try {
      const playing = el.play();

      playing?.catch?.(() => {});
    } catch {
      /* a browser that refuses autoplay after a gesture-less release */
    }
  }
}

/**
 * The videos a hold speaks of: those of the section `uid` names. A uid may
 * be a block inside the section that holds no video itself; then the nearest
 * marked ancestor with one is taken, and the page as a whole when none is.
 */
function videosOf(doc, uid) {
  let scope = uid ? doc.querySelector(`[${SID_ATTR}="${CSS.escape(uid)}"]`) : null;

  while (scope && !scope.querySelector('video')) {
    scope = scope.parentElement?.closest?.(`[${SID_ATTR}]`) || null;
  }

  return [...(scope || doc).querySelectorAll('video')];
}

export function setVideoHold(win, data) {
  const uid = typeof data.uid === 'string' ? data.uid : '';
  const nth = Number.isInteger(data.nth) ? data.nth : null;
  const key = `${uid}:${nth === null ? '*' : nth}`;

  if (data.on) {
    bridgeState.videoHolds.set(key, { uid, nth });
  } else {
    bridgeState.videoHolds.delete(key);
  }

  applyVideoHolds(win);
}

/** Every held video paused, every released one let go — after a morph too. */
export function applyVideoHolds(win) {
  const doc = win.document;
  const want = new Set();

  for (const item of bridgeState.videoHolds.values()) {
    const videos = videosOf(doc, item.uid);
    // A loop draws more videos than the file has tags: the nth row past the
    // end means every one of them.
    const targets = item.nth === null || item.nth >= videos.length ? videos : [videos[item.nth]];

    targets.forEach((video) => video && want.add(video));
  }

  doc.querySelectorAll(`video[${VIDEO_HOLD_ATTR}]`).forEach((video) => {
    if (!want.has(video)) {
      release(video);
    }
  });

  want.forEach(hold);
}
