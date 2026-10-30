/**
 * dock/field-edit.js — the Data button's field gets its visual_edit.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fieldEditAt } from '../../resources/js/dock/field-edit.js';

const at = (html, needle) => html.indexOf(needle) + 2;

test('a field that is all an element holds points its visual_edit at it', () => {
  const html = '<section>\n  <h1>{{ title }}</h1>\n</section>';

  assert.equal(fieldEditAt(html, at(html, '{{ title'), 'title'), '<section>\n  <h1 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h1>\n</section>');
});

test('an address gets the field without inline editing', () => {
  const html = '<img src="{{ image }}" alt="">';

  assert.equal(fieldEditAt(html, at(html, '{{ image'), 'image'), '<img {{ visual_edit field="image" }} src="{{ image }}" alt="">');
});

test('rich text takes it on its own element', () => {
  const html = '<div class="prose">{{ bard }}</div>';

  assert.equal(fieldEditAt(html, at(html, '{{ bard'), 'bard'), '<div {{ visual_edit field="bard" inline_edit="true" }} class="prose">{{ bard }}</div>');
});

test('words beside it, or a loop around it: nothing is added', () => {
  const mixed = '<p>Hej {{ title }}</p>';
  const loop = '{{ items }}<p>{{ title }}</p>{{ /items }}';

  assert.equal(fieldEditAt(mixed, at(mixed, '{{ title'), 'title'), mixed);
  assert.equal(fieldEditAt(loop, at(loop, '{{ title'), 'title'), loop);
});
