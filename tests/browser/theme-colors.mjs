#!/usr/bin/env node
/**
 * The theme colors panel, in a real Live Preview, with real mouse clicks.
 *
 * Opens the palette icon, changes a color and sees the preview repaint, makes
 * a new color with tints and shades, saves, and reads the result back from
 * site.css and from the public page (served by the site's `{{ theme_tokens }}`
 * — no build). site.css is put back exactly as it was afterwards.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/theme-colors.mjs
 *
 * Same env as live-preview-smoke.mjs: SVE_SITE_DIR, SVE_SITE_URL, SVE_USER,
 * SVE_PASS, SVE_ENTRY, SVE_CHROME. SVE_SHOTS=<dir> saves screenshots.
 * SVE_WORKTREE=1 serves this checkout's build instead of the installed one.
 */
import { readFileSync, writeFileSync } from 'node:fs';
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

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let failed = 0;
const step = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const CSS_FILE = `${SITE_DIR}/resources/css/site.css`;
const original = readFileSync(CSS_FILE, 'utf8');

if (original.includes('--color-testmoss')) {
  console.log('FAIL site.css already has --color-testmoss from an earlier run — put site.css back first');
  process.exit(1);
}

/** Page coordinates of the `nth` visible match inside `frame`, through its parent frames. */
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

/**
 * A real mouse click. Right after Live Preview opens the page is not
 * hit-testable for a moment (elementFromPoint gives <html>, a view transition
 * is running) — a click then lands on nothing, so wait that out first.
 */
async function click(page, frame, selector, nth = 0) {
  const { x, y } = await pointIn(frame, selector, nth);
  const t0 = Date.now();

  while (Date.now() - t0 < 8000 && (await page.evaluate((px, py) => document.elementFromPoint(px, py)?.tagName === 'HTML', x, y))) {
    await sleep(100);
  }

  await page.mouse.click(x, y);
}

/** Click into the input, select its text and type over it, then Tab (a `change`). */
async function retype(page, frame, selector, text, nth = 0) {
  await click(page, frame, selector, nth);
  await frame.evaluate(() => document.activeElement?.select?.());
  await page.keyboard.type(text);
  await page.keyboard.press('Tab');
}

const OPEN = '#__sve-theme-colors .sve-colors__card.is-open';
const TEXT_INPUTS = `${OPEN} .sve-colors__field input[type="text"]`;
const SWITCHES = `${OPEN} .sve-colors__switch`;

async function waitFor(frame, fn, arg, ms = 8000) {
  const t0 = Date.now();

  while (Date.now() - t0 < ms) {
    if (await frame.evaluate(fn, arg).catch(() => false)) {
      return true;
    }

    await sleep(100);
  }

  return false;
}

const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/theme-colors-${name}.png` });

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

if (env('SVE_WORKTREE', '') === '1') {
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
  errors.length = 0; // the login page's own 401/409s are not the editor's

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

  // What the page itself has for primary before anything changes.
  const before = await preview.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim());

  step('the page gets its colors from theme_tokens', /^#11122c$/i.test(before), `--color-primary = ${before}`);

  const icon = '#__sve-toolbar button[data-tab="theme_colors"]';

  step('palette icon in the top bar', !!(await cp.$(icon)), await cp.$eval(icon, (b) => b.title).catch(() => 'missing'));

  await click(page, cp, icon);

  const opened = await waitFor(cp, () => document.querySelectorAll('#__sve-theme-colors .sve-colors__card').length >= 6);

  if (!opened) {
    console.log('info after the click:', await cp.evaluate(() => {
      const el = document.getElementById('__sve-theme-colors');

      return el ? `panel in DOM, ${el.getBoundingClientRect().width}x${el.getBoundingClientRect().height}, text="${el.textContent.trim().slice(0, 160)}"` : 'no panel element';
    }));
  }

  step('panel opens with the colors from site.css', opened, await cp.evaluate(() => [...document.querySelectorAll('#__sve-theme-colors .sve-colors__token')].map((e) => e.textContent.trim()).join(' ')));

  const look = await cp.evaluate(() => {
    const el = document.querySelector('#__sve-theme-colors .sve-colors');

    return el ? { bg: getComputedStyle(el).backgroundColor, title: el.querySelector('.sve-colors__title')?.textContent.trim() } : null;
  });

  step('its stylesheet loaded (async chunk CSS)', look?.bg === 'rgb(30, 30, 33)', look?.bg);
  step('its strings are translated', !!look?.title && !look.title.startsWith('theme_colors'), look?.title);
  await shot(page, '1-open');

  // Change primary: the preview repaints before anything is saved.
  await click(page, cp, '#__sve-theme-colors .sve-colors__card:nth-of-type(3) .sve-colors__row');

  const primaryOpen = await waitFor(cp, () => /--primary$/.test(document.querySelector('#__sve-theme-colors .sve-colors__card.is-open .sve-colors__token')?.textContent.trim() || ''));

  step('primary opens', primaryOpen);
  step('primary shows its 11 own steps', await cp.evaluate((sel) => document.querySelectorAll(`${sel} .sve-colors__swatch.is-editable`).length === 11, OPEN));
  await retype(page, cp, TEXT_INPUTS, '#ff0000', 1);

  const painted = await waitFor(preview, () => {
    const probe = document.createElement('div');

    probe.style.background = 'var(--primary)';
    document.body.append(probe);

    const bg = getComputedStyle(probe).backgroundColor;

    probe.remove();

    return bg === 'rgb(255, 0, 0)';
  });

  step('the preview repaints at once (var(--primary) is red)', painted);
  await shot(page, '2-primary-red');

  // A new color with tints and shades.
  await click(page, cp, '#__sve-theme-colors .sve-colors__add');
  await waitFor(cp, (sel) => !!document.querySelector(`${sel} input[type="text"]:not([readonly])`), OPEN);
  await retype(page, cp, TEXT_INPUTS, 'gutter', 0);
  step(
    'a name the site already uses is refused',
    await waitFor(cp, (sel) => /gutter/.test(document.querySelector(`${sel} .sve-colors__problem`)?.textContent || ''), OPEN),
    await cp.evaluate((sel) => document.querySelector(`${sel} .sve-colors__problem`)?.textContent.trim() || 'no message', OPEN)
  );
  await click(page, cp, '#__sve-theme-colors .sve-colors__save');
  step('save is refused while a name is wrong', await waitFor(cp, () => /navn|name/i.test(document.querySelector('#__sve-theme-colors .sve-colors__status')?.textContent || '')), readFileSync(CSS_FILE, 'utf8') === original ? 'site.css untouched' : 'site.css CHANGED');
  await retype(page, cp, TEXT_INPUTS, 'testmoss', 0);
  await retype(page, cp, TEXT_INPUTS, '#55613f', 1);
  await click(page, cp, SWITCHES, 0); // tints on: 3
  await click(page, cp, `${OPEN} .sve-colors__stepper button:last-child`, 0); // 4
  await click(page, cp, SWITCHES, 1); // shades on: 3

  const steps = await cp.evaluate((sel) => [...document.querySelectorAll(`${sel} .sve-colors__swatch-name`)].map((e) => e.textContent.trim()), OPEN);

  step('4 tints and 3 shades, named by lightness', steps.length === 7, steps.join(' '));
  step('the new color paints into the preview too', await waitFor(preview, () => getComputedStyle(document.documentElement).getPropertyValue('--color-testmoss').trim() === '#55613f'));
  await shot(page, '3-new-color');

  // Save: site.css on disk, and the public page, without a build.
  await click(page, cp, '#__sve-theme-colors .sve-colors__save');

  // The button is disabled while saving too; the status says when it is done.
  const saved = await waitFor(cp, () => /^(saved|gemt)$/i.test(document.querySelector('#__sve-theme-colors .sve-colors__status')?.textContent.trim() || ''), null, 10000);
  const css = readFileSync(CSS_FILE, 'utf8');

  step('save finishes', saved, await cp.evaluate(() => {
    const el = document.getElementById('__sve-theme-colors');

    return el ? `status="${el.querySelector('.sve-colors__status')?.textContent.trim()}"` : 'panel is gone';
  }));
  step('site.css has the new color and the changed primary', css.includes('--color-testmoss: #55613f;') && css.includes('--color-primary: #ff0000;'));

  const touched = css.split('\n').filter((line, i, all) => !original.includes(line)).filter((l) => !/--color-(testmoss|primary)\b/.test(l) && l.trim() !== '');

  step('nothing else in site.css changed', touched.length === 0, touched.slice(0, 3).join(' | '));

  const html = await (await fetch(`${SITE_URL}/`)).text();

  step('the public page serves the saved colors (no build)', html.includes('--color-testmoss: #55613f;') && html.includes('--color-primary: #ff0000;'));

  await click(page, cp, '#__sve-theme-colors .sve-colors__ghost-icon');
  step('closes without asking once saved', await waitFor(cp, () => !document.getElementById('__sve-theme-colors')));
} catch (err) {
  step('ran to the end', false, err.message);
} finally {
  // A save still on its way would land after a restore made right now.
  await browser.close();
  await sleep(2000);
  writeFileSync(CSS_FILE, original);
  await sleep(1000);
  console.log(readFileSync(CSS_FILE, 'utf8') === original ? 'site.css put back as it was' : 'WARNING: site.css was NOT restored');
}

step('no JS errors', errors.length === 0, errors.slice(0, 5).join(' | '));
process.exit(failed ? 1 : 0);
