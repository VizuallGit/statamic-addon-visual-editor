/**
 * Where markup written by a toolbar button may go.
 *
 * A caret that sits inside a tag — between its `<` and `>` — or inside an
 * Antlers expression or an HTML comment, moves to just after it. An element
 * written into the middle of a tag is not an element; it is a broken tag,
 * and the pane's lint says so a moment later. Between tags, or after one,
 * is where markup lives.
 *
 * The one thing that belongs inside a tag is Antlers — a `{{ visual_edit }}`
 * or a `{{ field }}` in an attribute — and those come through their own
 * inserters, which never ask this.
 *
 * Pure: text and a position in, a position out. Unit tested.
 */
export function elementInsertPoint(text, pos) {
  let i = 0;

  while (i < pos) {
    const to = spanEnd(text, i);

    if (to === null) {
      i += 1;
      continue;
    }

    if (to === -1) {
      // Unfinished: nothing sane lies after it, so the caret stays.
      return pos;
    }

    if (to > pos) {
      return to;
    }

    i = to;
  }

  return pos;
}

/**
 * The end of the tag, expression or comment that starts at `i`.
 *
 * `null` when nothing starts there, `-1` when it starts but never ends.
 */
function spanEnd(text, i) {
  if (text.startsWith('{{', i)) {
    const end = text.indexOf('}}', i + 2);

    return end === -1 ? -1 : end + 2;
  }

  if (text.startsWith('<!--', i)) {
    const end = text.indexOf('-->', i + 4);

    return end === -1 ? -1 : end + 3;
  }

  if (text[i] === '<' && /[A-Za-z/!?]/.test(text[i + 1] || '')) {
    return tagEnd(text, i);
  }

  return null;
}

/**
 * The end of the tag that opens at `i`: after its `>`, minding quotes and the
 * Antlers inside it, so a `>` in an attribute value does not end the tag.
 */
function tagEnd(text, i) {
  let quote = '';
  let j = i + 1;

  while (j < text.length) {
    const ch = text[j];

    if (quote) {
      if (ch === quote) {
        quote = '';
      }

      j += 1;
      continue;
    }

    if (text.startsWith('{{', j)) {
      const end = text.indexOf('}}', j + 2);

      if (end === -1) {
        return -1;
      }

      j = end + 2;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      j += 1;
      continue;
    }

    if (ch === '>') {
      return j + 1;
    }

    if (ch === '<') {
      // Another tag opens before this one closed: this one is unfinished.
      return -1;
    }

    j += 1;
  }

  return -1;
}
