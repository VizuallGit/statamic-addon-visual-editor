import test from 'node:test';
import assert from 'node:assert/strict';
import { antlersTagAt, antlersTags, maskAntlers } from '../../resources/js/lib/antlers-tags.js';
import { findClassTags, hitAntlersTag, hitClassTag, hitPartial } from '../../resources/js/dock-partials.js';
import { flattenHtmlTree, parseHtmlTree } from '../../resources/js/html-tree-parse.js';
import { readCallParams, writeCallParam } from '../../resources/js/component-props.js';

const svg = '{{ svg src="{{ logo }}" width="auto" height="auto" class="max-h-500 w-auto" aria-hidden="true" }}';
const html = `<ul>\n  {{ collection from="companies" }}\n    <li class="bg-gray-800 p-500">\n      {{ if (logo | ends_with('.svg')) }}\n        ${svg}\n      {{ /if }}\n      <p>{{ teaser }}</p>\n    </li>\n  {{ /collection }}\n</ul>`;

test('a tag inside another tag\'s parameter is part of the outer tag', () => {
  const tags = antlersTags(html);

  assert.deepEqual(tags.map((tag) => (tag.closer ? '/' : '') + tag.name), ['collection', 'if', 'svg', '/if', 'teaser', '/collection']);
  assert.equal(html.slice(tags[2].from, tags[2].to), svg);
});

test('the mask blanks the whole svg tag, so no `class="…"` of it is left as text', () => {
  const masked = maskAntlers(html);

  assert.equal(masked.length, html.length);
  assert.equal(masked.includes('max-h-500'), false);
  assert.equal(masked.includes('<li class="bg-gray-800 p-500">'), true);
});

test('a comment and a tag still being typed are tags too', () => {
  const tags = antlersTags('{{# a {{ b }} #}} <p>{{ teas');

  assert.equal(tags[0].comment, true);
  assert.equal(tags[0].to, '{{# a {{ b }} #}}'.length);
  assert.equal(tags[1].name, 'teas');
  assert.equal(tags[1].closed, false);
});

test('the caret inside the svg tag is in that tag, and not in a partial', () => {
  const at = html.indexOf('max-h-500') + 'max-h-5'.length;

  assert.equal(antlersTagAt(html, at).name, 'svg');
  assert.equal(hitAntlersTag(html, at).name, 'svg');
  assert.equal(hitPartial(html, at), null);
  assert.equal(antlersTagAt(html, html.indexOf('<p>')), null);
});

test('a tag with a literal class of its own is a class tag; a loop, an if and a field are not', () => {
  const tags = findClassTags(html);

  assert.deepEqual(tags.map((tag) => tag.src), ['svg']);
  assert.equal(tags[0].tagCall, true);
  assert.equal(hitClassTag(html, html.indexOf('max-h-500')).src, 'svg');
  assert.equal(hitClassTag(html, html.indexOf('{{ teaser }}') + 3), null);
  assert.deepEqual(findClassTags('{{ partial:components/card class="p-4" }} {{ glide :src="logo" :class="cls" }}'), []);
});

test('the class tag reads and writes like a call: the parameter, nothing around it', () => {
  const tag = findClassTags(html)[0];
  const params = readCallParams(html.slice(tag.from, tag.to));

  assert.equal(params.get('class').value, 'max-h-500 w-auto');
  assert.equal(params.has('src'), false);

  const next = writeCallParam(html, tag, 'class', 'max-h-600 w-auto');

  assert.equal(next.includes('class="max-h-600 w-auto" aria-hidden="true" }}'), true);
  assert.equal(next.includes('<li class="bg-gray-800 p-500">'), true);
});

test('the HTML tree still sees the <li> as the tag around the svg, with its own class', () => {
  const rows = flattenHtmlTree(parseHtmlTree(html), new Set());
  const li = rows.find((row) => row.tag === 'li');

  assert.equal(li.klass, 'bg-gray-800');
  assert.equal(rows.some((row) => row.tag === 'svg'), false);
});
