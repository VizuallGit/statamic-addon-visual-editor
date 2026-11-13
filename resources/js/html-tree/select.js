/**
 * html-tree.js — picking a row, also from a path.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { isTaglessRow, isVoidTag } from '../html-tree-parse.js';
import { closingTagIndex } from '../html-tree-edit.js';
import { htmlTreeState } from './state.js';
import { htmlTreePanel, selectHtmlTreeRow } from '../html-tree.js';
import { renderHtmlTree } from './render.js';
import { expandHtmlTreePath } from './row-actions.js';

/**
 * Where the caret goes when a row is picked: inside it, as its last child.
 *
 * Picking a row in the tree is how you say "I am working in here" — for any
 * row, not just containers. The toolbar is the other half of that: a button
 * there stacks a new element beside the last one, so the two together read as
 * "choose the place, then add things to it".
 *
 * Null for rows with no inside to speak of: void tags, and components, whose
 * content lives in another file.
 */
export function insertPointFor(html, row) {
  if (!html || !row || isTaglessRow(row) || isVoidTag(row.tag)) {
    return null;
  }

  const close = closingTagIndex(html, row);

  // `<div></div>` closes exactly where it opens. That is not "no inside" — it
  // is an empty one, and the point between the two tags is the whole reason
  // this exists.
  if (close < row.openTo) {
    return null;
  }

  // The closing tag usually sits on its own indented line. Aiming at the end of
  // the line before it keeps the tag where it is; aiming at the tag itself
  // would leave the new element wedged in front of it.
  const lineStart = html.lastIndexOf('\n', close - 1) + 1;

  if (html.slice(lineStart, close).trim() === '' && lineStart > row.openTo) {
    return lineStart - 1;
  }

  return close;
}

/**
 * The call a click landed inside, when it landed inside one.
 *
 * Everything a partial draws belongs to another file, so the tree has no row
 * for it — but it has a row for the call, and that is the thing to mark. Of
 * several calls on the same file, the one inside the tag the click was aligned
 * with; a component called once from somewhere else entirely still answers.
 */
export function componentPathFor(path, src) {
  if (!src) {
    return '';
  }

  const hits = [];

  const walk = (nodes, insideParent) => {
    for (const node of nodes || []) {
      const inside = insideParent || node.path === path;

      if (node.kind === 'component' && node.src === src) {
        hits.push({ path: node.path, inside });
      }

      walk(node.children, inside);
    }
  };

  walk(htmlTreeState.htmlTreeRoots, false);

  return (hits.find((hit) => hit.inside) || hits[0])?.path || '';
}

export function selectHtmlTreeByPath(win, path, { reveal = true } = {}) {
  if (!path || !htmlTreePanel(win.document)) {
    return;
  }

  // Pointing at something in the preview says which section as plainly as
  // clicking its row does.
  htmlTreeState.htmlTreeShutStart = false;

  // The row already picked, picked again — a write keeping its pick on the
  // element it changed (boot.js write()), once per keystroke in a box. The
  // way down to it is open and it is on screen, and the rows are drawn again
  // from the new markup by the dock's own change (watchHtmlTreeDock): nothing
  // to paint here, only the pick itself.
  const picked = htmlTreeUi.rows.find((item) => item.current);

  if (picked && picked.path === path) {
    selectHtmlTreeRow(win, picked.id, htmlTreeUi.rows, { reveal });

    return;
  }

  // The path is answered once the dock holds the clicked section's file
  // (reportAwaitedPick) — which can be before this tree has painted that file.
  // Its first paint of a file seats it: every fold is cleared and the first
  // tag is marked. Opened before that paint, the way down to the row was
  // cleared with the rest, and the row — folded away — was never found: the
  // dock stood on the tag, the tree on the section's first row. So the file
  // is painted first, and the way down is opened against what it drew.
  renderHtmlTree(win);
  expandHtmlTreePath(path);
  renderHtmlTree(win);

  const row = htmlTreeUi.rows.find((item) => item.path === path);

  if (!row) {
    return;
  }

  selectHtmlTreeRow(win, row.id, htmlTreeUi.rows, { reveal });

  // The row can be anywhere in a long tree — a click in the preview that marks
  // something off screen has marked nothing, as far as the reader can see.
  win.setTimeout(() => {
    htmlTreePanel(win.document)
      ?.querySelector('[data-sve-ht-row][data-sve-ht-current]')
      ?.scrollIntoView({ block: 'nearest' });
  }, 0);
}
