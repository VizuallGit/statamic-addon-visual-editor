/**
 * A Bard field in parts: each top-level block a person can point at on the
 * page — a heading, a paragraph, a list, a quote — so AI text can rewrite one
 * of them and leave the rest of the field, and its styling, as it was.
 *
 * Owner: AI text. Used by both of its halves: the preview (ai-text-bridge.js)
 * finds the parts on the page, the Control Panel (ai-text.js) finds the node
 * behind one in the field's value and writes that node alone.
 * May import: nothing. Pure.
 *
 * The value is the truth. A part on the page is only a pointer into it: its
 * tag, its words, and how many parts before it look the same (`nth`), so two
 * identical paragraphs are still two different nodes. Bard renders top-level
 * nodes in order, one element each, so tag and words find the node; a set or
 * an image between them renders as something else and is simply not a part.
 */

/** The elements a Bard field's top-level text renders as. */
export const PART_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'UL', 'OL', 'BLOCKQUOTE']);

/** Words as the page reads them: any run of white space one space. */
export function collapse(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * What a part and a node are matched by: their words with no white space at
 * all. A list's items run together in `textContent`, with or without the line
 * breaks the HTML had between its tags; the value has none. Only the words
 * have to agree.
 */
export function wordsKey(text) {
  return String(text ?? '').replace(/\s+/g, '');
}

/** The tag a top-level node renders as — `h2` for a level-2 heading — or null for what is not text (a set, an image, a rule). */
export function nodeTag(node) {
  switch (node?.type) {
    case 'heading':
      return `h${Math.min(6, Math.max(1, Number(node.attrs?.level) || 1))}`;
    case 'paragraph':
      return 'p';
    case 'bulletList':
      return 'ul';
    case 'orderedList':
      return 'ol';
    case 'blockquote':
      return 'blockquote';
    default:
      return null;
  }
}

/** A node's words run together, as an element's textContent reads them. */
export function nodeText(node) {
  if (!node || typeof node !== 'object') {
    return '';
  }

  if (typeof node.text === 'string') {
    return node.text;
  }

  return Array.isArray(node.content) ? node.content.map(nodeText).join('') : '';
}

/** A suggestion for a list as its items, one per line — a bullet or a number the AI wrote anyway is the list's to draw, not the item's. */
export function lines(text) {
  return String(text ?? '')
    .split(/\n+/)
    .map((line) => collapse(line.replace(/^\s*(?:[-*•–]|\d+[.)])\s+/, '')))
    .filter(Boolean);
}

/** The shape of copy a part asks for: a heading's one line, a list's items, or a paragraph. */
export function partKind(tag) {
  const name = String(tag || '').toLowerCase();

  if (/^h[1-6]$/.test(name)) {
    return 'heading';
  }

  return name === 'ul' || name === 'ol' ? 'list' : 'paragraph';
}

/** A list's items, one line each. */
function listLines(node) {
  return (node.content || []).filter((item) => item?.type === 'listItem').map((item) => collapse(nodeText(item)));
}

/** The part's text as the AI is given it: a list one item per line, anything else one line of words. */
export function partText(node) {
  return node?.type === 'bulletList' || node?.type === 'orderedList' ? listLines(node).join('\n') : collapse(nodeText(node));
}

/** Does the field hold any text? An empty one shows its placeholder on the page, and a suggestion fills the whole field. */
export function hasText(nodes) {
  return Array.isArray(nodes) && nodes.some((node) => nodeTag(node) && collapse(nodeText(node)) !== '');
}

/**
 * Where the node behind a part stands in the field's top-level nodes: the
 * `nth` one that renders as `tag` with these words. -1 when there is none —
 * the field changed since the page was drawn.
 */
export function findPart(nodes, part) {
  const tag = String(part?.tag || '').toLowerCase();
  const words = wordsKey(part?.text);
  const nth = Number(part?.nth) || 0;
  let seen = 0;

  for (let i = 0; i < (Array.isArray(nodes) ? nodes.length : 0); i++) {
    if (nodeTag(nodes[i]) === tag && wordsKey(nodeText(nodes[i])) === words) {
      if (seen === nth) {
        return i;
      }

      seen++;
    }
  }

  return -1;
}

/** Every text node in a node, however deep. */
function textNodes(node, out = []) {
  if (node && typeof node === 'object') {
    if (typeof node.text === 'string') {
      out.push(node);
    }

    (node.content || []).forEach((child) => textNodes(child, out));
  }

  return out;
}

/**
 * The marks every word of the node wears — a paragraph that is one link, a
 * heading that is all bold. Marks on only some words have no place in new
 * words, and are let go.
 */
function sharedMarks(node) {
  const runs = textNodes(node).filter((run) => run.text !== '');

  if (!runs.length) {
    return [];
  }

  const first = JSON.stringify(runs[0].marks || []);

  return runs.every((run) => JSON.stringify(run.marks || []) === first) ? runs[0].marks || [] : [];
}

/**
 * The node with new words, still what it was: a heading its level, a list its
 * kind with one item per line, a quote its paragraph — and the marks every old
 * word shared. Everything else in the field is the caller's to keep.
 */
export function withPartText(node, text) {
  const marks = sharedMarks(node);
  const run = (words) => (words ? [{ type: 'text', text: words, ...(marks.length ? { marks } : {}) }] : []);
  const block = (type, words, attrs) => {
    const content = run(words);

    return { type, ...(attrs ? { attrs } : {}), ...(content.length ? { content } : {}) };
  };
  const words = collapse(text);

  switch (node?.type) {
    case 'heading':
    case 'paragraph':
      return block(node.type, words, node.attrs);
    case 'blockquote':
      return { ...node, content: [block('paragraph', words)] };
    case 'bulletList':
    case 'orderedList':
      return { ...node, content: lines(text).map((line) => ({ type: 'listItem', content: [block('paragraph', line)] })) };
    default:
      return node;
  }
}
