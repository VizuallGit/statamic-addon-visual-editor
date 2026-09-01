/**
 * When you rename `<h4>` to `<h1>` in the HTML dock, the matching `</h4>`
 * follows (and the other way around). One undo step. Does not import
 * overlay / preview / bridge.
 */

import { Annotation, EditorState } from '@codemirror/state';
import { ensureSyntaxTree, syntaxTree } from '@codemirror/language';

const tagSync = Annotation.define();

const NAME_RE = /^[A-Za-z][A-Za-z0-9:-]*$/;

const CLOSE_TAGS = new Set(['CloseTag', 'MismatchedCloseTag', 'IncompleteCloseTag']);

function childNamed(node, name) {
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.name === name) {
      return child;
    }
  }

  return null;
}

function tagNameNodeAt(state, pos) {
  ensureSyntaxTree(state, Math.min(state.doc.length, pos + 1), 50);
  const tree = syntaxTree(state);

  for (const offset of [0, -1, 1]) {
    const at = pos + offset;

    if (at < 0 || at > state.doc.length) {
      continue;
    }

    let node = tree.resolveInner(at, offset === 1 ? 1 : -1);

    while (node) {
      if (node.name === 'TagName') {
        return node;
      }

      node = node.parent;
    }
  }

  return null;
}

function elementOf(tagName) {
  let node = tagName.parent;

  while (
    node &&
    node.name !== 'OpenTag' &&
    node.name !== 'SelfClosingTag' &&
    !CLOSE_TAGS.has(node.name)
  ) {
    node = node.parent;
  }

  if (!node || node.name === 'SelfClosingTag') {
    return null;
  }

  let el = node.parent;

  while (el && el.name !== 'Element') {
    el = el.parent;
  }

  return el;
}

function pairNames(el) {
  let open = null;
  let close = null;

  for (let child = el.firstChild; child; child = child.nextSibling) {
    if (child.name === 'OpenTag') {
      open = childNamed(child, 'TagName');
    }

    if (CLOSE_TAGS.has(child.name)) {
      close = childNamed(child, 'TagName');
    }
  }

  return { open, close };
}

function pairChange(tr) {
  if (!tr.docChanged || tr.annotation(tagSync) || tr.isUserEvent('input.type.compose')) {
    return null;
  }

  let count = 0;
  let fromA = 0;
  let toA = 0;
  let inserted = '';

  tr.changes.iterChanges((start, end, _fromB, _toB, text) => {
    count += 1;
    fromA = start;
    toA = end;
    inserted = text.toString();
  });

  if (count !== 1) {
    return null;
  }

  const name = tagNameNodeAt(tr.startState, fromA);

  if (!name || fromA < name.from || toA > name.to) {
    return null;
  }

  const next =
    tr.startState.doc.sliceString(name.from, fromA) +
    inserted +
    tr.startState.doc.sliceString(toA, name.to);

  if (!NAME_RE.test(next)) {
    return null;
  }

  const el = elementOf(name);

  if (!el) {
    return null;
  }

  const { open, close } = pairNames(el);

  if (!open || !close) {
    return null;
  }

  const other = name.from === open.from ? close : open;

  if (other.from === name.from) {
    return null;
  }

  const otherFrom = tr.changes.mapPos(other.from, 1);
  const otherTo = tr.changes.mapPos(other.to, -1);

  if (tr.newDoc.sliceString(otherFrom, otherTo) === next) {
    return null;
  }

  return { from: otherFrom, to: otherTo, insert: next };
}

export function htmlTagSync() {
  return EditorState.transactionFilter.of((tr) => {
    const change = pairChange(tr);

    if (!change) {
      return tr;
    }

    return [
      tr,
      {
        changes: change,
        sequential: true,
        annotations: tagSync.of(true),
      },
    ];
  });
}
