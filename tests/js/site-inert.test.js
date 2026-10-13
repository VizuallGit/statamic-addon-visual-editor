/**
 * bridge/site-inert.js — the page in Live Preview hears nothing a person does
 * to it, while the editor hears everything. Run against a small fake of the
 * preview's document: which events are kept from the site, which are also
 * cancelled, and the four places the editor owns the event instead.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EDITOR_UI, installSiteInert } from '../../resources/js/bridge/site-inert.js';
import { bridgeState } from '../../resources/js/bridge/state.js';

/** An element answering `[attr]` and `[attr^="value"]`, alone or in a comma list. */
class El {
  constructor(attrs = {}, children = []) {
    this.attrs = attrs;
    this.parentElement = null;
    children.forEach((child) => {
      child.parentElement = this;
    });
  }

  hasAttribute(name) {
    return name in this.attrs;
  }

  matches(selector) {
    return selector.split(',').some((part) => {
      const m = part.trim().match(/^\[([\w-]+)(?:\^="([^"]*)")?\]$/);

      return !!m && m[1] in this.attrs && (m[2] === undefined || String(this.attrs[m[1]]).startsWith(m[2]));
    });
  }

  closest(selector) {
    for (let el = this; el; el = el.parentElement) {
      if (el.matches(selector)) {
        return el;
      }
    }

    return null;
  }

  contains(other) {
    for (let el = other; el; el = el.parentElement) {
      if (el === this) {
        return true;
      }
    }

    return false;
  }
}

function preview() {
  const button = new El({ 'data-x-click': '' });
  const editing = new El({ 'data-sid-field': 'text' });
  const container = new El({ 'data-sid-insert': 'blocks' });
  const section = new El({ 'data-sid': 'sec-1' }, [button, editing, container]);
  const toolbarButton = new El({});
  const toolbar = new El({ id: '__sve-edit-toolbar' }, [toolbarButton]);
  const menuRow = new El({});
  const menu = new El({ 'data-sve-menu': '' }, [menuRow]);
  const body = new El({}, [section, toolbar, menu]);
  const gridHandle = new El({});
  const html = new El({}, [body, gridHandle]);
  const listeners = new Map();
  const win = {
    document: {
      body,
      documentElement: html,
      addEventListener: (type, fn, options) => listeners.set(type, { fn, options }),
    },
  };

  installSiteInert(win);

  const fire = (type, target) => {
    const event = { type, target, stopped: false, prevented: false };

    event.stopPropagation = () => (event.stopped = true);
    event.preventDefault = () => (event.prevented = true);
    listeners.get(type).fn(event);

    return event;
  };

  return { fire, listeners, button, editing, container, section, body, toolbarButton, menuRow, gridHandle };
}

beforeEach(() => {
  bridgeState.editing = null;
});

test('every way to reach the page is listened for on the document, in the capture phase', () => {
  const { listeners } = preview();
  const ways = [
    'click', 'dblclick', 'contextmenu', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout',
    'pointerdown', 'pointerenter', 'touchstart', 'keydown', 'keyup', 'input', 'change',
    'focus', 'blur', 'focusin', 'dragstart', 'drop', 'toggle',
  ];

  ways.forEach((type) => {
    assert.ok(listeners.has(type), `${type} is listened for`);
    assert.equal(listeners.get(type).options.capture, true, `${type} in the capture phase`);
  });
});

test('what draws the page is left alone: scrolling, transitions, media', () => {
  const { listeners } = preview();

  ['scroll', 'wheel', 'transitionend', 'animationend', 'play', 'pause', 'selectionchange', 'load'].forEach((type) => {
    assert.ok(!listeners.has(type), `${type} is not touched`);
  });
});

test('a click on the page is kept from the site and its activation cancelled', () => {
  const { fire, button } = preview();
  const event = fire('click', button);

  assert.deepEqual([event.stopped, event.prevented], [true, true]);
  assert.deepEqual([fire('auxclick', button).prevented], [true]);
});

test('hover, focus, keys and pointer downs are kept from the site, but never cancelled', () => {
  const { fire, button, body } = preview();

  ['mouseenter', 'mouseleave', 'mouseover', 'focus', 'focusin', 'mousedown', 'pointerdown', 'touchstart', 'dblclick', 'toggle'].forEach((type) => {
    const event = fire(type, button);

    assert.deepEqual([event.stopped, event.prevented], [true, false], type);
  });

  // A key pressed with nothing focused is the body's — `@keydown.slash.window`.
  assert.deepEqual([fire('keydown', body).stopped, fire('keydown', body).prevented], [true, false]);
});

test('only click and auxclick listeners may cancel; the rest are passive', () => {
  const { listeners } = preview();

  listeners.forEach(({ options }, type) => {
    assert.equal(options.passive, !['click', 'auxclick'].includes(type), type);
  });
});

test('the editor’s own controls keep every event — in <body> by marker, on <html> always', () => {
  const { fire, toolbarButton, menuRow, gridHandle } = preview();

  [toolbarButton, menuRow, gridHandle].forEach((target) => {
    ['click', 'mouseenter', 'keydown', 'pointerdown'].forEach((type) => {
      const event = fire(type, target);

      assert.deepEqual([event.stopped, event.prevented], [false, false], `${type}`);
    });
  });
});

test('the element being inline-edited hears its input, keys and blur — and nothing else is let through', () => {
  const { fire, editing, button } = preview();

  bridgeState.editing = { el: editing };

  ['input', 'keydown', 'keyup', 'blur'].forEach((type) => {
    assert.equal(fire(type, editing).stopped, false, type);
  });

  // A click inside it is still the site's to be kept from: the video button
  // sits in the text field's wrapper on the demo.
  assert.equal(fire('click', editing).stopped, true);
  assert.equal(fire('focusin', editing).stopped, true);
  assert.equal(fire('keydown', button).stopped, true, 'keys elsewhere on the page are still kept');
});

test('a block inserter’s container hears the pointer arriving and leaving, and only that', () => {
  const { fire, container } = preview();

  assert.equal(fire('pointerenter', container).stopped, false);
  assert.equal(fire('pointerleave', container).stopped, false);
  assert.equal(fire('mouseenter', container).stopped, true);
  assert.equal(fire('click', container).stopped, true);
});

test('EDITOR_UI names the id prefixes and the portaled markers', () => {
  ['[id^="__sve"]', '[id^="sve-"]', '[data-sve-ui]', '[data-sve-menu]', '[data-sve-color-menu]',
    '[data-sve-bard-style-menu]', '[data-sve-bard-set-inserter]'].forEach((part) => {
    assert.ok(EDITOR_UI.includes(part), part);
  });
});
