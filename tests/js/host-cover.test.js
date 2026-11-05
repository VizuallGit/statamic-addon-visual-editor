/**
 * The cover the Control Panel host wears from evaluation until the editor is
 * back on screen (host-cover.js): only on a page of its own arriving with
 * `?live-preview=1`; down with a fade when `<html>` gains `sve-editing`, at
 * once when Statamic boots with the editor switched off, and after HOLD_MAX_MS
 * regardless.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HOLD_MAX_MS,
  coverHostUntilEditor,
  hostArrivesForEditor,
  pageColour,
} from '../../resources/js/host-cover.js';
import { HOST_COVER_ID } from '../../resources/js/lib/ids.js';

class El {
  constructor() {
    this.id = '';
    this.innerHTML = '';
    this.style = {};
    this.attrs = {};
    this.children = [];
    this.parent = null;
    this.classes = new Set();
    this.classList = {
      contains: (name) => this.classes.has(name),
      add: (name) => this.classes.add(name),
    };
  }

  setAttribute(name, value) {
    this.attrs[name] = value;
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  remove() {
    if (this.parent) {
      this.parent.children = this.parent.children.filter((child) => child !== this);
      this.parent = null;
    }
  }
}

/**
 * A window with the little the module touches: a document with a root and a
 * body, computed colours by element, timers that record their delays and run
 * only when told, a MutationObserver that is fired by hand, and Statamic's
 * `booting` with a config.
 */
function fakeWindow({ search = '?live-preview=1', embedded = false, colours = {}, sveEnabled = undefined } = {}) {
  const documentElement = new El();
  const body = new El();
  const timers = [];
  const booting = [];
  const win = {
    location: { search },
    document: { documentElement, body, createElement: () => new El() },
    getComputedStyle: (el) => ({ backgroundColor: colours.get?.(el) ?? 'rgba(0, 0, 0, 0)' }),
    setTimeout: (fn, ms) => {
      timers.push({ fn, ms, cleared: false });

      return timers.length - 1;
    },
    clearTimeout: (id) => {
      if (timers[id]) {
        timers[id].cleared = true;
      }
    },
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        win.observers.push(this);
        this.disconnected = false;
      }

      observe(target, options) {
        this.target = target;
        this.options = options;
      }

      disconnect() {
        this.disconnected = true;
      }
    },
    Statamic: {
      booting: (fn) => booting.push(fn),
      $config: { get: (key) => (key === 'sveEnabled' ? sveEnabled : undefined) },
    },
    observers: [],
    timers,
    booting,
    cover: () => body.children.find((child) => child.id === HOST_COVER_ID) ?? null,
    editorShown() {
      documentElement.classList.add('sve-editing');
      win.observers.forEach((observer) => observer.disconnected || observer.callback([]));
    },
    boot() {
      booting.forEach((fn) => fn());
    },
    runTimers(ms) {
      timers.filter((timer) => !timer.cleared && timer.ms === ms).forEach((timer) => timer.fn());
    },
  };

  win.self = win;
  win.parent = embedded ? {} : win;

  return win;
}

test('the host arriving with the Live Preview ask is covered; an embedded editor frame or a page without the ask is not', () => {
  assert.equal(hostArrivesForEditor(fakeWindow()), true);
  assert.equal(hostArrivesForEditor(fakeWindow({ embedded: true })), false);
  assert.equal(hostArrivesForEditor(fakeWindow({ search: '' })), false);
  assert.equal(hostArrivesForEditor(fakeWindow({ search: '?live-preview=0' })), false);

  assert.equal(coverHostUntilEditor(fakeWindow({ embedded: true })), null);
  assert.equal(coverHostUntilEditor(fakeWindow({ search: '?sve-panel=1' })), null);
});

test('the cover goes up at once, in the page colour, over everything, and swallows clicks', () => {
  const win = fakeWindow();
  const colours = new Map([[win.document.body, 'oklch(0.274 0.006 286.033)']]);

  win.getComputedStyle = (el) => ({ backgroundColor: colours.get(el) ?? 'rgba(0, 0, 0, 0)' });

  const cover = coverHostUntilEditor(win);

  assert.equal(win.cover(), cover);
  assert.match(cover.style.cssText, /position:fixed;inset:0;z-index:2147483647;pointer-events:auto;/);
  assert.match(cover.style.cssText, /background:oklch\(0\.274 0\.006 286\.033\);/);
  assert.equal(cover.attrs['aria-hidden'], 'true');
  assert.deepEqual(win.observers[0].options, { attributes: true, attributeFilter: ['class'] });
  assert.equal(win.observers[0].target, win.document.documentElement);
});

test('the colour is what CSS paints under the page: the body, else the root, else the white canvas', () => {
  const win = fakeWindow();
  const colours = new Map();

  win.getComputedStyle = (el) => ({ backgroundColor: colours.get(el) ?? 'rgba(0, 0, 0, 0)' });
  assert.equal(pageColour(win), '#fff');

  colours.set(win.document.documentElement, 'rgb(24, 24, 27)');
  assert.equal(pageColour(win), 'rgb(24, 24, 27)');

  colours.set(win.document.body, 'rgb(244, 244, 245)');
  assert.equal(pageColour(win), 'rgb(244, 244, 245)');
});

test('the editor showing (html.sve-editing) fades the cover out and lets clicks through from that frame; the hold is dropped', () => {
  const win = fakeWindow();
  const cover = coverHostUntilEditor(win);
  const hold = win.timers.find((timer) => timer.ms === HOLD_MAX_MS);

  // Another class on <html> (the overlay host's sve-morphing, the CP's own) is not the editor.
  win.observers[0].callback([]);
  assert.equal(win.cover(), cover);
  assert.equal(cover.style.opacity, undefined);

  win.editorShown();
  assert.equal(cover.style.opacity, '0');
  assert.equal(cover.style.pointerEvents, 'none');
  assert.equal(hold.cleared, true);
  assert.equal(win.observers[0].disconnected, true);
  assert.equal(win.cover(), cover, 'still in the document while it fades');

  win.runTimers(500);
  assert.equal(win.cover(), null);
});

test('the editor switched off for the site: Statamic boots, the cover is gone at once', () => {
  const win = fakeWindow({ sveEnabled: false });

  coverHostUntilEditor(win);
  win.boot();
  assert.equal(win.cover(), null);
  assert.equal(win.observers[0].disconnected, true);
});

test('the editor on: Statamic booting changes nothing; the cover waits for the editor', () => {
  const win = fakeWindow({ sveEnabled: true });
  const cover = coverHostUntilEditor(win);

  win.boot();
  assert.equal(win.cover(), cover);

  const unset = fakeWindow();
  const second = coverHostUntilEditor(unset);

  unset.boot();
  assert.equal(unset.cover(), second);
});

test('a cover that swallows clicks never depends on a later step: it lifts after HOLD_MAX_MS, after the overlay host has given up itself', () => {
  const win = fakeWindow();

  coverHostUntilEditor(win);
  assert.ok(HOLD_MAX_MS > 8000, 'after the overlay host failTimer (8 s)');
  win.runTimers(HOLD_MAX_MS);
  assert.equal(win.cover(), null);

  // Lifted once: the editor showing afterwards does not touch a removed cover.
  win.editorShown();
  assert.equal(win.cover(), null);
});
