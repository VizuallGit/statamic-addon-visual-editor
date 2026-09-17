/**
 * Site CSS, as everything else is allowed to see it.
 *
 * Same export names as site-css.js. CodeMirror and the pane only arrive when
 * the icon is opened, so a Live Preview session that never touches it never
 * parses them.
 */
const PANEL_ID = '__sve-site-css';

let css = null;
let loading = null;

export function siteCssAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.site_css === true;
}

export function isSiteCssOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

export function loadSiteCss() {
  if (css) {
    return Promise.resolve(css);
  }

  if (!loading) {
    loading = import('./site-css.js')
      .then((mod) => {
        css = mod;

        return mod;
      })
      .catch((err) => {
        loading = null;
        console.error('[sve] load site css', err);

        throw err;
      });
  }

  return loading;
}

export function prefetchSiteCss() {
  if (css || loading) {
    return;
  }

  void loadSiteCss().catch(() => {});
}

export function closeSiteCss(win) {
  if (css) {
    css.closeSiteCss(win);

    return;
  }

  win?.document?.getElementById(PANEL_ID)?.remove();
}

export function toggleSiteCss(win) {
  if (!siteCssAllowed(win)) {
    return Promise.resolve();
  }

  return loadSiteCss().then((mod) => mod.toggleSiteCss(win));
}
