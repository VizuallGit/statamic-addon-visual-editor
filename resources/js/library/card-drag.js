/**
 * section-library.js — dragging a card onto the page.
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { sveState } from '../cp-state.js';
import { ask } from '../cp/bus.js';
import { ZONE_SHELL_ATTR } from '../lib/ids.js';
import { previewFrame } from '../lib/preview-frame.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { fetchSetMeta, insertSection } from './insert.js';
import { setHandleFor } from './row-meta.js';

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

  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) {
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
    `#__sve-right-dock, #__sve-code-dock, #__sve-globals-panel, .live-preview-header, #__sve-toolbar, [${ZONE_SHELL_ATTR}]`
  );
}

/**
 * Pointer drag on a library card. A release over the live preview inserts.
 * Letting go halfway (library, editor, chrome) cancels; nothing is added.
 * A click without a drag does not insert.
 *
 * With `drop` (`{ onDrop, dropLabel }`) the card has one place to go, not a
 * spot between sections: the layout's header, footer or sections. The preview
 * is not asked where — it is outlined while the pointer is over it, and a
 * release there calls `onDrop`.
 *
 * Build's canvas hides the preview, so there the canvas takes the drag
 * (build-mode/canvas-card-drop.js): the bus answers with its door, and the
 * drop inserts here, as the bridge's ext-drop does in Content.
 */
export function beginCardDrag(win, cardEl, kind, item, drop = null) {
  cardEl.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || sveState.libraryDrag) {
      return;
    }

    if (drop) {
      // Nothing to prefetch: the server writes the row.
    } else if (kind === 'template') {
      (item.sections || []).forEach((section) => {
        if (section?.type) {
          fetchSetMeta(win, section.type);
        }
      });
    } else {
      fetchSetMeta(win, setHandleFor(win, kind, item));
    }

    const doc = win.document;
    const frame = previewFrame(doc);
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let ghost = null;
    let moved = false;
    let outline = null;
    let onCanvas = null;

    // In the page's own pixels: the frame may be drawn scaled — a device
    // preset, or the overview's row — and the bridge measures its sections
    // unscaled. The ratio of the drawn box to the layout box is the scale.
    const toPreview = (e) => {
      const r = frame.getBoundingClientRect();
      const sx = frame.offsetWidth ? r.width / frame.offsetWidth : 1;
      const sy = frame.offsetHeight ? r.height / frame.offsetHeight : 1;

      return { x: (e.clientX - r.left) / (sx || 1), y: (e.clientY - r.top) / (sy || 1) };
    };

    // Where a `drop` card may land: the whole preview, or (`target: 'main'`)
    // only the page's own content — a section in the layout goes under it.
    const dropRect = () => {
      const r = frame.getBoundingClientRect();

      if (drop?.target !== 'main') {
        return r;
      }

      const main = frame.contentDocument?.querySelector('main');

      if (!main) {
        return null;
      }

      const sx = frame.offsetWidth ? r.width / frame.offsetWidth : 1;
      const sy = frame.offsetHeight ? r.height / frame.offsetHeight : 1;
      const m = main.getBoundingClientRect();
      const top = Math.max(r.top, r.top + m.top * sy);
      const bottom = Math.min(r.bottom, r.top + m.bottom * sy);

      return { left: r.left + m.left * sx, top, width: m.width * sx, height: Math.max(0, bottom - top) };
    };
    const overDrop = (e) => {
      const d = dropRect();

      return (
        !!d &&
        pointerOverLivePreview(win, frame, e) &&
        e.clientX >= d.left &&
        e.clientX <= d.left + d.width &&
        e.clientY >= d.top &&
        e.clientY <= d.top + d.height
      );
    };

    const stopListen = () => {
      win.removeEventListener('pointermove', onMove, true);
      win.removeEventListener('pointerup', onUp, true);
      win.removeEventListener('pointercancel', onUp, true);
    };

    const start = () => {
      if (!frame) {
        return;
      }

      active = true;
      cardEl.setPointerCapture(event.pointerId);
      // The iframe would swallow the pointer once we're over it — let this window
      // keep the events, and map the coordinates ourselves.
      frame.style.pointerEvents = 'none';

      if (drop) {
        outline = doc.createElement('div');
        outline.textContent = drop.dropLabel || '';
        outline.style.cssText =
          'position:fixed;z-index:2147483646;pointer-events:none;display:none;align-items:flex-start;justify-content:center;' +
          'padding-top:1rem;border:2px dashed var(--theme-color-primary,#4f46e5);border-radius:0.5rem;' +
          'background:color-mix(in srgb,var(--theme-color-primary,#4f46e5) 8%,transparent);' +
          'font:600 0.8125rem/1.3 ui-sans-serif,system-ui,sans-serif;color:var(--theme-color-primary,#4f46e5);';
        doc.body.appendChild(outline);
      } else {
        onCanvas = ask('build-canvas:card-drop') || null;

        if (!onCanvas) {
          frame.contentWindow.postMessage({ source: SOURCE, type: MSG.EXT_DRAG_START }, win.location.origin);
        }
      }

      ghost = cardEl.cloneNode(true);
      ghost.style.cssText +=
        ';position:fixed;z-index:2147483647;pointer-events:none;width:220px;opacity:.9;transform:rotate(1.5deg);box-shadow:0 12px 32px rgba(0,0,0,.3);';
      doc.body.appendChild(ghost);
    };

    const onMove = (e) => {
      // No button held: the release never reached us. End the press here, or
      // a plain click leaves the next mouse move starting a drag.
      if (e.buttons === 0) {
        onUp({ type: 'pointercancel', pointerId: e.pointerId, clientX: e.clientX, clientY: e.clientY });

        return;
      }

      if (!active) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.hypot(dx, dy) < 6) {
          return;
        }

        moved = true;

        // Vertical move inside the list is a scroll — don't start, but don't
        // abort either: a later move toward the preview should still drop.
        const scrollEl = cardEl.closest('[data-sve-scroll]');
        const overList = scrollEl?.contains(doc.elementFromPoint(e.clientX, e.clientY));

        if (overList && Math.abs(dy) >= Math.abs(dx)) {
          return;
        }

        start();
      }

      if (!active || !frame) {
        return;
      }

      if (outline) {
        const r = dropRect();
        const over = !!r && overDrop(e);

        outline.style.display = over ? 'flex' : 'none';

        if (r) {
          outline.style.left = `${r.left}px`;
          outline.style.top = `${r.top}px`;
          outline.style.width = `${r.width}px`;
          outline.style.height = `${r.height}px`;
        }
      } else {
        const p = toPreview(e);

        if (onCanvas) {
          onCanvas.move(p.x, p.y);
        } else {
          frame.contentWindow.postMessage(
            { source: SOURCE, type: MSG.EXT_DRAG_MOVE, x: p.x, y: p.y },
            win.location.origin
          );
        }
      }

      if (ghost) {
        ghost.style.left = `${e.clientX - 110}px`;
        ghost.style.top = `${e.clientY - 16}px`;
      }
    };

    const onUp = (e) => {
      stopListen();
      ghost?.remove();

      if (cardEl.hasPointerCapture(e.pointerId)) {
        cardEl.releasePointerCapture(e.pointerId);
      }

      if (!active) {
        return;
      }

      const overPreview = e.type !== 'pointercancel' && pointerOverLivePreview(win, frame, e);

      if (drop) {
        const landed = e.type !== 'pointercancel' && overDrop(e);

        outline?.remove();

        if (frame) {
          frame.style.pointerEvents = '';
        }

        if (landed) {
          drop.onDrop();
        }

        return;
      }

      if (onCanvas) {
        const afterUid = onCanvas.end(!overPreview);

        frame.style.pointerEvents = '';

        if (overPreview) {
          insertSection(win, doc, afterUid, kind, item).then(onCanvas.landed, () => onCanvas.landed(false));
        }

        return;
      }

      if (overPreview) {
        // The bridge replies with ext-drop → the message listener inserts.
        sveState.libraryDrag = { kind, item };
      } else {
        sveState.libraryDrag = null;
      }

      if (frame) {
        frame.style.pointerEvents = '';
        frame.contentWindow?.postMessage(
          {
            source: SOURCE,
            type: MSG.EXT_DRAG_END,
            cancelled: !overPreview,
          },
          win.location.origin
        );
      }
    };

    win.addEventListener('pointermove', onMove, true);
    win.addEventListener('pointerup', onUp, true);
    win.addEventListener('pointercancel', onUp, true);
  });
}
