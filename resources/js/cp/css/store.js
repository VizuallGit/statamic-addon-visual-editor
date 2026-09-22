import { reactive } from 'vue';

/**
 * What the CSS pane's head row shows, written by code-dock.js.
 *
 * The same shape as `twUi` on purpose: the two rows sit in the same place and
 * answer the same three questions — which tag, which size, which state — so a
 * reader switching between CSS and Tailwind should not have to re-learn them.
 */
export const cssUi = reactive({
  tag: '',
  scope: '',
  scopeElsewhere: [],
  scopeElsewhereTitle: '',
  onScopeImport: null,
  onTag: null,
  sizes: [],
  onSize: null,
  state: '',
  stateLabel: '',
  onState: null,
  canEdit: false,
  note: '',
});
