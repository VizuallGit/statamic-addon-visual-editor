/**
 * Put a class rule where it belongs: inside the section's own scope.
 *
 * The house rule these sections are written to is one line long — the design
 * goes in `@scope(.{{ _class }})`, the values from the fields go on
 * `#id-{{ id }}` — and a class written at the top of the file is outside both.
 * It then applies to every section on the page that happens to use the same
 * name, which is a bug nobody sees until the second section is added.
 *
 * So: on the way to disk, a bare class rule at the top level moves inside the
 * scope. Only a bare class rule, and only when there is a scope for it to move
 * into — see `canMoveIntoScope`. Everything else stays exactly where it is.
 */

import { cssBlockTree } from './css-sizes.js';

/** A plain `.name` rule. Not `:root`, not `a:hover`, not `.a .b`, not an at-rule. */
const PLAIN_CLASS = /^\.[a-zA-Z_][\w-]*$/;

/**
 * Is this file shaped so a move is safe?
 *
 * The scope has to be on the element, or moving a rule into it stops the rule
 * applying at all. `html` is the template's markup: the scope class must be in
 * it, and there must be exactly one `@scope` block to move things into — a
 * file with two is one nobody should be rearranging automatically.
 */
export function canMoveIntoScope(css, html, scopeClass) {
  if (!scopeClass || !String(html || '').includes(scopeClass)) {
    return false;
  }

  return scopeBlocks(css).length === 1;
}

/** The `@scope(…)` blocks at the top level of the file. */
function scopeBlocks(css) {
  return cssBlockTree(css).filter((node) => /^@scope\b/i.test(node.prelude));
}

/**
 * The top-level class rules that do not belong there.
 *
 * A selector built with Antlers is left alone even when it looks like a plain
 * class once the tags are blanked out: `.gallery-lb-{{ id }}` reads as
 * `.gallery-lb-` and is not a class anyone typed — it is one name per section,
 * usually for something rendered outside the section, and scoping it would
 * stop it matching anything at all. Written by hand, meant to be global.
 *
 * @returns {Array<{from: number, to: number, name: string}>}
 */
export function strayClassRules(css) {
  const source = String(css || '');

  return cssBlockTree(source)
    .filter((node) => {
      if (!PLAIN_CLASS.test(node.prelude)) {
        return false;
      }

      // The rule's own brace, not the first `{` after the selector — that one
      // belongs to `{{ id }}`, which is exactly what we are looking for.
      return !source.slice(node.from, node.bodyFrom - 1).includes('{{');
    })
    .map((node) => ({ from: node.from, to: node.to, name: node.prelude.slice(1) }));
}

/**
 * Move every stray class rule into the file's scope block.
 *
 * Returns the CSS unchanged when there is nothing to move, or when moving
 * would not be safe.
 */
export function moveClassesIntoScope(css, html, scopeClass) {
  const source = String(css || '');

  if (!canMoveIntoScope(source, html, scopeClass)) {
    return source;
  }

  const stray = strayClassRules(source);

  if (!stray.length) {
    return source;
  }

  const scope = scopeBlocks(source)[0];
  const indent = innerIndent(source, scope);
  const moved = stray
    .map((rule) => reindent(source.slice(rule.from, rule.to), source, rule.from, indent))
    .join('\n\n');

  // Cut from the back so an earlier removal cannot move a later one, then put
  // the lot inside the scope in the order they were written.
  let out = source;

  for (const rule of [...stray].sort((a, b) => b.from - a.from)) {
    out = cut(out, rule.from, rule.to);
  }

  const at = scopeEnd(out, scopeClass);

  if (at === -1) {
    return source;
  }

  const tail = (out.slice(0, at).match(/\n([^\S\n]*)$/) || [null, null])[1];
  const from = tail === null ? at : at - tail.length;

  return `${out.slice(0, from)}\n${moved}\n${tail ?? ''}${out.slice(at)}`;
}

/** Where the scope block's closing brace is, in the text as it stands now. */
function scopeEnd(css, scopeClass) {
  const block = scopeBlocks(css).find((node) => node.prelude.includes(scopeClass));

  return block ? block.bodyTo : (scopeBlocks(css)[0]?.bodyTo ?? -1);
}

function cut(css, from, to) {
  let start = from;
  let end = to;
  const lineStart = css.lastIndexOf('\n', start - 1) + 1;

  if (css.slice(lineStart, start).trim() === '') {
    start = lineStart;
  }

  while (css[end] === ' ' || css[end] === '\t') {
    end += 1;
  }

  if (css[end] === '\n') {
    end += 1;
  }

  return css.slice(0, start) + css.slice(end);
}

/** The indent the scope's own contents are written at. */
function innerIndent(css, scope) {
  const inner = css.slice(scope.bodyFrom, scope.bodyTo).match(/\n([^\S\n]+)\S/);

  if (inner) {
    return inner[1];
  }

  const own = (css.slice(0, scope.from).match(/\n([^\S\n]*)$/) || [null, ''])[1];

  return `${own}    `;
}

/** Re-indent a moved rule so it sits like the rules it lands among. */
function reindent(text, css, from, indent) {
  const was = (css.slice(0, from).match(/\n([^\S\n]*)$/) || [null, ''])[1];

  return text
    .split('\n')
    .map((line, i) => {
      if (i === 0) {
        return indent + line.trim();
      }

      return line.startsWith(was) ? indent + line.slice(was.length) : indent + line.trimStart();
    })
    .join('\n');
}
