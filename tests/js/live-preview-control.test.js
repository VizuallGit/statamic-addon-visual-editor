/**
 * Spotting Statamic's own "open Live Preview" control (lib/live-preview.js):
 * by its words in any CP language — and never one of the editor's own
 * Live Preview links, which say the same words.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEditorDrawn, isLivePreviewControl } from '../../resources/js/lib/live-preview.js';

/** The little an element needs to be read: text, title and attributes. */
function element({ text = '', title = null, attributes = {} } = {}) {
  return {
    textContent: text,
    getAttribute: (name) => (name === 'title' ? title : attributes[name] ?? null),
    attributes: Object.entries(attributes).map(([name, value]) => ({ name, value })),
  };
}

test("Statamic's button is known by its words, in any CP language", () => {
  assert.equal(isLivePreviewControl(element({ text: 'Live Preview' })), true);
  assert.equal(isLivePreviewControl(element({ text: 'Forhåndsvisning' })), true);
  assert.equal(isLivePreviewControl(element({ text: '', title: 'Vorschau' })), true);
  assert.equal(isLivePreviewControl(element({ text: 'Visit URL' })), false);
});

test("the editor's own Live Preview links are not Statamic's control", () => {
  const topBar = element({ text: 'Live Preview', attributes: { 'data-sve-home-preview': '', href: '/cp/x?live-preview=1' } });
  const rowLabel = element({ text: 'Open in Live Preview', attributes: { 'data-sve-open-preview': '' } });

  assert.equal(isEditorDrawn(topBar), true);
  assert.equal(isEditorDrawn(rowLabel), true);
  assert.equal(isLivePreviewControl(topBar), false);
  assert.equal(isLivePreviewControl(rowLabel), false);
});

test('an attribute that merely resembles a mark is not one', () => {
  assert.equal(isEditorDrawn(element({ text: 'Live Preview', attributes: { 'data-svelte': '1' } })), false);
  assert.equal(isEditorDrawn(element({ text: 'Live Preview', attributes: { class: 'data-sve-x' } })), false);
});
