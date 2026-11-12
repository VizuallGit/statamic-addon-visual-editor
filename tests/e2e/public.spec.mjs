/**
 * Zero production footprint (CLAUDE.md §1B): a visitor's page loads no
 * Visual Editor file and carries none of its attributes.
 */
import { expect, test } from '@playwright/test';
import { PUBLIC_PATH } from './support.mjs';

test.use({ storageState: { cookies: [], origins: [] } });

test('the public page loads no Visual Editor JS or CSS and has no editor attributes', async ({ page }) => {
  const editorFiles = [];
  page.on('request', (req) => {
    if (/\/vendor\/visual-editor\/|\/!\/sve\//.test(req.url())) editorFiles.push(req.url());
  });

  await page.goto(PUBLIC_PATH, { waitUntil: 'load' });

  await expect(page.locator('[id^="id-"]').first()).toBeAttached();
  expect(editorFiles).toEqual([]);
  await expect(page.locator('[data-sid], [data-sid-field]')).toHaveCount(0);
});
