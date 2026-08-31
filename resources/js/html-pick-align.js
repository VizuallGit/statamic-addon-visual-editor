/**
 * Align the dock's HTML tree with one rendered root in Live Preview.
 * Same paths as html-tree-parse (`0:section/0:div`). Loops reuse one path
 * when the next template sibling is a different tag. Skip VE chrome.
 */

export const HT_PATH_ATTR = 'data-sve-ht-path';

export function serializePickTree(nodes) {
  return (nodes || []).map((node) => ({
    tag: node.tag,
    path: node.path,
    children: serializePickTree(node.children),
  }));
}

export function isPickChrome(el) {
  if (!el || el.nodeType !== 1) {
    return true;
  }

  const tag = el.tagName;

  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'META' || tag === 'NOSCRIPT') {
    return true;
  }

  if (el.id && String(el.id).startsWith('__sve')) {
    return true;
  }

  return el.hasAttribute('data-sve-menu') || el.hasAttribute('data-sve-chrome');
}

export function unstampHtmlPick(doc) {
  doc.querySelectorAll(`[${HT_PATH_ATTR}]`).forEach((el) => el.removeAttribute(HT_PATH_ATTR));
}

export function findPickRoot(doc, { uid, tag, klass } = {}) {
  if (uid) {
    const el = doc.querySelector(`[data-sid="${CSS.escape(uid)}"]`);

    if (el) {
      return el;
    }
  }

  if (!tag) {
    return null;
  }

  return (
    [...doc.querySelectorAll(tag)].find((el) => {
      if (el.closest('[data-sve-chrome]')) {
        return false;
      }

      return !klass || el.classList.contains(klass);
    }) || null
  );
}

export function stampHtmlPick(root, nodes) {
  if (!root?.ownerDocument) {
    return;
  }

  unstampHtmlPick(root.ownerDocument);

  if (!nodes?.length) {
    return;
  }

  const first = nodes[0];

  if (nodes.length === 1 && first.tag === root.tagName.toLowerCase()) {
    root.setAttribute(HT_PATH_ATTR, first.path);
    align(root, first.children || []);

    return;
  }

  align(root, nodes);
}

function contentChildren(el) {
  return [...el.children].filter((child) => !isPickChrome(child));
}

function align(domParent, treeChildren) {
  const kids = contentChildren(domParent);
  let d = 0;

  for (let i = 0; i < treeChildren.length; i += 1) {
    const node = treeChildren[i];

    while (d < kids.length && kids[d].tagName.toLowerCase() !== node.tag) {
      d += 1;
    }

    if (d >= kids.length) {
      return;
    }

    const next = treeChildren[i + 1];
    const repeat = !next || next.tag !== node.tag;

    do {
      kids[d].setAttribute(HT_PATH_ATTR, node.path);
      align(kids[d], node.children || []);
      d += 1;
    } while (repeat && d < kids.length && kids[d].tagName.toLowerCase() === node.tag);
  }
}
