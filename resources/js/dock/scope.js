/**
 * code-dock.js — region "scope", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';
import { ensurePanel } from '../lazy-panels.js';
import CodeDockAddClass from '../cp/surfaces/CodeDockAddClass.vue';
import { mountSurface } from '../cp/mount.js';
import { bracketClassTokens, buildScopedCss, cssClassSelectors, diffBracketNames, findClassRule, firstClassName, mergeScopedCss, pruneBracketCss, rewriteBracketClassTokens, sanitizeCssClassName, syncCssWithBrackets, tokenTreeFromHtml } from '../css-scope.js';
import { closePartialMenu } from '../dock-partials.js';
import { closeClassTokenUi } from '../dock-class-tokens.js';
import { t } from '../lib/i18n.js';
import { HTML_TREE_PANEL_ID } from '../lib/ids.js';
import { dataGet, findPathByUid, unwrapRef } from '../lib/values.js';
import { featureOn } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { closeHtmlTreePanel, toggleHtmlTreePanel } from '../lazy/html-tree.js';
import { dockState } from '../dock/state.js';
import { flushSave, onEditorInput } from './save.js';
import { loadTemplate } from './dock-api.js';
import { paintBack } from './layout.js';
import { CSS_MENU_ID, DOCK_ID, LOCK_CLOSED_ICON, LOCK_OPEN_ICON, SCOPE_ICON, SCOPE_KEY, css, editors, html } from '../code-dock.js';
import { closeCssMenu, paintCssToolState, placeCssMenu } from './css-tools.js';
import { applyCssFolds } from './css-sizes.js';
import { minimalChange } from '../lib/minimal-change.js';

// ===== scope =====
export function currentSectionValues(win) {
  const uid = dockState.lastUid;
  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;

    if (!values || typeof values !== 'object') {
      continue;
    }

    if (uid && typeof findPathByUid === 'function') {
      const path = findPathByUid(values, uid);

      if (path) {
        const parts = path.split('.');
        const section = dataGet(values, parts.slice(0, 2).join('.'));

        if (section && typeof section === 'object') {
          return section;
        }
      }
    }
  }

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;

    if (values && typeof values === 'object') {
      return values;
    }
  }

  return null;
}

export function openNestedTemplate(win, type) {
  if (!type || type === dockState.lastType) {
    return;
  }

  flushSave(win.document);
  loadTemplate(win, type, 'push');
}

export function goBackTemplate(win) {
  const prev = dockState.typeStack.pop();

  if (!prev) {
    paintBack(win);

    return;
  }

  flushSave(win.document);
  loadTemplate(win, prev, 'keep');
}

export function paintLock(win) {
  const dock = win.document.getElementById(DOCK_ID);
  const btn = dock?.querySelector('[data-sve-code-lock]');
  const banner = dock?.querySelector('[data-sve-code-lock-banner]');

  if (!dock || !btn) {
    return;
  }

  // lockReady only gates the toggle: you cannot lock/unlock until the file
  // has answered. Visual lock follows lastLocked so a locked file never
  // paints unlocked for a frame while that answer is in flight.
  const locked = dockState.lastLocked;

  dock.toggleAttribute('data-sve-code-locked', locked);
  if (locked) {
    closePartialMenu(win.document);
    closeClassTokenUi(win.document);
    if (dockState.htmlPartialUi) {
      dockState.htmlPartialUi.setHover(editors.html, null);
      dockState.htmlPartialUi.setHover(editors.css, null);
    }
    dockState.htmlClassTokenUi?.setHover(editors.html, null);
  }
  btn.hidden = !dockState.lockReady;
  btn.setAttribute('aria-pressed', dockState.lastLocked ? 'true' : 'false');
  btn.title = t(win, dockState.lastLocked ? 'code_dock_unlock' : 'code_dock_lock');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = dockState.lastLocked ? LOCK_CLOSED_ICON : LOCK_OPEN_ICON;

  if (banner) {
    banner.textContent = t(win, 'code_dock_locked_banner');
  }
}

export function htmlScopeEnabled(win) {
  if (!win) {
    return dockState.htmlScopePref;
  }

  return chromeGet(win, SCOPE_KEY) !== '0';
}

export function htmlFocusOk(from, to, length) {
  return from != null && to != null && from >= 0 && to > from && to <= length;
}

/**
 * What the Instant paint script needs while the pane shows a slice of the
 * file: the file as of the last sync and the slice's range in it. The script
 * splices the pane's current text into that range, so a keystroke the dock has
 * not synced yet is still painted against the whole file — and a `<p>` typed
 * next to the scoped one lands in the section, not outside the snippet.
 */
function exposeHtmlScope() {
  const dock = globalThis.document?.getElementById(DOCK_ID);

  if (!dock) {
    return;
  }

  // `css` is the whole sheet as of now: the CSS pane shows a slice while the
  // HTML pane is scoped, and the paint holds the sheet plus the slice.
  dock.__sveHtmlScope = dockState.htmlScopeActive && dockState.htmlFocus
    ? { full: dockState.htmlFull, from: dockState.htmlFocus.from, to: dockState.htmlFocus.to, css: dockState.cssFull }
    : null;
}

export function syncScopedHtml() {
  const text = editors.html?.state.doc.toString() ?? '';

  if (!dockState.htmlScopeActive || !dockState.htmlFocus) {
    dockState.htmlFull = text;
    exposeHtmlScope();

    return;
  }

  if (dockState.htmlFocus.from < 0 || dockState.htmlFocus.from > dockState.htmlFull.length || dockState.htmlFocus.to < dockState.htmlFocus.from) {
    dockState.htmlScopeActive = false;
    dockState.htmlFull = text;
    dockState.htmlFocus = null;
    exposeHtmlScope();

    return;
  }

  dockState.htmlFull = dockState.htmlFull.slice(0, dockState.htmlFocus.from) + text + dockState.htmlFull.slice(dockState.htmlFocus.to);
  dockState.htmlFocus = { from: dockState.htmlFocus.from, to: dockState.htmlFocus.from + text.length };
  exposeHtmlScope();
}

export function currentFullHtml() {
  syncScopedHtml();

  if (dockState.htmlScopeActive) {
    return dockState.htmlFull;
  }

  return editors.html?.state.doc.toString() ?? dockState.lastParts.html ?? '';
}

export function rememberBracketNames() {
  dockState.lastBracketNames = bracketClassTokens(currentFullHtml()).map((token) => token.name);
}

export function rememberCssSelectors() {
  dockState.lastCssSelectorNames = cssClassSelectors(editors.css?.state.doc.toString() ?? dockState.cssFull);
}

function namesEqual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((name, i) => name === b[i]);
}

function harvestHtmlTreeCss() {
  const html = dockState.htmlScopeActive ? htmlSnippet() : currentFullHtml();
  const tree = tokenTreeFromHtml(html);

  if (!tree.length) {
    return;
  }

  dockState.cssFull = mergeScopedCss(dockState.cssFull, buildScopedCss(dockState.cssFull, tree), tree[0].className);
}

function applyBracketCssSync(prevNames, nextNames) {
  dockState.cssFull = syncCssWithBrackets(dockState.cssFull, prevNames, nextNames);
  harvestHtmlTreeCss();
  dockState.cssFull = pruneBracketCss(dockState.cssFull, nextNames, prevNames);
}

export function flushBracketSync(win) {
  if (dockState.applying || dockState.lastLocked || dockState.lastBracketNames == null) {
    return;
  }

  const nextNames = bracketClassTokens(currentFullHtml()).map((token) => token.name);

  if (namesEqual(dockState.lastBracketNames, nextNames)) {
    return;
  }

  applyBracketCssSync(dockState.lastBracketNames, nextNames);
  dockState.lastBracketNames = nextNames;
  applyCssScope();
  rememberCssSelectors();
}

export function flushCssToHtml() {
  if (dockState.applying || dockState.lastLocked || dockState.lastCssSelectorNames == null || dockState.lastBracketNames == null || dockState.cssPane === 'empty') {
    return;
  }

  const view = editors.html;
  const nextSelectors = cssClassSelectors(editors.css?.state.doc.toString() ?? '');

  if (!view || namesEqual(dockState.lastCssSelectorNames, nextSelectors)) {
    return;
  }

  const owned = new Set(dockState.lastBracketNames);
  const { renamed, removed } = diffBracketNames(dockState.lastCssSelectorNames, nextSelectors);
  let html = view.state.doc.toString();
  const prevHtml = html;

  for (const pair of renamed) {
    const name = sanitizeCssClassName(pair.to);

    if (!owned.has(pair.from) || !name) {
      continue;
    }

    html = rewriteBracketClassTokens(html, (token) => (token === pair.from ? name : token));
  }

  for (const name of removed) {
    if (!owned.has(name) || nextSelectors.includes(name)) {
      continue;
    }

    html = rewriteBracketClassTokens(html, (token) => (token === name ? '' : token));
  }

  if (html !== prevHtml) {
    dockState.applying = true;

    try {
      writeHtmlEditor(html);
    } finally {
      dockState.applying = false;
    }
  }

  rememberBracketNames();
  dockState.lastCssSelectorNames = nextSelectors;
}

function renameBracketClassAt(token, raw) {
  const name = sanitizeCssClassName(raw);
  const view = editors.html;

  if (!name || !view || view.state.readOnly || name === token.name) {
    return;
  }

  dockState.applying = true;

  try {
    view.dispatch({
      changes: { from: token.from, to: token.to, insert: name },
    });
  } finally {
    dockState.applying = false;
  }

  const prev = dockState.lastBracketNames == null ? [] : dockState.lastBracketNames.slice();

  rememberBracketNames();
  applyBracketCssSync(prev, dockState.lastBracketNames);
  applyCssScope();
  rememberCssSelectors();

  if (dockState.lastWin) {
    onEditorInput(dockState.lastWin);
    paintCssToolState(dockState.lastWin);
  }
}

export function openRenameClassMenu(win, token) {
  const doc = win.document;
  const view = editors.html;
  const coords = view?.coordsAtPos(token.from);

  closeCssMenu(doc);
  closeClassTokenUi(doc);

  const menu = doc.createElement('div');
  const anchor = {
    getBoundingClientRect: () => ({
      left: coords?.left ?? 12,
      right: coords?.right ?? 12,
      top: coords?.top ?? 12,
      bottom: coords?.bottom ?? 12,
      width: 0,
      height: 0,
    }),
  };

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockAddClass, menu, {
    label: t(win, 'code_dock_css_rename_class'),
    placeholder: t(win, 'code_dock_css_class_placeholder'),
    initial: token.name,
    onAdd: (value) => {
      renameBracketClassAt(token, value);
      closeCssMenu(doc);
    },
  });
}

export function htmlEditorText() {
  if (dockState.htmlScopePref && htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, dockState.htmlFull.length)) {
    dockState.htmlScopeActive = true;
    exposeHtmlScope();

    return dockState.htmlFull.slice(dockState.htmlFocus.from, dockState.htmlFocus.to);
  }

  dockState.htmlScopeActive = false;
  exposeHtmlScope();

  return dockState.htmlFull;
}

export function writeHandleEditor(handle, text, selection) {
  const view = editors[handle];

  if (!view) {
    return;
  }

  const current = view.state.doc.toString();

  dockState.applying = true;

  try {
    if (current !== text) {
      // Only what differs — a whole-document change would map a caret that
      // sits outside the edit to the end of the file (see lib/minimal-change).
      const [from, to, insert] = minimalChange(current, text);

      view.dispatch({
        changes: { from, to, insert },
        ...(selection ? { selection, scrollIntoView: true } : {}),
      });
    } else if (selection) {
      view.dispatch({
        selection,
        scrollIntoView: true,
      });
    }
  } finally {
    dockState.applying = false;
  }
}

export function writeHtmlEditor(text, selection) {
  writeHandleEditor('html', text, selection);
}

function htmlSnippet() {
  if (dockState.htmlScopeActive) {
    return editors.html?.state.doc.toString() ?? '';
  }

  if (htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, dockState.htmlFull.length)) {
    return dockState.htmlFull.slice(dockState.htmlFocus.from, dockState.htmlFocus.to);
  }

  return '';
}

export function flushCssScope() {
  const current = editors.css?.state.doc.toString() ?? '';

  if (dockState.cssPane === 'tree') {
    if (current === dockState.cssScopeSnapshot) {
      return;
    }

    const root =
      tokenTreeFromHtml(htmlSnippet())[0]?.className || firstClassName(current);

    dockState.cssFull = mergeScopedCss(dockState.cssFull, current, root);
    dockState.cssScopeSnapshot = current;
  } else if (dockState.cssPane === 'full') {
    dockState.cssFull = current;
  }
}

function tokenTreeNeedsCss(css, nodes) {
  for (const node of nodes || []) {
    if (!findClassRule(css, node.className) || tokenTreeNeedsCss(css, node.children)) {
      return true;
    }
  }

  return false;
}

export function applyCssScope() {
  let text = dockState.cssFull;
  let tree = [];
  let created = false;

  // The ID is the file's own instance layer, not the tag you have picked, and
  // the tree scope rebuilds the pane from the picked tag's classes — a view
  // the `#id-` rule is not in. So showing the ID shows the file.
  if (dockState.cssValues || !dockState.htmlScopePref || !dockState.htmlScopeActive) {
    dockState.cssPane = 'full';
    text = dockState.cssFull;
  } else {
    tree = tokenTreeFromHtml(htmlSnippet());

    if (!tree.length) {
      dockState.cssPane = 'empty';
      text = '';
    } else {
      dockState.cssPane = 'tree';
      text = buildScopedCss(dockState.cssFull, tree);

      if (tokenTreeNeedsCss(dockState.cssFull, tree)) {
        dockState.cssFull = mergeScopedCss(dockState.cssFull, text, tree[0].className);
        created = true;
      }
    }
  }

  dockState.cssScopeSnapshot = text;
  writeHandleEditor('css', text);
  rememberCssSelectors();

  if (dockState.lastWin) {
    applyCssFolds(dockState.lastWin, true);
    paintCssToolState(dockState.lastWin);

    if (created) {
      onEditorInput(dockState.lastWin);
    }
  }
}

/**
 * Show only the focused range in the HTML pane.
 *
 * `caret` is a position in the whole file — the point the tree asked to be put
 * inside — and is translated into this slice. Without one the caret sits at the
 * start of the slice, which is in front of the opening tag: everything written
 * next then lands outside the very row that was picked.
 */
export function showHtmlScope(caret) {
  const view = editors.html;

  if (!view || !dockState.htmlFocus) {
    return;
  }

  if (!dockState.htmlScopeActive) {
    dockState.htmlFull = view.state.doc.toString();
  }

  const length = dockState.htmlFull.length;
  const from = Math.max(0, Math.min(dockState.htmlFocus.from, length));
  const to = Math.max(from, Math.min(dockState.htmlFocus.to, length));

  if (to <= from) {
    return;
  }

  dockState.htmlFocus = { from, to };
  dockState.htmlScopeActive = true;
  exposeHtmlScope();

  const at = caret == null ? 0 : Math.max(0, Math.min(caret - from, to - from));

  writeHtmlEditor(dockState.htmlFull.slice(from, to), { anchor: at, head: at });
  applyCssScope();
  view.focus();
}

export function showHtmlFull(selectFocus = true, caret = null) {
  const view = editors.html;

  if (!view) {
    return;
  }

  flushCssScope();
  syncScopedHtml();
  dockState.htmlScopeActive = false;
  exposeHtmlScope();

  const full = dockState.htmlFull || view.state.doc.toString();
  // A caret beats the range: the tree asked to be put inside the row, not to
  // have it selected.
  const selection =
    caret != null
      ? { anchor: Math.max(0, Math.min(caret, full.length)) }
      : selectFocus && htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, full.length)
        ? { anchor: dockState.htmlFocus.from, head: dockState.htmlFocus.to }
        : null;

  dockState.htmlFull = full;
  writeHtmlEditor(full, selection);
  dockState.cssPane = 'full';
  dockState.cssScopeSnapshot = dockState.cssFull;
  writeHandleEditor('css', dockState.cssFull);
  rememberCssSelectors();
}

export function clearHtmlScopeRange() {
  dockState.htmlFocus = null;
  dockState.htmlScopeActive = false;
  dockState.htmlFull = '';
  dockState.cssFull = '';
  dockState.cssPane = 'full';
  dockState.cssScopeSnapshot = '';
  dockState.lastBracketNames = null;
  dockState.lastCssSelectorNames = null;
  exposeHtmlScope();
}

/**
 * The button stands for the HTML tree as well as the scoping it drives.
 *
 * The two belong together: scoping the panes to one element, with no tree to
 * pick that element in, is a setting pointing at nothing. So pressing it opens
 * the tree and unpressing it puts the tree away.
 *
 * Only ever asked when the site has the tree switched on at all.
 */
let treeOpening = false;

function htmlTreeOpen(win) {
  return !!win?.document.getElementById(HTML_TREE_PANEL_ID);
}

export function syncHtmlTree(win, open) {
  if (!win || featureOn(win, 'html_tree') === false) {
    return;
  }

  if (!open) {
    if (htmlTreeOpen(win)) {
      closeHtmlTreePanel(win);
    }

    return;
  }

  if (htmlTreeOpen(win)) {
    return;
  }

  // The tree is one of the lazily loaded panels, so it may not be here yet.
  // While that is in flight the panel is legitimately absent, and the watcher
  // below must not read that as the reader having closed it.
  treeOpening = true;

  void ensurePanel('html_tree')
    .then(() => {
      if (!htmlTreeOpen(win)) {
        toggleHtmlTreePanel(win);
      }
    })
    .catch(() => {
      /* the tree is not available on this site */
    })
    .finally(() => {
      treeOpening = false;
      paintHtmlScope(win);
    });
}

export function paintHtmlScope(win) {
  const btn = win?.document.getElementById(DOCK_ID)?.querySelector('[data-sve-html-scope]');

  if (!btn) {
    return;
  }

  dockState.htmlScopePref = htmlScopeEnabled(win);

  // Pressed means the tree is on screen. Reading the panel rather than the
  // stored setting is what keeps the two from drifting: the tree can also be
  // closed from its own ✕, or pushed aside when another pane takes the dock,
  // and neither of those comes through this button.
  const shown = featureOn(win, 'html_tree') === false
    ? dockState.htmlScopePref
    : (htmlTreeOpen(win) || treeOpening);

  btn.setAttribute('aria-pressed', shown ? 'true' : 'false');
  btn.title = t(win, shown ? 'code_dock_html_scope_off' : 'code_dock_html_scope');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = SCOPE_ICON;
  win.document.getElementById(DOCK_ID)?.toggleAttribute('data-sve-html-scoped', dockState.htmlScopeActive);
  exposeHtmlScope();
}

export function bindHtmlScope(win, dock) {
  if (dock._sveHtmlScopeBound) {
    return;
  }

  dock._sveHtmlScopeBound = true;
  dockState.htmlScopePref = htmlScopeEnabled(win);
  bindHtmlTreeWatch(win, dock);

  // The dock has just opened: put the tree where the remembered setting says.
  // On a fresh install that is on.
  syncHtmlTree(win, dockState.htmlScopePref);

  dock.querySelector('[data-sve-html-scope]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // From what is on screen, not from what was last stored — otherwise a tree
    // closed by its own ✕ needs two clicks to come back.
    const shown = htmlTreeOpen(win) || treeOpening;

    dockState.htmlScopePref = !shown;
    chromeSet(win, SCOPE_KEY, dockState.htmlScopePref ? '1' : '0');

    if (dockState.htmlScopePref) {
      if (dockState.htmlFocus) {
        flushCssScope();
        showHtmlScope();
      }
    } else if (dockState.htmlScopeActive) {
      showHtmlFull();
    }

    syncHtmlTree(win, dockState.htmlScopePref);
    paintHtmlScope(win);
  });
}

/**
 * Keep the button and the tree in step when the tree changes without it.
 *
 * The panel has its own ✕, and another pane taking the right dock puts it away
 * too. Neither goes through this button, so both used to leave it lit with
 * nothing behind it — and the panes still narrowed to a tag the reader could no
 * longer see in a tree.
 */
function bindHtmlTreeWatch(win, dock) {
  if (dock._sveTreeWatchBound) {
    return;
  }

  dock._sveTreeWatchBound = true;

  win.addEventListener('sve-right-dock-change', () => {
    if (treeOpening || featureOn(win, 'html_tree') === false) {
      return;
    }

    if (!win.document.getElementById(DOCK_ID)) {
      return;
    }

    const shown = htmlTreeOpen(win);

    if (shown === htmlScopeEnabled(win)) {
      return;
    }

    dockState.htmlScopePref = shown;
    chromeSet(win, SCOPE_KEY, shown ? '1' : '0');

    if (shown) {
      if (dockState.htmlFocus) {
        flushCssScope();
        showHtmlScope();
      }
    } else if (dockState.htmlScopeActive) {
      showHtmlFull();
    }

    paintHtmlScope(win);
  });
}
