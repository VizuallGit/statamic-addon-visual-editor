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
 * May import: html-tree-parse.js, build-mode/attrs.js, data-var-types.js, tw-parse.js, lib/retag.js. Pure.
 */
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import { attributeList } from '../build-mode/attrs.js';
import { wholeTag } from '../data-var-types.js';
import { appendToken, readClassAttr, splitClass, tokenizeClassValue, writeClassValue } from '../tw-parse.js';
import { tagAt } from './retag.js';

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

  const chain = rows
    .filter((row) => row.tag && row.from <= self.from && row.to >= self.to)
    .sort((a, b) => b.from - a.from);
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
      const values = attr.bare
        ? [null]
        : field !== null
          ? fieldOptions(model, fieldName)
          : attr.value.includes('{{')
            ? []
            : [attr.value];

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

/* ---------------- placement that follows a field ---------------- */

/**
 * The attribute on a tag that prints a field whole — `data-position="{{ image_position }}"` —
 * as `{ key, field }`, the first such one; null when the tag has none. A section
 * that says its field this way has a placement per value of it.
 */
export function fieldDataAttr(html, node) {
  for (const attr of attributeList(html, node)) {
    const name = attr.name.toLowerCase();
    const key = name.slice(5);
    const field = attr.bare ? null : wholeTag(attr.value);

    if (name.startsWith('data-') && !name.startsWith('data-sve-') && SAFE.test(key) && field !== null) {
      return { key, field: field.split('|')[0].trim() };
    }
  }

  return null;
}

/** `image_position` as a person reads it: `Image position`. */
export function fieldLabel(handle) {
  const words = String(handle || '')
    .replace(/[_-]+/g, ' ')
    .trim();

  return words ? words[0].toUpperCase() + words.slice(1) : '';
}

/**
 * The placement scope of what stands inside an element that says a field's
 * value (`fieldDataAttr`), as that field stands now (`value`, read off the
 * page): the variant a column, a row, a span or an order is written under, and
 * what the panel says. Null when the value is not one a class can carry.
 */
export function placementScope({ key, field }, value, from) {
  const now = String(value ?? '').trim();

  if (!SAFE.test(now)) {
    return null;
  }

  return {
    from,
    key,
    field,
    value: now,
    variant: `group-data-[${key}=${now}]`,
    label: `${fieldLabel(field)} = ${now[0].toUpperCase()}${now.slice(1)}`,
  };
}

/** The file with the tag starting at `from` given the class `group` — unchanged when it has it, or is no tag. */
export function withGroup(html, from) {
  const source = String(html || '');
  const el = tagAt(source, from);
  const value = el ? readClassAttr(source, el.from, el.openTo)?.value || '' : '';

  if (!el || tokenizeClassValue(value).some((token) => token.text === 'group')) {
    return source;
  }

  return writeClassValue(source, el, appendToken(value, 'group'));
}

/**
 * A class value with one of `names` set under `variants` (`['md', 'group-data-[position=right]']`):
 * what was there of them under the same variants taken off, `name` (or nothing, null) put on.
 * Classes under other variants, and every other class, stay where they are.
 */
export function withOneOfUnder(value, names, name, variants) {
  const prefix = variants.filter(Boolean).join(':');
  let out = String(value || '');
  const tokens = tokenizeClassValue(out);

  // Back to front, so the offsets of what is left to look at hold.
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const token = tokens[i];
    const { variants: has, base } = token.dynamic ? { variants: null, base: '' } : splitClass(token.text);

    if (!has || has.join(':') !== prefix || !names.includes(base)) {
      continue;
    }

    let from = token.from;
    let to = token.to;

    while (from > 0 && /[ \t]/.test(out[from - 1])) {
      from -= 1;
    }

    if (from === 0) {
      while (to < out.length && /[ \t]/.test(out[to])) {
        to += 1;
      }
    }

    out = out.slice(0, from) + out.slice(to);
  }

  return name ? appendToken(out, prefix ? `${prefix}:${name}` : name) : out;
}
