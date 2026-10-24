import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PEEK_ATTR,
  addToolbarToolToGroup,
  addToolbarToolToNewGroup,
  deleteToolbarGroup,
  moveToolbarGroup,
  moveToolbarTool,
  moveToolbarToolBefore,
  moveToolbarToolToNewGroup,
  openToolbarTool,
  placeToolbarButton,
  readHiddenTools,
  readPaneChoices,
  readPickedPreset,
  readToolbarGroups,
  readUserPresets,
  renameToolbarGroup,
  resetToolbarGroups,
  setToolbarToolShown,
  showAllToolbarTools,
  syncToolbarLayout,
  toolbarCss,
  toolbarGrouped,
  toolbarGroups,
  toolbarTools,
  writePaneChoices,
  writePickedPreset,
  writeUserPresets,
  toolbarLayout,
} from '../../resources/js/toolbar-visibility.js';
import {
  HEADER_TOOLBAR_ID,
  TOOLBAR_ADD_ATTR,
  TOOLBAR_GRIP_ATTR,
  TOOLBAR_GROUP_ATTR,
  TOOLBAR_GROUPS_KEY,
  TOOLBAR_HIDDEN_KEY,
  TOOLBAR_NEW_GROUP_ATTR,
  TOOLBAR_ORDER_KEY,
  TOOLBAR_PRESET_PANES_KEY,
  TOOLBAR_PRESETS_KEY,
} from '../../resources/js/lib/ids.js';

/** The sheet with nothing hidden: the frame — groups, Page settings' box, the «+». */
const FRAME = toolbarCss();

// ── A DOM small enough to hold the icon row ─────────────────────────────
//
// Just the moves toolbar-visibility.js makes and the few selectors it asks
// with, so the group sync can be watched node for node without a browser.

let moves = 0;

class Node {
  constructor(tag, { id = '', tab = '', title = '', display = '' } = {}) {
    this.tagName = tag;
    this.id = id;
    this.dataset = tab ? { tab } : {};
    this.title = title;
    this.style = { display };
    this.attrs = new Map();
    this.children = [];
    this.parentElement = null;
    this.clicks = 0;
    this.type = '';
    this.innerHTML = '';
  }

  // Attributes; `title` is both the property and the attribute, as in a browser.
  getAttribute(name) {
    if (name === 'title') {
      return this.title || null;
    }

    return this.attrs.has(name) ? this.attrs.get(name) : null;
  }

  setAttribute(name, value) {
    if (name === 'title') {
      this.title = String(value);
    } else {
      this.attrs.set(name, String(value));
    }
  }

  removeAttribute(name) {
    if (name === 'title') {
      this.title = '';
    } else {
      this.attrs.delete(name);
    }
  }

  hasAttribute(name) {
    return name === 'title' ? !!this.title : this.attrs.has(name);
  }

  // Tree
  get firstElementChild() {
    return this.children[0] || null;
  }

  get firstChild() {
    return this.firstElementChild;
  }

  get lastElementChild() {
    return this.children[this.children.length - 1] || null;
  }

  get previousElementSibling() {
    const list = this.parentElement?.children || [];

    return list[list.indexOf(this) - 1] || null;
  }

  get nextElementSibling() {
    const list = this.parentElement?.children || [];

    return list[list.indexOf(this) + 1] || null;
  }

  remove() {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter((node) => node !== this);
      this.parentElement = null;
    }
  }

  insertBefore(node, ref) {
    moves += 1;
    node.remove();
    node.parentElement = this;

    const at = ref ? this.children.indexOf(ref) : -1;

    if (at === -1) {
      this.children.push(node);
    } else {
      this.children.splice(at, 0, node);
    }
  }

  appendChild(node) {
    this.insertBefore(node, null);
  }

  prepend(node) {
    this.insertBefore(node, this.firstElementChild);
  }

  after(node) {
    this.parentElement.insertBefore(node, this.nextElementSibling);
  }

  contains(node) {
    return node === this || this.children.some((child) => child.contains(node));
  }

  all() {
    return this.children.flatMap((child) => [child, ...child.all()]);
  }

  // Selectors — the handful the module asks with.
  querySelectorAll(sel) {
    const scoped = sel.startsWith(':scope>');
    const pool = scoped ? this.children : this.all();
    const rest = scoped ? sel.slice(':scope>'.length) : sel;
    let m;

    if ((m = rest.match(/^button\[data-tab="([^"]+)"\]$/))) {
      return pool.filter((node) => node.tagName === 'button' && node.dataset.tab === m[1]);
    }

    if (rest === 'button[data-tab]') {
      return pool.filter((node) => node.tagName === 'button' && node.dataset.tab);
    }

    if ((m = rest.match(/^#(.+)$/))) {
      return pool.filter((node) => node.id === m[1]);
    }

    if ((m = rest.match(/^\[([a-z-]+)="([^"]+)"\]$/))) {
      return pool.filter((node) => node.getAttribute(m[1]) === m[2]);
    }

    if ((m = rest.match(/^\[([a-z-]+)\]$/))) {
      return pool.filter((node) => node.hasAttribute(m[1]));
    }

    if (rest === 'svg') {
      return this.dataset.tab ? [{ outerHTML: `<svg data-icon="${this.dataset.tab}"></svg>` }] : [];
    }

    throw new Error(`fake DOM: selector not supported: ${sel}`);
  }

  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }

  click() {
    this.clicks += 1;
  }
}

/** A button the way header-toolbar.js leaves it: data-tab, title, an svg, aria-pressed. */
function fakeButton(tab, { title = tab, pressed = false, display = '' } = {}) {
  const btn = new Node('button', { tab, title, display });

  btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');

  return btn;
}

/** A framed tool: the frame holds the button (and would hold its control). */
function fakeFrame(tab, options = {}) {
  const frame = new Node('div', { id: `__sve-frame-${tab}` });

  frame.appendChild(fakeButton(tab, options));

  return frame;
}

/** Just enough window for chrome-prefs.js, the sheet and the icon row. */
function fakeWin({ stored = null, order = null, groups = null, row = null } = {}) {
  const store = new Map([
    ...(stored == null ? [] : [[TOOLBAR_HIDDEN_KEY, stored]]),
    ...(order == null ? [] : [[TOOLBAR_ORDER_KEY, order]]),
    ...(groups == null ? [] : [[TOOLBAR_GROUPS_KEY, groups]]),
  ]);
  const head = new Map();
  const bar = row ? new Node('div', { id: HEADER_TOOLBAR_ID }) : null;
  const observers = [];

  (row || []).forEach((node) => bar.appendChild(node));
  moves = 0;

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
    bar,
    MutationObserver: FakeObserver,
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    Statamic: { $config: { get: (key) => (key === 'sveStrings' ? { toolbar_add_tip: 'Add a tool' } : undefined) } },
    setTimeout: () => 1,
    clearTimeout: () => {},
    document: {
      head: {
        appendChild(el) {
          el.remove = () => head.delete(el.id);
          head.set(el.id, el);
        },
      },
      createElement: (tag) => (tag === 'style' ? { id: '', textContent: '' } : new Node(tag)),
      getElementById: (id) => {
        if (id === HEADER_TOOLBAR_ID) {
          return bar;
        }

        return head.get(id) || bar?.querySelector(`#${id}`) || null;
      },
    },
    sheet() {
      return [...head.values()][0]?.textContent ?? null;
    },
  };
}

/** The row as a picture: `settings [g-a: code, ⠿, +] [g-b: pages, ⠿, +] (+)` — ⠿ the grip, (+) the new-group square. */
function picture(bar) {
  const inBox = (child) => {
    if (child.hasAttribute(TOOLBAR_ADD_ATTR)) {
      return '+';
    }

    return child.hasAttribute(TOOLBAR_GRIP_ATTR) ? '⠿' : child.dataset.tab || child.id.replace('__sve-frame-', '');
  };

  return bar.children
    .map((node) => {
      if (node.hasAttribute(TOOLBAR_GROUP_ATTR)) {
        return `[${node.getAttribute(TOOLBAR_GROUP_ATTR)}: ${node.children.map(inBox).join(', ')}]`;
      }

      return node.hasAttribute(TOOLBAR_NEW_GROUP_ATTR) ? '(+)' : node.dataset.tab || node.id;
    })
    .join(' ');
}

const row = () => [fakeButton('settings'), fakeFrame('pages', { title: 'Pages' }), fakeButton('sections', { title: 'Patterns' }), fakeButton('performance'), fakeButton('code')];

// ── The sheet ───────────────────────────────────────────────────────────

test('the sheet hides a plain icon by its button and a framed one by its frame, unless it is peeking', () => {
  const css = toolbarCss({ hidden: ['performance', 'pages'] });

  assert.match(css, /#__sve-toolbar button\[data-tab="performance"\]:not\(\[data-sve-peek\]\)/);
  assert.match(css, /#__sve-frame-pages:not\(\[data-sve-peek\]\)\{display:none!important\}/);
  // A group with nothing left to see goes too — unless one of its tools peeks.
  assert.match(css, /\[data-sve-toolbar-group\]:not\(:has\([^)]*\[data-sve-peek\][^}]*:not\(\[data-tab="performance"\]\):not\(\[data-tab="pages"\]\)[^}]*:not\(#__sve-frame-performance\):not\(#__sve-frame-pages\)\)\)\{display:none!important\}/);
  assert.match(toolbarCss({ hidden: [] }), /\[data-sve-toolbar-group\]:not\(:has\(/);
  assert.equal(toolbarCss({ hidden: [] }), FRAME);
  assert.equal(toolbarCss(), FRAME);
});

test('page settings and anything that is not a tab key never reach the sheet', () => {
  assert.equal(toolbarCss({ hidden: ['settings'] }), FRAME);
  assert.equal(toolbarCss({ hidden: ['a"]{x}', 'Pages', ''] }), FRAME);
});

test('the frame: a transparent row, Page settings as a full square of its own, each group its own surface with a «+» at its edge', () => {
  assert.match(FRAME, /#__sve-toolbar\{position:relative;background:transparent!important;padding:0!important;gap:8px!important\}/);
  assert.match(FRAME, /button\[data-tab="settings"\]\{flex-shrink:0;width:32px!important;height:32px!important;margin:0!important;border-radius:\.5rem!important;opacity:1!important\}/);
  assert.match(FRAME, /\[data-tab="settings"\]:not\(\[aria-pressed="true"\]\)\{background:rgba\(128,128,128,\.16\)!important\}/);
  assert.match(FRAME, /#__sve-toolbar>\[data-sve-toolbar-group\]\{position:relative;display:inline-flex;[^}]*height:32px;padding:5px;gap:4px;border-radius:\.5rem;background:rgba\(128,128,128,\.16\)\}/);
  assert.match(FRAME, /\[data-sve-toolbar-group\]>\[data-sve-toolbar-add\]\{position:absolute;[^}]*right:-\.5rem;[^}]*opacity:0;pointer-events:none/);
  assert.match(FRAME, /\[data-sve-toolbar-group\]:hover>\[data-sve-toolbar-add\],[^{]*\{opacity:1;pointer-events:auto\}/);
  assert.doesNotMatch(FRAME, /[{;]order:|::before/);
});

test('the frame: a grip on each group\'s top-left corner, shown on hover only where there is a second group', () => {
  assert.match(FRAME, /\[data-sve-toolbar-group\]>\[data-sve-toolbar-group-grip\]\{position:absolute;top:-\.375rem;left:-\.375rem;width:1rem;height:1rem;[^}]*cursor:grab;[^}]*opacity:0;pointer-events:none/);
  assert.match(FRAME, /#__sve-toolbar:has\(>\[data-sve-toolbar-group\]~\[data-sve-toolbar-group\]\)>\[data-sve-toolbar-group\]:hover>\[data-sve-toolbar-group-grip\],[^{]*\{opacity:1;pointer-events:auto\}/);
});

test('the frame: the new-group square right of the row, out of its flow — a group\'s height and surface, 1:1 — shown on hover of the row and while a tool is dragged', () => {
  assert.match(FRAME, /#__sve-toolbar>\[data-sve-toolbar-new-group\]\{position:absolute;top:0;left:100%;[^}]*height:32px;padding-left:8px;opacity:0;pointer-events:none/);
  assert.match(FRAME, /#__sve-toolbar:hover>\[data-sve-toolbar-new-group\],#__sve-toolbar\[data-sve-dragging\]>\[data-sve-toolbar-new-group\],[^{]*\{opacity:1;pointer-events:auto\}/);
  assert.match(FRAME, /\[data-sve-toolbar-new-group\]>button\{[^}]*width:32px;height:32px;[^}]*border-radius:\.5rem;[^}]*background:rgba\(128,128,128,\.16\)\}/);
});

// ── Hidden ──────────────────────────────────────────────────────────────

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
  assert.match(win.sheet(), /button\[data-tab="edits"\]:not/);

  setToolbarToolShown(win, 'performance', true);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["edits"]');
  assert.doesNotMatch(win.sheet(), /performance/);

  setToolbarToolShown(win, 'settings', false);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["edits"]');

  showAllToolbarTools(win);
  assert.equal(win.store.has(TOOLBAR_HIDDEN_KEY), false);
  assert.equal(win.sheet(), FRAME);
});

test('a pass with nothing stored and no row writes only the frame', () => {
  const win = fakeWin();

  syncToolbarLayout(win);
  assert.equal(win.sheet(), FRAME);
});

// ── Groups: storage ─────────────────────────────────────────────────────

test('the groups are read back clean; the old flat order is carried over once, as one group', () => {
  const win = fakeWin({ order: '["performance","pages","settings","pages"]' });

  assert.deepEqual(readToolbarGroups(win), [{ id: 'g-default', name: '', tools: ['performance', 'pages'] }]);
  assert.equal(win.store.has(TOOLBAR_ORDER_KEY), false);
  assert.equal(win.store.get(TOOLBAR_GROUPS_KEY), '[{"id":"g-default","name":"","tools":["performance","pages"]}]');
  assert.equal(toolbarGrouped(win), true);

  assert.deepEqual(readToolbarGroups(fakeWin({ groups: 'not json' })), []);
  assert.deepEqual(readToolbarGroups(fakeWin({ groups: '[{"id":"bad","tools":["ai"]}]' })), []);
  assert.deepEqual(readToolbarGroups(fakeWin()), []);
  assert.equal(toolbarGrouped(fakeWin()), false);
});

// ── Groups: the row ─────────────────────────────────────────────────────

test('with nothing stored the row is one group in the default order, Page settings in front', () => {
  const win = fakeWin({ row: row() });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-default: pages, sections, performance, code, ⠿, +] (+)');
  assert.equal(win.store.has(TOOLBAR_GROUPS_KEY), false);

  const plus = win.bar.querySelector(`[${TOOLBAR_ADD_ATTR}]`);

  assert.equal(plus.getAttribute(TOOLBAR_ADD_ATTR), 'g-default');
  assert.equal(plus.title, 'Add a tool');
});

test('stored groups place the tools, frames and all; a tool no group knows joins the last group; a second pass moves nothing', () => {
  const win = fakeWin({
    groups: '[{"id":"g-a","name":"Code","tools":["code"]},{"id":"g-b","name":"","tools":["pages"]}]',
    row: row(),
  });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-a: code, ⠿, +] [g-b: pages, sections, performance, ⠿, +] (+)');
  assert.equal(win.bar.children[1].title, '', 'the group name is not a tooltip on the box');
  assert.equal(win.bar.children[2].title, '');

  moves = 0;
  syncToolbarLayout(win);
  syncToolbarLayout(win);
  assert.equal(moves, 0);
});

test('a button a pass has just made is placed, not left at the end of the row', () => {
  const win = fakeWin({ groups: '[{"id":"g-a","tools":["code"]},{"id":"g-b","tools":["pages","ai"]}]', row: row() });

  syncToolbarLayout(win);
  placeToolbarButton(win, fakeButton('ai'));
  assert.equal(picture(win.bar), 'settings [g-a: code, ⠿, +] [g-b: pages, ai, sections, performance, ⠿, +] (+)');

  // Already in the row and in place: nothing moves.
  moves = 0;
  placeToolbarButton(win, win.bar.querySelector('button[data-tab="ai"]'));
  assert.equal(moves, 0);
});

test('the list is the row itself, group after group, without page settings', () => {
  const win = fakeWin({ stored: '["performance"]', groups: '[{"id":"g-a","tools":["code"]}]', row: row() });

  win.bar.querySelector('button[data-tab="pages"]').setAttribute('aria-pressed', 'true');
  win.bar.querySelector('button[data-tab="sections"]').style.display = 'none';
  syncToolbarLayout(win);

  assert.deepEqual(
    toolbarTools(win).map(({ key, label, shown, open, here }) => ({ key, label, shown, open, here })),
    [
      { key: 'code', label: 'code', shown: true, open: false, here: true },
      { key: 'pages', label: 'Pages', shown: true, open: true, here: true },
      { key: 'sections', label: 'Patterns', shown: true, open: false, here: false },
      { key: 'performance', label: 'performance', shown: false, open: false, here: true },
    ]
  );
  assert.equal(toolbarTools(win)[1].icon, '<svg data-icon="pages"></svg>');
  // The tools no group knows join the last group there is.
  assert.deepEqual(
    toolbarGroups(win).map((group) => ({ id: group.id, name: group.name, keys: group.tools.map((tool) => tool.key) })),
    [{ id: 'g-a', name: '', keys: ['code', 'pages', 'sections', 'performance'] }]
  );
  assert.deepEqual(toolbarTools(fakeWin()), []);
});

test('moving a tool stores the groups and redraws the row; the group it empties goes', () => {
  const win = fakeWin({ row: row() });

  syncToolbarLayout(win);
  moveToolbarTool(win, 'code', 'g-default', 0);
  assert.equal(picture(win.bar), 'settings [g-default: code, pages, sections, performance, ⠿, +] (+)');

  const id = moveToolbarToolToNewGroup(win, 'performance', 1, '  Speed  ');

  assert.match(id, /^g-[a-z0-9]+$/);
  assert.equal(picture(win.bar), `settings [g-default: code, pages, sections, ⠿, +] [${id}: performance, ⠿, +] (+)`);
  assert.equal(toolbarLayout(win)[1].name, 'Speed', 'the name is stored, trimmed');
  assert.equal(win.bar.children[2].title, '', 'and not shown as a tooltip on the box');

  moveToolbarToolBefore(win, 'code', id, 'performance');
  assert.equal(picture(win.bar), `settings [g-default: pages, sections, ⠿, +] [${id}: code, performance, ⠿, +] (+)`);

  moveToolbarToolBefore(win, 'pages', id, null);
  assert.equal(picture(win.bar), `settings [g-default: sections, ⠿, +] [${id}: code, performance, pages, ⠿, +] (+)`);

  moveToolbarToolBefore(win, 'sections', id, 'code');
  assert.equal(picture(win.bar), `settings [${id}: sections, code, performance, pages, ⠿, +] (+)`);
  assert.deepEqual(JSON.parse(win.store.get(TOOLBAR_GROUPS_KEY)), [{ id, name: 'Speed', tools: ['sections', 'code', 'performance', 'pages'] }]);
});

test('the «+» puts a tool at the end of the group and shows it', () => {
  const win = fakeWin({ stored: '["code"]', groups: '[{"id":"g-a","tools":["pages"]},{"id":"g-b","tools":["sections"]}]', row: row() });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-a: pages, ⠿, +] [g-b: sections, performance, code, ⠿, +] (+)');

  addToolbarToolToGroup(win, 'code', 'g-a');
  assert.equal(picture(win.bar), 'settings [g-a: pages, code, ⠿, +] [g-b: sections, performance, ⠿, +] (+)');
  assert.equal(win.store.has(TOOLBAR_HIDDEN_KEY), false);
});

test('each box carries a grip before its «+»; the new-group square stands after the last box, and goes when there is no group', () => {
  const win = fakeWin({ groups: '[{"id":"g-a","tools":["code"]},{"id":"g-b","tools":["pages"]}]', row: row() });

  syncToolbarLayout(win);

  const grip = win.bar.querySelector(`[${TOOLBAR_GRIP_ATTR}]`);
  const square = win.bar.querySelector(`:scope>[${TOOLBAR_NEW_GROUP_ATTR}]`);

  assert.equal(grip.tagName, 'button');
  assert.equal(grip.type, 'button');
  assert.equal(grip.title, 'lp_settings_toolbar_group_move', 'Move group — the key, as the fake window has no string for it');
  assert.equal(win.bar.lastElementChild, square);
  assert.equal(square.firstElementChild.tagName, 'button');
  assert.equal(square.firstElementChild.getAttribute('aria-label'), 'toolbar_drag_new_group');

  const bare = fakeWin({ row: [fakeButton('settings')] });

  syncToolbarLayout(bare);
  assert.equal(picture(bare.bar), 'settings');
});

test('a group moved by its grip goes to its new place; the square stays last; a second pass moves nothing', () => {
  const win = fakeWin({ groups: '[{"id":"g-a","tools":["code"]},{"id":"g-b","tools":["pages"]},{"id":"g-c","tools":["sections"]}]', row: row() });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-a: code, ⠿, +] [g-b: pages, ⠿, +] [g-c: sections, performance, ⠿, +] (+)');

  moveToolbarGroup(win, 'g-c', 0);
  assert.equal(picture(win.bar), 'settings [g-c: sections, performance, ⠿, +] [g-a: code, ⠿, +] [g-b: pages, ⠿, +] (+)');
  assert.deepEqual(JSON.parse(win.store.get(TOOLBAR_GROUPS_KEY)).map((group) => group.id), ['g-c', 'g-a', 'g-b']);

  moveToolbarGroup(win, 'g-c', 2);
  assert.equal(picture(win.bar), 'settings [g-a: code, ⠿, +] [g-b: pages, ⠿, +] [g-c: sections, performance, ⠿, +] (+)');

  moves = 0;
  syncToolbarLayout(win);
  assert.equal(moves, 0);
});

test('the new-group square starts a group of its own after the last with the tool picked — a hidden one shown, one from a group moved out, the group it empties gone', () => {
  const win = fakeWin({ stored: '["code"]', groups: '[{"id":"g-a","tools":["pages"]},{"id":"g-b","tools":["sections","performance"]}]', row: row() });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-a: pages, ⠿, +] [g-b: sections, performance, code, ⠿, +] (+)');

  const hiddenOne = addToolbarToolToNewGroup(win, 'code');

  assert.match(hiddenOne, /^g-[a-z0-9]+$/);
  assert.equal(picture(win.bar), `settings [g-a: pages, ⠿, +] [g-b: sections, performance, ⠿, +] [${hiddenOne}: code, ⠿, +] (+)`);
  assert.equal(win.store.has(TOOLBAR_HIDDEN_KEY), false, 'and shown');

  const fromGroup = addToolbarToolToNewGroup(win, 'pages');

  assert.equal(picture(win.bar), `settings [g-b: sections, performance, ⠿, +] [${hiddenOne}: code, ⠿, +] [${fromGroup}: pages, ⠿, +] (+)`);
  assert.equal(JSON.parse(win.store.get(TOOLBAR_GROUPS_KEY)).some((group) => group.id === 'g-a'), false, 'the group it emptied is gone');
  assert.equal(addToolbarToolToNewGroup(win, 'x"y'), '', 'not a tool: nothing');
});

test('a group renamed keeps its name without a tooltip on the box; deleted, its tools join the group beside it; reset is one group again', () => {
  const win = fakeWin({ groups: '[{"id":"g-a","tools":["code"]},{"id":"g-b","tools":["pages"]}]', row: row() });

  syncToolbarLayout(win);
  renameToolbarGroup(win, 'g-a', ' Kode ');
  assert.equal(toolbarLayout(win)[0].name, 'Kode');
  assert.equal(win.bar.children[1].title, '', 'no tooltip on the box');

  deleteToolbarGroup(win, 'g-b');
  assert.equal(picture(win.bar), 'settings [g-a: code, pages, sections, performance, ⠿, +] (+)');

  deleteToolbarGroup(win, 'g-a');
  assert.equal(picture(win.bar), 'settings [g-a: code, pages, sections, performance, ⠿, +] (+)');

  resetToolbarGroups(win);
  assert.equal(win.store.has(TOOLBAR_GROUPS_KEY), false);
  assert.equal(picture(win.bar), 'settings [g-default: pages, sections, performance, code, ⠿, +] (+)');
});

// ── Open from the menu ──────────────────────────────────────────────────

test('opening a hidden tool presses its button and shows it until it has been open and closes', () => {
  const frame = fakeFrame('pages');
  const pages = frame.firstElementChild;
  const win = fakeWin({ stored: '["pages"]', row: [frame] });

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
  const win = fakeWin({ stored: '["edits"]', row: [shown, open] });

  openToolbarTool(win, 'performance');
  openToolbarTool(win, 'edits');
  assert.equal(shown.clicks, 1);
  assert.equal(open.clicks, 1);
  assert.equal(shown.hasAttribute(PEEK_ATTR), false);
  assert.equal(open.hasAttribute(PEEK_ATTR), false);
  assert.equal(win.observers.length, 0);
  assert.equal(openToolbarTool(win, 'nope'), false);
});

// ── Presets ─────────────────────────────────────────────────────────────

test("a user's own presets are stored clean", () => {
  const win = fakeWin();

  writeUserPresets(win, [
    { id: 'u-abc', name: '  Kunde-demo  ', tools: ['pages', 'pages', 'x"y'], dock: true },
    { id: 'u-pan', name: 'Panes', tools: [], panes: ['listview', 'x"y', 'listview'] },
    { id: 'developer', name: 'Not mine', tools: [] },
    { id: 'u-def', name: '   ', tools: [] },
  ]);
  assert.deepEqual(readUserPresets(win), [
    // Saved before presets had panes: it leaves the sidebar alone.
    { id: 'u-abc', name: 'Kunde-demo', tools: ['pages'], dock: true, panes: null },
    { id: 'u-pan', name: 'Panes', tools: [], dock: false, panes: ['listview'] },
  ]);

  writeUserPresets(win, []);
  assert.equal(win.store.has(TOOLBAR_PRESETS_KEY), false);
  assert.deepEqual(readUserPresets(win), []);
});

test('the picked preset is remembered, and only as an id', () => {
  const win = fakeWin();

  writePickedPreset(win, 'u-abc');
  assert.equal(readPickedPreset(win), 'u-abc');
  writePickedPreset(win, '');
  assert.equal(readPickedPreset(win), '');
  win.store.set('sve-toolbar-preset', 'x"y');
  assert.equal(readPickedPreset(win), '');
});

test("a preset's panes chosen by the user are stored clean, per preset id", () => {
  const win = fakeWin();

  writePaneChoices(win, { developer: ['listview', 'x"y'], 'u-abc': [], 'bad id': ['ai'], editor: 'ai' });
  assert.deepEqual(readPaneChoices(win), { developer: ['listview'], 'u-abc': [] });

  writePaneChoices(win, {});
  assert.equal(win.store.has(TOOLBAR_PRESET_PANES_KEY), false);
  assert.deepEqual(readPaneChoices(win), {});

  win.store.set(TOOLBAR_PRESET_PANES_KEY, '{not json');
  assert.deepEqual(readPaneChoices(win), {});
});
