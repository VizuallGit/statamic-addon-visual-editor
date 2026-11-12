/**
 * Surface: the template dock (CLAUDE.md §5.2, 5). A curated template starts
 * locked; unlocked, a class typed in the HTML pane paints on the Build canvas
 * at once, and the preview follows when the server's morph lands.
 *
 * The dock saves the template on every keystroke, so this test writes a file.
 * It only runs with SVE_SITE_DIR set (the bench), and puts every template in
 * resources/views back as it found it.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { SITE_DIR, leaveBuild, openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

const VIEWS = join(SITE_DIR, 'resources/views');
const snapshot = new Map();

function files(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files(path, out);
    else out.push(path);
  }

  return out;
}

test.skip(!process.env.SVE_SITE_DIR, 'writes a template: run it on the bench (SVE_SITE_DIR)');

test.beforeAll(() => {
  for (const file of files(VIEWS)) snapshot.set(file, readFileSync(file, 'utf8'));
});
// After each test, so every test starts from the locked templates the site ships.
test.afterEach(() => {
  for (const [file, text] of snapshot) if (readFileSync(file, 'utf8') !== text) writeFileSync(file, text);
});
test.beforeEach(() => resetLayout());
test.afterEach(async ({ page }) => {
  await leaveBuild(page);
  resetLayout();
});

/**
 * Page coordinates just after `needle` in the dock's HTML pane, its line
 * scrolled into view first, and what the browser finds at that point (a click
 * there must land in the editor, not on the dock's header over a hidden line).
 */
function spotAfter(cpFrame, needle) {
  return cpFrame.evaluate((text) => {
    const content = [...document.querySelectorAll('#__sve-code-dock .cm-content')].find(
      (c) => c.getAttribute('data-language') === 'html'
    );
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let all = '';
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      nodes.push([node, all.length]);
      all += node.data;
    }
    const end = all.indexOf(text) + text.length;
    if (end < text.length) return null;
    const [node, start] = nodes.findLast(([, offset]) => offset <= end - 1);
    node.parentElement.closest('.cm-line').scrollIntoView({ block: 'center' });
    const range = document.createRange();
    range.setStart(node, end - start);
    range.setEnd(node, end - start);
    const box = range.getBoundingClientRect();
    const x = box.x;
    const y = box.y + box.height / 2;

    return { x, y, inEditor: content.contains(document.elementFromPoint(x, y)) };
  }, needle);
}

test('a locked template opens locked; unlocked, a class typed in the HTML pane paints at once and the preview follows', async ({
  page,
}) => {
  const { cp, cpFrame } = await openLivePreview(page, await publicSectionCount());
  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="visual"]').click();
  const canvas = cp.frameLocator('#__sve-build-canvas');
  const heading = canvas.locator('h2').first();
  await heading.click();
  await heading.click(); // the second click picks the element, and the dock follows it

  const dockTool = cp.locator('[data-sve-build-tool="dock"]');
  if ((await dockTool.getAttribute('aria-pressed')) !== 'true') await dockTool.click();
  const dock = cp.locator('#__sve-code-dock');
  await expect(dock).toBeVisible();

  const lock = dock.locator('[data-sve-code-lock]');
  await expect(lock).toHaveAttribute('aria-pressed', 'true');
  await lock.click();
  // "Unlock this template? … shared by every page that uses this section type."
  await cp.getByRole('button', { name: 'Unlock', exact: true }).click();
  await expect(lock).toHaveAttribute('aria-pressed', 'false');

  const spot = await spotAfter(cpFrame, '[ section-heading ]');
  expect(spot, 'the class of the picked element in the HTML pane').not.toBeNull();
  expect(spot.inEditor, 'the click point is on the editor, not on something over it').toBe(true);
  await page.mouse.click(spot.x, spot.y); // the overlay frame covers the page from 0,0
  await page.keyboard.type(' italic');

  // Paint: the canvas takes the class without waiting for the server.
  await expect(canvas.locator('.section-heading').first()).toHaveClass(/\bitalic\b/, { timeout: 2_000 });
  // Truth: the preview gets it from the server's morph.
  await expect(cp.frameLocator('#live-preview-iframe').locator('.section-heading').first()).toHaveClass(/\bitalic\b/);
});

/** Build, the h2's element picked, the dock shown and its template unlocked. */
async function pickAndUnlock(page) {
  const { cp, cpFrame } = await openLivePreview(page, await publicSectionCount());
  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="visual"]').click();
  const canvas = cp.frameLocator('#__sve-build-canvas');
  const heading = canvas.locator('h2').first();
  await heading.click();
  await heading.click();
  const dockTool = cp.locator('[data-sve-build-tool="dock"]');
  if ((await dockTool.getAttribute('aria-pressed')) !== 'true') await dockTool.click();
  const lock = cp.locator('#__sve-code-dock [data-sve-code-lock]');
  await lock.click();
  await cp.getByRole('button', { name: 'Unlock', exact: true }).click();
  await expect(lock).toHaveAttribute('aria-pressed', 'false');

  return { cp, cpFrame, canvas };
}

test('on an unlocked template, a Style control in Build paints the element at once', async ({ page }) => {
  const { cp, canvas } = await pickAndUnlock(page);
  const element = canvas.locator('.section-heading').first();
  await expect(element).toHaveClass(/(^|\s)flex(\s|$)/); // the class itself, not flex-col

  await cp.locator('#__sve-build-panel [data-sve-build-tab="style"]').click();
  await cp.locator('#__sve-build-panel [data-sve-build-flow="block"]').click();

  await expect(element).not.toHaveClass(/(^|\s)flex(\s|$)/, { timeout: 2_000 });
});
