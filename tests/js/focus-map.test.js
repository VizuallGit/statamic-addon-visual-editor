/**
 * The HTML pane's All view: the picked element's range follows every edit made
 * to the whole file, so switching back shows the same element — not whatever
 * now sits at its old offsets.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EditorState } from '@codemirror/state';
import { mapFocus } from '../../resources/js/lib/focus-map.js';

const FILE = '{{ switch }}\n<section id="a">\n  <p>x</p>\n</section>\n{{ /switch }}\n';
const SECTION = { from: FILE.indexOf('<section'), to: FILE.indexOf('</section>') + '</section>'.length };

function edit(text, spec) {
  const tr = EditorState.create({ doc: text }).update({ changes: spec });

  return { doc: tr.state.doc.toString(), changes: tr.changes };
}

const slice = (text, focus) => text.slice(focus.from, focus.to);

test('text written above the section moves the range along', () => {
  const { doc, changes } = edit(FILE, { from: 0, insert: '{{ _bg = "red" }}\n' });
  const focus = mapFocus(SECTION, changes);

  assert.equal(slice(doc, focus), slice(FILE, SECTION));
});

test('text typed right in front of the element stays outside it', () => {
  const { doc, changes } = edit(FILE, { from: SECTION.from, insert: '<div></div>\n' });
  const focus = mapFocus(SECTION, changes);

  assert.ok(slice(doc, focus).startsWith('<section'));
  assert.equal(slice(doc, focus), slice(FILE, SECTION));
});

test('text typed right after the element stays outside it', () => {
  const { doc, changes } = edit(FILE, { from: SECTION.to, insert: '\n<footer></footer>' });
  const focus = mapFocus(SECTION, changes);

  assert.equal(slice(doc, focus), slice(FILE, SECTION));
});

test('an edit inside the element stretches the range', () => {
  const at = FILE.indexOf('x</p>');
  const { doc, changes } = edit(FILE, { from: at, to: at + 1, insert: 'hello' });
  const focus = mapFocus(SECTION, changes);

  assert.equal(slice(doc, focus), '<section id="a">\n  <p>hello</p>\n</section>');
});

test('an edit below the element leaves it where it is', () => {
  const at = FILE.indexOf('{{ /switch }}');
  const { changes } = edit(FILE, { from: at, to: at + '{{ /switch }}'.length, insert: '{{ /switch }}\n{{ /if }}' });

  assert.deepEqual(mapFocus(SECTION, changes), SECTION);
});

test('deleting the element lets go of it', () => {
  const { changes } = edit(FILE, { from: SECTION.from, to: SECTION.to, insert: '' });

  assert.equal(mapFocus(SECTION, changes), null);
});

test('no pick stays no pick', () => {
  const { changes } = edit(FILE, { from: 0, insert: 'a' });

  assert.equal(mapFocus(null, changes), null);
});

/**
 * Why each swap of the pane starts a fresh undo history (dock/undo.js): with
 * the old one, an undone deletion made in the element's slice is replayed
 * after the swap as an insertion at the end of the whole file.
 */
test('a swap with a fresh undo history cannot replay the other view into the file', async () => {
  const { Compartment, EditorState: State } = await import('@codemirror/state');
  const { history, undo } = await import('@codemirror/commands');
  const full = '{{ if x }}\n<section>\n<p>hello</p>\n</section>\n{{ /if }}';
  const slice = '<section>\n<p>hello</p>\n</section>';
  const run = (reset) => {
    const undoable = new Compartment();
    let state = State.create({ doc: slice, extensions: [undoable.of(history())] });
    const at = slice.indexOf('hello');

    state = state.update({ changes: { from: at, to: at + 5 } }).state;
    // The swap: what the pane holds goes into the file, the file comes up.
    const file = full.replace('hello', '');

    state = state.update({ changes: { from: 0, to: state.doc.length, insert: file } }).state;

    if (reset) {
      state = state.update({ effects: undoable.reconfigure([]) }).state;
      state = state.update({ effects: undoable.reconfigure(history()) }).state;
    }

    let after = state;

    undo({ state, dispatch: (tr) => { after = tr.state; } });

    return after.doc.toString();
  };

  assert.notEqual(run(false), full.replace('hello', ''), 'the old history replays the deletion somewhere');
  assert.equal(run(true), full.replace('hello', ''));
});
