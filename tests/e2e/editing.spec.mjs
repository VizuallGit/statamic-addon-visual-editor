/**
 * Surfaces: set insertion and annotation/targeting (CLAUDE.md §5.2, 2–3).
 * Editing straight in the preview: insert a block through Statamic's own
 * Search Sets, move a section, edit a text in place.
 *
 * Nothing is saved: the form is changed, never published.
 */
import { expect, test } from '@playwright/test';
import { listen, messages, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

test.beforeEach(() => resetLayout());

test('the + under a block opens Statamic Search Sets, and the chosen block appears', async ({ page }) => {
  const { cp, cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  const blocks = preview.locator('[data-sve-component]');
  const before = await blocks.count();
  await listen(cpFrame);

  // The first inserter sits in the hero's block list, which takes more than one set.
  const inserter = preview.locator('#__sve-inserters > *').first();
  await inserter.hover();
  await inserter.click();

  await expect.poll(() => messages(cpFrame)).toContain('add-block-native');
  const picker = cp.locator('[data-ui-popover-content][role="dialog"]');
  await expect(picker.locator('input[data-set-picker-search-input]')).toBeVisible();
  await picker.locator('input[data-set-picker-search-input]').fill('Richtext');
  await picker.getByText('Richtext', { exact: true }).click();

  await expect(blocks).toHaveCount(before + 1);
});

test('Move down swaps a section with the next one', async ({ page }) => {
  const { cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  const sections = preview.locator('[data-sid-section-orderable]');
  const order = () => sections.evaluateAll((els) => els.map((el) => el.getAttribute('data-sid')));
  const [first, second, third] = await order();
  await listen(cpFrame);

  await sections.nth(1).hover();
  await preview.locator('#__sve-move-ctrl button[title="Move down"]').click();

  await expect.poll(() => messages(cpFrame)).toContain('move');
  await expect.poll(async () => (await order()).slice(0, 3)).toEqual([first, third, second]);
});

test('a double-click edits a heading in place, and the form gets the text', async ({ page }) => {
  const { cp, cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  const heading = preview.locator('h1[data-sid-inline-edit], h2[data-sid-inline-edit]').first();
  const added = ` e2e-${Date.now()}`;
  await listen(cpFrame);

  await heading.dblclick();
  await expect.poll(() => messages(cpFrame)).toContain('edit-request');
  await expect
    .poll(() => heading.evaluate((el) => el.isContentEditable || !!el.querySelector('[contenteditable="true"]')))
    .toBe(true);
  await page.keyboard.press('End');
  await page.keyboard.type(added);

  await expect(heading).toContainText(added.trim());
  // The row is drawn on the selection panel; its Bard field holds what was typed.
  await expect(
    cp.locator('#__sve-selection-panel .ProseMirror').filter({ hasText: added.trim() }).first()
  ).toBeAttached();
});

test('the menu on a locked row has neither Duplicate nor Delete', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  // The site's Header global: its Blocks replicator has "Lock rows" on.
  await page.goto('/cp/globals/site_head');
  const licence = page.getByRole('dialog', { name: 'Licensing Alert' });
  const row = page.locator('[data-replicator-set][data-row-locked]').first();
  await expect(row).toBeVisible();
  if (await licence.count()) await licence.getByRole('button', { name: 'Snooze' }).click();

  await row.locator('[data-ui-dropdown-trigger], button[aria-haspopup]').first().click();
  const menu = page.locator('[data-ui-dropdown-content]').last();
  // The menu opens with Statamic's own items; the locked row's are taken out as it appears.
  await expect(menu.locator('[data-ui-dropdown-item]').first()).toBeVisible();
  await expect(menu.locator('[data-ui-dropdown-item]', { hasText: /Duplicate|Delete/ })).toHaveCount(0);
  expect(errors).toEqual([]);
});
