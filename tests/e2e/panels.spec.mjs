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

test('typing in the globals panel reaches the preview and lights Save, with no error', async ({ page }) => {
  const { cp, cpFrame } = await openLivePreview(page, await publicSectionCount());
  // The listener for the panel's values runs in the CP window inside the overlay.
  await cpFrame.evaluate(() => {
    window.__e2eErrors = [];
    window.addEventListener('error', (e) => window.__e2eErrors.push(e.message));
  });
  const stashed = [];
  page.on('request', (r) => r.method() === 'POST' && r.url().includes('/!/sve/globals-preview') && stashed.push(r));

  await cp.locator('#__sve-toolbar button[data-tab="globals"]').click();
  const panel = cp.locator('#__sve-globals-panel');
  const save = panel.locator('[data-sve-globals-save-btn]');
  await expect(save).toHaveCSS('opacity', '0.7');

  // The panel's frame has booted the editor when its own style is in: from then
  // on it watches the form's values. Nothing is saved.
  const booted = () =>
    page
      .frames()
      .find((f) => f.url().includes('sve-panel='))
      ?.evaluate(() =>
        [...document.querySelectorAll('style')].some((s) => s.textContent.includes('data-sve-panel-hide'))
      ) ?? false;
  await expect.poll(booted).toBe(true);
  const input = panel.frameLocator('iframe').locator('input[type="text"]:visible').first();
  await input.click();
  await input.press('End');
  // Typed as a person types: the form's values are compared a few times a second.
  await input.pressSequentially(' e2e', { delay: 150 });

  await expect.poll(() => stashed.length).toBeGreaterThan(0);
  await expect(save).toHaveCSS('opacity', '1');
  expect(await cpFrame.evaluate(() => window.__e2eErrors)).toEqual([]);
});

test('a click on the header asks first, then opens the header for editing', async ({ page }) => {
  const { cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  await listen(cpFrame);

  await preview.locator('header[data-sve-chrome="header"]').click();
  // The header is global; the preview asks before stepping in.
  await preview.getByRole('button', { name: 'Edit', exact: true }).click();

  await expect.poll(() => messages(cpFrame)).toContain('open-chrome');
});

test('the outline panel opens and closes from the toolbar, and the icon shows it', async ({ page }) => {
  const { cp } = await openLivePreview(page, await publicSectionCount());
  // The outline is in the editor's toolbar on the bench; the performance panel
  // makes the same two calls (lib/header-tab.js) but its icon is in the
  // developer's toolbar only.
  const icon = cp.locator('#__sve-toolbar button[data-tab="outline"]');
  const panel = cp.locator('#__sve-outline-panel');

  await icon.click();
  await expect(panel).toBeVisible();
  await expect(icon).toHaveAttribute('aria-pressed', 'true');

  // Closed from the panel's own close button: the panel clears the tab and asks
  // the shell to draw the toolbar again (lib/header-tab.js, over the bus).
  await panel.locator('[data-sve-close]').click();
  await expect(panel).toHaveCount(0);
  await expect(icon).toHaveAttribute('aria-pressed', 'false');

  // And from the icon itself, both ways.
  await icon.click();
  await expect(panel).toBeVisible();
  await expect(icon).toHaveAttribute('aria-pressed', 'true');
  await icon.click();
  await expect(panel).toHaveCount(0);
  await expect(icon).toHaveAttribute('aria-pressed', 'false');
});
