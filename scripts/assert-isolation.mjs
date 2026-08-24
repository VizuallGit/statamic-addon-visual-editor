#!/usr/bin/env node
/**
 * Surfaces under resources/js/cp/ must not import the preview kernel or cp.js.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(process.cwd(), 'resources/js/cp');
const FORBIDDEN = [
  'overlay-host.js',
  'preview.js',
  'bridge.js',
  'replayLivePreview',
  'watchPreviewRenders',
  'gotoOverlay',
  'openOverlay',
  "from '../cp.js'",
  'from "../../cp.js"',
  "from './cp.js'",
];

function walk(dir) {
  const out = [];

  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      out.push(...walk(path));
    } else if (/\.(js|vue)$/.test(name)) {
      out.push(path);
    }
  }

  return out;
}

const hits = [];

for (const file of walk(ROOT)) {
  const text = readFileSync(file, 'utf8');

  for (const needle of FORBIDDEN) {
    if (text.includes(needle)) {
      hits.push(`${relative(process.cwd(), file)} → ${needle}`);
    }
  }
}

if (hits.length) {
  console.error('Isolation failed:\n' + hits.join('\n'));
  process.exit(1);
}

console.log('Isolation ok: cp/ surfaces do not import the preview kernel.');
