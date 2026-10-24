/**
 * Where an entry's edit URL opens (lib/entry-open.js): the listing label's
 * Live Preview URL, and the Collections drawer's decision.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryCollectionOf, entryOpenDecision, previewUrlFor } from '../../resources/js/lib/entry-open.js';

const origin = 'https://site.test';

test('the collection handle is read from an entry edit URL, and from nothing else', () => {
  assert.equal(entryCollectionOf('/cp/collections/pages/entries/abc', origin), 'pages');
  assert.equal(entryCollectionOf('https://site.test/cp/collections/blog/entries/x-1?tab=seo', origin), 'blog');
  assert.equal(entryCollectionOf('/cp/collections/pages/entries/create/default', origin), null);
  assert.equal(entryCollectionOf('/cp/collections/pages', origin), null);
  assert.equal(entryCollectionOf('/cp/dashboard', origin), null);
  assert.equal(entryCollectionOf('https://elsewhere.test/cp/collections/pages/entries/abc', origin), null);
  assert.equal(entryCollectionOf('not a url at all ::', origin), null);
});

test('the label links to Live Preview for a named collection, and to nothing otherwise', () => {
  assert.equal(
    previewUrlFor('/cp/collections/pages/entries/abc', origin, ['pages']),
    'https://site.test/cp/collections/pages/entries/abc?live-preview=1'
  );
  assert.equal(previewUrlFor('/cp/collections/blog/entries/abc', origin, ['pages']), null);
  assert.equal(previewUrlFor('/cp/collections/pages', origin, ['pages']), null);
  assert.equal(previewUrlFor('/cp/collections/pages/entries/abc', origin, []), null);
});

test('a link that already asks for Live Preview gets no label', () => {
  assert.equal(previewUrlFor('/cp/collections/pages/entries/abc?live-preview=1', origin, ['pages']), null);
});

test('the Live Preview URL keeps the query it came with', () => {
  assert.equal(
    previewUrlFor('/cp/collections/pages/entries/abc?site=da', origin, ['pages']),
    'https://site.test/cp/collections/pages/entries/abc?site=da&live-preview=1'
  );
});

test('the drawer opens previewable entries in Live Preview and the rest in the Control Panel', () => {
  const previewable = { pages: true, templates: true, messages: false };

  assert.equal(entryOpenDecision('/cp/collections/pages/entries/abc', origin, previewable), 'preview');
  assert.equal(entryOpenDecision('/cp/collections/templates/entries/t1', origin, previewable), 'preview');
  assert.equal(entryOpenDecision('/cp/collections/messages/entries/m1', origin, previewable), 'cp');
});

test('a collection the server did not list cannot be previewed by this user', () => {
  assert.equal(entryOpenDecision('/cp/collections/secret/entries/s1', origin, { pages: true }), 'cp');
  assert.equal(entryOpenDecision('/cp/collections/pages/entries/abc', origin, undefined), 'cp');
});

test('the drawer leaves every other move to the frame', () => {
  assert.equal(entryOpenDecision('/cp/collections/pages', origin, { pages: true }), null);
  assert.equal(entryOpenDecision('/cp/collections/pages/entries/create/default', origin, { pages: true }), null);
  assert.equal(entryOpenDecision('https://elsewhere.test/cp/collections/pages/entries/abc', origin, { pages: true }), null);
});
