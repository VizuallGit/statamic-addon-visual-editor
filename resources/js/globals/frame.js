/**
 * globals-panel.js — what runs inside the panel's frame.
 * Split out of globals-panel.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. globals-panel.js re-exports this file.
 */
import { GLOBALS_PANEL_PARAM } from '../cp-selectors.js';
import { GLOBALS_PANEL_ID } from '../lib/ids.js';
import { unwrapRef } from '../lib/values.js';
import { activeContainers } from '../lib/publish-containers.js';
import { newRowId } from '../section-library.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { PARKED_SYNC_TICKS } from './panel.js';

/**
 * Runs inside the globals panel's iframe: strips the CP chrome down to the form,
 * and streams the form's values up to the Live Preview window as they're typed.
 */
export function initGlobalsPanelFrame(win) {
  const doc = win.document;

  if (!new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)) {
    return false;
  }

  const style = doc.createElement('style');

  style.textContent = `
    html, body {
      background: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
    }
    [data-sve-panel-hide] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
      min-height: 0 !important;
    }
    /* Synced-section entry: always hide library meta + Published, even before
       JS finds the exact wrappers (Statamic 6 markup varies / may omit field_*). */
    html[data-sve-entry-panel] #field_title,
    html[data-sve-entry-panel] #field_synced,
    html[data-sve-entry-panel] #field_section_type,
    html[data-sve-entry-panel] #field_preview_image,
    html[data-sve-entry-panel] [name="published"],
    html[data-sve-entry-panel] input[name="published"] {
      display: none !important;
    }
    /* Top-level title (library name) — not titles inside the section set. */
    html[data-sve-entry-panel] .publish-fields > [class*="title-fieldtype"],
    html[data-sve-entry-panel] .publish-form > * > [class*="title-fieldtype"] {
      display: none !important;
    }
    /* Hide the CP shell so the form is the panel. Do not restyle Statamic cards. */
    .h-14.bg-global-header-bg {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      min-height: 0 !important;
      overflow: hidden !important;
    }
    #main {
      top: 0 !important;
    }
    [data-ui-header] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
    }
    /* Only extra: 26px above the tabs. Left/right stay Statamic default. */
    #content-card {
      padding-top: 26px !important;
    }
    main {
      margin: 0 !important;
      padding-block: 0 !important;
      padding-inline: 0 !important;
    }
    main > *:first-child {
      margin-block-start: 0 !important;
      padding-block-start: 0 !important;
    }
    [role="tablist"],
    nav[role="tablist"],
    .tabs {
      margin-block: 0 !important;
      padding-block: 0 !important;
    }
    /* Chrome lock: kill every spacer above the fields — toggle sits outside the iframe. */
    html[data-sve-chrome-locked] [role="tablist"],
    html[data-sve-chrome-locked] [data-sve-chrome-tablist-lock],
    html[data-sve-chrome-locked] [data-sve-chrome-spacer] {
      display: none !important;
      height: 0 !important;
      max-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
      min-height: 0 !important;
    }
    html[data-sve-chrome-locked],
    html[data-sve-chrome-locked] body {
      margin: 0 !important;
      padding: 0 !important;
    }
    html[data-sve-chrome-locked] main,
    html[data-sve-chrome-locked] main > *,
    html[data-sve-chrome-locked] .publish-form,
    html[data-sve-chrome-locked] .publish-sections,
    html[data-sve-chrome-locked] .tabs-container,
    html[data-sve-chrome-locked] [data-reka-tabs-root],
    html[data-sve-chrome-locked] [data-orientation] {
      margin-top: 0 !important;
      margin-block-start: 0 !important;
      padding-top: 0 !important;
      padding-block-start: 0 !important;
      gap: 0 !important;
      row-gap: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-sections > .card,
    html[data-sve-chrome-locked] main .card {
      margin: 0 !important;
      margin-top: 0 !important;
      padding-top: 10px !important;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-fields {
      padding-top: 0 !important;
      margin-top: 0 !important;
    }
    html[data-sve-chrome-locked] .publish-section-header,
    html[data-sve-chrome-locked] .section-header,
    html[data-sve-chrome-locked] [data-section-header],
    html[data-sve-chrome-locked] .publish-fields > h2,
    html[data-sve-chrome-locked] .publish-fields > h3,
    html[data-sve-chrome-locked] .card > header,
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h1),
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h2),
    html[data-sve-chrome-locked] .card > .flex.items-center:first-child:has(h3) {
      display: none !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
    }
  `;
  doc.head.appendChild(style);

  // The same panel serves a global SET (/cp/globals/<handle>) and a global
  // SECTION (/cp/collections/<c>/entries/<id>) — both are just a publish form in
  // an iframe. The path says which; each stashes through its own channel, and
  // only an entry brings its own Save button along.
  // Strip the CP's own chrome (top bar, main nav) but nothing else: the publish
  // form lives inside <main>, and it has plenty of its own <header>s (every
  // replicator set) and <nav>s (the tab bar) that must survive.
  const hideChrome = () => {
    const main = doc.querySelector('main');

    doc.querySelectorAll('nav, header').forEach((el) => {
      if (main && (main.contains(el) || el.contains(main))) {
        return;
      }

      el.setAttribute('data-sve-panel-hide', '');
    });

    // Inside <main>: hide the publish page toolbar (globe + title + Save) — the
    // outer SVE panel already has title/Save/✕. Leave replicator/Bard set headers
    // alone (they carry [data-drag-handle]).
    if (main) {
      main.querySelectorAll('h1').forEach((el) => {
        if (el.closest('[data-drag-handle], [data-replicator-set], [data-grid-row]')) {
          return;
        }

        el.setAttribute('data-sve-panel-hide', '');
      });

      main.querySelectorAll('header').forEach((el) => {
        if (el.querySelector('[data-drag-handle]')) {
          return;
        }

        const hasSave = [...el.querySelectorAll('button')].some((button) =>
          /^(save|gem)\b/i.test((button.textContent || '').trim())
        );

        if (hasSave) {
          el.setAttribute('data-sve-panel-hide', '');
        }
      });
    }

    // Statamic 6 page Header is a padded flex div (`data-ui-header`, py-6/py-8),
    // not <header>/h1 — hiding the title left the padding as an empty band.
    doc.querySelectorAll('[data-ui-header]').forEach((el) => {
      el.setAttribute('data-sve-panel-hide', '');
    });
    doc.querySelectorAll('button').forEach((button) => {
      if (!/^(save|gem)\b/i.test((button.textContent || '').trim())) {
        return;
      }

      button.setAttribute('data-sve-panel-hide', '');
      button.nextElementSibling?.setAttribute('data-sve-panel-hide', '');

      let node = button.parentElement;

      for (let depth = 0; node && node !== main && depth < 6; depth += 1, node = node.parentElement) {
        if (node.querySelector('[data-drag-handle]')) {
          break;
        }

        const hasTitle = node.querySelector('h1, h2');

        if (hasTitle) {
          node.setAttribute('data-sve-panel-hide', '');
          break;
        }
      }
    });
  };

  // When set (e.g. "header"), chrome focus hides every other publish tab so you
  // can't jump to Colors / Typography while editing the site header/footer.
  const lockedTabNeedle = null;

  // Tabs this global set never shows in the docked panel (see the addon's
  // `chrome.hidden_tabs`). Header and footer are edited by clicking them on the
  // page; the tab is a second way in that shows you nothing while you type.
  //
  // Hidden here only — the ordinary Control Panel globals screen is untouched,
  // so nothing becomes unreachable. And chrome focus still LOCKS to these tabs,
  // which is why they're only hidden while unlocked: a `display:none` tab has no
  // offsetParent, and the lock finds its tab among the visible ones.
  // Read per call, not once at boot: `Statamic.$config` is populated while the
  // CP boots, and this runs early enough that caching it could catch an empty
  // one and then never look again. A config get and an array lookup are cheap.
  const hiddenTabNeedles = () => {
    const map = win.Statamic?.$config?.get?.('sveHiddenGlobalsTabs') || {};
    const handle = win.location.pathname.split('/').filter(Boolean).pop();

    return Array.isArray(map[handle]) ? map[handle] : [];
  };

  const isHiddenTab = (tab, needles = hiddenTabNeedles()) => {
    const text = (tab.textContent || '').trim().toLowerCase();

    return needles.some((needle) => text === needle || text.startsWith(needle));
  };

  const activatePublishTab = (needle) => {
    if (!needle) {
      return false;
    }

    const tabs = [...doc.querySelectorAll('button[role="tab"]')].filter((el) => el.offsetParent !== null);
    const tab = tabs.find((el) => {
      const text = (el.textContent || '').trim().toLowerCase();

      return text === needle || text.startsWith(needle);
    });

    if (!tab) {
      return false;
    }

    if (tab.getAttribute('aria-selected') !== 'true') {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
        tab.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
      });
    }

    return tab.getAttribute('aria-selected') === 'true';
  };

  const applyTabLock = () => {
    const tabs = [...doc.querySelectorAll('button[role="tab"]')];

    if (!lockedTabNeedle) {
      const needles = hiddenTabNeedles();

      doc.documentElement.removeAttribute('data-sve-chrome-locked');

      // Decided before anything is hidden, and from the tabs actually on screen:
      // reka-ui keeps a hidden measurement copy of every tab, and a tab we hide
      // ourselves stops being findable the same way.
      const visible = tabs.filter((tab) => tab.offsetParent !== null);
      const selected = visible.find((tab) => tab.getAttribute('aria-selected') === 'true');
      const fallback = visible.find((tab) => !isHiddenTab(tab, needles));
      const moveOff = selected && isHiddenTab(selected, needles) && fallback;

      tabs.forEach((tab) => {
        if (tab.hasAttribute('data-sve-chrome-tab-lock')) {
          tab.removeAttribute('data-sve-panel-hide');
          tab.removeAttribute('data-sve-chrome-tab-lock');
        }

        if (isHiddenTab(tab, needles)) {
          tab.setAttribute('data-sve-panel-hide', '');
          tab.setAttribute('data-sve-globals-tab-hide', '');
        }
      });

      // Statamic opens on the first tab — which is one of the ones just hidden.
      // Without this the panel shows the header's fields under no visible tab.
      if (moveOff) {
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
          fallback.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
        });
      }
      doc.querySelectorAll('[data-sve-chrome-tablist-lock]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-tablist-lock');
      });
      doc.querySelectorAll('[data-sve-chrome-section-title]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-section-title');
      });
      doc.querySelectorAll('[data-sve-chrome-spacer]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-spacer');
      });

      return;
    }

    const matchesLock = (tab) => {
      const text = (tab.textContent || '').trim().toLowerCase();

      return text === lockedTabNeedle || text.startsWith(lockedTabNeedle);
    };

    // Is the tab we lock to already the open one? Asked first, and this is the
    // ordinary case: the observer runs on every mutation, and typing in the form
    // is a stream of them. Only a pass that has somewhere to go may disturb the
    // lock — undoing and redoing it on each keystroke drops the panel out of
    // chrome focus between renders, which reads as a flicker.
    const selected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');

    if (!selected || !matchesLock(selected)) {
      // Everything that hides a tab comes off before the tab is looked for, and
      // the lock's own marker last of all — `html[data-sve-chrome-locked]` hides
      // every `[role="tablist"]` by stylesheet, so with it set there is no
      // visible tab left to find. That matters because `activatePublishTab`
      // searches the tabs actually on screen: reka-ui keeps a hidden measurement
      // twin of each one, and off-screen the real tab can't be told from its twin.
      doc.documentElement.removeAttribute('data-sve-chrome-locked');

      doc.querySelectorAll('[data-sve-globals-tab-hide]').forEach((tab) => {
        tab.removeAttribute('data-sve-panel-hide');
        tab.removeAttribute('data-sve-globals-tab-hide');
      });

      doc.querySelectorAll('[data-sve-chrome-tablist-lock]').forEach((el) => {
        el.removeAttribute('data-sve-panel-hide');
        el.removeAttribute('data-sve-chrome-tablist-lock');
      });

      // Not mounted yet, or renamed away — or reka-ui hasn't settled the
      // selection this tick. Leave the panel as Statamic renders it, tabs and
      // all, and try again on the next mutation: a visible tab row the reader
      // can steer with beats a hidden one over the wrong fields.
      if (!activatePublishTab(lockedTabNeedle)) {
        return;
      }
    }

    doc.documentElement.setAttribute('data-sve-chrome-locked', '1');

    tabs.forEach((tab) => {
      if (matchesLock(tab)) {
        tab.removeAttribute('data-sve-panel-hide');
        tab.removeAttribute('data-sve-chrome-tab-lock');

        return;
      }

      tab.setAttribute('data-sve-panel-hide', '');
      tab.setAttribute('data-sve-chrome-tab-lock', '');
    });

    // Hide the whole tab row (incl. overflow "…" / lone "Design") so fields sit tight.
    doc.querySelectorAll('[role="tablist"]').forEach((list) => {
      const wrap = list.closest('nav') || list.parentElement || list;

      wrap.setAttribute('data-sve-panel-hide', '');
      wrap.setAttribute('data-sve-chrome-tablist-lock', '');
    });

    // Blueprint section titles like "Design" — redundant under chrome Design|Settings toggle.
    doc.querySelectorAll('h1, h2, h3').forEach((heading) => {
      const text = (heading.textContent || '').trim().toLowerCase();

      if (text !== 'design') {
        return;
      }

      const wrap = heading.closest('.publish-section-header, .section-header, header, .flex') || heading;

      wrap.setAttribute('data-sve-panel-hide', '');
      wrap.setAttribute('data-sve-chrome-section-title', '');
    });

    // Collapse every sibling above the first publish card — that empty band was the gap
    // under Design|Settings.
    const main = doc.querySelector('main');
    const card = main?.querySelector('.card, .publish-fields, .publish-sections');

    if (card) {
      let node = card;

      while (node && node !== main) {
        let sib = node.previousElementSibling;

        while (sib) {
          const prev = sib.previousElementSibling;

          if (!sib.hasAttribute('data-sve-chrome-spacer')) {
            sib.setAttribute('data-sve-panel-hide', '');
            sib.setAttribute('data-sve-chrome-spacer', '');
          }

          sib = prev;
        }

        node = node.parentElement;
      }
    }
  };

  hideChrome();
  applyTabLock();
  new win.MutationObserver(() => {
    hideChrome();
    applyTabLock();
  }).observe(doc.documentElement, { childList: true, subtree: true });

  // Style picks / tab jumps must not trip "Leave site?" from Statamic's dirty check.
  win.Statamic?.$dirty?.disableWarning?.();

  // Statamic's own Save button lives in the page header the panel strips away.
  // It still works — it just can't be seen — so the panel's Save clicks it, and
  // the normal save (validation, revisions, toast) runs untouched.
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    if (event.data?.source !== SOURCE) {
      return;
    }

    // Wake the parked value poll: any of these messages may change `values`,
    // and the change lands asynchronously — see pendingTicks by the interval.
    pendingTicks = PARKED_SYNC_TICKS;

    // Open the matching publish tab (Header / Footer / …). reka-ui ignores a
    // bare click() and keeps a hidden twin of each tab — only the visible one.
    if (event.data.type === MSG.SVE_ACTIVATE_TAB) {
      activatePublishTab(
        String(event.data.label || event.data.kind || '')
          .trim()
          .toLowerCase()
      );

      return;
    }

    // Parent confirmed a successful Save — treat current values as clean baseline.
    if (event.data.type === MSG.SVE_GLOBALS_SAVED) {
      for (const container of activeContainers(doc)) {
        const values = unwrapRef(container.values);

        if (values && typeof values === 'object') {
          previous = JSON.stringify(values);
          seeded = true;
        }

        break;
      }

      return;
    }

    if (event.data.type !== MSG.SVE_GLOBALS_SAVE) {
      return;
    }

    // A global set's button reads "Save"; an entry's reads "Save & Publish" — so
    // match the start, not the whole label, or the panel's Save silently does
    // nothing for a global section. Clicking works even though it's hidden.
    [...doc.querySelectorAll('button')]
      .find((button) => /^(save|gem)\b/i.test((button.textContent || '').trim()))
      ?.click();
  });

  const handle = win.location.pathname.split('/').filter(Boolean).pop();
  let previous = null;
  let seeded = false;

  // The panel is parked off-screen after close (so reopening is instant), and
  // this frame lives on. While parked nobody types in the form — values only
  // change through the message handler above (inline edit, add block, style
  // pick). So the poll rests while parked, except for a few ticks after each
  // message: setFieldValue lands in `values` asynchronously, and a single
  // immediate compare would miss it and never stream the edit out.
  let pendingTicks = PARKED_SYNC_TICKS;

  const parkedPanel = () => {
    try {
      const panel = win.frameElement?.closest?.(`#${GLOBALS_PANEL_ID}`);

      return (
        !!panel && (panel.hidden || panel.hasAttribute('data-sve-chrome-hidden') || panel.style.visibility === 'hidden')
      );
    } catch {
      return false;
    }
  };

  // Polled rather than watched: the container's `values` is a Vue ref, and a
  // 200ms compare is both cheaper and far more robust than reaching into Vue's
  // reactivity from outside its bundle.
  win.setInterval(() => {
    if (parkedPanel()) {
      if (pendingTicks <= 0) {
        return;
      }

      pendingTicks--;
    }

    for (const container of activeContainers(doc)) {
      const values = unwrapRef(container.values);

      if (!values || typeof values !== 'object') {
        continue;
      }

      const serialized = JSON.stringify(values);

      if (serialized === previous) {
        return;
      }

      const changed = previous !== null;
      previous = serialized;

      // The first snapshot is the seed, not an edit: pushing it refreshed the
      // Live Preview on every panel open.
      if (!seeded) {
        seeded = true;

        return;
      }

      if (!changed) {
        return;
      }

      // A frame that has been taken out of the page has no parent.
      win.parent?.postMessage(
        { source: SOURCE, type: MSG.SVE_GLOBALS_VALUES, handle, values: JSON.parse(serialized) },
        win.location.origin
      );

      return;
    }
  }, 250);

  return true;
}

/**
 * Assign stable `id` on every set row that lacks one (synced sections saved
 * before nested ids were preserved). Returns true when anything changed.
 *
 * Only replicator/grid rows (`enabled` and/or section handles like `hero/style_1`)
 * — never Bard/ProseMirror nodes (`paragraph`, `text`, …).
 */
export function ensureNestedRowIds(node) {
  let changed = false;

  const isSetRow = (n) =>
    n &&
    typeof n === 'object' &&
    typeof n.type === 'string' &&
    n.type &&
    ('enabled' in n || 'blocks' in n || n.type.includes('/'));

  const walk = (n) => {
    if (Array.isArray(n)) {
      n.forEach(walk);
    } else if (n && typeof n === 'object') {
      if (isSetRow(n) && !n.id && !n._id) {
        n.id = newRowId();
        changed = true;
      }

      Object.values(n).forEach(walk);
    }
  };

  walk(node);

  return changed;
}
