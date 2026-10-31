/**
 * A card from Patterns dragged onto Build's canvas: the page zooms out so all
 * of it can be reached, a line says where the section lands, and the page
 * zooms in on the section once it is there — what the bridge and
 * side/library-drop-focus.js do in Content.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: lib/build-canvas-ids.js, lib/style.js.
 * Bus: none. canvas.js answers `build-canvas:card-drop` with `begin()`, for the
 *   card's drag in section-library.js `beginCardDrag`.
 *
 * Nothing is sent to the real preview. It is hidden under the canvas, so a zoom
 * and a line there show nowhere, and the canvas copies its body, so a zoom there
 * would stay on the canvas after a drop.
 *
 * The page's looks live in a sheet of this module's own, a child of the canvas's
 * <html>: a morph of the body replaces the body's style attribute, and the real
 * preview renders while the page waits for the new section. The sheet steps
 * aside everything else the editor hangs on <html> — the +, the section's
 * toolbar, the focus frames — since none of them follows a zoom.
 *
 * The card's coordinates are the canvas's own: section-library.js maps the
 * pointer through the real preview's box, and the canvas stands exactly on it.
 */
import { BUILD_COLUMNS_LAYER_ID } from '../lib/build-canvas-ids.js';
import { injectStyle } from '../lib/style.js';

const SHEET_ID = '__sve-build-card-sheet';
const LINE_ID = '__sve-build-card-line';
const COLUMNS_CSS_ID = '__sve-build-card-columns';
const SECTION_ATTR = 'data-sid-section-orderable';
/** The zoom's time, as the bridge's (bridge/drag.js), and how long the glide is left to end. */
const GLIDE = 'transform .35s ease';
const GLIDE_MS = 380;
/** How long the page waits for the new section, as library-drop-focus.js does. */
const GIVE_UP_MS = 8000;

const STEP_ASIDE = `html > :not(head, body, style, #${LINE_ID}){display:none!important}`;
const LINE_CSS = 'position:fixed;z-index:2147483646;pointer-events:none;height:.25rem;margin-top:-.125rem;border-radius:.125rem;background:#3858e9;box-shadow:0 0 0 .0625rem rgba(255,255,255,.5)';

const bodyLooks = ({ origin = 'top center', transform = 'none', transition = 'none' }) =>
  `body{transform-origin:${origin}!important;transform:${transform}!important;transition:${transition}!important}`;

/**
 * The scale that shows the whole page, as the bridge's `zoomOutForDrag`; 0 when
 * the page already fits.
 */
export function zoomScale(viewHeight, pageHeight) {
  const scale = (viewHeight - 32) / pageHeight;

  return scale >= 0.999 ? 0 : Math.max(scale, 0.02);
}

/**
 * Which section the drop goes after: the last one whose middle the pointer has
 * passed, top to bottom. -1 is above the first.
 *
 * @param {Array<{ top: number, bottom: number }>} boxes
 * @param {number} y
 */
export function sectionBefore(boxes, y) {
  let at = -1;

  for (const [index, box] of boxes.entries()) {
    if (y <= (box.top + box.bottom) / 2) {
      break;
    }

    at = index;
  }

  return at;
}

/**
 * @param {Window} win  the Control Panel window
 * @param {{ page: () => Document|null, frame: () => HTMLIFrameElement|null, done: () => void }} canvas
 *   `done`: the page stands still again; what draws over it finds its place
 * @returns {{ begin: () => { move(x: number, y: number): void, end(cancelled: boolean): string|null, landed(added: boolean): void }, stop: () => void }}
 */
export function canvasCardDrop(win, { page, frame, done }) {
  let settle = null;

  const sections = (doc) => [...doc.querySelectorAll(`[${SECTION_ATTR}]`)].filter((el) => el.getBoundingClientRect().width > 0);

  function writeSheet(doc, css) {
    let sheet = doc.getElementById(SHEET_ID);

    if (!sheet) {
      sheet = doc.createElement('style');
      sheet.id = SHEET_ID;
      doc.documentElement.append(sheet);
    }

    sheet.textContent = css;
  }

  /** Nothing of the drag is left on the page; the next timer has nothing to do. */
  function finish(doc) {
    settle = null;
    doc.getElementById(SHEET_ID)?.remove();
    win.document.getElementById(COLUMNS_CSS_ID)?.remove();
    done();
  }

  /** Nothing landed: back to where the page stood, as the bridge's `restoreZoom` does. */
  function zoomBack(doc, top) {
    writeSheet(doc, bodyLooks({ transition: GLIDE }) + STEP_ASIDE);

    const glide = win.setTimeout(() => settle?.(), GLIDE_MS);

    settle = () => {
      win.clearTimeout(glide);
      doc.defaultView?.scrollTo({ top, behavior: 'instant' });
      finish(doc);
    };
  }

  /** From the zoom to the section at full size, without a jump: the section grows out of where it stood. */
  function zoomInOn(doc, el) {
    const first = el.getBoundingClientRect();

    writeSheet(doc, bodyLooks({}) + STEP_ASIDE);
    el.scrollIntoView({ block: 'start', behavior: 'instant' });

    const last = el.getBoundingClientRect();
    const body = doc.body.getBoundingClientRect();
    const origin = `${last.left - body.left}px ${last.top - body.top}px`;
    const scale = first.width / Math.max(last.width, 1);

    writeSheet(doc, bodyLooks({ origin, transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${scale})` }) + STEP_ASIDE);
    doc.body.getBoundingClientRect();
    writeSheet(doc, bodyLooks({ origin, transition: GLIDE }) + STEP_ASIDE);
  }

  /**
   * Dropped: the page stays zoomed out until the canvas has the new section,
   * then zooms in on it. A composition asks its question first, so the time to
   * give up only runs once the insert has answered (`landed`).
   */
  function awaitSection(doc, before, top) {
    let giveUpAt = Infinity;
    let glide = 0;
    let waiting = true;
    const timer = win.setInterval(() => {
      if (page() !== doc) {
        settle?.();

        return;
      }

      const fresh = sections(doc).find((el) => !before.includes(el.getAttribute('data-sid')));

      if (fresh) {
        waiting = false;
        win.clearInterval(timer);
        zoomInOn(doc, fresh);
        glide = win.setTimeout(() => settle?.(), GLIDE_MS);
      } else if (win.performance.now() > giveUpAt) {
        waiting = false;
        win.clearInterval(timer);
        zoomBack(doc, top);
      }
    }, 50);

    settle = () => {
      waiting = false;
      win.clearInterval(timer);
      win.clearTimeout(glide);
      finish(doc);
    };

    return (added) => {
      if (!waiting) {
        return;
      }

      if (added) {
        giveUpAt = win.performance.now() + GIVE_UP_MS;
      } else {
        waiting = false;
        win.clearInterval(timer);
        zoomBack(doc, top);
      }
    };
  }

  function begin() {
    settle?.();

    const doc = page();
    const view = doc.defaultView;
    const scroll = view.scrollY;
    const scale = zoomScale(view.innerHeight, doc.documentElement.scrollHeight);
    const before = sections(doc).map((el) => el.getAttribute('data-sid'));
    const line = doc.createElement('div');
    let afterUid = null;
    let landed = () => {};

    line.id = LINE_ID;
    line.style.cssText = LINE_CSS;
    line.hidden = true;
    doc.documentElement.append(line);

    // The columns are drawn in the Control Panel, over the canvas: they do not follow a zoom either.
    injectStyle(win.document, COLUMNS_CSS_ID, `#${BUILD_COLUMNS_LAYER_ID}{visibility:hidden!important}`);
    // The pointer would go to the canvas once it is over it, should the card lose it.
    frame().style.pointerEvents = 'none';
    writeSheet(doc, bodyLooks({ transform: scale ? `scale(${scale})` : 'none', transition: GLIDE }) + STEP_ASIDE);

    if (scale) {
      view.scrollTo({ top: 0, behavior: 'instant' });
    }

    return {
      move(x, y) {
        const list = sections(doc);
        const at = sectionBefore(list.map((el) => el.getBoundingClientRect()), y);
        const anchor = list[at] || list[0];

        afterUid = at === -1 ? null : list[at].getAttribute('data-sid');

        if (anchor) {
          const box = anchor.getBoundingClientRect();

          line.hidden = false;
          line.style.left = `${box.left}px`;
          line.style.width = `${box.width}px`;
          line.style.top = `${at === -1 ? box.top : box.bottom}px`;
        }
      },
      end(cancelled) {
        line.remove();

        const canvas = frame();

        if (canvas) {
          canvas.style.pointerEvents = '';
        }

        if (cancelled) {
          zoomBack(doc, scroll);

          return null;
        }

        landed = awaitSection(doc, before, scroll);

        return afterUid;
      },
      /** What the insert answered: false when nothing is on its way — a question cancelled, a composition with no sections. */
      landed(added) {
        landed(added);
      },
    };
  }

  return {
    begin,
    stop() {
      settle?.();
    },
  };
}
