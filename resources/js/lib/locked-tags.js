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
 * So is a template's loop over the page's sections — `{{ page_sections }} …
 * {{ /page_sections }}`, or whichever field a blueprint keeps them in
 * (`sveSectionFields`). Every page drawn with the template gets its sections
 * from it; typed into, cut or doubled, they all lose them or get them twice.
 * The markup above and below it is the template's to change.
 *
 * May import: nothing.
 */
const LOCKED = /\{\{\s*(?:vite\b[^}]*|yield_[a-z_]+|theme_tokens)\s*\}\}/g;

const escape = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Where each loop over a sections field sits, from its opening tag to the end
 * of its closing one, flat: from, to, from, to. `loops` are field handles.
 * A loop that never closes is left alone — there is no block to guard.
 */
export function sectionLoopRanges(text, loops = []) {
  const source = String(text || '');
  const out = [];

  for (const name of loops || []) {
    if (!name) {
      continue;
    }

    const open = new RegExp(`\\{\\{\\s*${escape(name)}(?=[\\s}|])[^}]*\\}\\}`, 'g');
    const close = new RegExp(`\\{\\{\\s*\\/\\s*${escape(name)}\\s*\\}\\}`, 'g');
    let match;

    while ((match = open.exec(source))) {
      close.lastIndex = match.index + match[0].length;

      const end = close.exec(source);

      if (!end) {
        break;
      }

      out.push(match.index, end.index + end[0].length);
      open.lastIndex = end.index + end[0].length;
    }
  }

  return out;
}

/**
 * Every locked range in this text, flat, as CodeMirror's `changeFilter`
 * wants them: from, to, from, to. `loops` are the sections fields whose
 * loops are locked whole ({@link sectionLoopRanges}).
 */
export function lockedRanges(text, loops = []) {
  const out = [];

  LOCKED.lastIndex = 0;

  let match;

  while ((match = LOCKED.exec(String(text || '')))) {
    out.push(match.index, match.index + match[0].length);
  }

  const loopRanges = sectionLoopRanges(text, loops);

  if (!loopRanges.length) {
    return out;
  }

  // In document order: CodeMirror's RangeSetBuilder and changeFilter both
  // take them sorted.
  const pairs = [];

  for (const list of [out, loopRanges]) {
    for (let i = 0; i < list.length; i += 2) {
      pairs.push([list[i], list[i + 1]]);
    }
  }

  return pairs.sort((a, b) => a[0] - b[0]).flat();
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
