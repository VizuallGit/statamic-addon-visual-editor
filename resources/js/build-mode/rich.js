/**
 * Rich text in the dock's file: a block of prose Content edits with Bard.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, html-tree-edit.js. Pure.
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
 */

import { closingTagIndex } from '../html-tree-edit.js';
import { parseTemplateTree } from '../html-tree-parse.js';

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

/** Markup with the whitespace between tags folded away — the same HTML laid out another way reads the same. */
export function sameRich(a, b) {
  const fold = (s) => String(s || '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();

  return fold(a) === fold(b);
}

/** The file with the element's rich text replaced: one block to a line, at the element's indent plus one step. */
export function withRich(source, node, value) {
  const html = String(source || '');

  if (!readRich(html, node)) {
    return html;
  }

  const inner = body(html, node);
  const lineStart = html.lastIndexOf('\n', node.from - 1) + 1;
  const indent = /^[ \t]*/.exec(html.slice(lineStart, node.from))[0];
  const step = /\n([ \t]+)</.exec(inner.text)?.[1]?.slice(indent.length) || '    ';
  const fragment = String(value || '').trim();
  const blocks = parseTemplateTree(fragment).map((block) => fragment.slice(block.from, block.to));
  const lines = (blocks.length ? blocks : [fragment]).filter(Boolean).map((block) => `${indent}${step}${block}`);

  return `${html.slice(0, inner.from)}\n${lines.join('\n')}\n${indent}${html.slice(inner.to)}`;
}
