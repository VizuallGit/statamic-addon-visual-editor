/**
 * html-tree.js — dragging rows and sections.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { ask } from '../cp/bus.js';
import { figmaLook, htmlTreeUi } from '../cp/html-tree/store.js';
import { isTaglessRow, isVoidTag, parseTemplateTree } from '../html-tree-parse.js';
import { blockRange, dropPlace, findNode, moveHtml } from '../html-tree-edit.js';
import { logCaught } from '../lib/caught.js';
import { unwrapRef } from '../lib/values.js';
import { sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { htmlTreeFolds, htmlTreeState } from './state.js';
import { dockHtml, writeDockHtml } from './prefetch.js';
import { treeOptions } from './used-by.js';
import { renderHtmlTree } from './render.js';

let htmlTreeDragId = null;
let htmlTreeDragOrigin = null;
let htmlTreeDragEl = null;
let htmlTreePointerId = null;
let htmlTreeDragUnhook = null;
// A section being dragged between the page's sections (not a row in a file).
let htmlTreeSecDragUid = null;
let htmlTreeSecDragOrigin = null;
let htmlTreeSecDragEl = null;
let htmlTreeSecPointerId = null;
let htmlTreeSecDragUnhook = null;

export function beginHtmlTreePointer(win, event, id) {
  if (event.button !== 0 || ask('dock:is-locked') || htmlTreeUi.editingId) {
    return;
  }

  // A locked element does not move; nor does anything inside one.
  const held = htmlTreeUi.rows.find((item) => item.id === id);

  if (held && (held.locked || held.lockedIn)) {
    return;
  }

  if (event.target?.closest?.('button, input')) {
    return;
  }

  endHtmlTreeDrag();
  htmlTreeDragId = id;
  htmlTreeDragOrigin = { x: event.clientX, y: event.clientY };
  htmlTreeDragEl = event.currentTarget;
  htmlTreePointerId = event.pointerId;

  const onMove = (move) => trackHtmlTreePointer(win, move);
  const onUp = (up) => finishHtmlTreePointer(win, up);

  htmlTreeDragUnhook = () => {
    win.document.removeEventListener('pointermove', onMove, true);
    win.document.removeEventListener('pointerup', onUp, true);
    win.document.removeEventListener('pointercancel', onUp, true);
    htmlTreeDragUnhook = null;
  };

  win.document.addEventListener('pointermove', onMove, true);
  win.document.addEventListener('pointerup', onUp, true);
  win.document.addEventListener('pointercancel', onUp, true);
}

function trackHtmlTreePointer(win, event) {
  if (!htmlTreeDragId || !htmlTreeDragOrigin) {
    return;
  }

  const dx = event.clientX - htmlTreeDragOrigin.x;
  const dy = event.clientY - htmlTreeDragOrigin.y;

  if (!htmlTreeUi.dragging && dx * dx + dy * dy < 25) {
    return;
  }

  if (!htmlTreeUi.dragging) {
    htmlTreeUi.dragging = true;

    // Capture is optional: document listeners still track the move.
    try {
      htmlTreeDragEl?.setPointerCapture?.(htmlTreePointerId);
    } catch (error) {
      logCaught('html-tree: capture the pointer for a row', error);
    }
  }

  event.preventDefault();

  const under = win.document.elementFromPoint(event.clientX, event.clientY);
  const slot = under?.closest?.('[data-sve-ht-slot]');

  // The empty block's slot is the block's inside — there is no child row to
  // aim at, and "after the opening tag" is what the reader means by dropping
  // into the dashed box.
  if (slot) {
    const into = slot.getAttribute('data-sve-ht-id');

    if (into && into !== htmlTreeDragId) {
      htmlTreeUi.dropId = into;
      htmlTreeUi.dropPlace = 'inside';

      return;
    }
  }

  const el = under?.closest?.('[data-sve-ht-row]');
  const id = el?.getAttribute('data-sve-ht-id');

  if (!id || id === htmlTreeDragId) {
    htmlTreeUi.dropId = null;
    htmlTreeUi.dropPlace = null;

    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);
  const source = htmlTreeUi.rows.find((item) => item.id === htmlTreeDragId);

  // Not anywhere inside a locked element.
  if (!row || row.lockedIn || (source && row.path.startsWith(`${source.path}/`))) {
    htmlTreeUi.dropId = null;
    htmlTreeUi.dropPlace = null;

    return;
  }

  const rect = el.getBoundingClientRect();
  htmlTreeUi.dropId = id;
  htmlTreeUi.dropPlace = dropPlace(
    event.clientY - rect.top,
    rect.height,
    // Beside a locked element is fine — before its lock, after its end — into it is not.
    !isVoidTag(row.tag) && !isTaglessRow(row) && !row.locked
  );
}

function finishHtmlTreePointer(win, event) {
  const sourceId = htmlTreeDragId;
  const targetId = htmlTreeUi.dropId;
  const place = htmlTreeUi.dropPlace || 'after';
  const dragged = htmlTreeUi.dragging;

  endHtmlTreeDrag();

  if (dragged) {
    htmlTreeState.htmlTreeSuppressClick = true;
    win.setTimeout(() => {
      htmlTreeState.htmlTreeSuppressClick = false;
    }, 0);
  }

  if (!dragged || ask('dock:is-locked') || !sourceId || !targetId || sourceId === targetId) {
    return;
  }

  event?.preventDefault?.();

  const html = dockHtml();
  const next = moveHtml(html, htmlTreeState.htmlTreeRoots, sourceId, targetId, place);

  if (next !== html) {
    const undo = place === 'inside' && figmaLook() ? keepRoomOpen(win, html, next, sourceId, targetId) : null;

    if (!writeDockHtml(next)) {
      undo?.();
    }
  }
}

/**
 * Dropped into an empty element's room (the Figma look). The element has a
 * child now, and a parent below the top starts folded — it would shut on the
 * drop and take what was dropped with it. So it is opened: found in the new
 * markup by where its tag starts there, which is one moved block further up
 * when the block came from above it. Returns how to take the fold back, for a
 * write the dock refuses.
 */
function keepRoomOpen(win, html, next, sourceId, targetId) {
  const source = findNode(htmlTreeState.htmlTreeRoots, sourceId);
  const target = findNode(htmlTreeState.htmlTreeRoots, targetId);

  if (!source || !target || target.children.length || !(target.kind === 'antlers' || target.hollow)) {
    return null;
  }

  const moved = blockRange(html, source);
  const from = moved.from < target.from ? target.from - (moved.to - moved.from) : target.from;
  const find = (nodes, depth) => {
    for (const node of nodes) {
      if (node.from === from && node.tag === target.tag) {
        return { node, depth };
      }

      const found = find(node.children, depth + 1);

      if (found) {
        return found;
      }
    }

    return null;
  };
  const hit = find(parseTemplateTree(next, treeOptions(win)), 0);

  if (!hit) {
    return null;
  }

  // Open is "not flipped" at the top and "flipped" below it (htmlTreeShut).
  const { path } = hit.node;
  const top = hit.depth === 0 || path === htmlTreeState.htmlTreeTopPath;
  const had = htmlTreeFolds.has(path);

  if (top) {
    htmlTreeFolds.delete(path);
  } else {
    htmlTreeFolds.add(path);
  }

  return () => {
    if (had) {
      htmlTreeFolds.add(path);
    } else {
      htmlTreeFolds.delete(path);
    }
  };
}

export function endHtmlTreeDrag() {
  if (htmlTreeDragEl?.hasPointerCapture?.(htmlTreePointerId)) {
    htmlTreeDragEl.releasePointerCapture(htmlTreePointerId);
  }

  htmlTreeDragUnhook?.();
  htmlTreeDragId = null;
  htmlTreeDragOrigin = null;
  htmlTreeDragEl = null;
  htmlTreePointerId = null;
  htmlTreeUi.dragging = false;
  htmlTreeUi.dropId = null;
  htmlTreeUi.dropPlace = null;
}

/**
 * Dragging a section up or down the page, from the tree.
 *
 * The same press-and-move the rows of a file have, but what moves is the row
 * in `page_sections`, not markup: the preview's own drag sends `MOVE` with the
 * index to land at, and this sends the same message from the tree — through
 * the window, the way the preview does, so the one handler that reorders the
 * form's values stays the one. The file the section renders through is never
 * touched, so a locked dock does not stop it.
 *
 * The target is whichever section's wrapper the pointer is over — any of the
 * open section's rows count as the open section — and before/after is the
 * upper or lower half of that wrapper.
 */
export function beginSectionPointer(win, event, uid) {
  if (event.button !== 0 || !uid || htmlTreeUi.editingId) {
    return;
  }

  if (event.target?.closest?.('button, input')) {
    return;
  }

  endSectionDrag();
  htmlTreeSecDragUid = uid;
  htmlTreeSecDragOrigin = { x: event.clientX, y: event.clientY };
  htmlTreeSecDragEl = event.currentTarget;
  htmlTreeSecPointerId = event.pointerId;

  const onMove = (move) => trackSectionPointer(win, move);
  const onUp = (up) => finishSectionPointer(win, up);

  htmlTreeSecDragUnhook = () => {
    win.document.removeEventListener('pointermove', onMove, true);
    win.document.removeEventListener('pointerup', onUp, true);
    win.document.removeEventListener('pointercancel', onUp, true);
    htmlTreeSecDragUnhook = null;
  };

  win.document.addEventListener('pointermove', onMove, true);
  win.document.addEventListener('pointerup', onUp, true);
  win.document.addEventListener('pointercancel', onUp, true);
}

function trackSectionPointer(win, event) {
  if (!htmlTreeSecDragUid || !htmlTreeSecDragOrigin) {
    return;
  }

  const dx = event.clientX - htmlTreeSecDragOrigin.x;
  const dy = event.clientY - htmlTreeSecDragOrigin.y;

  if (!htmlTreeUi.dragging && dx * dx + dy * dy < 25) {
    return;
  }

  if (!htmlTreeUi.dragging) {
    htmlTreeUi.dragging = true;

    // Capture is optional: document listeners still track the move.
    try {
      htmlTreeSecDragEl?.setPointerCapture?.(htmlTreeSecPointerId);
    } catch (error) {
      logCaught('html-tree: capture the pointer for a section', error);
    }
  }

  event.preventDefault();

  const under = win.document.elementFromPoint(event.clientX, event.clientY);
  const wrap = under?.closest?.('[data-sve-ht-sec-uid]');
  const uid = wrap?.getAttribute('data-sve-ht-sec-uid') || '';

  if (!uid || uid === htmlTreeSecDragUid) {
    htmlTreeUi.sectionDrop = null;

    return;
  }

  const rect = wrap.getBoundingClientRect();

  htmlTreeUi.sectionDrop = {
    uid,
    place: event.clientY - rect.top < rect.height / 2 ? 'before' : 'after',
  };
}

function finishSectionPointer(win, event) {
  const uid = htmlTreeSecDragUid;
  const drop = htmlTreeUi.sectionDrop;
  const dragged = htmlTreeUi.dragging;

  endSectionDrag();

  if (dragged) {
    htmlTreeState.htmlTreeSuppressClick = true;
    win.setTimeout(() => {
      htmlTreeState.htmlTreeSuppressClick = false;
    }, 0);
  }

  if (!dragged || !uid || !drop?.uid || drop.uid === uid) {
    return;
  }

  event?.preventDefault?.();
  moveSectionOnPage(win, uid, drop.uid, drop.place);
}

function endSectionDrag() {
  if (htmlTreeSecDragEl?.hasPointerCapture?.(htmlTreeSecPointerId)) {
    htmlTreeSecDragEl.releasePointerCapture(htmlTreeSecPointerId);
  }

  htmlTreeSecDragUnhook?.();
  htmlTreeSecDragUid = null;
  htmlTreeSecDragOrigin = null;
  htmlTreeSecDragEl = null;
  htmlTreeSecPointerId = null;
  htmlTreeUi.dragging = false;
  htmlTreeUi.sectionDrop = null;
}

/**
 * Where the dragged section lands, as the index `MOVE` expects: the position
 * in the list once the section has been taken out of it. Read from the
 * publish values — the tree's list is drawn from them, but the values are
 * what the handler counts in.
 */
function moveSectionOnPage(win, uid, targetUid, place) {
  const field = sectionField(win) || 'page_sections';

  for (const container of activeContainers(win.document) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    const at = (id) =>
      list.findIndex((row) => row && typeof row === 'object' && [row._visual_id, row.id, row._id].includes(id));
    const from = at(uid);
    const target = at(targetUid);

    if (from === -1 || target === -1 || from === target) {
      return false;
    }

    let to = place === 'before' ? target : target + 1;

    if (from < to) {
      to -= 1;
    }

    if (to === from) {
      return false;
    }

    win.postMessage({ source: SOURCE, type: MSG.MOVE, uid, toIndex: to }, win.location.origin);

    // The values move on the next task; the list is read from them.
    win.setTimeout(() => renderHtmlTree(win), 60);

    return true;
  }

  return false;
}
