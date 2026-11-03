/**
 * build-mode/grid.js — a grid's columns and rows and where its children
 * stand, read from the classes at a size and written back at that size.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GAP_AXIS_NEXT, countOf, fewestTracks, gapAxisOf, gridShape, gridValueWith, inFlow, oneByOne, planned, readGridAt, readGrid, spanTo, startAt, trackAt, withCellAt, withGridAt, withGridReset } from '../../../resources/js/build-mode/grid.js';
import { STRUCTURES } from '../../../resources/js/build-mode/catalog.js';

const DESKTOP = { variants: [], chain: [''] };
const TABLET = { variants: ['max-lg'], chain: ['max-lg', ''] };
const MOBILE = { variants: ['max-md'], chain: ['max-md', 'max-lg', ''] };

const FILE = [
  '<section>',
  '    <div class="grid grid-cols-3 gap-500">',
  '        <div class="col-span-2">One</div>',
  '        <div>Two</div>',
  '    </div>',
  '</section>',
  '',
].join('\n');

const GRID = '0:section/0:div';
const ONE = `${GRID}/0:div`;
const TWO = `${GRID}/1:div`;
const classOf = (html, line) => html.split('\n')[line].match(/class="([^"]*)"/)?.[1] ?? null;

test('a count is the class\'s number, or the tracks an arbitrary list names', () => {
  assert.equal(countOf('grid-cols-4'), 4);
  assert.equal(countOf('grid-cols-[2fr_1fr]'), 2);
  assert.equal(countOf('col-span-full'), null);
});

test('each part reads at the size picked: its own class, else the nearest wider one', () => {
  const value = 'grid grid-cols-3 max-lg:grid-cols-2 col-span-2';

  assert.deepEqual(readGrid(value, DESKTOP.chain).cols, { name: 'grid-cols-3', raw: 'grid-cols-3', n: 3, inherited: false });
  assert.deepEqual(readGrid(value, TABLET.chain).cols, { name: 'grid-cols-2', raw: 'max-lg:grid-cols-2', n: 2, inherited: false });
  assert.deepEqual(readGrid(value, MOBILE.chain).cols, { name: 'grid-cols-2', raw: 'max-lg:grid-cols-2', n: 2, inherited: true });
  assert.equal(readGrid(value, MOBILE.chain).rows, null);
});

test('a write at a size touches only that size\'s class', () => {
  assert.equal(gridValueWith('grid grid-cols-3', 'cols', 2, ['max-lg']), 'grid grid-cols-3 max-lg:grid-cols-2');
  assert.equal(gridValueWith('grid grid-cols-3 max-lg:grid-cols-2', 'cols', 1, ['max-lg']), 'grid grid-cols-3 max-lg:grid-cols-1');
  assert.equal(gridValueWith('grid grid-cols-3 max-lg:grid-cols-2', 'cols', null, ['max-lg']), 'grid grid-cols-3');
  assert.equal(gridValueWith('grid grid-cols-[2fr_1fr]', 'cols', 4), 'grid grid-cols-4');
});

test('a value a wider size already gives is not written twice, nor a span of one with nothing wider', () => {
  assert.equal(planned('col-span-2', 'colSpan', 2, TABLET.chain), null);
  assert.equal(planned('col-span-2', 'colSpan', 1, TABLET.chain), 1);
  assert.equal(planned('', 'colSpan', 1, DESKTOP.chain), null);
  assert.equal(planned('', 'colStart', 1, DESKTOP.chain), 1);
});

test('Desktop writes the base class; Tablet its own, beside it', () => {
  const desktop = withGridAt(FILE, ONE, { colSpan: 3 }, DESKTOP);

  assert.equal(classOf(desktop, 2), 'col-span-3');

  const tablet = withGridAt(FILE, ONE, { colSpan: 1, rowSpan: 2 }, TABLET);

  assert.equal(classOf(tablet, 2), 'col-span-2 max-lg:col-span-1 max-lg:row-span-2');
});

test('back to what the wider size gives: the size\'s own class comes off', () => {
  const tablet = withGridAt(FILE, ONE, { colSpan: 1 }, TABLET);

  assert.equal(classOf(withGridAt(tablet, ONE, { colSpan: 2 }, TABLET), 2), 'col-span-2');
  assert.equal(classOf(withGridAt(tablet, ONE, { colSpan: null }, TABLET), 2), 'col-span-2');
});

test('a span at a narrower size puts a wider start back to auto, as the stylesheet does', () => {
  assert.equal(readGrid('col-start-2 max-lg:col-span-1', TABLET.chain).colStart, null);
  assert.equal(readGrid('col-start-2 max-lg:col-span-1', DESKTOP.chain).colStart.n, 2);
  assert.equal(readGrid('col-span-2 col-start-2', DESKTOP.chain).colStart.n, 2);
  assert.equal(readGrid('col-span-2 max-lg:col-start-3', TABLET.chain).colStart.n, 3);
  assert.equal(readGrid('row-start-2 max-md:row-span-2', MOBILE.chain).rowStart, null);
});

test('a span changed at a size keeps the child\'s start there; back to the wider span, the start comes off again', () => {
  const placed = withGridAt(FILE, ONE, { colStart: 2, rowStart: 1 }, DESKTOP);

  assert.equal(classOf(placed, 2), 'col-span-2 col-start-2 row-start-1');

  const narrower = withGridAt(placed, ONE, { colSpan: 1 }, TABLET);

  assert.equal(classOf(narrower, 2), 'col-span-2 col-start-2 row-start-1 max-lg:col-span-1 max-lg:col-start-2');
  assert.equal(readGrid(classOf(narrower, 2), TABLET.chain).colStart.n, 2);
  assert.equal(classOf(withGridAt(narrower, ONE, { colSpan: 2 }, TABLET), 2), 'col-span-2 col-start-2 row-start-1');
  assert.equal(classOf(withGridAt(placed, ONE, { colSpan: 3 }, DESKTOP), 2), 'col-span-3 col-start-2 row-start-1');
  assert.equal(classOf(withGridAt(FILE, ONE, { colSpan: 1 }, TABLET), 2), 'col-span-2 max-lg:col-span-1');
});

test('Style draws the structures while the grid is one of them in one row, else the grid\'s own shape', () => {
  const shape = (value, chain = DESKTOP.chain, seen = {}) => gridShape(readGrid(value, chain), seen, STRUCTURES);

  assert.equal(shape('grid'), null);
  assert.equal(shape('grid grid-cols-3'), null);
  assert.equal(shape('grid grid-cols-[2fr_1fr] grid-rows-1'), null);
  assert.deepEqual(shape('grid grid-cols-5'), { cols: 5, rows: 1, fr: [1, 1, 1, 1, 1], inherited: false });
  assert.deepEqual(shape('grid grid-cols-4 grid-rows-2'), { cols: 4, rows: 2, fr: [1, 1, 1, 1], inherited: false });
  assert.deepEqual(shape('grid grid-cols-[2fr_1fr] grid-rows-3'), { cols: 2, rows: 3, fr: [2, 1], inherited: false });
  assert.deepEqual(shape('grid grid-cols-5 grid-rows-2', TABLET.chain), { cols: 5, rows: 2, fr: [1, 1, 1, 1, 1], inherited: true });
  assert.deepEqual(shape('grid grid-cols-none', DESKTOP.chain, { cols: 2, rows: 1 }), { cols: 2, rows: 1, fr: [1, 1], inherited: false });
});

test('back to one by one: grid-cols-1 and no rows of its own; one row where a wider size gives more', () => {
  const file = (value) => FILE.replace('grid grid-cols-3 gap-500', value);
  const reset = (value, at) => classOf(withGridAt(file(value), GRID, oneByOne(value, at.chain), at), 1);

  assert.equal(reset('grid grid-cols-5 grid-rows-2 gap-500', DESKTOP), 'grid grid-cols-1 gap-500');
  assert.equal(reset('grid grid-cols-5 grid-rows-2 gap-500 max-lg:grid-cols-3', TABLET), 'grid grid-cols-5 grid-rows-2 gap-500 max-lg:grid-cols-1 max-lg:grid-rows-1');
  assert.equal(reset('grid grid-cols-1 gap-500 max-lg:grid-cols-4 max-lg:grid-rows-2', TABLET), 'grid grid-cols-1 gap-500');
});

test('the reset puts the children back in the flow: no spans or starts there, a span of one where a wider size places them', () => {
  const file = (kid) => FILE.replace('grid grid-cols-3 gap-500', 'grid grid-cols-3 grid-rows-2 gap-500').replace('col-span-2', kid);

  const desk = withGridReset(file('col-span-2 row-span-2 col-start-2'), GRID, DESKTOP);
  assert.equal(classOf(desk, 1), 'grid grid-cols-1 gap-500');
  assert.equal(classOf(desk, 2), '');
  assert.equal(classOf(desk, 3), null);

  const tab = withGridReset(file('col-start-2 row-start-1 col-span-2'), GRID, TABLET);
  assert.equal(classOf(tab, 1), 'grid grid-cols-3 grid-rows-2 gap-500 max-lg:grid-cols-1 max-lg:grid-rows-1');
  assert.equal(classOf(tab, 2), 'col-start-2 row-start-1 col-span-2 max-lg:col-span-1 max-lg:row-span-1');

  assert.equal(inFlow('row-span-2 max-lg:row-span-3', TABLET.chain, TABLET.variants), 'row-span-2 max-lg:row-span-1');
  assert.equal(inFlow('max-lg:col-span-2', DESKTOP.chain, DESKTOP.variants), 'max-lg:col-span-2');
});

test('a child with no class attribute gets one; the grid\'s columns are the grid\'s', () => {
  assert.equal(classOf(withGridAt(FILE, TWO, { colStart: 2, rowStart: 1 }, DESKTOP), 3), 'col-start-2 row-start-1');
  assert.equal(classOf(withGridAt(FILE, GRID, { cols: 4 }, MOBILE), 1), 'grid grid-cols-3 gap-500 max-md:grid-cols-4');
});

test('nothing to change, or nothing there: the same file', () => {
  assert.equal(withGridAt(FILE, ONE, { colSpan: 2 }, DESKTOP), FILE);
  assert.equal(withGridAt(FILE, '9:nope', { colSpan: 2 }, DESKTOP), FILE);
});

test('a new cell goes last in the grid, with its start only where the browser would not put it', () => {
  const next = withCellAt(FILE, GRID, [2, 0], true, DESKTOP);

  assert.match(next.html, /<div>Two<\/div>\n {8}<div><\/div>\n {4}<\/div>/);

  const placed = withCellAt(FILE, GRID, [0, 2], false, TABLET);

  assert.match(placed.html, /<div class="max-lg:col-start-1 max-lg:row-start-3"><\/div>/);
  assert.equal(withCellAt(FILE, '9:nope', [0, 0], true), null);
});

test('the track under a position: in a gap the nearer one, outside the first or the last', () => {
  const tracks = [{ start: 0, end: 100 }, { start: 120, end: 220 }, { start: 240, end: 340 }];

  assert.equal(trackAt(tracks, 50), 0);
  assert.equal(trackAt(tracks, 105), 0);
  assert.equal(trackAt(tracks, 116), 1);
  assert.equal(trackAt(tracks, -20), 0);
  assert.equal(trackAt(tracks, 999), 2);
  assert.equal(trackAt([], 10), -1);
  assert.equal(spanTo(1, tracks, 300), 2);
  assert.equal(spanTo(2, tracks, 10), 1);
  assert.equal(startAt(tracks, 300, 2), 1);
  assert.equal(startAt(tracks, 10, 1), 0);
});

test('an element\'s grid read off the file, by its path', () => {
  const html = FILE.replace('grid-cols-3', 'grid-cols-4 max-lg:grid-cols-2');

  assert.equal(readGridAt(html, GRID, DESKTOP.chain).cols.n, 4);
  assert.equal(readGridAt(html, GRID, TABLET.chain).cols.n, 2);
  assert.equal(readGridAt(html, ONE, TABLET.chain).colSpan.inherited, true);
  assert.equal(readGridAt(html, '0:section/9:div', DESKTOP.chain).cols, null);
});

test('a grid goes no lower than its widest span and its lowest child', () => {
  assert.deepEqual(fewestTracks([]), { cols: 1, rows: 1 });
  assert.deepEqual(
    fewestTracks([
      { col: [0, 2], row: [0, 0] },
      { col: [1, 1], row: [3, 4] },
      { col: null, row: null },
    ]),
    { cols: 3, rows: 5 }
  );
});

test('the gap field: both, then rows (block), then columns (inline), round again; opens on the one gap set alone', () => {
  assert.deepEqual([GAP_AXIS_NEXT.all, GAP_AXIS_NEXT.block, GAP_AXIS_NEXT.inline], ['block', 'inline', 'all']);
  assert.equal(gapAxisOf({}), 'all');
  assert.equal(gapAxisOf({ gap: true }), 'all');
  assert.equal(gapAxisOf({ gap: true, row: true }), 'all');
  assert.equal(gapAxisOf({ row: true }), 'block');
  assert.equal(gapAxisOf({ col: true }), 'inline');
  assert.equal(gapAxisOf({ row: true, col: true }), 'block');
});
