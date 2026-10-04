import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruneBracketCss, removeBlankCssClassRule } from '../../resources/js/css-scope.js';

const file = [
  '.card {',
  '  padding: 1rem;',
  '}',
  '.card .title {',
  '  font-weight: 700;',
  '}',
  '.test {',
  '}',
  '',
].join('\n');

test('a [ name ] taken off its tag keeps the CSS that was written for it', () => {
  assert.equal(pruneBracketCss(file, [], ['card', 'test']), '.card {\n  padding: 1rem;\n}\n.card .title {\n  font-weight: 700;\n}\n');
});

test('only the blank rule the bracket sync wrote goes with the name', () => {
  assert.equal(removeBlankCssClassRule('.a {\n}\n.b {\n  color: red;\n}\n.a {\n   \n}\n', 'a'), '.b {\n  color: red;\n}\n');
  assert.equal(removeBlankCssClassRule('.a {\n  color: red;\n}\n', 'a'), '.a {\n  color: red;\n}\n');
});

test('names still on a tag are never touched', () => {
  assert.equal(pruneBracketCss(file, ['test'], ['card', 'test']), file);
});
