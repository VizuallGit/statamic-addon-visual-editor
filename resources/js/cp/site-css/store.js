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
  saveLabel: '',
  reloadTitle: '',
  emptyLabel: '',
  notImported: '',
  importLabel: '',
});
