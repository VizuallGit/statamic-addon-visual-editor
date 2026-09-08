/**
 * Which values a utility can be swapped for.
 *
 * Nothing is hard-coded: the catalog is built from this site's own `@theme`
 * (`/!/sve/tailwind-theme`), the same tokens the dock's suggestions and the
 * save-time compile use. A family is a CSS property — `font-size` holds every
 * `text-*` size the theme declares, `color` holds the `text-*` colours, so the
 * two never land in the same menu even though both start with `text-`.
 *
 * A class the theme knows nothing about — `mb-4` where the scale is named —
 * still finds its family through the prefix, so the menu can offer this site's
 * scale in place of a stray value.
 */

import { BOX, COLOR, loadCatalog } from './tailwind-complete.js';

/** Prefixes that carry a theme scale, longest first so `min-w` beats `w`. */
const PREFIXES = [
  ...Object.keys(BOX),
  ...Object.keys(COLOR),
  'text',
  'leading',
  'font',
  'rounded',
].sort((a, b) => b.length - a.length);

let families = null;

export function loadFamilies(win) {
  if (!families) {
    families = loadCatalog(win).then(buildFamilies);
  }

  return families;
}

/** A single declaration is a family; `truncate` and friends are not. */
function propertyOf(css) {
  const text = String(css || '');

  if (text.includes(';')) {
    return '';
  }

  const colon = text.indexOf(':');

  return colon === -1 ? '' : text.slice(0, colon).trim();
}

function buildFamilies(catalog) {
  const byProperty = new Map();
  const propertyOfUtility = new Map();
  const byPrefix = new Map();

  for (const item of catalog.items) {
    const property = propertyOf(item.css);

    if (property) {
      if (!byProperty.has(property)) {
        byProperty.set(property, []);
      }

      byProperty.get(property).push(item);
      propertyOfUtility.set(item.label, property);
    }

    const prefix = prefixOf(item.label);

    if (prefix) {
      if (!byPrefix.has(prefix)) {
        byPrefix.set(prefix, []);
      }

      byPrefix.get(prefix).push(item);
    }
  }

  return { catalog, byProperty, propertyOfUtility, byPrefix };
}

function prefixOf(label) {
  for (const prefix of PREFIXES) {
    if (String(label).startsWith(`${prefix}-`)) {
      return prefix;
    }
  }

  return '';
}

/**
 * The menu behind one chip: what it sets, and what else it could be.
 *
 * @returns {{ label: string, options: Array<{ label: string, css: string, color: string|null }> }|null}
 */
export function familyFor(name, model) {
  if (!model || !name) {
    return null;
  }

  const property = model.propertyOfUtility.get(name);

  if (property) {
    return { label: property, options: model.byProperty.get(property) || [] };
  }

  const prefix = prefixOf(name);
  const options = prefix ? model.byPrefix.get(prefix) : null;

  if (!options?.length) {
    return null;
  }

  return { label: propertyOf(options[0].css) || prefix, options };
}

/** What the chip says this class does, for the hover title. */
export function cssFor(name, model) {
  return model?.catalog?.byUtility?.get(name)?.css || '';
}

export function colorFor(name, model) {
  return model?.catalog?.byUtility?.get(name)?.color || '';
}
