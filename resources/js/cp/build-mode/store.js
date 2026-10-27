import { reactive } from 'vue';

/**
 * Build mode's one fact the rest of the editor reads: is Build on?
 *
 * Owner: Build mode. Written by build-mode-host.js (the top bar's switch);
 * read by the left column's other two borrowers — selection-panel.js and
 * component-props-host.js — which stand aside while it is on, the way the
 * selection panel stands aside for a component's values. Nothing else of
 * Build is loaded to answer it.
 */
export const buildModeUi = reactive({
  on: false,
  // Where Add puts the next element: a row's path, set by the + on that row
  // in the HTML tree (HtmlTreeRow.vue) or by the panel; '' = the picked row.
  plusPath: '',
});
