import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutCardStates } from '../../resources/js/cp/library/layout-cards.js';

const data = (empty) => ({
  header: { empty, patterns: [{ handle: 'empty', title: 'Empty header' }, { handle: 'header_1', title: 'Header 1' }] },
  footer: { empty: true, patterns: [{ handle: 'footer_1', title: 'Footer 1' }] },
  section: { patterns: [{ handle: 'pre_footer', title: 'Pre Footer', placed: true }, { handle: 'cta', title: 'Cta', placed: false }] },
});

test('every header can be dragged; over a header already there the drop asks to replace', () => {
  assert.deepEqual(layoutCardStates(data(false), 'header').map((c) => [c.key, c.state, c.replaces]), [['empty', 'free', true], ['header_1', 'free', true]]);
  assert.deepEqual(layoutCardStates(data(true), 'header').map((c) => c.replaces), [false, false]);
});

test('a section goes in once', () => {
  assert.deepEqual(layoutCardStates(data(true), 'sections').map((c) => [c.key, c.state, c.kind]), [['pre_footer', 'in', 'section'], ['cta', 'free', 'section']]);
});

test('search narrows by title; a missing place is null', () => {
  assert.deepEqual(layoutCardStates(data(true), 'header', { query: 'header 1' }).map((c) => c.key), ['header_1']);
  assert.equal(layoutCardStates({}, 'footer'), null);
});
