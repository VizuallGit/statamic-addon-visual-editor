/**
 * Where an element stands in the site's flow: a class like `flow-y` (site.css)
 * puts `--flow-space` between its children, read on each child, so a
 * `flow-space-*` class on a child is the room above that child, and on the
 * flow element itself the room between all of them.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, tw-parse.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * Which classes make a flow is not named here: `readsFlow` says it, from what
 * the class compiles to (boot.js asks the catalog for `var(--flow-space`).
 */

import { parseTemplateTree } from '../html-tree-parse.js';
import { readClassAttr, tokenizeClassValue } from '../tw-parse.js';

/**
 * @param {string} html            the file
 * @param {string} path            the picked element's path
 * @param {(name: string) => boolean} readsFlow  whether a class is one that spaces its children
 * @returns {{ inside: boolean, holds: boolean, first: boolean }|null}
 *   `inside` — its parent spaces its children; `holds` — it spaces its own;
 *   `first` — the first of its parent's children, which no flow puts room above.
 */
export function flowAt(html, path, readsFlow) {
  const source = String(html || '');
  let found = null;

  // The parent is the nearest element above: an `{{ if }}` or a loop in between is no box of its own.
  const walk = (nodes, parent, direct) => nodes.some((node, at) => {
    if (node.path === path) {
      found = { node, parent, first: direct && at === 0 };

      return true;
    }

    return node.kind === 'antlers' ? walk(node.children || [], parent, false) : walk(node.children || [], node, true);
  });

  walk(parseTemplateTree(source), null, true);

  if (!found) {
    return null;
  }

  const spaces = (node) => {
    if (!node || node.kind) {
      return false;
    }

    const attr = readClassAttr(source, node.from, node.openTo);

    return !!attr && tokenizeClassValue(attr.value).some((token) => !token.dynamic && readsFlow(token.text));
  };

  return { inside: spaces(found.parent), holds: spaces(found.node), first: found.first };
}
