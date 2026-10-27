/**
 * One attribute of one tag in the dock's file — a link's `href` from Style.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js. Pure.
 * Bus messages: none.
 *
 * The same shape as tw-parse.js's class attribute: offsets read from a
 * masked copy, so a `{{ … }}` inside the tag never ends or starts an
 * attribute; the value written back is escaped for a double-quoted attribute.
 */

import { maskAntlers } from '../html-tree-parse.js';

function find(source, node, name) {
  const open = String(source || '').slice(node.from, node.openTo);
  const masked = maskAntlers(open);
  const match = new RegExp(`(\\s${name}\\s*=\\s*)(["'])`, 'i').exec(masked);

  if (!match) {
    return null;
  }

  const from = match.index + match[1].length + 1;
  const to = masked.indexOf(match[2], from);

  return to === -1 ? null : { from: node.from + from, to: node.from + to, value: open.slice(from, to) };
}

/** The attribute's value, or null when the tag has none. */
export function readAttribute(source, node, name) {
  return node && !node.kind ? find(source, node, name)?.value ?? null : null;
}

/** The file with the attribute set — added after the tag name when the tag has none. */
export function withAttribute(source, node, name, value) {
  const text = String(source || '');

  if (!node || node.kind || !/^[a-z][a-z0-9:-]*$/i.test(name)) {
    return text;
  }

  const safe = String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const hit = find(text, node, name);

  if (hit) {
    return text.slice(0, hit.from) + safe + text.slice(hit.to);
  }

  const tag = /^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(text.slice(node.from, node.openTo));

  if (!tag) {
    return text;
  }

  const at = node.from + tag[0].length;

  return `${text.slice(0, at)} ${name}="${safe}"${text.slice(at)}`;
}
