/**
 * Theme colors, as everything else is allowed to see it.
 *
 * Same export names as theme-colors.js. The panel only arrives when its icon
 * is opened, so a Live Preview session that never touches it never parses it.
 * Gated like the stylesheet editor: both write site.css.
 */
const PANEL_ID = '__sve-theme-colors';

let colors = null;
let loading = null;

/** A palette: what the icon opens is the site's colors. */
export const THEME_COLORS_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
  '<circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>' +
  '<circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none"/>' +
  '<circle cx="8.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>' +
  '<circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none"/>' +
  '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/></svg>';

export function themeColorsAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.site_css === true;
}

export function isThemeColorsOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

export function loadThemeColors() {
  if (colors) {
    return Promise.resolve(colors);
  }

  if (!loading) {
    loading = import('./theme-colors.js')
      .then((mod) => {
        colors = mod;

        return mod;
      })
      .catch((err) => {
        loading = null;
        console.error('[sve] load theme colors', err);

        throw err;
      });
  }

  return loading;
}

export function toggleThemeColors(win) {
  return loadThemeColors().then((mod) => mod.toggleThemeColors(win));
}

export function closeThemeColors(win) {
  if (colors) {
    colors.closeThemeColors(win);

    return;
  }

  win?.document?.getElementById(PANEL_ID)?.remove();
}
