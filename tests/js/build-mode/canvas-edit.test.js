/**
 * canvas-edit.js — the words of an element typed in on the canvas.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editedText } from '../../../resources/js/build-mode/canvas-edit.js';

const text = (data) => ({ nodeType: 3, data });
const br = { nodeType: 1, tagName: 'BR', childNodes: [] };
const el = (...childNodes) => ({ nodeType: 1, tagName: 'P', childNodes });

test('words and line breaks, as the text box has them', () => {
  assert.equal(editedText(el(text('One'), br, text('Two'))), 'One<br>Two');
  assert.equal(editedText(el()), '');
});

test('the <br> the browser keeps for the caret is not the text', () => {
  assert.equal(editedText(el(text('One'), br)), 'One');
  assert.equal(editedText(el(text('One'), br, br)), 'One<br>');
});

test('a space the browser wrote hard is a space', () => {
  assert.equal(editedText(el(text('Hej du'))), 'Hej du');
});

/* ---------------- writing: the file, a field, or the section's own content ---------------- */

import { canvasEdit } from '../../../resources/js/build-mode/canvas-edit.js';

/** An element on the canvas, as much of one as typing touches; `type(words)` is a keystroke's worth. */
function canvas(words) {
  const frames = [];
  const listeners = {};
  const doc = {
    defaultView: {
      requestAnimationFrame: (fn) => frames.push(fn),
      cancelAnimationFrame() {},
    },
    getSelection: () => ({ removeAllRanges() {}, addRange() {} }),
    caretRangeFromPoint: () => null,
  };
  const node = {
    nodeType: 1,
    tagName: 'H2',
    childNodes: [text(words)],
    ownerDocument: doc,
    attrs: {},
    style: { setProperty() {} },
    setAttribute(name, value) {
      this.attrs[name] = value;
    },
    getAttribute(name) {
      return this.attrs[name] ?? null;
    },
    removeAttribute(name) {
      delete this.attrs[name];
    },
    addEventListener(type, fn) {
      listeners[type] = fn;
    },
    removeEventListener(type) {
      delete listeners[type];
    },
    focus() {},
    contains: () => false,
  };

  return {
    node,
    type(next) {
      node.childNodes = [text(next)];
      listeners.input?.();
      frames.splice(0).forEach((fn) => fn());
    },
  };
}

/** canvasEdit with a port that records what was written where. */
function session(target, { made = 'heading' } = {}) {
  const log = [];
  let land = null;
  const port = {
    inlineTarget: () => target,
    selectedPath: () => '0.1',
    showContent() {},
    setText: (path, value) => log.push(['file', path, value]),
    makeOwn: (path, { value }) => {
      log.push(['own', path]);

      return new Promise((resolve) => {
        land = () => {
          log.push(['own-value', value()]);
          resolve(made);
        };
      });
    },
  };
  const el = canvas('New heading');
  const edit = canvasEdit({
    port: () => port,
    setField: (name, value) => log.push(['field', name, value]),
    paint() {},
    find: () => el.node,
  });

  return { log, el, edit, land: () => land?.() };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test("own words in a section: the first change makes the section's own field, and typing goes there", async () => {
  const { log, el, edit, land } = session({ oneLine: true, own: true });

  edit.start(el.node, '0.1', { clientX: 0, clientY: 0 });
  await tick();
  el.type('Our team');
  el.type('Our team lead');

  // One field asked for, nothing written into the file while it is on its way.
  assert.deepEqual(log, [['own', '0.1']]);

  land();
  await tick();
  el.type('Our team leader');
  edit.finish();
  await tick();

  assert.deepEqual(log, [
    ['own', '0.1'],
    ['own-value', 'Our team lead'],
    ['field', 'heading', 'Our team lead'],
    ['field', 'heading', 'Our team leader'],
    ['field', 'heading', 'Our team leader'],
  ]);
  assert.equal(log.some(([where]) => where === 'file'), false);
});

test('a click into own words that changes nothing makes no field and writes nothing', async () => {
  const { log, el, edit } = session({ oneLine: true, own: true });

  edit.start(el.node, '0.1', { clientX: 0, clientY: 0 });
  await tick();
  edit.finish();
  await tick();

  assert.deepEqual(log, []);
});

test('typing ended before the field lands: the last words go into it', async () => {
  const { log, el, edit, land } = session({ oneLine: true, own: true });

  edit.start(el.node, '0.1', { clientX: 0, clientY: 0 });
  await tick();
  el.type('Hello');
  edit.finish();
  land();
  await tick();

  assert.deepEqual(log, [
    ['own', '0.1'],
    ['own-value', 'Hello'],
    ['field', 'heading', 'Hello'],
  ]);
});

test('words the section cannot hold as its own go into the file, as before', async () => {
  const { log, el, edit } = session({ oneLine: true, own: false });

  edit.start(el.node, '0.1', { clientX: 0, clientY: 0 });
  await tick();
  el.type('Shared');
  edit.finish();

  assert.deepEqual(log, [
    ['file', '0.1', 'Shared'],
    ['file', '0.1', 'Shared'],
  ]);
});

test('no field could be made: the words go into the file', async () => {
  const { log, el, edit, land } = session({ oneLine: true, own: true }, { made: null });

  edit.start(el.node, '0.1', { clientX: 0, clientY: 0 });
  await tick();
  el.type('Shared after all');
  land();
  await tick();

  assert.deepEqual(log.at(-1), ['file', '0.1', 'Shared after all']);
});
