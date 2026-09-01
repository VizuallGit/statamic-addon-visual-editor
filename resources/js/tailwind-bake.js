/**
 * Compile is PHP (`TailwindBake`) when `tailwind_dock` is on.
 * This file is unused — kept as the in-browser compiler if we need it later.
 * Do not import it into the CSS pane; compiled CSS belongs in
 * `resources/visual-editor/tw`, read by `{{ sve_tw }}`.
 */

let buildCss = null;
let themePromise = null;

export function tailwindDockOn(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.tailwind_dock === true;
}

export async function compileSectionTailwind(win, html) {
  if (!buildCss) {
    const mod = await import(
      /* @vite-ignore */
      'https://cdn.jsdelivr.net/npm/tailwindcss-in-browser@0.6.0/+esm'
    );
    buildCss = mod.default;
  }

  const theme = await loadTheme(win);
  const css = await buildCss(markupForCompile(html), theme, {
    compileCssOptions: { addPreflight: false },
    transformCssOptions: { minify: true },
  });

  return typeof css === 'string' ? css.trim() : '';
}

/**
 * Tailwind's in-browser extractor is the v3 scanner. Antlers `{{ … }}` in a
 * class attribute (and `{{ visual_edit }}` on the tag) produces junk candidates
 * that can abort compile — so they come out before the HTML is scanned.
 */
export function markupForCompile(html) {
  return String(html || '').replace(/\{\{[\s\S]*?\}\}/g, ' ');
}

function loadTheme(win) {
  if (!themePromise) {
    themePromise = win
      .fetch('/!/sve/tailwind-theme', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : { css: '' }))
      .then((data) => (typeof data.css === 'string' ? data.css : ''))
      .catch(() => '');
  }

  return themePromise;
}
