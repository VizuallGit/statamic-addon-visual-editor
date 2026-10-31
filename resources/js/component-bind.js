/**
 * Binding a field to an element you point at in Live Preview.
 *
 * Declaring a field and using it are two separate jobs today: you add
 * `headline` in the panel, and then you go and type `{{ headline }}` into the
 * markup yourself. This closes that gap — press the target on a field, click
 * the heading in the preview, and the markup is rewritten to read from the
 * field with the text that was there kept as its default.
 *
 * It reuses the pick mode the HTML tree already has. That mode stamps every
 * element in the preview with the path of the row it came from and reports a
 * click back as that path, so the only new part here is what happens to the
 * path once it arrives.
 */

import { ask } from './cp/bus.js';
import { t } from './lib/i18n.js';
import { closingTagIndex } from './html-tree-edit.js';
import { isVoidTag, parseTemplateTree } from './html-tree-parse.js';

/** The elements whose content is an address, not text between two tags. */
const SRC_TAGS = ['img', 'source', 'video', 'audio', 'iframe', 'embed'];

let armed = null;
let unkey = null;

export function componentBindHandle() {
  return armed?.handle || '';
}

/**
 * Escape puts the target away.
 *
 * Pick mode changes what a click in the preview does, so leaving it armed with
 * no way out but picking something would be a trap — the editor would look
 * broken until you guessed which button had done it.
 */
function watchEscape(win) {
  const onKey = (event) => {
    if (event.key !== 'Escape' || !armed) {
      return;
    }

    // The Escape is the target's: it does not also let go of the element picked.
    event.stopPropagation();
    cancelComponentBind(win);
  };

  win.document.addEventListener('keydown', onKey, true);
  unkey = () => win.document.removeEventListener('keydown', onKey, true);
}

/** The target put away, as Escape does; true when there was one. Build's canvas has its own keys and asks here first. */
export function cancelComponentBind(win) {
  if (!armed) {
    return false;
  }

  const done = armed.onChange;

  disarmComponentBind(win);
  done?.();

  return true;
}

/**
 * Point at something for this field. Pressing the same field again puts the
 * target away, which is the only way out that does not require picking
 * something you did not want.
 */
export function armComponentBind(win, prop, onChange) {
  const handle = String(prop?.handle || '');

  if (!handle || armed?.handle === handle) {
    disarmComponentBind(win);

    return;
  }

  disarmComponentBind(win);
  armed = { handle, type: prop.type || 'text', onChange };
  watchEscape(win);

  // The tree owns pick mode, and it is a panel that loads when it is opened —
  // which it need not be for this. Pulling it in is what makes the target work
  // with nothing but the left column on screen.
  void import('./html-tree.js')
    .then(() => {
      if (armed?.handle === handle) {
        ask('html-tree:arm-pick', true);
      }
    })
    .catch(() => {});
}

/**
 * Point at an element for something that is not a prop: Build's Action picking
 * what follows a click. The same click, Escape and tree row as a prop's target.
 * `onPath(path)` answers false to stay armed; `onCancel` is Escape.
 */
export function armElementPick(win, onPath, onCancel) {
  disarmComponentBind(win);
  armed = { handle: '@element', onPath, onChange: onCancel };
  watchEscape(win);
  void import('./html-tree.js')
    .then(() => {
      if (armed?.onPath === onPath) {
        ask('html-tree:arm-pick', true);
      }
    })
    .catch(() => {});
}

export function disarmComponentBind(win) {
  if (!armed) {
    return;
  }

  armed = null;
  unkey?.();
  unkey = null;
  ask('html-tree:arm-pick', false);
}

/**
 * An element chosen for the field that is waiting for one — from a click in
 * the preview, or from a row in the HTML tree. Both arrive as a path, because
 * that is the one name an element has in both places.
 *
 * Returns false when the click was not for us, so the tree's own "select the
 * row I clicked" keeps working untouched — the rest of the time, and also when
 * what was clicked is not something a field can fill. Pointing at a loop and
 * having the target quietly switch off would read as the feature being broken.
 */
export function componentBindPick(win, path) {
  if (!armed || !path) {
    return false;
  }

  if (armed.onPath) {
    if (armed.onPath(path) !== false) {
      disarmComponentBind(win);
    }

    return true;
  }

  const prop = armed;
  const done = armed.onChange;
  const html = ask('dock:html');

  if (typeof html !== 'string' || !html || ask('dock:is-locked') === true) {
    disarmComponentBind(win);
    done?.();

    return true;
  }

  const node = findByPath(parseTemplateTree(html), path);

  // A condition, a loop or another component is not a tag with a body of its
  // own to hand over. Still armed afterwards: the next row might be.
  if (!node || node.kind === 'antlers' || node.kind === 'component') {
    return false;
  }

  const media = prop.type === 'media' && wantsSrc(node);

  // No words of its own to hand over. Still armed: the next one might have.
  if (!media && isVoidTag(node.tag)) {
    win.Statamic?.$toast?.error(t(win, 'component_props_bind_void'));

    return false;
  }

  const written = media ? bindToSrc(html, node, prop) : bindToBody(html, node, prop);

  // Still armed, and the file as it was.
  if (written?.computed) {
    win.Statamic?.$toast?.error(t(win, 'component_props_bind_computed'));

    return false;
  }

  if (written) {
    ask('dock:set-html', written.html);
    rememberDefault(win, prop.handle, written.was);
  }

  disarmComponentBind(win);
  done?.();

  return true;
}

function wantsSrc(node) {
  return SRC_TAGS.includes(String(node.tag || '').toLowerCase()) || isVoidTag(node.tag);
}

/**
 * Everything between the tags becomes the field.
 *
 * The whole body, not an added line: pointing at a heading means that heading
 * says what the field says. What was there is not thrown away — it comes back
 * as the field's default, so the component still renders the same thing when
 * nobody fills it in.
 */
function bindToBody(html, node, prop) {
  const close = closingTagIndex(html, node);

  if (close < node.openTo) {
    return null;
  }

  const was = html.slice(node.openTo, close);
  const tag = `{{ props_${prop.handle} }}`;

  if (was.trim() === tag) {
    return null;
  }

  return {
    html: html.slice(0, node.openTo) + tag + html.slice(close),
    was,
  };
}

/** Where a quoted value ends, past any `{{ … }}` in it: a tag may hold quotes of its own. */
function valueEnd(open, at) {
  const quote = open[at];

  for (let i = at + 1; i < open.length; i += 1) {
    if (open.startsWith('{{', i)) {
      const end = open.indexOf('}}', i);

      if (end < 0) {
        return -1;
      }

      i = end + 1;
    } else if (open[i] === quote) {
      return i;
    }
  }

  return -1;
}

/** Every `src` an opening tag writes, each with where its value stands. */
function srcValues(open) {
  const out = [];
  let i = open.search(/\s/);

  while (i >= 0 && i < open.length) {
    if (open.startsWith('{{', i)) {
      const end = open.indexOf('}}', i);

      if (end < 0) {
        break;
      }

      i = end + 2;
      continue;
    }

    const attr = /^([^\s=>"'{}]+)\s*=\s*["']/.exec(open.slice(i));

    if (!attr) {
      i += 1;
      continue;
    }

    const from = i + attr[0].length - 1;
    const end = valueEnd(open, from);

    if (end < 0) {
      break;
    }

    if (attr[1].toLowerCase() === 'src') {
      out.push({ from, to: end + 1, value: open.slice(from + 1, end) });
    }

    i = end + 1;
  }

  return out;
}

/**
 * An image points somewhere, so the field is what it points at.
 *
 * An address the file works out — a `{{ glide }}`, a `src` for each branch of a
 * condition — is left alone and answered `{ computed: true }`: a field written
 * over it would take the file's own work away, as in components/image.
 */
export function bindToSrc(html, node, prop) {
  const open = html.slice(node.from, node.openTo);
  const tag = `{{ props_${prop.handle} }}`;
  const values = srcValues(open);

  if (values.length === 1 && values[0].value.trim() === tag) {
    return null;
  }

  if (values.length > 1 || values[0]?.value.includes('{{')) {
    return { computed: true };
  }

  if (values.length) {
    const from = node.from + values[0].from;

    return {
      html: html.slice(0, from) + `"${tag}"` + html.slice(node.from + values[0].to),
      was: values[0].value,
    };
  }

  const name = /^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(open);

  if (!name) {
    return null;
  }

  const at = node.from + name[0].length;

  return {
    html: `${html.slice(0, at)} src="${tag}"${html.slice(at)}`,
    was: '',
  };
}

/**
 * What the element used to say becomes the field's default — but only if the
 * field has nothing to fall back on yet. A default someone typed on purpose is
 * not something a click somewhere else should overwrite.
 */
function rememberDefault(win, handle, was) {
  const text = String(was || '')
    .replace(/\{\{[\s\S]*?\}\}/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return;
  }

  const props = ask('dock:props') || [];
  const at = props.findIndex((prop) => prop.handle === handle);

  if (at === -1 || String(props[at].default || '').trim() !== '') {
    return;
  }

  const next = props.map((prop, index) => (index === at ? { ...prop, default: text } : prop));

  ask('dock:set-props', { win, props: next });
}

function findByPath(nodes, path) {
  for (const node of nodes || []) {
    if (node.path === path) {
      return node;
    }

    const hit = findByPath(node.children, path);

    if (hit) {
      return hit;
    }
  }

  return null;
}
