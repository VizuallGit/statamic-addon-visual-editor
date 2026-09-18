/**
 * What the addon's PHP side told the Control Panel.
 *
 * `Features` and the section field handle are provided to the CP as config
 * (`sveFeatures`, `sveSectionField`, the presets and the templates collection).
 * These readers are the only way a surface should ask; nobody parses the
 * config object on their own.
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

/** The scaffold presets the site offers (`sveCollectionPresets`), always a list. */
export function collectionPresets(win) {
  const list = win.Statamic?.$config?.get?.('sveCollectionPresets');

  return Array.isArray(list) ? list : [];
}

/** The collection that holds view templates (`sveCollectionTemplatesCollection`). */
export function collectionTemplatesCollection(win) {
  return win.Statamic?.$config?.get?.('sveCollectionTemplatesCollection') || 'templates';
}
