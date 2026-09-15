/**
 * Tailwind's own compiler, given this site's theme.
 *
 * Not an imitation of Tailwind — the same engine Vite runs, handed the same
 * `@theme`, `@utility` and `@plugin` declarations `site.css` uses. So a class
 * compiles here exactly when it would compile in a real build: `after:`,
 * `before:`, `prose-p:`, arbitrary values, opacity modifiers, all of it.
 *
 * The same input builds the *design system* behind the dock's suggestions —
 * `getClassList()`, `candidatesToCss()`, `getVariants()`, the three calls the
 * official Tailwind IntelliSense is built on. One source of truth, so the list
 * you pick from and the CSS that gets written can never drift apart.
 *
 * Only the utilities layer is asked for. Preflight and the site's base layers
 * stay with `site.css`, and so do its `@utility` names — emitting those again
 * from `{{ sve_tw }}` would put a second copy after the stylesheet that owns
 * them.
 *
 * The compiler is built once and kept: `build()` on an existing one is cheap,
 * `compile()` is not.
 */

import { twCandidates, twSiteUtilities } from './tw-candidates.js';

const THEME_ID = 'sve:tailwind-theme';
const UTILITIES_ID = 'sve:tailwind-utilities';

/**
 * The stylesheet both the compiler and the design system are built from.
 *
 * @param {object} site     `{ css, plugins }` from /!/sve/tailwind-theme
 * @param {object} modules  plugin name -> imported module
 */
function sourceFor(site, modules) {
  const known = (site?.plugins || []).filter((name) => modules?.[name]);
  const missing = (site?.plugins || []).filter((name) => !modules?.[name]);

  const input = [
    '@layer theme, base, components, utilities;',
    `@import "${THEME_ID}" layer(theme);`,
    `@import "${UTILITIES_ID}" layer(utilities);`,
    ...known.map((name) => `@plugin "${name}";`),
    String(site?.css || ''),
  ].join('\n');

  return { input, known, missing };
}

/** Where the engine reads its two stylesheets and its plugins from. */
function loaderFor(sources, modules) {
  return {
    base: '/',
    loadStylesheet: async (id, base) => ({
      base,
      content: id === UTILITIES_ID ? sources.utilities : sources.theme,
    }),
    loadModule: async (id, base) => {
      const mod = modules?.[id];

      if (!mod) {
        throw new Error(`Visual Editor cannot load the Tailwind plugin ${id}`);
      }

      return { base, path: id, module: mod.default ?? mod };
    },
  };
}

/**
 * @param {object} sources          the package's own stylesheets, as text
 * @param {object} site             `{ css, plugins }` from /!/sve/tailwind-theme
 * @param {object} modules          plugin name -> imported module
 * @param {Function} compile        tailwindcss `compile`
 */
export async function makeTailwindCompiler({ compile, sources, site, modules }) {
  const { input, missing } = sourceFor(site, modules);
  const compiler = await compile(input, loaderFor(sources, modules));

  return {
    compiler,
    missingPlugins: missing,
    skip: skipSet(site),
  };
}

/**
 * The design system behind the suggestions.
 *
 * Same input as the compiler, so the class list is this site's — `py-1200` and
 * `bg-primary-500` alongside every utility Tailwind ships.
 *
 * @param {Function} loadDesignSystem  tailwindcss `__unstable__loadDesignSystem`
 */
export async function makeDesignSystem({ loadDesignSystem, sources, site, modules }) {
  const { input } = sourceFor(site, modules);

  return loadDesignSystem(input, loaderFor(sources, modules));
}

/**
 * What must not be baked.
 *
 * Only `@utility` names. Those belong to `site.css`; emitting them again
 * would put a second copy after the sheet that owns them.
 *
 * Classes already in the Vite build are not skipped. `{{ sve_tw }}` is
 * pushed after `site.css`, so an unprefixed rule baked here beats a
 * `max-md:` variant left in the earlier sheet. That is why
 * `max-md:grid-cols-1` did nothing while `max-md:grid-cols-2` (not in the
 * build, so baked) worked: `grid-cols-4` lived in `sve_tw` and won.
 * Baking the file's whole candidate list keeps the cascade in one sheet.
 */
function skipSet(site) {
  return twSiteUtilities(site?.css || '');
}

/**
 * The CSS for one file's classes.
 *
 * An unknown class is not an error — Tailwind simply has no rule for it, and
 * the reader finds out by seeing nothing change.
 */
export function buildTailwind(state, html) {
  const candidates = twCandidates(html).filter((name) => !state.skip.has(name));

  if (!candidates.length) {
    return '';
  }

  return state.compiler.build(candidates);
}
