/**
 * Dockens `[ klasse ]` må aldrig forveksles med Tailwinds `bg-[#343434]`.
 */
import { applyBracketClass, bracketToken, bracketTokens, bracketClassTokens, bracketRun } from '../resources/js/css-scope.js';

let fails = 0;
const is = (got, want, what) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fails += 1; console.log('FEJL', what, '\n  fik: ', JSON.stringify(got), '\n  vil: ', JSON.stringify(want)); }
  else console.log('ok  ', what);
};

// --- hvad er en dock-bracket, og hvad er Tailwind? --------------------------
is(bracketRun('bg-[#343434]'), null, 'bg-[#343434] er IKKE dockens');
is(bracketRun('max-w-[40ch] p-4'), null, 'max-w-[40ch] er IKKE dockens');
is(bracketRun('data-[open]:flex'), null, 'data-[open]:flex er IKKE dockens');
is(bracketRun('max-[900px]:p-4'), null, 'max-[900px]: er IKKE dockens');
is(!!bracketRun('[ heading ] wrapper'), true, '[ heading ] ER dockens');
is(!!bracketRun('wrapper [ heading ]'), true, 'også når den står sidst');
is(!!bracketRun('bg-[#343434] [ heading ]'), true, 'også ved siden af en Tailwind-bracket');
is(bracketRun('[heading]')?.innerFrom, 1, 'uden mellemrum indeni er den stadig dockens');

// --- navnene læses ud af den rigtige ----------------------------------------
is(bracketTokens('<div class="[ heading ] bg-[#343434]">'), ['heading'], 'navnet er heading, ikke 343434');
is(bracketTokens('<div class="bg-[#343434] max-lg:p-450">'), [], 'ren Tailwind giver ingen navne');
is(bracketToken('<div class="bg-[#343434] [ hero ] p-4">'), 'hero', 'finder dockens forbi Tailwinds');

// --- tilføjelse: DEN fejl fra skærmbilledet ---------------------------------
is(
  applyBracketClass('<section class="dark bg-[#343434] max-lg:p-450">', 'dsad'),
  '<section class="[ dsad ] dark bg-[#343434] max-lg:p-450">',
  'ny klasse lander i sin EGEN bracket — ikke inde i bg-[#343434]',
);
is(
  applyBracketClass('<section class="[ hero ] bg-[#343434]">', 'dsad'),
  '<section class="[ hero dsad ] bg-[#343434]">',
  'og i den eksisterende, når der er en',
);
is(
  applyBracketClass('<section class="[ hero ] bg-[#343434]">', 'hero'),
  '<section class="[ hero ] bg-[#343434]">',
  'samme navn to gange ændrer intet',
);
is(
  applyBracketClass('<section class="bg-[#343434] [ hero ] p-4">', 'x'),
  '<section class="bg-[#343434] [ hero x ] p-4">',
  'Tailwind-bracketen foran røres ikke',
);
is(
  applyBracketClass('<div class="p-4">', 'card'),
  '<div class="[ card ] p-4">',
  'ingen bracket i forvejen',
);
is(
  applyBracketClass('<div class="[ a ] hover:bg-[var(--x)] md:w-[calc(100%_-_2rem)]">', 'b'),
  '<div class="[ a b ] hover:bg-[var(--x)] md:w-[calc(100%_-_2rem)]">',
  'arbitrære værdier med parenteser og understreger overlever',
);

// --- offsets peger ind i den rigtige bracket --------------------------------
const html = '<section class="dark bg-[#343434] [ hero ] p-4">';
const toks = bracketClassTokens(html);
is(toks.map((t) => t.name), ['hero'], 'kun hero registreres');
is(html.slice(toks[0].from, toks[0].to), 'hero', 'og offsettet peger på hero');

console.log(fails ? `\n${fails} FEJL` : '\nAlt grønt');
process.exit(fails ? 1 : 0);
