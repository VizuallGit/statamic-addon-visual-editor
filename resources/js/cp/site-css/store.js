import { reactive } from 'vue';

export const siteCssUi = reactive({
  // Which files the panel shows: css (stylesheets), js (scripts) or svg (icons).
  kind: 'css',
  tabs: [],
  svgPreview: '',
  previewLabel: '',
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
