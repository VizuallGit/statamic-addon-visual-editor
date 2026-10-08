/**
 * code-dock.js — region "scope", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { ask } from '../cp/bus.js';
import { chromeGet, chromeSet } from '../chrome-prefs.js';
import { ensurePanel } from '../lazy-panels.js';
import CodeDockAddClass from '../cp/surfaces/CodeDockAddClass.vue';
import { mountSurface } from '../cp/mount.js';
import { addBracketClassToTag, bracketClassTokens, buildScopedCss, cssBalanced, cssClassSelectors, diffBracketNames, findClassRule, firstClassName, hasTopLevelClassRule, mergeScopedCss, pruneBracketCss, rewriteBracketClassTokens, sanitizeCssClassName, syncCssWithBrackets, tokenTreeFromHtml } from '../css-scope.js';
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
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import { minimalChange } from '../lib/minimal-change.js';
import { ALL_ICON } from './all-icon.js';
import { freshUndo } from './undo.js';

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

  // `css` is the whole sheet as it stands when it is read: the CSS pane shows
  // a slice while the HTML pane is scoped, and the paint holds the sheet with
  // the slice merged in — the same merge the save does. Until v1.1.468 it was
  // a copy of `cssFull` taken here, on HTML changes only, and the paint put
  // the pane after it: the copy's rule sat inside `@scope`, the pane's did
  // not, and a scoped rule wins over an unscoped one of the same selector
  // whatever the order — a value changed or removed in the pane stayed in
  // the preview until a reload.
  // All: the HTML pane is the whole file (no range to splice into), but the
  // CSS pane still shows the picked element's rules — the paint needs the
  // whole sheet with them merged in, not the pane's slice.
  dock.__sveHtmlScope = dockState.htmlScopeActive && dockState.htmlFocus
    ? {
        full: dockState.htmlFull,
        from: dockState.htmlFocus.from,
        to: dockState.htmlFocus.to,
        get css() {
          return mergedCssFull();
        },
      }
    : dockState.htmlAll && dockState.cssPane === 'tree'
      ? {
          get css() {
            return mergedCssFull();
          },
        }
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

/**
 * Names added or renamed in `[ ]` get their rules; nothing else moves. (Until
 * v1.1.460 every bracket edit also rebuilt the file's rules nested the way
 * the markup nests — a `.icon {}` of its own was pulled into `.icon-group {}`.)
 */
function applyBracketCssSync(prevNames, nextNames) {
  dockState.cssFull = syncCssWithBrackets(dockState.cssFull, prevNames, nextNames);
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
  const cssText = editors.css?.state.doc.toString() ?? '';

  // Read once its braces close, like the write-back into `cssFull`: a `.foo {`
  // whose `}` is not there yet has no rule to put on the tag, and noting its
  // name here would make the `.foo {}` a keystroke later look like nothing new.
  if (!cssBalanced(cssText)) {
    return;
  }

  const nextSelectors = cssClassSelectors(cssText);

  if (!view || namesEqual(dockState.lastCssSelectorNames, nextSelectors)) {
    return;
  }

  const owned = new Set(dockState.lastBracketNames);
  const { renamed, added, removed } = diffBracketNames(dockState.lastCssSelectorNames, nextSelectors);
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

  // After the renames and removals, so a name one of them just wrote is
  // already in the file and is not written a second time.
  html = addPickedBracketNames(html, added, owned, cssText);

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

/**
 * A rule for a new name, written in the CSS pane while it shows one picked
 * element, puts that name in the element's `[ ]`. Until now only a rename or a
 * removal reached the markup; an added rule had no tag to belong to. So a rule
 * deleted in the pane — which takes its `[ name ]` off the tag — came back on
 * ⌘Z without it, and `.foo {}` typed for the picked `<li>` styled nothing.
 *
 * The element is the pane's own pick (`cssFocus`, a tree path) or, without
 * one, the element the HTML pane is scoped to. It is found once, in the file
 * as it stands after this flush's renames and removals, and written in the
 * HTML pane's offsets (the pane may hold a slice that starts at
 * `htmlFocus.from`). Left alone: a name already in `[ ]` anywhere in the file
 * (that element's rule, not a new one), and a rule nested inside another (it
 * styles something inside, not the picked element). Nothing happens when the
 * pane shows the whole file, or the file's root view that nobody picked.
 *
 * Typing a name a letter at a time adds it once, when its `{` is typed; every
 * letter after that is a rename of a name now in `[ ]`, which the loop above
 * already carries into the markup.
 *
 * @param {string} html the HTML pane's text, this flush's renames and removals applied
 * @returns {string} that text with the new names on the picked tag
 */
function addPickedBracketNames(html, added, owned, cssText) {
  if (!added.length || dockState.cssPane !== 'tree') {
    return html;
  }

  // Bring `htmlFull` up to the pane as it stood before this flush, so the
  // text around the pane's slice is the file's. A range that no longer fits
  // lets the scope go in here, and the checks below read the state as it is.
  syncScopedHtml();

  const path = dockState.cssFocus?.path;
  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;

  if (!path && !scoped) {
    return html;
  }

  const base = scoped ? dockState.htmlFocus.from : 0;
  const full = scoped
    ? dockState.htmlFull.slice(0, base) + html + dockState.htmlFull.slice(dockState.htmlFocus.to)
    : html;
  const rows = flattenHtmlTree(parseHtmlTree(full), new Set());
  const row = path ? rows.find((item) => item.path === path) : rows.find((item) => item.from === base);

  if (!row || row.from < base || row.openTo - base > html.length) {
    return html;
  }

  const taken = new Set(bracketClassTokens(full).map((token) => token.name));
  const from = row.from - base;
  let to = row.openTo - base;
  let next = html;

  for (const raw of added) {
    const name = sanitizeCssClassName(raw);

    if (!name || owned.has(name) || taken.has(name) || !hasTopLevelClassRule(cssText, name)) {
      continue;
    }

    ({ html: next, to } = addBracketClassToTag(next, from, to, name));
    taken.add(name);
  }

  return next;
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
  if (dockState.htmlScopePref && !dockState.htmlAll && htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, dockState.htmlFull.length)) {
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

  // All: the editor is the whole file and the pick moves with every edit in
  // it, so the element is read from there — `htmlFull` may not be synced yet.
  if (dockState.htmlAll) {
    const text = editors.html?.state.doc.toString() ?? '';

    return htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, text.length)
      ? text.slice(dockState.htmlFocus.from, dockState.htmlFocus.to)
      : '';
  }

  if (htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, dockState.htmlFull.length)) {
    return dockState.htmlFull.slice(dockState.htmlFocus.from, dockState.htmlFocus.to);
  }

  return '';
}

/**
 * The element the CSS pane's own pick points at, in the file as it stands NOW.
 *
 * The pick is a tree path, never a pair of offsets. `syncScopedHtml` rebuilds
 * `htmlFull` from the editor on every keystroke, so a stored offset is stale
 * the moment anyone types — and a stale slice is not caught by a bounds check.
 * v1.1.412 stored offsets, and one HTML edit later the CSS pane was reading a
 * garbage slice: the flush merged nowhere, deletions never reached the file,
 * and the preview kept styles the pane no longer showed. Same lesson, same
 * cure as `resyncNode` in tw-classes.js: find the tag again by its path after
 * every write, and let go the moment it cannot be found.
 *
 * @returns {string|null} the element's slice, or null when there is no pick.
 */
function cssFocusSnippet() {
  const path = dockState.cssFocus?.path;

  if (!path) {
    return null;
  }

  const html = currentFullHtml();
  const row = flattenHtmlTree(parseHtmlTree(html), new Set()).find((item) => item.path === path);

  if (!row) {
    // The element is gone, or the file was rebuilt around it. Following the
    // HTML pane again is the safe answer; showing a wrong element is not.
    dockState.cssFocus = null;

    return null;
  }

  return html.slice(row.from, row.to);
}

/** What the CSS pane is built from: its own pick, or the HTML pane's range. */
function cssSnippet() {
  return cssFocusSnippet() ?? htmlSnippet();
}

/** Let go of the CSS pane's own pick; it follows the HTML pane again. */
export function clearCssFocus() {
  dockState.cssFocus = null;
}

/**
 * A click on a tag in the HTML pane points the CSS pane at that element.
 *
 * The HTML pane is left exactly as it is. Narrowing the code to the tag under
 * the caret is the tree's move, and only the tree's: the pane is where the
 * reader is typing, and rebuilding it around whatever they last clicked takes
 * the file away from them mid-edit. So this writes `cssFocus`, never
 * `htmlFocus` — the latter is also the interval the pane's text is spliced
 * back into, and moving it would write the edit to the wrong part of the file.
 *
 * On the opening tag only. A click in the text between tags is aimed at the
 * words, not at the element.
 */
export function pickHtmlTagAtCursor(win) {
  if (!win || dockState.applying || dockState.cssValues) {
    return;
  }

  const view = editors.html;

  if (!view) {
    return;
  }

  // The pane's own edits have to be in `htmlFull` before it is read for tags,
  // and in `cssFull` before the pane is rebuilt around a different element.
  syncScopedHtml();
  flushCssScope();

  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;
  const offset = scoped ? dockState.htmlFocus.from : 0;
  const pos = offset + view.state.selection.main.from;
  let row = null;

  // Pre-order, and a child sits inside its parent, so the last row that still
  // holds the caret is the innermost tag.
  for (const item of flattenHtmlTree(parseHtmlTree(dockState.htmlFull), new Set())) {
    if (item.from <= pos && pos < item.to) {
      row = item;
    }
  }

  if (!row || pos < row.from || pos >= row.openTo) {
    return;
  }

  // "Same" means the CSS pane already shows this element: an existing pick on
  // the same path, or the HTML pane's own range when it is scoped to it. With
  // the pane showing the whole file, no element is "same" — the first click
  // is the one that starts following. v1.1.413 had this branch as `!scoped`,
  // which read as "whole file = nothing to do": the first click in the whole-
  // file view did nothing at all, and the feature only woke up after the tree
  // had scoped the pane once.
  const same = dockState.cssFocus
    ? dockState.cssFocus.path === row.path
    : scoped && dockState.htmlFocus.from === row.from && dockState.htmlFocus.to === row.to;

  if (same) {
    return;
  }

  dockState.cssFocus = { path: row.path };
  applyCssScope();
}

/**
 * The file's HTML as the panes hold it now, read without syncing anything into
 * `htmlFull`: `mergedCssFull` is also what the Instant paint reads.
 */
function fullHtmlNow() {
  const text = editors.html?.state.doc.toString();
  const focus = dockState.htmlFocus;

  if (text != null && dockState.htmlScopeActive && focus && focus.from >= 0 && focus.from <= dockState.htmlFull.length && focus.to >= focus.from) {
    return dockState.htmlFull.slice(0, focus.from) + text + dockState.htmlFull.slice(focus.to);
  }

  return text ?? dockState.lastParts.html ?? '';
}

/**
 * The whole sheet with the CSS pane's current text in it: the pane's rules in
 * place of their older copies when the pane shows a slice, the pane itself
 * when it shows the whole file. What `flushCssScope` writes to `cssFull`,
 * without writing it.
 *
 * A slice is merged against what it was last time (`cssScopeSnapshot`), so a
 * rule taken out of the pane — or renamed, or typed a letter at a time — is
 * taken out of the file too; but never a rule whose name is still in `[ ]` on
 * some element. By the time this runs, `flushCssToHtml` has taken the pane's
 * removed and renamed names off the picked tag, so what is left in `[ ]` is
 * another element's.
 */
export function mergedCssFull() {
  const current = editors.css?.state.doc.toString();

  if (current == null) {
    return dockState.cssFull;
  }

  if (dockState.cssPane === 'tree') {
    if (current === dockState.cssScopeSnapshot) {
      return dockState.cssFull;
    }

    const root =
      tokenTreeFromHtml(cssSnippet())[0]?.className || firstClassName(current);

    return mergeScopedCss(dockState.cssFull, current, root, {
      previous: dockState.cssScopeSnapshot,
      keep: bracketClassTokens(fullHtmlNow()).map((token) => token.name),
    });
  }

  if (dockState.cssPane === 'full') {
    return current;
  }

  return dockState.cssFull;
}

export function flushCssScope() {
  const current = editors.css?.state.doc.toString() ?? '';

  if (dockState.cssPane === 'tree') {
    // A pane that does not close its braces is not written (see
    // `cssBalanced`), and it is not the text the next merge compares with:
    // the snapshot stays the last text that was written.
    if (current === dockState.cssScopeSnapshot || !cssBalanced(current)) {
      return;
    }

    dockState.cssFull = mergedCssFull();
    dockState.cssScopeSnapshot = current;
  } else if (dockState.cssPane === 'full') {
    dockState.cssFull = current;
  }
}

function tokenTreeNeedsCss(css, nodes) {
  return (nodes || []).some((node) => !findClassRule(css, node.className));
}

export function applyCssScope() {
  let text = dockState.cssFull;
  let tree = [];
  let created = false;

  // The ID is the file's own instance layer, not the tag you have picked, and
  // the tree scope rebuilds the pane from the picked tag's classes — a view
  // the `#id-` rule is not in. So showing the ID shows the file.
  // Resolved first: a pick that no longer finds its element clears itself in
  // here, and the gate below then reads the state as it truly is.
  const picked = cssFocusSnippet();
  // With the tree on and nothing picked yet — the file just opened — the pane
  // shows the rules for the root element's own `[ ]` names, not the whole
  // block: the same view a click on the section row gives. Names on the
  // elements inside are theirs, shown on a click on them. The whole block is
  // the All button's (`cssAll`), the ID's, or the tree's when it is switched off.
  // All in the HTML pane is a look at the file around the pick, not a new
  // pick: the CSS pane keeps showing the picked element's rules.
  const fromFile = picked == null && !dockState.htmlScopeActive && !(dockState.htmlAll && dockState.htmlFocus);

  if (dockState.cssValues || dockState.cssAll || !dockState.htmlScopePref) {
    dockState.cssPane = 'full';
    text = dockState.cssFull;
  } else {
    tree = tokenTreeFromHtml(picked ?? (fromFile ? currentFullHtml() : htmlSnippet()));

    if (!tree.length) {
      dockState.cssPane = 'empty';
      text = '';
    } else {
      dockState.cssPane = 'tree';
      text = buildScopedCss(dockState.cssFull, tree);

      // Empty rules are written for the names that have none — but only when
      // the tree asked for this element. Looking at a tag in the code is not
      // a decision to style it, and a click that writes to the file and saves
      // it would make reading the markup an edit. Opening the file is not one
      // either (`fromFile`).
      if (!dockState.cssFocus && !fromFile && tokenTreeNeedsCss(dockState.cssFull, tree)) {
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

  // Showing the pick is the end of All, whoever asks for it — the button, a
  // row in the tree, the tree switched back on.
  dockState.htmlAll = false;

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
  // A new view, a new undo history: an undo right after a pick would bring
  // back the text the pane showed before (the file, or another element) and
  // the next sync would write it into this element's range (dock/undo.js).
  freshUndo('html');
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
  // The tree's own whole-file view, with the CSS pane on the whole block too;
  // All is the narrower look and has nothing left to switch here.
  dockState.htmlAll = false;
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
  freshUndo('html');
  dockState.cssPane = 'full';
  dockState.cssScopeSnapshot = dockState.cssFull;
  writeHandleEditor('css', dockState.cssFull);
  rememberCssSelectors();
}

/**
 * The HTML pane's All button: the whole file in the pane — the Antlers and the
 * markup around the picked element, `{{ switch }}`, `{{ _bg = … }}` and all —
 * with the CSS and JS still in their own panes. The pick is kept, and moved
 * with every edit (editor.js, lib/focus-map.js), so pressing it again shows
 * the same element. Only while the tree is on: with it off the pane shows the
 * whole file already.
 */
export function paintHtmlAll(win) {
  const btn = win?.document.getElementById(DOCK_ID)?.querySelector('[data-sve-html-all]');

  if (!btn) {
    return;
  }

  btn.hidden = !dockState.htmlScopePref;

  const text = win.document.createElement('span');

  text.textContent = t(win, 'code_dock_html_all');
  btn.innerHTML = ALL_ICON;
  btn.appendChild(text);
  btn.title = t(win, dockState.htmlAll ? 'code_dock_html_all_off' : 'code_dock_html_all_on');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', dockState.htmlAll ? 'true' : 'false');
}

export function setHtmlAll(win, on) {
  const view = editors.html;

  if (!view || !!on === dockState.htmlAll) {
    paintHtmlAll(win);

    return;
  }

  if (on) {
    // What the pane holds goes into the file first; then the file comes up
    // with the caret in front of the picked element, so you see where it sits.
    syncScopedHtml();

    const full = dockState.htmlFull || view.state.doc.toString();
    const focus = htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, full.length) ? dockState.htmlFocus : null;

    dockState.htmlScopeActive = false;
    dockState.htmlFull = full;
    exposeHtmlScope();
    writeHtmlEditor(full, focus ? { anchor: focus.from } : null);
    freshUndo('html');
    // Set only now: the write above swaps the slice for the file, and a pick
    // carried through that swap would land nowhere.
    dockState.htmlAll = true;
  } else {
    const length = view.state.doc.length;

    if (htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, length)) {
      flushCssScope();
      showHtmlScope(null);
    } else {
      // The element was deleted while the file was shown: there is nothing to
      // narrow to, so the pane stays on the file — and the CSS pane, which
      // still showed that element's rules, goes back to the file's.
      dockState.htmlAll = false;
      dockState.htmlFocus = null;
      flushCssScope();
      applyCssScope();
    }
  }

  paintHtmlScope(win);
}

export function clearHtmlScopeRange() {
  dockState.htmlFocus = null;
  dockState.htmlAll = false;
  dockState.cssFocus = null;
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
  paintHtmlAll(win);
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

  dock.querySelector('[data-sve-html-all]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setHtmlAll(win, !dockState.htmlAll);
  });

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
    } else if (dockState.htmlScopeActive || dockState.htmlAll) {
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
    } else if (dockState.htmlScopeActive || dockState.htmlAll) {
      showHtmlFull();
    }

    paintHtmlScope(win);
  });
}
