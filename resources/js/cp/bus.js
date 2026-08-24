/**
 * Event bus between CP surfaces.
 *
 * A panel may ask() or emit() — it may not import overlay, preview, bridge or cp.js.
 * The dock (and later other surfaces) register() handlers here at boot.
 */
const handlers = new Map();
const listeners = new Map();

export function register(name, fn) {
  handlers.set(name, fn);
}

export function ask(name, payload) {
  const fn = handlers.get(name);

  return typeof fn === 'function' ? fn(payload) : undefined;
}

export function on(name, fn) {
  const list = listeners.get(name) || [];
  list.push(fn);
  listeners.set(name, list);

  return () => {
    listeners.set(
      name,
      (listeners.get(name) || []).filter((item) => item !== fn)
    );
  };
}

export function emit(name, payload) {
  for (const fn of listeners.get(name) || []) {
    fn(payload);
  }
}
