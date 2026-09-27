import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../resources/js/dedupe-cp-fetch.js', import.meta.url), 'utf8');

/**
 * Just enough window for the script under test: it reads window.fetch when it
 * runs, replaces it, and listens on window/parent/top — here all the same one,
 * as in a CP page that is not in an iframe.
 */
function cpWindow(bodyFor) {
  const listeners = new Map();
  const asked = [];
  const win = {
    location: { origin: 'https://site.test' },
    addEventListener(type, fn) {
      const set = listeners.get(type) ?? new Set();
      set.add(fn);
      listeners.set(type, set);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent(event) {
      [...(listeners.get(event.type) ?? [])].forEach((fn) => fn(event));
    },
    fetch(url) {
      asked.push(url);

      return Promise.resolve(new Response(bodyFor(url, asked.length)));
    },
  };

  win.parent = win;
  win.top = win;

  new Function('window', 'Response', 'URL', SOURCE)(win, Response, URL);

  return { win, asked };
}

const SWATCHES = 'https://site.test/cp/color-scheme/swatches';

test('the same swatch request is one GET, however many fields ask', async () => {
  const { win, asked } = cpWindow(() => '["old"]');

  const [a, b] = await Promise.all([win.fetch(SWATCHES), win.fetch(SWATCHES)]);
  const c = await win.fetch(SWATCHES);

  assert.equal(asked.length, 1);
  assert.deepEqual(await a.json(), ['old']);
  assert.deepEqual(await b.json(), ['old']);
  assert.deepEqual(await c.json(), ['old']);
});

test('a saved site.css drops the palette, so the next field is served the new colours', async () => {
  const { win, asked } = cpWindow((url, nth) => JSON.stringify([nth === 1 ? 'old' : 'new']));

  assert.deepEqual(await (await win.fetch(SWATCHES)).json(), ['old']);

  win.dispatchEvent({ type: 'sve:site-css-saved' });

  assert.deepEqual(await (await win.fetch(SWATCHES)).json(), ['new'], 'the theme panel saved, so the body kept here was stale');
  assert.equal(asked.length, 2, 'exactly one more GET — the cache is dropped, not disabled');

  assert.deepEqual(await (await win.fetch(SWATCHES)).json(), ['new']);
  assert.equal(asked.length, 2, 'and it caches again from there');
});

test('saving site.css leaves the iconify config alone', async () => {
  const ICONIFY = 'https://site.test/cp/iconify/config';
  const { win, asked } = cpWindow((url, nth) => JSON.stringify([url.includes('iconify') ? `icons-${nth}` : `swatches-${nth}`]));

  await win.fetch(ICONIFY);
  win.dispatchEvent({ type: 'sve:site-css-saved' });

  assert.deepEqual(await (await win.fetch(ICONIFY)).json(), ['icons-1']);
  assert.equal(asked.length, 1, 'the colours moved, the icons did not');
});
