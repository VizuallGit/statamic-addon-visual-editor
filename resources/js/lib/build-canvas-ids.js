/**
 * Build's canvas: the frame build-mode/canvas.js stands over the real preview
 * in both Builds, hiding it. What reads the page on screen — X-ray — reads this
 * frame while it is in the document and styled. The event goes out on the
 * Control Panel's window when the canvas comes to show and when it goes.
 *
 * Its own file, not lib/ids.js: the kernel imports that one, and a value added
 * there renames the chunk the bridge loads.
 *
 * May import: nothing. Values only, no logic.
 */
export const BUILD_CANVAS_ID = '__sve-build-canvas';
export const BUILD_CANVAS_UNSTYLED_ATTR = 'data-sve-build-unstyled';
export const BUILD_CANVAS_SHOWN_EVENT = 'sve:build-canvas-shown';
/** The columns Build draws over the canvas, in the Control Panel (columns-overlay.js). */
export const BUILD_COLUMNS_LAYER_ID = '__sve-build-columns';
