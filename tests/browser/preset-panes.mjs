#!/usr/bin/env node
/**
 * Presets switch the right sidebar too, in a real Live Preview, with real
 * mouse clicks — measured by what is on screen, not by what is in the DOM.
 *
 * Right-click on ⋮ lists the presets. Two picked one right after the other,
 * while the block tree's code is still on its first (slowed) load, end as the
 * last one says. Content editor opens the block tree and
 * Patterns and closes the HTML dock; Shift-click on ⋮ lists them again, and
 * Developer opens the dock with its HTML tree and closes the two panes. Then
 * the Sidebars tab: Developer is picked there because it is on, and ticking
 * the block tree for it opens the tree beside the HTML tree — both stay through
 * a full reload. Back to Content editor, and a pane unticked for Developer
 * (not on) changes nothing on screen until Developer is picked again.
 *
 * Needs the site's PHP to provide the presets' panes (ToolbarPresets::PANES) —
 * a site older than the build has none, and the run stops saying so.
 *
 * The run never saves the editor layout to the server: every write to
 * /!/sve/chrome-prefs is answered here and goes nowhere. A local test user's
 * file is put back as it was.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/preset-panes.mjs
 *
 * Same env as toolbar-visibility.mjs: SVE_SITE_DIR, SVE_SITE_URL, SVE_USER,
 * SVE_PASS, SVE_ENTRY, SVE_CHROME, SVE_SHOTS, SVE_WORKTREE, SVE_ADDON_DIR,
 * SVE_INSTALLED_MANIFEST.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
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
  failed += ok ? 0 : 1;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const MORE = '#__sve-lp-more';
const MENU = '#__sve-lp-more-menu';
const SWITCH = '#__sve-lp-preset-menu';
const PANE = {
  listview: '#__sve-listview-panel',
  sections: '#__sve-section-picker',
  html_tree: '#__sve-html-tree-panel',
};
const DOCK = '#__sve-code-dock';
let slowTree = false;

const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
const userYaml = existsSync(USER_FILE) ? readFileSync(USER_FILE, 'utf8') : null;

if (userYaml !== null) {
  writeFileSync(USER_FILE, userYaml.replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));
}

const blockPrefsWrite = (req) => {
  if (req.method() === 'GET' || !req.url().includes('/!/sve/chrome-prefs')) {
    return false;
  }

  req.respond({ status: 200, contentType: 'application/json', body: '{"ok":true}' });

  return true;
};

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

async function click(page, frame, selector, options = {}) {
  const { x, y } = await pointIn(frame, selector);

  await page.mouse.click(x, y, options);
}

async function shiftClick(page, frame, selector) {
  const { x, y } = await pointIn(frame, selector);

  await page.keyboard.down('Shift');
  await page.mouse.click(x, y);
  await page.keyboard.up('Shift');
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

/** On screen: laid out, with a size, not hidden — not just in the DOM. */
function onScreen(selector) {
  const el = document.querySelector(selector);

  if (!el) {
    return false;
  }

  const b = el.getBoundingClientRect();
  const style = getComputedStyle(el);

  return style.display !== 'none' && style.visibility !== 'hidden' && b.width > 0 && b.height > 0 && b.right > 0 && b.left < innerWidth;
}

const seen = (frame, selector) => frame.evaluate(onScreen, selector);

/** Which of the panes and the dock are on screen now, after the layout has settled. */
async function screen(frame) {
  await sleep(1200);

  const out = {};

  for (const [key, sel] of Object.entries({ ...PANE, dock: DOCK })) {
    out[key] = await seen(frame, sel);
  }

  return out;
}

const describe = (s) => Object.entries(s).map(([key, on]) => `${key}:${on ? 'on' : 'off'}`).join(' ');

const storedKey = (frame, key) => frame.evaluate((k) => {
  const id = window.Statamic?.$config?.get?.('sveUserId');

  return localStorage.getItem(id ? `sve-u:${id}:${k}` : k);
}, key);

const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/preset-panes-${name}.png` });

async function openLivePreview(page) {
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate((re) => [...document.querySelectorAll('button, a')].find((el) => new RegExp(re, 'i').test(el.textContent || ''))?.click(), 'live preview|forhåndsvisning');
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });
  await sleep(2000);

  return cp;
}

/** Right-click (or Shift-click) ⋮ and pick a preset from the short list. */
async function switchTo(page, cp, id, { shift = false } = {}) {
  if (shift) {
    await shiftClick(page, cp, MORE);
  } else {
    await click(page, cp, MORE, { button: 'right' });
  }

  await cp.waitForSelector(`${SWITCH} [data-sve-preset-switch="${id}"]`, { timeout: 5000 });
  await click(page, cp, `${SWITCH} [data-sve-preset-switch="${id}"]`);
}

async function openSidebarsTab(page, cp) {
  if (!(await cp.$(MENU))) {
    await click(page, cp, MORE);
    await cp.waitForSelector(MENU, { timeout: 5000 });
  }

  await click(page, cp, `${MENU} [data-sve-lp-settings-tab="sidebars"]`);
  await cp.waitForSelector(`${MENU} [data-sve-sidebar-preset]`, { timeout: 3000 });
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

await page.evaluateOnNewDocument((path) => {
  const real = window.fetch;

  window.fetch = function fetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const method = String(init?.method || input?.method || 'GET').toUpperCase();

    if (url.includes(path) && method !== 'GET') {
      return Promise.resolve(new Response('{"ok":true}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }

    return real.apply(this, arguments);
  };
}, '/!/sve/chrome-prefs');

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 500 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: env('SVE_INSTALLED_MANIFEST', `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`),
    scriptsDir: `${ADDON_DIR}/resources/js`,
    extra: blockPrefsWrite,
  });
  console.log('info build served from the working tree');
} else {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (blockPrefsWrite(req)) {
      return;
    }

    // A first load as slow as a server's: the switch after it must not race it.
    if (slowTree && /\/block-tree-[\w-]+\.js/.test(req.url())) {
      setTimeout(() => req.continue(), 1500);

      return;
    }

    req.continue();
  });
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

  const sitePresets = await cp.evaluate(() => JSON.parse(JSON.stringify(window.Statamic?.$config?.get?.('sveToolbarPresets') || [])));
  const editor = sitePresets.find((preset) => preset.id === 'editor');
  const developer = sitePresets.find((preset) => preset.id === 'developer');

  if (!Array.isArray(editor?.panes) || !Array.isArray(developer?.panes)) {
    throw new Error("the site's PHP gives the presets no panes — it is older than this build");
  }

  step('the site presets carry panes', editor.panes.join() === 'listview,sections' && developer.panes.length === 0 && developer.dock === true && editor.dock === false,
    `editor ${editor.panes.join('+')}, developer ${developer.panes.join('+') || 'none'}`);

  // ── Right-click: the short list ───────────────────────────────────────
  await click(page, cp, MORE, { button: 'right' });
  step('right-click on ⋮ lists the presets, not the full menu',
    (await cp.waitForSelector(SWITCH, { timeout: 5000 }).catch(() => null)) !== null && !(await cp.$(MENU)),
    (await cp.$$eval(`${SWITCH} [data-sve-preset-switch]`, (els) => els.map((el) => el.dataset.svePresetSwitch).join(' ')).catch(() => '')));
  await page.keyboard.press('Escape');
  await sleep(300);
  step('Escape closes it', !(await cp.$(SWITCH)));

  // ── Two picks in a row, the first still loading ───────────────────────
  if (WORKTREE) {
    console.log('info the race step needs the installed build (its chunk is delayed on the way in) — skipped');
  } else {
    slowTree = true;
    await switchTo(page, cp, 'editor');
    await switchTo(page, cp, 'developer', { shift: true });
    await sleep(2500);
    await waitFor(cp, (sel) => !!document.querySelector(sel), PANE.html_tree, 15000);

    const raced = await screen(cp);

    slowTree = false;
    step('Content editor then Developer at once, the block tree slow to load: Developer is what shows',
      raced.dock && raced.html_tree && !raced.listview && !raced.sections, describe(raced));
  }

  // ── Content editor ────────────────────────────────────────────────────
  await switchTo(page, cp, 'editor');

  let now = await screen(cp);

  await shot(page, 'editor');
  step('Content editor: block tree and Patterns open, no dock, no HTML tree',
    now.listview && now.sections && !now.dock && !now.html_tree, describe(now));
  step('and both are pinned', await cp.evaluate((key) => {
    const id = window.Statamic?.$config?.get?.('sveUserId');
    const pins = JSON.parse(localStorage.getItem(id ? `sve-u:${id}:${key}` : key) || '{}');

    return pins.listview === true && pins.sections === true;
  }, 'sve-right-dock-pinned'));

  await click(page, cp, MORE, { button: 'right' });
  await cp.waitForSelector(SWITCH, { timeout: 5000 });
  step('the list ticks the preset that is on', await cp.$eval(`${SWITCH} [data-sve-preset-switch="editor"]`, (el) => el.getAttribute('aria-checked') === 'true'));
  await page.keyboard.press('Escape');
  await sleep(300);

  // ── Developer, from Shift-click ───────────────────────────────────────
  await switchTo(page, cp, 'developer', { shift: true });
  await waitFor(cp, (sel) => !!document.querySelector(sel), PANE.html_tree, 15000);
  now = await screen(cp);
  await shot(page, 'developer');
  step('Shift-click works too; Developer: dock and HTML tree open, the two panes closed',
    now.dock && now.html_tree && !now.listview && !now.sections, describe(now));

  // ── Sidebars tab: a pane for the preset that is on ─────────────────────
  await openSidebarsTab(page, cp);
  step('the Sidebars tab has Developer picked, as it is on',
    await cp.$eval(`${MENU} [data-sve-sidebar-preset="developer"]`, (el) => el.classList.contains('is-on')));
  step('with nothing ticked for it', await cp.$$eval(`${MENU} [data-sve-sidebar-pane] input`, (els) => els.every((el) => !el.checked)));
  await click(page, cp, `${MENU} [data-sve-sidebar-pane="listview"] input`);
  await page.keyboard.press('Escape');
  now = await screen(cp);
  step('ticking the block tree opens it at once, beside the HTML tree',
    now.listview && now.html_tree && now.dock, describe(now));
  step('as this user\'s own choice for Developer', JSON.parse((await storedKey(cp, 'sve-toolbar-preset-panes')) || '{}').developer?.join() === 'listview',
    await storedKey(cp, 'sve-toolbar-preset-panes'));

  // ── A full reload keeps it ────────────────────────────────────────────
  cp = await openLivePreview(page);
  await waitFor(cp, (sel) => !!document.querySelector(sel), PANE.html_tree, 15000);
  now = await screen(cp);
  await shot(page, 'developer-reload');
  step('after a reload: dock, HTML tree and block tree, Patterns closed',
    now.dock && now.html_tree && now.listview && !now.sections, describe(now));

  // ── A choice for a preset that is not on changes nothing on screen ─────
  await switchTo(page, cp, 'editor');
  now = await screen(cp);
  step('back to Content editor: its two panes, the HTML tree and dock gone',
    now.listview && now.sections && !now.dock && !now.html_tree, describe(now));

  await openSidebarsTab(page, cp);
  await click(page, cp, `${MENU} [data-sve-sidebar-preset="developer"] button`);
  await sleep(200);
  step('Developer shows its own ticks', await cp.$eval(`${MENU} [data-sve-sidebar-pane="listview"] input`, (el) => el.checked));
  await click(page, cp, `${MENU} [data-sve-sidebar-pane="listview"] input`);
  await page.keyboard.press('Escape');
  now = await screen(cp);
  step('unticking it for Developer leaves the sidebar as it is', now.listview && now.sections, describe(now));

  await switchTo(page, cp, 'developer');
  await waitFor(cp, (sel) => !!document.querySelector(sel), PANE.html_tree, 15000);
  now = await screen(cp);
  step('and Developer, picked again, opens without the block tree', now.dock && now.html_tree && !now.listview && !now.sections, describe(now));

  // ── All leaves the sidebar alone ──────────────────────────────────────
  await switchTo(page, cp, 'all');
  const after = await screen(cp);
  step('All changes neither the dock nor the sidebar', JSON.stringify(after) === JSON.stringify(now), describe(after));

  const ours = errors.filter((line) => !/favicon|ResizeObserver/i.test(line));

  step('no errors on the page', ours.length === 0, ours.slice(0, 5).join(' | '));
} catch (e) {
  step('run', false, e.message);
} finally {
  if (userYaml !== null) {
    writeFileSync(USER_FILE, userYaml);
  }

  await browser.close();
}

console.log(failed ? `\n${failed} step(s) failed` : '\nall steps passed');
process.exit(failed ? 1 : 0);
