/**
 * `<a>`: its href from a link field, the site's links block in its place, or
 * an empty href to write by hand — before the class, since an `<a>` without
 * one is not a link yet.
 */
import {
  BLOCK_TEXT_TYPES,
  LINK_TYPES,
  TEXT_TYPES,
  afterName,
  blockPartialSrc,
  emptyInside,
  hasAttr,
  hasBlockPartial,
  openTagOf,
  rowsInScope,
  rowsOfLoop,
  unusedFirst,
  withVisualEdit,
} from './context.js';

export function linkRule(ctx) {
  const { source, node } = ctx;

  if (node.tag !== 'a') {
    return [];
  }

  const open = openTagOf(ctx);
  const inScope = rowsInScope(ctx);
  const links = unusedFirst(source, inScope.filter((row) => LINK_TYPES.has(row.type)));
  const inside = emptyInside(ctx);
  const hasHref = hasAttr(open.masked, 'href');
  const out = [];

  if (inside && !hasHref) {
    // A line of text: Bard and Markdown render blocks, which an <a> cannot hold.
    const text = unusedFirst(source, inScope.filter((row) => TEXT_TYPES.has(row.type) && !BLOCK_TEXT_TYPES.has(row.type)))[0];
    const body = text ? `{{ ${text.var} }}` : '';

    for (const row of links) {
      const head = withVisualEdit(afterName(open.text, 'a', `href="{{ ${row.var} }}"`), `{{ visual_edit field="${row.var}" }}`);

      out.push({
        id: `link:${row.var}`,
        key: 'code_dock_help_link',
        args: { name: row.label || row.var },
        meta: row.value || `{{ ${row.var} }}`,
        changes: [{ from: node.from, to: inside.to, insert: `${head}${body}</a>` }],
        selection: node.from + head.length + body.length,
      });
    }
  }

  if (inside && hasBlockPartial(ctx, 'links') && inScope.some(isLinksField(ctx))) {
    const src = blockPartialSrc(ctx, 'links');
    const insert = `{{ partial src="${src}" }}`;

    // The partial writes its own <a>s; this one goes.
    out.push({
      id: 'links-partial',
      key: 'code_dock_help_links_partial',
      args: {},
      meta: src,
      changes: [{ from: node.from, to: inside.to, insert }],
      selection: node.from + insert.length,
    });
  }

  if (!hasHref && !links.length) {
    const next = afterName(open.text, 'a', 'href=""');

    out.push({
      id: 'href',
      key: 'code_dock_help_href',
      args: {},
      meta: 'href=""',
      changes: [{ from: node.from, to: node.openTo, insert: next }],
      selection: node.from + '<a href="'.length,
    });
  }

  return out;
}

/** The `links` replicator the links partial loops over: a set of it holds a link field. */
function isLinksField(ctx) {
  return (row) =>
    row.var === 'links' &&
    row.type === 'replicator' &&
    rowsOfLoop(ctx.rows, row).some((group) => group.rows.some((field) => LINK_TYPES.has(field.type)));
}
