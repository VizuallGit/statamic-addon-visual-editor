/**
 * build-mode/grid.js — a grid's columns and rows and where its children
 * stand, read from the classes at a size and written back at that size.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countOf, fewestTracks, gridValueWith, planned, readGridAt, readGrid, spanTo, startAt, trackAt, withCellAt, withGridAt } from '../../../resources/js/build-mode/grid.js';

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
