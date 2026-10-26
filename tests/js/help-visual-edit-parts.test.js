/**
 * help-rules/visual-edit-parts.js: after `{{ visual_edit }}`, its parts one at
 * a time into the same tag; «Point at a field» asks, then writes `field="…"`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VISUAL_EDIT_PARTS,
  visualEditFieldRows,
  visualEditPartRows,
  visualEditTagIn,
} from '../../resources/js/dock/help-rules/visual-edit-parts.js';

const open = (html, name = 'div') => ({ name, from: 0, to: html.indexOf('>') + 1 });
const ids = (list) => list.map((item) => item.id);
const apply = (source, row) => {
  const [change] = row.changes;

  return source.slice(0, change.from) + change.insert + source.slice(change.to);
};

test('the parts are the dock’s own list, no new parameter among them', () => {
  assert.deepEqual(
    VISUAL_EDIT_PARTS.map((part) => part.id),
    ['inline_edit', 'field', 'outline_inside', 'orderable', 'insertable', 'popup', 'toolbar', 'section_orderable']
  );
});

test('no visual_edit on the tag: no rows', () => {
  const html = '<div class="x">text</div>';

  assert.equal(visualEditTagIn(html, open(html)), null);
  assert.deepEqual(visualEditPartRows(html, open(html)), []);
  assert.deepEqual(visualEditFieldRows(html, open(html), [{ var: 'text' }]), []);
});

test('a <div> with a bare visual_edit: every part but section_orderable; each goes before the }}', () => {
  const html = '<div {{ visual_edit }}>text</div>';
  const rows = visualEditPartRows(html, open(html));

  assert.deepEqual(ids(rows), ['ve:inline_edit', 've:field', 've:outline_inside', 've:orderable', 've:insertable', 've:popup', 've:toolbar']);

  const inline = rows[0];

  assert.equal(apply(html, inline), '<div {{ visual_edit inline_edit="true" }}>text</div>');
  assert.equal(inline.after, 'visual-edit');
  assert.equal(inline.meta, 'inline_edit="true"');
  // The caret right after the part, before the }}.
  assert.equal(apply(html, inline).slice(inline.selection), ' }}>text</div>');

  const field = rows[1];

  assert.deepEqual(field.changes, []);
  assert.equal(field.after, 'visual-edit-field');
});

test('a part the tag has is not offered again; a section may take section_orderable', () => {
  const html = '<section id="id-{{ id }}" class="wrapper" {{ visual_edit outline_inside="true" }}>\n</section>';
  const rows = visualEditPartRows(html, open(html, 'section'));

  assert.deepEqual(ids(rows), ['ve:inline_edit', 've:field', 've:orderable', 've:insertable', 've:popup', 've:toolbar', 've:section_orderable']);
  assert.equal(
    apply(html, rows.at(-1)),
    '<section id="id-{{ id }}" class="wrapper" {{ visual_edit outline_inside="true" section_orderable="true" }}>\n</section>'
  );
});

test('a visual_edit with a field already points: no field row', () => {
  const html = '<div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>';

  assert.deepEqual(ids(visualEditPartRows(html, open(html))), ['ve:outline_inside', 've:orderable', 've:insertable', 've:popup', 've:toolbar']);
});

test('the fields: one row each, writing field="var", labelled by the field', () => {
  const html = '<div {{ visual_edit }}>text</div>';
  const rows = visualEditFieldRows(html, open(html), [
    { var: 'text', label: 'Text', type: 'bard' },
    { var: 'media', label: 'Media', type: 'assets' },
    { var: 'popup_video', type: 'assets' },
  ]);

  assert.deepEqual(ids(rows), ['ve:field:text', 've:field:media', 've:field:popup_video']);
  assert.deepEqual(rows[0].args, { name: 'Text' });
  assert.deepEqual(rows[2].args, { name: 'popup_video' });
  assert.equal(apply(html, rows[1]), '<div {{ visual_edit field="media" }}>text</div>');
  assert.ok(rows.every((row) => row.after === 'visual-edit'));
});

test('the opening tag’s range is honoured — a visual_edit in a child is not this tag’s', () => {
  const html = '<div class="x"><p {{ visual_edit }}>t</p></div>';

  assert.deepEqual(visualEditPartRows(html, open(html)), []);
});
