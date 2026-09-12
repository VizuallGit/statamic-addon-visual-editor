import { reactive } from 'vue';

/**
 * What the component's fields panel is showing.
 *
 * One store for both places it can be drawn — the left column while a
 * component is open in Live Preview, the right pane otherwise. `inSidebar`
 * says which, so neither surface has to know about the other.
 *
 * Rows carry a `key` that does not move with the value: a key tied to the
 * handle would rebuild the input on every keystroke and take the caret with
 * it — the same trap the inspector's own key comment describes.
 */
export const componentPropsUi = reactive({
  open: false,
  inSidebar: false,
  locked: false,
  title: '',
  name: '',
  addLabel: '',
  removeLabel: '',
  handleLabel: '',
  defaultLabel: '',
  emptyText: '',
  bindLabel: '',
  bindHint: '',
  statamicFields: false,
  moveLabel: '',
  bindingHandle: '',
  types: [],
  rows: [],
  openKey: null,
  onAdd: null,
  onEdit: null,
  onRemove: null,
  onReorder: null,
  onBind: null,
  defaultStore: null,
  // The other thing the left column can be showing: the values *this place*
  // gives a component, when its row is picked in the tree. Separate from
  // `open`, which is the component's own fields while you are inside it.
  callOpen: false,
  callTitle: '',
  callStore: null,
  onOpen: null,
  exitOpen: false,
  exitName: '',
  exitLabel: '',
  exitTitle: '',
  onExit: null,
});
