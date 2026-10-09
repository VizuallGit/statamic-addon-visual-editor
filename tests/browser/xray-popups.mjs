#!/usr/bin/env node
/**
 * X-ray's and the design overlay's bars stay inside Live Preview, under every
 * popup the editor opens.
 *
 * 9 Oct 2026: the bars were fixed on the Control Panel's <body> at the top of
 * the z-order and lay over the Stylesheets panel and the Edits dialog. They now
 * live beside the preview pane (cp/preview-bar.js). This run turns both tools
 * on, then opens every tool in the top bar and the ⋮ menu, one at a time, and
 * at points across each bar asks the browser what is under it: if a bar is on
 * top of anything painted over the preview frame, it is painting over a popup.
 *
 * Nothing is written: the layout save (/!/sve/chrome-prefs) is answered here,
 * inside every document and at the network; no design is uploaded; nothing is
 * saved or published. X-ray's and the design overlay's switches live in this
 * browser's localStorage only.
 *
 * Env: SVE_SITE_URL, SVE_USER, SVE_PASS, SVE_ENTRY, SVE_CHROME, SVE_SHOTS=<dir>,
 * SVE_WORKTREE=1 (+ SVE_ADDON_DIR, SVE_INSTALLED_MANIFEST) to serve this
 * checkout's build — see serve-worktree.mjs.
 */
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
let failed = 0;
const step = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const BAR = '#__sve-toolbar';
const BARS = { xray: '#__sve-xray-bar', design: '#__sve-design-bar' };
const SWITCHES = ['xray', 'design_overlay'];
/**
 * The two a bar used to lie on top of (9 Oct 2026): opened, they must be over
 * the bars, not merely clear of them — or the run proves nothing about them.
 */
const MUST_COVER = ['site_css', 'edits'];
const errors = [];

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

    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  }, selector);

  if (!r) {
    return null;
  }

  let { x, y } = r;

  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const el = await f.frameElement();
    const box = await el.boundingBox();

    x += box.x;
    y += box.y;
  }

  return { x, y };
}

async function click(page, frame, selector) {
  const at = await pointIn(frame, selector);

  if (!at) {
    return false;
  }

  await page.mouse.click(at.x, at.y);

  return true;
}

/**
 * At points across each visible bar: what is under it. A bar on top of an
 * element that is neither the preview frame nor one of its ancestors is a bar
 * painting over something else — a popup, a dialog, a panel.
 */
function barsCovering(cp) {
  return cp.evaluate((bars) => {
    const frame = document.getElementById('live-preview-iframe');
    const out = [];
    const name = (el) =>
      `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}`;

    for (const [key, selector] of Object.entries(bars)) {
      const bar = document.querySelector(selector);

      if (!bar || bar.hidden) {
        out.push({ key, shown: false });

        continue;
      }

      const r = bar.getBoundingClientRect();
      const over = [];
      let covered = 0;

      for (const fx of [0.08, 0.3, 0.5, 0.7, 0.92]) {
        const x = r.left + r.width * fx;
        const y = r.top + r.height / 2;
        const stack = document.elementsFromPoint(x, y);

        if (!stack.length || !bar.contains(stack[0])) {
          covered++;

          continue;
        }

        // Only what is painted over the preview counts: everything the stack
        // lists between the bar and the frame. Below the frame is the page
        // behind Live Preview, which the bar is meant to be above.
        const below = stack.indexOf(frame);
        const above = below >= 0 ? stack.slice(0, below) : stack;
        const under = above.filter((el) => !bar.contains(el) && !el.contains(frame));

        if (under.length) {
          over.push(name(under[0]));
        }
      }

      out.push({ key, shown: true, over: [...new Set(over)], covered, inLp: !!bar.closest('.live-preview-main') });
    }

    return out;
  }, BARS);
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1600,1000'], defaultViewport: { width: 1600, height: 1000 } });
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

  // Both tools on, from the first document on: their switches are this browser's only.
  try {
    localStorage.setItem('sve-xray', JSON.stringify({ on: true }));
    localStorage.setItem('sve-design-overlay', JSON.stringify({ on: true }));
  } catch {
    /* about:blank */
  }
}, '/!/sve/chrome-prefs');

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('response', (r) => r.status() >= 500 && errors.push(`HTTP ${r.status()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

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

const shot = async (name) => {
  if (SHOTS) {
    await page.screenshot({ path: `${SHOTS}/${name}.png` });
  }
};

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()));

  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate((re) => [...document.querySelectorAll('button, a')].find((el) => new RegExp(re, 'i').test(el.textContent || ''))?.click(), 'live preview|forhåndsvisning');
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector(`${BAR} button`, { timeout: 20000 });
  await sleep(2500);

  for (const key of SWITCHES) {
    step(`${key} switch is in the top bar and on`, await cp.evaluate((k) => document.querySelector(`#__sve-toolbar button[data-tab="${k}"]`)?.getAttribute('aria-pressed') === 'true', key));
  }

  await cp.waitForSelector(BARS.xray, { timeout: 10000 }).catch(() => {});
  await cp.waitForSelector(BARS.design, { timeout: 10000 }).catch(() => {});
  await sleep(800);
  await shot('00-both-on');

  const start = await barsCovering(cp);

  for (const bar of start) {
    step(`${bar.key} bar shown inside Live Preview`, bar.shown && bar.inLp, JSON.stringify(bar));
    step(`${bar.key} bar covers nothing but the preview`, bar.shown && !bar.over.length, bar.over?.join(', '));
  }

  // Zoom moves the frame with a transform — no resize — and the bars follow.
  const barsOnFrame = () =>
    cp.evaluate((bars) => {
      const frame = document.getElementById('live-preview-iframe');
      const fr = frame.getBoundingClientRect();
      const pane = frame.closest('.live-preview-contents').getBoundingClientRect();
      const visLeft = Math.max(fr.left, pane.left);
      const visRight = Math.min(fr.right, pane.right);
      const visTop = Math.max(fr.top, pane.top);
      const visBottom = Math.min(fr.bottom, pane.bottom);

      return Object.entries(bars).map(([key, selector]) => {
        const r = document.querySelector(selector)?.getBoundingClientRect();

        if (!r) {
          return { key, ok: false };
        }

        const off = Math.abs((r.left + r.right) / 2 - (visLeft + visRight) / 2);

        return { key, ok: off < 3 && r.top >= visTop - 1 && r.bottom <= visBottom + 1, off: Math.round(off) };
      });
    }, BARS);

  for (const [dir, label] of [['out', 'zoomed out'], ['in', 'zoomed back in']]) {
    if (await click(page, cp, `button[data-zoom="${dir}"]`)) {
      await sleep(900);

      const placed = await barsOnFrame();

      step(`${label}: bars centred on the visible frame`, placed.every((bar) => bar.ok), JSON.stringify(placed));
      await shot(`zoom-${dir}`);
    }
  }

  const tools = (await cp.evaluate(() => [...document.querySelectorAll('#__sve-toolbar button[data-tab]')].filter((b) => b.getBoundingClientRect().width > 0).map((b) => b.dataset.tab))).filter((key) => !SWITCHES.includes(key));

  console.log(`info tools: ${tools.join(', ')}`);

  const targets = [...tools.map((key) => ({ key, selector: `${BAR} button[data-tab="${key}"]` })), { key: 'more-menu', selector: '#__sve-lp-more' }];

  for (const { key, selector } of targets) {
    const pressedBefore = await cp.evaluate((sel) => document.querySelector(sel)?.getAttribute('aria-pressed'), selector);

    if (!(await click(page, cp, selector))) {
      console.log(`info ${key}: not clickable here, skipped`);

      continue;
    }

    await sleep(1600);
    await shot(`tool-${key}`);

    const bars = await barsCovering(cp);
    const bad = bars.filter((bar) => bar.shown && bar.over.length);

    step(`${key} open: no bar over it`, !bad.length, bad.map((bar) => `${bar.key} over ${bar.over.join(', ')}`).join('; '));

    if (MUST_COVER.includes(key)) {
      const uncovered = bars.filter((bar) => bar.shown && !bar.covered);

      step(`${key} open: it covers the bars`, !uncovered.length, uncovered.map((bar) => bar.key).join(', '));
    }

    // Close it again: Escape for dialogs and menus, the icon again for a panel left pressed.
    await page.keyboard.press('Escape');
    await sleep(500);

    const pressedNow = await cp.evaluate((sel) => document.querySelector(sel)?.getAttribute('aria-pressed'), selector);

    if (pressedNow === 'true' && pressedBefore !== 'true') {
      await click(page, cp, selector);
      await sleep(800);
    }

    await page.keyboard.press('Escape');
    await sleep(600);
  }

  const end = await barsCovering(cp);

  for (const bar of end) {
    step(`${bar.key} bar back and clear after every tool`, bar.shown && !bar.over.length, JSON.stringify(bar));
  }

  // Off again: nothing of either left in the Control Panel.
  for (const key of SWITCHES) {
    await click(page, cp, `${BAR} button[data-tab="${key}"]`);
    await sleep(600);
  }

  step(
    'both off: bars and styles gone',
    await cp.evaluate(() => !document.querySelector('#__sve-xray-bar, #__sve-design-bar, #__sve-xray-style, #__sve-design-style')),
  );
  step('no page errors', !errors.length, errors.slice(0, 5).join(' | '));
} catch (err) {
  step('run', false, err.stack || String(err));
} finally {
  await browser.close();
}

console.log(failed ? `${failed} FAIL` : 'ALL OK');
process.exit(failed ? 1 : 0);
