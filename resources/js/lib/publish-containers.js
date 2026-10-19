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
 *   pageHasSectionField(win, doc)  whether the page on screen is built from sections
 *   pageSectionRows(win, doc)      the page's section rows, each with every id it answers to
 *   registerContainerContext(ctx)  a form's full publish context, from inside that form
 *   unregisterContainerContext(ctx) one holder fewer; gone with the last
 *   containerContexts()            every registered context, newest first
 *   containerContext()             the page's own ('base')
 *   containerContextName(ctx)      the container's name
 *   onContainerContext(fn)         fn(contexts) now, and on every change
 *
 * May import: lib/, cp-selectors.js (constants only).
 */
import { SELECTORS } from '../cp-selectors.js';
import { sectionField } from './config.js';
import { unwrapRef } from './values.js';
import { log } from './debug.js';

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

/**
 * Keep a container the events did not announce (found by walking a component's parents).
 *
 * Only a whole container: one that writes meta as well as values. Statamic's
 * PublishContainer component exposes `setFieldValue` and `values` but not
 * `setFieldMeta`. Kept here, that half was the newest entry, so it came first
 * in activeContainers — and every meta write after it was skipped: a section
 * duplicated or dropped in landed in values with no meta, Statamic's
 * Replicator threw on it, and the sidebar stopped drawing any section at all.
 */
export function addContainer(container) {
  if (
    !container ||
    typeof container.setFieldValue !== 'function' ||
    typeof container.setFieldMeta !== 'function' ||
    publishContainers.includes(container)
  ) {
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

/*
 * The publish contexts, whole.
 *
 * `publish-container-created` hands out a part of each: values, meta and
 * their setters. A field drawn outside its form needs the rest as well —
 * errors, the blueprint, hidden and revealer fields, locks, the direction —
 * because Statamic's own PublishField reads all of it from one injected
 * object. Only a component inside a form can inject that object, so the
 * forms register theirs here: the page's through the lite sections field
 * that always sits in it, a global section's through the same field in its
 * borrowed entry form, the header's and footer's through the chrome form's
 * host. Each is named by its container (`ctx.name`: 'base' for the page,
 * 'sve-global-section', 'sve-chrome'), newest first when asked.
 */
const ctxEntries = [];
const ctxListeners = [];
// How many live components hold each context. The field that registers it
// remounts while its form stays (a tab shown again, the column reopened), and
// Vue creates the new instance before it unmounts the old: a plain "forget on
// unmount" dropped the context the new instance had just registered.
const ctxHolders = new Map();

function publishContexts() {
  const list = containerContexts();

  for (const fn of ctxListeners) {
    fn(list);
  }
}

/** The name a context's container goes by ('base' for the page's own form). */
export function containerContextName(ctx) {
  return String(unwrapRef(ctx?.name) || 'base');
}

export function registerContainerContext(ctx) {
  const next = ctx && typeof ctx === 'object' && typeof ctx.setFieldValue === 'function' ? ctx : null;

  if (!next) {
    return;
  }

  const holders = (ctxHolders.get(next) || 0) + 1;

  ctxHolders.set(next, holders);
  log(`ctx register ${containerContextName(next)} holders=${holders}`);

  if (holders === 1) {
    ctxEntries.push(next);
    publishContexts();
  }
}

/** One holder fewer; the context is forgotten when the last one has gone. */
export function unregisterContainerContext(ctx) {
  if (!ctx || !ctxHolders.has(ctx)) {
    return;
  }

  const left = ctxHolders.get(ctx) - 1;

  log(`ctx unregister ${containerContextName(ctx)} left=${left}`);

  if (left > 0) {
    ctxHolders.set(ctx, left);

    return;
  }

  ctxHolders.delete(ctx);

  const at = ctxEntries.indexOf(ctx);

  if (at !== -1) {
    ctxEntries.splice(at, 1);
  }

  publishContexts();
}

/** Forget every context of a container that Statamic has taken down. */
export function forgetContainerContexts(name) {
  const gone = ctxEntries.filter((ctx) => containerContextName(ctx) === name);

  if (!gone.length) {
    return;
  }

  for (const ctx of gone) {
    ctxHolders.delete(ctx);
    ctxEntries.splice(ctxEntries.indexOf(ctx), 1);
  }

  log(`ctx forget ${name}`);
  publishContexts();
}

// Contexts adopted from a form's DOM rather than injected by a field of ours:
// registered once each, however often the form is looked at.
const adopted = new WeakSet();

/**
 * Register the context behind a form we mounted or found, once its fields are
 * drawn — the context is read off them. Resolves with the context, or null
 * when the form did not come within about two seconds or `stillOpen` says it
 * has gone. Selectors cover what any publish form draws first: its tab bar,
 * its field list, a field.
 */
export function adoptContextFromHost(win, host, stillOpen = () => true) {
  return new Promise((resolve) => {
    let frames = 0;

    const tick = () => {
      if (!host?.isConnected || !stillOpen()) {
        resolve(null);

        return;
      }

      const el = host.querySelector('button[role="tab"], .publish-fields, .form-group, [data-reka-tabs-root], input, textarea');
      const ctx = el ? publishContextOf(el) : null;

      if (ctx) {
        if (!adopted.has(ctx)) {
          adopted.add(ctx);
          registerContainerContext(ctx);
        }

        resolve(ctx);

        return;
      }

      if ((frames += 1) < 120) {
        win.requestAnimationFrame(tick);
      } else {
        resolve(null);
      }
    };

    tick();
  });
}

/** Every registered context, newest first — a form opened later answers for its own rows first. */
export function containerContexts() {
  return [...ctxEntries].reverse();
}

/** The page's own context: the one named 'base', else the oldest. */
export function containerContext() {
  return ctxEntries.find((ctx) => containerContextName(ctx) === 'base') || ctxEntries[0] || null;
}

/** fn(contexts) now, and on every change (newest first). */
export function onContainerContext(fn) {
  ctxListeners.push(fn);
  fn(containerContexts());

  return () => {
    const at = ctxListeners.indexOf(fn);

    if (at !== -1) {
      ctxListeners.splice(at, 1);
    }
  };
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

    if (payload?.name) {
      forgetContainerContexts(payload.name);
    }
  });
}

/**
 * The publish context an element is drawn under, or null.
 *
 * Vue keeps each component's `provides` as a chain back to the root, so any
 * element inside a form resolves the container's context through its own
 * component. Used for a form we mounted ourselves but did not write (the
 * header's globals form), where no field of ours sits inside to inject it.
 */
export function publishContextOf(el) {
  let component = el?.__vueParentComponent;

  while (component) {
    const ctx = component.provides?.['PublishContainerContext'];

    if (ctx?.setFieldValue) {
      return ctx;
    }

    component = component.parent;
  }

  return null;
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

/**
 * Whether the page on screen is built from sections: a form whose values
 * carry the page builder's field, empty or not. Asked of the values, not of
 * whether the sidebar has drawn a set — the dock and the HTML tree both go by
 * this answer, so they cannot disagree about which kind of page it is.
 */
export function pageHasSectionField(win, doc) {
  const field = sectionField(win);

  return activeContainers(doc).some((container) => {
    const values = unwrapRef(container.values);

    return !!values && typeof values === 'object' && Array.isArray(values[field]);
  });
}

/**
 * The page's section rows, each with every id it answers to: what the tree's
 * video holds and Alpine states are remembered by (`type`, the file) and sent
 * to the preview for (the ids, the section on the page).
 */
export function pageSectionRows(win, doc) {
  const field = sectionField(win) || 'page_sections';
  const rows = [];

  for (const container of activeContainers(doc) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    for (const row of list) {
      if (!row || typeof row !== 'object' || typeof row.type !== 'string') {
        continue;
      }

      const ids = [row._visual_id, row.id, row._id].filter((id) => typeof id === 'string' && id !== '');

      if (ids.length) {
        rows.push({ type: row.type, ids });
      }
    }
  }

  return rows;
}
