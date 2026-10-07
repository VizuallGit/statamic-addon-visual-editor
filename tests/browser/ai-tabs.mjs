#!/usr/bin/env node
/**
 * The AI panel's tabs, in a real Live Preview, with real mouse clicks.
 *
 * Nothing written to the AI may be lost to a reload: opens a new tab, types,
 * adds an image, reloads — the draft and the image are still in the box. Types
 * one more word and reloads at once — the word is still there (the beacon).
 * Asks about the image for real and gets an answer that saw it. Asks again and
 * reloads while the agent is working — the question is there, the tab is
 * waiting, and the answer arrives on its own. Closes the tab — the chat is gone
 * from the server.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' SVE_WORKTREE=1 \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/ai-tabs.mjs
 *
 * Asks the Cursor agent twice (costs a little). Needs the AI panel on and a
 * Cursor key. Same env as theme-fonts.mjs.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
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
const ANSWER_MS = Number(env('SVE_AI_WAIT_MS', '180000'));

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let failed = 0;
const step = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const PANEL = '#__sve-ai-panel';

/** A 64×64 PNG of one color, to ask the agent about. */
function solidPng(path, [r, g, b]) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;

    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;

    return c >>> 0;
  });
  const crc = (buf) => {
    let c = 0xffffffff;

    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);

    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    const sum = Buffer.alloc(4);
    const body = Buffer.concat([Buffer.from(type), data]);

    len.writeUInt32BE(data.length);
    sum.writeUInt32BE(crc(body));

    return Buffer.concat([len, body, sum]);
  };
  const size = 64;
  const head = Buffer.alloc(13);

  head.writeUInt32BE(size, 0);
  head.writeUInt32BE(size, 4);
  head.set([8, 2, 0, 0, 0], 8);

  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: size }, () => [r, g, b]).flat())]);
  const raw = Buffer.concat(Array.from({ length: size }, () => row));

  writeFileSync(path, Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', head), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}

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

    await sleep(200);
  }

  return false;
}

const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/ai-tabs-${name}.png` });

async function openLivePreview(page) {
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click());
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });

  return cp;
}

/** The AI panel, opened unless it came back open by itself. */
async function openAi(page, cp) {
  await sleep(1500);

  if (!(await cp.$(`${PANEL} [data-sve-ai-tabs]`))) {
    await waitFor(cp, () => !!document.querySelector('#__sve-toolbar button[data-tab="ai"]'), null, 15000);
    await click(page, cp, '#__sve-toolbar button[data-tab="ai"]');
  }

  return waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-ai-tab]`).length > 0, PANEL, 15000);
}

const activeTab = (cp) => cp.evaluate((p) => document.querySelector(`${p} .sve-ai__tab.is-active`)?.dataset.sveAiTab || '', PANEL);
const draftText = (cp) => cp.evaluate((p) => document.querySelector(`${p} [data-sve-ai-draft]`)?.value ?? null, PANEL);
const draftImageCount = (cp) => cp.evaluate((p) => document.querySelectorAll(`${p} [data-sve-ai-draft-images] img[src*="/images/"]`).length, PANEL);
const assistantRows = (cp) => cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-ai-row="assistant"]`)].map((row) => row.textContent.trim()), PANEL);

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
// The deliberate look-up of a closed chat answers 404; that one is the test's own.
page.on('console', (m) => m.type() === 'error' && !(/404/.test(m.text()) && /\/ai-tabs\/[a-z0-9]+$/.test(m.location()?.url || '')) && errors.push(`console: ${m.text().slice(0, 160)} ${m.location()?.url || ''}`));
// A request cut off by the reload is the point of this test, not a failure.
page.on('response', (r) => r.status() >= 400 && !(r.status() === 404 && r.url().includes('/ai-tabs/')) && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`,
    scriptsDir: `${ADDON_DIR}/resources/js`,
  });
  console.log('info build served from the working tree');
}

const red = join(mkdtempSync(join(tmpdir(), 'sve-ai-')), 'red.png');

solidPng(red, [220, 20, 60]);

let tab = '';
let cp = null;

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()));
  errors.length = 0;

  cp = await openLivePreview(page);
  step('the AI panel opens with its tabs', await openAi(page, cp));

  // ── A new tab, a draft and an image ─────────────────────────────────────
  const before = await cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-ai-tab]`)].map((t) => t.dataset.sveAiTab), PANEL);

  await click(page, cp, `${PANEL} [data-sve-ai-tab-add]`);
  await waitFor(cp, ([p, ids]) => {
    const on = document.querySelector(`${p} .sve-ai__tab.is-active`)?.dataset.sveAiTab;

    return on && !ids.includes(on);
  }, [PANEL, before]);
  tab = await activeTab(cp);
  step('+ opens a new tab', !!tab && !before.includes(tab), tab);

  await click(page, cp, `${PANEL} [data-sve-ai-draft]`);
  await page.keyboard.type('Sve test: hvilken farve?', { delay: 5 });
  await (await cp.$(`${PANEL} [data-sve-ai-file]`)).uploadFile(red);
  step('an added image lands in the box', await waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-ai-draft-images] img[src*="/images/"]`).length === 1, PANEL));
  await shot(page, 'draft');
  await sleep(1200);

  // ── Reload: nothing is lost ─────────────────────────────────────────────
  cp = await openLivePreview(page);
  await openAi(page, cp);
  step('after a reload the same tab is open', (await activeTab(cp)) === tab, await activeTab(cp));
  step('the draft is still in the box', (await draftText(cp)) === 'Sve test: hvilken farve?', JSON.stringify(await draftText(cp)));
  step('so is the image', (await draftImageCount(cp)) === 1);

  // ── Reload straight after typing: the beacon keeps the last word ────────
  await click(page, cp, `${PANEL} [data-sve-ai-draft]`);
  await page.keyboard.press('End');
  await page.keyboard.type(' X', { delay: 5 });
  cp = await openLivePreview(page);
  await openAi(page, cp);
  step('a word typed just before the reload is kept', (await draftText(cp)) === 'Sve test: hvilken farve? X', JSON.stringify(await draftText(cp)));

  // ── Ask about the image for real ────────────────────────────────────────
  await click(page, cp, `${PANEL} [data-sve-ai-draft]`);
  await page.keyboard.down('Meta');
  await page.keyboard.press('a');
  await page.keyboard.up('Meta');
  await page.keyboard.type('What single color fills the attached image? Answer with one lowercase word only. Do not read or edit any files.', { delay: 2 });
  await click(page, cp, `${PANEL} .sve-ai__form button[type="submit"]`);
  step('the question shows with its image', await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-ai-row="user"] img[data-sve-ai-sent-image]`), PANEL));
  step('the box is empty again', (await draftText(cp)) === '' && (await draftImageCount(cp)) === 0);
  await waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-ai-row="assistant"]`).length > 0, PANEL, ANSWER_MS);

  const first = await assistantRows(cp);

  step('the agent saw the image', /red|crimson/i.test(first[0] || ''), first[0]);
  await shot(page, 'answer');

  // ── Reload while the agent works: the answer still arrives ──────────────
  await click(page, cp, `${PANEL} [data-sve-ai-draft]`);
  await page.keyboard.type('Reply with the single word OK. Do not read or edit any files.', { delay: 2 });
  await click(page, cp, `${PANEL} .sve-ai__form button[type="submit"]`);
  await sleep(1500);
  cp = await openLivePreview(page);
  await openAi(page, cp);
  step('after a reload mid-answer the question is there', await waitFor(cp, (p) => [...document.querySelectorAll(`${p} [data-sve-ai-row="user"]`)].some((row) => row.textContent.includes('single word OK')), PANEL));
  step('and the tab is still waiting', !!(await cp.$(`${PANEL} [data-sve-ai-wait]`)) || (await assistantRows(cp)).length === 2);
  await waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-ai-row="assistant"]`).length === 2, PANEL, ANSWER_MS);

  const second = await assistantRows(cp);

  step('the answer arrives by itself', /ok/i.test(second[1] || ''), second[1]);
  await shot(page, 'after-reload');

  // ── × deletes the chat ──────────────────────────────────────────────────
  await click(page, cp, `${PANEL} [data-sve-ai-tab="${tab}"] [data-sve-ai-tab-close]`);
  step('× closes the tab', await waitFor(cp, ([p, id]) => !document.querySelector(`${p} [data-sve-ai-tab="${id}"]`), [PANEL, tab]));

  const gone = await cp.evaluate(async (id) => (await fetch(`/!/sve/ai-tabs/${id}`, { headers: { Accept: 'application/json' } })).status, tab);

  step('the closed chat is gone from the server', gone === 404, String(gone));
  tab = '';

  step('no JS errors or failed requests', errors.length === 0, errors.slice(0, 6).join(' | '));
} catch (err) {
  step('run', false, err.message);
  errors.slice(0, 6).forEach((line) => console.log(`info ${line}`));
  await shot(page, 'error');
} finally {
  if (tab && cp) {
    await cp.evaluate(async (id) => fetch(`/!/sve/ai-tabs/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '', Accept: 'application/json' } }), tab).catch(() => {});
  }

  await browser.close();
}

console.log(failed ? `\n${failed} failed` : '\nall ok');
process.exit(failed ? 1 : 0);
