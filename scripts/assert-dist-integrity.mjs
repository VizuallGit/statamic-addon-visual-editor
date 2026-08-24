#!/usr/bin/env node
/**
 * addon.js imports overlay-host by a hashed filename. A Vite build of
 * overlay-host alone writes a new hash and can delete the old file.
 * The Control Panel then loads nothing.
 *
 * This check is the lock: every import in addon-*.js must exist on disk,
 * and the manifest must name a file that exists.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(ROOT, 'resources/dist/build');
const ASSETS = join(BUILD, 'assets');
const MANIFEST = join(BUILD, 'manifest.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync(MANIFEST)) {
  fail(`Visual Editor build is missing: ${MANIFEST}`);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const missing = [];

for (const [entry, resolved] of Object.entries(manifest)) {
  if (!resolved?.file) {
    continue;
  }

  const file = join(BUILD, resolved.file);

  if (!existsSync(file)) {
    missing.push(`${resolved.file} (manifest ${entry})`);
  }
}

const addonFiles = existsSync(ASSETS)
  ? readdirSync(ASSETS).filter((name) => /^addon-[A-Za-z0-9_-]+\.js$/.test(name))
  : [];

if (!addonFiles.length) {
  fail('Visual Editor build has no addon-*.js. Do not empty resources/dist/build.');
}

const importRe = /from\s*["']\.\/([^"']+\.js)["']/g;
const imported = new Set();

for (const name of addonFiles) {
  const source = readFileSync(join(ASSETS, name), 'utf8');
  let match;

  while ((match = importRe.exec(source))) {
    imported.add(match[1]);
  }
}

for (const name of imported) {
  if (!existsSync(join(ASSETS, name))) {
    missing.push(`${name} (imported by addon.js)`);
  }
}

const overlayFromAddon = [...imported].find((name) => name.startsWith('overlay-host-'));
const overlayFromManifest = manifest['resources/js/overlay-host.js']?.file?.replace(/^assets\//, '');

if (overlayFromAddon && overlayFromManifest && overlayFromAddon !== overlayFromManifest) {
  fail(
    `Visual Editor build is split: addon.js imports ${overlayFromAddon} but the manifest names ${overlayFromManifest}. ` +
      'Never rebuild overlay-host, preview or bridge alone. Never delete hashed files in resources/dist/build/assets.'
  );
}

if (missing.length) {
  fail(
    'Visual Editor build is broken — a file addon.js needs is gone:\n  - ' +
      missing.join('\n  - ') +
      '\nNever rebuild one entry. Never write public/vendor. The live build is resources/dist/build.'
  );
}

console.log('Dist integrity ok: addon.js imports exist, manifest files exist.');
