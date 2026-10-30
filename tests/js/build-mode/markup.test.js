/**
 * build-mode/markup.js — a tile writes what the dock's toolbar writes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addGroups } from '../../../resources/js/build-mode/catalog.js';
import { columnsMarkup, markupFor } from '../../../resources/js/build-mode/markup.js';
import { HTML_DIVS, HTML_HEADINGS, HTML_TOOLS } from './dock-lists.js';

const items = addGroups({ htmlTools: HTML_TOOLS, divs: HTML_DIVS, headings: HTML_HEADINGS }).flatMap((g) => g.items);
const tile = (id) => items.find((item) => item.id === id);
const TEXT = { heading: 'New heading', text: 'Text', button: 'Button', link: 'Link', item: 'Item' };
const write = (id, opts = {}) => markupFor(tile(id), { text: TEXT, ...opts });

test('the dock\'s snippets, exactly', () => {
  assert.equal(write('image'), '<img src="" alt="">');
  assert.equal(write('video'), '<video src="" controls playsinline></video>');
  assert.equal(write('loop'), '{{ items }}\n\n{{ /items }}');
  assert.equal(write('if'), '{{ if true }}\n\n{{ /if }}');
});

test('the div menu\'s classes, and nothing of Build\'s own', () => {
  assert.equal(write('container'), '<div class="wrapper"></div>');
  assert.equal(write('flex'), '<div class="flex"></div>');
  assert.equal(write('div'), '<div></div>');
  assert.equal(markupFor(items.find((i) => i.id === 'div:flex-col'), {}), '<div class="flex flex-col"></div>');
});

test('a section opens with the site\'s own section attributes, as the toolbar\'s does', () => {
  const attrs = 'id="id-{{ id }}" class="[ {{ _class }} ]" {{ visual_edit outline_inside="true" section_orderable="true" }}';

  assert.equal(write('section', { sectionTag: attrs }), `<section ${attrs}></section>`);
  assert.equal(write('section'), '<section></section>');
});

test('elements that hold text start with a word to see and click', () => {
  assert.equal(write('heading'), '<h2>New heading</h2>');
  assert.equal(write('heading', { heading: 'h3' }), '<h3>New heading</h3>');
  assert.equal(write('text'), '<p>Text</p>');
  assert.equal(write('link'), '<a href="">Link</a>');
  assert.equal(write('button'), '<a href="" class="btn">Button</a>');
  assert.equal(write('list'), '<ul>\n    <li>Item</li>\n</ul>');
  assert.equal(write('divider'), '<hr>');
  assert.equal(write('richtext'), '<div class="prose">\n    <p>Text</p>\n</div>');
  assert.equal(write('article'), '<article></article>');
  assert.equal(markupFor(tile('heading'), { text: { heading: 'A <b> & c' } }), '<h2>A &lt;b&gt; &amp; c</h2>');
});

test('a grid: one empty div per cell, its columns stacked at the narrowest size', () => {
  assert.equal(columnsMarkup('3', 'max-md'), '<div class="grid grid-cols-3 max-md:grid-cols-1">\n    <div></div>\n    <div></div>\n    <div></div>\n</div>');
  assert.equal(columnsMarkup('1', 'max-md'), '<div class="grid grid-cols-1">\n    <div></div>\n</div>');
  assert.equal(columnsMarkup('21', 'max-sm'), '<div class="grid grid-cols-[2fr_1fr] max-sm:grid-cols-1">\n    <div></div>\n    <div></div>\n</div>');
  assert.equal(write('grid', { structure: '4', mobile: 'max-md' }).split('<div></div>').length - 1, 4);
});

test('a grid\'s rows: a line of cells per row, the same columns', () => {
  assert.equal(columnsMarkup('2', 'max-md', 2), '<div class="grid grid-cols-2 max-md:grid-cols-1">\n    <div></div>\n    <div></div>\n    <div></div>\n    <div></div>\n</div>');
  assert.equal(write('grid', { structure: '3', rows: 3 }).split('<div></div>').length - 1, 9);
  assert.equal(write('grid', { structure: '2', rows: 0 }).split('<div></div>').length - 1, 2);
});
