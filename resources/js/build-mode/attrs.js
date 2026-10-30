/**
 * One attribute of one tag in the dock's file — a link's `href` from Style.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js. Pure.
 * Bus messages: none.
 *
 * The same shape as tw-parse.js's class attribute: offsets read from a
 * masked copy, so a `{{ … }}` inside the tag never ends or starts an
 * attribute; the value written back is escaped for a double-quoted attribute,
 * and read back as the characters it stands for — `&amp;` is `&` in a box,
 * or the next write would make it `&amp;amp;`.
 */

import { maskAntlers } from '../html-tree-parse.js';
import { wholeTag } from '../data-var-types.js';

/**
 * The tags with an address of their own — Content's image, video and link:
 * the attribute, and the Control Panel field it is picked with
 * (element-fields.js).
 */
export const ADDRESS = {
  img: { attr: 'src', fieldtype: 'assets', alt: true },
  video: { attr: 'src', fieldtype: 'assets' },
  a: { attr: 'href', fieldtype: 'link' },
};

/**
 * An image's alt text is the asset's own — the one Statamic keeps on the file
 * ("Set Alt"), so there is one alt text and it follows wherever it is
 * changed. Read on the server as the site's image component reads it
 * (`{{ asset :url="…" }}{{ alt }}{{ /asset }}`), escaped for the attribute. An
 * image reading a field has that field's asset to ask: `{{ image:alt | entities }}`.
 */
export function altFromAsset(url) {
  const field = wholeTag(url);

  if (field !== null) {
    return `{{ ${field}:alt | entities }}`;
  }

  const at = String(url || '').trim().replace(/'/g, '%27');

  return at ? `{{ asset url='${at}' }}{{ alt | entities }}{{ /asset }}` : '';
}

function find(source, node, name) {
  const open = String(source || '').slice(node.from, node.openTo);
  const masked = maskAntlers(open);
  const match = new RegExp(`(\\s${name}\\s*=\\s*)(["'])`, 'i').exec(masked);

  if (!match) {
    return null;
  }

  const from = match.index + match[1].length + 1;
  const to = masked.indexOf(match[2], from);

  return to === -1 ? null : { start: node.from + match.index, from: node.from + from, to: node.from + to, value: open.slice(from, to) };
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };

/** HTML entities as the characters they stand for — an attribute's or an element's text, as it reads on the page. */
export function decodeEntities(text) {
  return String(text ?? '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name) => {
    if (name[0] === '#') {
      const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);

      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }

    return ENTITIES[name.toLowerCase()] ?? whole;
  });
}

/** The attribute's value as it reads, or null when the tag has none. */
export function readAttribute(source, node, name) {
  const hit = node && !node.kind ? find(source, node, name) : null;

  return hit ? decodeEntities(hit.value) : null;
}

/** The file with the attribute set — added after the tag name when the tag has none; null takes it out. */
/**
 * The element's `{{ visual_edit }}` pointed at a field — what makes it editable
 * in Edit Content's preview — or, `field` null, no longer pointed at one. Other
 * parameters on the tag stay; a tag left with none goes. A tag without `field`
 * is the author's and is left alone when there is no field to point at.
 */
export function withFieldEdit(source, node, field, { inline = true } = {}) {
  const text = String(source || '');

  if (!node || node.kind) {
    return text;
  }

  const open = text.slice(node.from, node.openTo);
  const hit = /\s*\{\{\s*visual_edit\b([\s\S]*?)\}\}/.exec(open);
  const rest = (hit?.[1] || '').replace(/\s*(field|inline_edit|inline-edit)="[^"]*"/g, '').trim();
  let tag = '';

  if (field) {
    tag = ` {{ visual_edit field="${field}"${inline ? ' inline_edit="true"' : ''}${rest ? ` ${rest}` : ''} }}`;
  } else if (!hit || !/\bfield="/.test(hit[1])) {
    return text;
  } else if (rest) {
    tag = ` {{ visual_edit ${rest} }}`;
  }

  if (hit) {
    return text.slice(0, node.from + hit.index) + tag + text.slice(node.from + hit.index + hit[0].length);
  }

  const name = /^<[a-zA-Z][a-zA-Z0-9:-]*/.exec(open);

  return name ? text.slice(0, node.from + name[0].length) + tag + text.slice(node.from + name[0].length) : text;
}

export function withAttribute(source, node, name, value) {
  const text = String(source || '');

  if (!node || node.kind || !/^[a-z][a-z0-9:-]*$/i.test(name)) {
    return text;
  }

  const safe = String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const hit = find(text, node, name);

  if (value === null) {
    return hit ? text.slice(0, hit.start) + text.slice(hit.to + 1) : text;
  }

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
