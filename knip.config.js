/**
 * Dead files and exports (quality pass). The addon reads window.Vue and has
 * no `vue` dependency, so .vue files get their own compiler: without it Knip
 * misses every import made from a .vue file and calls 11 live files dead.
 *
 * KNIP_STRICT=1 leaves tests and scripts out of the entries: code that only
 * its own test uses then shows up as unused.
 */
const strict = process.env.KNIP_STRICT === '1';

export default {
  entry: [
    // vite.config.js `input` + ServiceProvider::$scripts
    'resources/js/{addon,bridge,preview,overlay-host,mirror,live-reload-morph,dedupe-cp-fetch,save-errors}.js',
    ...(strict ? [] : ['tests/**/*.{js,mjs}', 'scripts/**/*.{js,mjs}']),
  ],
  project: ['resources/js/**/*.{js,vue}'],
  ignore: ['resources/dist/**', 'scripts/bundled/**'],
  // `vue` is window.Vue, provided by Statamic's Vite plugin; puppeteer and
  // esbuild come from the site the browser tests run in; the CLIs are run by
  // scripts/quality.mjs and vite.report.config.mjs.
  ignoreDependencies: ['vue', 'puppeteer', 'esbuild', 'jscpd', 'prettier', 'rollup-plugin-visualizer'],
  ignoreBinaries: ['php'],
  compilers: {
    vue: (text) => [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gm)].map((m) => m[1]).join('\n'),
  },
};
