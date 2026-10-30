/**
 * build-mode/attrs.js — one attribute of one tag in the dock's file.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { altFromAsset, readAttribute, withAttribute, withFieldEdit } from '../../../resources/js/build-mode/attrs.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const first = (html) => parseTemplateTree(html)[0];

test('reads and replaces a value, leaving the rest of the tag alone', () => {
  const html = '<a href="/cases" class="btn">Go</a>';

  assert.equal(readAttribute(html, first(html), 'href'), '/cases');
  assert.equal(withAttribute(html, first(html), 'href', '/kontakt'), '<a href="/kontakt" class="btn">Go</a>');
});

test('adds the attribute after the tag name when the tag has none', () => {
  const html = '<a class="btn">Go</a>';

  assert.equal(readAttribute(html, first(html), 'href'), null);
  assert.equal(withAttribute(html, first(html), 'href', '/x'), '<a href="/x" class="btn">Go</a>');
});

test('an Antlers tag inside the element never counts as the attribute', () => {
  const html = '<a {{ visual_edit href="nope" }} href="{{ link }}">Go</a>';

  assert.equal(readAttribute(html, first(html), 'href'), '{{ link }}');
  assert.equal(withAttribute(html, first(html), 'href', '/y'), '<a {{ visual_edit href="nope" }} href="/y">Go</a>');
});

test('a value reads as the characters it stands for, so a write and a read go round without growing', () => {
  let html = '<img src="" alt="">';

  html = withAttribute(html, first(html), 'alt', 'Holdet & "kontoret"');
  assert.equal(html, '<img src="" alt="Holdet &amp; &quot;kontoret&quot;">');
  assert.equal(readAttribute(html, first(html), 'alt'), 'Holdet & "kontoret"');
  html = withAttribute(html, first(html), 'alt', readAttribute(html, first(html), 'alt'));
  assert.equal(html, '<img src="" alt="Holdet &amp; &quot;kontoret&quot;">');
});

test('a quote in the value is escaped', () => {
  const html = '<a href="">Go</a>';

  assert.equal(withAttribute(html, first(html), 'href', '/a"b'), '<a href="/a&quot;b">Go</a>');
});

test('an image\'s alt reads the asset\'s own on the server, and an empty address has none', () => {
  assert.equal(altFromAsset('/assets/team.webp'), "{{ asset url='/assets/team.webp' }}{{ alt | entities }}{{ /asset }}");
  assert.equal(altFromAsset("/assets/o'brien.jpg"), "{{ asset url='/assets/o%27brien.jpg' }}{{ alt | entities }}{{ /asset }}");
  assert.equal(altFromAsset(''), '');

  // Written into the tag, the Antlers stays whole and reads back as written.
  const html = '<img src="" alt="">';
  const node = parseTemplateTree(html)[0];
  const next = withAttribute(html, node, 'alt', altFromAsset('/assets/team.webp'));

  assert.equal(next, `<img src="" alt="{{ asset url='/assets/team.webp' }}{{ alt | entities }}{{ /asset }}">`);
  assert.equal(readAttribute(next, parseTemplateTree(next)[0], 'alt'), altFromAsset('/assets/team.webp'));
});

test('an image reading a field asks that field\'s asset for its alt', () => {
  assert.equal(altFromAsset('{{ image }}'), '{{ image:alt | entities }}');
  assert.equal(altFromAsset(''), '');
});

test('null takes an attribute out, and leaves the tag alone when it has none', () => {
  const html = '<a href="/x" target="_blank" class="y">Go</a>';

  assert.equal(withAttribute(html, parseTemplateTree(html)[0], 'target', null), '<a href="/x" class="y">Go</a>');
  assert.equal(withAttribute(html, parseTemplateTree(html)[0], 'rel', null), html);
});

test('a field chosen points the element\'s visual_edit at it, in the opening tag', () => {
  const html = '<p class="x">{{ text }}</p>';

  assert.equal(withFieldEdit(html, first(html), 'text'), '<p {{ visual_edit field="text" inline_edit="true" }} class="x">{{ text }}</p>');
  assert.equal(withFieldEdit('<a href="">L</a>', first('<a href="">L</a>'), 'link', { inline: false }), '<a {{ visual_edit field="link" }} href="">L</a>');
});

test('another field repoints it; what else the tag says stays', () => {
  const html = '<p {{ visual_edit field="a" inline_edit="true" orderable="true" }}>x</p>';

  assert.equal(withFieldEdit(html, first(html), 'b'), '<p {{ visual_edit field="b" inline_edit="true" orderable="true" }}>x</p>');
});

test('no field any more: the tag goes, or keeps only what is not about the field', () => {
  const one = '<p {{ visual_edit field="a" inline_edit="true" }} class="x">y</p>';
  const more = '<p {{ visual_edit field="a" orderable="true" }}>y</p>';

  assert.equal(withFieldEdit(one, first(one), null), '<p class="x">y</p>');
  assert.equal(withFieldEdit(more, first(more), null), '<p {{ visual_edit orderable="true" }}>y</p>');
});

test('an author\'s tag with no field is left alone when there is none to point at', () => {
  const html = '<section {{ visual_edit outline_inside="true" }}>y</section>';
  const plain = '<p>y</p>';

  assert.equal(withFieldEdit(html, first(html), null), html);
  assert.equal(withFieldEdit(plain, first(plain), null), plain);
});
