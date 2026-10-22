/**
 * The screen sizes this site designs for, in the browser.
 *
 * One list, handed over by `Breakpoints::forScript()`. Before this, the same
 * two numbers were written into the device icons, the Tailwind row, the
 * inheritance chain and the responsive conditions — four places that agreed
 * only because nobody had changed one of them yet.
 *
 * The list is always widest first: that is the order every button row, tab
 * row and overview draws. Which end is the base is the site's *direction*:
 *
 * - desktop-first (the default): the widest is the base with no media query,
 *   every narrower one is an exception under `(width < …)` / `max-lg:`;
 * - mobile-first: the narrowest is the base, every wider one is an exception
 *   under `(width >= …)` / `lg:`.
 *
 * `bpCascade()` is the list in cascade order — base first — and is what
 * inheritance and `@media` writing read. Nothing here decides the direction;
 * PHP did, and every row carries it. `FALLBACK` is what the addon shipped
 * with, so a Control Panel that never got the config draws exactly what it
 * drew before.
 */

/**
 * Dispatched on the window when the list is set anew without a page load — a
 * size added from the preview's «+». `detail.breakpoints` is the new list;
 * readers that drew from `breakpoints()` draw again.
 */
export const BP_CHANGED_EVENT = 'sve:breakpoints-changed';

/** What the three built-in sizes have always been. */
const FALLBACK = [
  {
    handle: 'laptop',
    label: 'Desktop',
    device: 'Desktop',
    icon: 'desktop',
    base: true,
    direction: 'desktop',
    min: 64,
    unit: 'em',
    min_px: 1024,
    max: null,
    media: '',
    media_px: '',
    tw: '',
  },
  {
    handle: 'tablet',
    label: 'Tablet',
    device: 'Tablet',
    icon: 'tablet',
    base: false,
    direction: 'desktop',
    min: 48,
    unit: 'em',
    min_px: 768,
    max: '1023.98px',
    media: '(width < 64em)',
    media_px: '(max-width: 1023.98px)',
    tw: 'max-lg',
  },
  {
    handle: 'mobile',
    label: 'Mobile',
    device: 'Mobile',
    icon: 'mobile',
    base: false,
    direction: 'desktop',
    min: 0,
    unit: 'em',
    min_px: 0,
    max: '767.98px',
    media: '(width < 48em)',
    media_px: '(max-width: 767.98px)',
    tw: 'max-md',
  },
];

let cached = null;
let cachedFrom = null;

/**
 * The list as configured, widest first.
 *
 * Read lazily and remembered, but keyed on the array the config handed over:
 * `Statamic.$config` is filled while the Control Panel boots, so the first
 * caller can easily be early. Keying on identity means the real list replaces
 * the fallback by itself, without anyone having to know when to ask again —
 * and a list set anew (a size added from the preview's «+») is read anew.
 */
export function breakpoints(win = window) {
  let raw = null;

  try {
    raw = win.Statamic?.$config?.get?.('sveBreakpoints');
  } catch {
    raw = null;
  }

  if (!Array.isArray(raw) || !raw.length) {
    return FALLBACK;
  }

  if (cached && cachedFrom === raw) {
    return cached;
  }

  cachedFrom = raw;
  cached = raw
    .filter((row) => row && typeof row.handle === 'string' && row.handle)
    .map((row) => ({
      handle: row.handle,
      label: row.label || row.handle,
      device: row.device || row.handle,
      icon: row.icon || 'desktop',
      base: !!row.base,
      direction: row.direction === 'mobile' ? 'mobile' : 'desktop',
      min: Number(row.min) || 0,
      unit: row.unit || 'em',
      min_px: Number(row.min_px ?? row.min) || 0,
      max: row.max || null,
      media: row.media || '',
      media_px: row.media_px || '',
      tw: row.tw || '',
    }));

  return cached.length ? cached : FALLBACK;
}

/**
 * The saved list, put where the page load would have put it, and announced.
 *
 * `data` is the answer PHP gives when a size is saved (`BreakpointsController`):
 * `breakpoints` is `Breakpoints::forScript()`, which `breakpoints()` reads
 * under `sveBreakpoints` (keyed on the array, so a new array is a new list);
 * `devices` is `Breakpoints::devices()`, which the device buttons size the
 * frame by, under `livePreview.devices`.
 *
 * Statamic's `Config.set(key, value)` writes one top-level key as given —
 * `set('a.b', …)` would make a key spelled "a.b", while `get('a.b')` walks `a`
 * then `b`. So the `livePreview` object is the one set, with the rest of it
 * kept as it was.
 */
export function applyBreakpointList(win, data) {
  const config = win?.Statamic?.$config;

  if (!config || typeof config.set !== 'function' || !Array.isArray(data?.breakpoints)) {
    return false;
  }

  config.set('sveBreakpoints', data.breakpoints);

  if (data.devices && typeof data.devices === 'object') {
    const livePreview = config.get('livePreview');

    config.set('livePreview', {
      ...(livePreview && typeof livePreview === 'object' ? livePreview : {}),
      devices: data.devices,
    });
  }

  win.dispatchEvent(new win.CustomEvent(BP_CHANGED_EVENT, { detail: { breakpoints: data.breakpoints } }));

  return true;
}

/** Handles in display order — widest first. No cascade meaning. */
export function bpHandles(win = window) {
  return breakpoints(win).map((item) => item.handle);
}

/** `desktop` (the widest is the base) or `mobile` (the narrowest is). */
export function bpDirection(win = window) {
  return breakpoints(win)[0]?.direction === 'mobile' ? 'mobile' : 'desktop';
}

/**
 * The list in cascade order: the base first, then each exception in the
 * order CSS has to write them so the nearest wins where two apply.
 *
 * Desktop-first that is the list itself; mobile-first it is the list turned
 * around. Anything that works out what an empty value inherits, or where a
 * new `@media` block goes relative to its siblings, reads this — not
 * `breakpoints()`.
 */
export function bpCascade(win = window) {
  const list = breakpoints(win);

  return bpDirection(win) === 'mobile' ? [...list].reverse() : list;
}

/** Handles in cascade order — the base first. What an empty value inherits along. */
export function bpCascadeHandles(win = window) {
  return bpCascade(win).map((item) => item.handle);
}

/** The size written without a media query — the rule the others except from. */
export function bpBase(win = window) {
  return (breakpoints(win).find((item) => item.base) || bpCascade(win)[0]).handle;
}

export function bpRow(handle, win = window) {
  return breakpoints(win).find((item) => item.handle === handle) || null;
}

export function bpForDevice(device, win = window) {
  return breakpoints(win).find((item) => item.device === device) || null;
}

/** Live Preview's device name for a breakpoint handle. */
export function bpDevice(handle, win = window) {
  return bpRow(handle, win)?.device || '';
}

/**
 * What each size inherits from, nearest first.
 *
 * `{ laptop: [], tablet: ['laptop'], mobile: ['tablet', 'laptop'] }` for the
 * three built-ins desktop-first; `{ mobile: [], tablet: ['mobile'], laptop:
 * ['tablet', 'mobile'] }` mobile-first — derived from the cascade rather
 * than written, so a fourth size slots into the chain without anyone editing
 * it, and the direction turns it around by itself.
 */
export function bpInherits(win = window) {
  const out = {};
  let above = [];

  for (const item of bpCascade(win)) {
    out[item.handle] = above;
    above = [item.handle, ...above];
  }

  return out;
}

/**
 * Which size a pane this wide is showing.
 *
 * Width alone decides: a pane 900px wide shows the tablet size whichever end
 * of the list is the base. The direction is about what inherits from what,
 * not about which size a width falls in.
 */
export function bpFromWidth(width, win = window) {
  const list = breakpoints(win);

  for (const item of list) {
    if (width >= item.min_px) {
      return item.handle;
    }
  }

  return list[list.length - 1]?.handle || 'mobile';
}

/**
 * The media query for a size, in the form the templates are written in.
 *
 * Two forms exist for the same boundary. `media` is the one this site writes —
 * `(width < 64em)` by default, because a boundary in `em` follows the reader's
 * own font-size setting and one in `px` does not. `media_px` is the same line
 * in pixels, kept because files written before still say it. `prefer` picks
 * which gets written; both are recognised when reading.
 */
export function bpMedia(handle, prefer = 'em', win = window) {
  const row = bpRow(handle, win);

  if (!row || row.base) {
    return '';
  }

  return (prefer === 'px' ? row.media_px : row.media) || row.media || '';
}

/** Both spellings of one size's boundary, for matching what a file already has. */
export function bpMediaForms(handle, win = window) {
  const row = bpRow(handle, win);

  return row && !row.base ? [row.media, row.media_px].filter(Boolean) : [];
}

/** The Tailwind variant that means this size — `max-lg` desktop-first, `lg` mobile-first. */
export function bpTailwind(handle, win = window) {
  return bpRow(handle, win)?.tw || '';
}
