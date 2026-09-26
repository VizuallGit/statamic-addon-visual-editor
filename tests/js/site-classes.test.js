import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  chipKeeps,
  classRows,
  filterRows,
  isAmbient,
  rowSummary,
} from '../../resources/js/cp/theme-panel/site-classes.js';

test('a selector you can put on an element is not ambient', () => {
  assert.equal(isAmbient('@utility wrapper'), false);
  assert.equal(isAmbient('.card'), false);
  assert.equal(isAmbient('.card:hover'), false);
  assert.equal(isAmbient('.card::after'), false);
});

test('a selector that describes a place is ambient', () => {
  assert.equal(isAmbient('.card h2'), true, 'a descendant');
  assert.equal(isAmbient('.a, .b'), true, 'two selectors');
  assert.equal(isAmbient('h1.headline--large'), true, 'an element as well');
  assert.equal(isAmbient('body'), true, 'an element alone');
  assert.equal(isAmbient('.case-card[style] + .case-card'), true, 'a sibling');
});

test('one row per name, whatever the file said it in', () => {
  const rows = classRows([
    { name: 'card', file: 'a.css', selector: '.card', css: 'padding: 1rem;', kind: 'class' },
    { name: 'card', file: 'b.css', selector: '.card', css: 'color: red;', kind: 'class' },
  ]);

  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].files, ['a.css', 'b.css']);
  assert.deepEqual(rows[0].props, ['padding', 'color']);
});

test('@utility wins the kind: that form is what answers to md: and hover:', () => {
  const rows = classRows([
    { name: 'wrapper', file: 'base.css', selector: '.wrapper', css: 'padding: 0;', kind: 'class' },
    { name: 'wrapper', file: 'site.css', selector: '@utility wrapper', css: 'padding: 1rem;', kind: 'utility' },
  ]);

  assert.equal(rows[0].kind, 'utility');
});

test('one usable rule keeps a name pickable, even beside an ambient one', () => {
  const rows = classRows([
    { name: 'card', file: 'a.css', selector: '.card h2', css: 'color: red;', kind: 'class' },
    { name: 'card', file: 'a.css', selector: '.card', css: 'padding: 1rem;', kind: 'class' },
  ]);

  assert.equal(rows[0].ambient, false);
});

test('a name only ever written as a place stays ambient', () => {
  const rows = classRows([
    { name: 'case-card', file: 'base.css', selector: '.case-card[style] + .case-card', css: '', kind: 'class' },
  ]);

  assert.equal(rows[0].ambient, true);
});

test('the chips split the list without dropping or doubling a row', () => {
  const rows = classRows([
    { name: 'wrapper', file: 'site.css', selector: '@utility wrapper', css: 'padding: 1rem;', kind: 'utility' },
    { name: 'btn', file: 'classes.css', selector: '.btn', css: 'gap: 1em;', kind: 'class' },
    { name: 'case-card', file: 'base.css', selector: '.case-card h2', css: 'color: red;', kind: 'class' },
  ]);

  assert.equal(filterRows(rows, { chip: 'all' }).length, 3);
  assert.equal(filterRows(rows, { chip: 'utility' }).length, 1);
  assert.equal(filterRows(rows, { chip: 'class' }).length, 1);
  assert.equal(filterRows(rows, { chip: 'ambient' }).length, 1);

  // Every row lands in exactly one of the three chips beside 'all'.
  for (const row of rows) {
    const hits = ['utility', 'class', 'ambient'].filter((chip) => chipKeeps(chip, row));

    assert.equal(hits.length, 1, `${row.name} landed in ${hits.length} chips`);
  }
});

test('search looks at the name, the file and the properties', () => {
  const rows = classRows([
    { name: 'wrapper', file: 'site.css', selector: '@utility wrapper', css: 'padding-left: 1rem;', kind: 'utility' },
    { name: 'btn', file: 'classes.css', selector: '.btn', css: 'gap: 1em;', kind: 'class' },
  ]);

  assert.deepEqual(filterRows(rows, { query: 'wrap' }).map((r) => r.name), ['wrapper']);
  assert.deepEqual(filterRows(rows, { query: '.wrap' }).map((r) => r.name), ['wrapper'], 'a typed dot is not a miss');
  assert.deepEqual(filterRows(rows, { query: 'classes.css' }).map((r) => r.name), ['btn']);
  assert.deepEqual(filterRows(rows, { query: 'padding' }).map((r) => r.name), ['wrapper']);
});

test('the summary says where it lives and how much it sets', () => {
  const [row] = classRows([
    { name: 'card', file: 'site.css', selector: '@utility card', css: 'padding: 1rem;\ncolor: red;', kind: 'utility' },
  ]);

  assert.equal(rowSummary(row), 'site.css · 2 egenskaber');
  assert.equal(rowSummary(row, { prop_many: 'properties' }), 'site.css · 2 properties');
});
