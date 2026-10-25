/**
 * An element with nothing but text in it, filled from a text field instead —
 * and made editable in the preview.
 */
import { BLOCK_TEXT_TYPES, TEXT_TYPES, emptyInside, openTagOf, rowsInScope, unusedFirst, withVisualEdit } from './context.js';

/** Elements that hold a line of text. */
export const TEXT_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'a', 'li', 'strong', 'em', 'small',
  'blockquote', 'figcaption', 'label', 'button', 'td', 'th', 'dt', 'dd',
]);

/** How many text fields one answer offers. */
const TEXT_ROWS = 2;

export function textRule(ctx) {
  const { source, node, close } = ctx;

  if (!TEXT_TAGS.has(node.tag)) {
    return [];
  }

  // Closed: plain text or nothing inside, which the field replaces. Just typed: nothing yet.
  const to = close >= 0 ? (node.children.length || source.slice(node.openTo, close).includes('{{') ? null : node.to) : emptyInside(ctx)?.to;

  if (to == null) {
    return [];
  }

  const texts = unusedFirst(source, rowsInScope(ctx).filter((row) => TEXT_TYPES.has(row.type))).slice(0, TEXT_ROWS);

  return texts.map((row) => {
    // Bard and Markdown render their own <p>s; inside a <p> the browser splits
    // the page's markup, and a click lands on the wrong element.
    const tag = node.tag === 'p' && BLOCK_TEXT_TYPES.has(row.type) ? 'div' : node.tag;
    const open = openTagOf(ctx);
    const renamed = tag === node.tag ? open.text : `<${tag}${open.text.slice(1 + node.tag.length)}`;
    const head = withVisualEdit(renamed, `{{ visual_edit field="${row.var}" inline_edit="true" }}`);
    const body = `{{ ${row.var} }}`;
    const insert = `${head}${body}</${tag}>`;

    return {
      id: `text:${row.var}`,
      key: 'code_dock_help_text',
      args: { name: row.label || row.var },
      meta: row.value || body,
      changes: [{ from: node.from, to, insert }],
      selection: node.from + head.length + body.length,
    };
  });
}
