/**
 * What runs on the real preview, shown on Build's canvas: its videos playing
 * or held, and its dialogs open or shut.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing.
 *
 * The tree's video icon and its Alpine toggle work as they always have: they
 * talk to the real preview (bridge/video-hold.js, bridge/alpine-state.js), and
 * there the video stops and Alpine opens the dialog. In Build the real preview
 * is still rendering underneath the canvas, invisible, and the canvas runs no
 * script — so it showed neither, and only the sound of the popup's video came
 * through. Nothing here talks to the bridge or reads its state: what the real
 * preview shows is the answer, and the canvas follows it.
 *
 *   Videos   a canvas video plays while its twin would play there — playing,
 *            or an autoplay video that is not held (the real preview stops
 *            those once they leave its own viewport, which is not the
 *            canvas's) — and stands still on the twin's frame otherwise.
 *            Muted: the sound is the real preview's, as in Content — one
 *            video heard, not two.
 *   Dialogs  a dialog open in the real preview is open on the canvas, as a
 *            modal when it is one there. The Control Panel calls
 *            `showModal()`: the canvas's sandbox runs no script of its own,
 *            but its document is the CP's to call.
 *
 * Twins are paired by order: the nth video (dialog) under the same section in
 * both documents, the section being the outermost `[data-sid]`. On the canvas
 * the open section's painted root stands for the section the real preview
 * renders for it, whatever the painting carries.
 */

/** The bridge's mark on a held video (bridge/video-hold.js `VIDEO_HOLD_ATTR`) — read, never written. */
const VIDEO_HOLD_ATTR = 'data-sve-video-hold';
/** How far a still canvas video may stand from its twin's frame, in seconds. */
const DRIFT = 0.25;

/** Whether a canvas video plays, from what its twin in the real preview is. */
export function videoShouldPlay({ paused, autoplay, held }) {
  return !paused || (autoplay && !held);
}

/**
 * The twin of each canvas element: `canvas` and `real` are lists of section
 * keys in document order, one per element. Returns, for each canvas element,
 * the index of its twin in `real`, or -1.
 */
export function pairByOrder(canvas, real) {
  const byKey = new Map();

  real.forEach((key, i) => {
    if (!byKey.has(key)) {
      byKey.set(key, []);
    }

    byKey.get(key).push(i);
  });

  const seen = new Map();

  return canvas.map((key) => {
    const n = seen.get(key) || 0;

    seen.set(key, n + 1);

    return byKey.get(key)?.[n] ?? -1;
  });
}

/** The outermost section an element is in; `root` (the canvas's painted root) counts as `rootKey`. */
function sectionKey(el, root, rootKey) {
  let key = '';

  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const sid = node === root ? rootKey : node.getAttribute('data-sid');

    if (sid) {
      key = sid;
    }
  }

  return key;
}

/** The section key of an element in the real preview: the `rootKey` the canvas's root stands for. */
export function sectionKeyOf(el) {
  return el ? sectionKey(el, null, '') : '';
}

function twins(page, realDoc, selector, { root, rootKey, skip }) {
  const mine = [...page.body.querySelectorAll(selector)];
  const theirs = [...realDoc.body.querySelectorAll(selector)].filter((el) => !skip || !el.closest(skip));
  const at = pairByOrder(
    mine.map((el) => sectionKey(el, root, rootKey)),
    theirs.map((el) => sectionKey(el, null, ''))
  );

  return mine.map((el, i) => [el, theirs[at[i]]]).filter(([, twin]) => twin);
}

function followVideo(video, twin) {
  video.muted = true;

  if (videoShouldPlay({ paused: twin.paused, autoplay: twin.hasAttribute('autoplay'), held: twin.hasAttribute(VIDEO_HOLD_ATTR) })) {
    if (video.paused) {
      if (!twin.paused) {
        video.currentTime = twin.currentTime;
      }

      video.play().catch(() => {
        /* not loaded yet: the next follow tries again */
      });
    }

    return;
  }

  if (!video.paused) {
    video.pause();
  }

  if (Math.abs(video.currentTime - twin.currentTime) > DRIFT) {
    video.currentTime = twin.currentTime;
  }
}

function followDialog(dialog, twin) {
  if (!twin.open) {
    if (dialog.open) {
      dialog.close();
    }

    return;
  }

  const modal = twin.matches(':modal');

  if (dialog.open && dialog.matches(':modal') === modal) {
    return;
  }

  // An open dialog cannot be made modal: a morph copies `open` from the real
  // preview, which opens it in the flow — shut that one first.
  if (dialog.open) {
    dialog.close();
  }

  if (modal) {
    dialog.showModal();
  } else {
    dialog.show();
  }
}

/**
 * Bring the canvas's videos and dialogs to what the real preview shows.
 *
 * @param {Document} page     the canvas's document
 * @param {Document} realDoc  the real preview's document
 * @param {object}   opts
 * @param {Element|null} opts.root  the open section's root on the canvas
 * @param {string}   opts.rootKey   the section key of its rendering in the real preview
 * @param {string}   opts.skip      what the canvas leaves off the real preview (never twins)
 */
export function followReal(page, realDoc, { root = null, rootKey = '', skip = '' } = {}) {
  if (!page?.body || !realDoc?.body) {
    return;
  }

  const opts = { root, rootKey, skip };

  for (const [video, twin] of twins(page, realDoc, 'video', opts)) {
    followVideo(video, twin);
  }

  for (const [dialog, twin] of twins(page, realDoc, 'dialog', opts)) {
    followDialog(dialog, twin);
  }
}
