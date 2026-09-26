/**
 * The theme panel, as everything else is allowed to see it.
 *
 * Same export names as theme-panel.js. The panel only arrives when its icon
 * is opened, so a Live Preview session that never touches it never parses it.
 * Gated like the stylesheet editor: both write site.css.
 */
/** The panel's element in the right sidebar — the shell and closeRightPanels() know it by this. */
export const THEME_PANEL_ID = '__sve-theme';

let panel = null;
let loading = null;

/** A swatch book: the theme is more than its colors (the palette is the Colors tab's icon). */
export const THEME_PANEL_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
  '<path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z"/>' +
  '<path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7"/>' +
  '<path d="M7 17h.01"/>' +
  '<path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8"/></svg>';

export function themePanelAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.site_css === true;
}

export function isThemePanelOpen(doc) {
  return !!doc?.getElementById(THEME_PANEL_ID);
}

export function loadThemePanel() {
  if (panel) {
    return Promise.resolve(panel);
  }

  if (!loading) {
    loading = import('./theme-panel.js')
      .then((mod) => {
        panel = mod;

        return mod;
      })
      .catch((err) => {
        loading = null;
        console.error('[sve] load theme panel', err);

        throw err;
      });
  }

  return loading;
}

export function toggleThemePanel(win) {
  return loadThemePanel().then((mod) => mod.toggleThemePanel(win));
}

/**
 * Close the panel. `{ force: true }` is another tool taking the sidebar: no
 * question asked, and unsaved changes are kept for the next time it opens.
 */
export function closeThemePanel(win, options = {}) {
  if (panel) {
    panel.closeThemePanel(win, options);

    return;
  }

  win?.document?.getElementById(THEME_PANEL_ID)?.remove();
}
