/**
 * A CSS snippet is the body of one rule — declarations and nested `&…` /
 * `@media` blocks — with no selector around it. Two questions about that:
 *
 *   snippetBodyFrom(text)       What the CSS pane offers to save, as a body.
 *                               One whole rule gives its inside; declarations
 *                               and nested blocks are taken as they are;
 *                               anything else is refused, with a reason.
 *   mergeSnippetIntoBody(...)   The body written into a rule's inside. The
 *                               snippet wins: a property the rule already has
 *                               takes the snippet's value, a nested block with
 *                               the same selector is merged the same way,
 *                               property by property. Nothing else moves.
 *
 * Pure functions, no DOM. Same brace reading as css-scope.js (comments are
 * skipped; Antlers is not expected inside a class rule), so what this finds
 * is what the pane's own write-back finds.
 */
import { cssBalanced, matchBraces } from './css-scope.js';

const STEP = '    ';

function skipComment(text, i) {
  if (text.startsWith('/*', i)) {
    const end = text.indexOf('*/', i + 2);

    return end === -1 ? text.length : end + 2;
  }

  return i;
}

function withoutComments(text) {
  return String(text || '').replace(/\/\*[\s\S]*?\*\//g, '');
}

/** No blank edge lines, the common indent gone, no trailing spaces. */
export function dedentBody(raw) {
  const lines = String(raw || '').replace(/\r\n?/g, '\n').split('\n');

  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }

  while (lines.length && !lines[lines.length - 1].trim()) {
    lines.pop();
  }

  const indents = lines.filter((line) => line.trim()).map((line) => /^[ \t]*/.exec(line)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => (line.trim() ? line.slice(cut).replace(/\s+$/, '') : '')).join('\n');
}

function indentLines(text, indent) {
  return dedentBody(text)
    .split('\n')
    .map((line) => (line ? indent + line : ''))
    .join('\n');
}

/**
 * The items of a body, in order: `{ kind: 'decl', prop, value, from, to }`
 * for `prop: value;` (the `;` inside `to` when it is there), `{ kind: 'block',
 * prelude, from, open, close, to }` for `prelude { … }`, and `{ kind: 'other' }`
 * for a chunk that is neither (a stray word). Comments are not items; they
 * stay where they are because nothing here moves text it did not write.
 */
export function parseBody(text) {
  const source = String(text || '');
  const items = [];
  let i = 0;
  let chunkStart = 0;

  const chunkItem = (from, to, semicolon) => {
    const raw = source.slice(from, to);
    const bare = withoutComments(raw);

    if (!bare.trim()) {
      return;
    }

    const lead = raw.length - raw.replace(/^[\s]*(?:\/\*[\s\S]*?\*\/\s*)*/, '').length;
    const start = from + lead;
    const colon = bare.indexOf(':');
    const prop = colon === -1 ? '' : bare.slice(0, colon).trim();

    if (/^-{0,2}[a-zA-Z_][\w-]*$/.test(prop)) {
      items.push({
        kind: 'decl',
        prop,
        value: bare.slice(colon + 1).trim(),
        from: start,
        to: semicolon ? to + 1 : to,
      });

      return;
    }

    items.push({ kind: 'other', from: start, to: semicolon ? to + 1 : to });
  };

  while (i < source.length) {
    const skipped = skipComment(source, i);

    if (skipped !== i) {
      i = skipped;
      continue;
    }

    const ch = source[i];

    if (ch === '"' || ch === "'") {
      let j = i + 1;

      while (j < source.length && source[j] !== ch) {
        j += source[j] === '\\' ? 2 : 1;
      }

      i = j + 1;
      continue;
    }

    if (ch === ';') {
      chunkItem(chunkStart, i, true);
      i += 1;
      chunkStart = i;
      continue;
    }

    if (ch === '{') {
      const close = matchBraces(source, i);

      if (close === -1) {
        break;
      }

      const raw = source.slice(chunkStart, i);
      const lead = raw.length - raw.replace(/^[\s]*(?:\/\*[\s\S]*?\*\/\s*)*/, '').length;

      items.push({
        kind: 'block',
        prelude: withoutComments(raw).trim().replace(/\s+/g, ' '),
        from: chunkStart + lead,
        open: i,
        close,
        to: close + 1,
      });
      i = close + 1;
      chunkStart = i;
      continue;
    }

    i += 1;
  }

  // The last declaration may go without its `;`.
  chunkItem(chunkStart, source.length, false);

  return items;
}

/** A prelude that belongs inside a body: a nested `&…` rule or an at-rule. */
function isBodyBlock(prelude) {
  return /^[&@]/.test(prelude);
}

/**
 * What the pane's text is as a snippet body.
 *
 * - One whole rule (`.x { … }`, `h2 { … }`): its inside.
 * - Declarations, `&…` rules and at-rules, any mix: as written.
 * - Anything else — two rules, a rule beside loose declarations, text that
 *   does not close its braces: refused, and the reason says which.
 *
 * @returns {{ body: string } | { problem: 'empty' | 'unbalanced' | 'rules' }}
 */
export function snippetBodyFrom(text) {
  const source = String(text || '');

  if (!withoutComments(source).trim()) {
    return { problem: 'empty' };
  }

  if (!cssBalanced(source)) {
    return { problem: 'unbalanced' };
  }

  const items = parseBody(source);
  const blocks = items.filter((item) => item.kind === 'block');
  const loose = items.some((item) => item.kind !== 'block');
  const wrappers = blocks.filter((block) => !isBodyBlock(block.prelude));

  if (!wrappers.length) {
    return { body: dedentBody(source) };
  }

  if (wrappers.length === 1 && blocks.length === 1 && !loose) {
    const [rule] = wrappers;

    return { body: dedentBody(source.slice(rule.open + 1, rule.close)) };
  }

  return { problem: 'rules' };
}

function sameProp(a, b) {
  return a.startsWith('--') || b.startsWith('--') ? a === b : a.toLowerCase() === b.toLowerCase();
}

function samePrelude(a, b) {
  const norm = (p) => p.replace(/\s+/g, '').toLowerCase();

  return norm(a) === norm(b);
}

/** The whitespace at the start of the line `pos` sits on. */
function lineIndentAt(text, pos) {
  const start = text.lastIndexOf('\n', pos - 1) + 1;

  return (text.slice(start, pos).match(/^[ \t]*/) || [''])[0];
}

/**
 * The indent the body's lines use, read from the first line that has one;
 * one step in from the rule's own line when the body is empty.
 */
function bodyIndent(inner, items, parentIndent) {
  for (const item of items) {
    const indent = lineIndentAt(inner, item.from);

    if (inner.lastIndexOf('\n', item.from - 1) !== -1 && indent.length > parentIndent.length) {
      return indent;
    }
  }

  return parentIndent + STEP;
}

/**
 * `snippet` written into `inner`, the text between a rule's braces.
 *
 * Declarations the rule already has take the snippet's value in place.
 * New declarations go after the rule's last top-level declaration — before
 * its nested blocks — or at the top of an empty rule. A nested block whose
 * selector the rule already has (`&:hover`, `&::-webkit-scrollbar`,
 * `@media (width < 64em)`, whitespace aside) is merged the same way, inside;
 * a new one goes at the end of the rule. Comments and everything else stay
 * byte for byte; the closing brace keeps its own line.
 *
 * `parentIndent` is the indent of the line the rule's selector is on, so a
 * body written into an empty rule lines up with the file.
 *
 * @returns {string} the new inner text
 */
export function mergeSnippetIntoBody(inner, snippet, { parentIndent = '' } = {}) {
  const text = String(inner || '');
  const have = parseBody(text);
  const want = parseBody(String(snippet || ''));
  const indent = bodyIndent(text, have, parentIndent);
  // One step deeper, in the file's own width when the body shows it.
  const step = indent.length > parentIndent.length ? indent.slice(parentIndent.length) : STEP;
  const edits = [];
  const newDecls = [];
  const newBlocks = [];

  for (const item of want) {
    if (item.kind === 'decl') {
      const match = have.find((it) => it.kind === 'decl' && sameProp(it.prop, item.prop));

      if (match) {
        edits.push({ from: match.from, to: match.to, insert: `${item.prop}: ${item.value};` });
      } else {
        newDecls.push(`${item.prop}: ${item.value};`);
      }

      continue;
    }

    if (item.kind === 'block') {
      const match = have.find((it) => it.kind === 'block' && samePrelude(it.prelude, item.prelude));
      const itemInner = String(snippet).slice(item.open + 1, item.close);

      if (match) {
        edits.push({
          from: match.open + 1,
          to: match.close,
          insert: mergeSnippetIntoBody(text.slice(match.open + 1, match.close), itemInner, {
            parentIndent: lineIndentAt(text, match.from),
          }),
        });
      } else {
        newBlocks.push(`${item.prelude} {\n${indentLines(itemInner, indent + step)}\n${indent}}`);
      }
    }
  }

  if (!edits.length && !newDecls.length && !newBlocks.length) {
    return text;
  }

  // Where new declarations go: after the last top-level declaration, else in
  // front of the first block, else at the top of the body.
  const lastDecl = [...have].reverse().find((it) => it.kind === 'decl');
  const firstBlock = have.find((it) => it.kind === 'block');
  // Where new blocks go: after the last item of any kind.
  const last = have[have.length - 1];

  const lines = newDecls.map((line) => `\n${indent}${line}`).join('');
  const blocks = newBlocks.map((block) => `\n\n${indent}${block}`).join('');

  if (!last) {
    // An empty body: everything in one piece, declarations first.
    edits.push({ from: 0, to: 0, insert: lines ? lines + blocks : blocks.slice(1) });
  } else {
    if (lines) {
      if (lastDecl) {
        edits.push({ from: lastDecl.to, to: lastDecl.to, insert: lines });
      } else {
        const first = firstBlock || have[0];
        const at = text.lastIndexOf('\n', first.from - 1) + 1;

        edits.push({ from: at, to: at, insert: `${lines.slice(1)}\n\n` });
      }
    }

    if (blocks) {
      edits.push({ from: last.to, to: last.to, insert: blocks });
    }
  }

  // Back to front, so the offsets of the edits still to come stay true.
  edits.sort((a, b) => b.from - a.from || b.to - a.to);

  let out = text;

  for (const edit of edits) {
    out = out.slice(0, edit.from) + edit.insert + out.slice(edit.to);
  }

  // The closing brace on its own line, indented like the rule's selector.
  const tail = out.match(/\n[ \t]*$/) ? out.replace(/\s+$/, '') : out.replace(/[ \t]+$/, '');

  return `${tail}\n${parentIndent}`;
}

/**
 * A body wrapped for where the pane is looking: inside `&:state { … }` when a
 * state is picked, inside `@media … { … }` when a size is, both when both.
 * Written as nested text and merged like any other block, so an existing
 * block is found by its selector and a missing one is made.
 */
export function wrapSnippetBody(body, { state = '', media = '' } = {}) {
  let out = dedentBody(body);

  if (state) {
    out = `&${state} {\n${indentLines(out, STEP)}\n}`;
  }

  if (media) {
    out = `@media ${media} {\n${indentLines(out, STEP)}\n}`;
  }

  return out;
}
