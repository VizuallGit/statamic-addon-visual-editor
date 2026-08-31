/**
 * Bracket tokens in markup (`class="[ heading ] wrapper"`) are the CSS
 * classes the template dock owns. Tailwind utilities stay out of the CSS pane.
 * The scoped CSS view is the selected token plus descendant tokens, nested.
 */

import { parseHtmlTree } from './html-tree-parse.js';

const CLASS_RE = /^\.[a-zA-Z_][\w-]*$/;

function classNamesInBrackets(value) {
  const inner = String(value || '').match(/\[\s*([\s\S]*?)\s*\]/);

  if (!inner) {
    return [];
  }

  return inner[1]
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
 * Class names inside the first `[ … ]` of each class attribute, with
 * source offsets. Tailwind after the closing `]` is ignored.
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
    const group = value.match(/\[([\s\S]*?)\]/);

    if (group) {
      const inner = group[1];
      const innerAbs = valueStart + group.index + 1;
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

    const groups = [...value.matchAll(/\[([\s\S]*?)\]/g)];

    if (groups.length) {
      const inner = groups.map((group) => group[1].trim()).filter(Boolean).join(' ');
      const names = classNamesInBrackets(`[ ${inner} ]`);
      const next = names.includes(className) ? inner : `${inner} ${className}`.trim();
      const from = value.indexOf('[');
      const to = value.lastIndexOf(']');

      value = `${value.slice(0, from)}[ ${next} ]${value.slice(to + 1)}`.replace(/\s+/g, ' ').trim();
    } else {
      value = `[ ${className} ] ${value}`.replace(/\s+/g, ' ').trim();
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

function walkTokens(html, nodes) {
  const out = [];

  for (const node of nodes) {
    const tokens = bracketTokens(openTagOf(html, node));
    const children = walkTokens(html, node.children || []);

    if (tokens.length) {
      out.push({ className: tokens[0], children });

      for (const extra of tokens.slice(1)) {
        out.push({ className: extra, children: [] });
      }
    } else {
      out.push(...children);
    }
  }

  return out;
}

export function tokenTreeFromHtml(html) {
  return walkTokens(html, parseHtmlTree(html));
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

export function findClassRule(css, name) {
  const source = String(css || '');
  const re = new RegExp(`(^|[^\\w-])\\.${escapeRe(name)}\\s*\\{`, 'g');
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

    return { from: dot, brace, close, to: close + 1, name };
  }

  return null;
}

function parseBody(body) {
  const source = String(body || '');
  const decls = [];
  const classes = {};
  const other = [];
  let i = 0;
  let buf = '';

  const flushDecls = () => {
    const text = buf.trim();

    if (text) {
      decls.push(text);
    }

    buf = '';
  };

  while (i < source.length) {
    if (source.startsWith('/*', i)) {
      const next = skipComment(source, i);
      buf += source.slice(i, next);
      i = next;
      continue;
    }

    if (source[i] === '{') {
      const selector = buf.trim();
      const close = matchBraces(source, i);

      if (close === -1) {
        break;
      }

      const inner = source.slice(i + 1, close);
      buf = '';

      if (CLASS_RE.test(selector)) {
        classes[selector.slice(1)] = inner;
      } else if (selector) {
        other.push(`${selector} {${inner}}`);
      }

      i = close + 1;
      continue;
    }

    buf += source[i];
    i += 1;
  }

  flushDecls();

  return { decls: decls.join('\n'), classes, other };
}

function indentBlock(text, depth) {
  const pad = '    '.repeat(depth);

  return String(text || '')
    .split('\n')
    .map((line) => (line.trim() ? pad + line.trim() : ''))
    .filter((line, i, all) => line || (i > 0 && i < all.length - 1))
    .join('\n');
}

function ruleInner(css, name) {
  const rule = findClassRule(css, name);

  return rule ? String(css).slice(rule.brace + 1, rule.close) : '';
}

function formatNode(node, css, depth) {
  const parsed = parseBody(ruleInner(css, node.className));
  const pad = '    '.repeat(depth);
  const lines = [];

  if (parsed.decls) {
    lines.push(indentBlock(parsed.decls.replace(/;+\s*$/, ';'), depth + 1));
  }

  for (const chunk of parsed.other) {
    lines.push(indentBlock(chunk, depth + 1));
  }

  for (const child of node.children) {
    lines.push(formatNode(child, css, depth + 1));
  }

  const inner = lines.filter(Boolean).join('\n');

  if (!inner) {
    return `${pad}.${node.className} {\n${pad}}`;
  }

  return `${pad}.${node.className} {\n${inner}\n${pad}}`;
}

export function buildScopedCss(css, tree) {
  if (!tree?.length) {
    return '';
  }

  return tree.map((node) => formatNode(node, css, 0)).join('\n\n') + '\n';
}

export function firstClassName(css) {
  const match = String(css || '').match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);

  return match ? match[1] : '';
}

function nestedClassNames(css) {
  const names = [];
  const re = /\.([a-zA-Z_][\w-]*)\s*\{/g;
  let m;
  let first = true;

  while ((m = re.exec(String(css || '')))) {
    if (first) {
      first = false;
      continue;
    }

    names.push(m[1]);
  }

  return names;
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

export function mergeScopedCss(cssFull, scopedText, rootName) {
  const root = firstClassName(scopedText) || rootName;

  if (!root) {
    return String(cssFull || '');
  }

  let block = String(scopedText || '').trim();

  if (!block) {
    block = `.${root} {\n}`;
  } else if (!new RegExp(`^\\.${escapeRe(root)}\\s*\\{`).test(block)) {
    block = `.${root} {\n${block}\n}`;
  }

  let next = String(cssFull || '');
  const existing = findClassRule(next, root);
  const nested = nestedClassNames(block);

  if (existing) {
    const indent = leadingIndent(next, existing.from);
    next = next.slice(0, existing.from) + indentRootBlock(block, indent) + next.slice(existing.to);
  } else {
    next = `${next.trimEnd()}${next.trim() ? '\n' : ''}${block}\n`;
  }

  const kept = findClassRule(next, root);

  if (!kept) {
    return next;
  }

  for (const name of [...new Set(nested)].reverse()) {
    const re = new RegExp(`(^|[^\\w-])\\.${escapeRe(name)}\\s*\\{`, 'g');
    const hits = [];
    let m;

    while ((m = re.exec(next))) {
      const dot = m.index + m[1].length;
      const brace = next.indexOf('{', dot);
      const close = matchBraces(next, brace);

      if (close === -1) {
        continue;
      }

      hits.push({ from: dot, to: close + 1 });
    }

    for (const hit of hits.reverse()) {
      if (hit.from >= kept.from && hit.to <= kept.to) {
        continue;
      }

      if (!isTopLevelRule(next, hit)) {
        continue;
      }

      let from = hit.from;
      const lineStart = next.lastIndexOf('\n', from - 1) + 1;

      if (/^\s*$/.test(next.slice(lineStart, from))) {
        from = lineStart;
      }

      let to = hit.to;

      if (next[to] === '\n') {
        to += 1;
      }

      next = next.slice(0, from) + next.slice(to);
    }
  }

  return next;
}

function appendEmptyClass(css, name) {
  const source = String(css || '');

  return `${source.trimEnd()}${source.trim() ? '\n' : ''}.${name} {\n}\n`;
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

export function pruneBracketCss(css, nextNames, prevNames) {
  const nextSet = new Set(Array.isArray(nextNames) ? nextNames : []);
  const prevSet = new Set(Array.isArray(prevNames) ? prevNames : []);
  let out = String(css || '');

  for (const name of prevSet) {
    if (nextSet.has(name)) {
      continue;
    }

    out = removeCssClassRule(out, name);
  }

  return out;
}
