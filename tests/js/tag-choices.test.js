/**
 * lib/tag-choices.js and lib/retag.js — one rule for every tag menu, and the rename it writes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HEADING_TAGS, LAYOUT_TAGS, TEXT_TAGS, tagChoices, tagRefusal } from '../../resources/js/lib/tag-choices.js';
import { retag } from '../../resources/js/lib/retag.js';
import { holdsText } from '../../resources/js/build-mode/text.js';

test('a heading becomes text, never a section or a link', () => {
  const list = tagChoices('H2');

  assert.ok(list.includes('h3') && list.includes('p') && list.includes('span') && list.includes('strong'));
  assert.ok(!list.includes('section') && !list.includes('div') && !list.includes('a'));
});

test('a link can stop being one: text, never a heading', () => {
  const list = tagChoices('a');

  assert.ok(list.includes('p') && list.includes('span') && list.includes('strong') && list.includes('button'));
  assert.ok(!HEADING_TAGS.some((tag) => list.includes(tag)));
});

test('text can become a link; layout and lists turn into each other', () => {
  assert.ok(tagChoices('p').includes('a'));
  assert.equal(tagChoices('div'), LAYOUT_TAGS);
  assert.ok(tagChoices('ul').includes('div') && tagChoices('div').includes('ol') && tagChoices('section').includes('nav'));
});

test('a list item and what has a shape of its own', () => {
  assert.deepEqual(tagChoices('li'), ['li', 'div', 'p', 'span']);
  assert.deepEqual(tagChoices('img'), ['img']);
  assert.deepEqual(tagChoices('my-card'), ['my-card']);
  assert.deepEqual(tagChoices(''), []);
});

test('every text tag on offer keeps its text box', () => {
  for (const tag of [...HEADING_TAGS, ...TEXT_TAGS, 'a', 'button']) {
    assert.equal(holdsText(tag), true, tag);
  }
});

test('Custom: any tag name, but a void element only becomes another void one', () => {
  assert.equal(tagRefusal('h2', 'section'), '');
  assert.equal(tagRefusal('div', 'my-card'), '');
  assert.equal(tagRefusal('div', 'My Card'), 'name');
  assert.equal(tagRefusal('div', '2col'), 'name');
  assert.equal(tagRefusal('img', 'div'), 'void');
  assert.equal(tagRefusal('div', 'img'), 'void');
  assert.equal(tagRefusal('img', 'source'), '');
});

test('retag renames both ends from where the element starts — never <h3>…</h2>', () => {
  const html = '<div><h2 class="x">Hi</h2><p>a</p></div>';

  assert.equal(retag(html, 5, 'h3'), '<div><h3 class="x">Hi</h3><p>a</p></div>');
  assert.equal(retag(html, 0, 'section'), '<section><h2 class="x">Hi</h2><p>a</p></section>');
});

test('a link that stops being one loses href, target, rel and the visual_edit on its address — its text stays', () => {
  const html = '<p><a href="{{ link }}" target="_blank" rel="noopener" class="btn" aria-label="Go" {{ visual_edit field="link" }}>{{ link_text }}</a></p>';

  assert.equal(retag(html, 3, 'span'), '<p><span class="btn" aria-label="Go">{{ link_text }}</span></p>');
});

test('a visual_edit on the link\'s text stays when the link goes', () => {
  const html = '<a href="/x" {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</a>';

  assert.equal(retag(html, 0, 'strong'), '<strong {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</strong>');
});

test('retag refuses what Custom refuses, and a void element is renamed alone', () => {
  const html = '<div><img src="a.jpg"></div>';

  assert.equal(retag(html, 5, 'div'), html);
  assert.equal(retag(html, 5, 'Bad Name'), html);
  assert.equal(retag('<div><br></div>', 5, 'hr'), '<div><hr></div>');
});
