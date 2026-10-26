/**
 * ghost-suggest.js: when grey text is asked for, what is sent, and what is
 * left of a suggestion the author types through.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AFTER_CHARS,
  BEFORE_CHARS,
  MAX_FIELDS,
  advanceGhost,
  fieldRows,
  ghostRequest,
  nextWord,
  shouldAsk,
} from '../../resources/js/dock/ghost-suggest.js';

const at = (source) => ({ full: source.replace('|', ''), pos: source.indexOf('|') });

test('asks at the end of a line', () => {
  const { full, pos } = at('<div class="wrap">\n  <h2|\n</div>');

  assert.equal(shouldAsk(full, pos), true);
});

test('asks inside a visual_edit being typed, with the element after it on the line', () => {
  const { full, pos } = at('<h2 class="x" {{ visual_|>{{ title }}</h2>');

  assert.equal(shouldAsk(full, pos), true);
});

test('asks inside an opening tag still being written', () => {
  const { full, pos } = at('<h2 class="x" |>{{ title }}</h2>');

  assert.equal(shouldAsk(full, pos), true);
});

test('asks where only closing marks follow', () => {
  const { full, pos } = at('<div class="text-lg |">');

  assert.equal(shouldAsk(full, pos), true);
});

test('never in the middle of a word', () => {
  const { full, pos } = at('<h2>{{ ti|tle }}</h2>');

  assert.equal(shouldAsk(full, pos), false);
});

test('not in text content with more written after it', () => {
  const { full, pos } = at('<p>Hello | world</p>');

  assert.equal(shouldAsk(full, pos), false);
});

test('on a fresh line under a written one, not under an empty one', () => {
  const fresh = at('<ul>\n  |\n</ul>');
  const empty = at('<ul>\n\n  |\n</ul>');

  assert.equal(shouldAsk(fresh.full, fresh.pos), true);
  assert.equal(shouldAsk(empty.full, empty.pos), false);
});

test('never inside a locked element', () => {
  const { full, pos } = at('<div>\n  <h2|\n</div>');

  assert.equal(shouldAsk(full, pos, [0, full.length]), false);
  assert.equal(shouldAsk(full, pos, [100, 200]), true);
});

test('the request is the file around the caret, cut to size', () => {
  const full = 'a'.repeat(BEFORE_CHARS + 50) + 'b'.repeat(AFTER_CHARS + 50);
  const pos = BEFORE_CHARS + 50;
  const req = ghostRequest(full, pos);

  assert.equal(req.before.length, BEFORE_CHARS);
  assert.equal(req.after.length, AFTER_CHARS);
  assert.ok(req.before.endsWith('a'));
  assert.ok(req.after.startsWith('b'));
});

test('a short file is sent whole', () => {
  assert.deepEqual(ghostRequest('<h2>x</h2>', 4), { before: '<h2>', after: 'x</h2>' });
});

test('the Data rows are cut to handle, type, label and parent', () => {
  const rows = fieldRows([
    { var: 'title', type: 'text', label: 'Title', value: 'Hello', snippet: '{{ title }}' },
    { var: 'items.text', type: 'text', label: 'Text', parent: 'items' },
    { var: '' },
    null,
  ]);

  assert.deepEqual(rows, [
    { var: 'title', type: 'text', label: 'Title' },
    { var: 'items.text', type: 'text', label: 'Text', parent: 'items' },
  ]);
});

test('no more rows than the prompt takes', () => {
  const rows = Array.from({ length: MAX_FIELDS + 10 }, (_, i) => ({ var: `f${i}` }));

  assert.equal(fieldRows(rows).length, MAX_FIELDS);
  assert.deepEqual(fieldRows(undefined), []);
});

test('typing the grey text keeps the rest standing; typing something else drops it', () => {
  assert.equal(advanceGhost('edit field="title" }}', 'ed'), 'it field="title" }}');
  assert.equal(advanceGhost('edit }}', 'edit }}'), '');
  assert.equal(advanceGhost('edit }}', 'x'), null);
  assert.equal(advanceGhost('edit }}', ''), null);
});

test('⌘→ takes the next word with what stands before it', () => {
  assert.equal(nextWord('edit field="title" }}'), 'edit');
  assert.equal(nextWord(' field="title" }}'), ' field');
  assert.equal(nextWord('="title" }}'), '="');
  assert.equal(nextWord(''), '');
});
