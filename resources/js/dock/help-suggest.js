/**
 * Help mode's suggestions — what the HTML pane offers to write next at one
 * spot in a template.
 *
 * Pure: the markup, where the caret stands and the section's fields go in; at
 * most three suggestions come out, each one change to that markup and where
 * the caret lands after it. One change, so the dock applies a suggestion as
 * one transaction and ⌘Z takes it back in one step; Instant paints it like
 * anything typed.
 *
 * The fields are the Data button's section rows (`/!/sve/data-vars`): `var`,
 * `label`, `type`, `loop`, `value`, and `parent` for a row inside a loop —
 * `items` for a grid's own fields, `list › item` for the fields of a
 * replicator's set `item`. Only those are offered; nothing is guessed from
 * the markup.
 *
 * A suggestion names its text by lang key (`key` + `args`, for `t()`), so this
 * file has no strings to translate. The section's root is not written here
 * either: the caller hands in the one SectionTypeMaker scaffolds, so a new
 * section and a suggested one start the same.
 *
 * May import: html-tree-parse.js, antlers-blocks.js.
 */
import { isVoidTag, lockedElementRanges, maskAntlers, parseHtmlTree } from '../html-tree-parse.js';
import { findAntlersBlocks } from '../antlers-blocks.js';

/** How many suggestions the popup shows at once. */
export const HELP_MAX = 3;

/** Fields whose value is text to print. */
const TEXT_TYPES = new Set(['text', 'textarea', 'markdown', 'bard']);

/** Text that renders its own blocks — a `<p>` around it would hold a `<p>`. */
const BLOCK_TEXT_TYPES = new Set(['markdown', 'bard']);

/** Fields that are looped into rows of markup. */
const ROW_LOOP_TYPES = new Set(['grid', 'replicator']);

/** Elements that hold a line of text. */
const TEXT_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'a', 'li', 'strong', 'em', 'small',
  'blockquote', 'figcaption', 'label', 'button', 'td', 'th', 'dt', 'dd',
]);

const LIST_TAGS = new Set(['ul', 'ol']);

/** A field written as the heading of its row. */
const TITLE_HANDLE = /^(title|heading|headline|name)$/;

/** How DataVars joins the steps of a row's `parent`. */
const STEP = ' › ';

const INDENT = '    ';

/** How deep a suggested loop writes the loops inside it. */
const MAX_LOOP_DEPTH = 2;

/**
 * @param {string} html    the template
 * @param {number} at      the caret's offset in it
 * @param {object} [options]
 * @param {Array}  [options.fields]          the section's Data rows
 * @param {boolean} [options.sectionPartial] the file is a page section's partial
 * @param {string} [options.shellRoot]       SectionTypeMaker's scaffold (or its root tag)
 * @param {number[]} [options.locked]        more locked ranges, flat: from, to, …
 * @returns {Array<{ id: string, key: string, args: object, meta: string,
 *   changes: Array<{ from: number, to: number, insert: string }>, selection: number|null,
 *   loop?: object }>}
 */
export function helpSuggestions(html, at, options = {}) {
  const source = String(html || '');
  const pos = Number(at);

  if (!Number.isFinite(pos) || pos < 0 || pos > source.length) {
    return [];
  }

  const { fields = [], sectionPartial = false, shellRoot = '', locked = [] } = options;

  if (inRanges([...lockedElementRanges(source), ...locked], pos)) {
    return [];
  }

  const blocks = findAntlersBlocks(source);
  const loop = loopTagAt(blocks, pos);

  // On a loop's own tag the question is what it repeats, and only that.
  if (loop) {
    return [
      {
        id: 'loop-ask',
        key: 'code_dock_help_loop_ask',
        args: { name: loop.name },
        meta: loop.expr,
        changes: [],
        selection: null,
        loop,
      },
    ];
  }

  const masked = maskAntlers(source);
  const roots = parseHtmlTree(source);
  const hit = elementAt(source, roots, pos);

  if (!hit) {
    return [];
  }

  const rows = Array.isArray(fields) ? fields.filter((row) => row && typeof row.var === 'string') : [];
  const scope = scopeAt(rows, blocks, pos);
  const ctx = { source, masked, rows, scope, ...hit };
  const shell = sectionPartial && hit.node === roots[0] ? shellSuggestion(ctx, shellRoot) : null;

  return [
    shell,
    ...loopSuggestions(ctx),
    ...textSuggestions(ctx),
    // The section's root gets its class with the shell.
    ...(shell ? [] : classSuggestions(ctx)),
  ]
    .filter(Boolean)
    .slice(0, HELP_MAX);
}

function inRanges(flat, pos) {
  for (let i = 0; i + 1 < flat.length; i += 2) {
    if (pos >= flat[i] && pos < flat[i + 1]) {
      return true;
    }
  }

  return false;
}

/** A field loop whose opening tag the caret is on. */
function loopTagAt(blocks, pos) {
  return blocks.find((block) => block.kind === 'loop' && pos >= block.from && pos <= block.openTo) || null;
}

/**
 * The innermost element around the caret, with its siblings. The spot right
 * after an element's closing tag is outside it.
 */
function elementAt(source, nodes, pos, parent = null) {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const close = closeStart(source, node);
    const end = close >= 0 ? node.to - 1 : node.to;

    if (node.hidden || pos < node.from || pos > end) {
      continue;
    }

    return elementAt(source, node.children, pos, node) || { node, parent, siblings: nodes, index, close };
  }

  return null;
}

/** Where an element's closing tag starts, or -1 when it has none. */
function closeStart(source, node) {
  if (isVoidTag(node.tag) || node.to <= node.openTo) {
    return -1;
  }

  const tail = source.slice(node.openTo, node.to).match(new RegExp(`</${node.tag}\\s*>$`, 'i'));

  return tail ? node.to - tail[0].length : -1;
}

/**
 * An element with nothing inside it, and where the suggestion's text ends:
 * after its closing tag — or, for a tag just typed and not closed yet, right
 * after the opening tag. Unclosed, the parser hands the element everything
 * after it as children, so what counts is that nothing but blank space comes
 * before the next tag. Null when there is something inside.
 */
function emptyInside(ctx) {
  const { source, node, close } = ctx;

  if (close < 0) {
    return /^\s*(<|\{\{|$)/.test(source.slice(node.openTo)) ? { to: node.openTo } : null;
  }

  return !node.children.length && source.slice(node.openTo, close).trim() === '' ? { to: node.to } : null;
}

/** The line indentation an element stands at. */
function indentOf(source, from) {
  const lineStart = source.lastIndexOf('\n', from - 1) + 1;

  return /^[ \t]*/.exec(source.slice(lineStart))[0];
}

function openTagOf(ctx) {
  return { text: ctx.source.slice(ctx.node.from, ctx.node.openTo), masked: ctx.masked.slice(ctx.node.from, ctx.node.openTo) };
}

function hasAttr(maskedOpen, name) {
  return new RegExp(`\\s${name}\\s*=`, 'i').test(maskedOpen);
}

const VISUAL_EDIT = /\{\{\s*visual_edit\b[\s\S]*?\}\}/;

/** An opening tag with `insert` written in front of its `>` (or `/>`). */
function beforeClose(open, insert) {
  const end = /\s*\/?>$/.exec(open);

  return end ? `${open.slice(0, end.index)} ${insert}${open.slice(end.index)}` : `${open} ${insert}`;
}

/** An opening tag with `insert` written right after its name. */
function afterName(open, tag, insert) {
  const at = 1 + tag.length;

  return `${open.slice(0, at)} ${insert}${open.slice(at)}`;
}

/** A class attribute where there is none — empty: the dock names it when CSS is written for it. */
function withClass(open, maskedOpen, tag) {
  return hasAttr(maskedOpen, 'class') ? open : afterName(open, tag, 'class=""');
}

function withVisualEdit(open, edit) {
  return VISUAL_EDIT.test(open) ? open : beforeClose(open, edit);
}

/* ---- Scope: which of the section's fields print here ---------------------- */

/**
 * The loops around the caret as field steps, outermost first — or null when a
 * loop over something else (a collection, a navigation) stands in the way, so
 * the section's fields are not what prints there.
 */
function scopeAt(rows, blocks, pos) {
  const steps = [];

  for (const block of blocks) {
    if (block.kind !== 'loop' || pos < block.openTo || pos >= block.to) {
      continue;
    }

    if (block.loopKind !== 'field') {
      return null;
    }

    steps.push(block.name);
  }

  return steps;
}

/**
 * A row's `parent` as the loops a template opens to reach it: a replicator's
 * set is a step in DataVars' path and not a loop in the template, so it drops
 * out. Null when the path does not lead through the rows.
 */
function loopChain(rows, parent) {
  if (!parent) {
    return [];
  }

  const segments = String(parent).split(STEP);
  const chain = [];
  let path = '';

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const row = rows.find((item) => item.var === segment && (item.parent || '') === path);

    if (!row) {
      return null;
    }

    chain.push(segment);
    path = path ? `${path}${STEP}${segment}` : segment;

    if (row.type === 'replicator' && i + 1 < segments.length) {
      i += 1;
      path = `${path}${STEP}${segments[i]}`;
    }
  }

  return chain;
}

function sameSteps(a, b) {
  return !!a && a.length === b.length && a.every((step, i) => step === b[i]);
}

/** The rows that print at the caret. A replicator's sets come together, as in the Data menu. */
function rowsInScope(ctx) {
  if (!ctx.scope) {
    return [];
  }

  const seen = new Set();

  return ctx.rows.filter((row) => {
    if (!sameSteps(loopChain(ctx.rows, row.parent), ctx.scope) || seen.has(row.var)) {
      return false;
    }

    seen.add(row.var);

    return true;
  });
}

/** Whether the template prints a field already. */
function printed(source, handle) {
  return new RegExp(`\\{\\{\\s*${handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(\\}\\}|\\|)`).test(source);
}

/** Fields not in the file yet first; the fieldset's order otherwise. */
function unusedFirst(source, rows) {
  return [...rows].sort((a, b) => Number(printed(source, a.var)) - Number(printed(source, b.var)));
}

/**
 * What a loop row holds: a grid's fields, or a replicator's sets with theirs.
 *
 * @returns {Array<{ set: string, rows: Array }>} one entry with `set: ''` for a grid
 */
function rowsOfLoop(rows, loop) {
  const own = loop.parent ? `${loop.parent}${STEP}${loop.var}` : loop.var;

  if (loop.type !== 'replicator') {
    return [{ set: '', rows: rows.filter((row) => row.parent === own) }];
  }

  const sets = new Map();

  for (const row of rows) {
    const parent = String(row.parent || '');

    if (!parent.startsWith(`${own}${STEP}`)) {
      continue;
    }

    const set = parent.slice(own.length + STEP.length);

    if (set.includes(STEP)) {
      continue;
    }

    if (!sets.has(set)) {
      sets.set(set, []);
    }

    sets.get(set).push(row);
  }

  return [...sets].map(([set, list]) => ({ set, rows: list }));
}

/* ---- The suggestions ------------------------------------------------------ */

/**
 * The root a page section's partial needs, written the way a new section
 * starts: what is missing is added, what is there stays.
 */
function shellSuggestion(ctx, shellRoot) {
  const { node } = ctx;
  const root = /<section\b[^>]*>/i.exec(maskAntlersSafe(shellRoot));

  if (node.tag !== 'section' || !root) {
    return null;
  }

  const rootTag = String(shellRoot).slice(root.index, root.index + root[0].length);
  const id = /\sid\s*=\s*"[^"]*"/i.exec(rootTag);
  const klass = /\sclass\s*=\s*"[^"]*"/i.exec(rootTag);
  const edit = VISUAL_EDIT.exec(rootTag);
  const open = openTagOf(ctx);

  // Another id is the author's; overwriting it is not a suggestion.
  if (!id || hasAttr(open.masked, 'id')) {
    return null;
  }

  let next = afterName(open.text, 'section', `${id[0].trim()}${hasAttr(open.masked, 'class') || !klass ? '' : ` ${klass[0].trim()}`}`);

  if (edit) {
    next = withVisualEdit(next, edit[0]);
  }

  return {
    id: 'shell',
    key: 'code_dock_help_shell',
    args: {},
    meta: 'id-{{ id }}',
    changes: [{ from: node.from, to: node.openTo, insert: next }],
    selection: node.from + next.length,
  };
}

/** `{{ … }}` blanked out, so a `>` inside a parameter does not end the tag. */
function maskAntlersSafe(text) {
  return maskAntlers(String(text || ''));
}

/** `<ul>` / `<ol>` with nothing in it, over each of the list fields that print here. */
function loopSuggestions(ctx) {
  const { source, node } = ctx;
  const inside = LIST_TAGS.has(node.tag) ? emptyInside(ctx) : null;

  if (!inside) {
    return [];
  }

  const loops = unusedFirst(source, rowsInScope(ctx).filter((row) => ROW_LOOP_TYPES.has(row.type)));

  return loops.map((loop) => {
    const base = indentOf(source, node.from);
    const open = openTagOf(ctx);
    const head = withVisualEdit(
      withClass(open.text, open.masked, node.tag),
      `{{ visual_edit field="${loop.var}" outline_inside="true" insertable="true" }}`
    );
    const row = `${base}${INDENT}${INDENT}`;
    const lines = [
      head,
      `${base}${INDENT}{{ ${loop.var} }}`,
      `${row}<li class="" {{ visual_edit orderable="true" }}>`,
      ...bodyLines(ctx.rows, loop, `${row}${INDENT}`, 1),
      `${row}</li>`,
      `${base}${INDENT}{{ /${loop.var} }}`,
      `${base}</${node.tag}>`,
    ];
    return {
      id: `loop:${loop.var}`,
      key: 'code_dock_help_loop',
      args: { name: loop.label || loop.var },
      meta: [loop.type, loop.value].filter(Boolean).join(' · '),
      changes: [{ from: node.from, to: inside.to, insert: lines.join('\n') }],
      selection: node.from + lines.slice(0, 3).join('\n').length,
    };
  });
}

/**
 * The markup inside one row of a loop: a line per text field, and the loops
 * inside it written the same way, a level or two down. A replicator with more
 * than one set gets a branch per set, the way the house's sections are built.
 */
function bodyLines(rows, loop, indent, depth) {
  const groups = rowsOfLoop(rows, loop).filter((group) => group.rows.some(isWritable));
  const lineOf = (group, at) => group.rows.filter(isWritable).flatMap((row) => fieldLines(rows, row, at, depth));

  if (!groups.length) {
    return [indent];
  }

  if (groups.length === 1) {
    return lineOf(groups[0], indent);
  }

  const out = [];

  groups.forEach((group, i) => {
    out.push(`${indent}{{ ${i === 0 ? 'if' : 'elseif'} type == '${group.set}' }}`);
    out.push(...lineOf(group, `${indent}${INDENT}`));
  });
  out.push(`${indent}{{ /if }}`);

  return out;
}

function isWritable(row) {
  return TEXT_TYPES.has(row.type) || ROW_LOOP_TYPES.has(row.type);
}

function fieldLines(rows, row, indent, depth) {
  if (ROW_LOOP_TYPES.has(row.type)) {
    if (depth >= MAX_LOOP_DEPTH) {
      return [];
    }

    return [`${indent}{{ ${row.var} }}`, ...bodyLines(rows, row, `${indent}${INDENT}`, depth + 1), `${indent}{{ /${row.var} }}`];
  }

  const tag = BLOCK_TEXT_TYPES.has(row.type) ? 'div' : TITLE_HANDLE.test(row.var) ? 'h3' : 'p';

  return [`${indent}<${tag} {{ visual_edit field="${row.var}" inline_edit="true" }}>{{ ${row.var} }}</${tag}>`];
}

/** An element with nothing but text in it, filled from a text field instead. */
function textSuggestions(ctx) {
  const { source, node, close } = ctx;

  if (!TEXT_TAGS.has(node.tag)) {
    return [];
  }

  // Closed: plain text or nothing inside, which the field replaces. Just typed: nothing yet.
  const to = close >= 0 ? (node.children.length || source.slice(node.openTo, close).includes('{{') ? null : node.to) : emptyInside(ctx)?.to;

  if (to == null) {
    return [];
  }

  const texts = unusedFirst(source, rowsInScope(ctx).filter((row) => TEXT_TYPES.has(row.type))).slice(0, 2);

  return texts.map((row) => {
    // Bard and Markdown render their own <p>s; inside a <p> the browser splits
    // the page's markup, and a click lands on the wrong element.
    const tag = node.tag === 'p' && BLOCK_TEXT_TYPES.has(row.type) ? 'div' : node.tag;
    const open = openTagOf(ctx);
    const renamed = tag === node.tag ? open.text : `<${tag}${open.text.slice(1 + node.tag.length)}`;
    const head = withVisualEdit(renamed, `{{ visual_edit field="${row.var}" inline_edit="true" }}`);
    const body = `{{ ${row.var} }}`;
    const insert = `${head}${body}</${tag}>`;

    return {
      id: `text:${row.var}`,
      key: 'code_dock_help_text',
      args: { name: row.label || row.var },
      meta: row.value || body,
      changes: [{ from: node.from, to, insert }],
      selection: node.from + head.length + body.length,
    };
  });
}

/** A class where there is none: empty, or the one the same tag above wears. */
function classSuggestions(ctx) {
  const { node, siblings, index } = ctx;
  const open = openTagOf(ctx);

  if (hasAttr(open.masked, 'class')) {
    return [];
  }

  const out = [];
  const like = siblings
    .slice(0, index)
    .reverse()
    .find((other) => other.tag === node.tag && staticClass(ctx.source, other));

  if (like) {
    const value = staticClass(ctx.source, like);
    const next = afterName(open.text, node.tag, `class="${value}"`);

    out.push({
      id: 'class-same',
      key: 'code_dock_help_class_same',
      args: { tag: node.tag },
      meta: value,
      changes: [{ from: node.from, to: node.openTo, insert: next }],
      selection: node.from + next.length,
    });
  }

  const empty = afterName(open.text, node.tag, 'class=""');

  out.push({
    id: 'class',
    key: 'code_dock_help_class',
    args: {},
    meta: 'class=""',
    changes: [{ from: node.from, to: node.openTo, insert: empty }],
    // Between the quotes, where the Tailwind list opens.
    selection: node.from + 1 + node.tag.length + ' class="'.length,
  });

  return out;
}

/** An element's class when it is plain text — no Antlers to copy along. */
function staticClass(source, node) {
  const match = /\sclass\s*=\s*"([^"]*)"/i.exec(source.slice(node.from, node.openTo));
  const value = match ? match[1].trim() : '';

  return value && !value.includes('{{') ? value : '';
}
