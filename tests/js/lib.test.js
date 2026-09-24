/**
 * Contract tests for resources/js/lib/ — the helpers every CP-side module
 * shares. They run in plain Node with hand-made stand-ins for the few DOM
 * calls the helpers make, so no browser or jsdom is needed.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { csrfToken } from '../../resources/js/lib/csrf.js';
import { previewCopies, previewFrame, previewDocument } from '../../resources/js/lib/preview-frame.js';
import { injectStyle } from '../../resources/js/lib/style.js';
import { t, statamicTranslate } from '../../resources/js/lib/i18n.js';
import { dockParent, attachDock } from '../../resources/js/lib/dock-host.js';
import { vueRootElement, isSetPicker } from '../../resources/js/lib/vue-vm.js';

globalThis.Node ??= { ELEMENT_NODE: 1 };

/** A document stand-in: elements by id, iframes, a head that records appends. */
function fakeDocument({ byId = {}, iframes = [], meta = null } = {}) {
  const head = { children: [], appendChild(el) { this.children.push(el); } };

  return {
    head,
    getElementById: (id) => byId[id] || null,
    querySelector: (sel) => (sel === 'meta[name="csrf-token"]' ? meta : null),
    querySelectorAll: (sel) => (sel === 'iframe' ? iframes : []),
    createElement: (tag) => ({ tag, id: '', textContent: '' }),
    body: { tag: 'body', children: [], appendChild(el) { el.parentElement = this; this.children.push(el); } },
  };
}

const configWin = (strings = {}, extra = {}) => ({
  Statamic: { $config: { get: (key) => (key === 'sveStrings' ? strings : extra[key]) } },
  document: fakeDocument(),
});

// ---- csrf ------------------------------------------------------------------

test('csrfToken prefers the meta tag, then Statamic config under either key', () => {
  const meta = { getAttribute: () => 'from-meta' };
  assert.equal(csrfToken({ document: fakeDocument({ meta }), Statamic: null }), 'from-meta');
  assert.equal(csrfToken(configWin({}, { csrfToken: 'camel' })), 'camel');
  assert.equal(csrfToken(configWin({}, { csrf_token: 'snake' })), 'snake');
  assert.equal(csrfToken({ document: fakeDocument() }), '');
});

// ---- preview frame ---------------------------------------------------------

test('previewFrame finds the direct #live-preview-iframe', () => {
  const frame = { contentDocument: fakeDocument() };
  const doc = fakeDocument({ byId: { 'live-preview-iframe': frame } });
  assert.equal(previewFrame(doc), frame);
  assert.equal(previewFrame({ document: doc }), frame, 'accepts a window too');
});

test('previewCopies lists the overview’s frames that hold a page, and none while the overview is closed', () => {
  const frame = { contentDocument: fakeDocument(), ownerDocument: null };
  const closed = fakeDocument({ byId: { 'live-preview-iframe': frame } });

  frame.ownerDocument = closed;
  assert.deepEqual(previewCopies(closed), []);
  assert.deepEqual(previewCopies(fakeDocument()), [], 'no preview, no copies');

  const loaded = { getAttribute: () => 'http://site.test/?sve_view=mobile', contentWindow: { name: 'mobile' } };
  const blank = { getAttribute: () => 'about:blank', contentWindow: { name: 'tablet' } };
  const unset = { getAttribute: () => null, contentWindow: { name: 'laptop' } };
  const layer = { querySelectorAll: (sel) => (sel === 'iframe' ? [loaded, blank, unset] : []) };
  const open = fakeDocument({ byId: { 'live-preview-iframe': frame, '__sve-bp-overview': layer } });

  frame.ownerDocument = open;
  assert.deepEqual(previewCopies(open).map((w) => w.name), ['mobile']);
  assert.deepEqual(previewCopies({ document: open }).map((w) => w.name), ['mobile'], 'accepts a window too');
});

test('previewFrame prefers a preview nested inside the direct frame (CP embedded in a frame)', () => {
  const inner = { contentDocument: fakeDocument() };
  const outer = { contentDocument: fakeDocument({ byId: { 'live-preview-iframe': inner } }) };
  const doc = fakeDocument({ byId: { 'live-preview-iframe': outer } });
  assert.equal(previewFrame(doc), inner);
});

test('previewFrame scans other iframes when there is no direct one', () => {
  const inner = { contentDocument: fakeDocument() };
  const holder = { contentDocument: fakeDocument({ byId: { 'live-preview-iframe': inner } }) };
  const crossOrigin = { get contentDocument() { throw new Error('blocked'); } };
  const doc = fakeDocument({ iframes: [crossOrigin, holder] });
  assert.equal(previewFrame(doc), inner);
});

test('previewDocument is null when nothing is on screen or the frame is cross-origin', () => {
  assert.equal(previewDocument(fakeDocument()), null);
  const blocked = { get contentDocument() { throw new Error('blocked'); } };
  assert.equal(previewDocument(fakeDocument({ byId: { 'live-preview-iframe': blocked } })), null);
});

// ---- style -----------------------------------------------------------------

test('injectStyle creates the tag once and updates it in place afterwards', () => {
  const byId = {};
  const doc = fakeDocument({ byId });
  doc.head.appendChild = (el) => { byId[el.id] = el; doc.head.children.push(el); };

  const first = injectStyle(doc, 'x', 'a{}');
  assert.equal(first.id, 'x');
  assert.equal(first.textContent, 'a{}');
  assert.equal(doc.head.children.length, 1);

  const again = injectStyle(doc, 'x', 'a{}');
  assert.equal(again, first, 'same tag');
  assert.equal(doc.head.children.length, 1, 'not appended twice');

  injectStyle(doc, 'x', 'b{}');
  assert.equal(first.textContent, 'b{}', 'updated in place');
});

// ---- i18n ------------------------------------------------------------------

test('t returns the string, fills :placeholders, and echoes an unknown key', () => {
  const win = configWin({ hello: 'Hej :name', count: ':n stk' });
  assert.equal(t(win, 'hello', { name: 'Flemming' }), 'Hej Flemming');
  assert.equal(t(win, 'count', { n: 3 }), '3 stk');
  assert.equal(t(win, 'missing_key'), 'missing_key');
  assert.equal(t({ document: fakeDocument() }, 'x'), 'x', 'no Statamic at all');
});

test('statamicTranslate uses window.__ when the CP provides it', () => {
  globalThis.window = { __: (key) => `T:${key}` };
  assert.equal(statamicTranslate('Add'), 'T:Add');
  globalThis.window = {};
  assert.equal(statamicTranslate('Add'), 'Add');
});

// ---- dock host -------------------------------------------------------------

test('attachDock moves a dock under .live-preview only when it is not there yet', () => {
  const doc = fakeDocument();
  const live = { tag: 'live-preview', children: [], appendChild(el) { el.parentElement = this; this.children.push(el); } };
  doc.querySelector = (sel) => (sel === '.live-preview' ? live : null);
  const dock = {};
  assert.equal(dockParent(doc), live);
  attachDock(doc, dock);
  attachDock(doc, dock);
  assert.equal(live.children.length, 1);
  doc.querySelector = () => null;
  assert.equal(dockParent(doc), doc.body, 'falls back to body before Live Preview mounts');
});

// ---- vue vm ----------------------------------------------------------------

test('vueRootElement returns the element root or the parent of a text root', () => {
  const el = { nodeType: 1 };
  assert.equal(vueRootElement({ $el: el }), el);
  const parent = {};
  assert.equal(vueRootElement({ $el: { nodeType: 3, parentElement: parent } }), parent);
  assert.equal(vueRootElement({ $el: null }), null);
});

test('isSetPicker requires all three picker props', () => {
  assert.equal(isSetPicker({ $props: { variant: 1, showConnector: 1, loadingSet: 1 } }), true);
  assert.equal(isSetPicker({ $props: { variant: 1, showConnector: 1 } }), false);
  assert.equal(isSetPicker({}), false);
});
