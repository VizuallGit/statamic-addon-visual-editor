/**
 * {{ visual_edit }} attribute snippets for the HTML dock's "Visual edit" dropdown.
 *
 * Unlike antlers-snippets.js (whole standalone {{ }} blocks), every entry here
 * is normally just an ATTRIBUTE. insertVisualEditSnippet() (in code-dock.js)
 * targets the HTML element the cursor/selection is on or inside — same
 * element htmlElementAtCursor() finds for the other HTML toolbar buttons —
 * and merges the attribute into that element's existing {{ visual_edit }}
 * tag, or opens a fresh one right after the tag name if it has none yet.
 * `standalone` overrides the text used for a fresh tag (only the base tag
 * item needs one; every attribute item derives its own as
 * `{{ visual_edit <attr> }}`).
 *
 * `|` marks the cursor, same convention as antlers-snippets.js.
 */

export const VISUAL_EDIT_TAG = 'visual_edit';

/**
 * Only the attributes actually used somewhere in this site's templates today
 * (checked with a grep count across resources/views), plus the base tag
 * itself — not the full VisualEdit.php surface. Trim ruthlessly: an option
 * nobody has picked once is a longer list to scan, not a feature in reserve.
 */
export const VISUAL_EDIT_SNIPPET_GROUPS = [
  { id: 'base', lang: 'code_dock_visual_edit_base' },
  { id: 'field', lang: 'code_dock_visual_edit_field' },
];

export const VISUAL_EDIT_SNIPPETS = [
  { id: 'tag', group: 'base', label: '{{ visual_edit }}', standalone: '{{ visual_edit| }}' },
  { id: 've_popup', group: 'base', label: 'popup', attr: 'popup="true"' },
  { id: 've_orderable', group: 'base', label: 'orderable', attr: 'orderable="true"' },
  { id: 've_section_orderable', group: 'base', label: 'section_orderable', attr: 'section_orderable="true"' },
  { id: 've_outline_inside', group: 'base', label: 'outline_inside', attr: 'outline_inside="true"' },

  { id: 've_field', group: 'field', label: 'field', attr: 'field="|"' },
  { id: 've_inline_edit', group: 'field', label: 'inline_edit', attr: 'inline_edit="true"' },
  { id: 've_insertable', group: 'field', label: 'insertable', attr: 'insertable="true"' },
  { id: 've_toolbar', group: 'field', label: 'toolbar', attr: 'toolbar="true"' },
  { id: 've_scope', group: 'field', label: 'scope', attr: 'scope="|"' },
  { id: 've_controls', group: 'field', label: 'controls', attr: 'controls="|"' },
];

export function visualEditSnippet(id) {
  return VISUAL_EDIT_SNIPPETS.find((item) => item.id === id) || null;
}

/**
 * The first {{ tagName ... }} block inside doc.slice(from, to), or null.
 * Used to check whether the HTML element the user clicked (its opening tag
 * spans [from, to)) already carries a {{ visual_edit }} annotation anywhere
 * in its attribute list — not just exactly at the text cursor.
 */
export function findVisualEditInRange(doc, from, to, tagName) {
  let cursor = from;

  while (cursor < to) {
    const openIdx = doc.indexOf('{{', cursor);

    if (openIdx === -1 || openIdx >= to) {
      return null;
    }

    const closeIdx = doc.indexOf('}}', openIdx + 2);

    if (closeIdx === -1 || closeIdx + 2 > to) {
      return null;
    }

    const inner = doc.slice(openIdx + 2, closeIdx);
    const name = inner.trim().split(/\s+/)[0] || '';

    if (name === tagName) {
      return { openIdx, closeIdx, inner };
    }

    cursor = closeIdx + 2;
  }

  return null;
}

/** Whether `inner` (a tag's content) already carries the named attribute. */
export function hasAttr(inner, attrRaw) {
  const name = String(attrRaw).split('=')[0].trim();

  return new RegExp(`(^|\\s)${name}(=|\\s|$)`).test(inner);
}
