/**
 * code-dock — "something looks wrong" over the HTML pane.
 *
 * template-lint.js finds; this paints. One row per finding under the pane's
 * tool row — "Linje 12 · <div> mangler sit </div>" — and the same range
 * underlined in the editor. A click on a row puts the cursor there. Nothing
 * else changes: the file saves as it always did and the preview morphs as it
 * always did; this only says where to look, for whoever cannot see it in
 * the markup.
 *
 * The rules are handed the section's list fields (replicator, grid, …) from
 * the catalogue the Data button reads, so `{{ blocks }}` with no `{{ /blocks }}`
 * can be told from a value. One fetch per section, then the cache.
 *
 * Owns: [data-sve-html-problems] in CodeDockChrome.vue, dockState.htmlLintUi.
 * May import: template-lint.js, data-vars.js (the catalogue), lib/i18n.js,
 * dock/state.js and the code-dock barrel (editor bindings). Bus: sends
 * nothing, listens to nothing.
 */
import { templateLintDecorations } from '../template-lint.js';
import { cachedDataVars, dataVarsCollection, dataVarsKey, dataVarsSet, fetchDataVars } from '../data-vars.js';
import { t } from '../lib/i18n.js';
import { dockState } from './state.js';
import { DOCK_ID, Decoration, EditorView, RangeSetBuilder, StateEffect, StateField, editors, htmlLanguage } from '../code-dock.js';

/**
 * Field types that are lists whatever their settings. `assets` and `entries`
 * are in the catalogue's loop list too, but a single asset or entry prints
 * on its own — `<img src="{{ image }}">` — and must not be told to close.
 */
const LIST_TYPES = new Set(['replicator', 'grid', 'list', 'array', 'table']);

let lists = new Set();
let listsKey = null;

function host(win) {
  return win.document.getElementById(DOCK_ID)?.querySelector('[data-sve-html-problems]') || null;
}

/**
 * Redraw the strip for these findings. The rows are rebuilt only when what
 * they say changes, so a keystroke inside a finding does not churn the DOM.
 */
export function paintProblems(win, view, problems) {
  const el = host(win);

  if (!el) {
    return;
  }

  const doc = view.state.doc;
  const rows = problems.map((problem) => ({
    from: problem.from,
    line: doc.lineAt(Math.min(problem.from, doc.length)).number,
    text: t(win, problem.key, problem.args),
  }));
  const signature = rows.map((row) => `${row.line}:${row.text}`).join('\n');

  if (el.dataset.sveSignature === signature) {
    return;
  }

  el.dataset.sveSignature = signature;
  el.hidden = rows.length === 0;
  el.replaceChildren();

  if (!rows.length) {
    return;
  }

  const title = win.document.createElement('span');

  title.setAttribute('data-sve-problems-title', '');
  title.textContent = t(win, 'code_dock_problems_title');
  el.appendChild(title);

  for (const row of rows) {
    const button = win.document.createElement('button');
    const line = win.document.createElement('b');

    button.type = 'button';
    button.dataset.sveProblemAt = String(row.from);
    line.textContent = t(win, 'code_dock_problem_line', { line: row.line });
    button.append(line, win.document.createTextNode(` ${row.text}`));
    el.appendChild(button);
  }
}

function bindHost(win) {
  const el = host(win);

  if (!el || el._sveBound) {
    return;
  }

  el._sveBound = true;
  el.addEventListener('mousedown', (event) => event.preventDefault());
  el.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sve-problem-at]');
    const view = editors.html;

    if (!button || !view) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const at = Math.min(Number(button.dataset.sveProblemAt) || 0, view.state.doc.length);

    view.dispatch({
      selection: { anchor: at },
      effects: EditorView.scrollIntoView(at, { y: 'center' }),
    });
    view.focus();
  });
}

/** The handles in the catalogue that are lists: the section's own, and the page's. */
function listNames(data) {
  const out = [];
  const take = (rows) => {
    for (const row of rows || []) {
      if (row?.loop && LIST_TYPES.has(row.type) && row.var && !row.parent) {
        out.push(row.var);
      }
    }
  };

  take(data?.section);

  for (const group of data?.page || []) {
    take(group?.items);
  }

  return out;
}

/**
 * The list fields of the section the dock has open.
 *
 * Read at every document change, and cheap: the same key as the last time
 * is nothing to do, a cached catalogue is applied at once, and only a
 * section not seen before goes to the server. When the set of names
 * changes, the pane is asked to lint again — after this update has
 * finished, because an editor does not take a dispatch mid-update.
 */
function refreshLists(win, view, relint) {
  const query = { collection: dataVarsCollection(win), set: dataVarsSet(dockState.lastType), view: '', scope: '' };
  const key = query.set ? dataVarsKey(query) : '';

  if (key === listsKey) {
    return;
  }

  listsKey = key;

  const apply = (data) => {
    if (listsKey !== key) {
      return;
    }

    const next = new Set(listNames(data));
    const same = next.size === lists.size && [...next].every((name) => lists.has(name));

    lists = next;

    if (!same && editors.html === view) {
      win.queueMicrotask(() => {
        if (editors.html === view) {
          view.dispatch({ effects: relint.of(null) });
        }
      });
    }
  };

  if (!key) {
    apply(null);

    return;
  }

  const hit = cachedDataVars(key);

  if (hit) {
    apply(hit);

    return;
  }

  fetchDataVars(win, query).then(apply);
}

/**
 * The extensions the HTML pane mounts: the lint field with its underlines,
 * and a listener that repaints the strip whenever the document changes —
 * a keystroke, or the dock opening another file — or the rules were asked
 * to run again.
 */
export function problemsUi(win) {
  if (!dockState.htmlLintUi) {
    const { field, relint } = templateLintDecorations(
      { Decoration, StateField, StateEffect, RangeSetBuilder, EditorView },
      htmlLanguage.parser,
      () => ({ lists })
    );
    const listener = EditorView.updateListener.of((update) => {
      const relinted = update.transactions.some((tr) => tr.effects.some((effect) => effect.is(relint)));

      if (!update.docChanged && !relinted) {
        return;
      }

      if (update.docChanged) {
        refreshLists(win, update.view, relint);
      }

      paintProblems(win, update.view, update.state.field(field).problems);
    });

    dockState.htmlLintUi = { extensions: [field, listener] };
  }

  bindHost(win);

  return dockState.htmlLintUi;
}
