/**
 * Tags the dock shows but will not let anyone change.
 *
 * `{{ vite … }}` and `{{ yield_scripts }}` are not markup — they are how the
 * built stylesheet and the page's scripts reach the browser. Change the path
 * and the site loses its CSS or its JavaScript, with nothing on screen saying
 * why. They are worth seeing, because a layout without them reads as
 * incomplete; they are not worth editing by hand.
 *
 * Kept as a filter rather than a whole read-only editor: everything else in
 * the file stays editable, and the guard is on the text itself, so it holds
 * however a person's edit arrives — typing, paste, Emmet, an autocomplete.
 *
 * So is an element someone locked with the HTML tree's padlock
 * (`{{# sve-lock #}}` in front of it): the element and everything inside it,
 * marker included, so the lock cannot be typed away.
 *
 * May import: code-dock.js re-exports, lib/, html-tree-parse.js.
 */
import { Decoration, EditorState, EditorView, RangeSetBuilder, StateField } from '../code-dock.js';
import { editedByHand, lockedRanges } from '../lib/locked-tags.js';
import { lockedElementRanges } from '../html-tree-parse.js';

// The last text asked about, and its ranges: the decorations and the filter
// ask for the same document on every keystroke.
let memo = { text: null, ranges: [] };

/** The build plumbing and the locked elements, in document order. */
function allLocked(text) {
  if (memo.text !== text) {
    memo = { text, ranges: lockedRanges(text, text.includes('sve-lock') ? lockedElementRanges(text) : []) };
  }

  return memo.ranges;
}

/**
 * Built inside the call, never at import time.
 *
 * `code-dock.js` exports these as `let` and fills them when CodeMirror loads,
 * so anything reading them while the module is being imported gets
 * `undefined` — and a decoration built from `undefined` fails silently,
 * taking the whole pane with it.
 */
function build(state, mark) {
  const builder = new RangeSetBuilder();
  const ranges = allLocked(state.doc.toString());

  for (let i = 0; i < ranges.length; i += 2) {
    builder.add(ranges[i], ranges[i + 1], mark);
  }

  return builder.finish();
}

let cached = null;

/**
 * Same shape as the dock's other UI modules: one object with `extensions`.
 *
 * `changeFilter` takes a flat list of offsets that must survive a transaction.
 * CodeMirror drops any change touching one and keeps the rest, so a paste
 * across the whole file still lands — minus the lines nobody should be
 * editing.
 *
 * Only for edits a person made. The dock's own dispatches replace the pane
 * wholesale, and dropping part of one of those strands the old tags in the
 * new text — see `editedByHand`.
 */
export function lockedUi() {
  if (cached) {
    return cached;
  }

  const mark = Decoration.mark({ class: 'sve-dock-locked' });

  const field = StateField.define({
    create: (state) => build(state, mark),
    update: (value, tr) => (tr.docChanged ? build(tr.state, mark) : value),
    provide: (f) => EditorView.decorations.from(f),
  });

  const style = EditorView.baseTheme({
    '.sve-dock-locked': {
      opacity: '.55',
      borderRadius: '.1875rem',
      backgroundColor: 'rgba(127,127,127,.14)',
      cursor: 'not-allowed',
    },
  });

  cached = {
    extensions: [
      field,
      style,
      EditorState.changeFilter.of((tr) =>
        editedByHand((event) => tr.isUserEvent(event))
          ? allLocked(tr.startState.doc.toString())
          : true
      ),
    ],
  };

  return cached;
}
