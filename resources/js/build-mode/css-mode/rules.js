/**
 * One selector's rules in the dock's CSS, read and written by selector and
 * size instead of by where a caret stands: Style has no caret.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: css-sizes.js. Pure: strings and plain objects in and out.
 * Bus messages: none.
 *
 * The CSS the sections are written in holds Antlers (`#id-{{ id }}`,
 * `--x: {{ field }}`), `@scope`, `@media` around a rule and `@media` inside
 * one, so the block tree of css-sizes.js is what is walked. A declaration
 * holding Antlers is left where it stands: read past, and only ever replaced
 * when the panel writes that very property.
 *
 * A class goes in the file's one `@scope` when it has one, the way the save's
 * moveClassesIntoScope would put it. An ID stands at the top of the file, as
 * the sections' `#id-` rules do. A rule for a size always lands after the
 * selector's base rule, and a new size block before the blocks that come later
 * in the cascade: a size written in the wrong order would lose without a word.
 */

import { cssBlockTree, sizeOfQuery } from '../../css-sizes.js';

const TAG = /\{\{[\s\S]*?\}\}/g;
const SCOPE = /^@scope\b/i;

const masked = (selector) => String(selector || '').replace(TAG, '').trim();
const hasTag = (text) => String(text || '').includes('{{');

/** The size a row stands for here: the base row and All are both the rule outside every size block. */
export const sizeKey = (rows, handle) => {
  const row = (rows || []).find((item) => item.handle === handle);

  return !row || row.base ? '' : row.handle;
};

/* ---------------- reading ---------------- */

/** Every place the selector has declarations, in file order: `{ node, size, media }`. */
function hitsOf(tree, selector, rows) {
  const want = masked(selector);
  const out = [];

  const walk = (nodes, size, media, inScope) => {
    for (const node of nodes) {
      if (node.media) {
        const own = sizeOfQuery(node.query, rows);

        // A query no size stands for, or a size inside a size, is the author's own.
        if (own && !size) {
          walk(node.children, own, node, inScope);
        }
      } else if (SCOPE.test(node.prelude)) {
        if (!inScope) {
          walk(node.children, size, media, true);
        }
      } else if (node.prelude === want) {
        out.push({ node, size, media });

        for (const child of node.children) {
          const own = child.media ? sizeOfQuery(child.query, rows) : '';

          if (own && !size) {
            out.push({ node: child, size: own, media: child, nested: true });
          }
        }
      }
    }
  };

  walk(tree, '', null, false);

  return out;
}

/** The declarations directly in a block, nested blocks left out. */
function declarationsIn(css, node) {
  const out = [];
  const to = node.bodyTo;
  let i = node.bodyFrom;
  let start = i;
  let depth = 0;
  let quote = '';

  const push = (end) => {
    const text = css.slice(start, end);
    const lead = text.search(/\S/);
    const colon = text.indexOf(':');

    if (lead !== -1 && colon !== -1) {
      out.push({
        prop: text.slice(lead, colon).trim().toLowerCase(),
        value: text.slice(colon + 1).replace(/;\s*$/, '').trim(),
        from: start + lead,
        to: end,
      });
    }
  };

  while (i < to) {
    const child = node.children.find((one) => one.from <= i && i < one.to);

    if (child) {
      i = child.to;
      start = i;
      continue;
    }

    if (css.startsWith('{{', i)) {
      const end = css.indexOf('}}', i + 2);

      i = end === -1 ? to : end + 2;
      continue;
    }

    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2);
      const next = end === -1 ? to : end + 2;

      // A comment before a declaration is not part of it.
      if (!css.slice(start, i).trim()) {
        start = next;
      }

      i = next;
      continue;
    }

    const ch = css[i];

    if (quote) {
      quote = ch === quote ? '' : quote;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
    } else if (ch === ';' && depth <= 0) {
      push(i + 1);
      start = i + 1;
    }

    i += 1;
  }

  if (css.slice(start, to).trim()) {
    push(to);
  }

  return out;
}

/** Everything the selector declares, per size; of a property set twice at a size the last one stands. */
function allDeclarations(css, selector, rows) {
  const source = String(css || '');
  const found = new Map();

  for (const { node, size } of hitsOf(cssBlockTree(source), selector, rows)) {
    for (const decl of declarationsIn(source, node)) {
      found.delete(`${size}|${decl.prop}`);
      found.set(`${size}|${decl.prop}`, { size, prop: decl.prop, value: decl.value });
    }
  }

  return [...found.values()];
}

/** What the selector sets by hand, per size: `[{ size, prop, value }]`, base first. Antlers values are left out. */
export function readRule(css, selector, rows) {
  return allDeclarations(css, selector, rows).filter((decl) => !hasTag(decl.value));
}

/** What the selector takes from a field, per size: `[{ size, prop, value }]`, the value as written (`{{ gap }}rem`). */
export function readBound(css, selector, rows) {
  return allDeclarations(css, selector, rows).filter((decl) => hasTag(decl.value));
}

/* ---------------- writing ---------------- */

const lineStart = (css, at) => css.lastIndexOf('\n', at - 1) + 1;
const indentAt = (css, at) => (css.slice(lineStart(css, at), at).match(/^[^\S\n]*/) || [''])[0];

function cut(css, from, to) {
  const start = lineStart(css, from);
  const onlyHere = !css.slice(start, from).trim();
  const tail = css.slice(to).match(/^[^\S\n]*\n?/)?.[0] || '';

  return onlyHere && (tail.endsWith('\n') || to + tail.length >= css.length)
    ? css.slice(0, start) + css.slice(to + tail.length)
    : css.slice(0, from) + css.slice(to);
}

const isEmpty = (css, node) => !node.children.length && !declarationsIn(css, node).length && !css.slice(node.bodyFrom, node.bodyTo).trim();

/** A declaration taken out, and what that left empty with it: the rule, and a size block holding nothing else. */
function removeDeclaration(css, where, prop) {
  let source = css;

  for (;;) {
    const hits = hitsOf(cssBlockTree(source), where.selector, where.rows).filter((hit) => hit.size === where.size);
    const hit = [...hits].reverse().find((one) => declarationsIn(source, one.node).some((decl) => decl.prop === prop));

    if (!hit) {
      return source;
    }

    const decl = declarationsIn(source, hit.node).filter((one) => one.prop === prop).pop();

    source = cut(source, decl.from, decl.to);
    source = pruneEmpty(source, where);
  }
}

function pruneEmpty(css, where) {
  const hits = hitsOf(cssBlockTree(css), where.selector, where.rows).filter((hit) => hit.size === where.size);
  const empty = [...hits].reverse().find((hit) => isEmpty(css, hit.node));

  if (!empty) {
    return css;
  }

  const media = empty.nested ? null : empty.media;
  const next = cut(css, empty.node.from, empty.node.to);

  if (media && !css.slice(media.bodyFrom, empty.node.from).trim() && !css.slice(empty.node.to, media.bodyTo).trim()) {
    return cut(css, media.from, media.to);
  }

  return next;
}

/** Text put last in a block, on lines of its own, its closing brace on its own line. */
function appendInBlock(css, node, lines) {
  const closeIndent = indentAt(css, node.from);
  const body = css.slice(node.bodyFrom, node.bodyTo);
  const kept = body.trimEnd();
  const glue = !kept.trim() || /[;{}]$/.test(kept.trim()) ? '' : ';';

  return `${css.slice(0, node.bodyFrom)}${kept.trim() ? kept : ''}${glue}\n${lines}\n${closeIndent}${css.slice(node.bodyTo)}`;
}

const INDENT = '    ';

function ruleText(selector, indent, prop, value) {
  return `${indent}${selector} {\n${indent}${INDENT}${prop}: ${value};\n${indent}}`;
}

function appendAtEnd(css, text) {
  const kept = css.trimEnd();

  return `${kept}${kept ? '\n\n' : ''}${text}\n`;
}

function insertBefore(css, node, text) {
  const at = lineStart(css, node.from);

  return `${css.slice(0, at)}${text}\n\n${css.slice(at)}`;
}

/** The file's one `@scope`, where a class belongs; none, or more than one, is the top of the file. */
function containerFor(tree, selector) {
  if (!selector.startsWith('.')) {
    return null;
  }

  const scopes = tree.filter((node) => SCOPE.test(node.prelude));

  return scopes.length === 1 ? scopes[0] : null;
}

/** Where a size stands in the cascade: a higher number comes later and wins. */
function cascadeOrder(rows) {
  const list = rows?.[0]?.direction === 'mobile' ? [...rows].reverse() : rows || [];

  return new Map(list.map((row, index) => [row.handle, index]));
}

function createRule(css, where, prop, value) {
  const { selector, size, rows, query } = where;
  const tree = cssBlockTree(css);
  const box = containerFor(tree, selector);
  const nodes = box ? box.children : tree;
  const indent = box ? `${indentAt(css, box.from)}${INDENT}` : '';
  const hits = hitsOf(tree, selector, rows);
  const place = (text) => (box ? appendInBlock(css, box, text) : appendAtEnd(css, text));

  if (!size) {
    // Before the selector's own size rules: after them it would beat them all.
    const sized = hits.find((hit) => hit.size && !hit.nested);
    const text = ruleText(selector, sized ? indentAt(css, sized.media.from) : indent, prop, value);

    return sized ? insertBefore(css, sized.media, text) : place(text);
  }

  const base = hits.filter((hit) => !hit.size).pop();
  const after = base ? base.node.to : 0;
  const blocks = nodes.filter((node) => node.media && node.from >= after);
  const own = blocks.filter((node) => sizeOfQuery(node.query, rows) === size).pop();

  if (own) {
    return appendInBlock(css, own, ruleText(selector, `${indentAt(css, own.from)}${INDENT}`, prop, value));
  }

  const order = cascadeOrder(rows);
  const later = blocks.find((node) => (order.get(sizeOfQuery(node.query, rows)) ?? -1) > (order.get(size) ?? -1));
  const blockIndent = later ? indentAt(css, later.from) : indent;
  const text = `${blockIndent}@media ${query} {\n${ruleText(selector, `${blockIndent}${INDENT}`, prop, value)}\n${blockIndent}}`;

  return later ? insertBefore(css, later, text) : place(text);
}

function writeOne(css, where, { prop, value }) {
  if (value === null || value === undefined) {
    return removeDeclaration(css, where, prop);
  }

  const hits = hitsOf(cssBlockTree(css), where.selector, where.rows).filter((hit) => hit.size === where.size);
  const withIt = [...hits].reverse().find((hit) => declarationsIn(css, hit.node).some((decl) => decl.prop === prop));

  if (withIt) {
    const decl = declarationsIn(css, withIt.node).filter((one) => one.prop === prop).pop();

    return `${css.slice(0, decl.from)}${prop}: ${value};${css.slice(decl.to)}`;
  }

  const rule = hits[hits.length - 1];

  if (rule) {
    const first = declarationsIn(css, rule.node)[0];
    const indent = first ? indentAt(css, first.from) : `${indentAt(css, rule.node.from)}${INDENT}`;

    return appendInBlock(css, rule.node, `${indent}${prop}: ${value};`);
  }

  return createRule(css, where, prop, value);
}

/**
 * The CSS with `updates` applied at one size.
 *
 * @param {string} css
 * @param {{ selector: string, size: string, rows: object[], query: string }} where  `size` from `sizeKey`; `query` the `@media` a new block is written with
 * @param {Array<{ prop: string, value: string|null }>} updates  a null value takes the property out
 */
export function writeDeclarations(css, where, updates) {
  return (updates || []).reduce((text, update) => writeOne(text, where, update), String(css || ''));
}

/* ---------------- renaming ---------------- */

const tagTolerant = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{\\\{\s*([\w.:-]+)\s*\\\}\\\}/g, '\\{\\{\\s*$1\\s*\\}\\}');

/**
 * Every rule that names `from` names `to`: `#a`, `#a .b`, `#a:hover`, `.x, #a`.
 * Only in selectors, never in a value, and `#a` is not `#ab`. `{{ id }}` is the
 * same tag however it is spaced.
 */
export function renameSelector(css, from, to) {
  const source = String(css || '');
  const name = new RegExp(`${tagTolerant(from)}(?![\\w-])`, 'g');
  const spots = [];

  const walk = (nodes) => {
    for (const node of nodes) {
      spots.push([node.from, node.bodyFrom]);
      walk(node.children);
    }
  };

  walk(cssBlockTree(source));

  return spots
    .sort((a, b) => b[0] - a[0])
    .reduce((text, [start, end]) => text.slice(0, start) + text.slice(start, end).replace(name, to) + text.slice(end), source);
}

/* ---------------- the canvas's sheet ---------------- */

/**
 * The rules of the selectors the panel has written, as the canvas can show them:
 * no Antlers, sizes in cascade order, inside the section the canvas paints. A
 * target is `{ selector, real }`, `real` being the selector as the page has it
 * (`#id-{{ id }}` is `#id-abc` there). `fill` turns a value holding a field into
 * what the field holds now; a value it cannot fill is left to the server's page.
 */
export function liveSheet(css, targets, rows, fill = () => '') {
  const order = cascadeOrder(rows);
  const parts = [];

  for (const { selector, real } of targets || []) {
    const decls = (real ? allDeclarations(css, selector, rows) : [])
      .map((decl) => (hasTag(decl.value) ? { ...decl, value: fill(decl.value) } : decl))
      .filter((decl) => decl.value);
    const body = (size) => decls.filter((decl) => decl.size === size).map((decl) => `${decl.prop}: ${decl.value};`).join(' ');
    // Inside `@scope` a selector means a descendant of the root; the root itself has to be said.
    const both = `${real}, :scope${real}`;

    if (body('')) {
      parts.push(`${both} { ${body('')} }`);
    }

    [...(rows || [])]
      .filter((row) => !row.base && body(row.handle))
      .sort((a, b) => order.get(a.handle) - order.get(b.handle))
      .forEach((row) => parts.push(`@media ${row.media} { ${both} { ${body(row.handle)} } }`));
  }

  return parts.length ? `@scope ([data-sve-build-root]) {\n${parts.join('\n')}\n}` : '';
}
