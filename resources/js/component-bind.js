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

    const done = armed.onChange;

    disarmComponentBind(win);
    done?.();
  };

  win.document.addEventListener('keydown', onKey, true);
  unkey = () => win.document.removeEventListener('keydown', onKey, true);
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

  const written = prop.type === 'media' && wantsSrc(node) ? bindToSrc(html, node, prop) : bindToBody(html, node, prop);

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
  const tag = `{{ props.${prop.handle} }}`;

  if (was.trim() === tag) {
    return null;
  }

  return {
    html: html.slice(0, node.openTo) + tag + html.slice(close),
    was,
  };
}

/** An image points somewhere, so the field is what it points at. */
function bindToSrc(html, node, prop) {
  const open = html.slice(node.from, node.openTo);
  const tag = `{{ props.${prop.handle} }}`;
  const match = /(\ssrc\s*=\s*)(["'])([\s\S]*?)\2/i.exec(open);

  if (match) {
    const from = node.from + match.index + match[1].length;
    const to = from + match[2].length * 2 + match[3].length;

    return {
      html: html.slice(0, from) + `"${tag}"` + html.slice(to),
      was: match[3],
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
