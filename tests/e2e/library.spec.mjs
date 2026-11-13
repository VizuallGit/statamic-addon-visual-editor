/**
 * Surface: the section library (CLAUDE.md §5.2, 4), the pattern picker in
 * the right column. Written before section-library.js was split (quality
 * pass, tab G), so the split has a net: the + on a section opens the picker, it
 * shows cards, and a card dragged onto the preview inserts its section.
 *
 * The section lands in the entry's form, which is not saved: nothing is
 * written to the site.
 */
import { expect, test } from '@playwright/test';
import { OVERLAY, PREVIEW, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

test.beforeEach(() => resetLayout());
test.afterEach(() => resetLayout());

test('the + on a section opens the pattern picker, and a card dragged onto the preview inserts its section', async ({
  page,
}) => {
  const sections = await publicSectionCount();
  const { cp, preview } = await openLivePreview(page, sections);

  // The + on a section in the preview opens the library (cp-shell/add-section.js
  // handleAddSet). The toolbar's Patterns icon is hidden for this user.
  const orderable = preview.locator('[data-sid-section-orderable]');
  const before = await orderable.count();
  await orderable.nth(1).hover();
  await preview.locator('#__sve-move-ctrl button[title="Add a section below this one"]').click();
  const picker = cp.locator('#__sve-section-picker');
  await expect(picker).toBeVisible();
  const card = picker.locator('[data-sve-lib-handle][data-sve-lib-kind="page"]').first();
  await expect(card).toBeVisible();

  // A real drag: the overlay frame covers the page from 0,0, and the preview
  // sits inside it, so a box in the CP frame is a box on the page.
  const from = await card.boundingBox();
  const frame = await cp.locator(PREVIEW).boundingBox();
  const to = { x: frame.x + frame.width / 2, y: frame.y + frame.height / 3 };
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(
      from.x + from.width / 2 + ((to.x - from.x - from.width / 2) * i) / 12,
      from.y + from.height / 2 + ((to.y - from.y - from.height / 2) * i) / 12
    );
  }
  await page.mouse.up();

  // One more section on the page (a section can hold more than one [id^="id-"]).
  await expect(orderable).toHaveCount(before + 1);
  await expect(page.locator(OVERLAY)).toBeVisible();
});
