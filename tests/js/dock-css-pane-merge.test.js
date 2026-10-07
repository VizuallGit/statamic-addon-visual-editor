/**
 * The CSS pane, showing one element's rules, written back into the file a
 * keystroke at a time — through the real `dock/scope.js` and the update
 * listener's flush order (support/dock-scope.mjs).
 *
 * The pane is the truth for the rules it shows: what is typed and then typed
 * over, renamed or deleted there leaves nothing behind in `cssFull`; rules it
 * never showed are not touched.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dockState, editors, fullHtml, names, openOn, rows } from './support/dock-scope.mjs';

const HTML = [
  '<section class="[ wrap ]">',
  '  <ul class="grid">',
  '    <li class="[ yyttrr ] flex">Hej</li>',
  '    <li class="[ other ]">Du</li>',
  '  </ul>',
  '</section>',
].join('\n');

// `.wrap` holds a nested `& .foo` the <li>'s pane never shows, and the file
// has the section's own `#id-` layer and another <li>'s rule after the pane's.
const CSS = [
  '.wrap {',
  '    padding: 1rem;',
  '    & .foo {',
  '        margin: 0;',
  '    }',
  '}',
  '',
  '.yyttrr {',
  '    color: red;',
  '}',
  '',
  '#id-{{ id }} {',
  '    --gap: 1rem;',
  '}',
  '',
  '.other {',
  '    color: green;',
  '}',
  '',
].join('\n');

const PANE = '.yyttrr {\n    color: red;\n}\n';
const FOO = '.foo {\n    color: blue;\n}';
const TYPED = '.foo {\n  color: blue;\n}';

const firstLi = (html) => rows(html).find((row) => row.tag === 'li');

function typeEach(pane, tails) {
  for (const tail of tails) {
    editors.css.type(pane + tail);
  }
}

for (const by of ['pick', 'scope']) {
  test(`${by}: a rule typed a letter at a time leaves exactly one rule in the file`, () => {
    openOn({ by, html: HTML, css: CSS, row: firstLi(HTML) });
    assert.equal(editors.css.state.doc.toString(), PANE);

    // A selector with no `{` yet is not a rule: nothing of it in the file.
    typeEach(PANE, ['\n.', '\n.f', '\n.fo', '\n.foo']);
    assert.equal(dockState.cssFull, CSS);

    // A `{` the editor did not pair leaves the sheet open: not written either.
    editors.css.type(`${PANE}\n.foo {`);
    assert.equal(dockState.cssFull, CSS);

    typeEach(PANE, ['\n.foo {}', `\n${TYPED}\n`]);
    assert.equal(dockState.cssFull, `${CSS}${TYPED}\n`);
    assert.match(fullHtml(), /<li class="\[ yyttrr foo \] flex">Hej<\/li>/);
  });

  test(`${by}: a name typed into a rule whose braces came first (.f {} → .fo {} → .foo {}) ends as one rule`, () => {
    openOn({ by, html: HTML, css: CSS, row: firstLi(HTML) });
    typeEach(PANE, ['\n.f {}', '\n.fo {}']);
    assert.equal(dockState.cssFull, `${CSS}.fo {}\n`);

    typeEach(PANE, ['\n.foo {}', `\n${TYPED}\n`]);
    assert.equal(dockState.cssFull, `${CSS}${TYPED}\n`);
    assert.deepEqual(names(), ['wrap', 'yyttrr', 'foo', 'other']);
  });

  test(`${by}: a rule renamed in the pane keeps its body and its place, under the new name only`, () => {
    const html = HTML.replace('[ yyttrr ]', '[ yyttrr foo ]');
    const css = CSS.replace('#id-', `${FOO}\n\n#id-`);

    openOn({ by, html, css, row: firstLi(html) });

    const pane = editors.css.state.doc.toString();

    assert.equal(pane, `${PANE}\n${FOO}\n`);
    editors.css.type(pane.replace('.foo {', '.food {'));

    assert.equal(dockState.cssFull, CSS.replace('#id-', `${FOO.replace('.foo', '.food')}\n\n#id-`));
    assert.deepEqual(names(), ['wrap', 'yyttrr', 'food', 'other']);
  });

  test(`${by}: a rule deleted in the pane leaves the file — blank or not — and nothing else does`, () => {
    const html = HTML.replace('[ yyttrr ]', '[ yyttrr foo ]');
    const css = CSS.replace('#id-', `${FOO}\n\n#id-`);

    openOn({ by, html, css, row: firstLi(html) });
    editors.css.type(PANE);

    assert.equal(dockState.cssFull, CSS);
    assert.deepEqual(names(), ['wrap', 'yyttrr', 'other']);
  });
}

test('none: the file just opened, typing over a new rule in the root\'s pane leaves one rule and the nested .foo alone', () => {
  openOn({ by: 'none', html: HTML, css: CSS });

  const pane = editors.css.state.doc.toString();

  assert.match(pane, /^\.wrap \{/);
  typeEach(pane, ['\n.f {}', '\n.fo {}', '\n.foo {}', `\n${TYPED}\n`]);
  assert.equal(dockState.cssFull, `${CSS}${TYPED}\n`);
});

test('a name another element still has in [ ] keeps its rule when the pane drops or renames it', () => {
  // The HTML pane is scoped to the first <li>, so the second one's [ card ] is
  // outside the slice and stays when the pane's rule goes.
  const html = HTML.replace('[ yyttrr ]', '[ yyttrr card ]').replace('[ other ]', '[ other card ]');
  const css = `${CSS}.card {\n    gap: 1rem;\n}\n`;

  openOn({ by: 'scope', html, css, row: firstLi(html) });

  const pane = editors.css.state.doc.toString();

  editors.css.type(pane.replace('.card {', '.cardx {'));
  assert.equal(dockState.cssFull, `${css}.cardx {\n    gap: 1rem;\n}\n`);
  assert.match(fullHtml(), /\[ yyttrr cardx \][\s\S]*\[ other card \]/);

  openOn({ by: 'scope', html, css, row: firstLi(html) });
  editors.css.type(PANE);
  assert.equal(dockState.cssFull, css);
});

test('a block that is not one class\'s rule is written once, however often it changes', () => {
  openOn({ by: 'pick', html: HTML, css: CSS, row: firstLi(HTML) });
  typeEach(PANE, [
    '\n.yyttrr:hover {}',
    '\n.yyttrr:hover {\n    c\n}',
    '\n.yyttrr:hover {\n    color: blue;\n}',
  ]);

  assert.equal(dockState.cssFull, `${CSS}.yyttrr:hover {\n    color: blue;\n}\n`);

  editors.css.type(PANE);
  assert.equal(dockState.cssFull, CSS);
});

test('a rule typed between two of the pane\'s rules leaves no half-typed selector in front of the next', () => {
  const html = HTML.replace('[ yyttrr ]', '[ yyttrr foo ]');
  const css = CSS.replace('#id-', `${FOO}\n\n#id-`);

  openOn({ by: 'pick', html, css, row: firstLi(html) });

  const pane = editors.css.state.doc.toString();
  const at = pane.indexOf('.foo {');

  for (const typed of ['.', '.n', '.ne', '.new', '.new {}']) {
    editors.css.type(`${pane.slice(0, at)}${typed}\n${pane.slice(at)}`);
  }

  assert.equal(dockState.cssFull, `${css}.new {}\n`);
});

test('a } deleted in the pane writes nothing until it is back', () => {
  openOn({ by: 'pick', html: HTML, css: CSS, row: firstLi(HTML) });

  const cut = PANE.replace(/\}\n$/, '');

  editors.css.type(`${cut}\n.foo {}\n`);
  assert.equal(dockState.cssFull, CSS);
  assert.equal(dockState.cssScopeSnapshot, PANE);

  editors.css.type(`${PANE}\n.foo {}\n`);
  assert.equal(dockState.cssFull, `${CSS}.foo {}\n`);
});

test('a comment written above the pane\'s rule goes into the file once', () => {
  openOn({ by: 'pick', html: HTML, css: CSS, row: firstLi(HTML) });
  typeEach('/* hover state */\n', [PANE, PANE.replace('red', 'blue')]);

  assert.equal(dockState.cssFull, CSS.replace('.yyttrr {\n    color: red;', '/* hover state */\n.yyttrr {\n    color: blue;'));
});
