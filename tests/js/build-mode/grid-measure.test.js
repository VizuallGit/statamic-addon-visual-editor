/**
 * build-mode/grid-measure.js — the boxes a grid is outlined in: a child's
 * cells as one, every free cell alone.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cellAreas, measureGrid } from '../../../resources/js/build-mode/grid-measure.js';

test('a child spanning two columns and two rows is one box; the free cells are one each', () => {
  const grid = {
    items: [{ col: [0, 1], row: [0, 1] }],
    empty: [
      [2, 0],
      [3, 0],
      [2, 1],
      [3, 1],
    ],
  };

  assert.deepEqual(cellAreas(grid), [
    { col: [0, 1], row: [0, 1] },
    { col: [2, 2], row: [0, 0] },
    { col: [3, 3], row: [0, 0] },
    { col: [2, 2], row: [1, 1] },
    { col: [3, 3], row: [1, 1] },
  ]);
});

test('two children on the same cells are one box; a child the frame has not placed is none', () => {
  const grid = {
    items: [
      { col: [0, 0], row: [0, 0] },
      { col: [0, 0], row: [0, 0] },
      { col: null, row: null },
    ],
    empty: [[1, 0]],
  };

  assert.deepEqual(cellAreas(grid), [
    { col: [0, 0], row: [0, 0] },
    { col: [1, 1], row: [0, 0] },
  ]);
});

/* measureGrid reads the frame; a stand-in element answers what it asks: its box, its computed style, its children. */
const DEFAULTS = {
  columnGap: '6px',
  rowGap: '6px',
  justifyContent: 'normal',
  alignContent: 'normal',
  gridAutoFlow: 'row',
  display: 'grid',
  position: 'static',
};
const view = {
  getComputedStyle: (el) => ({
    ...DEFAULTS,
    borderLeftWidth: '0px',
    borderTopWidth: '0px',
    borderRightWidth: '0px',
    borderBottomWidth: '0px',
    paddingLeft: '0px',
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    ...el.css,
  }),
};
const fake = (css, box, children = []) => ({
  css,
  ownerDocument: { defaultView: view },
  getBoundingClientRect: () => ({
    left: box[0],
    top: box[1],
    width: box[2],
    height: box[3],
    right: box[0] + box[2],
    bottom: box[1] + box[3],
  }),
  getAttribute: () => '',
  children,
});

test('an empty grid with no rows of its own is one row: each column a free cell', () => {
  const m = measureGrid(
    fake({ gridTemplateColumns: '96px 96px 96px', gridTemplateRows: 'none' }, [0, 0, 300, 64]),
    'data-p'
  );

  assert.deepEqual(m.rows, [{ start: 0, end: 64 }]);
  assert.deepEqual(m.empty, [
    [0, 0],
    [1, 0],
    [2, 0],
  ]);
});

test('an empty grid with rows of its own keeps them; with no height still one; with no columns none', () => {
  assert.equal(
    measureGrid(fake({ gridTemplateColumns: '147px 147px', gridTemplateRows: '29px 29px' }, [0, 0, 300, 64]), 'data-p')
      .empty.length,
    4
  );
  assert.deepEqual(
    measureGrid(fake({ gridTemplateColumns: '96px 96px 96px', gridTemplateRows: 'none' }, [0, 0, 300, 0]), 'data-p')
      .rows,
    [{ start: 0, end: 0 }],
    'no height yet: still one row, never none'
  );
  assert.deepEqual(
    measureGrid(fake({ gridTemplateColumns: 'none', gridTemplateRows: 'none' }, [0, 0, 300, 64]), 'data-p').rows,
    []
  );
});

test("a grid with a child reads its rows from the browser, not the empty grid's one", () => {
  const kid = fake({}, [0, 0, 96, 40]);
  const m = measureGrid(
    fake({ gridTemplateColumns: '96px 96px 96px', gridTemplateRows: 'none' }, [0, 0, 300, 40], [kid]),
    'data-p'
  );

  assert.deepEqual(m.rows, []);
});
