import test from 'node:test';
import assert from 'node:assert/strict';
import { queryEdge, queryUpperPx, sizeOfQuery } from '../../resources/js/css-sizes.js';

// The rows the dock's CSS panel hands sizeOfQuery (dock/css-sizes.js
// cssSizeRows): handle, base, direction, min_px and the desktop-first `max`.
const DESKTOP = [
  { handle: 'laptop', base: true, direction: 'desktop', min_px: 1024, max: null },
  { handle: 'tablet', base: false, direction: 'desktop', min_px: 768, max: '1023.98px' },
  { handle: 'mobile', base: false, direction: 'desktop', min_px: 0, max: '767.98px' },
];

const MOBILE = [
  { handle: 'laptop', base: false, direction: 'mobile', min_px: 1024, max: null },
  { handle: 'tablet', base: false, direction: 'mobile', min_px: 768, max: null },
  { handle: 'mobile', base: true, direction: 'mobile', min_px: 0, max: null },
];

test('queryEdge reads one boundary and which side of it the query is', () => {
  assert.deepEqual(queryEdge('(max-width: 1023.98px)'), { px: 1023.98, side: 'max' });
  assert.deepEqual(queryEdge('(width < 64em)'), { px: 1024, side: 'max' });
  assert.deepEqual(queryEdge('(width <= 64em)'), { px: 1024, side: 'max' });
  assert.deepEqual(queryEdge('(min-width: 768px)'), { px: 768, side: 'min' });
  assert.deepEqual(queryEdge('(width >= 48em)'), { px: 768, side: 'min' });
  assert.deepEqual(queryEdge('screen and (max-width: 900px)'), { px: 900, side: 'max' });
});

test('a range or a query without a width has no single edge', () => {
  assert.equal(queryEdge('(min-width: 768px) and (max-width: 1023px)'), null);
  assert.equal(queryEdge('(48em <= width < 64em)'), null);
  assert.equal(queryEdge('print'), null);
  assert.equal(queryEdge('(prefers-reduced-motion: reduce)'), null);
  assert.equal(queryEdge(''), null);
});

test('queryUpperPx is the max edge only — the desktop-first reading', () => {
  assert.equal(queryUpperPx('(max-width: 1023.98px)'), 1023.98);
  assert.equal(queryUpperPx('(width < 64em)'), 1024);
  assert.equal(queryUpperPx('(min-width: 768px)'), null);
  assert.equal(queryUpperPx('print'), null);
});

test('desktop-first: a max query at a size\'s upper edge is that size', () => {
  assert.equal(sizeOfQuery('(max-width: 1023.98px)', DESKTOP), 'tablet');
  assert.equal(sizeOfQuery('(width < 64em)', DESKTOP), 'tablet');
  assert.equal(sizeOfQuery('(max-width: 1024px)', DESKTOP), 'tablet', 'within the slack');
  assert.equal(sizeOfQuery('(width < 48em)', DESKTOP), 'mobile');
  assert.equal(sizeOfQuery('(max-width: 767.98px)', DESKTOP), 'mobile');
});

test('desktop-first: a min query or a foreign edge is nobody\'s size', () => {
  assert.equal(sizeOfQuery('(max-width: 900px)', DESKTOP), '');
  assert.equal(sizeOfQuery('(width >= 48em)', DESKTOP), '', 'the wrong side for this direction');
  assert.equal(sizeOfQuery('(min-width: 1024px)', DESKTOP), '');
  assert.equal(sizeOfQuery('print', DESKTOP), '');
});

test('mobile-first: a min query at a size\'s own start is that size', () => {
  assert.equal(sizeOfQuery('(width >= 48em)', MOBILE), 'tablet');
  assert.equal(sizeOfQuery('(min-width: 768px)', MOBILE), 'tablet');
  assert.equal(sizeOfQuery('(width >= 64em)', MOBILE), 'laptop');
  assert.equal(sizeOfQuery('(min-width: 1024px)', MOBILE), 'laptop');
});

test('mobile-first: a max query or a foreign edge is nobody\'s size', () => {
  assert.equal(sizeOfQuery('(width < 64em)', MOBILE), '', 'the wrong side for this direction');
  assert.equal(sizeOfQuery('(max-width: 1023.98px)', MOBILE), '');
  assert.equal(sizeOfQuery('(min-width: 900px)', MOBILE), '');
});

test('the base is never matched, and no rows means no size', () => {
  assert.equal(sizeOfQuery('(min-width: 1024px)', DESKTOP), '', 'laptop is the desktop-first base');
  assert.equal(sizeOfQuery('(min-width: 0px)', MOBILE), '', 'mobile is the mobile-first base');
  assert.equal(sizeOfQuery('(max-width: 1023.98px)', []), '');
  assert.equal(sizeOfQuery('(max-width: 1023.98px)', undefined), '');
});
