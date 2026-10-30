/**
 * After the Data button wrote a field in the HTML pane: the element holding it
 * gets the `{{ visual_edit }}` Build's data icon gives it (build-mode/attrs.js
 * `withFieldEdit`), so a field is editable in Edit Content however it got there.
 *
 * Owner: the dock (resources/js/dock/).
 * May import: html-tree-parse.js, data-var-types.js, build-mode/attrs.js,
 *   build-mode/text.js, build-mode/rich.js. Pure.
 * Bus messages: none.
 *
 * Only when the field is all the element holds, or all of its `src` or `href`:
 * `Hej {{ x }}` cannot be typed over in place. Never inside a loop, where the
 * tag would point every item at one field.
 */

import { parseTemplateTree } from '../html-tree-parse.js';
import { wholeTag } from '../data-var-types.js';
import { readAttribute, withFieldEdit } from '../build-mode/attrs.js';
import { readText } from '../build-mode/text.js';
import { readRichField } from '../build-mode/rich.js';

/** The innermost plain element around `at`, or null when `at` stands in a loop. */
function elementAt(nodes, at, around = null) {
  for (const node of nodes || []) {
    if (node.from <= at && at <= node.to) {
      if (node.kind === 'antlers' && node.antlers === 'loop') {
        return null;
      }

      return elementAt(node.children, at, node.kind ? around : node);
    }
  }

  return around;
}

/** @returns {string} `source`, its element at `at` pointed at the field `name` when it holds only that */
export function fieldEditAt(source, at, name) {
  const html = String(source || '');
  const node = elementAt(parseTemplateTree(html), at);

  if (!node) {
    return html;
  }

  if (at < node.openTo) {
    const address = ['src', 'href'].some((attr) => wholeTag(readAttribute(html, node, attr) ?? '') === name);

    return address ? withFieldEdit(html, node, name, { inline: false }) : html;
  }

  const read = readText(html, node);
  const body = read?.kind === 'text' ? read.text : readRichField(html, node);

  return wholeTag(body ?? '') === name ? withFieldEdit(html, node, name) : html;
}
