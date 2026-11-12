/**
 * The widths a Container can have, and the class each one is.
 *
 * One table, read by the Theme panel (Containers, where the widths are set,
 * and Fluid sizes, which stop growing at one of them) and by Build (a
 * Container's Content, where one is picked, and Add, which writes one). A
 * Container is a div with `container`; the width is one more class beside
 * it. Normal is no class: `container` alone is `--container-width`, the
 * site's own width.
 *
 * `wrapper` is the class a Container had before, and markup written with it
 * stays a Container: its widths are the same classes under its own name
 * (`wrapper-narrow` beside `wrapper`). What Build writes now is `container`.
 *
 * The site's site.css holds the rest: each width a token in `@theme`;
 * `@utility container` — the whole width up to `--wrap` (else
 * `--container-width`), centred, the gutter inside; and `@utility container-*`
 * setting `--wrap` from a token. Full width has no token: `container-full`
 * is the whole width, the gutter inside.
 *
 * May import: nothing. Values and pure helpers only.
 */

/** The class a Container is, as Build writes it. */
export const CONTAINER_CLASS = 'container';

/** The class a Container had before — still one where the markup has it. */
const OLD_CONTAINER_CLASS = 'wrapper';

/** Narrowest first, as the chooser shows them. `token` is the `@theme` name without `--`. */
export const CONTAINER_WIDTHS = [
  { key: 'ultra-narrow', token: 'container-width-ultra-narrow', cls: 'container-ultra-narrow' },
  { key: 'narrow', token: 'container-width-narrow', cls: 'container-narrow' },
  { key: 'normal', token: 'container-width', cls: '' },
  { key: 'wide', token: 'container-width-wide', cls: 'container-wide' },
  { key: 'ultra-wide', token: 'container-width-ultra-wide', cls: 'container-ultra-wide' },
];

export const FULL_WIDTH = { key: 'full', token: '', cls: 'container-full' };

const words = (classes) => (Array.isArray(classes) ? classes : String(classes || '').split(/\s+/));

/** Which class a tag (its class names) is a Container by — `container`, or the older `wrapper` — '' when neither. */
export function containerBase(classes) {
  const list = words(classes);

  return list.includes(CONTAINER_CLASS)
    ? CONTAINER_CLASS
    : list.includes(OLD_CONTAINER_CLASS)
      ? OLD_CONTAINER_CLASS
      : '';
}

/** A width's class beside `base`: `container-narrow`, or `wrapper-narrow` on an older Container. '' for Normal. */
export function widthClass(width, base = CONTAINER_CLASS) {
  return width.cls && base === OLD_CONTAINER_CLASS
    ? width.cls.replace(CONTAINER_CLASS, OLD_CONTAINER_CLASS)
    : width.cls;
}

/** Every width class, both names, Full width last of each: a Container wears at most one. */
export const WIDTH_CLASSES = [CONTAINER_CLASS, OLD_CONTAINER_CLASS].flatMap((base) =>
  [...CONTAINER_WIDTHS, FULL_WIDTH].map((width) => widthClass(width, base)).filter(Boolean)
);

/** Which width `classes` (a tag's class names) has: its key, 'normal' when none. */
export function widthOf(classes) {
  const list = words(classes);

  return (
    [...CONTAINER_WIDTHS, FULL_WIDTH].find(
      (width) =>
        width.cls && [CONTAINER_CLASS, OLD_CONTAINER_CLASS].some((base) => list.includes(widthClass(width, base)))
    )?.key || 'normal'
  );
}

/** A width in px as written in `@theme`: rem, four decimals at most. */
export function widthRem(px) {
  return `${Number((px / 16).toFixed(4))}rem`;
}
