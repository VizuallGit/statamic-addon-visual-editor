#!/usr/bin/env node
/**
 * The Build panel in its harness, clicked like a person: every step types or
 * clicks in the real panel and reads the file it wrote.
 *
 *   SVE_HARNESS_URL  where the built harness is served
 *                    (default http://127.0.0.1:8771/build-mode-harness/index.html)
 *   SVE_SITE_DIR     a site checkout with puppeteer in node_modules
 *   SVE_SHOTS        a folder for a screenshot after some steps (optional)
 *
 *   node tests/harness/build-mode/check.mjs
 */
import { createRequire } from 'node:module';

const URL = process.env.SVE_HARNESS_URL || 'http://127.0.0.1:8771/build-mode-harness/index.html';
const SITE_DIR = process.env.SVE_SITE_DIR || `${process.env.HOME}/Sites/vizuall-skabelon`;
const SHOTS = process.env.SVE_SHOTS || '';
const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
let failed = 0;
const step = (name, ok, note = '') => {
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${note ? ` — ${note}` : ''}`);
  console.log(results[results.length - 1]);
  if (!ok) failed++;
};

const H2 = '0:section/0:div/0:div/0:div/1:h2';
const LINK = '0:section/0:div/0:div/0:div/3:a';
const COLUMN = '0:section/0:div/0:div/0:div';
const IMG = '0:section/0:div/0:div/1:div/0:img';
const WRAPPER = '0:section/0:div';

const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', defaultViewport: { width: 1500, height: 950 } });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(process.env.SVE_STACK ? e.stack : e.message));
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && !/font|favicon|404/i.test(m.text()) && errors.push(m.text()));

const html = () => page.evaluate(() => window.__sveBuildHarness.html());
const select = (path) => page.evaluate((p) => window.__sveBuildHarness.select(p), path);
const shot = async (name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png` });
const classesOf = async (path) => {
  await select(path);
  await sleep(150);
  return page.evaluate(() => window.__sveBuildHarness.pickedClasses().join(' '));
};
const click = (selector) => page.evaluate((sel) => document.querySelector(sel).click(), selector);
async function typeInto(selector, text) {
  await page.click(selector, { clickCount: 3 });
  await page.evaluate((sel) => { const el = document.querySelector(sel); el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); }, selector);
  await page.type(selector, text);
  await page.keyboard.press('Enter');
  await sleep(200);
}
/** A value field: open its menu, type into the search, Enter — a value the scale does not have is written as typed. */
async function menuWrite(selector, text) {
  await click(selector);
  await sleep(150);
  await page.type('[data-harness-menu] .hx-menu__q', text);
  await page.keyboard.press('Enter');
  await sleep(200);
}
/** A value field: open its menu and click a row. */
async function menuPick(selector, name) {
  await click(selector);
  await sleep(150);
  await click(`[data-harness-pick="${name}"]`);
  await sleep(150);
}
const menuOpen = () => page.evaluate(() => !!document.querySelector('[data-harness-menu]'));
const menuActive = () => page.evaluate(() => document.querySelector('[data-harness-menu] [data-harness-pick][data-on]')?.dataset.harnessPick || '');

try {
  await page.goto(URL, { waitUntil: 'networkidle0' });
  // The steps below drive Spacing's two fields (BuildBoxFields.vue); the box is the panel's default.
  await page.evaluate(() => localStorage.setItem('sve-build-spacing-view', 'fields'));
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(500);
  step('the page is the panel and the preview, nothing else', await page.evaluate(() => !document.querySelector('.hx-right, .hx-top') && !!document.querySelector('.sve-build') && !!document.querySelector('.hx-frame')));
  step('the panel draws Add with the dock\'s own tiles', await page.evaluate(() => ['section', 'container', 'grid', 'heading', 'loop', 'li'].every((id) => document.querySelector(`[data-sve-build-tile="${id}"]`))));

  step('nothing picked: the panel is Add, with All | Elements | Components as its tabs', await page.evaluate(() => document.querySelector('[data-sve-build-root]').dataset.sveBuildSide === 'add' && ['all', 'el', 'comp'].every((id) => document.querySelector(`.bm-tabs [data-sve-build-sub="${id}"]`)) && !document.querySelector('[data-sve-build-tab]')));

  // Pick the heading: the panel turns to the element, on Style (nothing chosen yet).
  await select(H2);
  await sleep(250);
  step('picking an element opens it with its name, + / duplicate / delete, and Content | Style', await page.evaluate(() => /Heading/.test(document.querySelector('.fg-head b')?.textContent || '') && !!document.querySelector('[data-sve-build-add]') && !!document.querySelector('[data-sve-build-tab="content"]') && document.querySelector('[data-sve-build-tab="style"]')?.getAttribute('aria-selected') === 'true'));
  await click('[data-sve-build-tab="content"]');
  await sleep(150);
  step('Content on a heading is its text, read from the file', (await page.evaluate(() => document.querySelector('[data-sve-build-text]')?.value)) === 'Vi bygger brands, der kan mærkes' && !(await page.evaluate(() => !!document.querySelector('.fg-style'))));
  await page.evaluate(() => { const box = document.querySelector('[data-sve-build-text]'); box.focus(); box.select(); });
  await page.keyboard.type('Vi bygger & former');
  await sleep(150);
  step('…typed, it is written into the file as it is typed, escaped', (await html()).includes('<h2 class="text-800 font-bold text-primary">Vi bygger &amp; former</h2>'));
  const drawn = await page.evaluate(() => document.querySelector('.hx-frame').contentDocument.querySelector('h2')?.textContent);
  step('…and the preview shows it', drawn === 'Vi bygger & former', drawn);
  await page.keyboard.press('Tab');
  await sleep(100);
  await page.evaluate(() => window.__sveBuildHarness.setText(window.__sveBuildHarness.selectedPath(), 'Vi bygger brands, der kan mærkes'));
  await sleep(150);
  step('…and the box follows the file when it changes elsewhere', (await page.evaluate(() => document.querySelector('[data-sve-build-text]')?.value)) === 'Vi bygger brands, der kan mærkes');
  await menuPick('[data-sve-build-pick-field]', 'headline');
  step('the data icon writes the picked field in place of the text', (await html()).includes('<h2 class="text-800 font-bold text-primary">{{ headline }}</h2>') && (await page.evaluate(() => document.querySelector('[data-sve-build-text]')?.value)) === '{{ headline }}');
  await click('[data-sve-build-pick-field]');
  await sleep(150);
  step('…and offers only fields that fit: text and textarea, no image', await page.evaluate(() => { const names = [...document.querySelectorAll('[data-harness-pick]')].map((el) => el.getAttribute('data-harness-pick')); return names.join() === 'headline,intro,title'; }));
  await page.evaluate(() => document.querySelector('.hx-veil')?.click());
  await sleep(100);
  await page.evaluate(() => { const box = document.querySelector('[data-sve-build-text]'); box.focus(); box.select(); });
  await page.keyboard.type('Hej {{ intro }}');
  await sleep(150);
  step('words and a field typed by hand are written as they are', (await html()).includes('<h2 class="text-800 font-bold text-primary">Hej {{ intro }}</h2>'));
  await page.evaluate(() => { const box = document.querySelector('[data-sve-build-text]'); box.focus(); box.select(); });
  await page.keyboard.type('{{ hero }}');
  await page.keyboard.press('Tab');
  await sleep(200);
  step('a field of the wrong type typed by hand comes out again, and the panel says why', !(await html()).includes('{{ hero }}') && (await page.evaluate(() => /hero/.test(document.querySelector('[data-sve-build-field-refused]')?.textContent || ''))));
  step('a heading is one line: an input of the panel\'s height, its icon on the middle', await page.evaluate(() => { const box = document.querySelector('[data-sve-build-text]'); const icon = document.querySelector('[data-sve-build-pick-field]'); const a = box.getBoundingClientRect(); const b = icon.getBoundingClientRect(); return box.tagName === 'INPUT' && Math.abs(a.height - 30) < 1.5 && Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2) < 1; }));
  await page.evaluate(() => window.__sveBuildHarness.setText(window.__sveBuildHarness.selectedPath(), 'Vi bygger brands, der kan mærkes'));
  await sleep(150);
  await select(LINK);
  await sleep(150);
  step('…and the tab is kept: the next element opens on Content too', await page.evaluate(() => document.querySelector('[data-sve-build-tab="content"]')?.getAttribute('aria-selected') === 'true' && localStorage.getItem('sve-build-element-tab') === 'content'));
  await click('[data-sve-build-tab="style"]');
  await sleep(150);
  await select(H2);
  await sleep(150);
  step('Escape lets go of the element: Add again', (await page.evaluate(() => window.__sveBuildHarness.escape())) && (await page.evaluate(() => document.querySelector('[data-sve-build-root]').dataset.sveBuildSide)) === 'add');
  step('…and a second Escape is not the panel\'s', !(await page.evaluate(() => window.__sveBuildHarness.escape())));
  await select(H2);
  await sleep(150);
  step('sizes wear the top bar\'s device icons: All, Tablet, Mobile', await page.evaluate(() => ['all', 'tablet', 'mobile'].every((h) => document.querySelector(`[data-sve-build-size="${h}"] svg`))));
  await shot('1-style');

  // Padding as Figma draws it: open the four sides; block-start opens the scale's menu.
  await click('[data-sve-build-sides="padding"]');
  await sleep(150);
  await click('[data-sve-build-value="padding-block-start"]');
  await sleep(150);
  const padRows = await page.evaluate(() => [...document.querySelectorAll('[data-harness-pick]')].map((b) => b.dataset.harnessPick));
  step('a click on padding block-start opens a menu of the site\'s scale', await menuOpen() && padRows.includes('pt-500'), padRows.slice(0, 3).join(' '));
  await page.click('.hx-veil');
  await sleep(100);
  await menuWrite('[data-sve-build-value="padding-block-start"]', '10px');
  step('10px typed into its search writes pt-[10px]', / pt-\[10px\]/.test(await classesOf(H2)), await classesOf(H2));
  step('…and the field reads 10px', (await page.evaluate(() => document.querySelector('[data-sve-build-value="padding-block-start"]').textContent.trim())) === '10px');
  await menuPick('[data-sve-build-value="padding-block-start"]', 'pt-700');
  step('a row picked takes the typed value\'s place', / pt-700( |$)/.test(await classesOf(H2)) && !/pt-\[10px\]/.test(await classesOf(H2)), await classesOf(H2));
  await menuWrite('[data-sve-build-value="padding-block-start"]', '10px');
  const painted = await page.evaluate(() => getComputedStyle(document.querySelector('.hx-frame').contentDocument.querySelector('h2')).paddingBlockStart);
  step('…and the compiler paints it in the preview', painted === '10px', `padding-block-start ${painted}`);

  // Back to two fields: down, a custom property.
  await click('[data-sve-build-sides="padding"]');
  await sleep(150);
  await menuWrite('[data-sve-build-value="padding-block"]', '--gutter');
  step('the vertical padding field with --gutter writes py-(--gutter)', /(^| )py-\(--gutter\)/.test(await classesOf(H2)), await classesOf(H2));

  // Font size: the menu marks the class the heading has; that row again changes nothing.
  const sizeBefore = await classesOf(H2);
  await click('[data-sve-build-value="font-size"]');
  await sleep(150);
  step('the font-size menu marks text-800 as the one the heading has', (await menuActive()) === 'text-800', await menuActive());
  await click('[data-harness-pick="text-800"]');
  await sleep(150);
  step('…picked again it stays — a row means "this one", never "off"', (await classesOf(H2)) === sizeBefore, await classesOf(H2));

  // Mobile + font-size from a token.
  await click('[data-sve-build-size="mobile"]');
  await sleep(150);
  await menuWrite('[data-sve-build-value="font-size"]', '500');
  step('on Mobile, font-size 500 writes max-md:text-500 and keeps the base text-800', /max-md:text-500/.test(await classesOf(H2)) && /(^| )text-800/.test(await classesOf(H2)), await classesOf(H2));
  await click('[data-sve-build-size="all"]');
  await sleep(150);

  // Colour: the swatch paints the heading's text-primary, and opens the same menu.
  const swatch = () => page.evaluate(() => {
    const el = document.querySelector('[data-sve-build-swatch="color"]');

    return { empty: el.classList.contains('is-empty'), bg: getComputedStyle(el).backgroundColor };
  });
  const primary = await swatch();
  step('the colour swatch paints text-primary', !primary.empty && primary.bg !== 'rgba(0, 0, 0, 0)', primary.bg);
  await menuPick('[data-sve-build-swatch="color"]', 'text-secondary');
  const secondary = await swatch();
  step('…its menu picks text-secondary in text-primary\'s place, and the swatch follows', /(^| )text-secondary( |$)/.test(await classesOf(H2)) && !/text-primary/.test(await classesOf(H2)) && secondary.bg !== primary.bg, `${await classesOf(H2)} · ${secondary.bg}`);
  await menuPick('[data-sve-build-swatch="color"]', 'text-primary');

  // Font weight: a list, the same menu.
  step('font-weight reads the heading\'s font-bold', (await page.evaluate(() => document.querySelector('[data-sve-build-value="font-weight"]').textContent.trim())) === 'bold');
  await menuPick('[data-sve-build-value="font-weight"]', 'font-semibold');
  step('…font-semibold picked replaces it', /(^| )font-semibold( |$)/.test(await classesOf(H2)) && !/font-bold/.test(await classesOf(H2)), await classesOf(H2));
  await menuPick('[data-sve-build-value="font-weight"]', 'font-bold');

  // Position: relative, from the section's + .
  await click('[data-sve-build-toggle="position"]');
  await sleep(150);
  await menuPick('[data-sve-build-value="position"]', 'relative');
  step('position: relative writes relative', /(^| )relative( |$)/.test(await classesOf(H2)), await classesOf(H2));
  await click('[data-sve-build-value="position"]');
  await sleep(150);
  await click('[data-harness-remove]');
  await sleep(150);
  step('…Remove takes it off', !/(^| )relative( |$)/.test(await classesOf(H2)));

  // Border width: a group named by hand, the same menu — the row there again keeps it.
  await click('[data-sve-build-toggle="border"]');
  await sleep(150);
  await menuPick('[data-sve-build-value="border-width"]', 'border-2');
  await menuPick('[data-sve-build-value="border-width"]', 'border-2');
  step('border-width 2, picked twice, stays border-2', /(^| )border-2( |$)/.test(await classesOf(H2)), await classesOf(H2));
  await menuPick('[data-sve-build-value="border-width"]', 'border-4');
  step('…border-4 takes its place', /(^| )border-4( |$)/.test(await classesOf(H2)) && !/border-2/.test(await classesOf(H2)), await classesOf(H2));
  await click('[data-sve-build-value="border-width"]');
  await sleep(150);
  await click('[data-harness-remove]');
  await sleep(150);
  step('…and Remove takes the group off', !/(^| )border-\d( |$)/.test(await classesOf(H2)), await classesOf(H2));

  // State: the Tailwind pane's menu, State | Prose.
  await click('[data-sve-build-state]');
  await sleep(200);
  const tabs = await page.evaluate(() => [...document.querySelectorAll('[data-harness-menu] .hx-menu__tabs button')].map((b) => b.textContent.trim()));
  step('the state button opens the State | Prose menu', tabs.join('|') === 'State|Prose', tabs.join('|'));
  await click('[data-harness-pick="hover"]');
  await sleep(200);
  step('…hover picked: the button says hover, the hint says on hover', await page.evaluate(() => /hover/.test(document.querySelector('[data-sve-build-state]').textContent) && /hover/.test(document.querySelector('.fg-hint').textContent)));
  await menuPick('[data-sve-build-value="position"]', 'relative');
  step('…and a class is written for hover', /(^| )hover:relative( |$)/.test(await classesOf(H2)), await classesOf(H2));
  await shot('2-hover');
  await click('[data-sve-build-state]');
  await sleep(150);
  await page.evaluate(() => document.querySelector('[data-harness-menu] .hx-menu__list button').click());
  await sleep(150);

  // The heading's own tag.
  await page.evaluate(() => [...document.querySelectorAll('.fg-sec .fg-seg button')].find((b) => b.textContent.trim() === 'h3').click());
  await sleep(200);
  step('tag h3 renames the heading in the file', /<h3 class="text-800[^"]*">Vi bygger brands, der kan mærkes<\/h3>/.test(await html()));

  // A link's Content: its words and its address (a plain box here — the harness has no Control Panel to lend the page picker).
  await select(LINK);
  await sleep(200);
  await click('[data-sve-build-tab="content"]');
  await sleep(150);
  step('a link\'s Content is its text and its address, and Style has no href of its own', (await page.evaluate(() => document.querySelector('[data-sve-build-text]')?.value)) === 'Se vores cases' && (await page.evaluate(() => !!document.querySelector('[data-sve-build-address="href"] [data-sve-build-href]'))));
  await typeInto('[data-sve-build-href]', '/cases');
  step('href writes the link\'s href', (await html()).includes('<a href="/cases" class="btn">'));

  // An image's Content: its address, and the alt text is the asset's own (read on the server).
  await select(IMG);
  await sleep(200);
  step('an image\'s Content is its address and a note that the alt text is the image\'s own — no alt box, no text box', await page.evaluate(() => !!document.querySelector('[data-sve-build-src]') && !!document.querySelector('[data-sve-build-alt-note]') && !document.querySelector('[data-sve-build-alt]') && !document.querySelector('[data-sve-build-text]')));
  await typeInto('[data-sve-build-src]', '/assets/team.webp');
  step('…the address written with an alt that reads the asset\'s own', (await html()).includes(`<img src="/assets/team.webp" alt="{{ asset url='/assets/team.webp' }}{{ alt | entities }}{{ /asset }}" class="w-full aspect-video rounded-lg">`));
  // Rich text: a div of classed elements is not; the tile's is, and Content edits it (a plain box here — no Control Panel to lend Bard).
  await select(COLUMN);
  await sleep(150);
  step('a div of classed elements is not rich text: Content says a layout has no text of its own', await page.evaluate(() => !!document.querySelector('[data-sve-build-content-soon]') && !document.querySelector('[data-sve-build-rich]')));
  // After the image, so the column the steps below add to keeps what they expect.
  await select(IMG);
  await sleep(150);
  await click('[data-sve-build-add]');
  await sleep(150);
  await click('[data-sve-build-tile="richtext"]');
  await sleep(200);
  const richPath = await page.evaluate(() => window.__sveBuildHarness.selectedPath());
  step('the Rich text tile writes a div with a paragraph, and Add stays open', /<div class="prose">\n\s+<p>Write your text here\.<\/p>\n\s+<\/div>/.test(await html()) && (await page.evaluate(() => document.querySelector('[data-sve-build-root]').dataset.sveBuildSide)) === 'add', richPath);
  await select(richPath);
  await sleep(150);
  step('Content on it is its rich text', (await page.evaluate(() => document.querySelector('[data-sve-build-rich-html]')?.value)) === '<p>Write your text here.</p>');
  await page.evaluate(() => { const box = document.querySelector('[data-sve-build-rich-html]'); box.focus(); box.select(); });
  await page.keyboard.type('<h2>Om os</h2><p>Vi er <strong>tre</strong>.</p>');
  step('…nothing is written while it is typed', /<p>Write your text here\.<\/p>/.test(await html()));
  await page.keyboard.press('Tab');
  await sleep(200);
  step('…and when typing is over, one block to a line at the div\'s indent', /<div class="prose">\n(\s+)<h2>Om os<\/h2>\n\1<p>Vi er <strong>tre<\/strong>\.<\/p>\n\s+<\/div>/.test(await html()));
  await select(`${richPath}/0:h2`);
  await sleep(100);
  step('a click on what stands in Rich text picks the Rich text', (await page.evaluate(() => window.__sveBuildHarness.selectedPath())) === richPath && /Rich text/.test(await page.evaluate(() => document.querySelector('.fg-head b')?.textContent || '')));
  await click('[data-sve-build-rich] [data-sve-build-pick-field]');
  await sleep(150);
  step('Rich text\'s data icon offers Bard fields only', (await page.evaluate(() => [...document.querySelectorAll('[data-harness-pick]')].map((el) => el.getAttribute('data-harness-pick')).join())) === 'content');
  await click('[data-harness-pick="content"]');
  await sleep(200);
  step('…picked, the field stands in the div, and a box shows the tag', /<div class="prose">\n\s+\{\{ content \}\}\n\s+<\/div>/.test(await html()) && (await page.evaluate(() => document.querySelector('[data-sve-build-rich-field] input')?.value)) === '{{ content }}');
  await page.evaluate(() => { const box = document.querySelector('[data-sve-build-rich-field] input'); box.focus(); box.select(); });
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Tab');
  await sleep(200);
  step('…emptied, rich text is back', /<div class="prose">\n\s+<p><\/p>\n\s+<\/div>/.test(await html()) && (await page.evaluate(() => !!document.querySelector('[data-sve-build-rich-html]'))));

  await select(LINK);
  await sleep(150);
  step('a link\'s text is one line, with its target, rel and aria-label below', await page.evaluate(() => document.querySelector('[data-sve-build-text]')?.tagName === 'INPUT' && !!document.querySelector('[data-sve-build-new-tab]') && !!document.querySelector('[data-sve-build-rel]') && !!document.querySelector('[data-sve-build-aria]')));
  const hrefBefore = await page.evaluate(() => window.__sveBuildHarness.attr('href'));
  await click('[data-sve-build-address="href"] [data-sve-build-pick-field]');
  await sleep(150);
  step('the address\'s data icon offers link fields only', (await page.evaluate(() => [...document.querySelectorAll('[data-harness-pick]')].map((el) => el.getAttribute('data-harness-pick')).join())) === 'cta');
  await click('[data-harness-pick="cta"]');
  await sleep(200);
  step('…picked, href reads the field', (await html()).includes('href="{{ cta }}"'));
  await page.evaluate((v) => window.__sveBuildHarness.setAttrsAt(window.__sveBuildHarness.selectedPath(), { href: v }), hrefBefore);
  await click('[data-sve-build-new-tab]');
  await sleep(150);
  step('Open in new tab writes target', (await html()).includes('target="_blank"'));
  await click('[data-sve-build-new-tab]');
  await sleep(150);
  step('…and takes it out again', !(await html()).includes('target="_blank"'));
  await page.evaluate(() => { const box = document.querySelector('[data-sve-build-rel]'); box.focus(); });
  await page.keyboard.type('noreferrer');
  await page.keyboard.press('Tab');
  await sleep(150);
  step('rel is written as typed', (await html()).includes('rel="noreferrer"'));
  await page.evaluate(() => { const box = document.querySelector('[data-sve-build-rel]'); box.focus(); box.select(); });
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Tab');
  await sleep(150);
  step('…and an empty one goes', !(await html()).includes(' rel='));

  await click('[data-sve-build-tab="style"]');
  await sleep(150);
  await select(LINK);
  await sleep(150);

  // A field that still has focus when the pick moves writes nothing anywhere.
  const columnBefore = await classesOf(COLUMN);
  await select(H2.replace('h2', 'h3'));
  await sleep(150);
  await page.focus('[data-sve-build-value="font-size"]');
  await select(COLUMN);
  await sleep(200);
  await page.mouse.click(900, 900);
  await sleep(150);
  step('a focused field writes nothing onto the next pick', columnBefore === 'flow-y' && (await classesOf(COLUMN)) === 'flow-y', `${columnBefore} → ${await classesOf(COLUMN)}`);


  // Flow and Figma's alignment box on the column.
  await select(COLUMN);
  await sleep(150);
  await click('[data-sve-build-flow="row"]');
  await sleep(150);
  step('Flow → row makes the column flex', /(^| )flex( |$)/.test(await classesOf(COLUMN)), await classesOf(COLUMN));
  await click('[data-sve-build-cell="1-1"]');
  await sleep(150);
  step('the middle of the alignment box writes justify-center and items-center', /justify-center/.test(await classesOf(COLUMN)) && /items-center/.test(await classesOf(COLUMN)), await classesOf(COLUMN));
  await click('[data-sve-build-cell="1-1"]');
  await sleep(150);
  step('…clicked again, it stays — the box never takes an axis off', /justify-center/.test(await classesOf(COLUMN)) && /items-center/.test(await classesOf(COLUMN)));
  await click('[data-sve-build-flow="block"]');
  await sleep(150);
  step('Flow → block takes flex off again', !/(^| )flex( |$)/.test(await classesOf(COLUMN)), await classesOf(COLUMN));
  await click('[data-sve-build-toggle="size"]');
  await sleep(150);
  await page.select('select[aria-label="width mode"]', 'fill');
  await sleep(150);
  step('W · Fill writes w-full', /(^| )w-full( |$)/.test(await classesOf(COLUMN)), await classesOf(COLUMN));
  await page.select('select[aria-label="width mode"]', 'fixed');
  await sleep(150);
  await click('[data-sve-build-flow="block"]');
  await sleep(100);

  // Add: a heading into the picked column, at its end.
  await select(COLUMN);
  await sleep(150);
  await click('[data-sve-build-add]');
  await sleep(150);
  const target = await page.evaluate(() => document.querySelector('[data-sve-build-target] > span:nth-child(2)')?.textContent);
  step('the element\'s + opens Add, which says where the element lands', /into/.test(target || ''), target);
  await click('[data-sve-build-tile="heading"]');
  await sleep(200);
  step('Heading lands as the column\'s last child, indented', (await html()).includes('<a href="/cases" class="btn">Se vores cases</a>\n                <h2>New heading</h2>\n            </div>'));
  step('…and is picked', await page.evaluate(() => /h2$/.test(window.__sveBuildHarness.selectedPath())));
  step('…and Add stays open: only a click opens an element', await page.evaluate(() => document.querySelector('[data-sve-build-root]').dataset.sveBuildSide === 'add'));

  // + on the wrapper → Grid ⅓ × 3.
  await page.evaluate((p) => window.__sveBuildHarness.setPlus(p), WRAPPER);
  await sleep(150);
  await click('[data-sve-build-tile="grid"]');
  await sleep(150);
  await click('[data-sve-build-structure="3"]');
  await sleep(250);
  step('+ on the wrapper, Grid ⅓ × 3: a grid with three empty cells at the end of the wrapper',
    (await html()).includes('        <div class="grid grid-cols-3 max-md:grid-cols-1">\n            <div></div>\n            <div></div>\n            <div></div>\n        </div>\n    </div>'));
  const cols = await page.evaluate(() => {
    const grid = document.querySelector('.hx-frame').contentDocument.querySelector('.grid-cols-3');
    return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
  });
  step('…drawn as three columns in the preview', cols === 3, `${cols} tracks`);
  await shot('3-columns');

  // A click on an empty column in the preview is "+ Add element" there.
  await page.evaluate(() => document.querySelector('.hx-frame').contentDocument.querySelector('[data-sve-build-empty]').click());
  await sleep(200);
  step('an empty column in the preview sets where Add inserts', /Cell 1/.test(await page.evaluate(() => document.querySelector('[data-sve-build-target]').textContent)));

  // All, Elements, Components — one tile for both, a grid or a list.
  const tiles = () => page.evaluate(() => {
    const all = [...document.querySelectorAll('[data-sve-build-tile], [data-sve-build-component]')];
    const isEl = all.map((t) => t.hasAttribute('data-sve-build-tile'));

    return {
      sub: document.querySelector('[data-sve-build-sub][aria-selected="true"]')?.dataset.sveBuildSub || '',
      els: isEl.filter(Boolean).length,
      comps: isEl.filter((el) => !el).length,
      elementsFirst: isEl.indexOf(false) > isEl.lastIndexOf(true),
      oneShape: all.every((t) => t.classList.contains('bm-tile')),
      lists: document.querySelectorAll('.bm-tiles.is-list').length,
      grids: document.querySelectorAll('.bm-tiles:not(.is-list)').length,
    };
  });
  await sleep(200);
  let seen = await tiles();
  step('Add opens on All: the elements, then the components, on one tile', seen.sub === 'all' && seen.els > 10 && seen.comps > 5 && seen.elementsFirst && seen.oneShape, JSON.stringify(seen));
  await click('[data-sve-build-sub="el"]');
  await sleep(150);
  seen = await tiles();
  step('Elements: only the elements', seen.els > 10 && seen.comps === 0, JSON.stringify(seen));
  await click('[data-sve-build-view="list"]');
  await sleep(150);
  await click('[data-sve-build-sub="comp"]');
  await sleep(150);
  seen = await tiles();
  step('Components: only the components — and the list view, chosen on Elements, is theirs too', seen.els === 0 && seen.comps > 5 && seen.lists > 0 && seen.grids === 0, JSON.stringify(seen));
  step('…the list view is kept in the browser', (await page.evaluate(() => localStorage.getItem('sve-build-add-view'))) === 'list');
  await click('[data-sve-build-view="grid"]');
  await click('[data-sve-build-sub="all"]');
  await sleep(150);
  seen = await tiles();
  step('…and the grid view again for both', seen.lists === 0 && seen.grids > 1, JSON.stringify(seen));

  // A + on the canvas: no menu at the +; Add opens and flashes, each time.
  const flash = () => page.evaluate(() => ({
    side: document.querySelector('[data-sve-build-root]').dataset.sveBuildSide,
    on: !!document.querySelector('.bm-scroll.is-nudged'),
    // One outline round the whole of Add (v1.1.669), not the place and the tiles one by one.
    anim: getComputedStyle(document.querySelector('.bm-scroll')).animationName,
    menu: !!document.querySelector('[data-sve-build-quick]'),
  }));
  await select(COLUMN);
  await sleep(150);
  await page.evaluate((p) => window.__sveBuildHarness.openPlus(p), WRAPPER);
  await sleep(100);
  let lit = await flash();
  step('a + on the canvas opens Add and flashes its place and tiles, with no menu at the +', lit.side === 'add' && lit.on && lit.anim === 'sve-bm-nudge' && !lit.menu, JSON.stringify(lit));
  await sleep(1200);
  step('…once', !(await flash()).on);
  await page.evaluate((p) => window.__sveBuildHarness.openPlus(p), WRAPPER);
  await sleep(100);
  lit = await flash();
  step('the same + pressed again flashes again', lit.on && lit.anim === 'sve-bm-nudge', JSON.stringify(lit));
  await sleep(1200);

  // A component from the site's folder.
  await click('[data-sve-build-sub="comp"]');
  await sleep(300);
  const comp = await page.evaluate(() => document.querySelectorAll('[data-sve-build-component]').length);
  step('Components lists the site\'s partials/components', comp > 5, `${comp} components`);
  await click('[data-sve-build-component="card"]');
  await sleep(200);
  step('a component tile writes the call the dock\'s component menu writes', (await html()).includes('{{ partial:components/card }}'));

  step('no JavaScript errors or Vue warnings', !errors.length, errors.slice(0, 3).join(' | '));

  // Danish.
  await page.goto(`${URL}?lang=da`, { waitUntil: 'networkidle0' });
  await sleep(400);
  step('the panel speaks Danish when the CP does', await page.evaluate(() => /Alle.*Elementer.*Komponenter/i.test(document.querySelector('.bm-tabs').textContent)));
} catch (e) {
  step('no exception', false, e.stack);
} finally {
  await browser.close();
}

console.log(`\n${results.length - failed}/${results.length} ok`);
process.exit(failed ? 1 : 0);
