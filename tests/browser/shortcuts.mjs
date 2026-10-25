#!/usr/bin/env node
/**
 * Keyboard shortcuts in a real Live Preview, with real keypresses — measured
 * by what is on screen, not by what is in the DOM.
 *
 * ⌘G opens Globals and closes it again. ⌘M switches to Mobile through the
 * same door as a click on the size button (the breakpoint event fires, the
 * stored device follows). X-ray hidden from the ⋮ menu opens on ⌘⇧X with its
 * icon still hidden, and nothing is written to the hidden list. Globals
 * hidden opens on ⌘G under the bar's left edge, the icon still hidden. After
 * a click on the page the keypress lands in the preview document: ⌘P still
 * opens Pages, and the preview took the key from the browser (no print
 * dialog). ⌘B typed in a Bard field stays bold (Blueprint does not open), and
 * ⌘D in the HTML dock stays CodeMirror's (the size does not change) — both
 * when the page has such a field. In ⋮ → Shortcuts: Esc while recording ends
 * the recording and leaves the menu open; a recorded shortcut runs at once;
 * «move here» takes a shortcut from the action that had it; Reset puts the
 * built-in ones back.
 *
 * Not here: a new screen size with a shortcut, and the settings screen's
 * recorder — both write to the site, so they are checked by hand.
 *
 * The run never saves the editor layout to the server: every write to
 * /!/sve/chrome-prefs is answered here and goes nowhere. A local test user's
 * file is put back as it was.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' SVE_WORKTREE=1 \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/shortcuts.mjs
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
const info = (text) => console.log(`info ${text}`);

const BAR = '#__sve-toolbar';
const MORE = '#__sve-lp-more';
const MENU = '#__sve-lp-more-menu';
const UNDER_BAR = '#__sve-under-bar';
const GLOBALS_PICKER = '#__sve-globals-picker';
const GLOBALS_PANEL = '#__sve-globals-panel';
const PAGES_PICKER = '#__sve-collection-picker';
const XRAY_BAR = '#__sve-xray-bar';
const DOCK = '#__sve-code-dock';
const PREVIEW = '#live-preview-iframe';
const icon = (key) => `${BAR} button[data-tab="${key}"]`;
const frame = (key) => `#__sve-header-frame-${key}`;
const toolRow = (key) => `${MENU} [data-sve-toolbar-tool="${key}"]`;
const shortcutRow = (action) => `${MENU} [data-sve-shortcut-row="${action}"]`;

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
const waitSeen = (frame, selector, ms = 8000) => waitFor(frame, onScreen, selector, ms);
const waitGone = (frame, selector, ms = 8000) => waitFor(frame, (sel) => !document.querySelector(sel) || !(() => {
  const el = document.querySelector(sel);
  const b = el.getBoundingClientRect();
  const style = getComputedStyle(el);

  return style.display !== 'none' && style.visibility !== 'hidden' && b.width > 0 && b.height > 0;
})(), selector, ms);

const storedKey = (frame, key) => frame.evaluate((k) => {
  const id = window.Statamic?.$config?.get?.('sveUserId');

  return localStorage.getItem(id ? `sve-u:${id}:${k}` : k);
}, key);

const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/shortcuts-${name}.png` });

/** `mod+shift+x` → a press of Meta+Shift+KeyX on the Control Panel page (a Mac: mod is ⌘). */
async function press(page, combo) {
  const parts = combo.split('+');
  const key = parts.pop();
  const held = parts.map((mod) => ({ mod: 'Meta', ctrl: 'Control', alt: 'Alt', shift: 'Shift' })[mod]);
  const code = key.length === 1 ? `Key${key.toUpperCase()}` : { comma: 'Comma', period: 'Period', slash: 'Slash' }[key] || key;

  for (const name of held) {
    await page.keyboard.down(name);
  }

  await page.keyboard.press(code);

  for (const name of held.reverse()) {
    await page.keyboard.up(name);
  }

  await sleep(400);
}

async function openLivePreview(page) {
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate((re) => [...document.querySelectorAll('button, a')].find((el) => new RegExp(re, 'i').test(el.textContent || ''))?.click(), 'live preview|forhåndsvisning');
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  // A user's first Live Preview loads cold — the whole CP cluster from disk.
  await cp.waitForSelector(`${BAR} button`, { timeout: 60000 });
  await sleep(3000);

  return cp;
}

async function openMenuTab(page, cp, tab) {
  if (!(await cp.$(MENU))) {
    await click(page, cp, MORE);
    await cp.waitForSelector(MENU, { timeout: 5000 });
  }

  await click(page, cp, `${MENU} [data-sve-lp-settings-tab="${tab}"]`);
  await sleep(250);
}

async function closeMenu(page, cp) {
  if (await cp.$(MENU)) {
    await page.keyboard.press('Escape');
    await waitGone(cp, MENU, 3000);
  }
}

/** Tick or untick a tool in ⋮ → Top bar; leaves the menu closed. */
async function setToolShown(page, cp, key, shown) {
  await openMenuTab(page, cp, 'toolbar');

  const checked = await cp.$eval(`${toolRow(key)} input[type="checkbox"]`, (el) => el.checked);

  if (checked !== shown) {
    await click(page, cp, `${toolRow(key)} input[type="checkbox"]`);
    await sleep(300);
  }

  await closeMenu(page, cp);
  await sleep(300);
}

/** Focus the preview document, so the next keypress lands there. */
const focusPreview = (cp) => cp.evaluate((sel) => {
  const iframe = document.querySelector(sel);

  iframe.contentWindow.focus();

  return document.activeElement === iframe;
}, PREVIEW);

/** The preview's own frame object, for evaluating inside it. */
const previewFrameOf = (cp) => cp.childFrames().find((f) => f.name() === 'live-preview-iframe' || /live-preview/.test(f.url())) || cp.childFrames()[0];

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
  info('build served from the working tree');
} else {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (!blockPrefsWrite(req)) {
      req.continue();
    }
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

  const cp = await openLivePreview(page);

  // What applies here: built in, the site's over it — this user has nothing of their own.
  const config = await cp.evaluate(() => JSON.parse(JSON.stringify(window.Statamic?.$config?.get?.('sveShortcuts') || {})));
  const sizes = await cp.evaluate(() => JSON.parse(JSON.stringify(window.Statamic?.$config?.get?.('sveBreakpoints') || [])));
  const active = { ...(config.builtIn || {}), ...(config.site || {}) };
  const combo = (action) => active[action];

  if (!combo('tool:globals') || !combo('tool:pages') || !combo('tool:xray') || !combo('size:mobile')) {
    throw new Error(`the site's PHP sends no shortcuts (sveShortcuts) — it is older than this build: ${JSON.stringify(active)}`);
  }

  const mobile = sizes.find((row) => row.handle === 'mobile');
  const icons = await cp.evaluate((bar) => [...document.querySelectorAll(`${bar} button[data-tab]`)].map((btn) => btn.dataset.tab), BAR);

  info(`shortcuts: ${Object.entries(active).map(([a, c]) => `${a}=${c}`).join(' ')}`);
  step('the user has the icons the run presses', ['globals', 'pages', 'xray'].every((key) => icons.includes(key)), icons.join(' '));

  // ── ⌘G: Globals opens and closes ──────────────────────────────────────
  const globalsOpen = () => cp.evaluate((sels) => sels.some((sel) => {
    const el = document.querySelector(sel);

    if (!el) {
      return false;
    }

    const b = el.getBoundingClientRect();

    return getComputedStyle(el).display !== 'none' && b.width > 0 && b.height > 0;
  }), [GLOBALS_PICKER, GLOBALS_PANEL]);

  await press(page, combo('tool:globals'));
  await waitFor(cp, () => true, null, 300);
  step(`${combo('tool:globals')} opens Globals`, await globalsOpen());
  await shot(page, 'globals-open');
  await press(page, combo('tool:globals'));
  await sleep(300);
  step('a second press closes it', !(await globalsOpen()));

  // ── ⌘M: Mobile, through the same door as a click ──────────────────────
  await cp.evaluate(() => {
    window.__sveBp = [];
    window.addEventListener('sve:breakpoints-changed', (e) => window.__sveBp.push(e.detail ?? true));
  });
  await press(page, combo('size:mobile'));
  await sleep(600);

  const device = await storedKey(cp, 'sve-lp-device');
  const previewWidth = await cp.evaluate((sel) => Math.round(document.querySelector(sel)?.getBoundingClientRect().width || 0), PREVIEW);

  step(`${combo('size:mobile')} switches to Mobile`, device === String(mobile?.device), `stored device ${device}, preview ${previewWidth}px wide`);
  step('the breakpoint event fired — the Tailwind row, CSS sizes and responsive fields follow it', (await cp.evaluate(() => window.__sveBp.length)) > 0);
  await shot(page, 'mobile');
  await press(page, combo('size:laptop'));
  await sleep(600);
  step(`${combo('size:laptop')} back to Desktop`, (await storedKey(cp, 'sve-lp-device')) !== String(mobile?.device));

  // ── A hidden X-ray opens, the icon stays hidden ───────────────────────
  await setToolShown(page, cp, 'xray', false);
  step('X-ray hidden from the menu: its icon is gone', !(await seen(cp, icon('xray'))));
  await press(page, combo('tool:xray'));
  step(`${combo('tool:xray')} opens X-ray anyway`, await waitSeen(cp, XRAY_BAR));
  step('its icon is still hidden', !(await seen(cp, icon('xray'))));
  step('the hidden list is untouched', JSON.parse((await storedKey(cp, 'sve-toolbar-hidden')) || '[]').includes('xray'));
  await shot(page, 'xray-hidden-open');
  await press(page, combo('tool:xray'));
  step('a second press closes it', await waitGone(cp, XRAY_BAR));
  await setToolShown(page, cp, 'xray', true);

  // ── A hidden Pages opens under the bar's left edge ──────────────────
  await setToolShown(page, cp, 'pages', false);
  step('Pages hidden: its frame is gone', !(await seen(cp, frame('pages'))));
  await press(page, combo('tool:pages'));

  const underBar = await waitSeen(cp, UNDER_BAR, 5000) && await cp.evaluate((sels) => {
    const [holder, picker, bar] = sels.map((sel) => document.querySelector(sel));
    const header = [...document.querySelectorAll('.live-preview-header')].find((el) => !el.closest('#sve-lp-cover'));

    if (!holder || !picker || !header || !holder.contains(picker)) {
      return { ok: false, why: `holder ${!!holder}, picker in it ${!!(holder && picker && holder.contains(picker))}` };
    }

    const h = holder.getBoundingClientRect();
    const b = header.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.375;

    return {
      ok: Math.abs(h.left - (b.left + gap)) < 2 && Math.abs(h.top - (b.bottom + gap)) < 2,
      why: `holder at ${Math.round(h.left)},${Math.round(h.top)}; bar left ${Math.round(b.left)}, bottom ${Math.round(b.bottom)}; bar node ${!!bar}`,
    };
  }, [UNDER_BAR, PAGES_PICKER, BAR]);

  step(`${combo('tool:pages')} with Pages hidden: its picker stands under the bar's left edge`, underBar?.ok === true, underBar?.why || 'no holder');
  step('the icon stays hidden', !(await seen(cp, frame('pages'))) && !(await seen(cp, icon('pages'))));
  await shot(page, 'pages-hidden-open');
  await press(page, combo('tool:pages'));
  step('a second press takes it away again', await waitGone(cp, UNDER_BAR));
  await setToolShown(page, cp, 'pages', true);

  // ── After a click on the page: the preview takes the key ──────────────
  step('the preview document can take focus', await focusPreview(cp));

  const preview = previewFrameOf(cp);

  await preview.evaluate(() => {
    window.__svePrevented = [];
    window.addEventListener('keydown', (e) => window.__svePrevented.push({ key: e.key, prevented: e.defaultPrevented }), true);
  });
  await press(page, combo('tool:pages'));
  step(`${combo('tool:pages')} with the preview focused opens Pages`, await waitSeen(cp, PAGES_PICKER, 4000));

  const taken = await preview.evaluate(() => window.__svePrevented);

  step('and the preview took the key from the browser (no print dialog)', taken.some((e) => e.prevented), JSON.stringify(taken));
  await shot(page, 'pages-from-preview');
  await press(page, combo('tool:pages'));
  await sleep(300);
  step('a second press from the preview closes it', !(await seen(cp, PAGES_PICKER)));

  // ── ⌘B in Bard stays bold; ⌘D in the dock stays CodeMirror's ──────────
  await click(page, cp, icon('settings'));
  await sleep(1500);

  const prose = await cp.$('.bard-fieldtype .ProseMirror, .ProseMirror');

  if (prose && combo('tool:blueprint') === 'mod+b') {
    await prose.click();
    await sleep(200);
    await page.keyboard.type('x');
    await press(page, 'mod+b');
    await sleep(800);

    const drawer = await cp.evaluate(() => !!document.querySelector('.sve-fs-overlay'));
    const bold = await cp.evaluate(() => document.activeElement?.closest?.('.ProseMirror') !== null);

    step('⌘B typed in a Bard field stays with Bard: Blueprint does not open', !drawer && bold);
    await page.keyboard.press('Backspace');
  } else {
    info(`no Bard field on this page's panel, or Blueprint is not mod+b (${combo('tool:blueprint')}) — the Bard step is skipped`);
  }

  if (icons.includes('code') && combo('size:laptop') === 'mod+d') {
    await press(page, combo('size:mobile'));
    await sleep(500);
    await press(page, combo('tool:code'));
    await waitSeen(cp, DOCK, 10000);
    await sleep(1500);

    const cm = await cp.$(`${DOCK} .cm-content`);

    if (cm) {
      await cm.click();
      await sleep(200);
      await press(page, 'mod+d');
      await sleep(500);
      step('⌘D in the HTML dock stays CodeMirror’s: the size does not change', (await storedKey(cp, 'sve-lp-device')) === String(mobile?.device));
    } else {
      info('the dock opened without an editor to type in — the ⌘D step is skipped');
    }

    await press(page, combo('tool:code'));
    await press(page, combo('size:laptop'));
    await sleep(500);
  } else {
    info(`no HTML dock for this user, or Desktop is not mod+d (${combo('size:laptop')}) — the ⌘D step is skipped`);
  }

  // ── ⋮ → Shortcuts ─────────────────────────────────────────────────────
  await openMenuTab(page, cp, 'shortcuts');
  step('the Shortcuts tab lists Globals', !!(await cp.$(shortcutRow('tool:globals'))));
  await shot(page, 'menu-shortcuts');

  const keyOf = (action) => `${shortcutRow(action)} [data-sve-shortcut-key]`;
  const recording = () => cp.evaluate(() => !!document.querySelector('[data-sve-shortcut-recording]'));

  await click(page, cp, keyOf('tool:globals'));
  await sleep(200);
  step('a click on the key starts recording', await recording());
  await page.keyboard.press('Escape');
  await sleep(300);
  step('Esc ends the recording and leaves the menu open', !(await recording()) && !!(await cp.$(MENU)));

  await click(page, cp, keyOf('tool:globals'));
  await sleep(200);
  await press(page, 'mod+k');
  step('⌘K recorded for Globals', (await cp.$eval(keyOf('tool:globals'), (el) => el.textContent.trim())) === '⌘K');
  step('stored as this user’s own', JSON.parse((await storedKey(cp, 'sve-shortcuts')) || '{}')['tool:globals'] === 'mod+k');
  await closeMenu(page, cp);
  await press(page, 'mod+k');
  await sleep(300);
  step('and it runs at once: ⌘K opens Globals', await globalsOpen());
  await press(page, 'mod+k');
  await sleep(300);

  await openMenuTab(page, cp, 'shortcuts');
  await click(page, cp, keyOf('tool:pages'));
  await sleep(200);
  await press(page, 'mod+k');
  step('⌘K on Pages asks, as Globals has it', !!(await cp.$(`${shortcutRow('tool:pages')} [data-sve-shortcut-ask]`)));
  await click(page, cp, `${shortcutRow('tool:pages')} [data-sve-shortcut-move]`);
  await sleep(300);

  const moved = JSON.parse((await storedKey(cp, 'sve-shortcuts')) || '{}');

  step('«move here»: Pages has ⌘K, Globals none', moved['tool:pages'] === 'mod+k' && moved['tool:globals'] === 'none', JSON.stringify(moved));
  await click(page, cp, `${MENU} [data-sve-shortcuts-reset]`);
  await sleep(300);
  step('Reset takes this user’s own away', (await storedKey(cp, 'sve-shortcuts')) === null);
  step('and the built-in one shows again', (await cp.$eval(keyOf('tool:globals'), (el) => el.textContent.trim())) === '⌘G');
  await closeMenu(page, cp);
  await press(page, combo('tool:globals'));
  await sleep(300);
  step(`${combo('tool:globals')} opens Globals again after the reset`, await globalsOpen());
  await press(page, combo('tool:globals'));

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
