import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classLabel,
  declaredSpan,
  elementLabel,
  emptyCells,
  flexArrow,
  isSubgridValue,
  parseGap,
  parseTracks,
  placementLabel,
  px,
  spanOf,
  trackOffsets,
} from '../../resources/js/cp/xray/measure.js';
import { XRAY_DEFAULTS, readXrayPrefs, writeXrayPrefs, xrayAllowed } from '../../resources/js/cp/xray/prefs.js';

test('resolved track lists become pixel sizes, line names dropped', () => {
  assert.deepEqual(parseTracks('379.333px 379.333px 379.333px'), [379.333, 379.333, 379.333]);
  assert.deepEqual(parseTracks('[full-start] 100px [content-start] 200px [content-end]'), [100, 200]);
  assert.deepEqual(parseTracks('none'), []);
  assert.deepEqual(parseTracks(''), []);
  // Nothing honest to draw when the browser did not resolve the sizes.
  assert.deepEqual(parseTracks('repeat(3, 1fr)'), []);
  assert.deepEqual(parseTracks('subgrid [a] [b]'), []);
});

test('subgrid is recognised on its own and with line names', () => {
  assert.equal(isSubgridValue('subgrid'), true);
  assert.equal(isSubgridValue('subgrid [a] [b]'), true);
  assert.equal(isSubgridValue('100px 100px'), false);
  assert.equal(isSubgridValue(undefined), false);
});

test('gap normal is zero', () => {
  assert.equal(parseGap('normal'), 0);
  assert.equal(parseGap('24px'), 24);
  assert.equal(parseGap(''), 0);
});

test('tracks sit edge to edge with the gap between them', () => {
  assert.deepEqual(trackOffsets([100, 100, 100], 20, 340), [
    { start: 0, end: 100 },
    { start: 120, end: 220 },
    { start: 240, end: 340 },
  ]);
});

test('free space follows justify-content / align-content', () => {
  assert.deepEqual(trackOffsets([100, 100], 0, 300, 'center'), [
    { start: 50, end: 150 },
    { start: 150, end: 250 },
  ]);
  assert.deepEqual(trackOffsets([100, 100], 0, 300, 'end'), [
    { start: 100, end: 200 },
    { start: 200, end: 300 },
  ]);
  assert.deepEqual(trackOffsets([100, 100], 0, 300, 'space-between'), [
    { start: 0, end: 100 },
    { start: 200, end: 300 },
  ]);
  const round = (tracks) => tracks.map(({ start, end }) => [Math.round(start * 100) / 100, Math.round(end * 100) / 100]);

  assert.deepEqual(round(trackOffsets([100, 100], 0, 400, 'space-evenly')), [
    [66.67, 166.67],
    [233.33, 333.33],
  ]);
  // `normal` and `stretch` leave the tracks at the start.
  assert.deepEqual(trackOffsets([100], 0, 300, 'normal'), [{ start: 0, end: 100 }]);
  assert.deepEqual(trackOffsets([], 10, 300), []);
});

test('an item covers the tracks its box overlaps', () => {
  const tracks = trackOffsets([100, 100, 100, 100], 20, 460);

  assert.deepEqual(spanOf(tracks, 0, 100), [0, 0]);
  assert.deepEqual(spanOf(tracks, 120, 340), [1, 2]);
  // A hairline of overlap is rounding, not a span.
  assert.deepEqual(spanOf(tracks, 0, 120.3), [0, 0]);
  assert.equal(spanOf(tracks, 900, 1000), null);
});

test('a declared span is read from span N or from explicit lines', () => {
  assert.equal(declaredSpan('span 2', 'span 2'), 2);
  assert.equal(declaredSpan('auto', 'span 3'), 3);
  assert.equal(declaredSpan('2', '4'), 2);
  assert.equal(declaredSpan('auto', 'auto'), 0);
  assert.equal(declaredSpan('1', '-1'), 0);
});

test('placement reads like CSS: 1-based lines, span when wider than one', () => {
  assert.equal(placementLabel([1, 2], [0, 0]), 'col 2 / span 2 · row 1');
  assert.equal(placementLabel([0, 0], [2, 4], { col: 'col', row: 'row' }), 'col 1 · row 3 / span 3');
  assert.equal(placementLabel(null, [0, 0]), 'row 1');
});

test('the theme names elements with [ name ]', () => {
  assert.equal(classLabel('[ testimonials-list ] grid grid-cols-3 gap-500'), 'testimonials-list');
  assert.equal(classLabel('flex items-center gap-400'), 'flex');
  assert.equal(classLabel(''), '');
  assert.equal(classLabel(null), '');
  assert.equal(elementLabel('UL', '[ testimonials-list ] grid'), 'ul.testimonials-list');
  assert.equal(elementLabel('DIV', ''), 'div');
});

test('empty cells are the ones no item covers', () => {
  const areas = [
    { col: [0, 1], row: [0, 0] },
    { col: [0, 0], row: [1, 1] },
    { col: null, row: null },
  ];

  assert.deepEqual(emptyCells(3, 2, areas), [
    [2, 0],
    [1, 1],
    [2, 1],
  ]);
  // Too many cells to be worth drawing one by one.
  assert.deepEqual(emptyCells(40, 40, []), []);
});

test('labels and arrows', () => {
  assert.equal(px(379.333), '379');
  assert.equal(px(4.25), '4.3');
  assert.equal(px(NaN), '');
  assert.equal(flexArrow('row'), '→');
  assert.equal(flexArrow('column'), '↓');
  assert.equal(flexArrow('row-reverse'), '←');
  assert.equal(flexArrow('column-reverse'), '↑');
});

function fakeWindow(features = {}) {
  const store = new Map();

  return {
    Statamic: { $config: { get: (key) => (key === 'sveFeatures' ? features : undefined) } },
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
    },
    store,
  };
}

test('prefs start from the defaults and keep only known values', () => {
  const win = fakeWindow();

  assert.deepEqual(readXrayPrefs(win), XRAY_DEFAULTS);

  writeXrayPrefs(win, { ...XRAY_DEFAULTS, on: true, boxes: true, scope: 'page' });
  assert.deepEqual(readXrayPrefs(win), { ...XRAY_DEFAULTS, on: true, boxes: true, scope: 'page' });

  win.store.set('sve-xray', JSON.stringify({ on: 'yes', scope: 'everything', grid: false }));
  assert.deepEqual(readXrayPrefs(win), { ...XRAY_DEFAULTS, grid: false });

  win.store.set('sve-xray', '{not json');
  assert.deepEqual(readXrayPrefs(win), XRAY_DEFAULTS);
});

test('the settings toggle switches the tool off; unknown means on', () => {
  assert.equal(xrayAllowed(fakeWindow({})), true);
  assert.equal(xrayAllowed(fakeWindow({ xray: true })), true);
  assert.equal(xrayAllowed(fakeWindow({ xray: false })), false);
});
