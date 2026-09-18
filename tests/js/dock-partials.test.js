import test from 'node:test';
import assert from 'node:assert/strict';
import { findPartials, hasToken } from '../../resources/js/dock-partials.js';

test('both spellings of a partial call are found, with their source name', () => {
  const html = `
    <div>{{ partial:components/card headline="Hi" }}</div>
    {{ partial src="blocks/{type}" }}
    {{# {{ partial:ignored/in-a-comment }} #}}
    {{ partial src='blocks/headline' }}
  `;

  assert.deepEqual(
    findPartials(html).map((item) => item.src),
    ['components/card', 'blocks/{type}', 'blocks/headline']
  );
});

test('a partial name with a token is a folder, not a file', () => {
  assert.equal(hasToken('blocks/{type}'), true);
  assert.equal(hasToken('components/{name}/card'), true);
  assert.equal(hasToken('components/card'), false);
  assert.equal(hasToken(''), false);
  assert.equal(hasToken(null), false);
});

test('a traversal is never a partial', () => {
  assert.deepEqual(findPartials('{{ partial src="../secrets" }}'), []);
});
