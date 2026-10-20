/**
 * The samples the Button and Forms tabs draw in the panel: the theme's tokens
 * turned into values the Control Panel can paint, since the CP document has
 * none of the site's variables. Pure functions over the panel's state.
 */
import { RADII, WEIGHTS, firstFamily, literalOf, sizeRef } from './presets.js';

const BASICS = { white: '#fff', black: '#000' };

/** A size of the scale for a dropdown: `size-300 · 18–22 px`, its phone and desktop size. */
export function sizeLabel(s) {
  const r = (n) => Math.round(n * 100) / 100;

  return s.min === s.max ? `${r(s.min)} px` : `${r(s.min)}–${r(s.max)} px`;
}

/** `var(--size-sm)` → the scale's desktop size in rem; `fallback` for a value that is not one of the scale's. */
export function sampleSize(value, sizes, fallback) {
  const size = sizes.find((s) => s.name === sizeRef(value));

  return size ? `${size.max / 16}rem` : fallback;
}

/** A font stack as the CP draws it: its first family, then the system's sans. */
export function sampleFont(stack) {
  return `'${firstFamily(stack)}', ui-sans-serif, system-ui, sans-serif`;
}

/**
 * A color token as the CP can paint it: `var(--color-white)` → `#fff`,
 * `var(--color-primary-500)` (or the short `var(--primary-500)`) → that
 * step's value in `families`, `transparent` and a literal as they are. Null
 * for a variable the theme has no color for.
 */
export function sampleColor(value, families) {
  const text = String(value || '').trim();
  const m = /^var\(\s*--(?:color-)?([\w-]+)\s*\)$/.exec(text);

  if (!m) {
    return text || null;
  }

  if (BASICS[m[1]]) {
    return BASICS[m[1]];
  }

  for (const f of families) {
    if (f.name === m[1] && f.value) {
      return f.value;
    }

    const step = (f.steps || []).find((s) => `${f.name}-${s.name}` === m[1]);

    if (step) {
      return step.value;
    }
  }

  return null;
}

/** The Button tab's sample: the button drawn with the chosen values, in the site's primary color, at its desktop size. */
export function buttonSample(ui) {
  const stack = ui.button['button-font'] === 'var(--font-heading)' ? ui.type['font-heading'] : ui.type['font-base'];
  const primary = ui.families.find((f) => f.name === 'primary')?.value || '#0d9488';

  return {
    background: primary,
    color: '#fff',
    fontFamily: sampleFont(stack),
    fontSize: sampleSize(ui.button['button-size'], ui.sizes, '0.9375rem'),
    fontWeight: literalOf(ui.button['button-weight'], WEIGHTS, 'font-weight'),
    borderRadius: literalOf(ui.button['button-radius'], RADII, 'radius'),
    textTransform: ui.button['button-transform'] || 'none',
  };
}

/**
 * The Forms tab's text field and textarea, as the site's input rule draws them
 * (site.css: `color-mix()` for the background's opacity, the border from its
 * width and color). The fallbacks are site.css's own defaults.
 */
export function fieldSample(ui) {
  const i = ui.input;
  const bg = sampleColor(i['input-bg'], ui.families) || '#fff';
  const border = sampleColor(i['input-border-color'], ui.families) || 'transparent';

  return {
    appearance: 'none',
    width: '100%',
    lineHeight: 1,
    padding: '0.9em 1.2em',
    backgroundColor: `color-mix(in srgb, ${bg} ${i['input-bg-opacity'] || '100%'}, transparent)`,
    color: sampleColor(i['input-color'], ui.families) || '#262626',
    fontSize: sampleSize(i['input-size'], ui.sizes, '0.9375rem'),
    borderRadius: literalOf(i['input-radius'], RADII, 'radius') || '0.375rem',
    border: `${i['input-border-width'] || '0'} solid ${border}`,
  };
}

/** The Forms tab's checkbox and radio: native, in the accent color, at the chosen size. */
export function checkSample(ui) {
  const size = ui.input['input-check-size'] || '1.1em';

  return {
    accentColor: sampleColor(ui.input['input-accent'], ui.families) || '#0d9488',
    width: size,
    height: size,
    margin: 0,
    flex: 'none',
  };
}
