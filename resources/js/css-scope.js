/**
 * Bracket tokens in markup (`class="[ heading ] wrapper"`) are the CSS
 * classes the template dock owns. Tailwind utilities stay out of the CSS pane.
 * The scoped CSS view is the selected token plus descendant tokens, nested.
 */

import { parseHtmlTree } from './html-tree-parse.js';

const CLASS_RE = /^\.[a-zA-Z_][\w-]*$/;

/**
 * The dock's own `[ … ]` run in a class attribute — never Tailwind's.
 *
 * Both use square brackets, and they are told apart by what is in front of the
 * `[`: Tailwind's arbitrary value is always welded to a utility (`bg-[#343434]`,
 * `max-w-[40ch]`, `data-[open]:flex`), while the dock's run stands on its own.
 * So: a `[` at the start of the value or after whitespace, closed by a `]` at
 * the end or before whitespace.
 *
 * This is the same line `tw-parse.js` draws when it tokenises the attribute —
 * there a lone `[` is its own token. Written out here because the CSS side used
 * to match any bracket at all, and then adding a class to
 * `class="bg-[#343434]"` wrote the class *into the colour*.
 *
 * @returns {{ from: number, to: number, innerFrom: number, innerTo: number }|null}
 */
export function bracketRun(value) {
  const text = String(value || '');
  const openRe = /(^|\s)\[/g;
  let m;

  while ((m = openRe.exec(text))) {
    const open = m.index + m[1].length;

    // The first `]` that also stands on its own. A run that never closes that
    // way is not ours — leave it exactly as it is.
    const closeRe = /\](?=\s|$)/g;

    closeRe.lastIndex = open + 1;

    const close = closeRe.exec(text);

    if (close) {
      return { from: open, to: close.index + 1, innerFrom: open + 1, innerTo: close.index };
    }
  }

  return null;
}

function classNamesInBrackets(value) {
  const text = String(value || '');
  const run = bracketRun(text);

  if (!run) {
    return [];
  }

  return text
    .slice(run.innerFrom, run.innerTo)
    .replace(/\{\{[\s\S]*?\}\}/g, ' ')
    .split(/\s+/)
    .filter((name) => /^[a-zA-Z_][\w-]*$/.test(name));
}

export function bracketTokens(openTag) {
  const match = String(openTag || '').match(/\sclass\s*=\s*(["'])([^"']*)\1/i);

  if (!match) {
    return [];
  }

  return classNamesInBrackets(match[2]);
}

export function bracketToken(openTag) {
  return bracketTokens(openTag)[0] || '';
}

/**
 * Class names inside the dock's `[ … ]` run in each class attribute, with
 * source offsets. Tailwind is ignored — both the utilities after the closing
 * `]` and any `bg-[#343434]` that happens to sit before it.
 */
export function bracketClassTokens(html) {
  const source = String(html || '');
  const out = [];
  const attrRe = /\sclass\s*=\s*(["'])/gi;
  let match;

  while ((match = attrRe.exec(source))) {
    const quote = match[1];
    const valueStart = match.index + match[0].length;
    const valueEnd = source.indexOf(quote, valueStart);

    if (valueEnd === -1) {
      break;
    }

    const value = source.slice(valueStart, valueEnd);
    const group = bracketRun(value);

    if (group) {
      const inner = value.slice(group.innerFrom, group.innerTo);
      const innerAbs = valueStart + group.innerFrom;
      const masked = inner.replace(/\{\{[\s\S]*?\}\}/g, (chunk) => ' '.repeat(chunk.length));
      const nameRe = /[a-zA-Z_][\w-]*/g;
      let nameMatch;

      while ((nameMatch = nameRe.exec(masked))) {
        out.push({
          name: nameMatch[0],
          from: innerAbs + nameMatch.index,
          to: innerAbs + nameMatch.index + nameMatch[0].length,
        });
      }
    }

    attrRe.lastIndex = valueEnd + 1;
  }

  return out;
}

export function hitBracketClass(html, pos) {
  return bracketClassTokens(html).find((token) => pos >= token.from && pos <= token.to) || null;
}

export function rewriteBracketClassTokens(html, rewrite) {
  const source = String(html || '');
  const tokens = bracketClassTokens(source);
  let out = source;

  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const token = tokens[i];
    const next = rewrite(token.name);

    if (next === token.name) {
      continue;
    }

    if (!next) {
      let from = token.from;
      let to = token.to;

      if (out[to] === ' ') {
        to += 1;
      } else if (from > 0 && out[from - 1] === ' ') {
        from -= 1;
      }

      out = out.slice(0, from) + out.slice(to);
      continue;
    }

    out = out.slice(0, token.from) + next + out.slice(token.to);
  }

  return out;
}

export function cssClassSelectors(css) {
  const names = [];
  const re = /(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;
  let match;

  while ((match = re.exec(String(css || '')))) {
    names.push(match[2]);
  }

  return names;
}

export function diffBracketNames(prev, next) {
  const renamed = [];
  const added = [];
  const removed = [];
  let i = 0;
  let j = 0;

  while (i < prev.length && j < next.length) {
    if (prev[i] === next[j]) {
      i += 1;
      j += 1;
      continue;
    }

    const prevInNext = next.indexOf(prev[i], j);
    const nextInPrev = prev.indexOf(next[j], i);

    if (prevInNext === -1 && nextInPrev === -1) {
      renamed.push({ from: prev[i], to: next[j] });
      i += 1;
      j += 1;
    } else if (prevInNext === -1) {
      removed.push(prev[i]);
      i += 1;
    } else if (nextInPrev === -1) {
      added.push(next[j]);
      j += 1;
    } else if (prevInNext <= nextInPrev) {
      added.push(next[j]);
      j += 1;
    } else {
      removed.push(prev[i]);
      i += 1;
    }
  }

  while (i < prev.length) {
    removed.push(prev[i]);
    i += 1;
  }

  while (j < next.length) {
    added.push(next[j]);
    j += 1;
  }

  return { renamed, added, removed };
}

export function sanitizeCssClassName(raw) {
  let name = String(raw || '')
    .trim()
    .replace(/^\.+/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  if (!/^[a-zA-Z_]/.test(name)) {
    name = name.replace(/^[^a-zA-Z_]+/, '');
  }

  return CLASS_RE.test(`.${name}`) ? name : '';
}

export function applyBracketClass(openHtml, name) {
  const source = String(openHtml || '');
  const className = sanitizeCssClassName(name);

  if (!source || !className) {
    return source;
  }

  const classMatch = source.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);

  if (classMatch) {
    const quote = classMatch[1];
    let value = classMatch[2];

    const run = bracketRun(value);

    if (run) {
      // Only this run is touched, and only inside it. Everything before and
      // after is left byte for byte — a `bg-[#343434]` sitting next to it is
      // not a second group to be merged in, it is somebody's colour.
      const inner = value.slice(run.innerFrom, run.innerTo).trim();
      const names = classNamesInBrackets(value);
      const next = names.includes(className) ? inner : `${inner} ${className}`.trim();

      value = `${value.slice(0, run.from)}[ ${next} ]${value.slice(run.to)}`;
    } else {
      value = `[ ${className} ] ${value}`.trim();
    }

    return (
      source.slice(0, classMatch.index) +
      ` class=${quote}${value}${quote}` +
      source.slice(classMatch.index + classMatch[0].length)
    );
  }

  if (/\/\s*>$/.test(source)) {
    return source.replace(/(\s*)(\/\s*>)$/, ` class="[ ${className} ]"$1$2`);
  }

  return source.replace(/(\s*)>$/, ` class="[ ${className} ]"$1>`);
}

function openTagOf(html, node) {
  const gt = String(html).indexOf('>', node.from);

  return gt === -1 ? '' : html.slice(node.from, gt + 1);
}

/**
 * The `[ ]` names on the given elements themselves — nothing from inside them.
 *
 * Until v1.1.460 a tag without a name borrowed its children's, and every name
 * found deeper down was nested under the one above it: the pane showed
 * `.icon-group { .icon {…} }` for a `<ul>` whose `.icon` rule was written on
 * its own, and wrote that nesting back into the file. Where a rule is nested
 * is the author's call. A click on an element shows the rules for its own
 * names, with whatever is written inside them, as they stand in the file.
 */
export function tokenTreeFromHtml(html) {
  const out = [];

  for (const node of parseHtmlTree(html)) {
    for (const name of bracketTokens(openTagOf(html, node))) {
      out.push({ className: name });
    }
  }

  return out;
}

function escapeRe(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function skipComment(css, i) {
  if (css.startsWith('/*', i)) {
    const end = css.indexOf('*/', i + 2);

    return end === -1 ? css.length : end + 2;
  }

  return i;
}

export function matchBraces(css, openIdx) {
  let depth = 0;

  for (let i = openIdx; i < css.length; i += 1) {
    if (css.startsWith('/*', i)) {
      i = skipComment(css, i) - 1;
      continue;
    }

    if (css[i] === '{') {
      depth += 1;
    } else if (css[i] === '}') {
      depth -= 1;

      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * The rule for `.name`: the top-level one when the file has it, otherwise the
 * first one nested inside another (`.card { .name {…} }`). The pane shows the
 * rule where it is written, and the write-back lands in that same place.
 */
export function findClassRule(css, name) {
  const source = String(css || '');
  const re = new RegExp(`(^|[^\\w-])\\.${escapeRe(name)}\\s*\\{`, 'g');
  let nested = null;
  let m;

  while ((m = re.exec(source))) {
    const dot = m.index + m[1].length;
    const brace = source.indexOf('{', dot);

    if (brace === -1) {
      continue;
    }

    const close = matchBraces(source, brace);

    if (close === -1) {
      continue;
    }

    const rule = { from: dot, brace, close, to: close + 1, name };

    if (isTopLevelRule(source, rule)) {
      return rule;
    }

    nested = nested || rule;
  }

  return nested;
}

function ruleInner(css, name) {
  const rule = findClassRule(css, name);

  return rule ? String(css).slice(rule.brace + 1, rule.close) : '';
}

/**
 * A rule body as written, moved to one step of indent. Nothing is reordered
 * or dropped: a rule nested inside it (`& .icon {…}`) keeps its place and its
 * own indent below the step.
 */
function reindent(inner, pad) {
  const lines = String(inner || '')
    .replace(/^\s*\n/, '')
    .replace(/\s+$/, '')
    .split('\n');
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^[ \t]*/)[0].length);
  const base = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => (line.trim() ? pad + line.slice(base) : '')).join('\n');
}

function formatRule(css, name) {
  const body = reindent(ruleInner(css, name), '    ');

  return body.trim() ? `.${name} {\n${body}\n}` : `.${name} {\n}`;
}

/** One top-level rule per name, each as the file has it. */
export function buildScopedCss(css, tree) {
  if (!tree?.length) {
    return '';
  }

  return tree.map((node) => formatRule(css, node.className)).join('\n\n') + '\n';
}

export function firstClassName(css) {
  const match = String(css || '').match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);

  return match ? match[1] : '';
}

function leadingIndent(css, from) {
  const lineStart = String(css).lastIndexOf('\n', from - 1) + 1;
  const prefix = css.slice(lineStart, from);

  return /^\s*$/.test(prefix) ? prefix : '';
}

function indentRootBlock(block, indent) {
  if (!indent) {
    return block;
  }

  return block
    .split('\n')
    .map((line, i) => (i === 0 || !line ? line : indent + line))
    .join('\n');
}

function isTopLevelRule(css, rule) {
  let depth = 0;

  for (let i = 0; i < rule.from; i += 1) {
    if (css.startsWith('/*', i)) {
      i = skipComment(css, i) - 1;
      continue;
    }

    if (css[i] === '{') {
      depth += 1;
    } else if (css[i] === '}') {
      depth -= 1;
    }
  }

  return depth === 0;
}

/**
 * The pane's text split at its top-level braces: each rule on its own, with
 * any loose text in front of it (a comment) travelling with it.
 */
function topLevelBlocks(text) {
  const out = [];
  let i = 0;
  let start = 0;

  while (i < text.length) {
    if (text.startsWith('/*', i)) {
      i = skipComment(text, i);
      continue;
    }

    if (text[i] === '{') {
      const close = matchBraces(text, i);

      if (close === -1) {
        break;
      }

      out.push(text.slice(start, close + 1).trim());
      i = close + 1;
      start = i;
      continue;
    }

    i += 1;
  }

  const rest = text.slice(start).trim();

  if (rest) {
    out.push(rest);
  }

  return out;
}

/**
 * Write the pane's text back into the file.
 *
 * The pane holds one top-level rule per `[ ]` name on the picked element, as
 * written. Each goes back over the file's rule of that name — where that rule
 * stands, nested or not — or to the end of the file when it has none. Rules
 * written inside one (`& .icon {…}`) travel with it; a rule of the same name
 * elsewhere in the file is not the pane's and is left alone. (Until v1.1.460
 * this unnested by markup: every name found inside the block had its own
 * top-level rule deleted.)
 *
 * Text that does not open with `.root {` — declarations typed loose — is the
 * root's body.
 */
export function mergeScopedCss(cssFull, scopedText, rootName) {
  const root = firstClassName(scopedText) || rootName;

  if (!root) {
    return String(cssFull || '');
  }

  let text = String(scopedText || '').trim();

  if (!text) {
    text = `.${root} {\n}`;
  } else if (!new RegExp(`^\\.${escapeRe(root)}\\s*\\{`).test(text)) {
    text = `.${root} {\n${text}\n}`;
  }

  let next = String(cssFull || '');

  for (const block of topLevelBlocks(text)) {
    const name = firstClassName(block.replace(/\/\*[\s\S]*?\*\//g, ''));
    const existing = name ? findClassRule(next, name) : null;

    if (existing) {
      const indent = leadingIndent(next, existing.from);
      next = next.slice(0, existing.from) + indentRootBlock(block, indent) + next.slice(existing.to);
    } else {
      next = `${next.trimEnd()}${next.trim() ? '\n' : ''}${block}\n`;
    }
  }

  return next;
}

function appendEmptyClass(css, name) {
  const source = String(css || '');

  return `${source.trimEnd()}${source.trim() ? '\n' : ''}.${name} {\n}\n`;
}

/**
 * Put declarations into the rule for `name`: into the rule the file has, or
 * into a new one at the end. A line the rule already holds is not written
 * twice. For bringing a class's rules in from where the site already defines
 * it — the name was taken, and now the file says what the site says.
 */
export function fillClassRule(css, name, body) {
  const source = String(css || '');
  const norm = (line) => line.trim().replace(/;$/, '').replace(/\s+/g, ' ');
  const lines = String(body || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.endsWith(';') || line.endsWith('}') ? line : `${line};`));

  if (!lines.length) {
    return source;
  }

  const rule = findClassRule(source, name);

  if (!rule) {
    return `${source.trimEnd()}${source.trim() ? '\n\n' : ''}.${name} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}\n`;
  }

  const inner = source.slice(rule.brace + 1, rule.close);
  const have = new Set(inner.split(/[;\n]/).map(norm).filter(Boolean));
  const fresh = lines.filter((line) => !have.has(norm(line)));

  if (!fresh.length) {
    return source;
  }

  const closeIndent = (source.slice(0, rule.close).match(/\n([ \t]*)$/) || [null, ''])[1];
  // One step in from the rule's own line, unless the rule already shows its step.
  const indent = (inner.match(/\n([ \t]+)\S/) || [])[1] || `${closeIndent}  `;
  // First in the rule: what the site says comes first, and what this file
  // says after it wins — and a rule nested in here belongs after the
  // declarations.
  const kept = inner.replace(/^\s*\n/, '').replace(/\s+$/, '');
  const rest = kept ? `\n${kept}` : '';

  return `${source.slice(0, rule.brace + 1)}\n${fresh.map((line) => `${indent}${line}`).join('\n')}${rest}\n${closeIndent}${source.slice(rule.close)}`;
}

export function renameCssClass(css, from, to) {
  const next = sanitizeCssClassName(to);

  if (!from || !next || from === next) {
    return String(css || '');
  }

  if (findClassRule(css, next)) {
    return removeCssClassRule(css, from);
  }

  return String(css || '').replace(
    new RegExp(`(^|[^\\w-])\\.${escapeRe(from)}(\\s*\\{)`, 'g'),
    `$1.${next}$2`,
  );
}

export function removeCssClassRule(css, name) {
  let next = String(css || '');

  for (;;) {
    const rule = findClassRule(next, name);

    if (!rule) {
      break;
    }

    let from = rule.from;
    const lineStart = next.lastIndexOf('\n', from - 1) + 1;

    if (/^\s*$/.test(next.slice(lineStart, from))) {
      from = lineStart;
    }

    let to = rule.to;

    if (next[to] === '\n') {
      to += 1;
    }

    next = next.slice(0, from) + next.slice(to);
  }

  return next;
}

/**
 * Keep CSS class rules in lockstep with `[ … ]` tokens in HTML.
 * Names that were never in the previous token list are left alone.
 */
export function syncCssWithBrackets(css, prevNames, nextNames) {
  const prev = Array.isArray(prevNames) ? prevNames : [];
  const next = Array.isArray(nextNames) ? nextNames : [];
  const { renamed, added } = diffBracketNames(prev, next);
  const nextSet = new Set(next);
  let out = String(css || '');

  for (const pair of renamed) {
    const name = sanitizeCssClassName(pair.to);

    if (!name) {
      continue;
    }

    if (nextSet.has(pair.from)) {
      if (!findClassRule(out, name)) {
        out = appendEmptyClass(out, name);
      }

      continue;
    }

    if (findClassRule(out, pair.from)) {
      out = renameCssClass(out, pair.from, name);
    } else if (!findClassRule(out, name)) {
      out = appendEmptyClass(out, name);
    }
  }

  for (const raw of added) {
    const name = sanitizeCssClassName(raw);

    if (!name || findClassRule(out, name)) {
      continue;
    }

    out = appendEmptyClass(out, name);
  }

  return out;
}

/**
 * A `[ name ]` taken off its tag leaves the name's CSS where it is. Only the
 * blank rule the bracket sync itself wrote (`.name {\n}`) goes with it: that
 * was a door held open, not something written. Rules with declarations stay
 * in the file, out of the pane's view, until the name is used again or the
 * whole-file view deletes them for good. (Until v1.1.440 the whole rule went
 * the moment the token did — removing a class from markup destroyed its CSS.)
 */
export function pruneBracketCss(css, nextNames, prevNames) {
  const nextSet = new Set(Array.isArray(nextNames) ? nextNames : []);
  const prevSet = new Set(Array.isArray(prevNames) ? prevNames : []);
  let out = String(css || '');

  for (const name of prevSet) {
    if (nextSet.has(name)) {
      continue;
    }

    out = removeBlankCssClassRule(out, name);
  }

  return out;
}

/** Remove `.name { }` only where its body is blank; a rule with content is left alone. */
export function removeBlankCssClassRule(css, name) {
  let next = String(css || '');
  let searchFrom = 0;

  for (;;) {
    const rule = findClassRule(next.slice(searchFrom), name);

    if (!rule) {
      break;
    }

    const from = searchFrom + rule.from;
    const brace = searchFrom + rule.brace;
    const close = searchFrom + rule.close;

    if (next.slice(brace + 1, close).trim() !== '') {
      searchFrom = close + 1;

      continue;
    }

    let start = from;
    const lineStart = next.lastIndexOf('\n', start - 1) + 1;

    if (/^\s*$/.test(next.slice(lineStart, start))) {
      start = lineStart;
    }

    let to = close + 1;

    if (next[to] === '\n') {
      to += 1;
    }

    next = next.slice(0, start) + next.slice(to);
    searchFrom = start;
  }

  return next;
}
