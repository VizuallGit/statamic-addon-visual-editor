import assert from 'node:assert/strict';
import test from 'node:test';
import { alphaOf, withAlpha } from '../../resources/js/build-mode/color-alpha.js';

test('the alpha a class says', () => {
  assert.equal(alphaOf('bg-primary-300/50'), 50);
  assert.equal(alphaOf('max-lg:hover:bg-primary-300/5'), 5);
  assert.equal(alphaOf('bg-primary/[0.33]'), 33);
  assert.equal(alphaOf('bg-primary/[12.5%]'), 12.5);
  assert.equal(alphaOf('bg-primary-300'), null);
  assert.equal(alphaOf('bg-[url(/a/b.png)]'), null);
});

test('a class with an alpha; nothing, or all of it, is none', () => {
  assert.equal(withAlpha('bg-primary', '50'), 'bg-primary/50');
  assert.equal(withAlpha('bg-primary', '50%'), 'bg-primary/50');
  assert.equal(withAlpha('bg-primary', '0'), 'bg-primary/0');
  assert.equal(withAlpha('bg-primary', 33.4), 'bg-primary/33');
  assert.equal(withAlpha('bg-primary', ''), 'bg-primary');
  assert.equal(withAlpha('bg-primary', '100'), 'bg-primary');
  assert.equal(withAlpha('bg-primary', 'nej'), 'bg-primary');
});
