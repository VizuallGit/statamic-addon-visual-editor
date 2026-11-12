/**
 * Logs the test user in once and saves the session for every test.
 *
 * Without SVE_PASS the login fails silently and every test goes red on
 * something that is not the addon, so that is refused here, loudly.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { chromium } from '@playwright/test';
import { PASS, SITE_URL, STATE_FILE, USER } from './support.mjs';

export default async function globalSetup() {
  if (!PASS) {
    throw new Error(
      `SVE_PASS is not set. Without it the login of ${USER} fails and every test is red for that reason.`
    );
  }

  mkdirSync(dirname(STATE_FILE), { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();

  // The form is Vue: filled before it has mounted, it renders empty again and
  // the POST comes back "This field is required". Network idle = mounted.
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle' });
  await page.locator('input[name="email"]').fill(USER);
  await page.locator('input[name="password"]').fill(PASS);
  // Statamic answers the POST with 409 (Inertia version) and then loads the
  // dashboard, or with 302 back to the form when the login failed.
  const posted = page.waitForResponse((r) => r.url().includes('/auth/login') && r.request().method() === 'POST');
  await page.keyboard.press('Enter');
  await posted;
  await page.waitForLoadState('networkidle');
  await page.goto(`${SITE_URL}/cp/dashboard`, { waitUntil: 'networkidle' });

  if (/\/auth\/login/.test(page.url())) {
    await browser.close();
    throw new Error(`Login as ${USER} failed on ${SITE_URL}: check SVE_PASS.`);
  }

  // Cookies only. The editor keeps its layout (Build, the dock, the device) in
  // localStorage as well as in the user's file; a snapshot of it here would
  // start every test in whatever layout this login happened to see.
  const state = await page.context().storageState();
  writeFileSync(STATE_FILE, JSON.stringify({ cookies: state.cookies, origins: [] }));
  await browser.close();
}
