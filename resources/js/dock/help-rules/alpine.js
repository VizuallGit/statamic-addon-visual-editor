/**
 * Alpine, only where it runs: `x-data` on a `<section>` starts it; `x-show`
 * on a `<div>` and `@click` on a `<button>` do nothing without an element
 * around them that has x-data, so they are offered only inside one.
 *
 * Written after the class, where the site writes Alpine
 * (`<div class="relative" x-show="…">`), empty, the caret between the quotes.
 */
import { ancestorsOf, hasAttrName, openTagOf } from './context.js';

/** The tag → the attribute it is offered, and the spellings that count as having it. */
const ATTRS = {
  section: { attr: 'x-data', also: [] },
  div: { attr: 'x-show', also: [] },
  button: { attr: '@click', also: ['x-on:click'] },
};

export function alpineRule(ctx) {
  const { node } = ctx;
  const want = ATTRS[node.tag];
  const open = openTagOf(ctx);

  if (!want || [want.attr, ...want.also].some((name) => hasAttrName(open.masked, name))) {
    return [];
  }

  if (want.attr !== 'x-data' && !insideXData(ctx)) {
    return [];
  }

  const { text, caret } = afterClass(open, node.tag, `${want.attr}=""`);

  return [
    {
      id: want.attr,
      key: 'code_dock_help_attr',
      args: { attr: want.attr },
      meta: `${want.attr}=""`,
      changes: [{ from: node.from, to: node.openTo, insert: text }],
      selection: node.from + caret,
    },
  ];
}

function insideXData(ctx) {
  return ancestorsOf(ctx).some((el) => hasAttrName(ctx.masked.slice(el.from, el.openTo), 'x-data'));
}

/** The opening tag with `insert` (an empty attribute) after its class, or after its name; the caret between its quotes. */
function afterClass(open, tag, insert) {
  const klass = /\sclass\s*=\s*("[^"]*"|'[^']*')/i.exec(open.masked);
  const at = klass ? klass.index + klass[0].length : 1 + tag.length;

  return { text: `${open.text.slice(0, at)} ${insert}${open.text.slice(at)}`, caret: at + insert.length };
}
