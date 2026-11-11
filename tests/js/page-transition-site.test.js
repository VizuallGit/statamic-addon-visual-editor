/**
 * page-transition-site.js — «Whole site» in Build → Animation → Page
 * transition: one state, read once, saved to the server.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SITE_DEFAULTS, SITE_STYLES, STYLE_DURATION, cleanDuration, saveSiteTransitions, siteTransitions } from '../../resources/js/page-transition-site.js';

const read = (path) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), 'utf8');

function fakeWin(answers) {
  const calls = [];

  return {
    calls,
    document: { querySelector: () => ({ getAttribute: () => 'token' }) },
    fetch: async (url, init = {}) => {
      calls.push({ url, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null });

      const answer = answers.shift();

      return { ok: answer.ok !== false, json: async () => answer.body };
    },
  };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

test('a duration is kept in seconds, inside 0.1–1.5, with two decimals', () => {
  assert.equal(cleanDuration('0,4'), 0.4);
  assert.equal(cleanDuration('9'), 1.5);
  assert.equal(cleanDuration(0), 0.1);
  assert.equal(cleanDuration('x'), SITE_DEFAULTS.duration);
  assert.deepEqual(SITE_STYLES, ['fade', 'crossfade', 'slide', 'none']);
});

test('picking a style sets a length long enough to see it, and the tile says so', () => {
  assert.deepEqual(STYLE_DURATION, { fade: 0.6, crossfade: 0.5, slide: 0.6, none: 0.25 });
  assert.match(read('resources/js/cp/surfaces/BuildPageTransition.vue'), /setSite\(\{ style: s, duration: STYLE_DURATION\[s\] \}\)/);
});

test('the state is read once, then a change is saved and follows what the server kept', async () => {
  const win = fakeWin([
    { body: { saved: false, settings: { enabled: true, style: 'crossfade', duration: 0.25, header: false } } },
    { body: { ok: true, saved: true, settings: { enabled: true, style: 'fade', duration: 0.4, header: false } } },
  ]);

  const state = siteTransitions(win);

  siteTransitions(win);
  await settle();

  assert.equal(win.calls.length, 1);
  assert.equal(state.status, 'ready');
  assert.equal(state.saved, false);

  await saveSiteTransitions({ style: 'fade', duration: '0,4' }, win);

  assert.deepEqual(win.calls[1], { url: '/!/sve/page-transitions', method: 'POST', body: { settings: { enabled: true, style: 'fade', duration: 0.4, header: false } } });
  assert.equal(state.saved, true);
  assert.equal(state.settings.style, 'fade');
  assert.equal(state.status, 'ready');
});

test('a refused save says so', async () => {
  const win = fakeWin([{ ok: false, body: null }]);

  await saveSiteTransitions({ enabled: false }, win);

  assert.equal(siteTransitions(win).status, 'failed');
});

test('the tile shows Whole site above This element, with every setting', () => {
  const tile = read('resources/js/cp/surfaces/BuildPageTransition.vue');

  assert.ok(tile.indexOf('data-sve-build-pt-site') < tile.indexOf("t('pt_element')"));

  for (const hook of ['data-sve-build-pt-site-enabled', 'data-sve-build-pt-site-style', 'data-sve-build-pt-site-duration', 'data-sve-build-pt-site-header']) {
    assert.ok(tile.includes(hook), hook);
  }

  const lang = read('resources/lang/en/build.php');

  for (const style of SITE_STYLES) {
    assert.match(lang, new RegExp(`'pt_style_${style}' =>`));
    assert.match(lang, new RegExp(`'pt_style_hint_${style}' =>`));
  }
});
