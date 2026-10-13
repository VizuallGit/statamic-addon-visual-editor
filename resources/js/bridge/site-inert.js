/**
 * The page in Live Preview is for editing, not for using.
 *
 * Every way a person reaches the page — pointing, pressing, typing, focusing,
 * dragging — selects and edits; none of it reaches the site's own listeners.
 * The site still runs: Alpine's x-data, x-show, x-effect and transitions,
 * scroll- and intersect-driven effects all draw as they would. What the site
 * never hears is the person: no @click, @mouseenter, @focus,
 * @keydown.slash.window, @click.outside, no lightbox, no slider arrow, no
 * listener delegated on the document. A dialog or menu that has to be open to
 * be built is opened from the tree's Alpine toggle (alpine-state.js) — the one
 * way in, and the one way out.
 *
 * One listener per event type on the document, in the capture phase:
 * stopPropagation keeps the event from every element below the document and
 * from the document's and window's bubble phase — where Alpine's .window,
 * .document and .outside listen — while every other capture listener on the
 * document, which is where the editor listens, still runs.
 *
 * May import: bridge/state.js.
 */
import { bridgeState } from './state.js';

/**
 * The editor's own controls in the preview. Everything it puts inside <body>
 * carries an id of ours or one of these markers — toolbars, the hover belt,
 * the move control, inserters, AI marks, the x-ray bar, the inline editor's
 * portaled menus and the Bard set "+". A new control the preview draws must
 * carry one too, or its clicks never arrive.
 */
export const EDITOR_UI = [
  '[id^="__sve"]',
  '[id^="sve-"]',
  '[data-sve-ui]',
  '[data-sve-menu]',
  '[data-sve-color-menu]',
  '[data-sve-bard-style-menu]',
  '[data-sve-bard-set-inserter]',
].join(', ');

/** Spelled here, not imported: INSERT_ATTR lives in outline-nav.js, which imports this file. */
const INSERT_ATTR = 'data-sid-insert';

const EVENTS = [
  // Pointing. Never cancelled: mousedown places the caret, starts a selection
  // and focuses the field an inline edit is about to open.
  'pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout',
  'pointerenter', 'pointerleave', 'pointercancel',
  'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave',
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  'click', 'auxclick', 'dblclick', 'contextmenu',
  // Typing and focus.
  'keydown', 'keyup', 'keypress', 'beforeinput', 'input', 'change',
  'focus', 'blur', 'focusin', 'focusout',
  // Dragging.
  'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
  // A <details> or a popover opening.
  'toggle',
];

// Cancelled as well: the browser's own activation — a <summary> opening, a
// label ticking its box, a submit button — is the site's behaviour too.
const CANCEL = new Set(['click', 'auxclick']);

// The inline editor listens on the element being edited, which is the site's.
const EDITING = new Set(['input', 'keydown', 'keyup', 'blur']);

// The block inserters reveal their "+" on the insertable container itself.
const INSERTER = new Set(['pointerenter', 'pointerleave']);

/** Whether an event is the editor's to have, rather than the site's to be kept from. */
function editorOwns(win, event) {
  const target = event.target;

  // What the editor draws on <html> rather than <body> — grid handles, the
  // global and header/footer bars, confirm dialogs — is outside the page.
  if (!win.document.body?.contains(target) || target.closest?.(EDITOR_UI)) {
    return true;
  }

  if (EDITING.has(event.type) && bridgeState.editing?.el?.contains(target)) {
    return true;
  }

  return INSERTER.has(event.type) && !!target.hasAttribute?.(INSERT_ATTR);
}

export function installSiteInert(win) {
  const stop = (event) => {
    if (editorOwns(win, event)) {
      return;
    }

    if (CANCEL.has(event.type)) {
      event.preventDefault();
    }

    event.stopPropagation();
  };

  EVENTS.forEach((type) => {
    // Passive where nothing is cancelled: a capture listener for touch and
    // pointer moves must not hold up scrolling.
    win.document.addEventListener(type, stop, { capture: true, passive: !CANCEL.has(type) });
  });
}
