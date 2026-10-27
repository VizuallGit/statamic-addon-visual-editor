/**
 * build-mode/place.js columnsFor — which columns the preview outlines for a pick.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { columnsFor } from '../../../resources/js/build-mode/place.js';

const FILE = [
  '<section class="py-800">',
  '    <div class="wrapper">',
  '        <h2>Title</h2>',
  '        <div class="grid grid-cols-3">',
  '            <div><p>One</p></div>',
  '            <div></div>',
  '            <div></div>',
  '        </div>',
  '    </div>',
  '</section>',
  '',
].join('\n');

const GRID = '0:section/0:div/1:div';

test('a picked Columns draws its columns, the empty ones marked', () => {
  const out = columnsFor(FILE, GRID);

  assert.equal(out.path, GRID);
  assert.deepEqual(out.columns.map((c) => c.empty), [false, true, true]);
});

test('a picked column draws the Columns around it', () => {
  assert.equal(columnsFor(FILE, `${GRID}/1:div`).path, GRID);
});

test('anything else draws nothing', () => {
  assert.equal(columnsFor(FILE, '0:section/0:div/0:h2'), null);
  assert.equal(columnsFor(FILE, ''), null);
});
