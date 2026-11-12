/**
 * Which tags an element can be turned into — one rule for every tag menu:
 * Build's Content, the HTML tree's chip and the dock's tag button.
 *
 * The list offers what keeps the element what it is: a heading stays text, a
 * layout stays a layout. A heading never becomes a section; a link can stop
 * being one (it becomes text, never a heading). Anything else is Custom: a name
 * typed by hand, checked here (`tagRefusal`).
 *
 * May import: html-tree-parse.js (`isVoidTag`). Pure.
 */
import { isVoidTag } from '../html-tree-parse.js';

export const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
export const TEXT_TAGS = ['p', 'span', 'strong', 'b', 'em', 'small', 'blockquote'];
export const LINK_TAGS = ['a', 'button'];
export const LAYOUT_TAGS = [
  'div',
  'section',
  'article',
  'aside',
  'nav',
  'header',
  'footer',
  'main',
  'figure',
  'ul',
  'ol',
];
const INLINE_TEXT = ['p', 'span', 'strong', 'b', 'em', 'small'];
const ITEM_TAGS = ['li', 'div', 'p', 'span'];

/** The tags on the list for this tag — always the tag itself first among its own. */
export function tagChoices(tag) {
  const name = String(tag || '')
    .trim()
    .toLowerCase();

  if (!name) {
    return [];
  }

  if (HEADING_TAGS.includes(name)) {
    return [...HEADING_TAGS, ...TEXT_TAGS];
  }

  if (TEXT_TAGS.includes(name)) {
    return [...HEADING_TAGS, ...TEXT_TAGS, 'a'];
  }

  if (LINK_TAGS.includes(name)) {
    return [...LINK_TAGS, ...INLINE_TEXT];
  }

  if (LAYOUT_TAGS.includes(name)) {
    return LAYOUT_TAGS;
  }

  if (name === 'li') {
    return ITEM_TAGS;
  }

  return [name];
}

/** A name a tag may have: `section`, `my-card`. */
export const TAG_NAME = /^[a-z][a-z0-9-]*$/;

/**
 * Why `from` cannot become `to`, or '' when it can: 'name' — not a tag name;
 * 'void' — one has no closing tag and the other needs one, and the file would
 * come out broken (`<img>` → `<div>` with nothing to close it).
 */
export function tagRefusal(from, to) {
  const name = String(to || '')
    .trim()
    .toLowerCase();

  if (!TAG_NAME.test(name)) {
    return 'name';
  }

  return isVoidTag(from) !== isVoidTag(name) ? 'void' : '';
}
