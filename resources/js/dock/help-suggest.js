/**
 * Help mode's suggestions — what the HTML pane offers to write next at one
 * spot in a template.
 *
 * Pure: the markup, where the caret stands and the section's fields go in;
 * a few suggestions come out, each one change to that markup and where the
 * caret lands after it. One change, so the dock applies a suggestion as one
 * transaction and ⌘Z takes it back in one step; Instant paints it like
 * anything typed.
 *
 * The fields are the Data button's section rows (`/!/sve/data-vars`): `var`,
 * `label`, `type`, `loop`, `value`, and `parent` for a row inside a loop —
 * `items` for a grid's own fields, `list › item` for the fields of a
 * replicator's set `item`. Only those are offered; nothing is guessed from
 * the markup.
 *
 * A suggestion names its text by lang key (`key` + `args`, for `t()`), so
 * this file has no strings to translate. The section's root is not written
 * here either: the caller hands in the one SectionTypeMaker scaffolds, so a
 * new section and a suggested one start the same.
 *
 * The rules themselves live in help-rules/ — one file per kind of tag, the
 * order in help-rules/index.js, the shared helpers and the contract in
 * help-rules/context.js. This file finds where the caret is and runs them.
 *
 * May import: html-tree-parse.js, antlers-blocks.js, help-rules/.
 */
import { lockedElementRanges } from '../html-tree-parse.js';
import { findAntlersBlocks } from '../antlers-blocks.js';
import { buildContext } from './help-rules/context.js';
import { loopTagRule } from './help-rules/loop-tag.js';
import { runRules } from './help-rules/index.js';

/** How many rows the popup fills before the tail (the id row). */
export const HELP_MAX = 3;

/**
 * @param {string} html    the whole file
 * @param {number} at      the caret's offset in it
 * @param {object} [options]
 * @param {Array}  [options.fields]          the section's Data rows
 * @param {boolean} [options.sectionPartial] the file is a page section's partial
 * @param {string} [options.shellRoot]       SectionTypeMaker's scaffold (or its root tag)
 * @param {{ src: string, handles: string[] }} [options.blockPartials]
 *                                          the site's block partials: `blocks/{type}` and the handles it holds
 * @param {number[]} [options.locked]        more locked ranges, flat: from, to, …
 * @returns {Array<{ id: string, key: string, args: object, meta: string,
 *   changes: Array<{ from: number, to: number, insert: string }>, selection: number|null,
 *   after?: 'class'|'loop', loop?: object }>}
 */
export function helpSuggestions(html, at, options = {}) {
  const source = String(html || '');
  const pos = Number(at);

  if (!Number.isFinite(pos) || pos < 0 || pos > source.length) {
    return [];
  }

  const { fields = [], sectionPartial = false, shellRoot = '', blockPartials = null, locked = [] } = options;

  if (inRanges([...lockedElementRanges(source), ...locked], pos)) {
    return [];
  }

  const blocks = findAntlersBlocks(source);
  const onLoopTag = loopTagRule(blocks, pos);

  if (onLoopTag.length) {
    return onLoopTag;
  }

  const rows = Array.isArray(fields) ? fields.filter((row) => row && typeof row.var === 'string') : [];
  const ctx = buildContext(source, pos, { rows, blocks, sectionPartial, shellRoot, blockPartials });

  return ctx ? runRules(ctx, HELP_MAX) : [];
}

/**
 * The same suggestion in a pane's coordinates, when the pane shows a slice of
 * the file that starts at `offset`: the changes and the caret move back by
 * it; the loop (an address in the file) does not.
 */
export function shiftSuggestion(suggestion, offset) {
  const by = Number(offset) || 0;

  if (!by) {
    return suggestion;
  }

  return {
    ...suggestion,
    changes: suggestion.changes.map((change) => ({ ...change, from: change.from - by, to: change.to - by })),
    selection: suggestion.selection == null ? null : suggestion.selection - by,
  };
}

function inRanges(flat, pos) {
  for (let i = 0; i + 1 < flat.length; i += 2) {
    if (pos >= flat[i] && pos < flat[i + 1]) {
      return true;
    }
  }

  return false;
}
