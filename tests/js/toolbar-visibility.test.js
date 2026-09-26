import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PEEK_ATTR,
  openToolbarTool,
  readHiddenTools,
  readUserPresets,
  setToolbarOrder,
  setToolbarToolShown,
  showAllToolbarTools,
  syncToolbarLayout,
  toolbarCss,
  toolbarTools,
  writeUserPresets,
} from '../../resources/js/toolbar-visibility.js';
import { HEADER_TOOLBAR_ID, TOOLBAR_HIDDEN_KEY, TOOLBAR_ORDER_KEY, TOOLBAR_PRESETS_KEY } from '../../resources/js/lib/ids.js';

/** A button the way header-toolbar.js leaves it: data-tab, title, an svg, aria-pressed. */
function fakeButton(tab, { title = tab, pressed = false, display = '' } = {}) {
  const attrs = new Map([['aria-pressed', pressed ? 'true' : 'false']]);

  return {
    dataset: { tab },
    title,
    style: { display },
    clicks: 0,
    click() {
      this.clicks += 1;
    },
    getAttribute: (name) => (attrs.has(name) ? attrs.get(name) : null),
    setAttribute: (name, value) => attrs.set(name, String(value)),
    removeAttribute: (name) => attrs.delete(name),
    hasAttribute: (name) => attrs.has(name),
    querySelector: (sel) => (sel === 'svg' ? { outerHTML: `<svg data-icon="${tab}"></svg>` } : null),
  };
}

/** Just enough window for chrome-prefs.js, the sheet and the icon row. */
function fakeWin({ stored = null, order = null, buttons = [], frames = {} } = {}) {
  const store = new Map([
    ...(stored == null ? [] : [[TOOLBAR_HIDDEN_KEY, stored]]),
    ...(order == null ? [] : [[TOOLBAR_ORDER_KEY, order]]),
  ]);
  const head = new Map();
  const bar = {
    querySelectorAll: () => buttons,
    querySelector: (sel) => buttons.find((btn) => sel === `button[data-tab="${btn.dataset.tab}"]`) || null,
  };
  const observers = [];

  class FakeObserver {
    constructor(callback) {
      this.callback = callback;
      this.connected = true;
      observers.push(this);
    }

    observe() {}

    disconnect() {
      this.connected = false;
    }
  }

  return {
    store,
    observers,
    MutationObserver: FakeObserver,
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    Statamic: { $config: { get: () => undefined } },
    setTimeout: () => 1,
    clearTimeout: () => {},
    document: {
      head: {
        appendChild(el) {
          el.remove = () => head.delete(el.id);
          head.set(el.id, el);
        },
      },
      createElement: () => ({ id: '', textContent: '' }),
      getElementById: (id) => {
        if (id === HEADER_TOOLBAR_ID) {
          return buttons.length ? bar : null;
        }

        return head.get(id) || frames[id] || null;
      },
    },
    sheet() {
      return [...head.values()][0]?.textContent ?? null;
    },
  };
}

test('the sheet hides a plain icon by its button and a framed one by its frame, unless it is peeking', () => {
  const css = toolbarCss({ hidden: ['performance', 'pages'] });

  assert.match(css, /#__sve-toolbar button\[data-tab="performance"\]:not\(\[data-sve-peek\]\)/);
  assert.match(css, /#__sve-frame-pages:not\(\[data-sve-peek\]\)\{display:none!important\}/);
  assert.equal(toolbarCss({ hidden: [] }), '');
  assert.equal(toolbarCss(), '');
});

test('page settings and anything that is not a tab key never reach the sheet', () => {
  assert.equal(toolbarCss({ hidden: ['settings'], order: ['settings'] }), '');
  assert.equal(toolbarCss({ hidden: ['a"]{x}', 'Pages', ''], order: ['a"]{x}'] }), '');
});

test('the stored list is read back clean', () => {
  assert.deepEqual(readHiddenTools(fakeWin({ stored: '["edits","edits","settings",3,"ai"]' })), ['edits', 'ai']);
  assert.deepEqual(readHiddenTools(fakeWin({ stored: 'not json' })), []);
  assert.deepEqual(readHiddenTools(fakeWin({ stored: '{"edits":true}' })), []);
  assert.deepEqual(readHiddenTools(fakeWin()), []);
});

test('hiding and showing writes the list and the sheet; the last one shown clears both', () => {
  const win = fakeWin();

  setToolbarToolShown(win, 'performance', false);
  setToolbarToolShown(win, 'edits', false);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["performance","edits"]');
  assert.match(win.sheet(), /data-tab="edits"/);

  setToolbarToolShown(win, 'performance', true);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["edits"]');
  assert.doesNotMatch(win.sheet(), /performance/);

  setToolbarToolShown(win, 'settings', false);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["edits"]');

  showAllToolbarTools(win);
  assert.equal(win.store.has(TOOLBAR_HIDDEN_KEY), false);
  assert.equal(win.sheet(), null);
});

test('a pass with nothing stored adds no sheet', () => {
  const win = fakeWin();

  syncToolbarLayout(win);
  assert.equal(win.sheet(), null);
});

test('the list is the icon row itself, without page settings', () => {
  const win = fakeWin({
    stored: '["performance"]',
    buttons: [
      fakeButton('settings'),
      fakeButton('pages', { title: 'Pages', pressed: true }),
      fakeButton('sections', { title: 'Patterns', display: 'none' }),
      fakeButton('performance', { title: 'Performance' }),
    ],
  });

  assert.deepEqual(
    toolbarTools(win).map(({ key, label, shown, open, here }) => ({ key, label, shown, open, here })),
    [
      { key: 'pages', label: 'Pages', shown: true, open: true, here: true },
      { key: 'sections', label: 'Patterns', shown: true, open: false, here: false },
      { key: 'performance', label: 'Performance', shown: false, open: false, here: true },
    ]
  );
  assert.equal(toolbarTools(win)[0].icon, '<svg data-icon="pages"></svg>');
  assert.deepEqual(toolbarTools(fakeWin()), []);
});

test('opening a hidden tool presses its button and shows it until it has been open and closes', () => {
  const pages = fakeButton('pages');
  const frame = fakeButton('frame');
  const win = fakeWin({ stored: '["pages"]', buttons: [pages], frames: { '__sve-frame-pages': frame } });

  assert.equal(openToolbarTool(win, 'pages'), true);
  assert.equal(pages.clicks, 1);
  assert.equal(pages.hasAttribute(PEEK_ATTR), true);
  assert.equal(frame.hasAttribute(PEEK_ATTR), true);

  const [observer] = win.observers;

  // A pass before the tool is open does not end the peek.
  observer.callback();
  assert.equal(pages.hasAttribute(PEEK_ATTR), true);

  pages.setAttribute('aria-pressed', 'true');
  observer.callback();
  pages.setAttribute('aria-pressed', 'false');
  observer.callback();
  assert.equal(pages.hasAttribute(PEEK_ATTR), false);
  assert.equal(frame.hasAttribute(PEEK_ATTR), false);
  assert.equal(observer.connected, false);
});

test('a shown tool, or one already open, is just pressed', () => {
  const shown = fakeButton('performance');
  const open = fakeButton('edits', { pressed: true });
  const win = fakeWin({ stored: '["edits"]', buttons: [shown, open] });

  openToolbarTool(win, 'performance');
  openToolbarTool(win, 'edits');
  assert.equal(shown.clicks, 1);
  assert.equal(open.clicks, 1);
  assert.equal(shown.hasAttribute(PEEK_ATTR), false);
  assert.equal(open.hasAttribute(PEEK_ATTR), false);
  assert.equal(win.observers.length, 0);
  assert.equal(openToolbarTool(win, 'nope'), false);
});

test('an order pins page settings first and places each icon, frames and all', () => {
  const css = toolbarCss({ order: ['comments', 'pages', 'settings', 'performance'] });

  assert.match(css, /#__sve-toolbar>button\[data-tab="settings"\]\{order:-1\}/);
  assert.match(css, /#__sve-toolbar>button\[data-tab="comments"\],#__sve-toolbar>#__sve-frame-comments\{order:1\}/);
  assert.match(css, /#__sve-toolbar>#__sve-frame-pages\{order:2\}/);
  assert.match(css, /data-tab="performance"\],#__sve-toolbar>#__sve-frame-performance\{order:3\}/);
  assert.doesNotMatch(css, /data-tab="settings"\],/);
});

test('setting an order writes it and the sheet; an empty one goes back to the drawn order', () => {
  const win = fakeWin();

  setToolbarOrder(win, ['edits', 'pages', 'edits']);
  assert.equal(win.store.get(TOOLBAR_ORDER_KEY), '["edits","pages"]');
  assert.match(win.sheet(), /data-tab="edits"\],#__sve-toolbar>#__sve-frame-edits\{order:1\}/);

  setToolbarOrder(win, []);
  assert.equal(win.store.has(TOOLBAR_ORDER_KEY), false);
  assert.equal(win.sheet(), null);
});

test('the list follows the order; a tool the order does not know comes after', () => {
  const win = fakeWin({
    order: '["performance","pages"]',
    buttons: [fakeButton('settings'), fakeButton('pages'), fakeButton('globals'), fakeButton('performance')],
  });

  assert.deepEqual(toolbarTools(win).map((tool) => tool.key), ['performance', 'pages', 'globals']);
});

test("a user's own presets are stored clean", () => {
  const win = fakeWin();

  writeUserPresets(win, [
    { id: 'u-abc', name: '  Kunde-demo  ', tools: ['pages', 'pages', 'x"y'], dock: true },
    { id: 'developer', name: 'Not mine', tools: [] },
    { id: 'u-def', name: '   ', tools: [] },
  ]);
  assert.deepEqual(readUserPresets(win), [{ id: 'u-abc', name: 'Kunde-demo', tools: ['pages'], dock: true }]);

  writeUserPresets(win, []);
  assert.equal(win.store.has(TOOLBAR_PRESETS_KEY), false);
  assert.deepEqual(readUserPresets(win), []);
});
