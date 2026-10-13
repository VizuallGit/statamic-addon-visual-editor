/**
 * The Patterns panel's preview watch (previews-watch.js), run in node with its
 * neighbours stubbed: a fake window whose fetch answers from a queue (and can
 * be held), timers that fire at once, and a panel with the two buttons. It
 * proves the save button asks for its own run even while another check is in
 * flight, that a followed run clears the save button's mark and refetches the
 * pictures once, that a run somebody else started is noticed, that a server
 * with automatic refreshes off offers the save button only, and that the
 * automatic loop checks once a minute until Live Preview closes.
 */
import { register } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const target = new URL('../../resources/js/previews-watch.js', import.meta.url).href;

register('./support/stub-imports.mjs', import.meta.url, { data: { target, keep: [] } });

const fake = { header: true, siteAuto: false, prefs: {} };

globalThis.__sveStub = (spec, name) => {
  if (name === 't') return (win, key) => key;
  if (name === 'csrfToken') return () => 'token';
  if (name === 'featureSaidOn') return () => fake.siteAuto;
  if (name === 'lpHeader') return () => (fake.header ? {} : null);
  if (name === 'SECTION_PICKER_ID') return 'picker';
  if (name === 'chromeGet') return (win, key) => fake.prefs[key] ?? null;
  if (name === 'chromeSet') return (win, key, value) => (fake.prefs[key] = value);

  throw new Error(`unexpected import ${spec}#${name}`);
};

const watch = await import(target);

function button() {
  const attrs = {};

  return {
    hidden: false,
    title: '',
    setAttribute: (k, v) => (attrs[k] = String(v)),
    removeAttribute: (k) => delete attrs[k],
    hasAttribute: (k) => k in attrs,
    attrs,
  };
}

/** A window whose server answers from `answers`, in order; `hold` delays the next one. */
function makeWin(answers) {
  const asked = [];
  const events = [];
  const auto = button();
  const save = button();
  const panel = {
    querySelector: (sel) => (sel.includes('auto') ? auto : save),
    dispatchEvent: (event) => events.push(event.type),
  };
  const win = {
    asked,
    events,
    auto,
    save,
    sleeps: [],
    hold: null,
    document: { visibilityState: 'visible', getElementById: (id) => (id === 'picker' ? panel : null) },
    CustomEvent: class {
      constructor(type) {
        this.type = type;
      }
    },
    setTimeout(fn, ms) {
      win.sleeps.push(ms);
      Promise.resolve().then(fn);
    },
    async fetch(url) {
      asked.push(url.replace('/!/sve/previews/tick', '') || 'plain');

      if (win.hold) {
        const gate = win.hold;

        win.hold = null;
        await gate;
      }

      const answer = answers.shift();

      return { ok: !!answer, json: async () => answer };
    },
  };

  return win;
}

const idle = (extra = {}) => ({ stale: 0, running: false, auto: true, errors: {}, ...extra });

test('the save button pressed during another check asks for its own run afterwards', async () => {
  fake.prefs = { 'sve-previews-auto': '0' };

  const win = makeWin([idle({ stale: 2 }), idle({ stale: 2, running: true }), idle()]);
  let release;

  win.hold = new Promise((resolve) => (release = resolve));

  const probe = watch.checkPreviews(win, 'probe');
  const update = watch.checkPreviews(win, 'update');

  assert.ok(win.save.hasAttribute('data-sve-busy'), 'busy from the click');

  release();
  await probe;

  const result = await update;

  assert.deepEqual(win.asked, ['?probe=1', '?update=1', '?probe=1']);
  assert.equal(result.first.running, true, 'the button got a run, not the probe answer');
});

test('a followed run clears the save mark and refetches the pictures once', async () => {
  fake.prefs = { 'sve-previews-auto': '0' };

  const win = makeWin([idle({ stale: 1, running: true }), idle({ running: true }), idle()]);
  const result = await watch.checkPreviews(win, 'update');

  assert.equal(result.last.running, false);
  assert.deepEqual(win.events, ['sve-library-preview-ready']);
  assert.equal(win.save.hasAttribute('data-dirty'), false);
  assert.equal(win.save.hasAttribute('data-sve-busy'), false);
});

test('a run somebody else started is noticed when what was stale is current', async () => {
  fake.prefs = { 'sve-previews-auto': '0' };

  const win = makeWin([idle({ stale: 3 }), idle()]);

  await watch.checkPreviews(win, 'probe');
  assert.ok(win.save.hasAttribute('data-dirty'));
  assert.deepEqual(win.events, []);

  await watch.checkPreviews(win, 'probe');
  assert.deepEqual(win.events, ['sve-library-preview-ready']);
  assert.equal(win.save.hasAttribute('data-dirty'), false);
});

test('a server with automatic refreshes off offers the save button only', async () => {
  fake.prefs = { 'sve-previews-auto': '1' };

  const win = makeWin([idle({ auto: false })]);

  assert.equal(watch.previewsAuto(win), true);

  await watch.checkPreviews(win, 'probe');

  assert.equal(watch.previewsAuto(win), false);
  assert.equal(win.auto.hidden, true);
  assert.equal(win.save.hidden, false);
});

test('automatic checks once a minute while Live Preview is open, and stops when it closes', async () => {
  fake.prefs = { 'sve-previews-auto': '1' };
  fake.header = true;

  const win = makeWin([idle(), idle(), idle()]);
  const origSetTimeout = win.setTimeout;

  win.setTimeout = (fn, ms) => {
    // Live Preview closes during the second minute's wait.
    if (win.sleeps.filter((s) => s === 60000).length === 1) {
      fake.header = false;
    }

    origSetTimeout(fn, ms);
  };

  watch.ensureLpPreviewWatch(win);
  watch.ensureLpPreviewWatch(win); // one loop per window

  await new Promise((resolve) => setTimeout(resolve, 20));

  assert.deepEqual(win.asked, ['plain', 'plain']);
  assert.deepEqual(win.sleeps.filter((s) => s === 60000).length, 2);

  fake.header = true;
});
