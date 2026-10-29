/**
 * build-mode/svg.js — the `{{ svg }}` Add writes, the file Content swaps, and
 * the row Style hands the Tailwind pane.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { svgClassRow, svgMarkup, withSvgSrc } from '../../../resources/js/build-mode/svg.js';
import { flattenHtmlTree, parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';
import { findClassTags } from '../../../resources/js/dock-partials.js';
import { addAt } from '../../../resources/js/build-mode/place.js';

test('single quotes and spaces around = are the same src', () => {
  const html = "<div>{{ svg src = 'old' class=\"\" }}</div>";

  assert.equal(withSvgSrc(html, svgNode(html), 'new'), '<div>{{ svg src="new" class="" }}</div>');
});

const svgNode = (html, n = 0) => {
  const row = flattenHtmlTree(parseTemplateTree(html), new Set()).filter((item) => item.kind === 'svg')[n];

  return row ? findByPath(parseTemplateTree(html), row.path) : null;
};

test('the tile writes the tag, with a class for Style to write into', () => {
  assert.equal(svgMarkup('set-icons/hero'), '{{ svg src="set-icons/hero" class="" }}');
  assert.equal(svgMarkup('  logo '), '{{ svg src="logo" class="" }}');
});

test('a name that would end the parameter or turn into Antlers writes nothing', () => {
  assert.equal(svgMarkup('a"b'), '');
  assert.equal(svgMarkup("a'b"), '');
  assert.equal(svgMarkup('icons/{icon}'), '');
  assert.equal(svgMarkup(''), '');
});

test('written into a div, it is a row of its own, picked by its path', () => {
  const html = '<div class="flex">\n    <h2>Title</h2>\n</div>';
  const divPath = flattenHtmlTree(parseTemplateTree(html), new Set())[0].path;
  const out = addAt(html, divPath, svgMarkup('hero'));
  const node = findByPath(parseTemplateTree(out.html), out.path);

  assert.equal(node?.kind, 'svg', 'the new path is the svg row');
  assert.equal(node.src, 'hero');
});

test('swapping the file touches only src', () => {
  const html = '<div>\n    {{ svg src="old" class="w-600 text-primary" }}\n</div>';
  const node = svgNode(html);
  const next = withSvgSrc(html, node, 'set-icons/new');

  assert.equal(next, '<div>\n    {{ svg src="set-icons/new" class="w-600 text-primary" }}\n</div>');
  assert.equal(svgNode(next).path, node.path, 'the same row');
});

test('{{ svg:hero }} loses the name in the tag, and src says the file', () => {
  const html = '<p>{{ svg:hero class="h-400" }}</p>';
  const next = withSvgSrc(html, svgNode(html), 'arrow');

  assert.equal(next, '<p>{{ svg src="arrow" class="h-400" }}</p>');
  assert.equal(svgNode(next).src, 'arrow');
});

test('nothing is written for another row, a stale offset or a bad name', () => {
  const html = '<div>{{ svg src="a" }}</div>';
  const node = svgNode(html);

  assert.equal(withSvgSrc(html, { ...node, kind: 'component' }, 'b'), html);
  assert.equal(withSvgSrc(`x${html}`, node, 'b'), `x${html}`);
  assert.equal(withSvgSrc(html, node, 'b"c'), html);
});

test('Style\'s row is the call the Tailwind pane finds by where it starts and its name', () => {
  const html = '<div>{{ svg src="hero" class="" }} {{ svg:logo class="w-auto" }}</div>';

  for (const n of [0, 1]) {
    const row = svgClassRow(svgNode(html, n));
    const call = findClassTags(html).find((item) => item.from === row.from && item.src === row.src);

    assert.ok(row.tagCall && row.kind === 'component');
    assert.ok(call, `found ${row.src}`);
    assert.equal(call.to, row.to);
  }

  assert.equal(svgClassRow({ kind: 'component' }), null);
});
