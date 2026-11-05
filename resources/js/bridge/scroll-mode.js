/**
 * How the preview scrolls when the Control Panel asks it to focus something:
 * a jump, unless the author turned on «Smooth scrolling» in Live Preview
 * settings → General (scroll-pref.js in the CP).
 *
 * A fresh document jumps until the CP answers its boot request
 * (`sve-scroll-mode-request`); the CP says so again at every change.
 *
 * `revealOptions` is the other half of the same question — not how, but
 * whether and where to: what a click on a row in the CP (the HTML tree, the
 * block tree, the selection panel) does to the preview.
 */
let smooth = false;

/**
 * How to bring an element into view after a click on its row — or null when
 * it already is wholly on screen, so the page stays where the author left it
 * and the pulse alone says where the element sits.
 *
 * Taller than the viewport, it is aligned to its top: a section's heading is
 * the start of it, and the middle of a tall section is nothing in particular.
 * Otherwise it is centred, so what surrounds it is seen too.
 *
 * Pure: `rect` is the element's getBoundingClientRect, `viewportHeight` the
 * window's innerHeight.
 */
export function revealOptions(rect, viewportHeight) {
  if (!rect || !(viewportHeight > 0)) {
    return null;
  }

  if (rect.top >= 0 && rect.bottom <= viewportHeight) {
    return null;
  }

  return { block: rect.height > viewportHeight ? 'start' : 'center' };
}

/** `sve-scroll-mode` from the CP: `smooth: true` glides, false jumps. */
export function setScrollMode(data) {
  smooth = data?.smooth === true;
}

/** What a scrollIntoView in the preview passes as `behavior`. */
export function scrollBehavior() {
  return smooth ? 'smooth' : 'instant';
}
