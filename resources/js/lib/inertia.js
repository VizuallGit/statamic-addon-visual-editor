/**
 * Inertia's page-component resolver, borrowed off the running Control Panel.
 *
 * The globals screen (and every other CP page) is an Inertia page, not a
 * component registered on the app, so there is no name to resolve it by.
 * Inertia's own `App` component holds the resolver as a prop, and that
 * component is the first thing Statamic mounts: the root instance's subtree.
 *
 * Read off the app's root instance, which Vue keeps in every build: on
 * `app._instance` where the app set it, else on the container's root vnode
 * (`app._container._vnode.component`) — the Control Panel's publish screens
 * leave `_instance` null, measured on Statamic 6.35 with the production build.
 * It used to be read off a DOM node's `__vueParentComponent`, which only the
 * dev build attaches — on the server the header never opened in the left
 * column and fell back to the globals iframe.
 *
 *   inertiaPageResolver(win)   (name) => Promise<component>, or null
 *
 * May import: nothing.
 */

const MAX_DEPTH = 16;

function fromInstance(instance, depth) {
  if (!instance || depth > MAX_DEPTH) {
    return null;
  }

  const resolve = instance.props?.resolveComponent;

  if (typeof resolve === 'function') {
    return resolve;
  }

  return fromVnode(instance.subTree, depth + 1);
}

function fromVnode(vnode, depth) {
  if (!vnode || depth > MAX_DEPTH) {
    return null;
  }

  if (vnode.component) {
    return fromInstance(vnode.component, depth);
  }

  if (Array.isArray(vnode.children)) {
    for (const child of vnode.children) {
      const found = fromVnode(child, depth + 1);

      if (found) {
        return found;
      }
    }
  }

  if (vnode.suspense) {
    return fromVnode(vnode.suspense.activeBranch, depth + 1);
  }

  return null;
}

/** Inertia's `resolveComponent(name)`, or null when the CP app is not mounted. */
export function inertiaPageResolver(win) {
  const app = win?.Statamic?.$app;

  if (!app) {
    return null;
  }

  return fromInstance(app._instance || app._container?._vnode?.component || null, 0);
}
