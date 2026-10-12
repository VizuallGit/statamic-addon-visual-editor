#!/usr/bin/env node
/**
 * The AI panel's queue and model picker, in a real Live Preview, with real
 * clicks and real answers.
 *
 * Picks a model and finds it kept after a reload. Asks something long; while
 * it answers, queues two more with Enter, takes one out with ×, and sends the
 * other with "Send now" — the long answer stops, the queued question is
 * answered. Queues a question behind another and sees it asked on its own when
 * the first is answered. Stops an answer and sees the queue wait until "Send
 * now". Write mode throughout: nothing on disk is touched.
 *
 *   SVE_SITE_DIR=<copy> SVE_SITE_URL=http://127.0.0.1:8791 SVE_PASS='…' \
 *     node tests/browser/ai-queue.mjs
 *
 * Runs against a site whose installed addon is this build (a copy of the site
 * with the working tree in its vendor folder): the queue is PHP as much as JS.
 * Asks the Cursor agent about six times (costs a little).
 */
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SHOTS = env('SVE_SHOTS', '');
const MODEL = env('SVE_AI_MODEL', 'composer-2.5');
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
const LONG = 'Count from 1 to 400, one number per line, nothing else. Do not read or edit any files.';
const word = (w) => `Reply with the single word ${w} and nothing else. Do not read or edit any files.`;

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

const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/ai-queue-${name}.png` });

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

async function openAi(page, cp) {
  await sleep(1500);

  if (!(await cp.$(`${PANEL} [data-sve-ai-tabs]`))) {
    await waitFor(cp, () => !!document.querySelector('#__sve-toolbar button[data-tab="ai"]'), null, 15000);
    await click(page, cp, '#__sve-toolbar button[data-tab="ai"]');
  }

  return waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-ai-tab]`).length > 0, PANEL, 15000);
}

/** Types into the box and presses Enter — the way a question is sent or queued. */
async function ask(page, cp, text) {
  await click(page, cp, `${PANEL} [data-sve-ai-draft]`);
  await page.keyboard.type(text, { delay: 1 });
  await page.keyboard.press('Enter');
}

const rows = (cp) => cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-ai-row]`)].map((row) => ({
  role: row.dataset.sveAiRow,
  stopped: row.classList.contains('is-stopped'),
  text: row.textContent.trim(),
})), PANEL);
const queued = (cp) => cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-ai-queued]`)].map((row) => ({
  text: row.querySelector('[data-sve-ai-queued-edit]')?.textContent.trim() || '',
  ready: !row.querySelector('[data-sve-ai-send-now]')?.disabled,
})), PANEL);
const waiting = (cp) => cp.evaluate((p) => !!document.querySelector(`${p} [data-sve-ai-wait]`), PANEL);
const serverChat = (cp, id) => cp.evaluate(async (tab) => (await (await fetch(`/!/sve/ai-tabs/${tab}`, { headers: { Accept: 'application/json' } })).json()).chat, id);
const answered = (cp, w) => waitFor(cp, ([p, needle]) => [...document.querySelectorAll(`${p} [data-sve-ai-row="assistant"]`)].some((row) => row.textContent.trim().toUpperCase().includes(needle)), [PANEL, w], ANSWER_MS);
const runners = () => {
  try {
    return Number(execSync('pgrep -f "scripts/[c]ursor-agent.mjs" | wc -l').toString().trim());
  } catch {
    return 0;
  }
};

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 160)} ${m.location()?.url || ''}`));
page.on('response', (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

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
  step('the AI panel opens', await openAi(page, cp));

  // Write mode: the agent can change nothing.
  await click(page, cp, `${PANEL} [data-sve-ai-mode]`, 0);
  await click(page, cp, `${PANEL} [data-sve-ai-tab-add]`);
  await sleep(800);
  tab = await cp.evaluate((p) => document.querySelector(`${p} .sve-ai__tab.is-active`)?.dataset.sveAiTab || '', PANEL);
  step('a new chat', !!tab, tab);

  // ── The model ───────────────────────────────────────────────────────────
  const options = await cp.evaluate((p) => [...document.querySelectorAll(`${p} [data-sve-ai-model] option`)].map((o) => o.value), PANEL);

  step('the picker lists the account\'s models, with the default first', options[0] === '' && options.includes('composer-2.5') && options.some((id) => id.startsWith('grok-')), `${options.length} options, e.g. ${options.slice(1, 5).join(', ')}`);
  await cp.select(`${PANEL} [data-sve-ai-model]`, MODEL);
  await sleep(800);
  cp = await openLivePreview(page);
  await openAi(page, cp);
  const kept = await waitFor(cp, ([p, id]) => document.querySelector(`${p} [data-sve-ai-model]`)?.value === id, [PANEL, MODEL]);

  step('the model picked is kept after a reload', kept, kept ? '' : JSON.stringify(await cp.evaluate((p) => {
    const select = document.querySelector(`${p} [data-sve-ai-model]`);

    return { value: select?.value, options: select?.options.length, selected: select?.selectedIndex };
  }, PANEL)));
  step('and by the server, for that chat', (await serverChat(cp, tab)).model === MODEL);

  // ── Queue while it answers; × one, "Send now" the other ─────────────────
  await ask(page, cp, LONG);
  step('the first question is being answered', await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-ai-wait]`), PANEL));
  step('while it answers, the button queues', /kø|queue/i.test(await cp.evaluate((p) => document.querySelector(`${p} [data-sve-ai-send]`)?.textContent || '', PANEL)));

  await ask(page, cp, word('TWO'));
  await ask(page, cp, word('THREE'));
  step('Enter while it answers queues the questions', await waitFor(cp, (p) => {
    const items = [...document.querySelectorAll(`${p} [data-sve-ai-queued] [data-sve-ai-send-now]`)];

    return items.length === 2 && items.every((b) => !b.disabled);
  }, PANEL));
  step('they are not in the chat yet', (await rows(cp)).filter((r) => r.role === 'user').length === 1);
  await shot(page, 'queued');

  await click(page, cp, `${PANEL} [data-sve-ai-queued-remove]`, 1);
  step('× takes one out', await waitFor(cp, (p) => document.querySelectorAll(`${p} [data-sve-ai-queued]`).length === 1, PANEL));
  step('on the server too', (await serverChat(cp, tab)).queue.length === 1);

  await click(page, cp, `${PANEL} [data-sve-ai-send-now]`, 0);
  step('"Send now" stops the long answer', await waitFor(cp, (p) => !!document.querySelector(`${p} .sve-ai__row.is-stopped`), PANEL));
  step('and asks the queued question', await answered(cp, 'TWO'));
  step('the queue is empty', (await queued(cp)).length === 0 && (await serverChat(cp, tab)).queue.length === 0);
  step('the long answer never landed', !(await rows(cp)).some((r) => r.role === 'assistant' && /\b150\b/.test(r.text)));
  await sleep(1500);
  step('no agent is left running', runners() === 0, `${runners()} running`);

  // ── Queued behind an answer: asked on its own ───────────────────────────
  await ask(page, cp, word('FOUR'));
  await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-ai-wait]`), PANEL);
  await ask(page, cp, word('FIVE'));
  step('FOUR is answered', await answered(cp, 'FOUR'));
  step('FIVE is asked and answered after it without a click', await answered(cp, 'FIVE'));

  const order = (await rows(cp)).filter((r) => r.role === 'assistant' && !r.stopped).map((r) => r.text.toUpperCase());

  step('in order', order.findIndex((t) => t.includes('FOUR')) < order.findIndex((t) => t.includes('FIVE')), order.slice(-3).join(' | '));

  // ── Stop: the queue waits ───────────────────────────────────────────────
  await ask(page, cp, LONG);
  await waitFor(cp, (p) => !!document.querySelector(`${p} [data-sve-ai-wait]`), PANEL);
  await ask(page, cp, word('SEVEN'));
  await waitFor(cp, (p) => [...document.querySelectorAll(`${p} [data-sve-ai-send-now]`)].some((b) => !b.disabled), PANEL);
  await click(page, cp, `${PANEL} [data-sve-ai-stop]`);
  step('Stop ends the answer', await waitFor(cp, (p) => !document.querySelector(`${p} [data-sve-ai-wait]`), PANEL));
  await sleep(5000);
  step('the queued question waits — not asked by itself', (await queued(cp)).length === 1 && !(await waiting(cp)));
  step('no agent is left running after Stop', runners() === 0, `${runners()} running`);
  await shot(page, 'stopped');

  await click(page, cp, `${PANEL} [data-sve-ai-send-now]`, 0);
  step('"Send now" asks it', await answered(cp, 'SEVEN'));

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
