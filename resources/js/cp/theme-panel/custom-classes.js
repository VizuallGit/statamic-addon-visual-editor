/**
 * The site's own classes: the `.name { … }` rules in one stylesheet — read,
 * and written back one rule at a time. The Classes tab uses this.
 *
 * The same shape as utilities.js, for the other half of what the tab owns.
 * A rule's body is handed out dedented, the way a designer reads it, and
 * indented back with the rule's own indent on write. Every byte outside the
 * rules that change stays as it is.
 *
 * Only a rule whose whole selector is one class counts: `.btn` is the site's
 * class, `.btn[data-style='primary']` and `.card h2` describe a place and are
 * left where they are. They still render — this module just does not offer
 * them as something to rename or delete.
 */

import { dedent } from './utilities.js';

const CLASS_RULE = /^\.([a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/i;

/**
 * Every top-level single-class rule, in file order: `{ name, body, indent,
 * start, open, close, end }`. Comments and strings are skipped, so a brace
 * inside `content: '}'` does not end a rule.
 */
export function readClasses(css) {
  const text = String(css || '');
  const out = [];
  let i = 0;
  let head = 0;

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

    if (ch === '}') {
      head = i + 1;
      i++;
      continue;
    }

    if (ch === '{') {
      const close = matchBrace(text, i);

      if (close === -1) {
        break;
      }

      const selector = text.slice(head, i).trim();
      const m = CLASS_RULE.exec(selector);

      if (m) {
        const start = head + (text.slice(head, i).length - text.slice(head, i).trimStart().length);

        out.push({
          name: m[1],
          body: dedent(text.slice(i + 1, close)),
          indent: indentOf(text, start),
          start,
          open: i,
          close,
          end: close + 1,
        });
      }

      head = close + 1;
      i = close + 1;
      continue;
    }

    i++;
  }

  return out;
}

/** `{ name: body }` of every class, bodies dedented. */
export function classBodies(css) {
  return new Map(readClasses(css).map((c) => [c.name, c.body]));
}

/**
 * The stylesheet with `changes` applied: `{ name: body }` sets a class's body,
 * `{ name: null }` removes the rule. An existing rule keeps its place and
 * indent; a new one goes at the end of the file.
 */
export function writeClasses(css, changes) {
  let text = String(css || '');
  const wanted = new Map(Object.entries(changes || {}));

  // Back to front, so the offsets of the rules still to come stay true.
  for (const rule of readClasses(text).reverse()) {
    if (!wanted.has(rule.name)) {
      continue;
    }

    const body = wanted.get(rule.name);

    wanted.delete(rule.name);

    if (body === null || body === undefined) {
      text = removeRule(text, rule);
    } else if (dedent(text.slice(rule.open + 1, rule.close)) !== normalize(body)) {
      text = text.slice(0, rule.open + 1) + indentBody(body, rule.indent) + text.slice(rule.close);
    }
  }

  const added = [...wanted].filter(([, body]) => body !== null && body !== undefined);

  if (!added.length) {
    return text;
  }

  // A new rule sits at the left margin, so its body is the one indent in.
  const blocks = added.map(([name, body]) => `.${name} {${indentBody(body, '')}}`).join('\n\n');

  return `${text.replace(/\s*$/, '')}${text.trim() ? '\n\n' : ''}${blocks}\n`;
}

/**
 * Why `name` cannot be a new class, or null: `empty`, `format` (not a class
 * name CSS would read back), `taken` (one of that name already exists).
 */
export function classNameProblem(name, taken = []) {
  const n = String(name || '').trim().replace(/^\./, '');

  if (!n) {
    return 'empty';
  }

  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/i.test(n)) {
    return 'format';
  }

  return taken.includes(n) ? 'taken' : null;
}

/** The rule and the blank line before it, so removing leaves no gap. */
function removeRule(text, rule) {
  let start = rule.start;

  while (start > 0 && /[ \t]/.test(text[start - 1])) {
    start--;
  }

  const before = text.slice(0, start).replace(/\n{2,}$/, '\n\n');
  const after = text.slice(rule.end).replace(/^[ \t]*\n/, '');

  return (before + after).replace(/\n{3,}/g, '\n\n');
}

function indentBody(body, indent) {
  const lines = normalize(body).split('\n');

  if (!lines.some((l) => l.trim())) {
    return '\n';
  }

  return `\n${lines.map((l) => (l.trim() ? indent + '    ' + l : '')).join('\n')}\n${indent}`;
}

function normalize(body) {
  return dedent(String(body || ''));
}

function indentOf(text, at) {
  const lineStart = text.lastIndexOf('\n', at - 1) + 1;

  return /^[ \t]*/.exec(text.slice(lineStart, at))?.[0] || '';
}

function matchBrace(text, open) {
  let depth = 0;

  for (let i = open; i < text.length; i++) {
    const ch = text[i];

    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);

      i = end === -1 ? text.length : end + 1;
      continue;
    }

    if (ch === '"' || ch === "'") {
      i = skipString(text, i) - 1;
      continue;
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;

      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

function skipString(text, i) {
  const quote = text[i];

  for (let j = i + 1; j < text.length; j++) {
    if (text[j] === '\\') {
      j++;
      continue;
    }

    if (text[j] === quote) {
      return j + 1;
    }
  }

  return text.length;
}
