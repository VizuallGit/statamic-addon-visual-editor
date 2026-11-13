/**
 * inline-edit.js — block format, image, icon, link.
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */
import { dataGet, deepestFieldPath, findPathByUid, unwrapRef } from '../lib/values.js';
import { activeContainers } from '../lib/publish-containers.js';
import { editSession } from '../inline-edit.js';
import { writeBardFieldValue } from './bard-value.js';

/**
 * Changes the edited Bard node's block type/attrs (heading level, or paragraph
 * with an optional bard-texstyle class). Only touches type/attrs — the node's
 * inline content is preserved and updated separately via handleEditInput.
 */
export function handleBlockFormat(data, doc = document) {
  if (!editSession || editSession.requestId !== data.requestId || editSession.mode !== 'bard') {
    return;
  }

  const { container } = editSession;
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  if (data.node === 'heading') {
    node.type = 'heading';
    node.attrs = { ...(node.attrs || {}), level: data.level };
    delete node.attrs.class;
  } else {
    node.type = 'paragraph';
    node.attrs = { ...(node.attrs || {}), class: data.className ?? null };
    delete node.attrs.level;
  }

  writeBardFieldValue(container, editSession.path, next, doc, editSession);
}

export function openIconifyFromField(fieldEl, doc) {
  if (!fieldEl) {
    return false;
  }

  const root = fieldEl.querySelector('.iconify-fieldtype') || fieldEl;
  const opener = [fieldEl, root, ...root.querySelectorAll('*')].find(
    (el) => typeof el.__sveOpenIconify === 'function'
  )?.__sveOpenIconify;
  return (opener && opener()) || openIconifyStack(root) || clickBrowseIconify(root);
}

function clickBrowseIconify(root) {
  const browse = [...root.querySelectorAll('button, [role="button"]')].find((b) =>
    /browse iconify/i.test(b.textContent || '')
  );

  if (!browse) {
    return false;
  }

  browse.click();

  return true;
}

/**
 * Iconify's Stack exposes open(); v-model:open also has onUpdate:open.
 * Title is never minified.
 */
function openStackInTree(vnode, depth) {
  if (!vnode || typeof vnode !== 'object' || depth > 36) {
    return false;
  }

  const props = vnode.props || vnode.component?.props;
  const isIconStack = /search and select an icon/i.test(String(props?.title || ''));
  const exposed = vnode.component?.exposed || vnode.component?.proxy;

  if (isIconStack) {
    let called = false;

    if (typeof exposed?.open === 'function') {
      exposed.open();
      called = true;
    }

    const update = props['onUpdate:open'] || props.onUpdateOpen;
    const list = Array.isArray(update) ? update : [update];

    for (const fn of list) {
      if (typeof fn === 'function') {
        fn(true);
        called = true;
      }
    }

    if (called) {
      return true;
    }
  }

  if (vnode.component?.subTree && openStackInTree(vnode.component.subTree, depth + 1)) {
    return true;
  }

  const kids = [
    ...(Array.isArray(vnode.children) ? vnode.children : []),
    ...(Array.isArray(vnode.dynamicChildren) ? vnode.dynamicChildren : []),
  ];

  for (const child of kids) {
    if (openStackInTree(child, depth + 1)) {
      return true;
    }

    if (Array.isArray(child)) {
      for (const nested of child) {
        if (openStackInTree(nested, depth + 1)) {
          return true;
        }
      }
    }
  }

  return false;
}

function openIconifyStack(fieldEl) {
  const root = fieldEl.querySelector('.iconify-fieldtype') || fieldEl;
  const seen = new Set();

  const fromComponent = (component) => {
    if (!component || seen.has(component)) {
      return false;
    }

    seen.add(component);

    return openStackInTree(component.subTree, 0) || openStackInTree(component.vnode, 0);
  };

  for (const el of [root, ...root.querySelectorAll('*')]) {
    if (fromComponent(el.__vueParentComponent)) {
      return true;
    }
  }

  return false;
}

function resolveIconField(data, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let basePath = '';

    if (data.scope) {
      basePath = findPathByUid(values, data.scope);

      if (basePath === null) {
        continue;
      }
    }

    let path = [basePath, data.field].filter(Boolean).join('.');
    let value = dataGet(values, path);

    if (value === undefined && data.field && basePath !== '') {
      const deepPath = deepestFieldPath(dataGet(values, basePath), data.field, basePath);

      if (deepPath) {
        path = deepPath;
        value = dataGet(values, path);
      }
    }

    if (value === undefined && !basePath) {
      continue;
    }

    return { container, path, value };
  }

  return null;
}

export function writeIconField(data, doc, value) {
  const found = resolveIconField(data, doc);

  if (found) {
    found.container.setFieldValue(found.path, value);
  }
}
