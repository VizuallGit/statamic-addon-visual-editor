/**
 * The picked element's range, carried through an edit to the whole file.
 *
 * While the HTML pane shows All, the editor holds the whole file and the pick
 * (`htmlFocus`) is a range in that same text — so every change made there can
 * move it exactly, with CodeMirror's own mapping, rather than being guessed
 * afterwards from a diff. Text typed right in front of the element pushes it
 * along; text typed right after it stays outside it.
 *
 * Null when the edit took the element away: there is nothing to go back to.
 *
 * @param {{from: number, to: number}|null} focus
 * @param {{mapPos: (pos: number, assoc?: number) => number}} changes  a CodeMirror ChangeSet
 * @returns {{from: number, to: number}|null}
 */
export function mapFocus(focus, changes) {
  if (!focus || !changes) {
    return focus ?? null;
  }

  const from = changes.mapPos(focus.from, 1);
  const to = changes.mapPos(focus.to, -1);

  return to > from ? { from, to } : null;
}
