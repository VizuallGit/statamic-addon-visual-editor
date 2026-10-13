#!/usr/bin/env node
/**
 * Presets switch the right sidebar too, in a real Live Preview, with real
 * mouse clicks — measured by what is on screen, not by what is in the DOM.
 * What each preset should open is read off the site's own presets: a preset
 * opens only its own icons' tools, so the run fits any site's settings.
 *
 * Right-click on ⋮ lists the presets. Two picked one right after the other,
 * while the block tree's code is still on its first (slowed) load, end as the
 * last one says. Content editor opens its panes and closes the HTML dock;
 * Shift-click on ⋮ lists them again, and Developer opens the dock with its
 * HTML tree and closes the panes. Then the menu: the presets row on top marks
 * Developer, and the Sidebars tab lists Developer's own sidebar tools (the
 * HTML tree fixed, as it comes with the dock). A click on Content editor in
 * the row switches, and the list becomes Content editor's. Back on Developer,
 * ticking its tools opens them beside the HTML tree — kept through a reload.
 * All changes nothing and lists every sidebar tool.
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
const SIDEBAR = ['listview', 'outline', 'comments', 'sections', 'ai', 'performance', 'theme'];
const PANE = {
  listview: '#__sve-listview-panel',
  outline: '#__sve-outline-panel',
  comments: '#__sve-comments-pane',
  sections: '#__sve-section-picker',
  ai: '#__sve-ai-panel',
  performance: '#__sve-perf-panel',
  theme: '#__sve-theme',
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

/**
 * The screen once it shows what is expected, or as it is after `ms`: a tool
 * opening for the first time loads its code, and the next waits its turn.
 */
async function settle(frame, panes, options = {}, ms = 10000) {
  const t0 = Date.now();
  let now = await screen(frame);

  while (!shows(now, panes, options) && Date.now() - t0 < ms) {
    now = await screen(frame);
  }

  return now;
}

const describe = (s) => Object.entries(s).filter(([, on]) => on).map(([key]) => key).join(' ') || 'nothing';

/** Exactly these panes (and the dock, the tree) on screen — no more, no fewer. */
const shows = (now, panes, { dock = false } = {}) => Object.entries(now).every(([key, on]) => {
  if (key === 'dock' || key === 'html_tree') {
    return on === dock;
  }

  return on === panes.includes(key);
});

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
  await sleep(200);
}

/** The Sidebars tab's rows: which tools it lists, and which are ticked. */
const sidebarRows = (cp) => cp.$$eval(`${MENU} [data-sve-sidebar-pane]`, (rows) => rows.map((row) => ({
  key: row.getAttribute('data-sve-sidebar-pane'),
  on: row.querySelector('input').checked,
  fixed: row.querySelector('input').disabled,
})));

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

  // What this user has, and what each preset should open: its own icons' sidebar tools.
  const icons = await cp.evaluate(() => [...document.querySelectorAll('#__sve-toolbar button[data-tab]')].map((btn) => btn.dataset.tab));
  const sidebarOf = (preset) => SIDEBAR.filter((key) => icons.includes(key) && preset.tools.includes(key));
  const editorPanes = editor.panes.filter((key) => sidebarOf(editor).includes(key));

  step('the site presets carry panes', developer.dock === true && editor.dock === false,
    `editor opens ${editorPanes.join('+') || 'nothing'} of ${sidebarOf(editor).join(' ')}; developer has ${sidebarOf(developer).join(' ')}`);

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
      shows(raced, [], { dock: true }), describe(raced));
  }

  // ── Content editor ────────────────────────────────────────────────────
  await switchTo(page, cp, 'editor');

  let now = await screen(cp);

  await shot(page, 'editor');
  step('Content editor: its panes open, no dock, no HTML tree', shows(now, editorPanes), describe(now));

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
  step('Shift-click works too; Developer: dock and HTML tree, the panes closed', shows(now, [], { dock: true }), describe(now));

  // ── The menu: presets on top, the Sidebars tab for the one that is on ──
  await openSidebarsTab(page, cp);

  const isOn = (id) => cp.$eval(`${MENU} [data-sve-toolbar-preset="${id}"]`, (el) => el.classList.contains('is-on')).catch(() => false);
  let rows = await sidebarRows(cp);

  await shot(page, 'menu-developer');
  step('the presets row on top marks Developer', (await isOn('developer')) && !(await isOn('editor')));
  step("the Sidebars tab lists Developer's own sidebar tools, the HTML tree fixed",
    rows.map((row) => row.key).join() === ['html_tree', ...sidebarOf(developer)].join() && rows[0].on && rows[0].fixed && rows.slice(1).every((row) => !row.on),
    rows.map((row) => `${row.key}${row.on ? '✓' : ''}${row.fixed ? '(fixed)' : ''}`).join(' '));

  await click(page, cp, `${MENU} [data-sve-toolbar-preset="editor"] button`);
  await sleep(300);
  rows = await sidebarRows(cp);
  step('a click on Content editor in the row switches: it is marked, the list is its own',
    (await isOn('editor')) && rows.map((row) => row.key).join() === sidebarOf(editor).join() && rows.every((row) => row.on === editorPanes.includes(row.key)),
    rows.map((row) => `${row.key}${row.on ? '✓' : ''}`).join(' '));
  now = await screen(cp);
  step('and the sidebar and dock follow', shows(now, editorPanes), describe(now));

  await click(page, cp, `${MENU} [data-sve-toolbar-preset="developer"] button`);
  await sleep(300);

  const ticks = sidebarOf(developer);

  for (const key of ticks) {
    await click(page, cp, `${MENU} [data-sve-sidebar-pane="${key}"] input`);
    await sleep(300);
  }

  await page.keyboard.press('Escape');
  now = await settle(cp, ticks, { dock: true });
  await shot(page, 'developer-ticked');
  step(`ticking Developer's ${ticks.join(' + ') || 'nothing'} opens them beside the HTML tree`, ticks.length > 0 && shows(now, ticks, { dock: true }), describe(now));
  step("as this user's own choice for Developer", JSON.parse((await storedKey(cp, 'sve-toolbar-preset-panes')) || '{}').developer?.join() === ticks.join(),
    await storedKey(cp, 'sve-toolbar-preset-panes'));

  // ── A full reload keeps it ────────────────────────────────────────────
  cp = await openLivePreview(page);
  await waitFor(cp, (sel) => !!document.querySelector(sel), PANE.html_tree, 15000);
  await sleep(1500);
  now = await screen(cp);
  await shot(page, 'developer-reload');
  step('after a reload: the dock, the HTML tree and the ticked tools', shows(now, ticks, { dock: true }), describe(now));

  // ── All leaves the sidebar alone, and lists every sidebar tool ─────────
  await openSidebarsTab(page, cp);
  await click(page, cp, `${MENU} [data-sve-toolbar-preset="all"] button`);
  await sleep(300);
  rows = await sidebarRows(cp);
  step('All lists every sidebar tool this user has', rows.map((row) => row.key).join() === SIDEBAR.filter((key) => icons.includes(key)).join(), rows.map((row) => row.key).join(' '));
  await page.keyboard.press('Escape');

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
