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
  pressToolbarTool,
  readHiddenTools,
  readToolbarGroups,
  renameToolbarGroup,
  resetToolbarGroups,
  setToolbarToolShown,
  showAllToolbarTools,
  syncToolbarLayout,
  toolbarCss,
  toolbarGrouped,
  toolbarGroups,
  toolbarTools,
  toolbarLayout,
  followToolbarMode,
  leaveToolbarToolsOutsideMode,
  moveModeGroup,
  moveModeTool,
  moveModeToolToNewGroup,
  toolbarMode,
  toolbarToolAllowed,
} from '../../resources/js/toolbar-visibility.js';
import {
  HEADER_TOOLBAR_ID,
  TOOLBAR_ADD_ATTR,
  TOOLBAR_GROUP_ATTR,
  TOOLBAR_GROUPS_KEY,
  TOOLBAR_HIDDEN_KEYS,
  TOOLBAR_NEW_GROUP_ATTR,
  TOOLBAR_ORDER_KEY,
} from '../../resources/js/lib/ids.js';

/** Content's own hidden icons: the list every test here writes, unless it says Build. */
const TOOLBAR_HIDDEN_KEY = TOOLBAR_HIDDEN_KEYS.content;

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
function fakeWin({ stored = null, order = null, groups = null, row = null, modes = null } = {}) {
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
    Statamic: { $config: { get: (key) => ({ sveStrings: { toolbar_add_tip: 'Add a tool' }, sveToolbarModes: modes })[key] ?? undefined } },
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

/** The row as a picture: `settings [g-a: code, +] [g-b: pages, +] (+)` — (+) the new-group square. */
function picture(bar) {
  const inBox = (child) => (child.hasAttribute(TOOLBAR_ADD_ATTR) ? '+' : child.dataset.tab || child.id.replace('__sve-frame-', ''));

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
  assert.match(FRAME, /#__sve-toolbar\{background:transparent!important;padding:0!important;gap:8px!important\}/);
  assert.match(FRAME, /button\[data-tab="settings"\]\{flex-shrink:0;width:32px!important;height:32px!important;margin:0!important;border-radius:\.5rem!important;opacity:1!important\}/);
  assert.match(FRAME, /\[data-tab="settings"\]:not\(\[aria-pressed="true"\]\)\{background:rgba\(128,128,128,\.16\)!important\}/);
  assert.match(FRAME, /#__sve-toolbar>\[data-sve-toolbar-group\]\{position:relative;display:inline-flex;[^}]*height:32px;padding:5px;gap:4px;border-radius:\.5rem;background:rgba\(128,128,128,\.16\)\}/);
  assert.match(FRAME, /\[data-sve-toolbar-group\]>\[data-sve-toolbar-add\]\{position:absolute;[^}]*right:-\.4375rem;[^}]*width:\.875rem;height:\.875rem;[^}]*opacity:0;pointer-events:none/);
  assert.match(FRAME, /\[data-sve-toolbar-group\]:hover>\[data-sve-toolbar-add\],[^{]*\{opacity:1;pointer-events:auto\}/);
  assert.doesNotMatch(FRAME, /[{;]order:|::before/);
});

test('the frame: the group «+» is cut out of the group by 2px of the header\'s own colour, around its thin ring — hovered too', () => {
  assert.match(FRAME, /\[data-sve-toolbar-group\]>\[data-sve-toolbar-add\]\{[^}]*box-shadow:0 0 0 1px rgba\(128,128,128,\.35\),0 0 0 3px var\(--sve-toolbar-bg,transparent\);/);
  assert.match(FRAME, /\[data-sve-toolbar-add\]:focus-visible\{background:var\(--theme-color-primary,#4f46e5\);color:#fff;box-shadow:0 0 0 2px var\(--sve-toolbar-bg,transparent\)\}/);
});

test('the frame: a group\'s own surface shows the grab hand only where there is a second group; its icons keep their own cursor', () => {
  assert.match(FRAME, /#__sve-toolbar:has\(>\[data-sve-toolbar-group\]~\[data-sve-toolbar-group\]\)>\[data-sve-toolbar-group\]\{cursor:grab\}/);
  assert.match(FRAME, /#__sve-toolbar>\[data-sve-toolbar-group\]>\*\{cursor:default\}/);
  assert.match(FRAME, /#__sve-toolbar\[data-sve-dragging-group\],#__sve-toolbar\[data-sve-dragging-group\] \*\{cursor:grabbing!important\}/);
  assert.doesNotMatch(FRAME, /grip/);
});

test('the frame: the new-group square always in the row, one gap after the last group as the groups stand — a group\'s height, 1:1, a ring in the groups\' grey, no surface until hovered', () => {
  assert.match(FRAME, /#__sve-toolbar>\[data-sve-toolbar-new-group\]\{display:flex;flex-shrink:0\}/);
  assert.match(FRAME, /\[data-sve-toolbar-new-group\]>button\{[^}]*width:32px;height:32px;[^}]*border:1px solid rgba\(128,128,128,\.16\);[^}]*border-radius:\.5rem;[^}]*background:transparent\}/);
  assert.match(FRAME, /\[data-sve-toolbar-new-group\]>button:hover,[^{]*>button:focus-visible\{background:rgba\(128,128,128,\.16\);border-color:transparent\}/);
  assert.doesNotMatch(FRAME, /new-group\][^{]*\{[^}]*(opacity:0|position:absolute)/);
});

test('the frame: the square\'s «+» rests faint, and is whole on hover or focus', () => {
  assert.match(FRAME, /#__sve-toolbar>\[data-sve-toolbar-new-group\]>button svg\{opacity:\.2;transition:opacity \.12s\}/);
  assert.match(FRAME, /\[data-sve-toolbar-new-group\]>button:hover svg,[^{]*\[data-sve-toolbar-new-group\]>button:focus-visible svg\{opacity:1\}/);
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
  assert.equal(picture(win.bar), 'settings [g-default: pages, sections, performance, code, +] (+)');
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
  assert.equal(picture(win.bar), 'settings [g-a: code, +] [g-b: pages, sections, performance, +] (+)');
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
  assert.equal(picture(win.bar), 'settings [g-a: code, +] [g-b: pages, ai, sections, performance, +] (+)');

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
  assert.equal(picture(win.bar), 'settings [g-default: code, pages, sections, performance, +] (+)');

  const id = moveToolbarToolToNewGroup(win, 'performance', 1, '  Speed  ');

  assert.match(id, /^g-[a-z0-9]+$/);
  assert.equal(picture(win.bar), `settings [g-default: code, pages, sections, +] [${id}: performance, +] (+)`);
  assert.equal(toolbarLayout(win)[1].name, 'Speed', 'the name is stored, trimmed');
  assert.equal(win.bar.children[2].title, '', 'and not shown as a tooltip on the box');

  moveToolbarToolBefore(win, 'code', id, 'performance');
  assert.equal(picture(win.bar), `settings [g-default: pages, sections, +] [${id}: code, performance, +] (+)`);

  moveToolbarToolBefore(win, 'pages', id, null);
  assert.equal(picture(win.bar), `settings [g-default: sections, +] [${id}: code, performance, pages, +] (+)`);

  moveToolbarToolBefore(win, 'sections', id, 'code');
  assert.equal(picture(win.bar), `settings [${id}: sections, code, performance, pages, +] (+)`);
  assert.deepEqual(JSON.parse(win.store.get(TOOLBAR_GROUPS_KEY)), [{ id, name: 'Speed', tools: ['sections', 'code', 'performance', 'pages'] }]);
});

test('the «+» puts a tool at the end of the group and shows it', () => {
  const win = fakeWin({ stored: '["code"]', groups: '[{"id":"g-a","tools":["pages"]},{"id":"g-b","tools":["sections"]}]', row: row() });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-a: pages, +] [g-b: sections, performance, code, +] (+)');

  addToolbarToolToGroup(win, 'code', 'g-a');
  assert.equal(picture(win.bar), 'settings [g-a: pages, code, +] [g-b: sections, performance, +] (+)');
  assert.equal(win.store.has(TOOLBAR_HIDDEN_KEY), false);
});

test('the new-group square stands after the last box, and goes when there is no group', () => {
  const win = fakeWin({ groups: '[{"id":"g-a","tools":["code"]},{"id":"g-b","tools":["pages"]}]', row: row() });

  syncToolbarLayout(win);

  const square = win.bar.querySelector(`:scope>[${TOOLBAR_NEW_GROUP_ATTR}]`);

  assert.equal(win.bar.lastElementChild, square);
  assert.equal(square.firstElementChild.tagName, 'button');
  assert.equal(square.firstElementChild.getAttribute('aria-label'), 'toolbar_drag_new_group');

  const bare = fakeWin({ row: [fakeButton('settings')] });

  syncToolbarLayout(bare);
  assert.equal(picture(bare.bar), 'settings');
});

test('a dragged group goes to its new place; the square stays last; a second pass moves nothing', () => {
  const win = fakeWin({ groups: '[{"id":"g-a","tools":["code"]},{"id":"g-b","tools":["pages"]},{"id":"g-c","tools":["sections"]}]', row: row() });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-a: code, +] [g-b: pages, +] [g-c: sections, performance, +] (+)');

  moveToolbarGroup(win, 'g-c', 0);
  assert.equal(picture(win.bar), 'settings [g-c: sections, performance, +] [g-a: code, +] [g-b: pages, +] (+)');
  assert.deepEqual(JSON.parse(win.store.get(TOOLBAR_GROUPS_KEY)).map((group) => group.id), ['g-c', 'g-a', 'g-b']);

  moveToolbarGroup(win, 'g-c', 2);
  assert.equal(picture(win.bar), 'settings [g-a: code, +] [g-b: pages, +] [g-c: sections, performance, +] (+)');

  moves = 0;
  syncToolbarLayout(win);
  assert.equal(moves, 0);
});

test('the new-group square starts a group of its own after the last with the tool picked — a hidden one shown, one from a group moved out, the group it empties gone', () => {
  const win = fakeWin({ stored: '["code"]', groups: '[{"id":"g-a","tools":["pages"]},{"id":"g-b","tools":["sections","performance"]}]', row: row() });

  syncToolbarLayout(win);
  assert.equal(picture(win.bar), 'settings [g-a: pages, +] [g-b: sections, performance, code, +] (+)');

  const hiddenOne = addToolbarToolToNewGroup(win, 'code');

  assert.match(hiddenOne, /^g-[a-z0-9]+$/);
  assert.equal(picture(win.bar), `settings [g-a: pages, +] [g-b: sections, performance, +] [${hiddenOne}: code, +] (+)`);
  assert.equal(win.store.has(TOOLBAR_HIDDEN_KEY), false, 'and shown');

  const fromGroup = addToolbarToolToNewGroup(win, 'pages');

  assert.equal(picture(win.bar), `settings [g-b: sections, performance, +] [${hiddenOne}: code, +] [${fromGroup}: pages, +] (+)`);
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
  assert.equal(picture(win.bar), 'settings [g-a: code, pages, sections, performance, +] (+)');

  deleteToolbarGroup(win, 'g-a');
  assert.equal(picture(win.bar), 'settings [g-a: code, pages, sections, performance, +] (+)');

  resetToolbarGroups(win);
  assert.equal(win.store.has(TOOLBAR_GROUPS_KEY), false);
  assert.equal(picture(win.bar), 'settings [g-default: pages, sections, performance, code, +] (+)');
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

// ── Pressed by a keyboard shortcut ──────────────────────────────────────

test('a shortcut presses the icon exactly as a click: a second press is a second click', () => {
  const settings = fakeButton('settings');
  const globals = fakeButton('globals');
  const win = fakeWin({ row: [settings, globals] });

  assert.equal(pressToolbarTool(win, 'globals'), true);
  assert.equal(pressToolbarTool(win, 'globals'), true);
  assert.equal(pressToolbarTool(win, 'settings'), true, 'Page settings too');
  assert.equal(globals.clicks, 2);
  assert.equal(settings.clicks, 1);
});

test('a hidden tool opens without its icon coming back: no peek, nothing written', () => {
  const xray = fakeButton('xray');
  const win = fakeWin({ stored: '["xray"]', row: [xray] });

  assert.equal(pressToolbarTool(win, 'xray'), true);
  assert.equal(xray.clicks, 1);
  assert.equal(xray.hasAttribute(PEEK_ATTR), false);
  assert.equal(win.observers.length, 0);
  assert.deepEqual(readHiddenTools(win), ['xray']);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEY), '["xray"]');
});

test('a hidden tool whose control or menu is placed from its icon is pressed as any other: it finds its own place', () => {
  ['pages', 'globals', 'collections', 'templates', 'design_overlay'].forEach((key) => {
    const btn = fakeButton(key);
    const win = fakeWin({ stored: JSON.stringify([key]), row: [btn] });

    assert.equal(pressToolbarTool(win, key), true, key);
    assert.equal(btn.clicks, 1, key);
    assert.equal(btn.hasAttribute(PEEK_ATTR), false, `${key}: the icon stays hidden`);
    assert.deepEqual(readHiddenTools(win), [key]);
  });
});

test('no icon for the tool, or nothing for it on this page: nothing happens', () => {
  const sections = fakeButton('sections', { display: 'none' });
  const win = fakeWin({ row: [sections] });

  assert.equal(pressToolbarTool(win, 'sections'), false, 'Patterns without a page builder');
  assert.equal(sections.clicks, 0);
  assert.equal(pressToolbarTool(win, 'ai'), false, 'no access, no icon');
  assert.equal(pressToolbarTool(fakeWin(), 'globals'), false, 'no top bar');
});

// ── Content and Build ───────────────────────────────────────────────────
//
// The site's lists: Content may have pages and sections; Build has those,
// performance and the dock (PHP puts the dock on Build's list, never Content's).

const MODES = { content: ['pages', 'sections'], build: ['pages', 'sections', 'performance', 'code'] };

/** Run `fn` with Live Preview in Build, and back to Content after. */
function inBuild(fn) {
  followToolbarMode(() => 'build');

  try {
    return fn();
  } finally {
    followToolbarMode(() => 'content');
  }
}

test('the mode is Content until Build says otherwise', () => {
  assert.equal(toolbarMode(), 'content');
  inBuild(() => assert.equal(toolbarMode(), 'build'));
  followToolbarMode(() => 'nonsense');
  assert.equal(toolbarMode(), 'content');
  followToolbarMode(() => 'content');
});

test('what a mode may not have is hidden, whatever the user has stored; Page settings always stays', () => {
  const win = fakeWin({ modes: MODES, row: row() });

  syncToolbarLayout(win);
  // Every icon Content's list leaves out — also one with no button yet, so a
  // button a pass makes is hidden before it paints.
  assert.ok(readHiddenTools(win).includes('performance') && readHiddenTools(win).includes('code') && readHiddenTools(win).includes('ai'));
  assert.ok(!readHiddenTools(win).includes('pages') && !readHiddenTools(win).includes('sections'));
  assert.match(win.sheet(), /button\[data-tab="code"\]:not\(\[data-sve-peek\]\)/);
  assert.equal(toolbarToolAllowed(win, 'settings'), true);
  assert.equal(toolbarToolAllowed(win, 'code'), false);

  inBuild(() => {
    syncToolbarLayout(win);
    assert.ok(!['pages', 'sections', 'performance', 'code'].some((key) => readHiddenTools(win).includes(key)));
    assert.doesNotMatch(win.sheet(), /button\[data-tab="code"\]:not/);
    assert.equal(toolbarToolAllowed(win, 'code'), true);
  });
});

test('each mode keeps its own hidden icons, and an icon a mode may not have is never stored as hidden', () => {
  const win = fakeWin({ modes: MODES, row: row() });

  setToolbarToolShown(win, 'pages', false);
  setToolbarToolShown(win, 'code', false);
  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEYS.content), '["pages"]');

  inBuild(() => {
    assert.ok(!readHiddenTools(win).includes('pages'), 'Build has its own list');
    setToolbarToolShown(win, 'code', false);
    assert.equal(win.store.get(TOOLBAR_HIDDEN_KEYS.build), '["code"]');
    showAllToolbarTools(win);
    assert.equal(win.store.has(TOOLBAR_HIDDEN_KEYS.build), false);
  });

  assert.equal(win.store.get(TOOLBAR_HIDDEN_KEYS.content), '["pages"]', 'Content’s untouched');
});

test('the menus list only what the mode may have, and only the groups with some of it', () => {
  const groups = '[{"id":"g-a","tools":["code","performance"]},{"id":"g-b","tools":["pages","sections"]}]';
  const win = fakeWin({ modes: MODES, groups, row: row() });

  syncToolbarLayout(win);
  assert.deepEqual(toolbarGroups(win).map((group) => [group.id, group.tools.map((tool) => tool.key)]), [['g-b', ['pages', 'sections']]]);
  assert.deepEqual(toolbarTools(win).map((tool) => tool.key), ['pages', 'sections']);

  inBuild(() => {
    assert.deepEqual(toolbarGroups(win).map((group) => [group.id, group.tools.map((tool) => tool.key)]), [
      ['g-a', ['code', 'performance']],
      ['g-b', ['pages', 'sections']],
    ]);
  });
});

test('neither Open nor a shortcut presses what the mode may not have', () => {
  const win = fakeWin({ modes: MODES, row: row() });
  const code = win.bar.querySelector('button[data-tab="code"]');

  assert.equal(openToolbarTool(win, 'code'), false);
  assert.equal(pressToolbarTool(win, 'code'), false);
  assert.equal(code.clicks, 0);
  assert.equal(pressToolbarTool(win, 'settings'), true);

  inBuild(() => {
    assert.equal(pressToolbarTool(win, 'code'), true);
    assert.equal(code.clicks, 1);
  });
});

test('a move in the menu lands where it was seen, between tools the mode does not show', () => {
  const win = fakeWin({ modes: MODES, groups: '[{"id":"g-a","tools":["pages","code","performance","sections"]}]', row: row() });

  // Content sees pages, sections: sections first.
  moveModeTool(win, 'sections', 'g-a', 0);
  assert.deepEqual(toolbarLayout(win)[0].tools, ['sections', 'pages', 'code', 'performance']);

  // Pages after sections — last of what Content sees, right after it.
  moveModeTool(win, 'pages', 'g-a', 1);
  assert.deepEqual(toolbarLayout(win)[0].tools, ['sections', 'pages', 'code', 'performance']);
  moveModeTool(win, 'sections', 'g-a', 1);
  assert.deepEqual(toolbarLayout(win)[0].tools, ['pages', 'sections', 'code', 'performance']);
});

test('a group moved or made in the menu counts only the groups the mode draws', () => {
  const groups = '[{"id":"g-a","tools":["pages"]},{"id":"g-x","tools":["code","performance"]},{"id":"g-b","tools":["sections"]}]';
  const win = fakeWin({ modes: MODES, groups, row: row() });

  // Content sees g-a, g-b. g-b first.
  moveModeGroup(win, 'g-b', 0);
  assert.deepEqual(toolbarLayout(win).map((group) => group.id), ['g-b', 'g-a', 'g-x']);

  // A new group after the last Content sees: after g-a, not before g-x's tools jump.
  const id = moveModeToolToNewGroup(win, 'sections', 2, 'Mine');
  assert.deepEqual(toolbarLayout(win).map((group) => [group.id === id ? 'new' : group.id, group.tools]), [
    ['g-a', ['pages']],
    ['new', ['sections']],
    ['g-x', ['code', 'performance']],
  ]);
});

test('a switch of mode closes what is open and the new mode may not have — nothing else', () => {
  const win = fakeWin({ modes: MODES, row: row() });
  const code = win.bar.querySelector('button[data-tab="code"]');
  const pages = win.bar.querySelector('button[data-tab="pages"]');

  code.setAttribute('aria-pressed', 'true');
  pages.setAttribute('aria-pressed', 'true');
  leaveToolbarToolsOutsideMode(win);
  assert.equal(code.clicks, 1, 'the dock shuts on the way into Content');
  assert.equal(pages.clicks, 0);

  inBuild(() => {
    code.clicks = 0;
    leaveToolbarToolsOutsideMode(win);
    assert.equal(code.clicks, 0);
  });
});
