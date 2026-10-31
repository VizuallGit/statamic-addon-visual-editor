/**
 * The first element a file renders, in serializePickTree's order: a file may
 * start with a condition or an assignment, which render nothing of their own.
 * Beside html-pick-align.js and not in it: that file is part of the bridge.
 */
export function firstPickNode(nodes) {
  for (const node of nodes || []) {
    if (node.kind === 'component' || (node.kind === 'svg' && node.dynamic)) {
      continue;
    }

    const hit = node.kind === 'antlers' ? firstPickNode(node.children) : node;

    if (hit) {
      return hit;
    }
  }

  return null;
}
