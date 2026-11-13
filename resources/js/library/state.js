/**
 * Shared mutable state of section-library, one object so every region can read and
 * write it. Hoisted by scripts/hoist-state.mjs; the initialisers are the original ones.
 *
 * May import: nothing.
 */
export const libraryState = {
  // The type list is handed over at page render. Deleting one replaces it here for
  // the rest of the session — the config is a snapshot, and reloading the CP just
  // to drop a card from the picker isn't worth asking for.
  //
  // Held with the sections field it is the list of (`{ field, types }`): a page
  // whose blueprint marks a field of its own has a list of its own, and the
  // snapshot handed over at render is the default field's.
  sectionTypesOverride: null,
  /**
   * What each saved (global) section is, keyed by entry id.
   *
   * Seeded from the CP config so the block tree can name a referenced section
   * without waiting on a fetch. Grows during the session when one is saved or
   * dropped from the library — the config is a snapshot from page load.
   */
  savedSectionIndex: null,
};
