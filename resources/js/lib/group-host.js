/**
 * The element around a pick that repeats — the card, the list item — and the
 * two things that go on it so one card answers on its own, not the whole
 * section: the `group` a `group-hover` class answers to, and the `x-data` an
 * Action's switch lives in.
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
 * An element repeats when a sibling of the same tag and the same first class
 * stands beside it (`li.card` beside `li.card`, two bare `<div>` columns), or
 * it stands straight inside a loop — `{{ collection }}`, or a `<template x-for>`
 * — one in the file, many on the page. A condition (`{{ if }}`) is
 * see-through: what it holds counts as its parent's children. The walk up
 * stops at a <section>, <main>, <body> or <html>: sections stand side by side
 * on a layout, so they are never taken as a repeat.
 *
 * `group` (groupHost): up from the pick's parent — the pick's own siblings do
 * not count — the first element that wears `group` or repeats. A section's own
 * `group` (a Data state's) is not taken: it would answer to the pointer
 * anywhere in the section. Nothing repeats: the pick's own parent.
 *
 * `x-data` (stateHost): up from the nearest element holding both the trigger
 * and what follows it, the first element that has an `x-data` or repeats.
 * Nothing repeats: the section — one switch for the whole section, so a button
 * anywhere in it reaches a panel anywhere in it. No section in the file (a
 * header, a component): its outermost element holding both.
 *
 * Owner: shared by the dock's Tailwind pane and Build's Style (tw-classes.js,
 * the State menu) and Build's Action (build-mode/alpine.js) — one rule.
 * May import: html-tree-parse.js, tw-parse.js. Pure — no editor, no bus, no DOM.
 */
import { parseTemplateTree } from '../html-tree-parse.js';
import { readClassAttr, tokenizeClassValue } from '../tw-parse.js';

/** Where the walk stops: never taken as a repeat. */
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

/** A `<template x-for>`: what stands in it is drawn once per item. */
function isTemplateLoop(source, node) {
  return isTag(node) && tagOf(node) === 'template' && /\sx-for\s*=/.test(source.slice(node.from, node.openTo));
}

/** Whether `chain[i]` repeats: straight inside a loop, or beside a sibling of its tag and first class. */
function repeats(source, chain, i, roots) {
  const self = chain[i];
  let j = i - 1;

  while (j >= 0 && seeThrough(chain[j])) {
    j--;
  }

  const parent = j >= 0 ? chain[j] : null;

  if (parent && (isLoop(parent) || isTemplateLoop(source, parent))) {
    return true;
  }

  return openConditions(parent ? parent.children : roots).some(
    (other) => other !== self && isTag(other) && tagOf(other) === tagOf(self) && (other.klass || '') === (self.klass || '')
  );
}

/**
 * Up `chain` (root first) from index `from`: `{ host }` — the first tag that
 * `held` says is the one, or that repeats — or `{ stop, below }`: the first
 * section/main/body/html met, and the outermost tag passed before it. `{ below }`
 * alone when the top of the file was reached.
 */
function climb(source, roots, chain, from, held) {
  let below = null;

  for (let i = from; i >= 0; i--) {
    const el = chain[i];

    if (!isTag(el)) {
      continue;
    }

    if (STOP.has(tagOf(el))) {
      return { stop: el, below };
    }

    if (held(el) || repeats(source, chain, i, roots)) {
      return { host: el };
    }

    below = el;
  }

  return { below };
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

  const { host } = climb(source, roots, chain, chain.length - 2, (el) => hasGroup(source, el));
  const parent = chain.slice(0, -1).reverse().find(isTag);

  return host ? host.from : parent ? parent.from : null;
}

/**
 * Where an Action's switch lives (build-mode/alpine.js): `chain` is the file's
 * parsed nodes (`roots`, parseTemplateTree) from the top down to the nearest
 * element holding both the trigger and what follows it — loops and conditions
 * included. The first element up from there that `hasData` (an `x-data`
 * already there) or that repeats; else the section; else, with no section
 * above, the outermost element holding both. Null when no tag holds both.
 */
export function stateHost(html, roots, chain, hasData) {
  const source = String(html || '');
  const { host, stop, below } = climb(source, roots, chain || [], (chain || []).length - 1, hasData);

  if (host) {
    return host;
  }

  // A layout's <main>, <body> or <html>: the element under it holding both, else it.
  return stop && (tagOf(stop) === 'section' || !below) ? stop : below;
}
