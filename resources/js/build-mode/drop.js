/**
 * A drop on Build's canvas: what an element there takes, and the file with a
 * new element (a tile from Add) or a moved one (an element of the section)
 * where the pointer let go.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, html-tree-edit.js, build-mode/catalog.js,
 *             build-mode/place.js.
 * Pure: reads the file, returns the next one; writing it is the caller's
 * (the port's `write`).
 * Bus messages: none.
 *
 * The zones are the HTML tree's (`dropPlace`): the top half of an element is
 * before it, the bottom half after, the middle third inside when it holds
 * others (Add's `holdsElements`). Into goes where Add puts things
 * (`placeFor`): a section fills its container, Columns their first empty
 * column. Nothing lands inside a lock or anything in one; beside a locked
 * element it does, as in the tree. The section's own element takes things
 * inside only — beside it is outside the section.
 *
 * A move is the tree's own (`moveHtml`).
 */

import { parseTemplateTree } from '../html-tree-parse.js';
import { dropPlace, moveHtml } from '../html-tree-edit.js';
import { holdsElements } from './catalog.js';
import { findByPath, insertAt, parentOf, pathAt, placeFor } from './place.js';

/** On the moved element while moveHtml carries it: where it landed is where the mark is. */
const MOVING = 'data-sve-build-moving';

const within = (path, root) => path === root || path.startsWith(`${root}/`);

/**
 * What the row at `path` takes: `beside` (before and after it) and `inside`.
 * Null when it takes nothing — inside a lock, hidden, or (a move) the moved
 * element itself or anything in it.
 *
 * @param {Array} roots       parseTemplateTree(...)
 * @param {string} path
 * @param {string} [moving]   the moved row's path, for a move
 * @returns {{ beside: boolean, inside: boolean }|null}
 */
export function dropZones(roots, path, moving = '') {
  const node = path ? findByPath(roots, path) : null;

  if (!node || node.hidden || node.lockedIn || (moving && within(path, moving))) {
    return null;
  }

  const zones = { beside: path.includes('/'), inside: holdsElements(node) };

  return zones.beside || zones.inside ? zones : null;
}

/**
 * Where over an element the pointer is: `before`, `after` or `inside`, or
 * null when the element takes nothing.
 *
 * @param {object|null} zones  dropZones(...)
 * @param {number} y           the pointer's offset from the element's top
 * @param {number} height      the element's height
 */
export function dropWhere(zones, y, height) {
  if (!zones) {
    return null;
  }

  if (!zones.beside) {
    return zones.inside ? 'inside' : null;
  }

  return dropPlace(y, height, zones.inside);
}

/**
 * The row a drop inside `path` lands in — Add's place for it, unless that is
 * the moved element or inside it (a section whose container is what moves).
 */
function intoRow(html, roots, path, moving = '') {
  const node = findByPath(roots, path);
  const into = placeFor(html, roots, path)?.parent || node;

  return moving && within(into.path, moving) ? node : into;
}

/** The path a drop inside `path` lands in: what the canvas outlines while the pointer is there. */
export function dropInto(source, path, moving = '', options = {}) {
  const html = String(source || '');
  const roots = parseTemplateTree(html, options);

  return findByPath(roots, path) ? intoRow(html, roots, path, moving).path : '';
}

const takes = (zones, where) => !!zones && (where === 'inside' ? zones.inside : zones.beside);

/**
 * The file with `markup` dropped `where` at the row `path`, where the new
 * element starts, and its path. Null when that place takes nothing.
 *
 * @returns {{ html: string, at: number, path: string }|null}
 */
export function dropNew(source, path, where, markup, options = {}) {
  const html = String(source || '');
  const roots = parseTemplateTree(html, options);

  if (!markup || !takes(dropZones(roots, path), where)) {
    return null;
  }

  const node = findByPath(roots, path);
  const parent = parentOf(roots, node) || null;
  const place =
    where === 'inside'
      ? { mode: 'into', parent: intoRow(html, roots, path), after: null }
      : where === 'before'
        ? { mode: 'before', parent, before: node }
        : { mode: 'after', parent, after: node };
  const next = insertAt(html, place, markup);

  return { ...next, path: pathAt(next.html, next.at, options) };
}

/** Whether the row at `path` can be picked up: an element of the section, not its own, not locked. */
export function movable(roots, path) {
  const node = path ? findByPath(roots, path) : null;

  return !!node && !node.kind && !node.hidden && !node.locked && !node.lockedIn && path.includes('/');
}

/**
 * The file with the row `from` moved `where` at the row `to`, and the moved
 * element's new path. moveHtml says nothing of where the block landed, so the
 * element carries a mark of its own through the move (an attribute after its
 * tag name — nothing the tree's rows are cut by), read and taken off again.
 * Null when the move is not possible.
 *
 * @returns {{ html: string, path: string }|null}
 */
export function dropMove(source, from, to, where, options = {}) {
  const html = String(source || '');
  const roots = parseTemplateTree(html, options);

  if (!movable(roots, from) || !takes(dropZones(roots, to, from), where)) {
    return null;
  }

  const moving = findByPath(roots, from);
  const target = where === 'inside' ? intoRow(html, roots, to, from) : findByPath(roots, to);
  const cut = moving.from + 1 + moving.tag.length;
  const marked = `${html.slice(0, cut)} ${MOVING}${html.slice(cut)}`;
  const markedRoots = parseTemplateTree(marked, options);
  // A loop's or an if's path holds its offset, which the mark shifts when it is behind it.
  const into = findByPath(markedRoots, pathAt(marked, target.from >= cut ? target.from + MOVING.length + 1 : target.from, options));
  const moved = moveHtml(marked, markedRoots, findByPath(markedRoots, from).id, into.id, where);
  const mark = moved.indexOf(` ${MOVING}`);

  if (moved === marked || mark === -1) {
    return null;
  }

  const out = moved.slice(0, mark) + moved.slice(mark + MOVING.length + 1);

  return { html: out, path: pathAt(out, moved.lastIndexOf('<', mark), options) };
}
