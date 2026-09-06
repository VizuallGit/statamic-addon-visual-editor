/**
 * What the accessibility panel is showing.
 *
 * Plain display data only — the elements themselves stay in a11y-scan.js, out
 * of Vue's reach, because a reactive proxy around a live DOM node is a trap
 * nobody needs. One pane store rather than one per tab: the tabs ask different
 * questions of the page but they answer in the same shape, and one shape means
 * one list component to keep right.
 */
import { reactive } from 'vue';

export const a11yUi = reactive({
  tab: 'headings',
  tabs: [],
  onTab: null,
  headingIssues: 0,
  headingLevel: 'warning',
  /** What each tab has found, for the count on the tab itself. */
  found: { contrast: 0, checks: 0, tree: 0 },
  scanned: { contrast: false, checks: false, tree: false },
});

export const paneUi = reactive({
  ready: false,
  hint: '',
  emptyText: '',
  rows: [],
  counts: [],
  toggleLabel: '',
  toggleOn: false,
  showToggle: false,
  showGroups: false,
  groups: [],
  onGroup: null,
  active: '',
  onJump: null,
  onHover: null,
  onToggle: null,
});

/**
 * The accessibility tree. Its own store because its rows are a different shape
 * — nesting, a fold state and a verdict per node, rather than a flat finding.
 */
export const treeUi = reactive({
  hint: '',
  emptyText: '',
  note: '',
  rows: [],
  active: '',
  showAllLabel: '',
  showAll: false,
  onPick: null,
  onTwist: null,
  onToggleAll: null,
});

/** The pills over the preview. Rebuilt on every scroll; never edited in place. */
export const markerUi = reactive({
  markers: [],
  onPick: null,
});
