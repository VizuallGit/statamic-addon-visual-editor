/**
 * Elements that are one thing to whoever clicks them: a block of rich text, a
 * gallery. A click on what stands in one picks it, Add lands after it, and its
 * Content is its own.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, rich.js, gallery.js. Pure.
 * Bus messages: none.
 */

import { parseTemplateTree } from '../html-tree-parse.js';
import { isGallery } from './gallery.js';
import { isRichBlock } from './rich.js';

/** Is this element one thing, whatever it holds? */
export function isWhole(source, node) {
  return isRichBlock(source, node) || isGallery(source, node);
}

/** The path of the whole element an element stands in, or '' when it stands in none. */
export function wholeOwner(source, path) {
  const html = String(source || '');
  const walk = (nodes, around) => {
    for (const node of nodes || []) {
      if (node.path === path) {
        return around.find((holder) => isWhole(html, holder))?.path || '';
      }

      const hit = walk(node.children, [...around, node]);

      if (hit !== null) {
        return hit;
      }
    }

    return null;
  };

  return (path && walk(parseTemplateTree(html), [])) || '';
}
