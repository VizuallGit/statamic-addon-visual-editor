/**
 * `<div>` without `{{ visual_edit }}`: the tag alone, which is what lights the
 * element up in the preview. Its parts (field, inline_edit, …) come after,
 * one at a time — the editor's `after: 'visual-edit'`, not this rule's.
 */
import { VISUAL_EDIT, beforeClose, openTagOf } from './context.js';

const TAG = '{{ visual_edit }}';

export function visualEditRule(ctx) {
  const { node } = ctx;
  const open = openTagOf(ctx);

  if (node.tag !== 'div' || VISUAL_EDIT.test(open.text)) {
    return [];
  }

  const next = beforeClose(open.text, TAG);

  return [
    {
      id: 'visual-edit',
      key: 'code_dock_help_attr',
      args: { attr: 'visual_edit' },
      meta: TAG,
      changes: [{ from: node.from, to: node.openTo, insert: next }],
      // Right before its }}, where the parts are written.
      selection: node.from + next.lastIndexOf('}}'),
      after: 'visual-edit',
    },
  ];
}
