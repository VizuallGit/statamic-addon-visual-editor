/**
 * `data-auto-contrast` on Build's canvas. The site's own script (color-scheme's
 * auto-contrast.js) sets an element's text colour from its background, and it
 * runs in the real preview: the canvas carries no scripts, and each paint from
 * the file takes the colour it copied along off again. So after each paint the
 * real preview's script is asked to measure the canvas's elements: the site's
 * rule, the theme it reads and what the canvas shows now, and no copy of any.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: lib/build-canvas.js, lib/build-canvas-ids.js, lib/preview-frame.js.
 * Bus messages: none. Listens to the canvas's own paint event.
 *
 * Loaded with the demo's flag on (flag.js): with it off the canvas is as it was.
 * The fault is in every Build, so when the flag goes, this belongs in canvas.js.
 */

import { BUILD_CANVAS_SHOWN_EVENT } from '../../lib/build-canvas-ids.js';
import { buildCanvasFrame } from '../../lib/build-canvas.js';
import { previewFrame } from '../../lib/preview-frame.js';

/** CANVAS_PAINTED in canvas.js, which this module may not import (css-mode-isolation.test.js holds them the same). */
const PAINTED = 'sve:build-canvas-painted';
const MARK = '[data-auto-contrast], [data-auto-contrast-hover]';

/** Every marked element on the canvas measured again. On a page with none the site does not load the script. */
export function refreshContrast(win) {
  const page = buildCanvasFrame(win)?.contentDocument;
  const site = previewFrame(win)?.contentWindow;

  if (page?.querySelector(MARK) && typeof site?.applyAutoContrast === 'function') {
    site.applyAutoContrast(page);
  }
}

export function followContrast(win) {
  const heard = new WeakSet();

  const attach = () => {
    const canvas = buildCanvasFrame(win)?.contentWindow;

    if (canvas && !heard.has(canvas)) {
      heard.add(canvas);
      canvas.addEventListener(PAINTED, () => refreshContrast(win));
    }

    refreshContrast(win);
  };

  win.addEventListener(BUILD_CANVAS_SHOWN_EVENT, attach);
  attach();
}
