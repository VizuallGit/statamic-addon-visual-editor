/**
 * Surface: core preview runtime + annotation/targeting (CLAUDE.md §5.2, 1–2).
 * Live Preview opens, the preview shows the page, and a click or a hover in
 * the preview reaches the CP.
 */
import { expect, test } from '@playwright/test';
import { listen, messages, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

test.beforeEach(() => resetLayout());

test('Live Preview opens on the entry and shows every section of the page', async ({ page }) => {
  const sections = await publicSectionCount();
  expect(sections).toBeGreaterThan(0);

  const { cp } = await openLivePreview(page, sections);

  await expect(cp.locator('#__sve-toolbar button')).not.toHaveCount(0);
});

test('a click on a text in the preview draws its row on the selection panel', async ({ page }) => {
  const { cp, cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  await listen(cpFrame);

  await preview.locator('h1[data-sid-field], h2[data-sid-field]').first().click();

  await expect.poll(() => messages(cpFrame)).toContain('click');
  const panel = cp.locator('#__sve-selection-panel [data-sve-selection-panel]');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.sve-sel__title')).not.toHaveText('');
  await expect(panel.locator('.form-group')).not.toHaveCount(0);
});

test('a hover in the preview reaches the CP', async ({ page }) => {
  const { cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  await listen(cpFrame);

  await preview.locator('h1[data-sid-field], h2[data-sid-field]').first().hover();

  await expect.poll(() => messages(cpFrame)).toContain('hover');
});
