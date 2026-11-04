/**
 * build-mode/container-query.js — the container query demo: which variants are
 * container sizes, and which ancestor a size query asks.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTAINER_SIZES,
  containerVariant,
  contentWidthRem,
  isContainerVariant,
  sizeContainerOf,
} from '../../../resources/js/build-mode/container-query.js';

/** An element as far as the reader goes: a parent, a computed style, a width. */
function fakeTree(styles) {
  const view = { getComputedStyle: (el) => el.style };
  const doc = { defaultView: view, documentElement: { style: { fontSize: '16px' } } };
  let parent = null;

  return styles.map((style) => {
    const el = { tagName: 'DIV', parentElement: parent, ownerDocument: doc, style, clientWidth: style.clientWidth || 0 };

    parent = el;

    return el;
  });
}

test('the row writes under a size, widest first, as the breakpoints are desktop-first', () => {
  assert.deepEqual(CONTAINER_SIZES.map((size) => size.rem), [48, 36, 28, 20]);
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

test('the width a query measures is the content box, in the frame\'s rem', () => {
  const [box] = fakeTree([{ clientWidth: 416, paddingLeft: '16px', paddingRight: '16px' }]);

  assert.equal(contentWidthRem(box), 24);
});
