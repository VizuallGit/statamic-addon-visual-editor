#!/usr/bin/env node
/**
 * The Control Panel loads whatever the manifest names. Leftover hashed
 * files from earlier builds must stay on disk (`emptyOutDir: false`); they
 * are not the live editor.
 *
 * This check is the lock: every file the *current* manifest names must
 * exist, and every static import in leftover addon-*.js files must still
 * exist — Vite must not have deleted a chunk an older addon.js still
 * points at.
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

function staticImports(source) {
  const importRe = /from\s*["']\.\/([^"']+\.js)["']/g;
  const names = [];
  let match;

  while ((match = importRe.exec(source))) {
    names.push(match[1]);
  }

  return names;
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

const liveAddonRel = manifest['resources/js/addon.js']?.file;

if (!liveAddonRel) {
  fail('Visual Editor manifest has no resources/js/addon.js.');
}

const liveAddonPath = join(BUILD, liveAddonRel);

if (!existsSync(liveAddonPath)) {
  fail(`Visual Editor manifest names ${liveAddonRel}, but that file is gone.`);
}

const addonFiles = existsSync(ASSETS)
  ? readdirSync(ASSETS).filter((name) => /^addon-[A-Za-z0-9_-]+\.js$/.test(name))
  : [];

if (!addonFiles.length) {
  fail('Visual Editor build has no addon-*.js. Do not empty resources/dist/build.');
}

const imported = new Set();

for (const name of addonFiles) {
  for (const spec of staticImports(readFileSync(join(ASSETS, name), 'utf8'))) {
    imported.add(spec);
  }
}

for (const name of imported) {
  if (!existsSync(join(ASSETS, name))) {
    missing.push(`${name} (imported by an addon-*.js still on disk)`);
  }
}

const overlayFromLive = staticImports(readFileSync(liveAddonPath, 'utf8')).find((name) =>
  name.startsWith('overlay-host-')
);
const overlayFromManifest = manifest['resources/js/overlay-host.js']?.file?.replace(/^assets\//, '');

if (overlayFromLive && overlayFromManifest && overlayFromLive !== overlayFromManifest) {
  fail(
    `Visual Editor build is split: live addon.js imports ${overlayFromLive} but the manifest names ${overlayFromManifest}. ` +
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

console.log('Dist integrity ok: manifest files exist, leftover addon.js imports exist.');
