/**
 * video.js — a video's options read off the tag and written back, and its poster following its file.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isFramePoster, posterFor, posterOnNewFile, ratioClass, ratioOfClasses, readVideo, videoAttrs } from '../../../resources/js/build-mode/video.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
import { withAttribute } from '../../../resources/js/build-mode/attrs.js';

const first = (html) => parseTemplateTree(html)[0];

test('the options are read off the tag — bare switches, preload, poster, shape', () => {
  const html = '<video src="{{ media }}" class="w-full aspect-video object-cover" autoplay muted playsinline loop preload="metadata" poster="{{ media | video_poster }}"></video>';

  assert.deepEqual(readVideo(html, first(html)), {
    ratio: '16:9',
    autoplay: true,
    loop: true,
    muted: true,
    controls: false,
    preload: 'metadata',
    poster: '{{ media | video_poster }}',
    first: false,
  });

  const plain = '<video src="" controls playsinline priority="true"></video>';
  const read = readVideo(plain, first(plain));

  assert.equal(read.controls, true);
  assert.equal(read.preload, 'default');
  assert.equal(read.poster, null);
  assert.equal(read.first, true);
  assert.equal(read.ratio, 'auto');
});

test('shapes are Style\'s classes', () => {
  assert.equal(ratioOfClasses('aspect-[4/3] object-cover'), '4:3');
  assert.equal(ratioOfClasses('aspect-[16/9]'), '16:9');
  assert.equal(ratioOfClasses('max-md:aspect-square'), 'auto');
  assert.equal(ratioClass('9:16'), 'aspect-[9/16]');
  assert.equal(ratioClass('auto'), '');
});

test('autoplay brings muted and playsinline; off leaves them; preload default is no attribute', () => {
  assert.deepEqual(videoAttrs({ autoplay: true }), { autoplay: true, muted: true, playsinline: true });
  assert.deepEqual(videoAttrs({ autoplay: false }), { autoplay: null });
  assert.deepEqual(videoAttrs({ controls: false, loop: true }), { loop: true, controls: null });
  assert.deepEqual(videoAttrs({ preload: 'default' }), { preload: null });
  assert.deepEqual(videoAttrs({ preload: 'none' }), { preload: 'none' });
  assert.deepEqual(videoAttrs({ first: true }), { priority: 'true' });
});

test('switches land bare in the tag', () => {
  let html = '<video src="/v.mp4" controls></video>';

  for (const [name, value] of Object.entries(videoAttrs({ autoplay: true, loop: true }))) {
    html = withAttribute(html, first(html), name, value, { end: true });
  }

  assert.equal(html, '<video src="/v.mp4" controls autoplay muted playsinline loop></video>');
});

test('the poster is the file\'s own frame: by its field, or by its address', () => {
  assert.equal(posterFor('{{ media }}'), '{{ media | video_poster }}');
  assert.equal(posterFor('/assets/film.mp4'), "{{ '/assets/film.mp4' | video_poster }}");
  assert.equal(posterFor(''), null);
  assert.equal(posterFor('{{ a }}/{{ b }}'), null);
  assert.ok(isFramePoster('{{ media | video_poster }}'));
  assert.ok(isFramePoster("{{ '/x.mp4' | video_poster:30:webp }}"));
  assert.ok(!isFramePoster('/assets/poster.jpg'));
});

test('the poster follows the file; a first file brings it; one by hand, or switched off, is left', () => {
  assert.equal(posterOnNewFile('{{ clip }}', '{{ media }}', '{{ media | video_poster }}'), '{{ clip | video_poster }}');
  assert.equal(posterOnNewFile('', '{{ media }}', '{{ media | video_poster }}'), null);
  assert.equal(posterOnNewFile('/assets/a.mp4', '', null), "{{ '/assets/a.mp4' | video_poster }}");
  assert.equal(posterOnNewFile('/assets/a.mp4', '/assets/b.mp4', null), undefined);
  assert.equal(posterOnNewFile('/assets/a.mp4', '', '/my-poster.jpg'), undefined);
});
