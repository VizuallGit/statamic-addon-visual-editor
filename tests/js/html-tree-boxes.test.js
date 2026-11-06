import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flattenHtmlTree, parseTemplateTree } from '../../resources/js/html-tree-parse.js';
import { treeBoxes } from '../../resources/js/cp/html-tree/boxes.js';

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

const r = (id, depth) => ({ id, depth });
const noRoom = () => false;

test('boxes close where the next row stands further out', () => {
  // section > div > (h2, p) ; div
  const boxes = treeBoxes([r('s', 0), r('d', 1), r('h', 2), r('p', 2), r('e', 1)], noRoom);

  assert.deepEqual(boxes.get('h'), { ends: 0, after: 0, roomEnds: 0 });
  assert.equal(boxes.get('p').ends, 1, "the div's box closes after its last child");
  assert.equal(boxes.get('e').after, 1, 'the next row starts below that box');
  assert.equal(boxes.get('e').ends, 1, "the last row closes the section's box");
});

test('several boxes can close after one row', () => {
  const boxes = treeBoxes([r('a', 0), r('b', 1), r('c', 2), r('d', 3), r('z', 0)], noRoom);

  assert.equal(boxes.get('d').ends, 3);
  assert.equal(boxes.get('z').after, 3);
  assert.equal(boxes.get('z').ends, 0, 'a lone row at the top is a card, not a box');
});

test('an empty room sits inside its row and closes the boxes after it', () => {
  const boxes = treeBoxes([r('s', 0), r('d', 1), r('x', 1)], (row) => row.id === 'd');

  assert.equal(boxes.get('d').ends, 0, 'the room follows inside the div');
  assert.equal(boxes.get('d').roomEnds, 1, "the room closes the div's box");
  assert.equal(boxes.get('x').after, 1);
  assert.equal(boxes.get('x').ends, 1);
});

test('on the layout the list goes on inside <main> after its last row', () => {
  const boxes = treeBoxes([r('main', 0), r('slot', 1)], noRoom, 1);

  assert.equal(boxes.get('slot').ends, 0, "main's box stays open for the sections");
});
