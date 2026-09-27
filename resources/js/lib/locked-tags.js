/**
 * Antlers tags the dock shows but will not let anyone change.
 *
 * `{{ vite … }}` and the `yield_*` tags are not markup — they are how the
 * built stylesheet and the page's scripts reach the browser. Change the path
 * and the site loses its CSS or its JavaScript, with nothing on screen saying
 * why. `{{ theme_tokens }}` writes the theme's custom properties, so the whole
 * colour system hangs off it.
 *
 * They are worth seeing, because a layout without them reads as incomplete.
 * They are not worth editing by hand.
 *
 * May import: nothing.
 */
const LOCKED = /\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;

/**
 * Every locked range in this text, flat, as CodeMirror's `changeFilter`
 * wants them: from, to, from, to.
 */
export function lockedRanges(text) {
  const out = [];

  LOCKED.lastIndex = 0;

  let match;

  while ((match = LOCKED.exec(String(text || '')))) {
    out.push(match.index, match.index + match[0].length);
  }

  return out;
}

/**
 * Edits that come from a person: typing, deleting, pasting, dragging.
 *
 * The lock guards the build plumbing against being edited by hand. It is not
 * a guard against the dock itself, and CodeMirror does not know the
 * difference: a `changeFilter`'s ranges apply to *every* transaction, and a
 * change it refuses is dropped while the rest of the transaction still lands.
 *
 * So when the dock replaces the pane's whole contents — switching which slice
 * of the file is on screen, tidying the markup — the filter turns one clean
 * swap into the new text plus the old locked tags, stranded on the end and
 * stacking up with every further swap.
 *
 * `undo` is deliberately absent. It replays a document that already held the
 * tags, so there is nothing to protect, and half-applying it would cause the
 * very damage described above.
 */
const HAND_EDITS = ['input', 'delete', 'move'];

/**
 * Takes CodeMirror's `tr.isUserEvent`, so this stays testable without an
 * editor: every transaction a person caused is tagged with a user event,
 * and the dock's own programmatic dispatches are not.
 */
export function editedByHand(isUserEvent) {
  return HAND_EDITS.some((event) => isUserEvent(event));
}
