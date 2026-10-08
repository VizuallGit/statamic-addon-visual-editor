/**
 * X-ray: the arithmetic behind the grid lines — no DOM, no window.
 *
 * Everything here works on the numbers the browser already resolved:
 * `getComputedStyle(grid).gridTemplateColumns` answers with every track in
 * pixels (implicit ones from `grid-auto-rows` included), the gaps are pixels,
 * and an item's box is a rect. What is left to do is turn those into where the
 * lines sit and which lines an item spans, and that is pure enough to test.
 *
 * May import: nothing.
 */

/** `[name]` groups in a resolved track list — line names, not tracks. */
const LINE_NAMES = /\[[^\]]*\]/g;

/** Does this axis borrow its tracks from the parent grid? */
export function isSubgridValue(value) {
  return /^\s*subgrid\b/.test(String(value || ''));
}

/**
 * The track sizes in a resolved `grid-template-columns` / `-rows` value.
 *
 * `"379.333px 379.333px 379.333px"` → `[379.333, 379.333, 379.333]`. Line names
 * are dropped; `none`, `subgrid` and anything that is not a pixel list give an
 * empty array — the caller decides what an axis with no tracks means.
 */
export function parseTracks(value) {
  const text = String(value || '').replace(LINE_NAMES, ' ').trim();

  if (!text || text === 'none' || isSubgridValue(text)) {
    return [];
  }

  const sizes = [];

  for (const part of text.split(/\s+/)) {
    const n = parseFloat(part);

    if (!Number.isFinite(n) || !/px$/.test(part)) {
      // A keyword or an unresolved function: the browser did not hand us a
      // used size, so there is nothing honest to draw on this axis.
      return [];
    }

    sizes.push(n);
  }

  return sizes;
}

/** `column-gap: normal` is 0 in a grid; anything else is the pixel value. */
export function parseGap(value) {
  const n = parseFloat(value);

  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Where each track starts and ends, measured from the content box's edge.
 *
 * `distribute` is the axis's `justify-content` (columns) or `align-content`
 * (rows): when the tracks are smaller than the box, it decides where the free
 * space goes — before them, between them, or around them.
 *
 * @returns {{ start: number, end: number }[]}
 */
export function trackOffsets(sizes, gap = 0, available = 0, distribute = 'normal') {
  const n = sizes.length;

  if (!n) {
    return [];
  }

  const used = sizes.reduce((sum, size) => sum + size, 0) + gap * (n - 1);
  const free = Math.max(0, available - used);
  const mode = String(distribute || 'normal');
  let offset = 0;
  let extra = 0;

  if (free > 0.5) {
    if (mode.includes('space-between')) {
      extra = n > 1 ? free / (n - 1) : 0;
    } else if (mode.includes('space-around')) {
      extra = free / n;
      offset = extra / 2;
    } else if (mode.includes('space-evenly')) {
      extra = free / (n + 1);
      offset = extra;
    } else if (mode.includes('center')) {
      offset = free / 2;
    } else if (/\b(end|flex-end|right)\b/.test(mode)) {
      offset = free;
    }
  }

  const out = [];
  let pos = offset;

  for (const size of sizes) {
    out.push({ start: pos, end: pos + size });
    pos += size + gap + extra;
  }

  return out;
}

/**
 * The tracks an item covers, as 0-based indexes `[first, last]`, from where its
 * box sits. Used for auto-placed items, whose computed `grid-column-start` is
 * only `auto`: the geometry is the one answer the browser gives.
 *
 * Returns null when the box misses every track (an item pushed out by a margin).
 */
export function spanOf(tracks, from, to) {
  let first = -1;
  let last = -1;

  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].end > from + 0.5 && tracks[i].start < to - 0.5) {
      if (first < 0) {
        first = i;
      }

      last = i;
    }
  }

  return first < 0 ? null : [first, last];
}

/**
 * Turn an item's computed start/end into a span length when the author named
 * one: `span 2` → 2; `2` / `4` → 2 (explicit lines). Anything else (auto,
 * named lines) → 0, meaning "trust the geometry".
 */
export function declaredSpan(start, end) {
  const s = String(start || 'auto').trim();
  const e = String(end || 'auto').trim();
  const spanIn = (value) => {
    const m = /^span\s+(\d+)$/.exec(value);

    return m ? Number(m[1]) : 0;
  };

  if (spanIn(s)) {
    return spanIn(s);
  }

  if (spanIn(e)) {
    return spanIn(e);
  }

  const a = Number(s);
  const b = Number(e);

  if (Number.isInteger(a) && Number.isInteger(b) && a > 0 && b > a) {
    return b - a;
  }

  return 0;
}

/**
 * What a designer reads on an item: `col 2 / span 2 · row 1`.
 *
 * Lines are 1-based like CSS and Tailwind (`col-start-2`, `grid-column: 2 / 4`).
 */
export function placementLabel(colSpan, rowSpan, words = {}) {
  const col = words.col || 'col';
  const row = words.row || 'row';
  const part = (word, span) => {
    if (!span) {
      return '';
    }

    const [first, last] = span;
    const width = last - first + 1;

    return width > 1 ? `${word} ${first + 1} / span ${width}` : `${word} ${first + 1}`;
  };

  return [part(col, colSpan), part(row, rowSpan)].filter(Boolean).join(' · ');
}

/**
 * The name an element goes by in this theme.
 *
 * Sections and blocks name themselves with `[ name ]` in their class list —
 * `class="[ testimonials-list ] grid grid-cols-3"` — so that is the name when
 * there is one. Otherwise the first plain class, otherwise nothing.
 */
export function classLabel(className) {
  const text = String(className || '');
  const bracket = /\[\s*([^\]\s][^\]]*?)\s*\]/.exec(text);

  if (bracket) {
    return bracket[1].trim().split(/\s+/)[0];
  }

  const first = text.split(/\s+/).find((token) => token && !/[[\]]/.test(token));

  return first || '';
}

/** `ul.testimonials-list` — tag plus name, or the tag alone. */
export function elementLabel(tagName, className) {
  const tag = String(tagName || '').toLowerCase();
  const name = classLabel(className);

  return name ? `${tag}.${name}` : tag;
}

/** Round a measured size for a label: `379.333` → `379`, `0.5` → `0.5`. */
export function px(n) {
  if (!Number.isFinite(n)) {
    return '';
  }

  return Math.abs(n) >= 10 ? String(Math.round(n)) : String(Math.round(n * 10) / 10);
}

/**
 * The cells of a grid nobody has been placed in, as `[col, row]` 0-based pairs.
 *
 * `areas` are the items' spans (`{ col: [a, b], row: [c, d] }`). Capped so a
 * 400-row list grid does not turn into 4,000 rectangles.
 */
export function emptyCells(cols, rows, areas, cap = 600) {
  if (!cols || !rows || cols * rows > cap) {
    return [];
  }

  const taken = new Set();

  for (const area of areas) {
    if (!area.col || !area.row) {
      continue;
    }

    for (let c = area.col[0]; c <= area.col[1]; c++) {
      for (let r = area.row[0]; r <= area.row[1]; r++) {
        taken.add(`${c}:${r}`);
      }
    }
  }

  const out = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!taken.has(`${c}:${r}`)) {
        out.push([c, r]);
      }
    }
  }

  return out;
}

/** The arrow a flex container's label carries for its main axis. */
export function flexArrow(direction) {
  switch (String(direction || 'row')) {
    case 'row-reverse':
      return '←';
    case 'column':
      return '↓';
    case 'column-reverse':
      return '↑';
    default:
      return '→';
  }
}

/**
 * The theme token a measured size is, if any.
 *
 * `tokens` is what the preview resolved just now — `[{ name: '500', px: 34 }, …]`
 * — so a `clamp()` token is compared at the width the preview has, which is the
 * only width at which "is this 34px the 500?" has an answer. The scale's own
 * numbers (`500`) win over named sizes (`sm`) when both resolve to the same px.
 */
export function tokenFor(tokens, size, tolerance = 0.6) {
  if (!Array.isArray(tokens) || !Number.isFinite(size) || size <= 0) {
    return '';
  }

  let best = null;

  for (const token of tokens) {
    const off = Math.abs(token.px - size);

    if (off > tolerance) {
      continue;
    }

    const numeric = /^\d+$/.test(token.name);

    if (!best || (numeric && !best.numeric) || (numeric === best.numeric && off < best.off)) {
      best = { name: token.name, numeric, off };
    }
  }

  return best ? best.name : '';
}

/**
 * What a size reads as on a label: `gap-500 · 34` when it is a token, `34px`
 * when it is not. `prefix` is the utility it would be written as (`gap`, `pt`,
 * `text`); without one the token stands alone (`500 · 34`).
 */
export function sizeLabel(size, token, prefix = '') {
  if (!token) {
    return `${px(size)}px`;
  }

  return `${prefix ? `${prefix}-` : ''}${token} · ${px(size)}`;
}

/** Custom property names that are a token scale: `--spacing-500` → `500`; line heights and the like are not. */
export function tokenName(property, prefix) {
  if (!property.startsWith(prefix)) {
    return '';
  }

  const name = property.slice(prefix.length);

  return /^[a-z0-9]+$/i.test(name) ? name : '';
}

/** The first family in a computed `font-family`, without quotes: `"Inter Tight", sans-serif` → `Inter Tight`. */
export function firstFamily(fontFamily) {
  const first = String(fontFamily || '').split(',')[0] || '';

  return first.trim().replace(/^["']|["']$/g, '');
}
