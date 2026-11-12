import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CODE_KEYS,
  codeStaysTogether,
  dropTarget,
  isFixedPane,
  orderWith,
  parseZones,
  withZone,
  zoneOf,
} from '../../resources/js/cp/panel-zones/layout.js';

test('nothing stored is the editor as it was', () => {
  assert.equal(zoneOf({}, 'build'), 'left');
  assert.equal(zoneOf({}, 'html_tree'), 'right');
  assert.equal(zoneOf({}, 'theme'), 'right');
  CODE_KEYS.forEach((key) => assert.equal(zoneOf({}, key), 'bottom'));
  assert.equal(codeStaysTogether({}, false), true);
});

test('a stored list that is not one counts as nothing', () => {
  assert.deepEqual(parseZones('{nope'), {});
  assert.deepEqual(parseZones('[1]'), {});
  assert.deepEqual(parseZones(null), {});
  assert.equal(zoneOf({ theme: 'top' }, 'theme'), 'right');
});

test('the whole dock moves as all its panes', () => {
  const zones = withZone({}, 'code', 'right');

  CODE_KEYS.forEach((key) => assert.equal(zones[key], 'right'));
  assert.equal(codeStaysTogether(zones, false), false);
});

test('the dock stays one piece only below and alone', () => {
  assert.equal(codeStaysTogether({}, true), false);
  assert.equal(codeStaysTogether(withZone({}, 'code_html', 'left'), false), false);
  assert.equal(codeStaysTogether(withZone(withZone({}, 'code', 'left'), 'code', 'bottom'), false), true);
});

test('the Build panel and the dock panes are no tools to pin or close', () => {
  assert.equal(isFixedPane('build'), true);
  assert.equal(isFixedPane('code_css'), true);
  assert.equal(isFixedPane('html_tree'), false);
});

test('a pane goes before the one it was dropped on, the other zones keep their places', () => {
  assert.deepEqual(orderWith(['build', 'theme', 'ai'], ['build', 'theme'], ['ai'], 'theme'), ['build', 'ai', 'theme']);
  assert.deepEqual(orderWith(['ai', 'comments'], ['build'], ['html_tree'], ''), [
    'build',
    'html_tree',
    'ai',
    'comments',
  ]);
  assert.deepEqual(orderWith(['a', 'b', 'c'], ['a', 'b', 'c'], ['a'], 'c'), ['b', 'a', 'c']);
});

const rect = (left, top, right, bottom) => ({ left, top, right, bottom });
const areas = {
  left: {
    rect: rect(0, 50, 300, 1000),
    panes: [
      { key: 'build', rect: rect(0, 50, 300, 500) },
      { key: 'theme', rect: rect(0, 500, 300, 1000) },
    ],
  },
  right: { rect: rect(1300, 50, 1600, 1000), panes: [] },
  bottom: {
    rect: rect(300, 800, 1300, 1000),
    row: true,
    panes: [
      { key: 'tree', rect: rect(300, 800, 800, 1000) },
      { key: 'code_css', rect: rect(800, 800, 1300, 1000) },
    ],
  },
};

test('over the preview nothing moves', () => {
  assert.equal(dropTarget({ x: 800, y: 300 }, areas), null);
});

test('in a column a pane goes by height, below by width', () => {
  assert.deepEqual(dropTarget({ x: 100, y: 100 }, areas), { zone: 'left', before: 'build' });
  assert.deepEqual(dropTarget({ x: 100, y: 400 }, areas), { zone: 'left', before: 'theme' });
  assert.deepEqual(dropTarget({ x: 100, y: 900 }, areas), { zone: 'left', before: '' });
  assert.deepEqual(dropTarget({ x: 400, y: 900 }, areas), { zone: 'bottom', before: 'tree' });
  assert.deepEqual(dropTarget({ x: 700, y: 900 }, areas), { zone: 'bottom', before: 'code_css' });
  assert.deepEqual(dropTarget({ x: 1200, y: 900 }, areas), { zone: 'bottom', before: '' });
  assert.deepEqual(dropTarget({ x: 1400, y: 600 }, areas), { zone: 'right', before: '' });
});
