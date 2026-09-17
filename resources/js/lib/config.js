/**
 * What the addon's PHP side told the Control Panel.
 *
 * `Features` and the section field handle are provided to the CP as config
 * (`sveFeatures`, `sveSectionField`). These two readers are the only way a
 * surface should ask; nobody parses the config object on their own.
 *
 * May import: nothing.
 */

/** A feature is on unless the settings say `false`. */
export function featureOn(win, key) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.[key] !== false;
}

/** The replicator field the page builder lives in. */
export function sectionField(win) {
  return win.Statamic?.$config?.get?.('sveSectionField') || 'page_sections';
}
