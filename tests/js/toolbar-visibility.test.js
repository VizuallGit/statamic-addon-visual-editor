import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PEEK_ATTR,
  hiddenToolbarCss,
  openToolbarTool,
  readHiddenTools,
  setToolbarToolShown,
  showAllToolbarTools,
  syncHiddenToolbarIcons,
  toolbarTools,
} from '../../resources/js/toolbar-visibility.js';
import { HEADER_TOOLBAR_ID, TOOLBAR_HIDDEN_KEY } from '../../resources/js/lib/ids.js';

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
function fakeWin({ stored = null, buttons = [], frames = {} } = {}) {
  const store = new Map(stored == null ? [] : [[TOOLBAR_HIDDEN_KEY, stored]]);
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
  const css = hiddenToolbarCss(['performance', 'pages']);

  assert.match(css, /#__sve-toolbar button\[data-tab="performance"\]:not\(\[data-sve-peek\]\)/);
  assert.match(css, /#__sve-frame-pages:not\(\[data-sve-peek\]\)\{display:none!important\}/);
  assert.equal(hiddenToolbarCss([]), '');
});

test('page settings and anything that is not a tab key never reach the sheet', () => {
  assert.equal(hiddenToolbarCss(['settings']), '');
  assert.equal(hiddenToolbarCss(['a"]{x}', 'Pages', '']), '');
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

  syncHiddenToolbarIcons(win);
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
