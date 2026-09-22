/**
 * code-dock.js — region "data-vars", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import CodeDockDataVars from '../cp/surfaces/CodeDockDataVars.vue';
import { cachedDataVars, dataVarSnippet, dataVarsCollection, dataVarsKey, dataVarsScope, dataVarsSet, fetchDataVars, groupsWithValues, withValues } from '../data-vars.js';
import { loopScopeAt } from '../antlers-blocks.js';
import { mountSurface } from '../cp/mount.js';
import { ANTLERS_SNIPPET_GROUPS, ANTLERS_SNIPPETS, antlersSnippet, expandAntlersSnippet, indentAntlersSnippet } from '../antlers-snippets.js';
import { VISUAL_EDIT_SNIPPET_GROUPS, VISUAL_EDIT_SNIPPETS, VISUAL_EDIT_TAG, findVisualEditInRange, hasAttr, visualEditSnippet } from '../visual-edit-snippets.js';
import { t } from '../lib/i18n.js';
import { unwrapRef } from '../lib/values.js';
import { activeContainers } from '../lib/publish-containers.js';
import { dockState } from '../dock/state.js';
import { collectionViewType, currentTemplateType } from './dock-api.js';
import { editors, html } from '../code-dock.js';
import { currentFullHtml, currentSectionValues } from './scope.js';
import { closeCssMenu, indentFromPrevious, lineIndentOf } from './css-tools.js';
import { finishHtmlEdit, htmlElementAtCursor, insertHtmlSnippet } from './html-tools.js';

// ===== data-vars =====
// --- Data ------------------------------------------------------------------
//
// A button beside the Antlers and Visual edit pickers that answers "what can I
// write here?" — the section's own fields, the page's, and the site's globals,
// searchable, with the values they hold right now beside them. Picking one
// writes the tag at the cursor.

export const DATA_MENU_ID = '__sve-data-menu';

let dataMenuUnhook = null;

export function closeDataMenu(doc) {
  const menu = doc?.getElementById(DATA_MENU_ID);

  dataMenuUnhook?.();
  dataMenuUnhook = null;
  menu?._sveApp?.unmount();
  menu?.remove();
  doc?.querySelectorAll('[data-sve-data-vars][data-open], [data-sve-antlers-btn][data-open], [data-sve-visual-edit-btn][data-open]').forEach((el) => el.removeAttribute('data-open'));
}

/**
 * The collection a collection-view template renders, from the template entry's
 * own `source_collection` — the reason to open one is the entries in it.
 */
function dataVarsView(win) {
  if (!collectionViewType(win)) {
    return { view: '', kind: '' };
  }

  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;
    const view = typeof values?.source_collection === 'string' ? values.source_collection.trim() : '';

    if (view) {
      return { view, kind: String(values?.kind || '').trim() };
    }
  }

  return { view: '', kind: '' };
}

/**
 * The loops the picker is being opened inside.
 *
 * Two callers, one answer. The HTML pane asks from the cursor; the tree asks
 * from the row that was clicked, and hands its offset in. Both are offsets into
 * the whole template, so the scoped pane's slice is added back before reading.
 */
function dataVarsScopeAt(win, at) {
  const html = currentFullHtml();

  if (Number.isFinite(at)) {
    return loopScopeAt(html, at);
  }

  const view = editors.html;

  if (!view) {
    return [];
  }

  const offset = dockState.htmlScopeActive && dockState.htmlFocus ? dockState.htmlFocus.from : 0;

  return loopScopeAt(html, offset + view.state.selection.main.from);
}

function dataVarsQuery(win, at) {
  const { view, kind } = dataVarsView(win);

  return {
    collection: dataVarsCollection(win) || '',
    set: dataVarsSet(currentTemplateType()),
    view,
    kind,
    scope: dataVarsScope(dataVarsScopeAt(win, at)),
  };
}

/** The page's own values — the whole entry, not the section inside it. */
function currentPageValues(win) {
  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;

    if (values && typeof values === 'object') {
      return values;
    }
  }

  return null;
}

/** The catalogue with this moment's values folded in. */
function dataVarsModel(win, raw) {
  return {
    // A loop's rows hold one value each and no single one of them is *the*
    // value, so the scope tab shows names alone — same rule as a nested field.
    scope: raw?.scope?.groups || [],
    section: withValues(raw?.section || [], currentSectionValues(win)),
    page: groupsWithValues(raw?.page || [], currentPageValues(win)),
    site: raw?.site || [],
  };
}

/**
 * Straight in at the cursor, unlike the Antlers snippets, which open a block and
 * earn their own line. `{{ headline }}` belongs inside the tag you are already
 * standing in, so breaking the line would be wrong.
 */
/**
 * Whether the caret stands inside the value of a dynamic attribute — a
 * component's `:image="|"`, an `x-bind:` — where Antlers is already the
 * language and `{{ }}` would only wrap a name in the wrong thing.
 */
export function inDynamicAttribute(view) {
  const range = view.state.selection.main;
  const line = view.state.doc.lineAt(range.from);
  const before = line.text.slice(0, range.from - line.from);

  return /(?:^|\s)(?::|x-bind:)[\w.:-]+\s*=\s*(["'])(?:(?!\1).)*$/.test(before);
}

function insertDataVar(row, group) {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  // In `:image="|"` the name goes in bare — the attribute is already an expression.
  if (inDynamicAttribute(view)) {
    const name = String(row?.var || '').trim();
    const range = view.state.selection.main;

    view.dispatch({
      changes: { from: range.from, to: range.to, insert: name },
      selection: { anchor: range.from + name.length },
    });
    finishHtmlEdit();

    return;
  }

  const spec = dataVarSnippet(row, group);

  if (!spec) {
    return;
  }

  const range = view.state.selection.main;
  const line = view.state.doc.lineAt(range.from);
  const indent = lineIndentOf(line.text);
  const text = indentAntlersSnippet(spec.text, indent);

  view.dispatch({
    changes: { from: range.from, to: range.to, insert: text },
    selection: { anchor: range.from + spec.cursor + (spec.text.includes('\n') ? indent.length : 0) },
  });
  finishHtmlEdit();
}

/**
 * Under the button, or above it when the dock is parked at the foot of the
 * screen — which is where it usually is, so below is the exception, not the
 * rule. Measured, because the menu is wider than the CSS pickers and its
 * height depends on how many fields the section turned out to have.
 */
function placeDataMenu(win, anchor, menu) {
  const rect = anchor.getBoundingClientRect();
  const pad = 8;
  const width = menu.offsetWidth || 368;
  const height = menu.offsetHeight || 240;
  const below = win.innerHeight - rect.bottom - pad;
  const above = rect.top - pad;
  const top = below >= height || below >= above ? rect.bottom + 4 : rect.top - height - 4;

  menu.style.left = `${Math.max(pad, Math.min(rect.left, win.innerWidth - width - pad))}px`;
  menu.style.top = `${Math.max(pad, Math.min(top, win.innerHeight - height - pad))}px`;
}

/**
 * The field picker. `onPick` lets somewhere other than the HTML pane use it —
 * the tree's condition and loop fields want the bare handle, not a tag.
 */
export function openDataVarsMenu(win, anchor, onPick, at) {
  const doc = win.document;

  closeDataMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = DATA_MENU_ID;
  menu.setAttribute('data-sve-data-menu', '');
  doc.body.appendChild(menu);

  const query = dataVarsQuery(win, at);

  /*
   * Inside a loop, the loop goes first and opens selected: standing in
   * `{{ collection:services }}`, a service's own fields are what you came for,
   * and the section's are the ones that would not render. They keep their tab —
   * Antlers still reaches them from in there — just not the first one.
   */
  const tabsFor = (raw) =>
    [
      raw?.scope?.groups?.length
        ? { id: 'scope', label: raw.scope.label || t(win, 'data_vars_tab_loop') }
        : null,
      { id: 'section', label: t(win, 'data_vars_tab_section') },
      { id: 'page', label: t(win, 'data_vars_tab_page') },
      { id: 'site', label: t(win, 'data_vars_tab_site') },
    ].filter(Boolean);

  const paint = (raw) => {
    if (!doc.getElementById(DATA_MENU_ID)) {
      return;
    }

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockDataVars, menu, {
      title: t(win, 'data_vars_title'),
      placeholder: t(win, 'data_vars_placeholder'),
      emptyText: t(win, 'data_vars_empty'),
      noSectionText: t(win, 'data_vars_no_section'),
      loopText: t(win, 'data_vars_loop'),
      tabs: tabsFor(raw),
      data: dataVarsModel(win, raw),
      // Left open on purpose: picking a headline and then its text should not
      // mean reopening the menu. Escape or a click outside closes it.
      onPick: (row, group) => (onPick ? onPick(row, group) : insertDataVar(row, group)),
    });

    // The list just changed height; where it opened has to follow.
    placeDataMenu(win, anchor, menu);
  };

  paint(cachedDataVars(dataVarsKey(query)) || { scope: null, section: [], page: [], site: [] });
  void fetchDataVars(win, query).then(paint);

  placeDataMenu(win, anchor, menu);

  const reposition = () => placeDataMenu(win, anchor, menu);
  const onDown = (event) => {
    if (!menu.contains(event.target) && !anchor.contains(event.target)) {
      closeDataMenu(doc);
    }
  };
  const onKey = (event) => {
    if (event.key === 'Escape') {
      closeDataMenu(doc);
    }
  };

  doc.addEventListener('pointerdown', onDown, true);
  doc.addEventListener('keydown', onKey, true);
  win.addEventListener('scroll', reposition, true);
  win.addEventListener('resize', reposition);

  dataMenuUnhook = () => {
    doc.removeEventListener('pointerdown', onDown, true);
    doc.removeEventListener('keydown', onKey, true);
    win.removeEventListener('scroll', reposition, true);
    win.removeEventListener('resize', reposition);
  };
}

/**
 * The same popup as Insert data, with a list of the caller's own: search
 * field, tabs, rows. `data` maps a tab id to its rows (`{ var, value?, id }`),
 * and a row picked is handed back whole. One popup at a time — opening this
 * closes the Data one and the other way round, since they share the element.
 */
export function openPickerMenu(win, anchor, { title, placeholder, tabs, data, onPick }) {
  const doc = win.document;

  closeDataMenu(doc);
  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = DATA_MENU_ID;
  menu.setAttribute('data-sve-data-menu', '');
  doc.body.appendChild(menu);
  menu._sveApp = mountSurface(CodeDockDataVars, menu, {
    title,
    placeholder,
    emptyText: t(win, 'data_vars_empty'),
    noSectionText: t(win, 'data_vars_empty'),
    loopText: '',
    tabs,
    data,
    onPick: (row, group) => {
      closeDataMenu(doc);
      onPick(row, group);
    },
  });
  placeDataMenu(win, anchor, menu);
  hookDataMenu(win, anchor, menu);
}

/** Closes on Escape and on a click outside; follows the anchor on scroll and resize. */
function hookDataMenu(win, anchor, menu) {
  const doc = win.document;
  const reposition = () => placeDataMenu(win, anchor, menu);
  const onDown = (event) => {
    if (!menu.contains(event.target) && !anchor.contains(event.target)) {
      closeDataMenu(doc);
    }
  };
  const onKey = (event) => {
    if (event.key === 'Escape') {
      closeDataMenu(doc);
    }
  };

  doc.addEventListener('pointerdown', onDown, true);
  doc.addEventListener('keydown', onKey, true);
  win.addEventListener('scroll', reposition, true);
  win.addEventListener('resize', reposition);

  dataMenuUnhook = () => {
    doc.removeEventListener('pointerdown', onDown, true);
    doc.removeEventListener('keydown', onKey, true);
    win.removeEventListener('scroll', reposition, true);
    win.removeEventListener('resize', reposition);
  };
}

/** The Antlers mark: the pair of antlers, at the row's icon height. */
const ANTLERS_ICON =
  '<svg width="21" height="11" viewBox="0 0 150 77" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M69.999 55.827a13.8 13.8 0 0 0-.812-3.799 15.4 15.4 0 0 0-1.687-3.55 18.16 18.16 0 0 0-5.686-5.418 37.7 37.7 0 0 0 3.936-6.228 18.6 18.6 0 0 0 1.812-6.228 9.88 9.88 0 0 0-1.248-5.57 9.9 9.9 0 0 0-4.125-3.959 10.46 10.46 0 0 0-10.684 1.183 13.8 13.8 0 0 0-4.061 5.107 39 39 0 0 0-1.812 4.92 49.5 49.5 0 0 1-5.436-6.227 16.9 16.9 0 0 1-2.562-5.606 28.7 28.7 0 0 1-.624-6.85c.003-2-.357-3.983-1.063-5.855a10.66 10.66 0 0 0-4.56-5.231 13.9 13.9 0 0 0-10.684-1.37 10.13 10.13 0 0 0-4.94 2.755 10.1 10.1 0 0 0-2.683 4.967 24.4 24.4 0 0 0 0 10.214 22.4 22.4 0 0 0 3.374 7.35h-1.062a23 23 0 0 1-4.124 0 19.2 19.2 0 0 0-6.248 0 6.74 6.74 0 0 0-3.374 2.74 9.45 9.45 0 0 0-.75 9.341 11.23 11.23 0 0 0 5.811 6.228 25.1 25.1 0 0 0 10.622 1.495 17.9 17.9 0 0 0 9.809-3.425 104 104 0 0 1 10.496 7.162 22.4 22.4 0 0 1 5.249 6.54 15.5 15.5 0 0 1 1.437 5.106 35 35 0 0 0 1.437 6.789 13.2 13.2 0 0 0 4.373 5.73 15.6 15.6 0 0 0 10.372 2.802 9.9 9.9 0 0 0 5.429-1.987 9.84 9.84 0 0 0 3.38-4.677A61.6 61.6 0 0 0 70 55.827m-5.061 12.456a5.05 5.05 0 0 1-1.971 2.157 5.07 5.07 0 0 1-2.84.708 9.45 9.45 0 0 1-6.248-2.367 6.6 6.6 0 0 1-2.124-2.989 50 50 0 0 1-1.625-6.788 18.7 18.7 0 0 0-2.249-5.73 28.7 28.7 0 0 0-7.435-7.35A129 129 0 0 0 27.95 38.95c-.812-.498-2.686 0-2.749 0a14.03 14.03 0 0 1-7.872 1.62 19.5 19.5 0 0 1-7.935-2.056 4.86 4.86 0 0 1-2.375-2.49 3.35 3.35 0 0 1 0-2.99 1.18 1.18 0 0 1 .875-.748c1.25 0 2.687 0 3.936-.435a33 33 0 0 0 4.749-1.122 17.6 17.6 0 0 0 4.498-2.18 1.68 1.68 0 0 0 .838-1.68 1.7 1.7 0 0 0-.213-.624 2.2 2.2 0 0 0-.937-.747 18.65 18.65 0 0 1-2.812-7.35 19.5 19.5 0 0 1 .938-7.97 4.55 4.55 0 0 1 1.326-1.834 4.57 4.57 0 0 1 2.048-.97 7.52 7.52 0 0 1 5.498.997 5.12 5.12 0 0 1 2.499 3.488 87 87 0 0 0 1.874 10.587 22.4 22.4 0 0 0 4.436 6.789 78 78 0 0 0 8.372 7.286 1.8 1.8 0 0 0 1.188 1.246 2.005 2.005 0 0 0 2.499-1.308 33.4 33.4 0 0 1 3.249-6.54 8.8 8.8 0 0 1 2.811-2.677 4.63 4.63 0 0 1 4.561 0 4 4 0 0 1 1.612 1.494c.387.638.586 1.372.575 2.118a14.7 14.7 0 0 1-.75 5.792 36.6 36.6 0 0 1-2.561 6.228v.311a2.05 2.05 0 0 0 .5 2.74 13.6 13.6 0 0 1 3.248 4.92c.375.873.563 1.745.875 2.617s.937 2.678 1.312 4.048c1.625 5.916 2.5 7.536.875 10.961zM148.848 29.42a6.6 6.6 0 0 0-3.062-2.74 16.7 16.7 0 0 0-6.248 0c-1.227.09-2.459.09-3.686 0h-.937a24.2 24.2 0 0 0 3.186-7.536c.659-3.31.659-6.716 0-10.027a9.95 9.95 0 0 0-2.072-5.336 10 10 0 0 0-4.676-3.32 12.53 12.53 0 0 0-10.184 1.556 10.78 10.78 0 0 0-4.498 5.668 16.8 16.8 0 0 0-.875 5.667 32.7 32.7 0 0 1 0 6.602 17.2 17.2 0 0 1-2.499 5.543 52 52 0 0 1-4.748 5.792 32 32 0 0 0-1.5-4.547 14.4 14.4 0 0 0-3.811-5.231 9.522 9.522 0 0 0-10.56-.996 10.16 10.16 0 0 0-3.64 4.024 10.1 10.1 0 0 0-1.045 5.317c.21 2.156.78 4.26 1.687 6.228a38.3 38.3 0 0 0 3.748 6.228 17.5 17.5 0 0 0-5.435 5.668 15 15 0 0 0-1.562 3.55 18.3 18.3 0 0 0-.75 3.674v10.09c.068 1.417.32 2.82.75 4.172a9.46 9.46 0 0 0 3.062 4.609 9.5 9.5 0 0 0 5.123 2.118 14.1 14.1 0 0 0 9.871-2.927 12.76 12.76 0 0 0 4.124-5.792 34 34 0 0 0 1.562-6.727 17.6 17.6 0 0 1 1.375-5.107 21.1 21.1 0 0 1 4.623-6.228 83 83 0 0 1 8.935-7.349 16.34 16.34 0 0 0 8.997 3.301 22.24 22.24 0 0 0 9.746-1.557 10.777 10.777 0 0 0 5.499-6.228 9.88 9.88 0 0 0-.5-8.158m-5.623 6.229a4.43 4.43 0 0 1-2.062 2.553 16.16 16.16 0 0 1-7.06 2.18 11.7 11.7 0 0 1-7.123-1.869s-1.999-.81-2.812 0a123 123 0 0 0-11.558 7.038 26.9 26.9 0 0 0-6.811 7.224 79 79 0 0 0-3.623 12.456 6.23 6.23 0 0 1-2 3.052 7.88 7.88 0 0 1-5.373 2.305 4.63 4.63 0 0 1-2.523-.809 4.6 4.6 0 0 1-1.663-2.056 9.8 9.8 0 0 1-.812-3.488c.25-2.711.881-5.373 1.874-7.91.375-1.37.75-2.678 1.187-4.048s.438-1.806.812-2.616a13.26 13.26 0 0 1 2.937-5.044 2.054 2.054 0 0 0 .375-2.74 44 44 0 0 1-2.25-6.228 17.3 17.3 0 0 1-.687-5.792 4.22 4.22 0 0 1 1.937-3.675 3.57 3.57 0 0 1 3.811 0 8.3 8.3 0 0 1 2.625 2.678 40.5 40.5 0 0 1 3.061 6.228 1.93 1.93 0 0 0 1.664 1.441c.26.029.522.005.773-.07a1.82 1.82 0 0 0 1.187-1.309 80 80 0 0 0 7.872-7.411 22.5 22.5 0 0 0 3.999-6.664 75.4 75.4 0 0 0 1.749-10.525 5.17 5.17 0 0 1 1.937-3.176 5.76 5.76 0 0 1 4.749-.935 4.11 4.11 0 0 1 3.186 2.927c.751 2.609.985 5.338.687 8.035a19 19 0 0 1-2.561 7.473s-.625 0-.75.56a1.68 1.68 0 0 0 .5 2.367c1.27.908 2.657 1.641 4.123 2.18 1.468.49 2.972.865 4.499 1.121 1.125 0 2.374 0 3.561.436s.438.311.625.623c.235.52.351 1.087.341 1.657a3.9 3.9 0 0 1-.403 1.644z"/></svg>';
const VISUAL_EDIT_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>';

/** An icon button like the Data one, in the pane's label row. */
function pickerButton(win, host, attr, icon, title) {
  const btn = win.document.createElement('button');

  btn.type = 'button';
  btn.setAttribute(attr, '');
  btn.title = title;
  btn.setAttribute('aria-label', title);
  btn.innerHTML = `<span>${icon}</span>`;
  btn.addEventListener('mousedown', (event) => event.preventDefault());
  host.replaceChildren(btn);

  return btn;
}

/** The first line of a snippet, as the row's hint — `|` (the caret) taken out. */
function snippetHint(snippet) {
  return String(snippet || '').replace(/\|/g, '').split('\n')[0].trim();
}

export function bindDataVars(win, dock) {
  const btn = dock.querySelector('[data-sve-data-vars]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('mousedown', (event) => event.preventDefault());
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (win.document.getElementById(DATA_MENU_ID)) {
      closeDataMenu(win.document);

      return;
    }

    closeCssMenu(win.document);
    openDataVarsMenu(win, btn);
  });
}

export function bindAntlersSnippets(win, dock) {
  const host = dock.querySelector('[data-sve-antlers-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const btn = pickerButton(win, host, 'data-sve-antlers-btn', ANTLERS_ICON, t(win, 'code_dock_antlers'));

  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (btn.hasAttribute('data-open')) {
      closeDataMenu(win.document);

      return;
    }

    const data = {};

    for (const group of ANTLERS_SNIPPET_GROUPS) {
      data[group.id] = ANTLERS_SNIPPETS.filter((item) => item.group === group.id).map((item) => ({
        id: item.id,
        var: item.label,
        value: item.inline ? '' : snippetHint(item.snippet),
      }));
    }

    openPickerMenu(win, btn, {
      title: t(win, 'code_dock_antlers'),
      placeholder: t(win, 'code_dock_antlers_search'),
      tabs: ANTLERS_SNIPPET_GROUPS.map((group) => ({ id: group.id, label: t(win, group.lang) })),
      data,
      onPick: (row) => insertAntlersSnippet(row.id),
    });
  });
}

function insertAntlersSnippet(id) {
  const spec = antlersSnippet(id);
  const view = editors.html;

  if (!spec || !view || view.state.readOnly) {
    return;
  }

  const pos = view.state.selection.main.head;

  // A modifier belongs inside the tag the caret is in: straight in, no new
  // line — and its pipe is a pipe, not the caret mark the block snippets use.
  if (spec.inline) {
    const text = spec.snippet;
    const range = view.state.selection.main;

    view.dispatch({
      changes: { from: range.from, to: range.to, insert: text },
      selection: { anchor: range.from + text.length },
    });
    finishHtmlEdit();

    return;
  }

  const line = view.state.doc.lineAt(pos);
  const indent = line.text.trim()
    ? lineIndentOf(line.text)
    : indentFromPrevious(view, line) || lineIndentOf(line.text);
  const { text, cursor } = expandAntlersSnippet(spec.snippet);

  insertHtmlSnippet(indentAntlersSnippet(text, indent), cursor);
  finishHtmlEdit();
}

export function bindVisualEditSnippets(win, dock) {
  const host = dock.querySelector('[data-sve-visual-edit-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const btn = pickerButton(win, host, 'data-sve-visual-edit-btn', VISUAL_EDIT_ICON, t(win, 'code_dock_visual_edit'));

  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (btn.hasAttribute('data-open')) {
      closeDataMenu(win.document);

      return;
    }

    const data = {};

    for (const group of VISUAL_EDIT_SNIPPET_GROUPS) {
      data[group.id] = VISUAL_EDIT_SNIPPETS.filter((item) => item.group === group.id).map((item) => ({
        id: item.id,
        var: item.label,
        value: item.attr ? item.attr.replace(/\|/g, '') : '',
      }));
    }

    openPickerMenu(win, btn, {
      title: t(win, 'code_dock_visual_edit'),
      placeholder: t(win, 'code_dock_visual_edit_search'),
      tabs: VISUAL_EDIT_SNIPPET_GROUPS.map((group) => ({ id: group.id, label: t(win, group.lang) })),
      data,
      onPick: (row) => insertVisualEditSnippet(row.id),
    });
  });
}

/**
 * Merges `spec.attr` into an already-found {{ visual_edit ... }} tag, right
 * before its closing `}}`, instead of opening a new pair of braces — the
 * whole point being that picking `inline_edit` after `visual_edit` doesn't
 * repeat `{{ }}`. A no-op (just refocuses) when the attribute is already
 * there.
 */
function mergeVisualEditAttr(view, doc, tag, spec) {
  if (hasAttr(tag.inner, spec.attr)) {
    view.focus();

    return;
  }

  const { text: attrText, cursor: attrCursor } = expandAntlersSnippet(spec.attr);
  let trimEnd = tag.closeIdx;

  while (trimEnd > tag.openIdx + 2 && /\s/.test(doc[trimEnd - 1])) {
    trimEnd--;
  }

  view.dispatch({
    changes: { from: trimEnd, to: tag.closeIdx, insert: ` ${attrText} ` },
    selection: { anchor: trimEnd + 1 + attrCursor },
  });
  finishHtmlEdit();
}

/**
 * Picking an item from the "Visual edit" dropdown annotates the HTML element
 * the cursor/selection is on or inside — the same element htmlElementAtCursor()
 * finds for the other HTML toolbar buttons (bold, heading, …) — not wherever
 * the raw text cursor happens to sit. Clicking inside a <div>'s attributes or
 * its content, or with a <h1>'s text selected, targets that div or h1.
 *
 * If that element already has a {{ visual_edit }} tag, the attribute is
 * merged into it (see mergeVisualEditAttr); otherwise a fresh
 * {{ visual_edit <attr> }} is opened right after the tag name, inside its
 * opening tag — `<h1 {{ visual_edit … }} class="...">`, matching how it's
 * written by hand. Only when the cursor sits outside any HTML element at all
 * does this fall back to inserting loose text at the cursor.
 */
function insertVisualEditSnippet(id) {
  const spec = visualEditSnippet(id);
  const view = editors.html;

  if (!spec || !view || view.state.readOnly) {
    return;
  }

  const doc = view.state.doc.toString();
  const el = htmlElementAtCursor();

  if (el?.open) {
    const existing = findVisualEditInRange(doc, el.open.from, el.open.to, VISUAL_EDIT_TAG);

    if (existing) {
      if (spec.attr) {
        mergeVisualEditAttr(view, doc, existing, spec);
      } else {
        view.dispatch({ selection: { anchor: existing.openIdx + 2 + VISUAL_EDIT_TAG.length } });
        view.focus();
      }

      return;
    }

    const insertAt = el.open.from + 1 + el.name.length;
    const raw = spec.standalone || `{{ ${VISUAL_EDIT_TAG} ${spec.attr} }}`;
    const { text, cursor } = expandAntlersSnippet(raw);

    view.dispatch({
      changes: { from: insertAt, to: insertAt, insert: ` ${text}` },
      selection: { anchor: insertAt + 1 + cursor },
    });
    finishHtmlEdit();

    return;
  }

  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const indent = line.text.trim()
    ? lineIndentOf(line.text)
    : indentFromPrevious(view, line) || lineIndentOf(line.text);
  const raw = spec.standalone || `{{ ${VISUAL_EDIT_TAG} ${spec.attr} }}`;
  const { text, cursor } = expandAntlersSnippet(raw);

  insertHtmlSnippet(indentAntlersSnippet(text, indent), cursor);
  finishHtmlEdit();
}
