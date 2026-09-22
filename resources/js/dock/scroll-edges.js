/**
 * A row that scrolls says so at its edges.
 *
 * The tool rows scroll sideways without a bar — a bar across a row of buttons
 * is noise. But a row that just ends looks complete, and the buttons past its
 * edge are never found. So a row fades out at an edge with more behind it:
 * `data-sve-scroll-edge` names the edges, and the dock's CSS masks them.
 *
 * Measured, not styled: a row that fits carries nothing and is drawn whole.
 */
const ATTR = 'data-sve-scroll-edge';

export function watchScrollEdges(el) {
  if (!el || el._sveEdges) {
    return;
  }

  el._sveEdges = true;

  const paint = () => paintEdges(el);
  const sizes = new ResizeObserver(paint);
  const watchKids = () => {
    for (const kid of el.children) {
      sizes.observe(kid);
    }
  };

  el.addEventListener('scroll', paint, { passive: true });
  sizes.observe(el);
  watchKids();
  new MutationObserver(() => {
    watchKids();
    paint();
  }).observe(el, { childList: true });
  paint();
}

/** Rows that come and go — a tool's children under the open tool. */
export function watchScrollEdgesIn(root, selector) {
  if (!root || root._sveEdgesIn) {
    return;
  }

  root._sveEdgesIn = true;

  const scan = () => root.querySelectorAll(selector).forEach(watchScrollEdges);

  scan();
  new MutationObserver(scan).observe(root, { childList: true, subtree: true });
}

function paintEdges(el) {
  const slack = el.scrollWidth - el.clientWidth;
  const left = el.scrollLeft > 1;
  const right = slack - el.scrollLeft > 1;
  const value = left && right ? 'both' : left ? 'left' : right ? 'right' : '';

  if (value) {
    el.setAttribute(ATTR, value);
  } else {
    el.removeAttribute(ATTR);
  }
}
