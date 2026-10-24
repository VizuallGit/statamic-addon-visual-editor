#!/usr/bin/env node
/**
 * Top bar icons shown or hidden from the ⋮ menu, in a real Live Preview, with
 * real mouse clicks.
 *
 * Opens ⋮ → Top bar, hides a panel tool and Pages (a framed one), waits out
 * several toolbar passes and a full reload to see they stay hidden, opens both
 * from the menu (the icon shows while open and goes again when closed), and
 * Show all brings every icon back. Then the groups: a row dragged by its handle
 * moves the icon in the bar and survives a reload; New group in the menu takes
 * a dropped row into a group of its own; the «+» at a group's edge adds a
 * hidden tool to it; an icon dragged in the bar itself joins another group,
 * or makes a new one when dropped in the gap; a group's own surface shows the
 * grab hand (its icons do not), and the group dragged by it moves past another;
 * the square right of the last group is always there, quiet until hovered, its «+» starts a new
 * group with any tool, and an icon dropped on it does the same; Reset groups
 * undoes it all.
 * Then the presets: the site's Developer and Content editor (skipped when the
 * site's PHP does not provide them yet), and one of the user's own — saved,
 * picked again, kept by the reset, deleted.
 *
 * The run never saves the editor layout to the server: every write to
 * /!/sve/chrome-prefs is answered here and goes nowhere, so the reset step
 * cannot wipe the layout of a real person — the account may be one somebody
 * works in (the demo's admin). The choice lives in the browser's own storage,
 * which is what the reload reads. A local test user's file is also put back.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/toolbar-visibility.mjs
 *
 * Same env as live-preview-smoke.mjs: SVE_SITE_DIR, SVE_SITE_URL, SVE_USER,
 * SVE_PASS, SVE_ENTRY, SVE_CHROME. SVE_SHOTS=<dir> saves screenshots.
 * SVE_WORKTREE=1 serves this checkout's build instead of the installed one;
 * the strings then still come from the installed PHP, so labels are not
 * checked. Against another site, SVE_INSTALLED_MANIFEST=<file> is that site's
 * /vendor/visual-editor/build/manifest.json, saved locally.
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
  if (!ok) failed++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const BAR = '#__sve-toolbar';
const PRESET_NAME = `sve-test ${Date.now().toString(36)}`;
const MORE = '#__sve-lp-more';
const MENU = '#__sve-lp-more-menu';
const tabButton = (id) => `${MENU} [data-sve-lp-settings-tab="${id}"]`;
const toolRow = (key) => `${MENU} [data-sve-toolbar-tool="${key}"]`;
const icon = (key) => `${BAR} button[data-tab="${key}"]`;

// A local test user keeps its layout as `sve_chrome` in its file; start clean
// and put the file back as it was, whatever happens. Another site's user has
// no file here, and its layout is only read (see blockPrefsWrite).
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
const userYaml = existsSync(USER_FILE) ? readFileSync(USER_FILE, 'utf8') : null;

if (userYaml !== null) {
  writeFileSync(USER_FILE, userYaml.replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));
}

/** Answer every layout save ourselves: nothing this run does reaches the account. */
let prefsWritesBlocked = 0;
const blockPrefsWrite = (req) => {
  if (req.method() === 'GET' || !req.url().includes('/!/sve/chrome-prefs')) {
    return false;
  }

  prefsWritesBlocked++;
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

const storedKey = (frame, key) => frame.evaluate((k) => {
  const id = window.Statamic?.$config?.get?.('sveUserId');

  return localStorage.getItem(id ? `sve-u:${id}:${k}` : k);
}, key);
const stored = (frame) => storedKey(frame, 'sve-toolbar-hidden');

/** The icons on screen, left to right as they are drawn (CSS order included). */
const barOrder = (frame) => frame.evaluate((bar) => [...document.querySelectorAll(`${bar} button[data-tab]`)]
  .filter((el) => el.getBoundingClientRect().width > 0)
  .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
  .map((el) => el.dataset.tab), BAR);

const listOrder = (frame) => frame.evaluate((m) => [...document.querySelectorAll(`${m} [data-sve-toolbar-tool]`)].map((el) => el.dataset.sveToolbarTool), MENU);

/** The group boxes on screen, left to right, each as the keys of its visible tools. */
const groupBoxes = (frame) => frame.evaluate((bar) => [...document.querySelectorAll(`${bar} > [data-sve-toolbar-group]`)]
  .filter((box) => box.getBoundingClientRect().width > 0)
  .map((box) => [...box.querySelectorAll(':scope > button[data-tab], :scope > [id^="__sve-frame-"]')]
    .filter((el) => el.getBoundingClientRect().width > 0)
    .map((el) => el.dataset.tab || el.id.replace('__sve-frame-', ''))), BAR);

const groupBoxIds = (frame) => frame.evaluate((bar) => [...document.querySelectorAll(`${bar} > [data-sve-toolbar-group]`)]
  .filter((box) => box.getBoundingClientRect().width > 0)
  .map((box) => box.getAttribute('data-sve-toolbar-group')), BAR);

const storedGroups = async (frame) => JSON.parse((await storedKey(frame, 'sve-toolbar-groups')) || '[]');

const sameSet = (a, b) => a.length === b.length && a.every((key) => b.includes(key));

/** Page coordinates of the first visible match's box inside `frame`, through its parent frames. */
async function rectIn(frame, selector) {
  const r = await frame.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find((node) => node.getBoundingClientRect().width > 0);

    if (!el) {
      return null;
    }

    const b = el.getBoundingClientRect();

    return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, y: b.top + b.height / 2 };
  }, selector);

  if (!r) {
    throw new Error(`nothing visible for ${selector}`);
  }

  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const box = await (await f.frameElement()).boundingBox();

    r.left += box.x;
    r.right += box.x;
    r.top += box.y;
    r.bottom += box.y;
    r.y += box.y;
  }

  return r;
}

/** Drag a row by its handle, with the real mouse, onto the upper half of another row. */
async function dragRow(page, frame, key, onto) {
  const from = await pointIn(frame, `${toolRow(key)} [data-sve-toolbar-drag]`);
  const to = await pointIn(frame, toolRow(onto));

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x, to.y - 6, { steps: 16 });
  await page.mouse.up();
  await sleep(300);
}

/** Drag a row by its handle onto the middle of whatever `selector` is (the draft group). */
async function dragRowOnto(page, frame, key, selector) {
  const from = await pointIn(frame, `${toolRow(key)} [data-sve-toolbar-drag]`);
  const to = await pointIn(frame, selector);

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x, to.y, { steps: 16 });
  await page.mouse.up();
  await sleep(300);
}

/** Drag an icon in the bar itself, with the real mouse, to page coordinate `x` on the bar's line. */
async function dragIcon(page, frame, key, x) {
  const from = await pointIn(frame, icon(key));

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  // Past the 6 px threshold first, then to the slot.
  await page.mouse.move(from.x + 12, from.y, { steps: 4 });
  await page.mouse.move(x, from.y, { steps: 16 });
  await sleep(100);
  await page.mouse.up();
  await sleep(300);
}

const groupBox = (id) => `${BAR} > [data-sve-toolbar-group="${id}"]`;
const NEW_GROUP = `${BAR} > [data-sve-toolbar-new-group]`;

/**
 * Drag a group by its own surface — 2 px into its padding, left of the first
 * icon — with the real mouse, to page coordinate `x` on the bar's line.
 */
async function dragGroup(page, frame, id, x) {
  const box = await rectIn(frame, groupBox(id));
  const from = { x: box.left + 2, y: box.y };

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + (x < from.x ? -12 : 12), from.y, { steps: 4 });
  await page.mouse.move(x, from.y, { steps: 16 });
  await sleep(100);
  await page.mouse.up();
  await sleep(300);
}

/** The tools whose button is pressed (open), to see a drag opened nothing. */
const pressedTools = (frame) => frame.evaluate((bar) => [...document.querySelectorAll(`${bar} button[data-tab][aria-pressed="true"]`)].map((el) => el.dataset.tab).join(), BAR);

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

/**
 * Start from the bar nobody has changed, through the menu itself: Show all and
 * Reset groups, where the account's own stored choice put anything else.
 * Nothing is saved (see above) — this is the test browser's copy only.
 */
async function cleanSlate(page, cp, { groups = true } = {}) {
  await openMenuTab(page, cp, 'toolbar');

  for (const button of groups ? ['[data-sve-toolbar-all]', '[data-sve-toolbar-groups-reset]'] : ['[data-sve-toolbar-all]']) {
    if (await cp.$(`${MENU} ${button}`)) {
      await click(page, cp, `${MENU} ${button}`);
      await sleep(200);
    }
  }

  // The menu opens on the tab it was left on: leave it on the first.
  await click(page, cp, tabButton('sidebars'));
  await page.keyboard.press('Escape');
  await sleep(300);
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

// The layout save is stubbed inside every document, before its own scripts
// run: nothing is sent at all. The interception below is the second fence.
// (27 Sep 2026: one save after the reset step got past interception alone
// and replaced the demo admin's saved layout — hence both, and the check at
// the end that the account's saved layout on the server is unchanged.)
await page.evaluateOnNewDocument((path) => {
  const real = window.fetch;

  window.fetch = function fetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const method = String(init?.method || input?.method || 'GET').toUpperCase();

    if (url.includes(path) && method !== 'GET') {
      window.__sveTestPrefsStubbed = (window.__sveTestPrefsStubbed || 0) + 1;

      return Promise.resolve(new Response('{"ok":true}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }

    return real.apply(this, arguments);
  };
}, '/!/sve/chrome-prefs');

/** The account's layout as the server has it, read off a fresh CP page. */
async function serverLayout() {
  await page.goto(`${SITE_URL}/cp/dashboard`, { waitUntil: 'networkidle2' });

  return page.evaluate(() => JSON.stringify(window.Statamic?.$config?.get?.('sveChromePrefs') || {}));
}

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 500 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

// A missing file is named by its URL, not by the console's bare "Failed to
// load resource": one from the editor's build fails the run, the site's own
// (an image, a font) is listed and left to the site.
const missing = [];

const askedBy = (req) => {
  const from = req.initiator?.();

  return from ? ` (${from.type}${from.url ? ' ' + from.url.replace(SITE_URL, '').slice(0, 80) : ''})` : '';
};

page.on('response', (r) => r.status() >= 400 && r.status() < 500 && missing.push(`${r.status()} ${r.url().replace(SITE_URL, '').slice(0, 160)}${askedBy(r.request())}`));
page.on('requestfailed', (req) => missing.push(`${req.failure()?.errorText || 'failed'} ${req.url().replace(SITE_URL, '').slice(0, 160)}${askedBy(req)}`));

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
  page.on('request', (req) => blockPrefsWrite(req) || req.continue());
}

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()));
  errors.length = 0;

  const layoutBefore = await serverLayout();
  // What the account keeps on the server wins when a page loads — that is how
  // another browser comes back as the user left it. This run saves nothing, so
  // where the account has its own hidden icons or order stored, a reload brings
  // those back and the reload steps for them cannot show this run's choice.
  const accountHas = (key) => Object.prototype.hasOwnProperty.call(JSON.parse(layoutBefore), key);
  const reloadStep = (key, name, ok, detail) => (accountHas(key)
    ? console.log(`info ${name} — skipped: the account has its own ${key} on the server`)
    : step(name, ok, detail));

  let cp = await openLivePreview(page);

  await cleanSlate(page, cp);

  const before = await visibleIcons(cp);

  step('the top bar has its icons', before.length > 3, before.join(' '));

  // Page settings as a button of its own, like the breakpoint overview: the
  // full 32 px square from the row's left edge, its own surface, then a topbar
  // gap and the first group on a surface of its own (the row's is taken off).
  const box = await cp.evaluate((bar) => {
    const row = document.querySelector(bar);
    const btn = row.querySelector(':scope > button[data-tab="settings"]');
    const r = btn.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    const group = [...row.querySelectorAll(':scope > [data-sve-toolbar-group]')].find((el) => el.getBoundingClientRect().width > 0);
    const g = group?.getBoundingClientRect();

    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      left: Math.round(r.left - rowBox.left),
      bg: getComputedStyle(btn).backgroundColor,
      gap: g ? Math.round(g.left - r.right) : 0,
      groupBox: !!group && getComputedStyle(group).backgroundColor !== 'rgba(0, 0, 0, 0)' && Math.round(g.height) === 32,
      rowBg: getComputedStyle(row).backgroundColor,
    };
  }, BAR);

  step('Page settings is a full button of its own, one gap before the first group', box.w === 32 && box.h === 32 && box.left === 0 && box.bg !== 'rgba(0, 0, 0, 0)' && box.groupBox && box.gap === 8 && box.rowBg === 'rgba(0, 0, 0, 0)', JSON.stringify(box));
  step('with nothing stored the bar is one group', (await groupBoxes(cp)).length === 1, JSON.stringify(await groupBoxes(cp)));

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
  reloadStep('sve-toolbar-hidden', `${panelTool} still hidden after a reload`, !(await seen(cp, icon(panelTool))));

  if (framed) {
    reloadStep('sve-toolbar-hidden', 'Pages still hidden after a reload', !(await seen(cp, `#__sve-frame-${framed}`)));
  }

  // The account's own hidden icons came back with the reload: this run's two
  // are hidden again, the rest shown, before the steps that open them.
  if (accountHas('sve-toolbar-hidden')) {
    await openMenuTab(page, cp, 'toolbar');

    if (await cp.$(`${MENU} [data-sve-toolbar-all]`)) {
      await click(page, cp, `${MENU} [data-sve-toolbar-all]`);
      await sleep(200);
    }

    for (const key of framed ? [panelTool, framed] : [panelTool]) {
      await click(page, cp, `${toolRow(key)} input[type="checkbox"]`);
      await sleep(150);
    }

    await page.keyboard.press('Escape');
    await sleep(300);
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

  // ── Groups: drag a row with the real mouse ────────────────────────────
  const rows = await listOrder(cp);
  const mover = rows[rows.length - 1];

  await dragRow(page, cp, mover, rows[0]);
  step('dragging a row moves it to the top of the list', (await listOrder(cp))[0] === mover, (await listOrder(cp)).join(' '));
  step('and in the top bar, right after Page settings', (await barOrder(cp))[1] === mover, (await barOrder(cp)).join(' '));
  step('Page settings stays first', (await barOrder(cp))[0] === 'settings');
  step('the groups are stored, the tool first in the first group', (await storedGroups(cp))[0]?.tools[0] === mover, JSON.stringify(await storedGroups(cp)));

  await page.keyboard.press('Escape');
  cp = await openLivePreview(page);

  // The account's own hidden icons came back with the reload; the group steps
  // look at every icon.
  if (accountHas('sve-toolbar-hidden')) {
    await cleanSlate(page, cp, { groups: false });
  }

  reloadStep('sve-toolbar-groups', 'the groups survive a reload', (await barOrder(cp))[1] === mover, (await barOrder(cp)).join(' '));

  await openMenuTab(page, cp, 'toolbar');
  reloadStep('sve-toolbar-groups', 'the list opens in that order', (await listOrder(cp))[0] === mover);

  // ── A second group, from the menu ─────────────────────────────────────
  await click(page, cp, `${MENU} [data-sve-toolbar-group-new]`);
  await sleep(200);
  step('New group adds a draft to drop into', !!(await cp.$(`${MENU} [data-sve-toolbar-group-draft]`)));
  await dragRowOnto(page, cp, mover, `${MENU} [data-sve-toolbar-group-draft]`);

  const split = await groupBoxes(cp);

  step('the dropped tool is in a group of its own, last in the bar', split.length === 2 && split[1].join() === mover, JSON.stringify(split));
  step('the menu shows two groups, no draft', (await cp.evaluate((m) => document.querySelectorAll(`${m} [data-sve-toolbar-group-row]`).length === 2 && !document.querySelector(`${m} [data-sve-toolbar-group-draft]`), MENU)));
  step('both are stored', (await storedGroups(cp)).length === 2 && (await storedGroups(cp))[1].tools.join() === mover);

  // A tool hidden now is what the «+» has to offer.
  const addable = (await listOrder(cp)).find((key) => key !== mover);

  await click(page, cp, `${toolRow(addable)} input[type="checkbox"]`);
  await sleep(200);
  step('a tool hidden for the «+» to add', !(await visibleIcons(cp)).includes(addable));
  await page.keyboard.press('Escape');
  await sleep(300);

  // ── «+» at a group's edge ─────────────────────────────────────────────
  const [firstId, secondId] = await groupBoxIds(cp);
  const secondBox = await pointIn(cp, `${BAR} [data-sve-toolbar-group="${secondId}"]`);

  // The «+» shows on hover: the mouse goes onto the group first.
  await page.mouse.move(secondBox.x, secondBox.y);
  await sleep(200);
  await click(page, cp, `${BAR} [data-sve-toolbar-add="${secondId}"]`);
  step('«+» opens the add menu', !!(await cp.waitForSelector('#__sve-toolbar-add-menu', { timeout: 5000 }).catch(() => null)));
  step('a tool already in the bar is greyed out', await cp.evaluate((k) => document.querySelector(`#__sve-toolbar-add-menu [data-sve-toolbar-add-tool="${k}"]`)?.disabled === true, mover));
  step('a hidden one is not', await cp.evaluate((k) => document.querySelector(`#__sve-toolbar-add-menu [data-sve-toolbar-add-tool="${k}"]`)?.disabled === false, addable));
  await click(page, cp, `#__sve-toolbar-add-menu [data-sve-toolbar-add-tool="${addable}"]`);
  await sleep(300);

  const added = await groupBoxes(cp);

  step('the hidden tool joins that group at its end, shown', added[1]?.join() === [mover, addable].join(), JSON.stringify(added));
  step('and is no longer hidden', !JSON.parse((await stored(cp)) || '[]').includes(addable));
  step('the add menu closed', !(await cp.$('#__sve-toolbar-add-menu')));

  // ── Drag an icon in the bar itself ────────────────────────────────────
  const firstRect = await rectIn(cp, `${BAR} [data-sve-toolbar-group="${firstId}"]`);

  await dragIcon(page, cp, addable, firstRect.right - 10);

  const merged = await groupBoxes(cp);

  step('an icon dragged into another group lands at its end', merged[0]?.[merged[0].length - 1] === addable, JSON.stringify(merged));
  step('its old group still holds the other tool', merged.length === 2 && merged[1].join() === mover, JSON.stringify(merged));
  step('the drag opened nothing', !(await cp.evaluate((k) => document.querySelector(`#__sve-toolbar button[data-tab="${k}"]`)?.getAttribute('aria-pressed') === 'true', addable)));

  // Dropped in the gap before the first group: a new group there, and the
  // one it left — empty now — is gone.
  const settingsRect = await rectIn(cp, `${BAR} > button[data-tab="settings"]`);

  // 2 px into the 8 px gap: inside the drop zone, clear of the first box's slack.
  await dragIcon(page, cp, mover, settingsRect.right + 2);

  const regrouped = await groupBoxes(cp);

  step('an icon dropped in the gap makes a new group there', regrouped.length === 2 && regrouped[0].join() === mover, JSON.stringify(regrouped));
  step('the group it emptied is gone', regrouped[1]?.includes(addable) && !(await storedGroups(cp)).some((g) => g.id === secondId), JSON.stringify(await storedGroups(cp)));

  // ── A whole group, by its own surface ─────────────────────────────────
  const [loneId, restId] = await groupBoxIds(cp);
  const loneRect = await rectIn(cp, groupBox(loneId));
  const pressedBefore = await pressedTools(cp);
  const cursors = await cp.evaluate((sel) => {
    const box = document.querySelector(sel);
    const b = box.getBoundingClientRect();
    const tool = box.querySelector(':scope > button[data-tab], :scope > [id^="__sve-frame-"] > button[data-tab]');

    return {
      surface: document.elementFromPoint(b.left + 2, b.top + b.height / 2) === box,
      box: getComputedStyle(box).cursor,
      icon: getComputedStyle(tool).cursor,
      grip: !!document.querySelector('[data-sve-toolbar-group-grip]'),
    };
  }, groupBox(restId));

  step('a group\'s own surface shows the grab hand, its icons their own pointer, and there is no grip',
    cursors.surface && cursors.box === 'grab' && cursors.icon === 'pointer' && !cursors.grip, JSON.stringify(cursors));

  await dragGroup(page, cp, restId, loneRect.left + 4);
  step('a group dragged by its surface moves in front of the other', (await groupBoxIds(cp)).join() === [restId, loneId].join(), (await groupBoxIds(cp)).join(' '));
  step('and is stored in that order', (await storedGroups(cp)).map((g) => g.id).join() === [restId, loneId].join());
  step('Page settings stays first after a group drag', (await barOrder(cp))[0] === 'settings');
  step('the group drag opened nothing', (await pressedTools(cp)) === pressedBefore, await pressedTools(cp));
  await shot(page, '6-group-dragged');

  // ── The new-group square ──────────────────────────────────────────────
  const squareState = (frame) => frame.evaluate((bar) => {
    const square = document.querySelector(`${bar} > [data-sve-toolbar-new-group]`);
    const btn = square?.querySelector(':scope > button');
    const last = [...document.querySelectorAll(`${bar} > [data-sve-toolbar-group]`)].filter((box) => box.getBoundingClientRect().width > 0).pop();

    if (!btn || !last) {
      return null;
    }

    const r = btn.getBoundingClientRect();
    const l = last.getBoundingClientRect();

    const groupBg = getComputedStyle(last).backgroundColor;

    return {
      opacity: getComputedStyle(square).opacity,
      plus: getComputedStyle(btn.querySelector('svg')).opacity,
      w: Math.round(r.width),
      h: Math.round(r.height),
      gap: Math.round(r.left - l.right),
      top: Math.round(r.top - l.top),
      ring: getComputedStyle(btn).borderTopColor === groupBg,
      surface: getComputedStyle(btn).backgroundColor === groupBg,
    };
  }, BAR);

  const lastRect = await rectIn(cp, `${BAR} > [data-sve-toolbar-group="${loneId}"]`);

  await page.mouse.move(10, 880);
  await sleep(250);

  const square = await squareState(cp);

  step('away from the bar the new-group square is still there right of the last group: its height, 1:1, 1rem away',
    !!square && square.opacity === '1' && square.w === 32 && square.h === 32 && square.gap === 16 && square.top === 0, JSON.stringify(square));
  step('at rest it is a ring in the groups\' grey, no surface, its «+» at 20%', square?.ring && !square.surface && square.plus === '0.2', JSON.stringify(square));
  await shot(page, '7-new-group-square');

  const squarePoint = await pointIn(cp, `${NEW_GROUP} > button`);

  await page.mouse.move(squarePoint.x, squarePoint.y, { steps: 8 });
  await sleep(250);

  const hovered = await squareState(cp);

  step('hovered it takes the groups\' surface and its «+» is whole', hovered?.surface && hovered.plus === '1', JSON.stringify(hovered));

  await page.mouse.move(lastRect.left + 10, lastRect.y);
  await sleep(200);
  await click(page, cp, `${NEW_GROUP} > button`);
  step('its «+» opens the tool menu', !!(await cp.waitForSelector('#__sve-toolbar-add-menu', { timeout: 5000 }).catch(() => null)));
  step('every tool can be picked for a new group', await cp.evaluate(() => {
    const tiles = [...document.querySelectorAll('#__sve-toolbar-add-menu [data-sve-toolbar-add-tool]')];

    return tiles.length > 0 && tiles.every((tile) => !tile.disabled);
  }));

  const starter = (await groupBoxes(cp))[0].find((key) => key !== addable);

  await click(page, cp, `#__sve-toolbar-add-menu [data-sve-toolbar-add-tool="${starter}"]`);
  await sleep(300);

  const withNew = await groupBoxes(cp);

  step('the picked tool starts a new group, last in the bar', withNew.length === 3 && withNew[2].join() === starter, JSON.stringify(withNew));
  step('the tool menu closed', !(await cp.$('#__sve-toolbar-add-menu')));

  const squareRect = await rectIn(cp, `${NEW_GROUP} > button`);
  const dropped = withNew[0].find((key) => key !== starter);

  await dragIcon(page, cp, dropped, squareRect.left + 16);

  const withDropped = await groupBoxes(cp);

  step('an icon dropped on the square starts a new group there too', withDropped.length === 4 && withDropped[3].join() === dropped, JSON.stringify(withDropped));

  // ── Reset groups ──────────────────────────────────────────────────────
  await openMenuTab(page, cp, 'toolbar');
  await click(page, cp, `${MENU} [data-sve-toolbar-groups-reset]`);
  await sleep(300);
  step('Reset groups is one group again', (await groupBoxes(cp)).length === 1, JSON.stringify(await groupBoxes(cp)));
  step('and clears the stored groups', (await storedKey(cp, 'sve-toolbar-groups')) === null);
  step('the list is one group too', (await cp.evaluate((m) => document.querySelectorAll(`${m} [data-sve-toolbar-group-row]`).length, MENU)) === 1);

  // ── The site's presets ────────────────────────────────────────────────
  // Statamic's config hands back reactive proxies, which do not cross into
  // the test as values — made plain JSON in the page first.
  const sitePresets = await cp.evaluate(() => JSON.parse(JSON.stringify(window.Statamic?.$config?.get?.('sveToolbarPresets') || [])));
  const dockArmed = async () => (await storedKey(cp, 'sve-code-dock-armed')) === '1';

  if (!sitePresets.length) {
    console.log("info site presets not provided by this site's PHP (older than the build) — those steps skipped");
  } else {
    const editorPreset = sitePresets.find((preset) => preset.id === 'editor');
    const developerPreset = sitePresets.find((preset) => preset.id === 'developer');

    step('Developer and Content editor are offered', !!(await cp.$(`${MENU} [data-sve-toolbar-preset="developer"]`)) && !!(await cp.$(`${MENU} [data-sve-toolbar-preset="editor"]`)));
    await click(page, cp, `${MENU} [data-sve-toolbar-preset="editor"] button`);
    await sleep(800);

    const shownEditor = await visibleIcons(cp);

    step('Content editor shows its icons', sameSet(shownEditor, before.filter((key) => key === 'settings' || editorPreset.tools.includes(key))), shownEditor.join(' '));
    step('and is marked as on', await cp.$eval(`${MENU} [data-sve-toolbar-preset="editor"]`, (el) => el.classList.contains('is-on')));
    step('the template dock follows it', (await dockArmed()) === editorPreset.dock);

    await click(page, cp, `${MENU} [data-sve-toolbar-preset="developer"] button`);
    await sleep(800);
    step('Developer shows its icons', sameSet(await visibleIcons(cp), before.filter((key) => key === 'settings' || developerPreset.tools.includes(key))), (await visibleIcons(cp)).join(' '));
    step('and the template dock follows it', (await dockArmed()) === developerPreset.dock);

    // A copy of Developer is the same bar: the one picked is the one marked.
    const isOn = (id) => cp.$eval(`${MENU} [data-sve-toolbar-preset="${id}"]`, (el) => el.classList.contains('is-on')).catch(() => false);

    await click(page, cp, `${MENU} [data-sve-toolbar-preset-new]`);
    await cp.waitForSelector(`${MENU} [data-sve-toolbar-preset-name]`, { timeout: 3000 });
    await page.keyboard.type(`${PRESET_NAME} copy`);
    await page.keyboard.press('Enter');
    await sleep(400);

    const copy = await cp.evaluate((m, name) => [...document.querySelectorAll(`${m} [data-sve-toolbar-preset^="u-"]`)]
      .find((el) => el.textContent.includes(name))?.dataset.sveToolbarPreset || '', MENU, `${PRESET_NAME} copy`);

    step('a copy of Developer, just saved, is the one marked', !!copy && (await isOn(copy)) && !(await isOn('developer')));
    await click(page, cp, `${MENU} [data-sve-toolbar-preset="developer"] button`);
    await sleep(400);
    step('picking Developer marks Developer', (await isOn('developer')) && !(await isOn(copy)));
    await click(page, cp, `${MENU} [data-sve-toolbar-preset="${copy}"] button`);
    await sleep(400);
    step('picking the copy marks the copy', (await isOn(copy)) && !(await isOn('developer')));
    await click(page, cp, `${MENU} [data-sve-toolbar-preset="${copy}"] [data-sve-toolbar-preset-delete]`);
    await sleep(300);
  }

  // ── A preset of one's own ─────────────────────────────────────────────
  await click(page, cp, `${MENU} [data-sve-toolbar-all]`).catch(() => {});
  await sleep(200);
  await click(page, cp, `${toolRow(panelTool)} input[type="checkbox"]`);
  await sleep(200);
  await click(page, cp, `${MENU} [data-sve-toolbar-preset-new]`);
  await cp.waitForSelector(`${MENU} [data-sve-toolbar-preset-name]`, { timeout: 3000 });
  await page.keyboard.type(PRESET_NAME);
  await page.keyboard.press('Enter');
  await sleep(300);

  // Found by its name: the account may have presets of its own already.
  const own = await cp.evaluate((m, name) => [...document.querySelectorAll(`${m} [data-sve-toolbar-preset^="u-"]`)]
    .find((el) => el.textContent.includes(name))?.dataset.sveToolbarPreset || '', MENU, PRESET_NAME);

  step('a new preset is saved under its name', !!own);
  // The first preset that is the bar is marked; the account may hold an
  // identical one of its own ahead of this one.
  step('and a preset of your own with that bar is on', !!(await cp.$(`${MENU} [data-sve-toolbar-preset^="u-"].is-on`)));

  await click(page, cp, `${MENU} [data-sve-toolbar-all]`);
  await sleep(300);
  step('Show all leaves the preset', !(await cp.$eval(`${MENU} [data-sve-toolbar-preset="${own}"]`, (el) => el.classList.contains('is-on'))));
  await click(page, cp, `${MENU} [data-sve-toolbar-preset="${own}"] button`);
  await sleep(500);
  step('picking it again hides what it hides', !(await seen(cp, icon(panelTool))));

  // ── The reset: the layout goes, the user's own presets stay ───────────
  await click(page, cp, `${MENU} .sve-lp-settings__reset`);
  await sleep(800);
  step('Reset Live Preview settings brings it back', await seen(cp, icon(panelTool)));
  await openMenuTab(page, cp, 'toolbar');
  step('and keeps the preset of your own', !!(await cp.$(`${MENU} [data-sve-toolbar-preset="${own}"]`)));
  await click(page, cp, `${MENU} [data-sve-toolbar-preset="${own}"] [data-sve-toolbar-preset-delete]`);
  await sleep(300);
  step('× deletes it', !(await cp.$(`${MENU} [data-sve-toolbar-preset="${own}"]`)) && !String(await storedKey(cp, 'sve-toolbar-presets')).includes(own));
  await page.keyboard.press('Escape');

  const jsErrors = errors.filter((line) => !line.startsWith('console: Failed to load resource'));
  // With SVE_WORKTREE the page HTML still carries the installed build's
  // modulepreload links (the site's PHP writes them from its own manifest), so
  // a shared chunk whose hash changed is preloaded under its old name and
  // misses. That is the harness, not the build: HTML and files come from one
  // manifest on a real site. Only those parser-made requests are set aside.
  const preloadMiss = (line) => WORKTREE && / \(parser /.test(line);
  const editorMissing = missing.filter((line) => /visual-editor|\/!\/sve\//.test(line) && !preloadMiss(line));
  const preloads = [...new Set(missing.filter((line) => /visual-editor/.test(line) && preloadMiss(line)).map((line) => line.split(' (')[0]))];

  if (preloads.length) {
    console.log(`info installed preload links not in the working tree (expected with SVE_WORKTREE): ${preloads.join(' | ')}`);
  }

  step("the account's saved layout on the server is unchanged", (await serverLayout()) === layoutBefore);
  step('no JS errors', jsErrors.length === 0, jsErrors.slice(0, 5).join(' | '));
  step('no missing editor files', editorMissing.length === 0, editorMissing.slice(0, 5).join(' | '));

  if (missing.length) {
    console.log(`info the site's own missing files: ${[...new Set(missing)].filter((line) => !/visual-editor|\/!\/sve\//.test(line)).slice(0, 8).join(' | ')}`);
  }
} catch (e) {
  step('run', false, e.message);
} finally {
  await browser.close();

  if (userYaml !== null) {
    writeFileSync(USER_FILE, userYaml);
  }
}

console.log(`info ${prefsWritesBlocked} layout save(s) kept off the server`);

console.log(failed ? `\n${failed} step(s) failed` : '\nall steps passed');
process.exit(failed ? 1 : 0);
