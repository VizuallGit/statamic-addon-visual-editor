/**
 * lib/added-matches.js — the watch that reports elements a selector names as
 * the page gains them — and lib/morph-options.js — the morph option that
 * lets a `<template>` take the server's markup. Both run against small fakes
 * of the DOM and of MutationObserver: which added nodes are reported, when the
 * watch stops, and which templates are rewritten.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { watchAddedMatches } from '../../resources/js/lib/added-matches.js';
import { MORPH_OPTIONS } from '../../resources/js/lib/morph-options.js';

/** An element that answers `matches` by class and `querySelector` over its children. */
class El {
  constructor(className = '', children = [], nodeType = 1) {
    this.className = className;
    this.children = children;
    this.nodeType = nodeType;
  }

  matches(selector) {
    if (selector === '!') {
      throw new SyntaxError(selector);
    }

    return `.${this.className}` === selector;
  }

  querySelector(selector) {
    for (const child of this.children) {
      if (child.matches(selector)) {
        return child;
      }

      const deeper = child.querySelector(selector);

      if (deeper) {
        return deeper;
      }
    }

    return null;
  }
}

/** A MutationObserver the test fires by hand. */
function fakeWindow() {
  const observers = [];

  class MutationObserver {
    constructor(callback) {
      this.callback = callback;
      this.observed = [];
      this.connected = true;
      observers.push(this);
    }

    observe(target, options) {
      this.observed.push({ target, options });
    }

    disconnect() {
      this.connected = false;
    }
  }

  const body = new El('body');

  return { win: { MutationObserver, document: { body } }, observers, body };
}

const fire = (observer, addedNodes) => observer.callback([{ addedNodes }]);

test('watches the body, subtree included, and reports an added node that is the match', () => {
  const { win, observers, body } = fakeWindow();
  let hits = 0;

  watchAddedMatches(win, '.company-dialog', () => hits++);

  assert.equal(observers.length, 1);
  assert.deepEqual(observers[0].observed, [{ target: body, options: { childList: true, subtree: true } }]);

  fire(observers[0], [new El('company-dialog')]);
  assert.equal(hits, 1);
});

test('reports an added node that holds the match, once per batch', () => {
  const { win, observers } = fakeWindow();
  let hits = 0;

  watchAddedMatches(win, '.company-dialog', () => hits++);
  fire(observers[0], [new El('wrap', [new El('p', [new El('company-dialog')])]), new El('company-dialog')]);

  assert.equal(hits, 1);
});

test('text nodes and unrelated elements are not reported', () => {
  const { win, observers } = fakeWindow();
  let hits = 0;

  watchAddedMatches(win, '.company-dialog', () => hits++);
  fire(observers[0], [new El('', [], 3), new El('other', [new El('inner')])]);

  assert.equal(hits, 0);
});

test('a selector the browser rejects names nothing', () => {
  const { win, observers } = fakeWindow();
  let hits = 0;

  watchAddedMatches(win, '!', () => hits++);
  fire(observers[0], [new El('company-dialog')]);

  assert.equal(hits, 0);
});

test('the returned function ends the watch', () => {
  const { win, observers } = fakeWindow();
  const stop = watchAddedMatches(win, '.company-dialog', () => {});

  assert.equal(observers[0].connected, true);
  stop();
  assert.equal(observers[0].connected, false);
});

test('MORPH_OPTIONS.updating rewrites a template whose markup differs, and only that', () => {
  const tpl = (innerHTML, nodeName = 'TEMPLATE') => ({ nodeType: 1, nodeName, innerHTML, attributes: [] });
  const changed = tpl('<h2 class="text-400">A</h2>');

  MORPH_OPTIONS.updating(changed, tpl('<h2 class="text-500">A</h2>'));
  assert.equal(changed.innerHTML, '<h2 class="text-500">A</h2>');

  const same = tpl('<p>same</p>');
  MORPH_OPTIONS.updating(same, tpl('<p>same</p>'));
  assert.equal(same.innerHTML, '<p>same</p>');

  const div = tpl('<p>div</p>', 'DIV');
  MORPH_OPTIONS.updating(div, tpl('<p>other</p>', 'DIV'));
  assert.equal(div.innerHTML, '<p>div</p>');

  const swapped = tpl('<p>tpl</p>');
  MORPH_OPTIONS.updating(swapped, tpl('<p>div</p>', 'DIV'));
  assert.equal(swapped.innerHTML, '<p>tpl</p>');
});

test('MORPH_OPTIONS.updating keeps the bridge\'s component marks on the server\'s node, and nothing else', () => {
  const el = (attrs, nodeType = 1) => ({
    nodeType,
    nodeName: 'DIV',
    attributes: Object.entries(attrs).map(([name, value]) => ({ name, value })),
    hasAttribute(name) {
      return name in attrs;
    },
    setAttribute(name, value) {
      attrs[name] = value;
    },
    attrs,
  });

  const live = el({ 'data-sve-component-dim': '', 'data-sve-component-src': 'components/card', class: 'old', 'data-sid': 'x' });
  const server = el({ class: 'new', 'data-sve-component-src': 'components/other' });

  MORPH_OPTIONS.updating(live, server);
  assert.deepEqual(server.attrs, {
    class: 'new',
    'data-sve-component-src': 'components/other',
    'data-sve-component-dim': '',
  });

  // Text nodes carry no attributes and must pass through untouched.
  assert.doesNotThrow(() => MORPH_OPTIONS.updating({ nodeType: 3, nodeName: '#text' }, { nodeType: 3, nodeName: '#text' }));
});
