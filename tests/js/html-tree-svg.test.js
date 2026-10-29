/**
 * html-tree-parse.js — `{{ svg }}` rows: Statamic's own tag, an element the
 * server draws from a file, as a row of its own in the tree and in Build.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flattenHtmlTree, isTaglessRow, parseTemplateTree } from '../../resources/js/html-tree-parse.js';
import { serializePickTree } from '../../resources/js/html-pick-align.js';
import { describeAt, findByPath } from '../../resources/js/build-mode/place.js';

const FILE = [
  '<section class="py-800">',
  '    <div class="flex">',
  '        {{ svg src="set-icons/hero" class="w-600" }}',
  '        <h2>Title</h2>',
  '        {{ svg:logo }}',
  '    </div>',
  '</section>',
  '',
].join('\n');

const rows = (html) => flattenHtmlTree(parseTemplateTree(html), new Set());
const svgs = (html) => rows(html).filter((row) => row.kind === 'svg');

test('a named file is a row in its place, with the tag\'s own offsets', () => {
  const all = rows(FILE);
  const hero = all.find((row) => row.kind === 'svg' && row.src === 'set-icons/hero');
  const from = FILE.indexOf('{{ svg src=');

  assert.ok(hero, 'the row is there');
  assert.equal(hero.tag, 'svg');
  assert.equal(hero.label, 'hero', 'named by the file');
  assert.equal(hero.from, from);
  assert.equal(hero.to, FILE.indexOf('}}', from) + 2);
  assert.match(hero.path, /\/i\d+:svg$/, 'inside the div, a step of its own');
  assert.deepEqual(
    all.map((row) => row.kind === 'svg' ? `svg ${row.label}` : row.tag),
    ['section', 'div', 'svg hero', 'h2', 'svg logo'],
    'in document order, among the tags'
  );
});

test('{{ svg:logo }} names its file in the tag', () => {
  const logo = svgs(FILE).find((row) => row.label === 'logo');

  assert.equal(logo.src, 'logo');
  assert.equal(findByPath(parseTemplateTree(FILE), logo.path).call, 'svg:logo', 'the tag\'s own name, for the Tailwind pane');
});

test('the tags keep their paths', () => {
  const without = FILE.replace(/\{\{ svg[^}]*\}\}/g, '');
  const tags = (html) => rows(html).filter((row) => !row.kind).map((row) => row.path);

  assert.deepEqual(tags(FILE), tags(without));
});

const FIELDS = [
  '<div>',
  '    {{ svg src="/icons/{{ icon }}" class="h-600" }}<span>{{ headline }}</span>',
  '    {{ svg :src="logo" class="w-auto" }}',
  '    {{ svg src="socialmedia/{type}" }}',
  '    {{ svg src="arrow-bg" }}',
  '    {{ svg class="x" }}',
  '</div>',
].join('\n');

test('a file read from a field is a row too, marked dynamic', () => {
  const roots = parseTemplateTree(FIELDS);
  const found = svgs(FIELDS).map((row) => findByPath(roots, row.path));

  assert.deepEqual(
    found.map((node) => [node.label, node.src, node.dynamic]),
    [
      ['{{ icon }}', '/icons/{{ icon }}', true],
      ['logo', 'logo', true],
      ['{type}', 'socialmedia/{type}', true],
      ['arrow-bg', 'arrow-bg', false],
    ],
    'a tag with no file at all draws nothing and gets no row'
  );
  assert.equal(describeAt(FIELDS, found[1].path).node.dynamic, true, 'Build knows the file is a field\'s');
  assert.equal(describeAt(FIELDS, found[3].path).node.dynamic, false);
});

test('the pick tree leaves a field\'s svg out: the tags after it are stamped where they are', () => {
  const div = serializePickTree(parseTemplateTree(FIELDS))[0];
  const bg = svgs(FIELDS).find((row) => row.src === 'arrow-bg');

  assert.deepEqual(div.children.map((node) => node.tag), ['span', 'svg']);
  assert.equal(div.children[1].path, bg.path, 'the <svg> drawn for arrow-bg is arrow-bg\'s, not the icon\'s');
});

test('not in a comment, not inside an opening tag', () => {
  const html = [
    '<div data-x="{{ svg src=\'a\' }}">',
    '    <!-- {{ svg src="b" }} -->',
    '    {{# {{ svg src="c" }} #}}',
    '    {{ svg src="d" }}',
    '</div>',
  ].join('\n');

  assert.deepEqual(svgs(html).map((row) => row.src), ['d']);
});

test('an svg row has no tag of its own to write into', () => {
  const row = svgs(FILE)[0];

  assert.equal(isTaglessRow(row), true);
});

test('Build names it svg, with the file it draws', () => {
  const path = svgs(FILE)[0].path;
  const { node } = describeAt(FILE, path);

  assert.equal(node.kind, 'svg');
  assert.equal(node.src, 'set-icons/hero');
  assert.equal(node.tag, 'svg');
});

test('the pick tree carries it, so the <svg> the server drew is stamped with its path', () => {
  const tree = serializePickTree(parseTemplateTree(FILE));
  const div = tree[0].children[0];

  assert.deepEqual(
    div.children.map((node) => node.tag),
    ['svg', 'h2', 'svg']
  );
  assert.equal(div.children[0].path, svgs(FILE)[0].path);
});
