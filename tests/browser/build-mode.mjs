#!/usr/bin/env node
/**
 * Build mode on the bench — what Content costs, and what the switch costs.
 *
 * The owner's bar for Build mode: with the flag off, or in Content, Live
 * Preview loads exactly as before and fetches 0 bytes of Build code; the
 * switch feels instant (< 100 ms once the chunk is in, no long task over
 * 50 ms); in Build the left column's field tree is not rendered, and
 * Statamic's hidden form stays mounted.
 *
 * So this test measures, on the same entry, every run:
 *
 *   1. Live Preview's first load, SVE_RUNS times in a fresh browser context:
 *      click → overlay open → toolbar → a section in the preview → network
 *      quiet; long tasks in the CP frame and the preview frame; the JS files
 *      and bytes the CP frame fetched; how many of them are Build files
 *      (manifest entries under resources/js/build-mode/ or a Build*.vue).
 *   2. When the top bar has the switch (`[data-sve-build-switch]`):
 *      Content → Build → Content, three times — the first pays for the
 *      chunk — measured in the CP frame from pointerdown to the panel drawn
 *      (`#__sve-build-panel` with content, the column marked
 *      `data-sve-build-away`) and back; long tasks inside each switch; in
 *      Build the selection panel is gone and the form's own nodes are still
 *      in the column, none of them `display: none`.
 *
 * Without the switch (today, or with the flag off) step 2 is skipped and
 * said so, unless SVE_EXPECT_SWITCH=1, which makes its absence a failure.
 * The last line is `BUILD-MODE-PERF {…}`, the numbers BASELINE.md quotes.
 *
 *   SVE_SITE_DIR / SVE_SITE_URL / SVE_USER / SVE_PASS / SVE_ENTRY   as in the smoke test
 *   SVE_RUNS            first loads to measure (default 3; the median is reported)
 *   SVE_EXPECT_SWITCH   1 = the switch must be there
 *   SVE_NO_SEED=1       do not touch the user's preference file (a remote site)
 *
 *   node tests/browser/build-mode.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const RUNS = Math.max(1, Number(env('SVE_RUNS', '3')));
const EXPECT_SWITCH = env('SVE_EXPECT_SWITCH', '') === '1';
const NO_SEED = env('SVE_NO_SEED', '') === '1';

/** The names brief #1 gives the switch, the panel's host and the column's mark. */
const SWITCH = '[data-sve-build-switch]';
const SWITCH_TO = (mode) => `${SWITCH} [data-sve-build-mode="${mode}"]`;
const PANEL_ID = '__sve-build-panel';
const AWAY_ATTR = 'data-sve-build-away';
const SELECTION_PANEL_ID = '__sve-selection-panel';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);

  return s.length ? (s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)) : null;
};

const results = [];
let failed = 0;
function step(name, ok, note = '') {
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${note ? ` — ${note}` : ''}`);
  console.log(results[results.length - 1]);
  if (!ok) failed++;
}
function info(name, note) {
  results.push(`info ${name} — ${note}`);
  console.log(results[results.length - 1]);
}

/** The Build files the installed build has, from its manifest — none before the chunk exists. */
function buildFiles() {
  const path = `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`;

  if (!existsSync(path)) {
    return new Set();
  }

  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  const files = new Set();

  for (const [src, entry] of Object.entries(manifest)) {
    if (/^resources\/js\/build-mode\//.test(src) || /\/surfaces\/Build[A-Z]\w*\.vue$/.test(src)) {
      files.add(entry.file.split('/').pop());
      (entry.css || []).forEach((css) => files.add(css.split('/').pop()));
    }
  }

  return files;
}

/** Same seeding as selection-panel.mjs: the left column shown, so Build has a column to take. */
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
function seed(prefs) {
  let yaml = readFileSync(USER_FILE, 'utf8').replace(/^ {2}sve_chrome:\n(?: {4}.*\n)*/m, '');

  if (prefs) {
    const block = `  sve_chrome:\n${Object.entries(prefs).map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }

  writeFileSync(USER_FILE, yaml);
}

/** Long tasks, recorded in every frame from its first script on. */
const LONG_TASKS = `
  window.__bmLong = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__bmLong.push([Math.round(e.startTime), Math.round(e.duration)]);
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}
`;

async function login(page) {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  // Statamic may answer the POST with 409 (Inertia version) — the session is set either way.
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}), page.keyboard.press('Enter')]);
  await sleep(500);
}

async function frameOf(page, selector) {
  const el = await page.$(selector);

  return el ? el.contentFrame() : null;
}

/** One first load: the clock starts at the click on the entry's own Live Preview button. */
async function measureLoad(context) {
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(LONG_TASKS);
  await login(page);
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1000);

  const t0 = Date.now();
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((el) => /^\s*live preview\s*$/i.test(el.textContent || ''));
    btn?.click();

    return !!btn;
  });

  if (!clicked) {
    return { error: 'no Live Preview button on the entry' };
  }

  const at = {};
  let cp = null;
  let preview = null;

  while (Date.now() - t0 < 45000 && !at.section) {
    if (!at.open && (await page.$('iframe.sve-edit-overlay[data-open]'))) at.open = Date.now() - t0;
    // Looked up again every round: the host may replace the iframe while it boots.
    if (!at.toolbar) cp = await frameOf(page, 'iframe.sve-edit-overlay[data-open]');
    if (cp && !at.open) at.open = Date.now() - t0;
    if (cp && !at.toolbar && (await cp.$('#__sve-toolbar button').catch(() => null))) at.toolbar = Date.now() - t0;
    if (cp) preview = await frameOf(cp, '#live-preview-iframe').catch(() => null);
    if (preview && (await preview.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false))) at.section = Date.now() - t0;
    if (!at.section) await sleep(25);
  }

  // Network quiet: the CP frame's resource list stops growing for two seconds;
  // the time is when its last response ended, on the same clock as the click.
  let count = -1;
  let stableSince = Date.now();
  while (cp && Date.now() - stableSince < 2000 && Date.now() - t0 < 60000) {
    const n = await cp.evaluate(() => performance.getEntriesByType('resource').length).catch(() => count);
    if (n !== count) {
      count = n;
      stableSince = Date.now();
    }
    await sleep(100);
  }
  at.quiet = cp
    ? await cp.evaluate((start) => Math.round(performance.timeOrigin + Math.max(0, ...performance.getEntriesByType('resource').map((e) => e.responseEnd)) - start), t0).catch(() => null)
    : null;

  const build = buildFiles();
  const cpFacts = cp
    ? await cp.evaluate((buildNames) => {
        const js = performance.getEntriesByType('resource').filter((e) => /\.js(\?|$)/.test(e.name));
        const names = js.map((e) => e.name.split('?')[0].split('/').pop());

        return {
          jsFiles: js.length,
          jsEncoded: js.reduce((s, e) => s + (e.encodedBodySize || 0), 0),
          jsDecoded: js.reduce((s, e) => s + (e.decodedBodySize || 0), 0),
          buildLoaded: names.filter((n) => buildNames.includes(n)),
          long: window.__bmLong || [],
        };
      }, [...build])
    : null;
  const pvLong = preview ? await preview.evaluate(() => window.__bmLong || []).catch(() => []) : [];

  return { at, cp: cpFacts, pvLong, page, cpFrame: cp, buildCount: build.size };
}

const longSummary = (tasks, from = 0) => {
  const hit = tasks.filter(([start]) => start >= from);

  return { count: hit.length, totalMs: hit.reduce((s, [, d]) => s + d, 0), longestMs: hit.reduce((m, [, d]) => Math.max(m, d), 0) };
};

/**
 * One switch, timed in the CP frame: pointerdown on the button → the
 * condition true on an animation frame. Clicked with the real mouse; the
 * overlay frame covers the page from 0,0, so its coordinates are the page's.
 */
async function timeSwitch(page, cp, mode) {
  const rect = await cp.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el?.getBoundingClientRect();

    return r && r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  }, SWITCH_TO(mode));

  if (!rect) {
    return { error: `no ${SWITCH_TO(mode)}` };
  }

  await cp.evaluate((m, panelId, away, selId) => {
    const done = () => {
      const col = document.querySelector('.live-preview-fields');
      const panel = document.getElementById(panelId);

      return m === 'build'
        ? !!(panel && panel.childElementCount && col?.hasAttribute(away))
        : !panel && !col?.hasAttribute(away);
    };

    window.__bmSwitch = new Promise((resolve) => {
      const btn = document.querySelector(`[data-sve-build-switch] [data-sve-build-mode="${m}"]`);
      btn.addEventListener('pointerdown', () => {
        const down = performance.now();
        let frames = 0;
        const tick = () => {
          frames++;
          if (done()) resolve({ ms: Math.round(performance.now() - down), frames, down: Math.round(down) });
          else if (performance.now() - down > 10000) resolve({ ms: null, frames, down: Math.round(down), timeout: true });
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, { once: true, capture: true });
    });
    void selId;
  }, mode, PANEL_ID, AWAY_ATTR, SELECTION_PANEL_ID);

  await page.mouse.click(rect.x, rect.y);
  const timed = await cp.evaluate(() => window.__bmSwitch);
  await sleep(150); // long tasks are reported after they end
  const long = longSummary(await cp.evaluate(() => window.__bmLong || []), timed.down);
  const column = await cp.evaluate((panelId, selId) => {
    const col = document.querySelector('.live-preview-fields');
    const others = col ? [...col.children].filter((el) => el.id !== panelId && el.id !== selId) : [];

    return {
      selectionPanel: !!document.getElementById(selId)?.childElementCount,
      formNodes: others.length,
      // The form, not Statamic's own empty placeholder beside it: the column
      // holds a bare `<div style="display: none">` in Content as well.
      formHiddenByDisplay: others.filter((el) => el.childElementCount > 0 && getComputedStyle(el).display === 'none').length,
    };
  }, PANEL_ID, SELECTION_PANEL_ID);

  return { ...timed, long, column };
}

if (!NO_SEED) seed({ 'sve-lp-panel-mode': 'show', 'sve-lp-collapsed': '0' });

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'] });
const perf = { entry: ENTRY, runs: [], switches: [] };
let last = null;

try {
  for (let i = 0; i < RUNS; i++) {
    const context = await browser.createBrowserContext();
    const run = await measureLoad(context);

    if (run.error) {
      step(`first load ${i + 1}`, false, run.error);
      await context.close();
      continue;
    }

    const cpLong = longSummary(run.cp?.long || []);
    const pvLong = longSummary(run.pvLong);
    perf.runs.push({ ...run.at, jsFiles: run.cp?.jsFiles, jsKB: Math.round((run.cp?.jsEncoded || 0) / 1024), jsDecodedKB: Math.round((run.cp?.jsDecoded || 0) / 1024), cpLong, pvLong, buildLoaded: run.cp?.buildLoaded || [] });
    info(`first load ${i + 1}`, `open ${run.at.open} ms, toolbar ${run.at.toolbar} ms, section ${run.at.section} ms, quiet ${run.at.quiet} ms; CP JS ${run.cp?.jsFiles} files ${Math.round((run.cp?.jsEncoded || 0) / 1024)} KB; long tasks CP ${cpLong.count}× ${cpLong.totalMs} ms (longest ${cpLong.longestMs}), preview ${pvLong.count}× ${pvLong.totalMs} ms`);
    step(`first load ${i + 1}: Content fetched no Build code`, !(run.cp?.buildLoaded || []).length, run.buildCount ? `${run.buildCount} Build files in the manifest, loaded: ${(run.cp?.buildLoaded || []).join(' ') || 'none'}` : 'no Build chunk in this build yet');

    if (last) await last.context.close();
    last = { context, page: run.page, cp: run.cpFrame };
  }

  const loads = perf.runs;
  perf.median = loads.length
    ? {
        open: median(loads.map((r) => r.open)),
        toolbar: median(loads.map((r) => r.toolbar)),
        section: median(loads.map((r) => r.section)),
        quiet: median(loads.map((r) => r.quiet)),
        jsFiles: median(loads.map((r) => r.jsFiles)),
        jsKB: median(loads.map((r) => r.jsKB)),
        cpLongMs: median(loads.map((r) => r.cpLong.totalMs)),
        cpLongest: median(loads.map((r) => r.cpLong.longestMs)),
        pvLongMs: median(loads.map((r) => r.pvLong.totalMs)),
      }
    : null;
  if (perf.median) info('first load, median', JSON.stringify(perf.median));

  // 2. The switch, on the last run's page.
  const hasSwitch = last?.cp ? !!(await last.cp.$(SWITCH).catch(() => null)) : false;

  if (!hasSwitch) {
    if (EXPECT_SWITCH) step('the top bar has the Content | Build switch', false, `no ${SWITCH}`);
    else info('switch', `no ${SWITCH} in the top bar (flag off or not wired yet) — switch not measured`);
  } else {
    for (let i = 0; i < 3; i++) {
      const toBuild = await timeSwitch(last.page, last.cp, 'build');
      const toContent = await timeSwitch(last.page, last.cp, 'content');
      perf.switches.push({ toBuild, toContent });
      const label = i === 0 ? 'first (chunk loads)' : `again (${i + 1})`;
      info(`Content → Build ${label}`, JSON.stringify(toBuild));
      info(`Build → Content ${label}`, JSON.stringify(toContent));

      if (toBuild.error || toContent.error) {
        step(`switch ${label}`, false, toBuild.error || toContent.error);
        break;
      }

      step(`Build ${label}: the field tree is not rendered`, !toBuild.column.selectionPanel, `selection panel drawn=${toBuild.column.selectionPanel}`);
      step(`Build ${label}: Statamic's form stays in the column, never display:none`, toBuild.column.formNodes > 0 && toBuild.column.formHiddenByDisplay === 0, JSON.stringify(toBuild.column));

      if (i > 0) {
        step(`switch ${label}: < 100 ms both ways`, toBuild.ms !== null && toBuild.ms < 100 && toContent.ms !== null && toContent.ms < 100, `→Build ${toBuild.ms} ms, →Content ${toContent.ms} ms`);
        step(`switch ${label}: no long task > 50 ms`, toBuild.long.longestMs <= 50 && toContent.long.longestMs <= 50, `longest →Build ${toBuild.long.longestMs} ms, →Content ${toContent.long.longestMs} ms`);
      }
    }
  }
} catch (e) {
  step('no exception', false, e.stack || e.message);
} finally {
  await browser.close();
  if (!NO_SEED) seed(null);
}

console.log(`BUILD-MODE-PERF ${JSON.stringify(perf)}`);
process.exit(failed ? 1 : 0);
