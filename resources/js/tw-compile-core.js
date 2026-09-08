/**
 * Tailwind's own compiler, given this site's theme.
 *
 * Not an imitation of Tailwind — the same engine Vite runs, handed the same
 * `@theme`, `@utility` and `@plugin` declarations `site.css` uses. So a class
 * compiles here exactly when it would compile in a real build: `after:`,
 * `before:`, `prose-p:`, arbitrary values, opacity modifiers, all of it.
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
 * @param {object} sources          the package's own stylesheets, as text
 * @param {object} site             `{ css, plugins }` from /!/sve/tailwind-theme
 * @param {object} modules          plugin name -> imported module
 * @param {Function} compile        tailwindcss `compile`
 */
export async function makeTailwindCompiler({ compile, sources, site, modules }) {
  const known = (site?.plugins || []).filter((name) => modules?.[name]);
  const missing = (site?.plugins || []).filter((name) => !modules?.[name]);

  const input = [
    '@layer theme, base, components, utilities;',
    `@import "${THEME_ID}" layer(theme);`,
    `@import "${UTILITIES_ID}" layer(utilities);`,
    ...known.map((name) => `@plugin "${name}";`),
    String(site?.css || ''),
  ].join('\n');

  const compiler = await compile(input, {
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
  });

  return {
    compiler,
    missingPlugins: missing,
    skip: twSiteUtilities(site?.css || ''),
  };
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
