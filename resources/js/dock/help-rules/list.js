/**
 * `<ul>` / `<ol>` with nothing in it: the list, its rows and their fields,
 * over each of the loop fields that print here.
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

export const LIST_TAGS = new Set(['ul', 'ol']);

export function listRule(ctx) {
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
