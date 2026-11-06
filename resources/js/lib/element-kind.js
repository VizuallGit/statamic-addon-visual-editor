/**
 * What an element in a template is, in a designer's words: a Heading, a
 * Container, Column 2.
 *
 * Owner: Build mode (its panel's names). The HTML tree names a row by its
 * given name or first class instead (6 Nov 2026, the owner's call).
 * May import: tw-parse.js, lib/container-widths.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * Read from the file, so markup written by hand is named the same way as
 * markup Build wrote.
 */

import { readClassAttr } from '../tw-parse.js';
import { containerBase } from './container-widths.js';

const has = (classes, name) => String(classes || '').split(/\s+/).includes(name);

/**
 * A tree row (parseTemplateTree) and its class attribute → what it is:
 * `section`, `container`, `columns`, `column`, `grid`, `flex`, `div`,
 * `heading`, `text`, `button`, `link`, `image`, `video`, `list`, `divider`,
 * `component`, `svg`, `loop`, `if`, or `tag` (named by its tag).
 *
 * Columns are a grid whose children are all plain divs; a column is one of
 * them.
 */
export function elementKind(node, classes = '', parent = null, parentClasses = '') {
  if (!node) {
    return '';
  }

  if (node.kind === 'component' || node.kind === 'svg') {
    return node.kind;
  }

  if (node.kind === 'antlers') {
    return node.antlers === 'loop' ? 'loop' : 'if';
  }

  const tag = String(node.tag || '').toLowerCase();

  if (parent && isColumns(parent, parentClasses)) {
    return 'column';
  }

  if (tag === 'section') {
    return 'section';
  }

  if (tag === 'div') {
    // `container`, as Build writes one — or `wrapper`, as one was written before.
    if (containerBase(String(classes || '').split(/\s+/))) {
      return 'container';
    }

    if (isColumns(node, classes)) {
      return 'columns';
    }

    if (has(classes, 'grid')) {
      return 'grid';
    }

    return has(classes, 'flex') ? 'flex' : 'div';
  }

  if (/^h[1-6]$/.test(tag)) {
    return 'heading';
  }

  if (tag === 'a') {
    return has(classes, 'btn') ? 'button' : 'link';
  }

  return { p: 'text', img: 'image', video: 'video', ul: 'list', ol: 'list', hr: 'divider' }[tag] || 'tag';
}

function isColumns(node, classes) {
  const kids = node?.children || [];

  return (
    String(node?.tag || '').toLowerCase() === 'div' &&
    has(classes, 'grid') &&
    /(^|\s)grid-cols-/.test(String(classes || '')) &&
    kids.length > 0 &&
    kids.every((kid) => String(kid.tag || '').toLowerCase() === 'div' && !kid.kind)
  );
}

/** A row's class attribute as the file writes it; '' for a loop, a condition or a component. */
export function classesOf(source, node) {
  return node && node.openTo != null && !node.kind ? readClassAttr(source, node.from, node.openTo)?.value || '' : '';
}

/** A row's place among its plain-tag siblings, from 1 — Column 2 is the second. */
export function siblingIndex(roots, parent, node) {
  return (parent ? parent.children : roots).filter((row) => !row.kind || row.kind === node.kind).indexOf(node) + 1;
}
