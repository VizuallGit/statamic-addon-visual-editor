/**
 * What a designer types into a Style field, as the Tailwind class for it.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: tw-parse.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * Everything else about classes is the dock's: which family a class belongs
 * to and what it replaces is tw-families.js (the site's own Tailwind
 * catalog), and writing it onto the picked tag is tw-classes.js
 * (`twSetClass`, `twAddClass`, `twReplaceClasses`) — the same functions the
 * Tailwind pane's buttons call, so a class set from Build and one set from
 * the dock are the same edit. This file only adds what the dock has no door
 * for yet: a value typed by hand.
 *
 * A token (`500`), a value (`10px`, `calc(1rem + 2vw)`) or a custom property
 * (`--gutter`, `var(--gutter)`) becomes `pbs-500`, `pbs-[10px]`,
 * `pbs-[calc(1rem_+_2vw)]`, `pbs-(--gutter)`; read back, the class shows the
 * same text again.
 */

import { splitClass, splitUtility, tokenizeClassValue } from '../tw-parse.js';

const COLOR_LITERAL = /^(#|rgb|hsl|hwb|lab|lch|oklab|oklch|color\(|color-mix\()/i;

const DIM_WORDS = { auto: 'auto', '100%': 'full', 'fit-content': 'fit', 'min-content': 'min', 'max-content': 'max' };
const DIM_BACK = { full: '100%', fit: 'fit-content', min: 'min-content', max: 'max-content' };
const DIM_PREFIXES = new Set(['w', 'h', 'min-w', 'max-w', 'min-h', 'max-h', 'size']);

/** How a bare value reads, from the CSS property the field sets. */
export function kindOf(property) {
  const p = String(property || '');

  if (p === 'font-size') {
    return 'size';
  }

  if (/color$/.test(p) || p === 'fill' || p === 'stroke') {
    return 'color';
  }

  if (/^(min-|max-)?(width|height|inline-size|block-size)$/.test(p)) {
    return 'dim';
  }

  return 'space';
}

export const isColorValue = (v) => COLOR_LITERAL.test(String(v || '').trim());

/**
 * What the designer typed → the utility, without variants.
 *
 * - a token, as the site's scale names it: `500`, `2.5`, `1/2`, `primary`, `gray-600`, `auto`
 * - a custom property, bare or in `var()`: `(--gutter)`; a font size is `(length:--x)`
 * - anything else is a value: `[10px]`, `[calc(1rem_+_2vw)]` — spaces become `_`
 *
 * A size or colour Tailwind could not tell apart on its own carries the type
 * in the brackets (`text-[length:clamp(…)]`), the way Tailwind's docs write it.
 *
 * @param {string} prefix  the utility's root for the property (`pbs`, `text`, `w`) — the catalog's
 * @param {string} kind    kindOf(property)
 */
export function toClass(prefix, raw, kind = 'space') {
  const v = String(raw ?? '').trim();

  if (!v || !prefix) {
    return null;
  }

  const variable = /^(?:var\(\s*)?(--[\w-]+)\s*\)?$/.exec(v);

  if (variable) {
    return kind === 'size' ? `${prefix}-(length:${variable[1]})` : `${prefix}-(${variable[1]})`;
  }

  if (kind === 'dim' && DIM_WORDS[v]) {
    return `${prefix}-${DIM_WORDS[v]}`;
  }

  if (/^\d+(\.\d+)?$/.test(v) || /^\d+\/\d+$/.test(v) || /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(v)) {
    return `${prefix}-${v}`;
  }

  const inner = v.replace(/\s+/g, '_');

  if (kind === 'size' && !/^-?\.?\d/.test(v)) {
    return `${prefix}-[length:${inner}]`;
  }

  if (kind === 'color' && !isColorValue(v)) {
    return `${prefix}-[color:${inner}]`;
  }

  return `${prefix}-[${inner}]`;
}

/** The utility (variants are ignored) → what the field shows. */
export function fromClass(name, prefix) {
  const { base } = splitClass(name);
  const n = splitUtility(base).name;

  if (!n) {
    return '';
  }

  const rest = prefix && n.startsWith(`${prefix}-`) ? n.slice(prefix.length + 1) : n.slice(n.indexOf('-') + 1);
  let m;

  if ((m = /^\[(?:length:|color:)?(.+)\]$/.exec(rest))) {
    return m[1].replace(/_/g, ' ');
  }

  if ((m = /^\((?:length:|color:)?(--[\w-]+)\)$/.exec(rest))) {
    return `var(${m[1]})`;
  }

  if (DIM_PREFIXES.has(prefix) && DIM_BACK[rest]) {
    return DIM_BACK[rest];
  }

  return rest;
}

/**
 * The utility's root, from the classes of the property's scale — what a typed
 * value is written after. `pbs-100 pbs-200` → `pbs`, `text-primary
 * text-gray-600` → `text`, `min-w-0 min-w-full` → `min-w`. The scale is the
 * catalog's (`optionsForProperty`), so it is the site's Tailwind that says
 * which root a property has, not a table here. One class alone is cut at its
 * last dash.
 */
export function rootOf(names) {
  const list = (Array.isArray(names) ? names : [names]).map((n) => splitUtility(splitClass(n).base).name).filter(Boolean);

  if (!list.length) {
    return '';
  }

  if (list.length === 1) {
    const at = list[0].lastIndexOf('-');

    return at > 0 ? list[0].slice(0, at) : '';
  }

  const parts = list.map((n) => n.split('-'));
  const out = [];

  for (let i = 0; i < parts[0].length - 1; i += 1) {
    if (!parts.every((p) => p.length > i + 1 && p[i] === parts[0][i])) {
      break;
    }

    out.push(parts[0][i]);
  }

  return out.join('-');
}

/**
 * The root one class was written with: the scale's when it starts with it,
 * else up to an arbitrary value (`w-[calc(100%-2rem)]` → `w`), else up to its
 * last dash. A physical class shown in a logical field (`pt-800` under
 * padding-block-start) keeps its own root.
 */
export function rootFor(name, scale = []) {
  const n = splitUtility(splitClass(name).base).name;
  const fromScale = rootOf(scale);

  if (fromScale && n.startsWith(`${fromScale}-`)) {
    return fromScale;
  }

  const bracket = n.search(/-[[(]/);

  return bracket > 0 ? n.slice(0, bracket) : rootOf([n]);
}

/* ------------------------------------------------------------------ *
 * Margin and padding, one box
 * ------------------------------------------------------------------ */

/**
 * Which of the dock's box tools a side writes, by the box's link: `''` each
 * side on its own, `all` the four together, `block` top and bottom together,
 * `inline` the two sides together. The ids are the dock's own
 * (`padding-block-start`, `padding-block`, `padding-all` — `boxKids` in
 * code-dock.js), so a side is always one of the tools the Tailwind pane has.
 */
export const SIDES = ['block-start', 'inline-end', 'block-end', 'inline-start'];

export function sideTool(box, side, link = '') {
  const axis = side.startsWith('block') ? 'block' : 'inline';

  if (link === 'all') {
    return `${box}-all`;
  }

  if (link === axis) {
    return `${box}-${axis}`;
  }

  return `${box}-${side}`;
}

/** What a side shows when nothing sets it directly: its axis, then all four. */
export function sideFallbackTools(box, toolId) {
  if (toolId === `${box}-all`) {
    return [];
  }

  if (toolId === `${box}-block` || toolId === `${box}-inline`) {
    return [`${box}-all`];
  }

  return [`${box}-${toolId.includes('-block-') ? 'block' : 'inline'}`, `${box}-all`];
}

/* ------------------------------------------------------------------ *
 * Sizes
 * ------------------------------------------------------------------ */

/**
 * The variant keys a size reads through, nearest first, from the editor's
 * own breakpoint list (`breakpoints()` in breakpoints.js: widest first, each
 * row with its `tw` variant, `base` and `direction`). `null` is All: the base
 * alone. Desktop-first, Mobile reads `max-md`, then `max-lg`, then the base.
 */
export function variantChain(rows, handle) {
  const list = Array.isArray(rows) ? rows : [];
  const cascade = list[0]?.direction === 'mobile' ? [...list].reverse() : list;
  const at = handle ? cascade.findIndex((row) => row.handle === handle) : -1;

  if (at === -1) {
    return [''];
  }

  return cascade
    .slice(0, at + 1)
    .reverse()
    .map((row) => (row.base ? '' : row.tw || ''));
}

/**
 * The class that sets a property for a size, and whether it is the size's
 * own or comes from a wider one (or from a broader property — the axis, all
 * four sides). The nearest size wins over the narrower property, because a
 * media query comes later in the sheet than every base utility.
 *
 * `properties` nearest first (`['padding-block-start', 'padding-block',
 * 'padding']`); `propertyOf(name)` is the catalog's answer for one utility —
 * passed in, so this reads families exactly as the dock does.
 *
 * @returns {{ name: string, raw: string, property: string, key: string, inherited: boolean }|null}
 */
export function effectiveClass(value, properties, chain, propertyOf) {
  const tokens = tokenizeClassValue(value)
    .filter((tok) => !tok.dynamic && tok.text !== '[' && tok.text !== ']')
    .map((tok) => {
      const { variants, base } = splitClass(tok.text);

      return { raw: tok.text, key: variants.join(':'), name: splitUtility(base).name };
    });

  for (let i = 0; i < chain.length; i += 1) {
    for (let p = 0; p < properties.length; p += 1) {
      const hit = tokens.find((tok) => tok.key === chain[i] && propertyOf(tok.name) === properties[p]);

      if (hit) {
        return { ...hit, property: properties[p], inherited: i > 0 || p > 0 };
      }
    }
  }

  return null;
}
