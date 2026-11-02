/**
 * One selector's rules in the dock's CSS, read and written by selector and
 * size instead of by where a caret stands: Style has no caret.
 *
 * Owner: Build mode, the CSS mode (resources/js/build-mode/css-mode/).
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

/** A selector as the block tree has it: a tag is blank there. Only whitespace can differ, as a blank is as long as its tag. */
const flat = (text) => String(text || '').replace(/\s+/g, ' ').trim();
const masked = (selector) => flat(String(selector || '').replace(TAG, ' '));
const hasTag = (text) => String(text || '').includes('{{');

/** Where the tag at `at` ends, past the tags inside it: `{{ a b="#x-{{ id }}" }}`. */
function tagEnd(css, at) {
  let depth = 0;

  for (let i = at; i < css.length - 1; i += 1) {
    if (css.startsWith('{{', i)) {
      depth += 1;
      i += 1;
    } else if (css.startsWith('}}', i)) {
      depth -= 1;
      i += 1;

      if (depth === 0) {
        return i + 1;
      }
    }
  }

  return css.length;
}

/**
 * The block tree of css-sizes.js ends a tag at the first `}}`, the inner tag's in
 * `{{ responsive_css selector="#id-{{ id }} .x" }}`, and what is left of the outer
 * one opens a string that swallows the rest of the file. So the inner tag is
 * blanked for it, at its own length: the tree's offsets hold for the real text.
 */
export function treeOf(css) {
  const source = String(css || '');
  let out = '';
  let i = 0;

  while (i < source.length) {
    const at = source.indexOf('{{', i);

    if (at === -1) {
      break;
    }

    const end = tagEnd(source, at);
    const inner = source.indexOf('{{', at + 2);

    out += source.slice(i, at);
    out += inner !== -1 && inner < end
      ? `{{${source.slice(at + 2, end - 2).replace(/\{\{[\s\S]*?\}\}/g, (tag) => ' '.repeat(tag.length))}}}`
      : source.slice(at, end);
    i = end;
  }

  return cssBlockTree(out + source.slice(i));
}

/**
 * What `{{ responsive_css }} … {{ /responsive_css }}` holds. The server wraps it
 * in the section's own selector, so a rule on that selector written there would
 * come out as `#id-x #id-x` and reach nothing: no new block goes in one.
 */
function tagPairBodies(css) {
  const out = [];
  const open = /\{\{\s*responsive_css\b/g;
  const close = /\{\{\s*\/responsive_css\s*\}\}/g;

  for (let match = open.exec(css); match; match = open.exec(css)) {
    const from = tagEnd(css, match.index);

    close.lastIndex = from;

    const end = close.exec(css);

    if (end) {
      out.push([from, end.index]);
      open.lastIndex = end.index + end[0].length;
    }
  }

  return out;
}

const outsideBodies = (css) => {
  const bodies = tagPairBodies(css);

  return (node) => !bodies.some(([from, to]) => node.from >= from && node.from < to);
};

/** The size a row stands for here: the base row and All are both the rule outside every size block. */
export const sizeKey = (rows, handle) => {
  const row = (rows || []).find((item) => item.handle === handle);

  return !row || row.base ? '' : row.handle;
};

/* ---------------- reading ---------------- */

/** Every place the selector has declarations, in file order: `{ node, size, media }`. */
function hitsOf(tree, selector, rows) {
  const want = masked(selector);
  const state = /^(.*?)\s?(::?[a-z-]+)$/.exec(want);
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
      } else if (flat(node.prelude) === want) {
        out.push({ node, size, media });

        for (const child of node.children) {
          const own = child.media ? sizeOfQuery(child.query, rows) : '';

          if (own && !size) {
            out.push({ node: child, size: own, media: child, nested: true });
          }
        }
      } else if (state && flat(node.prelude) === state[1]) {
        // The dock writes a state inside its rule: `.a { &:hover { … } }` is `.a:hover`.
        for (const child of node.children) {
          if (flat(child.prelude) === `&${state[2]}`) {
            out.push({ node: child, size, media });

            for (const inner of child.children) {
              const own = inner.media ? sizeOfQuery(inner.query, rows) : '';

              if (own && !size) {
                out.push({ node: inner, size: own, media: inner, nested: true });
              }
            }
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
      i = Math.min(tagEnd(css, i), to);
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

  for (const { node, size } of hitsOf(treeOf(source), selector, rows)) {
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

/** All the selector declares, a field's value and a hand's alike. */
export const declarationsAt = allDeclarations;

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
    const hits = hitsOf(treeOf(source), where.selector, where.rows).filter((hit) => hit.size === where.size);
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
  const hits = hitsOf(treeOf(css), where.selector, where.rows).filter((hit) => hit.size === where.size);
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

/**
 * A class's plain rule where the cascade wants it: inside the file's one `@scope`,
 * and before the size blocks at its level. The dock puts a new `[ name ]`'s empty
 * rule last in the file, and the save moves it to the end of the scope: after a
 * size written meanwhile, which then loses to All on the page while the canvas
 * shows it winning. Only a rule the save would move anyway, or an empty one, moves.
 */
function settlePlainRule(css, selector, rows) {
  const want = masked(selector);
  const tree = treeOf(css);
  const box = containerFor(tree, selector);
  const outside = outsideBodies(css);
  const isRule = (node) => !node.media && flat(node.prelude) === want;
  const holdsNothing = (node) => !node.children.length && !css.slice(node.bodyFrom, node.bodyTo).trim();
  const stray = box ? tree.find(isRule) : null;
  const inside = box ? box.children.filter(isRule) : [];

  if (stray) {
    const moves = holdsNothing(stray) || /_class/.test(css.slice(box.from, box.bodyFrom));

    if (!moves || (inside.length && !holdsNothing(stray))) {
      return css;
    }

    const text = cut(css, stray.from, stray.to);

    return inside.length ? text : placeInLevel(text, selector, holdsNothing(stray) ? null : css.slice(stray.from, stray.to));
  }

  const nodes = box ? box.children : tree;
  const rule = nodes.filter(isRule).pop();
  const first = nodes.find((node) => node.media && outside(node));

  if (rule && first && first.from < rule.from && holdsNothing(rule)) {
    return placeInLevel(cut(css, rule.from, rule.to), selector, null);
  }

  return css;
}

/** A plain rule put in its level, before the first size block there; `text` its words as they stood, or null for an empty one. */
function placeInLevel(css, selector, text) {
  const tree = treeOf(css);
  const box = containerFor(tree, selector);
  const nodes = box ? box.children : tree;
  const first = nodes.find((node) => node.media && outsideBodies(css)(node));
  const indent = first ? indentAt(css, first.from) : box ? `${indentAt(css, box.from)}${INDENT}` : '';
  const rule = `${indent}${text ?? `${selector} {\n${indent}}`}`;

  if (first) {
    return insertBefore(css, first, rule);
  }

  return box ? appendInBlock(css, box, rule) : appendAtEnd(css, rule);
}

function createRule(css, where, prop, value) {
  const { selector, size, rows, query } = where;
  const tree = treeOf(css);
  const outside = outsideBodies(css);
  const box = containerFor(tree, selector);
  const nodes = box ? box.children : tree;
  const indent = box ? `${indentAt(css, box.from)}${INDENT}` : '';
  const hits = hitsOf(tree, selector, rows);
  const place = (text) => (box ? appendInBlock(css, box, text) : appendAtEnd(css, text));

  if (!size) {
    // Before the selector's own size rules: after them it would beat them all. A
    // state goes before the plain rule's too, so its sizes can share their blocks.
    const plain = /^(.*?)::?[a-z-]+$/.exec(masked(selector))?.[1];
    const sized = [...hits, ...(plain ? hitsOf(tree, plain, rows) : [])].find((hit) => hit.size && !hit.nested && outside(hit.media));
    // A new rule goes before the level's first size block too: its own sizes can then share that block.
    const before = sized?.media || nodes.find((node) => node.media && outside(node));
    const text = ruleText(selector, before ? indentAt(css, before.from) : indent, prop, value);

    return before ? insertBefore(css, before, text) : place(text);
  }

  const base = hits.filter((hit) => !hit.size).pop();
  const after = base ? base.node.to : 0;
  const blocks = nodes.filter((node) => node.media && node.from >= after && outside(node));
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

  const hits = hitsOf(treeOf(css), where.selector, where.rows).filter((hit) => hit.size === where.size);
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
  const list = updates || [];
  const source = String(css || '');
  const plain = /^(.*?)\s?::?[a-z-]+$/.exec(where.selector)?.[1] || where.selector;
  const start = list.some((update) => update.value !== null && update.value !== undefined) ? settlePlainRule(source, plain, where.rows) : source;

  return list.reduce((text, update) => writeOne(text, where, update), start);
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

  walk(treeOf(source));

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
export function liveSheet(css, targets, rows, fill = () => '', suffixes = []) {
  const order = cascadeOrder(rows);
  const parts = [];
  let moving = false;

  for (const { selector, real } of targets || []) {
    for (const suffix of ['', ...suffixes]) {
      const decls = (real ? allDeclarations(css, `${selector}${suffix}`, rows) : [])
        .map((decl) => (hasTag(decl.value) ? { ...decl, value: fill(decl.value) } : decl))
        .filter((decl) => decl.value);
      const body = (size) => decls.filter((decl) => decl.size === size).map((decl) => `${decl.prop}: ${decl.value};`).join(' ');
      // Inside `@scope` a selector means a descendant of the root; the root itself has to be said.
      const both = `${real}${suffix}, :scope${real}${suffix}`;

      moving = moving || decls.some((decl) => /^animation/.test(decl.prop));

      if (body('')) {
        parts.push(`${both} { ${body('')} }`);
      }

      [...(rows || [])]
        .filter((row) => !row.base && body(row.handle))
        .sort((a, b) => order.get(a.handle) - order.get(b.handle))
        .forEach((row) => parts.push(`@media ${row.media} { ${both} { ${body(row.handle)} } }`));
    }
  }

  // An animation's steps stand beside the rules: `@scope` is about what a selector reaches.
  const steps = moving ? treeOf(css).filter((node) => /^@keyframes\b/.test(node.prelude)).map((node) => css.slice(node.from, node.to)) : [];
  const sheet = parts.length ? [`@scope ([data-sve-build-root]) {\n${parts.join('\n')}\n}`] : [];

  return [...steps, ...sheet].join('\n');
}
