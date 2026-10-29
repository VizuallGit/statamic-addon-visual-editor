/**
 * The text of one element in the dock's file — what Content writes for a
 * heading, a paragraph, a link's words.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: lib/tag-families.js, html-tree-edit.js, html-tree-parse.js. Pure.
 * Bus messages: none.
 *
 * Only an element whose body is plain text has text to edit here. A body with
 * other elements in it is theirs (a click picks one of them), and a body with
 * Antlers in it is read by the server — `{{ headline }}` is a field, edited in
 * Content mode; neither is ever rewritten from a text box.
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

/** Text-family tags that are form controls: their words are an attribute or options, not a body. */
const NOT_TEXT = new Set(['input', 'select', 'textarea', 'option', 'optgroup']);

/** Layout-family tags that hold words of their own. */
const ALSO_TEXT = new Set(['li', 'dt', 'dd', 'td', 'th', 'summary', 'legend', 'caption', 'figcaption', 'address']);

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

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

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name) => {
    if (name[0] === '#') {
      const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);

      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }

    return ENTITIES[name.toLowerCase()] ?? whole;
  });
}

/**
 * What Content can do with the element's text.
 *
 * @returns {null | { kind: 'text', text: string } | { kind: 'markup' } | { kind: 'antlers', tag: string }}
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

  if ((node.children || []).length) {
    return { kind: 'markup' };
  }

  const antlers = /\{\{[\s\S]*?\}\}/.exec(inner.text);

  if (antlers) {
    return { kind: 'antlers', tag: antlers[0].replace(/\s+/g, ' ') };
  }

  return { kind: 'text', text: decode(inner.text.trim().replace(/\s+/g, ' ')) };
}

/** The file with the element's text replaced — only an element `readText` calls text. */
export function withText(source, node, value) {
  const html = String(source || '');

  if (readText(html, node)?.kind !== 'text') {
    return html;
  }

  const inner = body(html, node);
  // The file's layout is a line break and its indent; a space typed at the end is the text's own.
  const layout = (space) => (inner.text.trim() && space.includes('\n') ? space : '');
  const lead = layout(/^\s*/.exec(inner.text)[0]);
  const trail = layout(/\s*$/.exec(inner.text)[0]);
  const safe = String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return html.slice(0, inner.from) + lead + safe + trail + html.slice(inner.to);
}
