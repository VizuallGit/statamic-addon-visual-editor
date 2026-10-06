import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beginCardDrag } from '../../resources/js/cp/library/card-drag.js';
import { sveState } from '../../resources/js/cp-state.js';
import { MSG, SOURCE } from '../../resources/js/lib/protocol.js';

/**
 * A stub page, laid out in one row: the preview iframe on the left (x 0–800),
 * the Patterns panel on the right (x 800–1100). Only what card-drag.js touches
 * is here.
 */
class El {
  constructor(selectors = [], parent = null) {
    this.selectors = selectors;
    this.parent = parent;
  }

  contains(other) {
    for (let node = other; node; node = node.parent) {
      if (node === this) {
        return true;
      }
    }

    return false;
  }

  closest(selector) {
    const wanted = selector.split(',').map((part) => part.trim());

    for (let node = this; node; node = node.parent) {
      if (node.selectors.some((own) => wanted.includes(own))) {
        return node;
      }
    }

    return null;
  }
}

function setup() {
  const messages = [];
  const listeners = {};
  const captured = new Set();
  const captures = [];

  const shell = new El(['.live-preview-editor']);
  const frame = new El(['#live-preview-iframe'], shell);

  frame.style = { pointerEvents: '' };
  frame.offsetWidth = 800;
  frame.offsetHeight = 600;
  frame.contentDocument = null;
  frame.contentWindow = { postMessage: (message, origin) => messages.push({ ...message, origin }) };
  frame.getBoundingClientRect = () => ({ left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 });

  const dock = new El(['#__sve-right-dock']);
  const panel = new El(['#__sve-section-picker'], dock);
  const scroll = new El(['[data-sve-scroll]'], panel);
  const card = new El(['.sve-lib-card'], scroll);
  const ghosts = [];

  card.addEventListener = (type, fn) => {
    card[`on${type}`] = fn;
  };
  card.setPointerCapture = (id) => captured.add(id);
  card.releasePointerCapture = (id) => captured.delete(id);
  card.cloneNode = () => {
    const ghost = { style: { cssText: '' }, removed: false, remove: () => (ghost.removed = true) };

    ghosts.push(ghost);

    return ghost;
  };

  const doc = {
    body: { appendChild: () => {} },
    getElementById: (id) => (id === 'live-preview-iframe' ? frame : null),
    querySelectorAll: () => [],
    // The iframe has pointer-events:none during a drag, so a point over it
    // hits the preview shell underneath.
    elementFromPoint: (x) => (x >= 800 ? scroll : shell),
  };

  const win = {
    document: doc,
    location: { origin: 'https://site.test' },
    addEventListener: (type, fn, options) => {
      (listeners[type] ||= new Set()).add(fn);
      captures.push(!!options?.capture);
    },
    removeEventListener: (type, fn) => listeners[type]?.delete(fn),
  };

  const fire = (type, x, y, extra = {}) => {
    for (const fn of [...(listeners[type] || [])]) {
      fn({ type, clientX: x, clientY: y, pointerId: 1, button: 0, ...extra });
    }
  };

  const item = { handle: 'hero/style_1' };
  const presses = [];

  beginCardDrag(win, card, 'page', item, () => presses.push(true));

  return {
    messages,
    frame,
    ghosts,
    captured,
    item,
    presses,
    listening: () => Object.values(listeners).reduce((n, set) => n + set.size, 0),
    down: (x, y) => card.onpointerdown({ type: 'pointerdown', clientX: x, clientY: y, pointerId: 1, button: 0 }),
    move: (x, y, extra) => fire('pointermove', x, y, extra),
    captures,
    up: (x, y) => fire('pointerup', x, y),
    cancel: (x, y) => fire('pointercancel', x, y),
    types: () => messages.map((m) => m.type),
  };
}

test('a click without a move sends nothing and inserts nothing', () => {
  const page = setup();

  page.down(900, 100);
  page.up(900, 100);

  assert.deepEqual(page.messages, []);
  assert.equal(page.ghosts.length, 0);
  assert.equal(sveState.libraryDrag, null);
  assert.equal(page.listening(), 0, 'every listener is gone');
  assert.equal(page.presses.length, 1, 'the press still prefetches');
});

test('a 6px horizontal move inside the panel picks the card up but tells the preview nothing', () => {
  const page = setup();

  page.down(900, 100);
  page.move(906, 100);
  page.move(950, 110);

  assert.equal(page.ghosts.length, 1, 'the ghost follows the pointer');
  assert.deepEqual(page.messages, [], 'no zoom while still over the cards');
  assert.equal(page.frame.style.pointerEvents, '');

  page.up(950, 110);

  assert.deepEqual(page.messages, []);
  assert.equal(page.ghosts[0].removed, true);
  assert.equal(page.captured.size, 0);
  assert.equal(page.listening(), 0);
});

test('a vertical move over the list is a scroll, not a drag', () => {
  const page = setup();

  page.down(900, 100);
  page.move(901, 140);

  assert.equal(page.ghosts.length, 0);
  assert.deepEqual(page.messages, []);

  page.up(901, 140);
});

test('leaving the panel sends START once, then only moves', () => {
  const page = setup();

  page.down(900, 100);
  page.move(700, 100);
  page.move(650, 120);

  assert.deepEqual(page.types(), [MSG.EXT_DRAG_START, MSG.EXT_DRAG_MOVE, MSG.EXT_DRAG_MOVE]);
  assert.ok(page.messages.every((m) => m.source === SOURCE && m.origin === 'https://site.test'));
  assert.deepEqual([page.messages[2].x, page.messages[2].y], [650, 120]);
  assert.equal(page.frame.style.pointerEvents, 'none');

  page.cancel(650, 120);
});

test('coming back over the panel cancels; leaving again starts over', () => {
  const page = setup();

  page.down(900, 100);
  page.move(700, 100);
  page.move(900, 100);
  page.move(950, 100);

  assert.deepEqual(page.types(), [MSG.EXT_DRAG_START, MSG.EXT_DRAG_MOVE, MSG.EXT_DRAG_END]);
  assert.equal(page.messages[2].cancelled, true);
  assert.equal(page.frame.style.pointerEvents, '', 'the iframe takes the pointer back');

  page.move(600, 100);

  assert.deepEqual(page.types().slice(3), [MSG.EXT_DRAG_START, MSG.EXT_DRAG_MOVE]);
  assert.equal(page.frame.style.pointerEvents, 'none');

  page.cancel(600, 100);
});

test('a release over the preview sends END and leaves the drop pending', () => {
  const page = setup();

  page.down(900, 100);
  page.move(600, 200);
  page.up(600, 200);

  const end = page.messages.at(-1);

  assert.equal(end.type, MSG.EXT_DRAG_END);
  assert.equal(end.cancelled, false);
  assert.deepEqual(sveState.libraryDrag, { kind: 'page', item: page.item });
  assert.equal(page.frame.style.pointerEvents, '');
  assert.equal(page.ghosts[0].removed, true);
  assert.equal(page.captured.size, 0);
  assert.equal(page.listening(), 0);
});

test('a release inside the panel after zooming cancels and drops nothing', () => {
  const page = setup();

  sveState.libraryDrag = { kind: 'page', item: { handle: 'stale' } };

  page.down(900, 100);

  assert.equal(sveState.libraryDrag, null, 'a drop that never came back does not block the next drag');

  page.move(600, 200);
  page.up(900, 100);

  assert.deepEqual(page.types(), [MSG.EXT_DRAG_START, MSG.EXT_DRAG_MOVE, MSG.EXT_DRAG_END]);
  assert.equal(page.messages.at(-1).cancelled, true);
  assert.equal(sveState.libraryDrag, null);
  assert.equal(page.frame.style.pointerEvents, '');
  assert.equal(page.listening(), 0);
});

test('back over the panel then released there: one END, nothing more', () => {
  const page = setup();

  page.down(900, 100);
  page.move(600, 200);
  page.move(900, 100);
  page.up(900, 100);

  assert.deepEqual(page.types(), [MSG.EXT_DRAG_START, MSG.EXT_DRAG_MOVE, MSG.EXT_DRAG_END]);
  assert.equal(page.messages.at(-1).cancelled, true);
  assert.equal(sveState.libraryDrag, null);
});

test('a cancelled pointer over the preview never drops', () => {
  const page = setup();

  page.down(900, 100);
  page.move(600, 200);
  page.cancel(600, 200);

  assert.equal(page.messages.at(-1).type, MSG.EXT_DRAG_END);
  assert.equal(page.messages.at(-1).cancelled, true);
  assert.equal(sveState.libraryDrag, null);
});

test('the window listeners are capture-phase, so a stopped pointerup elsewhere cannot starve them', () => {
  const page = setup();

  page.down(900, 100);

  assert.equal(page.captures.length, 3);
  assert.ok(page.captures.every(Boolean), 'pointermove, pointerup and pointercancel all in capture');

  page.up(900, 100);
});

test('a move with no button held after a swallowed release ends the press: nothing starts', () => {
  const page = setup();

  page.down(900, 100);
  // The pointerup never reached us (another capture listener stopped it).
  page.move(700, 100, { buttons: 0 });

  assert.equal(page.ghosts.length, 0);
  assert.deepEqual(page.messages, []);
  assert.equal(page.listening(), 0, 'the press is over; every listener is gone');
  assert.equal(page.frame.style.pointerEvents, '');
});

test('a move with no button held mid-drag cancels like a release outside the preview', () => {
  const page = setup();

  page.down(900, 100);
  page.move(700, 100, { buttons: 1 });
  assert.deepEqual(page.types(), [MSG.EXT_DRAG_START, MSG.EXT_DRAG_MOVE]);

  page.move(650, 100, { buttons: 0 });

  assert.equal(page.types().at(-1), MSG.EXT_DRAG_END);
  assert.equal(page.messages.at(-1).cancelled, true);
  assert.equal(sveState.libraryDrag, null);
  assert.equal(page.ghosts[0].removed, true);
  assert.equal(page.listening(), 0);
});
