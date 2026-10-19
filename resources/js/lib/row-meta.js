/**
 * What a row is called, and what kind it is — read off the Control Panel's
 * config (`sveSetMeta`, `sveGridMeta`) and the forms' values.
 *
 *   setMeta(win, handle)      display name, icon, instructions of a set
 *   gridMeta(win, handle)     the same for a Grid field's rows
 *   setTypeForUid(uid, doc)   the set handle ("hero/style_2") of the row a uid points at
 *
 * May import: lib/.
 */
import { activeContainers } from './publish-containers.js';
import { dataGet, findPathByUid, unwrapRef } from './values.js';

/** What a set calls itself: display name, icon and instructions. */
export function setMeta(win, handle) {
  const map = win.Statamic?.$config?.get?.('sveSetMeta');

  return (handle && map?.[handle]) || null;
}

/** What a Grid field calls its rows: display name and the icon on the field. */
export function gridMeta(win, handle) {
  const map = win.Statamic?.$config?.get?.('sveGridMeta');

  return (handle && map?.[handle]) || null;
}

/** The set handle ("hero/style_2") of the row a uid points at. */
export function setTypeForUid(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const row = dataGet(values, path);

    if (row && typeof row === 'object' && typeof row.type === 'string') {
      return row.type;
    }
  }

  return null;
}
