/**
 * Where a tool opens from when the user hid its icon from the Live Preview
 * top bar.
 *
 * A keyboard shortcut presses a hidden icon as a click would, and the icon
 * stays hidden (toolbar-visibility.js pressToolbarTool). A menu or control
 * that normally hangs under its icon then has no icon to hang under: it
 * stands just under the bar, at the bar's left edge, instead. Both readers
 * here are for that — `onScreen` says whether the icon has a place on the bar
 * right now, `barEdge` gives the bar's edge to hang under when it has not.
 *
 * May import: lib/live-preview.js.
 */
import { lpHeader } from './live-preview.js';

/**
 * The icon is drawn — it has layout boxes. A hidden one is `display: none`
 * with its frame, and so is its whole group once every icon in it is hidden.
 */
export function onScreen(el) {
  return !!el && el.getClientRects().length > 0;
}

/**
 * The Live Preview top bar's edge in window coordinates — `left` to line up
 * with, `bottom` to hang under — for a `position: fixed` element. Null when
 * there is no bar on this screen.
 */
export function barEdge(win) {
  const header = lpHeader(win.document);

  return header ? header.getBoundingClientRect() : null;
}
