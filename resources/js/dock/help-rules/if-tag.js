/**
 * On a bare `{{ if }}` the question is which field it tests, and only that:
 * a row per field that prints here, the way the loop panel offers the
 * section's. «If Media» writes the pair around an empty line, the caret on
 * it — or, for an `{{ if }}` that closes already, the condition alone.
 *
 * Not an empty if, not an elseif, not an `{{ if }}` inside an attribute.
 */
import { INDENT, indentOf, rowsInScope } from './context.js';

const BARE_IF = /\{\{\s*if\s*\}\}/g;

/** The bare `{{ if }}` the caret is on (at its end counts), or null. */
export function bareIfAt(source, pos) {
  BARE_IF.lastIndex = 0;

  let match;

  while ((match = BARE_IF.exec(source))) {
    if (pos >= match.index && pos <= match.index + match[0].length) {
      return { from: match.index, to: match.index + match[0].length };
    }
  }

  return null;
}

export function ifTagRule(ctx) {
  const { source, node, blocks } = ctx;
  const tag = bareIfAt(source, ctx.pos);

  if (!tag || tag.from < node.openTo) {
    return [];
  }

  const closed = blocks.some((block) => block.kind === 'if' && block.name === 'if' && block.from === tag.from);
  const indent = indentOf(source, tag.from);

  return rowsInScope(ctx).map((row) => {
    const lines = closed ? [`{{ if ${row.var} }}`] : [`{{ if ${row.var} }}`, `${indent}${INDENT}`, `${indent}{{ /if }}`];

    return {
      id: `if:${row.var}`,
      key: 'code_dock_help_if',
      args: { name: row.label || row.var },
      meta: row.type,
      changes: [{ from: tag.from, to: tag.to, insert: lines.join('\n') }],
      selection: tag.from + lines.slice(0, 2).join('\n').length,
    };
  });
}
