import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSnippetRows, normalizeSnippetName, snippetDirty, snippetProblem, snippetRow } from '../../resources/js/cp/theme-panel/snippet-rows.js';
import { CLASS_CHIPS, chipKeeps, snippetRows } from '../../resources/js/cp/theme-panel/site-classes.js';

test('a snippet name files the way Snippet::normalizeName does', () => {
  assert.equal(normalizeSnippetName('Card Hover'), 'card_hover');
  assert.equal(normalizeSnippetName('carousel.css'), 'carousel');
  assert.equal(normalizeSnippetName('my-snippet'), 'my_snippet');
  assert.equal(normalizeSnippetName('_lead_'), 'lead');
  assert.equal(normalizeSnippetName('9lives'), null, 'a letter first');
  assert.equal(normalizeSnippetName('   '), null);
});

test('a row cannot be saved without a usable name, a body, or paired braces', () => {
  const row = snippetRow({ name: 'card', css: 'padding: 1rem;\n' });

  assert.equal(snippetProblem(row), null);
  assert.equal(snippetProblem({ ...row, name: '' }), 'empty');
  assert.equal(snippetProblem({ ...row, name: '42' }), 'format');
  assert.equal(snippetProblem({ ...row, body: '  ' }), 'empty');
  assert.equal(snippetProblem({ ...row, body: '&:hover { color: red;' }), 'braces');
});

test('a name another snippet already has is taken — by its saved name too', () => {
  const a = snippetRow({ name: 'card', css: 'padding: 1rem;' });
  const b = snippetRow({ name: 'lead', css: 'color: red;' });

  assert.equal(snippetProblem(b, [a, b]), null);
  assert.equal(snippetProblem({ ...b, name: 'Card' }, [a, b]), 'taken');
  assert.equal(snippetProblem({ ...b, name: 'lead' }, [a, b]), null, 'its own name is not taken');
});

test('dirty is a change the file does not have — not indentation alone', () => {
  const row = snippetRow({ name: 'card', css: '  padding: 1rem;\n' });

  assert.equal(snippetDirty(row), false);
  assert.equal(snippetDirty({ ...row, body: '    padding: 1rem;' }), false, 'dedented the same');
  assert.equal(snippetDirty({ ...row, body: 'padding: 2rem;' }), true);
  assert.equal(snippetDirty({ ...row, name: 'card_2' }), true, 'a rename');
});

test('a reload keeps the row that has an unsaved edit and drops the one whose file is gone', () => {
  const kept = { ...snippetRow({ name: 'card', css: 'padding: 1rem;' }), body: 'padding: 2rem;' };
  const clean = snippetRow({ name: 'lead', css: 'color: red;' });
  const gone = snippetRow({ name: 'old', css: 'margin: 0;' });

  const rows = mergeSnippetRows([kept, clean, gone], [{ name: 'card', css: 'padding: 1rem;' }, { name: 'lead', css: 'color: blue;' }]);

  assert.equal(rows.length, 2);
  assert.equal(rows[0], kept, 'the edited row is the same object');
  assert.equal(rows[1].body, 'color: blue;', 'a clean row takes the fresh file');
});

test('snippet rows sit under their own chip and All, not under classes or unused', () => {
  const [row] = snippetRows([snippetRow({ name: 'card', css: 'padding: 1rem;\n&:hover { color: red; }' })]);

  assert.equal(row.kind, 'snippet');
  assert.deepEqual(row.files, ['snippets/card.css']);
  assert.deepEqual(row.props, ['padding']);
  assert.ok(CLASS_CHIPS.includes('snippet'));
  assert.equal(chipKeeps('snippet', row), true);
  assert.equal(chipKeeps('all', row), true);
  assert.equal(chipKeeps('class', row), false);
  assert.equal(chipKeeps('unused', row), false);
  assert.equal(chipKeeps('snippet', { kind: 'class', name: 'card', uses: 0 }), false);
});
