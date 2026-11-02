// A function called in a CP module must be imported or declared there. Vue swallows a
// handler's ReferenceError into console.error, so a missing import never fails a page —
// only the rest of the handler (lp-more-menu.js's Reset, v1.1.702–707: `applyZones`
// without its import, the import line swallowed by the doc comment above it).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'resources', 'js');
const walk = (dir) => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : path.endsWith('.js') ? [path] : []; });
const files = walk(ROOT);
// Comments blanked, lines kept: a name in a comment is neither a call nor a declaration.
const noBlockComments = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, before) => before + ' '.repeat(m.length - before.length));
const IDENT = '[A-Za-z_$][\\w$]*';

test('no import statement is swallowed by a comment', () => {
  const swallowed = [];

  for (const file of files) {
    const source = readFileSync(file, 'utf8');

    for (const block of source.matchAll(/\/\*[\s\S]*?\*\//g)) {
      if (/\bimport\s*\{[^}]*\}\s*from\s*['"][^'"]+['"]\s*;/.test(block[0])) {
        swallowed.push(`${relative(ROOT, file)}:${source.slice(0, block.index).split('\n').length}`);
      }
    }
  }

  assert.deepEqual(swallowed, []);
});

test('every function a module calls from a sibling module is imported there', () => {
  // The named exports of each module, and which modules export each name.
  const owners = new Map();

  for (const file of files) {
    const source = noBlockComments(readFileSync(file, 'utf8'));
    const names = new Set();

    for (const m of source.matchAll(new RegExp(`^export\\s+(?:async\\s+)?function\\s*\\*?\\s*(${IDENT})`, 'gm'))) names.add(m[1]);
    for (const m of source.matchAll(/^export\s*\{([^}]*)\}/gm)) {
      m[1].split(',').forEach((part) => { const name = part.trim().split(/\s+as\s+/).pop(); if (name) names.add(name); });
    }

    names.forEach((name) => owners.set(name, [...(owners.get(name) || []), file]));
  }

  const missing = [];

  for (const file of files) {
    const source = noBlockComments(readFileSync(file, 'utf8'));
    const seen = new Set();

    for (const m of source.matchAll(new RegExp(`(^|[^.\\w$])(${IDENT})\\s*\\(`, 'g'))) {
      const name = m[2];

      if (seen.has(name) || !owners.has(name) || owners.get(name).includes(file) || name in globalThis) continue;

      seen.add(name);

      // Declared here: imported, a function or variable of this module, a parameter, a
      // method (`name(args) {`), or any other mention that is not a call.
      const declared =
        new RegExp(`import\\s*(?:${IDENT}\\s*,\\s*)?\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from`).test(source) ||
        new RegExp(`\\bfunction\\s*\\*?\\s*${name}\\s*\\(`).test(source) ||
        new RegExp(`^\\s*(?:async\\s+)?(?:\\*\\s*)?${name}\\s*\\([^)]*\\)\\s*\\{`, 'm').test(source) ||
        new RegExp(`\\b${name}\\b(?!\\s*\\()`).test(source);

      if (!declared) {
        missing.push(`${relative(ROOT, file)}:${source.slice(0, m.index).split('\n').length} ${name} (exported by ${owners.get(name).map((f) => relative(ROOT, f)).join(', ')})`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
