import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flattenHtmlTree, isTaglessRow, parseTemplateTree } from '../../resources/js/html-tree-parse.js';

const rows = (html) => flattenHtmlTree(parseTemplateTree(html), new Set());
const slots = (html) => rows(html).filter((row) => row.kind === 'slot');

test('template_content is a row, inside the element that holds it', () => {
  const list = rows('<body><main>{{ template_content }}</main></body>');
  const slot = list.find((row) => row.kind === 'slot');

  assert.ok(slot, 'no slot row');
  assert.equal(slot.label, 'template_content');
  assert.equal(slot.depth, 2, 'the slot sits under <main>, not beside it');
  assert.equal(list.find((row) => row.tag === 'main').hasChildren, true);
});

test('a yield is a slot too, and keeps its name', () => {
  const [slot] = slots('<div>{{ yield:footer_scripts }}</div>');

  assert.equal(slot.label, 'yield:footer_scripts');
});

test('the tags around a slot keep their paths', () => {
  const without = rows('<body><header></header><main></main></body>');
  const with_ = rows('<body><header></header><main>{{ template_content }}</main></body>');
  const paths = (list) => list.filter((row) => !row.kind).map((row) => row.path);

  assert.deepEqual(paths(with_), paths(without));
});

test('a slot is not a tag, so nothing may write into it', () => {
  const [slot] = slots('<main>{{ template_content }}</main>');

  assert.equal(isTaglessRow(slot), true);
  assert.equal(isTaglessRow({ kind: 'component' }), true);
  assert.equal(isTaglessRow({ kind: '', tag: 'div' }), false);
});

test('the row spans the whole tag, so it highlights what it stands for', () => {
  const html = '<main>{{ template_content }}</main>';
  const [slot] = slots(html);

  assert.equal(html.slice(slot.from, slot.to), '{{ template_content }}');
  assert.equal(slot.openTo, slot.to, 'a slot has no inside');
});

test('a commented-out slot is not a row', () => {
  assert.equal(slots('<main>{{# {{ template_content }} #}}</main>').length, 0);
});

test('other single Antlers tags stay out of the tree', () => {
  const list = rows('<head>{{ vite src="x.css" }}{{ yield_scripts }}{{ theme_tokens }}</head>');

  assert.deepEqual(list.map((row) => row.tag), ['head']);
});
