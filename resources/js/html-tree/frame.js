/**
 * html-tree.js — the frame round the page (header, main, footer).
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { openGlobalFieldsOverlay } from '../section-fields.js';
import { chromeGlobalHandle } from '../globals-panel.js';
import { ask } from '../cp/bus.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { HTML_ICONS } from '../html-tree-icons.js';
import { previewDocument } from '../lib/preview-frame.js';
import { humanizeHandle } from '../lib/values.js';
import { ownPageType } from '../lib/own-page.js';
import { LAYOUT_TEMPLATE_TYPE } from '../lib/ids.js';
import { setMeta } from '../lib/row-meta.js';
import { leaveSelection } from '../selection-panel.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { componentSrcFromType } from '../component-signature.js';
import { scrollBehavior } from '../scroll-pref.js';
import { htmlTreeFolds, htmlTreeState } from './state.js';
import { closeHtmlTreeMenu } from './menus.js';
import { endHtmlTreeDrag } from './drag.js';
import { leaveChrome, openHtmlTreePanel } from '../html-tree.js';

/** The frame's titles and clicks, the same on a full page and an empty one. */
export function bindFrame(win, frameKind) {
  htmlTreeUi.frameOpenTitle = t(win, 'html_tree_frame_open');
  htmlTreeUi.frameMainTitle = t(win, 'html_tree_frame_main_open');
  htmlTreeUi.frameTemplateTitle = t(win, 'html_tree_frame_template_open');
  htmlTreeUi.frameFieldsTitle = t(win, 'html_tree_frame_fields');
  // A click steps in: main opens the layout's <main> in the dock; a half is
  // clicked the way it is clicked in the preview — the same question, the
  // same door. Already standing there, a click scrolls the preview to it.
  htmlTreeUi.onFrame = (kind) => {
    if (frameKind === kind) {
      scrollPreviewToFrame(win, kind);
    } else {
      enterFrame(win, kind);
    }
  };
  htmlTreeUi.onFrameEnter = (kind) => enterFrame(win, kind);
  // The half's fields are its global set's blueprint.
  htmlTreeUi.onFrameFields = (kind) =>
    openGlobalFieldsOverlay(win, chromeGlobalHandle(win, kind), t(win, `html_tree_frame_${kind}`));
  htmlTreeUi.onFrameTwist = () => {
    htmlTreeUi.mainShut = !htmlTreeUi.mainShut;
  };
}

/**
 * The page's frame: header, main and footer, drawn around the sections.
 *
 * The layout puts them around every page, so the tree shows them where they
 * are — the header first, the sections inside main, the footer last. They are
 * rows to look at and to go to, not rows to edit: none of them moves, copies,
 * renames or deletes, because a header is a header.
 *
 * On a section's file the three stand around the page's list. On the
 * header's, the footer's or the layout's own file that part's root row wears
 * the frame (stamped in the rows above). A half draws nothing else: the list
 * is that half alone (HtmlTreeList `halfOnly`) — the parts are still built
 * here, and the view decides which of them the reader is shown. Anywhere
 * else — a collection's template, a component — there is no frame, and the
 * list is what it was.
 */
export function frameAroundPage(win, sections, inSections, inComponent, kind, emptyPage = false, bodyShown = false) {
  /*
   * The frame is drawn when it is the subject, and when there is nothing else
   * to draw. Not around a page's sections.
   *
   * It used to stand around every page: header at the top, the sections in
   * main, footer at the bottom. Three rows of the layout, repeated on every
   * page, above the one list the page actually owns. The layout has its own
   * screen now — open it and the real `<body>` is there, header and footer as
   * the file writes them — so a page's tree is its sections and nothing else.
   *
   * An empty page keeps the frame: with no sections it is the only thing there
   * is to show, and the only way to go anywhere from there.
   */
  if (!kind && !emptyPage) {
    return null;
  }

  // On the layout itself the file already shows all three parts. Drawing the
  // synthetic ones around them would say everything twice.
  if (bodyShown) {
    return null;
  }

  const row = (part) => ({
    id: `frame:${part}`,
    frame: part,
    synthetic: true,
    tag: part,
    name: t(win, `html_tree_frame_${part}`),
    kind: '',
    svg: HTML_ICONS[part] || '',
    cat: part,
    letter: '',
    depth: 0,
    // Only main folds, and only when there is something in it to fold away.
    hasChildren: part === 'main' && (sections.length > 0 || kind === 'template'),
    shut: part !== 'main',
    current: false,
    hidden: false,
  });
  const frame = { kind, header: row('header'), main: row('main'), footer: row('footer'), template: null };

  // On a collection template's entry, standing in the header, the footer or
  // the layout: the template itself listed under main, the way back to it.
  const view = kind && kind !== 'template' ? String(ask('dock:collection-view') || '') : '';

  if (view) {
    frame.template = {
      id: 'frame:template',
      frame: 'template',
      synthetic: true,
      tag: 'section',
      name: setMeta(win, view)?.display || humanizeHandle(view.replace(/^view:/, '')),
      kind: '',
      svg: HTML_ICONS.section || '',
      cat: 'main',
      letter: '',
      depth: 0,
      hasChildren: false,
      shut: true,
      current: false,
      hidden: false,
    };
  }

  return frame;
}

/**
 * On an own page built from sections, standing in one of its sections: the
 * page's own file, the way back to it. Its loop draws the sections; it is
 * the file the dock holds when no section is chosen. Null anywhere else.
 */
export function ownFileRow(win, listingSections) {
  if (!listingSections || !ownPageType(win)) {
    return null;
  }

  return {
    id: 'frame:own',
    frame: 'template',
    synthetic: true,
    tag: 'template',
    name: t(win, 'html_tree_own_file'),
    kind: '',
    svg: HTML_ICONS.section || '',
    cat: 'main',
    letter: '',
    depth: 0,
    hasChildren: false,
    shut: true,
    current: false,
    hidden: false,
  };
}

/** The first node with this tag, wherever it sits in the tree. */
export function findNodeByTag(nodes, tag) {
  return findNodeWhere(nodes, (node) => node.tag === tag);
}

/** The first tag node the test accepts, wherever it sits in the tree. */
export function findNodeWhere(nodes, test) {
  for (const node of nodes || []) {
    if (!node.kind && test(node)) {
      return node;
    }

    const inner = findNodeWhere(node.children, test);

    if (inner) {
      return inner;
    }
  }

  return null;
}

/**
 * The partial calls that draw the header and the footer: `src` → 'header' |
 * 'footer'.
 *
 * The server names the file each half IS — the partial carrying
 * `data-sve-chrome` (`sveChromeTemplates`, the same answer the dock reads to
 * tell a header's file from a section's). A call opens `view:partials/{src}`
 * (openComponentRow), so the call whose file that is draws the half. A half
 * whose file is a styled `header/…` handle rather than a view names no call.
 */
export function frameCallKinds(win) {
  const templates = win.Statamic?.$config?.get?.('sveChromeTemplates') || {};
  const calls = new Map();

  for (const kind of ['header', 'footer']) {
    const src = componentSrcFromType(templates[kind]?.type);

    if (src) {
      calls.set(src, kind);
    }
  }

  return calls;
}

/** The index of the first row after `row` that is not inside it. */
export function nextOutside(rows, row) {
  let i = rows.indexOf(row) + 1;

  while (i < rows.length && rows[i].depth > row.depth) {
    i += 1;
  }

  return i;
}

/** Scroll the preview to the header, the footer, or the content between them. */
function scrollPreviewToFrame(win, kind) {
  const pdoc = previewDocument(win);
  const el =
    kind === 'main' || kind === 'template'
      ? pdoc?.querySelector('main')
      : pdoc?.querySelector(`[data-sve-chrome="${kind}"]`);

  el?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}

/**
 * Nothing of the file being left may be held: no section still on its way,
 * no markup drawn ahead of the dock, no folds, no picked row, no menu.
 */
function resetForFrame(win) {
  win.clearTimeout(htmlTreeState.htmlTreePendingTimer);
  htmlTreeState.htmlTreePendingUid = '';
  htmlTreeState.htmlTreeAhead = '';
  htmlTreeFolds.clear();
  htmlTreeState.htmlTreeActiveId = null;
  htmlTreeState.htmlTreeShutStart = false;
  closeHtmlTreeMenu();
  endHtmlTreeDrag();
}

/**
 * Step into a part of the frame.
 *
 * A half: clicked in the preview, exactly as the reader clicks it there —
 * the bridge asks its "this is global" question, and on yes steps in: focus,
 * the page faded around it, the form, the file. Only a preview without the
 * half (not rendered, not editable) is told directly.
 *
 * Main: the layout's file in the dock, and the tree stands on its <main>.
 *
 * The tree stays open through the door (chrome.js keeps it). For the case it
 * was not open, it is drawn once the dock holds the half's file — polled,
 * because the reader answers the question on their own time, and nothing
 * announces the answer to this module. Gives up quietly.
 */
export function enterFrame(win, kind) {
  if (String(ask('dock:chrome-kind') || '') === kind) {
    return;
  }

  resetForFrame(win);

  if (kind === 'main') {
    leaveChrome(win);
    ask('dock:open-file', LAYOUT_TEMPLATE_TYPE);

    return;
  }

  if (kind === 'template') {
    // A collection's template on its own entry, or the page's own file.
    const collectionView = String(ask('dock:collection-view') || '');
    const view = collectionView || ownPageType(win);

    if (view) {
      leaveChrome(win);
      ask('dock:open-file', view);

      // Out of the section, the way back to the page's file: the section is
      // no longer the selection either. Left selected, a click on the same
      // section — on the canvas, in the tree — selected nothing new, and the
      // dock stayed on the file.
      if (!collectionView) {
        leaveSelection(win, 'tree');
      }
    }

    return;
  }

  if (kind !== 'header' && kind !== 'footer') {
    return;
  }

  const el = previewDocument(win)?.querySelector(`[data-sve-chrome="${kind}"]`);

  if (el) {
    el.scrollIntoView({ block: 'nearest' });
    el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent('click', { bubbles: true, cancelable: true }));
  } else {
    win.postMessage({ source: SOURCE, type: MSG.OPEN_CHROME, kind }, win.location.origin);
  }

  const started = Date.now();
  const back = async () => {
    if (String(ask('dock:chrome-kind') || '') !== kind) {
      if (Date.now() - started < 30000) {
        win.setTimeout(back, 250);
      }

      return;
    }

    await (ask('dock:load-settled') || null);
    openHtmlTreePanel(win);
  };

  win.setTimeout(back, 250);
}
