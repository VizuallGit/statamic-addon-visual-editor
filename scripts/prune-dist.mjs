#!/usr/bin/env node
/**
 * Prune the built dist to what is live.
 *
 * `emptyOutDir: false` keeps every hashed file any build ever wrote, so
 * resources/dist/build grew to thousands of files and hundreds of megabytes —
 * all of it shipped in every Composer tarball, none of it loaded. Worse, a
 * stale file of a name something still asked for could be served as if it
 * were current (that is how a second, old copy of the editor once ran beside
 * the live one).
 *
 * After a full `vite build` this keeps, and deletes everything else:
 *   build/    manifest.json + every file the manifest names, plus any chunk
 *             one of those files imports (transitively; normally the same set)
 *   locked/   the live addon.js and the chunks it imports, copied fresh from
 *             the build — the recovery set BuiltAssets::recover() restores
 *             from on the site — and nothing older
 *
 * Runs at the end of `npm run cp:build`. `--dry` only reports.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(ROOT, 'resources/dist/build');
const ASSETS = join(BUILD, 'assets');
const LOCKED = join(ROOT, 'resources/dist/locked');
const DRY = process.argv.includes('--dry');

const manifest = JSON.parse(readFileSync(join(BUILD, 'manifest.json'), 'utf8'));

/** Chunk names a built file pulls in: `from "./x.js"` and `import("./x.js")`. */
function chunkImports(file) {
  const re = /(?:from\s*|import\()\s*["']\.\/([^"']+\.js)["']/g;
  const names = new Set();
  const source = readFileSync(file, 'utf8');
  let m;
  while ((m = re.exec(source))) names.add(m[1]);
  return [...names];
}

/** Everything reachable from `starts` (basenames under `dirs`, first hit wins). */
function closure(starts, dirs) {
  const keep = new Set();
  const queue = [...starts];
  while (queue.length) {
    const name = queue.shift();
    if (keep.has(name)) continue;
    keep.add(name);
    const file = dirs.map((d) => join(d, name)).find((p) => existsSync(p));
    if (file && name.endsWith('.js')) queue.push(...chunkImports(file));
  }
  return keep;
}

// build/assets: what the manifest names, and what those files import
const named = new Set();
for (const entry of Object.values(manifest)) {
  for (const rel of [entry.file, ...(entry.css || []), ...(entry.assets || [])]) named.add(rel.replace(/^assets\//, ''));
}
const keepAssets = closure([...named], [ASSETS]);

// locked/: the live addon and its imports only — refreshed from the build
// first (what BuiltAssets::refreshLock does on the site after a good boot),
// then everything older goes.
const liveAddon = manifest['resources/js/addon.js']?.file?.replace(/^assets\//, '');
if (!liveAddon) { console.error('manifest has no resources/js/addon.js'); process.exit(1); }
const keepLocked = closure([liveAddon], [ASSETS, LOCKED]);
if (!DRY) {
  mkdirSync(LOCKED, { recursive: true });
  for (const name of keepLocked) {
    const from = join(ASSETS, name);
    if (existsSync(from)) copyFileSync(from, join(LOCKED, name));
  }
}

function prune(dir, keep, label) {
  if (!existsSync(dir)) return { removed: 0, bytes: 0, kept: 0 };
  let removed = 0, bytes = 0, kept = 0;
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (!statSync(file).isFile()) continue;
    if (keep.has(name)) { kept++; continue; }
    bytes += statSync(file).size;
    removed++;
    if (!DRY) unlinkSync(file);
  }
  console.log(`${label}: kept ${kept}, ${DRY ? 'would remove' : 'removed'} ${removed} (${(bytes / 1e6).toFixed(1)} MB)`);
  return { removed, bytes, kept };
}

prune(ASSETS, keepAssets, 'build/assets');
prune(LOCKED, keepLocked, 'locked');
