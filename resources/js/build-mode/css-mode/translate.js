/**
 * Style's fields speak in classes (`pt-[5rem]`, `flex`), the CSS mode's file in
 * declarations (`padding-top: 5rem`). This goes between the two, so the fields
 * stay as they are and no class ever reaches the file.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: build-mode/classes.js. Pure: what Tailwind compiles a class to is
 * handed in (`cssOf`, the site's catalog), so nothing here is a table of its own.
 * Bus messages: none.
 *
 * A class Tailwind builds on its own plumbing (`var(--tw-…)`: a shadow, a blur,
 * a gradient) has no plain CSS to write, and reads as none: `classToCss` says
 * null rather than leave Tailwind's variables in a file meant to be free of it.
 */

import { kindOf, rootOf, toClass } from '../classes.js';

/** `a: b; c: url(x;y)` → declarations, a `;` inside parentheses or quotes not ending one. */
export function parseDeclarations(text) {
  const source = String(text || '');
  const out = [];
  let start = 0;
  let depth = 0;
  let quote = '';

  const push = (end) => {
    const part = source.slice(start, end);
    const colon = part.indexOf(':');

    if (colon !== -1) {
      out.push({ prop: part.slice(0, colon).trim().toLowerCase(), value: part.slice(colon + 1).trim() });
    }
  };

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];

    if (quote) {
      quote = ch === quote ? '' : quote;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
    } else if (ch === ';' && depth <= 0) {
      push(i);
      start = i + 1;
    }
  }

  push(source.length);

  return out;
}

/** The declarations a class stands for, or null when it has no plain CSS. */
export function classToCss(name, cssOf) {
  const all = parseDeclarations(cssOf(name));
  const real = all.filter((decl) => !decl.prop.startsWith('--'));

  if (!real.length || real.some((decl) => /var\(--tw-/.test(decl.value))) {
    return null;
  }

  return real;
}

const same = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * The class a field reads a declaration as: the row of the property's scale
 * that compiles to it, else the value typed after the scale's root
 * (`pt-[5rem]`), else Tailwind's way of naming any property (`[inset:0]`). A
 * candidate that does not compile back to the declaration is not used.
 *
 * @param {string} prop
 * @param {string} value
 * @param {{ scale: (prop: string) => string[], cssOf: (name: string) => string }} catalog
 */
export function cssToClass(prop, value, { scale, cssOf }) {
  const names = scale(prop) || [];
  const says = (name) => {
    const decls = classToCss(name, cssOf);

    return !!decls && decls.length === 1 && decls[0].prop === prop && same(decls[0].value) === same(value);
  };
  const row = names.find(says);

  if (row) {
    return row;
  }

  const root = rootOf(names);
  const typed = root ? toClass(root, value, kindOf(prop)) : '';

  if (typed && says(typed)) {
    return typed;
  }

  return `[${prop}:${String(value).trim().replace(/\s+/g, '_')}]`;
}

/* ---------------- a style's value from a field ---------------- */

const NUMBERS = ['integer', 'float', 'range'];
const COLORS = ['theme_color_picker', 'color'];
const WORDS = ['select', 'button_group', 'icon_button_group', 'text'];

/**
 * The fieldtypes that can give a property its value: a colour takes a colour, a
 * length a number or words, an image one asset. Null for nothing that fits.
 */
export function fieldsFor(property) {
  const p = String(property || '');

  if (p === 'background-image') {
    return { types: ['assets'], single: true };
  }

  if (kindOf(p) === 'color') {
    return { types: COLORS };
  }

  if (/^(padding|margin|gap|row-gap|column-gap)/.test(p)) {
    return { types: [...NUMBERS, ...WORDS], length: true };
  }

  return p ? { types: WORDS } : null;
}

/**
 * The value a field's tag makes for a property: an image in `url()`, a length a
 * unit when the field gives a bare number (`{{ gap }}rem`), anything else as it is.
 */
export function boundValue(property, tag, { type = '', current = '', unit = 'rem' } = {}) {
  const fits = fieldsFor(property);

  if (property === 'background-image') {
    return `url(${tag})`;
  }

  return fits?.length && (NUMBERS.includes(type) || /^-?\d*\.?\d+$/.test(String(current).trim())) ? `${tag}${unit}` : tag;
}

/** How a Style field shows a value that comes from a field: `{{ gap }}rem` → `gap rem`. */
export function boundLabel(value) {
  return String(value || '')
    .replace(/^url\((.*)\)$/, '$1')
    .replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A value with its `{{ fields }}` filled by `lookup`; '' when one has nothing the page could use yet. */
export function fillValue(value, lookup) {
  let missing = false;
  const text = String(value || '').replace(/\{\{([\s\S]*?)\}\}/g, (all, body) => {
    const got = lookup(body);

    if (got === undefined || got === '') {
      missing = true;
    }

    return got ?? '';
  });

  return missing ? '' : text.trim();
}
