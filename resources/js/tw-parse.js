/**
 * One tag's class attribute, as text with offsets.
 *
 * The dock owns the file as a string, so a class change is a splice into that
 * string — not a DOM edit. Three things in this project's markup decide the
 * shape here:
 *
 * - `class="[ {{ _class }} ] relative"`. The bracket run is the CSS pane's own
 *   scope name, not a utility. It stays one locked chip.
 * - `{{ … }}` renders a class this file cannot know. Locked as well: retyping
 *   it as plain text would drop the Antlers.
 * - `prose-p:text-current/70`, `leading-normal!`. A swap keeps the variants,
 *   the `/opacity` and the `!` — only the utility itself is exchanged.
 */

import { maskAntlers } from './html-tree-parse.js';

/**
 * The class attribute inside one open tag.
 *
 * Offsets come from the masked copy, the value from the source: masking keeps
 * a `{{ … }}` inside the value from ending the attribute early, while `class=`
 * inside an Antlers tag never matches at all.
 *
 * @returns {{ from: number, to: number, quote: string, value: string }|null}
 */
export function readClassAttr(source, from, openTo) {
  const open = String(source || '').slice(from, openTo);
  const masked = maskAntlers(open);
  const match = /(\sclass\s*=\s*)(["'])/i.exec(masked);

  if (!match) {
    return null;
  }

  const quote = match[2];
  const valueFrom = match.index + match[1].length + 1;
  const valueTo = masked.indexOf(quote, valueFrom);

  if (valueTo === -1) {
    return null;
  }

  return {
    from: from + valueFrom,
    to: from + valueTo,
    quote,
    value: open.slice(valueFrom, valueTo),
  };
}

/**
 * Whitespace-separated tokens, except that a run containing `{{ … }}` is one
 * token however many spaces sit inside it. `bg-{{ color }}` is a single class,
 * and so is a bare `{{ if … }}`.
 *
 * @returns {Array<{ text: string, from: number, to: number, dynamic: boolean }>}
 */
export function tokenizeClassValue(value) {
  const text = String(value || '');
  const tokens = [];
  let i = 0;

  while (i < text.length) {
    if (/\s/.test(text[i])) {
      i += 1;
      continue;
    }

    let to = i;
    let dynamic = false;

    while (to < text.length) {
      if (text.startsWith('{{', to)) {
        const close = text.indexOf('}}', to + 2);

        dynamic = true;
        to = close === -1 ? text.length : close + 2;
        continue;
      }

      if (/\s/.test(text[to])) {
        break;
      }

      to += 1;
    }

    tokens.push({ text: text.slice(i, to), from: i, to, dynamic });
    i = to;
  }

  return tokens;
}

/** Variants and utility, splitting only on the colons outside `[]` and `()`. */
export function splitClass(text) {
  const raw = String(text || '');
  const parts = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];

    if (ch === '[' || ch === '(') {
      depth += 1;
    } else if (ch === ']' || ch === ')') {
      depth = Math.max(0, depth - 1);
    } else if (ch === ':' && depth === 0) {
      parts.push(raw.slice(start, i));
      start = i + 1;
    }
  }

  const base = raw.slice(start);

  return { variants: parts, base };
}

/**
 * The utility without what a swap must carry over: `!` either side, and the
 * `/opacity` modifier.
 */
export function splitUtility(base) {
  const raw = String(base || '');
  let name = raw;
  let important = '';

  if (name.startsWith('!')) {
    important = 'pre';
    name = name.slice(1);
  } else if (name.endsWith('!')) {
    important = 'post';
    name = name.slice(0, -1);
  }

  let modifier = '';
  const slash = modifierIndex(name);

  if (slash !== -1) {
    modifier = name.slice(slash);
    name = name.slice(0, slash);
  }

  return { name, modifier, important };
}

/** A `/` outside brackets — `text-current/70`, but not `w-[calc(1/2)]`. */
function modifierIndex(name) {
  let depth = 0;

  for (let i = 0; i < name.length; i += 1) {
    const ch = name[i];

    if (ch === '[' || ch === '(') {
      depth += 1;
    } else if (ch === ']' || ch === ')') {
      depth = Math.max(0, depth - 1);
    } else if (ch === '/' && depth === 0) {
      return i;
    }
  }

  return -1;
}

/** Put a swapped utility back together the way the old one was written. */
export function buildClass({ variants, name, modifier, important }) {
  let base = `${name}${modifier || ''}`;

  if (important === 'pre') {
    base = `!${base}`;
  } else if (important === 'post') {
    base = `${base}!`;
  }

  return [...(variants || []), base].join(':');
}

/**
 * The tokens as the panel shows them: one chip per class, grouped by the
 * variant chain in front of it. The bare group comes first, the rest in the
 * order the file writes them.
 *
 * A `[ … ]` run collapses into one locked chip carrying the whole range, so
 * the CSS pane's scope names cannot be swapped from a utility menu.
 *
 * @returns {{ scope: object|null, groups: Array<{ key: string, variants: string[], items: object[] }> }}
 */
export function groupClassTokens(value) {
  const tokens = tokenizeClassValue(value);
  const groups = new Map();
  let scope = null;
  let i = 0;

  const bracketEnd = tokens.findIndex((token) => token.text === ']');

  if (tokens[0]?.text === '[' && bracketEnd > 0) {
    const inner = tokens.slice(1, bracketEnd);

    scope = {
      from: tokens[0].from,
      to: tokens[bracketEnd].to,
      label: `[ ${inner.map((token) => token.text).join(' ')} ]`,
    };
    i = bracketEnd + 1;
  }

  for (; i < tokens.length; i += 1) {
    const token = tokens[i];
    const { variants, base } = splitClass(token.text);
    const { name, modifier, important } = splitUtility(base);
    const key = variants.join(':');

    if (!groups.has(key)) {
      groups.set(key, { key, variants, items: [] });
    }

    groups.get(key).items.push({
      raw: token.text,
      from: token.from,
      to: token.to,
      dynamic: token.dynamic,
      variants,
      name,
      modifier,
      important,
    });
  }

  const out = [...groups.values()];

  out.sort((a, b) => (a.key === '' ? -1 : b.key === '' ? 1 : 0));

  return { scope, groups: out };
}

/**
 * Swap or drop one token inside the attribute value.
 *
 * Dropping takes one run of spaces or tabs with it, and the whole line when
 * that leaves the line empty — a class attribute written over several lines
 * should not collect blank ones.
 */
export function replaceToken(value, token, next) {
  const text = String(value || '');

  if (next) {
    return text.slice(0, token.from) + next + text.slice(token.to);
  }

  let from = token.from;
  let to = token.to;

  if (from > 0 && (text[from - 1] === ' ' || text[from - 1] === '\t')) {
    while (from > 0 && (text[from - 1] === ' ' || text[from - 1] === '\t')) {
      from -= 1;
    }
  } else {
    while (to < text.length && (text[to] === ' ' || text[to] === '\t')) {
      to += 1;
    }
  }

  return dropEmptyLine(text.slice(0, from) + text.slice(to), from);
}

function dropEmptyLine(text, at) {
  const before = text.lastIndexOf('\n', Math.max(0, at - 1));

  if (before === -1) {
    return text;
  }

  const after = text.indexOf('\n', before + 1);
  const line = text.slice(before + 1, after === -1 ? text.length : after);

  if (line.trim() !== '') {
    return text;
  }

  return text.slice(0, before) + text.slice(after === -1 ? text.length : after);
}

/** One more class at the end of the value, on the last line it uses. */
export function appendToken(value, raw) {
  const text = String(value || '');

  if (!text.trim()) {
    return raw;
  }

  return `${text.replace(/\s+$/, '')} ${raw}`;
}

/**
 * The file with this tag's class attribute rewritten.
 *
 * A tag with no class attribute gets one, right after the tag name — a picked
 * `<div>` should not be a dead end just because nobody has styled it yet.
 */
export function writeClassValue(source, node, nextValue) {
  const attr = readClassAttr(source, node.from, node.openTo);

  if (attr) {
    return source.slice(0, attr.from) + nextValue + source.slice(attr.to);
  }

  const open = String(source).slice(node.from, node.openTo);
  const name = /^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(open);

  if (!name || !nextValue) {
    return source;
  }

  const at = node.from + name[0].length;

  return `${source.slice(0, at)} class="${nextValue}"${source.slice(at)}`;
}
