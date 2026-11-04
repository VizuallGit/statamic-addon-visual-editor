/**
 * Container queries in Style.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Reads the DOM it is handed; writes nothing.
 * Bus messages: none.
 *
 * A parent with Tailwind's `@container` gives its children a row of container
 * sizes under the breakpoints (BuildContainerRow.vue). A size picked there is
 * the variant every Style field writes under — `@max-md:pbs-500` — in the slot
 * a breakpoint takes (tw-classes.js `twSetContainerSize`), so the two are one
 * at a time.
 */

/** Tailwind v4's default `--container-*` scale, in rem, narrowest first. */
export const CONTAINER_SCALE = {
  '3xs': 16,
  '2xs': 18,
  xs: 20,
  sm: 24,
  md: 28,
  lg: 32,
  xl: 36,
  '2xl': 42,
  '3xl': 48,
  '4xl': 56,
  '5xl': 64,
  '6xl': 72,
  '7xl': 80,
};

/** The steps the row offers, widest first as the breakpoints are. */
export const CONTAINER_SIZES = ['3xl', 'xl', 'md', 'xs'].map((key) => ({ key, rem: CONTAINER_SCALE[key] }));

// `@container` and `@container/name` are the utility, not a variant.
const CONTAINER_VARIANT = /^@(?!container(?:$|\/))(?:(?:min|max)-)?(?:[a-z0-9]+|\[[^\]]+\])(?:\/[\w-]+)?$/;
const CONTAINER_LENGTH = /^@(?:(?:min|max)-)?(?:([a-z0-9]+)|\[(\d*\.?\d+)(?:rem|em)\])(?:\/[\w-]+)?$/;
const CUSTOM_LENGTH = /^\d+(\.\d+)?(rem|em)$/;

/** `md` → `@max-md`: under the size, as the breakpoints are desktop-first. */
export const containerVariant = (key) => `@max-${key}`;

/**
 * A container size variant — `@max-md`, `@max-[30rem]`, `@md`, `@min-[30rem]`,
 * `@max-md/card` — not a screen size or a state.
 */
export const isContainerVariant = (part) => CONTAINER_VARIANT.test(String(part || ''));

/**
 * The rem a container variant names: `@max-md` → 28, `@max-[30rem]` → 30,
 * `@max-[22.5em]` → 22.5, or null. An `em` is ordered as a `rem`: the query
 * itself measures it in the container's font size, which only the canvas knows.
 */
export function containerRem(variant) {
  const m = CONTAINER_LENGTH.exec(String(variant || ''));

  if (!m) {
    return null;
  }

  return m[1] ? CONTAINER_SCALE[m[1]] ?? null : Number(m[2]);
}

/** The length a container variant is under, as written: `@max-xl` → `36rem`, `@max-[22.5em]` → `22.5em`. */
export function containerLength(variant) {
  const arbitrary = /\[([^\]]+)\]/.exec(String(variant || ''));

  if (arbitrary) {
    return arbitrary[1];
  }

  const rem = containerRem(variant);

  return rem === null ? '' : `${rem}rem`;
}

/**
 * The named sizes wider than a `@max-*` size, nearest first: what a class
 * reads through, desktop-first, before All's. Wider arbitrary sizes are not
 * in it — only the classes the element has could name them.
 */
export function widerContainerSizes(variant) {
  const rem = /^@max-[^/]+$/.test(String(variant || '')) ? containerRem(variant) : null;

  if (rem === null) {
    return [];
  }

  return Object.entries(CONTAINER_SCALE)
    .filter(([, size]) => size > rem)
    .map(([key]) => containerVariant(key));
}

/** A size typed for the row (`30rem`) as its variant, or null. Only rem or em: px does not follow the reader's text size. */
export function customContainerVariant(text) {
  const value = String(text || '').trim();

  return CUSTOM_LENGTH.test(value) ? `@max-[${value}]` : null;
}

/** The arbitrary sizes (`@max-[30rem]`) a list of classes already writes under, in the order met. */
export function customSizesIn(classes) {
  const found = new Set();

  for (const name of classes || []) {
    for (const m of String(name).matchAll(/(?:^|:)(@max-\[[^\]]+\])(?=:)/g)) {
      found.add(m[1]);
    }
  }

  return [...found];
}

/**
 * The container size a new pick keeps. A size asks the pick's own size
 * container, so a pick outside one gives it up; a pick inside one — the same
 * or another — keeps it.
 */
export const containerSizeOnPick = (variant, el) => (variant && sizeContainerOf(el) ? variant : '');

/**
 * The container a size query on `el` asks: its nearest ancestor whose
 * `container-type` is `inline-size` or `size`, however it got it — a class in
 * this file, another partial's markup, a section's own CSS. An element is
 * never its own query container.
 */
export function sizeContainerOf(el) {
  const view = el?.ownerDocument?.defaultView;

  for (let up = el?.parentElement; view && up; up = up.parentElement) {
    if (/\bsize\b/.test(view.getComputedStyle(up).containerType || '')) {
      return up;
    }
  }

  return null;
}

/** The width a container query measures — the content box — in the frame's rem, to one decimal. */
export function contentWidthRem(el) {
  const view = el.ownerDocument.defaultView;
  const cs = view.getComputedStyle(el);
  const root = parseFloat(view.getComputedStyle(el.ownerDocument.documentElement).fontSize);
  const width = el.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);

  return Math.round((width / root) * 10) / 10;
}
