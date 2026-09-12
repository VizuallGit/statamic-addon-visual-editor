/**
 * css-sizes.js mod de skabeloner den skal læse.
 *
 * Kør: node scripts/test-css-sizes.mjs [sti-til-site]
 * Uden sti køres kun de indbyggede tilfælde.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { cssMediaBlocks, sizeOfQuery, queryUpperPx, blocksForSize, blocksToHide, foldRangesForSize, stripEmptySizeBlocks, emptySizeBlocks } from '../resources/js/css-sizes.js';

const SIZES = [
  { handle: 'laptop', base: true, max: null },
  { handle: 'tablet', base: false, max: '1023.98px' },
  { handle: 'mobile', base: false, max: '767.98px' },
];

let fails = 0;
const is = (got, want, what) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fails += 1; console.log('FEJL', what, '\n  fik: ', JSON.stringify(got), '\n  vil: ', JSON.stringify(want)); }
  else console.log('ok  ', what);
};

// --- grænsen læses ud af begge skrivemåder ----------------------------------
is(Math.round(queryUpperPx('(max-width: 1023.98px)')), 1024, 'px-form');
is(Math.round(queryUpperPx('(width < 64em)')), 1024, 'em-form');
is(Math.round(queryUpperPx('(width <= 767.98px)')), 768, '<=-form');
is(queryUpperPx('(min-width: 768px)'), null, 'min-width er ikke vores');
is(queryUpperPx('print'), null, 'print er ikke en bredde');
is(queryUpperPx('(prefers-reduced-motion)'), null, 'motion er ikke en bredde');

is(sizeOfQuery('(max-width: 1023.98px)', SIZES), 'tablet', 'px → tablet');
is(sizeOfQuery('(width < 64em)', SIZES), 'tablet', 'em → samme tablet');
is(sizeOfQuery('(width < 48em)', SIZES), 'mobile', 'em → mobil');
is(sizeOfQuery('(width < 40rem)', SIZES), '', '40rem er ingen af vores');
is(sizeOfQuery('(min-width: 1024px)', SIZES), '', 'mobile-first hører ingen steder hjemme');

// --- entry_icon-formen: media på øverste niveau, plus en i @scope -----------
const topLevel = `
  #id-{{ id }}{ --color-bg: {{ bg_color ?? 'var(--light)' }}; }

  @media (width < 64em) { #id-{{ id }}{ padding: 1rem; } }

  @media (width < 48em) { #id-{{ id }}{ padding: 0.5rem; } }

  @scope(.{{ _class }}) {
    .list { display: grid; }
    @media (width < 64em) { .list { --list-grid: 2; } }
  }
`;
const t1 = cssMediaBlocks(topLevel);
is(t1.length, 3, 'to på øverste niveau + en i @scope');
is(t1.map((b) => sizeOfQuery(b.query, SIZES)), ['tablet', 'mobile', 'tablet'], 'hver placeret rigtigt');
is(t1.every((b) => topLevel.slice(b.from, b.to).startsWith('@media')), true, 'from peger på @media');
is(t1.every((b) => topLevel.slice(b.to - 1, b.to) === '}'), true, 'to peger efter }');
is(blocksForSize(topLevel, SIZES, 'tablet').length, 2, 'tablet har to blokke');
is(blocksToHide(topLevel, SIZES, 'laptop').length, 3, 'basis gemmer alle tre');
is(blocksToHide(topLevel, SIZES, 'tablet').length, 1, 'tablet gemmer kun mobils');

// --- hero-formen: alt nestet inde i ét #id-regel ----------------------------
const nested = `
#id-x{
  --color-bg: red;
  .icon { --icon-size: var(--icon-size-l); }

  @media (width < 64em) {
    .icon { --icon-size: var(--icon-size-t); }
  }

  @media (width < 48em) {
    .icon { --icon-size: var(--icon-size-m); }
  }
}`;
const t2 = cssMediaBlocks(nested);
is(t2.length, 2, 'hero-formen: to nestede størrelser findes');
is(t2.map((b) => b.depth), [1, 1], 'og de ved de er ét niveau inde');
is(t2.map((b) => sizeOfQuery(b.query, SIZES)), ['tablet', 'mobile'], 'begge placeret');
is(blocksToHide(nested, SIZES, 'tablet').map((b) => b.query), ['(width < 48em)'], 'på tablet gemmes mobil');
is(blocksToHide(nested, SIZES, 'laptop').length, 2, 'på basis gemmes begge');

// --- klammer i strenge, kommentarer og Antlers må ikke forvirre -------------
const tricky = `
  .a { content: "}"; }
  /* @media (width < 64em) { ikke rigtig } */
  {{ if x }}@media (width < 48em) { .b { color: red } }{{ /if }}
`;
const t3 = cssMediaBlocks(tricky);
is(t3.length, 1, 'kun den rigtige @media — ikke den i kommentaren eller strengen');
is(sizeOfQuery(t3[0].query, SIZES), 'mobile', 'og den er mobils');

// --- kun én størrelse ad gangen ---------------------------------------------
const shown = (css, active) => {
  const folds = foldRangesForSize(css, SIZES, active).sort((a, b) => a.from - b.from);
  let out = '';
  let at = 0;
  for (const f of folds) { out += css.slice(at, f.from) + '…'; at = f.to; }
  return (out + css.slice(at)).replace(/\s+/g, ' ').trim();
};

const page = `.card {
  color: red;
  padding: 2rem;

  @media (width < 64em) {
    padding: 1rem;
  }

  @media (width < 48em) {
    padding: 0.5rem;
  }
}

.only-base {
  margin: 0;
}`;

is(shown(page, ''), page.replace(/\s+/g, ' ').trim(), 'Alle folder intet');
is(shown(page, 'laptop'), '.card { color: red; padding: 2rem; … … } .only-base { margin: 0; }', 'Desktop: basis står, størrelserne helt væk');
is(shown(page, 'tablet'), '.card {…@media (width < 64em) { padding: 1rem; }…}…', 'Tablet: kun tablet — basis og mobil væk');
is(shown(page, 'mobile'), '.card {…@media (width < 48em) { padding: 0.5rem; } }…', 'Mobil: kun mobil');

// En regel uden noget for denne størrelse folder helt sammen.
const twoRules = `.a { color: red; @media (width < 48em) { color: blue; } }\n.b { margin: 0; }`;
is(shown(twoRules, 'mobile'), '.a {…@media (width < 48em) { color: blue; } }…', 'reglen uden mobil-indhold foldes væk');

// Nestet dybere: @scope om det hele.
const scoped = `@scope(.x) { :scope { color: red; } @media (width < 48em) { :scope { color: blue; } } }`;
is(shown(scoped, 'mobile'), '@scope(.x) {…@media (width < 48em) { :scope { color: blue; } } }', 'skelettet af @scope står stadig');

// --- tomme størrelser skrives ikke til filen --------------------------------
const withEmpty = `.card {
  color: red;

  @media (width < 64em) {
  }

  @media (width < 48em) {
    color: blue;
  }
}`;
is(emptySizeBlocks(withEmpty, SIZES).length, 1, 'den tomme findes');
is(stripEmptySizeBlocks(withEmpty, SIZES).replace(/\s+/g, ' ').trim(),
   '.card { color: red; @media (width < 48em) { color: blue; } }',
   'den tomme fjernes, den fyldte bliver');
is(stripEmptySizeBlocks(page, SIZES), page, 'intet tomt = teksten er urørt');

// Kun mellemrum og kommentarer tæller ikke som indhold.
const onlyComment = `.a {\n  @media (width < 48em) {\n    /* senere */\n  }\n}`;
is(emptySizeBlocks(onlyComment, SIZES).length, 1, 'kun en kommentar er stadig tom');

// En media query vi ikke kender røres ikke.
const foreign = `.a {\n  @media print {\n  }\n}`;
is(stripEmptySizeBlocks(foreign, SIZES), foreign, 'print er ikke vores at rydde op i');

// --- mod sitets rigtige skabeloner ------------------------------------------
const site = process.argv[2] || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const root = join(site, 'resources/views/partials/page_sections');

if (existsSync(root)) {
  let files = 0, found = 0, bad = 0, unplaced = 0;
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith('.antlers.html')) continue;
      const m = readFileSync(p, 'utf8').match(/<style>([\s\S]*?)<\/style>/);
      if (!m) continue;
      files += 1;
      for (const b of cssMediaBlocks(m[1])) {
        found += 1;
        const text = m[1].slice(b.from, b.to);
        const bal = [...text].reduce((n, c) => n + (c === '{') - (c === '}'), 0);
        if (bal !== 0) { bad += 1; console.log('  UBALANCERET i', p); }
        if (!sizeOfQuery(b.query, SIZES)) { unplaced += 1; console.log('  uplaceret:', b.query, '—', p.split('/').slice(-2).join('/')); }
      }
    }
  };
  walk(root);
  console.log(`\n${files} skabeloner med <style>, ${found} media-blokke, ${bad} ubalancerede, ${unplaced} uplacerede`);
  is(bad, 0, 'alle udskårne blokke er balancerede');
}

console.log(fails ? `\n${fails} FEJL` : '\nAlt grønt');
process.exit(fails ? 1 : 0);
