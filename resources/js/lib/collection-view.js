/**
 * The view a collection-template entry edits — `view:layout`, `view:services/show`
 * — while Live Preview is on one, else ''.
 *
 * Read off the entry's own `view` value on a templates-collection URL. Moved
 * out of the dock (dock-api.js) unchanged, so a panel can ask without loading
 * the dock: the Patterns panel shows the layout's places only on the layout.
 *
 * May import: lib/ only.
 */
import { unwrapRef } from './values.js';
import { activeContainers } from './publish-containers.js';

export function collectionViewType(win) {
  const features = win.Statamic?.$config?.get?.('sveFeatures') || {};

  if (features.collection_templates !== true) {
    return '';
  }

  const store = win.Statamic?.$config?.get?.('sveCollectionTemplatesCollection') || 'templates';
  const path = win.location?.pathname || '';

  if (!path.includes(`/collections/${store}/entries/`)) {
    return '';
  }

  const containers = activeContainers(win.document);

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;
    const view = typeof values?.view === 'string' ? values.view.trim() : '';

    if (!view || view.includes('..')) {
      continue;
    }

    const normalised = view
      .replace(/\.(antlers\.html|blade\.php)$/i, '')
      .replace(/^\/+|\/+$/g, '');

    if (normalised) {
      return `view:${normalised}`;
    }
  }

  return '';
}
