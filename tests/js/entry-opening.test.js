/**
 * The loading dots beside an entry's link (lib/entry-opening.js): put up by
 * the click that opens the overlay, taken down by the overlay host's
 * `sve-overlay-idle` — owned there, so the top bar's Live Preview button is
 * not left with dots on a site that named no open-in-preview collections
 * (there, open-in-preview.js's init never runs).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENTRY_OPEN_ATTR, showEntryOpening } from '../../resources/js/lib/entry-opening.js';

/** The little an element needs here: attributes, siblings, children, `after`, `remove`. */
class El {
  constructor(tag, attributes = {}) {
    this.tagName = tag.toUpperCase();
    this.attrs = { ...attributes };
    this.children = [];
    this.parent = null;
    this.innerHTML = '';
    this.textContent = '';
  }

  setAttribute(name, value) {
    this.attrs[name] = value;
  }

  hasAttribute(name) {
    return name in this.attrs;
  }

  getAttribute(name) {
    return this.attrs[name] ?? null;
  }

  get href() {
    return this.attrs.href;
  }

  matches(selector) {
    if (selector === 'a[href]') {
      return this.tagName === 'A' && 'href' in this.attrs;
    }

    if (selector === `[${ENTRY_OPEN_ATTR}]`) {
      return ENTRY_OPEN_ATTR in this.attrs;
    }

    return false;
  }

  closest() {
    return null;
  }

  querySelector() {
    return null;
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);

    return child;
  }

  after(node) {
    const siblings = this.parent.children;

    node.parent = this.parent;
    siblings.splice(siblings.indexOf(this) + 1, 0, node);
  }

  remove() {
    const siblings = this.parent?.children;

    if (siblings) {
      siblings.splice(siblings.indexOf(this), 1);
    }

    this.parent = null;
  }

  get nextElementSibling() {
    const siblings = this.parent.children;

    return siblings[siblings.indexOf(this) + 1] ?? null;
  }
}

/** A window with a header, no listing rows, and `sve-overlay-idle` the test fires. */
function fakeWindow() {
  const listeners = {};
  const win = {
    location: { origin: 'https://site.test' },
    addEventListener: (type, fn) => (listeners[type] = [...(listeners[type] ?? []), fn]),
    removeEventListener: (type, fn) => (listeners[type] = (listeners[type] ?? []).filter((f) => f !== fn)),
    dispatch: (type) => [...(listeners[type] ?? [])].forEach((fn) => fn()),
    listenerCount: (type) => (listeners[type] ?? []).length,
  };
  const head = new El('head');
  const body = new El('body');
  const all = () => [...head.children, ...body.children];
  const doc = {
    defaultView: win,
    head,
    body,
    getElementById: (id) => all().find((el) => el.attrs.id === id || el.id === id) ?? null,
    createElement: (tag) => new El(tag),
    querySelectorAll: (selector) => all().filter((el) => el.matches(selector)),
  };

  win.document = doc;

  return { win, doc, body };
}

test('the top-bar button gets dots with no open-in-preview collections, and loses them when the overlay is idle', () => {
  const { win, doc, body } = fakeWindow();
  const button = body.appendChild(new El('a', { href: 'https://site.test/cp/collections/pages/entries/home?live-preview=1', 'data-sve-home-preview': '' }));

  showEntryOpening(doc, button, button.href);

  const dots = button.nextElementSibling;

  assert.ok(dots, 'dots stand after the button');
  assert.equal(dots.hasAttribute(ENTRY_OPEN_ATTR), true);
  assert.equal(win.listenerCount('sve-overlay-idle'), 1);

  win.dispatch('sve-overlay-idle');

  assert.equal(button.nextElementSibling, null, 'the dots are gone');
  assert.equal(doc.querySelectorAll(`[${ENTRY_OPEN_ATTR}]`).length, 0);
  assert.equal(win.listenerCount('sve-overlay-idle'), 0, 'the listener went with them');
});

test('a second opening before the first settles leaves one set of dots, and idle clears everything', () => {
  const { win, doc, body } = fakeWindow();
  const first = body.appendChild(new El('a', { href: '/cp/collections/pages/entries/a' }));
  const second = body.appendChild(new El('a', { href: '/cp/collections/pages/entries/b' }));

  showEntryOpening(doc, first, first.href);
  showEntryOpening(doc, second, second.href);

  assert.equal(doc.querySelectorAll(`[${ENTRY_OPEN_ATTR}]`).length, 1);
  assert.equal(first.nextElementSibling, second, 'the first link lost its dots to the second opening');

  win.dispatch('sve-overlay-idle');

  assert.equal(doc.querySelectorAll(`[${ENTRY_OPEN_ATTR}]`).length, 0);
  assert.equal(win.listenerCount('sve-overlay-idle'), 0);
});

test('no link to stand beside means no dots and no listener', () => {
  const { win, doc } = fakeWindow();

  showEntryOpening(doc, null, '/cp/collections/pages/entries/nowhere');

  assert.equal(doc.querySelectorAll(`[${ENTRY_OPEN_ATTR}]`).length, 0);
  assert.equal(win.listenerCount('sve-overlay-idle'), 0);
});
