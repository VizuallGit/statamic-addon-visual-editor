#!/usr/bin/env node
/**
 * The text styles popup (Bard styles), in a real Live Preview, with real mouse clicks.
 *
 * Opens it from the top bar, reads the site's list from the bard-style addon,
 * makes a group and a paragraph style in it, sees the preview paint the style,
 * is stopped by a style without a name, saves, finds both in the addon's
 * settings file (resources/addons/bard-style.yaml) and in the CP's next load —
 * what Bard builds its buttons from — and is asked before closing with unsaved
 * changes. Then it deletes both again through the popup and saves: the file
 * must be what it was, byte for byte. It is put back afterwards either way.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' SVE_WORKTREE=1 \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/bard-styles.mjs
 *
 * Needs bard-style with its styles API (v1.1+) behind SVE_SITE_URL — installed,
 * or a server that loads its checkout. Same env as theme-fonts.mjs.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SHOTS = env('SVE_SHOTS', '');
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const WORKTREE = env('SVE_WORKTREE', '') === '1';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let failed = 0;
const step = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const SETTINGS = `${SITE_DIR}/resources/addons/bard-style.yaml`;
const original = existsSync(SETTINGS) ? readFileSync(SETTINGS, 'utf8') : null;

if (original?.includes('sve_test_lead') || original?.includes('sve-test-gruppe')) {
  console.log('FAIL bard-style.yaml has styles from an earlier run — put it back first');
  process.exit(1);
}

const POPUP = '[data-sve-bard-styles]';

async function pointIn(frame, selector, nth = 0) {
  const r = await frame.evaluate((sel, n) => {
    const seen = [...document.querySelectorAll(sel)].filter((el) => {
      const b = el.getBoundingClientRect();

      return b.width > 0 && b.height > 0;
    });
    const el = seen[n];

    if (!el) {
      return null;
    }

    el.scrollIntoView({ block: 'center', behavior: 'instant' });

    const b = el.getBoundingClientRect();

    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }, selector, nth);

  if (!r) {
    throw new Error(`nothing visible for ${selector} [${nth}]`);
  }

  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const box = await (await f.frameElement()).boundingBox();

    r.x += box.x;
    r.y += box.y;
  }

  return r;
}

async function click(page, frame, selector, nth = 0) {
  const { x, y } = await pointIn(frame, selector, nth);
  const t0 = Date.now();

  while (Date.now() - t0 < 8000 && (await page.evaluate((px, py) => document.elementFromPoint(px, py)?.tagName === 'HTML', x, y))) {
    await sleep(100);
  }

  await page.mouse.click(x, y);
}

/** Click into a field and type, as a person would. */
async function type(page, frame, selector, value) {
  await click(page, frame, selector);
  await page.keyboard.type(value, { delay: 10 });
}

async function waitFor(frame, fn, arg, ms = 10000) {
  const t0 = Date.now();

  while (Date.now() - t0 < ms) {
    if (await frame.evaluate(fn, arg).catch(() => false)) {
      return true;
    }

    await sleep(100);
  }

  return false;
}

const value = (frame, selector) => frame.evaluate((s) => document.querySelector(s)?.value ?? null, selector);
const text = (frame, selector) => frame.evaluate((s) => document.querySelector(s)?.textContent.trim() || '', selector);
const rowCount = (frame) => frame.evaluate((p) => document.querySelectorAll(`${p} [data-sve-bs-row]`).length, POPUP);
const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/bard-styles-${name}.png` });

/** The Live Preview overlay's CP frame, after the page has (re)loaded. */
async function openLivePreview(page) {
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click());
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });

  return cp;
}

async function openPopup(page, cp) {
  await waitFor(cp, () => !!document.querySelector('#__sve-toolbar button[data-tab="bard_styles"]'), null, 15000);
  await click(page, cp, '#__sve-toolbar button[data-tab="bard_styles"]');

  return waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-bs-row]`).length > 0, POPUP, 15000);
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && !/422/.test(m.text()) && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 400 && !(r.status() === 422 && r.url().includes('/bard-style/styles')) && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`,
    scriptsDir: `${ADDON_DIR}/resources/js`,
  });
  console.log('info build served from the working tree');
}

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()));
  errors.length = 0;

  let cp = await openLivePreview(page);

  // ── The icon and the list ───────────────────────────────────────────────
  const title = await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="bard_styles"]')?.title || '');

  step('top bar has the text styles icon', !!title, title);
  step('popup opens with the site\'s styles', await openPopup(page, cp));
  await shot(page, 'open');

  const api = await cp.evaluate(async () => {
    const res = await fetch(`${Statamic.$config.get('cpRoot') || '/cp'}/bard-style/styles`, { headers: { Accept: 'application/json' } });

    return res.json();
  });
  const rows = await rowCount(cp);

  step('one row per style the addon serves', rows === api.styles.length, `${rows} rows, ${api.styles.length} styles, source ${api.source}`);
  step('Title is in the list', await cp.evaluate((p) => !!document.querySelector(`${p} [data-sve-bs-row="title"]`), POPUP));

  // ── A group ─────────────────────────────────────────────────────────────
  await click(page, cp, `${POPUP} [data-sve-bs-tab="groups"]`);
  await click(page, cp, `${POPUP} [data-sve-bs-add]`);
  await type(page, cp, '#sve-bs-gname', 'Sve Test Gruppe');
  step('a group\'s handle follows its name', (await value(cp, '#sve-bs-ghandle')) === 'sve-test-gruppe', await value(cp, '#sve-bs-ghandle'));

  // ── A paragraph style in it ─────────────────────────────────────────────
  await click(page, cp, `${POPUP} [data-sve-bs-tab="styles"]`);
  await click(page, cp, `${POPUP} [data-sve-bs-add]`);
  await type(page, cp, '#sve-bs-name', 'Sve Test Lead');
  step('a style\'s handle follows its name', (await value(cp, '#sve-bs-handle')) === 'sve_test_lead', await value(cp, '#sve-bs-handle'));
  step('its button text follows too', (await value(cp, '#sve-bs-ident')) === 'Sv', await value(cp, '#sve-bs-ident'));

  await click(page, cp, `${POPUP} [data-sve-bs-type="paragraph"]`);
  await type(page, cp, '#sve-bs-class', 'sve-test-lead');
  await type(page, cp, '#sve-bs-css', 'text-transform: uppercase; font-size: 1.5em');
  await cp.select('#sve-bs-group', 'sve-test-gruppe');

  const painted = await cp.evaluate((p) => {
    const sample = document.querySelector(`${p} [data-sve-bs-sample]`);

    return sample ? getComputedStyle(sample).textTransform : '';
  }, POPUP);

  step('the preview paints the style', painted === 'uppercase', painted);
  await shot(page, 'style');

  // ── A style without a name stops the save ───────────────────────────────
  await click(page, cp, `${POPUP} [data-sve-bs-add]`);
  await click(page, cp, `${POPUP} [data-sve-bs-save]`);
  await sleep(300);
  step('a style without a name is not saved', !!(await cp.$(`${POPUP} .sve-bs__row.is-bad`)) && (await text(cp, `${POPUP} [data-sve-bs-status]`)).length > 0, await text(cp, `${POPUP} [data-sve-bs-status]`));
  step('nothing was written', (existsSync(SETTINGS) ? readFileSync(SETTINGS, 'utf8') : null) === original);
  await click(page, cp, `${POPUP} [data-sve-bs-delete]`);

  // ── Save ────────────────────────────────────────────────────────────────
  await click(page, cp, `${POPUP} [data-sve-bs-save]`);
  step('saves', await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-bs-reload]`), POPUP, 10000), await text(cp, `${POPUP} [data-sve-bs-status]`));

  const saved = existsSync(SETTINGS) ? readFileSync(SETTINGS, 'utf8') : '';

  step('the settings file has the style', /handle: sve_test_lead\n\s+type: paragraph[\s\S]*?class: sve-test-lead[\s\S]*?group: sve-test-gruppe/.test(saved));
  step('the settings file has the group', /handle: sve-test-gruppe\n\s+name: 'Sve Test Gruppe'/.test(saved));
  step('nothing else in the list moved', saved.replace(/  -\n    handle: sve-test-gruppe\n[\s\S]*?(?=styles:)/, '').replace(/  -\n    handle: sve_test_lead\n[\s\S]*?group: sve-test-gruppe\n/, '') === original);

  const nextLoad = await cp.evaluate(async (entry) => (await fetch(entry, { credentials: 'same-origin' })).text(), ENTRY);

  step('the next CP load hands Bard the new style', nextLoad.includes('sve_test_lead') && nextLoad.includes('bard-styles-source'));
  await shot(page, 'saved');

  // ── Closing with unsaved changes asks first ─────────────────────────────
  await click(page, cp, `${POPUP} [data-sve-bs-row="sve_test_lead"]`);
  await type(page, cp, '#sve-bs-name', ' X');
  await page.keyboard.press('Escape');
  step('Escape with changes asks first', await waitFor(cp, () => !!document.querySelector('.sve-dialog'), null, 5000));
  await click(page, cp, '.sve-dialog button.danger');
  step('Discard closes without saving', await waitFor(cp, (p) => !document.querySelector(p), POPUP, 5000) && readFileSync(SETTINGS, 'utf8') === saved);

  // ── Take both away again ────────────────────────────────────────────────
  step('popup opens again', await openPopup(page, cp));
  await click(page, cp, `${POPUP} [data-sve-bs-row="sve_test_lead"]`);
  await click(page, cp, `${POPUP} [data-sve-bs-delete]`);
  await click(page, cp, `${POPUP} [data-sve-bs-tab="groups"]`);
  await click(page, cp, `${POPUP} [data-sve-bs-row="sve-test-gruppe"]`);
  await click(page, cp, `${POPUP} [data-sve-bs-delete]`);
  await click(page, cp, `${POPUP} [data-sve-bs-save]`);
  await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-bs-reload]`), POPUP, 10000);
  step('deleting both gives back the file as it was', readFileSync(SETTINGS, 'utf8') === original);

  // ── Reload now ─────────────────────────────────────────────────────────
  const before = page.url();

  await click(page, cp, `${POPUP} [data-sve-bs-reload]`);
  await sleep(6000);
  cp = await (await page.$('iframe.sve-edit-overlay'))?.contentFrame();

  const reloaded = await (cp || page.mainFrame()).evaluate(() => Array.isArray(Statamic.$config.get('bard-styles'))).catch(() => false);

  step('Reload now loads the page again', reloaded && !(await cp?.$(POPUP)), `${before} → ${page.url()}`);

  step('no JS errors or failed requests', errors.length === 0, errors.slice(0, 6).join(' | '));
} catch (err) {
  step('run', false, err.message);
  await shot(page, 'error');
} finally {
  const now = existsSync(SETTINGS) ? readFileSync(SETTINGS, 'utf8') : null;

  if (now !== original) {
    if (original === null) {
      rmSync(SETTINGS, { force: true });
    } else {
      writeFileSync(SETTINGS, original);
    }

    console.log('info bard-style.yaml put back');
  }

  await browser.close();
}

console.log(failed ? `\n${failed} failed` : '\nall ok');
process.exit(failed ? 1 : 0);
