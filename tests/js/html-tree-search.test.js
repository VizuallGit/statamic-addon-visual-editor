import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesHtmlTreeRow, searchHtmlTreeRows } from '../../resources/js/cp/html-tree/search.js';

const rows = [
  { path: '0:section', tag: 'section', name: 'Employees list', klass: '' },
  { path: '0:section/0:h2', tag: 'h2', name: 'mb-400', klass: 'mb-400' },
  { path: '0:section/1:div', tag: 'div', name: 'bg-gray-100 wrapper', klass: 'bg-gray-100 wrapper' },
  { path: '0:section/1:div/0:p', tag: 'p', name: 'text-300', klass: 'text-300' },
  { path: '0:section/2:c12:component', tag: 'component', name: 'employee_card', klass: 'employee_card', src: 'components/employee_card' },
];

test('an empty query keeps every row and marks nothing', () => {
  const out = searchHtmlTreeRows(rows, '   ');

  assert.equal(out.rows, rows);
  assert.equal(out.hits.size, 0);
});

test('a match keeps the row and the rows above it, held back', () => {
  const out = searchHtmlTreeRows(rows, 'TEXT-3');

  assert.deepEqual(out.rows.map((row) => row.path), ['0:section', '0:section/1:div', '0:section/1:div/0:p']);
  assert.deepEqual([...out.hits], ['0:section/1:div/0:p']);
});

test('a match on a parent does not drag its children along', () => {
  const out = searchHtmlTreeRows(rows, 'wrapper');

  assert.deepEqual(out.rows.map((row) => row.path), ['0:section', '0:section/1:div']);
});

test('the tag, the class list and a component file all count', () => {
  assert.ok(matchesHtmlTreeRow(rows[1], 'h2'));
  assert.ok(matchesHtmlTreeRow(rows[2], 'gray'));
  assert.ok(matchesHtmlTreeRow(rows[4], 'components/emp'));
  assert.ok(!matchesHtmlTreeRow(rows[3], 'hero'));
});

test('a sibling prefix is not an ancestor', () => {
  const two = [
    { path: '0:section/1:div', tag: 'div', name: 'a' },
    { path: '0:section/10:div', tag: 'div', name: 'target' },
  ];
  const out = searchHtmlTreeRows(two, 'target');

  assert.deepEqual(out.rows.map((row) => row.path), ['0:section/10:div']);
});
