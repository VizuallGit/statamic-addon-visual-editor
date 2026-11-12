/**
 * Shared by the e2e tests: where the site is, the test user, and the steps
 * every surface starts from (open the entry, open Live Preview).
 *
 * Waits are on the real thing (an element, a message, a count), never on time.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, request as http } from '@playwright/test';

const env = (key, fallback) => process.env[key] || fallback;

export const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
export const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
export const USER = env('SVE_USER', 'claude-test@vizuall.dk');
export const PASS = env('SVE_PASS', '');
/** "Test ny": 13 sections, the page the phase 0 numbers were measured on. */
export const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
export const PUBLIC_PATH = env('SVE_PUBLIC', '/test-ny');
export const STATE_FILE = join(import.meta.dirname, '.auth/state.json');

export const OVERLAY = 'iframe.sve-edit-overlay[data-open]';
export const PREVIEW = '#live-preview-iframe';
export const SOURCE = 'statamic-visual-editor';

/**
 * Every test starts from the same layout: the editor keeps Build, the dock and
 * the device in the user's preferences (users/<email>.yaml), so a test would
 * otherwise start where the previous one ended.
 */
export function resetLayout(prefs = { 'sve-lp-panel-mode': 'show', 'sve-lp-collapsed': '0' }) {
  const file = join(SITE_DIR, 'users', `${USER}.yaml`);

  if (!existsSync(file)) return;

  let yaml = readFileSync(file, 'utf8').replace(/^ {2}sve_chrome:.*\n(?: {4}.*\n)*/m, '');
  const block = `  sve_chrome:\n${Object.entries(prefs)
    .map(([k, v]) => `    ${k}: '${String(v).replaceAll("'", "''")}'\n`)
    .join('')}`;
  yaml = /^preferences:\n/m.test(yaml)
    ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`)
    : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  writeFileSync(file, yaml);
}

/** How many sections the public page renders for a visitor (no session): what the preview must show too. */
export async function publicSectionCount() {
  const visitor = await http.newContext({ baseURL: SITE_URL });
  const response = await visitor.get(PUBLIC_PATH);
  const html = await response.text();
  await visitor.dispose();
  const count = (html.match(/\sid="id-[^"]+"/g) || []).length;

  if (!count) {
    throw new Error(
      `${PUBLIC_PATH} answered ${response.status()} with no section: ${html.slice(0, 200).replace(/\s+/g, ' ')}`
    );
  }

  return count;
}

/**
 * Open the entry and its Live Preview (or, with navigate: false, Live Preview
 * again on the entry already open). Returns the CP frame inside the overlay
 * (a Frame, for evaluate) and locators for the CP and the preview.
 */
export async function openLivePreview(page, sections, { navigate = true } = {}) {
  // navigate: false opens it again on the page as it stands (the wear test: one tab, many rounds).
  if (navigate) await page.goto(ENTRY);
  const button = page.getByRole('button', { name: 'Live Preview', exact: true });
  await expect(button).toBeVisible();
  // A trial licence shows Statamic's "Licensing Alert" over the whole CP; Snooze is what a person clicks.
  const licence = page.getByRole('dialog', { name: 'Licensing Alert' });
  if (await licence.count()) {
    await licence.getByRole('button', { name: 'Snooze' }).click();
    await expect(licence).toHaveCount(0);
  }
  await button.click();
  // The overlay is parked off-screen while the CP boots inside it; [data-open] means on screen.
  await expect(page.locator(OVERLAY)).toBeVisible({ timeout: 60_000 });
  const cp = page.frameLocator(OVERLAY);
  await expect(cp.locator('#__sve-toolbar button').first()).toBeVisible({ timeout: 60_000 });
  const preview = cp.frameLocator(PREVIEW);
  // The preview loads more than once while the editor boots; the page is there when every section is.
  await expect(preview.locator('[id^="id-"]')).toHaveCount(sections, { timeout: 60_000 });
  const cpFrame = await (await page.$(OVERLAY)).contentFrame();

  return { cp, cpFrame, preview };
}

/**
 * Back to Content before a Build test ends. The editor saves its mode to the
 * user's file a moment after a switch (POST /!/sve/chrome-prefs); a test that
 * ends in Build would have that save land after the next test's resetLayout,
 * and the next test would open in Build. So switch, and wait for the save.
 */
export async function leaveBuild(page) {
  if (!(await page.locator(OVERLAY).count())) return;
  const cp = page.frameLocator(OVERLAY);
  if (!(await cp.locator('#__sve-build-panel').count())) return;

  const saved = page.waitForResponse((r) => r.url().includes('/!/sve/chrome-prefs') && r.request().method() === 'POST');
  await cp.locator('[data-sve-build-switch] [data-sve-build-mode="content"]').click();
  await expect(cp.locator('#__sve-build-panel')).toHaveCount(0);
  await saved;
}

/** Start collecting the editor's messages in a frame; read them with `messages(frame)`. */
export async function listen(frame) {
  await frame.evaluate((source) => {
    window.__e2eSeen = [];
    window.addEventListener('message', (e) => {
      if (e.data?.source === source) window.__e2eSeen.push(e.data.type);
    });
  }, SOURCE);
}

export const messages = (frame) => frame.evaluate(() => window.__e2eSeen || []);
