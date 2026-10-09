/**
 * Where a tool's bar sits over Live Preview: inside Live Preview, and under
 * everything that is not the page.
 *
 * X-ray's layer bar and the design overlay's bar float over the preview frame.
 * They live where the breakpoint overview's layer lives (measured 24 Sep 2026,
 * see breakpoint-overview.js): the last children of `.live-preview-main`, at
 * z-index 2 — above the pane (1), below the editor column (3), the docks, the
 * top bar, Statamic's modals and every popup and dropdown the editor opens.
 * Never inside `.live-preview-contents`, where Statamic finds its preview as
 * `firstChild`; never on <body> above it all, where a bar covered the
 * Stylesheets panel and the Edits dialog (9 Oct 2026).
 *
 * Placed over the part of the frame that is on screen, clipped to the pane's
 * content box (the docks sit on its padding), and placed again whenever the
 * frame moves — see followFrame. Hidden while the breakpoint overview is open:
 * its frames are copies, the tools draw on the preview itself.
 *
 * May import: lib/ids.js.
 */
import { BP_OVERVIEW_ID } from '../lib/ids.js';

/** `.live-preview-main` — the pane's parent — or null outside Live Preview. */
export function barHost(frame) {
  return frame?.closest?.('.live-preview-contents')?.parentElement || null;
}

/** Put the bar in its place; false when there is no Live Preview to put it in. */
export function mountBar(bar, frame) {
  const host = barHost(frame);

  if (!host) {
    bar.remove();

    return false;
  }

  if (bar.parentNode !== host) {
    host.appendChild(bar);
  }

  return true;
}

/**
 * Centre the bar over the visible part of the frame, against its top or bottom
 * edge, `gap` px in. Coordinates are the bar's containing block's, read off
 * the layout every time — the docks, the zoom and the device all move it.
 */
export function placeBar(bar, frame, edge = 'bottom', gap = 12) {
  const host = barHost(frame);

  if (!bar || !host || !frame.isConnected || frame.ownerDocument.getElementById(BP_OVERVIEW_ID)) {
    if (bar) {
      bar.hidden = true;
    }

    return;
  }

  const fr = frame.getBoundingClientRect();
  const contents = frame.closest('.live-preview-contents');
  const pane = contents.getBoundingClientRect();
  const cs = contents.ownerDocument.defaultView.getComputedStyle(contents);
  const inset = (side) => (parseFloat(cs[`border${side}Width`]) || 0) + (parseFloat(cs[`padding${side}`]) || 0);
  const left = Math.max(fr.left, pane.left + inset('Left'));
  const right = Math.min(fr.right, pane.right - inset('Right'));
  const top = Math.max(fr.top, pane.top + inset('Top'));
  const bottom = Math.min(fr.bottom, pane.bottom - inset('Bottom'));

  if (right - left < 1 || bottom - top < 1) {
    bar.hidden = true;

    return;
  }

  // Shown before it is measured: a hidden bar is 0 high and has no containing block.
  bar.hidden = false;
  bar.style.maxWidth = `${Math.max(160, right - left - 16)}px`;

  const box = bar.offsetParent || host;
  const at = box.getBoundingClientRect();
  const x = (left + right) / 2 - at.left - box.clientLeft + box.scrollLeft;
  const y = (edge === 'top' ? top + gap : bottom - bar.offsetHeight - gap) - at.top - box.clientTop + box.scrollTop;

  bar.style.left = `${Math.round(x)}px`;
  bar.style.top = `${Math.round(y)}px`;
}

/**
 * Place the bar again whenever the frame may have moved without changing size.
 *
 * A size change is the caller's ResizeObserver. The rest: the shell's own
 * `sve:preview-geometry` (zoom, device, the overview's slot — block-order.js),
 * the pane scrolling a frame taller than it, and any click in the Control
 * Panel, after which the next frame re-reads the layout — the zoom back to
 * 100 % moves the frame without saying so. Batched to one placement a frame.
 * `listen(target, type, fn, opts)` is the caller's, so its teardown removes these.
 */
export function followFrame(win, frame, place, listen) {
  let queued = false;
  const soon = () => {
    if (queued) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;
      place();
    });
  };

  listen(win, 'sve:preview-geometry', soon);
  listen(frame.ownerDocument, 'scroll', soon, { capture: true, passive: true });
  listen(frame.ownerDocument, 'click', soon, { capture: true, passive: true });
}
