#!/usr/bin/env node
/**
 * The theme panel's Utilities tab, in a real Live Preview, with real mouse
 * clicks and real typing into its CodeMirror.
 *
 * Lists the site's `@utility` blocks, rewrites `card`'s body and sees the
 * preview's BUILT stylesheet repaint (the layer swap in utility-paint.js —
 * not a hold sheet), makes a new utility and sees it style an element the
 * build has never met, saves once and reads both back from site.css. The
 * server build after the save: against a PHP without the endpoint the note
 * appears; with it, the built stylesheet's <link> is swapped. site.css is put
 * back exactly as it was afterwards.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/theme-utilities.mjs
 *
 * Same env as theme-panel.mjs. SVE_WORKTREE=1 serves this checkout's build;
 * the strings then come from the installed PHP, so only elements are checked,
 * not texts.
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

if (original.includes('testutil')) {
  console.log('FAIL site.css has test values from an earlier run — put site.css back first');
  process.exit(1);
}

if (!/@utility card \{/.test(original)) {
  console.log('FAIL site.css has no @utility card — this test rewrites it');
  process.exit(1);
}

const PANEL = '#__sve-theme';

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

/** A real mouse click, after the page is hit-testable (see theme-panel.mjs). */
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

/** An element with `cls` made in the preview for a moment: the computed styles a utility would set. */
const probeClass = (frame, cls) => frame.evaluate((c) => {
  const el = document.createElement('div');

  el.className = c;
  document.body.append(el);

  const cs = getComputedStyle(el);
  const out = { padding: cs.paddingTop, background: cs.backgroundColor, outline: `${cs.outlineWidth} ${cs.outlineStyle}` };

  el.remove();

  return out;
}, cls);

/** Focus the open card's CodeMirror, select everything and type `text` over it. */
async function retypeBody(page, frame, text) {
  await click(page, frame, '[data-sve-utility-editor] .cm-content');
  await page.keyboard.down('Meta');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Meta');
  await page.keyboard.type(text, { delay: 5 });
}

const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/theme-utilities-${name}.png` });

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)} @ ${(m.location()?.url || '').slice(-80)}`));
page.on('response', (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`,
    scriptsDir: `${ADDON_DIR}/resources/js`,
  });
  console.log('info build served from the working tree');
}

let builtOnServer = false;

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

  const before = await probeClass(preview, 'card');

  step('card is a built utility before anything happens', before.background === 'rgb(255, 0, 0)', JSON.stringify(before));

  // ── The tab ───────────────────────────────────────────────────────────
  await click(page, cp, '#__sve-toolbar button[data-tab="theme"]');
  step('panel opens', await waitFor(cp, (p) => !!document.querySelector(`${p} .sve-theme`), PANEL));
  await click(page, cp, `${PANEL} [data-sve-theme-tab="utilities"]`);
  step('the site\'s utilities are listed', await waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-utility]`).length >= 7, PANEL),
    await cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-utility]`)].map((e) => e.getAttribute('data-sve-utility')).join(' '), PANEL));
  step('card summarises its properties', await cp.evaluate((p) => /padding/.test(document.querySelector(`${p} [data-sve-utility="card"] .sve-theme__meta`)?.textContent || ''), PANEL));
  await shot(page, 'list');

  // ── Rewrite a built utility, watch the built stylesheet repaint ──────
  await click(page, cp, `${PANEL} [data-sve-utility="card"] .sve-theme__row`);
  step('its CSS opens in an editor', await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-utility="card"] [data-sve-utility-editor] .cm-content`), PANEL));
  await retypeBody(page, cp, 'padding: 3rem;\nbackground-color: rgb(1, 2, 3);');
  step('the preview repaints card from the draft', await waitFor(preview, () => {
    const el = document.createElement('div');

    el.className = 'card';
    document.body.append(el);

    const cs = getComputedStyle(el);
    const ok = cs.paddingTop === '48px' && cs.backgroundColor === 'rgb(1, 2, 3)';

    el.remove();

    return ok;
  }, undefined, 15000), JSON.stringify(await probeClass(preview, 'card')));
  step('other utilities in the layer are untouched', (await probeClass(preview, 'full-bleed')).background === 'rgba(0, 0, 0, 0)'
    && (await preview.evaluate(() => getComputedStyle(Object.assign(document.body.appendChild(document.createElement('div')), { className: 'full-bleed' })).width)) !== '');
  await shot(page, 'card-rewritten');

  // ── A brand-new utility styles an element the build never met ────────
  await click(page, cp, `${PANEL} [data-sve-utility-add]`);
  step('a fresh card opens with a name field', await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-utility-name]`), PANEL));
  await click(page, cp, `${PANEL} [data-sve-utility-name]`);
  await page.keyboard.type('testutil');
  await click(page, cp, `${PANEL} [data-sve-utility=""] [data-sve-utility-editor] .cm-content, ${PANEL} [data-sve-utility="testutil"] [data-sve-utility-editor] .cm-content`);
  await page.keyboard.type('outline: 4px solid rgb(4, 5, 6);', { delay: 5 });
  step('the new utility paints in the preview', await waitFor(preview, () => {
    const el = document.createElement('div');

    el.className = 'testutil';
    document.body.append(el);

    const ok = getComputedStyle(el).outlineWidth === '4px';

    el.remove();

    return ok;
  }, undefined, 15000), JSON.stringify(await probeClass(preview, 'testutil')));

  // ── Braces that do not pair up block the save ─────────────────────────
  // A lone `}` — typing `{` would just be auto-closed by the editor.
  await page.keyboard.press('Enter');
  await page.keyboard.type('}', { delay: 5 });
  // The element, not its text: with SVE_WORKTREE the strings are the installed PHP's.
  step('unbalanced braces are said', await waitFor(cp, (p) => !!document.querySelector(`${p} .sve-theme__utility-problem`), PANEL));
  await page.keyboard.press('Backspace');
  step('balanced again, the message goes', await waitFor(cp, (p) => !document.querySelector(`${p} .sve-theme__utility-problem`), PANEL));
  // A nested block, closed by the editor itself.
  await page.keyboard.type('&:hover {', { delay: 5 });
  await page.keyboard.press('Enter');
  await page.keyboard.type('opacity: .5;', { delay: 5 });

  // ── Save once ─────────────────────────────────────────────────────────
  const linkBefore = await preview.evaluate(() => document.querySelector('link[href*="/build/assets/"][href$=".css"], link[href*="/build/assets/"][href*=".css?"]')?.getAttribute('href') || '');

  await click(page, cp, `${PANEL} .sve-theme__save`);
  step('site.css has the rewritten card', await (async () => {
    const t0 = Date.now();

    while (Date.now() - t0 < 10000) {
      const css = readFileSync(CSS_FILE, 'utf8');

      if (/@utility card \{\n\s*padding: 3rem;\n\s*background-color: rgb\(1, 2, 3\);\n\}/.test(css)) {
        return true;
      }

      await sleep(200);
    }

    return false;
  })());

  const saved = readFileSync(CSS_FILE, 'utf8');

  step('site.css has the new utility after the last one', /@utility testutil \{\n\s*outline: 4px solid rgb\(4, 5, 6\);\n\s*&:hover \{\n\s*opacity: \.5;\n\s*\}\n\}/.test(saved));
  step('everything else in site.css is byte for byte the same', saved.replace(/@utility card \{[^]*?\n\}/, '').replace(/\n*@utility testutil \{[^]*?\n\}\n*/, '\n') === original.replace(/@utility card \{[^]*?\n\}/, '').replace(/\n*$/, '\n'));

  // The build after the save: a swapped <link>, or the note that says why not.
  const outcome = await (async () => {
    const t0 = Date.now();

    while (Date.now() - t0 < 20000) {
      const note = await cp.evaluate((p) => document.querySelector(`${p} [data-sve-utility-build-note]`)?.textContent || '', PANEL);

      if (note) {
        return { note };
      }

      // The frame as it is NOW — the handle from before the save can go stale
      // when the preview re-renders, and then reports the old link forever.
      const el = await cp.$('#live-preview-iframe');
      const now = el ? await el.contentFrame() : null;
      const link = now
        ? await now.evaluate(() => document.querySelector('link[href*="/build/assets/"][href$=".css"], link[href*="/build/assets/"][href*=".css?"]')?.getAttribute('href') || '').catch(() => '')
        : '';

      if (link && link !== linkBefore) {
        return { link };
      }

      await sleep(300);
    }

    return null;
  })();

  builtOnServer = !!outcome?.link;
  step('after the save the CSS is built (link swapped) or the note says why not', !!outcome, JSON.stringify(outcome));
  await shot(page, 'saved');

  await click(page, cp, `${PANEL} [data-sve-close]`);
  step('closes without asking once saved', await waitFor(cp, (p) => !document.querySelector(p), PANEL));
} catch (err) {
  step('ran to the end', false, err.message);
} finally {
  await browser.close();
  await sleep(2000);
  writeFileSync(CSS_FILE, original);
  await sleep(500);
  console.log(readFileSync(CSS_FILE, 'utf8') === original ? 'site.css put back as it was' : 'WARNING: site.css was NOT restored');

  // A server build ran against the test values: build once more from the restored file.
  if (builtOnServer) {
    const { execFileSync } = await import('node:child_process');

    try {
      execFileSync('npx', ['vite', 'build'], { cwd: SITE_DIR, stdio: 'ignore', timeout: 120000 });
      console.log('public/build rebuilt from the restored site.css');
    } catch {
      console.log('WARNING: public/build still holds the test values — run npm run build in the site');
    }
  }
}

// The build endpoint does not exist in an older installed PHP: that 404 is the note's path, not a failure.
const real = errors.filter((e) => !e.includes('site-css/build'));

step('no JS errors', real.length === 0, real.slice(0, 5).join(' | '));
process.exit(failed ? 1 : 0);
