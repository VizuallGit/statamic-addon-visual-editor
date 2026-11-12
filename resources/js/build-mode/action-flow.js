/**
 * An element's actions as Build's Action tab draws them: what its triggers
 * do, who follows a switch, and the library's patterns.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: alpine-behaviours.js, html-tree-parse.js, build-mode/alpine.js,
 * build-mode/place.js. Pure — strings in, strings out.
 * Bus messages: none.
 *
 * A statement is the one STATEMENT writes, an action is withAction's, an
 * attribute is withAlpineAttr's. The tab reads them back as chips and lets one
 * be changed or taken out. Tabs and Carousel switch between values, not on
 * and off: they write `tab = 2` / `x-show="tab === 2"` of their own, which
 * read back as written.
 */
import { ALPINE_BEHAVIOURS } from '../alpine-behaviours.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import {
  alpineAttrs,
  freeName,
  stateHolder,
  statesInScope,
  STATEMENT,
  withAction,
  withAlpineAttr,
  withoutAlpineAttr,
} from './alpine.js';
import { findByPath } from './place.js';

/** The dock's triggers, each once, in the dock's order: a trigger added there is a trigger here. */
export const TRIGGERS = [
  ...new Set(ALPINE_BEHAVIOURS.filter((item) => item.group === 'act').map((item) => item.attrs[0].name)),
];

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
export const DOES_BY_TRIGGER = {
  '@mouseleave': 'off',
  '@focusout': 'off',
  '@click.outside': 'off',
  '@keydown.escape.window': 'off',
  '@mouseenter': 'on',
  '@focusin': 'on',
};

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
  return (attrs || [])
    .filter((attr) => isEvent(attr.name))
    .flatMap((attr) =>
      String(attr.value)
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => ({ attr: attr.name, part, ...(statementOf(part) || { name: null, does: null }) }))
    );
}

/** `animate` is the Animation tab's switch binding (animation.js SWITCH_ATTRS): that tab writes and removes it. */
const FOLLOW = {
  'x-show': 'show',
  ':class': 'class_when',
  'x-bind:class': 'class_when',
  'x-text': 'text',
  ':data-anim-active': 'animate',
  'x-bind:data-anim-active': 'animate',
};
const mentions = (value, name) =>
  new RegExp(`(^|[^\\w$.'"])${name.replace(/\$/g, '\\$')}([^\\w$]|$)`).test(String(value));

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

    followsOn(alpineAttrs(html, node), [name]).forEach((follow) =>
      out.push({ path: node.path, tag: node.tag, label: node.label, ...follow })
    );
  });

  return out;
}

/** The statements one attribute on the element runs, or null when it has no such attribute. */
function partsOf(html, path, name) {
  const node = findByPath(parseTemplateTree(html), path);
  const attr = node && !node.kind ? alpineAttrs(html, node).find((a) => a.name === name) : null;

  return attr
    ? attr.value
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)
    : null;
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

  const next = parts.length
    ? withAlpineAttr(html, path, from.attr, join(parts))
    : withoutAlpineAttr(html, path, from.attr);

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
  { key: 'tabs', controls: 1, pick: 'panels', items: 1, write: withTabs },
  { key: 'carousel', controls: 2, pick: 'slides', items: 2, write: withCarousel },
];

/** The element children of the tag at `path`, by path. */
function childrenOf(html, path) {
  return (findByPath(parseTemplateTree(html), path)?.children || [])
    .filter((node) => !node.kind)
    .map((node) => node.path);
}

/** A value switch nothing in reach uses: `tab`, `tab2`, … */
function freeValue(html, paths, base) {
  const used = new Set(paths.flatMap((path) => statesInScope(html, path).map((state) => state.name)));
  let n = 1;

  while (used.has(n === 1 ? base : `${base}${n}`)) {
    n += 1;
  }

  return n === 1 ? base : `${base}${n}`;
}

/**
 * `name: first` where a switch for both lives (alpine.js `stateHolder`): in
 * the `x-data` there, or a new one. Null when only the file holds both, or the
 * `x-data` is not an object written out.
 */
function withValueState(html, a, b, name, first) {
  const holder = stateHolder(html, a, b);

  if (!holder) {
    return null;
  }

  if (!holder.data) {
    return withAlpineAttr(html, holder.node.path, 'x-data', `{ ${name}: ${first} }`);
  }

  const inner = /^\{([\s\S]*)\}$/.exec(String(holder.data.value).trim());

  if (!inner) {
    return null;
  }

  const body = inner[1].trim().replace(/,$/, '');

  return withAlpineAttr(
    html,
    holder.node.path,
    'x-data',
    body ? `{ ${body}, ${name}: ${first} }` : `{ ${name}: ${first} }`
  );
}

/** One more statement on the element's `@click`, beside the ones it runs. */
const withClick = (html, path, part) =>
  withAlpineAttr(html, path, '@click', join([...(partsOf(html, path, '@click') || []), part]));

/**
 * Tabs: the picked element's children are the tabs, the target's children
 * the panels, the first shown. Roles and `aria-selected` are the tabs' own,
 * so a screen reader hears tabs and `aria-selected:` styles the chosen one.
 */
export function withTabs(html, controls, panels) {
  const tabs = childrenOf(html, controls);
  const shown = childrenOf(html, panels);

  if (!tabs.length || !shown.length) {
    return null;
  }

  const name = freeValue(html, [controls, panels], 'tab');
  let next = withValueState(html, controls, panels, name, 1);

  if (next === null) {
    return null;
  }

  next = withAlpineAttr(next, controls, 'role', 'tablist');
  tabs.slice(0, shown.length).forEach((at, i) => {
    next = withAlpineAttr(
      withAlpineAttr(withClick(next, at, `${name} = ${i + 1}`), at, 'role', 'tab'),
      at,
      ':aria-selected',
      `${name} === ${i + 1}`
    );
  });
  shown.forEach((at, i) => {
    next = withAlpineAttr(withAlpineAttr(next, at, 'role', 'tabpanel'), at, 'x-show', `${name} === ${i + 1}`);
    next = i ? withAlpineAttr(next, at, 'x-cloak', '') : next;
  });

  return { html: next, name };
}

/**
 * A carousel: the picked element's first child goes back, its last goes on,
 * round the ends; any between are dots, one per slide. The target's children
 * are the slides, the first shown.
 */
export function withCarousel(html, controls, slides) {
  const buttons = childrenOf(html, controls);
  const shown = childrenOf(html, slides);
  const n = shown.length;

  if (buttons.length < 2 || n < 2) {
    return null;
  }

  const name = freeValue(html, [controls, slides], 'slide');
  let next = withValueState(html, controls, slides, name, 0);

  if (next === null) {
    return null;
  }

  next = withClick(next, buttons[0], `${name} = (${name} + ${n - 1}) % ${n}`);
  next = withClick(next, buttons.at(-1), `${name} = (${name} + 1) % ${n}`);
  buttons
    .slice(1, -1)
    .slice(0, n)
    .forEach((at, i) => {
      next = withAlpineAttr(withClick(next, at, `${name} = ${i}`), at, ':aria-current', `${name} === ${i}`);
    });
  shown.forEach((at, i) => {
    next = withAlpineAttr(next, at, 'x-show', `${name} === ${i}`);
    next = i ? withAlpineAttr(next, at, 'x-cloak', '') : next;
  });

  return { html: next, name };
}

/**
 * A pattern written between `trigger` and `target`, on a switch of its own:
 * `{ html, name }`, or null when no tag can hold the switch for both.
 */
export function withPattern(html, pattern, trigger, target) {
  if (pattern.write) {
    return pattern.write(html, trigger, target);
  }

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
