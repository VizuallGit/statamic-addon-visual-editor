/**
 * Budgets per moment (quality pass, phase 5): how much editor JS a moment
 * fetches and how long it holds the main thread, so a clean-up can prove it made
 * nothing heavier, and a new feature cannot quietly make Live Preview or Build
 * slower. The baseline is quality-baseline/moments.json.
 *
 *   lp      the Live Preview button → overlay, toolbar and every section; network quiet
 *   build   the first Content → Build switch → Build's panel drawn; network quiet
 *   dock    Build's dock tool → the dock on screen; network quiet
 *   typing  a heading edited in place, at a person's pace → the form holds the text; network quiet
 *
 * A moment may fetch 5 % more editor JS than its baseline: bytes are the same on
 * every run. Its long tasks may add half again, and at least 100 ms: they move
 * with the machine. Bytes are counted from the network (CDP) in every frame of
 * the tab, as tests/browser/measure-moments.mjs counts them; on the bench
 * (php artisan serve, no compression) they are the file sizes of the build the
 * bench runs.
 *
 *   SVE_MOMENTS_UPDATE=1 npm run e2e -- moments   writes the lower numbers, never a higher one
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { OBSERVE_LONG_TASKS, longTaskSummary } from './long-tasks.mjs';
import { ENTRY, leaveBuild, openLivePreview, publicSectionCount, resetLayout, settledLayout } from './support.mjs';

const FILE = join(import.meta.dirname, '../../quality-baseline/moments.json');
const UPDATE = process.env.SVE_MOMENTS_UPDATE === '1';
const EDITOR = /\/vendor\/visual-editor\/|\/!\/sve\//;
/** Requests that stay open by design, so a moment's quiet does not wait for them. */
const POLLS = /live-reload|\/poll|presence|heartbeat/;
const QUIET_MS = 1500;
const JS_SLACK = 1.05;
const LONG_SLACK = 1.5;
const LONG_FLOOR_MS = 100;

// The numbers depend on the layout (a dock or a tab left open costs more), so it is the reset one.
test.beforeEach(() => settledLayout());
test.afterEach(async ({ page }) => {
  await leaveBuild(page);
  resetLayout();
});

/** Every request of the tab, as CDP reports it: url, type, wall-clock start, encoded bytes. */
async function trackNetwork(page) {
  const cdp = await page.context().newCDPSession(page);
  const open = new Map();
  const net = { done: [], last: Date.now(), open };

  await cdp.send('Network.enable');
  cdp.on('Network.requestWillBeSent', (e) => {
    open.set(e.requestId, { url: e.request.url, type: e.type, t: e.wallTime * 1000 });
    net.last = Date.now();
  });
  cdp.on('Network.loadingFinished', (e) => {
    const request = open.get(e.requestId);
    if (request) net.done.push({ ...request, bytes: e.encodedDataLength });
    open.delete(e.requestId);
    net.last = Date.now();
  });
  cdp.on('Network.loadingFailed', (e) => {
    open.delete(e.requestId);
    net.last = Date.now();
  });

  return net;
}

const quiet = (net) => ![...net.open.values()].some((r) => !POLLS.test(r.url)) && Date.now() - net.last >= QUIET_MS;

/** Run `act`, wait for the network to go quiet, and say what the moment cost. */
async function moment(page, net, act) {
  const from = Date.now();
  await act();
  await expect.poll(() => quiet(net), { timeout: 30_000, intervals: [100] }).toBe(true);
  const to = Date.now();

  const scripts = net.done.filter((r) => r.t >= from - 50 && r.t <= to && r.type === 'Script' && EDITOR.test(r.url));
  const long = [];
  // A frame can go away while it is read (the preview reloads); its tasks are reported by the others too.
  for (const frame of page.frames())
    long.push(...(await frame.evaluate(() => window.__longTasks || []).catch(() => [])));
  const tasks = longTaskSummary(long, from, to);

  return {
    veJsKB: Math.round(scripts.reduce((sum, r) => sum + r.bytes, 0) / 1024),
    longMs: tasks.totalMs,
    longTasks: tasks.count,
  };
}

const readBaseline = () => (existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {});

function within(name, now) {
  console.log(`moment ${name}: ${JSON.stringify(now)}`);

  if (UPDATE) {
    const all = readBaseline();
    const was = all[name];
    all[name] = was
      ? Object.fromEntries(Object.entries(now).map(([key, value]) => [key, Math.min(value, was[key] ?? value)]))
      : now;
    writeFileSync(
      FILE,
      `${JSON.stringify(Object.fromEntries(Object.entries(all).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`
    );

    return;
  }

  const base = readBaseline()[name];
  expect(base, `${name} has no budget yet: run with SVE_MOMENTS_UPDATE=1`).toBeTruthy();
  expect.soft(now.veJsKB, `${name}: editor JS fetched (KB)`).toBeLessThanOrEqual(Math.ceil(base.veJsKB * JS_SLACK));
  expect
    .soft(now.longMs, `${name}: long tasks (ms)`)
    .toBeLessThanOrEqual(Math.max(Math.ceil(base.longMs * LONG_SLACK), base.longMs + LONG_FLOOR_MS));
}

test('Live Preview, the first switch to Build and the dock stay within their budgets', async ({ page }) => {
  await page.addInitScript(OBSERVE_LONG_TASKS);
  const sections = await publicSectionCount();
  const net = await trackNetwork(page);
  await page.goto(ENTRY);
  // The entry's own loading is not a moment here: measure-moments.mjs has it, and it is Statamic's.
  // The CP fetches the Live Preview shell when it is idle after boot (addon.js), sometimes after the
  // network has gone quiet once; the moment starts when it is here.
  await expect.poll(() => net.done.some((r) => /\/lp-cluster-[\w-]+\.js/.test(r.url)), { timeout: 30_000 }).toBe(true);
  await expect.poll(() => quiet(net), { timeout: 30_000, intervals: [100] }).toBe(true);

  let cp = null;
  within(
    'lp',
    await moment(page, net, async () => {
      ({ cp } = await openLivePreview(page, sections, { navigate: false }));
    })
  );

  within(
    'build',
    await moment(page, net, async () => {
      await cp.locator('[data-sve-build-switch] [data-sve-build-mode="visual"]').click();
      await expect(cp.locator('#__sve-build-panel > *').first()).toBeAttached();
    })
  );

  // Build remembers whether the dock was shown, and a test before may have left it on
  // (build-dock.spec.mjs reads the tool the same way): hidden first, then the moment shows it.
  const dock = cp.locator('[data-sve-build-tool="dock"]');
  const shown = cp.locator('html[data-sve-build-dock-shown]');
  if ((await dock.getAttribute('aria-pressed')) === 'true') {
    await dock.click();
    await expect(shown).toHaveCount(0);
    await expect.poll(() => quiet(net), { timeout: 30_000, intervals: [100] }).toBe(true);
  }

  within(
    'dock',
    await moment(page, net, async () => {
      await dock.click();
      await expect(shown).toHaveCount(1);
      await expect(cp.locator('#__sve-code-dock')).toBeVisible();
    })
  );

  // Hidden again, so the layout this page sends as it closes has the dock off.
  await dock.click();
  await expect(shown).toHaveCount(0);
});

test('typing a heading in place stays within its budget', async ({ page }) => {
  await page.addInitScript(OBSERVE_LONG_TASKS);
  const net = await trackNetwork(page);
  const { cp, preview } = await openLivePreview(page, await publicSectionCount());
  await expect.poll(() => quiet(net), { timeout: 30_000, intervals: [100] }).toBe(true);
  const heading = preview.locator('h1[data-sid-inline-edit], h2[data-sid-inline-edit]').first();
  const added = ' budget';

  await heading.dblclick();
  await expect
    .poll(() => heading.evaluate((el) => el.isContentEditable || !!el.querySelector('[contenteditable="true"]')))
    .toBe(true);
  await page.keyboard.press('End');

  within(
    'typing',
    await moment(page, net, async () => {
      await page.keyboard.type(added, { delay: 80 });
      await expect(
        cp.locator('#__sve-selection-panel .ProseMirror').filter({ hasText: added.trim() }).first()
      ).toBeAttached();
    })
  );
});
