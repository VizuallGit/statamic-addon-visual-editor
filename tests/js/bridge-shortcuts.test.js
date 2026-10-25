import test from 'node:test';
import assert from 'node:assert/strict';
import { bridgeState } from '../../resources/js/bridge/state.js';
import { createShortcutKeyHandler, installShortcuts, previewShortcuts, setShortcuts } from '../../resources/js/bridge/shortcuts.js';
import { MSG, SOURCE } from '../../resources/js/lib/protocol.js';

/** A preview window: its parent collects what is posted up. */
function fakePreview(mac = true) {
  const posted = [];
  const listeners = [];

  return {
    posted,
    navigator: { platform: mac ? 'MacIntel' : 'Win32' },
    location: { origin: 'http://site.test' },
    parent: { postMessage: (message, origin) => posted.push({ message, origin }) },
    addEventListener: (type, fn, capture) => listeners.push({ type, fn, capture }),
    listeners,
    press(init) {
      const event = {
        key: '',
        code: '',
        metaKey: false,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        repeat: false,
        isComposing: false,
        defaultPrevented: false,
        getModifierState: () => false,
        preventDefault() {
          this.defaultPrevented = true;
        },
        ...init,
      };

      listeners.filter((item) => item.type === 'keydown').forEach((item) => item.fn(event));

      return event.defaultPrevented;
    },
  };
}

test('a fresh preview listens in capture on the window and asks the CP for the list', () => {
  const win = fakePreview();

  installShortcuts(win);

  assert.deepEqual(win.listeners.map((item) => [item.type, item.capture]), [['keydown', true]]);
  assert.deepEqual(win.posted, [{ message: { source: SOURCE, type: MSG.SVE_SHORTCUTS_REQUEST }, origin: 'http://site.test' }]);
});

test('the list from the CP is kept clean; a press of one is kept from the browser and sent up, anything else is left alone', () => {
  const win = fakePreview();

  installShortcuts(win);
  win.posted.length = 0;
  setShortcuts({ combos: ['mod+g', 'Mod+Shift+X', 'none', 'g', 7, 'mod+s+'] });

  assert.deepEqual(previewShortcuts(), ['mod+g', 'mod+shift+x']);
  assert.equal(win.press({ key: 'g', code: 'KeyG', metaKey: true }), true, '⌘G: the browser does not get it');
  assert.equal(win.press({ key: 'X', code: 'KeyX', metaKey: true, shiftKey: true }), true);
  assert.equal(win.press({ key: 'p', code: 'KeyP', metaKey: true }), false, '⌘P runs nothing here: the browser keeps it');
  assert.equal(win.press({ key: 'g', code: 'KeyG' }), false, 'typing');
  assert.deepEqual(
    win.posted.map((item) => item.message),
    [
      { source: SOURCE, type: MSG.SVE_SHORTCUT, combo: 'mod+g' },
      { source: SOURCE, type: MSG.SVE_SHORTCUT, combo: 'mod+shift+x' },
    ]
  );
});

test('while an inline edit is open the keys are the text\'s: nothing is kept, nothing is sent', () => {
  const win = fakePreview();

  installShortcuts(win);
  win.posted.length = 0;
  setShortcuts({ combos: ['mod+b'] });
  bridgeState.editing = { el: {} };

  try {
    assert.equal(win.press({ key: 'b', code: 'KeyB', metaKey: true }), false);
    assert.equal(win.posted.length, 0);
  } finally {
    bridgeState.editing = null;
  }

  assert.equal(win.press({ key: 'b', code: 'KeyB', metaKey: true }), true, 'the edit over, ⌘B is the shortcut again');
});

test('a new list replaces the old whole; Windows reads Ctrl as mod', () => {
  const win = fakePreview(false);
  const onKeydown = createShortcutKeyHandler(win);

  setShortcuts({ combos: ['mod+g'] });
  setShortcuts({ combos: ['mod+m'] });

  assert.deepEqual(previewShortcuts(), ['mod+m']);

  const event = { key: 'm', code: 'KeyM', ctrlKey: true, metaKey: false, altKey: false, shiftKey: false, repeat: false, isComposing: false, defaultPrevented: false, getModifierState: () => false, preventDefault() { this.defaultPrevented = true; } };

  onKeydown(event);
  assert.equal(event.defaultPrevented, true);
  assert.equal(win.posted.at(-1).message.combo, 'mod+m');
});
