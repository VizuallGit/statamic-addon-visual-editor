/**
 * Dragging a Patterns card onto the live preview — as it has always worked:
 *
 *   press           nothing happens; a click without a move adds nothing
 *   6px move        the ghost follows the pointer and EXT_DRAG_START zooms the
 *                   page out (a vertical move over the list is a scroll)
 *   release         over the preview: `sveState.libraryDrag` is the pending
 *                   drop and EXT_DRAG_END (not cancelled) asks the bridge for
 *                   EXT_DROP, which add-section.js inserts; the bridge keeps
 *                   the page zoomed out until that render lands, then zooms in
 *                   on the new section. Anywhere else: EXT_DRAG_END cancelled,
 *                   the page zooms back, nothing is added.
 *
 * What a plain click must never do is leave this drag armed. The window
 * listeners are capture-phase and a move with no button held ends the press:
 * a pointerup another listener swallowed (the meta-prefetch side script once
 * did) must not leave the next mouse move starting a drag nobody asked for.
 *
 * No Vue here, so node can test it with a stub DOM (tests/js/card-drag.test.js).
 *
 * May import: cp-state.js, lib/preview-frame.js, lib/protocol.js.
 */
import { sveState } from '../../cp-state.js';
import { previewFrame } from '../../lib/preview-frame.js';
import { MSG, SOURCE } from '../../lib/protocol.js';

/** How far the pointer has to travel before a press becomes a drag. */
const DRAG_THRESHOLD = 6;

// Capture phase, so the release always reaches us: a listener elsewhere that
// stops a pointerup (the meta-prefetch side script once did) must not leave
// this drag's listeners hanging on the window.
const LISTEN = { capture: true };

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
      win.removeEventListener('pointermove', onMove, LISTEN);
      win.removeEventListener('pointerup', onUp, LISTEN);
      win.removeEventListener('pointercancel', onUp, LISTEN);
    };

    const start = () => {
      if (!frame) {
        return;
      }

      active = true;
      // The page zooms out the moment the card is picked up, so the whole
      // page is there to aim at by the time the pointer arrives.
      tell();

      // Capture keeps the pointer's events coming when it leaves the card; the
      // window listeners below are what actually track it, so a pointer that
      // can't be captured (already up, synthetic) is no reason to stop.
      try {
        cardEl.setPointerCapture(event.pointerId);
      } catch {
        /* not an active pointer */
      }

      ghost = cardEl.cloneNode(true);
      ghost.style.cssText +=
        ';position:fixed;z-index:2147483647;pointer-events:none;width:220px;opacity:.9;transform:rotate(1.5deg);box-shadow:0 12px 32px rgba(0,0,0,.3);';
      doc.body.appendChild(ghost);
    };

    const onMove = (e) => {
      // No button held: the press ended without a pointerup reaching us (one
      // fired outside the window, or another listener stopped it). Treat it
      // as the release it was — otherwise the next move starts a drag nobody
      // asked for, with no way to let go.
      if (e.buttons === 0) {
        release(e, false);

        return;
      }

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

      const p = toPreview(e);

      post({ type: MSG.EXT_DRAG_MOVE, x: p.x, y: p.y });
    };

    const release = (e, mayDrop) => {
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

      const drop = mayDrop && pointerOverLivePreview(win, frame, e);

      // The bridge replies to an END that is not cancelled with EXT_DROP →
      // add-section.js inserts what is pending here.
      sveState.libraryDrag = drop ? { kind, item } : null;
      untell(!drop);
    };

    const onUp = (e) => release(e, e.type !== 'pointercancel');

    win.addEventListener('pointermove', onMove, LISTEN);
    win.addEventListener('pointerup', onUp, LISTEN);
    win.addEventListener('pointercancel', onUp, LISTEN);
  });
}
