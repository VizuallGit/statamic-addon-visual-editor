/**
 * The rules help mode asks, in the order their rows show.
 *
 * Each rule is `(ctx, offered) => suggestion[]` — see context.js for both
 * shapes. `offered` is what the rules before it returned, so a rule can
 * stand down (the class rule, when the shell already writes one).
 *
 * `RULES` fill the popup's rows up to the cap; `TAIL_RULES` come after the
 * cap, always last — the id, which is wanted least often and must not push
 * a field off the list.
 *
 * To add a kind of help: one file beside these, one line here. Nothing in
 * help-suggest.js or the editor changes.
 */
import { sectionRule } from './section.js';
import { listRule } from './list.js';
import { textRule } from './text.js';
import { classRule, idRule } from './attrs.js';

export const RULES = [sectionRule, listRule, textRule, classRule];

export const TAIL_RULES = [idRule];

/**
 * Every rule's rows, in order: the first `max` of `rules` and then all of
 * `tail`. The lists are parameters so a test can run the machinery alone.
 */
export function runRules(ctx, max, rules = RULES, tail = TAIL_RULES) {
  const primary = collect(rules, ctx, []).slice(0, max);

  return [...primary, ...collect(tail, ctx, primary)];
}

function collect(rules, ctx, offered) {
  const out = [...offered];
  const start = out.length;

  for (const rule of rules) {
    out.push(...(rule(ctx, out) || []).filter(Boolean));
  }

  return out.slice(start);
}
