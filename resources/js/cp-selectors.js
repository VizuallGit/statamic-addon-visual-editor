/** DOM selectors and highlight timing. This file imports nothing from cp.js. */
export const SELECTORS = {
  visualIdInput: '[data-visual-id]',
  replicatorSet: '[data-replicator-set]',
  // Bard sets are Tiptap node views; Statamic 6 renders them with [data-node-view-wrapper].
  // There is no [data-bard-set] attribute in the actual CP DOM.
  bardSet: '[data-node-view-wrapper]',
  // Grid rows are stamped with [data-grid-row] by stampGridRows() — they have no
  // native Statamic attribute. Detection relies on the structural pattern: a
  // parent element whose direct <header> child contains a [data-drag-handle] button.
  gridRow: '[data-grid-row]',
  anySet: '[data-replicator-set], [data-node-view-wrapper], [data-grid-row]',
  // Actual toggle: a <button type="button"> that is a direct child of the <header>
  // inside the set. Neither .replicator-set-header nor .bard-set-header exist.
  headerToggle: 'header > button[type="button"]',
};

export const HIGHLIGHT_CLASS = 'sve-highlight';
export const ACTIVE_ATTR = 'data-sve-active';
export const HIGHLIGHT_DURATION = 2000; // ms — matches the sve-highlight-pulse @keyframes animation duration
// Matches the CSS collapse/expand transition duration on Statamic's Replicator/Bard sets.
// Defer scroll/highlight until after this period so scrollIntoView uses the final layout.
// Update this if Statamic's collapse transition duration ever changes.
export const COLLAPSE_SETTLE_MS = 300;

/**
 * Walks up from a [data-visual-id] input looking for a Grid row container.
 *
 * Two cases are handled:
 * 1. Replicator/Bard sets: nearest ancestor with a direct <header> child
 *    containing a [data-drag-handle] button.
 * 2. Grid table rows (Statamic v6 GridTable): the <tr> element inside a
 *    <tbody> inside a <table class="grid-table">. The Grid's drag handle is
 *    rendered as <td class="drag-handle"> with no [data-drag-handle] attribute,
 *    so we match on the table class instead.
 */
export function findGridRow(input) {
  let el = input.parentElement;

  while (el) {
    // Replicator/Bard style: direct <header> child with [data-drag-handle]
    const header = el.querySelector(':scope > header');

    if (header && header.querySelector('[data-drag-handle]')) {
      return el;
    }

    // Grid table style: <tr> inside <tbody> inside <table class="grid-table">
    if (
      el.tagName === 'TR' &&
      el.parentElement?.tagName === 'TBODY' &&
      el.closest('table.grid-table')
    ) {
      return el;
    }

    el = el.parentElement;
  }

  return null;
}

/** Query flag for the stripped globals / saved-section panel frame. */
export const GLOBALS_PANEL_PARAM = 'sve-panel';

