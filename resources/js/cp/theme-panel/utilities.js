/**
 * The site's own utilities: the `@utility name { … }` blocks in site.css —
 * read, and written back one block at a time. The Utilities tab uses this.
 *
 * Pure functions, no DOM. A block's body is handed out dedented, the way a
 * designer reads it, and indented back with the block's own indent on write.
 * Every byte outside the blocks that change stays as it is.
 */

/**
 * Every top-level `@utility` block, in file order: `{ name, body, indent,
 * start, open, close, end }`. `open`/`close` are the braces' offsets,
 * `start`/`end` the whole block's. Comments and strings are skipped, so a
 * brace inside `content: '}'` does not end a block.
 */
export function readUtilities(css) {
  const text = String(css || '');
  const out = [];
  let depth = 0;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '/' && text[i + 1] === '*') {
      const endComment = text.indexOf('*/', i + 2);

      i = endComment === -1 ? text.length : endComment + 2;
      continue;
    }

    if (ch === '"' || ch === "'") {
      i = skipString(text, i);
      continue;
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
    } else if (depth === 0 && ch === '@' && /^@utility\b/.test(text.slice(i, i + 9))) {
      const block = blockAt(text, i);

      if (block) {
        out.push(block);
        i = block.end;
        continue;
      }
    }

    i++;
  }

  return out;
}

/** `{ name: body }` of every utility, bodies dedented. */
export function utilityBodies(css) {
  return new Map(readUtilities(css).map((u) => [u.name, u.body]));
}

/**
 * site.css with `changes` applied: `{ name: body }` sets a utility's body,
 * `{ name: null }` removes the block. An existing block keeps its place and
 * indent; a new one goes after the last `@utility` (or at the end of the file).
 */
export function writeUtilities(css, changes) {
  let text = String(css || '');
  const wanted = new Map(Object.entries(changes || {}));

  // Back to front, so the offsets of the blocks still to come stay true.
  for (const block of readUtilities(text).reverse()) {
    if (!wanted.has(block.name)) {
      continue;
    }

    const body = wanted.get(block.name);

    wanted.delete(block.name);

    if (body === null || body === undefined) {
      text = removeBlock(text, block);
    } else if (dedent(text.slice(block.open + 1, block.close)) !== normalize(body)) {
      text = text.slice(0, block.open + 1) + indentBody(body, block.indent) + text.slice(block.close);
    }
  }

  const added = [...wanted].filter(([, body]) => body !== null && body !== undefined);

  if (!added.length) {
    return text;
  }

  const last = readUtilities(text).pop();
  const indent = last?.indent || '    ';
  const blocks = added.map(([name, body]) => `@utility ${name} {${indentBody(body, indent)}}`).join('\n\n');

  if (last) {
    return `${text.slice(0, last.end)}\n\n${blocks}${text.slice(last.end)}`;
  }

  return `${text.replace(/\s*$/, '')}\n\n${blocks}\n`;
}

/**
 * Why `name` cannot be a new utility, or null: `format` (a class name Tailwind
 * would read as something else), `taken` (a utility of that name exists).
 */
export function utilityNameProblem(name, taken = []) {
  const n = String(name || '').trim();

  if (!n) {
    return 'empty';
  }

  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(n)) {
    return 'format';
  }

  return taken.includes(n) ? 'taken' : null;
}

/**
 * Why `body` cannot be saved, or null: `braces` when its `{ }` do not pair up
 * (outside strings and comments) — written into site.css, the block would
 * swallow or cut off whatever comes after it.
 */
export function bodyProblem(body) {
  const text = String(body || '');
  let depth = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '/' && text[i + 1] === '*') {
      const endComment = text.indexOf('*/', i + 2);

      if (endComment === -1) {
        return 'braces';
      }

      i = endComment + 1;
    } else if (ch === '"' || ch === "'") {
      const end = skipString(text, i);

      if (end > text.length) {
        return 'braces';
      }

      i = end - 1;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}' && --depth < 0) {
      return 'braces';
    }
  }

  return depth === 0 ? null : 'braces';
}

/** The properties a body sets at its top level, for the list: `padding, background-color`. */
export function bodyProperties(body) {
  const names = [];
  let depth = 0;

  for (const line of String(body || '').split('\n')) {
    const trimmed = line.trim();
    const m = depth === 0 ? /^(-{0,2}[a-zA-Z][\w-]*)\s*:(?!:)/.exec(trimmed) : null;

    if (m && !trimmed.includes('{')) {
      names.push(m[1]);
    }

    depth += (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
    depth = Math.max(0, depth);
  }

  return [...new Set(names)];
}

/**
 * What Tailwind needs from a draft of site.css: its `@theme` blocks, then its
 * `@utility` blocks — the same text the server's TailwindTheme::css() hands
 * the dock's compiler for the saved file.
 */
export function compilerCss(css) {
  const text = String(css || '');
  const themes = [...text.matchAll(/@theme\b[^{]*\{[^}]*\}/g)].map((m) => m[0].trim());
  const utilities = readUtilities(text).map((u) => text.slice(u.start, u.end).trim());

  return [...themes, ...utilities].join('\n\n');
}

/** A body as the tab shows it: no blank edge lines, the common indent gone. */
export function dedent(raw) {
  const lines = String(raw || '').replace(/\r\n?/g, '\n').split('\n');

  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }

  while (lines.length && !lines[lines.length - 1].trim()) {
    lines.pop();
  }

  const indents = lines.filter((l) => l.trim()).map((l) => /^[ \t]*/.exec(l)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;

  return lines.map((l) => (l.trim() ? l.slice(cut).replace(/\s+$/, '') : '')).join('\n');
}

function normalize(body) {
  return dedent(body);
}

/** A dedented body back inside braces: one line per line, `indent` in front. */
function indentBody(body, indent) {
  const lines = normalize(body).split('\n');

  if (lines.length === 1 && !lines[0]) {
    return '\n';
  }

  return `\n${lines.map((l) => (l ? indent + l : '')).join('\n')}\n`;
}

function blockAt(text, start) {
  const open = text.indexOf('{', start);

  if (open === -1) {
    return null;
  }

  const name = text.slice(start + '@utility'.length, open).trim();

  if (!name || /[;{}]/.test(name)) {
    return null;
  }

  let depth = 0;

  for (let i = open; i < text.length; i++) {
    const ch = text[i];

    if (ch === '/' && text[i + 1] === '*') {
      const endComment = text.indexOf('*/', i + 2);

      i = endComment === -1 ? text.length : endComment + 1;
      continue;
    }

    if (ch === '"' || ch === "'") {
      i = skipString(text, i) - 1;
      continue;
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}' && --depth === 0) {
      const raw = text.slice(open + 1, i);
      const firstLine = raw.split('\n').find((l) => l.trim());

      return {
        name,
        body: dedent(raw),
        indent: firstLine ? /^[ \t]*/.exec(firstLine)[0] || '    ' : '    ',
        start,
        open,
        close: i,
        end: i + 1,
      };
    }
  }

  return null;
}

/** The offset just after the string that opens at `i`. */
function skipString(text, i) {
  const quote = text[i];
  let j = i + 1;

  while (j < text.length && text[j] !== quote) {
    j += text[j] === '\\' ? 2 : 1;
  }

  return j + 1;
}

/** The block out, with the blank line in front of it, so no gap is left. */
function removeBlock(text, block) {
  let from = block.start;
  let to = block.end;

  while (from > 0 && /[ \t]/.test(text[from - 1])) {
    from--;
  }

  while (to < text.length && /[ \t]/.test(text[to])) {
    to++;
  }

  if (text[to] === '\n') {
    to++;
  }

  // One blank line before the block goes with it.
  if (text.slice(from - 2, from) === '\n\n') {
    from--;
  }

  return text.slice(0, from) + text.slice(to);
}
