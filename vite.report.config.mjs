/**
 * The bundle report: the normal build, written to a folder outside
 * resources/dist, with a map of what fills each file (rollup-plugin-visualizer).
 * It never touches the shipped build, so it is also the check that a tool
 * change did not change the bundle: the report's manifest must equal
 * resources/dist/build/manifest.json.
 *
 *   SVE_REPORT_DIR=/tmp/sve-report npx vite build --config vite.report.config.mjs
 *   → $SVE_REPORT_DIR/build/manifest.json and $SVE_REPORT_DIR/bundle-report.html
 *
 * keepImportedChunks is left out: it restores files inside resources/dist,
 * which this build must not write to.
 */
import { join } from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import base from './vite.config.js';

const dir = process.env.SVE_REPORT_DIR;

if (!dir) {
  throw new Error('Set SVE_REPORT_DIR to a folder outside resources/dist.');
}

export default {
  ...base,
  build: { ...base.build, outDir: join(dir, 'build'), emptyOutDir: true },
  plugins: [
    ...base.plugins.flat().filter((plugin) => plugin?.name !== 'sve-keep-imported-chunks'),
    visualizer({ filename: join(dir, 'bundle-report.html'), template: 'treemap', gzipSize: true }),
  ],
};
