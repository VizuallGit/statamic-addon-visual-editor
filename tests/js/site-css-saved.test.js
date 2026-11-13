import { test } from 'node:test';
import assert from 'node:assert/strict';

import { SITE_CSS_SAVED, passSiteCssSavedDown } from '../../resources/js/lib/site-css-saved.js';

/**
 * Just enough window: listeners, dispatchEvent, its own CustomEvent, and a
 * document whose iframes are the windows given. `foreign` frames answer as a
 * frame of another origin does: contentDocument is null.
 */
function fakeWindow({ frames = [], foreign = [] } = {}) {
  const listeners = [];
  const heard = [];
  const win = {
    heard,
    listeners,
    CustomEvent: class {
      constructor(type, init) {
        this.type = type;
        this.detail = init?.detail;
        this.madeIn = win;
      }
    },
    addEventListener(type, fn) {
      listeners.push({ type, fn });
    },
    dispatchEvent(event) {
      heard.push(event);
      listeners.filter((l) => l.type === event.type).forEach((l) => l.fn(event));
    },
  };
  win.document = {
    querySelectorAll: (selector) =>
      selector === 'iframe'
        ? [
            ...frames.map((frame) => ({ contentDocument: frame.document, contentWindow: frame })),
            ...foreign.map((frame) => ({ contentDocument: null, contentWindow: frame })),
          ]
        : [],
  };

  return win;
}

test('a save heard in a window is told to each frame under it, and by a CP frame to its own frames', () => {
  const panel = fakeWindow();
  const overlay = fakeWindow({ frames: [panel] });
  const preview = fakeWindow();
  const top = fakeWindow({ frames: [overlay, preview] });

  // Every CP window runs addon.js; the preview is the site and does not.
  [top, overlay, panel].forEach(passSiteCssSavedDown);
  top.dispatchEvent(new top.CustomEvent(SITE_CSS_SAVED, { detail: { path: 'resources/css/site.css' } }));

  for (const [name, win] of Object.entries({ overlay, preview, panel })) {
    assert.equal(win.heard.length, 1, `${name} hears it once`);
    assert.equal(win.heard[0].type, SITE_CSS_SAVED);
    assert.deepEqual(win.heard[0].detail, { path: 'resources/css/site.css' });
    assert.equal(win.heard[0].madeIn, win, `${name} gets an event of its own window`);
  }
});

test('the news travels down only: a save in a frame is not told to the page above', () => {
  const overlay = fakeWindow();
  const top = fakeWindow({ frames: [overlay] });

  [top, overlay].forEach(passSiteCssSavedDown);
  overlay.dispatchEvent(new overlay.CustomEvent(SITE_CSS_SAVED, { detail: {} }));

  assert.equal(top.heard.length, 0);
});

test('a frame of another origin is left alone', () => {
  const elsewhere = fakeWindow();
  const top = fakeWindow({ foreign: [elsewhere] });

  passSiteCssSavedDown(top);
  top.dispatchEvent(new top.CustomEvent(SITE_CSS_SAVED, { detail: {} }));

  assert.equal(elsewhere.heard.length, 0);
});

test('the listener goes on the window it is given and on no other', () => {
  const overlay = fakeWindow();
  const top = fakeWindow({ frames: [overlay] });

  passSiteCssSavedDown(overlay);

  assert.equal(overlay.listeners.length, 1);
  assert.equal(top.listeners.length, 0, 'a listener on the page above would hold the frame after it is removed');
});
