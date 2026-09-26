#!/usr/bin/env node
/**
 * Top bar icons shown or hidden from the ⋮ menu, in a real Live Preview, with
 * real mouse clicks.
 *
 * Opens ⋮ → Top bar, hides a panel tool and Pages (a framed one), waits out
 * several toolbar passes and a full reload to see they stay hidden, opens both
 * from the menu (the icon shows while open and goes again when closed), then
 * Show all and the reset bring every icon back. The test user's editor
 * preferences are put back exactly as they were.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/toolbar-visibility.mjs
 *
 * Same env as live-preview-smoke.mjs: SVE_SITE_DIR, SVE_SITE_URL, SVE_USER,
 * SVE_PASS, SVE_ENTRY, SVE_CHROME. SVE_SHOTS=<dir> saves screenshots.
 * SVE_WORKTREE=1 serves this checkout's build instead of the installed one;
 * the strings and the saved preference then still go through the installed
 * PHP, so labels are not checked and the reload reads the browser's copy.
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

const BAR = '#__sve-toolbar';
const MORE = '#__sve-lp-more';
const MENU = '#__sve-lp-more-menu';
const tabButton = (id) => `${MENU} [data-sve-lp-settings-tab="${id}"]`;
const toolRow = (key) => `${MENU} [data-sve-toolbar-tool="${key}"]`;
const icon = (key) => `${BAR} button[data-tab="${key}"]`;

// The editor keeps its layout on the user as `sve_chrome`; start clean and put
// the file back as it was, whatever happens.
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
const userYaml = readFileSync(USER_FILE, 'utf8');

writeFileSync(USER_FILE, userYaml.replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));

/** Page coordinates of the first visible match inside `frame`, through its parent frames. */
async function pointIn(frame, selector) {
  const r = await frame.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find((node) => {
      const b = node.getBoundingClientRect();

      return b.width > 0 && b.height > 0;
    });

    if (!el) {
      return null;
    }

    el.scrollIntoView({ block: 'center', behavior: 'instant' });

    const b = el.getBoundingClientRect();

    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }, selector);

  if (!r) {
    throw new Error(`nothing visible for ${selector}`);
  }

  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const box = await (await f.frameElement()).boundingBox();

    r.x += box.x;
    r.y += box.y;
  }

  return r;
}

async function click(page, frame, selector) {
  const { x, y } = await pointIn(frame, selector);
  const t0 = Date.now();

  while (Date.now() - t0 < 8000 && (await page.evaluate((px, py) => document.elementFromPoint(px, py)?.tagName === 'HTML', x, y))) {
    await sleep(100);
  }

  await page.mouse.click(x, y);
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

/** Is it on screen: laid out, with a size — not just in the DOM. */
const seen = (frame, selector) => frame.evaluate((sel) => {
  const el = document.querySelector(sel);

  if (!el) {
    return false;
  }

  const b = el.getBoundingClientRect();

  return getComputedStyle(el).display !== 'none' && b.width > 0 && b.height > 0;
}, selector);

const visibleIcons = (frame) => frame.evaluate((bar) => [...document.querySelectorAll(`${bar} button[data-tab]`)]
  .filter((el) => el.getBoundingClientRect().width > 0)
  .map((el) => el.dataset.tab), BAR);

const stored = (frame) => frame.evaluate((key) => {
  const id = window.Statamic?.$config?.get?.('sveUserId');

  return localStorage.getItem(id ? `sve-u:${id}:${key}` : key);
}, 'sve-toolbar-hidden');

const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/toolbar-visibility-${name}.png` });

async function openLivePreview(page) {
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate((re) => [...document.querySelectorAll('button, a')].find((el) => new RegExp(re, 'i').test(el.textContent || ''))?.click(), 'live preview|forhåndsvisning');
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector(`${BAR} button`, { timeout: 20000 });
  await sleep(1500);

  return cp;
}

async function openMenuTab(page, cp, tab) {
  if (!(await cp.$(MENU))) {
    await click(page, cp, MORE);
    await cp.waitForSelector(MENU, { timeout: 5000 });
  }

  if (await cp.$(tabButton(tab))) {
    await click(page, cp, tabButton(tab));
  }
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 500 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

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
  const before = await visibleIcons(cp);

  step('the top bar has its icons', before.length > 3, before.join(' '));

  // ── The menu ──────────────────────────────────────────────────────────
  await click(page, cp, MORE);
  step('⋮ opens the menu', !!(await cp.waitForSelector(MENU, { timeout: 5000 }).catch(() => null)));

  const tabs = await cp.evaluate((m) => [...document.querySelectorAll(`${m} [data-sve-lp-settings-tab]`)].map((el) => el.dataset.sveLpSettingsTab), MENU);

  step('three tabs: sidebars, HTML tree, top bar', tabs.join() === 'sidebars,tree,toolbar', tabs.join());
  step('Sidebars first: the mode as one small row, two width sliders',
    (await cp.evaluate((m) => document.querySelectorAll(`${m} .sve-lp-settings__modes button`).length === 3
      && document.querySelectorAll(`${m} input[type="range"]`).length === 2, MENU)));

  const modesHeight = await cp.evaluate((m) => document.querySelector(`${m} .sve-lp-settings__modes`)?.getBoundingClientRect().height || 0, MENU);

  step('Hidden/Auto/Visible is compact', modesHeight > 0 && modesHeight <= 28, `${Math.round(modesHeight)} px high`);
  await shot(page, '1-sidebars');

  await openMenuTab(page, cp, 'tree');
  step('HTML tree tab: dock, tree face and the colours', await cp.evaluate((m) => document.querySelectorAll(`${m} input[type="color"]`).length >= 5, MENU));
  await shot(page, '2-tree');

  await openMenuTab(page, cp, 'toolbar');

  const listed = await cp.evaluate((m) => [...document.querySelectorAll(`${m} [data-sve-toolbar-tool]`)].map((el) => el.dataset.sveToolbarTool), MENU);
  const expected = before.filter((key) => key !== 'settings');

  step('Top bar lists the icons in the row, without Page settings', listed.join() === expected.join() && !listed.includes('settings'), listed.join(' '));
  await shot(page, '3-toolbar');

  // A panel tool and a framed one: the two ways an icon opens something.
  const panelTool = ['performance', 'outline', 'listview'].find((key) => listed.includes(key));
  const framed = listed.includes('pages') ? 'pages' : null;

  step('a panel tool to hide', !!panelTool, panelTool || 'none of performance/outline/listview');

  await click(page, cp, `${toolRow(panelTool)} input[type="checkbox"]`);

  if (framed) {
    await click(page, cp, `${toolRow(framed)} input[type="checkbox"]`);
  }

  await sleep(300);
  step(`${panelTool} icon gone at once`, !(await seen(cp, icon(panelTool))));

  if (framed) {
    step('Pages goes with its frame', !(await seen(cp, `#__sve-frame-${framed}`)));
  }

  step('the rest are still there', (await visibleIcons(cp)).length === before.length - (framed ? 2 : 1));
  step('the row shows Open for a hidden tool', !!(await cp.$(`${toolRow(panelTool)} [data-sve-toolbar-open]`)));
  step('the choice is stored', JSON.parse((await stored(cp)) || '[]').includes(panelTool), await stored(cp));

  // The toolbar's passes re-create and re-show buttons: close the menu,
  // switch the panel mode (a full pass), and wait.
  await page.keyboard.press('Escape');
  await sleep(4000);
  step(`${panelTool} stays hidden through the toolbar passes`, !(await seen(cp, icon(panelTool))));
  await shot(page, '4-hidden');

  // ── A reload ──────────────────────────────────────────────────────────
  cp = await openLivePreview(page);
  step(`${panelTool} still hidden after a reload`, !(await seen(cp, icon(panelTool))));

  if (framed) {
    step('Pages still hidden after a reload', !(await seen(cp, `#__sve-frame-${framed}`)));
  }

  // ── Open a hidden tool from the menu ──────────────────────────────────
  await openMenuTab(page, cp, 'toolbar');
  await click(page, cp, `${toolRow(panelTool)} [data-sve-toolbar-open]`);
  step('Open closes the menu', await waitFor(cp, (m) => !document.querySelector(m), MENU, 3000));
  step(`${panelTool} opens`, await waitFor(cp, (sel) => document.querySelector(sel)?.getAttribute('aria-pressed') === 'true', icon(panelTool), 10000));
  step('its icon shows while it is open', await seen(cp, icon(panelTool)));
  await shot(page, '5-open');

  await click(page, cp, icon(panelTool));
  step(`${panelTool} closes from its icon`, await waitFor(cp, (sel) => document.querySelector(sel)?.getAttribute('aria-pressed') !== 'true', icon(panelTool), 5000));
  await sleep(500);
  step('and the icon goes again', !(await seen(cp, icon(panelTool))));

  if (framed) {
    await openMenuTab(page, cp, 'toolbar');
    await click(page, cp, `${toolRow(framed)} [data-sve-toolbar-open]`);
    step('Pages opens in its frame', await waitFor(cp, (sel) => {
      const el = document.querySelector(sel);

      return !!el && el.getBoundingClientRect().width > 40;
    }, `#__sve-frame-${framed}`, 5000));
    await click(page, cp, icon(framed));
    await sleep(600);
    step('and goes again when closed', !(await seen(cp, `#__sve-frame-${framed}`)));
  }

  // ── Show all, and the reset ───────────────────────────────────────────
  await openMenuTab(page, cp, 'toolbar');
  await click(page, cp, `${MENU} [data-sve-toolbar-all]`);
  await sleep(300);
  step('Show all brings every icon back', (await visibleIcons(cp)).join() === before.join(), (await visibleIcons(cp)).join(' '));
  step('and clears the stored list', (await stored(cp)) === null);

  await click(page, cp, `${toolRow(panelTool)} input[type="checkbox"]`);
  await sleep(300);
  step('hidden again for the reset', !(await seen(cp, icon(panelTool))));
  await click(page, cp, `${MENU} .sve-lp-settings__reset`);
  await sleep(800);
  step('Reset Live Preview settings brings it back', await seen(cp, icon(panelTool)));

  step('no JS errors', errors.length === 0, errors.slice(0, 5).join(' | '));
} catch (e) {
  step('run', false, e.message);
} finally {
  await browser.close();
  writeFileSync(USER_FILE, userYaml);
}

console.log(failed ? `\n${failed} step(s) failed` : '\nall steps passed');
process.exit(failed ? 1 : 0);
