/**
 * What the overlay host's history entry says while the editor is open
 * (lib/overlay-history.js), and what it says once the editor has closed.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { overlayHistoryUrl, withoutEditorMark } from '../../resources/js/lib/overlay-history.js';

const origin = 'https://site.test';
const edit = `${origin}/cp/collections/pages/entries/kontakt-id`;

test('a Control Panel host keeps its own URL — a refresh lands on the CP screen Live Preview was opened from, plain', () => {
  const listing = `${origin}/cp/collections/pages`;

  // Whatever page the editor shows, the entry names the host's own screen.
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: { url: edit, permalink: `${origin}/kontakt` }, here: listing }), listing);
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: null, here: edit }), edit);

  // Never with the Live Preview ask: landed on with it, Statamic's router puts it back, and a refresh reopened the editor.
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: null, here: `${edit}?live-preview=1#sidebar` }), `${edit}#sidebar`);
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: null, here: `${edit}?live-preview=1&tab=seo` }), `${edit}?tab=seo`);

  // Without the host's URL there is nothing to say.
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: { url: edit } }), null);
});

test('a site host names the public URL the server gave the entry', () => {
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: edit, permalink: `${origin}/kontakt` } }), `${origin}/kontakt`);
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: edit, permalink: `${origin}/` } }), `${origin}/`);
});

test('a site host leaves the URL alone for a page without one', () => {
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: edit, permalink: null } }), null);
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: edit } }), null);
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: edit, permalink: '' } }), null);
});

test('a URL on another origin is not written into this history', () => {
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: edit, permalink: 'https://other.test/kontakt' } }), null);
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: { url: 'https://other.test/cp/collections/pages/entries/x' } }), null);
});

test('no page yet, or one that cannot be read, is no URL', () => {
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: null }), null);
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: 42 } }), null);
  assert.equal(overlayHistoryUrl({ origin, cpHost: true, page: { url: 'http://[bad' } }), null);
  assert.equal(overlayHistoryUrl({ origin, cpHost: false, page: { url: edit, permalink: 'http://[bad' } }), null);
});

test('closed, the entry keeps the page but drops the Live Preview ask', () => {
  assert.equal(withoutEditorMark(`${edit}?live-preview=1`, origin), edit);
  assert.equal(withoutEditorMark(`${edit}?live-preview=1&tab=seo#top`, origin), `${edit}?tab=seo#top`);
  assert.equal(withoutEditorMark(`${origin}/kontakt`, origin), `${origin}/kontakt`);
});

test('a URL that is not this origin\'s is handed back as it came', () => {
  assert.equal(withoutEditorMark('https://other.test/x?live-preview=1', origin), 'https://other.test/x?live-preview=1');
  assert.equal(withoutEditorMark('', origin), '');
});
