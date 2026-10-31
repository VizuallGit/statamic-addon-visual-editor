/**
 * lib/media-placeholder.js — the box for an image or a video with no file: only
 * CSS, the element's own classes above its size, and the words in the picture.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { isEmptyMedia, mediaPlaceholderCss } from '../../resources/js/lib/media-placeholder.js';

const css = mediaPlaceholderCss({ image: 'Billede', video: 'Video', hint: 'Klik & vælg' });

test('the size stands above Tailwind\'s reset and below its utilities', () => {
  assert.match(css.base, /^@layer theme,base,sve-media-base,components,utilities;/);
  assert.match(css.base, /width:100%/);
  assert.doesNotMatch(css.own, /width:100%|height:/);
});

test('each kind says what it is, in the words it was given, escaped', () => {
  const words = [...css.own.matchAll(/data:image\/svg\+xml,([^"]+)/g)].map((m) => decodeURIComponent(m[1])).join('');

  assert.match(words, />Billede</);
  assert.match(words, />Video</);
  assert.match(words, />Klik &amp; vælg</);
});

test('the test asks the same selector the sheet is written with', () => {
  let asked = '';

  assert.equal(isEmptyMedia({ matches: (selector) => ((asked = selector), true) }), true);
  assert.ok(css.base.includes(asked));
  assert.equal(isEmptyMedia(null), false);
});
