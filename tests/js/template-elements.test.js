/**
 * Contract tests for template-elements.js — what the HTML tree's plus writes
 * into a template, and where.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATE_TAGS, templateElement, withTemplateElement } from '../../resources/js/template-elements.js';
import { flattenHtmlTree, parseTemplateTree } from '../../resources/js/html-tree-parse.js';

const TEMPLATE = [
  '<main class="wrapper">',
  '    <nav class="crumbs"></nav>',
  '    {{ page_sections }}',
  '        {{ partial src="partials/page_sections/{ type }" }}',
  '    {{ /page_sections }}',
  '</main>',
  '',
  '{{ sve_tw handle="view/default" }}',
  '',
].join('\n');

const rowsOf = (html) =>
  flattenHtmlTree(parseTemplateTree(html, { sectionLoops: ['page_sections'], sectionsLabel: 'Sidens sektioner' }), new Set());

test('the menu offers plain structural elements, section first', () => {
  assert.equal(TEMPLATE_TAGS[0], 'section');
  assert.ok(TEMPLATE_TAGS.includes('div'));
  assert.equal(templateElement('article'), '<article class="[ ]">\n    \n</article>');
  // A section keeps the spacing it always started with, and carries no page-section attributes.
  assert.equal(templateElement('section'), '<section class="[ ] py-800">\n    \n</section>');
  assert.equal(templateElement('script'), templateElement('div'), 'anything else is a div');
});

test('after the picked row, at its level, indented like it', () => {
  const nav = rowsOf(TEMPLATE).find((row) => row.tag === 'nav');
  const { html, at } = withTemplateElement(TEMPLATE, 'div', nav);

  assert.ok(html.includes('<nav class="crumbs"></nav>\n    <div class="[ ]">\n        \n    </div>\n    {{ page_sections }}'));
  assert.equal(html.slice(at, at + 4), '<div');

  // The new element is <main>'s child, beside the nav — not inside it.
  const div = rowsOf(html).find((row) => row.tag === 'div');
  assert.equal(div.depth, rowsOf(html).find((row) => row.tag === 'nav').depth);
});

test('after the sections slot: under the loop, never inside it', () => {
  const slot = rowsOf(TEMPLATE).find((row) => row.sectionsSlot);
  const { html } = withTemplateElement(TEMPLATE, 'section', slot);

  assert.ok(html.includes('{{ /page_sections }}\n    <section class="[ ] py-800">'));
  assert.equal(rowsOf(html).find((row) => row.sectionsSlot).hasChildren, false);
});

test('nothing picked: at the end of the file, after a blank line', () => {
  const { html, at } = withTemplateElement(TEMPLATE, 'aside');

  assert.ok(html.endsWith('{{ sve_tw handle="view/default" }}\n\n<aside class="[ ]">\n    \n</aside>\n'));
  assert.equal(html.slice(at, at + 6), '<aside');
  assert.equal(withTemplateElement('', 'div').html, '<div class="[ ]">\n    \n</div>\n');
});

test('a row the markup no longer holds is treated as nothing picked', () => {
  const { html } = withTemplateElement(TEMPLATE, 'div', { from: 9000, to: 9100 });

  assert.ok(html.endsWith('<div class="[ ]">\n    \n</div>\n'));
});
