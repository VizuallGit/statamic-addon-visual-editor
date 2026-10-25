/**
 * What every help rule is handed, and the helpers they write markup with.
 *
 * A rule (one file per kind of tag in this folder) is a pure function
 * `(ctx) => suggestion[]`. It reads the context, never the DOM, never the
 * editor, and returns suggestions in the shape help-suggest.js documents:
 *
 *   { id, key, args, meta, changes, selection, after?, loop? }
 *
 *   id         unique within one answer: 'class', 'text:title', 'loop:items'
 *   key, args  the label, by lang key (resources/lang) and :placeholders
 *   meta       short mono text at the right of the row (a value, a handle)
 *   changes    [{ from, to, insert }] in the FILE's offsets — one change
 *              where possible, so ⌘Z takes it back in one step
 *   selection  where the caret lands in the file after the change, or null
 *   after      what the editor does once the change is in (help-editor.js):
 *              'class'  — the class picker, or the Tailwind list between the
 *                         quotes, as the user's setting says
 *              'loop'   — the loop panel for `loop` (a loop's own tag)
 *              nothing  — the caret at `selection`, that is all
 *   loop       for after:'loop' — the loop block (antlers-blocks.js) it opens
 *
 * The context:
 *
 *   source         the whole file
 *   masked         the file with `{{ … }}` blanked (same length), for regexes
 *                  that must not trip on a `>` inside an Antlers tag
 *   rows           the section's Data rows: { var, label, type, loop?, value?, parent? }
 *   scope          the field loops open around the caret (outermost first),
 *                  or null inside a collection/nav loop — rowsInScope() is
 *                  what prints here
 *   blocks         every Antlers block in the file (antlers-blocks.js)
 *   node           the innermost element around the caret (html-tree-parse)
 *   parent, siblings, index   where it stands
 *   close          where its closing tag starts, -1 when it has none (void,
 *                  or just typed and not closed yet)
 *   isRoot         the file's first element
 *   sectionPartial the file is a page section's partial
 *   shellRoot      SectionTypeMaker::scaffold() — the root a section starts as
 *   blockPartials  the site's shared block partials: `{ src, handles }` —
 *                  `src` is what a section writes for a set, with its token
 *                  (`blocks/{type}`); `handles` what the folder holds
 *                  ('headline', 'richtext', 'links', …). A replicator set
 *                  with one of these names is rendered as
 *                  `{{ partial src="blocks/{type}" }}`, the house way.
 *                  `src` is '' when the site has no such folder.
 *
 * May import: html-tree-parse.js, antlers-blocks.js. Nothing from the dock.
 */
import { isVoidTag, maskAntlers, parseHtmlTree } from '../../html-tree-parse.js';

/** Fields whose value is text to print. */
export const TEXT_TYPES = new Set(['text', 'textarea', 'markdown', 'bard']);

/** Text that renders its own blocks — a `<p>` around it would hold a `<p>`. */
export const BLOCK_TEXT_TYPES = new Set(['markdown', 'bard']);

/** Fields that are looped into rows of markup. */
export const ROW_LOOP_TYPES = new Set(['grid', 'replicator']);

/** Fields holding files (one or many). */
export const ASSET_TYPES = new Set(['assets']);

/** Fields holding a link (Statamic's `link` fieldtype: a URL, an entry or an asset). */
export const LINK_TYPES = new Set(['link']);

/** A field written as the heading of its row. */
export const TITLE_HANDLE = /^(title|heading|headline|name)$/;

/** How DataVars joins the steps of a row's `parent`. */
export const STEP = ' › ';

export const INDENT = '    ';

/** How deep a suggested loop writes the loops inside it. */
export const MAX_LOOP_DEPTH = 2;

export const VISUAL_EDIT = /\{\{\s*visual_edit\b[\s\S]*?\}\}/;

/**
 * The context for the caret at `pos`, or null when it stands in no element.
 *
 * @param {string} source
 * @param {number} pos
 * @param {{ rows: Array, blocks: Array, sectionPartial: boolean, shellRoot: string,
 *   blockPartials: { src: string, handles: string[] } }} given
 */
export function buildContext(source, pos, given) {
  const masked = maskAntlers(source);
  const roots = parseHtmlTree(source);
  const hit = elementAt(source, roots, pos);

  if (!hit) {
    return null;
  }

  const partials = given.blockPartials || {};

  return {
    source,
    masked,
    rows: given.rows,
    scope: scopeAt(given.blocks, pos),
    blocks: given.blocks,
    ...hit,
    isRoot: hit.node === roots[0],
    sectionPartial: !!given.sectionPartial,
    shellRoot: String(given.shellRoot || ''),
    blockPartials: {
      src: typeof partials.src === 'string' ? partials.src : '',
      handles: Array.isArray(partials.handles) ? partials.handles.filter((name) => typeof name === 'string') : [],
    },
  };
}

/** The `src` a section writes for one set: `blocks/{type}` → `blocks/headline`. */
export function blockPartialSrc(ctx, handle) {
  return ctx.blockPartials.src.replace(/\{[A-Za-z_][A-Za-z0-9_]*\}/, handle);
}

/** Whether a replicator set is rendered by one of the site's block partials. */
export function hasBlockPartial(ctx, handle) {
  return !!ctx.blockPartials.src && ctx.blockPartials.handles.includes(handle);
}

/* ---- Where the caret stands ---------------------------------------------- */

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
 * The loops around the caret as field steps, outermost first — or null when a
 * loop over something else (a collection, a navigation) stands in the way, so
 * the section's fields are not what prints there.
 */
function scopeAt(blocks, pos) {
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

/* ---- The element ---------------------------------------------------------- */

/**
 * An element with nothing inside it, and where the suggestion's text ends:
 * after its closing tag — or, for a tag just typed and not closed yet, right
 * after the opening tag. Unclosed, the parser hands the element everything
 * after it as children, so what counts is that nothing but blank space comes
 * before the next tag. Null when there is something inside.
 */
export function emptyInside(ctx) {
  const { source, node, close } = ctx;

  if (close < 0) {
    return /^\s*(<|\{\{|$)/.test(source.slice(node.openTo)) ? { to: node.openTo } : null;
  }

  return !node.children.length && source.slice(node.openTo, close).trim() === '' ? { to: node.to } : null;
}

/** The line indentation an element stands at. */
export function indentOf(source, from) {
  const lineStart = source.lastIndexOf('\n', from - 1) + 1;

  return /^[ \t]*/.exec(source.slice(lineStart))[0];
}

/** The element's opening tag, as written and with Antlers blanked. */
export function openTagOf(ctx) {
  return { text: ctx.source.slice(ctx.node.from, ctx.node.openTo), masked: ctx.masked.slice(ctx.node.from, ctx.node.openTo) };
}

export function hasAttr(maskedOpen, name) {
  return new RegExp(`\\s${name}\\s*=`, 'i').test(maskedOpen);
}

/** An opening tag with `insert` written in front of its `>` (or `/>`). */
export function beforeClose(open, insert) {
  const end = /\s*\/?>$/.exec(open);

  return end ? `${open.slice(0, end.index)} ${insert}${open.slice(end.index)}` : `${open} ${insert}`;
}

/** An opening tag with `insert` written right after its name. */
export function afterName(open, tag, insert) {
  const at = 1 + tag.length;

  return `${open.slice(0, at)} ${insert}${open.slice(at)}`;
}

/** A class attribute where there is none — empty: the dock names it when CSS is written for it. */
export function withClass(open, maskedOpen, tag) {
  return hasAttr(maskedOpen, 'class') ? open : afterName(open, tag, 'class=""');
}

export function withVisualEdit(open, edit) {
  return VISUAL_EDIT.test(open) ? open : beforeClose(open, edit);
}

/** An element's class when it is plain text — no Antlers to copy along. */
export function staticClass(source, node) {
  const match = /\sclass\s*=\s*"([^"]*)"/i.exec(source.slice(node.from, node.openTo));
  const value = match ? match[1].trim() : '';

  return value && !value.includes('{{') ? value : '';
}

/** `{{ … }}` blanked out, so a `>` inside a parameter does not end the tag. */
export function maskAntlersSafe(text) {
  return maskAntlers(String(text || ''));
}

/* ---- The fields ----------------------------------------------------------- */

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
export function rowsInScope(ctx) {
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
export function printed(source, handle) {
  return new RegExp(`\\{\\{\\s*${handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(\\}\\}|\\|)`).test(source);
}

/** Fields not in the file yet first; the fieldset's order otherwise. */
export function unusedFirst(source, rows) {
  return [...rows].sort((a, b) => Number(printed(source, a.var)) - Number(printed(source, b.var)));
}

/**
 * What a loop row holds: a grid's fields, or a replicator's sets with theirs.
 *
 * @returns {Array<{ set: string, rows: Array }>} one entry with `set: ''` for a grid
 */
export function rowsOfLoop(rows, loop) {
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

/* ---- Markup for a loop's rows --------------------------------------------- */

/**
 * The markup inside one row of a loop: a line per text field, and the loops
 * inside it written the same way, a level or two down. A replicator with more
 * than one set gets a branch per set, the way the house's sections are built.
 */
export function bodyLines(rows, loop, indent, depth) {
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

export function isWritable(row) {
  return TEXT_TYPES.has(row.type) || ROW_LOOP_TYPES.has(row.type);
}

export function fieldLines(rows, row, indent, depth) {
  if (ROW_LOOP_TYPES.has(row.type)) {
    if (depth >= MAX_LOOP_DEPTH) {
      return [];
    }

    return [`${indent}{{ ${row.var} }}`, ...bodyLines(rows, row, `${indent}${INDENT}`, depth + 1), `${indent}{{ /${row.var} }}`];
  }

  const tag = BLOCK_TEXT_TYPES.has(row.type) ? 'div' : TITLE_HANDLE.test(row.var) ? 'h3' : 'p';

  return [`${indent}<${tag} {{ visual_edit field="${row.var}" inline_edit="true" }}>{{ ${row.var} }}</${tag}>`];
}
