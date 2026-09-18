#!/usr/bin/env node
/**
 * Performance panel, "Server" and "Editor" tabs — the readings have to arrive and mean something.
 *
 * Opens an entry in Live Preview, opens the performance panel from the top bar,
 * switches to the Server tab and waits for the profile. Passes when the tab
 * reports a total, the sections/layout split and at least one template row.
 *
 * Env, as in the smoke test:
 *   SVE_SITE_URL / SVE_SITE_DIR / SVE_USER / SVE_PASS / SVE_ENTRY
 *
 * Run from the addon root:  SVE_PASS='…' npm run test:perf
 */
import { createRequire } from 'node:module';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68d0174e-6b29-425c-9e55-d096b0727ec6');

const require = createRequire(`${SITE_DIR}/package.json`);
const puppeteer = require('puppeteer');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = true;
const step = (name, pass, detail = '') => { if (!pass) ok = false; console.log(`${pass ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1600,1000'], defaultViewport: { width: 1600, height: 1000 } });
const page = await browser.newPage();

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()), page.url());

  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  let cp = page.mainFrame();
  if (!(await page.$('iframe.sve-edit-overlay'))) {
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click());
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }
  cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });

  const hasButton = !!(await cp.$('#__sve-toolbar button[data-tab="performance"]'));
  step('performance button in the top bar', hasButton, hasButton ? '' : 'feature off for this user?');
  if (!hasButton) throw new Error('no performance button');

  await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="performance"]').click());
  const panel = await cp.waitForSelector('#__sve-perf-panel .sve-perf-tabs', { timeout: 15000 }).then(() => true).catch(() => false);
  step('performance panel opened', panel);

  const tabs = await cp.$$eval('#__sve-perf-panel .sve-perf-tabs button', (b) => b.map((x) => x.getAttribute('data-tab')));
  step('server tab present', tabs.includes('server'), tabs.join(', '));

  await cp.evaluate(() => document.querySelector('#__sve-perf-panel .sve-perf-tabs button[data-tab="server"]').click());
  let reading = null;
  for (let i = 0; i < 60 && !reading; i++) {
    await sleep(1000);
    reading = await cp.evaluate(() => {
      const body = document.querySelector('#__sve-perf-panel .sve-perf-body');
      if (!body) return null;
      const kvs = [...body.querySelectorAll('.sve-perf-kv')].map((el) => ({ label: el.querySelector('.sve-perf-kv-label')?.textContent.trim(), value: el.querySelector('.sve-perf-kv-value')?.textContent.trim(), level: el.getAttribute('data-level') }));
      const rows = [...body.querySelectorAll('.sve-perf-row')].map((el) => ({ tag: el.querySelector('.sve-perf-tag')?.textContent.trim(), title: el.querySelector('.sve-perf-title')?.textContent.trim(), help: el.querySelector('.sve-perf-help')?.textContent.trim() }));
      const error = body.querySelector('.sve-perf-error')?.textContent.trim();
      return kvs.length || error ? { kvs, rows, error } : null;
    });
  }
  step('server profile arrived', !!reading && !reading.error, reading?.error || (reading ? `${reading.kvs.length} readings, ${reading.rows.length} rows` : 'nothing after 60 s'));
  if (reading && !reading.error) {
    const total = reading.kvs[0];
    step('total render time with a budget level', /ms|s$/.test(total?.value || '') && ['pass', 'warn', 'fail'].includes(total?.level), `${total?.value} (${total?.level})`);
    step('sections / layout split', reading.kvs.length >= 3, reading.kvs.slice(1).map((k) => `${k.label}: ${k.value}`).join(' | '));
    step('template rows, biggest first', reading.rows.length > 0, reading.rows.slice(0, 5).map((r) => `${r.tag} ${r.title}`).join(' | '));
  }

  // Editor tab: live readings appear within a few seconds, four of them.
  await cp.evaluate(() => document.querySelector('#__sve-perf-panel .sve-perf-tabs button[data-tab="editor"]')?.click());
  let editor = null;
  for (let i = 0; i < 10 && !editor; i++) {
    await sleep(1000);
    editor = await cp.evaluate(() => {
      const body = document.querySelector('#__sve-perf-panel .sve-perf-body');
      const kvs = body ? [...body.querySelectorAll('.sve-perf-kv')].map((el) => ({ label: el.querySelector('.sve-perf-kv-label')?.textContent.trim(), value: el.querySelector('.sve-perf-kv-value')?.textContent.trim(), level: el.getAttribute('data-level') })) : [];
      return kvs.length >= 4 ? kvs : null;
    });
  }
  step('editor tab shows four live readings', !!editor, editor ? editor.map((k) => `${k.label}: ${k.value} (${k.level})`).join(' | ') : 'no readings after 10 s');
} catch (e) {
  step('no exception', false, e.message);
} finally {
  await browser.close();
}

process.exit(ok ? 0 : 1);
