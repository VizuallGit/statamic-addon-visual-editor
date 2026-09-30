/**
 * The elements the HTML tree's plus writes into a template.
 *
 * A template is built from markup, not from sections: the plus asks which
 * element and puts it after the row the reader stands on, at that row's
 * level, indented like it — the way a builder adds the next block beside the
 * one picked. With nothing picked it goes at the end of the file.
 *
 * Plain elements. The dock's section button writes the attributes a page
 * section's partial needs (`id-{{ id }}`, `visual_edit`); a template is not a
 * section and has neither. Every element starts with an empty class list in
 * the dock's brackets, ready for the class strip.
 *
 * Pure — no editor, no bus — so the placement is tested on its own.
 *
 * May import: nothing.
 */

/** What the plus offers, in the order the menu lists them. */
export const TEMPLATE_TAGS = ['section', 'div', 'article', 'aside', 'nav', 'header', 'footer'];

/**
 * The page's sections, for a template that has none yet: the loop the pages
 * collection's own template draws them with, over one field
 * (`sections:page_sections`). The same four lines as `default.antlers.html`.
 */
export function sectionsLoop(field) {
  return [
    `{{ ${field} }}`,
    "    {{ _class = type | replace('/', '-') | replace('_', '-') }}",
    '    {{ partial src="partials/page_sections/{ type }" id="{{ id }}" :class="_class" :_class="_class" }}',
    `{{ /${field} }}`,
  ].join('\n');
}

/** `sections:<field>` → the field, else ''. */
export function sectionsFieldOf(tag) {
  const match = /^sections:([A-Za-z_][A-Za-z0-9_]*)$/.exec(String(tag || ''));

  return match ? match[1] : '';
}

/**
 * What one of them starts as: an empty element with a line to write in. A
 * section keeps the spacing it has always started with. `sections:<field>`
 * is the page's sections loop ({@link sectionsLoop}).
 */
export function templateElement(tag) {
  const field = sectionsFieldOf(tag);

  if (field) {
    return sectionsLoop(field);
  }

  const name = TEMPLATE_TAGS.includes(tag) ? tag : 'div';
  const classes = name === 'section' ? '[ ] py-800' : '[ ]';

  return `<${name} class="${classes}">\n    \n</${name}>`;
}

/**
 * The markup with a new element in it, and where that element starts:
 * `{ html, at }`.
 *
 * `after` is a tree row (`from`, `to`, and `wrapFrom`/`wrapTo` when the row is
 * wrapped, as a hidden one is in a comment): the element goes on the line
 * after it, indented as the row's own line is. Without one, or with offsets
 * the markup does not hold, it goes at the end, after a blank line.
 */
export function withTemplateElement(html, tag, after = null) {
  return withTemplateMarkup(html, templateElement(tag), after);
}

/**
 * The same placement, for markup that was not built from a tag — a paste
 * brought in through the import dialog.
 *
 * One way of putting a block into a template: the plus and the import both
 * come through here, so an element and a paste land in the same place, at the
 * same indent, and a fix to either is a fix to both.
 */
export function withTemplateMarkup(html, markup, after = null) {
  const source = String(html || '');
  const element = String(markup || '');
  const from = after ? after.wrapFrom ?? after.from : NaN;
  const to = after ? after.wrapTo ?? after.to : NaN;

  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to > source.length || from > to) {
    const head = `${source.replace(/\s+$/, '')}${source.trim() ? '\n\n' : ''}`;

    return { html: `${head}${element}\n`, at: head.length };
  }

  const lineStart = source.lastIndexOf('\n', from - 1) + 1;
  const lead = source.slice(lineStart, from);
  // Only whitespace in front of the row counts as its indent; a row that
  // shares its line with other markup lends none.
  const indent = /^[ \t]*$/.test(lead) ? lead : '';
  const block = element
    .split('\n')
    .map((line) => (line ? indent + line : line))
    .join('\n');

  return { html: `${source.slice(0, to)}\n${block}${source.slice(to)}`, at: to + 1 + indent.length };
}
