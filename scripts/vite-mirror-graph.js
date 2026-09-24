/**
 * The mirror entry gets its own copy of every module it imports.
 *
 * Rollup puts a module that two entries share into a chunk of its own, which
 * both entries then load. resources/js/mirror.js — the breakpoint overview's
 * copies of the preview — reuses the preview's morph (preview.js) and the
 * bridge's video hold (bridge/video-hold.js). Left to Rollup, those modules
 * would become chunks that preview.js and bridge.js import too, and every
 * Live Preview would load one file more to serve an overview that is closed.
 *
 * So every module resolved from mirror.js, or from a module already in its
 * graph, is given the `?mirror` suffix: a different module id to Rollup,
 * bundled again into mirror.js. Vite loads the file behind a suffixed id as it
 * loads any file. The other entries are built exactly as before — the same
 * modules, the same chunks, the same bytes. tests/js/mirror.test.js checks
 * the built result: mirror.js imports nothing, and neither do bridge.js and
 * preview.js.
 */
const SUFFIX = '?mirror';
const ENTRY = /[\\/]resources[\\/]js[\\/]mirror\.js$/;

export function mirrorGraph() {
  return {
    name: 'sve-mirror-graph',
    enforce: 'pre',
    apply: 'build',
    async resolveId(source, importer, options) {
      if (!importer || !(importer.endsWith(SUFFIX) || ENTRY.test(importer))) {
        return null;
      }

      const from = importer.endsWith(SUFFIX) ? importer.slice(0, -SUFFIX.length) : importer;
      const resolved = await this.resolve(source, from, { ...options, skipSelf: true });

      if (!resolved || resolved.external || resolved.id.startsWith('\0') || resolved.id.endsWith(SUFFIX)) {
        return resolved;
      }

      return { ...resolved, id: resolved.id + SUFFIX };
    },
  };
}
