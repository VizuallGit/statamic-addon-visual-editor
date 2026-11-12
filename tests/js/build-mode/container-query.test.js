/**
 * build-mode/container-query.js — the container query demo: which variants are
 * container sizes, and which ancestor a size query asks.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTAINER_SIZES,
  containerLength,
  containerRem,
  containerVariant,
  contentWidthRem,
  customContainerVariant,
  customSizesIn,
  isContainerVariant,
  sizeContainerOf,
  widerContainerSizes,
} from '../../../resources/js/build-mode/container-query.js';

/** An element as far as the reader goes: a parent, a computed style, a width. */
function fakeTree(styles) {
  const view = { getComputedStyle: (el) => el.style };
  const doc = { defaultView: view, documentElement: { style: { fontSize: '16px' } } };
  let parent = null;

  return styles.map((style) => {
    const el = {
      tagName: 'DIV',
      parentElement: parent,
      ownerDocument: doc,
      style,
      clientWidth: style.clientWidth || 0,
    };

    parent = el;

    return el;
  });
}

test('the row writes under a size, widest first, as the breakpoints are desktop-first', () => {
  assert.deepEqual(
    CONTAINER_SIZES.map((size) => size.rem),
    [48, 36, 28, 20]
  );
  assert.equal(containerVariant('md'), '@max-md');
});

test('a container size is told from a screen size, a state and the @container utility', () => {
  assert.equal(isContainerVariant('@max-md'), true);
  assert.equal(isContainerVariant('@max-[30rem]'), true);
  assert.equal(isContainerVariant('max-md'), false);
  assert.equal(isContainerVariant('hover'), false);
  assert.equal(isContainerVariant('@container'), false);
  assert.equal(isContainerVariant(''), false);
});

test('hand-written container sizes are sizes too: min-width and named forms, never the utility', () => {
  for (const part of [
    '@md',
    '@3xl',
    '@min-md',
    '@min-[30rem]',
    '@[30rem]',
    '@max-md/card',
    '@md/card',
    '@min-[30rem]/main',
  ]) {
    assert.equal(isContainerVariant(part), true, part);
  }

  for (const part of ['@container', '@container/card', '@container-normal', 'md', 'min-[30rem]', '@max-md:hover']) {
    assert.equal(isContainerVariant(part), false, part);
  }
});

test('a container variant names its rem: the scale, or an arbitrary rem or em', () => {
  assert.equal(containerRem('@max-md'), 28);
  assert.equal(containerRem('@max-3xs'), 16);
  assert.equal(containerRem('@max-7xl'), 80);
  assert.equal(containerRem('@max-[30rem]'), 30);
  assert.equal(containerRem('@max-[22.5em]'), 22.5);
  assert.equal(containerRem('@md'), 28);
  assert.equal(containerRem('@max-md/card'), 28);
  assert.equal(containerRem('@max-[960px]'), null);
  assert.equal(containerRem('@max-huge'), null);
  assert.equal(containerRem('max-md'), null);
  assert.equal(containerLength('@max-xl'), '36rem');
  assert.equal(containerLength('@max-[22.5em]'), '22.5em');
});

test('the wider named sizes a @max size reads through, nearest first', () => {
  assert.deepEqual(widerContainerSizes('@max-2xl'), ['@max-3xl', '@max-4xl', '@max-5xl', '@max-6xl', '@max-7xl']);
  assert.deepEqual(widerContainerSizes('@max-[30rem]').slice(0, 3), ['@max-lg', '@max-xl', '@max-2xl']);
  assert.deepEqual(widerContainerSizes('@max-7xl'), []);
  assert.deepEqual(widerContainerSizes('@md'), []);
  assert.deepEqual(widerContainerSizes('@max-md/card'), []);
});

test('a size of its own is rem or em only', () => {
  assert.equal(customContainerVariant('30rem'), '@max-[30rem]');
  assert.equal(customContainerVariant(' 22.5em '), '@max-[22.5em]');

  for (const text of ['30px', '30', 'rem', '.5rem', '30 rem', '-3rem', '30rem;', '']) {
    assert.equal(customContainerVariant(text), null, text);
  }
});

test('the arbitrary sizes a class list already writes under', () => {
  assert.deepEqual(
    customSizesIn([
      '@max-[30rem]:pt-6',
      'hover:@max-[30rem]:pt-2',
      '@max-[22.5em]:hover:p-1',
      '@max-md:pt-4',
      'pt-[1rem]',
    ]),
    ['@max-[30rem]', '@max-[22.5em]']
  );
  assert.deepEqual(customSizesIn([]), []);
});

test('a size query asks the nearest inline-size or size ancestor, never the element itself', () => {
  const [outer, normal, inner, child] = fakeTree([
    { containerType: 'size' },
    { containerType: 'normal' },
    { containerType: 'inline-size' },
    { containerType: 'inline-size' },
  ]);

  assert.equal(sizeContainerOf(child), inner);
  assert.equal(sizeContainerOf(inner), outer);
  assert.equal(sizeContainerOf(normal), outer);
  assert.equal(sizeContainerOf(outer), null);
});

test("the width a query measures is the content box, in the frame's rem", () => {
  const [box] = fakeTree([{ clientWidth: 416, paddingLeft: '16px', paddingRight: '16px' }]);

  assert.equal(contentWidthRem(box), 24);
});
