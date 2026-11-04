/**
 * An element's actions as Build's Action tab draws them: what its triggers
 * do, who follows a switch, and the library's patterns.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: alpine-behaviours.js, html-tree-parse.js, build-mode/alpine.js,
 * build-mode/place.js. Pure — strings in, strings out.
 * Bus messages: none.
 *
 * Nothing here writes Alpine of its own: a statement is the one STATEMENT
 * writes, an action is withAction's, an attribute is withAlpineAttr's. The tab
 * only reads them back as chips and lets one be changed or taken out.
 */
import { ALPINE_BEHAVIOURS } from '../alpine-behaviours.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import { alpineAttrs, freeName, STATEMENT, withAction, withAlpineAttr, withoutAlpineAttr } from './alpine.js';
import { findByPath } from './place.js';

/** The dock's triggers, each once, in the dock's order: a trigger added there is a trigger here. */
export const TRIGGERS = [...new Set(ALPINE_BEHAVIOURS.filter((item) => item.group === 'act').map((item) => item.attrs[0].name))];

/** [lang key, icons.js name] for each trigger. */
export const TRIGGER_WORDS = {
  '@click': ['action_click', 'cursor'],
  '@mouseenter': ['action_enter', 'mouseIn'],
  '@mouseleave': ['action_leave', 'mouseOut'],
  '@focusin': ['action_focus', 'focusIn'],
  '@focusout': ['action_blur', 'focusOut'],
  '@click.outside': ['action_outside', 'clickOut'],
  '@keydown.escape.window': ['action_escape', 'keyEsc'],
};

/** What a trigger does by default: leaving and Escape turn off, entering turns on, the rest toggles. */
export const DOES_BY_TRIGGER = { '@mouseleave': 'off', '@focusout': 'off', '@click.outside': 'off', '@keydown.escape.window': 'off', '@mouseenter': 'on', '@focusin': 'on' };

/** What can follow a switch: the dock's react behaviours that take a name. */
export const THENS = ALPINE_BEHAVIOURS.filter((item) => item.group === 'react' && item.needsName);

/** A step of a pattern that only turns the switch, with nothing following it. */
const NOTHING = { id: 'nothing', attrs: [] };

const STATEMENT_RE = /^([A-Za-z_$][\w$]*)\s*=\s*(?:!\s*\1|true|false)$/;
const isEvent = (name) => name.startsWith('@') || name.startsWith('x-on:');

/** `open = !open` → toggle, `open = true` → on, `open = false` → off; null for any other statement. */
export function statementOf(part) {
  const match = STATEMENT_RE.exec(String(part).trim());

  if (!match) {
    return null;
  }

  return { name: match[1], does: /=\s*!/.test(part) ? 'toggle' : /true$/.test(part.trim()) ? 'on' : 'off' };
}

/**
 * Every statement the element's triggers run, in the file's order:
 * `{ attr, part, name, does }`. `name` and `does` are null for a statement
 * Action does not write (`$dispatch('x')`): it shows as written.
 */
export function actionsOn(attrs) {
  return (attrs || []).filter((attr) => isEvent(attr.name)).flatMap((attr) => String(attr.value)
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => ({ attr: attr.name, part, ...(statementOf(part) || { name: null, does: null }) })));
}

const FOLLOW = { 'x-show': 'show', ':class': 'class_when', 'x-bind:class': 'class_when', 'x-text': 'text' };
const mentions = (value, name) => new RegExp(`(^|[^\\w$.'"])${name.replace(/\$/g, '\\$')}([^\\w$]|$)`).test(String(value));

/**
 * What the element does because of a switch in `names`: `{ attr, name, then }`,
 * `then` a react behaviour's id. An `x-show` beside `x-transition` is the
 * smooth one.
 */
export function followsOn(attrs, names) {
  const smooth = (attrs || []).some((attr) => attr.name === 'x-transition' || attr.name.startsWith('x-transition:'));

  return (attrs || []).flatMap((attr) => {
    const then = FOLLOW[attr.name];
    const name = then ? names.find((n) => mentions(attr.value, n)) : null;

    return name ? [{ attr: attr.name, name, then: then === 'show' && smooth ? 'show_smooth' : then }] : [];
  });
}

function walk(nodes, visit) {
  for (const node of nodes || []) {
    visit(node);
    walk(node.children, visit);
  }
}

/** The elements that follow `name` inside the tag holding it: `{ path, tag, label, attr, then }`. */
export function followersOf(html, holderPath, name) {
  const holder = findByPath(parseTemplateTree(html), holderPath);
  const out = [];

  walk(holder ? [holder] : [], (node) => {
    if (node.kind) {
      return;
    }

    followsOn(alpineAttrs(html, node), [name]).forEach((follow) => out.push({ path: node.path, tag: node.tag, label: node.label, ...follow }));
  });

  return out;
}

/** The statements one attribute on the element runs, or null when it has no such attribute. */
function partsOf(html, path, name) {
  const node = findByPath(parseTemplateTree(html), path);
  const attr = node && !node.kind ? alpineAttrs(html, node).find((a) => a.name === name) : null;

  return attr ? attr.value.split(';').map((part) => part.trim()).filter(Boolean) : null;
}

/** Statements in one attribute, each once, as withAction joins them. */
const join = (parts) => [...new Set(parts)].join('; ');

/**
 * One statement changed, moved to another trigger or taken out: `from` is
 * `{ attr, part }` as actionsOn read it, `to` the same with the new trigger
 * or statement, or null to take it out. A changed one keeps its place among
 * the others; an attribute left with none goes.
 */
export function withStatement(html, path, from, to) {
  const parts = partsOf(html, path, from.attr);
  const at = parts ? parts.indexOf(from.part) : -1;

  if (at === -1) {
    return html;
  }

  if (to && to.attr === from.attr) {
    parts.splice(at, 1, to.part);

    return withAlpineAttr(html, path, from.attr, join(parts));
  }

  parts.splice(at, 1);

  const next = parts.length ? withAlpineAttr(html, path, from.attr, join(parts)) : withoutAlpineAttr(html, path, from.attr);

  return to ? withAlpineAttr(next, path, to.attr, join([...(partsOf(next, path, to.attr) || []), to.part])) : next;
}

/** A statement as Action writes it. */
export const statement = (does, name) => STATEMENT[does](name);

/**
 * The library's patterns. Each is a few actions from the list Action already
 * has, between the picked element (`trigger`) and the one picked next
 * (`target`): a popup is a click that toggles it, and a click outside and
 * Escape that turn it off.
 */
export const PATTERNS = [
  {
    key: 'popup',
    steps: [
      { on: 'trigger', when: '@click', does: 'toggle', then: 'show_smooth' },
      { on: 'target', when: '@click.outside', does: 'off' },
      { on: 'target', when: '@keydown.escape.window', does: 'off' },
    ],
  },
  {
    key: 'dropdown',
    steps: [
      { on: 'trigger', when: '@click', does: 'toggle', then: 'show' },
      { on: 'target', when: '@click.outside', does: 'off' },
      { on: 'target', when: '@keydown.escape.window', does: 'off' },
    ],
  },
  { key: 'accordion', steps: [{ on: 'trigger', when: '@click', does: 'toggle', then: 'show' }] },
  {
    key: 'menu',
    steps: [
      { on: 'trigger', when: '@click', does: 'toggle', then: 'show_smooth' },
      { on: 'target', when: '@keydown.escape.window', does: 'off' },
    ],
  },
  { key: 'more', steps: [{ on: 'trigger', when: '@click', does: 'toggle', then: 'show_smooth' }] },
  {
    key: 'tooltip',
    steps: [
      { on: 'trigger', when: '@mouseenter', does: 'on', then: 'show_smooth' },
      { on: 'trigger', when: '@mouseleave', does: 'off' },
      { on: 'trigger', when: '@focusin', does: 'on' },
      { on: 'trigger', when: '@focusout', does: 'off' },
    ],
  },
  { key: 'tabs', later: true },
  { key: 'carousel', later: true },
];

/**
 * A pattern written between `trigger` and `target`, on a switch of its own:
 * `{ html, name }`, or null when no tag can hold the switch for both.
 */
export function withPattern(html, pattern, trigger, target) {
  const name = freeName(html, [trigger, target]);
  let next = html;

  for (const step of pattern.steps) {
    const at = step.on === 'target' ? target : trigger;

    next = withAction(next, {
      trigger: at,
      target,
      when: step.when,
      does: step.does,
      name,
      then: step.then ? THENS.find((item) => item.id === step.then) : NOTHING,
    });

    if (next === null) {
      return null;
    }
  }

  return { html: next, name };
}
