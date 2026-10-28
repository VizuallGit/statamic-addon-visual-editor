/**
 * build-mode/catalog.js — Build arranges the dock's own tools, against the
 * dock's real lists (dock-lists.js reads them out of code-dock.js).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BUILD_TOOLS, STYLE_GROUPS, addGroups, elementKind, holdsElements, styleGroups } from '../../../resources/js/build-mode/catalog.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
import { CSS_TOOLS, HTML_DIVS, HTML_HEADINGS, HTML_TOOLS } from './dock-lists.js';

const dock = { htmlTools: HTML_TOOLS, divs: HTML_DIVS, headings: HTML_HEADINGS };

test('Add shows the brief\'s groups, in order, every tile resolved', () => {
  const groups = addGroups(dock);
  const ids = (id) => groups.find((g) => g.id === id).items.map((item) => item.id);

  assert.deepEqual(groups.map((g) => g.id).slice(0, 4), ['layout', 'basic', 'logic', 'tags']);
  assert.deepEqual(ids('layout'), ['section', 'container', 'grid', 'flex', 'div']);
  assert.deepEqual(ids('basic'), ['heading', 'text', 'button', 'link', 'image', 'video', 'list', 'divider']);
  assert.deepEqual(ids('logic'), ['loop', 'if']);
  assert.deepEqual(ids('tags'), ['article', 'aside', 'nav', 'header', 'footer', 'figure']);
});

test('a tile the dock has is the dock\'s own definition, not a copy', () => {
  const items = addGroups(dock).flatMap((g) => g.items);
  const byId = (id) => items.find((item) => item.id === id);

  assert.equal(byId('image').def, HTML_TOOLS.find((t) => t.id === 'img'));
  assert.equal(byId('container').def, HTML_DIVS.find((d) => d.id === 'container'));
  assert.equal(byId('loop').def, HTML_TOOLS.find((t) => t.id === 'loop'));
  assert.equal(byId('heading').headings, HTML_HEADINGS);
});

test('what the dock has and no group names shows up under Other, by itself', () => {
  const other = addGroups(dock).find((g) => g.id === 'other');

  assert.ok(other.items.some((item) => item.id === 'li'), 'list item');
  assert.ok(other.items.some((item) => item.id === 'div:flex-col' && item.lang === 'code_dock_div_flex_col'));
  assert.ok(!other.items.some((item) => ['component', 'pagination', 'div'].includes(item.id)), 'not elements, or tiles already');

  const more = addGroups({ ...dock, htmlTools: [...HTML_TOOLS, { id: 'table', title: 'table', tag: 'table' }] });
  assert.ok(more.find((g) => g.id === 'other').items.some((item) => item.id === 'table'), 'a tool added to the dock later');
});

test('a dock element that is gone is left out, not drawn dead', () => {
  const groups = addGroups({ ...dock, htmlTools: HTML_TOOLS.filter((t) => t.id !== 'video') });

  assert.ok(!groups.flatMap((g) => g.items).some((item) => item.id === 'video'));
});

test('Style draws every CSS_TOOLS tool once, in the brief\'s families', () => {
  const groups = styleGroups(CSS_TOOLS);
  const drawn = groups.flatMap((g) => g.tools.map((t) => t.id));

  assert.deepEqual(groups.map((g) => g.id).slice(0, 9), STYLE_GROUPS.map((g) => g.id));
  for (const tool of CSS_TOOLS) {
    assert.equal(drawn.filter((id) => id === tool.id).length, 1, tool.id);
  }
  assert.equal(groups.find((g) => g.id === 'spacing').tools[0], CSS_TOOLS.find((t) => t.id === 'padding'));
  BUILD_TOOLS.forEach((tool) => assert.ok(drawn.includes(tool.id), tool.id));
  assert.ok(!groups.some((g) => g.id === 'other'), 'today every tool has a family');

  const later = styleGroups([...CSS_TOOLS, { id: 'tw-blur', title: 'Blur', css: 'filter', tw: 'filter', menu: 'values' }]);
  assert.equal(later.find((g) => g.id === 'other').tools[0].id, 'tw-blur');
});

test('an element is named from the file: tag and classes', () => {
  const html = [
    '<section class="py-800">',
    '    <div class="wrapper">',
    '        <div class="grid grid-cols-2 max-md:grid-cols-1">',
    '            <div><h2>Hi</h2><p>Text</p></div>',
    '            <div><a href="" class="btn">Go</a><a href="">More</a><img src="" alt=""><hr></div>',
    '        </div>',
    '        <div class="grid grid-cols-3"><article></article></div>',
    '        <div class="flex"></div>',
    '        {{ partial:components/card }}',
    '        {{ if show }}<div></div>{{ /if }}',
    '    </div>',
    '</section>',
  ].join('\n');
  const roots = parseTemplateTree(html);
  const cls = (n) => (/class="([^"]*)"/.exec(html.slice(n.from, n.openTo)) || [])[1] || '';
  const kinds = [];
  const walk = (nodes, parent) => nodes.forEach((n) => { kinds.push(elementKind(n, cls(n), parent, parent ? cls(parent) : '')); walk(n.children, n); });
  walk(roots, null);

  assert.deepEqual(kinds, ['section', 'container', 'columns', 'column', 'heading', 'text', 'column', 'button', 'link', 'image', 'divider', 'grid', 'tag', 'flex', 'component', 'if', 'div']);
});

test('what can hold elements', () => {
  const roots = parseTemplateTree('<div><ul><li></li></ul><p></p><img src=""><figure></figure></div>{{ if a }}{{ /if }}');
  const [div, ifRow] = roots;
  const [ul, p, img, figure] = div.children;

  assert.ok(holdsElements(div));
  assert.ok(holdsElements(ifRow));
  assert.ok(!holdsElements(ul), 'a list holds items only');
  assert.ok(holdsElements(ul.children[0]), 'an item holds anything');
  assert.ok(!holdsElements(p));
  assert.ok(!holdsElements(img));
  assert.ok(holdsElements(figure));
  assert.ok(!holdsElements({ ...div, locked: true }));
});
