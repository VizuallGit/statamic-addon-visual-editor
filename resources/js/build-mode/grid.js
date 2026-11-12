/**
 * A grid as Build edits it: how many columns and rows it has, where each
 * child stands, and the classes a change of either writes — at the size and
 * state being edited, as every Style field writes (`max-lg:col-span-2` on
 * Tablet, `col-span-2` on Desktop).
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: tw-parse.js, html-tree-parse.js, build-mode/place.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * Tailwind's own utilities, none of the site's: `grid-cols-N` and
 * `grid-rows-N` on the grid, `col-span-N`, `col-start-N`, `row-span-N` and
 * `row-start-N` on a child. One of each per variant: a new one takes the place
 * of the old at the same variant and leaves the other sizes' alone, and a
 * value a wider size already gives comes off rather than being written twice.
 *
 * The live boxes — which track a pointer is over, where a child sits — are
 * read off the frame by grid-measure.js; the numbers here are its tracks.
 */

import { parseTemplateTree } from '../html-tree-parse.js';
import {
  appendToken,
  buildClass,
  readClassAttr,
  replaceToken,
  splitClass,
  splitUtility,
  tokenizeClassValue,
  writeClassValue,
} from '../tw-parse.js';
import { findByPath, insertAt } from './place.js';

/** The most columns the builder adds: Tailwind's twelve, the grid designers count in. */
export const MAX_TRACKS = 12;

/**
 * What a part of a grid is written with. `none` is the value an element has
 * with no class for it: a span of one. A start has none — written, it is
 * where the child was put.
 */
const GRID_PARTS = {
  cols: { prefix: 'grid-cols', match: /^grid-cols-(?:\d+|none|subgrid|\[.+\]|\(.+\))$/ },
  rows: { prefix: 'grid-rows', match: /^grid-rows-(?:\d+|none|subgrid|\[.+\]|\(.+\))$/ },
  colSpan: { prefix: 'col-span', match: /^col-span-(?:\d+|full|\[.+\])$/, none: 1 },
  colStart: { prefix: 'col-start', match: /^col-start-(?:\d+|auto|\[.+\])$/ },
  rowSpan: { prefix: 'row-span', match: /^row-span-(?:\d+|full|\[.+\])$/, none: 1 },
  rowStart: { prefix: 'row-start', match: /^row-start-(?:\d+|auto|\[.+\])$/ },
};

/**
 * Each start and the span that can undo it. A span is Tailwind's shorthand
 * (`grid-column: span 2 / span 2`), and a narrower size's comes after a wider
 * size's start in the stylesheet: there it puts the start back to auto.
 */
const SPAN_OF = { colStart: 'colSpan', rowStart: 'rowSpan' };

/** The classes of a value, each with its variant key, without the scope and the `{{ … }}` ones. */
function chipsOf(value) {
  return tokenizeClassValue(value)
    .filter((tok) => !tok.dynamic && tok.text !== '[' && tok.text !== ']')
    .map((tok) => {
      const { variants, base } = splitClass(tok.text);
      const { name, modifier, important } = splitUtility(base);

      return {
        raw: tok.text,
        from: tok.from,
        to: tok.to,
        variants,
        key: variants.join(':'),
        name,
        modifier,
        important,
      };
    });
}

/** `grid-cols-3` → 3; `grid-cols-[2fr_1fr]` → 2 (its tracks); anything else → null. */
export function countOf(name) {
  const n = /-(\d+)$/.exec(String(name || ''));

  if (n) {
    return Number(n[1]);
  }

  const list = /^grid-(?:cols|rows)-\[(.+)\]$/.exec(String(name || ''));

  return list ? list[1].split('_').filter(Boolean).length : null;
}

/**
 * Each part as the element has it at the size and state picked: the nearest
 * class along `chain` (classes.js `variantChain`, nearest first), and whether
 * it is the element's own there or reaches it from a wider size. A start a
 * nearer span undoes is none (`SPAN_OF`).
 *
 * @returns {Record<string, { name: string, raw: string, n: number|null, inherited: boolean }|null>}
 */
export function readGrid(value, chain) {
  const chips = chipsOf(value);
  const out = {};
  const at = {};

  for (const [part, { match }] of Object.entries(GRID_PARTS)) {
    out[part] = null;
    at[part] = Infinity;

    for (let i = 0; i < chain.length && !out[part]; i += 1) {
      const hit = chips.find((chip) => chip.key === chain[i] && match.test(chip.name));

      if (hit) {
        out[part] = { name: hit.name, raw: hit.raw, n: countOf(hit.name), inherited: i > 0 };
        at[part] = i;
      }
    }
  }

  for (const [start, span] of Object.entries(SPAN_OF)) {
    if (at[span] < at[start]) {
      out[start] = null;
    }
  }

  return out;
}

/** readGrid for the element at `path` in the file: what its class attribute says at the size picked. */
export function readGridAt(html, path, chain) {
  const source = String(html || '');
  const node = path ? findByPath(parseTemplateTree(source), path) : null;
  const value = node && !node.kind ? readClassAttr(source, node.from, node.openTo)?.value || '' : '';

  return readGrid(value, chain);
}

/**
 * The class value with `part` at `n` under `variants` (the pane's: size, then
 * state), or without it there when `n` is null. Only that variant's class is
 * touched; one already there keeps its place, its `!` and its modifier.
 */
export function gridValueWith(value, part, n, variants = []) {
  const { prefix, match } = GRID_PARTS[part];
  const key = variants.join(':');
  const own = chipsOf(value).filter((chip) => chip.key === key && match.test(chip.name));
  const name = n === null ? '' : `${prefix}-${n}`;
  let next = String(value || '');

  // From the end, so the offsets before each one still hold.
  own
    .slice()
    .sort((a, b) => b.from - a.from)
    .forEach((chip, at, list) => {
      const keep = name && at === list.length - 1;

      next = replaceToken(
        next,
        chip,
        keep ? buildClass({ variants: chip.variants, name, modifier: chip.modifier, important: chip.important }) : ''
      );
    });

  return name && !own.length ? appendToken(next, buildClass({ variants, name })) : next;
}

/**
 * What a change of one part writes at the size picked: its class there, or
 * none when a wider size already gives that value, or when it is the value
 * with no class at all and nothing wider says otherwise.
 *
 * @returns {number|null} the class's number, or null for no class there
 */
export function planned(value, part, n, chain) {
  const wider = readGrid(value, chain.slice(1))[part];
  const none = GRID_PARTS[part].none;

  if (wider ? wider.n === n : none !== undefined && n === none) {
    return null;
  }

  return n;
}

/**
 * The preset a grid is at the size picked: its columns' class, and its rows —
 * no rows class is one row. None while it has no columns class.
 *
 * @param {object} parts  readGrid at the size picked
 * @param {{ cls: string, rows: number }[]} presets  catalog.js GRID_PRESETS
 */
export function presetOf(parts, presets = []) {
  const name = parts?.cols?.name;
  const rows = parts?.rows?.n ?? 1;

  return (name && presets.find((preset) => preset.cls === name && preset.rows === rows)) || null;
}

/**
 * How Style draws a grid that is none of its presets: its columns, as
 * fractions where a preset's class names them, by its rows. `null` while it is
 * a preset, or has neither columns nor rows of its own.
 *
 * @param {object} parts  readGrid at the size picked
 * @param {{ cols?: number, rows?: number }} seen  the counts the canvas lays out
 * @param {{ cls: string, parts: number[], rows: number }[]} presets  catalog.js GRID_PRESETS
 * @returns {{ cols: number, rows: number, fr: number[], inherited: boolean }|null}
 */
export function gridShape(parts, seen = {}, presets = []) {
  if ((!parts?.cols && !parts?.rows) || presetOf(parts, presets)) {
    return null;
  }

  const named = presets.find((preset) => preset.cls === parts?.cols?.name);
  const cols = named?.parts.length ?? parts?.cols?.n ?? seen.cols ?? 1;

  return {
    cols,
    rows: parts?.rows?.n ?? seen.rows ?? 1,
    fr: named ? named.parts : Array.from({ length: cols }, () => 1),
    inherited: (parts?.cols?.inherited ?? true) && (parts?.rows?.inherited ?? true),
  };
}

/** Whether a preset is fewer tracks than the grid's children need (`fewestTracks`): its tile is off, as a step below them is. */
export function presetTooSmall(preset, least) {
  return preset.parts.length < least.cols || (preset.rows > 1 && preset.rows < least.rows);
}

/**
 * The file with the grid at `path` set to a preset at the size picked, in one
 * write: its columns' class, none where a wider size gives that one already;
 * its rows, one row being no rows class unless a wider size gives more.
 */
export function withPresetAt(html, path, preset, { variants = [], chain = [''] } = {}) {
  const source = String(html || '');
  const node = path ? findByPath(parseTemplateTree(source), path) : null;

  if (!node || node.kind || node.locked || node.lockedIn) {
    return source;
  }

  const before = readClassAttr(source, node.from, node.openTo)?.value || '';
  const wider = readGrid(before, chain.slice(1));
  const cols = wider.cols?.name === preset.cls ? null : preset.cls.slice(`${GRID_PARTS.cols.prefix}-`.length);
  const rows =
    preset.rows === 1 ? (wider.rows && wider.rows.n !== 1 ? 1 : null) : planned(before, 'rows', preset.rows, chain);
  const value = gridValueWith(gridValueWith(before, 'cols', cols, variants), 'rows', rows, variants);

  return value === before ? source : writeClassValue(source, node, value);
}

/**
 * Back to one column and one row at the size picked: `grid-cols-1` unless a
 * wider size gives it already, and no rows of its own — one row only where a
 * wider size gives more. Changes for withGridAt.
 */
export function oneByOne(value, chain) {
  const wider = readGrid(value, chain.slice(1)).rows;

  return { cols: 1, rows: wider && wider.n !== 1 ? 1 : null };
}

/**
 * A child back in its grid's flow at the size picked: no start or span of its
 * own there, and a span of one where a wider size still spans or places it —
 * the span shorthand puts the start back to auto (`SPAN_OF`).
 */
export function inFlow(value, chain, variants = []) {
  const wider = readGrid(value, chain.slice(1));
  let next = String(value || '');

  for (const [start, span] of Object.entries(SPAN_OF)) {
    const undo = wider[start] || (wider[span] && wider[span].n !== 1);

    next = gridValueWith(next, start, null, variants);
    next = gridValueWith(next, span, undo ? 1 : null, variants);
  }

  return next;
}

/**
 * The file with the grid at `path` back to one column and one row at the
 * size picked (`oneByOne`) and its children back in its flow there
 * (`inFlow`): the 1 × 1 Style's reset says, which a child spanning two
 * columns would otherwise widen.
 */
export function withGridReset(html, path, { variants = [], chain = [''] } = {}) {
  const source = String(html || '');
  const grid = path ? findByPath(parseTemplateTree(source), path) : null;

  if (!grid || grid.kind || grid.locked || grid.lockedIn) {
    return source;
  }

  let next = source;

  // From the last child, so the offsets before each one still hold.
  for (const kid of grid.children.filter((k) => !k.kind && !k.locked && !k.lockedIn).reverse()) {
    const value = readClassAttr(next, kid.from, kid.openTo)?.value || '';
    const moved = inFlow(value, chain, variants);

    if (moved !== value) {
      next = writeClassValue(next, kid, moved);
    }
  }

  return withGridAt(next, path, oneByOne(readClassAttr(next, grid.from, grid.openTo)?.value || '', chain), {
    variants,
    chain,
  });
}

/** The gap a grid's one gap field sets — both, between rows (the block axis), between columns (the inline axis) — and the next one round. */
export const GAP_AXIS_NEXT = { all: 'block', block: 'inline', inline: 'all' };

/** The axis that field opens on: the one gap the element has without `gap`, else both. */
export function gapAxisOf({ gap, row, col }) {
  if (gap || !(row || col)) {
    return 'all';
  }

  return row ? 'block' : 'inline';
}

/**
 * The file with the element at `path` changed: `changes` is parts by name
 * (`{ colSpan: 2, rowSpan: 1 }`), each a number, or null for back to what a
 * wider size gives. The same file when nothing changes or the element is gone.
 *
 * @param {{ variants: string[], chain: string[] }} at  the pane's variant and the size's chain
 */
export function withGridAt(html, path, changes, { variants = [], chain = [''] } = {}) {
  const source = String(html || '');
  const node = path ? findByPath(parseTemplateTree(source), path) : null;

  if (!node || node.kind || node.locked || node.lockedIn) {
    return source;
  }

  let value = readClassAttr(source, node.from, node.openTo)?.value || '';
  const before = readGrid(value, chain);

  for (const [part, n] of Object.entries(changes || {})) {
    if (GRID_PARTS[part]) {
      value = gridValueWith(value, part, n === null ? null : planned(value, part, n, chain), variants);
    }
  }

  // A span changed alone keeps the child where it stood: beside a span of
  // this size its start is said here too, and without one a wider size's does.
  for (const [start, span] of Object.entries(SPAN_OF)) {
    const keep = before[start]?.n ?? null;

    if (span in (changes || {}) && !(start in changes) && keep !== null) {
      value = gridValueWith(
        value,
        start,
        readGrid(value, chain.slice(0, 1))[span] ? keep : planned(value, start, keep, chain),
        variants
      );
    }
  }

  return value === (readClassAttr(source, node.from, node.openTo)?.value || '')
    ? source
    : writeClassValue(source, node, value);
}

/**
 * The file with a new empty element in the grid at `path`, standing in the
 * cell `[col, row]` (0-based). It goes last; a cell that is not the next one
 * the browser would fill on its own gets its start written, at the size picked.
 *
 * @param {boolean} next  the cell is the first free one in the grid's own order
 * @returns {{ html: string, at: number }|null}
 */
export function withCellAt(html, path, [col, row], next, { variants = [] } = {}) {
  const source = String(html || '');
  const grid = path ? findByPath(parseTemplateTree(source), path) : null;

  if (!grid || grid.kind || grid.locked || grid.lockedIn) {
    return null;
  }

  const starts = next
    ? ''
    : [`${GRID_PARTS.colStart.prefix}-${col + 1}`, `${GRID_PARTS.rowStart.prefix}-${row + 1}`]
        .map((name) => buildClass({ variants, name }))
        .join(' ');

  return insertAt(
    source,
    { mode: 'into', parent: grid, after: null },
    starts ? `<div class="${starts}"></div>` : '<div></div>'
  );
}

/* ------------------------------------------------------------------ *
 * Tracks: the numbers grid-measure.js reads off the frame
 * ------------------------------------------------------------------ */

/**
 * The fewest columns and rows a grid can be taken down to with its children
 * still in it: the widest span, and the lowest row one reaches.
 *
 * @param {{ col: number[]|null, row: number[]|null }[]} items  0-based first and last tracks
 */
export function fewestTracks(items) {
  const placed = items.filter((item) => item.col && item.row);

  return {
    cols: Math.max(1, ...placed.map((item) => item.col[1] - item.col[0] + 1)),
    rows: Math.max(1, ...placed.map((item) => item.row[1] + 1)),
  };
}

/**
 * The track a position falls in, 0-based — in a gap, the nearer of the two;
 * before the first, the first; past the last, the last.
 *
 * @param {{ start: number, end: number }[]} tracks
 */
export function trackAt(tracks, pos) {
  if (!tracks.length) {
    return -1;
  }

  for (let i = 0; i < tracks.length; i += 1) {
    if (pos < tracks[i].end) {
      if (pos >= tracks[i].start || i === 0) {
        return i;
      }

      return pos - tracks[i - 1].end < tracks[i].start - pos ? i - 1 : i;
    }
  }

  return tracks.length - 1;
}

/**
 * A resize from a corner: the span from the child's first track to the one
 * under the pointer, never less than one.
 */
export function spanTo(first, tracks, pos) {
  return Math.max(1, trackAt(tracks, pos) - first + 1);
}

/**
 * A move: the cell under the pointer, held so the child's span still fits
 * inside the explicit columns (`count`) — rows may grow, as a grid's do.
 *
 * @returns {number} the 0-based track the child starts in
 */
export function startAt(tracks, pos, span, count = tracks.length) {
  const at = trackAt(tracks, pos);

  return Math.max(0, Math.min(at, Math.max(count, 1) - Math.max(span, 1)));
}
