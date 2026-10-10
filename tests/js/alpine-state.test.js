/**
 * bridge/alpine-state.js — an Alpine boolean set in the preview and put back
 * after a morph. Run against a small fake of the preview's DOM and of
 * Alpine's `$data`: which element a state reaches, and what is written to
 * its data in which order.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { applyAlpineStates, setAlpineState } from '../../resources/js/bridge/alpine-state.js';
import { bridgeState } from '../../resources/js/bridge/state.js';

globalThis.CSS ??= { escape: (value) => value };

/** An element answering the attribute selectors the module asks: `[name]` and `[name="value"]`. */
class El {
  constructor(attrs = {}, children = [], data = null) {
    this.attrs = attrs;
    this.children = children;
    this.parentElement = null;
    this.data = data;
    children.forEach((child) => {
      child.parentElement = this;
    });
  }

  matches(selector) {
    const match = selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);

    return !!match && match[1] in this.attrs && (match[2] === undefined || this.attrs[match[1]] === match[2]);
  }

  querySelectorAll(selector) {
    const out = [];
    const walk = (el) => el.children.forEach((child) => {
      if (child.matches(selector)) {
        out.push(child);
      }

      walk(child);
    });

    walk(this);

    return out;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  closest(selector) {
    for (let el = this; el; el = el.parentElement) {
      if (el.matches(selector)) {
        return el;
      }
    }

    return null;
  }
}

/** Component data that remembers every value written to it, in order. */
function data(initial) {
  const writes = [];
  const proxy = new Proxy({ ...initial }, {
    set(target, key, value) {
      writes.push(`${String(key)}=${value}`);
      target[key] = value;

      return true;
    },
  });

  return { proxy, writes };
}

function page() {
  const first = data({ open: false });
  const second = data({ open: false, menuOpen: true });
  const a = new El({ 'x-data': '' }, [], first.proxy);
  const b = new El({ 'x-data': '' }, [], second.proxy);
  const section = new El({ 'data-sid': 'sec-1' }, [new El({}, [a]), b]);
  const doc = new El({}, [section]);
  const win = {
    document: doc,
    Alpine: { $data: (el) => el.data || {} },
    queueMicrotask,
  };

  return { win, first, second };
}

beforeEach(() => bridgeState.alpineStates.clear());

test('a state reaches the nth component of the section, and only that one', () => {
  const { win, first, second } = page();

  setAlpineState(win, { uid: 'sec-1', uids: [], nth: 1, key: 'menuOpen', value: false, on: true });

  assert.deepEqual(first.writes, []);
  assert.deepEqual(second.writes, ['menuOpen=false']);
  assert.equal(bridgeState.alpineStates.size, 1);
});

test('a section root that is itself a component is the first one', () => {
  const root = data({ open: false });
  const inner = data({ open: false });
  const child = new El({ 'x-data': '' }, [], inner.proxy);
  const section = new El({ 'data-sid': 'sec-2', 'x-data': '' }, [child], root.proxy);
  const win = { document: new El({}, [section]), Alpine: { $data: (el) => el.data || {} }, queueMicrotask };

  setAlpineState(win, { uid: 'sec-2', nth: 0, key: 'open', value: true, on: true });

  assert.deepEqual(root.writes, ['open=true']);
  assert.deepEqual(inner.writes, []);
});

test('nth past the end means every component — a loop drew more than the file has', () => {
  const { win, first, second } = page();

  setAlpineState(win, { uid: 'sec-1', nth: 5, key: 'open', value: true, on: true });

  assert.deepEqual(first.writes, ['open=true']);
  assert.deepEqual(second.writes, ['open=true']);
});

test('after a morph a value already in place is flipped and set back on the next microtask', async () => {
  const { win, first } = page();

  setAlpineState(win, { uid: 'sec-1', nth: 0, key: 'open', value: true, on: true });
  first.writes.length = 0;

  applyAlpineStates(win);
  assert.deepEqual(first.writes, ['open=false'], 'flipped in the same task');

  await Promise.resolve();
  assert.deepEqual(first.writes, ['open=false', 'open=true'], 'and back on the next microtask');
  assert.equal(first.proxy.open, true);
});

test('after a morph a value the component lost is simply set again', () => {
  const { win, first } = page();

  setAlpineState(win, { uid: 'sec-1', nth: 0, key: 'open', value: true, on: true });
  first.proxy.open = false;
  first.writes.length = 0;

  applyAlpineStates(win);

  assert.deepEqual(first.writes, ['open=true']);
});

test('no Alpine, a key the component does not have, a bad message: nothing is set and nothing throws', () => {
  const { win, first } = page();

  setAlpineState({ ...win, Alpine: undefined }, { uid: 'sec-1', nth: 0, key: 'open', value: true, on: true });
  setAlpineState(win, { uid: 'sec-1', nth: 0, key: 'shut', value: true, on: true });
  setAlpineState(win, { uid: 'sec-1', nth: 0, key: 'open', value: 'yes', on: true });
  setAlpineState(win, { uid: 'sec-1', nth: 0, value: true, on: true });
  applyAlpineStates({ ...win, Alpine: undefined });

  assert.deepEqual(first.writes, []);
});

test('on: false puts the file’s value back and forgets the state', async () => {
  const { win, first } = page();

  setAlpineState(win, { uid: 'sec-1', nth: 0, key: 'open', value: true, on: true });
  setAlpineState(win, { uid: 'sec-1', nth: 0, key: 'open', value: false, on: false });

  assert.deepEqual(first.writes, ['open=true', 'open=false']);
  assert.equal(bridgeState.alpineStates.size, 0);

  applyAlpineStates(win);
  await Promise.resolve();
  assert.deepEqual(first.writes, ['open=true', 'open=false'], 'a morph after that leaves the file’s value alone');
});

test('the last word on a component’s key wins, whatever section name it came under', () => {
  const { win, first } = page();

  // The panel can name the section by another of its ids after a trip away:
  // set under one name, found through its list of ids.
  setAlpineState(win, { uid: 'old-name', uids: ['sec-1'], nth: 0, key: 'open', value: true, on: true });
  setAlpineState(win, { uid: 'sec-1', nth: 0, key: 'open', value: false, on: false });

  assert.equal(bridgeState.alpineStates.size, 0, 'the state under the old name is gone too');
  assert.equal(first.proxy.open, false);
});

/**
 * A whole document: a header with a menu, a page section with a component of
 * its own, a footer only when asked for, and components of the layout around
 * them — on `<html>`, `<body>`, a wrapper around the sections and one after
 * the footer.
 */
function framePage({ footer = false } = {}) {
  const made = {};
  const component = (name, initial, attrs = {}, children = []) => {
    made[name] = data(initial);

    return new El({ 'x-data': '', ...attrs }, children, made[name].proxy);
  };

  const header = component('header', { menuOpen: false }, { 'data-sve-chrome': 'header' }, [
    new El({}, [component('search', { open: false })]),
    // A block of the header's global: marked like a section, still the header's.
    new El({ 'data-sid': 'head-block' }, [component('headerBlock', { open: false })]),
  ]);
  const section = new El({ 'data-sid': 'sec-1' }, [component('sectionDialog', { open: false })]);
  const wrapper = component('wrapper', { open: false }, {}, [section]);
  const footerEl = footer
    ? new El({ 'data-sve-chrome': 'footer' }, [component('footerMenu', { open: false })])
    : new El({}, []);
  const after = component('after', { open: false });
  const body = component('body', { open: false }, {}, [header, wrapper, footerEl, after]);
  const html = component('html', { open: false }, {}, [new El({}, []), body]);
  const doc = new El({}, [html]);

  doc.documentElement = html;
  doc.body = body;

  const win = { document: doc, Alpine: { $data: (el) => el.data || {} }, queueMicrotask };

  return { win, made };
}

const written = (made) => Object.fromEntries(Object.entries(made).filter(([, item]) => item.writes.length).map(([name, item]) => [name, item.writes]));

test('chrome: header — the marked element is the first component, then what is inside it', () => {
  const reached = [[0, 'menuOpen'], [1, 'open'], [2, 'open']].map(([nth, key]) => {
    const { win, made } = framePage();

    bridgeState.alpineStates.clear();
    setAlpineState(win, { uid: '', chrome: 'header', nth, key, value: true, on: true });

    return { written: written(made), names: [...bridgeState.alpineStates.keys()] };
  });

  assert.deepEqual(reached, [
    { written: { header: ['menuOpen=true'] }, names: ['chrome:header:0:menuOpen'] },
    { written: { search: ['open=true'] }, names: ['chrome:header:1:open'] },
    // A block of the header's global is marked like a section and still the header's.
    { written: { headerBlock: ['open=true'] }, names: ['chrome:header:2:open'] },
  ]);
});

test('chrome: layout — <html>, <body> and what is outside the sections and the halves, in document order', () => {
  // Nothing in a section, the header or the footer is the layout's.
  const reached = [0, 1, 2, 3].map((nth) => {
    const { win, made } = framePage({ footer: true });

    bridgeState.alpineStates.clear();
    setAlpineState(win, { chrome: 'layout', nth, key: 'open', value: true, on: true });

    return written(made);
  });

  assert.deepEqual(reached, [
    { html: ['open=true'] },
    { body: ['open=true'] },
    { wrapper: ['open=true'] },
    { after: ['open=true'] },
  ]);
});

test('chrome: layout — nth past the end reaches only the layout’s own components', () => {
  const { win, made } = framePage({ footer: true });

  setAlpineState(win, { chrome: 'layout', nth: 9, key: 'open', value: true, on: true });

  assert.deepEqual(Object.keys(written(made)).sort(), ['after', 'body', 'html', 'wrapper']);
});

test('chrome: a half the page does not draw — nothing is set, the state waits for it', () => {
  const { win, made } = framePage();

  setAlpineState(win, { chrome: 'footer', nth: 0, key: 'open', value: true, on: true });
  applyAlpineStates(win);

  assert.deepEqual(written(made), {});
  assert.deepEqual([...bridgeState.alpineStates.keys()], ['chrome:footer:0:open']);
});

test('chrome: a state of the header and one of a section never share a name', () => {
  const { win } = framePage();

  setAlpineState(win, { uid: 'sec-1', uids: ['sec-1'], nth: 0, key: 'open', value: true, on: true });
  setAlpineState(win, { chrome: 'header', nth: 1, key: 'open', value: true, on: true });

  assert.deepEqual([...bridgeState.alpineStates.keys()].sort(), ['chrome:header:1:open', 'sec-1:0:open']);
});

test('chrome: an unknown part is no part — and a uid sent with one is not read', () => {
  const { win, made } = framePage();

  setAlpineState(win, { chrome: 'main', nth: 0, key: 'open', value: true, on: true });
  setAlpineState(win, { chrome: 'header', uid: 'sec-1', nth: 0, key: 'open', value: true, on: true });

  assert.deepEqual(written(made), {}, 'the header’s first component has no `open`; the section is not reached');
});

test('chrome: after a morph the header’s state is flipped and set back like a section’s', async () => {
  const { win, made } = framePage();

  setAlpineState(win, { chrome: 'header', nth: 0, key: 'menuOpen', value: true, on: true });
  made.header.writes.length = 0;

  applyAlpineStates(win);
  await Promise.resolve();

  assert.deepEqual(made.header.writes, ['menuOpen=false', 'menuOpen=true']);
});
