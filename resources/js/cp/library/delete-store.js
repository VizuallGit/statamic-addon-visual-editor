import { reactive } from 'vue';

export const deleteLibraryUi = reactive({
  title: '',
  body: '',
  leads: [],
  usages: [],
  usageHeading: '',
  buttons: [],
  onPick: null,
  onClose: null,
});
