import { reactive } from 'vue';

/**
 * Shared UI state for the comments list. Pin geometry stays in comments.js —
 * that layer sits on the iframe and is not Vue.
 */
export const commentsSidebar = reactive({
  filter: 'open',
  mode: false,
  openCount: 0,
  allCount: 0,
  rows: [],
  onFilter: null,
  onReveal: null,
});
