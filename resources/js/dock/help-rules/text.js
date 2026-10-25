/**
 * An element with nothing but text in it, filled from a text field instead —
 * and made editable in the preview.
 */
import {
  BLOCK_TEXT_TYPES,
  TEXT_TYPES,
  TITLE_HANDLE,
  emptyInside,
  openTagOf,
  rowsInScope,
  unusedFirst,
  withVisualEdit,
} from './context.js';

/** Elements that hold a line of text. */
export const TEXT_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'li', 'strong', 'em', 'small',
  'blockquote', 'figcaption', 'label', 'button', 'td', 'th', 'dt', 'dd',
]);

const HEADING = /^h[1-6]$/;

/** How many text fields one answer offers. */
const TEXT_ROWS = 2;

/**
 * Whether a field's text belongs in the element: a `<div>` holds blocks —
 * Bard or Markdown, never a line; a `<button>` holds a line, never blocks.
 */
function fits(tag, row) {
  if (tag === 'div') {
    return BLOCK_TEXT_TYPES.has(row.type);
  }

  return TEXT_TYPES.has(row.type) && !(tag === 'button' && BLOCK_TEXT_TYPES.has(row.type));
}

export function textRule(ctx) {
  const { source, node, close, scope } = ctx;

  if (!TEXT_TAGS.has(node.tag) && node.tag !== 'div') {
    return [];
  }

  // An <li> outside a loop is one fixed item, not a field's row.
  if (node.tag === 'li' && !scope?.length) {
    return [];
  }

  // Closed: plain text or nothing inside, which the field replaces. Just typed: nothing yet.
  const to = close >= 0 ? (node.children.length || source.slice(node.openTo, close).includes('{{') ? null : node.to) : emptyInside(ctx)?.to;

  if (to == null) {
    return [];
  }

  const rows = unusedFirst(source, rowsInScope(ctx).filter((row) => fits(node.tag, row)));
  // A heading's own field first; the sort keeps «unused first» inside each group.
  const ordered = HEADING.test(node.tag) ? [...rows].sort((a, b) => Number(TITLE_HANDLE.test(b.var)) - Number(TITLE_HANDLE.test(a.var))) : rows;

  return ordered.slice(0, TEXT_ROWS).map((row) => {
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
