import { createApp } from 'vue';

/**
 * A surface that may use the Control Panel's own components.
 *
 * Every other panel here mounts a bare Vue app on purpose — they draw their own
 * markup and must not be able to reach into the CP. A publish field cannot work
 * that way: Statamic resolves a fieldtype by its global name (`bard-fieldtype`),
 * and a bare app has no such registry to resolve it in.
 *
 * So this one borrows. The registry, the directives, the app-level provides and
 * the global properties are the Control Panel's own — the same objects, not
 * copies of the values inside them — which is what lets Bard's link stack and
 * the asset browser open from in here at all.
 *
 * It stays a separate app rather than mounting into Statamic's: a panel that
 * shared the CP's app would put its own re-renders in the same queue as the
 * page's, and one panel's mistake would be everyone's.
 */
export function mountStatamicSurface(component, el, props) {
  const app = createApp(component, props);
  const host = window.Statamic?.$app;

  if (host?._context) {
    Object.assign(app._context.components, host._context.components);
    Object.assign(app._context.directives, host._context.directives);
    Object.assign(app._context.provides, host._context.provides);

    // Copied, not inherited. Vue looks a global property up with `hasOwn`, so
    // a prototype chain is invisible to it — `__()`, Statamic's translator,
    // came back undefined and every field that draws a label threw.
    Object.assign(app.config.globalProperties, host.config.globalProperties);
  }

  app.mount(el);

  return app;
}

/**
 * Whether the Control Panel is far enough along to lend its fields out.
 *
 * Asked before anything is drawn, because the answer decides which panel the
 * fields get: Statamic's, or the plain boxes that were here before. An older
 * Control Panel, or one that has not booted, gets the boxes rather than an
 * empty space where a field should be.
 */
export function statamicFieldsReady(types = []) {
  const registry = window.Statamic?.$app?._context?.components;

  if (!registry) {
    return false;
  }

  return types.every((type) => !!registry[`${type}-fieldtype`]);
}
