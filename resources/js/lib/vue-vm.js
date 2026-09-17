/**
 * Reading Statamic's own Vue components from the outside.
 *
 * The CP strips `__vueParentComponent`, so a global mixin is how the editor
 * sees Statamic's fieldtype instances (see the addon boot). These helpers are
 * the questions that mixin code keeps asking about a `vm`.
 *
 * May import: nothing.
 */

/** The component's root element, or the parent of a text/comment root. */
export function vueRootElement(vm) {
  const el = vm.$el;

  if (el?.nodeType === Node.ELEMENT_NODE) {
    return el;
  }

  return el?.parentElement ?? null;
}

/**
 * Is this the replicator/bard "add a set" picker?
 *
 * The button under the rows and the "+" between them are the same component.
 * Requiring all three props on purpose: a looser test also matches the wrapper
 * around the whole field, and hiding that hides the field.
 */
export function isSetPicker(vm) {
  const props = vm.$props;

  return !!props && 'variant' in props && 'showConnector' in props && 'loadingSet' in props;
}
