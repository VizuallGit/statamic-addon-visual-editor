/**
 * Shared mutable state of tw-classes, one object so every region can read and
 * write it. Hoisted by scripts/hoist-state.mjs; the initialisers are the original ones.
 *
 * May import: nothing.
 */
export const twState = {
  /**
   * The picked tag: `from`/`openTo` locate its open tag in the dock's HTML.
   *
   * A `{{ partial }}` call has no tag of its own to write into. When its
   * component reads a class parameter (`{{ class }}`, `{{ _class }}`, a `class`
   * prop) the classes go into that parameter on the call instead: `component`
   * marks such a node, `param` is the parameter — `undefined` while the server
   * is asked, `null` when the component takes no classes.
   */
  node: null,
  openChipId: '',
};
