/**
 * gallery.js and whole.js — a gallery read from the file, written back, and one thing to a click.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isGallery, readGallery, withGalleryField, withGalleryImages } from '../../../resources/js/build-mode/gallery.js';
import { isWhole, wholeOwner } from '../../../resources/js/build-mode/whole.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const first = (html) => parseTemplateTree(html)[0];
const OWN = '<div class="grid grid-cols-3 gap-4">\n    <img src="/a.jpg" alt="" class="w-full">\n    <img src="/b.jpg" alt="" class="w-full">\n</div>';
const LOOP = '<div class="grid grid-cols-2">\n    {{ galleri }}\n        <img src="{{ url }}" alt="{{ alt | entities }}">\n    {{ /galleri }}\n</div>';

test('a grid of images, or of one looped image, is a gallery', () => {
  assert.equal(isGallery(OWN, first(OWN)), true);
  assert.equal(isGallery(LOOP, first(LOOP)), true);
});

test('anything else is not', () => {
  for (const html of ['<div class="grid"><img src=""><p>x</p></div>', '<div class="grid"></div>', '<div><img src=""></div>', '<section class="grid"><img src=""></section>', '<div class="grid">{{ items }}<p>x</p>{{ /items }}</div>']) {
    assert.equal(isGallery(html, first(html)), false, html);
  }
});

test('it reads its images or its field', () => {
  assert.deepEqual(readGallery(OWN, first(OWN)), { field: null, urls: ['/a.jpg', '/b.jpg'] });
  assert.deepEqual(readGallery(LOOP, first(LOOP)), { field: 'galleri', urls: [] });
});

test('images are written with the first one\'s classes and the asset\'s alt', () => {
  const out = withGalleryImages(OWN, first(OWN), ['/c.jpg']);

  assert.match(out, /^<div class="grid grid-cols-3 gap-4">\n    <img src="\/c\.jpg" alt="[^\n]*\/c\.jpg[^\n]*" class="w-full">\n<\/div>$/);
  assert.equal(isGallery(out, first(out)), true);
});

test('with no images left it stays a gallery', () => {
  const out = withGalleryImages(OWN, first(OWN), []);

  assert.equal(out, '<div class="grid grid-cols-3 gap-4">\n    <img src="" alt="" class="w-full">\n</div>');
  assert.equal(isGallery(out, first(out)), true);
});

test('a field makes the loop; no field brings an empty gallery back', () => {
  const out = withGalleryField(OWN, first(OWN), '{{ galleri }}');

  assert.equal(out, '<div class="grid grid-cols-3 gap-4">\n    {{ galleri }}\n        <img src="{{ url }}" alt="{{ alt | entities }}" class="w-full">\n    {{ /galleri }}\n</div>');
  assert.equal(readGallery(out, first(out)).field, 'galleri');
  assert.equal(withGalleryField(out, first(out), ''), '<div class="grid grid-cols-3 gap-4">\n    <img src="" alt="" class="w-full">\n</div>');
});

test('indented in a file it keeps its indent', () => {
  const html = '<section>\n    <div class="grid">\n        <img src="/a.jpg" alt="">\n    </div>\n</section>';
  const node = first(html).children[0];

  assert.equal(withGalleryField(html, node, '{{ g }}'), '<section>\n    <div class="grid">\n        {{ g }}\n            <img src="{{ url }}" alt="{{ alt | entities }}">\n        {{ /g }}\n    </div>\n</section>');
});

test('a click on an image in it picks the gallery; rich text is one thing too', () => {
  const html = `<section>${OWN}<div class="prose"><p>x</p></div><img src="/alone.jpg" alt=""></section>`;
  const [gallery, rich, alone] = first(html).children;

  assert.equal(wholeOwner(html, gallery.children[0].path), gallery.path);
  assert.equal(wholeOwner(html, rich.children[0].path), rich.path);
  assert.equal(wholeOwner(html, alone.path), '');
  assert.equal(isWhole(html, gallery), true);
  assert.equal(isWhole(html, alone), false);
});
