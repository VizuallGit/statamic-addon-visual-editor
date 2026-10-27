/**
 * Build mode's own bytes: build-mode/boot.js bundled alone, with everything it
 * shares with the editor (the dock, tw-classes, tw-families, the tree parser,
 * lib/, the bus) left out as external — those are in the CP already, or load
 * with the dock. What remains is what switching to Build costs the first time.
 *
 *   SVE_SIZE_OUT=<dir> npx vite build --config tests/harness/build-mode/size.vite.mjs
 *
 * Writes to SVE_SIZE_OUT (default: the system temp folder), never to resources/dist.
 */
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import statamic from '@statamic/cms/vite-plugin';

const ADDON = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const SHARED = /\/(code-dock|tw-classes|tw-tool|tw-families|tw-parse|html-tree-parse|html-tree-edit|html-tree-icons|template-elements|breakpoints|cp\/bus|cp\/mount|lib\/[\w-]+)\.js$/;

export default defineConfig({
  root: ADDON,
  logLevel: 'warn',
  plugins: [statamic()],
  build: {
    outDir: process.env.SVE_SIZE_OUT || join(tmpdir(), 'sve-build-mode-size'),
    emptyOutDir: true,
    minify: true,
    lib: { entry: join(ADDON, 'resources/js/build-mode/boot.js'), formats: ['es'], fileName: 'build-mode' },
    rollupOptions: { external: (id) => SHARED.test(id) && !id.includes('/build-mode/') },
  },
});
