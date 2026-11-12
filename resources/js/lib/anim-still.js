/**
 * Animations held still, and one let play alone — the rule, once, for every
 * document that shows the page: Live Preview (bridge/animation-play.js) and
 * Build's canvas (animation-mode.js holds it, BuildAnimation.vue plays on it).
 *
 * Held, every animated element stands at its end frame: one sheet, under the
 * document's own id, and a mark on its <html>, which no morph redraws. The
 * sheet is unlayered, so it beats runtime.css's `anim-runtime` and
 * reduced-motion.css's `anim-reduced` layers whatever they say, and it names
 * the runtime's own selectors and nothing of the site's. A hover's transition
 * is the visitor's own gesture and is left as it is; an element that follows
 * the mouse stands where the file put it.
 *
 * Played alone, the element is marked out of the sheet's rule — it, its
 * children, its words — until the animations the play started are done. A
 * ticker's never end: it runs until the next play or the setting changes.
 * The mark is set whether the document is held or not: Build's canvas reverts
 * reduce motion for what carries it (canvas-motion.css), so ▶ shows the
 * motion as set either way.
 *
 * Pure DOM, no imports: the bridge (kernel) and the Control Panel both use it.
 */
export const STILL_ATTR = 'data-sve-anim-still';
export const PLAYING_ATTR = 'data-sve-anim-playing';
export const STILL_SHEET_ID = '__sve-anim-still';

/** What runtime.css animates: the element, each child of one that animates its children, each word of one that animates its words. */
const RUNS =
  ':is([data-anim="self"], [data-anim="parallax"], [data-anim="ticker"], [data-anim="children"] > *, [data-anim="words"] [data-anim-word])';

export const STILL_CSS = [
  `html[${STILL_ATTR}] ${RUNS}:not([${PLAYING_ATTR}], [${PLAYING_ATTR}] > *, [${PLAYING_ATTR}] [data-anim-word]) { animation: none; }`,
  `html[${STILL_ATTR}] [data-anim="mouse"] { translate: none; transition: none; }`,
].join('\n');

/**
 * Held or let go. The sheet is hung once, under `id` in `into` (the preview's
 * head; the canvas hangs its own after its body, where no morph meets it), and
 * stays: the mark on <html> is the switch. Either way nothing stays singled
 * out — a play's mark belongs to the setting it was pressed under.
 */
export function applyStill(doc, still, { id = STILL_SHEET_ID, into = doc.head } = {}) {
  if (still && !doc.getElementById(id)) {
    const sheet = doc.createElement('style');

    sheet.id = id;
    sheet.textContent = STILL_CSS;
    into.appendChild(sheet);
  }

  doc.documentElement.toggleAttribute(STILL_ATTR, still);
  doc.querySelectorAll(`[${PLAYING_ATTR}]`).forEach((el) => el.removeAttribute(PLAYING_ATTR));
}

/** Element → the play it is on; a play pressed again cancels the last play's animations, whose end says nothing. */
const plays = new WeakMap();

/** The mark goes once the animations the play started are done. */
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

/**
 * The element's animation from its first frame, as runtime.js plays a repeat:
 * the runtime's own off switch, on and off across a style flush (a finished
 * CSS animation is gone from getAnimations()). Marked to play alone while it
 * runs.
 */
export function playAlone(el) {
  el.setAttribute(PLAYING_ATTR, '');
  el.setAttribute('data-anim-off', '');
  void el.offsetWidth;
  el.removeAttribute('data-anim-off');
  untilDone(el);
}
