#!/usr/bin/env node
/**
 * Refuses a push to main that silently rolls back recent work.
 *
 * Why: v1.1.442 (5 Oct 2026) was moved onto origin/main by copying whole files
 * from a checkout three commits behind. The Alt button in the CSS pane, added
 * the night before, vanished without a conflict or a failing test.
 *
 * What it checks: each change (hunk) the last 15 commits on main made to a
 * file this push also changes. A hunk counts as rolled back when every line
 * it added is gone again and every line it removed is back — the signature of
 * a file copied from an older checkout. Rewriting your own recent code does
 * not trip it: some of what was added stays, or what was removed stays gone.
 *
 * resources/dist is left out; it is rebuilt from the source this checks.
 *
 * When a rollback is intended, read the list and push again with
 * SVE_ALLOW_ROLLBACK=1.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const ZERO = /^0+$/;
const RECENT = 15;
const SKIP = [':(exclude)resources/dist'];

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

/** A line worth comparing: not blank, not a lone brace. */
const meaningful = (text) => text.length > 3 && !/^[{}()\[\];,]*$/.test(text);

const fileCache = new Map();

function lineCounts(rev, file) {
  const id = `${rev}:${file}`;

  if (!fileCache.has(id)) {
    const counts = new Map();
    let text = '';

    try {
      text = git('show', id);
    } catch {
      text = '';
    }

    for (const line of text.split('\n')) {
      const k = line.trim();
      counts.set(k, (counts.get(k) || 0) + 1);
    }

    fileCache.set(id, counts);
  }

  return fileCache.get(id);
}

/** The hunks of the last commits up to `base`, per file, as added/removed lines. */
function recentHunks(base) {
  const hunks = [];
  let commit = '';
  let file = '';
  let hunk = null;

  const log = git(
    'log',
    `-${RECENT}`,
    '--first-parent',
    '--format=@@commit %h %s',
    '-p',
    '--unified=0',
    base,
    '--',
    '.',
    ...SKIP
  );

  for (const line of log.split('\n')) {
    if (line.startsWith('@@commit ')) {
      commit = line.slice(9);
    } else if (line.startsWith('+++ ')) {
      file = line.replace(/^\+\+\+ (b\/)?/, '');
    } else if (line.startsWith('--- ')) {
      continue;
    } else if (line.startsWith('@@')) {
      hunk = { commit, file, added: [], removed: [] };
      hunks.push(hunk);
    } else if (hunk && line.startsWith('+') && meaningful(line.slice(1).trim())) {
      hunk.added.push(line.slice(1).trim());
    } else if (hunk && line.startsWith('-') && meaningful(line.slice(1).trim())) {
      hunk.removed.push(line.slice(1).trim());
    }
  }

  return hunks;
}

function rolledBack(hunk, base, next) {
  const before = lineCounts(base, hunk.file);
  const after = lineCounts(next, hunk.file);
  // Only what the hunk added that is still there at the base: a later commit
  // may already have changed it, and that is not this push's doing.
  const added = hunk.added.filter((line) => (before.get(line) || 0) > 0);

  if (!added.length && !hunk.removed.length) {
    return false;
  }

  const gone = added.every((line) => (after.get(line) || 0) < (before.get(line) || 0));
  const back = hunk.removed.every((line) => (after.get(line) || 0) > (before.get(line) || 0));

  return gone && back;
}

const input = fs.readFileSync(0, 'utf8').trim();
const found = [];

for (const row of input ? input.split('\n') : []) {
  const [, localSha, remoteRef, remoteSha] = row.split(' ');

  if (remoteRef !== 'refs/heads/main' || ZERO.test(localSha) || ZERO.test(remoteSha)) {
    continue;
  }

  try {
    git('cat-file', '-e', `${remoteSha}^{commit}`);
  } catch {
    console.error(`pre-push: origin/main (${remoteSha.slice(0, 7)}) is not in this checkout. Run git fetch first.`);
    process.exit(1);
  }

  const changed = new Set(
    git('diff', '--name-only', remoteSha, localSha, '--', '.', ...SKIP)
      .split('\n')
      .filter(Boolean)
  );

  for (const hunk of recentHunks(remoteSha)) {
    if (changed.has(hunk.file) && rolledBack(hunk, remoteSha, localSha)) {
      found.push(hunk);
    }
  }
}

if (found.length) {
  console.error(`\npre-push: this push rolls back ${found.length} recent change(s) on main:\n`);

  for (const hunk of found) {
    console.error(`  ${hunk.file}  (from ${hunk.commit})`);
    hunk.added.forEach((line) => console.error(`    gone again: ${line}`));
    hunk.removed.forEach((line) => console.error(`    back again: ${line}`));
  }

  if (process.env.SVE_ALLOW_ROLLBACK === '1') {
    console.error('\npre-push: SVE_ALLOW_ROLLBACK=1, pushing anyway.\n');
    process.exit(0);
  }

  console.error('\nNothing was pushed. Was the checkout behind origin/main? Merge, do not copy files.');
  console.error('If every change above is meant to be undone, push again with SVE_ALLOW_ROLLBACK=1.\n');
  process.exit(1);
}
