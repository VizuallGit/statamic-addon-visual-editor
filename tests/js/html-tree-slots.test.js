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

/**
 * A template's loop over the page's sections — `{{ page_sections }}` or any
 * field a blueprint keeps them in — is one row of its own kind: nothing under
 * it, nothing dropped into it, moved and deleted whole.
 */
const TEMPLATE = [
  '<main class="wrapper">',
  '  <nav class="crumbs"></nav>',
  '  {{ page_sections }}',
  '      {{ _class = type | replace(\'/\', \'-\') }}',
  '      {{ partial src="partials/page_sections/{ type }" id="{{ id }}" }}',
  '  {{ /page_sections }}',
  '  <section class="cta"></section>',
  '</main>',
].join('\n');

const sectionsRows = (html, loops) =>
  flattenHtmlTree(parseTemplateTree(html, { sectionLoops: loops, sectionsLabel: 'Sidens sektioner' }), new Set());

test('a sections loop is one row of its own, with nothing under it', () => {
  const list = sectionsRows(TEMPLATE, ['page_sections']);
  const slot = list.find((row) => row.kind === 'sections');

  assert.ok(slot, 'no sections row');
  assert.equal(slot.tag, 'page_sections', 'the chip is the field');
  assert.equal(slot.klass, 'Sidens sektioner');
  assert.equal(slot.hasChildren, false);
  assert.equal(isTaglessRow(slot), true);
  // The partial call inside the loop is not drawn anywhere.
  assert.equal(list.some((row) => row.kind === 'component'), false);
  // Its neighbours are the template's own markup, above and below it, under <main>.
  assert.deepEqual(
    list.filter((row) => row.depth === 1).map((row) => row.tag),
    ['nav', 'page_sections', 'section']
  );
});

test('the slot spans the whole loop, open tag to close tag', () => {
  const slot = sectionsRows(TEMPLATE, ['page_sections']).find((row) => row.kind === 'sections');

  assert.ok(TEMPLATE.slice(slot.from, slot.to).startsWith('{{ page_sections }}'));
  assert.ok(TEMPLATE.slice(slot.from, slot.to).endsWith('{{ /page_sections }}'));
});

test('only the named fields become sections rows; any other loop stays a loop', () => {
  const lawyer = TEMPLATE.replaceAll('page_sections }}', 'lawyer_info }}').replace('{{ page_sections', '{{ lawyer_info');

  assert.equal(sectionsRows(lawyer, ['lawyer_info']).some((row) => row.kind === 'sections'), true);
  assert.equal(sectionsRows(TEMPLATE, ['lawyer_info']).some((row) => row.kind === 'sections'), false);
  // Without the option nothing changes: the loop and the call inside it.
  assert.equal(rows(TEMPLATE).some((row) => row.kind === 'antlers' && row.tag === 'page_sections'), true);
});
