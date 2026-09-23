/**
 * Align the dock's HTML tree with one rendered root in Live Preview.
 * Same paths as html-tree-parse (`0:section/0:div`). Loops reuse one path
 * when the next template sibling is a different tag. Skip VE chrome.
 */

export const HT_PATH_ATTR = 'data-sve-ht-path';

/**
 * Component rows are left out on purpose. This tree is walked against the
 * rendered DOM to stamp paths, and a partial call is not one element — it is
 * whatever that file rendered. Sending it would put the walk out of step with
 * every sibling after it.
 */
export function serializePickTree(nodes) {
  const out = [];

  for (const node of nodes || []) {
    if (node.kind === 'component') {
      continue;
    }

    // A condition or loop renders no element of its own, so its children stand
    // where it stands — the tree sent over is tags only, exactly as before.
    if (node.kind === 'antlers') {
      out.push(...serializePickTree(node.children));

      continue;
    }

    out.push({
      tag: node.tag,
      path: node.path,
      children: serializePickTree(node.children),
    });
  }

  return out;
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

/** The element carrying any of a row's identities as `data-sid`, or null. */
export function sidElement(doc, uid, uids = []) {
  for (const id of [...(Array.isArray(uids) ? uids : []), uid]) {
    if (typeof id !== 'string' || id === '') {
      continue;
    }

    const el = doc.querySelector(`[data-sid="${CSS.escape(id)}"]`);

    if (el) {
      return el;
    }
  }

  return null;
}

export function unstampHtmlPick(doc) {
  doc.querySelectorAll(`[${HT_PATH_ATTR}]`).forEach((el) => el.removeAttribute(HT_PATH_ATTR));
}

/**
 * Every element the open file could be rendering, not just the first.
 *
 * A component is called more than once — four cards in a grid are four
 * renderings of one file — and each is as good a place to point at as the
 * next. Stamping only the first meant the other three did nothing when
 * clicked, with no way to tell why.
 *
 * With a uid there is exactly one: that is a section, and a section is itself.
 */
export function findPickRoots(doc, { uid, uids, tag, klass } = {}) {
  if (uid || uids?.length) {
    // The dock holds the row's `_visual_id`; the preview's `data-sid` is its
    // `id` first. Every identity the row has is tried, the way the morph does.
    const el = sidElement(doc, uid, uids);

    return el ? [el] : [];
  }

  if (!tag) {
    return [];
  }

  return [...doc.querySelectorAll(tag)].filter((el) => {
    if (el.closest('[data-sve-chrome]')) {
      return false;
    }

    return !klass || el.classList.contains(klass);
  });
}

export function findPickRoot(doc, { uid, uids, tag, klass } = {}) {
  if (uid || uids?.length) {
    const el = sidElement(doc, uid, uids);

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
  stampHtmlPickAll(root ? [root] : [], nodes);
}

/**
 * The same paths on every rendering of the file.
 *
 * Cleared once and then stamped once per root: clearing inside the loop would
 * mean each root wiped the one before it, and only the last would answer a
 * click.
 */
export function stampHtmlPickAll(roots, nodes, doc = roots?.[0]?.ownerDocument) {
  if (!doc) {
    return;
  }

  // Cleared even when nothing is found to stamp. A pick whose root is not on
  // the page used to leave the previous file's stamps standing, and a click on
  // that file then reported a path into a tree that no longer showed it —
  // instead of the section, so neither dock nor focus moved.
  unstampHtmlPick(doc);

  if (!nodes?.length) {
    return;
  }

  for (const root of roots) {
    stampOne(root, nodes);
  }
}

function stampOne(root, nodes) {
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
