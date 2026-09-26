/**
 * Named tokens in the site's site.css `@theme` — read, and write one value at
 * a time. The spacing, typography and button tabs use this; colors have their
 * own family-aware writer in palette.js.
 *
 * Pure functions, no DOM. Only the lines of the tokens that change are
 * rewritten; every other line stays byte for byte.
 */

const THEME_BLOCK = /@theme\b[^{]*\{([^}]*)\}/g;

const DECL = /^(\s*)--([\w-]+)\s*:\s*(.+?)\s*;\s*$/;

/** Every `--name: value;` in the `@theme` blocks, name (without `--`) => value, in file order. */
export function readTokens(css) {
  const tokens = new Map();

  for (const m of String(css || '').matchAll(THEME_BLOCK)) {
    for (const line of m[1].split('\n')) {
      const d = DECL.exec(line);

      if (d) {
        tokens.set(d[2], d[3]);
      }
    }
  }

  return tokens;
}

/** `size-1100` → ['size', 1100]; a name without a number sorts as its own. */
function sortKey(name) {
  const m = /^(.*)-(\d+)$/.exec(name);

  return m ? [m[1], Number(m[2])] : [name, -1];
}

/** The group a new token joins: `size-1300` → `size-`, `button-radius` → `button-`. */
function groupOf(name) {
  return name.replace(/-[^-]+$/, '-');
}

/**
 * site.css with `changes` applied: `{ name: value }` sets a token, `{ name:
 * null }` removes it. An existing token is rewritten in place. A new one goes
 * next to its group (`size-1300` after the last size before it in number
 * order); a token with no group yet goes after the last line of the first
 * `@theme` block.
 */
export function writeTokens(css, changes) {
  const text = String(css || '');
  const first = THEME_BLOCK.exec(text);

  THEME_BLOCK.lastIndex = 0;

  if (!first) {
    return text;
  }

  const wanted = new Map(Object.entries(changes || {}));
  const blocks = [...text.matchAll(THEME_BLOCK)].map((m) => {
    const start = m.index + m[0].indexOf('{') + 1;

    return { start, end: start + m[1].length, body: m[1] };
  });
  let out = text;

  for (const block of [...blocks].reverse()) {
    const next = rewrite(block.body, wanted, block === blocks[0]);

    out = out.slice(0, block.start) + next + out.slice(block.end);
  }

  return out;
}

function rewrite(body, wanted, home) {
  const lines = body.split('\n');
  const kept = [];
  let indent = '    ';

  for (const line of lines) {
    const d = DECL.exec(line);

    if (d && wanted.has(d[2])) {
      const value = wanted.get(d[2]);

      wanted.delete(d[2]);

      if (value === null || value === undefined) {
        continue;
      }

      kept.push(String(value).trim() === d[3] ? line : `${d[1]}--${d[2]}: ${String(value).trim()};`);
      indent = d[1];
      continue;
    }

    if (d) {
      indent = d[1];
    }

    kept.push(line);
  }

  if (!home) {
    return kept.join('\n');
  }

  for (const [name, value] of wanted) {
    if (value === null || value === undefined) {
      continue;
    }

    const group = groupOf(name);
    const [base, n] = sortKey(name);
    // After the last of its own kind with a smaller number (`spacing-1300`
    // after `spacing-1200`); else before the first with a larger one; else
    // after the group's last line; else after the block's last declaration.
    let afterSmaller = -1;
    let firstLarger = -1;
    let lastOfGroup = -1;

    kept.forEach((line, i) => {
      const d = DECL.exec(line);

      if (!d || groupOf(d[2]) !== group) {
        return;
      }

      const [b, m] = sortKey(d[2]);

      lastOfGroup = i;

      if (b === base && m < n) {
        afterSmaller = i;
      } else if (b === base && m > n && firstLarger === -1) {
        firstLarger = i;
      }
    });

    let at = afterSmaller;

    if (at === -1 && firstLarger !== -1) {
      at = firstLarger - 1;
    } else if (at === -1 && lastOfGroup !== -1) {
      at = lastOfGroup;
    } else if (at === -1) {
      at = kept.map((line) => DECL.test(line)).lastIndexOf(true);
    }

    kept.splice(at + 1, 0, `${indent}--${name}: ${String(value).trim()};`);
  }

  return kept.join('\n');
}

/**
 * What a token's value resolves to, following `var(--x)` through the other
 * tokens: `var(--leading-normal)` → `1.5`. Unknown variables come back as is.
 */
export function resolveToken(value, tokens, depth = 0) {
  const m = /^var\(\s*--([\w-]+)\s*\)$/.exec(String(value || '').trim());

  if (!m || depth > 8 || !tokens.has(m[1])) {
    return value;
  }

  return resolveToken(tokens.get(m[1]), tokens, depth + 1);
}
