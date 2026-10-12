// The live-reload button on a front-end page, without a site: PHP renders the
// button exactly as InjectLiveReload\Widget does, the page and the poll are
// answered by this script. It proves what the button does with each answer —
// reload on new markup or a new build, amber while building, red with the
// build's words when it failed, nothing while the editor overlay is open,
// silence when switched off, a slow check when signed out. Seconds, no login.
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

/** What the server holds now: the page is rendered with it, the poll answers it. */
const server = { markup: 'm1', build: 'b1', building: false, error: null, status: 200 };
let polls = 0;
let pages = 0;

function pageHtml() {
  pages++;
  return `<!doctype html><html><head><style id="sve-noanim"></style></head><body><main>Page ${pages}</main>${
    widget.replace('MARKUP_SIG', server.markup).replace('BUILD_SIG', server.build)
  }</body></html>`;
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
  const warnings = [];
  page.on('console', (msg) => { if (msg.type() === 'warn') warnings.push(msg.text()); });

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== ORIGIN) return request.abort();
    if (url.pathname === '/!/sve/live-reload') {
      polls++;
      if (server.status !== 200) return request.respond({ status: server.status, body: '' });
      return request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ markup: server.markup, build: server.build, building: server.building, error: server.error }),
      });
    }
    return request.respond({ status: 200, contentType: 'text/html', body: pageHtml() });
  });

  const state = () => page.$eval('#sve-live-reload', (b) => b.getAttribute('data-state'));
  const title = () => page.$eval('#sve-live-reload', (b) => b.title);
  const mark = () => page.evaluate(() => { window.__sameDocument = true; });
  const sameDocument = () => page.evaluate(() => window.__sameDocument === true);

  await page.goto(`${ORIGIN}/about`);
  await mark();
  await sleep(2300);
  check('polls about once a second', polls >= 2 && polls <= 3, `${polls} polls in 2.3 s`);
  check('green when nothing changed', (await state()) === 'on');
  check('no reload when nothing changed', await sameDocument());

  server.building = true;
  await sleep(1200);
  check('amber while the server builds', (await state()) === 'building');
  check('a build alone does not reload', await sameDocument());

  server.building = false;
  server.error = { reason: 'failed', output: '\u001b[31mCssSyntaxError: site.css:12:3: Unclosed block\u001b[39m' };
  await sleep(1200);
  check('red when the build failed', (await state()) === 'error');
  const tip = await title();
  check('the tooltip says why, in the build\'s words', tip.includes('theme_utilities_reason_failed') && tip.includes('Unclosed block') && !tip.includes('\u001b'), JSON.stringify(tip));
  check('the console has the output once', warnings.filter((w) => w.includes('Unclosed block')).length === 1, `${warnings.length} warnings`);
  server.error = null;

  // A template saved on the server.
  server.markup = 'm2';
  await page.waitForNavigation({ timeout: 3000 }).catch(() => {});
  check('new markup reloads the page', !(await sameDocument()) && (await page.$eval('main', (m) => m.textContent)) !== 'Page 1');
  check('the reload asks the <head> script to skip entrance animations', (await page.evaluate(() => sessionStorage.getItem('sve-noanim'))) === '1');
  await mark();
  await sleep(2200);
  check('the reloaded page carries the new markup — no loop', await sameDocument());

  // The build wrote new CSS.
  server.build = 'b2';
  await page.waitForNavigation({ timeout: 3000 }).catch(() => {});
  check('a new build reloads the page', !(await sameDocument()));
  await mark();

  // The editor overlay is open: a Live Preview session must not be torn down.
  await page.evaluate(() => document.documentElement.classList.add('sve-editing'));
  let before = polls;
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
  await sleep(1300);
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
