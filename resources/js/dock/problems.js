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
 * Owns: [data-sve-html-problems] in CodeDockChrome.vue, dockState.htmlLintUi.
 * May import: template-lint.js, lib/i18n.js, dock/state.js and the code-dock
 * barrel (editor bindings). Bus: sends nothing, listens to nothing.
 */
import { templateLintDecorations } from '../template-lint.js';
import { t } from '../lib/i18n.js';
import { dockState } from './state.js';
import { DOCK_ID, Decoration, EditorView, RangeSetBuilder, StateField, editors, htmlLanguage } from '../code-dock.js';

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

/**
 * The extensions the HTML pane mounts: the lint field with its underlines,
 * and a listener that repaints the strip whenever the document changes —
 * a keystroke, or the dock opening another file.
 */
export function problemsUi(win) {
  if (!dockState.htmlLintUi) {
    const { field } = templateLintDecorations(
      { Decoration, StateField, RangeSetBuilder, EditorView },
      htmlLanguage.parser
    );
    const listener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        paintProblems(win, update.view, update.state.field(field).problems);
      }
    });

    dockState.htmlLintUi = { extensions: [field, listener] };
  }

  bindHost(win);

  return dockState.htmlLintUi;
}
