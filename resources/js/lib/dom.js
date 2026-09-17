/**
 * Small DOM measurements the panels share.
 *
 * May import: nothing.
 */

/** `rem` in this window's root font size, rounded to whole pixels. */
export function remToPx(win, rem) {
  const root = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;

  return Math.round(rem * root);
}
