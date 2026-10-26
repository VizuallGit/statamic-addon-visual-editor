/**
 * antlers-options.js: what the HTML pane's list offers inside `{{ … }}` —
 * the site's collections while `collection` is typed, the fields that fit the
 * word (by handle or by a word of the label), and the loop a collection is
 * written as.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { antlersWord, closingAfter, collectionLoop, collectionOptions, fieldOptions } from '../../resources/js/dock/antlers-options.js';

const COLLECTIONS = [
  { handle: 'employees', title: 'Employees' },
  { handle: 'pages', title: 'Pages' },
  { handle: 'cases', title: 'Cases' },
];

const ROWS = [
  { var: 'name', label: 'Name', type: 'text' },
  { var: 'profile_image', label: 'Profile image', type: 'assets' },
  { var: 'position', label: 'Position', type: 'text' },
  { var: 'url', label: 'URL', type: 'text' },
];

test('the word is the first one after {{, nothing past it', () => {
  assert.deepEqual(antlersWord('  <li>{{ coll', 13), { word: 'coll', from: 9 });
  assert.deepEqual(antlersWord('{{ ', 3), { word: '', from: 3 });
  assert.equal(antlersWord('<li>name', 8), null);
  assert.equal(antlersWord('{{ partial src="x', 17), null);
  assert.equal(antlersWord('{{ title }} more', 16), null);
});

test('collection: every collection on the way, then by handle or title', () => {
  assert.deepEqual(collectionOptions(COLLECTIONS, 'coll').map((row) => row.handle), ['employees', 'pages', 'cases']);
  assert.deepEqual(collectionOptions(COLLECTIONS, 'c').map((row) => row.handle), ['employees', 'pages', 'cases']);
  assert.deepEqual(collectionOptions(COLLECTIONS, 'collection:em').map((row) => row.handle), ['employees']);
  assert.deepEqual(collectionOptions(COLLECTIONS, 'na'), []);
});

test('a collection is written as its loop, the caret on the item line', () => {
  const loop = collectionLoop('employees', '  ');

  assert.equal(loop.text, 'collection from="employees" }}\n    \n  {{ /collection }}');
  assert.equal(loop.text.slice(0, loop.cursor), 'collection from="employees" }}\n    ');
});

test('fields fit by handle or by a word of the label', () => {
  assert.deepEqual(fieldOptions(ROWS, 'na').map((row) => row.var), ['name']);
  assert.deepEqual(fieldOptions(ROWS, 'pro').map((row) => row.var), ['profile_image']);
  assert.deepEqual(fieldOptions(ROWS, 'ima').map((row) => row.var), ['profile_image']);
  assert.deepEqual(fieldOptions(ROWS, 'po').map((row) => row.var), ['position']);
  assert.equal(fieldOptions(ROWS, '').length, 4);
  assert.deepEqual(fieldOptions(ROWS, 'zz'), []);
});

test('a }} already after the caret is not written twice', () => {
  assert.equal(closingAfter(' }}</li>'), 3);
  assert.equal(closingAfter('}}'), 2);
  assert.equal(closingAfter('</li>'), 0);
});
