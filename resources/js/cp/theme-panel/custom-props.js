/**
 * Custom properties in resources/css/var.css — the `:root` declarations.
 * Read, and written back one declaration at a time. The Variables tab uses this.
 *
 * Pure functions, no DOM. Every byte outside the declarations that change stays
 * as it is, including the comment above `:root`.
 */

/** The first top-level `:root { … }` block: brace offsets, or null. */
function rootBlock(text) {
  let depth = 0;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);

      i = end === -1 ? text.length : end + 2;
      continue;
    }

    if (ch === '"' || ch === "'") {
      i = skipString(text, i);
      continue;
    }

    if (depth === 0 && text.startsWith(':root', i) && /[^a-z-]/i.test(text[i + 5] || ' ')) {
      const open = text.indexOf('{', i + 5);

      if (open === -1) {
        return null;
      }

      let d = 1;
      let j = open + 1;

      while (j < text.length && d > 0) {
        if (text[j] === '/' && text[j + 1] === '*') {
          const end = text.indexOf('*/', j + 2);

          j = end === -1 ? text.length : end + 2;
          continue;
        }

        if (text[j] === '"' || text[j] === "'") {
          j = skipString(text, j);
          continue;
        }

        if (text[j] === '{') {
          d++;
        } else if (text[j] === '}') {
          d--;
        }

        j++;
      }

      return d === 0 ? { open, close: j - 1 } : null;
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
    }

    i++;
  }

  return null;
}

function skipString(text, i) {
  const quote = text[i];
  let j = i + 1;

  while (j < text.length && text[j] !== quote) {
    j += text[j] === '\\' ? 2 : 1;
  }

  return j + 1;
}

/** Declarations directly in a `:root` body: `{ name, value, start, end }`. */
function declarations(body) {
  const found = [];
  let i = 0;

  while (i < body.length) {
    if (body[i] === '/' && body[i + 1] === '*') {
      const end = body.indexOf('*/', i + 2);

      i = end === -1 ? body.length : end + 2;
      continue;
    }

    const match = /^--([\w-]+)\s*:\s*([^;]*);/.exec(body.slice(i));

    if (match && (i === 0 || /[\s;{}]/.test(body[i - 1]))) {
      found.push({ name: match[1], value: match[2].trim(), start: i, end: i + match[0].length });
      i += match[0].length;
      continue;
    }

    i++;
  }

  return found;
}

/** Every custom property in the first `:root`, in file order: `{ name, value }`. */
export function readCustomProps(css) {
  const text = String(css || '');
  const block = rootBlock(text);

  if (!block) {
    return [];
  }

  return declarations(text.slice(block.open + 1, block.close)).map(({ name, value }) => ({ name, value }));
}

/**
 * `css` with `changes` applied: `{ name: value }` sets a property, `{ name: null }`
 * removes it. An existing one keeps its place; a new one goes at the end of `:root`.
 */
export function writeCustomProps(css, changes) {
  const text = String(css || '');
  const block = rootBlock(text);

  if (!block) {
    return text;
  }

  const wanted = new Map(Object.entries(changes || {}));
  let body = text.slice(block.open + 1, block.close);

  for (const decl of declarations(body).reverse()) {
    if (!wanted.has(decl.name)) {
      continue;
    }

    const value = wanted.get(decl.name);

    wanted.delete(decl.name);

    if (value == null) {
      let start = decl.start;

      while (start > 0 && /[ \t]/.test(body[start - 1])) {
        start--;
      }

      if (body[start - 1] === '\n') {
        start--;
      }

      body = body.slice(0, start) + body.slice(decl.end);
      continue;
    }

    body = `${body.slice(0, decl.start)}--${decl.name}: ${String(value).trim()};${body.slice(decl.end)}`;
  }

  const added = [...wanted].filter(([, value]) => value != null);

  if (added.length) {
    const lines = added.map(([name, value]) => `  --${name}: ${String(value).trim()};`).join('\n');
    const tail = body.endsWith('\n') ? '' : '\n';

    body = `${body}${tail}${lines}\n`;
  }

  return text.slice(0, block.open + 1) + body + text.slice(block.close);
}

/** Why a new property's name cannot be saved, or null. */
export function propNameProblem(name, taken) {
  const n = String(name || '').trim();

  if (!n) {
    return 'empty';
  }

  if (!/^[a-z][a-z0-9-]*$/.test(n)) {
    return 'chars';
  }

  if (taken.includes(n)) {
    return 'taken';
  }

  return null;
}

/** Why a value cannot be saved, or null. A value is one declaration, not a block. */
export function propValueProblem(value) {
  const v = String(value || '').trim();

  if (!v) {
    return 'empty';
  }

  if (/[;{}]/.test(v)) {
    return 'chars';
  }

  return null;
}
