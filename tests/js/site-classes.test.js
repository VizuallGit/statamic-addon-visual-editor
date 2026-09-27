import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyUsage,
  ownedRules,
  chipKeeps,
  classRows,
  filterRows,
  isAmbient,
  rowSummary,
  usageLabel,
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

test('a section naming its own class in the dock is a class, not a place', () => {
  const rows = classRows([
    { name: 'event-card', file: 'partials/event.antlers.html', selector: '[ event-card ]', css: '', kind: 'bracket' },
  ]);

  assert.equal(rows[0].ambient, false, 'a [ name ] goes on an element like any other class');
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

test('nothing reads as unused before the count has arrived', () => {
  const rows = classRows([
    { name: 'card', file: 'site.css', selector: '@utility card', css: 'padding: 1rem;', kind: 'utility' },
  ]);

  assert.equal(chipKeeps('unused', rows[0]), false, 'no count yet is not the same as no usage');
  assert.equal(usageLabel(rows[0]), '', 'and it says nothing rather than guessing');
});

test('a class only the dock history still writes is not called unused', () => {
  const rows = applyUsage(
    classRows([{ name: 'bg-gray-950', file: 'site.css', selector: '.bg-gray-950', css: 'color: red;', kind: 'rule' }]),
    { 'bg-gray-950': { now: 0, history: 4, files: [] } }
  );

  assert.equal(rows[0].now, 0);
  assert.equal(rows[0].history, 4);
  assert.equal(usageLabel(rows[0]), 'Kun i historikken (4)');
  assert.equal(chipKeeps('unused', rows[0]), true, 'it is still in the unused chip — with the warning beside it');
});

test('usage reads as what it is', () => {
  const [used] = applyUsage(
    classRows([{ name: 'wrapper', file: 'site.css', selector: '@utility wrapper', css: 'padding: 0;', kind: 'utility' }]),
    { wrapper: { now: 19, history: 139, files: ['resources/views/a.antlers.html'] } }
  );

  assert.equal(usageLabel(used), 'Brugt 19 gange');
  assert.equal(chipKeeps('unused', used), false);
  assert.deepEqual(used.where, ['resources/views/a.antlers.html']);

  const [dead] = applyUsage(
    classRows([{ name: 'split-gap-md', file: 'site.css', selector: '@utility split-gap-md', css: 'gap: 0;', kind: 'utility' }]),
    { 'split-gap-md': { now: 0, history: 0, files: [] } }
  );

  assert.equal(usageLabel(dead), 'Ubrugt');
  assert.equal(chipKeeps('unused', dead), true);
});

test('the tab owns two files: site.css utilities and the site\'s own classes', () => {
  const kept = ownedRules(
    [
      { name: 'wrapper', file: 'resources/css/site.css', selector: '@utility wrapper', css: 'padding: 0;', kind: 'utility' },
      { name: 'btn', file: 'resources/css/custom-classes.css', selector: '.btn', css: 'gap: 1em;', kind: 'rule' },
      { name: 'hero', file: 'resources/views/partials/page_sections/hero.antlers.html', selector: '.hero', css: '', kind: 'rule' },
      { name: 'cp-input', file: 'resources/css/cp.css', selector: '.dark .cp-input', css: '', kind: 'rule' },
      { name: 'link-parent', file: 'resources/css/base.css', selector: '.link-parent::after', css: '', kind: 'rule' },
    ],
    { entry: 'site.css', classes: 'custom-classes.css' }
  );

  assert.deepEqual(kept.map((r) => r.name), ['wrapper', 'btn']);
});

test('a plain rule in site.css is not a class the tab offers', () => {
  const kept = ownedRules(
    [{ name: 'stray', file: 'resources/css/site.css', selector: '.stray', css: '', kind: 'rule' }],
    { entry: 'site.css', classes: 'custom-classes.css' }
  );

  assert.deepEqual(kept, [], 'site.css is the utilities file; its plain rules are not the vocabulary');
});
