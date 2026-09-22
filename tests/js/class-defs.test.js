import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fillClassRule } from '../../resources/js/css-scope.js';

test('fills the empty rule the bracket sync made', () => {
  assert.equal(
    fillClassRule('.tttt {\n}\n', 'tttt', 'background-color: rød;\npadding: 20rem;'),
    '.tttt {\n  background-color: rød;\n  padding: 20rem;\n}\n'
  );
});

test('keeps what the rule has and adds only the lines it lacks — in front, so the file\'s own win', () => {
  assert.equal(
    fillClassRule('.a {\n    color: red;\n}\n', 'a', 'color: red\ngap: 1rem'),
    '.a {\n    gap: 1rem;\n    color: red;\n}\n'
  );
});

test('declarations go before the rules the dock nests inside', () => {
  assert.equal(
    fillClassRule('.tttt {\n    .content {\n        z-index: 10;\n    }\n}\n', 'tttt', 'padding: 20rem;'),
    '.tttt {\n    padding: 20rem;\n    .content {\n        z-index: 10;\n    }\n}\n'
  );
});

test('writes nothing when every line is already there', () => {
  const css = '.a {\n  color: red;\n}\n';

  assert.equal(fillClassRule(css, 'a', 'color: red;'), css);
  assert.equal(fillClassRule(css, 'a', ''), css);
});

test('appends a rule when the file has none for the name', () => {
  assert.equal(fillClassRule('.b { x: 1; }\n', 'a', 'gap: 1rem;'), '.b { x: 1; }\n\n.a {\n  gap: 1rem;\n}\n');
  assert.equal(fillClassRule('', 'a', 'gap: 1rem;'), '.a {\n  gap: 1rem;\n}\n');
});

test('a nested rule keeps its closing indent', () => {
  assert.equal(
    fillClassRule('@scope(.s) {\n  .a {\n  }\n}\n', 'a', 'gap: 1rem'),
    '@scope(.s) {\n  .a {\n    gap: 1rem;\n  }\n}\n'
  );
});
