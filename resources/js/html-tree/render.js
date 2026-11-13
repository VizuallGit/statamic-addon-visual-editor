/**
 * html-tree.js — draws the tree.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { insertTemplateElement } from '../section-create.js';
import { heldVideos, syncStoredVideoHolds } from '../video-holds.js';
import { alpineStates, syncStoredAlpineStates } from '../alpine-states.js';
import { ask } from '../cp/bus.js';
import { mountPane } from '../cp/mount-pane.js';
import HtmlTreeList from '../cp/surfaces/HtmlTreeList.vue';
import { figmaLook, htmlTreeUi, readHtmlTreeLook } from '../cp/html-tree/store.js';
import { flattenHtmlTree, parseTemplateTree } from '../html-tree-parse.js';
import { syncComponentProps } from '../component-props-host.js';
import { componentBindHandle, componentBindPick } from '../component-bind.js';
import { openPageMenu } from '../link-targets.js';
import { createPropValues } from '../prop-values.js';
import { htmlTreeDisplayName, readHtmlTreeLabels } from '../html-tree-labels.js';
import { HTML_ICONS, htmlTreeIcon } from '../html-tree-icons.js';
import { tagFamily } from '../lib/tag-families.js';
import { applyFamilyColors } from '../family-colors.js';
import { twOpenTagMenuAt } from '../tw-classes.js';
import { helpOn } from '../dock/help-state.js';
import { openLogicPopup } from '../logic-popup.js';
import {
  loopDepthEdit,
  loopIncludeHomeEdit,
  loopLimitEdit,
  loopOffsetEdit,
  loopSortDirEdit,
  loopSortFieldEdit,
} from '../loop-inspector.js';
import { sectionField } from '../lib/config.js';
import { currentEntryId } from '../lib/live-preview.js';
import { pageHasSectionField } from '../lib/publish-containers.js';
import { htmlTreeFolds, htmlTreeState, htmlTreeTemplates } from './state.js';
import {
  firstTagId,
  hasNodeId,
  htmlTreeAheadOfDock,
  htmlTreeRootName,
  htmlTreeSections,
  htmlTreeShut,
  isRootNode,
} from './sections.js';
import {
  currentSectionUid,
  htmlTreePanel,
  leaveChrome,
  openHtmlTreeSection,
  selectHtmlTreeRow,
  toggleVideoHold,
} from '../html-tree.js';
import { ensureHtmlTreeStyles } from './styles.js';
import { dockHtml, dockIsOpen, paintComponentExit, prefetchSectionTemplates } from './prefetch.js';
import {
  learnOwnPage,
  missingSectionLoops,
  pageOnSharedTemplate,
  pageTemplateUi,
  paintUsedBy,
  treeOptions,
} from './used-by.js';
import {
  alpineComponents,
  beginHtmlTreeRename,
  deleteHtmlTreeRow,
  duplicateHtmlTreeRow,
  expandHtmlTreePath,
  finishHtmlTreeRename,
  hideHtmlTreeRow,
  mayUnlock,
  openAlpineState,
  publishHtmlPick,
  refuseLocked,
  toggleHtmlTreeLock,
} from './row-actions.js';
import {
  bindFrame,
  findNodeByTag,
  findNodeWhere,
  frameAroundPage,
  frameCallKinds,
  nextOutside,
  ownFileRow,
} from './frame.js';
import { openHtmlTreeMenu, openHtmlTreeRowMore } from './menus.js';
import { beginHtmlTreePointer, beginSectionPointer } from './drag.js';
import {
  activeAntlersRow,
  addHtmlTreeBranch,
  applyAntlersEdit,
  commitComponentValue,
  commitHtmlTreeInspector,
  paintHtmlTreeInspector,
  setHtmlTreeLoopKind,
} from './inspector.js';

/** The values this place gives the component. One form, reused per selection. */
export const callValues = createPropValues('sve-call-values');
/**
 * The markup the last paint drew. A file change is only "announced ahead" when
 * this paint still shows what the last one showed; when the markup has already
 * moved on, the new file is here and the reseat is due now, not later. Null
 * until the first paint — an empty file is a paint too.
 */
let htmlTreeLastHtml = null;
// The layout file the tree last stood on <main> in — seated once per landing.
let htmlTreeMainSeated = '';

/**
 * Which rows are folded away, as the ids `flattenHtmlTree` asks for.
 *
 * Worked out from the tree in front of us on every paint rather than kept in a
 * set over time: one level open is what a click asks for, and a file nobody has
 * twisted anything in is exactly that with nothing remembered.
 */
function foldedIds(roots) {
  const shut = new Set();
  // An empty loop, condition or box (rowCanHold) starts open — its room is
  // the point of it, a new <div> shows where its first child goes — and in
  // the Figma look it folds shut when twisted. The other looks never folded
  // one, and still do not.
  const emptyFolds = figmaLook();

  const walk = (nodes, depth) => {
    for (const node of nodes) {
      if (
        node.children.length
          ? htmlTreeShut(node, depth)
          : emptyFolds && (node.kind === 'antlers' || node.hollow) && htmlTreeFolds.has(node.path)
      ) {
        shut.add(node.id);
      }

      walk(node.children, depth + 1);
    }
  };

  walk(roots, 0);

  return shut;
}

export function renderHtmlTree(win) {
  const doc = win.document;
  const panel = htmlTreePanel(doc);
  const list = panel?.querySelector('[data-sve-html-tree-list]');

  if (!list) {
    return;
  }

  ensureHtmlTreeStyles(doc);
  syncComponentProps(win);

  const dock = dockHtml();

  // The dock has caught up the moment it holds the same markup: from here the
  // ids on screen are its ids again, and everything may write.
  if (htmlTreeState.htmlTreeAhead && htmlTreeState.htmlTreeAhead === dock) {
    htmlTreeState.htmlTreeAhead = '';
  }

  // A part of the frame — the header, the footer, the layout — is never
  // drawn ahead of the dock: only a section's template is held in hand. A
  // section clicked and not landed left its markup here, and the layout was
  // then read as a file with no <main> in it.
  if (ask('dock:chrome-kind')) {
    htmlTreeState.htmlTreeAhead = '';
  }

  const html = htmlTreeState.htmlTreeAhead || dock;
  const roots = parseTemplateTree(html, treeOptions(win));
  htmlTreeState.htmlTreeRoots = roots;
  // A new tree has no <body> to be cut to until the layout below says so, and
  // the files around an open component are folded before it does.
  htmlTreeState.htmlTreeTopPath = '';
  const type = ask('dock:current-type') || '';
  const aliases = readHtmlTreeLabels(type);
  const pageBuilder = pageHasSectionField(win, doc);

  if (pageBuilder) {
    learnOwnPage(win);
  }
  const component = ask('dock:component-exit-state') || {};
  const inComponent = !!component.open;

  // What the dock holds is newer than anything fetched earlier — a save half a
  // minute ago is in it and not in the cache. Before the sections are read, so
  // a root tag just changed in the dock is the one their shut rows say.
  if (type && dock && !htmlTreeState.htmlTreeAhead) {
    htmlTreeTemplates.set(type, dock);
  }

  const sections = htmlTreeSections(win, doc);

  prefetchSectionTemplates(win, sections);
  // The section the dock is actually holding, and the one the reader just
  // clicked. They are the same as soon as the file lands.
  const liveUid = currentSectionUid(win, doc, sections);

  // A page drawn by a template it shares: the template's name and the way to
  // it, and no rows — see pageOnSharedTemplate.
  if (pageOnSharedTemplate(win, pageBuilder, inComponent)) {
    const entry = currentEntryId(win);

    htmlTreeState.htmlTreeRoots = [];
    htmlTreeUi.rows = [];
    htmlTreeUi.sections = [];
    htmlTreeUi.frame = null;
    htmlTreeUi.pageBuilder = false;
    htmlTreeUi.layoutFile = false;
    htmlTreeUi.emptyFile = false;
    htmlTreeUi.sectionsMissing = [];
    htmlTreeUi.ownFile = null;
    htmlTreeUi.newSectionToo = false;
    htmlTreeUi.sectionsInLoop = '';
    htmlTreeUi.usedBy = null;
    htmlTreeUi.emptyText = '';

    if (htmlTreeUi.pageTemplate?.entry !== entry) {
      htmlTreeUi.pageTemplate = pageTemplateUi(win, entry);
    }

    htmlTreeUi.onRefresh = () => renderHtmlTree(win);
    htmlTreeUi.onSection = null;
    paintComponentExit(win);
    mountPane(list, HtmlTreeList);
    publishHtmlPick(win, []);

    return;
  }

  htmlTreeUi.pageTemplate = null;
  paintUsedBy(win, String(ask('dock:collection-view') || ''));

  // Page with every section removed while the dock still holds the last
  // section's file: showing those tags as if they belonged here is the hang
  // after delete. The tree says the page is empty and points at the plus —
  // no header, main or footer rows. Those are the layout's, and the layout
  // has its own screen; on a page with nothing in it they were three rows
  // that looked like content. A header, footer or layout file opened on
  // purpose still takes the normal path and its frame.
  const openPart = String(ask('dock:chrome-kind') || '');

  // The tag colours from the settings, on every drawing.
  applyFamilyColors(win);

  if (pageBuilder && !sections.length && !openPart) {
    htmlTreeState.htmlTreeRoots = [];
    htmlTreeUi.rows = [];
    htmlTreeUi.sections = [];
    htmlTreeUi.frame = null;
    htmlTreeUi.pageBuilder = true;
    htmlTreeUi.layoutFile = false;
    htmlTreeUi.emptyFile = false;
    htmlTreeUi.sectionsMissing = [];
    htmlTreeUi.ownFile = null;
    htmlTreeUi.newSectionToo = false;
    htmlTreeUi.sectionsInLoop = '';
    htmlTreeUi.emptyText = t(win, 'html_tree_page_empty');
    htmlTreeUi.canEdit = !ask('dock:is-locked');
    htmlTreeUi.look = readHtmlTreeLook(win);
    htmlTreeUi.onRefresh = () => renderHtmlTree(win);
    htmlTreeUi.onSection = null;
    paintComponentExit(win);
    mountPane(list, HtmlTreeList);
    publishHtmlPick(win, []);

    return;
  }

  htmlTreeUi.pageBuilder = pageBuilder;

  const fileKey = `${type}|${liveUid}`;

  // The dock says it has moved on. What it is showing is still the file being
  // left, so this only notes the move and remembers that markup; the tree
  // reseats on the first paint that shows something else — which is the new
  // file arriving. Two sections that share a template are the exception: there
  // is no new markup coming, so the move is over as soon as it is announced.
  //
  // Unless the new file is already on screen. A component opened from a row's
  // menu loads before the tree paints, so the move and its markup arrive in
  // one paint — and a reseat armed on *that* markup waited for the next change
  // to it: the first value typed into a picked component's fields. The picked
  // row jumped to the file's first tag and took the fields with it, once, and
  // never again. The last paint's markup is what tells the two cases apart.
  let reseatNow = false;

  if (fileKey !== htmlTreeState.htmlTreeFileKey) {
    htmlTreeState.htmlTreeFileKey = fileKey;
    htmlTreeFolds.clear();

    if (htmlTreeLastHtml !== null && html !== htmlTreeLastHtml) {
      reseatNow = true;
    } else {
      htmlTreeState.htmlTreeReseat = html;
    }
  }

  if (reseatNow || (htmlTreeState.htmlTreeReseat !== false && html !== htmlTreeState.htmlTreeReseat)) {
    htmlTreeState.htmlTreeReseat = false;
    htmlTreeFolds.clear();
    htmlTreeState.htmlTreeActiveId = firstTagId(roots) || null;
  }

  htmlTreeLastHtml = html;

  // The clicked section is open once its file is on screen — not merely once
  // the dock has said which file it is going to fetch.
  if (
    htmlTreeState.htmlTreePendingUid &&
    (htmlTreeState.htmlTreePendingUid === liveUid || !sections.length) &&
    (htmlTreeState.htmlTreePendingSame || html !== htmlTreeState.htmlTreePendingHtml)
  ) {
    win.clearTimeout(htmlTreeState.htmlTreePendingTimer);
    htmlTreeState.htmlTreePendingUid = '';
    htmlTreeState.htmlTreeReseat = false;

    // Unless the tree is already sitting on this file — drawn from the cache
    // the instant it was clicked — in which case it was folded and seated
    // then, and anything twisted open since stays open.
    //
    // Asked of the parsed tree, not of the flattened rows: those are built
    // further down, and reaching up for them from here threw on every click
    // that landed on the file the dock already had — which took the whole
    // paint with it, so the section simply never opened.
    if (!hasNodeId(roots, htmlTreeState.htmlTreeActiveId)) {
      htmlTreeFolds.clear();
      htmlTreeState.htmlTreeActiveId = firstTagId(roots) || null;
    }
  }

  const pendingUid = sections.some((section) => section.uid === htmlTreeState.htmlTreePendingUid)
    ? htmlTreeState.htmlTreePendingUid
    : '';
  // Which section is unfolded, and whether this file is one of the page's
  // sections at all. Header, footer and a collection's own template are not,
  // and a list of sections around their markup would be claiming otherwise.
  const openUid = htmlTreeState.htmlTreeShutStart ? '' : pendingUid || liveUid;

  // Inside a component the tree is that component and nothing else — its
  // own rows, in a box, the way the header's stand alone on the header's
  // file. The section's rows used to stand faded around it, the component
  // unfolded under the row that calls it; that gave the component's rows and
  // the whole page around them, and the reader could not tell which tree
  // they were reading. The way back out is the exit under the pane, the
  // sidebar's Exit, or a click on the faded page in the preview.
  const inSections = !!(pendingUid || liveUid);

  // A search looks through folded rows too: the list filters what is here,
  // so while a query is in the box the whole file is flattened.
  // Which part of the page's frame this file is — read off the dock's file,
  // so the rows and the frame around them can never disagree. '' on a
  // section, a component, a template.
  const dockKind = inSections || inComponent ? '' : String(ask('dock:chrome-kind') || '');

  // A template's file — an own page's, a collection's — is built from
  // markup even on a page built from sections: the plus adds an element to it.
  if (dockKind === 'template') {
    htmlTreeUi.pageBuilder = false;
  }

  // An own page built from sections, its file open: the plus offers a new
  // section as well, placed after the page's last.
  htmlTreeUi.newSectionToo = pageBuilder && dockKind === 'template' && !inComponent;
  htmlTreeUi.lastSectionUid = sections.length ? sections[sections.length - 1].uid : '';

  /*
   * The layout is the dock's answer to two different questions.
   *
   * Asked for — the reader opened it — it is the file on screen, and the tree
   * shows its body. Unasked, it is only where the dock stands when nothing is
   * chosen (dock-api: `onEmptyPage = !resolved && !uid`), and the reader is
   * looking at a page. Both say `main`, which is why a page's tree still drew
   * the frame after it was taken out of `frameAroundPage`: the frame was never
   * there because a section was open, it was there because the dock had
   * quietly fallen back to the layout.
   *
   * On a page built from sections the dock no longer falls back at all: with
   * nothing chosen it holds no file (dock-api: `showBlank`), and the first
   * section opened is what it loads. No file and no section on its way is the
   * same page as the unasked layout — the page's sections, shut. A section
   * clicked and not landed yet is not: its tags are drawn ahead of the dock.
   *
   * Header and footer are never a fallback, so they pass through untouched.
   */
  const dockEmpty = !type && !inSections;
  const pageView = pageBuilder && (dockEmpty || (dockKind === 'main' && ask('dock:on-empty-page') === true));

  /*
   * The frame belongs to the layout, and only to the layout.
   *
   * A collection's show or index is its own markup — the section, its heading,
   * its image — and drawing a header and a footer around it says the template
   * owns a page's frame, which it does not. The layout owns that, and opening
   * the layout is where you see it. Same for a page: its tree is its sections.
   *
   * `template` is the dock's word for a collection view; `pageView` is a page
   * nobody has chosen anything on — an empty dock, or the layout standing in.
   */
  const frameKind = pageView || dockKind === 'template' ? '' : dockKind;

  // The layout's own file, drawn as itself: the one answer the plus and the
  // header/footer calls below go by.
  htmlTreeUi.layoutFile = frameKind === 'main';

  // Off the layout, the next landing on it seats the tree on <main> again.
  if (frameKind !== 'main') {
    htmlTreeMainSeated = '';
  }

  // On the layout the row to stand on is <main>, and the <body> it sits in is
  // the row the tree is cut to (bodyRaw, below) — the top the reader sees.
  const mainNode = frameKind === 'main' ? findNodeByTag(roots, 'main') : null;
  const bodyNode = mainNode
    ? findNodeWhere(roots, (node) => node.tag === 'body' && hasNodeId(node.children, mainNode.id))
    : null;

  htmlTreeState.htmlTreeTopPath = bodyNode ? bodyNode.path : '';

  if (mainNode) {
    // The way down to the row the tree is cut to opens on every paint: the
    // rows above it are not drawn, so nobody could open them again. Up to that
    // row, not through it. The way on to <main> used to be opened on every
    // paint, which opened the <body> again straight after its chevron shut it
    // — the chevron did nothing.
    expandHtmlTreePath((bodyNode || mainNode).path);

    // And on through to <main> itself, on the first landing only. What is
    // inside it — `{{ template_content }}`, the hole every page fills — is the
    // reason anyone opens the layout; arriving with it folded asks for a twist
    // before the file says anything. Flipped once per landing, so a reader
    // who folds <main> or the <body> back keeps it folded.
    if (htmlTreeMainSeated !== fileKey) {
      expandHtmlTreePath(mainNode.path);
      htmlTreeFolds.add(mainNode.path);
    }
  }

  // The half's own element: the one carrying data-sve-chrome, or failing
  // that the first <header>/<footer>. Not simply the file's first tag — a
  // scope like {{ site_foot }}, a style block or a comment may stand around
  // it, and the tree stands on the element, as it stands on <main>.
  const chromeMarker =
    frameKind === 'header' || frameKind === 'footer'
      ? findNodeWhere(roots, (node) => html.slice(node.from, node.openTo).includes(`data-sve-chrome="${frameKind}"`))
      : null;
  const chromeNode =
    chromeMarker || (frameKind === 'header' || frameKind === 'footer' ? findNodeByTag(roots, frameKind) : null);

  if (chromeNode) {
    expandHtmlTreePath(chromeNode.path);
  }

  // The dock names its new file before it holds it. Until the markup is that
  // file's — <main> on the layout, the half's own element at the root — no
  // rows: a header drawn around a section's rows is worse than a moment of
  // nothing, and the dock says when the file lands.
  const landed =
    frameKind === 'main' ? !!mainNode : frameKind === 'header' || frameKind === 'footer' ? !!chromeNode : true;
  const rows = pageView || !landed ? [] : flattenHtmlTree(roots, htmlTreeUi.query ? new Set() : foldedIds(roots));

  // A page's own file or a collection's template emptied of every element is
  // a page with nothing on it yet — said so, and the plus stays to add to it.
  htmlTreeUi.emptyFile = !html.trim() && dockKind === 'template' && dockIsOpen(doc);
  htmlTreeUi.sectionsMissing = dockKind === 'template' ? missingSectionLoops(roots) : [];
  htmlTreeUi.sectionsMissingText = t(win, 'html_tree_sections_missing');
  htmlTreeUi.sectionsAddText = t(win, 'html_tree_sections_add_here');
  htmlTreeUi.onAddSections = (field) => {
    const at = insertTemplateElement(win, `sections:${field}`, null, t(win, 'html_tree_sections_slot'));

    if (at !== null) {
      htmlTreeUi.selectFrom = { at, left: 4 };
    }
  };

  if (!html.trim() && !dockIsOpen(doc)) {
    htmlTreeUi.emptyText = t(win, 'html_tree_need_dock');
  } else if (htmlTreeUi.emptyFile) {
    htmlTreeUi.emptyText = t(win, 'html_tree_page_no_html');
  } else {
    htmlTreeUi.emptyText = t(win, 'html_tree_empty');
  }

  htmlTreeUi.slotText = t(win, 'antlers_drop_here');
  htmlTreeUi.dataTitle = t(win, 'data_vars_title');
  htmlTreeUi.pageTitle = t(win, 'component_props_page');
  htmlTreeUi.renameTitle = t(win, 'html_tree_rename');
  htmlTreeUi.tagTitle = t(win, 'tw_tag');
  htmlTreeUi.hideTitle = t(win, 'html_tree_hide');
  htmlTreeUi.showTitle = t(win, 'html_tree_show');
  htmlTreeUi.sectionHideTitle = t(win, 'html_tree_section_hide');
  htmlTreeUi.sectionShowTitle = t(win, 'html_tree_section_show');
  htmlTreeUi.moreTitle = t(win, 'html_tree_more');
  htmlTreeUi.duplicateTitle = t(win, 'html_tree_duplicate');
  htmlTreeUi.deleteTitle = t(win, 'html_tree_delete');
  htmlTreeUi.videoHoldTitle = t(win, 'html_tree_video_hold');
  htmlTreeUi.videoPlayTitle = t(win, 'html_tree_video_play');
  htmlTreeUi.alpineTitle = t(win, 'html_tree_alpine_state');
  htmlTreeUi.lockedTitle = t(win, 'html_tree_locked');
  htmlTreeUi.searchEmpty = t(win, 'html_tree_search_empty');
  htmlTreeUi.canEdit = !ask('dock:is-locked');
  htmlTreeUi.look = readHtmlTreeLook(win);
  htmlTreeUi.onQuery = () => renderHtmlTree(win);
  paintComponentExit(win);
  htmlTreeUi.inComponent = inComponent;
  // `at` is the row's element when the row itself was clicked — not Build's +
  // on it, which picks the row to add into.
  htmlTreeUi.onSelect = (id, at) => {
    // A field waiting for something to point at takes the row instead of
    // selecting it. The tree is the reliable half of that gesture: the preview
    // can only offer elements it has managed to line up with the open file.
    const row = rows.find((item) => item.id === id);

    if (row && componentBindPick(win, row.path)) {
      return;
    }

    // Refused by a field still waiting: the click was its, not a pick.
    if (at && !componentBindHandle()) {
      htmlTreeUi.rowClicks += 1;
    }

    // With help on, a loop or a condition opens its settings beside the tree.
    // Not on the release of a drag: that click is suppressed, nothing is picked.
    const opens = !!at && row?.kind === 'antlers' && !htmlTreeState.htmlTreeSuppressClick && helpOn(win);

    selectHtmlTreeRow(win, id, rows);

    // The row's own click (`at`), not a pick that came from the canvas — that
    // element is under the pointer already. The open section's root row is the
    // section: its top to the top; any other element only when off screen.
    if (at && row && !htmlTreeState.htmlTreeSuppressClick && !htmlTreeAheadOfDock()) {
      ask('build:reveal', { path: row.path, section: !!row.sectionRoot });
    }

    if (opens) {
      openLogicPopup(win, { path: row.path, at, beside: htmlTreePanel(win.document) });
    }
  };
  htmlTreeUi.onTwist = (id) => {
    const path = rows.find((item) => item.id === id)?.path;

    if (!path) {
      return;
    }

    if (htmlTreeFolds.has(path)) {
      htmlTreeFolds.delete(path);
    } else {
      htmlTreeFolds.add(path);
    }

    renderHtmlTree(win);
  };
  htmlTreeUi.onTagChange = (event, id) => {
    const row = htmlTreeUi.rows.find((item) => item.id === id);

    if (row && !htmlTreeAheadOfDock() && !refuseLocked(win, row)) {
      twOpenTagMenuAt(win, event.currentTarget, row);
    }
  };
  htmlTreeUi.onRename = (id) => beginHtmlTreeRename(win, id);
  htmlTreeUi.onRenameCommit = () => finishHtmlTreeRename(win, true);
  htmlTreeUi.onRenameCancel = () => finishHtmlTreeRename(win, false);
  htmlTreeUi.onHide = (id) => hideHtmlTreeRow(win, id);
  htmlTreeUi.onLock = (id) => toggleHtmlTreeLock(win, id);
  htmlTreeUi.onMore = (button, id) => openHtmlTreeRowMore(win, button, id);
  htmlTreeUi.canUnlock = mayUnlock(win);
  htmlTreeUi.lockTitle = t(win, 'html_tree_lock');
  htmlTreeUi.unlockTitle = t(win, 'html_tree_unlock');
  htmlTreeUi.lockedByTitle = t(win, 'html_tree_locked_by_developer');
  htmlTreeUi.onVideoHold = (id) => toggleVideoHold(win, id);
  htmlTreeUi.onAlpineState = (event, id) => openAlpineState(win, event, id);
  htmlTreeUi.onDuplicate = (id) => duplicateHtmlTreeRow(win, id);
  htmlTreeUi.onDelete = (id) => deleteHtmlTreeRow(win, id);
  htmlTreeUi.onPointerDown = (event, id) => beginHtmlTreePointer(win, event, id);
  htmlTreeUi.onSectionPointerDown = (event, uid) => beginSectionPointer(win, event, uid);
  // Resting on a section's row mounts its fields in the sidebar behind the
  // scenes — what resting on it in the preview already does — so the click
  // finds them there instead of waiting for them.
  htmlTreeUi.onSectionHover = (uid) => win.dispatchEvent(new win.CustomEvent('sve-lite-hover', { detail: { uid } }));
  htmlTreeUi.onContext = (event, id) => openHtmlTreeMenu(win, event, id);
  htmlTreeUi.onInspectCommit = (value) => commitHtmlTreeInspector(win, value);
  htmlTreeUi.onPropValue = (handle, value, bound) => commitComponentValue(win, handle, value, bound);
  // A page picked for a link field is a value, not a binding: what goes into
  // the call is the URL itself, which is what an href needs.
  htmlTreeUi.onPropPage = (anchor, handle) =>
    openPageMenu(win, anchor, (url) => commitComponentValue(win, handle, url, false));
  htmlTreeUi.onLoopKind = (kind) => setHtmlTreeLoopKind(win, kind);
  htmlTreeUi.onAddBranch = (kind) => addHtmlTreeBranch(win, kind);
  // The loop's controls write through loop-inspector.js, the module the dock's
  // help popup writes through too. The one thing held here is the sort
  // direction chosen before its field (htmlTreeSortDraft).
  htmlTreeUi.onLoopSortField = (value) => {
    const row = activeAntlersRow();

    if (!row) {
      return;
    }

    const draft = htmlTreeState.htmlTreeSortDraft?.id === row.id ? htmlTreeState.htmlTreeSortDraft.dir : '';

    htmlTreeState.htmlTreeSortDraft = null;
    applyAntlersEdit(win, loopSortFieldEdit(row, value, draft));
  };
  htmlTreeUi.onLoopSortDir = (value) => {
    const row = activeAntlersRow();

    if (!row) {
      return;
    }

    const next = loopSortDirEdit(row, value);

    // Nothing to write yet: hold the choice and show the field it needs.
    if (next.draft) {
      htmlTreeState.htmlTreeSortDraft = { id: row.id, dir: next.draft };
      paintHtmlTreeInspector(win, row);

      return;
    }

    htmlTreeState.htmlTreeSortDraft = null;
    applyAntlersEdit(win, next.edit);
  };
  htmlTreeUi.onLoopDepth = (value) => applyAntlersEdit(win, loopDepthEdit(value));
  htmlTreeUi.onLoopIncludeHome = (value) => applyAntlersEdit(win, loopIncludeHomeEdit(value));
  htmlTreeUi.onLoopLimit = (value) => applyAntlersEdit(win, loopLimitEdit(value));
  htmlTreeUi.onLoopOffset = (value) => applyAntlersEdit(win, loopOffsetEdit(value));
  // The publish form is the Control Panel's own components, so it gets an app
  // that can see them. The inspector says when its placeholder is there.
  htmlTreeUi.onPropHost = (el) => (el ? callValues.mount(el) : callValues.unmount());
  htmlTreeUi.onInspectData = (anchor, use) => {
    // The picker writes tags into the HTML pane; here the bare handle is what a
    // condition or a loop is made of, so the pick is taken over.
    //
    // From the row's own start, not from inside it: a loop's handle and a
    // condition's expression are written in the scope *around* them, so an
    // outer loop counts and the row itself does not.
    ask('dock:data-menu', {
      anchor,
      at: rows.find((item) => item.id === htmlTreeState.htmlTreeActiveId)?.from,
      onPick: (row) => use(String(row?.var || '').trim()),
    });
  };

  // The first tag stands for the whole file, so that is where the file's own
  // name goes. A class there says nothing you cannot read one row down, and the
  // bracketed name of a section root is usually `{{ _class }}` — nothing at all.
  // A file that opens with a component call: that call (firstTagNode).
  const rootId = rows.find(isRootNode)?.id;

  // Inside a component the root is drawn as the tag it is — a `div` with its
  // classes, like any row — not as the component. The component is the file
  // you are standing in (the box, the sidebar's name and Exit say so); its
  // first tag wearing the component's mark read as one more component to
  // open, and offered to be made a component again. Only the components it
  // calls wear the mark here.
  const rootName = inComponent ? '' : htmlTreeRootName(win, sections, openUid);

  // The section this file belongs to, so its root tag can wear the same name
  // and mark the shut row wears. One row, two states — not two rows. Not
  // inside a component: that file is not the section's, and its root must
  // not stand for the section — it used to, and the `<li>`'s bin would have
  // deleted the page section.
  const openSection = openUid && !inComponent ? sections.find((item) => item.uid === openUid) : null;

  /*
   * Build's panel names the picked element as its row is named here
   * (BuildPanel's head, port `treeName`): the section's name on its root, else
   * the row's own name or its first class — the two lines the rows below use,
   * for any element of this file, folded away or not. Asked with the file it
   * is about: another file, or this one changed since, answers ''.
   */
  htmlTreeUi.nameAt = (path, about) => {
    if (about !== html || !path) {
      return '';
    }

    const walk = (nodes) => {
      for (const item of nodes || []) {
        if (item.path === path) {
          return item;
        }

        const inner = path.startsWith(`${item.path}/`) ? walk(item.children) : null;

        if (inner) {
          return inner;
        }
      }

      return null;
    };
    // The row drawn: its name, which is what it shows (HtmlTreeRow).
    const drawn = htmlTreeUi.rows.find((row) => row.path === path && !row.kind);

    if (drawn) {
      return drawn.name;
    }

    const node = walk(roots);

    if (!node) {
      return '';
    }

    const isRoot = node.id === rootId;
    const base = isRoot && rootName ? rootName : node.klass;
    return isRoot && openSection ? base : htmlTreeDisplayName(base, node.path, aliases);
  };

  const held = heldVideos(win, String(ask('dock:current-type') || ''));
  let videoIndex = 0;
  // The preview counts a half's components inside the element carrying
  // data-sve-chrome (bridge/alpine-state.js); on the file that writes it, so
  // does the tree. A tag written beside it is drawn outside the half.
  const alpine = alpineComponents(chromeMarker ? [chromeMarker] : roots, html);
  const alpineSaved = alpineStates(win, String(type));
  // On the header's or footer's own file the root row IS that half's row in
  // the frame: named as the half, with no move, no copy, no bin — a header is
  // a header. On the layout it is the <main> row; the rest of that file
  // (html, head, the partial calls) is not this tree's business.
  const chromeKind = frameKind === 'header' || frameKind === 'footer' ? frameKind : '';
  const chromeRootId = chromeNode ? chromeNode.id : '';
  const mainRaw = mainNode ? rows.find((row) => row.id === mainNode.id) || null : null;
  // The row the frame stands on — <main> on the layout, the half's element on
  // its file — and where its subtree ends. Only that subtree is drawn.
  /*
   * On the layout the tree shows the whole body — header, main and footer as
   * the file actually writes them, with `{{ template_content }}` under main.
   *
   * It used to cut to `<main>` alone, which answered "what wraps the sections"
   * with the one part that does not wrap anything. The frame drawn around a
   * page said the same thing in synthetic rows; this says it in the file, so
   * clicking a part opens the thing that renders it. `mainRaw` still carries
   * the stamp and the landing seat — it is a row in here, not the root.
   *
   * Found from the parsed tree, not from <main>'s row: with the <body> folded
   * <main> is not drawn, and the cut has to hold without it.
   */
  const bodyRaw = bodyNode ? rows.find((row) => row.id === bodyNode.id) || null : null;
  const frameRaw = bodyRaw || mainRaw || (chromeRootId ? rows.find((row) => row.id === chromeRootId) || null : null);
  const frameEnd = frameRaw ? nextOutside(rows, frameRaw) : -1;

  if (
    frameRaw &&
    !rows.slice(rows.indexOf(frameRaw), frameEnd).some((row) => row.id === htmlTreeState.htmlTreeActiveId)
  ) {
    htmlTreeState.htmlTreeActiveId = frameRaw.id;
  }

  // An element the plus just wrote (HtmlTreePane): stand on it once it is
  // drawn. A few paints at most — the file may land a moment after the write.
  if (htmlTreeUi.selectFrom) {
    const made = rows.find((row) => row.from === htmlTreeUi.selectFrom.at && (!row.kind || row.kind === 'sections'));

    if (made) {
      htmlTreeState.htmlTreeActiveId = made.id;
      htmlTreeUi.selectFrom = null;
    } else if (--htmlTreeUi.selectFrom.left <= 0) {
      htmlTreeUi.selectFrom = null;
    }
  }

  // On the layout: which partial call draws the header and which the footer.
  const frameCalls = htmlTreeUi.layoutFile ? frameCallKinds(win) : null;

  htmlTreeUi.rows = rows.map((row) => {
    /*
     * On the layout, `{{ partial:site_head }}` and its footer twin are the
     * page's header and footer, not one more component: the chip says which,
     * the row wears that half's mark and family, and it is `fixed` (below).
     * Still a call — `kind` stays 'component', so the menu's Open and the
     * values work as on any other.
     */
    const frameCall = frameCalls && row.kind === 'component' ? frameCalls.get(row.src) || '' : '';
    // The document's <body>, in whatever file writes it: a document has one,
    // and everything on the page is inside it. It wears main's family — the
    // page itself, coloured where main is in the Live Preview settings.
    const body = row.tag === 'body' && !row.kind;
    const icon = frameCall ? { svg: HTML_ICONS[frameCall] } : htmlTreeIcon(row.tag, row.kind, row.antlers);
    // Which of the file's videos this row is, in document order — what the
    // preview is told to hold; -1 for anything that is not a <video>.
    const videoNth = row.tag === 'video' && !row.kind ? videoIndex++ : -1;
    // An Alpine component with booleans in its x-data: each with the file's
    // value and the one the preview shows — the file's, until the tree sets it.
    const xData = alpine.get(row.id);
    const setHere = xData ? alpineSaved[xData.nth] || {} : {};
    const alpineKeys = xData
      ? xData.booleans.map(({ key, value }) => ({ key, file: value, value: setHere[key] ?? value }))
      : [];
    // What the row is called before a rename. Renaming back to it drops the
    // alias again, so the default must be what the alias is measured against.
    const base = row.id === rootId && rootName ? rootName : row.klass;
    const isRoot = row.id === rootId;

    return {
      ...row,
      // The chip. A frame call shows the half, the way <main> shows `main`.
      tag: frameCall || row.tag,
      frameCall,
      /*
       * A row that stays: no eye, no copy, no bin (HtmlTreeRow), and the hide,
       * duplicate and delete handlers refuse it too. The layout's header and
       * footer calls — hidden or gone, that half is off every page — and the
       * <body>, which is the page itself. A second of any of them is not a
       * copy anyone means.
       */
      fixed: !!frameCall || body,
      base,
      // The open page section's root already carries the section's own name
      // (its label); the file's alias must not override it here.
      /*
       * A frame call is named for the half it draws, not for the file behind
       * it: the same `Header` the frame's own rows wear on a page. Meeting
       * `site_head` here and `Header` after stepping in read as two places.
       */
      name: frameCall
        ? t(win, `html_tree_frame_${frameCall}`)
        : chromeKind && row.id === chromeRootId
          ? t(win, `html_tree_frame_${chromeKind}`)
          : row === mainRaw
            ? t(win, 'html_tree_frame_main')
            : isRoot && openSection
              ? base
              : htmlTreeDisplayName(base, row.path, aliases),
      current: row.id === htmlTreeState.htmlTreeActiveId,
      letter: icon.letter || '',
      svg:
        chromeKind && row.id === chromeRootId
          ? HTML_ICONS[chromeKind]
          : row === mainRaw
            ? HTML_ICONS.main
            : isRoot && openSection
              ? openSection.svg
              : icon.svg || '',
      frame: chromeKind && row.id === chromeRootId ? chromeKind : row === mainRaw ? 'main' : '',
      // The frame's rows wear the frame's own families — header, main,
      // footer — each with its colour in the Live Preview settings. The
      // <body> wears main's.
      cat:
        chromeKind && row.id === chromeRootId
          ? chromeKind
          : row === mainRaw || body
            ? 'main'
            : frameCall || tagFamily(row.tag, row.kind, row.antlers),
      // The first tag of the open component's own file. It is the component,
      // so it is not offered to be made one (the menu).
      componentRoot: isRoot && inComponent,
      // The open section IS its first tag row. Carrying the uid here is what
      // lets delete tell "this section on this page" from "this tag in the
      // file" — they are the same row, and they are not the same thing.
      sectionRoot: isRoot && openSection ? openSection.uid : '',
      // The fields icon: on a section's root, where there is a fieldset to
      // open. A template's fields are its blueprint, opened from the top bar;
      // a static section has none — its menu offers to add them.
      // The section's own switch, on this page. `hidden` is the file's.
      sectionOff: !!(isRoot && openSection && !openSection.enabled),
      videoNth,
      videoHeld: videoNth >= 0 && held.has(videoNth),
      alpineNth: alpineKeys.length ? xData.nth : -1,
      alpineKeys,
      // Lit while the preview shows something the file does not.
      alpineSet: alpineKeys.some((item) => item.value !== item.file),
    };
  });

  syncStoredVideoHolds(win);
  syncStoredAlpineStates(win);

  // The families above each row, one per level, for the guides the tags look
  // draws: the guide under a loop is the loop's colour. Rows come in document
  // order, so a stack of what sits at each depth is the chain.
  const chain = [];

  for (const row of htmlTreeUi.rows) {
    chain.length = row.depth;
    row.guides = chain.slice();
    chain[row.depth] = row.cat;
  }

  if (frameRaw) {
    const start = rows.indexOf(frameRaw);
    const base = frameRaw.depth;

    htmlTreeUi.rows = htmlTreeUi.rows.slice(start, frameEnd).map((row) => ({
      ...row,
      depth: row.depth - base,
      guides: row.guides.slice(base),
    }));

    // Landing on the layout: stand on <main>, so the pane shows it.
    if (mainRaw && htmlTreeMainSeated !== fileKey) {
      htmlTreeMainSeated = fileKey;
      win.setTimeout(() => selectHtmlTreeRow(win, mainRaw.id, rows), 0);
    }
  }

  // An own page built from sections, its file open: the page's sections are
  // listed under the file's loop over them (the row "The page's sections"),
  // where they are drawn — a section dropped from Patterns shows there, and a
  // click opens it, as on any page. '' when the file has no such loop.
  const loopField = pageBuilder && !inComponent && dockKind === 'template' ? sectionField(win) || '' : '';
  const sectionsInLoop = loopField && missingSectionLoops(roots, [loopField]).length === 0 ? loopField : '';

  htmlTreeUi.sectionsInLoop = sectionsInLoop;

  // The page's sections: listed under main on a section's file, and — dimmed,
  // to click back out to — around the header's, the footer's or the layout's.
  // Not inside a component: there the tree is the component alone.
  htmlTreeUi.sections =
    pageBuilder && !inComponent && (inSections || frameKind || pageView || sectionsInLoop)
      ? sections.map((section) => {
          const current = !!openUid && section.uid === openUid;
          // Tags are drawn as soon as there are tags: from the cache the moment
          // it is clicked, and otherwise when the dock answers. Until then the
          // section is one row — lit and shut, about to unfold.
          const ready = current && (!pendingUid || !!htmlTreeState.htmlTreeAhead);

          return {
            ...section,
            current,
            ready,
            // Shut, a section is drawn by the same component as every other row,
            // from a row built here. Open, it IS the first row of its own file —
            // so the name and the mark computed here are stamped onto that row
            // below, and the two states cannot drift apart.
            row: {
              id: `sec:${section.uid}`,
              section: section.uid,
              tag: section.tag,
              name: section.label,
              kind: '',
              svg: section.svg,
              cat: section.cat,
              letter: '',
              depth: 0,
              hasChildren: true,
              shut: true,
              current,
              hidden: !section.enabled,
            },
          };
        })
      : [];
  htmlTreeUi.frame = frameAroundPage(win, sections, inSections, inComponent, frameKind, false, !!bodyRaw);
  htmlTreeUi.ownFile = ownFileRow(win, htmlTreeUi.sections.length > 0);

  // The page's file is open, its sections under the loop: no way back to show.
  if (sectionsInLoop) {
    htmlTreeUi.ownFile = null;
  }
  htmlTreeUi.frameEmptyText = t(win, 'html_tree_frame_no_sections');
  bindFrame(win, frameKind);

  // Not on the release of a drag: the click lands on the row the pointer
  // took hold of, and that section was moved, not asked for.
  htmlTreeUi.onSection = (uid) => {
    if (!htmlTreeState.htmlTreeSuppressClick) {
      // From inside the header or the footer, a section is the way back out
      // — the same way a click on it in the preview goes.
      leaveChrome(win);
      openHtmlTreeSection(win, doc, sections, uid, openUid);
    }
  };
  htmlTreeUi.onRefresh = () => renderHtmlTree(win);

  paintHtmlTreeInspector(
    win,
    htmlTreeUi.rows.find((item) => item.id === htmlTreeState.htmlTreeActiveId)
  );
  mountPane(list, HtmlTreeList);
  publishHtmlPick(win, roots);
}
