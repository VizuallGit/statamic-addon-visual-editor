/**
 * Surfaces: Build mode and the template dock (CLAUDE.md §5.2, 5). Build takes
 * the left column, and the dock opens a section file there.
 */
import { expect, test } from '@playwright/test';
import { leaveBuild, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

test.beforeEach(() => resetLayout());
test.afterEach(async ({ page }) => {
  await leaveBuild(page);
  resetLayout();
});

test('Build opens, and its dock tool shows the dock with a file', async ({ page }) => {
  const { cp } = await openLivePreview(page, await publicSectionCount());

  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="visual"]').click();
  await expect(cp.locator('#__sve-build-panel > *').first()).toBeAttached();
  await expect(cp.locator('.live-preview-fields')).toHaveAttribute('data-sve-build-away', /.*/);

  // Build remembers whether the dock was shown, so the tool is tried both ways:
  // each click flips it, and the test ends with the dock on screen.
  const dock = cp.locator('[data-sve-build-tool="dock"]');
  const shown = (await dock.getAttribute('aria-pressed')) === 'true';
  await dock.click();
  await expect(dock).toHaveAttribute('aria-pressed', String(!shown));
  if (shown) {
    await expect(cp.locator('html')).not.toHaveAttribute('data-sve-build-dock-shown', /.*/);
    await dock.click();
    await expect(dock).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(cp.locator('html')).toHaveAttribute('data-sve-build-dock-shown', /.*/);
  await expect(cp.locator('#__sve-code-dock')).toBeVisible();
});

test('back to Content gives the column back to the form', async ({ page }) => {
  const { cp } = await openLivePreview(page, await publicSectionCount());

  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="visual"]').click();
  await expect(cp.locator('#__sve-build-panel > *').first()).toBeAttached();
  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="content"]').click();

  await expect(cp.locator('#__sve-build-panel')).toHaveCount(0);
  await expect(cp.locator('.live-preview-fields')).not.toHaveAttribute('data-sve-build-away', /.*/);
});

test('on the Build canvas a click picks the section, a second click the element, and Style opens for it', async ({
  page,
}) => {
  const { cp } = await openLivePreview(page, await publicSectionCount());
  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="visual"]').click();
  const canvas = cp.frameLocator('#__sve-build-canvas');
  const panel = cp.locator('#__sve-build-panel');
  // An h2 further down: on this page the hero's h1 sits under the header on the canvas (see the status file).
  const heading = canvas.locator('h2').first();

  await heading.click();
  await expect(panel).toContainText('Inserting into');

  await heading.click();
  await expect(panel.locator('[data-sve-build-tab="style"]')).toBeVisible();
  await expect(panel).toContainText('section-heading');
});
