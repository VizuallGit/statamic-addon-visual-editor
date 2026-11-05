/**
 * build-mode/canvas-empty.js — an empty grid cell's room on the canvas: one
 * row's for each row it spans, the gap between them included.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_CSS, fitRows, gridRoomOf, ownHeight, roomOf, rowsSpanned } from '../../../resources/js/build-mode/canvas-empty.js';

test('the rows a cell spans, as the browser computes its grid-row', () => {
  assert.equal(rowsSpanned('span 2', 'span 2'), 2);
  assert.equal(rowsSpanned('1', 'span 3'), 3);
  assert.equal(rowsSpanned('2', '4'), 2);
  assert.equal(rowsSpanned('auto', 'auto'), 1);
  assert.equal(rowsSpanned('1', '-1'), 1);
});

test('a cell of one row has the plain placeholder; of more, a row\'s room each and the gaps between', () => {
  assert.equal(roomOf(1, '16px'), '');
  assert.equal(roomOf(2, '16px'), 'calc(2 * 4rem + 1 * 16px)');
  assert.equal(roomOf(3, 'normal'), 'calc(3 * 4rem + 2 * 0px)');
});

test('a cell spanning rows folds to the gaps between them: without those it has no height', () => {
  assert.equal(ownHeight(0), 0);
  assert.equal(ownHeight(56, 2, '56px'), 0);
  assert.equal(ownHeight(112, 3, '56px'), 0);
  assert.equal(ownHeight(120, 2, '56px'), 64);
  assert.equal(ownHeight(16, 1, '56px'), 16);
  assert.equal(ownHeight(16, 2, 'normal'), 16);
});

test('the placeholder reads the room, else one row', () => {
  assert.match(EMPTY_CSS, /\[data-sve-build-empty\]\{min-height:var\(--sve-build-room,4rem\)!important/);
});

/* fitRows reads the canvas; stand-ins answer what it asks: their computed style, their parent, their own style. */
function box(css, parent = null) {
  const own = new Map();

  return {
    css,
    parentElement: parent,
    style: { getPropertyValue: (k) => own.get(k) || '', setProperty: (k, v) => own.set(k, v), removeProperty: (k) => own.delete(k) },
  };
}

function scopeOf(cells) {
  const view = { getComputedStyle: (el) => ({ display: 'block', gridTemplateRows: 'none', rowGap: 'normal', gridRowStart: 'auto', gridRowEnd: 'auto', ...el.css }) };

  return { ownerDocument: { defaultView: view }, matches: () => false, querySelectorAll: () => cells };
}

test('an empty grid gets a grid row\'s room for each row, one at the least, the gaps between included', () => {
  const grid = box({ display: 'grid', gridTemplateRows: '29px 29px', rowGap: '24px' });
  const one = box({ display: 'grid', gridTemplateRows: '64px', rowGap: '24px' });
  const none = box({ display: 'grid', gridTemplateRows: 'none', rowGap: '24px' });

  fitRows(scopeOf([grid, one, none]));

  assert.equal(grid.style.getPropertyValue('--sve-build-room'), 'calc(2 * 6rem + 1 * 24px)');
  assert.equal(one.style.getPropertyValue('--sve-build-room'), '6rem');
  assert.equal(none.style.getPropertyValue('--sve-build-room'), '6rem', 'no rows of its own: one');
  assert.equal(gridRoomOf(3, 'normal'), 'calc(3 * 6rem + 2 * 0px)');
});

test('a cell spanning rows keeps its room; one back to a row of its own loses it', () => {
  const parent = box({ display: 'grid', rowGap: '16px' });
  const cell = box({ gridRowStart: 'span 2', gridRowEnd: 'span 2' }, parent);
  const back = box({}, parent);

  back.style.setProperty('--sve-build-room', 'calc(2 * 4rem + 1 * 16px)');
  fitRows(scopeOf([cell, back]));

  assert.equal(cell.style.getPropertyValue('--sve-build-room'), 'calc(2 * 4rem + 1 * 16px)');
  assert.equal(back.style.getPropertyValue('--sve-build-room'), '');
});
