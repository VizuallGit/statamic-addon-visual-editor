/**
 * Attributes on the element under the caret: a class where there is none,
 * and — last of all, as the row least often wanted — an id.
 */
import { afterName, hasAttr, openTagOf, staticClass } from './context.js';

/** A class where there is none: the one the same tag above wears, or empty. */
export function classRule(ctx, offered) {
  const { node, siblings, index } = ctx;
  const open = openTagOf(ctx);

  // The section's root gets its class with the shell.
  if (hasAttr(open.masked, 'class') || offered.some((item) => item.id === 'shell')) {
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
    // Between the quotes, where the picker or the Tailwind list opens.
    selection: node.from + 1 + node.tag.length + ' class="'.length,
    after: 'class',
  });

  return out;
}

/**
 * An id where there is none — empty, with the caret between the quotes.
 * Not inside a loop: markup that repeats cannot share one id. Not where the
 * shell is offered: a section root's id is `id-{{ id }}`, and the shell
 * writes it.
 */
export function idRule(ctx, offered) {
  const { node, scope } = ctx;
  const open = openTagOf(ctx);

  if (hasAttr(open.masked, 'id') || !scope || scope.length || offered.some((item) => item.id === 'shell')) {
    return [];
  }

  const next = afterName(open.text, node.tag, 'id=""');

  return [
    {
      id: 'id',
      key: 'code_dock_help_id',
      args: {},
      meta: 'id=""',
      changes: [{ from: node.from, to: node.openTo, insert: next }],
      selection: node.from + 1 + node.tag.length + ' id="'.length,
    },
  ];
}
