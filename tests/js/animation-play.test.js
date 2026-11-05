/**
 * bridge/animation-play.js and lib/anim-still.js — Live Preview settings'
 * «Animationer kører» and ▶, in the real preview document and on Build's
 * canvas. Run against a small fake of the DOM: which elements a play reaches,
 * how a play is made (the runtime's own off switch, across a style flush, the
 * element marked to play alone until its animations are done), and what
 * «held still» puts on a document. Plus canvas-motion.css: it reverts reduce
 * motion for what plays and for nothing else.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { playAnimation, setAnimationMode } from '../../resources/js/bridge/animation-play.js';
import { applyStill, playAlone, PLAYING_ATTR, STILL_ATTR } from '../../resources/js/lib/anim-still.js';

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

/** A play that starts no animation: marked, restarted, and let go at once. */
const PLAYED = ['+data-sve-anim-playing', '+data-anim-off', 'flush', '-data-anim-off', '-data-sve-anim-playing'];

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

  assert.deepEqual(el.log, PLAYED);
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

  assert.deepEqual(a.log, PLAYED);
  assert.deepEqual(b.log, PLAYED);
  assert.deepEqual(second.log, PLAYED);
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
  assert.deepEqual(below.log, PLAYED);
});

test('a message without a path does nothing', () => {
  const el = new El({ 'data-sve-ht-path': '0', 'data-anim': 'self' });
  const win = makeWindow(new El({}, [el]));

  playAnimation(win, {});
  playAnimation(win, { path: 7 });

  assert.deepEqual(el.log, []);
});

test('held still: the document is marked and one unlayered sheet hangs in the head, once; let go, the mark goes; either way no play stays singled out', () => {
  const playing = new El({ 'data-anim': 'self', 'data-sve-anim-playing': '' });
  const win = makeWindow(new El({}, [playing]));

  setAnimationMode(win, { still: true });

  assert.ok(!playing.hasAttribute('data-sve-anim-playing'), 'held: an earlier play is not let run on');

  playing.setAttribute('data-sve-anim-playing', '');
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
  assert.ok(!playing.hasAttribute('data-sve-anim-playing'), 'running: nothing is singled out any more');
  assert.equal(win.head.children.length, 1, 'the sheet stays; the mark on <html> is the switch');
});

test('held still, ▶ lets the element play alone, and the mark goes when the animations it started are done — not when an earlier play’s are', async () => {
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

test('held still, an element whose play starts no animation is not left singled out', () => {
  const el = new El({ 'data-sve-ht-path': '0', 'data-anim': 'self' });
  const win = makeWindow(new El({}, [el]));

  setAnimationMode(win, { still: true });
  playAnimation(win, { path: '0' });

  assert.ok(!el.hasAttribute('data-sve-anim-playing'));
});

test('Build\'s canvas: its own sheet, under its own id, where it is put; the mark on its own <html>', () => {
  const el = new El({ 'data-anim': 'self' });
  const win = makeWindow(new El({}, [el]));
  const after = [];
  const doc = { ...win.document, getElementById: (id) => after.find((sheet) => sheet.id === id) || null };

  applyStill(doc, true, { id: '__sve-build-canvas-still', into: { appendChild: (sheet) => after.push(sheet) } });
  applyStill(doc, true, { id: '__sve-build-canvas-still', into: { appendChild: (sheet) => after.push(sheet) } });

  assert.equal(after.length, 1);
  assert.equal(after[0].id, '__sve-build-canvas-still');
  assert.match(after[0].textContent, new RegExp(`^html\\[${STILL_ATTR}\\] `));
  assert.equal(win.head.children.length, 0, 'nothing in the head, which the canvas morphs from the preview\'s');
  assert.ok(win.html.hasAttribute(STILL_ATTR));

  applyStill(doc, false, { id: '__sve-build-canvas-still', into: { appendChild: (sheet) => after.push(sheet) } });

  assert.ok(!win.html.hasAttribute(STILL_ATTR), 'the setting on: the canvas plays');
});

test('playAlone: marked, restarted across a flush, and the mark goes when the animations it started are done', async () => {
  const run = new Anim();
  const el = new El({ 'data-anim': 'children' }, [], { animations: [run] });

  playAlone(el);

  assert.deepEqual(el.log, ['+data-sve-anim-playing', '+data-anim-off', 'flush', '-data-anim-off']);
  assert.ok(el.hasAttribute(PLAYING_ATTR), 'while it runs');

  run.end();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.ok(!el.hasAttribute(PLAYING_ATTR), 'done: it stands still again');
});

/** Every alternative of a selector list, the commas inside :is() / :not() left whole. */
function alternatives(list) {
  const out = [];
  let depth = 0;
  let from = 0;

  for (let i = 0; i < list.length; i += 1) {
    if (list[i] === '(') {
      depth += 1;
    } else if (list[i] === ')') {
      depth -= 1;
    } else if (list[i] === ',' && depth === 0) {
      out.push(list.slice(from, i).trim());
      from = i + 1;
    }
  }

  out.push(list.slice(from).trim());

  return out;
}

/** `:is(a, b) > c` → `a > c`, `b > c`: what each alternative names, one by one. */
function expand(selector) {
  const match = /^:is\((.*)\)$/.exec(selector);

  return match ? alternatives(match[1]).flatMap(expand) : [selector];
}

test('canvas-motion.css reverts reduce motion only under [data-sve-anim-playing]: the element, its children, its words — nothing else moves', () => {
  const css = readFileSync(new URL('../../resources/animation/canvas-motion.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const inner = css.slice(css.indexOf('{') + 1, css.lastIndexOf('}'));
  const selectors = [...inner.matchAll(/([^{}]+)\{[^{}]*\}/g)].map((m) => m[1].trim());

  assert.ok(selectors.length >= 2, 'the timed kinds and parallax / ticker');

  for (const list of selectors) {
    for (const one of alternatives(list).flatMap(expand)) {
      const head = one.split(/\s*[> ]\s*(?![^(]*\))/)[0];

      assert.ok(head.includes(`[${PLAYING_ATTR}]`), `${one} — its animated element carries the mark`);
    }
  }
});
