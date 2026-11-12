/**
 * The safety net (quality pass, phase 2): one browser test per surface,
 * against a real site with the addon installed. Run on the bench (a copy of
 * the site, docs/kvalitetsrunde-brief.md §7), never on the demo or Cuben.
 *
 *   SVE_SITE_URL=http://vizuall.localhost:8765 SVE_SITE_DIR=<bench> SVE_PASS=… npm run e2e
 *
 * Uses the installed Chrome (channel: 'chrome'); no browser is downloaded.
 * One worker: the tests share one server and one user's saved layout.
 */
import { defineConfig } from '@playwright/test';
import { SITE_URL, STATE_FILE } from './tests/e2e/support.mjs';

export default defineConfig({
  testDir: 'tests/e2e',
  globalSetup: './tests/e2e/global-setup.mjs',
  workers: 1,
  fullyParallel: false,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  retries: 0,
  reporter: [['list']],
  outputDir: 'tests/e2e/.results',
  use: {
    baseURL: SITE_URL,
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 900 },
    storageState: STATE_FILE,
    trace: 'retain-on-failure',
  },
});
