/**
 * Which tags an element can be turned into from Content's tag menu.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Pure.
 * Bus messages: none.
 *
 * Text is one family: a heading can become a paragraph, a paragraph a span.
 * Layout is another. What is neither has no menu: an image is an image, a link
 * a link, a list item stays in its list.
 */

export const TEXT_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'strong', 'em', 'small', 'blockquote'];
export const LAYOUT_TAGS = ['div', 'section', 'article', 'aside', 'nav', 'header', 'footer', 'main', 'figure'];

/** @returns {string[]} the tags on offer for this tag; empty when it has no menu */
export function tagChoices(tag) {
  const name = String(tag || '').toLowerCase();

  if (TEXT_TAGS.includes(name)) {
    return TEXT_TAGS;
  }

  return LAYOUT_TAGS.includes(name) ? LAYOUT_TAGS : [];
}
