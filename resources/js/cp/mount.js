import { createApp } from 'vue';

/**
 * One Vue app per surface. Do not mount two panels into the same app —
 * that is how a change in one dock used to move something else.
 */
export function mountSurface(component, el, props) {
  const app = createApp(component, props);
  app.mount(el);

  return app;
}
