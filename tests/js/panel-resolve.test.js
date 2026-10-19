/**
 * cp/panel/resolve.js — a row's id to the field path, meta path and field
 * definitions Statamic draws it from. Shapes mirror Statamic 6's publish
 * array and replicator meta (`existing` keyed by `_id`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blueprintFields, resolveRow, rowUid, setsOf } from '../../resources/js/cp/panel/resolve.js';

const headline = { handle: 'headline', type: 'text', display: 'Headline' };
const richtext = { handle: 'richtext', type: 'bard', display: 'Richtext' };
const blocks = {
  handle: 'blocks',
  type: 'replicator',
  display: 'Blocks',
  sets: [
    {
      handle: 'items',
      display: 'Items',
      sets: [
        { handle: 'headline', display: 'Headline', icon: 'fieldtype-text', fields: [headline] },
        { handle: 'richtext', display: 'Richtext', icon: 'fieldtype-textarea', fields: [richtext] },
      ],
    },
  ],
};
const sizes = {
  handle: 'sizes',
  type: 'grid',
  display: 'Sizes',
  fields: [{ handle: 'label', type: 'text' }],
};
const blueprint = {
  tabs: [
    {
      handle: 'main',
      sections: [
        {
          fields: [
            { handle: 'title', type: 'text' },
            {
              handle: 'page_sections',
              type: 'sve_lite_sections',
              sets: [
                {
                  handle: 'hero',
                  sets: [
                    { handle: 'hero/style_2', display: 'Hero style 2', instructions: 'Big.', fields: [blocks, sizes] },
                  ],
                },
                // An ungrouped set, as hand-written fieldsets still have them.
                { handle: 'plain', display: 'Plain', fields: [headline] },
              ],
            },
          ],
        },
      ],
    },
  ],
};
const values = {
  title: 'Home',
  page_sections: [
    { _id: 's0', _visual_id: 'v-s0', type: 'plain', headline: 'first' },
    {
      _id: 's1',
      _visual_id: 'v-s1',
      type: 'hero/style_2',
      _sve_label: 'Top hero',
      blocks: [
        { _id: 'b0', _visual_id: 'v-b0', type: 'headline', headline: 'Hi' },
        { _id: 'b1', _visual_id: 'v-b1', type: 'richtext', richtext: [] },
      ],
      sizes: [{ _id: 'g0', label: 'S' }],
    },
  ],
};

test('blueprintFields flattens tabs and sections, and takes a flat list as is', () => {
  assert.deepEqual(blueprintFields(blueprint).map((f) => f.handle), ['title', 'page_sections']);
  assert.deepEqual(blueprintFields({ fields: [headline] }), [headline]);
  assert.deepEqual(blueprintFields(null), []);
});

test('setsOf flattens grouped and ungrouped sets alike', () => {
  const field = blueprintFields(blueprint)[1];
  assert.deepEqual(setsOf(field).map((s) => s.handle), ['hero/style_2', 'plain']);
});

test('a top-level section resolves to its set: paths, fields, name and no parent', () => {
  const row = resolveRow(values, blueprint, 'v-s1');
  assert.equal(row.path, 'page_sections.1');
  assert.equal(row.metaPath, 'page_sections.existing.s1');
  assert.deepEqual(row.fields.map((f) => f.handle), ['blocks', 'sizes']);
  assert.equal(row.kind, 'set');
  assert.equal(row.handle, 'hero/style_2');
  // The author's own label first, the set's display otherwise.
  assert.equal(row.display, 'Top hero');
  assert.equal(resolveRow(values, blueprint, 'v-s0').display, 'Plain');
  assert.equal(row.instructions, 'Big.');
  assert.equal(row.parentUid, null);
});

test('a block inside a section resolves two levels down, with its section as parent', () => {
  const row = resolveRow(values, blueprint, 'v-b1');
  assert.equal(row.path, 'page_sections.1.blocks.1');
  assert.equal(row.metaPath, 'page_sections.existing.s1.blocks.existing.b1');
  assert.deepEqual(row.fields, [richtext]);
  assert.equal(row.display, 'Richtext');
  assert.equal(row.icon, 'fieldtype-textarea');
  assert.equal(row.parentUid, 'v-s1');
});

test('a grid row resolves to the grid field, by its _id', () => {
  const row = resolveRow(values, blueprint, 'g0');
  assert.equal(row.kind, 'grid');
  assert.equal(row.path, 'page_sections.1.sizes.0');
  assert.equal(row.metaPath, 'page_sections.existing.s1.sizes.existing.g0');
  assert.deepEqual(row.fields.map((f) => f.handle), ['label']);
  assert.equal(row.display, 'Sizes');
  assert.equal(row.parentUid, 'v-s1');
});

test('the path follows the row when rows above it move', () => {
  const moved = { ...values, page_sections: [values.page_sections[1], values.page_sections[0]] };
  assert.equal(resolveRow(moved, blueprint, 'v-b1').path, 'page_sections.0.blocks.1');
  assert.equal(resolveRow(moved, blueprint, 'v-b1').metaPath, 'page_sections.existing.s1.blocks.existing.b1');
});

test('what it does not know, it declines: unknown id, unknown set, a field that is not a row list', () => {
  assert.equal(resolveRow(values, blueprint, 'nope'), null);
  const odd = { page_sections: [{ _id: 'x', _visual_id: 'v-x', type: 'gone' }] };
  assert.equal(resolveRow(odd, blueprint, 'v-x'), null);
  assert.equal(resolveRow({ title: { _id: 'tt' } }, blueprint, 'tt'), null);
  assert.equal(resolveRow(null, blueprint, 'v-s1'), null);
});

test('rowUid prefers the visual id, then id, then _id', () => {
  assert.equal(rowUid({ _id: 'a', id: 'b', _visual_id: 'c' }), 'c');
  assert.equal(rowUid({ _id: 'a', id: 'b' }), 'b');
  assert.equal(rowUid({ _id: 'a' }), 'a');
  assert.equal(rowUid(null), null);
});
