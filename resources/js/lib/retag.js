/**
 * An element of the file under another tag name — what every tag menu writes
 * (tw-classes.js: the dock's tag button, the HTML tree's chip, Build's Content).
 *
 * The element is found again by where it starts, whole: a pick carries only its
 * opening tag, and renaming with no end to look before renamed the opening tag
 * alone — `<h3>…</h2>`.
 *
 * A link that stops being one loses what only a link has: `href`, `target`,
 * `rel`, in the same write; and its `{{ visual_edit }}`, when that pointed at the
 * field in its `href`. Its text and an aria-label stay.
 *
 * May import: html-tree-parse.js, tw-parse.js, build-mode/attrs.js, data-var-types.js,
 *   lib/tag-choices.js. Pure.
 */
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import { renameTag } from '../tw-parse.js';
import { fieldEditOf, readAttribute, withAttribute, withFieldEdit } from '../build-mode/attrs.js';
import { wholeTag } from '../data-var-types.js';
import { tagRefusal } from './tag-choices.js';

const LINK_ONLY = ['href', 'target', 'rel'];

/** The tag starting at `at`, whole — `from`, `openTo`, `to` — or null. */
export function tagAt(source, at) {
  return flattenHtmlTree(parseHtmlTree(source), new Set()).find((row) => row.from === at && row.tag) || null;
}

/** The file with the element starting at `at` renamed to `name`; unchanged when it cannot be (tag-choices.js `tagRefusal`). */
export function retag(source, at, name) {
  const text = String(source || '');
  const next = String(name || '').trim().toLowerCase();
  let node = tagAt(text, at);

  if (!node || next === node.tag.toLowerCase() || tagRefusal(node.tag, next)) {
    return text;
  }

  let out = text;

  if (node.tag.toLowerCase() === 'a') {
    const field = wholeTag(readAttribute(out, node, 'href') ?? '');

    if (field && fieldEditOf(out, node) === field) {
      out = withFieldEdit(out, node, null);
      node = tagAt(out, at);
    }

    for (const attr of LINK_ONLY) {
      out = withAttribute(out, node, attr, null);
      node = tagAt(out, at);
    }
  }

  return node ? renameTag(out, node, next) : text;
}
