#!/usr/bin/env node
/**
 * The Publish-static icon in the Live Preview top bar, in a real editor, with
 * real mouse clicks.
 *
 * NOTHING IS PUBLISHED. Every call to the other addon's utility routes is
 * answered inside this browser: `POST publish` never reaches the server, so
 * no copy is generated and nothing is sent to Cloudflare. `GET state` is
 * answered with a script the run steps through — static site, then a run in
 * flight, then a finished one — which is also the only way to see the end of
 * a publish without waiting half a minute for a real one.
 *
 * Checks, in order:
 *   1. the icon is SEEN — laid out, with a size, not merely in the DOM (the
 *      trap this top bar has sprung before: an unknown button is hidden by
 *      isOurLpChromeButton and measures as “present”);
 *   2. it sits right of the reload icon;
 *   3. a real click starts it: the icon spins and the step shows in its title;
 *   4. when the run ends, the card carries the live address as a real link;
 *   5. a site set to Server draws no icon at all.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/static-publish-button.mjs
 *
 * Same env as live-preview-smoke.mjs.
 */
import { createRequire } from 'node:module';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SHOTS = env('SVE_SHOTS', '');

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let failed = 0;
const step = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const PUBLISH = '#__sve-lp-static-publish';
const RELOAD = '#__sve-lp-reload';
const CARD = '#__sve-static-publish-card';
const LIVE_URL = 'https://vizuall-demo.vizuall.workers.dev';

/**
 * What `GET state` answers next. The run script is changed from here between
 * steps; `publishPosts` counts the POSTs that were caught, which is the proof
 * that none went to the server.
 */
const fake = {
  mode: 'static',
  running: null,
  runs: [{ id: 'run-0', kind: 'publish', status: 'live', step: 'done', url: LIVE_URL, duration: 21, report: { pages: 10, files: 142, bytes: 1, ok: true, errors: [], warnings: [], external_hosts: [], excluded: [] }, error: null, version_id: 'v0', user: 'Terminal', started_at: 1, finished_at: 2 }],
};
let publishPosts = 0;

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();

await page.setRequestInterception(true);
page.on('request', (req) => {
  const url = req.url();

  if (!url.includes('/utilities/static-publish/')) {
    return void req.continue();
  }

  if (url.endsWith('/publish') || url.endsWith('/rollback')) {
    publishPosts++;

    return void req.respond({ status: 200, contentType: 'application/json', body: '{"started":true}' });
  }

  if (url.endsWith('/state')) {
    return void req.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        settings: { mode: fake.mode, worker_name: 'vizuall-demo', workers_subdomain: 'vizuall', live_url: LIVE_URL, credentials: true, settings_url: '/cp/addons', nightly: false, nightly_at: '03:00', forms: { enabled: true, cms_origin: '', problem: null } },
        running: fake.running,
        runs: fake.runs,
      }),
    });
  }

  // The utility PAGE itself is never opened by this run; anything else under
  // that prefix would be a call this test does not know about — fail loudly
  // rather than let it reach the server.
  errors.push(`unexpected static-publish call: ${req.method()} ${url}`);

  return void req.respond({ status: 500, body: '{}' });
});

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 500 && !r.url().includes('/utilities/static-publish/') && errors.push(`HTTP ${r.status()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

/** Is it on screen: laid out, with a size — not just in the DOM. */
const seen = (frame, selector) => frame.evaluate((sel) => {
  const el = document.querySelector(sel);

  if (!el) {
    return false;
  }

  const b = el.getBoundingClientRect();

  return getComputedStyle(el).display !== 'none'
    && getComputedStyle(el).visibility !== 'hidden'
    && b.width > 0 && b.height > 0;
}, selector);

async function pointIn(frame, selector) {
  const r = await frame.evaluate((sel) => {
    const el = document.querySelector(sel);

    if (!el) {
      return null;
    }

    const b = el.getBoundingClientRect();

    return b.width > 0 ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null;
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

  await page.mouse.click(x, y);
}

async function waitFor(frame, fn, arg, ms = 12000) {
  const t0 = Date.now();

  while (Date.now() - t0 < ms) {
    if (await frame.evaluate(fn, arg).catch(() => false)) {
      return true;
    }

    await sleep(100);
  }

  return false;
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
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });
  await sleep(2000);

  return cp;
}

const shot = async (name) => SHOTS && page.screenshot({ path: `${SHOTS}/static-publish-${name}.png` });

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()));
  errors.length = 0;

  // ---- 1. the icon is drawn, and SEEN ------------------------------------
  let cp = await openLivePreview(page);

  step('icon in the DOM', await waitFor(cp, (sel) => !!document.querySelector(sel), PUBLISH));
  step('icon is SEEN (size + display), not merely present', await seen(cp, PUBLISH));
  await shot('idle');

  // ---- 2. right of reload -------------------------------------------------
  const order = await cp.evaluate((p, r) => {
    const pub = document.querySelector(p);
    const rel = document.querySelector(r);

    if (!pub || !rel) {
      return null;
    }

    return {
      sameParent: pub.parentElement === rel.parentElement,
      after: rel.compareDocumentPosition(pub) & Node.DOCUMENT_POSITION_FOLLOWING ? true : false,
      gap: Math.round(pub.getBoundingClientRect().left - rel.getBoundingClientRect().right),
    };
  }, PUBLISH, RELOAD);

  step('right of the reload icon', !!order && order.sameParent && order.after, order ? `gap ${order.gap}px` : 'one of them missing');

  // The order is enforced on every pass — it must still hold after several.
  await sleep(3000);
  step('still right of reload after several passes', await cp.evaluate((p, r) => {
    const pub = document.querySelector(p);
    const rel = document.querySelector(r);

    return !!pub && !!rel && pub.previousElementSibling === rel;
  }, PUBLISH, RELOAD));

  // ---- 3. a real click starts it ------------------------------------------
  // The run the fake server will report while it is "in flight".
  fake.running = { id: 'run-1', kind: 'publish', status: 'running', step: 'generating', url: null, duration: null, report: null, version_id: null, error: null, user: 'Terminal', started_at: 3, finished_at: null };

  await click(page, cp, PUBLISH);

  step('POST publish was caught here, not sent', publishPosts === 1, `${publishPosts} caught`);
  step('icon spins while it runs', await waitFor(cp, (sel) => document.querySelector(sel)?.hasAttribute('data-busy'), PUBLISH));

  // The step shows in the title, in the CP user's language.
  fake.running.step = 'deploying';
  step('the step shows in the title', await waitFor(cp, (sel) => /cloudflare/i.test(document.querySelector(sel)?.title || ''), PUBLISH, 8000),
    await cp.evaluate((sel) => document.querySelector(sel)?.title || '', PUBLISH));
  await shot('running');

  // ---- 4. the finished run's address --------------------------------------
  fake.running = null;
  fake.runs = [{ ...fake.runs[0], id: 'run-1', status: 'live', url: LIVE_URL, duration: 21 }];

  step('the card appears when it is done', await waitFor(cp, (sel) => !!document.querySelector(sel), CARD));
  step('the card is SEEN', await seen(cp, CARD));
  step('it carries the live address as a real link', await cp.evaluate((sel, url) => {
    const link = document.querySelector(`${sel} a[href]`);

    return !!link && link.href.startsWith(url) && link.target === '_blank';
  }, CARD, LIVE_URL));
  step('the icon stops spinning', !(await cp.evaluate((sel) => document.querySelector(sel)?.hasAttribute('data-busy'), PUBLISH)));
  await shot('done');

  // Polling must stop once the run is over — a timer left running would keep
  // asking the server for as long as the editor is open.
  const before = publishPosts;
  let stateCalls = 0;
  const count = (r) => r.url().endsWith('/utilities/static-publish/state') && stateCalls++;

  page.on('response', count);
  await sleep(6000);
  page.off('response', count);
  step('polling stopped when the run ended', stateCalls === 0, `${stateCalls} calls in 6 s`);
  step('still no publish sent', publishPosts === before);

  // ---- 5. a Server site draws nothing -------------------------------------
  fake.mode = 'server';
  cp = await openLivePreview(page);
  await sleep(3000);
  step('no icon when the site is set to Server', !(await cp.$(PUBLISH)));
  await shot('server-mode');

  step('no console or page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
} catch (error) {
  step('run', false, error.message);
} finally {
  await browser.close();
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
