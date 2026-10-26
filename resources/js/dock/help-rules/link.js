/**
 * `<a>` without an href: one row per field that holds a URL — a link field,
 * or a field named url — and «Add a URL» beside them, an empty href to write
 * by hand. The href alone: the link's text is the text rule's row.
 */
import { LINK_TYPES, afterName, hasAttrName, openTagOf, rowsInScope, unusedFirst } from './context.js';

/** A field whose value is a URL. */
export function isUrlField(row) {
  return LINK_TYPES.has(row.type) || row.var === 'url';
}

export function linkRule(ctx) {
  const { source, node } = ctx;

  if (node.tag !== 'a') {
    return [];
  }

  const open = openTagOf(ctx);

  if (hasAttrName(open.masked, 'href')) {
    return [];
  }

  const out = unusedFirst(source, rowsInScope(ctx).filter(isUrlField)).map((row) => {
    const next = afterName(open.text, 'a', `href="{{ ${row.var} }}"`);

    return {
      id: `url:${row.var}`,
      key: 'code_dock_help_url',
      args: { name: row.label || row.var },
      meta: row.value || `{{ ${row.var} }}`,
      changes: [{ from: node.from, to: node.openTo, insert: next }],
      // Inside the link, where its text goes.
      selection: node.from + next.length,
    };
  });

  const next = afterName(open.text, 'a', 'href=""');

  out.push({
    id: 'href',
    key: 'code_dock_help_add_url',
    args: {},
    meta: 'href=""',
    changes: [{ from: node.from, to: node.openTo, insert: next }],
    selection: node.from + '<a href="'.length,
  });

  return out;
}
