/**
 * Undo that starts over when the pane starts showing something else.
 *
 * The HTML pane swaps its text when it goes from the picked element to the
 * whole file (All) and back. CodeMirror carries older undo steps through such
 * a swap, and an undone deletion is an insertion that lands where the swap
 * ended — at the end of the file, or inside the section — which the dock then
 * saves. So each swap begins a new undo history: steps from the other view
 * cannot be replayed into this one.
 */
import { cm, editors, history } from '../code-dock.js';

const compartments = {};

/** The editor's history extension, in a compartment `freshUndo` can reset. */
export function undoHistory(handle) {
  compartments[handle] = new cm.state.Compartment();

  return compartments[handle].of(history());
}

export function freshUndo(handle) {
  const view = editors[handle];
  const compartment = compartments[handle];

  if (!view || !compartment) {
    return;
  }

  view.dispatch({ effects: compartment.reconfigure([]) });
  view.dispatch({ effects: compartment.reconfigure(history()) });
}
