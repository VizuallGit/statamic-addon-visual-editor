import { mountSurface } from './mount.js';

const apps = new WeakMap();

export function mountPane(el, component, props) {
  apps.get(el)?.unmount();
  const app = mountSurface(component, el, props);
  apps.set(el, app);

  return app;
}

export function unmountPane(el) {
  apps.get(el)?.unmount();
  apps.delete(el);
}
