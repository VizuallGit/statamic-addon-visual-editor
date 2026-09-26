#!/usr/bin/env node
/**
 * The theme panel, in a real Live Preview, with real mouse clicks.
 *
 * Opens the palette icon and goes through the four tabs: changes a color and
 * sees the preview repaint, makes a new color with tints and shades, changes
 * a size and adds one, points H1 at another size, rounds the button — then
 * saves once and reads the result back from site.css and from the public page
 * (served by the site's `{{ theme_tokens }}` — no build). site.css is put back
 * exactly as it was afterwards.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/theme-panel.mjs
 *
 * Same env as live-preview-smoke.mjs: SVE_SITE_DIR, SVE_SITE_URL, SVE_USER,
 * SVE_PASS, SVE_ENTRY, SVE_CHROME. SVE_SHOTS=<dir> saves screenshots.
 * SVE_WORKTREE=1 serves this checkout's build instead of the installed one;
 * the strings then still come from the installed PHP, so they are not checked.
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
const WORKTREE = env('SVE_WORKTREE', '') === '1';

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

if (original.includes('--color-testmoss') || original.includes('--size-1300')) {
  console.log('FAIL site.css has test values from an earlier run — put site.css back first');
  process.exit(1);
}

const PANEL = '#__sve-theme';
const OPEN = `${PANEL} .sve-theme__card.is-open`;
const TEXT_INPUTS = `${OPEN} .sve-theme__field input[type="text"]`;
const SWITCHES = `${OPEN} .sve-theme__switch`;

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

/** Pick an option in a native select by its value, the way a person would end up. */
async function choose(frame, selector, value, nth = 0) {
  return frame.evaluate((sel, v, n) => {
    const el = [...document.querySelectorAll(sel)][n];

    if (!el || ![...el.options].some((o) => o.value === v)) {
      return false;
    }

    el.value = v;
    el.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
  }, selector, value, nth);
}

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

/**
 * The Tailwind chunk to ask. The CP names the installed one; with SVE_WORKTREE
 * that is the old build, so the working tree's own chunk (served by
 * serveWorktreeBuild under the same folder) is asked instead.
 */
const worktreeTwFile = (() => {
  try {
    const manifest = JSON.parse(readFileSync(`${ADDON_DIR}/resources/dist/build/manifest.json`, 'utf8'));

    return manifest['resources/js/tw-compile.js']?.file || '';
  } catch {
    return '';
  }
})();

/** What the dock's Tailwind knows right now: its class list, and the CSS it compiles for `html`. */
const dockTailwind = (frame, html) => frame.evaluate(async (markup, file) => {
  const installed = window.Statamic?.$config?.get?.('sveTwCompile');

  if (!installed) {
    return null;
  }

  const base = new URL(installed, location.href);
  const url = file ? new URL(file.replace(/^assets\//, ''), base).href : base.href;
  const mod = await import(url);
  const design = await mod.loadTailwindDesign(window);
  const names = (design.getClassList() || []).map((entry) => (Array.isArray(entry) ? entry[0] : entry));

  return { names, css: mod.buildTailwind(await mod.loadTailwindCompiler(window), markup) || '' };
}, html, WORKTREE ? worktreeTwFile : '');

const rootVar = (frame, name) => frame.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);
const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/theme-panel-${name}.png` });

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

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
  step('the page gets the theme from theme_tokens', /^#11122c$/i.test(await rootVar(preview, '--color-primary')) && (await rootVar(preview, '--size-500')).startsWith('clamp(1.5rem'));

  // ── Open ──────────────────────────────────────────────────────────────
  const icon = '#__sve-toolbar button[data-tab="theme"]';

  step('palette icon in the top bar', !!(await cp.$(icon)));
  await click(page, cp, icon);
  step('panel opens on Colors with the colors from site.css', await waitFor(cp, (p) => document.querySelectorAll(`${p} .sve-theme__card`).length >= 7, PANEL),
    await cp.evaluate((p) => [...document.querySelectorAll(`${p} .sve-theme__token`)].map((e) => e.textContent.trim()).join(' '), PANEL));
  const look = await cp.evaluate((p) => {
    const el = document.querySelector(`${p} .sve-theme`);
    const cs = getComputedStyle(el);

    return { bg: cs.backgroundColor, display: cs.display, tabs: getComputedStyle(el.querySelector('.sve-theme__tabs')).overflowX };
  }, PANEL);

  // The panel's own sheet: its flex column and the tab row that scrolls.
  step('its stylesheet loaded', look.display === 'flex' && look.tabs === 'auto', JSON.stringify(look));
  step('it sits in the shared right sidebar', await cp.evaluate((p) => !!document.querySelector(`#__sve-right-dock ${p}`), PANEL));
  step('each tab has its icon', await cp.evaluate((p) => document.querySelectorAll(`${p} .sve-theme__tab .sve-theme__tab-icon svg`).length === 4, PANEL));

  const knewBefore = await dockTailwind(cp, '<div class="bg-testmoss-500 p-1300 text-1300"></div>');

  step('the dock\'s Tailwind does not know the new classes yet', !!knewBefore && !knewBefore.names.includes('bg-testmoss-500') && !knewBefore.names.includes('p-1300'));

  if (!WORKTREE) {
    const tab = await cp.evaluate((p) => document.querySelector(`${p} [data-sve-theme-tab="spacing"]`)?.textContent.trim() || '', PANEL);

    step('its strings are translated', !!tab && !tab.startsWith('theme_') && !tab.startsWith('panel_'), tab);
  }

  // ── Colors ────────────────────────────────────────────────────────────
  await click(page, cp, `${PANEL} .sve-theme__card:nth-of-type(3) .sve-theme__row`);
  step('primary opens with its 11 own steps', await waitFor(cp, (o) => document.querySelectorAll(`${o} .sve-theme__swatch.is-editable`).length === 11, OPEN));
  await retype(page, cp, TEXT_INPUTS, '#ff0000', 1);
  step('the preview repaints at once (var(--primary) is red)', await waitFor(preview, () => {
    const probe = document.createElement('div');

    probe.style.background = 'var(--primary)';
    document.body.append(probe);

    const bg = getComputedStyle(probe).backgroundColor;

    probe.remove();

    return bg === 'rgb(255, 0, 0)';
  }));

  const gray = await cp.evaluate((p) => {
    const card = [...document.querySelectorAll(`${p} .sve-theme__card`)].find((c) => c.querySelector('.sve-theme__token')?.textContent.trim() === '--gray');

    return card ? 'found' : 'missing';
  }, PANEL);

  step('the gray scale is one of the colors', gray === 'found');
  await click(page, cp, `${PANEL} .sve-theme__add`);
  await waitFor(cp, (o) => !!document.querySelector(`${o} input[type="text"]:not([readonly])`), OPEN);
  await retype(page, cp, TEXT_INPUTS, 'gutter', 0);
  step('a name the site already uses is refused', await waitFor(cp, (o) => !!document.querySelector(`${o} .sve-theme__input.is-bad`), OPEN));
  await retype(page, cp, TEXT_INPUTS, 'testmoss', 0);
  await retype(page, cp, TEXT_INPUTS, '#55613f', 1);
  await click(page, cp, SWITCHES, 0);
  await click(page, cp, `${OPEN} .sve-theme__stepper button:last-child`, 0);
  await click(page, cp, SWITCHES, 1);

  const steps = await cp.evaluate((o) => [...document.querySelectorAll(`${o} .sve-theme__swatch-name`)].map((e) => e.textContent.trim()), OPEN);

  step('4 tints and 3 shades, named by lightness', steps.length === 7, steps.join(' '));
  step('the new color paints into the preview', await waitFor(preview, () => getComputedStyle(document.documentElement).getPropertyValue('--color-testmoss').trim() === '#55613f'));

  // Another tool takes the sidebar: the panel goes without a question, and
  // comes back with the unsaved changes.
  if (await cp.$('#__sve-toolbar button[data-tab="outline"]')) {
    await click(page, cp, '#__sve-toolbar button[data-tab="outline"]');
    step('another tool replaces it in the sidebar', await waitFor(cp, (p) => !document.querySelector(p) && !!document.querySelector('#__sve-right-dock #__sve-outline-panel'), PANEL));
    await click(page, cp, icon);
    step('back again with the unsaved changes', await waitFor(cp, (p) => {
      const panel = document.querySelector(p);

      return !!panel && !panel.querySelector('.sve-theme__save')?.disabled && [...panel.querySelectorAll('.sve-theme__token')].some((t) => t.textContent.trim() === '--testmoss');
    }, PANEL));
  }
  await shot(page, '1-colors');

  // ── Spacing ───────────────────────────────────────────────────────────
  await click(page, cp, `${PANEL} [data-sve-theme-tab="spacing"]`);

  const names = await cp.evaluate((p) => [...document.querySelectorAll(`${p} .sve-theme__grid-name`)].map((e) => e.textContent.trim()), PANEL);

  step('Spacing lists the scale from site.css', names.length === 16 && names.includes('size-1200'), names.join(' '));

  const row500 = names.indexOf('size-500');

  // Desktop (max) of size-500: 34 → 40 px.
  await retype(page, cp, `${PANEL} .sve-theme__grid input[type="number"]`, '40', row500 * 2 + 1);
  step('a changed size paints at once, written like the fluid-size addon',
    await waitFor(preview, () => getComputedStyle(document.documentElement).getPropertyValue('--size-500').trim() === 'clamp(1.5rem, 1.1667rem + 1.6667vw, 2.5rem)'),
    await rootVar(preview, '--size-500'));
  await click(page, cp, `${PANEL} .sve-theme__add`);
  step('a new size is added after the last', await waitFor(preview, () => getComputedStyle(document.documentElement).getPropertyValue('--size-1300').trim().startsWith('clamp(5.625rem')));
  step('the chart has a bar per size', await cp.evaluate((p) => document.querySelectorAll(`${p} .sve-theme__bars.is-desktop .sve-theme__bar`).length === 17, PANEL));
  await shot(page, '2-spacing');

  // ── Typography ────────────────────────────────────────────────────────
  await click(page, cp, `${PANEL} [data-sve-theme-tab="type"]`);
  step('Typography shows the scale as Aa', await waitFor(cp, (p) => document.querySelectorAll(`${p} .sve-theme__aa-row`).length === 17, PANEL));
  step('H1 → size-800', await choose(cp, `${PANEL} .sve-theme__headings select`, 'size-800', 0));
  // A custom property's computed value has var() filled in: compare with what --size-800 is.
  step('the preview gets the new H1 size', await waitFor(preview, () => {
    const cs = getComputedStyle(document.documentElement);

    return cs.getPropertyValue('--font-size-h1').trim() === cs.getPropertyValue('--size-800').trim();
  }));
  await shot(page, '3-type');

  // ── Button ────────────────────────────────────────────────────────────
  await click(page, cp, `${PANEL} [data-sve-theme-tab="button"]`);
  step('corners → lg (0.5rem)', await choose(cp, `${PANEL} .sve-theme__section select`, '0.5rem', 2));
  step('the preview gets the new corners', await waitFor(preview, () => getComputedStyle(document.documentElement).getPropertyValue('--button-radius').trim() === '0.5rem'));
  await shot(page, '4-button');

  // ── Save once: site.css, and the public page without a build ─────────
  await click(page, cp, `${PANEL} .sve-theme__save`);

  const saved = await waitFor(cp, (p) => /saved|gemt/i.test(document.querySelector(`${p} .sve-theme__status`)?.textContent || '') && document.querySelector(`${p} .sve-theme__save`)?.disabled, PANEL, 10000);
  const css = readFileSync(CSS_FILE, 'utf8');

  step('save finishes', saved, await cp.evaluate((p) => document.querySelector(`${p} .sve-theme__status`)?.textContent.trim() || '', PANEL));

  const expect = [
    '--spacing-1300: var(--size-1300);',
    '--text-1300: var(--size-1300);',
    '--color-primary: #ff0000;',
    '--color-testmoss: #55613f;',
    '--size-500: clamp(1.5rem, 1.1667rem + 1.6667vw, 2.5rem);',
    '--size-1300: clamp(5.625rem, 4.375rem + 6.25vw, 9.375rem);',
    '--font-size-h1: var(--size-800);',
    '--button-radius: 0.5rem;',
  ];

  step('site.css has every change', expect.every((line) => css.includes(line)), expect.filter((line) => !css.includes(line)).join(' | '));

  const touched = css.split('\n').filter((line) => !original.includes(line) && line.trim() !== '')
    .filter((line) => !/--color-(testmoss|primary)\b|--size-(500|1300):|--(spacing|text)-1300:|--font-size-h1:|--button-radius:/.test(line));

  step('nothing else in site.css changed', touched.length === 0, touched.slice(0, 3).join(' | '));

  const html = await (await fetch(`${SITE_URL}/`)).text();

  step('the public page serves the saved theme (no build)', expect.every((line) => html.includes(line)), expect.filter((line) => !html.includes(line)).join(' | '));

  const knewAfter = await dockTailwind(cp, '<div class="bg-testmoss-500 p-1300 text-1300"></div>');

  step('the dock\'s Tailwind knows them straight after the save, no reload',
    !!knewAfter && ['bg-testmoss-500', 'p-1300', 'text-1300'].every((name) => knewAfter.names.includes(name))
      && ['.bg-testmoss-500', '.p-1300', '.text-1300'].every((rule) => knewAfter.css.includes(rule)),
    knewAfter ? ['bg-testmoss-500', 'p-1300', 'text-1300'].filter((name) => !knewAfter.names.includes(name)).join(' ') : 'no compiler');
  step('and the classes that were there still are', !!knewAfter && ['bg-primary-600', 'p-500', 'text-300', 'font-heading'].every((name) => knewAfter.names.includes(name)));

  // Saved, the color's step names are written in templates: a new base keeps
  // them and only changes their colors; renaming by lightness is offered,
  // never done.
  await click(page, cp, `${PANEL} [data-sve-theme-tab="colors"]`);
  await waitFor(cp, (p) => document.querySelectorAll(`${p} .sve-theme__card`).length > 0, PANEL);

  const mossCard = await cp.evaluate((p) => [...document.querySelectorAll(`${p} .sve-theme__card`)].findIndex((c) => c.querySelector('.sve-theme__token')?.textContent.trim() === '--testmoss'), PANEL);

  await click(page, cp, `${PANEL} .sve-theme__card:nth-of-type(${mossCard + 1}) .sve-theme__row`);
  await waitFor(cp, (o) => !!document.querySelector(o), OPEN);

  const stepNames = () => cp.evaluate((o) => [...document.querySelectorAll(`${o} .sve-theme__swatch-name`)].map((e) => e.textContent.trim()), OPEN);
  const savedNames = await stepNames();
  const firstStep = savedNames[0];
  const mossFirst = await rootVar(preview, `--color-testmoss-${firstStep}`);

  step('the saved color has its steps', savedNames.length === 7, savedNames.join(' '));
  step('no rename offered while the names fit', await cp.evaluate((o) => !document.querySelector(`${o} .sve-theme__rename`), OPEN));
  await retype(page, cp, TEXT_INPUTS, '#0b0b41', 1);
  step('a new base keeps every step name', JSON.stringify(await stepNames()) === JSON.stringify(savedNames), (await stepNames()).join(' '));
  step('the same name paints the new shade', await waitFor(preview, (args) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(`--color-testmoss-${args[0]}`).trim();

    return v && v !== args[1];
  }, [firstStep, mossFirst]));
  step('rename by lightness is offered, not done', await waitFor(cp, (o) => !!document.querySelector(`${o} .sve-theme__rename button`), OPEN)
    && JSON.stringify(await stepNames()) === JSON.stringify(savedNames));
  await click(page, cp, `${PANEL} .sve-theme__save`);

  // The file itself says when the save is done (the button is disabled while saving too).
  for (let t0 = Date.now(); Date.now() - t0 < 10000 && !readFileSync(CSS_FILE, 'utf8').includes('--color-testmoss: #0b0b41;');) {
    await sleep(100);
  }

  await waitFor(cp, (p) => !!document.querySelector(`${p} .sve-theme__save`)?.disabled && !/sav|gemmer/i.test(document.querySelector(`${p} .sve-theme__status`)?.textContent || ''), PANEL, 5000);
  step('saved with the same names', savedNames.every((name) => readFileSync(CSS_FILE, 'utf8').includes(`--color-testmoss-${name}:`)) && readFileSync(CSS_FILE, 'utf8').includes('--color-testmoss: #0b0b41;'));

  await click(page, cp, `${PANEL} .sve-theme__ghost`);
  step('closes without asking once saved', await waitFor(cp, (p) => !document.querySelector(p), PANEL));
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
