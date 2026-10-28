/**
 * build-mode/place.js — where a new element lands, and the file with it there.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addAt, findByPath, insertAt, pathAt, placeFor } from '../../../resources/js/build-mode/place.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const FILE = [
  '<section id="id-{{ id }}" class="[ {{ _class }} ] py-800">',
  '    <div class="wrapper">',
  '        <h2>Title</h2>',
  '        <div class="grid grid-cols-2 max-md:grid-cols-1">',
  '            <div>',
  '                <p>One</p>',
  '            </div>',
  '            <div></div>',
  '        </div>',
  '    </div>',
  '</section>',
  '',
].join('\n');

const pathOf = (html, test) => {
  let found = '';
  const walk = (nodes) => nodes.forEach((n) => { if (!found && test(n, html)) found = n.path; walk(n.children); });
  walk(parseTemplateTree(html));
  return found;
};
const P = '<p>New</p>';

test('a text element gets the new one after it, at its own indent', () => {
  const h2 = pathOf(FILE, (n) => n.tag === 'h2');
  const out = addAt(FILE, h2, P);

  assert.ok(out.html.includes('        <h2>Title</h2>\n        <p>New</p>\n        <div class="grid'));
  assert.equal(out.html.slice(out.at, out.at + P.length), P);
  assert.equal(findByPath(parseTemplateTree(out.html), out.path).tag, 'p');
});

test('a section fills its container, as its last child', () => {
  const out = addAt(FILE, '0:section', P);

  assert.ok(out.html.includes('        </div>\n        <p>New</p>\n    </div>\n</section>'), out.html);
  assert.equal(out.place.parent.path, '0:section/0:div');
});

test('columns fill their first empty column, which opens up around it', () => {
  const grid = pathOf(FILE, (n, html) => html.slice(n.from, n.openTo).includes('grid-cols-2'));
  const out = addAt(FILE, grid, P);

  assert.ok(out.html.includes('            <div>\n                <p>New</p>\n            </div>\n        </div>'), out.html);
  assert.equal(findByPath(parseTemplateTree(out.html), out.path).tag, 'p');
});

test('a column with something in it gets the new one at the end', () => {
  const firstCol = pathOf(FILE, (n) => n.tag === 'div' && n.children[0]?.tag === 'p');
  const out = addAt(FILE, firstCol, '<ul>\n    <li>Item</li>\n</ul>');

  assert.ok(out.html.includes('                <p>One</p>\n                <ul>\n                    <li>Item</li>\n                </ul>\n            </div>'), out.html);
});

test('nothing picked: the end of the file, after a blank line', () => {
  const out = addAt(FILE, '', P);

  assert.ok(out.html.endsWith('</section>\n\n<p>New</p>\n'));
  assert.equal(out.place.mode, 'end');
});

test('a loop takes the new element inside it, before its closing tag', () => {
  const html = '<div>\n    {{ items }}\n        <p>{{ title }}</p>\n    {{ /items }}\n</div>\n';
  const loop = pathOf(html, (n) => n.kind === 'antlers');
  const out = addAt(html, loop, '<span></span>');

  assert.ok(out.html.includes('        <p>{{ title }}</p>\n        <span></span>\n    {{ /items }}'), out.html);
});

test('a locked element and anything inside it take nothing', () => {
  const html = '{{# sve-lock #}}\n<div>\n    <p>Fixed</p>\n</div>\n';
  const roots = parseTemplateTree(html);

  assert.equal(placeFor(html, roots, roots[0].path), null);
  assert.equal(placeFor(html, roots, roots[0].children[0].path), null);
  assert.equal(addAt(html, roots[0].path, P), null);
});

test('a one-line empty element opens up', () => {
  const out = addAt('<div class="flex"></div>\n', '0:div', P);

  assert.equal(out.html, '<div class="flex">\n    <p>New</p>\n</div>\n');
});

test('before: its own line in front of the row, at the row’s indent; a lock stays with its element', () => {
  const roots = parseTemplateTree(FILE);
  const h2 = findByPath(roots, pathOf(FILE, (n) => n.tag === 'h2'));
  const out = insertAt(FILE, { mode: 'before', before: h2 }, '<div>\n    <p>New</p>\n</div>');

  assert.ok(out.html.includes('    <div class="wrapper">\n        <div>\n            <p>New</p>\n        </div>\n        <h2>Title</h2>'), out.html);
  assert.equal(findByPath(parseTemplateTree(out.html), pathAt(out.html, out.at)).tag, 'div');

  const locked = '<div>\n    {{# sve-lock #}}\n    <p>Fixed</p>\n</div>\n';
  const p = parseTemplateTree(locked)[0].children[0];
  const next = insertAt(locked, { mode: 'before', before: p }, P);

  assert.equal(next.html, '<div>\n    <p>New</p>\n    {{# sve-lock #}}\n    <p>Fixed</p>\n</div>\n');
  assert.equal(next.html.slice(next.at, next.at + P.length), P);
});
