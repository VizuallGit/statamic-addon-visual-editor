// The live-reload button on a front-end page, without a site: PHP renders the
// button exactly as InjectLiveReload\Widget does, the page and the poll are
// answered by this script. It proves what the button does with each answer —
// reload on new markup or a new build, amber while building, red with the
// build's words when it failed, nothing while the editor overlay is open,
// silence when switched off, a slow check when signed out — and how it asks:
// with the signatures it holds, so the server can hold the request until one
// differs (LiveReload::await), again at once after each answer, never faster
// than every 100 ms. Seconds, no login.
//
//   node tests/browser/live-reload.mjs
//   SVE_PHP_BOOTSTRAP=<file> node tests/browser/live-reload.mjs   # a worktree's src
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const BOOTSTRAP = process.env.SVE_PHP_BOOTSTRAP || `${ADDON}/vendor/autoload.php`;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ORIGIN = 'https://live-reload.test';

// Laravel's helpers define __() only when it is missing; this one answers the key.
const widget = execFileSync('php', ['-r', `
    function __($key) { return $key === 'sve::messages.live_reload_error' ? 'failed: :reason' : $key; }
    require ${JSON.stringify(BOOTSTRAP)};
    echo MarioHamann\\StatamicVisualEditor\\Http\\Middleware\\InjectLiveReload\\Widget::html(['markup' => 'MARKUP_SIG', 'build' => 'BUILD_SIG']);
`], { encoding: 'utf8' });

if (!widget.includes('id="sve-live-reload"')) throw new Error('PHP did not render the button:\n' + widget);

/**
 * What the server holds now: the page is rendered with it, the poll answers
 * it. Like LiveReload::await, a poll that names both signatures is held until
 * the markup or the build differs, or HOLD_MS is over; `hold: false` answers
 * every poll at once, the way a server without the hold would.
 */
const HOLD_MS = 1000; // the real hold is 3 s; shorter keeps the run short
const server = { markup: 'm1', build: 'b1', building: false, error: null, status: 200, hold: true };
let polls = 0;
let pages = 0;
const asked = []; // { at, url } per poll

function pageHtml() {
  pages++;
  return `<!doctype html><html><head><style id="sve-noanim"></style></head><body><main>Page ${pages}</main>${
    widget.replace('MARKUP_SIG', server.markup).replace('BUILD_SIG', server.build)
  }</body></html>`;
}

function answerPoll(request, url) {
  const respond = (response) => request.respond(response).catch(() => {}); // the page may have left
  if (server.status !== 200) return respond({ status: server.status, body: '' });

  const have = { markup: url.searchParams.get('markup'), build: url.searchParams.get('build') };
  const named = have.markup !== null && have.build !== null;
  const until = Date.now() + (named && server.hold ? HOLD_MS : 0);

  const look = () => {
    const changed = server.markup !== have.markup || server.build !== have.build;
    if (!named || changed || Date.now() >= until) {
      return respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          markup: server.markup, build: server.build, building: server.building, error: server.error, own: false, css: null,
        }),
      });
    }
    setTimeout(look, 20);
  };
  look();
}

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME });

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const warnings = [];
  page.on('console', (msg) => { if (msg.type() === 'warn') warnings.push(msg.text()); });

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== ORIGIN) return request.abort();
    if (url.pathname === '/!/sve/live-reload') {
      polls++;
      asked.push({ at: Date.now(), url });
      return answerPoll(request, url);
    }
    return request.respond({ status: 200, contentType: 'text/html', body: pageHtml() });
  });

  const state = () => page.$eval('#sve-live-reload', (b) => b.getAttribute('data-state'));
  const title = () => page.$eval('#sve-live-reload', (b) => b.title);
  const mark = () => page.evaluate(() => { window.__sameDocument = true; });
  const sameDocument = () => page.evaluate(() => window.__sameDocument === true);
  /** Sets the server's markup or build and measures until the page has reloaded. */
  async function changeAndTime(key, value) {
    const navigation = page.waitForNavigation({ timeout: 3000 }).catch(() => null);
    const start = Date.now();
    server[key] = value;
    const done = await navigation;
    return done ? Date.now() - start : null;
  }

  await page.goto(`${ORIGIN}/about`);
  await mark();

  // Top left, level with "Rediger" at the top right.
  const box = await page.$eval('#sve-live-reload', (b) => {
    const r = b.getBoundingClientRect();
    const cs = getComputedStyle(b);
    return { left: r.left, top: r.top, right: r.right, width: innerWidth, cssLeft: cs.left, cssTop: cs.top, cssRight: cs.right };
  });
  check('sits at the top left: left 1rem, top 1rem', box.cssLeft === '16px' && box.cssTop === '16px' && box.left === 16 && box.top === 16, JSON.stringify(box));
  check('…and not on the right, where Rediger is', box.right < box.width / 2, `right edge at ${box.right}px of ${box.width}px`);

  await sleep(2300);
  const first = asked[0]?.url;
  check('the poll names the signatures the page holds', first?.searchParams.get('markup') === 'm1' && first?.searchParams.get('build') === 'b1', first ? first.search : 'no poll');
  const gaps = asked.slice(1).map((a, i) => a.at - asked[i].at);
  check('a held poll is asked again as soon as it is answered', polls >= 2 && polls <= 3 && gaps.every((g) => g >= HOLD_MS - 20 && g < HOLD_MS + 200), `${polls} polls in 2.3 s, gaps ${gaps.join(', ')} ms`);
  check('green when nothing changed', (await state()) === 'on');
  check('no reload when nothing changed', await sameDocument());

  // A server that answers at once (no hold) is not asked in a loop. The poll
  // held when the switch happens runs out first.
  server.hold = false;
  await sleep(HOLD_MS + 100);
  let before = polls;
  await sleep(1000);
  check('a server that answers at once is asked at most every 100 ms', polls - before >= 7 && polls - before <= 11, `${polls - before} polls in 1 s`);
  server.hold = true;
  await sleep(200);

  server.building = true;
  await sleep(HOLD_MS + 300);
  check('amber while the server builds', (await state()) === 'building');
  check('a build alone does not reload', await sameDocument());

  server.building = false;
  server.error = { reason: 'failed', output: '\u001b[31mCssSyntaxError: site.css:12:3: Unclosed block\u001b[39m' };
  await sleep(HOLD_MS + 300);
  check('red when the build failed', (await state()) === 'error');
  const tip = await title();
  check('the tooltip says why, in the build\'s words', tip.includes('theme_utilities_reason_failed') && tip.includes('Unclosed block') && !tip.includes('\u001b'), JSON.stringify(tip));
  check('the console has the output once', warnings.filter((w) => w.includes('Unclosed block')).length === 1, `${warnings.length} warnings`);
  server.error = null;
  await sleep(HOLD_MS + 300);

  // A template saved on the server, while a poll is held.
  const markupMs = await changeAndTime('markup', 'm2');
  check('new markup reloads the page within a moment, not at the next poll', markupMs !== null && markupMs < 500 && !(await sameDocument()) && (await page.$eval('main', (m) => m.textContent)) !== 'Page 1', `${markupMs} ms from the save to the reloaded page`);
  check('the reload asks the <head> script to skip entrance animations', (await page.evaluate(() => sessionStorage.getItem('sve-noanim'))) === '1');
  await mark();
  await sleep(2200);
  check('the reloaded page carries the new markup — no loop', await sameDocument());
  const latest = asked[asked.length - 1].url;
  check('…and asks with it', latest.searchParams.get('markup') === 'm2', latest.search);

  // The build wrote new CSS.
  const buildMs = await changeAndTime('build', 'b2');
  check('a new build reloads the page', buildMs !== null && buildMs < 500 && !(await sameDocument()), `${buildMs} ms`);
  await mark();

  // The editor overlay is open: a Live Preview session must not be torn down.
  await page.evaluate(() => document.documentElement.classList.add('sve-editing'));
  before = polls;
  server.markup = 'm3';
  await sleep(2300);
  check('no poll while the editor overlay is open', polls === before, `${polls - before} polls`);
  check('no reload while the editor overlay is open', await sameDocument());
  await page.evaluate(() => document.documentElement.classList.remove('sve-editing'));
  await page.waitForNavigation({ timeout: 3000 }).catch(() => {});
  check('closing the overlay catches up', !(await sameDocument()));
  await mark();

  // Switched off in this browser.
  await sleep(1200);
  await page.click('#sve-live-reload');
  check('a click switches it off', (await state()) === 'off');
  before = polls;
  server.markup = 'm4';
  await sleep(2300);
  check('off: no polls', polls === before, `${polls - before} polls`);
  check('off: no reload', await sameDocument());
  check('off is remembered', (await page.evaluate(() => localStorage.getItem('sve-live-reload'))) === 'off');
  await page.click('#sve-live-reload');
  await page.waitForNavigation({ timeout: 3000 }).catch(() => {});
  check('switched on again, it catches up', !(await sameDocument()));
  await mark();

  // Signed out, or no longer allowed: grey, and only a slow check after that.
  server.status = 403;
  await sleep(HOLD_MS + 300);
  before = polls;
  await sleep(2300);
  check('refused: grey and quiet', (await state()) === 'signedout' && polls === before, `${polls - before} polls`);
  check('refused: the tooltip says signed out', (await title()) === 'sve::messages.live_reload_signedout');
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
