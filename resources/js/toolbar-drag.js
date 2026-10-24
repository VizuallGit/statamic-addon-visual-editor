/**
 * Drag in the Live Preview top bar: a tool's icon between the tools of a
 * group, into another group, or out into a new group of its own — or a whole
 * group, grabbed by its own surface around and between the icons, to the left
 * or right of the others.
 *
 * One delegated `pointerdown` on the bar arms a gesture; nothing moves until
 * the pointer has travelled a few pixels, so a plain click still opens the
 * tool. The drop goes through toolbar-visibility.js, which owns the groups and
 * redraws the bar — this module only reads the bar's DOM to find the slot.
 * By keyboard, groups move in the Live Preview settings menu (⋮ → Top bar).
 *
 * May import: ./toolbar-visibility.js, ./lib/*. Does not import the kernel.
 */
import { t } from './lib/i18n.js';
import {
  HEADER_FRAME_PREFIX,
  HEADER_SURFACE,
  HEADER_TOOLBAR_ID,
  LP_CHROME_H,
  LP_TOOLBAR_GAP,
  TOOLBAR_ADD_ATTR,
  TOOLBAR_GROUP_ATTR,
  TOOLBAR_NEW_GROUP_ATTR,
} from './lib/ids.js';
import { moveToolbarGroup, moveToolbarToolBefore, moveToolbarToolToNewGroup } from './toolbar-visibility.js';

const DROP_ATTR = 'data-sve-toolbar-drop';
const TOOL_SELECTOR = 'button[data-tab], [id^="__sve-frame-"]';
const GROUP_TOOLS = ':scope > button[data-tab], :scope > [id^="__sve-frame-"]';
// Below this a press is a click, not a drag.
const DRAG_THRESHOLD = 6;
// A box takes the pointer this far past its edges facing away from a neighbour.
const BOX_SLACK = 4;
// Half the 4px gap between tools inside a group box: where the line sits.
const TOOL_GAP_HALF = 2;

// One gesture at a time, across every bar element the window has had.
let gesture = null;

function toolKey(node) {
  return node.dataset.tab || node.id.slice(HEADER_FRAME_PREFIX.length);
}

// A tool hidden by the toolbar's stylesheet, or a box whose tools are all hidden, has no boxes.
function isShown(node) {
  return node.getClientRects().length > 0;
}

// Every group box, shown or not: its index is the group's index in storage.
function allBoxes(bar) {
  return [...bar.querySelectorAll(`:scope > [${TOOLBAR_GROUP_ATTR}]`)];
}

function groupBoxes(bar) {
  return allBoxes(bar).filter(isShown);
}

function groupTools(box) {
  return [...box.querySelectorAll(GROUP_TOOLS)].filter(isShown);
}

/** The tool node a press landed on, or null when this press is not a drag handle. */
function pressedTool(target) {
  if (target.closest(`[${TOOLBAR_ADD_ATTR}], [${TOOLBAR_NEW_GROUP_ATTR}]`)) {
    return null;
  }

  let node = target.closest(TOOL_SELECTOR);

  // The button inside a frame: the frame is the tool node.
  if (node?.parentElement?.id.startsWith(HEADER_FRAME_PREFIX)) {
    node = node.parentElement;
  }

  if (!node?.parentElement?.hasAttribute(TOOLBAR_GROUP_ATTR)) {
    return null;
  }

  // A frame's own control (the pages select, …) must keep working: only its icon drags.
  if (node.id.startsWith(HEADER_FRAME_PREFIX) && !node.querySelector(':scope > button[data-tab]')?.contains(target)) {
    return null;
  }

  return toolKey(node) === 'settings' ? null : node;
}

/**
 * The group box a press landed on — its own surface, not an icon or its «+» —
 * when there is another group to move past, as the grab cursor says; or null.
 */
function pressedGroup(bar, target) {
  if (target.parentElement !== bar || !target.hasAttribute(TOOLBAR_GROUP_ATTR)) {
    return null;
  }

  return allBoxes(bar).length > 1 ? target : null;
}

/**
 * Where a group dropped at `x` would go: before the first other shown box
 * whose middle is right of `x`, else after the last. `index` is among the
 * groups without the dragged one, as moveToolbarGroup takes it — hidden
 * boxes counted, so it is the storage index.
 */
function groupSlotAt(bar, x, dragged) {
  const others = allBoxes(bar).filter((box) => box !== dragged);
  const shown = others.filter(isShown);

  if (!shown.length) {
    return null;
  }

  const next = shown.find((box) => {
    const rect = box.getBoundingClientRect();

    return rect.left + rect.width / 2 > x;
  }) || null;

  return { index: next ? others.indexOf(next) : others.length, next, last: shown[shown.length - 1] };
}

/** True when the group would land where it is — groups nobody sees between the two places included. */
function isSameGroupPlace(slot, dragged) {
  const all = allBoxes(dragged.parentElement);
  const from = all.indexOf(dragged);
  const others = all.filter((box) => box !== dragged);

  return others.slice(Math.min(from, slot.index), Math.max(from, slot.index)).every((box) => !isShown(box));
}

function paintGroupIndicator(el, slot) {
  if (!slot) {
    el.style.display = 'none';

    return;
  }

  const rect = (slot.next || slot.last).getBoundingClientRect();
  const x = slot.next ? rect.left - LP_TOOLBAR_GAP / 2 : rect.right + LP_TOOLBAR_GAP / 2;

  el.style.cssText =
    'position:fixed;pointer-events:none;z-index:2147483000;box-sizing:border-box;display:block;' +
    `height:${LP_CHROME_H}px;top:${Math.round(rect.top + rect.height / 2 - LP_CHROME_H / 2)}px;left:${Math.round(x)}px;` +
    'transform:translateX(-50%);width:.1875rem;border-radius:.125rem;' +
    'background:var(--theme-color-primary,#4f46e5);';
}

/**
 * Where a drop at `x` would put the tool.
 *
 * Between two boxes the whole gap means «new group»; the box slack only
 * widens the outer edges, else the 8px gap would be swallowed by the two
 * boxes' slack and a new group between them could never be reached.
 *
 * `newGroupIndex` is the storage index: before the next shown box, so a group
 * whose tools are all hidden (in storage, not on screen) does not shift it.
 */
function slotAt(bar, x) {
  const all = allBoxes(bar);
  const boxes = all.filter(isShown);

  if (!boxes.length) {
    return null;
  }

  const rects = boxes.map((box) => box.getBoundingClientRect());
  const first = rects[0];
  const last = rects[rects.length - 1];

  for (let i = 0; i < boxes.length; i++) {
    const rect = rects[i];
    const left = i === 0 ? rect.left - BOX_SLACK : rect.left;
    const right = i === boxes.length - 1 ? rect.right + BOX_SLACK : rect.right;

    if (x >= left && x <= right) {
      const tools = groupTools(boxes[i]);
      const before = tools.find((node) => {
        const box = node.getBoundingClientRect();

        return box.left + box.width / 2 > x;
      }) || null;

      return { groupId: boxes[i].getAttribute(TOOLBAR_GROUP_ATTR), beforeKey: before ? toolKey(before) : null, box: boxes[i], before, tools };
    }

    if (i < boxes.length - 1 && x > rect.right && x < rects[i + 1].left) {
      return { newGroupIndex: all.indexOf(boxes[i + 1]), rects, at: (rect.right + rects[i + 1].left) / 2, align: 'centre' };
    }
  }

  // Right of the last box, up to the end of the new-group square.
  const square = bar.querySelector(`:scope > [${TOOLBAR_NEW_GROUP_ATTR}] > button`)?.getBoundingClientRect();

  if (square && x > last.right + BOX_SLACK && x <= square.right + BOX_SLACK) {
    return { newGroupIndex: all.length, rects, at: square.left, align: 'start' };
  }

  // Left of the first box is Page settings — still in the bar.
  if (x < first.left - BOX_SLACK && x >= bar.getBoundingClientRect().left) {
    return { newGroupIndex: all.indexOf(boxes[0]), rects, at: first.left - LP_TOOLBAR_GAP, align: 'end' };
  }

  return null;
}

/** True when dropping into `slot` would leave the tool where it is. */
function isSamePlace(slot, source) {
  const box = source.parentElement;
  const tools = groupTools(box);
  const index = tools.indexOf(source);
  const key = toolKey(source);

  if ('newGroupIndex' in slot) {
    // A lone tool moved into a new group right beside its own box is the same
    // bar — also with groups nobody sees (all hidden) between the two places.
    const all = allBoxes(box.parentElement);
    const boxIndex = all.indexOf(box);
    const [lo, hi] = slot.newGroupIndex <= boxIndex ? [slot.newGroupIndex, boxIndex] : [boxIndex + 1, slot.newGroupIndex];

    return tools.length === 1 && all.slice(lo, hi).every((el) => !isShown(el));
  }

  if (slot.box !== box) {
    return false;
  }

  if (slot.beforeKey === null) {
    return index === tools.length - 1;
  }

  return slot.beforeKey === key || (tools[index + 1] && toolKey(tools[index + 1]) === slot.beforeKey);
}

function paintIndicator(win, el, slot) {
  if (!slot) {
    el.style.display = 'none';

    return;
  }

  const base =
    'position:fixed;pointer-events:none;z-index:2147483000;box-sizing:border-box;display:block;' +
    `height:${LP_CHROME_H}px;`;

  if ('newGroupIndex' in slot) {
    const box = slot.rects[Math.min(slot.newGroupIndex, slot.rects.length - 1)];
    const shift = slot.align === 'centre' ? '-50%' : slot.align === 'end' ? '-100%' : '0';
    // After the last group the drop lands on the new-group square: framed whole.
    const width = slot.align === 'start' ? `${LP_CHROME_H}px` : '1.25rem';

    el.style.cssText =
      `${base}top:${Math.round(box.top + box.height / 2 - LP_CHROME_H / 2)}px;left:${Math.round(slot.at)}px;` +
      `transform:translateX(${shift});width:${width};border-radius:.5rem;` +
      `outline:1px dashed var(--theme-color-primary,#4f46e5);background:${HEADER_SURFACE};`;
    el.title = t(win, 'toolbar_drag_new_group');

    return;
  }

  const box = slot.box.getBoundingClientRect();
  const lastTool = slot.tools[slot.tools.length - 1];
  const x = slot.before
    ? slot.before.getBoundingClientRect().left - TOOL_GAP_HALF
    : (lastTool ? lastTool.getBoundingClientRect().right : box.left) + TOOL_GAP_HALF;

  el.style.cssText =
    `${base}top:${Math.round(box.top + box.height / 2 - LP_CHROME_H / 2)}px;left:${Math.round(x)}px;` +
    'transform:translateX(-50%);width:.125rem;border-radius:.0625rem;' +
    'background:var(--theme-color-primary,#4f46e5);';
  el.removeAttribute('title');
}

/** The click the browser fires after a drag's pointerup must not open the tool. */
function swallowNextClick(win, bar) {
  const swallow = (event) => {
    event.stopPropagation();
    event.preventDefault();
    drop();
  };
  const drop = () => bar.removeEventListener('click', swallow, true);

  bar.addEventListener('click', swallow, true);
  // No click follows when the pointer was released off the bar.
  win.requestAnimationFrame(drop);
}

function startDrag(g) {
  g.active = true;

  try {
    g.node.setPointerCapture(g.pointerId);
  } catch {
    /* pointer already gone: pointerup / cancel cleans up */
  }

  if (g.kind === 'group') {
    g.bar.dataset.sveDraggingGroup = g.key;
  } else {
    g.bar.dataset.sveDragging = g.key;
  }

  g.opacity = g.node.style.opacity;
  g.node.style.opacity = '.4';
  g.indicator = g.win.document.createElement('div');
  g.indicator.setAttribute(DROP_ATTR, '');
  g.indicator.setAttribute('aria-hidden', 'true');
  g.win.document.body.appendChild(g.indicator);
}

function endGesture() {
  const g = gesture;

  if (!g) {
    return;
  }

  gesture = null;
  g.win.removeEventListener('pointermove', onMove, true);
  g.win.removeEventListener('pointerup', onUp, true);
  g.win.removeEventListener('pointercancel', endGesture, true);
  g.win.removeEventListener('keydown', onKey, true);
  g.win.removeEventListener('blur', endGesture);

  if (!g.active) {
    return;
  }

  g.indicator?.remove();
  delete g.bar.dataset.sveDragging;
  delete g.bar.dataset.sveDraggingGroup;
  g.node.style.opacity = g.opacity;

  if (g.node.hasPointerCapture?.(g.pointerId)) {
    g.node.releasePointerCapture(g.pointerId);
  }
}

function onMove(event) {
  const g = gesture;

  if (!g || event.pointerId !== g.pointerId) {
    return;
  }

  if (!g.active) {
    if (Math.hypot(event.clientX - g.x, event.clientY - g.y) <= DRAG_THRESHOLD) {
      return;
    }

    startDrag(g);
  }

  event.preventDefault();

  if (g.kind === 'group') {
    const slot = groupSlotAt(g.bar, event.clientX, g.node);

    g.slot = slot && !isSameGroupPlace(slot, g.node) ? slot : null;
    paintGroupIndicator(g.indicator, g.slot);

    return;
  }

  const slot = slotAt(g.bar, event.clientX);

  g.slot = slot && !isSamePlace(slot, g.node) ? slot : null;
  paintIndicator(g.win, g.indicator, g.slot);
}

function onUp(event) {
  const g = gesture;

  if (!g || event.pointerId !== g.pointerId) {
    return;
  }

  if (!g.active) {
    endGesture();

    return;
  }

  event.preventDefault();

  const { win, bar, key, kind, slot } = g;

  // Clean up first: the write redraws the bar, and the source node may go with it.
  endGesture();
  swallowNextClick(win, bar);

  if (!slot) {
    return;
  }

  if (kind === 'group') {
    moveToolbarGroup(win, key, slot.index);
  } else if ('newGroupIndex' in slot) {
    moveToolbarToolToNewGroup(win, key, slot.newGroupIndex);
  } else {
    moveToolbarToolBefore(win, key, slot.groupId, slot.beforeKey);
  }
}

function onKey(event) {
  if (event.key === 'Escape' && gesture?.active) {
    event.preventDefault();
    event.stopPropagation();
    endGesture();
  }
}

function onDown(win, bar, event) {
  // Touch scrolls and taps as before: only mouse and pen drag.
  if (event.button !== 0 || !event.isPrimary || event.pointerType === 'touch' || !(event.target instanceof win.Element)) {
    return;
  }

  const box = pressedGroup(bar, event.target);
  const node = box || pressedTool(event.target);

  if (!node) {
    return;
  }

  endGesture();
  gesture = {
    win,
    bar,
    kind: box ? 'group' : 'tool',
    // Holds the pointer and is dimmed while it moves: the group's box, or the tool's node.
    node,
    key: box ? box.getAttribute(TOOLBAR_GROUP_ATTR) : toolKey(node),
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    active: false,
    slot: null,
    opacity: '',
    indicator: null,
  };
  // On the window, not the bar: before the drag starts there is no capture,
  // and the pointer may already have left the bar.
  win.addEventListener('pointermove', onMove, true);
  win.addEventListener('pointerup', onUp, true);
  win.addEventListener('pointercancel', endGesture, true);
  win.addEventListener('keydown', onKey, true);
  win.addEventListener('blur', endGesture);
}

/** Called on every Live Preview pass: binds once per bar element. */
export function bindToolbarDrag(win) {
  const bar = win.document.getElementById(HEADER_TOOLBAR_ID);

  if (!bar || bar.dataset.sveDragBound === '1') {
    return;
  }

  bar.dataset.sveDragBound = '1';
  bar.addEventListener('pointerdown', (event) => onDown(win, bar, event));
}
