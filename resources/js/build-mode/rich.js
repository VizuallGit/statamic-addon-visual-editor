/**
 * Rich text in the dock's file: a block of prose Content edits with Bard.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, html-tree-edit.js, data-var-types.js. Pure.
 * Bus messages: none.
 *
 * There is no mark for it. A div is rich text when everything in it is what
 * Bard itself writes: paragraphs, headings, lists and quotes at the top, bold,
 * italic, underline, strike, code and links inside them, and not one class,
 * id or Antlers tag anywhere. Bard rewrites what it edits as plain HTML, so
 * it is only ever handed HTML it would have written anyway — a designer's
 * `<div><h2 class="text-800">` is not rich text, and is never stripped of its
 * classes. The Rich text tile writes `<div><p>…</p></div>`.
 *
 * Written back, the blocks stand one to a line at the div's indent, as the
 * rest of the file does.
 *
 * The Rich text tile's div also says what it is, with Tailwind's own `prose`, and
 * that one is one element to the one editing it: a click on a paragraph in it is
 * a click on it (`richOwner`) — where a div someone laid out with a heading and a
 * paragraph keeps both to click. A Bard field of the section can stand in its
 * place: the div then holds the tag and nothing else (`readRichField`).
 */

import { closingTagIndex } from '../html-tree-edit.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import { wholeTag } from '../data-var-types.js';
import { readAttribute } from './attrs.js';

/** The containers a block of prose can stand in. */
const HOLDERS = new Set(['div', 'article', 'aside']);

/** What may stand at the top of rich text, and what inside a block. */
const BLOCKS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'hr']);
const INSIDE = new Set(['li', 'p', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'code', 'a', 'br', 'sub', 'sup', 'ul', 'ol']);

/** A link keeps where it points and how it opens; nothing else has attributes. */
const LINK_ATTRS = new Set(['href', 'target', 'rel']);

function body(source, node) {
  const close = closingTagIndex(source, node);

  return close < node.openTo ? null : { from: node.openTo, to: close, text: source.slice(node.openTo, close) };
}

/** Whether a tag's opening carries only what Bard would write on it. */
function plainOpen(source, node) {
  const open = source.slice(node.from, node.openTo);
  const rest = open.replace(/^<[a-zA-Z0-9]+/, '').replace(/\/?>$/, '').trim();

  if (!rest) {
    return true;
  }

  if (node.tag !== 'a') {
    return false;
  }

  const names = [...rest.matchAll(/([^\s=]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?/g)].map((m) => m[1].toLowerCase());

  return names.every((name) => LINK_ATTRS.has(name));
}

function plain(source, nodes, allowed) {
  return nodes.every((node) => !node.kind && allowed.has(String(node.tag).toLowerCase()) && plainOpen(source, node) && plain(source, node.children || [], INSIDE));
}

/** Text standing loose in the div, between its blocks — Bard would wrap it, so it is not rich text. */
function looseText(source, inner, kids) {
  let at = inner.from;
  let loose = '';

  for (const kid of kids) {
    loose += source.slice(at, kid.from);
    at = kid.to;
  }

  return (loose + source.slice(at, inner.to)).trim() !== '';
}

/**
 * The rich text of the element: its inner HTML, or null when it is not rich text.
 *
 * @returns {null | { html: string }}
 */
export function readRich(source, node) {
  const html = String(source || '');

  if (!node || node.kind || !HOLDERS.has(String(node.tag).toLowerCase())) {
    return null;
  }

  const kids = node.children || [];
  const inner = body(html, node);

  if (!inner || !kids.length || /\{\{/.test(inner.text) || looseText(html, inner, kids) || !plain(html, kids, BLOCKS)) {
    return null;
  }

  return { html: inner.text.trim() };
}

/** Whether the element is a Rich text element: the tile's `prose` div, holding rich text or a field. */
export function isRichBlock(source, node) {
  const html = String(source || '');

  return !!node && !node.kind && /(^|\s)prose(\s|$)/.test(readAttribute(html, node, 'class') || '') && (!!readRich(html, node) || readRichField(html, node) !== null);
}

/** The path of the Rich text element an element stands in, or '' when it stands in none. */
export function richOwner(source, path) {
  const html = String(source || '');
  const walk = (nodes, around) => {
    for (const node of nodes || []) {
      if (node.path === path) {
        return around.find((holder) => isRichBlock(html, holder))?.path || '';
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

/** The tag when a field stands in the rich text's place: `<div>{{ content }}</div>`; else null. */
export function readRichField(source, node) {
  const html = String(source || '');

  if (!node || node.kind || !HOLDERS.has(String(node.tag).toLowerCase()) || (node.children || []).length) {
    return null;
  }

  const inner = body(html, node);

  return inner && wholeTag(inner.text) !== null ? inner.text.trim() : null;
}

/** Markup with the whitespace between tags folded away — the same HTML laid out another way reads the same. */
export function sameRich(a, b) {
  const fold = (s) => String(s || '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();

  return fold(a) === fold(b);
}

/** The file with the element's rich text replaced: one block to a line, at the element's indent plus one step. */
export function withRich(source, node, value) {
  const html = String(source || '');

  return readRich(html, node) ? laidOut(html, node, value) : html;
}

/**
 * The file with a field in the rich text's place, or back out of it: one tag is
 * the field; anything else is the words of a paragraph, and nothing an empty one.
 */
export function withRichField(source, node, text) {
  const html = String(source || '');

  if (!readRich(html, node) && readRichField(html, node) === null) {
    return html;
  }

  const value = String(text ?? '').trim();
  const words = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return laidOut(html, node, wholeTag(value) !== null ? value : `<p>${words}</p>`);
}

function laidOut(html, node, value) {
  const inner = body(html, node);
  const lineStart = html.lastIndexOf('\n', node.from - 1) + 1;
  const indent = /^[ \t]*/.exec(html.slice(lineStart, node.from))[0];
  const step = /\n([ \t]+)</.exec(inner.text)?.[1]?.slice(indent.length) || '    ';
  const fragment = String(value || '').trim();
  const blocks = parseTemplateTree(fragment).map((block) => fragment.slice(block.from, block.to));
  const lines = (blocks.length ? blocks : [fragment]).filter(Boolean).map((block) => `${indent}${step}${block}`);

  return `${html.slice(0, inner.from)}\n${lines.join('\n')}\n${indent}${html.slice(inner.to)}`;
}
