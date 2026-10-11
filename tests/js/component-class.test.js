import test from 'node:test';
import assert from 'node:assert/strict';
import { callClassParam, readCallParams, writeCallParam } from '../../resources/js/component-props.js';
import { findPartials, hitPartial } from '../../resources/js/dock-partials.js';
import { twCandidates } from '../../resources/js/tw-candidates.js';
import { flattenHtmlTree, parseHtmlTree, parseTemplateTree } from '../../resources/js/html-tree-parse.js';

const html = '<section>\n  {{ partial:components/section_heading }}\n</section>';

function call(source) {
  return findPartials(source)[0];
}

test('a call names the class parameter it already writes', () => {
  assert.equal(callClassParam('{{ partial:components/card class="p-400" }}'), 'class');
  assert.equal(callClassParam('{{ partial:components/card _class="p-400" }}'), '_class');
  assert.equal(callClassParam('{{ partial:components/card props_class="p-400" }}'), 'props_class');
  assert.equal(callClassParam('{{ partial:components/card props_width="100" }}'), '');
});

test('the first class lands as a parameter on the call, not on the tag around it', () => {
  const next = writeCallParam(html, call(html), 'class', 'mt-400');

  assert.equal(next, '<section>\n  {{ partial:components/section_heading class="mt-400" }}\n</section>');
});

test('a class value is replaced in place, the other parameters untouched', () => {
  const source = '{{ partial:components/image :imagePath="profile_image" class="size-800 rounded-full" }}';
  const next = writeCallParam(source, call(source), 'class', 'size-800 rounded-full p-200');

  assert.equal(next, '{{ partial:components/image :imagePath="profile_image" class="size-800 rounded-full p-200" }}');
  assert.equal(readCallParams(next).get('imagePath').bound, true);
});

test('the last class removed takes the parameter with it', () => {
  const source = '{{ partial:components/card class="p-400" }}';

  assert.equal(writeCallParam(source, call(source), 'class', ''), '{{ partial:components/card }}');
});

test('a bound class is read as an expression, not as classes', () => {
  const param = readCallParams('{{ partial:components/card :class="card_class" }}').get('class');

  assert.equal(param.bound, true);
});

test('the cursor in a call finds the component row — the tags-only tree never has one', () => {
  const source = '<section class="wrapper">\n  {{ partial:components/section_heading }}\n  <ul class="grid"></ul>\n</section>';
  const pos = source.indexOf('section_heading');
  const component = flattenHtmlTree(parseTemplateTree(source), new Set()).find(
    (row) => row.kind === 'component' && row.from <= pos && pos < row.to
  );

  assert.ok(hitPartial(source, pos));
  assert.equal(component.src, 'components/section_heading');
  assert.equal(source.slice(component.from, component.to), '{{ partial:components/section_heading }}');
  assert.equal(flattenHtmlTree(parseHtmlTree(source), new Set()).some((row) => row.kind === 'component'), false);
});

test('the cursor between tags is no call', () => {
  const source = '<section>\n  {{ partial:components/section_heading }}\n  <ul></ul>\n</section>';

  assert.equal(hitPartial(source, source.indexOf('<ul')), null);
});

test('a call’s _class and props_class reach the compiler, like its class', () => {
  const html = '{{ partial:components/a class="mt-400" }}{{ partial:components/b _class="p-200" }}{{ partial:components/c props_class="gap-300" }}<div data_class="nope"></div>';

  assert.deepEqual(twCandidates(html).sort(), ['gap-300', 'mt-400', 'p-200']);
});
