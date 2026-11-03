/**
 * The widths a Container can have, and the class each one is.
 *
 * One table, read by the Theme panel (Containers, where the widths are set,
 * and Fluid sizes, which stop growing at one of them) and by Build (a
 * Container's Content, where one is picked). A Container is a div with
 * `wrapper`; the width is one more class beside it. Normal is no class:
 * `wrapper` alone is `--container-width`, the site's own width.
 *
 * The site's site.css holds the rest: each width a token in `@theme`, and
 * `@utility wrapper-*` setting `--wrap` from it, which `wrapper` reads. Full
 * width has no token: `wrapper-full` is the whole width inside the gutter.
 *
 * May import: nothing. Values and pure helpers only.
 */

/** Narrowest first, as the chooser shows them. `token` is the `@theme` name without `--`. */
export const CONTAINER_WIDTHS = [
  { key: 'ultra-narrow', token: 'container-width-ultra-narrow', cls: 'wrapper-ultra-narrow' },
  { key: 'narrow', token: 'container-width-narrow', cls: 'wrapper-narrow' },
  { key: 'normal', token: 'container-width', cls: '' },
  { key: 'wide', token: 'container-width-wide', cls: 'wrapper-wide' },
  { key: 'ultra-wide', token: 'container-width-ultra-wide', cls: 'wrapper-ultra-wide' },
];

export const FULL_WIDTH = { key: 'full', token: '', cls: 'wrapper-full' };

/** Every width class, Full width last: a Container wears at most one. */
export const WIDTH_CLASSES = [...CONTAINER_WIDTHS.map((w) => w.cls).filter(Boolean), FULL_WIDTH.cls];

/** Which width `classes` (a tag's class names) has: its key, 'normal' when none. */
export function widthOf(classes) {
  const all = [...CONTAINER_WIDTHS, FULL_WIDTH];

  return all.find((w) => w.cls && classes.includes(w.cls))?.key || 'normal';
}

/** A width in px as written in `@theme`: rem, four decimals at most. */
export function widthRem(px) {
  return `${Number((px / 16).toFixed(4))}rem`;
}
