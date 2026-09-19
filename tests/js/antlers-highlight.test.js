import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highlightRanges } from '../../resources/js/antlers-highlight.js';

const at = (text, ranges, needle, nth = 0) => {
  const from = text.split(needle, nth + 1).join(needle).length;
  const hit = ranges.find((range) => range.from === from);

  return hit ? hit.cls : null;
};

test('tag names wear the family the tree gives them', () => {
  const text = '<section class="wrapper"><h2>{{ headline }}</h2><img src="x"><br></section>';
  const ranges = highlightRanges(text);

  assert.equal(at(text, ranges, 'section'), 'fam-layout');
  assert.equal(at(text, ranges, 'h2'), 'fam-text');
  assert.equal(at(text, ranges, 'h2', 1), 'fam-text');
  assert.equal(at(text, ranges, 'img'), 'fam-media');
  assert.equal(at(text, ranges, 'br'), 'fam-other');
  assert.equal(at(text, ranges, 'section', 1), 'fam-layout');
});

test('a block is its family, open and close; a value is plain Antlers', () => {
  const text = '{{ if show }}<p>{{ title }}</p>{{ else }}x{{ /if }}{{ collection from="blog" }}{{ title }}{{ /collection }}{{ items }}{{ /items }}{{ svg src="x" }}';
  const ranges = highlightRanges(text);

  assert.equal(at(text, ranges, '{{ if show }}'), 'fam-if');
  assert.equal(at(text, ranges, '{{ else }}'), 'fam-if');
  assert.equal(at(text, ranges, '{{ /if }}'), 'fam-if-close');
  assert.equal(at(text, ranges, '{{ collection'), 'fam-loop');
  assert.equal(at(text, ranges, '{{ /collection }}'), 'fam-loop-close');
  assert.equal(at(text, ranges, '{{ items }}'), 'fam-loop');
  assert.equal(at(text, ranges, '{{ /items }}'), 'fam-loop-close');
  assert.equal(at(text, ranges, '{{ title }}'), 'antlers');
  assert.equal(at(text, ranges, '{{ svg'), 'antlers');
});

test('a partial call is a component, and a comment is a comment', () => {
  const text = '{{# note #}}{{ partial:components/card :props_title="title" }}{{ partial src="x" }}{{ /partial }}';
  const ranges = highlightRanges(text);

  assert.equal(at(text, ranges, '{{# note #}}'), 'comment');
  assert.equal(at(text, ranges, '{{ partial:components'), 'fam-component');
  assert.equal(at(text, ranges, '{{ partial src'), 'fam-component');
  assert.equal(at(text, ranges, '{{ /partial }}'), 'fam-component-close');
});

test('nothing inside an HTML comment gets a family, and ranges never overlap', () => {
  const text = '<!-- <div>{{ if a }}{{ /if }}</div> --><div>{{ if a }}{{ /if }}</div>';
  const ranges = highlightRanges(text);

  assert.ok(ranges.every((range) => range.from >= 40), JSON.stringify(ranges));

  let last = 0;

  for (const range of ranges) {
    assert.ok(range.from >= last);
    last = range.to;
  }
});

test('a loop close inside a branch keeps the loop colour', () => {
  const text = '{{ if a }}{{ items }}x{{ /items }}{{ else }}y{{ /if }}';
  const ranges = highlightRanges(text);

  assert.equal(at(text, ranges, '{{ /items }}'), 'fam-loop-close');
  assert.equal(at(text, ranges, '{{ else }}'), 'fam-if');
});
