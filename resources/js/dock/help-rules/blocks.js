/**
 * A loop field's wrapper: the element that carries the field and holds the
 * loop. Never the section itself — the house wraps a section's blocks in a
 * `<div>`:
 *
 *   section  with its shell and nothing inside → a wrapper `<div>` inside it,
 *            for a replicator whose sets the site has block partials for
 *   div      empty → the div is the wrapper, for any loop field here
 *   li       empty, in a field loop → a wrapper `<div>` inside it, for a
 *            replicator in the loop's row
 *
 * A replicator with a block-partial set is written as the blocks wrapper: a
 * branch per set, each set its partial (bodyLines). Any other loop gets rows
 * of `<div>`s, the way the list rule writes `<li>`s.
 */
import {
  INDENT,
  ROW_LOOP_TYPES,
  bodyLines,
  emptyInside,
  hasAttr,
  hasPartialSet,
  indentOf,
  openTagOf,
  partialFor,
  rowsInScope,
  unusedFirst,
  withClass,
  withVisualEdit,
} from './context.js';
import { onSectionRoot } from './section.js';

export function blocksRule(ctx) {
  const { node, scope } = ctx;
  const inside = emptyInside(ctx);

  if (!inside) {
    return [];
  }

  if (onSectionRoot(ctx)) {
    // Before the shell, the shell is the only row.
    if (!hasAttr(openTagOf(ctx).masked, 'id')) {
      return [];
    }

    return loopsHere(ctx, (row) => hasPartialSet(ctx, row)).map((loop) => wrapInside(ctx, loop, inside));
  }

  if (node.tag === 'div') {
    return loopsHere(ctx, (row) => ROW_LOOP_TYPES.has(row.type)).map((loop) => wrapOnto(ctx, loop, inside));
  }

  if (node.tag === 'li' && scope?.length) {
    return loopsHere(ctx, (row) => row.type === 'replicator').map((loop) => wrapInside(ctx, loop, inside));
  }

  return [];
}

function loopsHere(ctx, keep) {
  return unusedFirst(ctx.source, rowsInScope(ctx).filter(keep));
}

/** The element under the caret is the wrapper: its attrs stay, the field's are added. */
function wrapOnto(ctx, loop, inside) {
  const { source, node } = ctx;
  const base = indentOf(source, node.from);
  const open = openTagOf(ctx);
  const head = withVisualEdit(withClass(open.text, open.masked, node.tag), wrapperEdit(loop));

  return suggestion(ctx, loop, inside, [head, ...loopLines(ctx, loop, `${base}${INDENT}`), `${base}</${node.tag}>`], 0);
}

/** A wrapper `<div>` inside the element under the caret, which stays as it is. */
function wrapInside(ctx, loop, inside) {
  const { source, node } = ctx;
  const base = indentOf(source, node.from);
  const div = `${base}${INDENT}`;

  return suggestion(
    ctx,
    loop,
    inside,
    [
      openTagOf(ctx).text,
      `${div}<div class="" ${wrapperEdit(loop)}>`,
      ...loopLines(ctx, loop, `${div}${INDENT}`),
      `${div}</div>`,
      `${base}</${node.tag}>`,
    ],
    1
  );
}

function wrapperEdit(loop) {
  return `{{ visual_edit field="${loop.var}" outline_inside="true" insertable="true" }}`;
}

/** `{{ var }}` … `{{ /var }}` at `indent`: the blocks' branches, or a `<div>` row around the fields. */
function loopLines(ctx, loop, indent) {
  const inner = `${indent}${INDENT}`;
  const body = hasPartialSet(ctx, loop)
    ? bodyLines(ctx.rows, loop, inner, 1, partialFor(ctx))
    : [
        `${inner}<div class="" {{ visual_edit orderable="true" }}>`,
        ...bodyLines(ctx.rows, loop, `${inner}${INDENT}`, 1, partialFor(ctx)),
        `${inner}</div>`,
      ];

  return [`${indent}{{ ${loop.var} }}`, ...body, `${indent}{{ /${loop.var} }}`];
}

/**
 * `wrapper` is the line the wrapper opens on. The caret lands at the end of a
 * line: a `<div>` row's opening tag (the wrapper, `{{ var }}`, the row), where
 * the row's markup goes on — or, for the blocks, the wrapper's closing tag,
 * since the partials are the whole body. Every line opened before the
 * wrapper closes after it, so its closing tag is as far from the end.
 */
function suggestion(ctx, loop, inside, lines, wrapper) {
  const { node } = ctx;
  const blocks = hasPartialSet(ctx, loop);
  const caretLine = blocks ? lines.length - 1 - wrapper : wrapper + 2;

  return {
    id: `${blocks ? 'blocks' : 'loop'}:${loop.var}`,
    key: blocks ? 'code_dock_help_blocks' : 'code_dock_help_loop',
    args: { name: loop.label || loop.var },
    meta: [loop.type, loop.value].filter(Boolean).join(' · '),
    changes: [{ from: node.from, to: inside.to, insert: lines.join('\n') }],
    selection: node.from + lines.slice(0, caretLine + 1).join('\n').length,
  };
}
