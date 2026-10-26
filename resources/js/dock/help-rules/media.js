/**
 * `<img>` and `<video>` stay the tags they are. Without a src, each file
 * field that prints here is a source row — the src from the field's url, the
 * visual_edit pointed at the field — and «Add a source» an empty one to
 * write by hand. An `<img>` then gets what it lacks, a row each: alt and
 * lazy loading. Only what is missing is written.
 */
import { ASSET_TYPES, afterName, hasAttrName, openTagOf, rowsInScope, unusedFirst, withVisualEdit } from './context.js';

export const SOURCE_TAGS = new Set(['img', 'video']);

export function sourceRule(ctx) {
  const { source, node } = ctx;

  if (!SOURCE_TAGS.has(node.tag)) {
    return [];
  }

  const open = openTagOf(ctx);

  if (hasAttrName(open.masked, 'src')) {
    return [];
  }

  const files = unusedFirst(source, rowsInScope(ctx).filter((row) => ASSET_TYPES.has(row.type)));
  const out = files.map((row) => {
    const url = `{{ ${row.var}:url }}`;
    const next = withVisualEdit(afterName(open.text, node.tag, `src="${url}"`), `{{ visual_edit field="${row.var}" }}`);

    return {
      id: `${node.tag}-src:${row.var}`,
      key: 'code_dock_help_source',
      args: { name: row.label || row.var },
      meta: row.value || url,
      changes: [{ from: node.from, to: node.openTo, insert: next }],
      selection: node.from + next.length,
    };
  });

  out.push(attrRow(ctx, open, 'src', 'code_dock_help_src', 'src=""', true));

  return out;
}

/** An `<img>`'s alt and lazy loading, where they are missing. */
export function imgRule(ctx) {
  if (ctx.node.tag !== 'img') {
    return [];
  }

  const open = openTagOf(ctx);

  return [
    !hasAttrName(open.masked, 'alt') && attrRow(ctx, open, 'alt', 'code_dock_help_alt', 'alt=""', true),
    !hasAttrName(open.masked, 'loading') && attrRow(ctx, open, 'lazy', 'code_dock_help_lazy', 'loading="lazy"', false),
  ].filter(Boolean);
}

/** Written after the tag name, like the id; the caret between its quotes when it is empty, after it otherwise. */
function attrRow(ctx, open, id, key, attr, empty) {
  const { node } = ctx;
  const next = afterName(open.text, node.tag, attr);

  return {
    id,
    key,
    args: {},
    meta: attr,
    changes: [{ from: node.from, to: node.openTo, insert: next }],
    selection: node.from + 1 + node.tag.length + 1 + attr.length - (empty ? 1 : 0),
  };
}
