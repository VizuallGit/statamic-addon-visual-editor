/**
 * The fluid size scale: `--size-100: clamp(0.9375rem, 0.9167rem + 0.1042vw, 1rem);`
 * is 15 px on a 320 px screen, 16 px from the container width up.
 *
 * Same formula as the fluid-size addon's FluidSize fieldtype, number for
 * number, so a size written here reads exactly like one the old theme
 * settings wrote. Sizes are shown in px (what people think in) and written in
 * rem.
 */

/** Where every size is at its smallest — fixed, as in FluidSize. */
export const MIN_VIEWPORT = 320;

const REM = 16;

/** PHP's round($n, 4) as FluidSize prints it: 1.0 → "1", 0.93750 → "0.9375". */
function num(n) {
  return String(Number((Math.round(n * 1e4) / 1e4).toFixed(4)));
}

function toPx(length) {
  const m = /^(-?[\d.]+)(rem|px)$/.exec(String(length).trim());

  if (!m) {
    return null;
  }

  return m[2] === 'rem' ? Number(m[1]) * REM : Number(m[1]);
}

/**
 * `{ min, max }` in px for a size value — a `clamp(min, …, max)` or one fixed
 * length (`.9375rem`, min and max the same) — or null for anything else.
 */
export function parseSize(value) {
  const v = String(value || '').trim();
  const clamp = /^clamp\(\s*([^,]+),\s*([^,]+),\s*([^,)]+)\)$/.exec(v);

  if (clamp) {
    const min = toPx(clamp[1]);
    const max = toPx(clamp[3]);

    return min === null || max === null ? null : { min, max };
  }

  const fixed = toPx(v);

  return fixed === null ? null : { min: fixed, max: fixed };
}

/** A size's value: fluid from MIN_VIEWPORT to `maxViewport` px, or one fixed length when min = max. */
export function sizeValue(min, max, maxViewport, unit = 'vw') {
  const minRem = num(min / REM);
  const maxRem = num(max / REM);
  const range = maxViewport - MIN_VIEWPORT;

  // The same on every screen: one length, like the scale's fixed sizes (`--size-sm: .9375rem`).
  if (!(range > 0) || Math.abs(max - min) <= 0.001) {
    return `${minRem}rem`;
  }

  const slope = (max - min) / range;
  const intercept = min - slope * MIN_VIEWPORT;

  return `clamp(${minRem}rem, ${num(intercept / REM)}rem + ${num(slope * 100)}${unit}, ${maxRem}rem)`;
}

/**
 * The screen width where a clamp stops growing, in px — worked back from its
 * slope. The most common answer across the scale is the scale's container
 * width. Null when no size is fluid.
 */
export function inferViewport(values) {
  const counts = new Map();

  for (const value of values) {
    const m = /^clamp\(\s*([^,]+),\s*[^,+]+\+\s*(-?[\d.]+)vw\s*,\s*([^,)]+)\)$/.exec(String(value).trim());
    const size = parseSize(value);

    if (!m || !size || size.max === size.min) {
      continue;
    }

    const vp = Math.round(MIN_VIEWPORT + (size.max - size.min) / (Number(m[2]) / 100));

    counts.set(vp, (counts.get(vp) || 0) + 1);
  }

  let best = null;

  for (const [vp, n] of counts) {
    if (best === null || n > counts.get(best)) {
      best = vp;
    }
  }

  return best;
}

/** `100` from `size-100`, for the next free name: the largest number plus 100. */
export function nextSizeName(names) {
  const numbers = names.map((n) => Number(/^size-(\d+)$/.exec(n)?.[1])).filter((n) => n > 0);

  return `size-${numbers.length ? Math.max(...numbers) + 100 : 100}`;
}
