/**
 * What the HTML pane's list offers inside `{{ … }}` — the pure part of
 * dock/antlers-complete.js: the word being typed, the site's collections and
 * the fields that fit it, and the loop a collection is written as.
 *
 * May import: nothing.
 */

/** Fields offered at most. */
const MAX_FIELDS = 30;

/**
 * The Antlers word being typed at the caret: `{{ coll|` → `{ word: 'coll',
 * from }`. Null outside an open tag, and past its first word — a parameter
 * (`{{ partial src="…` ) is not a name to complete.
 */
export function antlersWord(textBefore, pos) {
  const match = String(textBefore).match(/\{\{\s*([A-Za-z_][\w:./-]*|)$/);

  return match ? { word: match[1], from: pos - match[1].length } : null;
}

/**
 * The collections to offer for `word`: all of them while it is on its way to
 * `collection` (`c`, `coll`, `collection`), the ones whose handle or title
 * starts with what follows once it is `collection:em`.
 *
 * @param {Array<{handle: string, title?: string}>} collections
 */
export function collectionOptions(collections, word) {
  const typed = String(word || '').toLowerCase();
  const list = (Array.isArray(collections) ? collections : []).filter((row) => row && typeof row.handle === 'string' && row.handle);

  if (typed.length >= 1 && 'collection'.startsWith(typed)) {
    return list;
  }

  const after = typed.match(/^collection:?(.*)$/);

  if (!after) {
    return [];
  }

  return list.filter((row) => row.handle.toLowerCase().startsWith(after[1]) || String(row.title || '').toLowerCase().startsWith(after[1]));
}

/**
 * The loop a collection is written as, replacing the word typed after `{{ `:
 * the rest of the opening tag, an empty line for the item one step in, and
 * the closing tag — the caret on the empty line.
 */
export function collectionLoop(handle, indent) {
  const opening = `collection from="${handle}" }}\n${indent}  `;

  return { text: `${opening}\n${indent}{{ /collection }}`, cursor: opening.length };
}

/**
 * The fields that fit `word`: by handle, or by a word of their label — `ima`
 * finds `profile_image` ("Profile image"). Each handle once.
 *
 * @param {Array<{var: string, label?: string, type?: string}>} rows
 */
export function fieldOptions(rows, word) {
  const typed = String(word || '').toLowerCase();
  const seen = new Set();
  const out = [];

  for (const row of Array.isArray(rows) ? rows : []) {
    const name = typeof row?.var === 'string' ? row.var : '';

    if (!name || seen.has(name)) {
      continue;
    }

    const words = [name.toLowerCase(), ...String(row.label || '').toLowerCase().split(/[\s_-]+/), ...name.toLowerCase().split('_')];

    if (typed === '' || words.some((part) => part.startsWith(typed))) {
      seen.add(name);
      out.push(row);
    }

    if (out.length >= MAX_FIELDS) {
      break;
    }
  }

  return out;
}

/** What closes the tag right after the caret on its line (` }}`), so taking a name does not write it twice. */
export function closingAfter(textAfter) {
  const match = String(textAfter).match(/^[ \t]*\}\}/);

  return match ? match[0].length : 0;
}
