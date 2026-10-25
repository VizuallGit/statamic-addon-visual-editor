/**
 * Images. A file field is never written as `<img>` by hand: the house draws
 * it with the image partial (`ctx.blockPartials.image`, from PHP — only when
 * the site has the file), which also draws the placeholder when the field
 * is empty — so no `{{ if }}` around it.
 *
 *   div  empty → the media wrapper around one image line
 *   img        → the image line in the tag's place
 *
 * And an `<img>` written by hand gets what it lacks: src, lazy loading, alt.
 */
import {
  ASSET_TYPES,
  INDENT,
  afterName,
  emptyInside,
  hasAttr,
  indentOf,
  openTagOf,
  rowsInScope,
  staticClass,
  unusedFirst,
  withClass,
  withVisualEdit,
} from './context.js';

export function mediaRule(ctx) {
  const { source, node } = ctx;
  const partial = ctx.blockPartials.image;
  const inside = node.tag === 'div' ? emptyInside(ctx) : null;

  if (!partial || (node.tag !== 'img' && !inside)) {
    return [];
  }

  const files = unusedFirst(source, rowsInScope(ctx).filter((row) => ASSET_TYPES.has(row.type)));

  return files.map((row) => {
    const insert = inside ? wrapper(ctx, row, partial).join('\n') : imageLine(partial, row, staticClass(source, node));

    return {
      id: `media:${row.var}`,
      key: 'code_dock_help_media',
      args: { name: row.label || row.var },
      meta: row.value || partial,
      changes: [{ from: node.from, to: inside ? inside.to : node.to, insert }],
      selection: node.from + insert.length,
    };
  });
}

function wrapper(ctx, row, partial) {
  const base = indentOf(ctx.source, ctx.node.from);
  const open = openTagOf(ctx);
  const head = withVisualEdit(
    withClass(open.text, open.masked, 'div'),
    `{{ visual_edit field="${row.var}" outline_inside="true" inline_edit="true" }}`
  );

  return [head, `${base}${INDENT}${imageLine(partial, row, '')}`, `${base}</div>`];
}

function imageLine(partial, row, klass) {
  return `{{ partial:${partial} :imagePath="${row.var}" class="${klass}" }}`;
}

/** `src`, `loading` and `alt` where they are missing — or, with a src, the alt alone. */
export function imgRule(ctx) {
  const { node } = ctx;

  if (node.tag !== 'img') {
    return [];
  }

  const open = openTagOf(ctx);

  if (!hasAttr(open.masked, 'src')) {
    const attrs = ['src=""', !hasAttr(open.masked, 'loading') && 'loading="lazy"', !hasAttr(open.masked, 'alt') && 'alt=""']
      .filter(Boolean)
      .join(' ');

    return [attrRow(ctx, open, 'img-attrs', 'code_dock_help_img_attrs', attrs, 'src')];
  }

  return hasAttr(open.masked, 'alt') ? [] : [attrRow(ctx, open, 'alt', 'code_dock_help_alt', 'alt=""', 'alt')];
}

/** Written after the tag name, like the id; the caret between the quotes of `first`. */
function attrRow(ctx, open, id, key, attrs, first) {
  const next = afterName(open.text, 'img', attrs);

  return {
    id,
    key,
    args: {},
    meta: attrs,
    changes: [{ from: ctx.node.from, to: ctx.node.openTo, insert: next }],
    selection: ctx.node.from + `<img ${first}="`.length,
  };
}
