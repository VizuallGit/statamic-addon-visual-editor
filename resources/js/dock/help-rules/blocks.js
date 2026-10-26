/**
 * A loop field's wrapper: the element that carries the field and holds the
 * loop, with a `<div>` per row the way the list rule writes `<li>`s and
 * every set written field by field (bodyLines). Never on the section — a
 * loop lies in an element inside it:
 *
 *   div  empty → the div is the wrapper, for any loop field here
 *   li   empty, in a field loop → a wrapper `<div>` inside it, for a
 *        replicator in the loop's row
 */
import {
  INDENT,
  ROW_LOOP_TYPES,
  bodyLines,
  emptyInside,
  indentOf,
  openTagOf,
  rowsInScope,
  unusedFirst,
  withClass,
  withVisualEdit,
} from './context.js';

export function blocksRule(ctx) {
  const { node, scope } = ctx;
  const inside = emptyInside(ctx);

  if (!inside) {
    return [];
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

/** `{{ var }}` … `{{ /var }}` at `indent`, a `<div>` row around the fields. */
function loopLines(ctx, loop, indent) {
  const inner = `${indent}${INDENT}`;

  return [
    `${indent}{{ ${loop.var} }}`,
    `${inner}<div class="" {{ visual_edit orderable="true" }}>`,
    ...bodyLines(ctx.rows, loop, `${inner}${INDENT}`, 1),
    `${inner}</div>`,
    `${indent}{{ /${loop.var} }}`,
  ];
}

/**
 * `wrapper` is the line the wrapper opens on. The caret lands at the end of
 * the row's opening tag (the wrapper, `{{ var }}`, the row), where the
 * row's markup goes on.
 */
function suggestion(ctx, loop, inside, lines, wrapper) {
  const { node } = ctx;

  return {
    id: `loop:${loop.var}`,
    key: 'code_dock_help_loop',
    args: { name: loop.label || loop.var },
    meta: [loop.type, loop.value].filter(Boolean).join(' · '),
    changes: [{ from: node.from, to: inside.to, insert: lines.join('\n') }],
    selection: node.from + lines.slice(0, wrapper + 3).join('\n').length,
  };
}
