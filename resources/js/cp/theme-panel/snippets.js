/**
 * CSS snippets in Theme → Styles: the dock's `resources/snippets/*.css`,
 * each the body of one rule with no class name, listed under a chip of their
 * own so they can be read, changed, renamed and removed from Live Preview.
 *
 * A snippet is a file of its own, not a line in site.css, so it does not go
 * through the panel's Save: each row saves itself through the snippet
 * endpoint (SnippetController::update) the moment its button — or Mod-S in
 * its editor — is pressed, and the panel's `dirty` is never set by it.
 * Changing a snippet changes the library copy only; elements that already
 * got the body keep what they have (dock/snippets.js).
 *
 * `ui.snippets`: `{ key, name, savedName, body, savedBody, problem, saving }`
 * — `savedName` / `savedBody` as on disk, `problem` a name or brace problem
 * that stops the save (`empty`, `format`, `taken`, `braces`).
 */
import { openCpOverlay } from '../open-overlay.js';
import ChoiceDialog from '../surfaces/ChoiceDialog.vue';
import { t } from '../../lib/i18n.js';
import { csrfToken } from '../../lib/csrf.js';
import { themePanelUi as ui } from './store.js';
import { dedent } from './utilities.js';
import { mergeSnippetRows, normalizeSnippetName, snippetProblem } from './snippet-rows.js';

const LIST_API = '/!/sve/snippets';
const ONE_API = '/!/sve/snippet';

async function request(win, url, options = {}) {
  const res = await win.fetch(url, {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = new Error(String(res.status));

    err.status = res.status;

    throw err;
  }

  return res.json();
}

/**
 * The CSS snippets on disk, into `ui.snippets`. Read every time the Styles
 * tab is opened, so one saved in the dock a moment ago is here. A row with
 * unsaved edits is kept over the fresh copy of the same file.
 */
export async function loadSnippets(win) {
  try {
    const list = await request(win, LIST_API);
    const items = (Array.isArray(list?.items) ? list.items : []).filter((item) => item.kind === 'css');
    const fresh = await Promise.all(items.map((item) => request(win, `${ONE_API}?name=${encodeURIComponent(item.name)}`)));

    ui.snippets = mergeSnippetRows(ui.snippets, fresh);
  } catch {
    // The list stays as it was; the tab says nothing is here if it was empty.
  }
}

function find(key) {
  return ui.snippets.find((row) => row.key === key) || null;
}

function check(row) {
  row.problem = snippetProblem(row, ui.snippets);
}

async function save(win, row) {
  check(row);

  if (row.problem || row.saving) {
    ui.status = t(win, row.problem === 'braces' ? 'theme_utilities_braces' : 'theme_classes_snippet_fix');

    return;
  }

  const name = normalizeSnippetName(row.name);

  row.saving = true;
  ui.status = t(win, 'theme_panel_saving');

  try {
    const made = await request(win, `${ONE_API}/update`, {
      method: 'POST',
      body: JSON.stringify({ name: row.savedName, css: row.body, ...(name !== row.savedName ? { rename: name } : {}) }),
    });

    row.name = made.name;
    row.savedName = made.name;
    row.savedBody = dedent(row.body);
    ui.status = t(win, 'theme_classes_snippet_saved', { name: made.name });
  } catch (err) {
    ui.status = t(win, err?.status === 409 ? 'theme_classes_snippet_taken' : 'theme_classes_snippet_failed', { name });
  } finally {
    row.saving = false;
  }
}

async function remove(win, row) {
  ui.status = '';

  try {
    await request(win, `${ONE_API}?name=${encodeURIComponent(row.savedName)}`, { method: 'DELETE' });
  } catch (err) {
    // Gone already is gone: the row goes with it.
    if (err?.status !== 404) {
      ui.status = t(win, 'theme_classes_snippet_remove_failed', { name: row.savedName });

      return;
    }
  }

  ui.snippets = ui.snippets.filter((o) => o !== row);

  if (ui.openClassKey === row.key) {
    ui.openClassKey = '';
  }

  ui.status = t(win, 'theme_classes_snippet_removed', { name: row.savedName });
}

/** Ask first: the file is the only copy of the recipe. Not the panel's own `confirmRemove`, which marks site.css dirty. */
function confirmRemove(win, row) {
  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title: t(win, 'theme_classes_snippet_remove_title', { name: row.savedName }),
    body: t(win, 'theme_classes_snippet_remove_body'),
    buttons: [
      { value: 'cancel', label: t(win, 'cancel'), variant: 'muted' },
      { value: 'ok', label: t(win, 'theme_panel_remove'), variant: 'danger' },
    ],
    onPick: (value) => {
      overlay.dismiss();

      if (value === 'ok') {
        void remove(win, row);
      }
    },
    onClose: () => overlay.dismiss(),
  });
}

/** The four handlers the Styles tab calls for a snippet row; spread into the panel's handlers. */
export function snippetHandlers(win) {
  return {
    onSnippetName: (key, name) => {
      const row = find(key);

      if (row) {
        row.name = String(name || '');
        check(row);
      }
    },
    onSnippetBody: (key, body) => {
      const row = find(key);

      if (row) {
        row.body = String(body || '');
        check(row);
      }
    },
    onSaveSnippet: (key) => {
      const row = find(key);

      if (row) {
        void save(win, row);
      }
    },
    onRemoveSnippet: (key) => {
      const row = find(key);

      if (row) {
        confirmRemove(win, row);
      }
    },
  };
}
