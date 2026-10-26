/**
 * The rows the Styles tab keeps for CSS snippets, and what can be said about
 * one without a server: whether its name will file, whether it clashes,
 * whether it has an edit the file does not. Pure, so the tab's rules are
 * tested here and `snippets.js` only does the fetching.
 *
 * A row: `{ key, name, savedName, body, savedBody, problem, saving, fresh }`
 * — `savedName` / `savedBody` as on disk (`body` dedented the way the editor
 * shows it), `problem` one of `empty`, `format`, `taken`, `braces` or null.
 * A `fresh` row has no file yet: `savedName` is null until its first save.
 *
 * May import: utilities.js.
 */
import { bodyProblem, dedent } from './utilities.js';

let keySeq = 0;

/** A row for a snippet that is not on disk yet — the New button's. */
export function freshSnippetRow() {
  return { key: `snippet-${++keySeq}`, name: '', savedName: null, body: '', savedBody: '', problem: 'empty', saving: false, fresh: true };
}

/**
 * The name as the server will file it (Snippet::normalizeName): lowercase,
 * spaces and dashes to `_`, nothing but `a-z0-9_`, a letter first, at most
 * 60. Null when nothing usable is left.
 */
export function normalizeSnippetName(raw) {
  const name = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\.(antlers\.html|css)$/, '')
    .replace(/[ -]/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^_+|_+$/g, '');

  return name && name.length <= 60 && /^[a-z]/.test(name) ? name : null;
}

/** Why a row cannot be saved, or null. `others` are the other rows, for a name already in use. */
export function snippetProblem(row, others = []) {
  if (!String(row.name || '').trim()) {
    return 'empty';
  }

  const name = normalizeSnippetName(row.name);

  if (!name) {
    return 'format';
  }

  if (others.some((o) => o.key !== row.key && (normalizeSnippetName(o.name) === name || o.savedName === name))) {
    return 'taken';
  }

  if (!String(row.body || '').trim()) {
    return 'empty';
  }

  return bodyProblem(row.body);
}

/** Whether the row says something the file does not. */
export function snippetDirty(row) {
  return normalizeSnippetName(row.name) !== row.savedName || dedent(row.body) !== row.savedBody;
}

/** A row for a snippet as the server returned it (`{ name, css }`). */
export function snippetRow(parts) {
  const body = dedent(parts.css);

  return { key: `snippet-${++keySeq}`, name: parts.name, savedName: parts.name, body, savedBody: body, problem: null, saving: false, fresh: false };
}

/**
 * The rows for a fresh read of the files, with the row that has an unsaved
 * edit on the same file kept over the fresh copy, and a new row not saved
 * yet kept at the top: a reload is not a reason to lose what was typed.
 */
export function mergeSnippetRows(current, fresh) {
  const kept = new Map(current.filter((row) => !row.fresh && snippetDirty(row)).map((row) => [row.savedName, row]));

  return [...current.filter((row) => row.fresh), ...fresh.map((parts) => kept.get(parts.name) || snippetRow(parts))];
}
