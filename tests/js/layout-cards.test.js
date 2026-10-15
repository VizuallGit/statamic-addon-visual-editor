import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutCardStates } from '../../resources/js/cp/library/layout-cards.js';

const header = (rows = []) => ({
  single: true,
  types: [
    { handle: 'header/custom', display: 'Custom header' },
    { handle: 'header/style_1', display: 'Header style 1' },
    { handle: 'header/style_2', display: 'Header style 2' },
  ],
  rows,
});

const states = (cards) => Object.fromEntries(cards.map((card) => [card.key, card.state]));

test('an empty header place lets every header be dragged in', () => {
  assert.deepEqual(states(layoutCardStates(header(), 'header')), {
    'header/custom': 'free',
    'header/style_1': 'free',
    'header/style_2': 'free',
  });
});

test('a header in use blocks the others instead of hiding them', () => {
  const cards = layoutCardStates(header([{ id: 'r1', type: 'header/style_1' }]), 'header');

  assert.deepEqual(states(cards), {
    'header/custom': 'blocked',
    'header/style_1': 'in',
    'header/style_2': 'blocked',
  });
  // The card in use carries its row, so its trash knows what to delete.
  assert.equal(cards.find((card) => card.state === 'in').row.id, 'r1');
});

test('the search narrows the cards by name, whatever their state', () => {
  const cards = layoutCardStates(header([{ id: 'r1', type: 'header/style_1' }]), 'header', { query: ' STYLE 2 ' });

  assert.deepEqual(states(cards), { 'header/style_2': 'blocked' });
});

test('only global saved sections can go in the layout, each once', () => {
  const slot = { single: false, rows: [{ id: 'r9', entry: 'pre' }] };
  const saved = [
    { id: 'pre', title: 'Pre-footer', synced: true, preview_url: '/p.png' },
    { id: 'cta', title: 'CTA', synced: true },
    { id: 'copy', title: 'A custom copy', synced: false },
  ];
  const cards = layoutCardStates(slot, 'sections', { saved });

  assert.deepEqual(states(cards), { pre: 'in', cta: 'free' });
  assert.equal(cards[0].row.id, 'r9');
  assert.equal(cards[0].imageUrl, '/p.png');
  assert.equal(cards[1].value, 'cta');
});

test('a place the site does not have is null, not an empty list', () => {
  assert.equal(layoutCardStates(undefined, 'footer'), null);
  assert.deepEqual(layoutCardStates({ single: true, types: [], rows: [] }, 'footer'), []);
});

test('a header of a set the list no longer offers still gets its card, in use, so it can be deleted', () => {
  const cards = layoutCardStates(header([{ id: 'r1', type: 'header/old' }]), 'header');

  assert.deepEqual(states(cards), {
    'header/old': 'in',
    'header/custom': 'blocked',
    'header/style_1': 'blocked',
    'header/style_2': 'blocked',
  });
  assert.equal(cards[0].row.id, 'r1');
});
