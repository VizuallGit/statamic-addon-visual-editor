/**
 * The section root — written the way a new section starts (the scaffold the
 * caller hands in): what is missing is added, what is there stays.
 */
import { VISUAL_EDIT, afterName, hasAttr, maskAntlersSafe, openTagOf, withVisualEdit } from './context.js';

/** Whether the caret is on the root a page section's partial starts with. */
export function onSectionRoot(ctx) {
  return ctx.sectionPartial && ctx.isRoot && ctx.node.tag === 'section';
}

export function sectionRule(ctx) {
  if (!onSectionRoot(ctx)) {
    return [];
  }

  const { node, shellRoot } = ctx;
  const root = /<section\b[^>]*>/i.exec(maskAntlersSafe(shellRoot));

  if (!root) {
    return [];
  }

  const rootTag = shellRoot.slice(root.index, root.index + root[0].length);
  const id = /\sid\s*=\s*"[^"]*"/i.exec(rootTag);
  const klass = /\sclass\s*=\s*"[^"]*"/i.exec(rootTag);
  const edit = VISUAL_EDIT.exec(rootTag);
  const open = openTagOf(ctx);

  // Another id is the author's; overwriting it is not a suggestion.
  if (!id || hasAttr(open.masked, 'id')) {
    return [];
  }

  let next = afterName(open.text, 'section', `${id[0].trim()}${hasAttr(open.masked, 'class') || !klass ? '' : ` ${klass[0].trim()}`}`);

  if (edit) {
    next = withVisualEdit(next, edit[0]);
  }

  return [
    {
      id: 'shell',
      key: 'code_dock_help_shell',
      args: {},
      meta: 'id-{{ id }}',
      changes: [{ from: node.from, to: node.openTo, insert: next }],
      selection: node.from + next.length,
    },
  ];
}
