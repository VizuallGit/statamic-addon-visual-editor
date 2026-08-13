import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import statamic from '@statamic/cms/vite-plugin';

export default defineConfig({
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
  ],
});
