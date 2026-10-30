import { reactive } from 'vue';

/**
 * Build mode's facts the rest of the editor reads.
 *
 * Owner: Build mode. Written by build-mode-host.js (the switch under the top
 * bar); nothing else of Build is loaded to answer them.
 *
 * `mode` is the mode Live Preview is in: 'content', 'visual' (Vizuall Build:
 * the Build panel, the canvas, the tree) or 'fields' (the same, with the form
 * in the left column instead of the panel). The canvas stands while it is not
 * 'content'. The HTML dock is shown or hidden apart from this.
 *
 * `on` is the Build panel holding the left column — 'visual' only. The
 * column's other two borrowers — selection-panel.js and
 * component-props-host.js — stand aside while it is set, the way the
 * selection panel stands aside for a component's values. In 'fields' the
 * column is the form's, as in Content.
 */
export const buildModeUi = reactive({
  mode: 'content',
  on: false,
  // Where Add puts the next element: a row's path, set by a + on Build's
  // canvas or by the panel; '' = the picked row.
  plusPath: '',
});
