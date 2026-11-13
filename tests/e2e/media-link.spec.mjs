/**
 * Surface: inline editing's image and link doors (CLAUDE.md §5.2, 2), from
 * the preview into the CP. Written before inline-edit.js was split (quality
 * pass, tab G), so the split has a net: a click on an image asks the CP for
 * its field, and a button's text in edit offers "Skift link" when its row has
 * a URL.
 *
 * What these do not check, because it does not happen on the bench today
 * (v1.1.818; see the status file, tab G): the asset browser opening after
 * the image click, and a highlight on the URL field after "Skift link".
 *
 * The link test gives the hero's first button a URL in the bench's copy of
 * the page, so it only runs with SVE_SITE_DIR set, and puts the file back.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { SITE_DIR, listen, messages, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

const PAGE = join(SITE_DIR, 'content/collections/pages/test-ny.md');
const LABEL = "                text: 'Kontakt mig for at hører mere'\n";
let original = null;

test.beforeEach(() => resetLayout());
test.afterEach(() => {
  if (original !== null) writeFileSync(PAGE, original);
  original = null;
  resetLayout();
});

/** A field's input that a person can see, holding `value`. */
const shownInput = (cpFrame, value) =>
  cpFrame.evaluate(
    (v) => [...document.querySelectorAll('input')].some((input) => input.value === v && input.offsetWidth > 0),
    value
  );

test('a click on an image asks the CP for its field, and the panel shows the image', async ({ page }) => {
  const { cp, cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  await listen(cpFrame);
  const image = preview.locator('[data-sid-field="media"][data-sid-inline-edit] img').first();
  const box = await image.boundingBox();

  // The hero's text lies over the left of its image; the right is the image's own.
  await image.click({ position: { x: box.width * 0.8, y: box.height * 0.2 } });

  await expect.poll(() => messages(cpFrame)).toContain('asset-edit');
  await expect(cp.locator('.assets-fieldtype').filter({ visible: true })).toContainText('rectangle-1-(6).jpg');
});

test('a button whose row has a URL offers "Skift link" while its text is edited, and the panel shows the URL', async ({
  page,
}) => {
  test.skip(!process.env.SVE_SITE_DIR, 'writes the page: run it on the bench (SVE_SITE_DIR)');
  original = readFileSync(PAGE, 'utf8');
  expect(original.includes(LABEL), 'the hero button this test gives a URL').toBe(true);
  writeFileSync(PAGE, original.replace(LABEL, `${LABEL}                url: /e2e-link\n`));

  const { cpFrame, preview } = await openLivePreview(page, await publicSectionCount());
  await listen(cpFrame);
  const label = preview.locator('[data-sid-field="text"][data-sid-inline-edit]', { hasText: 'Kontakt mig' }).first();
  await expect(label.locator('xpath=ancestor::a[1]')).toHaveAttribute('href', '/e2e-link');

  await label.dblclick();
  const button = preview.locator('#__sve-edit-toolbar button[title="Skift link"]');
  await expect(button).toBeVisible();
  await button.click();

  await expect.poll(() => messages(cpFrame)).toContain('link-edit');
  await expect.poll(() => shownInput(cpFrame, '/e2e-link')).toBe(true);
});
