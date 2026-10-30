/**
 * tags.js — what Content's tag menu offers.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAYOUT_TAGS, TEXT_TAGS, tagChoices } from '../../../resources/js/build-mode/tags.js';
import { holdsText } from '../../../resources/js/build-mode/text.js';

test('text turns into text, layout into layout', () => {
  assert.equal(tagChoices('h2'), TEXT_TAGS);
  assert.equal(tagChoices('P'), TEXT_TAGS);
  assert.equal(tagChoices('span'), TEXT_TAGS);
  assert.equal(tagChoices('div'), LAYOUT_TAGS);
  assert.equal(tagChoices('article'), LAYOUT_TAGS);
});

test('what has one shape of its own has no menu', () => {
  for (const tag of ['img', 'video', 'hr', 'a', 'li', 'ul', 'svg', '', null]) {
    assert.deepEqual(tagChoices(tag), []);
  }
});

test('every text tag on offer keeps its text box', () => {
  for (const tag of TEXT_TAGS) {
    assert.equal(holdsText(tag), true, tag);
  }
});
