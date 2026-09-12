/**
 * The screen sizes this site designs for, in the browser.
 *
 * One list, handed over by `Breakpoints::forScript()`. Before this, the same
 * two numbers were written into the device icons, the Tailwind row, the
 * inheritance chain and the responsive conditions — four places that agreed
 * only because nobody had changed one of them yet.
 *
 * Desktop-first, and that is not a style: the widest size is the base and has
 * no media query at all, every narrower one is an exception written under a
 * `max-width`. `FALLBACK` is what the addon shipped with, so a Control Panel
 * that never got the config draws exactly what it drew before.
 */

/** What the three built-in sizes have always been. */
const FALLBACK = [
  {
    handle: 'laptop',
    label: 'Desktop',
    device: 'Desktop',
    icon: 'desktop',
    base: true,
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
 * the fallback by itself, without anyone having to know when to ask again.
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

export function bpHandles(win = window) {
  return breakpoints(win).map((item) => item.handle);
}

/** The size written without a media query — the rule the others except from. */
export function bpBase(win = window) {
  return (breakpoints(win).find((item) => item.base) || breakpoints(win)[0]).handle;
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
 * three built-ins — derived rather than written, so a fourth size slots into
 * the chain without anyone editing it.
 */
export function bpInherits(win = window) {
  const out = {};
  let above = [];

  for (const item of breakpoints(win)) {
    out[item.handle] = above;
    above = [item.handle, ...above];
  }

  return out;
}

/** Which size a pane this wide is showing. */
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

/** The Tailwind variant that means "narrower than this size". */
export function bpTailwind(handle, win = window) {
  return bpRow(handle, win)?.tw || '';
}
