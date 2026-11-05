/**
 * Style's Data states: the data attributes on the picked element and on the
 * elements around it, and each value one can take — the variant a class is
 * written under, so the class holds only while the attribute says so.
 *
 *   <section class="group" data-position="{{ image_position }}">
 *     <div class="group-data-[position=left]:order-first">   ← the picked element
 *
 * A value is a field's when the attribute prints one: its options are the
 * values (DataVars/Rows.php `options` — a select, button_group or radio). A
 * typed value is its own one value; a bare attribute is there or not
 * (`data-[open]`). On the element itself the variant is `data-[…]`; on one
 * around it `group-data-[…]`, and that element wears `group` (tw-classes.js
 * adds it when the state is picked).
 *
 * May import: html-tree-parse.js, build-mode/attrs.js, data-var-types.js. Pure.
 */
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import { attributeList } from '../build-mode/attrs.js';
import { wholeTag } from '../data-var-types.js';

/** What a Tailwind data variant can carry without quotes. */
const SAFE = /^[A-Za-z0-9_-]+$/;
const VARIANT = /^(group-)?data-\[([^=\]]+)(?:=([^\]]+))?\]$/;

function fieldOptions(model, name) {
  const items = (groups) => (groups || []).flatMap((group) => group.items || []);
  const rows = [...(model?.section || []), ...items(model?.scope), ...items(model?.page), ...items(model?.site)];

  return rows.find((row) => row.var === name && Array.isArray(row.options))?.options || [];
}

/**
 * The states, the nearest element's first: `{ id, key, value, own, tag, from, field }` —
 * `id` the variant (`group-data-[position=left]`), `from` where the element
 * carrying the attribute starts in the file.
 */
export function dataStates(html, at, model) {
  const source = String(html || '');
  const rows = flattenHtmlTree(parseHtmlTree(source), new Set());
  const self = rows.find((row) => row.from === at && row.tag);

  if (!self) {
    return [];
  }

  const chain = rows.filter((row) => row.tag && row.from <= self.from && row.to >= self.to).sort((a, b) => b.from - a.from);
  const out = [];
  const seen = new Set();

  for (const el of chain) {
    const own = el.from === self.from;

    for (const attr of attributeList(source, el)) {
      const name = attr.name.toLowerCase();
      const key = name.slice(5);

      if (!name.startsWith('data-') || name.startsWith('data-sve-') || attr.unquoted || !SAFE.test(key)) {
        continue;
      }

      const field = attr.bare ? null : wholeTag(attr.value);
      const fieldName = field ? field.split('|')[0].trim() : '';
      const values = attr.bare ? [null] : field !== null ? fieldOptions(model, fieldName) : attr.value.includes('{{') ? [] : [attr.value];

      for (const value of values) {
        if (value !== null && !SAFE.test(value)) {
          continue;
        }

        const id = `${own ? '' : 'group-'}data-[${value === null ? key : `${key}=${value}`}]`;

        if (!seen.has(id)) {
          seen.add(id);
          out.push({ id, key, value, own, tag: el.tag, from: el.from, field: fieldName });
        }
      }
    }
  }

  return out;
}

/** Whether a state is a Data state (`data-[…]`, `group-data-[…]`). */
export function isDataState(variant) {
  return VARIANT.test(String(variant || ''));
}

/** A Data state as it reads: `position = left`, `open`; '' for any other state. */
export function dataStateLabel(variant) {
  const m = VARIANT.exec(String(variant || ''));

  return m ? (m[3] ? `${m[2]} = ${m[3]}` : m[2]) : '';
}
