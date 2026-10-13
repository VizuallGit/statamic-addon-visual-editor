/**
 * The live-reload loop in Live Preview (lp-live-reload.js), run in node with
 * its neighbours stubbed: a fake window whose fetch answers from a queue and
 * whose timers fire at once but record the delay asked for. It proves what
 * the loop does with each answer — nothing on the first, a refresh on a
 * foreign markup change, none on the editor's own, a stylesheet swap on a new
 * build, a long wait when refused, that it ends when the header goes, and
 * that a file the dock has open is handed to the dock's panes (never typed in).
 */
import { register } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const target = new URL('../../resources/js/lp-live-reload.js', import.meta.url).href;

register('./support/stub-imports.mjs', import.meta.url, {
  data: { target, keep: ['/lib/live-reload.js', '/cp/theme-panel/utility-paint.js'] },
});

const calls = { refresh: [], swap: [], ask: [] };
const fake = {
  header: true,
  feature: true,
  /** The site's `live_reload_instant` switch. */
  instant: true,
  refreshResult: true,
  /** When set, a refresh holds until it resolves — a slow refresh. */
  gate: null,
  /** The dock's open file handle, '' for none; whether it takes a file. */
  dockType: '',
  dockTakes: true,
};

globalThis.__sveStub = (spec, name) => {
  if (name === 'lpHeader') return () => (fake.header ? {} : null);
  if (name === 'ask') {
    return (what, arg) => {
      calls.ask.push([what, arg]);

      if (what === 'dock:current-type') return fake.dockType;
      if (what === 'dock:take-file') return fake.dockTakes;

      return undefined;
    };
  }
  if (name === 'featureSaidOn') return (win, key) => (key === 'live_reload_instant' ? fake.instant : fake.feature);
  if (name === 'pageDocuments') return () => [pageDoc('preview'), pageDoc('copy')];
  if (name === 'refreshTemplatesShown') {
    return async (win, types) => {
      calls.refresh.push(types);

      if (fake.gate) {
        await fake.gate;
      }

      return fake.refreshResult;
    };
  }

  throw new Error(`unexpected import ${spec}#${name}`);
};

/**
 * A page document with one built stylesheet link, enough for the real
 * `swapSiteCss` (loaded by the module when a build lands): the link a swap
 * puts after it is recorded under the document's name.
 */
function pageDoc(id) {
  const link = {
    getAttribute: () => '/build/assets/site-a.css',
    cloneNode() {
      const attrs = {};

      return {
        setAttribute: (k, v) => (attrs[k] = v),
        removeAttribute: (k) => delete attrs[k],
        addEventListener() {},
        get href() {
          return attrs.href;
        },
      };
    },
    after(fresh) {
      calls.swap.push(`${id}:${fresh.href}`);
    },
  };

  return {
    id,
    baseURI: 'https://site.test/',
    defaultView: { location: { origin: 'https://site.test' } },
    querySelectorAll: () => [link],
  };
}

const { ensureLpLiveReload } = await import(target);

/** A window: fetch answers from `answers` in order, then holds forever. */
function fakeWindow(answers) {
  const delays = [];
  const urls = [];
  let pending = [...answers];
  const events = [];
  const win = {
    document: { hidden: false, dispatchEvent: (e) => events.push(e) },
    events,
    CustomEvent: globalThis.CustomEvent,
    AbortController: globalThis.AbortController,
    delays,
    urls,
    setTimeout(fn, ms) {
      delays.push(ms);

      return setTimeout(fn, 0);
    },
    clearTimeout,
    async fetch(url, { signal }) {
      urls.push(url);

      const next = pending.shift();

      if (!next) {
        // Nothing more to say: hold like the server would, until aborted.
        await new Promise((resolve, reject) => {
          signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
          win.release = resolve;
        });
      }

      if (next.status) {
        return { status: next.status, ok: false, json: async () => ({}) };
      }

      return { status: 200, ok: true, json: async () => next };
    },
    more(list) {
      pending.push(...list);
      win.release?.();
    },
  };

  return win;
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 20));

function reset() {
  calls.refresh.length = 0;
  calls.swap.length = 0;
  calls.ask.length = 0;
  fake.dockType = '';
  fake.dockTakes = true;
  fake.header = true;
  fake.feature = true;
  fake.instant = true;
  fake.refreshResult = true;
  fake.gate = null;
}

test('the first answer sets the baseline; a foreign change refreshes; an own change does not', async () => {
  reset();

  const win = fakeWindow([
    { markup: 'm1', build: 'b1', own: false },
    { markup: 'm1', build: 'b1', own: false },
    { markup: 'm2', build: 'b1', own: true },
    { markup: 'm3', build: 'b1', own: false },
  ]);

  ensureLpLiveReload(win);
  await tick();

  assert.equal(calls.refresh.length, 1, 'one refresh, for the foreign change only');
  assert.equal(win.urls[0], '/!/sve/live-reload', 'the first poll carries nothing');
  assert.equal(win.urls[1], '/!/sve/live-reload?markup=m1&build=b1');
  assert.equal(win.urls[3], '/!/sve/live-reload?markup=m2&build=b1', 'an own change is adopted');

  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});

test('a new build swaps the stylesheet into every page document', async () => {
  reset();

  const win = fakeWindow([
    { markup: 'm1', build: 'b1', own: false, css: '/build/assets/site-a.css' },
    { markup: 'm1', build: 'b2', own: false, css: '/build/assets/site-b.css' },
  ]);

  ensureLpLiveReload(win);
  await tick();

  assert.deepEqual(calls.swap, ['preview:/build/assets/site-b.css', 'copy:/build/assets/site-b.css']);
  assert.equal(calls.refresh.length, 0);

  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});

test('refused (signed out or switched off) → a long wait, no refresh', async () => {
  reset();

  const win = fakeWindow([{ status: 403 }, { markup: 'm1', build: 'b1', own: false }]);

  ensureLpLiveReload(win);
  await tick();

  assert.ok(win.delays.includes(30000), `waited 30 s after the refusal: ${win.delays}`);
  assert.equal(calls.refresh.length, 0);

  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});

test('nothing runs when the feature is off, and the loop ends when the header goes', async () => {
  reset();
  fake.feature = false;

  const off = fakeWindow([{ markup: 'm1', build: 'b1' }]);

  ensureLpLiveReload(off);
  await tick();
  assert.equal(off.urls.length, 0, 'no poll while the setting is off');

  fake.feature = true;

  const win = fakeWindow([{ markup: 'm1', build: 'b1' }, { markup: 'm1', build: 'b1' }]);

  ensureLpLiveReload(win);
  await tick();

  const polled = win.urls.length;

  fake.header = false;
  ensureLpLiveReload(win);
  win.more([{ markup: 'm9', build: 'b1', own: false }]);
  await tick();

  assert.equal(win.urls.length, polled, 'no poll after Live Preview closed');
  assert.equal(calls.refresh.length, 0, 'a change after the close is nobody\'s business');
});

test('a change that arrives while a refresh runs is refreshed once more after it', async () => {
  reset();

  let release;

  fake.gate = new Promise((resolve) => {
    release = resolve;
  });

  const win = fakeWindow([
    { markup: 'm1', build: 'b1' },
    { markup: 'm2', build: 'b1', own: false },
    { markup: 'm3', build: 'b1', own: false },
    { markup: 'm4', build: 'b1', own: false },
  ]);

  ensureLpLiveReload(win);
  await tick();

  assert.equal(calls.refresh.length, 1, 'the first refresh holds; the next changes wait on it');

  fake.gate = null;
  release();
  await tick();

  assert.equal(calls.refresh.length, 2, 'one more refresh for everything that came in meanwhile');

  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});

test("the button's own refresh running → ours waits and runs after", async () => {
  reset();
  fake.refreshResult = false;

  const win = fakeWindow([{ markup: 'm1', build: 'b1' }, { markup: 'm2', build: 'b1', own: false }]);

  ensureLpLiveReload(win);
  await tick();

  assert.ok(calls.refresh.length >= 1);
  assert.ok(win.delays.includes(500), `waits half a second before asking again: ${win.delays}`);

  fake.refreshResult = true;
  await tick();
  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});

test("a changed file the dock has open goes into the dock's panes as the file on disk; the render follows for every change", async () => {
  reset();
  fake.dockType = 'hero/style_2';

  const hero = 'resources/views/partials/page_sections/hero/style_2.antlers.html';
  const parts = (html) => ({ html, css: '', js: '', tw: '', locked: false });
  const win = fakeWindow([
    { markup: 'm1', build: 'b1' },
    { markup: 'm2', build: 'b1', own: false, changed: [{ path: hero, content: '<section>new</section>', parts: parts('<section>new</section>') }] },
    { markup: 'm3', build: 'b1', own: false, changed: [{ path: 'resources/views/partials/page_sections/other.antlers.html', content: '<section>x</section>', parts: parts('<section>x</section>') }] },
    { markup: 'm4', build: 'b1', own: false, changed: [{ path: hero, content: '<section>both</section>', parts: parts('<section>both</section>') }, { path: 'resources/views/layout.antlers.html', content: '<html></html>' }] },
    { markup: 'm5', build: 'b1', own: true, changed: [{ path: hero, content: '<section>own</section>', parts: parts('<section>own</section>') }] },
    { markup: 'm6', build: 'b1', own: false, changed: [{ path: hero, content: '', parts: parts('') }] },
    { markup: 'm7', build: 'b1', own: false, changed: [{ path: hero, content: '<section>raw</section>' }] },
  ]);

  ensureLpLiveReload(win);
  await tick();

  assert.deepEqual(
    calls.ask.filter(([what]) => what === 'dock:take-file').map(([, payload]) => [payload.type, payload.parts.html]),
    [['hero/style_2', '<section>new</section>'], ['hero/style_2', '<section>both</section>']],
    "the dock's file, twice; another file never; an own change never; an empty file never; a file without the server's split never"
  );
  assert.equal(calls.ask.filter(([what]) => what === 'dock:set-html').length, 0, 'the dock is never written to as if typed');
  assert.deepEqual(
    calls.refresh,
    [['hero/style_2'], null, null, null, null],
    'rendered for every foreign change: the hero alone when the dock took it; the whole page for another file, for the layout beside the hero, for the empty file and for a file without parts (the dock took none of those)'
  );

  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});

test('a dock that refuses the file (locked, another file, typing of its own) leaves it to the render', async () => {
  reset();
  fake.dockType = 'hero/style_2';
  fake.dockTakes = false;

  const win = fakeWindow([
    { markup: 'm1', build: 'b1' },
    { markup: 'm2', build: 'b1', own: false, changed: [{ path: 'resources/views/partials/page_sections/hero/style_2.antlers.html', content: '<section>new</section>', parts: { html: '<section>new</section>', css: '', js: '', tw: '' } }] },
    { markup: 'm3', build: 'b1', own: false, changed: null },
  ]);

  ensureLpLiveReload(win);
  await tick();

  assert.deepEqual(calls.refresh, [null, null], 'rendered both times, the whole page: the dock refused, and unknown files');

  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});

test('with the instant switch off the dock is never asked, and every change renders the whole page', async () => {
  reset();
  fake.dockType = 'hero/style_2';
  fake.instant = false;

  const hero = 'resources/views/partials/page_sections/hero/style_2.antlers.html';
  const win = fakeWindow([
    { markup: 'm1', build: 'b1' },
    { markup: 'm2', build: 'b1', own: false, changed: [{ path: hero, content: '<section>new</section>', parts: { html: '<section>new</section>', css: '', js: '', tw: '' } }] },
  ]);

  ensureLpLiveReload(win);
  await tick();

  assert.equal(calls.ask.filter(([what]) => what === 'dock:take-file' || what === 'dock:current-type').length, 0, 'the dock is not even asked what it shows');
  assert.deepEqual(calls.refresh, [null], 'one render of the whole page');

  fake.header = false;
  ensureLpLiveReload(win);
  await tick();
});
