/**
 * Try: the picked tag's classes as a strip above it in the preview.
 *
 * Drawn from the Control Panel, over the frame — not inside it. The iframe is
 * same origin, so the element's box can be read straight out of it, and every
 * chip, menu and write already exists in the panel: this is the same `twUi`
 * groups, laid out sideways instead of down. Nothing in bridge.js is touched.
 *
 * Switched on and off from the dock's toolbar; the choice is remembered per
 * reader like the rest of the editor's chrome.
 */

import { chromeGet, chromeSet } from './chrome-prefs.js';
import { twUi } from './cp/tailwind/store.js';
import { twOpenAddMenu, twReorder } from './tw-classes.js';

const PREF = 'sve-tw-strip';

/** On unless it has been switched off — the strip is the point of the mode. */
export function twOverlayOn(win) {
  try {
    return chromeGet(win, PREF) !== '0';
  } catch {
    return true;
  }
}

export function setTwOverlayOn(win, on) {
  chromeSet(win, PREF, on ? '1' : '0');

  if (!on) {
    hideTwOverlay(win);
  }
}

const STRIP_ID = '__sve-tw-strip';
const STYLE_ID = '__sve-tw-strip-style';

let boundWin = null;
let placed = null;

function previewFrame(win) {
  const direct = win.document.getElementById('live-preview-iframe');

  if (direct) {
    return direct;
  }

  for (const el of win.document.querySelectorAll('iframe')) {
    try {
      const inner = el.contentDocument?.getElementById('live-preview-iframe');

      if (inner) {
        return inner;
      }
    } catch {
      /* cross-origin */
    }
  }

  return null;
}

function ensureStyles(doc) {
  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = `
    #${STRIP_ID} {
      position: fixed;
      z-index: 99998;
      display: flex;
      align-items: stretch;
      gap: 0.3rem;
      font-size: 0.6875rem;
    }
    #${STRIP_ID} [data-group] {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      min-width: 0;
      /* The same height with or without the middle group: only whether it is
         there should change, not the shape of the two beside it. */
      min-height: 2.2rem;
      padding: 0.2rem 0.3rem;
      border-radius: 0.45rem;
      border: 1px solid rgba(255,255,255,.12);
      background: #252526;
      color: #d4d4d4;
      box-shadow: 0 0.3rem 0.9rem rgba(0,0,0,.35);
    }
    #${STRIP_ID} [data-group="classes"] {
      position: relative;
      max-width: 30rem;
      padding: 0;
    }
    #${STRIP_ID} [data-scroll] {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      min-width: 0;
      padding: 0.45rem;
      overflow-x: auto;
      scrollbar-width: none;
    }
    #${STRIP_ID} [data-scroll]::-webkit-scrollbar { display: none; }
    /* The fade is a sibling, never a mask on the scroller: a mask-image on a
       scrollable element resets scrollLeft in Chrome. */
    #${STRIP_ID} [data-fade] {
      position: absolute;
      top: 1px;
      right: 1px;
      bottom: 1px;
      width: 1.6rem;
      border-radius: 0 0.45rem 0.45rem 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity .12s linear;
      background: linear-gradient(to right, rgba(37,37,38,0), #252526);
    }
    #${STRIP_ID} [data-group="classes"][data-overflow] [data-fade] { opacity: 1; }
    #${STRIP_ID} [data-sve-tw-strip-tag] {
      flex: 0 0 auto;
      padding: 0 0.2em;
      opacity: .75;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    #${STRIP_ID} button {
      all: unset;
      position: relative;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 0.35em;
      padding: 0.22em 0.5em;
      border-radius: 0.35em;
      background: rgba(255,255,255,.1);
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.45;
      white-space: nowrap;
    }
    #${STRIP_ID} button:hover { background: rgba(255,255,255,.2); }
    #${STRIP_ID} button[data-locked] { cursor: default; opacity: .5; }
    #${STRIP_ID} button[data-locked]:hover { background: rgba(255,255,255,.1); }
    #${STRIP_ID} [data-chip-wrap] {
      position: relative;
      display: inline-flex;
      flex: 0 0 auto;
      touch-action: none;
      cursor: grab;
    }
    #${STRIP_ID} [data-chip-wrap][data-dragging] {
      opacity: .35;
      cursor: grabbing;
    }
    #${STRIP_ID}[data-dragging],
    #${STRIP_ID}[data-dragging] * { cursor: grabbing !important; }
    #${STRIP_ID}[data-dragging] [data-drop] { opacity: 0 !important; }
    #${STRIP_ID} [data-drop] {
      position: absolute;
      top: -0.5em;
      right: -0.5em;
      width: 1.5em;
      height: 1.5em;
      min-width: 0;
      padding: 0;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #252526;
      background: #e11d48;
      color: #fff;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 0.85em;
      line-height: 1;
      opacity: 0;
      cursor: pointer;
    }
    #${STRIP_ID} [data-chip-wrap]:hover [data-drop] { opacity: 1; }
    #${STRIP_ID} [data-drop]:hover { background: #f43f5e; }
    /* One box, not a button inside a plate: the group is the button. */
    #${STRIP_ID} [data-group="add"] {
      padding: 0;
    }
    #${STRIP_ID} [data-add],
    #${STRIP_ID} [data-add]:hover {
      justify-content: center;
      min-width: 2rem;
      align-self: stretch;
      background: transparent;
      border-radius: 0.45rem;
      padding: 0 0.5em;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 1.05rem;
      line-height: 1;
    }
    #${STRIP_ID} [data-plus] {
      display: block;
      transform: translateY(-0.09em);
    }
    #${STRIP_ID} [data-group="add"]:hover {
      background: #3858e9;
      border-color: #3858e9;
      color: #fff;
    }
    #${STRIP_ID} [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    /* The ghost lives on the body, outside the strip, so none of the rules
       above reach it — it carries its own copy of the chip's look. */
    #${STRIP_ID}-ghost {
      position: fixed;
      z-index: 100002;
      pointer-events: none;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 0.35em;
      padding: 0.22em 0.5em;
      border-radius: 0.35em;
      background: #3a3a3e;
      color: #d4d4d4;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
      line-height: 1.45;
      white-space: nowrap;
      opacity: .5;
      transform: translate(-50%, -50%) rotate(20deg) scale(.9);
      box-shadow: 0 0.4rem 1rem rgba(0,0,0,.45);
    }
    #${STRIP_ID}-ghost [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
  `;
  doc.head.appendChild(style);
}

/** The preview's box on screen, for anything that must stay inside it. */
export function twPreviewBox(win) {
  const frame = previewFrame(win);

  return frame ? frame.getBoundingClientRect() : null;
}

/**
 * Drag a class left or right to reorder it.
 *
 * The wrapper is moved in the page while the pointer is down — the reader
 * sees the order they are making — and only on release is the file written,
 * once, with the classes put back in their own slots.
 */
let drag = null;

function beginDrag(win, event, wrap, scroll) {
  if (event.button !== 0 || event.target?.closest?.('[data-drop]')) {
    return;
  }

  drag = {
    wrap,
    scroll,
    strip: win.document.getElementById(STRIP_ID),
    x: event.clientX,
    moved: false,
    ghost: null,
  };

  const move = (e) => {
    if (!drag) {
      return;
    }

    if (!drag.moved && Math.abs(e.clientX - drag.x) < 4) {
      return;
    }

    if (!drag.moved) {
      drag.moved = true;
      drag.wrap.setAttribute('data-dragging', '');
      drag.strip?.setAttribute('data-dragging', '');

      // A copy under the pointer, so the drag is something you can see and
      // not just a gap that moves.
      const ghost = drag.wrap.querySelector('button')?.cloneNode(true);

      if (ghost) {
        ghost.id = `${STRIP_ID}-ghost`;
        ghost.querySelector('[data-drop]')?.remove();
        win.document.body.appendChild(ghost);
        drag.ghost = ghost;
      }
    }

    e.preventDefault();

    if (drag.ghost) {
      drag.ghost.style.left = `${e.clientX}px`;
      drag.ghost.style.top = `${e.clientY}px`;
    }

    const over = win.document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-chip-wrap]');

    if (!over || over === drag.wrap || over.parentElement !== drag.scroll) {
      return;
    }

    const box = over.getBoundingClientRect();

    if (e.clientX < box.left + box.width / 2) {
      drag.scroll.insertBefore(drag.wrap, over);
    } else {
      drag.scroll.insertBefore(drag.wrap, over.nextSibling);
    }
  };

  const up = () => {
    win.document.removeEventListener('pointermove', move, true);
    win.document.removeEventListener('pointerup', up, true);
    win.document.removeEventListener('pointercancel', up, true);

    const done = drag;

    drag = null;
    done?.ghost?.remove();

    if (!done?.moved) {
      return;
    }

    done.wrap.removeAttribute('data-dragging');
    done.strip?.removeAttribute('data-dragging');

    // The click that follows a drag must not open the chip's menu.
    const swallow = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    win.addEventListener('click', swallow, true);
    win.setTimeout(() => win.removeEventListener('click', swallow, true), 0);

    twReorder(
      win,
      [...done.scroll.querySelectorAll('[data-chip-wrap]')].map((el) => el.dataset.chip)
    );
  };

  win.document.addEventListener('pointermove', move, true);
  win.document.addEventListener('pointerup', up, true);
  win.document.addEventListener('pointercancel', up, true);
}

export function hideTwOverlay(win) {
  win?.document.getElementById(STRIP_ID)?.remove();
}

/**
 * Follow the page without rebuilding.
 *
 * A scroll only moves the strip; it must not draw it again. Rebuilding threw
 * away the button a menu was hanging off, and a menu anchored to a node that
 * is no longer in the page measures as zero and lands in the corner.
 *
 * The frame's own scrolls do not reach the parent window at all, so that
 * listener is put on the frame — and put on again whenever the preview swaps
 * its document under us.
 */
function bindFollow(win) {
  const move = () => reposition(win);

  if (boundWin !== win) {
    boundWin = win;
    win.addEventListener('resize', move);
    win.addEventListener('scroll', move, true);
  }

  const frameWin = previewFrame(win)?.contentWindow;

  if (frameWin && !frameWin._sveStripBound) {
    try {
      frameWin._sveStripBound = true;
      frameWin.addEventListener('scroll', move, true);
      frameWin.addEventListener('resize', move);

      // Switching device reloads the page in the frame, and the element the
      // strip hangs off is replaced along with everything else. The path
      // survives, so the new element is found once the marks are back.
      frameWin.addEventListener('statamic:preview-updated', () => {
        win.setTimeout(() => paintTwOverlay(win, placed?.path || ''), 60);
      });
    } catch {
      /* the frame is not ready — the next paint tries again */
    }
  }
}

function reposition(win) {
  const strip = win?.document.getElementById(STRIP_ID);

  if (!strip || !placed?.el?.isConnected) {
    return;
  }

  place(win, strip, placed.frame, placed.el);
}

export function paintTwOverlay(win, path) {
  if (!win || !twOverlayOn(win)) {
    hideTwOverlay(win);

    return;
  }

  const doc = win.document;
  const frame = previewFrame(win);
  const inner = frame?.contentDocument;
  const el = path && inner ? inner.querySelector(`[data-sve-ht-path="${path}"]`) : null;

  // A tag with no classes is exactly when the plus is worth reaching for, so
  // the strip shows for any picked tag — the name and the button on their own.
  if (!el || !twUi.tag) {
    hideTwOverlay(win);

    return;
  }

  ensureStyles(doc);
  bindFollow(win);

  let strip = doc.getElementById(STRIP_ID);

  if (!strip) {
    strip = doc.createElement('div');
    strip.id = STRIP_ID;
    doc.body.appendChild(strip);
  }

  // The groups are built once and kept. Rebuilding them threw away the plus,
  // and a menu anchored to a button that is no longer in the page loses its
  // anchor and falls back to the corner of the screen.
  let name = strip.querySelector('[data-group="tag"]');

  if (!name) {
    name = doc.createElement('div');
    name.setAttribute('data-group', 'tag');

    const label = doc.createElement('span');

    label.setAttribute('data-sve-tw-strip-tag', '');
    name.appendChild(label);
    strip.appendChild(name);
  }

  name.firstChild.textContent = `<${twUi.tag}>`;

  let box = strip.querySelector('[data-group="classes"]');
  let scroll = box?.querySelector('[data-scroll]');
  const chips = twUi.groups.flatMap((group) => group.chips);

  if (chips.length && !box) {
    box = doc.createElement('div');
    box.setAttribute('data-group', 'classes');

    scroll = doc.createElement('div');
    scroll.setAttribute('data-scroll', '');

    const fade = doc.createElement('span');

    fade.setAttribute('data-fade', '');
    box.appendChild(scroll);
    box.appendChild(fade);

    const sync = () => {
      const more = scroll.scrollWidth - scroll.scrollLeft - scroll.clientWidth > 2;

      if (more) {
        box.setAttribute('data-overflow', '');
      } else {
        box.removeAttribute('data-overflow');
      }
    };

    scroll.addEventListener('scroll', sync);
    box._sveSync = sync;
    strip.insertBefore(box, strip.querySelector('[data-group="add"]'));
  }

  if (!chips.length) {
    box?.remove();
  } else if (scroll) {
    scroll.replaceChildren();

    for (const chip of chips) {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.title = chip.title || '';

      if (chip.locked) {
        btn.setAttribute('data-locked', '');
      }

      if (chip.color) {
        const dot = doc.createElement('span');

        dot.setAttribute('data-dot', '');
        dot.style.background = chip.color;
        btn.appendChild(dot);
      }

      btn.appendChild(doc.createTextNode(chip.raw));

      const wrap = doc.createElement('span');

      wrap.setAttribute('data-chip-wrap', '');
      wrap.dataset.chip = chip.id;
      wrap.appendChild(btn);

      if (!chip.locked) {
        wrap.addEventListener('pointerdown', (event) => beginDrag(win, event, wrap, scroll));
      }

      if (!chip.locked) {
        const drop = doc.createElement('button');

        drop.type = 'button';
        drop.setAttribute('data-drop', '');
        drop.title = twUi.dropTitle || '';
        drop.textContent = '−';
        drop.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          twUi.onDrop?.(chip.id);
        });
        wrap.appendChild(drop);

        btn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          twUi.onChip?.(event, chip.id);
        });
      }

      scroll.appendChild(wrap);
    }

    win.requestAnimationFrame(() => box._sveSync?.());
  }

  if (!strip.querySelector('[data-group="add"]')) {
    const plus = doc.createElement('div');

    plus.setAttribute('data-group', 'add');

    const add = doc.createElement('button');

    add.type = 'button';
    add.setAttribute('data-add', '');

    // The glyph's own box sits lower than its optical centre, so it is lifted
    // rather than the button being made lopsided.
    const plusGlyph = doc.createElement('span');

    plusGlyph.setAttribute('data-plus', '');
    plusGlyph.textContent = '+';
    add.appendChild(plusGlyph);
    add.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      twOpenAddMenu(win, event.currentTarget);
    });
    plus.appendChild(add);
    strip.appendChild(plus);
  }

  placed = { frame, el, path };
  place(win, strip, frame, el);
}

/**
 * The element's box is in the frame's own coordinates, and the frame may be
 * scaled by the device presets — so the box is scaled with it before the
 * frame's own offset on the page is added.
 */
function place(win, strip, frame, el) {
  const frameBox = frame.getBoundingClientRect();
  const scale = frame.clientWidth ? frameBox.width / frame.clientWidth : 1;
  const box = el.getBoundingClientRect();
  const size = strip.getBoundingClientRect();
  const pad = 6;

  // Never against an edge: the frame's own inset, so the strip is never
  // pinned to a sidebar or the window's rim.
  const inset = 16;
  const left = frameBox.left + box.left * scale;
  const above = frameBox.top + box.top * scale - size.height - pad;
  const inside = frameBox.top + box.top * scale + pad;

  const minLeft = Math.max(pad, frameBox.left + inset);
  const maxLeft = Math.max(minLeft, Math.min(frameBox.right, win.innerWidth) - size.width - inset);

  strip.style.left = `${Math.max(minLeft, Math.min(left, maxLeft))}px`;
  strip.style.top = `${Math.max(frameBox.top + inset, above < frameBox.top + inset ? inside : above)}px`;

  // Out of sight only when the element itself has left the frame's viewport.
  const viewport = frame.clientHeight || frameBox.height;

  strip.hidden = box.bottom <= 0 || box.top >= viewport;
}
