/**
 * lib/bard-parts.js — a Bard field in parts, for AI text to rewrite one at a time.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPart, hasText, nodeTag, partKind, partText, withPartText } from '../../resources/js/lib/bard-parts.js';

const text = (words, marks) => ({ type: 'text', text: words, ...(marks ? { marks } : {}) });
const p = (...runs) => ({ type: 'paragraph', content: runs });
const h = (level, words) => ({ type: 'heading', attrs: { level, textAlign: 'left' }, content: [text(words)] });
const li = (words) => ({ type: 'listItem', content: [p(text(words))] });

const FIELD = [
  h(1, 'Strategisk branding'),
  p(text('Vi hjælper virksomheder.')),
  { type: 'set', attrs: { values: { type: 'image' } } },
  p(text('Samme tekst')),
  { type: 'bulletList', content: [li('Strategi'), li('Identitet')] },
  p(text('Samme tekst')),
];

test('each top-level node renders as its tag; a set is not text', () => {
  assert.deepEqual(FIELD.map(nodeTag), ['h1', 'p', null, 'p', 'ul', 'p']);
  assert.deepEqual(['H2', 'p', 'UL', 'ol', 'blockquote'].map(partKind), ['heading', 'paragraph', 'list', 'list', 'paragraph']);
});

test('a part is found by its tag and words, and the nth of two that look the same', () => {
  assert.equal(findPart(FIELD, { tag: 'h1', text: ' Strategisk\n branding ' }), 0);
  assert.equal(findPart(FIELD, { tag: 'ul', text: 'StrategiIdentitet' }), 4);
  assert.equal(findPart(FIELD, { tag: 'ul', text: '\n  Strategi\n  Identitet\n' }), 4);
  assert.equal(findPart(FIELD, { tag: 'p', text: 'Samme tekst', nth: 0 }), 3);
  assert.equal(findPart(FIELD, { tag: 'p', text: 'Samme tekst', nth: 1 }), 5);
  assert.equal(findPart(FIELD, { tag: 'h2', text: 'Strategisk branding' }), -1);
  assert.equal(findPart(FIELD, { tag: 'p', text: 'Not there' }), -1);
});

test('the AI reads a list one item per line', () => {
  assert.equal(partText(FIELD[4]), 'Strategi\nIdentitet');
  assert.equal(partText(FIELD[0]), 'Strategisk branding');
});

test('an empty field has no text to point at', () => {
  assert.equal(hasText([]), false);
  assert.equal(hasText([{ type: 'paragraph' }]), false);
  assert.equal(hasText(FIELD), true);
});

test('a heading keeps its level and its attrs; a paragraph stays one paragraph', () => {
  assert.deepEqual(withPartText(FIELD[0], 'Ny overskrift'), { type: 'heading', attrs: { level: 1, textAlign: 'left' }, content: [text('Ny overskrift')] });
  assert.deepEqual(withPartText(FIELD[1], 'Første.\n\nAnden.'), { type: 'paragraph', content: [text('Første. Anden.')] });
});

test('a list stays its kind, one item per line, bullets the AI wrote anyway dropped', () => {
  const ol = { type: 'orderedList', attrs: { order: 1 }, content: [li('a')] };

  assert.deepEqual(withPartText(ol, '1. Første\n2) Anden\n\n- Tredje'), {
    type: 'orderedList',
    attrs: { order: 1 },
    content: [li('Første'), li('Anden'), li('Tredje')],
  });
});

test('marks every word wore are kept; marks on some words go', () => {
  const link = [{ type: 'link', attrs: { href: '/kontakt' } }];
  const whole = p(text('Kontakt ', link), text('os', link));
  const some = p(text('Ring til '), text('os', [{ type: 'bold' }]));

  assert.deepEqual(withPartText(whole, 'Skriv til os'), p(text('Skriv til os', link)));
  assert.deepEqual(withPartText(some, 'Skriv til os'), p(text('Skriv til os')));
});

test('a quote keeps its paragraph; an empty suggestion leaves no empty text node', () => {
  const quote = { type: 'blockquote', content: [p(text('Gammelt citat'))] };

  assert.deepEqual(withPartText(quote, 'Nyt citat'), { type: 'blockquote', content: [p(text('Nyt citat'))] });
  assert.deepEqual(withPartText(FIELD[1], '   '), { type: 'paragraph' });
});
