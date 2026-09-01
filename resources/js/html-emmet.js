/**
 * Emmet + Antlers Tab expand in the HTML dock.
 *
 * `div` / `ul>li*3` / `.wrapper` expand like VS Code. Known Antlers snippet
 * ids (`if`, `loop`, `partial`, …) expand first so they never become `<if>`.
 * Does not import overlay / preview / bridge.
 */

import { expandAbbreviation, abbreviationTracker } from '@emmetio/codemirror6-plugin';
import {
  ANTLERS_SNIPPETS,
  antlersSnippet,
  expandAntlersSnippet,
  indentAntlersSnippet,
} from './antlers-snippets.js';

const ANTLERS_IDS = new Set(ANTLERS_SNIPPETS.map((item) => item.id));

function lineIndentOf(text) {
  const match = String(text || '').match(/^[ \t]*/);

  return match ? match[0] : '';
}

function beforeCursor(view) {
  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);

  return line.text.slice(0, pos - line.from);
}

function insideAntlers(view) {
  const before = beforeCursor(view);
  const open = before.lastIndexOf('{{');
  const close = before.lastIndexOf('}}');

  return open !== -1 && open > close;
}

function insideHtmlTag(view) {
  const before = beforeCursor(view);
  const lt = before.lastIndexOf('<');
  const gt = before.lastIndexOf('>');

  return lt !== -1 && lt > gt;
}

function wordAtCursor(view) {
  if (!view.state.selection.main.empty) {
    return null;
  }

  const pos = view.state.selection.main.head;
  const before = beforeCursor(view);
  const match = before.match(/([A-Za-z][A-Za-z0-9_-]*)$/);

  if (!match) {
    return null;
  }

  return { from: pos - match[1].length, to: pos, word: match[1] };
}

function expandAntlersWord(view) {
  const found = wordAtCursor(view);

  if (!found || !ANTLERS_IDS.has(found.word)) {
    return false;
  }

  const spec = antlersSnippet(found.word);

  if (!spec) {
    return false;
  }

  const line = view.state.doc.lineAt(found.from);
  const indent = lineIndentOf(line.text);
  const { text, cursor } = expandAntlersSnippet(spec.snippet);
  const insert = indentAntlersSnippet(text, indent);

  view.dispatch({
    changes: { from: found.from, to: found.to, insert },
    selection: { anchor: found.from + cursor },
  });

  return true;
}

export function expandHtmlTab(view) {
  if (view.state.readOnly) {
    return false;
  }

  if (insideAntlers(view)) {
    return expandAntlersWord(view);
  }

  if (expandAntlersWord(view)) {
    return true;
  }

  if (insideHtmlTag(view)) {
    return false;
  }

  try {
    return expandAbbreviation(view);
  } catch {
    return false;
  }
}

export function htmlEmmetExtensions() {
  return abbreviationTracker({
    syntax: 'html',
    markTagPairs: false,
    autoRenameTags: false,
  });
}
