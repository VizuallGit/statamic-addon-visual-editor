import test from 'node:test';
import assert from 'node:assert/strict';
import { isTypingTarget, zoomKey } from '../../resources/js/lib/zoom-keys.js';

/** A keydown as the handlers see it; `target` answers `closest` with what it is inside. */
const key = (k, extra = {}) => ({ key: k, defaultPrevented: false, altKey: false, ctrlKey: false, metaKey: false, target: inside(null), ...extra });
const inside = (match) => ({ closest: (selector) => (match && selector.includes(match) ? {} : null) });

test('a plain + or = is a step in, a plain - a step out, any other key nothing', () => {
  assert.equal(zoomKey(key('+')), 'in');
  assert.equal(zoomKey(key('=')), 'in', 'unshifted + on a US keyboard');
  assert.equal(zoomKey(key('-')), 'out');
  assert.equal(zoomKey(key('0')), null);
  assert.equal(zoomKey(key('Escape')), null);
  assert.equal(zoomKey(key('_')), null, 'shift and - is not the minus key');
  assert.equal(zoomKey(null), null);
});

test('a modifier makes it the browser’s or the editor’s own shortcut, not a zoom', () => {
  assert.equal(zoomKey(key('+', { metaKey: true })), null, 'Cmd + is the page zoom');
  assert.equal(zoomKey(key('-', { ctrlKey: true })), null);
  assert.equal(zoomKey(key('+', { altKey: true })), null);
});

test('a key already handled is left alone', () => {
  assert.equal(zoomKey(key('+', { defaultPrevented: true })), null);
});

test('typed into a field, + and - are characters: an input, a textarea, a select, anything contenteditable', () => {
  for (const field of ['input', 'textarea', 'select', 'contenteditable']) {
    assert.equal(zoomKey(key('-', { target: inside(field) })), null, field);
    assert.ok(isTypingTarget(inside(field)), field);
  }

  assert.equal(isTypingTarget(inside(null)), false);
  assert.equal(isTypingTarget(null), false);
  assert.equal(isTypingTarget({}), false, 'no closest: a window or document');
  assert.equal(zoomKey(key('-', { target: null })), 'out', 'a key with no target element (the window) still counts');
});
