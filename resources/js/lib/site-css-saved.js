/**
 * "site.css was saved": heard in the window it is fired in, and in every frame
 * under that window.
 *
 * A tool that writes site.css (the Theme panel, the dock's class and utility
 * tools, the file editor) fires `sve:site-css-saved` on its own window. A CP
 * form can sit in a frame under it (the globals panel, the CP inside the
 * overlay), and what that form keeps of the old file must go as well: the
 * swatch list in dedupe-cp-fetch.js, the palette of the colour pickers.
 *
 * The news travels down: each CP window passes it to its frames. It used to
 * travel the other way: a frame put a listener of its own on `window.parent`
 * and `window.top` and never took it off. The page above then held the frame's
 * whole document after the frame was gone, one Live Preview for every time it
 * had been closed (tests/e2e/wear.spec.mjs).
 *
 * So: a listener for this event goes on its own window, nowhere else.
 *
 * May import: nothing.
 */
export const SITE_CSS_SAVED = 'sve:site-css-saved';

/**
 * The windows of the frames in `win` that share its origin. `contentDocument`
 * is null for a frame of another origin; it does not throw.
 */
function framesOf(win) {
  return [...win.document.querySelectorAll('iframe')]
    .filter((frame) => frame.contentDocument)
    .map((frame) => frame.contentWindow);
}

/**
 * From now on, a save heard in `win` is told to each frame under it. A frame
 * that is a CP page runs this too, so the news reaches the frames in it.
 */
export function passSiteCssSavedDown(win) {
  win.addEventListener(SITE_CSS_SAVED, (event) => {
    for (const frame of framesOf(win)) {
      frame.dispatchEvent(new frame.CustomEvent(SITE_CSS_SAVED, { detail: event.detail }));
    }
  });
}
