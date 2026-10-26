/**
 * After `{{ visual_edit }}` is on a tag: its parts, one at a time, into that
 * same tag — the second step of the visual_edit flow (docs:
 * hjaelp-i-docken-tags.html). The list is the one the dock's visual_edit
 * button already has; help makes up no parameters. A part the tag already
 * carries is not offered again. `section_orderable` is a section's alone.
 *
 * «Point at a field» is a question, not a write: its row has no changes and
 * `after: 'visual-edit-field'`, and `visualEditFieldRows` is the answer — a
 * row per section field, each writing `field="…"`.
 *
 * Every row that writes comes back with `after: 'visual-edit'`, so the editor
 * asks again for what is left. Escape is how the author says they are done.
 *
 * Pure: the file and the element's opening tag in, rows out. May import
 * visual-edit-snippets.js for the tag's shape. Nothing from the dock.
 */
import { VISUAL_EDIT_TAG, findVisualEditInRange, hasAttr } from '../../visual-edit-snippets.js';

export const VISUAL_EDIT_PARTS = [
  { id: 'inline_edit', attr: 'inline_edit="true"', key: 'code_dock_help_ve_inline_edit' },
  { id: 'field', key: 'code_dock_help_ve_field' },
  { id: 'outline_inside', attr: 'outline_inside="true"', key: 'code_dock_help_ve_outline_inside' },
  { id: 'orderable', attr: 'orderable="true"', key: 'code_dock_help_ve_orderable' },
  { id: 'insertable', attr: 'insertable="true"', key: 'code_dock_help_ve_insertable' },
  { id: 'popup', attr: 'popup="true"', key: 'code_dock_help_ve_popup' },
  { id: 'toolbar', attr: 'toolbar="true"', key: 'code_dock_help_ve_toolbar' },
  { id: 'section_orderable', attr: 'section_orderable="true"', key: 'code_dock_help_ve_section_orderable', only: 'section' },
];

/**
 * The `{{ visual_edit … }}` inside an opening tag, with where a part goes:
 * right before its `}}`, after the last non-blank character.
 *
 * @param {string} source
 * @param {{ name: string, from: number, to: number }} open  the opening tag's range in `source`
 */
export function visualEditTagIn(source, open) {
  const tag = findVisualEditInRange(source, open.from, open.to, VISUAL_EDIT_TAG);

  if (!tag) {
    return null;
  }

  let at = tag.closeIdx;

  while (at > tag.openIdx + 2 && /\s/.test(source[at - 1])) {
    at--;
  }

  return { ...tag, at };
}

/** The parts the tag can still take. */
export function visualEditPartRows(source, open) {
  const tag = visualEditTagIn(source, open);

  if (!tag) {
    return [];
  }

  return VISUAL_EDIT_PARTS.filter((part) => (!part.only || part.only === open.name) && !hasAttr(tag.inner, part.id)).map(
    (part) =>
      part.attr
        ? partRow(tag, `ve:${part.id}`, part.key, {}, part.attr)
        : { id: `ve:${part.id}`, key: part.key, args: {}, meta: part.id, changes: [], selection: null, after: 'visual-edit-field' }
  );
}

/**
 * «Point at a field» answered: a row per field, writing `field="var"`.
 *
 * @param {Array<{ var: string, label?: string, type?: string }>} rows  the section's Data rows
 */
export function visualEditFieldRows(source, open, rows) {
  const tag = visualEditTagIn(source, open);

  if (!tag) {
    return [];
  }

  return rows.map((row) => partRow(tag, `ve:field:${row.var}`, 'code_dock_help_ve_field_name', { name: row.label || row.var }, `field="${row.var}"`));
}

function partRow(tag, id, key, args, attr) {
  return {
    id,
    key,
    args,
    meta: attr,
    changes: [{ from: tag.at, to: tag.closeIdx, insert: ` ${attr} ` }],
    // After the part, before the }} — where the next one goes.
    selection: tag.at + 1 + attr.length,
    after: 'visual-edit',
  };
}
