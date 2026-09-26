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
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { buildTailwind, makeDesignSystem, makeTailwindCompiler } from './tw-compile-core.js';

/**
 * Plugins this addon carries, so a class from them paints at once in Instant
 * exactly as the bake compiles it on the server (which has the site's own
 * node_modules). A site using another one is told, not broken.
 */
const MODULES = {
  '@tailwindcss/forms': forms,
  '@tailwindcss/typography': typography,
};

let sitePromise = null;
let designPromise = null;
let compilerPromise = null;
let warned = false;

/**
 * The site's `@theme` / `@utility` blocks, fetched once — and only kept when
 * the fetch succeeded.
 *
 * A failed fetch used to resolve to an empty theme, silently: the compiler
 * then knew Tailwind's defaults and not this site, `bg-primary` compiled to
 * nothing, the suggestions did not list it, and the save baked that missing
 * CSS to disk. For the rest of the session. Now a failure is a failure: the
 * caller's promise resets (they all do), the console says what the server
 * answered, and the next paint, save or keystroke asks again.
 */
function loadSite(win) {
  if (!sitePromise) {
    sitePromise = win
      .fetch('/!/sve/tailwind-theme', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`/!/sve/tailwind-theme answered ${res.status}`);
        }

        return res.json();
      })
      .catch((error) => {
        sitePromise = null;
        console.warn('[sve] Tailwind theme not loaded, will retry:', error?.message || error);

        throw error;
      });
  }

  return sitePromise;
}

/**
 * The compiler for this site, made once and kept.
 *
 * Building it means compiling the theme (~300 ms); building a file's classes
 * with it is a few milliseconds. The save path and the dock's Instant paint
 * share this one, so what the preview shows the moment you type is the same
 * CSS the file is saved with — one bake, two speeds.
 */
export function loadTailwindCompiler(win) {
  if (!compilerPromise) {
    compilerPromise = loadSite(win)
      .then((site) => makeTailwindCompiler({
        compile,
        sources: { theme: themeSource, utilities: utilitiesSource },
        site,
        modules: MODULES,
      }))
      .then((state) => {
        if (!warned && state.missingPlugins.length) {
          warned = true;
          console.warn(
            '[sve] site.css loads Tailwind plugins the Visual Editor does not carry, '
            + 'so their classes stay with the Vite build: '
            + state.missingPlugins.join(', ')
          );
        }

        return state;
      })
      .catch((error) => {
        compilerPromise = null;

        throw error;
      });
  }

  return compilerPromise;
}

export async function compileTailwind(win, html) {
  return buildTailwind(await loadTailwindCompiler(win), html);
}

export { buildTailwind };

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

/**
 * Forget the site's theme once site.css was saved (the theme panel, the
 * stylesheet editor): the next compile, suggestion or paint fetches it again,
 * so a color or size made a moment ago is a class the dock knows at once.
 * Only what was kept is dropped — nothing about how a class compiles changes.
 */
export function forgetTailwindTheme() {
  sitePromise = null;
  designPromise = null;
  compilerPromise = null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('sve:site-css-saved', forgetTailwindTheme);
}
