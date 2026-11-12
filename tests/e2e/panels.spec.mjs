/**
 * Surface: panels (CLAUDE.md §5.2, 4). The globals panel opens with a global
 * set's fields, and the header opens for editing after the preview's
 * "this is global" confirm.
 */
import { expect, test } from '@playwright/test';
import { listen, messages, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

test.beforeEach(() => resetLayout());
test.afterEach(() => resetLayout());

test('the toolbar opens the globals panel with a global set and its fields', async ({ page }) => {
  const { cp } = await openLivePreview(page, await publicSectionCount());

  await cp.locator('#__sve-toolbar button[data-tab="globals"]').click();

  const panel = cp.locator('#__sve-globals-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('[data-sve-globals-title]')).toContainText(/\S/);
  await expect(panel.locator('[data-sve-globals-save-btn]')).toBeVisible();
  // The set's own Statamic form, loaded in the panel's frame.
  await expect(panel.frameLocator('iframe').locator('input, textarea, [contenteditable="true"]').first()).toBeVisible();
});

test('a click on the header asks first, then opens the header for editing', async ({ page }) => {
  const { cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  await listen(cpFrame);

  await preview.locator('header[data-sve-chrome="header"]').click();
  // The header is global; the preview asks before stepping in.
  await preview.getByRole('button', { name: 'Edit', exact: true }).click();

  await expect.poll(() => messages(cpFrame)).toContain('open-chrome');
});
