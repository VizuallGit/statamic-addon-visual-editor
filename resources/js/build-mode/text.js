/**
 * The text of one element in the dock's file — what Content writes for a
 * heading, a paragraph, a link's words.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: lib/tag-families.js, html-tree-edit.js, html-tree-parse.js, attrs.js. Pure.
 * Bus messages: none.
 *
 * Only an element whose body is words, fields and line breaks has text to edit
 * here: a body with other elements in it is theirs (a click picks one of them),
 * and is never rewritten from a text box. A field is written as the file says
 * it — `Hej {{ headline }}` — and its value is edited in Content mode; a line
 * break as the `<br>` it is.
 *
 * The text is shown as it reads on the page: entities decoded, the file's
 * line breaks and indentation folded to single spaces. Written back, it is
 * escaped, and the line breaks round the old text stay, so a paragraph laid
 * out over three lines keeps its layout — a space at either end is the
 * text's own, and goes with it.
 */

import { tagFamily } from '../lib/tag-families.js';
import { closingTagIndex } from '../html-tree-edit.js';
import { isVoidTag } from '../html-tree-parse.js';
import { decodeEntities } from './attrs.js';

/** Text-family tags that are form controls: their words are an attribute or options, not a body. */
const NOT_TEXT = new Set(['input', 'select', 'textarea', 'option', 'optgroup']);

/** Layout-family tags that hold words of their own. */
const ALSO_TEXT = new Set(['li', 'dt', 'dd', 'td', 'th', 'summary', 'legend', 'caption', 'figcaption', 'address']);

/** Tags whose text is one line: a box for them takes no line break. */
const ONE_LINE = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'label', 'summary', 'legend', 'caption']);

export function isOneLine(tag) {
  return ONE_LINE.has(String(tag || '').toLowerCase());
}

/** Whether an element of this tag holds text — a heading, a paragraph, a link, a list item. */
export function holdsText(tag) {
  const name = String(tag || '').toLowerCase();

  if (!name || NOT_TEXT.has(name) || isVoidTag(name)) {
    return false;
  }

  return tagFamily(name) === 'text' || ALSO_TEXT.has(name);
}

function body(source, node) {
  const close = closingTagIndex(source, node);

  return close < node.openTo ? null : { from: node.openTo, to: close, text: source.slice(node.openTo, close) };
}

/**
 * What Content can do with the element's text.
 *
 * @returns {null | { kind: 'text', text: string } | { kind: 'markup' }}
 *   null when the element is not one that holds text (a div, an image, a loop)
 */
export function readText(source, node) {
  const html = String(source || '');

  if (!node || node.kind || !holdsText(node.tag)) {
    return null;
  }

  const inner = body(html, node);

  if (!inner) {
    return null;
  }

  if ((node.children || []).some((child) => child.kind || String(child.tag).toLowerCase() !== 'br')) {
    return { kind: 'markup' };
  }

  return { kind: 'text', text: decodeEntities(inner.text.trim().replace(/\s+/g, ' ')) };
}

/** A tag still being typed: `{{ hea`. Written, it would stop the server rendering the section. */
export function halfTag(text) {
  return String(text ?? '').replace(/\{\{[\s\S]*?\}\}/g, '').includes('{{');
}

/**
 * Escaped as text, the tags left as Antlers reads them and a line break as the
 * element it is — with what it carries: `readText` lets a `<br>` through with
 * any attributes, so `<br class="hidden md:block">` has to come back the same.
 */
function escapeWords(text) {
  return String(text ?? '')
    .split(/(\{\{[\s\S]*?\}\}|<br\b[^<>]*>)/i)
    .map((part, at) => (at % 2 ? part : part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')))
    .join('');
}

/** The file with the element's text replaced — only an element `readText` calls text, and not while a tag is half typed. */
export function withText(source, node, value) {
  const html = String(source || '');

  if (readText(html, node)?.kind !== 'text' || halfTag(value)) {
    return html;
  }

  const inner = body(html, node);
  // The file's layout is a line break and its indent; a space typed at the end is the text's own.
  const layout = (space) => (inner.text.trim() && space.includes('\n') ? space : '');
  const lead = layout(/^\s*/.exec(inner.text)[0]);
  const trail = layout(/\s*$/.exec(inner.text)[0]);

  return html.slice(0, inner.from) + lead + escapeWords(value) + trail + html.slice(inner.to);
}
