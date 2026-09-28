import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tagAtCursor } from '../../resources/js/dock/tag-scan.js';

/** The position of `|` in a snippet, and the snippet without it. */
const at = (src) => {
  const pos = src.indexOf('|');

  return [src.slice(0, pos) + src.slice(pos + 1), pos];
};

/** The tag under the caret, with each of the element's tags as where it starts. */
const under = (src) => {
  const [text, pos] = at(src);
  const tag = tagAtCursor(text, pos);

  return tag && { name: tag.name, at: tag.at, open: tag.open?.from ?? null, close: tag.close?.from ?? null };
};

test('in content or outside any tag there is no tag under the caret', () => {
  assert.equal(under('<div>|</div>'), null);
  assert.equal(under('<p>hel|lo</p>'), null);
  assert.equal(under('|<div>x</div>'), null);
  assert.equal(under('<div>x</div>|'), null);
  assert.equal(under('<div>|x</div>'), null);
});

test('inside an opening tag the element is found with its closing tag', () => {
  assert.deepEqual(under('<di|v>x</div>'), { name: 'div', at: 'open', open: 0, close: 6 });
  assert.deepEqual(under('<div cl|ass="a">x</div>'), { name: 'div', at: 'open', open: 0, close: 16 });
  assert.deepEqual(under('<div>a<di|v>b</div>c</div>'), { name: 'div', at: 'open', open: 6, close: 12 });
});

test('just after the < and just before the > still count as inside', () => {
  assert.deepEqual(under('<|div>x</div>'), { name: 'div', at: 'open', open: 0, close: 6 });
  assert.deepEqual(under('<div|>x</div>'), { name: 'div', at: 'open', open: 0, close: 6 });
  assert.deepEqual(under('<div>x</div|>'), { name: 'div', at: 'close', open: 0, close: 6 });
});

test('the whole tag is returned, not just where it starts', () => {
  const [text, pos] = at('<h2 class="a">x</h|2>');
  const tag = tagAtCursor(text, pos);

  assert.equal(text.slice(tag.open.from, tag.open.to), '<h2 class="a">');
  assert.equal(text.slice(tag.close.from, tag.close.to), '</h2>');
});

test('inside a closing tag the element is found with its opening tag', () => {
  assert.deepEqual(under('<div>x</di|v>'), { name: 'div', at: 'close', open: 0, close: 6 });
  assert.deepEqual(under('<div>a<div>b</div>c</di|v>'), { name: 'div', at: 'close', open: 0, close: 19 });
  assert.deepEqual(under('<div>a</div><div>b</di|v>'), { name: 'div', at: 'close', open: 12, close: 18 });
  assert.deepEqual(under('<div><p>x</di|v>'), { name: 'div', at: 'close', open: 0, close: 9 });
});

test('a void tag has no closing tag', () => {
  assert.deepEqual(under('<img s|rc="">'), { name: 'img', at: 'open', open: 0, close: null });
  assert.deepEqual(under('<div cl|ass="" />'), { name: 'div', at: 'open', open: 0, close: null });
});

test('an unfinished tag is not a tag, an unclosed element has no closing tag', () => {
  assert.equal(under('<di|v'), null);
  assert.deepEqual(under('<section>x</section><di|v>'), { name: 'div', at: 'open', open: 20, close: null });
});

test('antlers and comments are not tags', () => {
  assert.equal(under('<p>{{ ex|pr }}</p>'), null);
  assert.equal(under('<!-- com|ment -->'), null);
  assert.deepEqual(under('<!-- <div> -->x</di|v>'), { name: 'div', at: 'close', open: null, close: 15 });
});

test('antlers inside a tag is part of the tag', () => {
  assert.deepEqual(under('<h1 {{ visual_edit }} cl|ass="">x</h1>'), { name: 'h1', at: 'open', open: 0, close: 32 });
});

test('a stray closing tag has no opening tag', () => {
  assert.deepEqual(under('x</di|v>'), { name: 'div', at: 'close', open: null, close: 1 });
});

test('a doctype is not an element', () => {
  assert.equal(under('<!doc|type html>'), null);
});
