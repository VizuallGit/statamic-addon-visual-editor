import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flattenHtmlTree, parseTemplateTree } from '../../resources/js/html-tree-parse.js';

const rows = (html) => flattenHtmlTree(parseTemplateTree(html), new Set());
const byTag = (list, tag) => list.find((row) => row.tag === tag && !row.kind);

test('an empty div, section or list is hollow — room for children', () => {
  const list = rows('<section><div class="a"></div><ul>\n  </ul><li><!-- later --></li><article>{{# note #}}</article></section>');

  assert.equal(byTag(list, 'div').emptyTag, true);
  assert.equal(byTag(list, 'ul').emptyTag, true, 'whitespace is empty');
  assert.equal(byTag(list, 'li').emptyTag, true, 'an HTML comment renders nothing');
  assert.equal(byTag(list, 'article').emptyTag, true, 'an Antlers comment renders nothing');
  assert.equal(byTag(list, 'section').emptyTag, false, 'it has children');
});

test('an element with text or a value in it is not hollow', () => {
  const list = rows('<div><div>Hello</div><li>{{ title }}</li></div>');

  assert.equal(list[1].emptyTag, false);
  assert.equal(byTag(list, 'li').emptyTag, false);
});

test('a heading, a paragraph or a void tag is never hollow', () => {
  const list = rows('<div><h2></h2><p></p><span></span><img src="x"></div>');

  for (const tag of ['h2', 'p', 'span', 'img']) {
    assert.equal(byTag(list, tag).emptyTag, false, tag);
  }
});

test('an empty loop is an empty block, not a hollow tag', () => {
  const list = rows('<div>{{ collection:pages }}{{ /collection:pages }}</div>');
  const loop = list.find((row) => row.kind === 'antlers');

  assert.equal(loop.emptyBlock, true);
  assert.equal(loop.emptyTag, false);
});
