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
