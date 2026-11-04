/**
 * Container queries in Style — the demo.
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
 *
 * Off unless this browser turned it on:
 * `localStorage.setItem('sve-container-demo', '1')`, then reload.
 */

const DEMO_KEY = 'sve-container-demo';

/** Tailwind's own `--container-*` steps the row offers, widest first as the breakpoints are. */
export const CONTAINER_SIZES = [
  { key: '3xl', rem: 48 },
  { key: 'xl', rem: 36 },
  { key: 'md', rem: 28 },
  { key: 'xs', rem: 20 },
];

const CONTAINER_VARIANT = /^@max-(?:[a-z0-9]+|\[[^\]]+\])$/;

/** `md` → `@max-md`: under the size, as the breakpoints are desktop-first. */
export const containerVariant = (key) => `@max-${key}`;

/** A container size variant (`@max-md`, `@max-[30rem]`), not a screen size or a state. */
export const isContainerVariant = (part) => CONTAINER_VARIANT.test(String(part || ''));

export function containerDemoOn(win = window) {
  try {
    return win.localStorage.getItem(DEMO_KEY) === '1';
  } catch {
    return false;
  }
}

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
