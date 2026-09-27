import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EditorState } from '@codemirror/state';
import { editedByHand, lockedRanges } from '../../resources/js/lib/locked-tags.js';

const locked = (html) => {
  const r = lockedRanges(html);
  const out = [];

  for (let i = 0; i < r.length; i += 2) {
    out.push(html.slice(r[i], r[i + 1]));
  }

  return out;
};

test('the build plumbing is locked', () => {
  assert.deepEqual(
    locked('{{ vite src="resources/js/site.js" }}\n{{ yield_scripts }}'),
    ['{{ vite src="resources/js/site.js" }}', '{{ yield_scripts }}']
  );
});

test('the whole yield family and the theme tokens go with them', () => {
  assert.deepEqual(
    locked('{{ yield_minified }}{{ theme_tokens }}{{ vite src="resources/css/site.css" }}'),
    ['{{ yield_minified }}', '{{ theme_tokens }}', '{{ vite src="resources/css/site.css" }}']
  );
});

test('everything a person actually writes stays editable', () => {
  const html = '<main class="wrapper">{{ template_content }}{{ partial:site_head }}{{ title }}</main>';

  assert.deepEqual(locked(html), []);
});

test('a tag that only starts like one is not locked', () => {
  assert.deepEqual(locked('{{ vitest }}{{ yielding }}{{ theme_tokens_extra }}'), []);
});

test('ranges come back flat and in order, the way changeFilter wants them', () => {
  const html = 'a {{ yield_scripts }} b {{ theme_tokens }} c';
  const r = lockedRanges(html);

  assert.equal(r.length, 4);
  assert.ok(r[0] < r[1] && r[1] <= r[2] && r[2] < r[3]);
  assert.equal(html.slice(r[0], r[1]), '{{ yield_scripts }}');
});

test('nothing in, nothing out', () => {
  assert.deepEqual(lockedRanges(''), []);
  assert.deepEqual(lockedRanges(null), []);
});

/**
 * The lock in front of a real CodeMirror state.
 *
 * `lockedRanges` on its own was green while the dock was stranding tags in
 * the layout, because the bug was never in the ranges — it was in handing
 * them to CodeMirror for transactions the dock itself had dispatched. These
 * build the filter the same way `dock/locked-tags.js` wires it, since that
 * module imports the browser dock and cannot be loaded here.
 */
const filter = EditorState.changeFilter.of((tr) =>
  editedByHand((event) => tr.isUserEvent(event))
    ? lockedRanges(tr.startState.doc.toString())
    : true
);

const HEAD = '<head>{{ vite src="resources/css/site.css" }}{{ theme_tokens }}</head>';
const BODY = '<body>{{ partial:site_head }}{{ yield_scripts }}</body>';

const swap = (state, insert, spec = {}) =>
  state.update({ changes: { from: 0, to: state.doc.length, insert }, ...spec }).state;

test('the dock may replace the pane wholesale', () => {
  const after = swap(EditorState.create({ doc: HEAD, extensions: [filter] }), BODY);

  assert.equal(after.doc.toString(), BODY);
});

test('and replacing it again does not stack the old tags up', () => {
  let state = EditorState.create({ doc: HEAD, extensions: [filter] });

  for (let i = 0; i < 4; i += 1) {
    state = swap(state, i % 2 ? HEAD : BODY);
  }

  assert.equal(state.doc.toString(), HEAD);
  assert.equal(state.doc.toString().match(/theme_tokens/g).length, 1);
});

test('a person still cannot type over the build plumbing', () => {
  const state = EditorState.create({ doc: HEAD, extensions: [filter] });
  const at = HEAD.indexOf('{{ theme_tokens }}');
  const after = state.update({
    changes: { from: at, to: at + '{{ theme_tokens }}'.length, insert: 'gone' },
    userEvent: 'input.type',
  }).state;

  assert.equal(after.doc.toString(), HEAD);
});

test('a person deleting the whole pane keeps the plumbing and loses the rest', () => {
  const state = EditorState.create({ doc: HEAD, extensions: [filter] });
  const after = swap(state, '', { userEvent: 'delete.selection' });
  const text = after.doc.toString();

  assert.ok(text.includes('{{ theme_tokens }}'));
  assert.ok(!text.includes('<head>'));
});

test('but everything else a person writes lands untouched', () => {
  const state = EditorState.create({ doc: BODY, extensions: [filter] });
  const at = BODY.indexOf('<body>') + '<body>'.length;
  const after = state.update({
    changes: { from: at, insert: '<main></main>' },
    userEvent: 'input.type',
  }).state;

  assert.ok(after.doc.toString().includes('<body><main></main>'));
});
