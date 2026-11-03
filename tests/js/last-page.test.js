/**
 * The page last open in Live Preview (lib/last-page.js): what the editor
 * writes down, and when the top bar's button may go back to it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAST_PAGE_KEY, lastPage, rememberLastPage } from '../../resources/js/lib/last-page.js';

const origin = 'https://site.test';
const scope = { site: 'default', user: 'u1' };
const previewable = { pages: true, templates: true, messages: false };

function memoryStorage() {
  const items = new Map();

  return {
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
}

test('the page shown in Live Preview is the one the button goes back to', () => {
  const storage = memoryStorage();

  rememberLastPage(storage, `${origin}/cp/collections/pages/entries/contact-id`, origin, { ...scope, title: 'Kontakt' });

  assert.deepEqual(lastPage(storage, origin, { ...scope, previewable }), {
    url: `${origin}/cp/collections/pages/entries/contact-id?live-preview=1`,
    title: 'Kontakt',
  });
});

test('switching pages moves the note along', () => {
  const storage = memoryStorage();

  rememberLastPage(storage, `${origin}/cp/collections/pages/entries/home-id`, origin, { ...scope, title: 'Forside' });
  rememberLastPage(storage, `${origin}/cp/collections/pages/entries/contact-id`, origin, { ...scope, title: 'Kontakt' });

  assert.equal(lastPage(storage, origin, { ...scope, previewable }).title, 'Kontakt');
});

test('only an entry screen is written down, without its query', () => {
  const storage = memoryStorage();

  rememberLastPage(storage, `${origin}/cp/dashboard`, origin, scope);
  rememberLastPage(storage, `${origin}/cp/collections/pages/entries/create/default`, origin, scope);
  assert.equal(storage.getItem(LAST_PAGE_KEY), null);

  rememberLastPage(storage, `${origin}/cp/collections/pages/entries/abc?live-preview=1#top`, origin, scope);
  assert.equal(JSON.parse(storage.getItem(LAST_PAGE_KEY)).path, '/cp/collections/pages/entries/abc');
});

test('a note is for the user and the site it was written on', () => {
  const storage = memoryStorage();

  rememberLastPage(storage, `${origin}/cp/collections/pages/entries/abc`, origin, scope);

  assert.equal(lastPage(storage, origin, { site: 'default', user: 'u2', previewable }), null);
  assert.equal(lastPage(storage, origin, { site: 'en', user: 'u1', previewable }), null);
  assert.notEqual(lastPage(storage, origin, { ...scope, previewable }), null);
});

test('a collection this user can no longer preview is not gone back to', () => {
  const storage = memoryStorage();

  rememberLastPage(storage, `${origin}/cp/collections/messages/entries/m1`, origin, scope);
  assert.equal(lastPage(storage, origin, { ...scope, previewable }), null);

  rememberLastPage(storage, `${origin}/cp/collections/secret/entries/s1`, origin, scope);
  assert.equal(lastPage(storage, origin, { ...scope, previewable }), null);
  assert.equal(lastPage(storage, origin, { ...scope, previewable: undefined }), null);
});

test('a note that is not ours, or points elsewhere, is no note', () => {
  const storage = memoryStorage();

  storage.setItem(LAST_PAGE_KEY, 'not json');
  assert.equal(lastPage(storage, origin, { ...scope, previewable }), null);

  storage.setItem(LAST_PAGE_KEY, JSON.stringify({ path: 42, site: 'default', user: 'u1' }));
  assert.equal(lastPage(storage, origin, { ...scope, previewable }), null);

  storage.setItem(
    LAST_PAGE_KEY,
    JSON.stringify({ path: '//elsewhere.test/cp/collections/pages/entries/abc', site: 'default', user: 'u1' })
  );
  assert.equal(lastPage(storage, origin, { ...scope, previewable }), null);
});

test('no storage, or storage that refuses, is the front page without an error', () => {
  assert.equal(lastPage(null, origin, { ...scope, previewable }), null);

  const refusing = { getItem: () => null, setItem: () => { throw new Error('quota'); } };

  assert.doesNotThrow(() =>
    rememberLastPage(refusing, `${origin}/cp/collections/pages/entries/abc`, origin, scope)
  );
  assert.doesNotThrow(() => rememberLastPage(null, `${origin}/cp/collections/pages/entries/abc`, origin, scope));
});
