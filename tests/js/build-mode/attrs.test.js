/**
 * build-mode/attrs.js — one attribute of one tag in the dock's file.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { altFromAsset, readAttribute, withAttribute, fieldEditOf, withFieldEdit, contrastFits } from '../../../resources/js/build-mode/attrs.js';
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

test('the field a visual_edit points at', () => {
  const html = '<p {{ visual_edit field="a" inline_edit="true" }}>y</p>';
  const plain = '<section {{ visual_edit outline_inside="true" }}>y</section>';

  assert.equal(fieldEditOf(html, first(html)), 'a');
  assert.equal(fieldEditOf(plain, first(plain)), '');
});

/* ---------------- Content's attributes: the list, renaming, bare and quoted values ---------------- */

import { attributeList, contentAttributes, escapeAttrValue, renameAttribute } from '../../../resources/js/build-mode/attrs.js';

test('lists every attribute in order, past a visual_edit tag and an Antlers value', () => {
  const html = '<section id="id-{{ id }}" class="grid" data-position="{{ image_position }}" data-auto-contrast {{ visual_edit outline_inside="true" }}>x</section>';
  const list = attributeList(html, first(html));

  assert.deepEqual(list.map((a) => [a.name, a.value, a.bare]), [
    ['id', 'id-{{ id }}', false],
    ['class', 'grid', false],
    ['data-position', '{{ image_position }}', false],
    ['data-auto-contrast', '', true],
  ]);
});

test('a name inside another value is not an attribute', () => {
  const html = '<div class="x data-fake" title=\'a role b\'>x</div>';

  assert.deepEqual(attributeList(html, first(html)).map((a) => a.name), ['class', 'title']);
});

test('Content sorts data from accessibility, and leaves Alpine, the editor and a link\'s aria-label out', () => {
  const html = '<a href="/" data-x="1" data-sve-ht-path="0:a" x-data="{}" @click="go" :class="c" aria-label="Go" aria-hidden="true" role="button">Go</a>';
  const got = contentAttributes(html, first(html));

  assert.deepEqual(got.data, [{ name: 'data-x', value: '1' }]);
  assert.deepEqual(got.aria, [{ name: 'aria-hidden', value: 'true' }, { name: 'role', value: 'button' }]);
  assert.equal(got.unreadable, false);
});

test('a value without quotes makes the list read-only', () => {
  const html = '<div data-x=1 data-y="2">x</div>';

  assert.equal(contentAttributes(html, first(html)).unreadable, true);
});

test('renames where it stands, value and order kept; a taken or bad name changes nothing', () => {
  const html = '<div data-a="1" data-b="2" data-flag>x</div>';

  assert.equal(renameAttribute(html, first(html), 'data-a', 'data-c'), '<div data-c="1" data-b="2" data-flag>x</div>');
  assert.equal(renameAttribute(html, first(html), 'data-flag', 'data-on'), '<div data-a="1" data-b="2" data-on>x</div>');
  assert.equal(renameAttribute(html, first(html), 'data-a', 'data-b'), html);
  assert.equal(renameAttribute(html, first(html), 'data-a', 'data a'), html);
});

test('a bare attribute is given a value, and taken out, whole', () => {
  const html = '<section class="x" data-auto-contrast data-y="1">x</section>';

  assert.equal(withAttribute(html, first(html), 'data-auto-contrast', 'on'), '<section class="x" data-auto-contrast="on" data-y="1">x</section>');
  assert.equal(withAttribute(html, first(html), 'data-auto-contrast', null), '<section class="x" data-y="1">x</section>');
});

test('a value is escaped outside its Antlers only', () => {
  assert.equal(escapeAttrValue('a "b" & {{ x | replace:"a" }}'), 'a &quot;b&quot; &amp; {{ x | replace:"a" }}');

  const html = '<div>x</div>';

  assert.equal(withAttribute(html, first(html), 'data-pos', '{{ pos | lower }}'), '<div data-pos="{{ pos | lower }}">x</div>');
});

test('names with an underscore or a dot are names', () => {
  const html = '<div data-a.b="1">x</div>';

  assert.equal(withAttribute(html, first(html), 'data-foo_bar', '2'), '<div data-foo_bar="2" data-a.b="1">x</div>');
  assert.equal(withAttribute(html, first(html), 'data-a.b', '3'), '<div data-a.b="3">x</div>');
});

test('a new attribute with `end` goes after the last one — before a visual_edit tag, id and class first', () => {
  const html = '<section id="a" class="b" data-flag {{ visual_edit x="1" }}>x</section>';

  assert.equal(withAttribute(html, first(html), 'role', 'note', { end: true }), '<section id="a" class="b" data-flag role="note" {{ visual_edit x="1" }}>x</section>');
  assert.equal(withAttribute('<div>x</div>', first('<div>x</div>'), 'data-x', '1', { end: true }), '<div data-x="1">x</div>');
});

test('auto contrast is Content\'s switch, not a Data row: on in any form, its hover sibling stays a row', () => {
  const bare = '<section class="a" data-x="1" data-auto-contrast>x</section>';
  const gray = '<a data-auto-contrast="gray" data-auto-contrast-hover>x</a>';
  const none = '<div data-x="1">x</div>';

  assert.deepEqual(contentAttributes(bare, first(bare)).data, [{ name: 'data-x', value: '1' }]);
  assert.deepEqual(contentAttributes(bare, first(bare)).contrast, { on: true, conditional: false });
  assert.deepEqual(contentAttributes(gray, first(gray)).contrast, { on: true, conditional: false });
  assert.deepEqual(contentAttributes(gray, first(gray)).data, [{ name: 'data-auto-contrast-hover', value: '' }]);
  assert.deepEqual(contentAttributes(none, first(none)).contrast, { on: false, conditional: false });
});

test('auto contrast inside the tag\'s own condition is the page\'s to decide', () => {
  const html = '<section id="id-{{ id }}" class="a"{{ unless text_color }} data-auto-contrast{{ /unless }} {{ visual_edit outline_inside="true" }}>x</section>';
  const after = '<section {{ if x }}data-a="1"{{ /if }} data-auto-contrast>x</section>';

  assert.deepEqual(contentAttributes(html, first(html)).contrast, { on: true, conditional: true });
  assert.deepEqual(contentAttributes(after, first(after)).contrast, { on: true, conditional: false });
});

test('true writes the attribute bare: added after the last one, a value dropped, a bare one left as it is', () => {
  const html = '<section id="a" class="b" {{ visual_edit x="1" }}>x</section>';
  const valued = '<section data-auto-contrast="gray" class="b">x</section>';
  const bare = '<section class="b" data-auto-contrast>x</section>';

  assert.equal(withAttribute(html, first(html), 'data-auto-contrast', true, { end: true }), '<section id="a" class="b" data-auto-contrast {{ visual_edit x="1" }}>x</section>');
  assert.equal(withAttribute(valued, first(valued), 'data-auto-contrast', true, { end: true }), '<section data-auto-contrast class="b">x</section>');
  assert.equal(withAttribute(bare, first(bare), 'data-auto-contrast', true, { end: true }), bare);
  assert.equal(withAttribute(bare, first(bare), 'data-auto-contrast', null), '<section class="b">x</section>');
  assert.equal(withAttribute(valued, first(valued), 'data-auto-contrast', null), '<section class="b">x</section>');
});

test('auto contrast is offered on boxes only — not on a heading, a paragraph, an image or a link', () => {
  for (const tag of ['div', 'section', 'DIV', 'article', 'header', 'footer', 'li']) {
    assert.equal(contrastFits(tag), true, tag);
  }

  for (const tag of ['h1', 'h2', 'p', 'img', 'video', 'a', 'span', 'button', '', undefined]) {
    assert.equal(contrastFits(tag), false, String(tag));
  }
});
