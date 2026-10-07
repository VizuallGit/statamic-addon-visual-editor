/**
 * The CSS pane → HTML direction of the dock's `[ ]` names, run through the real
 * `dock/scope.js` (support/dock-scope.mjs: CodeMirror/Vue stubbed, two fake
 * editors, the update listener's flush order).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dockState, editors, fullHtml, names, openOn, rows, scope } from './support/dock-scope.mjs';

const HTML = [
  '<section class="[ wrap ]">',
  '  <ul class="grid">',
  '    <li class="[ yyttrr ] flex">Hej</li>',
  '  </ul>',
  '</section>',
].join('\n');

const CSS = '.wrap {\n    padding: 1rem;\n}\n\n.yyttrr {\n    color: red;\n}\n';

function liRow(html) {
  return rows(html).find((row) => row.tag === 'li');
}

function count(css, name) {
  return (css.match(new RegExp(`(^|[^\\w-])\\.${name}\\s*\\{`, 'g')) || []).length;
}

/** Open the file with the CSS pane on the `<li>`: its own pick, or the HTML pane scoped to it. */
function openOnLi({ by, html = HTML, css = CSS, cssAll = false }) {
  openOn({ by, html, css, cssAll, row: liRow(html) });
}

for (const by of ['pick', 'scope']) {
  test(`${by}: a rule deleted in the CSS pane and brought back with ⌘Z puts [ yyttrr ] back on the <li>`, () => {
    openOnLi({ by });

    const pane = editors.css.state.doc.toString();

    assert.equal(dockState.cssPane, 'tree');
    assert.equal(pane, '.yyttrr {\n    color: red;\n}\n');

    editors.css.type('');
    assert.match(fullHtml(), /<li class="\[ \] flex">/);
    assert.deepEqual(names(), ['wrap']);

    editors.css.type(pane);
    assert.equal(fullHtml(), HTML);
    assert.deepEqual(dockState.lastBracketNames, ['wrap', 'yyttrr']);
    assert.equal(dockState.cssFull, CSS);

    // The next edit in the HTML pane finds nothing to sync: no second rule.
    const text = editors.html.state.doc.toString();

    editors.html.type(text.replace('Hej', 'Hej!'));
    assert.equal(count(dockState.cssFull, 'yyttrr'), 1);
    assert.equal(dockState.cssFull, CSS);
  });

  test(`${by}: a rule typed a letter at a time for the <li> ends as one [ foo ] and one .foo rule`, () => {
    openOnLi({ by });

    const pane = editors.css.state.doc.toString();

    for (const tail of ['\n.', '\n.f', '\n.f {}', '\n.fo {}', '\n.foo {}', '\n.foo {\n    color: blue;\n}\n']) {
      editors.css.type(pane + tail);
    }

    assert.match(fullHtml(), /<li class="\[ yyttrr foo \] flex">Hej<\/li>/);
    assert.deepEqual(names(), ['wrap', 'yyttrr', 'foo']);
    assert.equal(count(dockState.cssFull, 'foo'), 1);
    assert.match(dockState.cssFull, /\.foo \{\n    color: blue;\n\}/);

    const text = editors.html.state.doc.toString();

    editors.html.type(text.replace('Hej', 'Hej!'));
    assert.equal(count(dockState.cssFull, 'foo'), 1);
  });
}

test('pick inside a scoped HTML pane: the <li> is found in the <ul> slice and written in its offsets', () => {
  openOnLi({ by: 'pick' });

  // The tree has scoped the HTML pane to the <ul>; the click in the code then
  // pointed the CSS pane at the <li> inside it.
  const ul = rows(HTML).find((row) => row.tag === 'ul');

  dockState.htmlFocus = { from: ul.from, to: ul.to };
  editors.html.load(scope.htmlEditorText());
  dockState.cssFocus = { path: liRow(HTML).path };
  scope.applyCssScope();
  scope.rememberBracketNames();

  assert.equal(dockState.htmlScopeActive, true);

  const pane = editors.css.state.doc.toString();

  editors.css.type(`${pane}\n.foo {}\n`);
  assert.equal(editors.html.state.doc.toString(), '<ul class="grid">\n    <li class="[ yyttrr foo ] flex">Hej</li>\n  </ul>');
  assert.equal(fullHtml(), HTML.replace('[ yyttrr ]', '[ yyttrr foo ]'));
});

test('a rule nested inside the picked rule styles something inside it: no [ ] on the <li>', () => {
  openOnLi({ by: 'pick' });
  editors.css.type('.yyttrr {\n    color: red;\n    & .bar {}\n}\n');
  assert.equal(fullHtml(), HTML);
});

test('a name already in [ ] elsewhere in the file is that element\'s rule, not the <li>\'s', () => {
  openOnLi({ by: 'scope' });

  const pane = editors.css.state.doc.toString();

  editors.css.type(`${pane}\n.wrap {}\n`);
  assert.equal(fullHtml(), HTML);
});

test('nothing is added when the pane shows the whole file, nothing is picked, or the dock is locked', () => {
  openOnLi({ by: 'pick', cssAll: true });
  assert.equal(dockState.cssPane, 'full');
  editors.css.type(`${CSS}\n.foo {}\n`);
  assert.equal(fullHtml(), HTML);

  // The file just opened: the pane shows the root's names, and no element was picked.
  openOnLi({ by: 'none' });
  assert.equal(dockState.cssPane, 'tree');
  editors.css.type(`${editors.css.state.doc.toString()}\n.foo {}\n`);
  assert.equal(fullHtml(), HTML);

  openOnLi({ by: 'pick' });
  dockState.lastLocked = true;
  editors.css.type(`${editors.css.state.doc.toString()}\n.foo {}\n`);
  dockState.lastLocked = false;
  assert.equal(fullHtml(), HTML);
});
