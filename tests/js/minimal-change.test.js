import test from 'node:test';
import assert from 'node:assert/strict';
import { minimalChange } from '../../resources/js/lib/minimal-change.js';

const apply = (before, [from, to, insert]) => before.slice(0, from) + insert + before.slice(to);

test('only the differing span is replaced', () => {
  const before = '<h2 class="mb-400">Hej</h2>';
  const after = '<h2 class="mb-400 text-600">Hej</h2>';

  assert.deepEqual(minimalChange(before, after), [17, 17, ' text-600']);
  assert.equal(apply(before, minimalChange(before, after)), after);
});

test('a removal, a prefix change and identical texts', () => {
  assert.deepEqual(minimalChange('a b c', 'a c'), [2, 4, '']);
  assert.deepEqual(minimalChange('xyz', 'Xyz'), [0, 1, 'X']);
  assert.deepEqual(minimalChange('same', 'same'), [4, 4, '']);
  assert.deepEqual(minimalChange('', 'new'), [0, 0, 'new']);
});

test('the round trip always reproduces the new text', () => {
  for (const [a, b] of [['abcabc', 'abcXabc'], ['aaaa', 'aa'], ['<p>x</p>', '<p class="y">x</p>'], ['tail', 'head tail']]) {
    assert.equal(apply(a, minimalChange(a, b)), b, `${a} → ${b}`);
  }
});
