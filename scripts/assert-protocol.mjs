#!/usr/bin/env node
/**
 * Protocol lint: message types and the source mark are written once, in
 * resources/js/lib/protocol.js, and used by name everywhere else.
 *
 * Fails when a module (not the standalone scripts, which cannot import):
 *   1. spells the source mark as a string literal;
 *   2. sends a message whose `type:` is a string literal, inside an object
 *      that carries `source:`;
 *   3. compares a message's `.type` (read off `data`, `e.data`, `msg`, …)
 *      against a string literal.
 *
 * Bard node types, input types and the like are not messages and are left
 * alone: the rule only looks where a message is built or read.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../resources/js/', import.meta.url).pathname;
const STANDALONE = new Set(['dock-instant-preview.js', 'dedupe-cp-fetch.js']);
const SRC = "'statamic-visual-editor'";

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith('.js')) yield p;
  }
}

function enclosingObject(s, pos) {
  let depth = 0;
  let i = pos;
  for (; i >= 0; i--) {
    if (s[i] === '}') depth++;
    else if (s[i] === '{') { if (depth === 0) break; depth--; }
  }
  if (i < 0) return null;
  const start = i;
  depth = 0;
  for (let j = start; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}' && --depth === 0) return s.slice(start, j + 1);
  }
  return null;
}

const problems = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  if (STANDALONE.has(rel) || rel === 'lib/protocol.js') continue;
  const s = readFileSync(file, 'utf8');
  const line = (idx) => s.slice(0, idx).split('\n').length;
  for (const m of s.matchAll(new RegExp(SRC, 'g'))) problems.push(`${rel}:${line(m.index)} the source mark as a literal — use SOURCE from lib/protocol.js`);
  for (const m of s.matchAll(/source:\s*SOURCE/g)) {
    const obj = enclosingObject(s, m.index);
    const t = obj && obj.match(/^\{[^{}]*?type:\s*'([\w.:-]+)'/s);
    if (t) problems.push(`${rel}:${line(m.index)} sends type '${t[1]}' as a literal — use MSG.${t[1].toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`);
  }
  // A message is read off `data`, `e.data`, `event.data`, `msg`, `message` or
  // `payload`; a Bard node's `.type` or a `typeof x.type` is not a message.
  for (const m of s.matchAll(/(?<!typeof\s)(?:\bdata|\be\.data|\bevent\.data|\bev\.data|\bmsg|\bmessage|\bpayload)\??\.type\s*(?:===|!==)\s*'([\w.:-]+)'/g)) problems.push(`${rel}:${line(m.index)} compares a message type against '${m[1]}' — use MSG.*`);
}

if (problems.length) {
  console.error(`Protocol lint failed (${problems.length}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('Protocol ok: every message type and the source mark come from lib/protocol.js.');
