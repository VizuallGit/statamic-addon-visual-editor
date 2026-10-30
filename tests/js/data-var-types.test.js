/**
 * data-var-types.js — which fields fit where, and the tags in what was typed.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEXT_FIELDS, fieldTypesFor, onlyTypes, wholeTag, withoutFields, wrongFields } from '../../resources/js/data-var-types.js';

const MODEL = {
  scope: [{ handle: 'gallery', items: [{ var: 'caption', type: 'text', parent: 'gallery' }, { var: 'photo', type: 'assets', parent: 'gallery' }] }],
  section: [
    { var: 'headline', type: 'text' },
    { var: 'intro', type: 'textarea' },
    { var: 'content', type: 'bard' },
    { var: 'hero', type: 'assets', loop: true },
    { var: 'label', type: 'text', parent: 'cards' },
  ],
  page: [
    { handle: 'this', items: [{ var: 'title', type: 'text' }, { var: 'date', type: 'date' }] },
    { handle: 'collection', loop: 'collection:news', items: [{ var: 'teaser', type: 'text' }] },
  ],
  site: [{ handle: 'site_settings', items: [{ var: 'site_settings.phone', type: 'text' }, { var: 'site_settings.logo', type: 'assets' }] }],
};

test('a type reads from its own family; a type without one reads from any', () => {
  assert.deepEqual(fieldTypesFor('text'), TEXT_FIELDS);
  assert.deepEqual(fieldTypesFor('textarea'), TEXT_FIELDS);
  assert.deepEqual(fieldTypesFor('assets'), ['assets']);
  assert.deepEqual(fieldTypesFor('bard'), ['bard']);
  assert.deepEqual(fieldTypesFor('link'), ['link']);
  assert.equal(fieldTypesFor('integer'), null);
});

test('a text place is offered text fields only, on every tab', () => {
  const out = onlyTypes(MODEL, TEXT_FIELDS);

  assert.deepEqual(out.section.map((row) => row.var), ['headline', 'intro']);
  assert.deepEqual(out.page.map((group) => group.handle), ['this']);
  assert.deepEqual(out.page[0].items.map((row) => row.var), ['title']);
  assert.deepEqual(out.site[0].items.map((row) => row.var), ['site_settings.phone']);
});

test('an asset place is offered assets, without the mark that promises a loop', () => {
  const out = onlyTypes(MODEL, ['assets']);

  assert.deepEqual(out.section, [{ var: 'hero', type: 'assets', loop: false }]);
  assert.deepEqual(out.page, []);
});

test('rows that print only inside a loop stay only on the loop\'s own tab', () => {
  const out = onlyTypes(MODEL, TEXT_FIELDS);

  assert.equal(out.section.some((row) => row.var === 'label'), false);
  assert.deepEqual(out.scope[0].items.map((row) => row.var), ['caption']);
});

test('an empty catalogue stays an empty one', () => {
  assert.deepEqual(onlyTypes(null, TEXT_FIELDS), { scope: [], section: [], page: [], site: [] });
});

test('one tag and nothing else gives its expression', () => {
  assert.equal(wholeTag('{{ title }}'), 'title');
  assert.equal(wholeTag('  {{ title | upper }}\n'), 'title | upper');
  assert.equal(wholeTag('Hej {{ title }}'), null);
  assert.equal(wholeTag('{{ a }}{{ b }}'), null);
  assert.equal(wholeTag('title'), null);
  assert.equal(wholeTag(''), null);
});

test('a known field of the wrong type is named; the right type and the unknown are not', () => {
  assert.deepEqual(wrongFields('{{ hero }}', MODEL, TEXT_FIELDS), ['hero']);
  assert.deepEqual(wrongFields('Hej {{ headline }} og {{ content }}', MODEL, TEXT_FIELDS), ['content']);
  assert.deepEqual(wrongFields('{{ headline | upper }}', MODEL, TEXT_FIELDS), []);
  assert.deepEqual(wrongFields('{{ something_else }}', MODEL, TEXT_FIELDS), []);
  assert.deepEqual(wrongFields('plain words', MODEL, TEXT_FIELDS), []);
});

test('a name with a fitting row somewhere is not wrong, whatever else shares it', () => {
  const both = { section: [{ var: 'image', type: 'assets' }], site: [{ items: [{ var: 'image', type: 'text' }] }] };

  assert.deepEqual(wrongFields('{{ image }}', both, TEXT_FIELDS), []);
});

test('one file only: a gallery is no image', () => {
  const model = { section: [{ var: 'image', type: 'assets', single: true }, { var: 'gallery', type: 'assets', loop: true }] };

  assert.deepEqual(onlyTypes(model, ['assets'], { single: true }).section.map((row) => row.var), ['image']);
  assert.deepEqual(onlyTypes(model, ['assets']).section.map((row) => row.var), ['image', 'gallery']);
  assert.deepEqual(wrongFields('{{ gallery }}', model, ['assets'], { single: true }), ['gallery']);
  assert.deepEqual(wrongFields('{{ image }}', model, ['assets'], { single: true }), []);
});

test('only the named tags are taken out', () => {
  assert.equal(withoutFields('Hej {{ hero }} og {{ headline }}', ['hero']), 'Hej  og {{ headline }}');
  assert.equal(withoutFields('{{ hero | url }}', ['hero']), '');
});
