import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlLanguage } from '@codemirror/lang-html';
import { findAntlersBlocks, loopOptions } from '../../resources/js/antlers-blocks.js';
import { writeLoopPagination, writeLoopTag } from '../../resources/js/antlers-edit.js';
import { antlersSnippet, expandAntlersSnippet } from '../../resources/js/antlers-snippets.js';
import { lintTemplate } from '../../resources/js/template-lint.js';

/** The first loop of a kind, shaped like the tree's row (`antlers: 'loop'`). */
const row = (text, loopKind) => {
  const block = findAntlersBlocks(text).find((item) => item.kind === 'loop' && (!loopKind || item.loopKind === loopKind));

  return block ? { ...block, antlers: 'loop' } : null;
};

const flat = (text) => text.replace(/\s+/g, ' ').trim();
const count = (text, needle) => text.split(needle).length - 1;
const page = (text, on) => writeLoopPagination(text, row(text, 'collection'), on);

const BLOG = [
  '<ul>',
  '  {{ collection from="blog" sort="date:desc" limit="3" offset="1" }}',
  '    <li>{{ title }}</li>',
  '    <li>{{ date }}</li>',
  '  {{ /collection }}',
  '</ul>',
].join('\n');

test('loopOptions reads an offset in both languages', () => {
  assert.equal(loopOptions(' from="blog" limit="3" offset="2" ', true).offset, '2');
  assert.equal(loopOptions(' from="blog" limit="3" ', true).offset, '');

  const field = loopOptions(' | sort:title | offset:2 | limit:3 ', false);

  assert.equal(field.offset, '2');
  assert.equal(field.limit, '3');
  assert.equal(loopOptions(' | limit:3 ', false).offset, '');
});

test('loopOptions reads pagination and the alias on a collection only', () => {
  const paged = loopOptions(' from="blog" paginate="true" limit="12" as="entries" ', true);

  assert.equal(paged.paginate, true);
  assert.equal(paged.alias, 'entries');
  assert.equal(loopOptions(' from="blog" paginate="1" ', true).paginate, true);
  assert.equal(loopOptions(' from="blog" paginate="false" ', true).paginate, false);

  const plain = loopOptions(' from="blog" as="posts" ', true);

  assert.equal(plain.paginate, false);
  assert.equal(plain.alias, 'posts');
  assert.equal(loopOptions(' | limit:3 ', false).paginate, false);
});

test('the paginate pair is not a loop row, the loops around it carry what they read', () => {
  const src = page(BLOG, true);
  const loops = findAntlersBlocks(src).filter((item) => item.kind === 'loop');

  assert.deepEqual(loops.map((item) => item.name), ['collection', 'entries']);
  assert.equal(loops[0].paginate, true);
  assert.equal(loops[0].alias, 'entries');
  assert.equal(loops[0].offset, '1');
});

test('writeLoopTag writes and removes offset on a collection, after limit', () => {
  const src = '{{ collection from="blog" limit="3" }}\n  {{ title }}\n{{ /collection }}';
  const added = writeLoopTag(src, row(src), { offset: '2' });

  assert.match(added, /^\{\{ collection from="blog" limit="3" offset="2" \}\}/);
  assert.equal(writeLoopTag(added, row(added), { offset: '' }), src);
  // Changing something else keeps the offset.
  assert.match(writeLoopTag(added, row(added), { limit: '6' }), /limit="6" offset="2"/);
});

test('writeLoopTag leaves paginate and as where they are', () => {
  const src = '{{ collection from="blog" limit="12" paginate="true" as="entries" }}\n  {{ entries }}{{ title }}{{ /entries }}\n{{ /collection }}';
  const out = writeLoopTag(src, row(src, 'collection'), { offset: '2' });

  assert.match(out, /^\{\{ collection from="blog" limit="12" offset="2" paginate="true" as="entries" \}\}/);
  assert.match(writeLoopTag(out, row(out, 'collection'), { offset: '' }), /^\{\{ collection from="blog" limit="12" paginate="true" as="entries" \}\}/);
});

test('writeLoopTag writes offset on a field loop as a modifier, before limit', () => {
  const src = '{{ items | limit:3 }}\n  {{ title }}\n{{ /items }}';
  const added = writeLoopTag(src, row(src), { offset: '2' });

  // Modifiers run in order: offset first, or the limit counts the skipped ones.
  assert.match(added, /^\{\{ items \| offset:2 \| limit:3 \}\}/);
  assert.equal(writeLoopTag(added, row(added), { offset: '' }), src);
});

test('a nav loop takes no offset', () => {
  const src = '{{ nav handle="main" max_depth="1" }}\n  {{ title }}\n{{ /nav }}';

  assert.doesNotMatch(writeLoopTag(src, row(src), { offset: '2' }), /offset/);
});

test('writeLoopPagination on: parameters, one wrapper, one pager', () => {
  const on = page(BLOG, true);

  assert.match(on, /\{\{ collection from="blog" sort="date:desc" limit="3" offset="1" paginate="true" as="entries" \}\}/);
  assert.equal(count(on, '{{ entries }}'), 1);
  assert.equal(count(on, '{{ /entries }}'), 1);
  assert.equal(count(on, '{{ paginate }}{{ partial:components/pagination }}{{ /paginate }}'), 1);
  // The wrapper sits inside the loop, the pager after the wrapper.
  assert.ok(on.indexOf('{{ entries }}') < on.indexOf('<li>{{ title }}'));
  assert.ok(on.indexOf('{{ /entries }}') < on.indexOf('{{ paginate }}'));
  assert.ok(on.indexOf('{{ /paginate }}') < on.indexOf('{{ /collection }}'));
  assert.deepEqual(lintTemplate(on, htmlLanguage.parser), []);
});

test('writeLoopPagination on twice is on once', () => {
  const on = page(BLOG, true);

  assert.equal(page(on, true), on);
});

test('writeLoopPagination off gives the loop back as it was', () => {
  const off = page(page(BLOG, true), false);

  assert.equal(flat(off), flat(BLOG));
  assert.equal(page(off, false), off);
});

test('a loop without a limit gets a page size, and keeps it when pages go off', () => {
  const src = '{{ collection from="blog" }}\n  <li>{{ title }}</li>\n{{ /collection }}';
  const on = page(src, true);

  assert.match(on, /^\{\{ collection from="blog" limit="12" paginate="true" as="entries" \}\}/);
  assert.match(page(on, false), /^\{\{ collection from="blog" limit="12" \}\}/);
  // A limit the loop already had is the page size; nothing is added.
  assert.equal(count(page(BLOG, true), 'limit='), 1);
});

test('an alias already in use is kept, and its wrapper is not doubled', () => {
  const src = '{{ collection from="blog" as="posts" }}\n  {{ posts }}\n    {{ title }}\n  {{ /posts }}\n{{ /collection }}';
  const on = page(src, true);

  assert.match(on, /paginate="true" as="posts"/);
  assert.equal(count(on, '{{ posts }}'), 1);
  assert.equal(count(on, '{{ entries }}'), 0);
  assert.equal(count(on, '{{ paginate }}'), 1);
});

test('the colon spelling keeps its own closing tag', () => {
  const src = '{{ collection:blog limit="6" }}<li>{{ title }}</li>{{ /collection:blog }}';
  const on = page(src, true);

  assert.match(on, /^\{\{ collection:blog limit="6" paginate="true" as="entries" \}\}/);
  assert.match(on, /\{\{ \/collection:blog \}\}$/);
  // Off again it is on lines of its own; only the whitespace differs.
  assert.equal(page(on, false).replace(/\s+/g, ''), src.replace(/\s+/g, ''));
});

test('writeLoopPagination leaves anything but a collection alone', () => {
  const src = '{{ items | limit:3 }}\n  {{ title }}\n{{ /items }}';

  assert.equal(writeLoopPagination(src, row(src), true), src);
  assert.equal(writeLoopPagination(src, null, true), src);
});

test('the paginate snippet is a paginated collection', () => {
  const { text } = expandAntlersSnippet(antlersSnippet('collection_paginate').snippet);
  const loop = row(text, 'collection');

  assert.equal(loop.paginate, true);
  assert.equal(loop.alias, 'entries');
  assert.equal(loop.limit, '12');
  assert.deepEqual(lintTemplate(text, htmlLanguage.parser), []);
});
