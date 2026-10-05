/**
 * Dragging a Patterns card onto the live preview.
 *
 * The preview is told about a drag only once the pointer has left the panel:
 * EXT_DRAG_START zooms the page out, so it must not fire on a wobble while the
 * pointer is still over the cards. Coming back over the panel calls the drag
 * off (EXT_DRAG_END, cancelled), and the page zooms back; leaving again starts
 * it over. The preview never hears two STARTs or two ENDs in a row.
 *
 *   press           nothing happens; a click without a move adds nothing
 *   6px move        the ghost follows the pointer (a vertical move over the
 *                   list is a scroll, not a drag)
 *   leave panel     EXT_DRAG_START, iframe pointer-events off
 *   back over it    EXT_DRAG_END cancelled, iframe pointer-events back
 *   release         over the preview while told: `sveState.libraryDrag` is
 *                   the pending drop and EXT_DRAG_END (not cancelled) asks the
 *                   bridge for EXT_DROP, which add-section.js inserts;
 *                   otherwise EXT_DRAG_END cancelled, or nothing if the
 *                   preview was never told
 *
 * No Vue here, so node can test it with a stub DOM (tests/js/card-drag.test.js).
 *
 * May import: cp-state.js, lib/preview-frame.js, lib/protocol.js, lib/ids.js.
 */
import { sveState } from '../../cp-state.js';
import { previewFrame } from '../../lib/preview-frame.js';
import { MSG, SOURCE } from '../../lib/protocol.js';
import { SECTION_PICKER_ID } from '../../lib/ids.js';

/** How far the pointer has to travel before a press becomes a drag. */
const DRAG_THRESHOLD = 6;

/**
 * True when the pointer is over the live-preview iframe and not over a CP
 * overlay that sits on top of it (code dock, right sidebar, left editor, Theme Settings).
 * The iframe has pointer-events:none for the drag, so the box is the source
 * of truth; elementFromPoint only vetoes overlays.
 */
export function pointerOverLivePreview(win, frame, event) {
  if (!frame) {
    return false;
  }

  const r = frame.getBoundingClientRect();

  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  ) {
    return false;
  }

  const hit = win.document.elementFromPoint(event.clientX, event.clientY);

  if (!hit || hit === frame || frame.contains(hit)) {
    return true;
  }

  // During a library drag the iframe has pointer-events:none, so the hit is
  // the preview shell underneath — that still counts. Only a panel covering
  // the iframe (dock, toolbar) cancels. `.live-preview-editor` is the canvas.
  return !hit.closest(
    '#__sve-right-dock, #__sve-code-dock, #__sve-globals-panel, .live-preview-header, #__sve-toolbar'
  );
}

/**
 * Pointer drag on a library card. A release over the live preview inserts.
 * Letting go anywhere else cancels; nothing is added. A click without a drag
 * does nothing.
 *
 * `onPress` runs on every primary-button press, before any drag decision —
 * the caller prefetches what an insert will need there.
 */
export function beginCardDrag(win, cardEl, kind, item, onPress) {
  cardEl.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }

    // A drop whose EXT_DROP never came back (the preview reloaded mid-drag)
    // would otherwise sit here and make every later drag dead.
    sveState.libraryDrag = null;

    onPress?.();

    const doc = win.document;
    const frame = previewFrame(doc);
    const panel = cardEl.closest(`#${SECTION_PICKER_ID}`) || cardEl.closest('[data-sve-scroll]');
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let told = false;
    let ghost = null;

    // In the page's own pixels: the frame may be drawn scaled — a device
    // preset, or the overview's row — and the bridge measures its sections
    // unscaled. The ratio of the drawn box to the layout box is the scale.
    const toPreview = (e) => {
      const r = frame.getBoundingClientRect();
      const sx = frame.offsetWidth ? r.width / frame.offsetWidth : 1;
      const sy = frame.offsetHeight ? r.height / frame.offsetHeight : 1;

      return { x: (e.clientX - r.left) / (sx || 1), y: (e.clientY - r.top) / (sy || 1) };
    };

    const post = (message) => {
      frame.contentWindow?.postMessage({ source: SOURCE, ...message }, win.location.origin);
    };

    const overPanel = (e) => !!panel && panel.contains(doc.elementFromPoint(e.clientX, e.clientY));

    // The preview zooms out for the drop. The iframe would swallow the pointer
    // once we're over it — let this window keep the events, and map the
    // coordinates ourselves.
    const tell = () => {
      if (told) {
        return;
      }

      told = true;
      frame.style.pointerEvents = 'none';
      post({ type: MSG.EXT_DRAG_START });
    };

    const untell = (cancelled) => {
      if (!told) {
        return;
      }

      told = false;
      frame.style.pointerEvents = '';
      post({ type: MSG.EXT_DRAG_END, cancelled });
    };

    const stopListen = () => {
      win.removeEventListener('pointermove', onMove);
      win.removeEventListener('pointerup', onUp);
      win.removeEventListener('pointercancel', onUp);
    };

    const start = () => {
      if (!frame) {
        return;
      }

      active = true;
      cardEl.setPointerCapture(event.pointerId);

      ghost = cardEl.cloneNode(true);
      ghost.style.cssText +=
        ';position:fixed;z-index:2147483647;pointer-events:none;width:220px;opacity:.9;transform:rotate(1.5deg);box-shadow:0 12px 32px rgba(0,0,0,.3);';
      doc.body.appendChild(ghost);
    };

    const onMove = (e) => {
      if (!active) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) {
          return;
        }

        // Vertical move inside the list is a scroll — don't start, but don't
        // abort either: a later move toward the preview should still drop.
        const scrollEl = cardEl.closest('[data-sve-scroll]');
        const overList = scrollEl?.contains(doc.elementFromPoint(e.clientX, e.clientY));

        if (overList && Math.abs(dy) >= Math.abs(dx)) {
          return;
        }

        start();
      }

      if (!active) {
        return;
      }

      if (ghost) {
        ghost.style.left = `${e.clientX - 110}px`;
        ghost.style.top = `${e.clientY - 16}px`;
      }

      if (overPanel(e)) {
        untell(true);

        return;
      }

      tell();

      const p = toPreview(e);

      post({ type: MSG.EXT_DRAG_MOVE, x: p.x, y: p.y });
    };

    const onUp = (e) => {
      stopListen();
      ghost?.remove();

      try {
        cardEl.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }

      if (!told) {
        return;
      }

      const drop = e.type !== 'pointercancel' && pointerOverLivePreview(win, frame, e);

      // The bridge replies to an END that is not cancelled with EXT_DROP →
      // add-section.js inserts what is pending here.
      sveState.libraryDrag = drop ? { kind, item } : null;
      untell(!drop);
    };

    win.addEventListener('pointermove', onMove);
    win.addEventListener('pointerup', onUp);
    win.addEventListener('pointercancel', onUp);
  });
}
