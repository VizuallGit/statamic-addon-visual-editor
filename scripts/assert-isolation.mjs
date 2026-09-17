#!/usr/bin/env node
/**
 * Surface isolation for resources/js.
 *
 * Three zones, three rules:
 *
 *   kernel   preview.js, overlay-host.js, bridge.js (+ the bridge-side modules
 *            listed in KERNEL_SIDE) run inside the preview document. They may
 *            import each other and npm packages, never the CP shell or a panel.
 *
 *   cp/      Vue surfaces and stores. May not import the kernel, the CP shell
 *            (cp.js) or the Live Preview lifecycle (lp-replay.js). Hard rule,
 *            no exceptions.
 *
 *   panels   everything else under resources/js. The same needles are
 *            forbidden, but the V1 code still reaches into cp.js and the replay
 *            core from many places. Those hits are listed, per file, in
 *            scripts/isolation-allowlist.json. The list may only shrink: a hit
 *            not on it fails, and an entry that no longer matches fails too, so
 *            nobody carries dead exemptions around.
 *
 *   npm run isolate            — check
 *   node scripts/assert-isolation.mjs --write-allowlist
 *                              — regenerate the list after removing coupling
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const JS = join(ROOT, 'resources/js');
const ALLOWLIST = join(ROOT, 'scripts/isolation-allowlist.json');

const KERNEL = ['preview.js', 'overlay-host.js', 'bridge.js'];
/** Modules that run in the preview document alongside bridge.js. */
const KERNEL_SIDE = ['html-pick-align.js', 'ai-text-bridge.js', 'ai-text-icon.js'];
/** The CP shell: boot, the Live Preview lifecycle and the section-scope wrapper it uses. */
const SHELL = ['addon.js', 'cp.js', 'lp-replay.js', 'preview-section-scope.js'];

/** What a non-kernel file may not reach for. Each needle is a RegExp over the source. */
const NEEDLES = {
  'import preview.js': /from\s*['"](?:\.\.?\/)+(?:[\w-]+\/)*preview\.js['"]|import\(\s*['"](?:\.\.?\/)+(?:[\w-]+\/)*preview\.js['"]/,
  'import overlay-host.js': /from\s*['"](?:\.\.?\/)+(?:[\w-]+\/)*overlay-host\.js['"]|import\(\s*['"](?:\.\.?\/)+(?:[\w-]+\/)*overlay-host\.js['"]/,
  'import bridge.js': /from\s*['"](?:\.\.?\/)+(?:[\w-]+\/)*bridge\.js['"]|import\(\s*['"](?:\.\.?\/)+(?:[\w-]+\/)*bridge\.js['"]/,
  'import cp.js': /from\s*['"](?:\.\.?\/)+cp\.js['"]|import\(\s*['"](?:\.\.?\/)+cp\.js['"]/,
  'import lp-replay.js': /from\s*['"](?:\.\.?\/)+lp-replay\.js['"]/,
  replayLivePreview: /\breplayLivePreview\b/,
  watchPreviewRenders: /\bwatchPreviewRenders\b/,
  gotoOverlay: /\bgotoOverlay\b/,
  openOverlay: /\bopenOverlay\b/,
};

function walk(dir) {
  const out = [];

  for (const name of readdirSync(dir)) {
    const path = join(dir, name);

    if (statSync(path).isDirectory()) {
      out.push(...walk(path));
    } else if (/\.(js|vue)$/.test(name)) {
      out.push(path);
    }
  }

  return out;
}

const hits = {}; // file -> [needle]

for (const file of walk(JS)) {
  const rel = relative(JS, file);
  const base = rel.split('/').pop();

  if (SHELL.includes(rel) || rel.startsWith('lib/')) {
    continue;
  }

  const text = readFileSync(file, 'utf8');

  if (KERNEL.includes(rel) || KERNEL_SIDE.includes(rel)) {
    // Kernel may import only kernel, kernel-side modules, lib/ and packages.
    const imports = [...text.matchAll(/from\s*['"](\.\.?\/[^'"]+)['"]/g)].map((m) => m[1]);
    const bad = imports
      .filter((spec) => !/\/lib\/[\w-]+\.js$/.test(spec))
      .map((spec) => spec.split('/').pop())
      .filter((name) => !KERNEL.includes(name) && !KERNEL_SIDE.includes(name));

    if (bad.length) {
      hits[rel] = bad.map((name) => `kernel imports ${name}`);
    }

    continue;
  }

  const found = Object.entries(NEEDLES)
    .filter(([, re]) => re.test(text))
    .map(([name]) => name);

  if (found.length) {
    hits[rel] = found;
  }
}

if (process.argv.includes('--write-allowlist')) {
  const list = Object.fromEntries(Object.entries(hits).filter(([rel]) => !rel.startsWith('cp/')).sort());
  writeFileSync(ALLOWLIST, JSON.stringify(list, null, 2) + '\n');
  console.log(`Wrote ${Object.keys(list).length} allow-listed files to scripts/isolation-allowlist.json`);
  process.exit(0);
}

const allow = JSON.parse(readFileSync(ALLOWLIST, 'utf8'));
const problems = [];

for (const [rel, found] of Object.entries(hits)) {
  if (rel.startsWith('cp/')) {
    problems.push(`${rel} → ${found.join(', ')}  (cp/ surfaces may never do this)`);
    continue;
  }

  const allowed = allow[rel] || [];
  const fresh = found.filter((name) => !allowed.includes(name));

  if (fresh.length) {
    problems.push(`${rel} → ${fresh.join(', ')}  (new coupling; talk to the shell through cp/bus.js instead)`);
  }
}

for (const [rel, allowed] of Object.entries(allow)) {
  const found = hits[rel] || [];
  const stale = allowed.filter((name) => !found.includes(name));

  if (stale.length) {
    problems.push(`${rel} → ${stale.join(', ')}  (allow-list entry is stale: remove it from scripts/isolation-allowlist.json)`);
  }
}

if (problems.length) {
  console.error('Isolation failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}

const remaining = Object.values(allow).reduce((n, list) => n + list.length, 0);
console.log(`Isolation ok. cp/ clean; kernel imports only kernel; ${Object.keys(allow).length} panel files still carry ${remaining} allow-listed couplings to burn down.`);
