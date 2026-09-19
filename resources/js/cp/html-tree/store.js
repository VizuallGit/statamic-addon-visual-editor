import { reactive } from 'vue';
import { chromeGet, chromeRemove, chromeSet } from '../../chrome-prefs.js';
import { HTML_TREE_LOOK_KEY } from '../../lib/ids.js';

/**
 * Which face the tree wears. 'tags' is the tree's own: flat rows, a guide per
 * level, a colour per family of tag. 'classic' is the card look it shared with
 * the block tree, kept whole so the switch in Live Preview settings goes
 * straight back to it. Stored per user (chrome-prefs syncs the key), read
 * here so the panel and the settings menu agree on what the value means.
 */
export function readHtmlTreeLook(win) {
  return chromeGet(win, HTML_TREE_LOOK_KEY) === 'classic' ? 'classic' : 'tags';
}

export function setHtmlTreeLook(win, look) {
  if (look === 'classic') {
    chromeSet(win, HTML_TREE_LOOK_KEY, 'classic');
  } else {
    chromeRemove(win, HTML_TREE_LOOK_KEY);
  }

  htmlTreeUi.look = readHtmlTreeLook(win);
}

export const htmlTreeUi = reactive({
  // 'tags' or 'classic' — see readHtmlTreeLook. The list wears it as
  // data-sve-ht-look, and every rule of the tags look hangs off that.
  look: 'tags',
  // The user's own family colours as inline --sve-fam-* properties on the
  // list (family-colors.js); empty = the stylesheet's defaults.
  familyStyle: {},
  // What the search box holds. The list filters by it on every keystroke;
  // html-tree.js is only asked to paint again (onQuery) when the box goes
  // from empty to not, or back — a search looks through folded rows too, so
  // that paint flattens the whole file instead of the folded view.
  query: '',
  onQuery: null,
  searchEmpty: '',
  emptyText: '',
  rows: [],
  // The page's own sections, above the tags. One row each, and the section whose
  // file the dock is showing is the only one holding its tags — see html-tree.js.
  sections: [],
  // Publish form has page_sections (even when the list is empty). The plus stays.
  pageBuilder: false,
  onSection: null,
  // Read the page again now, rather than waiting for the dock to announce a new
  // file. A section added from inside the panel changes the form's values and
  // nothing else — there is no `dock:html-changed` behind it.
  onRefresh: null,
  editingId: null,
  draft: '',
  renameTitle: '',
  hideTitle: '',
  showTitle: '',
  duplicateTitle: '',
  deleteTitle: '',
  lockedTitle: '',
  canEdit: false,
  // A component is open in the dock: its rows sit inside the section's, and
  // everything that is not the component fades.
  inComponent: false,
  onContextRow: null,
  // A static section was just made: forget the page template, open the new file.
  onStaticMade: null,
  dragging: false,
  dropId: null,
  dropPlace: null,
  onSelect: null,
  onTwist: null,
  tagTitle: '',
  onTagChange: null,
  onRename: null,
  onRenameCommit: null,
  onRenameCancel: null,
  onHide: null,
  onDuplicate: null,
  onDelete: null,
  onPointerDown: null,
  onContext: null,
  slotText: '',
  dataTitle: '',
  pageTitle: '',
  onInspectData: null,
  onPropValue: null,
  onPropPage: null,
  onPropHost: null,
  onLoopSortField: null,
  onLoopSortDir: null,
  onLoopLimit: null,
  inspect: null,
  onInspectCommit: null,
  onLoopKind: null,
  onAddBranch: null,
  // The way out of a component. Off for a section: there is nothing to leave.
  exitOpen: false,
  exitName: '',
  exitLabel: '',
  exitTitle: '',
  onExit: null,
});
