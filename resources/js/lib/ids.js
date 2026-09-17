/**
 * Element ids, data attributes and storage keys the editor's surfaces share.
 *
 * A panel draws a node with one of these ids; another panel measures or hides
 * it by the same id. Before this file each panel exported its own constant and
 * the others read it off the `sve` registry at call time — which meant a
 * panel loaded late could hand a neighbour `undefined`. Now every surface
 * imports the value from here, and the lint can see who depends on what.
 *
 * May import: nothing. Values only, no logic.
 */

// Live Preview shell (lp-panel.js draws these)
export const LP_MODE_ID = '__sve-lp-mode';
export const LP_TOGGLE_ID = '__sve-lp-toggle';
export const LP_WIDTH_ID = '__sve-lp-width';
export const LP_COVER_ID = 'sve-lp-cover';
export const LP_MODE_KEY = 'sve-lp-panel-mode';
export const LP_COLLAPSED_KEY = 'sve-lp-collapsed';
export const LP_DOCKED_KEY = 'sve-lp-docked';
export const LP_WIDTH_KEY = 'statamic.live-preview.editor-width';
export const LP_SIDE_MIN_REM = 16;
export const LP_SIDE_MAX_REM = 50;
export const LP_SIDE_DEFAULT_REM = 22;
/** Idle icon opacity — same for toolbar + device chrome. */
export const LP_ICON_IDLE_OPACITY = '0.7';
export const LP_ICON_LOCKED_OPACITY = '0.25';
export const LP_PRIMARY_FLAT =
  'color-mix(in oklab, var(--theme-color-primary, #4f46e5) 90%, transparent)';

// Right-hand panels
export const SECTION_PICKER_ID = '__sve-section-picker';
export const COMMENTS_PANEL_ID = '__sve-comments-pane';
export const OUTLINE_PANEL_ID = '__sve-outline-panel';
export const HTML_TREE_PANEL_ID = '__sve-html-tree-panel';
export const LISTVIEW_PANEL_ID = '__sve-listview-panel';
export const PERF_PANEL_ID = '__sve-perf-panel';

// Globals, library, pages
export const GLOBALS_PANEL_ID = '__sve-globals-panel';
export const GLOBALS_PICKER_ID = '__sve-globals-picker';
export const LIBRARY_BUTTON_ID = '__sve-library-btn';
export const COLLECTION_PICKER_ID = '__sve-collection-picker';
export const NEW_ENTRY_ID = '__sve-new-entry';
/** Tabs the focus panel keeps in place while a section is focused. */
export const FOCUS_LOCKED_TABS = ['pages', 'globals', 'sections'];
/** An entry's edit URL in the CP — never the create screen. */
export const ENTRY_EDIT_PATH = /\/collections\/([^/]+)\/entries\/(?!create(?:\/|$))[^/?#]+/;

// Focus panel
export const FOCUS_HEADER_ID = '__sve-focus-header';
export const FOCUS_ROOT_ATTR = 'data-sve-focus'; // on <html>: which kind is on show
export const FOCUS_STEP_ATTR = 'data-sve-focus-step'; // the arrow into a block's own view
export const SOLO_PARENT_ATTR = 'data-sve-solo-parent';
export const SOLO_KEEP_ATTR = 'data-sve-solo-keep';

// Header / footer and global sections
export const CHROME_CONTAINER = 'sve-chrome';
export const CHROME_HOST_ID = '__sve-chrome-host';
export const CHROME_DESIGNS_ID = '__sve-chrome-designs';
/** Header/footer edit inline in the left panel (true) or in the docked iframe. */
export const CHROME_INLINE = true;
export const GLOBAL_SECTION_HOST_ID = '__sve-global-section-host';
export const GLOBAL_SECTION_PANEL_ID = '__sve-global-section-panel';
export const SECTION_PANEL_REVEAL_MS = 2500;

// Live Preview topbar geometry and ids (drawn by cp.js, measured by lp-panel.js and lp-reload.js)
export const LP_PREVIEW_CHROME_ID = '__sve-preview-chrome';
/** Gruppeboksens luft ud til kontrollerne i den. */
export const LP_CONTROL_PAD = 5;
/**
 * Ydre højde for alle topbar-grupper og selvstændige ikonknapper (devices,
 * zoom, Hidden/Auto/Visible, pages/globals, go-back). Pad + kontrol = 32.
 */
export const LP_CHROME_H = 32;
/** Indre kontrolhøjde inde i en gruppe (32 − 2×5). */
export const LP_CONTROL_H = LP_CHROME_H - LP_CONTROL_PAD * 2;
/** Count disc on the comments icon. Idle = same metal as the glyph, dark type; open = pale blue. */
export const COMMENTS_BADGE_FG = 'var(--theme-color-primary, #4530D8)';
export const COMMENTS_BADGE_IDLE_TYPE = '#18181b';
export const COMMENTS_BADGE_ACTIVE_BG =
  'color-mix(in oklab, var(--theme-color-primary, #4530D8) 14%, white)';
/**
 * Ens mellemrum mellem topbar-items (ikoner, device/zoom, Save, go-back).
 * Ikke ekstra margin på udvidede felter — det gav skæve huller omkring Globals.
 */
export const LP_TOOLBAR_GAP = 8;
export const LP_BACK_ID = '__sve-lp-back';
export const LP_RELOAD_ID = '__sve-lp-reload';
