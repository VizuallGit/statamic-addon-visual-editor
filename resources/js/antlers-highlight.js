/**
 * The HTML pane, coloured the way the HTML tree is.
 *
 * CodeMirror's HTML language paints every tag name one colour and knows
 * nothing of `{{ }}` — to it a template is one long run of text between tags,
 * so the logic that decides what the page is made of reads as the least
 * important thing in the file. This pass marks what the tree draws a row for,
 * in the tree's family colour (lib/tag-families.js): a `<section>` name in
 * the layout blue, an `<h2>` in the text rose, an `{{ if }}` in amber, a
 * loop in indigo, a `{{ partial }}` in the component green. What is left of
 * Antlers — a value, a tag with no block — keeps the one Antlers colour.
 *
 * A scan, not a parser, and the same finders the tree uses: findAntlersBlocks
 * says which `{{ }}` opens or closes a loop or a condition, findPartials which
 * is a call. The work is a few passes over the document when the document
 * changes. It runs in the Control Panel only: the preview never loads this
 * file, so nothing about the rendered page gets slower for it.
 *
 * May import: antlers-blocks.js, dock-partials.js (the finders), nothing
 * from the kernel.
 */
import { findAntlersBlocks } from './antlers-blocks.js';
import { findPartials } from './dock-partials.js';
import { tagFamily } from './lib/tag-families.js';

/** `{{# comment #}}` first, so it is not read as an ordinary tag. */
const ANTLERS = /\{\{#[\s\S]*?#\}\}|\{\{[\s\S]*?\}\}/g;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
/** A tag name, opening or closing; the name is what gets the colour. */
const TAG_NAME = /<(\/?)([A-Za-z][A-Za-z0-9-]*)/g;
const CLOSING = /^\{\{\s*(?:\/|endif\b|endunless\b)/;
const CLOSES_IF = /^\{\{\s*(?:\/\s*(?:if|unless)\b|endif\b|endunless\b)/;
const CLOSES_PARTIAL = /^\{\{\s*\/\s*partial\b/;

function inside(ranges, from, to) {
  return ranges.some((range) => from < range.to && to > range.from);
}

/**
 * Every `{{ }}` that opens, branches or closes a block the finder knows, by
 * the offset the tag starts at: 'loop' or 'if'. A close is found back from
 * the block's end, and only counts when what is there really is a closing
 * tag — a branch block ends where the next `{{ else }}` starts, and the tag
 * before that is whatever the branch held last.
 */
function blockFamilies(text) {
  const at = new Map();

  for (const block of findAntlersBlocks(text)) {
    const family = block.kind === 'loop' ? 'loop' : 'if';

    at.set(block.from, family);

    const closeFrom = text.lastIndexOf('{{', block.to - 2);

    // At, not after: an empty block closes exactly where its opening ends.
    if (closeFrom >= block.openTo && CLOSING.test(text.slice(closeFrom, block.to))) {
      at.set(closeFrom, family);
    }
  }

  for (const call of findPartials(text)) {
    at.set(call.from, 'component');
  }

  return at;
}

/**
 * What to colour, in document order, never overlapping.
 *
 * @returns {Array<{ from: number, to: number, cls: string }>}
 *   `cls` is `comment`, `antlers`, `antlers-close`, or `fam-<family>` —
 *   with `-close` appended on a closing Antlers tag.
 */
export function highlightRanges(source) {
  const text = String(source || '');
  const comments = [];
  const out = [];

  HTML_COMMENT.lastIndex = 0;

  let match;

  // Commented-out markup is what the tree's eye makes; it reads as hidden in
  // CodeMirror's own comment colour, so nothing in it gets a family.
  while ((match = HTML_COMMENT.exec(text))) {
    comments.push({ from: match.index, to: match.index + match[0].length });
  }

  const families = blockFamilies(text);
  const antlers = [];

  ANTLERS.lastIndex = 0;

  while ((match = ANTLERS.exec(text))) {
    const from = match.index;
    const to = from + match[0].length;
    const body = match[0];

    if (inside(comments, from, to)) {
      continue;
    }

    antlers.push({ from, to });

    if (body.startsWith('{{#')) {
      out.push({ from, to, cls: 'comment' });
      continue;
    }

    const closing = CLOSING.test(body);
    const family =
      families.get(from)
      || (closing && CLOSES_IF.test(body) ? 'if' : '')
      || (closing && CLOSES_PARTIAL.test(body) ? 'component' : '');

    // One mark per tag, never nested: the builder wants its ranges in order,
    // and a name inside a tag it has already been handed is not in order.
    out.push({
      from,
      to,
      cls: (family ? `fam-${family}` : 'antlers') + (closing ? '-close' : ''),
    });
  }

  TAG_NAME.lastIndex = 0;

  while ((match = TAG_NAME.exec(text))) {
    const from = match.index + 1 + match[1].length;
    const to = from + match[2].length;

    if (inside(comments, from, to) || inside(antlers, from, to)) {
      continue;
    }

    out.push({ from, to, cls: `fam-${tagFamily(match[2])}` });
  }

  out.sort((a, b) => a.from - b.from);

  return out;
}

function build(state, cm, markFor) {
  const builder = new cm.RangeSetBuilder();
  let last = 0;

  for (const range of highlightRanges(state.doc.toString())) {
    if (range.from < last) {
      continue;
    }

    builder.add(range.from, range.to, markFor(range.cls));
    last = range.to;
  }

  return builder.finish();
}

export function antlersDecorations(cm) {
  const marks = new Map();
  // The class names the dock's stylesheet knows (dock/layout.js). A closing
  // Antlers tag keeps `sve-cm-antlers-close` whatever its family, so every
  // close is held back the same way; an HTML tag name carries its family alone.
  const classesFor = (cls) => {
    if (cls === 'comment') {
      return 'sve-cm-antlers-comment';
    }

    if (cls === 'antlers') {
      return 'sve-cm-antlers';
    }

    if (cls === 'antlers-close') {
      return 'sve-cm-antlers sve-cm-antlers-close';
    }

    return cls.endsWith('-close')
      ? `sve-cm-${cls.slice(0, -'-close'.length)} sve-cm-antlers-close`
      : `sve-cm-${cls}`;
  };
  const markFor = (cls) => {
    if (!marks.has(cls)) {
      marks.set(cls, cm.Decoration.mark({ class: classesFor(cls) }));
    }

    return marks.get(cls);
  };

  const field = cm.StateField.define({
    create(state) {
      return build(state, cm, markFor);
    },
    update(value, tr) {
      return tr.docChanged ? build(tr.state, cm, markFor) : value;
    },
    provide: (self) => cm.EditorView.decorations.from(self),
  });

  return { extensions: [field] };
}
