/**
 * Surface: the HTML tree (CLAUDE.md §5.2, 4), the layer list beside the dock
 * in Build. Written before html-tree.js was split (quality pass, tab G), so
 * the split has a net: the tree opens, shows the section's elements, a click
 * on a row picks that element on the canvas, and a row can be renamed.
 *
 * A row's name is kept in the browser (html-tree-labels.js, localStorage),
 * and a test's browser is thrown away after it: nothing is written to the site.
 */
import { expect, test } from '@playwright/test';
import { leaveBuild, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

test.beforeEach(() => resetLayout());
test.afterEach(async ({ page }) => {
  await leaveBuild(page);
  resetLayout();
});

test('the HTML tree shows the section, a click on a row picks it on the canvas, and a row can be renamed', async ({
  page,
}) => {
  const { cp } = await openLivePreview(page, await publicSectionCount());
  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="visual"]').click();
  const canvas = cp.frameLocator('#__sve-build-canvas');
  const tree = cp.locator('#__sve-html-tree-panel');

  // One click on the canvas opens the section (an h2 further down: the hero's
  // h1 sits under the header on this page's canvas, see build-dock.spec.mjs).
  await canvas.locator('h2').first().click();
  await expect(cp.locator('#__sve-build-panel')).toContainText('Inserting into');

  // The tree opens beside the dock and lists the section: its root, picked,
  // and the element under it.
  await expect(tree).toBeVisible();
  const current = tree.locator('[data-sve-ht-row][data-sve-ht-current]');
  await expect(current).toHaveAttribute('data-sve-ht-depth', '0');
  const named = tree.locator('[data-sve-ht-row][data-sve-ht-depth="1"]', {
    has: page.locator('[data-sve-ht-name]', { hasText: /^inner-wrapper$/ }),
  });
  await expect(named).toHaveCount(1);
  // By its id from here on: the rename below changes the name.
  const row = tree.locator(`[data-sve-ht-row][data-sve-ht-id="${await named.getAttribute('data-sve-ht-id')}"]`);

  // A click on the row picks that element: the row is marked, and the canvas
  // marks the element instead of the section.
  const picked = canvas.locator('[data-sve-build-sel]').first();
  await expect(picked).not.toHaveClass(/\binner-wrapper\b/);
  await row.click();
  await expect(row).toHaveAttribute('data-sve-ht-current', '');
  await expect(current).toHaveCount(1); // the mark moved: one row, this one
  await expect(picked).toHaveClass(/\binner-wrapper\b/);

  // A double-click renames it; Enter keeps the new name.
  await row.dblclick();
  const input = tree.locator('[data-sve-ht-rename]');
  await expect(input).toBeFocused();
  await input.fill('Wrapper e2e');
  await input.press('Enter');
  await expect(input).toHaveCount(0);
  await expect(row.locator('[data-sve-ht-name]')).toHaveText('Wrapper e2e');
});
