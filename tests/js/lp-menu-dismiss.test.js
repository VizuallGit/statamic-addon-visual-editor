import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindMenuDismiss } from '../../resources/js/lp-menu-dismiss.js';

// ── A window small enough to carry the three listeners ──────────────────

function listeners() {
  const bound = new Map();

  return {
    bound,
    addEventListener(type, fn) {
      bound.set(type, fn);
    },
    removeEventListener(type) {
      bound.delete(type);
    },
  };
}

function fakeWin() {
  const win = listeners();
  const doc = listeners();

  doc.getElementById = () => null;
  win.document = doc;

  return win;
}

/** An event target: `closest(selector)` says whether it is inside a recording recorder. */
function target({ recording = false } = {}) {
  return {
    closest: (selector) => (selector === '[data-sve-shortcut-recording]' && recording ? {} : null),
  };
}

function press(win, key, at) {
  const event = { key, target: at, prevented: false, preventDefault() { this.prevented = true; } };

  win.bound.get('keydown')(event);

  return event;
}

test('Esc dismisses the menu, and the key is taken', () => {
  const win = fakeWin();
  let dismissed = 0;

  bindMenuDismiss(win, () => false, () => (dismissed += 1));

  assert.equal(press(win, 'Escape', target()).prevented, true);
  assert.equal(dismissed, 1);
  assert.equal(press(win, 'a', target()).prevented, false, 'other keys are not the menu’s');
  assert.equal(dismissed, 1);
});

test('Esc while a shortcut is being recorded in the menu ends the recording, not the menu', () => {
  const win = fakeWin();
  let dismissed = 0;

  bindMenuDismiss(win, () => false, () => (dismissed += 1));

  const event = press(win, 'Escape', target({ recording: true }));

  assert.equal(dismissed, 0, 'the menu stays open');
  assert.equal(event.prevented, false, 'the recorder (ShortcutInput.vue) takes the key itself');

  // Recording over, Esc is the menu’s again.
  press(win, 'Escape', target());
  assert.equal(dismissed, 1);
});

test('a key from the preview document, with no element to ask, still dismisses', () => {
  const win = fakeWin();
  let dismissed = 0;

  bindMenuDismiss(win, () => false, () => (dismissed += 1));
  press(win, 'Escape', {});
  assert.equal(dismissed, 1);
});

test('unbind takes every listener off again', () => {
  const win = fakeWin();
  const unbind = bindMenuDismiss(win, () => false, () => {});

  assert.deepEqual([...win.bound.keys()], ['keydown']);
  assert.deepEqual([...win.document.bound.keys()], ['pointerdown']);
  unbind();
  assert.equal(win.bound.size, 0);
  assert.equal(win.document.bound.size, 0);
});
