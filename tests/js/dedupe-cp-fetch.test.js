import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../resources/js/dedupe-cp-fetch.js', import.meta.url), 'utf8');

/**
 * Just enough window for the script under test: it reads window.fetch when it
 * runs, replaces it, and listens on its own window. `above` is the page the
 * frame sits in; without it this is a CP page that is not in an iframe.
 */
function cpWindow(bodyFor, above = null) {
  const listeners = new Map();
  const asked = [];
  const win = {
    listeners,
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

  win.parent = above ?? win;
  win.top = above?.top ?? win;

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

  assert.deepEqual(
    await (await win.fetch(SWATCHES)).json(),
    ['new'],
    'the theme panel saved, so the body kept here was stale'
  );
  assert.equal(asked.length, 2, 'exactly one more GET — the cache is dropped, not disabled');

  assert.deepEqual(await (await win.fetch(SWATCHES)).json(), ['new']);
  assert.equal(asked.length, 2, 'and it caches again from there');
});

test('saving site.css leaves the iconify config alone', async () => {
  const ICONIFY = 'https://site.test/cp/iconify/config';
  const { win, asked } = cpWindow((url, nth) =>
    JSON.stringify([url.includes('iconify') ? `icons-${nth}` : `swatches-${nth}`])
  );

  await win.fetch(ICONIFY);
  win.dispatchEvent({ type: 'sve:site-css-saved' });

  assert.deepEqual(await (await win.fetch(ICONIFY)).json(), ['icons-1']);
  assert.equal(asked.length, 1, 'the colours moved, the icons did not');
});

test('in a frame it listens on its own window, never on the page above', async () => {
  const above = cpWindow(() => '[]').win;
  const before = above.listeners.get('sve:site-css-saved').size;
  const { win, asked } = cpWindow((url, nth) => JSON.stringify([nth === 1 ? 'old' : 'new']), above);

  assert.equal(
    above.listeners.get('sve:site-css-saved').size,
    before,
    'a listener left on the page above holds the frame after it is removed: every closed Live Preview stayed in memory'
  );

  await win.fetch(SWATCHES);
  above.dispatchEvent({ type: 'sve:site-css-saved' });
  assert.deepEqual(await (await win.fetch(SWATCHES)).json(), ['old'], 'the page above is not listened to');

  // What reaches the frame is the event the page above passes down (lib/site-css-saved.js).
  win.dispatchEvent({ type: 'sve:site-css-saved' });
  assert.deepEqual(await (await win.fetch(SWATCHES)).json(), ['new']);
  assert.equal(asked.length, 2);
});
