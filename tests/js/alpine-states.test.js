/**
 * alpine-states.js — the remembered Alpine states told to the preview. The
 * sections on the page are named by their ids; the header, the footer and
 * the layout, which have none, by the part of the frame they draw.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { frameScope, syncStoredAlpineStates } from '../../resources/js/alpine-states.js';
import { register } from '../../resources/js/cp/bus.js';
import { addContainer } from '../../resources/js/lib/publish-containers.js';

const doc = { querySelector: () => null };

function cp(stored, config = {}) {
  const sent = [];
  const win = {
    document: doc,
    location: { origin: 'http://site.test' },
    localStorage: { getItem: () => JSON.stringify(stored) },
    Statamic: { $config: { get: (key) => config[key] } },
  };
  const target = { postMessage: (message) => sent.push(message) };

  return { win, target, sent };
}

const TEMPLATES = { sveChromeTemplates: { header: { type: 'view:partials/site_head', styled: false }, footer: { type: 'footer/style_2', styled: true } } };
const brief = ({ uid, uids, chrome, nth, key, value }) => ({ uid, uids, chrome, nth, key, value });

beforeEach(() => {
  register('dock:chrome-kind', () => '');
  register('dock:current-type', () => '');
});

test('frameScope: the dock’s word for a part of the frame, the layout’s `main` as `layout`', () => {
  assert.equal(frameScope('header'), 'header');
  assert.equal(frameScope('footer'), 'footer');
  assert.equal(frameScope('main'), 'layout');
  assert.equal(frameScope('template'), '');
  assert.equal(frameScope(''), '');
});

test('the header’s, the footer’s and the layout’s states are sent by part of the frame', () => {
  const { win, target, sent } = cp({
    'view:partials/site_head': { 0: { menuOpen: true } },
    'footer/style_2': { 1: { open: true } },
    'view:layout': { 2: { navOpen: false } },
    'hero/style_1': { 0: { open: true } },
  }, TEMPLATES);

  syncStoredAlpineStates(win, doc, target);

  assert.deepEqual(sent.map(brief), [
    { uid: undefined, uids: undefined, chrome: 'header', nth: 0, key: 'menuOpen', value: true },
    { uid: undefined, uids: undefined, chrome: 'footer', nth: 1, key: 'open', value: true },
    { uid: undefined, uids: undefined, chrome: 'layout', nth: 2, key: 'navOpen', value: false },
  ], 'a section’s file whose section is not on the page is not sent');
  assert.ok(sent.every((message) => message.on === true && message.type === 'sve-alpine-state'));
});

test('a section on the page is still named by its ids, beside the frame', () => {
  addContainer({ setFieldValue() {}, values: { page_sections: [{ type: 'hero/style_1', _visual_id: 'v-1', id: 'r-1' }] } });

  const { win, target, sent } = cp({ 'hero/style_1': { 0: { open: true } }, 'view:layout': { 0: { open: true } } }, TEMPLATES);

  syncStoredAlpineStates(win, doc, target);

  assert.deepEqual(sent.map(brief), [
    { uid: 'v-1', uids: ['v-1', 'r-1'], chrome: undefined, nth: 0, key: 'open', value: true },
    { uid: undefined, uids: undefined, chrome: 'layout', nth: 0, key: 'open', value: true },
  ]);
});

test('while the dock holds a half, that half’s states are the dock’s file’s', () => {
  // The header's form picked another layout than the saved one: the preview
  // draws the form's, and the dock holds its file.
  register('dock:chrome-kind', () => 'header');
  register('dock:current-type', () => 'header/style_3');

  const { win, target, sent } = cp({
    'view:partials/site_head': { 0: { menuOpen: true } },
    'header/style_3': { 0: { menuOpen: false } },
  }, TEMPLATES);

  syncStoredAlpineStates(win, doc, target);

  assert.deepEqual(sent.map(brief), [
    { uid: undefined, uids: undefined, chrome: 'header', nth: 0, key: 'menuOpen', value: false },
  ]);
});
