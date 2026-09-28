/**
 * What the addon's PHP side told the Control Panel.
 *
 * `Features` and the default section field handle are provided to the CP as
 * config (`sveFeatures`, `sveSectionField`, the presets and the templates
 * collection). These readers are the only way a surface should ask; nobody
 * parses the config object on their own.
 *
 * The section field is the one reader that also looks at the page: which field
 * holds its sections is its blueprint's to say (`SectionField` on the PHP
 * side). In Live Preview that field is the addon's own `sve_lite_sections`,
 * whose meta says so (`sve_sections`, `sve_blueprint`) — the meta travels with
 * Statamic's `publish-container-created`, the blueprint does not.
 *
 * May import: publish-containers.js, values.js, live-preview.js.
 * publish-containers.js imports this file back; only function declarations
 * cross, and nothing runs at module top level, so the cycle is safe.
 */
import { activeContainers } from './publish-containers.js';
import { unwrapRef } from './values.js';
import { currentCollection } from './live-preview.js';

/** A feature is on unless the settings say `false`. */
export function featureOn(win, key) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.[key] !== false;
}

/** Where the Control Panel lives (`/cp` unless the site moved it), no trailing slash. */
export function cpRoot(win) {
  return String(win.Statamic?.$config?.get?.('cpRoot') || '/cp').replace(/\/+$/, '');
}

/** The field a page's sections live in when its blueprint marks none (`page_sections`). */
export function defaultSectionField(win) {
  return win.Statamic?.$config?.get?.('sveSectionField') || 'page_sections';
}

/**
 * Every field a blueprint keeps its sections in (`sveSectionFields`,
 * `SectionField::all`), the default first. A template's loop over one of them
 * is where every page drawn with it gets its sections: a fixed row in the HTML
 * tree, locked in the dock.
 */
export function sectionLoopFields(win) {
  const list = win?.Statamic?.$config?.get?.('sveSectionFields');

  return Array.isArray(list) && list.length ? list : [defaultSectionField(win)];
}

/** The replicator field the page builder of the page on screen lives in. */
export function sectionField(win) {
  return pageBuilderForm(win)?.field || defaultSectionField(win);
}

/**
 * What the server needs to answer for this page's own list of section types
 * (`SectionField::blueprintFor`): the blueprint's fully qualified handle when
 * the form knows it, the collection, and the sections field.
 */
export function pageBuilderParams(win) {
  const form = pageBuilderForm(win);

  return {
    blueprint: form?.fqh || '',
    collection: (win?.location && currentCollection(win)) || '',
    sections_field: form?.field || '',
  };
}

/** The same, as a query string for a section-types or section-meta URL. */
export function pageBuilderQuery(win) {
  return new URLSearchParams(pageBuilderParams(win)).toString();
}

/**
 * The form on screen that holds a page builder: the first whose meta marks a
 * field as the page's sections, else the first whose values carry a field of
 * the default name. `{ field, fqh }`, or null.
 */
function pageBuilderForm(win) {
  const doc = win?.document;

  if (!doc) {
    return null;
  }

  const fallback = defaultSectionField(win);
  let named = null;

  for (const container of activeContainers(doc)) {
    const meta = unwrapRef(container?.meta);

    if (meta && typeof meta === 'object') {
      for (const handle of Object.keys(meta)) {
        if (meta[handle]?.sve_sections === true) {
          return { field: handle, fqh: meta[handle].sve_blueprint || '' };
        }
      }
    }

    const values = unwrapRef(container?.values);

    if (!named && values && typeof values === 'object' && Array.isArray(values[fallback])) {
      named = { field: fallback, fqh: '' };
    }
  }

  return named;
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
