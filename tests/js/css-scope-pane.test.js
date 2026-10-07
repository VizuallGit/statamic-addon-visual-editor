import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildScopedCss, cssBalanced, findClassRule, mergeScopedCss, tokenTreeFromHtml } from '../../resources/js/css-scope.js';

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

// ---- The pane as the truth for the rules it showed (`previous`) ----

const FILE = '.a {\n    color: red;\n}\n\n.b {\n    color: blue;\n}\n\n.c {\n    color: green;\n}\n';
const PANE_AB = '.a {\n    color: red;\n}\n\n.b {\n    color: blue;\n}\n';

test('text that does not close is not written: a selector with no { yet, an open rule, an open comment', () => {
  assert.equal(cssBalanced('.a {\n}\n.f'), true);
  assert.equal(cssBalanced('.a {\n}\n.foo {'), false);
  assert.equal(cssBalanced('.a {\n    color: red;\n'), false);
  assert.equal(cssBalanced('.a {}\n}'), false);
  assert.equal(cssBalanced('/* { */ .a {}'), true);
  assert.equal(cssBalanced('.a {} /* note'), false);

  for (const tail of ['\n.', '\n.f', '\n.foo', '\n.foo {', '\n/* half']) {
    assert.equal(mergeScopedCss(FILE, PANE_AB + tail, 'a', { previous: PANE_AB }), FILE);
  }
});

test('a rule the pane showed and no longer has leaves the file, blank or not', () => {
  assert.equal(mergeScopedCss(FILE, '.a {\n    color: red;\n}\n', 'a', { previous: PANE_AB }), '.a {\n    color: red;\n}\n\n.c {\n    color: green;\n}\n');
  assert.equal(mergeScopedCss('.a {\n}\n.f {\n}\n', '.a {\n}\n', 'a', { previous: '.a {\n}\n.f {\n}\n' }), '.a {\n}\n');
});

test('a rule renamed in the pane is written where the old one stood', () => {
  const pane = PANE_AB.replace('.b {', '.bb {');

  assert.equal(mergeScopedCss(FILE, pane, 'a', { previous: PANE_AB }), FILE.replace('.b {', '.bb {'));
});

test('a name still in [ ] somewhere keeps its rule; a name the pane never showed is never taken out', () => {
  const pane = '.a {\n    color: red;\n}\n';

  assert.equal(mergeScopedCss(FILE, pane, 'a', { previous: PANE_AB, keep: ['a', 'b'] }), FILE);
  // `.c` is in the file but was not in the pane: not the pane's to remove.
  assert.equal(mergeScopedCss(FILE, pane, 'a', { previous: pane }), FILE);
});

test('a name new to the pane leaves a rule nested in another alone and gets its own', () => {
  const file = '.card {\n    & .icon {\n        margin: 0;\n    }\n}\n';

  assert.equal(
    mergeScopedCss(file, '.icon {\n    color: red;\n}\n', 'icon', { previous: '' }),
    `${file}.icon {\n    color: red;\n}\n`,
  );
});

test('a block that is not one class\'s rule replaces the copy written last time', () => {
  const hover = (color) => `${PANE_AB}\n.a:hover {\n    color: ${color};\n}\n`;
  const one = hover('blue');
  const two = hover('navy');
  const written = mergeScopedCss(FILE, one, 'a', { previous: PANE_AB });

  assert.equal(written, `${FILE}.a:hover {\n    color: blue;\n}\n`);
  assert.equal(mergeScopedCss(written, two, 'a', { previous: one }), `${FILE}.a:hover {\n    color: navy;\n}\n`);
  assert.equal(mergeScopedCss(written, PANE_AB, 'a', { previous: one }), FILE);
});

test('a comment written in front of a rule is written once', () => {
  const pane = `/* note */\n${PANE_AB}`;
  const written = mergeScopedCss(FILE, pane, 'a', { previous: PANE_AB });

  assert.equal(written, `/* note */\n${FILE}`);
  assert.equal(mergeScopedCss(written, pane.replace('red', 'tomato'), 'a', { previous: pane }), `/* note */\n${FILE.replace('red', 'tomato')}`);
});
