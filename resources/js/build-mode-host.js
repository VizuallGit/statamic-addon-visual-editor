/**
 * Build mode in the left column.
 *
 * Owner: Build mode. Called by the top bar's switch (cp-shell/build-switch.js).
 * May import: cp/bus.js, cp/build-mode/store.js, cp/html-tree/store.js,
 *   lazy/build-mode.js, lib/style.js. Not cp-shell/, not the kernel, and
 *   nothing of Build itself — that is the lazy chunk.
 * Bus: asks `html-tree:from-preview` to pick a row by its path — the same door
 *   a pick in the preview goes through.
 *
 * Content is the editor exactly as it is. Build lends the column to the Build
 * panel the way the selection panel holds it (selection-panel.js): lent, not
 * taken. The column wears an attribute of this module's own, and one rule
 * steps everything in it but the panel aside — never removed and never
 * `display: none`, but out of the flow at the column's width, invisible and
 * untouchable — so Statamic's form stays mounted with its publish context,
 * its save and its dirty state, and whatever Statamic adds to the column
 * later steps aside by the same rule. The selection panel and the
 * component's values read `buildModeUi.on` and give the column up while it is
 * set: the selection panel unmounts its fields and draws them again on the
 * way back.
 *
 * The panel itself is the lazy chunk (lazy/build-mode.js → build-mode/boot.js),
 * loaded the first time Build is chosen. A switch back to Content before it
 * has arrived voids the ticket, and nothing is mounted.
 */
import { watch } from 'vue';
import { ask } from './cp/bus.js';
import { buildModeUi } from './cp/build-mode/store.js';
import { htmlTreeUi } from './cp/html-tree/store.js';
import { enterBuild, leaveBuild } from './lazy/build-mode.js';
import { injectStyle } from './lib/style.js';

const HOST_ID = '__sve-build-panel';
/** On the column while Build has it. Its own — never shared with the selection panel's or the component's. */
const AWAY_ATTR = 'data-sve-build-away';
const STYLE_ID = '__sve-build-host-css';

let hooksFor = null;
let unwatch = null;
let queued = false;

export function buildModeOn() {
  return buildModeUi.on;
}

/**
 * Content (false) or Build (true). `shell` is what only the top bar can hand
 * over: its device icons, and `openDock` — the dock and the tree beside it.
 */
export function setBuildMode(win, on, shell = {}) {
  if (!!on === buildModeUi.on) {
    return;
  }

  if (on) {
    take(win, shell);
  } else {
    giveBack(win);
  }
}

function column(doc) {
  return doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');
}

function ensureStyles(doc) {
  // As the selection panel's (selection-panel.js `ensureStyle`): lifted out
  // at the column's width, never `display: none` — gone from layout, the
  // publish tabs measure zero, re-render, and the lite field with the page's
  // publish context unmounts. The page's own tab bar (Page Settings, SEO)
  // folds the same careful way.
  injectStyle(
    doc,
    STYLE_ID,
    `[${AWAY_ATTR}]{position:relative}
[${AWAY_ATTR}] > :not(#${HOST_ID}){position:absolute!important;inset:0!important;overflow:hidden!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
#${HOST_ID}{display:flex;flex-direction:column;min-width:0;min-height:100%;flex:1 1 auto}
.live-preview-editor:has([${AWAY_ATTR}]) [role="tablist"]:not(#${HOST_ID} [role="tablist"]){height:0!important;min-height:0!important;overflow:hidden!important;visibility:hidden!important;margin:0!important;padding:0!important;border:0!important}`
  );
}

/** The HTML tree's picked row, from the tree's own store. */
function pickedRow() {
  return htmlTreeUi.rows.find((row) => row.current) || null;
}

function editorHooks(win, shell) {
  return {
    selectedPath: () => pickedRow()?.path || '',
    select(path) {
      if (path) {
        ask('html-tree:from-preview', { path });
      }
    },
    onSelect: (fn) => watch(() => pickedRow()?.path || '', () => fn()),
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

function take(win, shell) {
  const doc = win.document;
  const col = column(doc);

  if (!col) {
    return;
  }

  buildModeUi.on = true;
  // The file Build writes is the dock's, and what it picks is the tree's.
  shell.openDock?.();
  hooksFor = editorHooks(win, shell);
  ensureStyles(doc);
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
