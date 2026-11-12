/**
 * image.js — an image's options read and written, and its picture: a crop per screen size.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  heightFor,
  imageAt,
  imageAttrs,
  pathAt,
  pictureSizes,
  ratioOf,
  readImage,
  readSources,
  withImageAttrs,
  withSource,
  withoutSource,
} from '../../../resources/js/build-mode/image.js';
import { siteImageOptions } from '../../../resources/js/build-mode/site-images.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
import { withAttribute } from '../../../resources/js/build-mode/attrs.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';

/** The site's three sizes, desktop first, as breakpoints() hands them over. */
const ROWS = [
  { handle: 'laptop', label: 'Desktop', base: true, min_px: 1024, media: '', media_px: '' },
  {
    handle: 'tablet',
    label: 'Tablet',
    base: false,
    min_px: 768,
    media: '(width < 64em)',
    media_px: '(max-width: 1023.98px)',
  },
  {
    handle: 'mobile',
    label: 'Mobile',
    base: false,
    min_px: 0,
    media: '(width < 48em)',
    media_px: '(max-width: 767.98px)',
  },
];
const SIZES = pictureSizes(ROWS);
const size = (handle) => SIZES.find((s) => s.handle === handle);

const IMG =
  '<div>\n    <img src="{{ media }}" alt="{{ media:alt | entities }}" width="1200" format="webp" quality="70" blur>\n</div>';

test("ratios: a width and a height are one of the shapes, Custom, or the image's own", () => {
  assert.equal(ratioOf(1200, 675), '16:9');
  assert.equal(ratioOf(768, 768), '1:1');
  assert.equal(ratioOf(1024, 768), '4:3');
  assert.equal(ratioOf(1000, 333), 'custom');
  assert.equal(ratioOf(1200, null), 'original');
  assert.equal(heightFor(1200, '16:9'), 675);
  assert.equal(heightFor(1200, 'original'), null);
});

test('the options are read off the tag, bare blur and priority among them', () => {
  const tree = parseTemplateTree(IMG);
  const img = imageAt(tree, '0:div/0:img').img;

  assert.deepEqual(readImage(IMG, img), {
    on: true,
    width: 1200,
    height: null,
    format: 'webp',
    quality: 70,
    blur: true,
    loading: 'lazy',
  });

  const plain = '<img src="/a.jpg" alt="" loading="eager">';
  assert.deepEqual(readImage(plain, parseTemplateTree(plain)[0]), {
    on: false,
    width: null,
    height: null,
    format: 'off',
    quality: null,
    blur: false,
    loading: 'eager',
  });

  const first = '<img src="/a.jpg" priority="true" blur="false" format="JPEG">';
  const read = readImage(first, parseTemplateTree(first)[0]);
  assert.equal(read.loading, 'first');
  assert.equal(read.blur, false);
  assert.equal(read.format, 'jpg');
});

test('a change to an image the site does not work on yet switches it on with WebP — loading does not', () => {
  const off = { on: false };

  assert.deepEqual(imageAttrs(off, { width: 800 }), { width: '800', format: 'webp', quality: '70' });
  assert.deepEqual(imageAttrs(off, { format: 'avif' }, 60), { format: 'avif', quality: '60' });
  assert.deepEqual(imageAttrs(off, { loading: 'first' }), { loading: null, priority: 'true' });
  assert.deepEqual(imageAttrs({ on: true }, { blur: false }), { blur: null });
  assert.deepEqual(imageAttrs({ on: true }, { format: 'off' }), { format: null, quality: null, blur: null });
  assert.deepEqual(Object.keys(imageAttrs({ on: false }, { blur: true, width: 10 })), [
    'width',
    'format',
    'quality',
    'blur',
  ]);
  assert.deepEqual(imageAttrs({ on: true }, { loading: 'eager' }), { loading: 'eager', priority: null });
});

test('the attributes land in the tag as Content writes them — blur bare', () => {
  const plain = '<img src="/a.jpg" alt="">';
  let html = plain;

  for (const [name, value] of Object.entries(imageAttrs({ on: false }, { blur: true }))) {
    html = withAttribute(html, parseTemplateTree(html)[0], name, value, { end: true });
  }

  assert.equal(html, '<img src="/a.jpg" alt="" format="webp" quality="70" blur>');
});

test('the sizes of a picture: all but the base, furthest from it first, each wide enough for its range', () => {
  assert.deepEqual(
    SIZES.map((s) => [s.handle, s.media, s.width]),
    [
      ['mobile', '(max-width: 767.98px)', 768],
      ['tablet', '(max-width: 1023.98px)', 1024],
    ]
  );

  // Mobile first: the base is the narrowest, the widest size comes first.
  const up = [
    { handle: 'laptop', base: false, min_px: 1024, media_px: '(min-width: 1024px)' },
    { handle: 'tablet', base: false, min_px: 768, media_px: '(min-width: 768px)' },
    { handle: 'mobile', base: true, min_px: 0, media_px: '' },
  ];
  assert.deepEqual(
    pictureSizes(up).map((s) => s.handle),
    ['laptop', 'tablet']
  );
});

test('a size of its own wraps an image on its own in a picture, indented as the file is', () => {
  const tree = parseTemplateTree(IMG);
  const found = imageAt(tree, '0:div/0:img');
  const { html, imgAt } = withSource(IMG, found, size('mobile'), SIZES, { height: 768 });

  assert.equal(
    html,
    '<div>\n    <picture>\n        <source media="(max-width: 767.98px)" width="768" height="768">\n        <img src="{{ media }}" alt="{{ media:alt | entities }}" width="1200" format="webp" quality="70" blur>\n    </picture>\n</div>'
  );

  const after = parseTemplateTree(html);
  assert.equal(pathAt(after, imgAt), '0:div/0:picture/1:img');
  assert.equal(imageAt(after, '0:div/0:picture').img.path, '0:div/0:picture/1:img');
  assert.equal(imageAt(after, '0:div/0:picture/0:source').img.path, '0:div/0:picture/1:img');
});

test('a second size goes in its place — mobile before tablet — and both are read back', () => {
  const one = withSource(IMG, imageAt(parseTemplateTree(IMG), '0:div/0:img'), size('tablet'), SIZES, {
    height: 768,
  }).html;
  const tree = parseTemplateTree(one);
  const { html, imgAt } = withSource(one, imageAt(tree, '0:div/0:picture/1:img'), size('mobile'), SIZES, {
    height: 768,
  });

  assert.match(
    html,
    /<source media="\(max-width: 767\.98px\)"[^>]*>\n {8}<source media="\(max-width: 1023\.98px\)" width="1024" height="768">\n {8}<img/
  );

  const after = parseTemplateTree(html);
  const found = imageAt(after, pathAt(after, imgAt));
  const sources = readSources(html, found.picture, SIZES, ROWS);

  assert.deepEqual(Object.keys(sources).sort(), ['mobile', 'tablet']);
  assert.equal(sources.tablet.width, 1024);
  assert.equal(sources.mobile.height, 768);
});

test('a source written with the em media query is the same size', () => {
  const html =
    '<picture><source media="(width < 48em)" width="600" height="600"><img src="/a.jpg" format="webp"></picture>';
  const found = imageAt(parseTemplateTree(html), '0:picture');

  assert.deepEqual(readSources(html, found.picture, SIZES, ROWS), {
    mobile: { path: '0:picture/0:source', width: 600, height: 600 },
  });
});

test('taking a size out removes its line; the last one out takes the picture with it', () => {
  const one = withSource(IMG, imageAt(parseTemplateTree(IMG), '0:div/0:img'), size('tablet'), SIZES, {
    height: 768,
  }).html;
  const two = withSource(one, imageAt(parseTemplateTree(one), '0:div/0:picture/1:img'), size('mobile'), SIZES, {
    height: 768,
  }).html;

  let tree = parseTemplateTree(two);
  let found = imageAt(tree, '0:div/0:picture');
  const less = withoutSource(two, tree, found, readSources(two, found.picture, SIZES, ROWS).mobile.path);

  assert.equal(less.html, one);
  assert.equal(pathAt(parseTemplateTree(less.html), less.imgAt), '0:div/0:picture/1:img');

  tree = parseTemplateTree(one);
  found = imageAt(tree, '0:div/0:picture');
  const none = withoutSource(one, tree, found, readSources(one, found.picture, SIZES, ROWS).tablet.path);

  assert.equal(none.html, IMG);
  assert.equal(pathAt(parseTemplateTree(none.html), none.imgAt), '0:div/0:img');
});

test('a picture with attributes of its own stays when its last size goes', () => {
  const html =
    '<picture class="block"><source media="(max-width: 767.98px)" width="768"><img src="/a.jpg" format="webp"></picture>';
  const tree = parseTemplateTree(html);
  const found = imageAt(tree, '0:picture');

  assert.equal(
    withoutSource(html, tree, found, '0:picture/0:source').html,
    '<picture class="block"><img src="/a.jpg" format="webp"></picture>'
  );
});

test('on one line, the picture stays on one line', () => {
  const html = '<p><img src="/a.jpg" format="webp"> text</p>';
  const { html: out } = withSource(html, imageAt(parseTemplateTree(html), '0:p/0:img'), size('mobile'), SIZES);

  assert.equal(
    out,
    '<p><picture><source media="(max-width: 767.98px)" width="768"><img src="/a.jpg" format="webp"></picture> text</p>'
  );
});

test("the site's word decides: no sveImageOptions, no options", () => {
  assert.equal(siteImageOptions({}), null);
  assert.equal(siteImageOptions({ Statamic: { $config: { get: () => ({ formats: ['webp'] }) } } }).formats[0], 'webp');
  assert.equal(findByPath(parseTemplateTree(IMG), '0:div/0:img').tag, 'img');
});

test("the options stand in one order at the tag's end, whatever was there before", () => {
  const html = '<div><img src="/a.jpg" alt="" width="1200" format="webp" quality="70" blur class="w-full"></div>';
  const out = withImageAttrs(html, parseTemplateTree, '0:div/0:img', imageAttrs({ on: true }, { height: 675 }));

  assert.equal(
    out,
    '<div><img src="/a.jpg" alt="" class="w-full" width="1200" height="675" format="webp" quality="70" blur></div>'
  );
  assert.equal(
    withImageAttrs(out, parseTemplateTree, '0:div/0:img', imageAttrs({ on: true }, { blur: false, loading: 'first' })),
    '<div><img src="/a.jpg" alt="" class="w-full" width="1200" height="675" format="webp" quality="70" priority="true"></div>'
  );
  assert.equal(
    withImageAttrs(out, parseTemplateTree, '0:div/0:img', imageAttrs({ on: true }, { format: 'off' })),
    '<div><img src="/a.jpg" alt="" class="w-full" width="1200" height="675"></div>'
  );
});
