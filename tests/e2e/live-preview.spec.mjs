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

test('a hover on the selection panel marks its element in the preview', async ({ page }) => {
  const { cp, preview } = await openLivePreview(page, await publicSectionCount());
  const heading = preview.locator('h1[data-sid-field], h2[data-sid-field]').first();

  await heading.click();
  await expect(cp.locator('#__sve-selection-panel [data-sve-selection-panel]')).toBeVisible();
  await page.mouse.move(5, 500); // off the preview, onto the CP's left column
  await expect(heading).not.toHaveAttribute('data-sid-hover', /.*/);

  await cp.locator('#__sve-selection-panel .form-group:visible').first().hover();

  await expect(heading).toHaveAttribute('data-sid-hover', /.*/);
});

// The side scripts (resources/js/side/) each mark themselves in window.__sveDebug.ran;
// "no errors" alone would not tell a script that never ran from one that did.
const SIDE_SCRIPTS = [
  'default-sets-count',
  'iconify-hide-remove',
  'icon-button-group-iconify',
  'responsive-hide-label',
  'grid-keep-table',
  'grid-collapse',
  'inserter-reveal',
  'toolbar-look',
  'library-drop-focus',
  'collection-template-picker',
  'collection-preset-scaffold',
  'field-prop',
  'section-meta-prefetch',
  'lite-sections',
];

test('Live Preview boots without a JavaScript error, and every side script ran', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__sveDebug = { ran: [] };
  });

  const { cpFrame } = await openLivePreview(page, await publicSectionCount());

  const ran = await cpFrame.evaluate(() => window.__sveDebug?.ran || []);
  expect(SIDE_SCRIPTS.filter((name) => !ran.includes(name))).toEqual([]);
  expect(errors).toEqual([]);
});
