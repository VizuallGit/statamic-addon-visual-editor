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
import { sidElement } from '../html-pick-align.js';

export const VIDEO_HOLD_ATTR = 'data-sve-video-hold';
const AUTOPLAY_ATTR = 'data-sve-video-autoplay';

function pauseAgain(event) {
  event.target.pause();
}

/**
 * What the parser would have set. Chrome takes a media element's muted state
 * from the `muted` attribute only while parsing; an element the editor makes
 * itself — a tag renamed in the dock, a morph's copy — keeps the attribute and
 * loses the state. An unmuted video neither autoplays nor plays on request
 * until somebody clicks the page, which in the preview nobody does.
 */
function mirrorMuted(el) {
  if (el.hasAttribute('muted') && !el.muted) {
    el.muted = true;
  }
}

/**
 * Play, as the file asks — and muted for the preview's sake if the browser
 * refuses otherwise: the preview is not the site, and a silent picture of the
 * section beats a still one.
 */
function play(el) {
  mirrorMuted(el);

  Promise.resolve()
    .then(() => el.play())
    .catch(() => {
      if (el.muted) {
        throw new Error('refused');
      }

      el.muted = true;

      return el.play();
    })
    .catch(() => {
      /* nothing more to try without a gesture */
    });
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
  }

  // The icon says play, so it plays — whether or not the file autoplays, and
  // whether or not the hold happened to see the attribute when it was set.
  play(el);
}

/**
 * The videos a hold speaks of: those of the section `uid` names. A uid may
 * be a block inside the section that holds no video itself; then the nearest
 * marked ancestor with one is taken. A hold that names nothing with a video
 * in it means nothing — it used to mean every video on the page, so a hold
 * remembered for one section stopped the video in another the moment that
 * section was opened.
 */
function videosOf(doc, uid, uids = []) {
  let scope = sidElement(doc, uid, uids);

  while (scope && !scope.querySelector('video')) {
    scope = scope.parentElement?.closest?.(`[${SID_ATTR}]`) || null;
  }

  return scope ? [...scope.querySelectorAll('video')] : [];
}

/** The videos one hold speaks of. */
function targetsOf(doc, item) {
  const videos = videosOf(doc, item.uid, item.uids);

  // A loop draws more videos than the file has tags: the nth row past the
  // end means every one of them.
  return item.nth === null || item.nth >= videos.length ? videos : [videos[item.nth]].filter(Boolean);
}

export function setVideoHold(win, data) {
  const uid = typeof data.uid === 'string' ? data.uid : '';
  const uids = Array.isArray(data.uids) ? data.uids.filter((id) => typeof id === 'string') : [];
  const nth = Number.isInteger(data.nth) ? data.nth : null;
  const key = `${uid}:${nth === null ? '*' : nth}`;

  if (data.on) {
    bridgeState.videoHolds.set(key, { uid, uids, nth });
  } else {
    // Play wins over every hold that reaches the same video, not only the one
    // with the same name. The panel names the section it has open, and after
    // a trip through another section and back that name can differ from the
    // one the hold was set with; a hold left behind under the old name would
    // keep the video still while the icon says play.
    const released = new Set(targetsOf(win.document, { uid, uids, nth }));

    bridgeState.videoHolds.delete(key);
    bridgeState.videoHolds.forEach((item, name) => {
      if (targetsOf(win.document, item).some((video) => released.has(video))) {
        bridgeState.videoHolds.delete(name);
      }
    });
  }

  applyVideoHolds(win);
}

/**
 * The rule, stated once: an autoplay video that is not held plays. Whatever
 * pauses it — a redraw, a section left, a frame opened over it, the browser
 * — is undone on the next tick, unless the icon holds it or the viewer has
 * controls of their own. Nothing else in the editor may stop a video.
 */
export function watchVideoPauses(win) {
  const doc = win.document;

  if (doc._sveVideoWatch) {
    return;
  }

  doc._sveVideoWatch = true;
  doc.addEventListener(
    'pause',
    (event) => {
      const el = event.target;

      if (!(el instanceof win.HTMLVideoElement)) {
        return;
      }

      win.setTimeout(() => {
        if (
          el.isConnected &&
          el.paused &&
          !el.ended &&
          el.hasAttribute('autoplay') &&
          !el.hasAttribute('controls') &&
          !el.hasAttribute(VIDEO_HOLD_ATTR)
        ) {
          play(el);
        }
      }, 0);
    },
    true
  );
}

/** Every held video paused, every released one let go — after a morph too. */
export function applyVideoHolds(win) {
  const doc = win.document;
  const want = new Set();

  for (const item of bridgeState.videoHolds.values()) {
    targetsOf(doc, item).forEach((video) => want.add(video));
  }

  doc.querySelectorAll(`video[${VIDEO_HOLD_ATTR}]`).forEach((video) => {
    if (!want.has(video)) {
      release(video);
    }
  });

  want.forEach(hold);

  // The rest play as the file says. A morph can hand back a video that has
  // `autoplay` and never started — the attribute added to a loaded element
  // starts nothing — or one that lost its muted state on the way; both are
  // put right here, after every draw. A video with controls is the viewer's
  // to pause, and is left as it is.
  doc.querySelectorAll('video[autoplay]:not([controls])').forEach((video) => {
    if (!want.has(video) && video.paused && !video.ended) {
      play(video);
    }
  });
}
