/**
 * The zoom keys: a plain `+` steps a zoom in, a plain `-` steps it out.
 *
 * One reading of a keydown, shared by every surface that zooms — the Live
 * Preview's own zoom in the top bar (cp-shell/block-order.js) and the site
 * canvas (site-canvas.js) — so they agree on what counts: the key alone, no
 * Ctrl, Cmd or Alt (those are the browser's page zoom and the editor's own
 * shortcuts), nothing already handled, and no field being typed in — a `-`
 * in a title is a hyphen. `=` is `+` unshifted on a US keyboard and counts
 * as it; the numpad's keys read as `+` and `-` already.
 *
 * May import: nothing.
 */

/** 'in' for `+` (or `=`), 'out' for `-`, null for any other key or a key with a modifier, already handled, or typed into a field. */
export function zoomKey(event) {
  if (!event || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
    return null;
  }

  if (event.key === '+' || event.key === '=') {
    return 'in';
  }

  if (event.key === '-') {
    return 'out';
  }

  return null;
}

/** An element being typed in: an input, textarea or select, or inside anything contenteditable (Bard, CodeMirror). */
export function isTypingTarget(target) {
  if (!target || typeof target.closest !== 'function') {
    return false;
  }

  return !!target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
}
