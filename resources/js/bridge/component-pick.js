/**
 * bridge.js — region "component-pick", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { findPickRoots, HT_PATH_ATTR, isPickChrome, stampHtmlPickAll, unstampHtmlPick } from '../html-pick-align.js';
import { bridgeState } from '../bridge/state.js';
import { ACTIVE_ATTR, COMPONENT_DIM, COMPONENT_FOCUSED, SID_ATTR, t } from '../bridge.js';
import { applyOutlineTone } from './drag.js';
import { mountFocusFrame, unmountFocusFrame } from './focus-frame.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { watchAddedMatches } from '../lib/added-matches.js';

// ===== component-pick =====
/**
 * Outline every place the open component renders, and fade everything else.
 *
 * "Everything else" is walked, not guessed: from each match up to the body,
 * every sibling on the way is dimmed. That reaches whatever nests the
 * component without needing to know how deep it sits. An ancestor that holds a
 * match is un-dimmed afterwards, so the component never fades along with its
 * surroundings.
 */
export function applyComponentFocus(win) {
  const doc = win.document;
  const selector = bridgeState.componentFocus?.selector || '';

  if (!selector) {
    unwatchComponentFocus();
    clearComponentFocus(doc);
    // The focus is lifted, not redrawn: the frame goes with it. (The marks are
    // cleared and put back on every redraw below; the frame is only moved.)
    unmountFocusFrame('component');

    return;
  }

  // Another component's marks, or none yet: start from a clean page.
  if (componentWatch?.selector !== selector) {
    clearComponentFocus(doc);
    watchComponentFocus(win, selector);
  }

  let hits = [];

  try {
    hits = [...doc.querySelectorAll(bridgeState.componentFocus.selector)];
  } catch {
    // A selector the browser will not take says nothing about the page.
    return;
  }

  hits = hits.filter((el) => !isPickChrome(el) && !el.closest('[data-sve-chrome-ui]'));

  // Nothing matches right now: the marks stand as they are. A dialog's body
  // is copied in from its `<template>` on the microtask after the morph, and
  // the dims around it were put there for exactly that body. Clearing them
  // here, to put them back a moment later, is what the eye caught: the fade
  // is a transition, and a dialog's `showModal()` forces a style pass in the
  // gap, so the page lit up and faded down on every save. An instance the
  // page has truly lost leaves its dims until the next one lands or the focus
  // is lifted.
  if (!hits.length) {
    return;
  }

  clearComponentFocus(doc);
  // Mark every match first: two instances side by side must not dim each other.
  hits.forEach((el) => el.setAttribute(COMPONENT_FOCUSED, ''));

  for (const hit of hits) {
    let node = hit;

    while (node?.parentElement && node.parentElement !== doc.documentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling !== node && !sibling.hasAttribute(COMPONENT_FOCUSED)) {
          sibling.setAttribute(COMPONENT_DIM, '');
        }
      }

      node = node.parentElement;
    }
  }

  doc.querySelectorAll(`[${COMPONENT_DIM}]`).forEach((el) => {
    if (el.querySelector(`[${COMPONENT_FOCUSED}]`)) {
      el.removeAttribute(COMPONENT_DIM);
    }
  });

  doc.documentElement.classList.add('sve-component-focus');

  // The frame on the first instance that has a box: the component's name in
  // the corner and the way out opposite — the same frame the header and a
  // global section get (focus-frame.js). An instance without a box (a hidden
  // duplicate, a display:contents wrapper) would put the frame at nothing. A
  // component is a file and saves itself, so the frame never shows "not
  // saved" or Save; Close asks the dock to step out.
  const framed = hits.find((el) => {
    const rect = el.getBoundingClientRect();

    return rect.width > 0 && rect.height > 0;
  });

  mountFocusFrame(win, {
    kind: 'component',
    el: framed || hits[0],
    t,
    label: t('focus_label_component', { name: bridgeState.componentFocus.name || '' }),
    onClose: () => requestCloseComponent(win),
  });
}

/** Ask the Control Panel to step the dock out of the open component (`dock:exit-component`). */
export function requestCloseComponent(win) {
  win.parent.postMessage({ source: SOURCE, type: MSG.REQUEST_CLOSE_COMPONENT }, win.location.origin);
}

function clearComponentFocus(doc) {
  doc.documentElement.classList.remove('sve-component-focus');
  doc.querySelectorAll(`[${COMPONENT_FOCUSED}], [${COMPONENT_DIM}]`).forEach((el) => {
    el.removeAttribute(COMPONENT_FOCUSED);
    el.removeAttribute(COMPONENT_DIM);
  });
}

/** The watch on the open component's selector: its stop, and the selector it was started for. */
let componentWatch = null;

/**
 * Instances Alpine draws after the marking has run get marked too.
 *
 * A dialog the tree holds open takes its body from a `<template>` on the
 * microtask after `open` turns true — later than `applyComponentFocus`, which
 * runs synchronously on the preview update and on the tree's toggle. The body
 * was therefore never marked, and the dock's Instant paint, which only paints
 * marked instances, left the open dialog to the morph. One observer on the
 * body re-runs the marking when a node the selector names lands; the marking
 * writes attributes only, so it never wakes the observer itself.
 */
function watchComponentFocus(win, selector) {
  unwatchComponentFocus();
  componentWatch = {
    selector,
    stop: watchAddedMatches(win, selector, () => applyComponentFocus(win)),
  };
}

function unwatchComponentFocus() {
  componentWatch?.stop();
  componentWatch = null;
}

/**
 * An anchor that is a point, not an element — so a menu can open where the
 * pointer is. Satisfies the three things `openToolbarMenu` asks of an anchor.
 */
export function pointAnchor(x, y) {
  return {
    isConnected: true,
    contains: () => false,
    getBoundingClientRect: () => ({
      left: x,
      top: y,
      right: x,
      bottom: y,
      width: 0,
      height: 0,
    }),
  };
}

export const COMPONENT_SRC = 'data-sve-component-src';
export const COMPONENT_NAME = 'data-sve-component-name';

/**
 * Mark every element a component renders as, so a right-click on anything
 * inside one can name it.
 *
 * Innermost wins: a component nested in another gets stamped last and is the
 * one `closest()` finds, which is the one the reader pointed at.
 */
export function applyComponentMap(win) {
  const doc = win.document;

  doc.querySelectorAll(`[${COMPONENT_SRC}]`).forEach((el) => {
    el.removeAttribute(COMPONENT_SRC);
    el.removeAttribute(COMPONENT_NAME);
  });

  for (const item of bridgeState.componentMap) {
    let hits = [];

    try {
      hits = [...doc.querySelectorAll(item.selector)];
    } catch {
      continue;
    }

    for (const el of hits) {
      if (isPickChrome(el)) {
        continue;
      }

      el.setAttribute(COMPONENT_SRC, item.src);
      el.setAttribute(COMPONENT_NAME, item.name || '');
    }
  }
}

export function applyHtmlPick(win) {
  if (!bridgeState.htmlPick) {
    unstampHtmlPick(win.document);

    return;
  }

  const roots = findPickRoots(win.document, bridgeState.htmlPick);

  stampHtmlPickAll(bridgeState.htmlPick.all ? roots : roots.slice(0, 1), bridgeState.htmlPick.nodes, win.document);
  reportAwaitedPick(win);
}

/**
 * A hold on the element that was clicked, good across a redraw.
 *
 * Not the element itself: moving the dock to another section redraws the page
 * around it, and the node that was clicked is then detached — every held click
 * was being dropped for that reason alone. The section's uid and the child
 * indexes down to it survive the redraw, because the markup does.
 */
export function holdPick(el) {
  const root = el?.closest?.(`[${SID_ATTR}]`);
  const hold = { el, uid: '', idx: null, at: Date.now() };

  if (!root) {
    return hold;
  }

  const idx = [];
  let node = el;

  while (node && node !== root) {
    const parent = node.parentElement;

    if (!parent) {
      return hold;
    }

    idx.unshift([...parent.children].indexOf(node));
    node = parent;
  }

  hold.uid = root.getAttribute(SID_ATTR) || '';
  hold.idx = idx;

  return hold;
}

/** The held element as it stands now, redrawn or not. */
function heldElement(win, hold) {
  if (hold.el?.isConnected) {
    return hold.el;
  }

  if (!hold.uid || !hold.idx) {
    return null;
  }

  let node = win.document.querySelector(`[${SID_ATTR}="${CSS.escape(hold.uid)}"]`);

  for (const i of hold.idx) {
    node = node?.children?.[i];

    if (!node) {
      return null;
    }
  }

  return node;
}

/** The held click, now that this file's elements carry paths. */
function reportAwaitedPick(win) {
  const waiting = bridgeState.pickAwait;

  if (!waiting) {
    return;
  }

  // A click nobody could place within a few seconds is a click that landed on
  // something this file does not draw. Dropping it is right: reporting it late
  // would move the tree for a click the reader has long since moved on from.
  if (Date.now() - waiting.at > 4000) {
    bridgeState.pickAwait = null;

    return;
  }

  const held = heldElement(win, waiting);
  const el = held?.closest?.(`[${HT_PATH_ATTR}]`);

  if (!el) {
    return;
  }

  bridgeState.pickAwait = null;
  win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((node) => {
    node.removeAttribute(ACTIVE_ATTR);
  });
  applyOutlineTone(win, el);
  el.setAttribute(ACTIVE_ATTR, '');
  win.parent.postMessage(
    {
      source: SOURCE,
      type: MSG.CLICK,
      htmlPath: el.getAttribute(HT_PATH_ATTR),
      componentSrc: held.closest?.(`[${COMPONENT_SRC}]`)?.getAttribute(COMPONENT_SRC) || '',
    },
    win.location.origin
  );
}
