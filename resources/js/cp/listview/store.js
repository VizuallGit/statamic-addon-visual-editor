import { reactive } from 'vue';

export const listViewUi = reactive({
  emptyText: '',
  groups: [],
  onTwist: null,
  onSelect: null,
  onRename: null,
  onAction: null,
  onMenu: null,
  onUnlock: null,
  onDragStart: null,
  onDragEnd: null,
  onDragOver: null,
  onDragLeave: null,
  onDrop: null,
});
