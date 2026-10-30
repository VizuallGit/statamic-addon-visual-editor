/**
 * build-mode/rich.js — a block of prose Content edits with Bard.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isRichBlock, readRich, readRichField, richOwner, sameRich, withRich, withRichField } from '../../../resources/js/build-mode/rich.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const first = (html) => parseTemplateTree(html)[0];

test('a div of plain prose is rich text: paragraphs, headings, lists, bold, italic, links', () => {
  const html = '<div>\n    <h2>Title</h2>\n    <p>One <strong>two</strong> <a href="/x" target="_blank">three</a></p>\n    <ul><li><p>Item</p></li></ul>\n</div>';

  assert.deepEqual(readRich(html, first(html)), { html: '<h2>Title</h2>\n    <p>One <strong>two</strong> <a href="/x" target="_blank">three</a></p>\n    <ul><li><p>Item</p></li></ul>' });
});

test('a class, an id or Antlers anywhere inside makes it a designer\'s markup, never handed to Bard', () => {
  for (const html of [
    '<div><h2 class="text-800">Title</h2><p>Text</p></div>',
    '<div><p>Text <span>x</span></p></div>',
    '<div><p id="a">Text</p></div>',
    '<div><p>{{ title }}</p></div>',
    '<div><a href="/x" class="btn">Go</a></div>',
    '<div><img src="" alt=""></div>',
  ]) {
    assert.equal(readRich(html, first(html)), null, html);
  }
});

test('an empty div, loose text, and a div that is not a holder are not rich text', () => {
  for (const html of ['<div></div>', '<div>Loose <p>x</p></div>', '<section><p>x</p></section>', '<p>Just a paragraph</p>']) {
    assert.equal(readRich(html, first(html)), null, html);
  }
});

test('the div\'s own attributes are its own: a styled div of prose is still rich text', () => {
  const html = '<div class="flow-y max-w-[60ch]"><p>Text</p></div>';

  assert.deepEqual(readRich(html, first(html)), { html: '<p>Text</p>' });
});

test('written back, one block to a line at the div\'s indent plus one step', () => {
  const html = '<section>\n    <div>\n        <p>Old</p>\n    </div>\n</section>';
  const div = first(html).children[0];

  assert.equal(
    withRich(html, div, '<h2>New</h2><p>One <em>two</em></p><ul><li><p>A</p></li></ul>'),
    '<section>\n    <div>\n        <h2>New</h2>\n        <p>One <em>two</em></p>\n        <ul><li><p>A</p></li></ul>\n    </div>\n</section>'
  );
});

test('a div written on one line gets the four-space step', () => {
  const html = '<div><p>Old</p></div>';

  assert.equal(withRich(html, first(html), '<p>New</p>'), '<div>\n    <p>New</p>\n</div>');
});

test('the same HTML laid out another way is the same rich text', () => {
  assert.equal(sameRich('<p>One</p>\n    <p>Two</p>', '<p>One</p><p>Two</p>'), true);
  assert.equal(sameRich('<p>One</p>', '<p>One!</p>'), false);
});

test('what is not rich text is never rewritten', () => {
  const html = '<div><h2 class="x">T</h2></div>';

  assert.equal(withRich(html, first(html), '<p>New</p>'), html);
});

test('what stands in rich text belongs to it; other elements belong to none', () => {
  const html = '<section><div class="prose"><p>One <strong>two</strong></p></div><div><h2>Three</h2><p>Four</p></div><div class="prose"><h2 class="x">Five</h2></div></section>';
  const [rich, laidOut, classed] = parseTemplateTree(html)[0].children;
  const p = rich.children[0];

  assert.equal(isRichBlock(html, rich), true);
  assert.equal(isRichBlock(html, laidOut), false);
  assert.equal(isRichBlock(html, classed), false);
  assert.equal(richOwner(html, p.path), rich.path);
  assert.equal(richOwner(html, p.children[0].path), rich.path);
  assert.equal(richOwner(html, laidOut.children[0].path), '');
  assert.equal(richOwner(html, classed.children[0].path), '');
  assert.equal(richOwner(html, rich.path), '');
  assert.equal(richOwner(html, ''), '');
});

test('a field stands in rich text\'s place, and comes out again', () => {
  const html = '<div>\n    <p>Words</p>\n</div>';
  const bound = withRichField(html, parseTemplateTree(html)[0], '{{ content }}');

  assert.equal(bound, '<div>\n    {{ content }}\n</div>');
  assert.equal(readRichField(bound, parseTemplateTree(bound)[0]), '{{ content }}');
  assert.equal(readRich(bound, parseTemplateTree(bound)[0]), null);
  assert.equal(withRichField(bound, parseTemplateTree(bound)[0], ''), '<div>\n    <p></p>\n</div>');
  assert.equal(withRichField(bound, parseTemplateTree(bound)[0], 'A & B'), '<div>\n    <p>A &amp; B</p>\n</div>');
});

test('a div of other things has no field to read, and is not rewritten', () => {
  const html = '<div class="x"><h2 class="y">T</h2></div>';

  assert.equal(readRichField(html, parseTemplateTree(html)[0]), null);
  assert.equal(withRichField(html, parseTemplateTree(html)[0], '{{ content }}'), html);
  assert.equal(readRichField('<div>Hi {{ a }}</div>', parseTemplateTree('<div>Hi {{ a }}</div>')[0]), null);
});
