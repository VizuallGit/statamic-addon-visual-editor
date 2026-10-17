import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutCardStates } from '../../resources/js/cp/library/layout-cards.js';

const data = (has, current = 'custom') => ({
  header: { has, patterns: [{ handle: 'custom', title: 'Custom header', current: current === 'custom' }, { handle: 'header_1', title: 'Header 1', current: current === 'header_1' }] },
  footer: { has: false, patterns: [{ handle: 'footer_1', title: 'Footer 1', current: false }] },
  section: { patterns: [{ handle: 'pre_footer', title: 'Pre Footer', placed: true }, { handle: 'cta', title: 'Cta', placed: false }] },
});

test('the header in use is faded; the others drag, and ask to replace the one there', () => {
  assert.deepEqual(layoutCardStates(data(true), 'header').map((c) => [c.key, c.state, c.replaces]), [['custom', 'in', true], ['header_1', 'free', true]]);
});

test('an edited header is none of the patterns: every card drags', () => {
  assert.deepEqual(layoutCardStates(data(true, null), 'header').map((c) => c.state), ['free', 'free']);
});

test('no header at all: nothing to replace', () => {
  assert.deepEqual(layoutCardStates(data(false, null), 'header').map((c) => c.replaces), [false, false]);
});

test('a section goes in once', () => {
  assert.deepEqual(layoutCardStates(data(true), 'sections').map((c) => [c.key, c.state, c.kind]), [['pre_footer', 'in', 'section'], ['cta', 'free', 'section']]);
});

test('search narrows by title; a missing place is null', () => {
  assert.deepEqual(layoutCardStates(data(true), 'header', { query: 'header 1' }).map((c) => c.key), ['header_1']);
  assert.equal(layoutCardStates({}, 'footer'), null);
});
