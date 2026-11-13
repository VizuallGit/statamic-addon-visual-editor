/**
 * Settings toggle: `html_tree`
 * HTML tag tree in the right dock — opens with the template dock, not a top-bar icon.
 * Reads the template dock's HTML pane. Does not import overlay / preview / bridge.
 */
import { t } from './lib/i18n.js';
import { sveState } from './cp-state.js';
import { applyHeaderTab, sendToPreview, setHeaderTab, topLevelSectionIds } from './cp.js';
import { heldVideos, rememberVideoHolds } from './video-holds.js';
import { alpineStates, frameScope, rememberAlpineStates } from './alpine-states.js';
import { ask, on, register } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';
import HtmlTreePane from './cp/surfaces/HtmlTreePane.vue';
import { htmlTreeUi } from './cp/html-tree/store.js';
import { parseTemplateTree } from './html-tree-parse.js';
import { syncComponentPropsHost } from './component-props-host.js';
import { componentPropsUi } from './cp/component-props/store.js';
import { componentBindPick } from './component-bind.js';

import { closeTwMenu } from './tw-classes.js';
import { firstPickNode } from './html-pick-first.js';
import { serializePickTree } from './html-pick-align.js';
import { featureOn, sectionField } from './lib/config.js';
import { HTML_TREE_PANEL_ID } from './lib/ids.js';
import { bindTips } from './cp/tip.js';
import { persistDockedPanel } from './lp-panel.js';
import { selectRow } from './selection-panel.js';
import { closeRightPanels, dismissChromeForPageEdit, syncPreviewInset } from './section-library.js';
import { MSG, SOURCE } from './lib/protocol.js';
import {
  htmlTreeFetching,
  htmlTreeFolds,
  htmlTreeGuessedTags,
  htmlTreeRootTags,
  htmlTreeState,
  htmlTreeTemplates,
} from './html-tree/state.js';
import { closeHtmlTreeMenu } from './html-tree/menus.js';
import { endHtmlTreeDrag } from './html-tree/drag.js';
import { dockHtml, dockIsOpen, htmlTreePrefetch } from './html-tree/prefetch.js';
import { firstTagId, htmlTreeAheadOfDock, htmlTreeSections } from './html-tree/sections.js';
import { callValues, renderHtmlTree } from './html-tree/render.js';
import { afterHtmlTreeSectionRemoved } from './html-tree/row-actions.js';
import { paintHtmlTreeInspector } from './html-tree/inspector.js';
import { componentPathFor, insertPointFor, selectHtmlTreeByPath } from './html-tree/select.js';
import { treeOptions } from './html-tree/used-by.js';

export * from './html-tree/state.js';
export * from './html-tree/used-by.js';
export * from './html-tree/styles.js';
export * from './html-tree/prefetch.js';
export * from './html-tree/sections.js';
export * from './html-tree/render.js';
export * from './html-tree/frame.js';
export * from './html-tree/row-actions.js';
export * from './html-tree/menus.js';
export * from './html-tree/drag.js';
export * from './html-tree/inspector.js';
export * from './html-tree/select.js';
export let htmlTreeUnhook = null;
export let htmlTreeTimer = 0;
let htmlTreeStructureUnhook = null;
export function htmlTreePanel(doc) {
  return doc.getElementById(HTML_TREE_PANEL_ID);
}

/**
 * Which section the file in the dock belongs to.
 *
 * The uid the dock was opened with answers it when there is one. When there is
 * not — nothing clicked yet, or a preview that never drew — `pageSectionType`
 * answers with the first section that has a type, so the tree says the same
 * rather than marking nothing. An answer that disagrees with the file on screen
 * is no answer: only a type that matches, or a component opened from inside
 * that section, is allowed to claim it.
 */
export function currentSectionUid(win, doc, sections) {
  if (!sections.length) {
    return '';
  }

  const type = ask('dock:current-type') || '';
  const uid = ask('dock:current-uid');
  // Inside a component the dock holds a partial, whose path says nothing about
  // which section sent you there. The uid still does.
  const inComponent = !!ask('dock:component-exit-state')?.open;

  if (uid) {
    const ids = topLevelSectionIds(uid, doc);
    const owner = sections.find((section) => section.ids.some((id) => ids.includes(id)));

    if (owner && (inComponent || owner.type === type)) {
      return owner.uid;
    }
  }

  return sections.find((section) => section.type === type)?.uid || '';
}

/**
 * Step into another section: the same move a click on the page makes, without
 * the page. `focusFromPreview` loads the file from publish values before it
 * touches the sidebar, so this works with the preview showing an error.
 */
export function openHtmlTreeSection(win, doc, sections, uid, openUid) {
  const section = sections.find((item) => item.uid === uid);

  if (!section) {
    return;
  }

  // The open section draws no row of its own — its tags are the row — so there
  // is nothing here to click and nothing to fold.
  if (uid === openUid) {
    return;
  }

  // Folds belong to the file that is about to be replaced.
  htmlTreeFolds.clear();
  htmlTreeState.htmlTreeActiveId = null;
  // A click on a section is the answer to "which one", so the list stops
  // holding every section shut from here on.
  htmlTreeState.htmlTreeShutStart = false;
  closeHtmlTreeMenu();
  endHtmlTreeDrag();

  // In Build the page on screen is the canvas: the section's top goes to its
  // top in this frame, before the tree draws again — and it is this section,
  // not another of its kind. In Content there is no canvas (false) and the
  // real preview answers SVE_ACTIVATE below.
  ask('build:reveal', { ids: section.ids });

  // The click answers now, not when the file lands: the row that was clicked
  // takes the mark and the box this instant, and unfolds into its tags a moment
  // later. A click that shows nothing until a fetch returns is the jump.
  //
  // The timer is the way out of a load that never arrives — without it the
  // panel would sit lit on a section it never opened.
  htmlTreeState.htmlTreePendingUid = uid;
  htmlTreeState.htmlTreePendingHtml = dockHtml();
  // Held in hand already: draw this section's tags now and let the dock catch
  // up behind them. Nothing writes while it does — see `htmlTreeAheadOfDock`.
  htmlTreeState.htmlTreeAhead = htmlTreeTemplates.get(section.type) || '';

  if (htmlTreeState.htmlTreeAhead) {
    htmlTreeState.htmlTreeActiveId = firstTagId(parseTemplateTree(htmlTreeState.htmlTreeAhead)) || null;
  }
  // Two sections of the same kind share a template: the dock has nothing to
  // fetch, so the wait is over as soon as it answers rather than when markup
  // that is never coming arrives. Asked here, before the click moves anything:
  // the dock's type still names the file on screen.
  htmlTreeState.htmlTreePendingSame = (ask('dock:current-type') || '') === section.type;
  win.clearTimeout(htmlTreeState.htmlTreePendingTimer);
  htmlTreeState.htmlTreePendingTimer = win.setTimeout(() => {
    htmlTreeState.htmlTreePendingUid = '';
    htmlTreeState.htmlTreeReseat = false;
    renderHtmlTree(win);
  }, 4000);
  renderHtmlTree(win);

  // The panel draws the section from the form's values: nothing to mount,
  // nothing to wait for.
  selectRow(win, section.uid, 'tree');
  sendToPreview({ source: SOURCE, type: MSG.SVE_ACTIVATE, ids: section.ids }, win);

  // Two sections can share a template, and then the dock has nothing to reload
  // and nothing to announce — but the row that is open has still changed.
  win.setTimeout(() => renderHtmlTree(win), 0);
}

/**
 * Out of the header's or footer's form, when it is open: what a click on a
 * page section in the preview does. The form's edits stay stashed; the
 * preview is told to drop the half's focus.
 *
 * Done now, not by message: what follows opens another file, and the dock
 * resolves which file from whether the half's form is still there. Posted,
 * the leaving landed after the opening, and the dock fetched the half's
 * file for a click that asked for a section.
 */
export function leaveChrome(win) {
  const open = String(ask('dock:chrome-open', win.document) || '');

  if (open !== 'header' && open !== 'footer') {
    return false;
  }

  dismissChromeForPageEdit(win);
  sendToPreview({ source: SOURCE, type: MSG.SVE_FORCE_EXIT_CHROME }, win);

  return true;
}

/**
 * Turn the preview into something you can point at.
 *
 * Split out from `publishHtmlPick` because binding a field works whether or
 * not the tree panel is open — the panel is one reason to stamp the preview,
 * not the only one.
 */
export function sendPick(win, roots) {
  const first = firstPickNode(roots);

  // Inside a component the dock's uid still names the *section* it was opened
  // from, and lining the file up against that element cannot work: a component
  // is not the section, it is whatever the section called. With no uid the
  // preview falls back to the first element matching the file's own root tag
  // and class — one of the places the component renders, which is all that is
  // needed, because every one of them came from this one file.
  const component = !!ask('dock:component-src');
  const uid = component ? '' : ask('dock:current-uid') || '';

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_HTML_PICK,
      on: true,
      uid,
      // The dock names the row by `_visual_id`; the preview's `data-sid` is
      // the row's `id` first. Every identity goes along, so the section is
      // found whichever one its markup carries — a uid that matched nothing
      // left the previous file's stamps standing.
      uids: uid ? topLevelSectionIds(uid, win.document) : [],
      // Only a component renders in more than one place, and only there should
      // every match be stamped. A section that happens to arrive without a uid
      // must still line up with one element — matching on tag and class alone
      // would stamp every other section on the page with this one's paths.
      all: component,
      tag: first?.tag || '',
      klass: first?.klass || '',
      nodes: serializePickTree(roots),
    },
    win
  );
}

/**
 * The video icon on a <video> row: hold the video paused in the preview, or
 * let it play again. Nothing in the file changes — the site keeps its
 * autoplay; only the editor stops watching it.
 */
export function toggleVideoHold(win, id) {
  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!row || !(row.videoNth >= 0)) {
    return;
  }

  const type = String(ask('dock:current-type') || '');
  const held = heldVideos(win, type);
  const on = !held.has(row.videoNth);

  if (on) {
    held.add(row.videoNth);
  } else {
    held.delete(row.videoNth);
  }

  const uid = String(ask('dock:current-uid') || '');

  rememberVideoHolds(win, type, held);
  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_VIDEO_HOLD,
      uid,
      uids: uid ? topLevelSectionIds(uid, win.document) : [],
      nth: row.videoNth,
      on,
    },
    win
  );
  renderHtmlTree(win);
}

/**
 * Flip one boolean in the preview. Nothing in the file changes — the site
 * keeps its own default; only what the editor shows does. Set back to the
 * file's value, the remembered state goes and the preview is told to put the
 * file's value back.
 *
 * The header, the footer and the layout are no section and have no uid: the
 * preview is told which part of the frame the file draws (`chrome`) instead.
 */
export function flipAlpineState(win, row, item) {
  const type = String(ask('dock:current-type') || '');
  const states = alpineStates(win, type);
  const value = !item.value;
  const on = value !== item.file;
  const keys = { ...(states[row.alpineNth] || {}) };

  if (on) {
    keys[item.key] = value;
  } else {
    delete keys[item.key];
  }

  if (Object.keys(keys).length) {
    states[row.alpineNth] = keys;
  } else {
    delete states[row.alpineNth];
  }

  const chrome = frameScope(String(ask('dock:chrome-kind') || ''));
  const uid = chrome ? '' : String(ask('dock:current-uid') || '');

  rememberAlpineStates(win, type, states);
  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_ALPINE_STATE,
      uid,
      uids: uid ? topLevelSectionIds(uid, win.document) : [],
      chrome,
      nth: row.alpineNth,
      key: item.key,
      value,
      on,
    },
    win
  );
  renderHtmlTree(win);
}

// A page section removed anywhere — the tree's own delete, the preview's
// overlay, the block tree — leaves the tree the same way. Only while the panel
// is on screen: with it closed there is nothing to step into or clear.
on('row:removed', ({ uid, parentPath, doc, win }) => {
  if (parentPath !== sectionField(win) || !htmlTreePanel(win.document)) {
    return;
  }

  afterHtmlTreeSectionRemoved(win, doc, uid);
});

/**
 * The row is picked: marked in the tree, its inspector drawn, the preview
 * outlining it. A click also reveals it in the dock — the cursor goes to the
 * tag and the editor takes focus. `reveal: false` is a write keeping its pick
 * (Build's boxes write the file on every keystroke): the dock is not touched,
 * so nothing is laid out or focused for a cursor nobody moved.
 */
export function selectHtmlTreeRow(win, id, rows, { reveal = true } = {}) {
  if (htmlTreeState.htmlTreeSuppressClick) {
    return;
  }
  const row = (rows || htmlTreeUi.rows).find((item) => item.id === id);

  if (!row) {
    return;
  }

  htmlTreeState.htmlTreeActiveId = id;
  htmlTreeUi.rows.forEach((item) => {
    item.current = item.id === id;
  });

  paintHtmlTreeInspector(win, row);

  // Same reason as `writeDockHtml`: these are offsets, and the dock is a
  // moment behind. The row is still picked — only the jump to it waits.
  if (htmlTreeAheadOfDock()) {
    return;
  }

  if (reveal) {
    ask('dock:reveal-html', {
      from: row.from,
      to: row.to,
      caret: insertPointFor(dockHtml(), row),
    });

    // The reveal has just put the cursor on this tag. The Tailwind pane cannot
    // hear that for itself — the dock writes the pane with `applying` set, and
    // nothing that follows the editor may run during those — so it is told
    // here, once the reveal is done.
    ask('dock:tw-follow');
  }

  // A tag is outlined by its stamped path. A component call has no stamp — it
  // is whatever its file rendered — so its src goes along, and the preview
  // outlines what that file drew inside this section (bridge/outline-nav.js).
  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_HTML_PICK_FOCUS,
      path: row.path,
      src: row.kind === 'component' ? row.src || '' : '',
    },
    win
  );
}

export function watchHtmlTreeDock(win) {
  if (htmlTreeUnhook) {
    return;
  }

  const refresh = () => {
    if (htmlTreeUi.editingId || htmlTreeUi.dragging) {
      return;
    }

    win.clearTimeout(htmlTreeTimer);
    htmlTreeTimer = win.setTimeout(() => {
      if (htmlTreePanel(win.document)) {
        renderHtmlTree(win);
      }
    }, 80);
  };

  // Dock HTML and page_sections both own what this tree shows. A section
  // delete updates values (and fires sve-page-structure) without touching the
  // dock — listening only to the dock left the deleted section on screen.
  const onStructure = () => {
    refresh();

    // The dock holds no file only because nothing was chosen — on an empty
    // page, nothing could be. Now it has a section, and that one is what the
    // reader wants open.
    //
    // Only when it is the page's one section. "Nothing chosen" is also true on
    // a page full of sections nobody has clicked yet, and there a section
    // dropped from Patterns opened the FIRST section instead: the bridge
    // stepped into its text for editing, and the preview held the new
    // section back until that edit ended — seconds later, with a jump.
    if (ask('dock:on-empty-page') === true) {
      const sections = htmlTreeSections(win, win.document);

      if (sections.length === 1) {
        openHtmlTreeSection(win, win.document, sections, sections[0].uid, '');
      }
    }
  };

  htmlTreeUnhook = on('dock:html-changed', refresh);
  win.document.addEventListener('sve-page-structure', onStructure);
  htmlTreeStructureUnhook = () => {
    win.document.removeEventListener('sve-page-structure', onStructure);
  };
}

export function stopWatchHtmlTreeDock(win) {
  htmlTreeUnhook?.();
  htmlTreeUnhook = null;
  htmlTreeStructureUnhook?.();
  htmlTreeStructureUnhook = null;
  win?.clearTimeout?.(htmlTreeTimer);
  htmlTreeTimer = 0;
}

export function closeHtmlTreePanel(win) {
  const panel = htmlTreePanel(win.document);

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_HTML_PICK,
      on: false,
    },
    win
  );
  stopWatchHtmlTreeDock(win);
  callValues.forget();
  componentPropsUi.callOpen = false;
  componentPropsUi.callStore = null;
  syncComponentPropsHost(win);
  endHtmlTreeDrag();
  closeHtmlTreeMenu();
  closeTwMenu(win);
  htmlTreeState.htmlTreeActiveId = null;
  htmlTreeUi.inspect = null;
  htmlTreeUi.editingId = null;
  htmlTreeUi.draft = '';
  htmlTreeUi.sections = [];
  htmlTreeUi.pageBuilder = false;
  htmlTreeUi.layoutFile = false;
  htmlTreeState.htmlTreePendingUid = '';
  win?.clearTimeout?.(htmlTreeState.htmlTreePendingTimer);

  if (!panel) {
    syncPreviewInset(win);

    return;
  }

  panel.remove();

  if (sveState.headerTab === 'html_tree') {
    setHeaderTab(win, null);
  }

  releaseRightShellIfEmpty(win);
  persistDockedPanel(win);
  applyHeaderTab(win);
  syncPreviewInset(win);
}

/** The tree's icons show their names at once; its rows keep the browser's, or every pass over the list would flash one. */
const TREE_TIPS = 'button[title], button[data-tip], label[title]';

export function fillHtmlTreePane(win, pane) {
  if (pane.querySelector('[data-sve-html-tree-list]')) {
    return;
  }

  pane.id = HTML_TREE_PANEL_ID;
  bindTips(win, pane, { only: TREE_TIPS });
  mountPane(pane, HtmlTreePane, {
    title: t(win, 'html_tree'),
  });
  pane.querySelector('[data-sve-close]')?.addEventListener('click', () => closeHtmlTreePanel(win));
}

export function showHtmlTreePane(win) {
  watchHtmlTreeDock(win);
  renderHtmlTree(win);
}

export function openHtmlTreePanel(win) {
  const doc = win.document;

  if (!featureOn(win, 'html_tree')) {
    return;
  }

  if (htmlTreePanel(doc)) {
    watchHtmlTreeDock(win);
    renderHtmlTree(win);

    return;
  }

  if (!dockIsOpen(doc)) {
    return;
  }

  // A panel that opens with a section already unfolded answers a question
  // nobody asked, and buries the list of the others under it.
  htmlTreeState.htmlTreeShutStart = true;
  htmlTreeFolds.clear();
  closeRightPanels(win, [HTML_TREE_PANEL_ID]);

  const panel = doc.createElement('div');

  panel.id = HTML_TREE_PANEL_ID;
  bindTips(win, panel, { only: TREE_TIPS });
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, HtmlTreePane, {
    title: t(win, 'html_tree'),
  });

  panel.querySelector('[data-sve-close]')?.addEventListener('click', () => closeHtmlTreePanel(win));
  showInRightShell(win, panel);
  persistDockedPanel(win);
  applyHeaderTab(win);
  syncPreviewInset(win);
  watchHtmlTreeDock(win);
  renderHtmlTree(win);
}

export function toggleHtmlTreePanel(win) {
  if (htmlTreePanel(win.document)) {
    closeHtmlTreePanel(win);

    return;
  }

  openHtmlTreePanel(win);
}

/**
 * Opens a section by uid the way a click on its row does — without the row
 * having to be on screen first. The tree lists sections only while the dock
 * holds one of them, so a section just made on an empty page (or while the
 * dock held the header) had no row to click; the form has it all the same.
 * Answers with the ids the preview knows it by, or null when it is not on
 * the page.
 */
register('html-tree:open-section', (uid) => {
  const win = window;
  const doc = win.document;
  const sections = htmlTreeSections(win, doc);
  const section = sections.find((item) => item.uid === uid || item.ids.includes(uid));

  if (!section) {
    return null;
  }

  openHtmlTreeSection(win, doc, sections, section.uid, '');

  return { uid: section.uid, ids: section.ids };
});

// `reveal: false` is Build writing and keeping its pick (build-mode-host.js):
// the row and the preview follow, the dock's cursor stays where it is.
register('html-tree:from-preview', ({ path, src, uid, reveal = true } = {}) => {
  // A field waiting for something to point at gets the click first. Nothing is
  // armed the rest of the time, so the tree's own behaviour is untouched.
  if (componentBindPick(window, path)) {
    return;
  }

  if (!path) {
    pointHtmlTreeAtSection(window, uid);

    return;
  }

  selectHtmlTreeByPath(window, componentPathFor(path, src) || path, { reveal });
});

/**
 * A click on a section, before any tag of its file could be stamped.
 *
 * A click on the page is answered with a path once the dock holds the file
 * and its tags are aligned with what was clicked (`reportAwaitedPick`). A
 * section written as one component call has no tag to align: the answer
 * never comes, and the list went on holding every section shut — with the
 * dock already on the section's file. The click said which section all the
 * same. So the shell passes the uid on as the click lands; the list stops
 * holding the sections shut and paints the one the dock now holds. A file
 * with tags still gets its path a moment later and the row under the click
 * is marked, as before.
 */
function pointHtmlTreeAtSection(win, uid) {
  if (!uid || !htmlTreePanel(win.document)) {
    return;
  }

  const sections = htmlTreeSections(win, win.document);
  // The click may name a row inside the section — a link in its button group —
  // and the section is the one that holds it, as `currentSectionUid` reads it.
  const ids = topLevelSectionIds(uid, win.document);
  const section = sections.find((item) => item.ids.some((id) => ids.includes(id)));

  if (!section) {
    return;
  }

  // Folds and the marked row belong to the list that was shut.
  if (htmlTreeState.htmlTreeShutStart) {
    htmlTreeState.htmlTreeShutStart = false;
    htmlTreeFolds.clear();
    htmlTreeState.htmlTreeActiveId = null;
  }

  // A section clicked in the tree and not landed yet stands open on its
  // pending uid. The click on the page is the newer answer to "which one":
  // the tree stops waiting for the other, and draws what the dock holds.
  if (htmlTreeState.htmlTreePendingUid && htmlTreeState.htmlTreePendingUid !== section.uid) {
    win.clearTimeout(htmlTreeState.htmlTreePendingTimer);
    htmlTreeState.htmlTreePendingUid = '';
    htmlTreeState.htmlTreeAhead = '';
  }

  // The file is still on its way: its landing paints the tree
  // (watchHtmlTreeDock). A paint before that would publish the file being
  // left as this section's tags, and the preview would answer the click with
  // a path from the wrong file — the section's row marked, never the image
  // component that was clicked.
  if (ask('dock:load-settled')) {
    return;
  }

  // Painted here, not left to the dock's next paint. Two sections of one kind
  // share a file: the dock has nothing to load and nothing to announce, so no
  // paint followed the click — the list stayed open on the other section while
  // the dock and the panel had moved to this one. The shell syncs the dock
  // before it says the uid, so the paint reads the section from the dock.
  renderHtmlTree(win);
}

/**
 * Pick mode, asked for by something other than the tree.
 *
 * Turning it off is refused while the panel is open: the tree is then the one
 * that put it there, and taking it away would leave the panel unable to follow
 * a click in the preview.
 */
register('html-tree:arm-pick', (on) => {
  const win = window;

  if (on) {
    sendPick(win, parseTemplateTree(dockHtml(), treeOptions(win)));

    return true;
  }

  if (htmlTreePanel(win.document)) {
    return true;
  }

  sendToPreview({ source: SOURCE, type: MSG.SVE_HTML_PICK, on: false }, win);

  return true;
});

/**
 * A tile from Build's Add dragged over the tree (build-mode/canvas-ui.js).
 *
 * The tree only says what is under the pointer: the row of the file (its
 * `path` — the element's on the canvas too — where in its height the pointer
 * is, or its empty room) and the page's section around it. Build works out
 * where that lands with the canvas's own rules (drop.js `treeLanding`) and
 * writes it the canvas's way, so a drop here is the drop there. Null when the
 * pointer is not on the tree; nothing under it while the tree draws a file the
 * dock does not hold yet, or a row is being renamed — nothing writes then.
 * Read on each frame of the drag only: a lookup and two boxes, no render.
 */
register('html-tree:drop-hit', ({ x, y } = {}) => {
  const doc = window.document;
  const panel = htmlTreePanel(doc);
  const under = panel ? doc.elementFromPoint(x, y) : null;

  if (!under || !panel.contains(under)) {
    return null;
  }

  const hit = { row: null, section: null };

  if (htmlTreeAheadOfDock() || htmlTreeUi.editingId) {
    return hit;
  }

  const slot = under.closest('[data-sve-ht-slot]');
  const el = slot || under.closest('[data-sve-ht-row]');
  const id = el?.getAttribute('data-sve-ht-id');
  const row = id ? htmlTreeUi.rows.find((item) => item.id === id) : null;

  if (row?.path && !row.section) {
    const box = el.getBoundingClientRect();

    hit.row = { path: row.path, y: y - box.top, height: box.height, slot: !!slot, closed: row.kind === 'sections' };
  }

  // The section's box; under an own page's loop the sections are rows (`sec:<uid>`) with no box round them.
  const wrap = under.closest('[data-sve-ht-sec-uid]');
  const uid = wrap ? wrap.getAttribute('data-sve-ht-sec-uid') : id?.startsWith('sec:') ? id.slice(4) : '';

  if (uid) {
    const box = (wrap || el).getBoundingClientRect();

    hit.section = { uid, y: y - box.top, height: box.height };
  }

  return hit;
});

/**
 * Where Build's drag lands, marked in the tree: the same line or box a row
 * dragged in the tree wears — on the file's row at `path`, or beside the
 * page's section that answers to one of `ids`. `reveal`: the pointer is on
 * the canvas, so the row is scrolled into the tree's view. Null takes the
 * mark off. Build says it once per place, not once per frame.
 */
register('html-tree:drop-mark', (mark) => {
  const row = mark?.path ? htmlTreeUi.rows.find((item) => item.path === mark.path && !item.section) : null;
  const section = !row && mark?.ids ? htmlTreeUi.sections.find((item) => mark.ids.includes(item.uid)) : null;

  htmlTreeUi.dropId = row ? row.id : null;
  htmlTreeUi.dropPlace = row ? mark.where : null;
  htmlTreeUi.sectionDrop = section ? { uid: section.uid, place: mark.where } : null;

  if (mark?.reveal && (row || section)) {
    const panel = htmlTreePanel(window.document);
    const id = row ? row.id : `sec:${section.uid}`;
    const el =
      (section && panel?.querySelector(`[data-sve-ht-sec-uid="${CSS.escape(section.uid)}"]`)) ||
      panel?.querySelector(`[data-sve-ht-row][data-sve-ht-id="${CSS.escape(id)}"]`);

    el?.scrollIntoView({ block: 'nearest' });
  }

  return !!(row || section);
});

/**
 * Forget every section template held in memory.
 *
 * The cache is what lets a click on a section show its tags at once, and it is
 * never invalidated on its own — a template edited outside this window would go
 * unnoticed for as long as the editor stays open. The reload button is where
 * that is answered.
 */
export function clearHtmlTreeTemplates() {
  htmlTreeTemplates.clear();
  htmlTreeFetching.clear();
  htmlTreeRootTags.clear();
  htmlTreeGuessedTags.clear();
  htmlTreePrefetch.length = 0;
}
