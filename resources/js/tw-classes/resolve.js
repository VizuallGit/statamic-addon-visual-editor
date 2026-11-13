/**
 * tw-classes.js — colours, a component's parameters, the picked tag's value.
 * Split out of tw-classes.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. tw-classes.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { ask } from '../cp/bus.js';
import { readClassAttr } from '../tw-parse.js';
import { tagChoices, tagRefusal } from '../lib/tag-choices.js';
import { colorFor, cssFor } from '../tw-families.js';
import { callClassParam, fetchComponentClassParam, readCallParams } from '../component-props.js';
import { findClassTags, findPartials } from '../dock-partials.js';
import { previewDocument } from '../lib/preview-frame.js';
import { twState } from './state.js';
import { classTarget, model, render } from '../tw-classes.js';
import { closeTwMenu } from './menus.js';

/**
 * The colour a class actually paints.
 *
 * The catalog only knows a swatch when `@theme` holds a literal — and this
 * project writes `--color-primary-900: var(--primary-900)`, with the real
 * value in a file the theme endpoint never sees. So the chain is followed in
 * the preview document, which has the whole stylesheet loaded. Reads only:
 * computed styles of the root element, no element added and nothing changed.
 */
export const colorCache = new Map();

/**
 * The variable a declaration paints with — but only when it paints a colour.
 *
 * `padding: var(--spacing-100)` also holds a variable, and following that one
 * gave every spacing option an empty swatch next to it.
 */
const COLOR_PROPERTY = /(^|-)color$|^fill$|^stroke$/;

export function varName(css) {
  const text = String(css || '');
  const property = text.slice(0, text.indexOf(':')).trim();

  if (!COLOR_PROPERTY.test(property)) {
    return '';
  }

  return /var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(text)?.[1] || '';
}

export function resolveVarColor(win, name) {
  if (!name) {
    return '';
  }

  if (colorCache.has(name)) {
    return colorCache.get(name);
  }

  const doc = previewDocument(win);
  const root = doc?.documentElement;
  const view = doc?.defaultView;

  if (!root || !view) {
    return '';
  }

  let value = '';
  let key = name;

  // A custom property is not substituted until it is used, so `--color-x:
  // var(--x)` comes back as written. Follow it by hand, with a stop.
  for (let hop = 0; hop < 6 && key; hop += 1) {
    try {
      value = view.getComputedStyle(root).getPropertyValue(key).trim();
    } catch {
      return '';
    }

    if (!value) {
      return '';
    }

    key = varName(value);

    if (!key) {
      break;
    }
  }

  if (value && !value.startsWith('var(')) {
    colorCache.set(name, value);

    return value;
  }

  return '';
}

/** The catalog's swatch, or the one the preview can resolve. */
export function chipColor(win, name) {
  return colorFor(name, model) || resolveVarColor(win, varName(cssFor(name, model)));
}

export function nodeFor(row) {
  if (row.kind !== 'component') {
    return { from: row.from, openTo: row.openTo, path: row.path, tag: row.tag };
  }

  return {
    from: row.from,
    openTo: row.to,
    path: row.path,
    tag: row.label || 'component',
    component: true,
    // A tag with a class of its own (`{{ svg class="…" }}`), not a component
    // with a file: the class parameter is `class`, and nothing is fetched.
    tagCall: !!row.tagCall,
    src: row.src,
    param: undefined,
  };
}

/** The call as the file has it now — found again by where it starts, so a stale pick reads nothing. */
export function componentCall(html) {
  return (
    (twState.node.tagCall ? findClassTags(html) : findPartials(html)).find(
      (call) => call.from === twState.node.from && call.src === twState.node.src
    ) || null
  );
}

/**
 * Which parameter the picked call takes its classes in. The call's own wins —
 * it is what the page already says — and otherwise the component file is
 * asked what it reads.
 */
export function resolveComponentParam(win) {
  const html = ask('dock:html');
  const call = typeof html === 'string' ? componentCall(html) : null;
  const own = call ? callClassParam(html.slice(call.from, call.to)) : '';

  if (own) {
    twState.node.param = own;

    return;
  }

  // A tag's own class has no file to ask: the parameter is `class`.
  if (twState.node.tagCall) {
    twState.node.param = 'class';

    return;
  }

  if (twState.node.param !== undefined) {
    return;
  }

  const { from, src } = twState.node;

  // Asked again on every cursor move, so the answer is matched to the call,
  // not to the node object that was current when the fetch went out.
  void fetchComponentClassParam(win, src).then((name) => {
    if (
      twState.node?.component &&
      twState.node.from === from &&
      twState.node.src === src &&
      twState.node.param === undefined
    ) {
      twState.node.param = name || null;
      render(win);
    }
  });
}

/** The class attribute as it stands right now — `''` when the tag has none. */
export function currentValue() {
  if (classTarget && twState.node) {
    return { html: '', value: classTarget.value };
  }

  return tagValue();
}

/** The picked tag's own value in the file, whatever the pane is working on. */
export function tagValue() {
  const html = ask('dock:html');

  if (!twState.node || typeof html !== 'string') {
    return null;
  }

  if (twState.node.component) {
    const call = twState.node.param ? componentCall(html) : null;
    const param = call ? readCallParams(html.slice(call.from, call.to)).get(twState.node.param) : null;

    // `:class="…"` is an Antlers expression, not a list of classes.
    return !call || param?.bound ? null : { html, value: param ? param.value : '' };
  }

  // The dock can swap to another file between the tree's render and this
  // click. Offsets from the old one must not splice into the new: a tag
  // starts with `<`, and anything else means the pick is stale.
  if (html[twState.node.from] !== '<') {
    return null;
  }

  const attr = readClassAttr(html, twState.node.from, twState.node.openTo);

  return { html, value: attr ? attr.value : '' };
}

/**
 * The menu's words and rule for a tag: the tags it may become (lib/tag-choices.js)
 * and Custom, a name typed by hand, refused with a reason when it cannot be.
 */
export function tagMenuProps(win, tag, pick) {
  const current = String(tag || '').toLowerCase();

  return {
    label: t(win, 'tw_tag'),
    placeholder: t(win, 'tw_tag_placeholder'),
    customLabel: t(win, 'tw_tag_custom'),
    customPlaceholder: t(win, 'tw_tag_custom_placeholder'),
    current,
    tags: tagChoices(current),
    check: (name) => {
      const why = tagRefusal(current, name);

      return why ? t(win, `tw_tag_refused_${why}`) : '';
    },
    onPick: (name) => {
      pick(name);
      closeTwMenu(win);
    },
  };
}
