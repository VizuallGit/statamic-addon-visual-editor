import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildScopedCss, findClassRule, mergeScopedCss, tokenTreeFromHtml } from '../../resources/js/css-scope.js';

const html = [
  '<section class="wrapper py-1000">',
  '  <ul class="[ icon-group ] grid">',
  '    <li class="[ icon ] flex">x</li>',
  '  </ul>',
  '</section>',
].join('\n');

const ul = html.slice(html.indexOf('<ul'), html.indexOf('</ul>') + 5);
const li = html.slice(html.indexOf('<li'), html.indexOf('</li>') + 5);

const css = [
  '.icon-group {',
  '    --stagger: 300ms;',
  '    & .icon {',
  '        opacity: 0;',
  '    }',
  '}',
  '',
  '.icon {',
  '    display: flex;',
  '}',
  '',
].join('\n');

test('a tag without a [ name ] shows nothing — not its children\'s names', () => {
  assert.deepEqual(tokenTreeFromHtml(html), []);
  assert.deepEqual(tokenTreeFromHtml(ul), [{ className: 'icon-group' }]);
  assert.deepEqual(tokenTreeFromHtml(li), [{ className: 'icon' }]);
});

test('the pane shows the element\'s own rule as written; a separate .icon rule stays out', () => {
  assert.equal(
    buildScopedCss(css, tokenTreeFromHtml(ul)),
    '.icon-group {\n    --stagger: 300ms;\n    & .icon {\n        opacity: 0;\n    }\n}\n',
  );
  assert.equal(buildScopedCss(css, tokenTreeFromHtml(li)), '.icon {\n    display: flex;\n}\n');
});

test('the top-level rule wins over one nested in another', () => {
  const nestedFirst = '.card {\n  .icon {\n    color: red;\n  }\n}\n.icon {\n  display: flex;\n}\n';
  const rule = findClassRule(nestedFirst, 'icon');

  assert.equal(nestedFirst.slice(rule.from, rule.to), '.icon {\n  display: flex;\n}');
  assert.equal(buildScopedCss(nestedFirst, [{ className: 'icon' }]), '.icon {\n    display: flex;\n}\n');
  // No top-level rule: the nested one is the rule, where it is written.
  assert.equal(buildScopedCss('.card {\n  .icon {\n    color: red;\n  }\n}\n', [{ className: 'icon' }]), '.icon {\n    color: red;\n}\n');
});

test('writing the pane back leaves a same-named rule elsewhere in the file alone', () => {
  const edited = '.icon-group {\n    --stagger: 500ms;\n    & .icon {\n        opacity: 0;\n    }\n}\n';

  assert.equal(
    mergeScopedCss(css, edited, 'icon-group'),
    '.icon-group {\n    --stagger: 500ms;\n    & .icon {\n        opacity: 0;\n    }\n}\n\n.icon {\n    display: flex;\n}\n',
  );
});

test('two names on one tag write back as two rules, each over its own', () => {
  const file = '.a {\n  color: red;\n}\n.b {\n  color: blue;\n}\n';
  const pane = '.a {\n    color: green;\n}\n\n.b {\n    color: black;\n}\n';

  assert.equal(mergeScopedCss(file, pane, 'a'), '.a {\n    color: green;\n}\n.b {\n    color: black;\n}\n');
});

test('loose declarations become the root\'s body; a missing rule is appended', () => {
  assert.equal(mergeScopedCss('.x {\n}\n', 'gap: 1rem;', 'icon-group'), '.x {\n}\n.icon-group {\ngap: 1rem;\n}\n');
});
