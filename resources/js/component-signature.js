/**
 * How a component is recognised in the rendered page.
 *
 * The server says. In Live Preview every partial that is not a page section
 * renders with `data-sve-component="<src>"` on its first content element
 * (PHP `ComponentMark`, through the `{{ sve_component }}` pair its preparser
 * puts around the file). A component is found by that mark alone — exactly
 * as a section is found by the `data-sid` its `{{ visual_edit }}` writes.
 *
 * It used to be a guess: the tag and the static classes on the first tag of
 * the component's file, read here and turned into a CSS selector. A root with
 * no static class (`<section id="id-{{ id }}" class="" {{ visual_edit }}>`)
 * gave no selector, so the dock's Instant paint never found that component;
 * and a class typed onto any root changed the guess before the page had it,
 * so the component was lost until the file was opened again. Nothing is read
 * off the file any more.
 *
 * An element that starts two components' renders — a card whose first tag is
 * the image component's — carries both srcs as tokens, so the match is `~=`.
 */

import { hasToken } from './dock-partials.js';

const VIEW_PREFIX = 'view:';
const PARTIALS = 'partials/';

/** The attribute the server writes — `ComponentMark::ATTR`; a test holds the two to the same spelling. */
export const COMPONENT_ATTR = 'data-sve-component';

/** `view:partials/components/card` → `components/card`. Anything that is not a view → null. */
export function componentSrcFromType(type) {
  const value = String(type || '');

  if (!value.startsWith(VIEW_PREFIX)) {
    return null;
  }

  const view = value.slice(VIEW_PREFIX.length);

  return view.startsWith(PARTIALS) ? view.slice(PARTIALS.length) : view;
}

/**
 * The selector for every place a component renders, by the src its call
 * names — or null for no src, and for a call the server cannot have marked
 * as one file (`blocks/{type}` is a folder: the block decides which).
 */
export function componentSelector(src) {
  const value = String(src || '').trim();

  if (!value || /\{\s*[A-Za-z_][A-Za-z0-9_]*\s*\}/.test(value)) {
    return null;
  }

  return `[${COMPONENT_ATTR}~="${value.replace(/["\\]/g, '\\$&')}"]`;
}
