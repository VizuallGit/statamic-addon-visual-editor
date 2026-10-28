import { reactive } from 'vue';

/**
 * Build mode's facts the rest of the editor reads.
 *
 * Owner: Build mode. Written by build-mode-host.js (the switch under the top
 * bar); nothing else of Build is loaded to answer them.
 *
 * `mode` is the mode Live Preview is in: 'content', 'visual' (Visual Build:
 * the Build panel, the canvas, the tree) or 'html' (HTML Build: the form, the
 * canvas, the dock and the tree). The canvas stands while it is not 'content'.
 *
 * `on` is the Build panel holding the left column — Visual Build only. The
 * column's other two borrowers — selection-panel.js and
 * component-props-host.js — stand aside while it is set, the way the
 * selection panel stands aside for a component's values. In HTML Build the
 * column is the form's, as in Content.
 */
export const buildModeUi = reactive({
  mode: 'content',
  on: false,
  // Where Add puts the next element: a row's path, set by a + on Build's
  // canvas or by the panel; '' = the picked row.
  plusPath: '',
});
