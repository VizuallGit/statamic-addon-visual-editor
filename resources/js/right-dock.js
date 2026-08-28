/**
 * One right sidebar for Live Preview.
 *
 * Tools live in the top bar and load into this shared shell (Patterns, block
 * tree, comments, …). Theme Settings covers the left editor instead.
 * Accordion snapshot (unused): .restore/full-working-2026-08-27-1538/resources/js/right-dock-accordion.js
 *
 * Pin stack: several top-bar tools can sit in the sidebar at once. Each
 * stacked pane folds to its header (accordion) so Patterns cannot eat the
 * whole column. Toggle `RIGHT_DOCK_PIN_STACK` in right-dock-tabs.js and
 * run `npm run cp:build` to go back to one tool at a time.
 */

export const RIGHT_DOCK_LAYOUT = 'shell';

export * from './right-dock-tabs.js';
