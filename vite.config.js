import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import statamic from '@statamic/cms/vite-plugin';
import { keepImportedChunks } from './scripts/vite-keep-imported-chunks.js';

export default defineConfig({
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
