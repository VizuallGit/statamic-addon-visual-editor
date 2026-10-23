/**
 * Snippets — the dock's library of reusable HTML / CSS / JS.
 *
 * A snippet is one file under the site's `resources/snippets`, in the shape
 * the dock reads (markup, then style_push, then script_push; Snippet.php).
 * Picking one writes its text into the open template: the markup at the
 * caret, the CSS and JS onto their panes. From then on it is the template's
 * own text. A snippet is copied, never referenced — which is what tells it
 * apart from a component (a partial tag every page shares) and from a utility
 * class (one rule in site.css).
 *
 * Saving goes the other way. The selection in the pane — or the whole pane
 * when nothing is selected — becomes a new file, named in the same prompt a
 * component is named in. From the HTML pane the CSS rules that describe the
 * selected markup travel with it (component-css decides which, the same way
 * it does for a component); the whole pane takes the whole CSS and the JS
 * pane with it. From the CSS pane, the CSS alone.
 *
 * Its own surface: this module, CodeDockSnippets.vue, and PHP that only reads
 * and writes the folder. Nothing here reaches preview, overlay or bridge.
 */
import CodeDockSnippets from '../cp/surfaces/CodeDockSnippets.vue';
import NamePrompt from '../cp/surfaces/NamePrompt.vue';
import { openCpOverlay } from '../cp/open-overlay.js';
import { mountSurface } from '../cp/mount.js';
import { ask } from '../cp/bus.js';
import { csrfToken } from '../lib/csrf.js';
import { t } from '../lib/i18n.js';
import { dedent } from '../component-extract.js';
import { splitCssForBlock } from '../component-css.js';
import { indentAntlersSnippet } from '../antlers-snippets.js';
import { editors } from '../code-dock.js';
import { DATA_MENU_ID, closeDataMenu, hookDataMenu, pickerButton, placeDataMenu } from './data-vars.js';
import { closeCssMenu, indentFromPrevious, lineIndentOf } from './css-tools.js';
import { finishHtmlEdit, insertHtmlElement } from './html-tools.js';
import { insertAiSnippet } from './dock-api.js';

const LIST_API = '/!/sve/snippets';
const ONE_API = '/!/sve/snippet';

/** Two sheets, one laid over the other: text copied in, not pointed at. */
const SNIPPET_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

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

/** @returns {Promise<Array<{ name: string, hint: string, html: boolean, css: boolean, js: boolean }>>} */
async function fetchList(win) {
  const data = await fetchJson(win, LIST_API);

  return Array.isArray(data?.items) ? data.items : [];
}

/** @returns {Promise<{ name: string, html: string, css: string, js: string }>} */
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
 * The HTML pane offers every snippet — a CSS-only one still has somewhere to
 * go, the CSS pane. The CSS pane offers only what it can write.
 */
function rowsFor(items, pane) {
  return pane === 'css' ? items.filter((item) => item.css) : items;
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

async function insertSnippet(win, name, pane) {
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

  if (pane === 'css') {
    insertAiSnippet(win, { css });

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
 * What the pane is offering to save.
 *
 * @returns {{ html: string, css: string, js: string, name: string }}
 */
function snippetPartsFor(pane) {
  if (pane === 'css') {
    const selected = selectedText(editors.css);
    const css = selected.trim() ? selected : String(ask('dock:css') || '');

    return { html: '', css: dedent(css), js: '', name: '' };
  }

  const selected = selectedText(editors.html);
  const full = String(ask('dock:html') || '');
  const css = String(ask('dock:css') || '');

  // A selection takes the rules that describe it. Whether a rule also serves
  // the rest of the file does not matter here: it is copied, not moved.
  if (selected.trim()) {
    const rest = full.includes(selected) ? full.replace(selected, '') : full;

    return {
      html: dedent(selected),
      css: splitCssForBlock(css, selected, rest).move.trim(),
      js: '',
      name: suggestedName(selected),
    };
  }

  // The whole file: its markup, all of its CSS, and its JS pane.
  return { html: dedent(full), css: css.trim(), js: String(ask('dock:js') || '').trim(), name: suggestedName(full) };
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
    const made = await postSnippet(win, { name, html: parts.html, css: parts.css, js: parts.js, replace });

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

function saveSnippet(win, pane) {
  const parts = snippetPartsFor(pane);

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
        void insertSnippet(win, row.name, pane);
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

function bindPane(win, dock, selector, pane) {
  const host = dock.querySelector(selector);

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const btn = pickerButton(win, host, 'data-sve-snippet-btn', SNIPPET_ICON, t(win, 'code_dock_snippets'));

  btn.setAttribute('data-sve-snippet-pane', pane);
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (btn.hasAttribute('data-open')) {
      closeDataMenu(win.document);

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
