/**
 * How the preview scrolls when the Control Panel asks it to focus something:
 * a jump, unless the author turned on «Smooth scrolling» in Live Preview
 * settings → General (scroll-pref.js in the CP).
 *
 * A fresh document jumps until the CP answers its boot request
 * (`sve-scroll-mode-request`); the CP says so again at every change.
 */
let smooth = false;

/** `sve-scroll-mode` from the CP: `smooth: true` glides, false jumps. */
export function setScrollMode(data) {
  smooth = data?.smooth === true;
}

/** What a scrollIntoView in the preview passes as `behavior`. */
export function scrollBehavior() {
  return smooth ? 'smooth' : 'instant';
}
