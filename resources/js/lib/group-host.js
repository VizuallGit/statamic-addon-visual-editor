/**
 * Where a `group-hover` / `group-focus` class finds its `group`: the element
 * around the pick that repeats — the card, the list item — so hovering one
 * card answers in that card, not in the whole section.
 *
 *   <ul>
 *     <li class="card">                          ← `group`: a sibling <li class="card"> stands beside it
 *       <div>
 *         <h3 class="group-hover:underline">    ← the pick
 *       </div>
 *       <img>
 *     </li>
 *     <li class="card">…</li>
 *
 * Up from the pick's parent, the first element that
 *  - already wears `group` — nothing to write, it is the one; or
 *  - repeats: a sibling of the same tag and the same first class (`li.card`
 *    beside `li.card`, two bare `<div>` columns), or it stands straight inside
 *    a loop (`{{ collection }}` — one in the file, many on the page).
 * The pick's own siblings do not count: only the elements it stands in.
 * A condition (`{{ if }}`) is see-through — what it holds counts as its
 * parent's children. The walk stops at a <section>, <main> or <body>: sections
 * stand side by side on a layout, and a section's `group` (a Data state's)
 * would answer to the pointer anywhere in it. Nothing repeats: the pick's own
 * parent, as before there was a rule.
 *
 * Owner: shared by the dock's Tailwind pane and Build's Style (tw-classes.js,
 * the State menu) — one engine.
 * May import: html-tree-parse.js, tw-parse.js. Pure — no editor, no bus, no DOM.
 */
import { parseTemplateTree } from '../html-tree-parse.js';
import { readClassAttr, tokenizeClassValue } from '../tw-parse.js';

/** Where the walk stops: never taken as a repeat, and a `group` on them is not the pick's. */
const STOP = new Set(['section', 'main', 'body', 'html']);

/** The states that answer to a `group` around the pick. */
export const GROUP_STATES = ['group-hover', 'group-focus'];

const isTag = (node) => !node.kind;
const isLoop = (node) => node.kind === 'antlers' && node.antlers === 'loop';
const seeThrough = (node) => node.kind === 'antlers' && node.antlers !== 'loop';
const tagOf = (node) => String(node.tag || '').toLowerCase();

/** The nodes from the root down to the tag starting at `at`, that tag last; null when no tag starts there. */
function chainTo(nodes, at, chain = []) {
  for (const node of nodes || []) {
    if (isTag(node) && node.from === at) {
      return [...chain, node];
    }

    if (at > node.from && at < node.to) {
      const found = chainTo(node.children, at, [...chain, node]);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

/** A list of nodes with every condition opened: what it holds stands in its place. */
function openConditions(nodes) {
  return (nodes || []).flatMap((node) => (seeThrough(node) ? openConditions(node.children) : [node]));
}

function hasGroup(source, node) {
  const value = readClassAttr(source, node.from, node.openTo)?.value || '';

  return tokenizeClassValue(value).some((token) => token.text === 'group');
}

/** Whether `chain[i]` repeats: straight inside a loop, or beside a sibling of its tag and first class. */
function repeats(chain, i, roots) {
  const self = chain[i];
  let j = i - 1;

  while (j >= 0 && seeThrough(chain[j])) {
    j--;
  }

  const parent = j >= 0 ? chain[j] : null;

  if (parent && isLoop(parent)) {
    return true;
  }

  return openConditions(parent ? parent.children : roots).some(
    (other) => other !== self && isTag(other) && tagOf(other) === tagOf(self) && (other.klass || '') === (self.klass || '')
  );
}

/**
 * Where the tag starting at `at` in `html` finds the `group` its
 * `group-hover:` / `group-focus:` classes answer to: the start of that element
 * (lib/data-states.js `withGroup` writes it), or null when the tag has no
 * element around it.
 */
export function groupHost(html, at) {
  const source = String(html || '');
  // One parse: a sibling is told from the pick by identity.
  const roots = parseTemplateTree(source);
  const chain = chainTo(roots, at);

  if (!chain) {
    return null;
  }

  let parent = null;

  for (let i = chain.length - 2; i >= 0; i--) {
    const el = chain[i];

    if (!isTag(el)) {
      continue;
    }

    parent ??= el;

    if (STOP.has(tagOf(el))) {
      break;
    }

    if (hasGroup(source, el) || repeats(chain, i, roots)) {
      return el.from;
    }
  }

  return parent ? parent.from : null;
}
