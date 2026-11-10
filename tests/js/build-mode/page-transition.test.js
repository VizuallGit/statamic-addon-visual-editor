/**
 * build-mode/page-transition.js — Build's «Page transition»: the name and
 * motion in an element's style, the id it matches by, and the tag that turns
 * page transitions on for the page.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
import { KEYS, MOTION_BASE, TAG, cleanPair, defaultPair, keyFor, motionPath, pageTransitionOf, withPageTransition } from '../../../resources/js/build-mode/page-transition.js';

const read = (path) => readFileSync(fileURLToPath(new URL(`../../../${path}`, import.meta.url)), 'utf8');

const LIST = `<section class="cases">
  <h2>Cases</h2>
  {{ collection:cases }}
    <article>
      <figure class="overflow-clip"><img src="{{ image }}" alt=""></figure>
      <h3>{{ title }}</h3>
    </article>
  {{ /collection:cases }}
</section>
`;

const PAGE = `<section class="case-hero">
  <figure class="overflow-clip" style="aspect-ratio: 21 / 9"><img src="{{ image }}" alt=""></figure>
  <h1>{{ title }}</h1>
</section>
`;

/** The first element with this tag, in document order. */
function find(html, tag) {
  const walk = (nodes) => {
    for (const node of nodes) {
      if (!node.kind && node.tag === tag) {
        return node;
      }

      const hit = walk(node.children || []);

      if (hit) {
        return hit;
      }
    }

    return null;
  };

  return walk(parseTemplateTree(html));
}

const at = (html, tag) => pageTransitionOf(html, find(html, tag));

test('an element in a loop over entries matches by the loop\'s id; one outside a loop by the page\'s', () => {
  assert.equal(keyFor(LIST, find(LIST, 'figure').path), KEYS.loop);
  assert.equal(keyFor(LIST, find(LIST, 'h2').path), KEYS.page);
  assert.equal(keyFor(PAGE, find(PAGE, 'figure').path), KEYS.page);
});

test('a page transition is written into the style, read back, and the tag follows the markup', () => {
  const next = withPageTransition(LIST, find(LIST, 'figure').path, { pair: 'image', key: KEYS.loop, motion: 'spring' });

  assert.match(next, /<figure class="overflow-clip" style="view-transition-name: image-\{\{ id \}\}; view-transition-class: spring">/);
  assert.deepEqual(at(next, 'figure'), { pair: 'image', key: KEYS.loop, motion: 'spring' });
  assert.ok(next.trimEnd().endsWith(TAG));
  assert.equal(next.split(TAG).length, 2);
});

test('the element\'s own declarations stay, and the pair on the other page reads the same', () => {
  const next = withPageTransition(PAGE, find(PAGE, 'figure').path, { pair: 'image', key: KEYS.page, motion: 'smooth' });

  assert.match(next, /style="aspect-ratio: 21 \/ 9; view-transition-name: image-\{\{ page:id \}\}; view-transition-class: smooth"/);
  assert.deepEqual(at(next, 'figure'), { pair: 'image', key: KEYS.page, motion: 'smooth' });
});

test('taking it off leaves the rest of the style, and the tag goes with the last one', () => {
  let html = withPageTransition(PAGE, find(PAGE, 'figure').path, { pair: 'image', key: KEYS.page, motion: 'spring' });
  html = withPageTransition(html, find(html, 'h1').path, { pair: 'title', key: KEYS.page, motion: 'snappy' });
  html = withPageTransition(html, find(html, 'figure').path, null);

  assert.match(html, /<figure class="overflow-clip" style="aspect-ratio: 21 \/ 9">/);
  assert.equal(at(html, 'figure'), null);
  assert.ok(html.includes(TAG), 'the title still flies');

  html = withPageTransition(html, find(html, 'h1').path, null);

  assert.match(html, /<h1>\{\{ title \}\}<\/h1>/);
  assert.ok(!html.includes('sve_page_transition'));
});

test('a pair name is written as a name can take it, and starts from what the element shows', () => {
  assert.equal(cleanPair('My Image!'), 'my-image');
  assert.equal(cleanPair('9 lives'), 'lives');
  assert.equal(cleanPair(''), '');
  assert.equal(defaultPair({ tag: 'img' }), 'image');
  assert.equal(defaultPair({ tag: 'figure' }), 'image');
  assert.equal(defaultPair({ tag: 'h3' }), 'title');
  assert.equal(defaultPair({ tag: 'div' }), 'element');

  const next = withPageTransition(PAGE, find(PAGE, 'h1').path, { pair: 'Big Title', key: KEYS.page, motion: 'spring' });

  assert.equal(at(next, 'h1').pair, 'big-title');
});

test('an element with no name, or `none`, has no page transition', () => {
  assert.equal(at(PAGE, 'figure'), null);
  assert.equal(at('<div style="view-transition-name: none"></div>', 'div'), null);
});

test('the motions\' curves: spring goes past the line it ends on, smooth and snappy do not', () => {
  const ys = (d) => [...d.matchAll(/[ML][\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]));
  const line = Number(/M4 ([\d.]+)H96/.exec(MOTION_BASE)[1]);

  assert.ok(Math.min(...ys(motionPath('spring'))) < line - 1);
  assert.ok(Math.min(...ys(motionPath('smooth'))) >= line - 0.01);
  assert.ok(Math.min(...ys(motionPath('snappy'))) >= line - 0.01);
});

test('the tile stands after Follow the mouse, and the tag is registered with the CSS it pushes', () => {
  const tab = read('resources/js/cp/surfaces/BuildAnimation.vue');

  assert.match(tab, /const TILES = \[\.\.\.KINDS, 'page'\]/);
  assert.match(tab, /<BuildPageTransition v-if="gallery === 'page'"/);
  assert.match(read('src/ServiceProvider.php'), /SvePageTransition::class,/);

  const css = read('resources/animation/page-transition.css');

  assert.match(css, /@view-transition \{\s*navigation: auto;/);

  for (const motion of ['smooth', 'spring', 'snappy']) {
    assert.match(css, new RegExp(`::view-transition-group\\(\\*\\.${motion}\\)`));
  }

  assert.match(css, /@media \(prefers-reduced-motion\)/);
});
