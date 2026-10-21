import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { compile } from 'tailwindcss';
import { bakeTailwind, buildTailwind, makeTailwindCompiler } from '../../resources/js/tw-compile-core.js';

// The same two stylesheets the CP chunk carries as `?raw` imports.
const pkg = createRequire(import.meta.url).resolve('tailwindcss/package.json').replace(/package\.json$/, '');
const sources = {
  theme: readFileSync(pkg + 'theme.css', 'utf8'),
  utilities: readFileSync(pkg + 'utilities.css', 'utf8'),
};

const site = {
  css: `@theme { --color-tertiary: #D6A485; --spacing-400: 1rem; }\n@utility container-x { padding-inline: 1rem; }`,
  plugins: [],
};

const options = { compile, sources, site, modules: {} };

const header = '<header class="backdrop-blur-md flex items-center gap-400 bg-tertiary"></header>';
const section = '<section class="[ {{ _class }} ]"><div class="grid grid-cols-2 container-x"></div></section>';

test('a file baked after another gets its own classes only', async () => {
  const headerCss = await bakeTailwind(options, header);
  const sectionCss = await bakeTailwind(options, section);

  assert.match(headerCss, /\.backdrop-blur-md\b/);
  assert.match(headerCss, /\.bg-tertiary\b/);

  assert.match(sectionCss, /\.grid-cols-2\b/);
  assert.doesNotMatch(sectionCss, /\.backdrop-blur-md\b/, 'the header’s classes leaked into the section');
  assert.doesNotMatch(sectionCss, /\.bg-tertiary\b/);
  assert.doesNotMatch(sectionCss, /\.flex\b/);
});

test('the bake does not depend on what was baked before it', async () => {
  const alone = await bakeTailwind(options, section);

  await bakeTailwind(options, header);
  const after = await bakeTailwind(options, section);

  assert.equal(after, alone);
});

test('the site’s own @utility names are not baked', async () => {
  const css = await bakeTailwind(options, section);

  assert.doesNotMatch(css, /\.container-x\b/);
});

test('a file without classes bakes to nothing', async () => {
  assert.equal(await bakeTailwind(options, '<section class="[ {{ _class }} ]"></section>'), '');
});

test('the kept compiler Instant uses is the one that accumulates, by design', async () => {
  const kept = await makeTailwindCompiler(options);

  buildTailwind(kept, header);
  const live = buildTailwind(kept, section);

  // Documented, not wished for: this is why the save does not use it.
  assert.match(live, /\.grid-cols-2\b/);
  assert.match(live, /\.backdrop-blur-md\b/);
});
