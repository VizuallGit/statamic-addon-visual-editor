/**
 * What the CSS mode has written, on Build's canvas in the frame it is written:
 * a style sheet of its own, read from the dock's CSS each time.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: lib/build-canvas.js, lib/preview-frame.js, build-mode/canvas-contrast.js, build-mode/css-mode/rules.js.
 * Bus messages: none. The port tells it when the CSS changed.
 *
 * The sheet stands on the canvas document's root, after the body, where the
 * canvas keeps its own: a morph of the head or the body never meets it, and it
 * comes last in the cascade. It touches nothing else of the canvas, so the file's
 * markup and its Tailwind are painted as they always are.
 *
 * It is drawn from the file, never kept beside it, so it cannot fall behind: a
 * value taken out goes from the sheet, and once the server's rendering holds the
 * same rules the sheet says what the page says already. A value from a field is
 * filled in from the form (`fill`), and one it cannot fill waits for the server.
 */

import { buildCanvasFrame } from '../../lib/build-canvas.js';
import { CANVAS_PATH } from '../canvas-paint.js';
import { previewFrame } from '../../lib/preview-frame.js';
import { measureContrast } from '../canvas-contrast.js';
import { liveSheet } from './rules.js';

const SHEET_ID = '__sve-build-css-mode';

export function createCssPaint(win, fill, suffixes = []) {
  const targets = new Map();

  function documentOf() {
    return buildCanvasFrame(win)?.contentDocument || null;
  }

  /** `#id-{{ id }}` as the page has it: the id of the element the file's path stands on. */
  function realSelector(page, { selector, path }) {
    if (!selector.includes('{{')) {
      return selector;
    }

    const el = page.querySelector(`[${CANVAS_PATH}="${win.CSS.escape(path)}"]`);

    return el?.id ? `#${win.CSS.escape(el.id)}` : '';
  }

  function sync(css, rows) {
    const page = documentOf();

    if (!page?.documentElement) {
      return;
    }

    const text = liveSheet(css, [...targets.values()].map((one) => ({ selector: one.selector, real: realSelector(page, one) })), rows, fill, suffixes);
    let sheet = page.getElementById(SHEET_ID);

    if (!sheet) {
      sheet = page.createElement('style');
      sheet.id = SHEET_ID;
      page.documentElement.append(sheet);
    }

    if (sheet.textContent !== text) {
      sheet.textContent = text;
      // A background from the sheet is what the text's contrast is measured against.
      measureContrast(previewFrame(win)?.contentWindow, page);
    }
  }

  return {
    sync,
    remember(selector, path) {
      targets.set(selector, { selector, path });
    },
    forget(selector) {
      targets.delete(selector);
    },
    /** The selectors the sheet draws. */
    selectors: () => [...targets.keys()],
    /** The sheet gone: what stands is the server's rendering. */
    clear() {
      targets.clear();
      documentOf()?.getElementById(SHEET_ID)?.remove();
    },
  };
}
