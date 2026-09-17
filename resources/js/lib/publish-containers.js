/**
 * Statamic's publish containers: the forms whose values the editor reads and
 * writes (the entry, a global set, the panel beside the preview).
 *
 * Statamic announces each one on `publish-container-created` and takes it
 * back on `publish-container-destroyed`. This is the one list and the one
 * subscription; before, inline-edit, sibling-sync and the dock's instant
 * paint each kept their own.
 *
 *   registerContainerEvents(win)   subscribe once, at boot
 *   publishContainers              the list, oldest first
 *   onContainer(fn)                fn(container) for every container, now and later
 *   addContainer(container)        a container found some other way (walking a vm)
 *   registerContainerSource(fn)    fn(doc) → an extra container to consult last
 *   activeContainers(doc)          newest first, DOM fallback, then the extra sources
 *   containerFromDom(doc)          the container behind the publish form on screen
 *
 * May import: lib/, cp-selectors.js (constants only).
 */
import { SELECTORS } from '../cp-selectors.js';

// Publish containers captured from Statamic's `publish-container-created`
// event, in the order they were created.
export const publishContainers = [];

const listeners = [];
const sources = [];
let subscribed = null;

function announce(container) {
  for (const fn of listeners) {
    fn(container);
  }
}

/** Keep a container the events did not announce (found by walking a component's parents). */
export function addContainer(container) {
  if (!container || typeof container.setFieldValue !== 'function' || publishContainers.includes(container)) {
    return;
  }

  publishContainers.push(container);
  announce(container);
}

/** Called for every container already known, then for each new one. */
export function onContainer(fn) {
  listeners.push(fn);

  for (const container of publishContainers) {
    fn(container);
  }
}

/** A provider of one more container to consult after the announced ones, or null. */
export function registerContainerSource(fn) {
  if (!sources.includes(fn)) {
    sources.push(fn);
  }
}

export function registerContainerEvents(win = window) {
  const events = win.Statamic?.$events;

  if (!events?.$on || subscribed === events) {
    return;
  }

  subscribed = events;

  events.$on('publish-container-created', (payload) => {
    if (payload?.setFieldValue && payload?.values) {
      addContainer(payload);
    }
  });

  events.$on('publish-container-destroyed', (payload) => {
    const index = publishContainers.findIndex((c) => c.name === payload?.name);

    if (index !== -1) {
      publishContainers.splice(index, 1);
    }
  });
}

export function containerFromDom(doc) {
  // Synced-section forms often have no [data-visual-id] yet (stripped on save).
  // Walk from any publish-form mount point, not only AutoUuid inputs.
  const starters = [
    doc.querySelector(SELECTORS.visualIdInput),
    doc.querySelector('.publish-form'),
    doc.querySelector('.publish-fields'),
    doc.querySelector('[data-reka-tabs-root]'),
    doc.querySelector('main'),
  ].filter(Boolean);

  for (const el of starters) {
    let component = el.__vueParentComponent;

    while (component) {
      const ctx = component.provides?.['PublishContainerContext'];

      if (ctx?.setFieldValue) {
        return ctx;
      }

      component = component.parent;
    }
  }

  return null;
}

export function activeContainers(doc) {
  // Most recently created first — matches the form the user is looking at.
  const list = [...publishContainers].reverse();

  if (!list.length) {
    const ctx = containerFromDom(doc);

    if (ctx) {
      list.push(ctx);
    }
  }

  // A global section's content belongs to the entry open in the panel — another
  // window, so none of the containers above have ever heard of it. Appended last,
  // so the page's own fields always win a name clash, this stands in for it: every
  // caller (inline edit, findPathByUid, the settings panel) then treats a global
  // section exactly like one of the page's own. global-section.js registers it.
  for (const source of sources) {
    const extra = source(doc);

    if (extra) {
      list.push(extra);
    }
  }

  return list;
}
