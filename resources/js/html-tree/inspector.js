/**
 * html-tree.js — the inspector and the component's values.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { ask } from '../cp/bus.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import {
  componentPropsOn,
  fetchComponentProps,
  propHandle,
  readCallParams,
  valueRows,
  writePropParam,
} from '../component-props.js';
import { syncComponentPropsHost } from '../component-props-host.js';
import { componentPropsUi } from '../cp/component-props/store.js';
import { propValuesReady } from '../prop-values.js';
import { fieldTypesFor, wholeTag } from '../data-var-types.js';
import { addAntlersBranch, writeAntlersExpression } from '../antlers-edit.js';
import { loopInspectModel, loopKindEdit, loopSourceEdit } from '../loop-inspector.js';
import { htmlTreeState } from './state.js';
import { callValues, renderHtmlTree } from './render.js';
import { dockHtml, writeDockHtml } from './prefetch.js';

/**
 * The inspector's model for the selected row.
 *
 * Only conditions and loops have anything to offer: a condition is an
 * expression, a loop is the field it walks. Everything else — tags, components
 * — is edited where it already can be, so there is nothing rather than a
 * second place to do the same thing. A loop's or a condition's model is drawn
 * in a popup (logic-popup.js) and in Build's Settings tab; what is left under
 * the tree is a component's values when the Control Panel cannot lend its
 * fields.
 */
export function paintHtmlTreeInspector(win, row) {
  if (row?.kind === 'component') {
    paintComponentValues(win, row);

    return;
  }

  // Anything else, and the column goes back to the section it belongs to.
  if (componentPropsUi.callOpen) {
    componentPropsUi.callOpen = false;
    componentPropsUi.callStore = null;
    callValues.forget();
    syncComponentPropsHost(win);
  }

  if (row?.kind !== 'antlers') {
    htmlTreeUi.inspect = null;

    return;
  }

  // Keyed by the row alone, not by what is typed in it. Every commit repaints
  // the tree, and a key that moved with the value would rebuild the input
  // mid-edit — losing the caret, and with it picking a second field.
  const key = row.id;
  // Loops and conditions are drawn in a popup (logic-popup.js) and in Build's
  // Settings tab, not under the tree; `path` is the row a popup waits for.
  const logic = { logic: true, path: row.path };

  // `{{ else }}` is the branch with nothing to say about itself.
  if (row.tag === 'else') {
    htmlTreeUi.inspect = {
      key,
      ...logic,
      title: t(win, 'antlers_condition'),
      mode: 'note',
      note: t(win, 'antlers_else_note'),
    };

    return;
  }

  // A loop's panel is the shared one (loop-inspector.js): the dock's help popup
  // shows the same model and writes with the same edits.
  if (row.antlers === 'loop') {
    htmlTreeUi.inspect = {
      ...loopInspectModel(win, row, {
        key,
        draft: htmlTreeState.htmlTreeSortDraft?.id === row.id ? htmlTreeState.htmlTreeSortDraft.dir : '',
      }),
      ...logic,
    };

    return;
  }

  htmlTreeUi.inspect = {
    key,
    ...logic,
    title: t(win, 'antlers_condition'),
    mode: 'condition',
    value: row.expr || '',
    placeholder: t(win, 'antlers_condition_placeholder'),
    branches: [
      { id: 'elseif', label: t(win, 'antlers_add_elseif') },
      { id: 'else', label: t(win, 'antlers_add_else') },
    ],
  };
}

/**
 * The values this place gives a component.
 *
 * The declaration comes from the component's own file; what is filled in comes
 * from the call in front of us. Nothing is stored anywhere for this — the two
 * fields you type in *are* `{{ partial:components/card headline="…" }}`, which
 * is why the same card two rows down can say something else entirely.
 *
 * The fetch is per component per session, so clicking through a list of cards
 * costs one request, not one per card.
 */
function paintComponentValues(win, row) {
  if (!componentPropsOn(win)) {
    htmlTreeUi.inspect = null;

    return;
  }

  if (!row.src) {
    return;
  }

  const key = row.id;

  htmlTreeUi.inspect = {
    key,
    title: t(win, 'component_props_values'),
    mode: 'note',
    note: t(win, 'code_dock_loading'),
  };

  // The Control Panel's own fields when it can lend them: rich text as Bard,
  // a picture as the asset browser, a link as the page picker. The plain boxes
  // below are what is left when it cannot.
  if (propValuesReady()) {
    const params = {};
    const bindings = {};

    // Keyed by the short handle, because that is what the form is drawn from.
    // A call can carry both spellings while an older one is being edited; the
    // prefixed parameter is the one the render reads, so it is the one shown.
    const set = new Map();

    for (const [param, found] of readCallParams(dockHtml().slice(row.from, row.to))) {
      const handle = propHandle(param);

      if (handle && (param !== handle || !set.has(handle))) {
        set.set(handle, found);
      }
    }

    for (const [handle, found] of set) {
      if (found.bound) {
        bindings[handle] = found.value;
      } else {
        params[handle] = found.value;
      }
    }

    // The left column, not the right pane. Every other set of input fields in
    // Live Preview is over there, and a component's values are no different —
    // it is the section's own fields that step aside while one is picked.
    htmlTreeUi.inspect = null;
    componentPropsUi.callOpen = true;
    componentPropsUi.title = componentPropsUi.title || t(win, 'component_props');
    componentPropsUi.callTitle = row.klass || row.name || row.src;
    componentPropsUi.callStore = callValues.ui;
    callValues.ui.canBind = true;
    callValues.ui.dataTitle = t(win, 'data_vars_title');
    callValues.ui.exprPlaceholder = t(win, 'component_props_expr');
    callValues.ui.onBox = (handle, text) => writeComponentBox(win, handle, text);
    // A component's values are written in the call, so the scope is the call's
    // own: a card inside `{{ collection:services }}` is handed a service's
    // fields, not the section's.
    callValues.ui.onPickData = (handle, anchor) =>
      ask('dock:data-menu', {
        anchor,
        at: row.from,
        types: fieldTypesFor(callValues.ui.fields.find((field) => field.handle === handle)?.type),
        onPick: (item) => writeComponentBinding(win, handle, String(item?.var || '').trim()),
      });
    callValues.load(win, {
      key: `${row.src}::${key}`,
      src: row.src,
      params,
      bindings,
      readOnly: ask('dock:is-locked') === true,
    });
    callValues.watch(win, {
      src: row.src,
      write: (next) => writeComponentValues(win, next, bindings),
    });
    syncComponentPropsHost(win);

    return;
  }

  void fetchComponentProps(win, row.src).then((props) => {
    // Clicking on is faster than the network. Whatever is selected now wins.
    if (htmlTreeUi.inspect?.key !== key) {
      return;
    }

    if (!props.length) {
      htmlTreeUi.inspect = {
        key,
        title: t(win, 'component_props_values'),
        mode: 'note',
        note: t(win, 'component_props_values_none'),
      };

      return;
    }

    htmlTreeUi.inspect = {
      key,
      title: t(win, 'component_props_values'),
      mode: 'props',
      inheritLabel: t(win, 'component_props_inherit'),
      rows: valueRows(props, dockHtml().slice(row.from, row.to)),
    };
  });
}

/**
 * Everything the publish form now holds, written into the call in one pass.
 *
 * One pass because each write changes the length of the tag the next one is
 * measured against — writing them one at a time through the tree would splice
 * the second value by offsets the first had already moved.
 */
function writeComponentValues(win, params, bindings = {}) {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeState.htmlTreeActiveId);

  if (row?.kind !== 'component' || ask('dock:is-locked')) {
    return;
  }

  let html = dockHtml();
  let to = row.to;

  for (const [handle, value] of Object.entries(params || {})) {
    // A field reading from the page is not in the form, so the form has nothing
    // to say about it. Writing its empty value would take the expression out.
    if (handle in bindings) {
      continue;
    }

    const before = html.length;
    const next = writePropParam(html, { from: row.from, to }, handle, value);

    if (next === html) {
      continue;
    }

    to += next.length - before;
    html = next;
  }

  if (html !== dockHtml()) {
    writeDockHtml(html, { save: true });
    renderHtmlTree(win);
  }
}

/** The expression a field reads from the page. */
function writeComponentBinding(win, handle, expr) {
  writeOneCallParam(win, handle, expr, true);
  renderHtmlTree(win);
}

/**
 * What the box of a field reading from the page now says. One tag still reads
 * from the page; anything else is the field's own value, nothing takes it out of
 * the call, and the form is read again so the field opens on what the call holds.
 */
function writeComponentBox(win, handle, text) {
  const expr = wholeTag(text);

  if (expr) {
    writeComponentBinding(win, handle, expr);

    return;
  }

  callValues.forget();
  writeOneCallParam(win, handle, String(text ?? '').trim(), false);
  renderHtmlTree(win);
}

function writeOneCallParam(win, handle, value, bound) {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeState.htmlTreeActiveId);

  if (row?.kind !== 'component' || ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const next = writePropParam(html, row, handle, value, { bound });

  if (next !== html) {
    writeDockHtml(next, { save: true });
  }
}

/** The selected row, read back from the rows the last paint produced. */
export function activeAntlersRow() {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeState.htmlTreeActiveId);

  return row?.kind === 'antlers' && !ask('dock:is-locked') ? row : null;
}

export function applyAntlersEdit(win, fn) {
  const row = activeAntlersRow();

  if (!row) {
    return;
  }

  const html = dockHtml();
  const next = fn(html, row);

  if (next !== html) {
    writeDockHtml(next);
    renderHtmlTree(win);
  }
}

/**
 * One field written into the call this row is.
 *
 * By the row's own offsets, and `writePropParam` refuses to splice when the
 * text at them is no longer a tag — so a pane that moved on between the paint
 * and the keystroke loses the edit instead of cutting the file in half.
 */
export function commitComponentValue(win, handle, value, bound) {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeState.htmlTreeActiveId);

  if (row?.kind !== 'component' || ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const next = writePropParam(html, row, handle, value, { bound });

  if (next !== html) {
    writeDockHtml(next, { save: true });
    renderHtmlTree(win);
  }
}

export function commitHtmlTreeInspector(win, value) {
  applyAntlersEdit(win, (html, row) =>
    row.antlers === 'loop' ? loopSourceEdit(row, value)(html, row) : writeAntlersExpression(html, row, value)
  );
}

/**
 * Switching a loop between a field, a collection and a navigation — the
 * shared rule (loop-inspector.js): nothing is written until there is
 * somewhere to point.
 */
export function setHtmlTreeLoopKind(win, kind) {
  const row = activeAntlersRow();

  if (!row || row.antlers !== 'loop') {
    return;
  }

  const edit = loopKindEdit(win, row, kind);

  if (edit) {
    applyAntlersEdit(win, edit);
  }
}

export function addHtmlTreeBranch(win, kind) {
  applyAntlersEdit(win, (html, row) => addAntlersBranch(html, row, kind));
}
