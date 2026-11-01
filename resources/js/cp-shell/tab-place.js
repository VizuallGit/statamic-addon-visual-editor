/**
 * Where the mode switch's tab stands: over the middle of the whole window when
 * it fits between the sidebars there, or else over the middle of the preview. It
 * never reaches over a sidebar while the preview has the room for it. Pure.
 *
 * @param {object} o
 * @param {number} o.whole  the middle of the bar
 * @param {number} o.left   where the preview starts
 * @param {number} o.right  where the preview ends
 * @param {number} o.width  the tab, with what stands round its buttons
 * @param {number} [o.gap]  room kept to a sidebar
 * @returns {number} the tab's middle
 */
export function tabCentre({ whole, left, right, width, gap = 0 }) {
  const half = width / 2;

  return whole - half >= left + gap && whole + half <= right - gap ? whole : (left + right) / 2;
}

/**
 * What a shrinking or growing window does to the sidebars, so the preview keeps
 * `min` wide. The right one goes first and comes back last. `slack` keeps a width
 * on the line from closing and opening them in turn.
 *
 * @returns {'close-right'|'close-left'|'open-left'|'open-right'|''}
 */
export function roomStep({ room, min, slack = 0, rightOpen, leftOpen, autoRight, autoLeft, rightWidth, leftWidth }) {
  if (room < min) {
    if (rightOpen) {
      return 'close-right';
    }

    return leftOpen ? 'close-left' : '';
  }

  if (autoLeft && !leftOpen && room - leftWidth >= min + slack) {
    return 'open-left';
  }

  if (autoRight && !autoLeft && !rightOpen && room - rightWidth >= min + slack) {
    return 'open-right';
  }

  return '';
}
