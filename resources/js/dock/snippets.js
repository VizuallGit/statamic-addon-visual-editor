/**
 * Snippets — the dock's library of reusable HTML and CSS.
 *
 * Two kinds, two files (Snippet.php):
 *
 * - An HTML snippet is markup with the CSS and JS that travel with it, an
 *   `.antlers.html` in the shape the dock reads. Picking one writes the
 *   markup at the caret and the CSS and JS onto their panes.
 * - A CSS snippet is the body of one rule — declarations and nested `&…` /
 *   `@media` blocks, no selector — a `.css` file. Picking one writes that
 *   body into the class of the element the CSS pane is scoped to. The
 *   snippet wins over what the rule already says (snippet-css.js); with a
 *   size or state tab active it lands in that block inside the rule, made if
 *   the rule has none. A tag with no class is given one first, in the same
 *   prompt the pane's + uses.
 *
 * Either way the text becomes the template's own. A snippet is copied, never
 * referenced — which is what tells it apart from a component (a partial tag
 * every page shares) and from a utility class (one rule in site.css). A CSS
 * snippet is told apart from a class (Theme → Styles) the same way: a class
 * is one named rule the whole site shares; a snippet is nameless content
 * that belongs to whatever class it was copied into. Changing the snippet
 * later — Theme → Styles → Snippets — changes the library copy only.
 *
 * Saving goes the other way. From the HTML pane: the selection, or the whole
 * pane, with the CSS rules that describe it (component-css decides which, the
 * same way it does for a component). From the CSS pane: the selection, or the
 * picked element's own rule, stripped to its body — one whole rule gives its
 * inside, loose declarations go as they are, anything else is refused
 * (`snippetBodyFrom`).
 *
 * The CSS pane's button has a second face. In Tailwind mode the pane shows
 * the picked tag's classes, not CSS, and there is nothing to copy — so the
 * button reads Utility and hands the tag's classes to tw-utility.js, which
 * writes them as one `@utility` into site.css. Which face shows follows the
 * dock's `data-sve-style`, painted by style-modes.js; the click reads the
 * same state.
 *
 * Its own surface: this module, CodeDockSnippets.vue, snippet-css.js and PHP
 * that only reads and writes the folder. The pane is written like a typed
 * edit — one CodeMirror change, so ⌘Z takes it back and the dock's own
 * listener saves and paints it. Nothing here reaches preview, overlay or
 * bridge.
 */
import CodeDockSnippets from '../cp/surfaces/CodeDockSnippets.vue';
import CodeDockAddClass from '../cp/surfaces/CodeDockAddClass.vue';
import NamePrompt from '../cp/surfaces/NamePrompt.vue';
import { openCpOverlay } from '../cp/open-overlay.js';
import { mountSurface } from '../cp/mount.js';
import { ask } from '../cp/bus.js';
import { csrfToken } from '../lib/csrf.js';
import { t } from '../lib/i18n.js';
import { dedent } from '../component-extract.js';
import { splitCssForBlock } from '../component-css.js';
import { indentAntlersSnippet } from '../antlers-snippets.js';
import { findClassRule, firstClassName } from '../css-scope.js';
import { blocksForSize } from '../css-sizes.js';
import { mergeSnippetIntoBody, snippetBodyFrom, wrapSnippetBody } from '../snippet-css.js';
import { CSS_MENU_ID, DOCK_ID, editors } from '../code-dock.js';
import { DATA_MENU_ID, closeDataMenu, hookDataMenu, pickerButton, placeDataMenu } from './data-vars.js';
import { closeCssMenu, indentFromPrevious, leadingCssIndent, lineIndentOf, placeCssMenu } from './css-tools.js';
import { cssSizeRow, cssSizeRows, cssStateSuffix, newSizeQuery } from './css-sizes.js';
import { finishHtmlEdit, insertHtmlElement } from './html-tools.js';
import { insertAiSnippet } from './dock-api.js';
import { onEditorInput } from './save.js';
import { addClassToPickedTag, cssPaneRoot, flushCssScope } from './scope.js';
import { dockState } from './state.js';
import { saveTwUtility } from './tw-utility.js';

const LIST_API = '/!/sve/snippets';
const ONE_API = '/!/sve/snippet';

/** Two sheets, one laid over the other: text copied in, not pointed at. */
const SNIPPET_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

/** A pair of braces: one rule in site.css — the mark the Utilities tab wears. */
const UTILITY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>';

const HEADERS = { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' };

async function fetchJson(win, url, init = {}) {
  const res = await win.fetch(url, { credentials: 'same-origin', ...init, headers: { ...HEADERS, ...(init.headers || {}) } });

  if (!res.ok) {
    const err = new Error(String(res.status));

    err.status = res.status;

    throw err;
  }

  return res.json();
}

/** @returns {Promise<Array<{ name: string, kind: 'css'|'html', hint: string, html: boolean, css: boolean, js: boolean }>>} */
async function fetchList(win) {
  const data = await fetchJson(win, LIST_API);

  return Array.isArray(data?.items) ? data.items : [];
}

/** @returns {Promise<{ name: string, kind: 'css'|'html', html: string, css: string, js: string }>} */
function fetchOne(win, name) {
  return fetchJson(win, `${ONE_API}?name=${encodeURIComponent(name)}`);
}

function postSnippet(win, body) {
  return fetchJson(win, ONE_API, {
    method: 'POST',
    headers: { 'X-CSRF-TOKEN': csrfToken(win), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * The HTML pane offers every snippet — a CSS one is written into the picked
 * element's class from either pane. The CSS pane offers only CSS snippets:
 * an HTML snippet's rules carry selectors, and the pane writes bodies.
 */
function rowsFor(items, pane) {
  return pane === 'css' ? items.filter((item) => item.kind === 'css') : items;
}

// --- Insert ----------------------------------------------------------------

/**
 * The markup at the caret, every line brought to the caret's indent — the
 * file holds it flush left, the way a component file does.
 */
function insertHtmlBlock(html) {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return false;
  }

  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const indent = line.text.trim()
    ? lineIndentOf(line.text)
    : indentFromPrevious(view, line) || lineIndentOf(line.text);
  const text = indentAntlersSnippet(html.trim(), indent);

  insertHtmlElement(text, text.length);
  finishHtmlEdit();

  return true;
}

/**
 * A CSS snippet's body into the rule the CSS pane is scoped to.
 *
 * The rule is the pane's own root (`cssPaneRoot`): the picked element's first
 * `[ ]` name, the same one the pane's write-back lands under. With a size tab
 * active the body goes into that size's `@media` block inside the rule — the
 * block found by its size, whatever spelling its query uses, or a new one in
 * the spelling the file uses; with a state, into `&:state`; with both, the
 * state inside the size. The merge is `mergeSnippetIntoBody`: the snippet
 * wins, property by property.
 *
 * Written as one change to the pane, where the rule is on screen: the dock's
 * own listener then saves it and paints it like a keystroke, and ⌘Z in the
 * pane takes it back.
 */
function writeSnippetIntoRule(win, root, body) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return false;
  }

  const text = view.state.doc.toString();
  const rule = findClassRule(text, root);

  if (!rule) {
    return false;
  }

  const row = dockState.cssSize ? cssSizeRow(win, dockState.cssSize) : null;
  let media = '';

  if (row && !row.base) {
    const own = blocksForSize(text, cssSizeRows(win), row.handle).find((block) => block.from > rule.brace && block.to <= rule.close);

    media = own ? own.query : newSizeQuery(row, text);
  }

  const inner = text.slice(rule.brace + 1, rule.close);
  const next = mergeSnippetIntoBody(inner, wrapSnippetBody(body, { state: cssStateSuffix(), media }), {
    parentIndent: leadingCssIndent(text, rule.from),
  });

  if (next !== inner) {
    view.dispatch({ changes: { from: rule.brace + 1, to: rule.close, insert: next } });
  }

  view.focus();

  return true;
}

/**
 * The picked element has no class to write into: ask for one, put it in the
 * tag's `[ ]` with its empty rule (the same write a rename does), then write
 * the snippet into that rule. The prompt is the pane's own class prompt, by
 * the CSS pane's Snippet button.
 */
function openSnippetClassPrompt(win, body) {
  const doc = win.document;
  const dock = doc.getElementById(DOCK_ID);
  const anchor = dock?.querySelector('[data-sve-snippet-btn][data-sve-snippet-pane="css"]') || dock?.querySelector('[data-sve-snippet-btn]');

  if (!anchor) {
    return;
  }

  closeCssMenu(doc);

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockAddClass, menu, {
    label: t(win, 'snippet_css_class_name'),
    placeholder: t(win, 'code_dock_css_class_placeholder'),
    onClose: () => closeCssMenu(doc),
    onAdd: (value) => {
      closeCssMenu(doc);

      if (!addClassToPickedTag(value)) {
        win.Statamic?.$toast?.error(t(win, 'snippet_css_pick'));

        return;
      }

      // The name and its empty rule save like a typed edit; the body follows
      // as the pane's next change.
      onEditorInput(win);
      writeSnippetIntoRule(win, cssPaneRoot(), body);
    },
  });
}

function insertCssSnippet(win, body) {
  if (!editors.css || editors.css.state.readOnly || dockState.lastLocked) {
    return;
  }

  // The pane's own edits into the file first: the rule written into below
  // is then the one the file has.
  flushCssScope();

  // Only a pane scoped to one element has a class to write into. The whole
  // file (tree off, All, Values) names no element — nothing is guessed from
  // the caret.
  if (dockState.cssPane !== 'tree' && dockState.cssPane !== 'empty') {
    win.Statamic?.$toast?.error(t(win, 'snippet_css_pick'));

    return;
  }

  const root = cssPaneRoot();

  if (!root) {
    openSnippetClassPrompt(win, body);

    return;
  }

  if (!writeSnippetIntoRule(win, root, body)) {
    win.Statamic?.$toast?.error(t(win, 'snippet_css_pick'));
  }
}

async function insertSnippet(win, name) {
  let parts;

  try {
    parts = await fetchOne(win, name);
  } catch {
    win.Statamic?.$toast?.error(t(win, 'snippet_read_failed'));

    return;
  }

  const html = typeof parts?.html === 'string' ? parts.html : '';
  const css = typeof parts?.css === 'string' ? parts.css : '';
  const js = typeof parts?.js === 'string' ? parts.js : '';

  if (parts?.kind === 'css') {
    insertCssSnippet(win, css);

    return;
  }

  if (html.trim()) {
    insertHtmlBlock(html);
  }

  if (css.trim() || js.trim()) {
    insertAiSnippet(win, { css, js });
  }
}

// --- Save ------------------------------------------------------------------

/**
 * The selected text, from the start of its first line when only indentation
 * stands before it — so the block dedents as a whole, not from the second
 * line on. Empty when nothing is selected.
 */
function selectedText(view) {
  const sel = view?.state.selection.main;

  if (!sel || sel.empty) {
    return '';
  }

  const line = view.state.doc.lineAt(sel.from);
  const from = line.text.slice(0, sel.from - line.from).trim() === '' ? line.from : sel.from;

  return view.state.doc.sliceString(from, sel.to);
}

/**
 * What the CSS pane is offering to save, as a body.
 *
 * The selection when there is one; without one, the picked element's own
 * rule — the pane's root — or the whole pane when the pane is not scoped.
 * `snippetBodyFrom` then strips the one selector or refuses: a CSS snippet is
 * the inside of one rule. The class the rule had is offered as the name.
 *
 * @returns {{ kind: 'css', html: string, css: string, js: string, name: string } | { problem: string }}
 */
function cssSnippetParts() {
  const selected = selectedText(editors.css);
  let source = selected;
  let name = firstClassName(selected);

  if (!selected.trim()) {
    const text = editors.css?.state.doc.toString() ?? '';
    const root = dockState.cssPane === 'tree' ? cssPaneRoot() : '';
    const rule = root ? findClassRule(text, root) : null;

    source = rule ? text.slice(rule.from, rule.to) : text;
    name = rule ? root : firstClassName(text);
  }

  const got = snippetBodyFrom(source);

  if (got.problem) {
    return { problem: got.problem };
  }

  return { kind: 'css', html: '', css: got.body, js: '', name };
}

/**
 * What the pane is offering to save.
 *
 * @returns {{ kind: 'css'|'html', html: string, css: string, js: string, name: string } | { problem: string }}
 */
function snippetPartsFor(pane) {
  if (pane === 'css') {
    return cssSnippetParts();
  }

  const selected = selectedText(editors.html);
  const full = String(ask('dock:html') || '');
  const css = String(ask('dock:css') || '');

  // A selection takes the rules that describe it. Whether a rule also serves
  // the rest of the file does not matter here: it is copied, not moved.
  if (selected.trim()) {
    const rest = full.includes(selected) ? full.replace(selected, '') : full;

    return {
      kind: 'html',
      html: dedent(selected),
      css: splitCssForBlock(css, selected, rest).move.trim(),
      js: '',
      name: suggestedName(selected),
    };
  }

  // The whole file: its markup, all of its CSS, and its JS pane.
  return { kind: 'html', html: dedent(full), css: css.trim(), js: String(ask('dock:js') || '').trim(), name: suggestedName(full) };
}

/**
 * The first tag's first class, else its name — what a component is offered
 * too. A section root's `[ {{ _class }} ]` is skipped: neither the brackets
 * nor the tag is a name.
 */
function suggestedName(html) {
  const tag = String(html || '').match(/<([a-zA-Z][\w-]*)([^>]*)>/);

  if (!tag) {
    return '';
  }

  const klass = tag[2].match(/\bclass="([^"]*)"/);
  const first = klass ? klass[1].split(/\s+/).find((name) => /^[a-zA-Z][\w-]*$/.test(name)) : '';

  return first || tag[1];
}

async function store(win, name, parts, replace = false) {
  try {
    const made = await postSnippet(win, { name, kind: parts.kind, html: parts.html, css: parts.css, js: parts.js, replace });

    win.Statamic?.$toast?.success(t(win, 'snippet_saved', { name: made?.name || name }));
  } catch (err) {
    if (err?.status === 409 && !replace) {
      if (win.confirm(t(win, 'snippet_replace', { name }))) {
        await store(win, name, parts, true);
      }

      return;
    }

    win.Statamic?.$toast?.error(t(win, 'snippet_failed'));
  }
}

/** Why the CSS pane's text cannot be a snippet, in the reader's words. */
const CSS_PROBLEM_KEY = {
  empty: 'snippet_empty',
  unbalanced: 'snippet_css_unbalanced',
  rules: 'snippet_css_one_rule',
};

function saveSnippet(win, pane) {
  const parts = snippetPartsFor(pane);

  if (parts.problem) {
    win.Statamic?.$toast?.error(t(win, CSS_PROBLEM_KEY[parts.problem] || 'snippet_empty'));

    return;
  }

  if (!parts.html.trim() && !parts.css.trim() && !parts.js.trim()) {
    win.Statamic?.$toast?.error(t(win, 'snippet_empty'));

    return;
  }

  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading: t(win, 'snippet_new'),
    nameLabel: t(win, 'snippet_name'),
    placeholder: t(win, 'snippet_name_placeholder'),
    value: parts.name,
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'snippet_create'),
    onOk: (name) => {
      overlay.dismiss();
      void store(win, name, parts);
    },
  });
}

// --- Menu ------------------------------------------------------------------

/**
 * The same box as Insert data, so only one of them is open at a time. The
 * list is read fresh each time: a snippet saved a moment ago has to be here.
 */
function openSnippetsMenu(win, anchor, pane) {
  const doc = win.document;

  closeDataMenu(doc);
  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = DATA_MENU_ID;
  menu.setAttribute('data-sve-data-menu', '');
  doc.body.appendChild(menu);

  const hasSelection = !!selectedText(pane === 'css' ? editors.css : editors.html).trim();

  const paint = (rows, loading) => {
    if (!doc.getElementById(DATA_MENU_ID)) {
      return;
    }

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockSnippets, menu, {
      title: t(win, 'code_dock_snippets'),
      placeholder: t(win, 'code_dock_snippets_search'),
      emptyText: t(win, 'snippet_none'),
      loadingText: t(win, 'code_dock_loading'),
      loading,
      rows,
      saveLabel: t(win, hasSelection ? 'snippet_save_selection' : 'snippet_save'),
      onPick: (row) => {
        closeDataMenu(doc);
        void insertSnippet(win, row.name);
      },
      onSave: () => {
        closeDataMenu(doc);
        saveSnippet(win, pane);
      },
    });
    placeDataMenu(win, anchor, menu);
  };

  paint([], true);
  hookDataMenu(win, anchor, menu);

  fetchList(win)
    .then((items) => paint(rowsFor(items, pane), false))
    .catch(() => paint([], false));
}

/**
 * One face of the button: its mark and its word. The word is on the button,
 * not in a tooltip — an icon alone at the end of the row was taken for one
 * more writing tool, and this is not one.
 */
function face(doc, icon, text, mode) {
  const span = doc.createElement('span');

  span.setAttribute('data-sve-snippet-face', mode);
  span.innerHTML = icon;
  span.appendChild(doc.createTextNode(text));

  return span;
}

function bindPane(win, dock, selector, pane) {
  const host = dock.querySelector(selector);

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const doc = win.document;
  const btn = pickerButton(win, host, 'data-sve-snippet-btn', '', t(win, 'code_dock_snippets'));

  btn.setAttribute('data-sve-snippet-pane', pane);
  // The word is visible, so it is the name; a tooltip would say it twice.
  btn.removeAttribute('title');
  btn.removeAttribute('aria-label');
  btn.replaceChildren(face(doc, SNIPPET_ICON, t(win, 'snippet_button'), pane === 'css' ? 'css' : 'html'));

  if (pane === 'css') {
    btn.appendChild(face(doc, UTILITY_ICON, t(win, 'tw_utility_button'), 'tw'));
  }

  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (pane === 'css' && dockState.styleMode === 'tw') {
      closeDataMenu(doc);
      saveTwUtility(win);

      return;
    }

    if (btn.hasAttribute('data-open')) {
      closeDataMenu(doc);

      return;
    }

    openSnippetsMenu(win, btn, pane);
  });
}

/** One button in the HTML pane's label row, one in the CSS pane's. */
export function bindSnippets(win, dock) {
  bindPane(win, dock, '[data-sve-snippet-tools]', 'html');
  bindPane(win, dock, '[data-sve-css-snippet-tools]', 'css');
}
