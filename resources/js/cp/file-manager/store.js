import { reactive } from 'vue';

/**
 * One page, one store. The pane renders it; file-manager.js fills it.
 */
export const fileManagerUi = reactive({
  root: 'resources',
  tree: [],
  // The open file, and the folder a new file lands in. A file's own folder
  // wins, so "New file" after clicking a partial goes next to that partial.
  path: '',
  dir: '',
  name: '',
  language: 'text',
  open: {},
  status: '',
  loading: false,
  dirty: false,
  // Labels, filled from the CP user's language before the pane mounts.
  title: '',
  newFile: '',
  newFolder: '',
  renameLabel: '',
  deleteLabel: '',
  saveLabel: '',
  reloadTitle: '',
  emptyLabel: '',
});
