/**
 * build-mode/text.js — the text of one element in the dock's file (Content).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { holdsText, readText, withText } from '../../../resources/js/build-mode/text.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const first = (html) => parseTemplateTree(html)[0];

test('headings, paragraphs, links and list items hold text; layout, media and form controls do not', () => {
  for (const tag of ['h1', 'h6', 'p', 'span', 'a', 'button', 'li', 'blockquote', 'figcaption']) {
    assert.equal(holdsText(tag), true, tag);
  }

  for (const tag of ['div', 'section', 'img', 'video', 'input', 'select', 'textarea', 'ul', 'br']) {
    assert.equal(holdsText(tag), false, tag);
  }
});

test('reads and replaces a heading\'s text, leaving the tag alone', () => {
  const html = '<h2 class="text-700">New heading</h2>';

  assert.deepEqual(readText(html, first(html)), { kind: 'text', text: 'New heading' });
  assert.equal(withText(html, first(html), 'Our work'), '<h2 class="text-700">Our work</h2>');
});

test('text laid out over lines reads as one line, and keeps its layout when written', () => {
  const html = '<p>\n    Some text\n    over two lines\n</p>';

  assert.deepEqual(readText(html, first(html)), { kind: 'text', text: 'Some text over two lines' });
  assert.equal(withText(html, first(html), 'New text'), '<p>\n    New text\n</p>');
});

test('a space typed at the end is the text\'s own: written over, it does not pile up', () => {
  let html = '<h1>Title</h1>';

  for (const value of ['Hej', 'Hej ', 'Hej &', 'Hej & ', 'Hej & co']) {
    html = withText(html, first(html), value);
  }

  assert.equal(html, '<h1>Hej &amp; co</h1>');
});

test('entities read as the characters they are, and are escaped again when written', () => {
  const html = '<p>Fish &amp; chips &lt;3 &#229;</p>';

  assert.deepEqual(readText(html, first(html)), { kind: 'text', text: 'Fish & chips <3 å' });
  assert.equal(withText(html, first(html), 'A & B <i>'), '<p>A &amp; B &lt;i&gt;</p>');
});

test('an empty element takes text', () => {
  const html = '<p></p>';

  assert.deepEqual(readText(html, first(html)), { kind: 'text', text: '' });
  assert.equal(withText(html, first(html), 'Hello'), '<p>Hello</p>');
});

test('an Antlers tag in the opening tag is not the text', () => {
  const html = '<h1 {{ visual_edit field="x" }}>Title</h1>';

  assert.deepEqual(readText(html, first(html)), { kind: 'text', text: 'Title' });
  assert.equal(withText(html, first(html), 'Other'), '<h1 {{ visual_edit field="x" }}>Other</h1>');
});

test('a field in the body is the server\'s: named, never rewritten', () => {
  const html = '<h2>{{ headline }}</h2>';

  assert.deepEqual(readText(html, first(html)), { kind: 'antlers', tag: '{{ headline }}' });
  assert.equal(withText(html, first(html), 'x'), html);
});

test('other elements in the body are theirs: never rewritten', () => {
  const html = '<p>Hi <strong>you</strong></p>';

  assert.deepEqual(readText(html, first(html)), { kind: 'markup' });
  assert.equal(withText(html, first(html), 'x'), html);
});

test('an element that holds no text has none to read', () => {
  const html = '<div>Loose words</div>';

  assert.equal(readText(html, first(html)), null);
  assert.equal(withText(html, first(html), 'x'), html);
});

test('only the picked element changes, nested in a file', () => {
  const html = '<section>\n  <h2>One</h2>\n  <p>Two</p>\n</section>';
  const p = first(html).children[1];

  assert.equal(withText(html, p, 'Three'), '<section>\n  <h2>One</h2>\n  <p>Three</p>\n</section>');
});
