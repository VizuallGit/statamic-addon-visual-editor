/**
 * bridge/focus-frame.js — the one frame around a focused header, footer,
 * global section or component. Run against a small fake of the DOM: what is
 * built, where it is laid, what Save and "not saved" do, that mounting twice
 * moves the frame rather than doubling it, and that a chip's click never
 * reaches the page's handlers.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FOCUS_CLOSE_ATTR,
  FOCUS_COLORS,
  FOCUS_FRAME_ATTR,
  FOCUS_LABEL_ATTR,
  FOCUS_SAVE_ATTR,
  FOCUS_STATUS_ATTR,
  focusFrameId,
  focusFrameOpen,
  focusFrameOwns,
  mountFocusFrame,
  setFocusFrameDirty,
  setFocusFrameLabel,
  unmountFocusFrame,
} from '../../resources/js/bridge/focus-frame.js';

class El {
  constructor(tag, rect = { top: 0, left: 0, width: 0, height: 0 }) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.attributes = new Map();
    this.style = {};
    this.textContent = '';
    this.listeners = new Map();
    this.rect = rect;
    this.isConnected = true;
  }

  get id() {
    return this.attributes.get('id') || '';
  }

  set id(value) {
    this.attributes.set('id', value);
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  append(...nodes) {
    nodes.forEach((node) => this.appendChild(node));
  }

  appendChild(node) {
    node.parentElement = this;
    this.children.push(node);

    return node;
  }

  remove() {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
      this.parentElement = null;
    }

    this.isConnected = false;
  }

  addEventListener(type, fn) {
    this.listeners.set(type, [...(this.listeners.get(type) || []), fn]);
  }

  dispatch(type) {
    const event = { type, stopped: false, prevented: false, stopPropagation() { this.stopped = true; }, preventDefault() { this.prevented = true; } };

    (this.listeners.get(type) || []).forEach((fn) => fn(event));

    return event;
  }

  getBoundingClientRect() {
    const { top, left, width, height } = this.rect;

    return { top, left, width, height, right: left + width, bottom: top + height };
  }

  /** `[attr="value"]` or `[attr]` against this element — enough for `closest`. */
  matches(selector) {
    const m = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);

    if (!m) {
      return false;
    }

    return m[2] == null ? this.hasAttribute(m[1]) : this.getAttribute(m[1]) === m[2];
  }

  closest(selector) {
    let node = this;

    while (node) {
      if (node.matches(selector)) {
        return node;
      }

      node = node.parentElement;
    }

    return null;
  }

  /** Depth-first, one attribute selector. */
  find(selector) {
    for (const child of this.children) {
      if (child.matches(selector)) {
        return child;
      }

      const deeper = child.find(selector);

      if (deeper) {
        return deeper;
      }
    }

    return null;
  }

  all(selector, out = []) {
    for (const child of this.children) {
      if (child.matches(selector)) {
        out.push(child);
      }

      child.all(selector, out);
    }

    return out;
  }
}

function fakeWindow() {
  const html = new El('html');
  const doc = {
    documentElement: html,
    createElement: (tag) => new El(tag),
    getElementById: (id) => html.all(`[id="${id}"]`)[0] || null,
  };
  const listeners = new Map();
  const win = {
    document: doc,
    scrollX: 0,
    scrollY: 100,
    addEventListener: (type, fn) => listeners.set(type, [...(listeners.get(type) || []), fn]),
    removeEventListener: (type, fn) => listeners.set(type, (listeners.get(type) || []).filter((f) => f !== fn)),
    fire: (type) => (listeners.get(type) || []).forEach((fn) => fn()),
    listenerCount: (type) => (listeners.get(type) || []).length,
  };

  // No ResizeObserver on this window: the frame must get by on resize + scroll.
  return { win, html };
}

const t = (key, replacements = {}) => {
  let out = { save: 'Save', close: 'Close', focus_dirty: 'Not saved', focus_label_header: 'Header' }[key] ?? key;

  for (const [name, value] of Object.entries(replacements)) {
    out = out.replaceAll(`:${name}`, value);
  }

  return out;
};

test('the frame is laid over the element in document coordinates, named top-left, with the way out top-right', () => {
  const { win, html } = fakeWindow();
  const header = new El('header', { top: 20, left: 10, width: 300, height: 60 });
  const closed = [];

  mountFocusFrame(win, { kind: 'header', el: header, t, label: 'Header', onClose: () => closed.push(1) });

  const root = html.find(`[${FOCUS_FRAME_ATTR}="header"]`);

  assert.ok(root, 'a frame for the header hangs off <html>');
  assert.equal(root.id, focusFrameId('header'));
  assert.equal(root.getAttribute('data-sve-ui'), '', 'marked as the editor\'s own, for site-inert');
  assert.equal(root.style.top, '120px', 'top = rect.top + scrollY');
  assert.equal(root.style.left, '10px');
  assert.equal(root.style.width, '300px');
  assert.equal(root.style.height, '60px');
  assert.match(root.style.cssText, /pointer-events:none/, 'the container lets clicks through to the element');

  assert.equal(root.find(`[${FOCUS_LABEL_ATTR}]`).textContent, 'Header');
  assert.match(root.find(`[${FOCUS_LABEL_ATTR}]`).style.cssText, new RegExp(`background:${FOCUS_COLORS.header}`), 'the kind\'s colour');

  const close = root.find(`[${FOCUS_CLOSE_ATTR}]`);

  assert.equal(close.textContent, 'Close ✕');
  close.dispatch('click');
  assert.deepEqual(closed, [1], 'Close runs the caller\'s onClose');

  unmountFocusFrame('header');
});

test('a component frame never shows Save or "not saved"; a dirtyable frame shows them only while dirty', () => {
  const { win, html } = fakeWindow();
  const el = new El('section', { top: 0, left: 0, width: 100, height: 50 });
  const saved = [];

  mountFocusFrame(win, { kind: 'component', el, t, label: 'Component · card', onClose() {} });

  const component = html.find(`[${FOCUS_FRAME_ATTR}="component"]`);

  assert.equal(component.find(`[${FOCUS_SAVE_ATTR}]`).style.display, 'none');
  assert.equal(component.find(`[${FOCUS_STATUS_ATTR}]`).style.display, 'none');
  setFocusFrameDirty('component', true);
  assert.equal(component.find(`[${FOCUS_SAVE_ATTR}]`).style.display, 'none', 'not dirtyable: dirty changes nothing');

  mountFocusFrame(win, { kind: 'global', el, t, label: 'Global section', dirtyable: true, onSave: () => saved.push(1), onClose() {} });

  const global = html.find(`[${FOCUS_FRAME_ATTR}="global"]`);

  assert.equal(global.find(`[${FOCUS_SAVE_ATTR}]`).style.display, 'none', 'clean: no Save');
  assert.equal(global.find(`[${FOCUS_STATUS_ATTR}]`).style.display, 'none', 'clean: no status either — the same frame as a component');

  setFocusFrameDirty('global', true);
  assert.equal(global.find(`[${FOCUS_SAVE_ATTR}]`).style.display, '');
  assert.equal(global.find(`[${FOCUS_STATUS_ATTR}]`).textContent, 'Not saved');
  global.find(`[${FOCUS_SAVE_ATTR}]`).dispatch('click');
  assert.deepEqual(saved, [1]);

  setFocusFrameDirty('global', false);
  assert.equal(global.find(`[${FOCUS_SAVE_ATTR}]`).style.display, 'none');

  assert.equal(html.all(`[${FOCUS_FRAME_ATTR}]`).length, 2, 'one frame per kind, both up at once');

  unmountFocusFrame('component');
  unmountFocusFrame('global');
  assert.equal(html.all(`[${FOCUS_FRAME_ATTR}]`).length, 0);
});

test('mounting again moves the frame to the new element and keeps its state; it never doubles', () => {
  const { win, html } = fakeWindow();
  const first = new El('header', { top: 0, left: 0, width: 100, height: 50 });
  const second = new El('header', { top: 0, left: 40, width: 200, height: 70 });

  mountFocusFrame(win, { kind: 'header', el: first, t, label: 'Header', dirtyable: true, dirty: true, onClose() {} });
  mountFocusFrame(win, { kind: 'header', el: second, t, label: 'Header', dirtyable: true, dirty: true, onClose() {} });

  const frames = html.all(`[${FOCUS_FRAME_ATTR}="header"]`);

  assert.equal(frames.length, 1);
  assert.equal(frames[0].style.left, '40px', 'laid over the second element');
  assert.equal(frames[0].style.width, '200px');
  assert.equal(frames[0].find(`[${FOCUS_SAVE_ATTR}]`).style.display, '', 'dirty state carried over');
  assert.equal(win.listenerCount('resize'), 1, 'the old element\'s watch was dropped');

  // The element was morphed away and nothing re-pointed the frame yet: it stays
  // where it stood rather than jumping to 0,0.
  second.isConnected = false;
  second.rect = { top: 0, left: 0, width: 0, height: 0 };
  win.fire('resize');
  assert.equal(frames[0].style.left, '40px');

  setFocusFrameLabel('header', 'Header · renamed');
  assert.equal(frames[0].find(`[${FOCUS_LABEL_ATTR}]`).textContent, 'Header · renamed');

  assert.equal(unmountFocusFrame('header'), true);
  assert.equal(unmountFocusFrame('header'), false, 'nothing left to take down');
  assert.equal(win.listenerCount('resize'), 0);
  assert.equal(win.listenerCount('scroll'), 0);
  assert.equal(focusFrameOpen('header'), false);
});

test('a component used in several places wears one frame per place — same label, same way out, same state', () => {
  const { win, html } = fakeWindow();
  const above = new El('div', { top: -1800, left: 0, width: 800, height: 40 });
  const inView = new El('div', { top: 120, left: 0, width: 800, height: 140 });
  const later = new El('div', { top: 900, left: 0, width: 800, height: 140 });
  const closed = [];

  mountFocusFrame(win, { kind: 'component', els: [above, inView], t, label: 'Component · section_heading', onClose: () => closed.push(1) });

  let boxes = html.all(`[${FOCUS_FRAME_ATTR}="component"]`);

  assert.equal(boxes.length, 2, 'one box per instance');
  assert.deepEqual(boxes.map((box) => box.id), [focusFrameId('component'), focusFrameId('component', 1)]);
  assert.deepEqual(boxes.map((box) => box.style.top), ['-1700px', '220px'], 'each laid over its own instance');
  assert.deepEqual(boxes.map((box) => box.find(`[${FOCUS_LABEL_ATTR}]`).textContent), ['Component · section_heading', 'Component · section_heading']);

  boxes[1].find(`[${FOCUS_CLOSE_ATTR}]`).dispatch('click');
  assert.deepEqual(closed, [1], 'Close on the instance in view runs the one onClose');

  // A redraw with the instances re-pointed, one more of them: boxes re-used, one added, none doubled.
  mountFocusFrame(win, { kind: 'component', els: [above, inView, later], t, label: 'Component · section_heading', onClose() {} });
  boxes = html.all(`[${FOCUS_FRAME_ATTR}="component"]`);
  assert.equal(boxes.length, 3);
  assert.equal(boxes[2].style.top, '1000px');
  assert.equal(win.listenerCount('resize'), 3, 'one watch per box');

  // Fewer instances after a morph: the surplus box goes, its watch with it.
  mountFocusFrame(win, { kind: 'component', els: [inView], t, label: 'Component · section_heading', onClose() {} });
  boxes = html.all(`[${FOCUS_FRAME_ATTR}="component"]`);
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0].style.top, '220px');
  assert.equal(win.listenerCount('resize'), 1);

  setFocusFrameLabel('component', 'Component · renamed');
  assert.equal(boxes[0].find(`[${FOCUS_LABEL_ATTR}]`).textContent, 'Component · renamed');

  assert.equal(unmountFocusFrame('component'), true);
  assert.equal(html.all(`[${FOCUS_FRAME_ATTR}]`).length, 0);
  assert.equal(win.listenerCount('resize'), 0);
});

test('a chip keeps its clicks to itself, and the page handler can tell a chip from the page', () => {
  const { win, html } = fakeWindow();
  const el = new El('footer', { top: 500, left: 0, width: 100, height: 50 });

  mountFocusFrame(win, { kind: 'footer', el, t, label: 'Footer', onClose() {} });

  const close = html.find(`[${FOCUS_CLOSE_ATTR}]`);

  assert.equal(close.dispatch('pointerdown').stopped, true, 'pointerdown never reaches the page\'s click handling');

  const click = close.dispatch('click');

  assert.equal(click.stopped, true);
  assert.equal(click.prevented, true);

  assert.equal(focusFrameOwns(close), true);
  assert.equal(focusFrameOwns(el), false);
  assert.equal(focusFrameOwns(null), false);

  unmountFocusFrame('footer');
});
