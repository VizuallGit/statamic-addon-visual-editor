/**
 * Shared mutable state of html-tree, one object so every region can read and
 * write it. Hoisted by scripts/hoist-state.mjs; the initialisers are the original ones.
 *
 * May import: nothing.
 */
export const htmlTreeState = {
  /** The file the tree last opened, so it only unfolds afresh when it changes. */
  htmlTreeFileKey: '',
  /**
   * The markup on screen when the dock said it had moved to another file, or
   * false when nothing is awaited. The move is announced before the file lands,
   * so this is what tells the two apart: the first render whose markup differs
   * is the new file arriving, and that is when the tree reseats itself.
   */
  htmlTreeReseat: false,
  /** No section is unfolded until one is asked for. Set again on every open. */
  htmlTreeShutStart: true,
  /** A section clicked whose file has not arrived yet. Drawn as open already. */
  htmlTreePendingUid: '',
  htmlTreePendingTimer: 0,
  /** The markup on screen when it was clicked — the file it is waiting to leave. */
  htmlTreePendingHtml: '',
  /**
   * Markup the tree is drawing ahead of the dock, from that cache.
   *
   * Set only between a click and the dock catching up. While it stands, the rows
   * on screen are *not* the rows the dock would edit — every id in them is an
   * offset into a file the dock has not loaded yet — so nothing may write.
   */
  htmlTreeAhead: '',
  /** True when the click stays on the same template, so no new markup is coming. */
  htmlTreePendingSame: false,
  htmlTreeActiveId: null,
  /**
   * The path of the layout's <body> while the tree is cut to it, '' otherwise.
   * The rows above it are not drawn, so it is the top the reader sees — and it
   * folds the way the top does: open unless the folds say otherwise (htmlTreeShut).
   */
  htmlTreeTopPath: '',
  htmlTreeRoots: [],
  htmlTreeSuppressClick: false,
  htmlTreeMenu: null,
  /**
   * A sort direction chosen before there is a field to sort by.
   *
   * `{{ items | sort: }}` is not a thing that can be written, so picking
   * "Ascending" on its own writes nothing — and without remembering the choice
   * the select would snap back to "As it comes" on the next repaint, which is
   * every keystroke in the limit box. Held here until the field arrives.
   */
  htmlTreeSortDraft: null,
};

/**
 * The rows whose fold the reader has flipped, by path.
 *
 * Two things are load-bearing here. **Paths, not row ids**: an id is an offset
 * into the file, so every edit above a row renames it — a fold state keyed on
 * ids springs the whole tree open on a keystroke, and a state carried into the
 * next file lands on whatever happens to sit at those offsets. And **flipped,
 * not collapsed**: the top level is open and everything under it is shut
 * unless this set says otherwise, so a tree with nothing remembered about it
 * is already the tree a click asked for.
 */
export const htmlTreeFolds = new Set();
/**
 * Every section's markup, fetched before anyone asks for it.
 *
 * The dock takes about half a second to answer a click — fetch, panes, debounce
 * — and the tree used to sit and wait for it, so opening a section arrived in
 * two steps. Nothing about these files is expensive to hold: the panel fetches
 * each once while the reader is still looking at the list, and a click then has
 * the tags already.
 */
export const htmlTreeTemplates = new Map();
export const htmlTreeFetching = new Set();
/** Each cached template's first tag, parsed once per markup: type → { html, tag }. */
export const htmlTreeRootTags = new Map();
/** The tag a shut row was drawn with before its file arrived: type → tag. */
export const htmlTreeGuessedTags = new Map();
