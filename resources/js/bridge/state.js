/**
 * Shared mutable state of bridge, one object so every region can read and
 * write it. Hoisted by scripts/hoist-state.mjs; the initialisers are the original ones.
 *
 * May import: nothing.
 */
export const bridgeState = {
  pendingEdit: null,
  editing: null,
  requestSeq: 0,
  htmlPick: null,
  pickAwait: null,
  componentFocus: null,
  componentMap: [],
  toolbarEl: null,
  toolbarTheme: null,
  globalFocusEl: null,
  globalFocusId: null,
  globalSectionLabel: null,
  chromeFocusEl: null,
  chromeFocusKind: null,
  chromeFocusKindSticky: null,
  pillBox: null,
  moveCtrlEl: null,
  moveTargetEl: null,
  moveReposition: null,
  moveCtrlRowButtons: null,
  pendingRowCaps: null,
  dragState: null,
  dragJustEnded: false,
  inserterInstances: [],
};
