#!/usr/bin/env node
/**
 * The Theme panel's Fonts tab, in a real Live Preview, with real mouse clicks.
 *
 * Opens the tab between Spacing and Typography, reads the installed fonts
 * back from the site's public/fonts/fonts.css, installs Rubik from Google
 * Fonts through the "Add font" dialog, uploads a TTF converted to WOFF2 in
 * the browser, tries a wrong Adobe Fonts kit, and checks that the new fonts
 * are in the Typography dropdowns and drawn in the preview straight away —
 * no reload. Afterwards fonts.css is put back exactly as it was, and only the
 * files this run added are taken away again; nothing that was there before
 * is touched.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/theme-fonts.mjs
 *
 * Same env as theme-panel.mjs. Needs the installed package to have the fonts
 * routes (PHP); SVE_WORKTREE=1 serves this checkout's JS on top.
 */
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

const FONTS_DIR = `${SITE_DIR}/public/fonts`;
const FONTS_CSS = `${FONTS_DIR}/fonts.css`;
const SITE_CSS = `${SITE_DIR}/resources/css/site.css`;
const originalFonts = existsSync(FONTS_CSS) ? readFileSync(FONTS_CSS, 'utf8') : null;
const originalSite = readFileSync(SITE_CSS, 'utf8');

/** Every path under public/fonts, so the run can take away exactly what it added. */
function listing(dir, base = dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);

    return statSync(path).isDirectory() ? [path, ...listing(path, base)] : [path];
  });
}

const before = new Set(listing(FONTS_DIR));

if (originalFonts?.includes('"Rubik"') || originalFonts?.includes('Sve Test Upload')) {
  console.log('FAIL fonts.css has fonts from an earlier run — put it back first');
  process.exit(1);
}

const PANEL = '#__sve-theme';
const DIALOG = '[data-sve-font-dialog]';

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

const text = (frame, selector) => frame.evaluate((s) => document.querySelector(s)?.textContent.trim() || '', selector);
const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/theme-fonts-${name}.png` });

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && !/422/.test(m.text()) && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 400 && !(r.status() === 422 && r.url().includes('/fonts/adobe')) && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`,
    scriptsDir: `${ADDON_DIR}/resources/js`,
  });
  console.log('info build served from the working tree');
}

const temp = mkdtempSync(join(tmpdir(), 'sve-fonts-'));
const uploadFile = join(temp, 'Testupload-Regular.ttf');

copyFileSync(`${ADDON_DIR}/tests/js/fixtures/inter-ab.ttf`, uploadFile);

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()));
  errors.length = 0;

  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay'))) {
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click());
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });

  let preview = null;

  for (let i = 0; i < 25 && !preview; i++) {
    const el = await cp.$('#live-preview-iframe');
    const f = el ? await el.contentFrame() : null;

    if (f && (await f.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false))) {
      preview = f;
    } else {
      await sleep(1000);
    }
  }

  step('preview has the page', !!preview);
  step('the page links fonts.css (theme_tokens)', await preview.evaluate(() => !!document.querySelector('link[rel="stylesheet"][href*="/fonts/fonts.css"]')));

  // ── The tab ───────────────────────────────────────────────────────────
  await click(page, cp, '#__sve-toolbar button[data-tab="theme"]');
  await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-theme-tab]`), PANEL);

  const tabs = await cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-theme-tab]`)].map((t) => t.dataset.sveThemeTab).join(' '), PANEL);

  step('Fonts sits between Spacing and Typography', tabs === 'colors spacing fonts type button', tabs);
  await click(page, cp, `${PANEL} [data-sve-theme-tab="fonts"]`);

  const installed = () => cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-font]`)].map((e) => e.dataset.sveFont), PANEL);

  step('it lists the fonts in fonts.css', await waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-font]`).length >= 10, PANEL), (await installed()).join(', '));
  step('each drawn in itself (Inter under its alias)', await waitFor(cp, async () => {
    await document.fonts.ready;

    return document.fonts.check('16px "sve-font-inter"') && [...document.fonts].some((f) => f.family.includes('sve-font-inter') && f.status === 'loaded');
  }));
  step('the tab says what Inter is', /Variab|variab/.test(await text(cp, `${PANEL} [data-sve-font="Inter"] .sve-theme__font-meta`)), await text(cp, `${PANEL} [data-sve-font="Inter"] .sve-theme__font-meta`));
  await shot(page, '1-tab');

  // ── Google Fonts ──────────────────────────────────────────────────────
  await click(page, cp, `${PANEL} [data-sve-font-add]`);
  step('"Add font" opens the dialog on Google Fonts', await waitFor(cp, (d) => !!document.querySelector(`${d} [data-sve-font-source="google"].is-on`), DIALOG));
  step('the catalog loads, most popular first', await waitFor(cp, () => document.querySelectorAll('[data-sve-google-font]').length >= 40, null, 20000),
    await cp.evaluate(() => [...document.querySelectorAll('[data-sve-google-font]')].slice(0, 3).map((e) => e.dataset.sveGoogleFont).join(', ')));
  await click(page, cp, '[data-sve-font-search]');
  await page.keyboard.type('Rubik');
  step('search narrows the list', await waitFor(cp, () => document.querySelector('[data-sve-google-font]')?.dataset.sveGoogleFont === 'Rubik'));
  step('the row shows its name in the font', await waitFor(cp, () => /sve-gf-rubik/.test(document.querySelector('[data-sve-google-font="Rubik"] .sve-fontdlg__family-name')?.style.fontFamily || ''), null, 10000));
  await shot(page, '2-list');
  await click(page, cp, '[data-sve-google-font="Rubik"]');
  step('the family opens with its variants', await waitFor(cp, () => document.querySelectorAll('[data-sve-font-variant]').length === 14), await text(cp, '.sve-fontdlg__title'));
  step('Regular is ticked, latin chosen', await cp.evaluate(() => document.querySelector('[data-sve-font-variant="400"]')?.classList.contains('is-on') && document.querySelector('[data-sve-font-subset="latin"]')?.classList.contains('is-on')));
  step('the sample is drawn in Rubik', await waitFor(cp, async () => {
    await document.fonts.ready;

    return [...document.fonts].some((f) => f.family.includes('sve-gf-rubik') && f.status === 'loaded');
  }));
  await click(page, cp, '[data-sve-font-variant="700"]');
  step('variable: one tick takes every upright weight', await cp.evaluate(() => ['300', '400', '500', '600', '700', '800', '900'].every((v) => document.querySelector(`[data-sve-font-variant="${v}"]`)?.classList.contains('is-on'))
    && !document.querySelector('[data-sve-font-variant="700i"]')?.classList.contains('is-on')));
  step('the size of one file is shown', await waitFor(cp, () => /KB/.test(document.querySelector('[data-sve-font-size]')?.textContent || '')), await text(cp, '[data-sve-font-size]'));
  await shot(page, '3-family');
  await click(page, cp, '[data-sve-font-install]');
  step('install closes the dialog', await waitFor(cp, (d) => !document.querySelector(d), DIALOG, 30000));
  step('Rubik is in the tab straight away', await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-font="Rubik"]`), PANEL), await text(cp, `${PANEL} .sve-theme__fonts-status`));

  const fontsCss = readFileSync(FONTS_CSS, 'utf8');
  const rubikFiles = existsSync(`${FONTS_DIR}/rubik`) ? readdirSync(`${FONTS_DIR}/rubik`) : [];

  step('fonts.css got Rubik, and kept every line it had', fontsCss.includes('font-family: "Rubik";') && originalFonts.split('\n').every((line) => fontsCss.includes(line)));
  step('the file is in public/fonts/rubik, as WOFF2', rubikFiles.length === 1 && readFileSync(`${FONTS_DIR}/rubik/${rubikFiles[0]}`).subarray(0, 4).toString() === 'wOF2', rubikFiles.join(' '));

  // ── Typography: the new font is a choice at once, and the preview draws it ──
  await click(page, cp, `${PANEL} [data-sve-theme-tab="type"]`);

  const bodyOptions = await cp.evaluate((p) => [...document.querySelectorAll(`${p} .sve-theme__section select`)][0]?.innerText || '', PANEL);

  step('Typography offers Rubik without a reload', /\bRubik\b/.test(bodyOptions));
  await cp.evaluate((p) => {
    const select = document.querySelector(`${p} .sve-theme__section select`);

    select.value = 'Rubik';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, PANEL);
  step('the preview draws its text in Rubik', await waitFor(preview, async () => {
    await document.fonts.ready;

    return getComputedStyle(document.body).fontFamily.startsWith("'Rubik'") || getComputedStyle(document.body).fontFamily.startsWith('Rubik')
      ? [...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Rubik' && f.status === 'loaded')
      : false;
  }, null, 15000), await preview.evaluate(() => getComputedStyle(document.body).fontFamily));
  await shot(page, '4-type');

  // ── Upload: a TTF, converted to WOFF2 in the browser ──────────────────
  await click(page, cp, `${PANEL} [data-sve-theme-tab="fonts"]`);
  await click(page, cp, `${PANEL} [data-sve-font-add]`);
  await waitFor(cp, (d) => !!document.querySelector(d), DIALOG);
  await click(page, cp, '[data-sve-font-source="upload"]');
  await (await cp.waitForSelector('[data-sve-font-file]')).uploadFile(uploadFile);
  step('the file is read: its family from its own name table', await waitFor(cp, () => document.querySelector('[data-sve-font-family]')?.value === 'Inter'));
  step('the convert switch is on and says what it saves', await waitFor(cp, () => document.querySelector('[data-sve-font-convert]')?.classList.contains('is-on') && /WOFF2 \d/.test(document.querySelector('.sve-fontdlg__upload-size')?.textContent || '')),
    await text(cp, '.sve-fontdlg__upload-size'));
  await cp.evaluate(() => {
    const input = document.querySelector('[data-sve-font-family]');

    input.value = 'Sve Test Upload';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await shot(page, '5-upload');
  await click(page, cp, '[data-sve-font-install]');
  step('upload closes the dialog and lists the family', await waitFor(cp, (p) => !document.querySelector('[data-sve-font-dialog]') && !!document.querySelector(`${p} [data-sve-font="Sve Test Upload"]`), PANEL, 20000));

  const uploaded = `${FONTS_DIR}/sve-test-upload/testupload-regular.woff2`;

  step('stored as WOFF2 under its family', existsSync(uploaded) && readFileSync(uploaded).subarray(0, 4).toString() === 'wOF2');
  step('with its weight range from the file', readFileSync(FONTS_CSS, 'utf8').includes('src: url("sve-test-upload/testupload-regular.woff2") format("woff2");\n  font-weight: 100 900;'));

  // ── Adobe: a wrong kit is refused in words ────────────────────────────
  await click(page, cp, `${PANEL} [data-sve-font-add]`);
  await waitFor(cp, (d) => !!document.querySelector(d), DIALOG);
  await click(page, cp, '[data-sve-font-source="adobe"]');
  await click(page, cp, '[data-sve-font-kit]');
  await page.keyboard.type('https://example.com/not-a-kit.css');
  await click(page, cp, '[data-sve-font-install]');
  step('a URL that is not a kit is refused', await waitFor(cp, () => (document.querySelector('.sve-fontdlg__error')?.textContent || '').trim().length > 5), await text(cp, '.sve-fontdlg__error'));
  await page.keyboard.press('Escape');
  step('Escape closes the dialog and leaves the panel open', await waitFor(cp, (p) => !document.querySelector('[data-sve-font-dialog]') && !!document.querySelector(p), PANEL));

  // The Typography choice was only painted: leave without saving it.
  await click(page, cp, `${PANEL} .sve-theme__ghost`);
  await waitFor(cp, () => [...document.querySelectorAll('.sve-dialog button')].some((b) => b.classList.contains('muted')));
  await cp.evaluate(() => [...document.querySelectorAll('.sve-dialog button')].find((b) => b.classList.contains('muted'))?.click());
  step('the panel closes; site.css was never written', await waitFor(cp, (p) => !document.querySelector(p), PANEL) && readFileSync(SITE_CSS, 'utf8') === originalSite);
} catch (err) {
  step('ran to the end', false, err.message);
} finally {
  await browser.close();
  await sleep(1000);

  // Put back: fonts.css as it was; away only what this run added.
  if (originalFonts !== null) {
    writeFileSync(FONTS_CSS, originalFonts);
  }

  const added = listing(FONTS_DIR).filter((path) => !before.has(path)).sort((a, b) => b.length - a.length);

  for (const path of added) {
    rmSync(path, { recursive: true, force: true });
  }

  rmSync(temp, { recursive: true, force: true });
  console.log(readFileSync(FONTS_CSS, 'utf8') === originalFonts && listing(FONTS_DIR).length === before.size
    ? `fonts.css and public/fonts put back as they were (${added.length} added paths taken away)`
    : 'WARNING: public/fonts was NOT put back as it was');

  if (readFileSync(SITE_CSS, 'utf8') !== originalSite) {
    writeFileSync(SITE_CSS, originalSite);
    console.log('site.css put back');
  }
}

step('no JS errors', errors.length === 0, errors.slice(0, 5).join(' | '));
process.exit(failed ? 1 : 0);
