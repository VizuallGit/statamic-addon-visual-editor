/**
 * Live Preview's three modes: Content, Visual Build and HTML Build.
 *
 * Owner: Build mode. Called by the switch under the top bar
 * (cp-shell/build-switch.js), and set back to Content by lp-width.js as Live
 * Preview closes.
 * May import: cp/bus.js, cp/build-mode/store.js, cp/html-tree/store.js,
 *   lazy/build-mode.js, lib/style.js, lib/ids.js. Not cp-shell/, not the
 *   kernel, and nothing of Build itself — that is the lazy chunk.
 * Bus: asks `html-tree:from-preview` to pick a row by its path — the same door
 *   a pick in the preview goes through.
 *
 *   content  The editor exactly as it is.
 *   visual   Visual Build: the Build panel in the left column, the canvas
 *            over the preview, the HTML tree. The dock is open but not shown:
 *            Build writes the dock's file, and the tree is the tree of the
 *            file the dock holds.
 *   html     HTML Build: the form in the left column, the canvas, the dock
 *            and the tree. A click on the canvas picks in the tree; nothing
 *            is added or dragged there — that is Visual Build's.
 *
 * Visual Build lends the column to the Build panel the way the selection
 * panel holds it (selection-panel.js): lent, not taken. The column wears an
 * attribute of this module's own, and one rule steps everything in it but the
 * panel aside — never removed and never `display: none`, but out of the flow
 * at the column's width, invisible and untouchable — so Statamic's form stays
 * mounted with its publish context, its save and its dirty state, and
 * whatever Statamic adds to the column later steps aside by the same rule.
 * The selection panel and the component's values read `buildModeUi.on` and
 * give the column up while it is set: the selection panel unmounts its fields
 * and draws them again on the way back.
 *
 * The dock steps aside in Visual Build the same careful way, by a rule on the
 * mode the Control Panel's root wears (`MODE_ATTR`): invisible, untouchable,
 * no room kept for it under the preview — never closed, so its file, its
 * saves and the tree beside it go on as in HTML Build.
 *
 * The panel and the canvas are the lazy chunk (lazy/build-mode.js →
 * build-mode/boot.js), loaded the first time a Build is chosen. A switch away
 * before it has arrived voids the ticket, and nothing is mounted.
 */
import { watch } from 'vue';
import { ask } from './cp/bus.js';
import { buildModeUi } from './cp/build-mode/store.js';
import { htmlTreeUi } from './cp/html-tree/store.js';
import { enterBuild, enterBuildView, leaveBuild } from './lazy/build-mode.js';
import { injectStyle } from './lib/style.js';
import { CODE_DOCK_ID, HEADER_TOOLBAR_ID, HTML_TREE_PANEL_ID } from './lib/ids.js';
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';

export const EDITOR_MODES = ['content', 'visual', 'fields'];

const HOST_ID = '__sve-build-panel';
/** On the column while Build has it. Its own — never shared with the selection panel's or the component's. */
const AWAY_ATTR = 'data-sve-build-away';
/** On the Control Panel's root in either Build: the mode. Not there in Content. */
const MODE_ATTR = 'data-sve-editor-mode';
const DOCK_ATTR = 'data-sve-build-dock-shown';
const DOCK_KEY = 'sve-build-dock';
const STYLE_ID = '__sve-build-host-css';

let hooksFor = null;
let unwatch = null;
let queued = false;

export function editorMode() {
  return buildModeUi.mode;
}

/**
 * Go to `mode` (EDITOR_MODES; anything else is Content). `shell` is what only the
 * top bar can hand over: its device icons, and `openDock` — the dock and the
 * tree beside it.
 */
export function setEditorMode(win, mode, shell = {}) {
  const next = EDITOR_MODES.includes(mode) ? mode : 'content';
  const was = buildModeUi.mode;
  const doc = win.document;

  if (next === was) {
    return;
  }

  if (was === 'visual') {
    giveBack(win);
  } else if (was === 'fields') {
    leaveBuild();
  }

  // Before anything mounts: the canvas stands while this is not Content.
  buildModeUi.mode = next;

  if (next === 'content') {
    doc.documentElement.removeAttribute(MODE_ATTR);
    doc.documentElement.removeAttribute(DOCK_ATTR);

    return;
  }

  ensureStyles(doc);
  doc.documentElement.setAttribute(MODE_ATTR, next);
  doc.documentElement.toggleAttribute(DOCK_ATTR, buildDockShown(win));
  // The file both Builds work on is the dock's, and what they pick is the tree's.
  shell.openDock?.();
  hooksFor = editorHooks(win, shell);

  if (next === 'visual') {
    take(win);
  } else {
    void enterBuildView(win, hooksFor);
  }
}

/** Is the HTML dock on screen in Build? This user's own, kept between visits; off to begin with. */
export function buildDockShown(win) {
  return chromeGet(win, DOCK_KEY) === 'on';
}

/**
 * Show or hide the dock, and nothing else. It stays open underneath either way:
 * the file Build works on is the dock's, so hiding it never closes it, and the
 * tree is left where it stands.
 */
export function setBuildDockShown(win, shown) {
  if (shown) {
    chromeSet(win, DOCK_KEY, 'on');
  } else {
    chromeRemove(win, DOCK_KEY);
  }

  win.document.documentElement.toggleAttribute(DOCK_ATTR, shown);
  // The preview's room changed: the canvas follows it as it does a resized window.
  win.dispatchEvent(new win.Event('resize'));
}

function column(doc) {
  return doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');
}

function ensureStyles(doc) {
  // As the selection panel's (selection-panel.js `ensureStyle`): lifted out
  // at the column's width, never `display: none` — gone from layout, the
  // publish tabs measure zero, re-render, and the lite field with the page's
  // publish context unmounts. The page's own tab bar (Page Settings, SEO)
  // folds the same careful way. The dock's room under the preview is the
  // padding the dock writes on `.live-preview-contents` (dock/layout.js
  // `previewBottomPad`).
  injectStyle(
    doc,
    STYLE_ID,
    `[${AWAY_ATTR}]{position:relative}
[${AWAY_ATTR}] > :not(#${HOST_ID}){position:absolute!important;inset:0!important;overflow:hidden!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
#${HOST_ID}{display:flex;flex-direction:column;min-width:0;height:100%;flex:1 1 auto}
.live-preview-editor:has([${AWAY_ATTR}]) [role="tablist"]:not(#${HOST_ID} [role="tablist"]){height:0!important;min-height:0!important;overflow:hidden!important;visibility:hidden!important;margin:0!important;padding:0!important;border:0!important}
:root[${MODE_ATTR}]:not([${DOCK_ATTR}]) #${CODE_DOCK_ID}{visibility:hidden!important;pointer-events:none!important}
:root[${MODE_ATTR}]:not([${DOCK_ATTR}]) .live-preview-contents{padding-bottom:0!important}
:root[${MODE_ATTR}] #${HTML_TREE_PANEL_ID} [data-sve-close],
:root[${MODE_ATTR}] #${CODE_DOCK_ID} [data-sve-html-scope],
:root[${MODE_ATTR}] #${HEADER_TOOLBAR_ID} [data-tab="html_tree"]{display:none!important}`
  );
}

/** The HTML tree's picked row, from the tree's own store. */
function pickedRow() {
  return htmlTreeUi.rows.find((row) => row.current) || null;
}

function editorHooks(win, shell) {
  return {
    selectedPath: () => pickedRow()?.path || '',
    // `reveal: false` is a write keeping its pick: the row and the preview
    // follow, the dock's cursor does not move (a click reveals; a keystroke
    // in a box does not).
    select(path, { reveal = true } = {}) {
      if (path) {
        ask('html-tree:from-preview', { path, reveal });
      }
    },
    onSelect: (fn) => watch(() => pickedRow()?.path || '', () => fn()),
    treeClicks: () => htmlTreeUi.rowClicks,
    // The tree's own way to stand on an element a write just moved or renamed
    // (HtmlTreePane's plus does the same): by where it starts in the file.
    keepPickAt(at) {
      htmlTreeUi.selectFrom = { at, left: 4 };
    },
    plusPath: () => buildModeUi.plusPath,
    setPlus(path) {
      buildModeUi.plusPath = path || '';
    },
    deviceIcons: shell.deviceIcons || {},
  };
}

function take(win) {
  const col = column(win.document);

  if (!col) {
    return;
  }

  buildModeUi.on = true;
  mount(win, col);
  watchColumn(win);
}

function mount(win, col) {
  const doc = win.document;

  doc.getElementById(HOST_ID)?.remove();

  const host = doc.createElement('div');

  host.id = HOST_ID;
  col.appendChild(host);
  col.setAttribute(AWAY_ATTR, '');
  void enterBuild(win, host, hooksFor);
}

function giveBack(win) {
  const doc = win.document;

  buildModeUi.on = false;
  buildModeUi.plusPath = '';
  leaveBuild();
  stopWatching();
  doc.getElementById(HOST_ID)?.remove();
  doc.querySelectorAll(`[${AWAY_ATTR}]`).forEach((el) => el.removeAttribute(AWAY_ATTR));
  hooksFor = null;
}

/**
 * The column is Statamic's and re-renders on its own — a Live Preview replay
 * can replace it. A column rebuilt from scratch gets the panel and the mark
 * back. Coalesced to a frame, as component-props-host.js does: it fires on
 * every keystroke down there.
 */
function watchColumn(win) {
  if (unwatch) {
    return;
  }

  const observer = new win.MutationObserver(() => {
    if (queued) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;

      if (!buildModeUi.on) {
        return;
      }

      const col = column(win.document);
      const host = win.document.getElementById(HOST_ID);

      if (col && (!host || host.parentElement !== col || !col.hasAttribute(AWAY_ATTR))) {
        mount(win, col);
      }
    });
  });

  observer.observe(win.document.body, { childList: true, subtree: true });
  unwatch = () => observer.disconnect();
}

function stopWatching() {
  unwatch?.();
  unwatch = null;
  queued = false;
}
