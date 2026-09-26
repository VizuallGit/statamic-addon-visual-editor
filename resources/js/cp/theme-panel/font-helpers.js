/**
 * Pure helpers for the Fonts tab and the "Add font" dialog: names, sizes,
 * what an installed family holds, how a Google variant reads. No store, no
 * DOM — imported by fonts.js, google-fonts.js and the Vue parts alike.
 */

export function slug(name) {
  return String(name).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'font';
}

/** An installed family in the Control Panel, drawn under its own name so the CP's fonts never change. */
export const familyAlias = (name) => `sve-font-${slug(name)}`;

/** A Google family's preview in the dialog. */
export const previewAlias = (family) => `sve-gf-${slug(family)}`;

/** `18 KB`, `1.4 MB`. */
export function formatBytes(bytes) {
  const n = Number(bytes) || 0;

  if (n >= 1024 * 1024) {
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(n / 1024))} KB`;
}

/** `'300 900'` → `[300, 900]`, `'400'` → `[400, 400]`. */
function weightRange(weight) {
  const [a, b = a] = String(weight).trim().split(/\s+/).map(Number);

  return [a, b];
}

/** What a family holds, for its row: `{ weights: '300–900', variable, count, italic }`. */
export function familyShape(family) {
  let min = Infinity;
  let max = -Infinity;
  let variable = false;
  const single = new Set();

  for (const face of family.faces) {
    const [a, b] = weightRange(face.weight);

    if (Number.isFinite(a)) {
      min = Math.min(min, a);
      max = Math.max(max, b);
      variable ||= b !== a;

      if (b === a) {
        single.add(a);
      }
    }
  }

  return {
    weights: Number.isFinite(min) ? (min === max ? String(min) : `${min}–${max}`) : '',
    variable,
    count: single.size,
    italic: family.faces.some((f) => f.style === 'italic' || f.style.startsWith('oblique')),
  };
}

/** Does an installed family already have this weight and style? A variable face covers its range. */
export function hasVariant(family, weight, italic) {
  return !!family?.faces.some((face) => {
    const [a, b] = weightRange(face.weight);

    return (face.style === 'italic') === italic && weight >= a && weight <= b && !face.missing;
  });
}

/** Weight names as type designers write them — the same in every language. */
export const WEIGHT_NAMES = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

/** Google writes a variant as its weight, `i` for italic: `400`, `700i`. */
export const isItalic = (variant) => String(variant).endsWith('i');
export const weightOf = (variant) => parseInt(variant, 10) || 400;

/** `400` → `Regular`, `700i` → `Bold Italic`, `400i` → `Italic`. */
export function variantLabel(variant) {
  const name = WEIGHT_NAMES[weightOf(variant)] || String(weightOf(variant));

  if (!isItalic(variant)) {
    return name;
  }

  return name === 'Regular' ? 'Italic' : `${name} Italic`;
}

/** The variant a family shows itself in: Regular, else its first. */
export function defaultVariant(font) {
  return font.variants.includes('400') ? '400' : font.variants[0];
}
