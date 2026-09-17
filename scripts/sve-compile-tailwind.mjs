#!/usr/bin/env node
/**
 * Tailwind's own compiler, run by PHP on save.
 *
 * Same engine as Vite (`compile` + Oxide `Scanner`). Not a class map. stdin
 * JSON `{ html, theme, plugins, cwd }`, stdout CSS. `npm run build` is not
 * involved.
 */

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const THEME_ID = 'sve:tailwind-theme';
const UTILITIES_ID = 'sve:tailwind-utilities';

const chunks = [];

for await (const chunk of process.stdin) {
  chunks.push(chunk);
}

const payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
const cwd = payload.cwd || process.cwd();
const require = createRequire(join(cwd, 'package.json'));

function resolveFrom(id, from) {
  return require.resolve(id, from ? { paths: [from] } : undefined);
}

const twDir = dirname(resolveFrom('tailwindcss/package.json'));
const { compile } = await import(pathToFileURL(join(twDir, 'dist/lib.mjs')).href);

let oxideHref;

try {
  oxideHref = pathToFileURL(resolveFrom('@tailwindcss/oxide')).href;
} catch {
  const twRequire = createRequire(join(twDir, 'package.json'));
  oxideHref = pathToFileURL(twRequire.resolve('@tailwindcss/oxide')).href;
}

const { Scanner } = await import(oxideHref);

const themeSource = readFileSync(join(twDir, 'theme.css'), 'utf8');
const utilitiesSource = readFileSync(join(twDir, 'utilities.css'), 'utf8');

const plugins = Array.isArray(payload.plugins) ? payload.plugins : [];
const modules = {};

for (const name of plugins) {
  const href = pathToFileURL(resolveFrom(name)).href;
  modules[name] = await import(href);
}

const siteCss = String(payload.theme || '');
const skip = new Set(payload.skip || []);

for (const match of siteCss.matchAll(/@utility\s+([A-Za-z0-9_-]+)/g)) {
  skip.add(match[1]);
}

const input = [
  '@layer theme, base, components, utilities;',
  `@import "${THEME_ID}" layer(theme);`,
  `@import "${UTILITIES_ID}" layer(utilities);`,
  ...plugins.map((name) => `@plugin "${name}";`),
  siteCss,
].join('\n');

const compiler = await compile(input, {
  base: '/',
  loadStylesheet: async (id, base) => ({
    path: id,
    base,
    content: id === UTILITIES_ID ? utilitiesSource : themeSource,
  }),
  loadModule: async (id, base) => {
    const mod = modules[id];

    if (!mod) {
      throw new Error(`Cannot load Tailwind plugin ${id}`);
    }

    return { path: id, base, module: mod.default ?? mod };
  },
});

const html = String(payload.html || '');
const scanner = new Scanner({ sources: [] });
const scanned = scanner.scanFiles([{ content: html, extension: 'html' }]);
const candidates = scanned.filter((name) => name && !skip.has(name));

if (!candidates.length) {
  process.stdout.write('');
  process.exit(0);
}

process.stdout.write(compiler.build(candidates));
