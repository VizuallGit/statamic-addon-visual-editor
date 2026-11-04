/**
 * Where a popup stands beside the column it was opened from.
 *
 * Level with the thing clicked (`row`), outside the column it sits in
 * (`column`), on the side of the window with more room: a tile in the left
 * panel opens to its right, a row in the right sidebar to its left — over the
 * page either way, never over the list it came from. Kept inside the window.
 *
 * Coordinates are the window's, in px (getBoundingClientRect's), so `gap` and
 * `pad` are too.
 *
 * @param {{ top: number }} row
 * @param {{ left: number, right: number }} column
 * @param {{ width: number, height: number }} size   the popup's
 * @param {{ width: number, height: number }} view   the window's
 * @returns {{ left: number, top: number }}
 */
export function besideSpot(row, column, size, view, gap = 8, pad = 8) {
  const toRight = view.width - column.right >= column.left;
  const left = toRight ? column.right + gap : column.left - size.width - gap;

  return {
    left: within(left, pad, view.width - size.width - pad),
    top: within(row.top, pad, view.height - size.height - pad),
  };
}

/**
 * Where a popup stands over the column it was opened from: the column's width
 * less a gap each side, just under the thing clicked (`row`), so the page
 * beside the column stays in view. Kept inside the window.
 *
 * @param {{ bottom: number }} row
 * @param {{ left: number, right: number }} column
 * @param {{ height: number }} size   the popup's
 * @param {{ height: number }} view   the window's
 * @returns {{ left: number, top: number, width: number }}
 */
export function overSpot(row, column, size, view, gap = 8, pad = 8) {
  return {
    left: column.left + gap,
    top: within(row.bottom + gap, pad, view.height - size.height - pad),
    width: Math.max(0, column.right - column.left - gap * 2),
  };
}

/** `value` kept between `low` and `high`; `low` wins when the two cross (a popup taller than the window starts at its top). */
function within(value, low, high) {
  return Math.max(low, Math.min(value, high));
}
