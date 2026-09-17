/**
 * code-dock.js — region "data-vars", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { mountPane } from '../cp/mount-pane.js';
import CodeDockAntlersSelect from '../cp/surfaces/CodeDockAntlersSelect.vue';
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
  doc?.querySelector('[data-sve-data-vars][data-open]')?.removeAttribute('data-open');
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
function insertDataVar(row, group) {
  const spec = dataVarSnippet(row, group);
  const view = editors.html;

  if (!spec || !view || view.state.readOnly) {
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

  mountPane(host, CodeDockAntlersSelect, {
    label: t(win, 'code_dock_antlers'),
    groups: ANTLERS_SNIPPET_GROUPS.map((group) => ({
      id: group.id,
      label: t(win, group.lang),
      items: ANTLERS_SNIPPETS.filter((item) => item.group === group.id).map((item) => ({
        id: item.id,
        label: item.label,
      })),
    })),
    onPick: (id) => insertAntlersSnippet(id),
  });
}

function insertAntlersSnippet(id) {
  const spec = antlersSnippet(id);
  const view = editors.html;

  if (!spec || !view || view.state.readOnly) {
    return;
  }

  const pos = view.state.selection.main.head;
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

  mountPane(host, CodeDockAntlersSelect, {
    label: t(win, 'code_dock_visual_edit'),
    groups: VISUAL_EDIT_SNIPPET_GROUPS.map((group) => ({
      id: group.id,
      label: t(win, group.lang),
      items: VISUAL_EDIT_SNIPPETS.filter((item) => item.group === group.id).map((item) => ({
        id: item.id,
        label: item.label,
      })),
    })),
    onPick: (id) => insertVisualEditSnippet(id),
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
