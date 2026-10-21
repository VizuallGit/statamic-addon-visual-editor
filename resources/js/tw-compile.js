/**
 * Tailwind's own compiler, bundled for the Control Panel.
 *
 * Loaded lazily: nobody pays for the engine until a section is saved with
 * `tailwind_dock` on, or the dock asks for a suggestion. The package's two
 * stylesheets ride along as text, so nothing is fetched from a CDN and nothing
 * needs Vite on the server.
 *
 * Two compilers, two speeds. `build()` remembers every candidate it has been
 * given and keeps emitting their rules, so:
 *
 * - Instant keeps one for the session (`loadTailwindCompiler`): a class paints
 *   the frame it is typed, and a leftover rule for a class the file no longer
 *   has matches nothing in the preview.
 * - The bake takes a fresh one per save (`compileTailwind`): what is written
 *   to disk is this file's classes and nothing else. Compiling the theme costs
 *   10–20 ms; the save is debounced and off the paint path.
 *
 * The design system is read-only — a class list and a compiler for single
 * candidates — so one per session, kept.
 */

import { compile, __unstable__loadDesignSystem } from 'tailwindcss';
import themeSource from 'tailwindcss/theme.css?raw';
import utilitiesSource from 'tailwindcss/utilities.css?raw';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { bakeTailwind, buildTailwind, makeDesignSystem, makeTailwindCompiler } from './tw-compile-core.js';

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
 * Everything a compiler for this site is made from. `css` replaces the site's
 * own `@theme` / `@utility` blocks when a draft of them is what should compile.
 */
async function compilerOptions(win, css) {
  const site = await loadSite(win);

  return {
    compile,
    sources: { theme: themeSource, utilities: utilitiesSource },
    site: css === undefined ? site : { ...site, css },
    modules: MODULES,
  };
}

/**
 * Instant's compiler: made once, kept for the session.
 *
 * The dock paints a class the frame it is typed with `buildTailwind` on this
 * one. It accumulates — see the top of the file — which is why it is not the
 * compiler the save writes to disk with.
 */
export function loadTailwindCompiler(win) {
  if (!compilerPromise) {
    compilerPromise = compilerOptions(win)
      .then((options) => makeTailwindCompiler(options))
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

/**
 * The CSS saved with a file — the section's `sve_tw`, a component's sheet.
 *
 * A compiler of its own per call: the one Instant keeps would hand this file
 * every class the session has seen before it.
 */
export async function compileTailwind(win, html) {
  return bakeTailwind(await compilerOptions(win), html);
}

export { buildTailwind };

/**
 * CSS for `candidates` against a draft of the site's `@theme` / `@utility`
 * blocks: the Theme panel's Utilities tab, before the draft is saved. A
 * compiler of its own each call, because the draft changes with every
 * keystroke; the kept compiler above is not touched. The site's own utility
 * names are not skipped here — they are what is being drawn.
 */
export async function compileDraft(win, css, candidates) {
  if (!candidates.length) {
    return '';
  }

  const state = await makeTailwindCompiler(await compilerOptions(win, css));

  return state.compiler.build(candidates);
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
