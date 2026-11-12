/**
 * The preview keeps a minimum width. When the window is made smaller than that
 * leaves room for, the sidebars step aside, the right one first; when it is made
 * larger they come back, if it was this that closed them.
 *
 * Only the window's own width moves them. A sidebar dragged wider, or a tool
 * opened in a small window, is the reader's choice and stays.
 *
 * May import: lib/, cp-state.js, lp-panel.js, right-dock-tabs.js.
 */
import { LP_PREVIEW_MIN_REM } from '../lib/ids.js';
import { remToPx } from '../lib/dom.js';
import { sveState } from '../cp-state.js';
import { setLpCollapsed } from '../lp-panel.js';
import { RIGHT_DOCK_ID, hideRightDock, isRightDockOpen, openRightDock } from '../right-dock-tabs.js';
import { roomStep } from './tab-place.js';

/** How long a sidebar takes to finish moving (`syncPreviewInset`). */
const SETTLED = 260;

export function bindPreviewRoom(win) {
  const doc = win.document;
  let width = win.innerWidth;
  let autoRight = false;
  let autoLeft = false;
  let rightWidth = 0;
  let leftWidth = 0;
  let timer = 0;
  let mine = false;

  const contents = () => doc.querySelector('.live-preview-contents');
  const dock = () => doc.getElementById(RIGHT_DOCK_ID);

  function fit() {
    const el = contents();

    if (!el) {
      return;
    }

    const leftOpen = sveState.lpCollapsed === false;
    const rightOpen = isRightDockOpen(win);
    const room = el.getBoundingClientRect().width - (parseFloat(el.style.paddingRight) || 0);
    const step = roomStep({
      room,
      min: remToPx(win, LP_PREVIEW_MIN_REM),
      slack: remToPx(win, 1),
      rightOpen,
      leftOpen,
      autoRight,
      autoLeft,
      rightWidth,
      leftWidth,
    });

    if (!step) {
      return;
    }

    mine = true;

    if (step === 'close-right') {
      rightWidth = dock()?.offsetWidth || parseFloat(el.style.paddingRight) || 0;
      autoRight = true;
      hideRightDock(win);
    } else if (step === 'close-left') {
      leftWidth = el.getBoundingClientRect().left;
      autoLeft = true;
      setLpCollapsed(win, true);
    } else if (step === 'open-left') {
      autoLeft = false;
      setLpCollapsed(win, false);
    } else {
      autoRight = false;
      openRightDock(win);
    }

    mine = false;
    win.dispatchEvent(new Event('resize'));
    // The next step, when this one has taken its room.
    win.clearTimeout(timer);
    timer = win.setTimeout(fit, SETTLED);
  }

  win.addEventListener('resize', () => {
    // Panels say `resize` as they move: only the window's own width counts.
    if (win.innerWidth === width) {
      return;
    }

    width = win.innerWidth;
    win.clearTimeout(timer);
    timer = win.setTimeout(fit, 60);
  });

  // Opened by hand: not ours to bring back any more.
  win.addEventListener('sve-right-dock-change', (event) => {
    if (!mine && event.detail?.open) {
      autoRight = false;
    }
  });
}
