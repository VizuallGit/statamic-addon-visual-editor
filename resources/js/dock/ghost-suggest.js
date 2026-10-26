/**
 * Grey text's rules, without the editor: when to ask, what to send, and what
 * is left of a suggestion the author is typing through.
 *
 * Pure: the file and the caret in, answers out. The editor side
 * (ghost-editor.js) does the asking and the drawing.
 *
 * May import: nothing.
 */

/** Characters of the file sent before the caret. The server cuts back to a line start. */
export const BEFORE_CHARS = 3000;

/** Characters sent after the caret. */
export const AFTER_CHARS = 1200;

/** Rows of the Data button sent as the section's fields. */
export const MAX_FIELDS = 60;

/**
 * Whether grey text has anything to add here. Copilot's rule of thumb: at the
 * end of a line, or where only closing marks follow (`"`, `>`, `}}`) — and
 * inside a tag still being written (`<h2 class="x" {{ visual_|` with
 * `>{{ title }}</h2>` after it), where the rest of the line is the element's
 * own. Never in the middle of a word, and never inside a locked element: the
 * lock would refuse the Tab.
 *
 * @param {string} full   the whole file
 * @param {number} pos    the caret in it
 * @param {number[]} locked  lib/locked-tags.js ranges, flat: [from, to, from, to, …]
 */
export function shouldAsk(full, pos, locked = []) {
  const text = String(full || '');

  if (pos < 0 || pos > text.length) {
    return false;
  }

  for (let i = 0; i + 1 < locked.length; i += 2) {
    if (pos > locked[i] && pos < locked[i + 1]) {
      return false;
    }
  }

  if (/[\w-]/.test(text.charAt(pos))) {
    return false;
  }

  const end = text.indexOf('\n', pos);
  const rest = text.slice(pos, end === -1 ? text.length : end);
  const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
  const typed = text.slice(lineStart, pos);

  if (!/^[\s"'>}\])/]*$/.test(rest)) {
    const inAntlers = typed.lastIndexOf('{{') > typed.lastIndexOf('}}');
    const inTag = /<[a-zA-Z][^<>]*$/.test(typed);

    return inAntlers || inTag;
  }

  // An empty line under an empty line: nothing being written.
  if (typed.trim() === '') {
    const prevEnd = lineStart - 1;
    const prevStart = prevEnd > 0 ? text.lastIndexOf('\n', prevEnd - 1) + 1 : 0;

    return prevEnd > 0 && text.slice(prevStart, prevEnd).trim() !== '';
  }

  return true;
}

/** What goes to the server: the file around the caret, cut to size. */
export function ghostRequest(full, pos) {
  const text = String(full || '');

  return {
    before: text.slice(Math.max(0, pos - BEFORE_CHARS), pos),
    after: text.slice(pos, pos + AFTER_CHARS),
  };
}

/** The Data button's rows, as little as the prompt needs: handle, type, label, parent. */
export function fieldRows(rows) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .filter((row) => row && typeof row.var === 'string' && row.var !== '')
    .slice(0, MAX_FIELDS)
    .map((row) => ({
      var: row.var,
      type: String(row.type || ''),
      label: String(row.label || ''),
      ...(row.parent ? { parent: String(row.parent) } : {}),
    }));
}

/**
 * The author typed `typed` where grey text stood: what is left of it, or null
 * when they wrote something else. Typing the whole suggestion leaves ''.
 */
export function advanceGhost(text, typed) {
  const ghost = String(text || '');
  const input = String(typed || '');

  if (input === '' || !ghost.startsWith(input)) {
    return null;
  }

  return ghost.slice(input.length);
}

/**
 * The next word of a suggestion, with the space or marks before it — what
 * ⌘→ takes (Copilot's "accept word").
 */
export function nextWord(text) {
  const match = String(text || '').match(/^\s*(?:[\w-]+|[^\w\s]+)/);

  return match ? match[0] : String(text || '');
}
