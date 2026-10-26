/**
 * One way to ask the dock's AI, for the grey text and ⌘K alike: the file
 * around the caret or selection, the section and its fields, the author's
 * taken suggestions — and the POST itself.
 *
 * What is sent is the whole file's, also when the pane shows a slice
 * (dockState.htmlScopeActive / htmlFocus): the slice's start is added to the
 * pane's positions, as help-editor.js and data-vars.js do.
 *
 * May import: dock/*, lib/.
 */
import { dockState } from './state.js';
import { currentFullHtml } from './scope.js';
import { currentTemplateType } from './dock-api.js';
import { sectionDataRows } from './data-vars.js';
import { csrfToken } from '../lib/csrf.js';
import { fieldRows, ghostRequest } from './ghost-suggest.js';
import { takenRows } from './ghost-memory.js';

/** Where the pane's text starts in the file. */
export function paneOffset() {
  return dockState.htmlScopeActive && dockState.htmlFocus ? dockState.htmlFocus.from : 0;
}

/** The section's fields, asked for once per file — the Data button's rows. Kept on `state`. */
export function fieldsFor(state) {
  const type = currentTemplateType() || '';

  if (state.fieldsFor !== type) {
    state.fieldsFor = type;
    state.fields = Promise.resolve()
      .then(() => sectionDataRows(state.win))
      .then(fieldRows, () => []);
  }

  return state.fields;
}

/**
 * Everything a request carries, for the pane's `from`–`to` (a caret when
 * they are the same). `full` and `pos` come back too: the rules want them.
 */
export async function payload(state, from, to = from) {
  const full = currentFullHtml();
  const offset = paneOffset();
  const fields = await fieldsFor(state);

  return {
    full,
    pos: offset + from,
    body: {
      ...ghostRequest(full, offset + from, offset + to),
      section: currentTemplateType() || '',
      fields,
      taken: takenRows(state.win),
    },
  };
}

/**
 * POST to `/!/sve/dock-ghost{path}`. Resolves `{ ok, status, body }`; a
 * request aborted or lost on the network rejects.
 */
export async function ghostPost(win, path, body, signal) {
  const res = await win.fetch(`/!/sve/dock-ghost${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  return { ok: res.ok, status: res.status, body: await res.json().catch(() => null) };
}
