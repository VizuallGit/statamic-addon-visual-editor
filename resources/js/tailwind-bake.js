/**
 * PARKED — not imported. Do not wire this into addon.js / code-dock.js until
 * the Tailwind dock is rewritten. The last version leaked compiled utilities
 * into `{{ style_push }}`. Toggle `tailwind_dock` is off; compile is commented
 * out in SectionTemplateController so this file costs nothing at runtime.
 *
 * Compile Tailwind utilities from the template-dock HTML pane.
 *
 * The compiler itself is fetched from a CDN only when `tailwind_dock` is on
 * and a save runs. Off, the save path is the three panes as they already were.
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
