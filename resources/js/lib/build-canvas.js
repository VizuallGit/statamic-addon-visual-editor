/**
 * Build's canvas as the rest of the editor asks about it: is it the page on
 * screen? While it is, the real preview keeps rendering underneath, hidden —
 * anything shown there (the bridge's dialogs, X-ray's drawing) is shown to
 * nobody, and has to be shown from the Control Panel instead.
 *
 * May import: lib/build-canvas-ids.js.
 */
import { BUILD_CANVAS_ID, BUILD_CANVAS_UNSTYLED_ATTR } from './build-canvas-ids.js';

/** The canvas's frame while it stands over the preview with its styles loaded, else null. */
export function buildCanvasFrame(win) {
  const frame = win?.document?.getElementById(BUILD_CANVAS_ID);

  return frame && !frame.hasAttribute(BUILD_CANVAS_UNSTYLED_ATTR) ? frame : null;
}
