import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import statamic from '@statamic/cms/vite-plugin';
import { keepImportedChunks } from './scripts/vite-keep-imported-chunks.js';

export default defineConfig({
  /**
   * Asset URLs inside the built chunks, resolved against the chunk that asks
   * for them rather than against a base path.
   *
   * The default base is `/build/`, which is not where a published addon lives —
   * it sits under /vendor/visual-editor/build/. A dynamic `import()` survives
   * that, because the browser resolves a relative specifier against the
   * importing module. The stylesheet of an async chunk does not: Vite injects a
   * <link> built from the base, it 404s in silence, and the panel renders as
   * naked HTML. Relative URLs are correct wherever the addon is published.
   */
  experimental: {
    renderBuiltUrl: (filename, { hostType }) =>
      hostType === 'js' ? { relative: true } : filename,
  },
  build: {
    // A full rebuild may add new hashes. It must not wipe the file
    // the current addon.js still imports — that deleted the editor.
    emptyOutDir: false,
  },
  plugins: [
    laravel({
      input: [
        'resources/js/addon.js',
        'resources/js/bridge.js',
        'resources/js/preview.js',
        'resources/js/overlay-host.js',
      ],
      publicDirectory: 'resources/dist',
    }),
    statamic(),
    keepImportedChunks(),
  ],
});
