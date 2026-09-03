import { reactive } from 'vue';

export const siteCssUi = reactive({
  root: 'resources/css',
  tree: [],
  path: '',
  imported: true,
  status: '',
  loading: false,
  dirty: false,
  title: '',
  addLabel: '',
  renameLabel: '',
  deleteLabel: '',
  saveLabel: '',
  reloadTitle: '',
  emptyLabel: '',
  notImported: '',
  importLabel: '',
});
