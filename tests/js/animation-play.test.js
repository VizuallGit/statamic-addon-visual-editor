/**
 * bridge/animation-play.js — Build's «Stille | Kører» and ▶ in the real
 * preview document. Run against a small fake of the preview's DOM: which
 * elements a play reaches, how a play is made (the runtime's own off switch,
 * across a style flush), and what «Stille» puts on the document.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playAnimation, setAnimationMode } from '../../resources/js/bridge/animation-play.js';

globalThis.CSS ??= { escape: (value) => value };

/** Fake animation: `finished` settles when `end()` is called. */
class Anim {
  constructor() {
    this.finished = new Promise((resolve) => {
      this.end = resolve;
    });
  }
}

/** An element answering the attribute selectors the module asks, and keeping a log of its attribute changes. */
class El {
  constructor(attrs = {}, children = [], { animations = [], box = { top: 10, bottom: 50 } } = {}) {
    this.attrs = { ...attrs };
    this.children = children;
    this.log = [];
    this.animations = animations;
    this.box = box;
    this.scrolled = 0;
    this.parentElement = null;
    children.forEach((child) => {
      child.parentElement = this;
    });
  }

  hasAttribute(name) {
    return name in this.attrs;
  }

  setAttribute(name, value) {
    this.attrs[name] = value;
    this.log.push(`+${name}`);
  }

  removeAttribute(name) {
    delete this.attrs[name];
    this.log.push(`-${name}`);
  }

  toggleAttribute(name, force) {
    if (force) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  get offsetWidth() {
    this.log.push('flush');

    return 100;
  }

  getBoundingClientRect() {
    return this.box;
  }

  scrollIntoView() {
    this.scrolled += 1;
  }

  getAnimations() {
    return this.animations;
  }

  matches(selector) {
    // `[a]`, `[a="v"]`, and the module's `:is(...)`-free attribute lists.
    return selector.split(',').some((part) => {
      const match = part.trim().match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);

      return !!match && match[1] in this.attrs && (match[2] === undefined || this.attrs[match[1]] === match[2]);
    });
  }

  querySelectorAll(selector) {
    const out = [];
    const walk = (el) => el.children.forEach((child) => {
      if (child.matches(selector)) {
        out.push(child);
      }

      walk(child);
    });

    walk(this);

    return out;
  }
}

function makeWindow(body) {
  const head = new El({}, []);
  const html = new El({}, [head, body]);
  const doc = {
    documentElement: html,
    head: { appendChild: (el) => head.children.push(el) },
    getElementById: (id) => head.children.find((el) => el.id === id) || null,
    createElement: () => Object.assign(new El(), { id: '', textContent: '' }),
    querySelectorAll: (selector) => html.querySelectorAll(selector),
  };

  return { document: doc, innerHeight: 800, html, head };
}

test('▶ plays the stamped element itself when it animates: off, flush, on — the runtime’s own repeat', () => {
  const el = new El({ 'data-sve-ht-path': '0.1', 'data-anim': 'self', 'data-anim-on': 'view' });
  const win = makeWindow(new El({}, [el]));

  playAnimation(win, { path: '0.1' });

  assert.deepEqual(el.log, ['+data-anim-off', 'flush', '-data-anim-off']);
  assert.equal(el.scrolled, 0, 'in sight already: not scrolled');
});

test('▶ on an element without an animation of its own plays every animated element inside it, in every rendering', () => {
  const a = new El({ 'data-anim': 'self' });
  const b = new El({ 'data-anim': 'children' });
  const plain = new El({});
  const second = new El({ 'data-anim': 'ticker' });
  const win = makeWindow(new El({}, [
    new El({ 'data-sve-ht-path': '0' }, [a, plain, b]),
    new El({ 'data-sve-ht-path': '0' }, [second]),
    new El({ 'data-sve-ht-path': '1' }, [new El({ 'data-anim': 'self' })]),
  ]));

  playAnimation(win, { path: '0' });

  assert.deepEqual(a.log, ['+data-anim-off', 'flush', '-data-anim-off']);
  assert.deepEqual(b.log, ['+data-anim-off', 'flush', '-data-anim-off']);
  assert.deepEqual(second.log, ['+data-anim-off', 'flush', '-data-anim-off']);
  assert.deepEqual(plain.log, []);
});

test('an element the file keeps off stays off; one out of sight is scrolled into view first', () => {
  const off = new El({ 'data-sve-ht-path': '0', 'data-anim': 'self', 'data-anim-off': '' });
  const below = new El({ 'data-sve-ht-path': '1', 'data-anim': 'self' }, [], { box: { top: 1200, bottom: 1300 } });
  const win = makeWindow(new El({}, [off, below]));

  playAnimation(win, { path: '0' });
  playAnimation(win, { path: '1' });

  assert.deepEqual(off.log, []);
  assert.equal(below.scrolled, 1);
  assert.deepEqual(below.log, ['+data-anim-off', 'flush', '-data-anim-off']);
});

test('a message without a path does nothing', () => {
  const el = new El({ 'data-sve-ht-path': '0', 'data-anim': 'self' });
  const win = makeWindow(new El({}, [el]));

  playAnimation(win, {});
  playAnimation(win, { path: 7 });

  assert.deepEqual(el.log, []);
});

test('«Stille» marks the document and hangs one unlayered sheet in the head, once; «Kører» takes the mark and the playing marks off', () => {
  const playing = new El({ 'data-anim': 'self', 'data-sve-anim-playing': '' });
  const win = makeWindow(new El({}, [playing]));

  setAnimationMode(win, { still: true });
  setAnimationMode(win, { still: true });

  assert.ok(win.html.hasAttribute('data-sve-anim-still'));
  assert.equal(win.head.children.length, 1);
  assert.equal(win.head.children[0].id, '__sve-anim-still');
  assert.match(win.head.children[0].textContent, /^html\[data-sve-anim-still\] /);
  assert.ok(!win.head.children[0].textContent.includes('@layer'), 'unlayered: it beats the runtime’s layers');
  assert.ok(win.head.children[0].textContent.includes(':not([data-sve-anim-playing], [data-sve-anim-playing] > *, [data-sve-anim-playing] [data-anim-word])'));
  assert.ok(win.head.children[0].textContent.includes('[data-anim="words"] [data-anim-word])'), 'the words of a heading stand at their end frame too');
  assert.match(win.head.children[0].textContent, /html\[data-sve-anim-still\] \[data-anim="mouse"\] \{ translate: none; transition: none; \}/, 'the pointer over the preview moves nothing');

  setAnimationMode(win, { still: false });

  assert.ok(!win.html.hasAttribute('data-sve-anim-still'));
  assert.ok(!playing.hasAttribute('data-sve-anim-playing'), 'Kører: nothing is singled out any more');
  assert.equal(win.head.children.length, 1, 'the sheet stays; the mark on <html> is the switch');
});

test('in «Stille» ▶ lets the element play alone, and the mark goes when the animations it started are done — not when an earlier play’s are', async () => {
  const first = new Anim();
  const el = new El({ 'data-sve-ht-path': '0', 'data-anim': 'self' }, [], { animations: [first] });
  const win = makeWindow(new El({}, [el]));

  setAnimationMode(win, { still: true });
  playAnimation(win, { path: '0' });

  assert.deepEqual(el.log, ['+data-sve-anim-playing', '+data-anim-off', 'flush', '-data-anim-off']);

  // ▶ again before the first play ends: the first play's animations are cancelled by the toggle.
  const second = new Anim();

  el.animations = [second];
  playAnimation(win, { path: '0' });
  first.end();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.ok(el.hasAttribute('data-sve-anim-playing'), 'the first play ending says nothing about the second');

  second.end();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.ok(!el.hasAttribute('data-sve-anim-playing'));
});

test('in «Stille» an element whose play starts no animation is not left singled out', () => {
  const el = new El({ 'data-sve-ht-path': '0', 'data-anim': 'self' });
  const win = makeWindow(new El({}, [el]));

  setAnimationMode(win, { still: true });
  playAnimation(win, { path: '0' });

  assert.ok(!el.hasAttribute('data-sve-anim-playing'));
});
