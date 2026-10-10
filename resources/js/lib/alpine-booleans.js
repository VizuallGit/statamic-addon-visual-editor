/**
 * The booleans an Alpine component starts with, read from its `x-data`.
 *
 * A dialog that opens on `open: true`, a menu on `menuOpen`: what is behind
 * them cannot be built while they are shut, and the way to see it used to be
 * writing `true` into the file and remembering to put `false` back. The HTML
 * tree offers to set them in the preview instead, and which ones it offers is
 * what the file says: the top-level `key: true` / `key: false` pairs of the
 * object literal. Methods, getters, nested objects, numbers, strings and
 * expressions are stepped over, and `x-data="dropdown()"` has none — what a
 * function returns is not in the file.
 *
 * Tolerant, not a JavaScript parser: it walks brackets, quotes and comments to
 * find the top level, and never evaluates anything.
 *
 *   xDataOf(openTag)         the attribute's value; '' when bare, null when absent
 *   alpineBooleans(source)   [{ key, value }] in the order the object writes them
 *
 * May import: nothing.
 */

/** One attribute from `lastIndex` on: name, then a quoted or bare value if there is one. */
const ATTR = /\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y;

const ENTRY = /^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;

/**
 * The `x-data` value of an opening tag, as written. Antlers in the tag is
 * blanked first: `{{ visual_edit … }}` carries quotes of its own, and an
 * attribute walk that stepped into them would find `x-data` in a class name.
 */
export function xDataOf(openTag) {
  const tag = String(openTag || '').replace(/\{\{[\s\S]*?\}\}/g, (match) => ' '.repeat(match.length));
  const name = tag.match(/^<[a-zA-Z][\w:-]*/);

  if (!name) {
    return null;
  }

  let at = name[0].length;

  while (at < tag.length) {
    ATTR.lastIndex = at;

    const match = ATTR.exec(tag);

    if (!match) {
      at += 1;
      continue;
    }

    if (match[1].toLowerCase() === 'x-data') {
      return match[2] ?? match[3] ?? match[4] ?? '';
    }

    at = ATTR.lastIndex;
  }

  return null;
}

/** Where the string opened at `start` ends: its closing quote, escapes skipped. */
function stringEnd(text, start) {
  const quote = text[start];

  for (let i = start + 1; i < text.length; i += 1) {
    if (text[i] === '\\') {
      i += 1;
    } else if (text[i] === quote) {
      return i;
    }
  }

  return text.length - 1;
}

/**
 * The top-level booleans of an `x-data` object literal. A key written twice
 * keeps its first place and its last value, as the object itself would.
 */
export function alpineBooleans(source) {
  const text = String(source || '');
  const open = text.search(/\S/);

  if (open === -1 || text[open] !== '{') {
    return [];
  }

  const found = new Map();
  let depth = 0;
  let entry = '';

  const take = () => {
    const match = entry.match(ENTRY);

    if (match) {
      found.set(match[1] ?? match[2] ?? match[3], match[4] === 'true');
    }

    entry = '';
  };

  for (let i = open; i < text.length; i += 1) {
    const ch = text[i];

    if (ch === '"' || ch === "'" || ch === '`') {
      const end = stringEnd(text, i);

      entry += text.slice(i, end + 1);
      i = end;
      continue;
    }

    if (ch === '/' && text[i + 1] === '/') {
      const end = text.indexOf('\n', i);

      i = end === -1 ? text.length : end - 1;
      continue;
    }

    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);

      i = end === -1 ? text.length : end + 1;
      continue;
    }

    if (ch === '{' || ch === '[' || ch === '(') {
      depth += 1;

      if (depth === 1) {
        continue;
      }
    } else if (ch === '}' || ch === ']' || ch === ')') {
      depth -= 1;

      if (depth === 0) {
        break;
      }
    } else if (ch === ',' && depth === 1) {
      take();
      continue;
    }

    entry += ch;
  }

  // The last pair has no comma after it, and a literal cut short still has
  // its pairs.
  take();

  return [...found].map(([key, value]) => ({ key, value }));
}
