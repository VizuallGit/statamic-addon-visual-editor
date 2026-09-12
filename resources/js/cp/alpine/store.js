import { reactive } from 'vue';

/**
 * What the Alpine pane shows about the picked tag.
 *
 * Same shape as `twUi` one pane over, because it answers the same shape of
 * question about the same tag: here is what it has, here is how to add.
 */
export const alpineUi = reactive({
  tag: '',
  emptyText: '',
  addLabel: '',
  dropTitle: '',
  chips: [],
  states: [],
  canEdit: false,
  onAdd: null,
  onChip: null,
  onDrop: null,
});
