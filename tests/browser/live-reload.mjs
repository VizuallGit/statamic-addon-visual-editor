// The live-reload button on a front-end page, without a site: PHP renders the
// button exactly as InjectLiveReload\Widget does, the page and the poll are
// answered by this script, the page runs the site's own Alpine and the
// addon's built live-reload-morph.js. It proves what the button does with each
// answer — new markup morphed into the standing page (scroll, an open Alpine
// menu, the edit button and what scripts appended all stay; head styles
// swapped; no script runs twice), a reload when it cannot be a morph (a new
// build, another script or <head> style tag, a page without </body>, no morph), amber while
// building, red with the build's words when it failed, nothing while the
// editor overlay is open, silence when switched off, a slow check when signed
// out — and how it asks: with the signatures it holds, so the server can hold
// the request until one differs (LiveReload::await), again at once after each
// answer, never faster than every 100 ms. Seconds, no login.
//
//   node tests/browser/live-reload.mjs
//   SVE_PHP_BOOTSTRAP=<file> node tests/browser/live-reload.mjs   # a worktree's src
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const BOOTSTRAP = process.env.SVE_PHP_BOOTSTRAP || `${ADDON}/vendor/autoload.php`;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ORIGIN = 'https://live-reload.test';
const ALPINE = readFileSync(`${SITE}/node_modules/alpinejs/dist/cdn.min.js`, 'utf8');
const MORPH_FILE = JSON.parse(readFileSync(`${ADDON}/resources/dist/build/manifest.json`, 'utf8'))['resources/js/live-reload-morph.js'].file;
const MORPH_URL = `/!/sve/build/${MORPH_FILE}`;
const MORPH = readFileSync(`${ADDON}/resources/dist/build/${MORPH_FILE}`, 'utf8');

// Laravel's helpers define __() only when it is missing; this one answers the key.
const widget = execFileSync('php', ['-r', `
    function __($key) { return $key === 'sve::messages.live_reload_error' ? 'failed: :reason' : $key; }
    require ${JSON.stringify(BOOTSTRAP)};
    echo MarioHamann\\StatamicVisualEditor\\Http\\Middleware\\InjectLiveReload\\Widget::html(['markup' => 'MARKUP_SIG', 'build' => 'BUILD_SIG'], ${JSON.stringify(MORPH_URL)});
`], { encoding: 'utf8' });

if (!widget.includes('id="sve-live-reload"')) throw new Error('PHP did not render the button:\n' + widget);

/**
 * What the server holds now: the page is rendered with it, the poll answers
 * it. Like LiveReload::await, a poll that names both signatures is held until
 * the markup or the build differs, or HOLD_MS is over; `hold: false` answers
 * every poll at once, the way a server without the hold would.
 */
const HOLD_MS = 1000; // the real hold is 3 s; shorter keeps the run short
const server = {
  markup: 'm1', build: 'b1', building: false, error: null, status: 200, hold: true,
  // The page: its head style's colour, a script a template pushed, a page
  // answered without </body> once, the morph asset missing.
  color: 'rgb(0, 0, 0)', style: '', script: '', truncate: false, morphStatus: 200,
};
let polls = 0;
let pages = 0;
let morphAsked = 0;
const asked = []; // { at, url } per poll

// As a site sends it: the edit button after the live-reload button (the outer
// middleware writes last), a script inside a section, Alpine deferred.
function pageHtml() {
  pages++;
  const html = `<!doctype html><html><head><style id="sve-noanim"></style><style>main h1 { color: ${server.color}; }</style>${server.style}${server.script}<script defer src="/alpine.js"></script></head><body class="site">
<header x-data="{ open: false }" style="padding: 5rem"><button id="menu" type="button" @click="open = !open">Menu</button><nav id="nav" x-show="open">Nav</nav></header>
<main><h1>Page ${pages}</h1><script>window.__runs = (window.__runs || 0) + 1;</script><section id="kept"><p>Kept</p></section><div style="height: 4000px"></div></main>
<footer>Footer</footer>
${widget.replace('MARKUP_SIG', server.markup).replace('BUILD_SIG', server.build)}
<a id="sve-edit-button" href="/cp">Rediger</a><style>#sve-edit-button { position: fixed; right: 0; top: 0; }</style><script>document.getElementById('sve-edit-button').setAttribute('data-ready', '');</script>
</body></html>`;
  if (server.truncate) { server.truncate = false; return html.slice(0, html.indexOf('</body>')); }
  return html;
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
    if (url.pathname === '/alpine.js') return request.respond({ status: 200, contentType: 'text/javascript', body: ALPINE });
    if (url.pathname === MORPH_URL) {
      morphAsked++;
      return request.respond(server.morphStatus === 200
        ? { status: 200, contentType: 'text/javascript', body: MORPH }
        : { status: server.morphStatus, body: '' });
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
  /** Sets the server's markup or build and measures until `ready` holds in the page. */
  async function changeAndWait(key, value, ready) {
    const start = Date.now();
    server[key] = value;
    const done = await page.waitForFunction(ready, { timeout: 3000, polling: 'mutation' }).catch(() => null);
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

  // A template saved on the server, while a poll is held: the page's new HTML
  // is morphed in. The menu is open and the page scrolled; a script appended
  // a node after the buttons, the way the editor's overlay does.
  await page.click('#menu');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('nav')).display !== 'none');
  await page.evaluate(() => {
    // A script filled a section, as Cuben's dialog section does with x-effect.
    document.querySelector('#kept p').textContent = 'Filled by a script';
    document.querySelector('#kept').setAttribute('data-open', '');
    window.scrollTo(0, 900);
    const node = document.createElement('div');
    node.id = 'appended-by-a-script';
    document.body.appendChild(node);
  });
  const headerBefore = await page.evaluateHandle(() => document.querySelector('header'));
  check('the morph is fetched once the button is on, before any save', morphAsked === 1, `${morphAsked} requests`);
  const pagesBefore = pages;
  const scrollBefore = await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(window.scrollY)))));
  const morphMs = await changeAndWait('markup', 'm2', () => document.querySelector('main h1').textContent !== 'Page 1');
  check('new markup is morphed in within a moment, not at the next poll', morphMs !== null && morphMs < 500, `${morphMs} ms from the save to the new heading`);
  check('…in the standing page: no reload', await sameDocument());
  check('…with the new page\'s HTML', (await page.$eval('main h1', (h) => h.textContent)) === `Page ${pagesBefore + 1}`);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  check('the scroll position stays', scrollBefore > 800 && scrollAfter === scrollBefore, `scrollY ${scrollBefore} → ${scrollAfter}`);
  check('the open Alpine menu stays open', await page.$eval('#nav', (n) => getComputedStyle(n).display !== 'none'));
  check('an unchanged element is not touched', await page.evaluate((h) => h === document.querySelector('header') && h.isConnected, headerBefore));
  check('…nor an unchanged section beside the changed heading, in the same <main>', await page.$eval('#kept', (s) => s.hasAttribute('data-open') && s.textContent === 'Filled by a script'));
  check('what a script appended stays', await page.evaluate(() => !!document.getElementById('appended-by-a-script')));
  check('the edit button keeps what its script set', await page.$eval('#sve-edit-button', (a) => a.hasAttribute('data-ready')));
  check('a script inside the morphed section does not run again', (await page.evaluate(() => window.__runs)) === 1, `ran ${await page.evaluate(() => window.__runs)} times`);
  check('green again after the morph', (await state()) === 'on');
  check('one button, one edit button', (await page.evaluate(() => document.querySelectorAll('#sve-live-reload').length + ',' + document.querySelectorAll('#sve-edit-button').length)) === '1,1');
  await sleep(HOLD_MS + 300);
  check('the morphed page holds the new markup — no loop', await sameDocument() && pages === pagesBefore + 1, `${pages - pagesBefore} page requests`);
  const latest = asked[asked.length - 1].url;
  check('…and asks with it', latest.searchParams.get('markup') === 'm2', latest.search);

  // A style in <head> changed with the template.
  server.color = 'rgb(255, 0, 0)';
  await changeAndWait('markup', 'm3', () => getComputedStyle(document.querySelector('main h1')).color === 'rgb(255, 0, 0)');
  check('a changed <head> style is swapped in, without a reload', await sameDocument() && (await page.evaluate(() => getComputedStyle(document.querySelector('main h1')).color)) === 'rgb(255, 0, 0)');
  check('…and the old one is gone', (await page.evaluate(() => [...document.head.querySelectorAll('style')].filter((s) => s.textContent.includes('main h1')).length)) === 1);

  // A new <style> tag in <head>: its place in the cascade is the server's to say.
  server.style = '<style>footer { color: rgb(0, 0, 255); }</style>';
  const styleMs = await changeAndTime('markup', 'm3b');
  check('a new <head> style tag reloads the page', styleMs !== null && !(await sameDocument()) && (await page.$eval('footer', (f) => getComputedStyle(f).color)) === 'rgb(0, 0, 255)', `${styleMs} ms`);
  await mark();
  await sleep(1200);

  // A template pushed a script: a morph runs none, so the page reloads.
  server.script = '<script>window.__pushed = true;</script>';
  const scriptMs = await changeAndTime('markup', 'm4');
  check('a new script reloads the page', scriptMs !== null && !(await sameDocument()) && (await page.evaluate(() => window.__pushed)) === true, `${scriptMs} ms`);
  check('the reload asks the <head> script to skip entrance animations', (await page.evaluate(() => sessionStorage.getItem('sve-noanim'))) === '1');
  await mark();

  // The page came back without </body>: reload, never half a page.
  await sleep(1200);
  server.truncate = true;
  const truncatedMs = await changeAndTime('markup', 'm5');
  check('a page without </body> reloads instead', truncatedMs !== null && !(await sameDocument()), `${truncatedMs} ms`);
  await mark();

  // The build wrote new CSS.
  await sleep(1200);
  const buildMs = await changeAndTime('build', 'b2');
  check('a new build reloads the page', buildMs !== null && buildMs < 500 && !(await sameDocument()), `${buildMs} ms`);
  await mark();

  // The editor overlay is open: a Live Preview session must not be torn down.
  await sleep(1200);
  await page.evaluate(() => document.documentElement.classList.add('sve-editing'));
  before = polls;
  let heading = await page.$eval('main h1', (h) => h.textContent);
  server.markup = 'm6';
  await sleep(2300);
  check('no poll while the editor overlay is open', polls === before, `${polls - before} polls`);
  check('no update while the editor overlay is open', await sameDocument() && (await page.$eval('main h1', (h) => h.textContent)) === heading);
  await page.evaluate(() => document.documentElement.classList.remove('sve-editing'));
  await page.waitForFunction((h) => document.querySelector('main h1').textContent !== h, { timeout: 3000 }, heading).catch(() => {});
  check('closing the overlay catches up, as a morph', await sameDocument() && (await page.$eval('main h1', (h) => h.textContent)) !== heading);

  // Switched off in this browser.
  await sleep(1200);
  await page.click('#sve-live-reload');
  check('a click switches it off', (await state()) === 'off');
  before = polls;
  heading = await page.$eval('main h1', (h) => h.textContent);
  server.markup = 'm7';
  await sleep(2300);
  check('off: no polls', polls === before, `${polls - before} polls`);
  check('off: no update', await sameDocument() && (await page.$eval('main h1', (h) => h.textContent)) === heading);
  check('off is remembered', (await page.evaluate(() => localStorage.getItem('sve-live-reload'))) === 'off');
  await page.click('#sve-live-reload');
  await page.waitForFunction((h) => document.querySelector('main h1').textContent !== h, { timeout: 3000 }, heading).catch(() => {});
  check('switched on again, it catches up', await sameDocument() && (await page.$eval('main h1', (h) => h.textContent)) !== heading);

  // No morph to be had (an older build, a failed request): reload, as before.
  server.morphStatus = 404;
  await page.reload();
  await mark();
  await sleep(1200);
  const noMorphMs = await changeAndTime('markup', 'm8');
  check('without the morph, new markup reloads the page', noMorphMs !== null && !(await sameDocument()), `${noMorphMs} ms`);
  server.morphStatus = 200;
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
