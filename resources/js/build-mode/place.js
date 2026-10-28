/**
 * Where a new element lands in the dock's file, and the file with it there.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, html-tree-edit.js, template-elements.js,
 *             lib/element-kind.js, build-mode/catalog.js, build-mode/markup.js.
 * Pure: reads the file, returns the next one; writing it is the caller's
 * (`dock:set-html`, as tw-classes.js commits a class).
 * Bus messages: none.
 *
 * The rule a builder's plus follows: an element picked that can hold others
 * gets the new one inside, as its last child; anything else gets it after
 * itself, on the next line, at its own indent. Two refinements, both what a
 * designer means:
 *
 * - a section whose first child is its container fills the container, not
 *   the space beside it;
 * - Columns fill their first empty column, else their last.
 *
 * "After" is `withTemplateMarkup` — the HTML tree's plus, one way of putting
 * a block into a file. "Into" is new here and indents the same way: the
 * parent's indent plus one step. "Before" is a drop's (build-mode/drop.js):
 * its own line in front of the row, at the row's indent. A locked element,
 * anything inside one, and a hidden (commented-out) one take nothing.
 */

import { parseTemplateTree } from '../html-tree-parse.js';
import { closingTagIndex } from '../html-tree-edit.js';
import { withTemplateMarkup } from '../template-elements.js';
import { classesOf, elementKind, siblingIndex } from '../lib/element-kind.js';
import { holdsElements } from './catalog.js';
import { INDENT } from './markup.js';

/** The row at a tree path (`0:section/1:div`), or null. */
export function findByPath(roots, path) {
  for (const node of roots || []) {
    if (node.path === path) {
      return node;
    }

    const hit = findByPath(node.children, path);

    if (hit) {
      return hit;
    }
  }

  return null;
}

/** The row's parent, or null at the top. */
export function parentOf(roots, node, parent = null) {
  for (const row of roots || []) {
    if (row === node) {
      return parent;
    }

    const hit = parentOf(row.children, node, row);

    if (hit !== undefined) {
      return hit;
    }
  }

  return undefined;
}

/** What Build calls a row: elementKind with its own and its parent's classes read from the file. */
export function kindAt(source, roots, node) {
  const parent = parentOf(roots, node) || null;

  return elementKind(node, classesOf(source, node), parent, classesOf(source, parent));
}

/**
 * Where a new element goes, given the row it is added at.
 *
 * @returns {{ mode: 'into'|'after'|'end', parent: object|null, after: object|null }|null}
 *   null when that place takes nothing (locked, inside a lock, commented out)
 */
export function placeFor(source, roots, path) {
  let target = path ? findByPath(roots, path) : null;

  if (!target) {
    return { mode: 'end', parent: null, after: null };
  }

  if (target.locked || target.lockedIn || target.hidden) {
    return null;
  }

  if (!holdsElements(target)) {
    return { mode: 'after', parent: parentOf(roots, target) || null, after: target };
  }

  const kind = kindAt(source, roots, target);
  const first = target.children?.[0];

  if (kind === 'section' && first && kindAt(source, roots, first) === 'container' && holdsElements(first)) {
    target = first;
  } else if (kind === 'columns') {
    target = target.children.find((col) => !col.children.length) || target.children[target.children.length - 1];
  }

  return { mode: 'into', parent: target, after: null };
}

/** Every line of `markup` after the first indented by `indent` (the first follows the caret). */
function indented(markup, indent) {
  return String(markup)
    .split('\n')
    .map((line) => (line ? indent + line : line))
    .join('\n');
}

/** The indent of the line the row starts on — whitespace only, else none. */
function indentOf(source, from) {
  const lineStart = source.lastIndexOf('\n', from - 1) + 1;
  const lead = source.slice(lineStart, from);

  return /^[ \t]*$/.test(lead) ? lead : '';
}

/**
 * The file with `markup` at `place`, and where the new element starts.
 *
 * @returns {{ html: string, at: number }}
 */
export function insertAt(source, place, markup) {
  const html = String(source || '');

  if (!place || place.mode === 'end') {
    return withTemplateMarkup(html, markup, null);
  }

  if (place.mode === 'after') {
    return withTemplateMarkup(html, markup, place.after);
  }

  if (place.mode === 'before') {
    // A locked row keeps its lock in front of it: the new one goes before both.
    const from = place.before.lockFrom ?? place.before.wrapFrom ?? place.before.from;
    const indent = indentOf(html, from);
    const start = from - indent.length;

    return {
      html: `${html.slice(0, start)}${indented(markup, indent)}\n${html.slice(start)}`,
      at: start + indent.length,
    };
  }

  const node = place.parent;
  const close = closingTagIndex(html, node);
  const indent = indentOf(html, node.from);
  const child = indent + INDENT;
  const inner = html.slice(node.openTo, close);
  const block = indented(markup, child);

  if (inner.trim() === '') {
    // `<div></div>` or `<div>\n    \n</div>`: the element opens up around the new one.
    return {
      html: `${html.slice(0, node.openTo)}\n${block}\n${indent}${html.slice(close)}`,
      at: node.openTo + 1 + child.length,
    };
  }

  // After the last thing inside, on its own line; the closing tag keeps its line.
  const end = node.openTo + inner.replace(/\s+$/, '').length;

  return {
    html: `${html.slice(0, end)}\n${block}${html.slice(end)}`,
    at: end + 1 + child.length,
  };
}

/**
 * The tree path of the element that now starts at `at` — the outermost one —
 * so the new element can be picked straight after it is written.
 */
export function pathAt(html, at, options = {}) {
  const walk = (nodes) => {
    for (const node of nodes || []) {
      if ((node.lockFrom ?? node.from) === at || node.from === at) {
        return node.path;
      }

      if (at > node.from && at < node.to) {
        const hit = walk(node.children);

        if (hit) {
          return hit;
        }
      }
    }

    return '';
  };

  return walk(parseTemplateTree(html, options));
}

/**
 * What the panel says about a row and where Add would put something: the
 * picked element (kind, tag, its place among its siblings, its classes) and
 * the place, each row described the same way. Plain objects — the panel
 * keeps no tree rows.
 *
 * @returns {{ node: object|null, place: { mode: string, parent: object|null, after: object|null }|null }}
 */
export function describeAt(source, path, options = {}) {
  const html = String(source || '');
  const roots = parseTemplateTree(html, options);
  const describe = (node) => {
    if (!node) {
      return null;
    }

    const parent = parentOf(roots, node) || null;

    return {
      path: node.path,
      tag: node.tag,
      label: node.label || '',
      src: node.src || '',
      kind: kindAt(html, roots, node),
      index: siblingIndex(roots, parent, node),
      classes: classesOf(html, node),
      locked: !!(node.locked || node.lockedIn),
    };
  };
  const node = path ? findByPath(roots, path) : null;
  const place = placeFor(html, roots, path);

  return {
    node: describe(node),
    place: place && { mode: place.mode, parent: describe(place.parent), after: describe(place.after) },
  };
}

/**
 * Everything at once: the file with the element added at the row `path`
 * names, and the new element's path. Null when that place takes nothing.
 *
 * @returns {{ html: string, at: number, path: string, place: object }|null}
 */
export function addAt(source, path, markup, options = {}) {
  const html = String(source || '');
  const roots = parseTemplateTree(html, options);
  const place = placeFor(html, roots, path);

  if (!place || !markup) {
    return null;
  }

  const next = insertAt(html, place, markup);

  return { ...next, path: pathAt(next.html, next.at, options), place };
}

/**
 * The Columns to draw for the pick: the picked row itself, or its parent when
 * the pick is one of its columns. Each column with its path and whether it
 * holds anything yet.
 */
export function columnsFor(html, path) {
  if (!path) {
    return null;
  }

  const picked = describeAt(html, path).node;

  if (!picked || (picked.kind !== 'columns' && picked.kind !== 'column')) {
    return null;
  }

  const roots = parseTemplateTree(html);
  const node = findByPath(roots, path);
  const grid = picked.kind === 'columns' ? node : parentOf(roots, node);

  if (!grid) {
    return null;
  }

  return {
    path: grid.path,
    columns: grid.children.filter((kid) => !kid.kind).map((kid) => ({ path: kid.path, empty: !kid.children.length })),
  };
}
