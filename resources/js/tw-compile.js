/**
 * Tailwind's own compiler, bundled for the Control Panel.
 *
 * Loaded lazily: nobody pays for the engine until a section is saved with
 * `tailwind_dock` on, or the dock asks for a suggestion. The package's two
 * stylesheets ride along as text, so nothing is fetched from a CDN and nothing
 * needs Vite on the server.
 *
 * A fresh compiler per build, on purpose. `build()` remembers every candidate
 * it has been given, so reusing one would keep emitting CSS for classes the
 * file no longer has — and would mix one section's classes into the next.
 * Building one costs a few milliseconds; the save is debounced anyway.
 *
 * The design system is the opposite: one per session, kept. It is read-only —
 * a class list and a compiler for single candidates — so nothing accumulates
 * in it, and rebuilding it per keystroke would be absurd.
 */

import { compile, __unstable__loadDesignSystem } from 'tailwindcss';
import themeSource from 'tailwindcss/theme.css?raw';
import utilitiesSource from 'tailwindcss/utilities.css?raw';
import typography from '@tailwindcss/typography';
import { buildTailwind, makeDesignSystem, makeTailwindCompiler } from './tw-compile-core.js';

/** Plugins this addon carries. A site using another one is told, not broken. */
const MODULES = {
  '@tailwindcss/typography': typography,
};

let sitePromise = null;
let designPromise = null;
let warned = false;

function loadSite(win) {
  if (!sitePromise) {
    sitePromise = win
      .fetch('/!/sve/tailwind-theme', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : { css: '', plugins: [], built: [] }))
      .catch(() => ({ css: '', plugins: [], built: [] }));
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

/**
 * The design system the dock's suggestions read.
 *
 * Built from the same input as the compiler above, so what the list offers is
 * what the save will write.
 */
export function loadTailwindDesign(win) {
  if (!designPromise) {
    designPromise = loadSite(win)
      .then((site) => makeDesignSystem({
        loadDesignSystem: __unstable__loadDesignSystem,
        sources: { theme: themeSource, utilities: utilitiesSource },
        site,
        modules: MODULES,
      }))
      .catch((error) => {
        designPromise = null;

        throw error;
      });
  }

  return designPromise;
}
