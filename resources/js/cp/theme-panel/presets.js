/**
 * The choices the typography and button tabs offer, and the tokens they write.
 *
 * A choice is written as a literal (`700`, `0.25rem`), not as a Tailwind
 * variable (`var(--font-weight-bold)`): Tailwind only emits the variables a
 * build saw in use, so a variable picked in Live Preview could be missing
 * until the next deploy. The theme's own tokens (`var(--size-300)`,
 * `var(--font-base)`) are fine — the site serves those on every render.
 */

export const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * A heading level's own weight and line height (`--h1-weight`,
 * `--h1-line-height`): only in the file while the level differs from the
 * headings' — an empty one follows `heading-weight` / `heading-line-height`.
 */
export const LEVEL_TOKENS = HEADINGS.flatMap((h) => [`${h}-weight`, `${h}-line-height`]);

/**
 * Typography: body (family, size, weight, line height), headings (family,
 * weight, line height, capitals) and each level's size — plus its own
 * weight and line height when it has them.
 */
export const TYPE_TOKENS = [
  'font-base', 'font-size', 'body-weight', 'line-height',
  'font-heading', 'heading-weight', 'heading-line-height', 'heading-text-transform',
  'font-size-h1', 'font-size-h2', 'font-size-h3', 'font-size-h4', 'font-size-h5', 'font-size-h6',
  ...LEVEL_TOKENS,
];

/**
 * What the site's CSS falls back to while a token is not in site.css yet
 * (base.css: `var(--body-weight, 400)`; the heading rule in
 * cms_styles/layout_style_push: `var(--heading-line-height, var(--leading-flat))`).
 */
export const TYPE_DEFAULTS = { 'body-weight': '400', 'heading-weight': '700', 'heading-line-height': '1.1' };

export const BUTTON_TOKENS = ['button-font', 'button-size', 'button-weight', 'button-radius', 'button-transform'];

/** Tailwind's font weights, what `var(--font-weight-*)` means. */
export const WEIGHTS = [
  ['thin', '100'], ['extralight', '200'], ['light', '300'], ['normal', '400'], ['medium', '500'],
  ['semibold', '600'], ['bold', '700'], ['extrabold', '800'], ['black', '900'],
];

/** Tailwind's radii, what `var(--radius-*)` means, plus none and pill. */
export const RADII = [
  ['none', '0'], ['xs', '0.125rem'], ['sm', '0.25rem'], ['md', '0.375rem'], ['lg', '0.5rem'],
  ['xl', '0.75rem'], ['2xl', '1rem'], ['3xl', '1.5rem'], ['4xl', '2rem'], ['full', '999em'],
];

/** `var(--font-weight-bold)` → `700`, `var(--radius-sm)` → `0.25rem`; anything else as it is. */
export function literalOf(value, list, prefix) {
  const m = new RegExp(`^var\\(\\s*--${prefix}-([\\w-]+)\\s*\\)$`).exec(String(value || '').trim());
  const hit = m && list.find(([name]) => name === m[1]);

  return hit ? hit[1] : String(value || '').trim();
}

/** The first family of a font stack, unquoted: `'Inter', 'Helvetica'` → `Inter`. */
export function firstFamily(stack) {
  return String(stack || '').split(',')[0].trim().replace(/^['"]|['"]$/g, '');
}

/**
 * The stack with another first family and the same fallbacks after it:
 * (`'Inter', 'Helvetica', 'Arial'`, `Roboto`) → `'Roboto', 'Helvetica', 'Arial'`.
 */
export function withFamily(stack, family) {
  const rest = String(stack || '').split(',').slice(1).map((s) => s.trim()).filter(Boolean);

  return [`'${String(family).replace(/'/g, '')}'`, ...rest].join(', ');
}

/** `var(--size-300)` → `size-300`, or null for a value that is not one of the scale's sizes. */
export function sizeRef(value) {
  return /^var\(\s*--(size-[\w-]+)\s*\)$/.exec(String(value || '').trim())?.[1] || null;
}

/**
 * The tokens besides colors that the site's `{{ theme_tokens }}` serves on
 * every render — the same list as its MANAGED pattern (app/Tags/ThemeTokens.php
 * on the site), so what the panel paints is what the page will get.
 */
const MANAGED = /^(?:size-[\w-]+|spacing-[\w-]+|text-[\w-]+|container-width|font-base|font-heading|font-size(?:-h[1-6])?|line-height|heading-text-transform|body-weight|heading-weight|heading-line-height|h[1-6]-(?:weight|line-height)|button-[\w-]+|btn-radius)$/;

export function isManaged(name) {
  return MANAGED.test(name);
}
