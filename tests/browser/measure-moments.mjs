#!/usr/bin/env node
/**
 * What each moment of an editing session costs: the bytes fetched (split by
 * who owns them) and the long tasks, per moment, so a clean-up can prove it
 * made nothing heavier. Quality pass, phase 0 (docs/kvalitetsrunde-brief.md
 * in the site, §0.2).
 *
 * Moments, in one session, on one entry:
 *
 *   entry    the entry opens in the CP, Live Preview closed
 *   lp       the Live Preview button → overlay open, toolbar, a section in
 *            the preview, network quiet
 *   build    the Content | Build switch → Build's panel drawn, network quiet
 *   dock     the toolbar's code button → the dock drawn, network quiet
 *   public   the same page on the public site, in a fresh browser context
 *            (no session): no Visual Editor file may load there
 *
 * Bytes are counted from the network (CDP), every frame of the tab: the CP,
 * the overlay that holds the CP again, and the preview inside it. A moment
 * owns what was requested between its start and its quiet point. "ve" is
 * /vendor/visual-editor/ and /!/sve/, "statamic" is /vendor/statamic/, "site"
 * is the site's own /build/. Encoded bytes: on a server that compresses,
 * these are the wire bytes; on `php artisan serve` they equal the file size.
 *
 *   SVE_SITE_DIR / SVE_SITE_URL / SVE_USER / SVE_PASS / SVE_ENTRY   as in the smoke test
 *   SVE_PUBLIC   public path of the entry (default /test-ny)
 *   SVE_RUNS     sessions to measure; the median is reported (default 3)
 *   SVE_NO_SEED=1  do not touch the user's preference file (a remote site)
 *
 * The last line is `MOMENTS {…}`: medians per moment.
 *
 *   node tests/browser/measure-moments.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const PUBLIC = env('SVE_PUBLIC', '/test-ny');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const RUNS = Math.max(1, Number(env('SVE_RUNS', '3')));
const NO_SEED = env('SVE_NO_SEED', '') === '1';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (xs) => {
  const s = xs.filter((x) => typeof x === 'number').sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);

  return s.length ? (s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)) : null;
};

const owner = (url) => {
  if (/\/vendor\/visual-editor\/|\/!\/sve\//.test(url)) return 've';
  if (/\/vendor\/statamic\//.test(url)) return 'statamic';
  if (/\/build\/assets\//.test(url)) return 'site';

  return 'other';
};

/** Same seed as build-mode.mjs: the left column shown, so every run starts in one layout. */
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
function seed(prefs) {
  let yaml = readFileSync(USER_FILE, 'utf8').replace(/^ {2}sve_chrome:\n(?: {4}.*\n)*/m, '');
  const block = `  sve_chrome:\n${Object.entries(prefs)
    .map(([k, v]) => `    ${k}: '${String(v).replaceAll("'", "''")}'\n`)
    .join('')}`;
  yaml = /^preferences:\n/m.test(yaml)
    ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`)
    : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  writeFileSync(USER_FILE, yaml);
}

/** Long tasks in every document of the tab, on the wall clock. */
const LONG_TASKS = `
  window.__mmLong = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__mmLong.push([Math.round(performance.timeOrigin + e.startTime), Math.round(e.duration)]);
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}
`;

/** Every finished request of the tab: url, CDP resource type, encoded bytes, wall-clock start. */
async function trackNetwork(page) {
  const cdp = await page.createCDPSession();
  const pending = new Map();
  const done = [];
  let lastActivity = Date.now();

  await cdp.send('Network.enable');
  cdp.on('Network.requestWillBeSent', (e) => {
    pending.set(e.requestId, { url: e.request.url, type: e.type, t: Math.round(e.wallTime * 1000) });
    lastActivity = Date.now();
  });
  cdp.on('Network.loadingFinished', (e) => {
    const req = pending.get(e.requestId);
    if (req) done.push({ ...req, bytes: e.encodedDataLength });
    pending.delete(e.requestId);
    lastActivity = Date.now();
  });
  cdp.on('Network.loadingFailed', (e) => {
    pending.delete(e.requestId);
    lastActivity = Date.now();
  });

  return {
    done,
    /** Network quiet: nothing started or ended for `ms`; long polls do not count. */
    async quiet(ms = 1500, max = 30000) {
      const t0 = Date.now();
      while (Date.now() - t0 < max) {
        const open = [...pending.values()].filter((r) => !/live-reload|\/poll|presence|heartbeat/.test(r.url));
        if (!open.length && Date.now() - lastActivity >= ms) return Date.now();
        await sleep(100);
      }

      return Date.now();
    },
  };
}

async function longTasks(page, from, to) {
  const all = [];
  for (const f of page.frames()) {
    all.push(...(await f.evaluate(() => window.__mmLong || []).catch(() => [])));
  }
  const hit = all.filter(([start]) => start >= from && start <= to);

  return {
    count: hit.length,
    totalMs: hit.reduce((s, [, d]) => s + d, 0),
    longestMs: hit.reduce((m, [, d]) => Math.max(m, d), 0),
  };
}

function bytes(net, from, to) {
  const out = {
    files: 0,
    kb: 0,
    ve: { js: 0, css: 0 },
    statamic: { js: 0, css: 0 },
    site: { js: 0, css: 0 },
    other: { js: 0, css: 0 },
  };
  for (const r of net.done) {
    if (r.t < from || r.t > to) continue;
    out.files++;
    out.kb += r.bytes / 1024;
    const kind = r.type === 'Script' ? 'js' : r.type === 'Stylesheet' ? 'css' : null;
    if (kind) out[owner(r.url)][kind] += r.bytes / 1024;
  }
  const round = (o) =>
    Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'number' ? Math.round(v) : round(v)]));

  return round(out);
}

const inFrame = async (page, selector) => {
  const el = await page.$(selector);

  return el ? el.contentFrame() : null;
};

async function waitFor(fn, max = 45000) {
  const t0 = Date.now();
  while (Date.now() - t0 < max) {
    if (await fn().catch(() => false)) return Date.now();
    await sleep(25);
  }

  return null;
}

async function clickIn(page, frame, selector) {
  const rect = await frame.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.getBoundingClientRect().width > 0);
    const r = el?.getBoundingClientRect();

    return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  }, selector);
  if (!rect) return false;
  let x = rect.x;
  let y = rect.y;
  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const box = await (await f.frameElement()).boundingBox();
    x += box.x;
    y += box.y;
  }
  await page.mouse.click(x, y);

  return true;
}

async function session(browser) {
  // Every session from the same layout: the editor keeps Build, the dock and
  // the device in the user's preferences, so run N+1 would start where N ended.
  if (!NO_SEED && existsSync(USER_FILE)) seed({ 'sve-lp-panel-mode': 'show', 'sve-lp-collapsed': '0' });

  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(LONG_TASKS);

  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  // Statamic may answer the POST with 409 (Inertia version); the session is set either way.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
    page.keyboard.press('Enter'),
  ]);
  await sleep(500);

  const net = await trackNetwork(page);
  const out = {};
  const moment = async (name, act) => {
    const from = Date.now();
    const result = await act();
    const to = await net.quiet();
    out[name] = {
      ms: result?.ready ? result.ready - from : null,
      quietMs: to - from,
      ...bytes(net, from - 50, to),
      long: await longTasks(page, from, to),
      note: result?.note,
    };
  };

  await moment('entry', async () => {
    await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'domcontentloaded' });
    const ready = await waitFor(async () => !!(await page.$('button')));

    return {
      ready,
      note: (await page.$('iframe.sve-edit-overlay[data-open]')) ? 'Live Preview opened by itself' : undefined,
    };
  });

  let cp = null;
  await moment('lp', async () => {
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((el) =>
        /^\s*live preview\s*$/i.test(el.textContent || '')
      );
      btn?.click();

      return !!btn;
    });
    if (!clicked) return { note: 'no Live Preview button' };
    const ready = await waitFor(async () => {
      cp = await inFrame(page, 'iframe.sve-edit-overlay[data-open]');
      const preview = cp ? await inFrame(cp, '#live-preview-iframe') : null;

      return !!(
        cp &&
        (await cp.$('#__sve-toolbar button')) &&
        preview &&
        (await preview.evaluate(() => !!document.querySelector('[id^="id-"]')))
      );
    });

    return { ready };
  });
  await page.keyboard.press('Escape');

  await moment('build', async () => {
    if (!cp || !(await clickIn(page, cp, '[data-sve-build-switch] [data-sve-build-mode="visual"]')))
      return { note: 'no Build switch' };
    const ready = await waitFor(
      async () => !!(await cp.evaluate(() => document.getElementById('__sve-build-panel')?.childElementCount))
    );

    return { ready };
  });

  // In Build the dock has no toolbar icon: the bar's dock tool shows it (build-switch.js).
  await moment('dock', async () => {
    if (!cp || !(await clickIn(page, cp, '[data-sve-build-tool="dock"]')))
      return { note: 'no dock tool in the Build bar' };
    const ready = await waitFor(
      async () =>
        !!(await cp.evaluate(() => {
          const dock = document.getElementById('__sve-code-dock');

          return (
            document.documentElement.hasAttribute('data-sve-build-dock-shown') &&
            dock &&
            dock.getBoundingClientRect().height > 0
          );
        })),
      20000
    );

    return { ready, note: ready ? undefined : 'dock did not draw within 20 s' };
  });

  await context.close();

  // The public page, as a visitor: a fresh context, no CP session.
  const visitor = await browser.createBrowserContext();
  const pub = await visitor.newPage();
  await pub.setViewport({ width: 1440, height: 900 });
  await pub.evaluateOnNewDocument(LONG_TASKS);
  const pubNet = await trackNetwork(pub);
  const from = Date.now();
  await pub.goto(`${SITE_URL}${PUBLIC}`, { waitUntil: 'load' });
  const to = await pubNet.quiet();
  const veFiles = pubNet.done.filter((r) => owner(r.url) === 've').map((r) => r.url.replace(SITE_URL, ''));
  out.public = { quietMs: to - from, ...bytes(pubNet, from - 50, to), long: await longTasks(pub, from, to), veFiles };
  await visitor.close();

  return out;
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'] });
const runs = [];
try {
  for (let i = 0; i < RUNS; i++) {
    const run = await session(browser);
    runs.push(run);
    for (const [name, m] of Object.entries(run)) {
      console.log(
        `info run ${i + 1} ${name.padEnd(6)} ready ${m.ms ?? '-'} ms, quiet ${m.quietMs} ms; ${m.files} files ${m.kb} KB; JS ve ${m.ve.js} / statamic ${m.statamic.js} / site ${m.site.js} KB; CSS ve ${m.ve.css} / statamic ${m.statamic.css} / site ${m.site.css} KB; long ${m.long.count}× ${m.long.totalMs} ms (longest ${m.long.longestMs})${m.note ? ' — ' + m.note : ''}${m.veFiles?.length ? ' — VE FILES ON PUBLIC: ' + m.veFiles.join(' ') : ''}`
      );
    }
  }
} finally {
  await browser.close();
}

const names = Object.keys(runs[0] || {});
const pick = (name, get) => median(runs.map((r) => (r[name] ? get(r[name]) : null)));
const summary = Object.fromEntries(
  names.map((name) => [
    name,
    {
      readyMs: pick(name, (m) => m.ms),
      quietMs: pick(name, (m) => m.quietMs),
      files: pick(name, (m) => m.files),
      kb: pick(name, (m) => m.kb),
      veJsKB: pick(name, (m) => m.ve.js),
      veCssKB: pick(name, (m) => m.ve.css),
      statamicJsKB: pick(name, (m) => m.statamic.js),
      siteJsKB: pick(name, (m) => m.site.js),
      siteCssKB: pick(name, (m) => m.site.css),
      longMs: pick(name, (m) => m.long.totalMs),
      longestMs: pick(name, (m) => m.long.longestMs),
    },
  ])
);
const publicVe = runs.reduce((n, r) => n + (r.public?.veFiles?.length || 0), 0);
console.log(
  `${publicVe ? 'FAIL' : 'ok  '} public page loads no Visual Editor file — ${publicVe} in ${runs.length} runs`
);
console.log(`MOMENTS ${JSON.stringify({ entry: ENTRY, runs: runs.length, summary })}`);
process.exit(publicVe ? 1 : 0);
