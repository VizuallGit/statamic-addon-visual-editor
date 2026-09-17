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
import { dock } from '../dock/state.js';
import { flushSave, onEditorInput } from './save.js';
import { loadTemplate } from './dock-api.js';
import { paintBack } from './layout.js';
import { CSS_MENU_ID, DOCK_ID, LOCK_CLOSED_ICON, LOCK_OPEN_ICON, SCOPE_ICON, SCOPE_KEY, css, editors, html } from '../code-dock.js';
import { closeCssMenu, paintCssToolState, placeCssMenu } from './css-tools.js';
import { applyCssFolds } from './css-sizes.js';

// ===== scope =====
export function currentSectionValues(win) {
  const uid = dock.lastUid;
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
  if (!type || type === dock.lastType) {
    return;
  }

  flushSave(win.document);
  loadTemplate(win, type, 'push');
}

export function goBackTemplate(win) {
  const prev = dock.typeStack.pop();

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
  const locked = dock.lastLocked;

  dock.toggleAttribute('data-sve-code-locked', locked);
  if (locked) {
    closePartialMenu(win.document);
    closeClassTokenUi(win.document);
    if (dock.htmlPartialUi) {
      dock.htmlPartialUi.setHover(editors.html, null);
      dock.htmlPartialUi.setHover(editors.css, null);
    }
    dock.htmlClassTokenUi?.setHover(editors.html, null);
  }
  btn.hidden = !dock.lockReady;
  btn.setAttribute('aria-pressed', dock.lastLocked ? 'true' : 'false');
  btn.title = t(win, dock.lastLocked ? 'code_dock_unlock' : 'code_dock_lock');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = dock.lastLocked ? LOCK_CLOSED_ICON : LOCK_OPEN_ICON;

  if (banner) {
    banner.textContent = t(win, 'code_dock_locked_banner');
  }
}

export function htmlScopeEnabled(win) {
  if (!win) {
    return dock.htmlScopePref;
  }

  return chromeGet(win, SCOPE_KEY) !== '0';
}

export function htmlFocusOk(from, to, length) {
  return from != null && to != null && from >= 0 && to > from && to <= length;
}

export function syncScopedHtml() {
  const text = editors.html?.state.doc.toString() ?? '';

  if (!dock.htmlScopeActive || !dock.htmlFocus) {
    dock.htmlFull = text;

    return;
  }

  if (dock.htmlFocus.from < 0 || dock.htmlFocus.from > dock.htmlFull.length || dock.htmlFocus.to < dock.htmlFocus.from) {
    dock.htmlScopeActive = false;
    dock.htmlFull = text;
    dock.htmlFocus = null;

    return;
  }

  dock.htmlFull = dock.htmlFull.slice(0, dock.htmlFocus.from) + text + dock.htmlFull.slice(dock.htmlFocus.to);
  dock.htmlFocus = { from: dock.htmlFocus.from, to: dock.htmlFocus.from + text.length };
}

export function currentFullHtml() {
  syncScopedHtml();

  if (dock.htmlScopeActive) {
    return dock.htmlFull;
  }

  return editors.html?.state.doc.toString() ?? dock.lastParts.html ?? '';
}

export function rememberBracketNames() {
  dock.lastBracketNames = bracketClassTokens(currentFullHtml()).map((token) => token.name);
}

export function rememberCssSelectors() {
  dock.lastCssSelectorNames = cssClassSelectors(editors.css?.state.doc.toString() ?? dock.cssFull);
}

function namesEqual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((name, i) => name === b[i]);
}

function harvestHtmlTreeCss() {
  const html = dock.htmlScopeActive ? htmlSnippet() : currentFullHtml();
  const tree = tokenTreeFromHtml(html);

  if (!tree.length) {
    return;
  }

  dock.cssFull = mergeScopedCss(dock.cssFull, buildScopedCss(dock.cssFull, tree), tree[0].className);
}

function applyBracketCssSync(prevNames, nextNames) {
  dock.cssFull = syncCssWithBrackets(dock.cssFull, prevNames, nextNames);
  harvestHtmlTreeCss();
  dock.cssFull = pruneBracketCss(dock.cssFull, nextNames, prevNames);
}

export function flushBracketSync(win) {
  if (dock.applying || dock.lastLocked || dock.lastBracketNames == null) {
    return;
  }

  const nextNames = bracketClassTokens(currentFullHtml()).map((token) => token.name);

  if (namesEqual(dock.lastBracketNames, nextNames)) {
    return;
  }

  applyBracketCssSync(dock.lastBracketNames, nextNames);
  dock.lastBracketNames = nextNames;
  applyCssScope();
  rememberCssSelectors();
}

export function flushCssToHtml() {
  if (dock.applying || dock.lastLocked || dock.lastCssSelectorNames == null || dock.lastBracketNames == null || dock.cssPane === 'empty') {
    return;
  }

  const view = editors.html;
  const nextSelectors = cssClassSelectors(editors.css?.state.doc.toString() ?? '');

  if (!view || namesEqual(dock.lastCssSelectorNames, nextSelectors)) {
    return;
  }

  const owned = new Set(dock.lastBracketNames);
  const { renamed, removed } = diffBracketNames(dock.lastCssSelectorNames, nextSelectors);
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
    dock.applying = true;

    try {
      writeHtmlEditor(html);
    } finally {
      dock.applying = false;
    }
  }

  rememberBracketNames();
  dock.lastCssSelectorNames = nextSelectors;
}

function renameBracketClassAt(token, raw) {
  const name = sanitizeCssClassName(raw);
  const view = editors.html;

  if (!name || !view || view.state.readOnly || name === token.name) {
    return;
  }

  dock.applying = true;

  try {
    view.dispatch({
      changes: { from: token.from, to: token.to, insert: name },
    });
  } finally {
    dock.applying = false;
  }

  const prev = dock.lastBracketNames == null ? [] : dock.lastBracketNames.slice();

  rememberBracketNames();
  applyBracketCssSync(prev, dock.lastBracketNames);
  applyCssScope();
  rememberCssSelectors();

  if (dock.lastWin) {
    onEditorInput(dock.lastWin);
    paintCssToolState(dock.lastWin);
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
  if (dock.htmlScopePref && htmlFocusOk(dock.htmlFocus?.from, dock.htmlFocus?.to, dock.htmlFull.length)) {
    dock.htmlScopeActive = true;

    return dock.htmlFull.slice(dock.htmlFocus.from, dock.htmlFocus.to);
  }

  dock.htmlScopeActive = false;

  return dock.htmlFull;
}

export function writeHandleEditor(handle, text, selection) {
  const view = editors[handle];

  if (!view) {
    return;
  }

  const current = view.state.doc.toString();

  dock.applying = true;

  try {
    if (current !== text) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: text },
        ...(selection ? { selection, scrollIntoView: true } : {}),
      });
    } else if (selection) {
      view.dispatch({
        selection,
        scrollIntoView: true,
      });
    }
  } finally {
    dock.applying = false;
  }
}

export function writeHtmlEditor(text, selection) {
  writeHandleEditor('html', text, selection);
}

function htmlSnippet() {
  if (dock.htmlScopeActive) {
    return editors.html?.state.doc.toString() ?? '';
  }

  if (htmlFocusOk(dock.htmlFocus?.from, dock.htmlFocus?.to, dock.htmlFull.length)) {
    return dock.htmlFull.slice(dock.htmlFocus.from, dock.htmlFocus.to);
  }

  return '';
}

export function flushCssScope() {
  const current = editors.css?.state.doc.toString() ?? '';

  if (dock.cssPane === 'tree') {
    if (current === dock.cssScopeSnapshot) {
      return;
    }

    const root =
      tokenTreeFromHtml(htmlSnippet())[0]?.className || firstClassName(current);

    dock.cssFull = mergeScopedCss(dock.cssFull, current, root);
    dock.cssScopeSnapshot = current;
  } else if (dock.cssPane === 'full') {
    dock.cssFull = current;
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
  let text = dock.cssFull;
  let tree = [];
  let created = false;

  // The ID is the file's own instance layer, not the tag you have picked, and
  // the tree scope rebuilds the pane from the picked tag's classes — a view
  // the `#id-` rule is not in. So showing the ID shows the file.
  if (dock.cssValues || !dock.htmlScopePref || !dock.htmlScopeActive) {
    dock.cssPane = 'full';
    text = dock.cssFull;
  } else {
    tree = tokenTreeFromHtml(htmlSnippet());

    if (!tree.length) {
      dock.cssPane = 'empty';
      text = '';
    } else {
      dock.cssPane = 'tree';
      text = buildScopedCss(dock.cssFull, tree);

      if (tokenTreeNeedsCss(dock.cssFull, tree)) {
        dock.cssFull = mergeScopedCss(dock.cssFull, text, tree[0].className);
        created = true;
      }
    }
  }

  dock.cssScopeSnapshot = text;
  writeHandleEditor('css', text);
  rememberCssSelectors();

  if (dock.lastWin) {
    applyCssFolds(dock.lastWin, true);
    paintCssToolState(dock.lastWin);

    if (created) {
      onEditorInput(dock.lastWin);
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

  if (!view || !dock.htmlFocus) {
    return;
  }

  if (!dock.htmlScopeActive) {
    dock.htmlFull = view.state.doc.toString();
  }

  const length = dock.htmlFull.length;
  const from = Math.max(0, Math.min(dock.htmlFocus.from, length));
  const to = Math.max(from, Math.min(dock.htmlFocus.to, length));

  if (to <= from) {
    return;
  }

  dock.htmlFocus = { from, to };
  dock.htmlScopeActive = true;

  const at = caret == null ? 0 : Math.max(0, Math.min(caret - from, to - from));

  writeHtmlEditor(dock.htmlFull.slice(from, to), { anchor: at, head: at });
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
  dock.htmlScopeActive = false;

  const full = dock.htmlFull || view.state.doc.toString();
  // A caret beats the range: the tree asked to be put inside the row, not to
  // have it selected.
  const selection =
    caret != null
      ? { anchor: Math.max(0, Math.min(caret, full.length)) }
      : selectFocus && htmlFocusOk(dock.htmlFocus?.from, dock.htmlFocus?.to, full.length)
        ? { anchor: dock.htmlFocus.from, head: dock.htmlFocus.to }
        : null;

  dock.htmlFull = full;
  writeHtmlEditor(full, selection);
  dock.cssPane = 'full';
  dock.cssScopeSnapshot = dock.cssFull;
  writeHandleEditor('css', dock.cssFull);
  rememberCssSelectors();
}

export function clearHtmlScopeRange() {
  dock.htmlFocus = null;
  dock.htmlScopeActive = false;
  dock.htmlFull = '';
  dock.cssFull = '';
  dock.cssPane = 'full';
  dock.cssScopeSnapshot = '';
  dock.lastBracketNames = null;
  dock.lastCssSelectorNames = null;
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

  dock.htmlScopePref = htmlScopeEnabled(win);

  // Pressed means the tree is on screen. Reading the panel rather than the
  // stored setting is what keeps the two from drifting: the tree can also be
  // closed from its own ✕, or pushed aside when another pane takes the dock,
  // and neither of those comes through this button.
  const shown = featureOn(win, 'html_tree') === false
    ? dock.htmlScopePref
    : (htmlTreeOpen(win) || treeOpening);

  btn.setAttribute('aria-pressed', shown ? 'true' : 'false');
  btn.title = t(win, shown ? 'code_dock_html_scope_off' : 'code_dock_html_scope');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = SCOPE_ICON;
  win.document.getElementById(DOCK_ID)?.toggleAttribute('data-sve-html-scoped', dock.htmlScopeActive);
}

export function bindHtmlScope(win, dock) {
  if (dock._sveHtmlScopeBound) {
    return;
  }

  dock._sveHtmlScopeBound = true;
  dock.htmlScopePref = htmlScopeEnabled(win);
  bindHtmlTreeWatch(win, dock);

  // The dock has just opened: put the tree where the remembered setting says.
  // On a fresh install that is on.
  syncHtmlTree(win, dock.htmlScopePref);

  dock.querySelector('[data-sve-html-scope]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // From what is on screen, not from what was last stored — otherwise a tree
    // closed by its own ✕ needs two clicks to come back.
    const shown = htmlTreeOpen(win) || treeOpening;

    dock.htmlScopePref = !shown;
    chromeSet(win, SCOPE_KEY, dock.htmlScopePref ? '1' : '0');

    if (dock.htmlScopePref) {
      if (dock.htmlFocus) {
        flushCssScope();
        showHtmlScope();
      }
    } else if (dock.htmlScopeActive) {
      showHtmlFull();
    }

    syncHtmlTree(win, dock.htmlScopePref);
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

    dock.htmlScopePref = shown;
    chromeSet(win, SCOPE_KEY, shown ? '1' : '0');

    if (shown) {
      if (dock.htmlFocus) {
        flushCssScope();
        showHtmlScope();
      }
    } else if (dock.htmlScopeActive) {
      showHtmlFull();
    }

    paintHtmlScope(win);
  });
}
