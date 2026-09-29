#!/usr/bin/env node
/**
 * Dist integrity: what the Control Panel will actually load must exist.
 *
 * The live editor is whatever `resources/dist/build/manifest.json` names.
 * Leftover hashed files from earlier builds stay on disk (`emptyOutDir: false`)
 * but they are not live, so they are not checked — an old addon-*.js that
 * points at a chunk long gone is history, not a broken build.
 *
 * What is checked:
 *   1. every file the manifest names exists;
 *   2. every chunk the live addon.js imports (static or dynamic) exists, and
 *      every chunk those import, all the way down — addon.js loads the Live
 *      Preview cluster (lp-cluster) with import(), and the cluster is what
 *      imports overlay-host and the lazy panels;
 *   3. the same for the recovery copies in resources/dist/locked/, which
 *      BuiltAssets::recover() restores from when a chunk goes missing;
 *   4. the overlay-host the live addon.js reaches (directly or through the
 *      cluster) is the one the manifest names — a split build means one entry
 *      was rebuilt alone.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAst } from 'rollup/parseAst';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(ROOT, 'resources/dist/build');
const ASSETS = join(BUILD, 'assets');
const LOCKED = join(ROOT, 'resources/dist/locked');
const MANIFEST = join(BUILD, 'manifest.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

/** Chunk names a built file pulls in: `from "./x.js"` and `import("./x.js")`. */
function chunkImports(source) {
  const re = /(?:from\s*|import\()\s*["']\.\/([^"']+\.js)["']/g;
  const names = new Set();
  let match;

  while ((match = re.exec(source))) {
    names.add(match[1]);
  }

  return [...names];
}

/**
 * Every chunk reachable from `start` (a basename), looked up in `dirs` in order.
 * Returns the names found and the names missing from all of them, each with the
 * chunk that asked for it.
 */
function chunkClosure(start, dirs) {
  const seen = new Set([start]);
  const queue = [start];
  const missing = [];

  while (queue.length) {
    const name = queue.shift();
    const file = dirs.map((dir) => join(dir, name)).find((path) => existsSync(path));

    if (!file) {
      continue;
    }

    for (const child of chunkImports(readFileSync(file, 'utf8'))) {
      if (seen.has(child)) {
        continue;
      }

      seen.add(child);

      if (dirs.some((dir) => existsSync(join(dir, child)))) {
        queue.push(child);
      } else {
        missing.push({ name: child, from: name });
      }
    }
  }

  return { names: [...seen], missing };
}

if (!existsSync(MANIFEST)) {
  fail(`Visual Editor build is missing: ${MANIFEST}`);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const missing = [];

// 1. Manifest files.
for (const [entry, resolved] of Object.entries(manifest)) {
  for (const rel of [resolved?.file, ...(resolved?.css || [])]) {
    if (rel && !existsSync(join(BUILD, rel))) {
      missing.push(`${rel} (manifest ${entry})`);
    }
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

// 2. Chunks the live addon.js reaches, directly or through the chunks it imports.
const liveAddonName = liveAddonRel.replace(/^assets\//, '');
const live = chunkClosure(liveAddonName, [ASSETS]);

for (const { name, from } of live.missing) {
  missing.push(`${name} (imported by live ${from === liveAddonName ? liveAddonRel : from})`);
}

// 3. Recovery copies: each locked addon-*.js must be able to resolve its imports,
//    all the way down, from locked/ or assets/, or BuiltAssets::recover() has
//    nothing to restore.
if (existsSync(LOCKED)) {
  const lockedAddons = readdirSync(LOCKED).filter((name) => /^addon-[A-Za-z0-9_-]+\.js$/.test(name));

  for (const addon of lockedAddons) {
    for (const { name, from } of chunkClosure(addon, [LOCKED, ASSETS]).missing) {
      missing.push(`${name} (imported by ${from} under locked ${addon}, found neither in locked/ nor assets/)`);
    }
  }
}

// 4. One build, not a split one.
const overlaysFromLive = live.names.filter((name) => name.startsWith('overlay-host-'));
const overlayFromManifest = manifest['resources/js/overlay-host.js']?.file?.replace(/^assets\//, '');
const strayOverlay = overlaysFromLive.find((name) => name !== overlayFromManifest);

if (strayOverlay && overlayFromManifest) {
  fail(
    `Visual Editor build is split: live addon.js reaches ${strayOverlay} but the manifest names ${overlayFromManifest}. ` +
      'Never rebuild overlay-host, preview or bridge alone. Always `npm run cp:build` as one build.'
  );
}

if (missing.length) {
  fail(
    'Visual Editor build is broken — a file the live editor needs is gone:\n  - ' +
      missing.join('\n  - ') +
      '\nNever rebuild one entry. Never write public/vendor by hand. The live build is resources/dist/build.'
  );
}

/**
 * No chunk may import a bare module name.
 *
 * Vite bundles what it can resolve and leaves the rest as an `import "name"`
 * for the browser — which cannot resolve bare names, so the whole chunk fails
 * to load, silently, for whoever imports it. v1.1.254 shipped tw-compile with
 * `import "mini-svg-data-uri"` (a dependency of @tailwindcss/forms that was not
 * installed here), and every Tailwind suggestion in the dock went empty until
 * v1.1.263. A build with a bare import is not a build.
 *
 * Parsed with Rollup's own parser, not a regex: minified code is full of the
 * words `import` and `export` next to strings that are not imports.
 */
function moduleSpecifiers(source) {
  const specs = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(visit);

      return;
    }

    if (
      (node.type === 'ImportDeclaration'
        || node.type === 'ExportNamedDeclaration'
        || node.type === 'ExportAllDeclaration'
        || node.type === 'ImportExpression')
      && node.source?.type === 'Literal'
    ) {
      specs.push(String(node.source.value));
    }

    for (const key of Object.keys(node)) {
      if (key !== 'type' && key !== 'loc' && key !== 'range') {
        visit(node[key]);
      }
    }
  };

  visit(parseAst(source));

  return specs;
}

const bare = [];

for (const name of readdirSync(ASSETS)) {
  if (!name.endsWith('.js')) {
    continue;
  }

  for (const spec of moduleSpecifiers(readFileSync(join(ASSETS, name), 'utf8'))) {
    if (!/^(?:\.|\/|https?:|data:)/.test(spec)) {
      bare.push(`${name} → ${spec}`);
    }
  }
}

if (bare.length) {
  fail(
    'Visual Editor build has bare imports the browser cannot resolve (a dependency missing from node_modules at build time):\n  '
    + [...new Set(bare)].join('\n  ')
  );
}

console.log('Dist integrity ok: manifest files, live addon.js imports and locked recovery copies all exist; no bare imports.');
