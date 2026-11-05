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
  const match = new RegExp(`(\\s${name.replace(/[.]/g, '\\.')}\\s*=\\s*)(["'])`, 'i').exec(masked);

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

/**
 * The element's `{{ visual_edit }}` pointed at a field — what makes it editable
 * in Edit Content's preview — or, `field` null, no longer pointed at one. Other
 * parameters on the tag stay; a tag left with none goes. A tag without `field`
 * is the author's and is left alone when there is no field to point at.
 */
/** The field the element's `{{ visual_edit }}` points at, or ''. */
export function fieldEditOf(source, node) {
  const open = node && !node.kind ? String(source || '').slice(node.from, node.openTo) : '';

  return /\{\{\s*visual_edit\b[^}]*?\bfield="([^"]*)"/.exec(open)?.[1] || '';
}

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

/** A name an attribute may have: `data-foo_bar`, `aria-label`, `xml:lang`. */
export const ATTR_NAME = /^[a-z][a-z0-9_.:-]*$/i;

/**
 * A value made safe for a double-quoted attribute — outside its `{{ … }}`
 * only: Antlers is read on the server before any browser sees the quotes, and
 * `{{ x | replace:"a" }}` escaped would be a different tag.
 */
export function escapeAttrValue(value) {
  return String(value ?? '')
    .split(/(\{\{[\s\S]*?\}\})/)
    .map((part, n) => (n % 2 ? part : part.replace(/&/g, '&amp;').replace(/"/g, '&quot;')))
    .join('');
}

/** The opening tag with Antlers and every quoted value blanked: what is left are the names. Offsets hold. */
function namesOnly(open) {
  return maskAntlers(open).replace(/(["'])[\s\S]*?\1/g, (quoted) => quoted[0] + ' '.repeat(quoted.length - 2) + quoted[quoted.length - 1]);
}

/**
 * Every attribute of a tag, in the order written: its name, its value as it
 * reads, and whether it is written bare (`data-open`) or without quotes
 * (`data-x=1`) — the second is not written back here. A `{{ … }}` between
 * attributes (`{{ visual_edit }}`) is not one of them.
 *
 * @returns {Array<{ name: string, value: string, bare: boolean, unquoted: boolean, from: number, to: number }>} offsets in the file
 */
export function attributeList(source, node) {
  if (!node || node.kind) {
    return [];
  }

  const open = String(source || '').slice(node.from, node.openTo);
  const names = namesOnly(open);
  const tag = /^<[a-zA-Z][a-zA-Z0-9:-]*/.exec(names);

  if (!tag) {
    return [];
  }

  const re = /\s([^\s"'=<>/]+)(\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  const out = [];
  let m;

  re.lastIndex = tag[0].length;

  while ((m = re.exec(names))) {
    const end = m.index + m[0].length;
    const raw = m[3] ? open.slice(end - m[3].length, end) : '';
    const quoted = /^["']/.test(raw);

    out.push({
      name: m[1],
      value: decodeEntities(quoted ? raw.slice(1, -1) : raw),
      bare: !m[2],
      unquoted: !!m[2] && !quoted,
      from: node.from + m.index + 1,
      to: node.from + end,
    });
  }

  return out;
}

/** The attribute renamed where it stands, its value and its place kept. The file unchanged when the new name is taken or is not a name. */
export function renameAttribute(source, node, from, to) {
  const text = String(source || '');
  const next = String(to || '').trim().toLowerCase();
  const list = attributeList(text, node);
  const hit = list.find((attr) => attr.name.toLowerCase() === String(from || '').toLowerCase());

  if (!hit || !ATTR_NAME.test(next) || next === hit.name || list.some((attr) => attr !== hit && attr.name.toLowerCase() === next)) {
    return text;
  }

  return text.slice(0, hit.from) + next + text.slice(hit.from + hit.name.length);
}

/** Alpine's own (`x-…`, `@…`, `:…`) — Action's, not Content's. */
const ALPINE = /^(x-|@|:)/;
/** The editor's own, never the author's. */
const EDITOR = /^data-sve-/i;

/**
 * The site's auto contrast (color-scheme's auto-contrast.js): the text colour
 * follows the element's background. Content's own switch, not a row of Data.
 */
export const AUTO_CONTRAST = 'data-auto-contrast';

/**
 * Is the attribute at `at` written inside an `{{ if }}` or `{{ unless }}` of
 * its own tag — `{{ unless text_color }} data-auto-contrast{{ /unless }}`? Then
 * the page decides when it is there, and a switch cannot say on or off.
 */
function inCondition(source, node, at) {
  let depth = 0;

  for (const m of String(source).slice(node.from, at).matchAll(/\{\{\s*(\/|end)?\s*(if|unless)\b/g)) {
    depth += m[1] ? -1 : 1;
  }

  return depth > 0;
}

/**
 * Content's two lists of an element's attributes: its `data-*`, and its
 * accessibility — `aria-*` and `role`. A link's `aria-label` is the link's own
 * box in Content and is left out here; Alpine is Action's. `unreadable` when the
 * tag has a value written without quotes: the lists are shown, never written.
 * Auto contrast is its own switch (`contrast`): on when the tag has it, in any
 * form, and `conditional` when an Antlers condition in the tag decides.
 */
export function contentAttributes(source, node) {
  const list = attributeList(source, node);
  const link = String(node?.tag || '').toLowerCase() === 'a';
  const rows = list.filter((attr) => !ALPINE.test(attr.name) && !EDITOR.test(attr.name));
  const plain = ({ name, value }) => ({ name, value });
  const contrast = rows.find((attr) => attr.name.toLowerCase() === AUTO_CONTRAST);

  return {
    data: rows.filter((attr) => /^data-/i.test(attr.name) && attr !== contrast).map(plain),
    contrast: { on: !!contrast, conditional: !!contrast && inCondition(source, node, contrast.from) },
    aria: rows
      .filter((attr) => {
        const name = attr.name.toLowerCase();

        return name === 'role' || (name.startsWith('aria-') && !(link && name === 'aria-label'));
      })
      .map(plain),
    unreadable: list.some((attr) => attr.unquoted),
  };
}

/**
 * The file with the attribute set — replaced where it stands; a new one after
 * the tag name, or, `end`, after the tag's last attribute (Content's own rows:
 * `id` and `class` stay first); null takes it out, and `true` writes it bare,
 * with no value (`data-auto-contrast`).
 */
export function withAttribute(source, node, name, value, { end = false } = {}) {
  const text = String(source || '');

  if (!node || node.kind || !ATTR_NAME.test(name)) {
    return text;
  }

  const safe = escapeAttrValue(value);
  const hit = find(text, node, name);
  // Written bare — `data-open`, no value: found by the list, replaced whole.
  const bare = hit ? null : attributeList(text, node).find((attr) => attr.bare && attr.name.toLowerCase() === name.toLowerCase());

  if (bare) {
    if (value === true) {
      return text;
    }

    return value === null ? text.slice(0, bare.from - 1) + text.slice(bare.to) : `${text.slice(0, bare.from)}${name}="${safe}"${text.slice(bare.to)}`;
  }

  if (value === null) {
    return hit ? text.slice(0, hit.start) + text.slice(hit.to + 1) : text;
  }

  if (hit) {
    // `true` drops the value: the name stays where it stands, after its own space.
    return value === true ? text.slice(0, hit.start + 1) + name + text.slice(hit.to + 1) : text.slice(0, hit.from) + safe + text.slice(hit.to);
  }

  const tag = /^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(text.slice(node.from, node.openTo));

  if (!tag) {
    return text;
  }

  const last = end ? attributeList(text, node).at(-1) : null;
  const at = last ? last.to : node.from + tag[0].length;

  return `${text.slice(0, at)} ${value === true ? name : `${name}="${safe}"`}${text.slice(at)}`;
}
