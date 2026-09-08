/**
 * Tailwind's own compiler, bundled for the Control Panel.
 *
 * Loaded lazily: nobody pays for the engine until a section is saved with
 * `tailwind_dock` on. The package's two stylesheets ride along as text, so
 * nothing is fetched from a CDN and nothing needs Vite on the server.
 *
 * A fresh compiler per build, on purpose. `build()` remembers every candidate
 * it has been given, so reusing one would keep emitting CSS for classes the
 * file no longer has — and would mix one section's classes into the next.
 * Building one costs a few milliseconds; the save is debounced anyway.
 */

import { compile } from 'tailwindcss';
import themeSource from 'tailwindcss/theme.css?raw';
import utilitiesSource from 'tailwindcss/utilities.css?raw';
import typography from '@tailwindcss/typography';
import { buildTailwind, makeTailwindCompiler } from './tw-compile-core.js';

/** Plugins this addon carries. A site using another one is told, not broken. */
const MODULES = {
  '@tailwindcss/typography': typography,
};

let sitePromise = null;
let warned = false;

function loadSite(win) {
  if (!sitePromise) {
    sitePromise = win
      .fetch('/!/sve/tailwind-theme', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : { css: '', plugins: [] }))
      .catch(() => ({ css: '', plugins: [] }));
  }

  return sitePromise;
}

export async function compileTailwind(win, html) {
  const site = await loadSite(win);
  const state = await makeTailwindCompiler({
    compile,
    sources: { theme: themeSource, utilities: utilitiesSource },
    site,
    modules: MODULES,
  });

  if (!warned && state.missingPlugins.length) {
    warned = true;
    console.warn(
      '[sve] site.css loads Tailwind plugins the Visual Editor does not carry, '
      + 'so their classes stay with the Vite build: '
      + state.missingPlugins.join(', ')
    );
  }

  return buildTailwind(state, html);
}
