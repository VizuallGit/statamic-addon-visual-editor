/**
 * The rules help mode asks, and where their rows stand.
 *
 * Each rule is `(ctx, offered) => suggestion[]` — see context.js for both
 * shapes. `offered` is what stands before it, so a rule can stand down (the
 * class rule, when the shell already writes one).
 *
 *   ONLY_RULES  the caret is on an Antlers tag of their own (`{{ if }}`):
 *               when one answers, its rows are the whole answer
 *   HEAD_RULES  first, outside the cap — the class, on every tag without one
 *   RULES       the middle, up to the cap: by how often the author took each
 *               row on this kind of tag (`counts`), in this order otherwise
 *   TAIL_RULES  last, outside the cap — the id, wanted least often
 *
 * To add a kind of help: one file beside these, one line here. Nothing in
 * help-suggest.js or the editor changes.
 */
import { sectionRule } from './section.js';
import { visualEditRule } from './visual-edit.js';
import { blocksRule } from './blocks.js';
import { linkRule } from './link.js';
import { listRule } from './list.js';
import { textRule } from './text.js';
import { alpineRule } from './alpine.js';
import { imgRule, sourceRule } from './media.js';
import { ifTagRule } from './if-tag.js';
import { classRule, idRule } from './attrs.js';

export const ONLY_RULES = [ifTagRule];

export const HEAD_RULES = [classRule];

// A section offers its shell, then x-data; a <div> visual_edit, its loops,
// Bard, then x-show; an <a> its URL before any text; an <img> or a <video>
// its sources before the attributes an <img> lacks.
export const RULES = [sectionRule, visualEditRule, blocksRule, linkRule, listRule, textRule, alpineRule, sourceRule, imgRule];

export const TAIL_RULES = [idRule];

/**
 * Every rule's rows, in order: the head, the first `max` of the middle and
 * then the tail — or the only rule's rows alone.
 *
 * @param {object} ctx
 * @param {number} max
 * @param {Object<string, Object<string, number>>} [counts]  how often a row was
 *   taken, by tag and row id: `{ div: { 'visual-edit': 4 } }`
 * @param {{ only?: Array, head?: Array, rules?: Array, tail?: Array }} [lists]
 *   the rule lists — parameters so a test can run the machinery alone
 */
export function runRules(ctx, max, counts = {}, lists = {}) {
  const { only = ONLY_RULES, head = HEAD_RULES, rules = RULES, tail = TAIL_RULES } = lists;
  const alone = collect(only, ctx, []);

  if (alone.length) {
    return alone;
  }

  const middle = byUse(collect(rules, ctx, []), counts?.[ctx.node.tag]).slice(0, max);
  const shown = [...collect(head, ctx, middle), ...middle];

  return [...shown, ...collect(tail, ctx, shown)];
}

/** The rows taken most often first; the rest keep their order. */
function byUse(rows, taken) {
  const count = (row) => Number(taken?.[row.id]) || 0;

  return [...rows].sort((a, b) => count(b) - count(a));
}

function collect(rules, ctx, offered) {
  const out = [...offered];
  const start = out.length;

  for (const rule of rules) {
    out.push(...(rule(ctx, out) || []).filter(Boolean));
  }

  return out.slice(start);
}
