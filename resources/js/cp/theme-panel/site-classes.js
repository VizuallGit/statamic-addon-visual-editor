/**
 * Every class the site's CSS defines, in one list — the Classes tab reads this.
 *
 * The server (`/!/sve/site-css/defined`) hands over one row per leaf rule:
 * `{ name, file, selector, css, kind }`. A name written in several files, or
 * in several rules of one file, arrives several times. This module folds those
 * into one row per name and answers which rows a search or a chip keeps.
 *
 * Pure functions, no DOM and no fetch, so the tab can be tested without a CP.
 */

import { bodyProperties } from './utilities.js';

/**
 * A selector you can answer "put this class on that element" with: exactly one
 * class, and nothing else that has to be true around it. `.card` and
 * `.card:hover` qualify; `.card h2`, `.a, .b`, `h1.big` and `body` do not —
 * those describe a place, not a thing you hand to an element.
 */
export function isAmbient(selector) {
  const s = String(selector || '').trim();

  if (/^@utility\b/.test(s)) {
    return false;
  }

  // A comma is two selectors, and a combinator needs something else present.
  if (/[,>+~]/.test(s) || /\s/.test(s.replace(/\(([^()]*)\)/g, ''))) {
    return true;
  }

  // What is left is one compound: it must be a class, and only one.
  const compound = s.replace(/::?[a-zA-Z-]+(\([^()]*\))?/g, '');

  return !/^\.[A-Za-z_][\w-]*$/.test(compound);
}

/** The name a row is filed under, without the leading dot. */
function rowName(row) {
  return String(row?.name || '').replace(/^\./, '');
}

/**
 * One row per class name: `{ name, kind, files, selectors, props, ambient }`.
 *
 * `kind` is 'utility' when any rule defines it with `@utility` — that is the
 * form that answers to `md:` and `hover:`, so it wins over a plain rule of the
 * same name. `ambient` is true only when *every* rule for the name is one you
 * cannot put on an element; a name with one usable rule stays pickable.
 */
export function classRows(defined) {
  const byName = new Map();

  for (const row of Array.isArray(defined) ? defined : []) {
    const name = rowName(row);

    if (!name) {
      continue;
    }

    const seen = byName.get(name) || {
      name,
      kind: 'class',
      files: [],
      selectors: [],
      props: [],
      ambient: true,
    };

    const ambient = isAmbient(row.selector);

    if (row.kind === 'utility') {
      seen.kind = 'utility';
    } else if (row.kind === 'bracket' && seen.kind === 'class') {
      seen.kind = 'bracket';
    }

    if (row.file && !seen.files.includes(row.file)) {
      seen.files.push(row.file);
    }

    if (row.selector && !seen.selectors.includes(row.selector)) {
      seen.selectors.push(row.selector);
    }

    for (const prop of bodyProperties(row.css)) {
      if (!seen.props.includes(prop)) {
        seen.props.push(prop);
      }
    }

    seen.ambient = seen.ambient && ambient;

    byName.set(name, seen);
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * The chips over the list. 'unused' is left out on purpose while the usage
 * count cannot be trusted — a chip that hides a class the page is still using
 * is worse than no chip.
 */
export const CLASS_CHIPS = ['all', 'utility', 'class', 'ambient'];

/** Whether a chip keeps a row. */
export function chipKeeps(chip, row) {
  if (chip === 'utility') {
    return row.kind === 'utility';
  }

  if (chip === 'class') {
    return row.kind !== 'utility' && !row.ambient;
  }

  if (chip === 'ambient') {
    return row.ambient;
  }

  return true;
}

/** The rows a chip and a search box leave, in the list's own order. */
export function filterRows(rows, { chip = 'all', query = '' } = {}) {
  const q = String(query || '').trim().toLowerCase().replace(/^\./, '');

  return (rows || []).filter((row) => {
    if (!chipKeeps(chip, row)) {
      return false;
    }

    if (!q) {
      return true;
    }

    return row.name.toLowerCase().includes(q)
      || row.files.some((f) => f.toLowerCase().includes(q))
      || row.props.some((p) => p.toLowerCase().includes(q));
  });
}

/** `wrapper — site.css · 4 properties`, the line under a row's name. */
export function rowSummary(row, labels = {}) {
  const props = row.props.length
    ? `${row.props.length} ${row.props.length === 1 ? labels.prop_one || 'egenskab' : labels.prop_many || 'egenskaber'}`
    : labels.no_props || 'tom';

  return [row.files.join(', '), props].filter(Boolean).join(' · ');
}
