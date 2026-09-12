import { isVoidTag } from './html-tree-parse.js';

export function findNode(nodes, id) {
  for (const node of nodes || []) {
    if (node.id === id) {
      return node;
    }

    const found = findNode(node.children, id);

    if (found) {
      return found;
    }
  }

  return null;
}

export function containsId(node, id) {
  return (node.children || []).some((child) => child.id === id || containsId(child, id));
}

export function blockRange(html, node) {
  let from = node.wrapFrom ?? node.from;
  let to = node.wrapTo ?? node.to;

  if (from > 0 && html[from - 1] === '\n') {
    from -= 1;
  }

  return { from, to };
}

export function closingTagIndex(html, node) {
  const inner = html.slice(node.from, node.to);

  // A condition or loop closes with Antlers, not a tag — `{{ /blocks }}`, or
  // `{{ /if }}` / `{{ endif }}`. Without this, dropping something "inside" one
  // would land after the block instead of in it.
  if (node.kind === 'antlers') {
    const close = inner.match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);

    return close ? node.from + close.index : node.to;
  }

  const token = `</${node.tag}`;
  const idx = inner.toLowerCase().lastIndexOf(token);

  if (idx === -1) {
    return node.to;
  }

  return node.from + idx;
}

function adj(pos, removedFrom, removedLen) {
  if (pos >= removedFrom + removedLen) {
    return pos - removedLen;
  }

  if (pos > removedFrom) {
    return removedFrom;
  }

  return pos;
}

/**
 * Move the source node's HTML block before, after, or inside the target.
 * Returns the original string when the move is not possible.
 */
export function moveHtml(html, roots, sourceId, targetId, place) {
  const source = findNode(roots, sourceId);
  const target = findNode(roots, targetId);

  if (!html || !source || !target || sourceId === targetId) {
    return html;
  }

  if (containsId(source, targetId)) {
    return html;
  }

  let where = place;

  if (where === 'inside' && (isVoidTag(target.tag) || target.wrapFrom != null)) {
    where = 'after';
  }

  const src = blockRange(html, source);
  const block = html.slice(src.from, src.to);

  if (!block) {
    return html;
  }

  const rest = html.slice(0, src.from) + html.slice(src.to);
  const len = src.to - src.from;
  let at;

  if (where === 'before') {
    at = adj(blockRange(html, target).from, src.from, len);
  } else if (where === 'inside') {
    at = adj(closingTagIndex(html, target), src.from, len);
  } else {
    at = adj(blockRange(html, target).to, src.from, len);
  }

  at = Math.max(0, Math.min(at, rest.length));

  let insert = block;

  if (at > 0 && rest[at - 1] !== '\n' && insert[0] !== '\n') {
    insert = `\n${insert}`;
  }

  // Dropping inside lands right before the closing tag, which is sitting on its
  // own indented line. Without this the tag gets pulled up onto the end of what
  // was just moved in.
  if (where === 'inside') {
    const lead = rest.slice(0, at).split('\n').pop() || '';

    if (lead.trim() === '') {
      // The closing tag's own indent is already sitting in front of us, so the
      // block joins it rather than bringing a newline of its own.
      const body = insert.replace(/^\n+[ \t]*/, '').replace(/\s+$/, '');

      insert = `${body}\n${lead}`;
    }
  }

  return rest.slice(0, at) + insert + rest.slice(at);
}

/**
 * Wrap a visible node in an HTML comment, or unwrap a comment-rooted node.
 * Children of a commented parent stay inside that comment — they are not
 * wrapped again.
 */
export function toggleHiddenHtml(html, node) {
  if (!html || !node) {
    return html;
  }

  if (node.wrapFrom != null && node.wrapTo != null) {
    const inner = html.slice(node.wrapFrom + 4, node.wrapTo - 3);

    return html.slice(0, node.wrapFrom) + inner + html.slice(node.wrapTo);
  }

  if (node.hidden) {
    return html;
  }

  return `${html.slice(0, node.from)}<!--${html.slice(node.from, node.to)}-->${html.slice(node.to)}`;
}

export function dropPlace(offsetY, height, canInside) {
  const y = offsetY / Math.max(height, 1);

  if (canInside && y > 0.32 && y < 0.68) {
    return 'inside';
  }

  return y < 0.5 ? 'before' : 'after';
}

export function duplicateHtml(html, node) {
  if (!html || !node) {
    return html;
  }

  const { from, to } = blockRange(html, node);
  let block = html.slice(from, to);

  if (!block) {
    return html;
  }

  if (!block.startsWith('\n')) {
    block = `\n${block}`;
  }

  return html.slice(0, to) + block + html.slice(to);
}

export function deleteHtml(html, node) {
  if (!html || !node) {
    return html;
  }

  const { from, to } = blockRange(html, node);

  return html.slice(0, from) + html.slice(to);
}
