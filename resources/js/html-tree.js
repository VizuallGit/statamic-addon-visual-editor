/**
 * Settings toggle: `html_tree`
 * HTML tag tree in the right dock — opens with the template dock, not a top-bar icon.
 * Reads the template dock's HTML pane. Does not import overlay / preview / bridge.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { applyHeaderTab, sendToPreview, setHeaderTab } from './cp.js';
import { ask, on, register } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';
import HtmlTreePane from './cp/surfaces/HtmlTreePane.vue';
import HtmlTreeList from './cp/surfaces/HtmlTreeList.vue';
import { htmlTreeUi } from './cp/html-tree/store.js';
import { flattenHtmlTree, isVoidTag, parseHtmlTree } from './html-tree-parse.js';
import { dropPlace, duplicateHtml, deleteHtml, moveHtml, toggleHiddenHtml } from './html-tree-edit.js';
import { htmlTreeDisplayName, readHtmlTreeLabels, writeHtmlTreeLabel } from './html-tree-labels.js';
import { htmlTreeIcon } from './html-tree-icons.js';
import { serializePickTree } from './html-pick-align.js';

export const HTML_TREE_PANEL_ID = '__sve-html-tree-panel';
export const HTML_TREE_STYLE_ID = '__sve-html-tree-style';

export const htmlTreeCollapsed = new Set();
export let htmlTreeActiveId = null;
export let htmlTreeUnhook = null;
export let htmlTreeTimer = 0;
let htmlTreeRoots = [];
let htmlTreeDragId = null;
let htmlTreeDragOrigin = null;
let htmlTreeDragEl = null;
let htmlTreePointerId = null;
let htmlTreeDragUnhook = null;
let htmlTreeSuppressClick = false;

export function htmlTreePanel(doc) {
  return doc.getElementById(HTML_TREE_PANEL_ID);
}

export function ensureHtmlTreeStyles(doc) {
  let style = doc.getElementById(HTML_TREE_STYLE_ID);

  if (!style) {
    style = doc.createElement('style');
    style.id = HTML_TREE_STYLE_ID;
    doc.head.appendChild(style);
  }

  style.textContent = `
    [data-sve-ht-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      min-height: 28px;
      margin-bottom: 3px;
      background: rgba(128,128,128,.16);
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.3;
      cursor: pointer;
      user-select: none;
      position: relative;
      touch-action: none;
    }
    [data-sve-ht-dragging],
    [data-sve-ht-dragging] * {
      cursor: grabbing !important;
    }
    [data-sve-ht-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-ht-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    [data-sve-ht-row][data-sve-ht-current] { background: #3858e9; color: #fff; }
    [data-sve-ht-row][data-sve-ht-current]:hover { background: #4a68ee; }
    [data-sve-ht-row][data-sve-ht-hidden] { opacity: .5; }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before,
    [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      content: '';
      position: absolute;
      left: 8px;
      right: 8px;
      height: 2px;
      background: #93c5fd;
      pointer-events: none;
    }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before { top: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="after"]::after { bottom: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="inside"] {
      outline: 2px solid #93c5fd;
      outline-offset: -2px;
    }
    [data-sve-ht-twist] {
      all: unset;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
    }
    [data-sve-ht-twist][data-sve-ht-shut] { transform: rotate(-90deg); }
    [data-sve-ht-actions] {
      margin-left: auto;
      flex: none;
      display: none;
      align-items: center;
      gap: 4px;
    }
    [data-sve-ht-row]:hover [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-actions] {
      display: inline-flex;
    }
    [data-sve-ht-eye],
    [data-sve-ht-dup],
    [data-sve-ht-del] {
      all: unset;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
      border-radius: 4px;
    }
    [data-sve-ht-eye]:hover,
    [data-sve-ht-dup]:hover,
    [data-sve-ht-del]:hover { opacity: 1; background: rgba(255,255,255,.12); }
    [data-sve-ht-icon] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    [data-sve-ht-icon] svg { display: block; }
    [data-sve-ht-letter] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
    }
    [data-sve-ht-text] {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
    [data-sve-ht-tag] {
      flex: none;
      opacity: .55;
    }
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag] { opacity: .72; }
    [data-sve-ht-name] {
      min-width: 2em;
      min-height: 1em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    [data-sve-ht-rename] {
      all: unset;
      box-sizing: border-box;
      min-width: 48px;
      max-width: 100%;
      padding: 0 4px;
      border-radius: 3px;
      background: rgba(0,0,0,.22);
      font: inherit;
      color: inherit;
    }
  `;
}

function dockHtml() {
  const html = ask('dock:html');

  return typeof html === 'string' ? html : '';
}

function dockIsOpen(doc) {
  return !!ask('dock:is-open', doc);
}

function writeDockHtml(html) {
  return ask('dock:set-html', html) === true;
}

export function renderHtmlTree(win) {
  const doc = win.document;
  const panel = htmlTreePanel(doc);
  const list = panel?.querySelector('[data-sve-html-tree-list]');

  if (!list) {
    return;
  }

  ensureHtmlTreeStyles(doc);

  const html = dockHtml();
  const roots = parseHtmlTree(html);
  htmlTreeRoots = roots;
  const rows = flattenHtmlTree(roots, htmlTreeCollapsed);
  const type = ask('dock:current-type') || '';
  const aliases = readHtmlTreeLabels(type);

  if (!html.trim() && !dockIsOpen(doc)) {
    htmlTreeUi.emptyText = t(win, 'html_tree_need_dock');
  } else {
    htmlTreeUi.emptyText = t(win, 'html_tree_empty');
  }

  htmlTreeUi.renameTitle = t(win, 'html_tree_rename');
  htmlTreeUi.hideTitle = t(win, 'html_tree_hide');
  htmlTreeUi.showTitle = t(win, 'html_tree_show');
  htmlTreeUi.duplicateTitle = t(win, 'html_tree_duplicate');
  htmlTreeUi.deleteTitle = t(win, 'html_tree_delete');
  htmlTreeUi.canEdit = !ask('dock:is-locked');
  htmlTreeUi.onSelect = (id) => selectHtmlTreeRow(win, id, rows);
  htmlTreeUi.onTwist = (id) => {
    if (htmlTreeCollapsed.has(id)) {
      htmlTreeCollapsed.delete(id);
    } else {
      htmlTreeCollapsed.add(id);
    }

    renderHtmlTree(win);
  };
  htmlTreeUi.onRename = (id) => beginHtmlTreeRename(win, id);
  htmlTreeUi.onRenameCommit = () => finishHtmlTreeRename(win, true);
  htmlTreeUi.onRenameCancel = () => finishHtmlTreeRename(win, false);
  htmlTreeUi.onHide = (id) => hideHtmlTreeRow(win, id);
  htmlTreeUi.onDuplicate = (id) => duplicateHtmlTreeRow(win, id);
  htmlTreeUi.onDelete = (id) => deleteHtmlTreeRow(win, id);
  htmlTreeUi.onPointerDown = (event, id) => beginHtmlTreePointer(win, event, id);

  htmlTreeUi.rows = rows.map((row) => {
    const icon = htmlTreeIcon(row.tag);

    return {
      ...row,
      name: htmlTreeDisplayName(row.klass, row.path, aliases),
      current: row.id === htmlTreeActiveId,
      letter: icon.letter || '',
      svg: icon.svg || '',
    };
  });

  mountPane(list, HtmlTreeList);
  publishHtmlPick(win, roots);
}

function publishHtmlPick(win, roots) {
  if (!htmlTreePanel(win.document)) {
    return;
  }

  const first = roots[0];

  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-html-pick',
      on: true,
      uid: ask('dock:current-uid') || '',
      tag: first?.tag || '',
      klass: first?.klass || '',
      nodes: serializePickTree(roots),
    },
    win
  );
}

function expandHtmlTreePath(path) {
  if (!path) {
    return;
  }

  const prefixes = [];
  const parts = String(path).split('/');

  for (let i = 0; i < parts.length; i += 1) {
    prefixes.push(parts.slice(0, i + 1).join('/'));
  }

  const walk = (nodes) => {
    for (const node of nodes || []) {
      if (prefixes.includes(node.path)) {
        htmlTreeCollapsed.delete(node.id);
      }

      walk(node.children);
    }
  };

  walk(htmlTreeRoots);
}

function beginHtmlTreeRename(win, id) {
  if (htmlTreeSuppressClick) {
    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!row) {
    return;
  }

  htmlTreeActiveId = id;
  htmlTreeUi.rows.forEach((item) => {
    item.current = item.id === id;
  });
  htmlTreeUi.editingId = id;
  htmlTreeUi.draft = row.name;

  win.setTimeout(() => {
    const input = htmlTreePanel(win.document)?.querySelector('[data-sve-ht-rename]');

    input?.focus();
    input?.select();
  }, 0);
}

function finishHtmlTreeRename(win, save) {
  const id = htmlTreeUi.editingId;

  if (!id) {
    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  htmlTreeUi.editingId = null;

  if (save && row) {
    writeHtmlTreeLabel(ask('dock:current-type') || '', row.path, htmlTreeUi.draft, row.klass);
  }

  htmlTreeUi.draft = '';
  renderHtmlTree(win);
}

function hideHtmlTreeRow(win, id) {
  applyHtmlEdit(win, id, toggleHiddenHtml);
}

function duplicateHtmlTreeRow(win, id) {
  applyHtmlEdit(win, id, duplicateHtml);
}

function deleteHtmlTreeRow(win, id) {
  applyHtmlEdit(win, id, deleteHtml);
}

function applyHtmlEdit(win, id, fn) {
  if (ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const node = htmlTreeUi.rows.find((item) => item.id === id);

  if (!node) {
    return;
  }

  const next = fn(html, node);

  if (next !== html) {
    writeDockHtml(next);
  }
}

function beginHtmlTreePointer(win, event, id) {
  if (event.button !== 0 || ask('dock:is-locked') || htmlTreeUi.editingId) {
    return;
  }

  if (event.target?.closest?.('button, input')) {
    return;
  }

  endHtmlTreeDrag();
  htmlTreeDragId = id;
  htmlTreeDragOrigin = { x: event.clientX, y: event.clientY };
  htmlTreeDragEl = event.currentTarget;
  htmlTreePointerId = event.pointerId;

  const onMove = (move) => trackHtmlTreePointer(win, move);
  const onUp = (up) => finishHtmlTreePointer(win, up);

  htmlTreeDragUnhook = () => {
    win.document.removeEventListener('pointermove', onMove, true);
    win.document.removeEventListener('pointerup', onUp, true);
    win.document.removeEventListener('pointercancel', onUp, true);
    htmlTreeDragUnhook = null;
  };

  win.document.addEventListener('pointermove', onMove, true);
  win.document.addEventListener('pointerup', onUp, true);
  win.document.addEventListener('pointercancel', onUp, true);
}

function trackHtmlTreePointer(win, event) {
  if (!htmlTreeDragId || !htmlTreeDragOrigin) {
    return;
  }

  const dx = event.clientX - htmlTreeDragOrigin.x;
  const dy = event.clientY - htmlTreeDragOrigin.y;

  if (!htmlTreeUi.dragging && dx * dx + dy * dy < 25) {
    return;
  }

  if (!htmlTreeUi.dragging) {
    htmlTreeUi.dragging = true;

    try {
      htmlTreeDragEl?.setPointerCapture?.(htmlTreePointerId);
    } catch {
      // Capture is optional — document listeners still track the move.
    }
  }

  event.preventDefault();

  const el = win.document.elementFromPoint(event.clientX, event.clientY)?.closest?.('[data-sve-ht-row]');
  const id = el?.getAttribute('data-sve-ht-id');

  if (!id || id === htmlTreeDragId) {
    htmlTreeUi.dropId = null;
    htmlTreeUi.dropPlace = null;

    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);
  const source = htmlTreeUi.rows.find((item) => item.id === htmlTreeDragId);

  if (!row || (source && row.path.startsWith(`${source.path}/`))) {
    htmlTreeUi.dropId = null;
    htmlTreeUi.dropPlace = null;

    return;
  }

  const rect = el.getBoundingClientRect();
  htmlTreeUi.dropId = id;
  htmlTreeUi.dropPlace = dropPlace(event.clientY - rect.top, rect.height, !isVoidTag(row.tag));
}

function finishHtmlTreePointer(win, event) {
  const sourceId = htmlTreeDragId;
  const targetId = htmlTreeUi.dropId;
  const place = htmlTreeUi.dropPlace || 'after';
  const dragged = htmlTreeUi.dragging;

  endHtmlTreeDrag();

  if (dragged) {
    htmlTreeSuppressClick = true;
    win.setTimeout(() => {
      htmlTreeSuppressClick = false;
    }, 0);
  }

  if (!dragged || ask('dock:is-locked') || !sourceId || !targetId || sourceId === targetId) {
    return;
  }

  event?.preventDefault?.();

  const html = dockHtml();
  const next = moveHtml(html, htmlTreeRoots, sourceId, targetId, place);

  if (next !== html) {
    writeDockHtml(next);
  }
}

function endHtmlTreeDrag() {
  try {
    htmlTreeDragEl?.releasePointerCapture?.(htmlTreePointerId);
  } catch {
    // Already released, or never captured.
  }

  htmlTreeDragUnhook?.();
  htmlTreeDragId = null;
  htmlTreeDragOrigin = null;
  htmlTreeDragEl = null;
  htmlTreePointerId = null;
  htmlTreeUi.dragging = false;
  htmlTreeUi.dropId = null;
  htmlTreeUi.dropPlace = null;
}

function selectHtmlTreeRow(win, id, rows) {
  if (htmlTreeSuppressClick) {
    return;
  }
  const row = (rows || htmlTreeUi.rows).find((item) => item.id === id);

  if (!row) {
    return;
  }

  htmlTreeActiveId = id;
  htmlTreeUi.rows.forEach((item) => {
    item.current = item.id === id;
  });

  ask('dock:reveal-html', { from: row.from, to: row.to });
  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-html-pick-focus',
      path: row.path,
    },
    win
  );
}

function selectHtmlTreeByPath(win, path) {
  if (!path || !htmlTreePanel(win.document)) {
    return;
  }

  expandHtmlTreePath(path);
  renderHtmlTree(win);

  const row = htmlTreeUi.rows.find((item) => item.path === path);

  if (row) {
    selectHtmlTreeRow(win, row.id, htmlTreeUi.rows);
  }
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

  htmlTreeUnhook = on('dock:html-changed', refresh);
}

export function stopWatchHtmlTreeDock(win) {
  htmlTreeUnhook?.();
  htmlTreeUnhook = null;
  win?.clearTimeout?.(htmlTreeTimer);
  htmlTreeTimer = 0;
}

export function closeHtmlTreePanel(win) {
  const panel = htmlTreePanel(win.document);

  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-html-pick',
      on: false,
    },
    win
  );
  stopWatchHtmlTreeDock(win);
  endHtmlTreeDrag();
  htmlTreeActiveId = null;
  htmlTreeUi.editingId = null;
  htmlTreeUi.draft = '';

  if (!panel) {
    sve.syncPreviewInset(win);

    return;
  }

  panel.remove();

  if (sveState.headerTab === 'html_tree') {
    setHeaderTab(win, null);
  }

  releaseRightShellIfEmpty(win);
  sve.persistDockedPanel(win);
  applyHeaderTab(win);
  sve.syncPreviewInset(win);
}

export function fillHtmlTreePane(win, pane) {
  if (pane.querySelector('[data-sve-html-tree-list]')) {
    return;
  }

  pane.id = HTML_TREE_PANEL_ID;
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

  if (!sve.featureOn(win, 'html_tree')) {
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

  sve.closeRightPanels(win, [HTML_TREE_PANEL_ID]);

  const panel = doc.createElement('div');

  panel.id = HTML_TREE_PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, HtmlTreePane, {
    title: t(win, 'html_tree'),
  });

  panel.querySelector('[data-sve-close]')?.addEventListener('click', () => closeHtmlTreePanel(win));
  showInRightShell(win, panel);
  sve.persistDockedPanel(win);
  applyHeaderTab(win);
  sve.syncPreviewInset(win);
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

register('html-tree:from-preview', ({ path } = {}) => {
  selectHtmlTreeByPath(window, path);
});

sve.HTML_TREE_PANEL_ID = HTML_TREE_PANEL_ID;
sve.htmlTreePanel = htmlTreePanel;
sve.closeHtmlTreePanel = closeHtmlTreePanel;
sve.fillHtmlTreePane = fillHtmlTreePane;
sve.showHtmlTreePane = showHtmlTreePane;
sve.openHtmlTreePanel = openHtmlTreePanel;
sve.toggleHtmlTreePanel = toggleHtmlTreePanel;
sve.renderHtmlTree = renderHtmlTree;
