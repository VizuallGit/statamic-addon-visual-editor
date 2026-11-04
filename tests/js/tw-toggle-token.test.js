/**
 * tw-parse.js `toggleToken`: a bare class on or off in a class value — what
 * Build mode's container switch writes on the parent (`@container`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toggleToken } from '../../resources/js/tw-parse.js';

test('a bare class missing is added at the end', () => {
  assert.equal(toggleToken('', '@container'), '@container');
  assert.equal(toggleToken('grid gap-4', '@container'), 'grid gap-4 @container');
});

test('a bare class there is taken off, wherever it stands', () => {
  assert.equal(toggleToken('grid @container gap-4', '@container'), 'grid gap-4');
  assert.equal(toggleToken('grid gap-4 @container', '@container'), 'grid gap-4');
  assert.equal(toggleToken('@container grid', '@container'), 'grid');
  assert.equal(toggleToken('@container', '@container'), '');
});

test('only the bare class counts: a named container or a variant is another class', () => {
  assert.equal(toggleToken('@container/card grid', '@container'), '@container/card grid @container');
  assert.equal(toggleToken('@max-md:p-4', '@container'), '@max-md:p-4 @container');
});
