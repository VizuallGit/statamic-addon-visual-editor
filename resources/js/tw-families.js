/**
 * Which values a utility can be swapped for.
 *
 * Nothing is hard-coded: the family behind a chip is Tailwind's own utility
 * registry, loaded with this site's `@theme`. `grid-cols-5` belongs to
 * `grid-cols` and offers 1 through 12; `py-1200` belongs to `py` and offers
 * this site's spacing scale. A prefix table can never fall behind, because
 * there is no prefix table.
 *
 * A family is still a CSS property, not a name: `text-*` holds both the sizes
 * and the colours, and the two must never land in the same menu. So the
 * utility's classes are compiled and grouped by what they set, and the chip
 * gets the group that matches what *it* sets.
 *
 * That compile is why families are built one utility at a time, the first
 * time a chip on it is opened, and then kept. Compiling all 15,000 up front
 * would cost a quarter of a second for a menu of fifteen rows.
 */

import { loadCatalog } from './tailwind-complete.js';

/** How many classes one warming pass compiles before yielding. */
const SLICE = 2000;

let families = null;

export function loadFamilies(win) {
  if (!families) {
    families = loadCatalog(win).then((catalog) => {
      const model = { catalog, groups: new Map(), index: { at: 0, roots: new Map() } };

      warm(win, model);

      return model;
    });
  }

  return families;
}

/* ------------------------------------------------------------------ *
 * Which utilities set a given CSS property
 * ------------------------------------------------------------------ */

/**
 * The icon row asks by CSS property — `padding`, `color`, `display` — and
 * that question has no answer until every class has been compiled. All
 * 15,000 of them is a third of a second, which is nothing spread over idle
 * time and a stutter if it lands on a click.
 *
 * So it is built in slices from the moment the Tailwind pane first draws,
 * and a click that arrives before it is done finishes the rest itself.
 */
function warm(win, model) {
  // A timeout on the idle call, because a busy or hidden tab can otherwise
  // sit on it forever and the first tool click pays the whole bill.
  const schedule = win?.requestIdleCallback
    ? (fn) => win.requestIdleCallback(fn, { timeout: 500 })
    : (fn) => (win?.setTimeout || globalThis.setTimeout)(fn, 0);

  const step = () => {
    if (model.index.at >= model.catalog.names.length) {
      return;
    }

    indexSlice(model, SLICE);
    schedule(step);
  };

  schedule(step);
}

function indexSlice(model, count) {
  const { at } = model.index;
  const names = model.catalog.names.slice(at, at + count);

  model.index.at = at + names.length;
  model.catalog.fill(names);

  names.forEach((name) => {
    const property = propertyOf(model.catalog.css(name));
    const root = model.catalog.root(name);

    if (!property || !root) {
      return;
    }

    if (!model.index.roots.has(property)) {
      model.index.roots.set(property, new Set());
    }

    model.index.roots.get(property).add(root);
  });
}

function finishIndex(model) {
  while (model.index.at < model.catalog.names.length) {
    indexSlice(model, SLICE);
  }
}

/**
 * Every class that sets one property — the list behind a tool icon.
 *
 * Two utilities can set the same property and mean quite different things:
 * `text-*` and `placeholder-*` are both `color`, `border-*` and `divide-*`
 * are both `border-color`. The tool means the plain one, so the scale with
 * the shortest name wins, and the fixed-value classes that belong to it come
 * along — `w-fit` and `w-max` under `w`, `m-auto` under `m`. A property with
 * no scale at all is a set of fixed values to begin with: `display` is
 * `block`, `flex`, `grid`, and every one of them belongs.
 */
export function optionsForProperty(property, model) {
  if (!model?.catalog || !property) {
    return [];
  }

  finishIndex(model);

  const roots = [...(model.index.roots.get(property) || [])];

  if (!roots.length) {
    return [];
  }

  const scale = roots
    .filter((root) => !model.catalog.isStatic(root))
    .sort((a, b) => a.length - b.length || a.localeCompare(b))[0];

  const chosen = scale
    ? [
      scale,
      ...roots
        .filter((root) => model.catalog.isStatic(root) && root.startsWith(`${scale}-`))
        .sort(),
    ]
    : roots.slice().sort();

  return chosen.flatMap((root) => groupsFor(model, root)?.get(property) || []);
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

/**
 * One utility's classes, compiled once and grouped by what they set.
 *
 * @returns {Map<string, Array>|null}
 */
function groupsFor(model, root) {
  if (model.groups.has(root)) {
    return model.groups.get(root);
  }

  const names = model.catalog.byRoot.get(root);

  if (!names?.length) {
    model.groups.set(root, null);

    return null;
  }

  const byProperty = new Map();

  model.catalog.rows(names).forEach((row) => {
    const property = propertyOf(row.css);

    if (!property) {
      return;
    }

    if (!byProperty.has(property)) {
      byProperty.set(property, []);
    }

    byProperty.get(property).push(row);
  });

  model.groups.set(root, byProperty);

  return byProperty;
}

/**
 * The menu behind one chip: what it sets, and what else it could be.
 *
 * @returns {{ label: string, options: Array<{ label: string, css: string, color: string }> }|null}
 */
export function familyFor(name, model) {
  if (!model?.catalog || !name) {
    return null;
  }

  const root = model.catalog.root(name);

  if (!root) {
    return null;
  }

  const groups = groupsFor(model, root);

  if (!groups?.size) {
    return null;
  }

  const property = propertyOf(model.catalog.css(name));
  const options = groups.get(property)
    // An arbitrary value — `w-[37px]` — sets the same property as the scale
    // but is not on it. When there is only one group, it is the one.
    || (groups.size === 1 ? [...groups.values()][0] : null);

  if (!options?.length) {
    return null;
  }

  return { label: property || root, options };
}

/** What the chip says this class does, for the hover title. */
export function cssFor(name, model) {
  return model?.catalog?.css(name) || '';
}

export function colorFor(name, model) {
  return model?.catalog?.color(name) || '';
}
