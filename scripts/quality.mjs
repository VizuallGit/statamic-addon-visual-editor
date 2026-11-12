#!/usr/bin/env node
/**
 * The quality gate (quality pass, phase 1: "the lock"). Every tool runs
 * against a baseline of today's findings in quality-baseline/, so existing
 * debt passes and anything new fails. Numbers may only go down.
 *
 *   node scripts/quality.mjs js        npm run quality
 *   node scripts/quality.mjs php       composer quality
 *   node scripts/quality.mjs all       the pre-push hook
 *   node scripts/quality.mjs all --update
 *       after a clean-up: write the lower numbers into the baselines. It never
 *       raises one. Raising a baseline (a new big file, a heavier chunk) is a
 *       hand edit of quality-baseline/*.json that the owner approves.
 *
 * Checks:
 *   eslint     rules marked 'error' in eslint.config.mjs; old findings frozen in eslint-suppressions.json
 *   prettier   every file not listed in quality-baseline/prettier.json is formatted
 *   knip       no new dead file, unused export or unused dependency (run twice: with and without tests as users)
 *   jscpd      copied code (clones, lines) does not grow
 *   bigfiles   no JS/Vue file over 1000 lines and no PHP class over 300 lines grows; no new one crosses the line
 *   catches    no file gets another silent catch (empty once comments are taken out)
 *   budgets    no built entry or lazy chunk, with everything it imports, grows more than 5 %
 *   phpstan    level 5, old findings in phpstan-baseline.neon
 *   pint       every PHP file not listed in quality-baseline/pint.json is formatted
 *   rector     no PHP file gets more Rector findings than it had (dry run; strict_types left out)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const BASE = join(ROOT, 'quality-baseline');
const args = process.argv.slice(2);
const scope = args.find((a) => !a.startsWith('--')) || 'all';
const UPDATE = args.includes('--update');
const BIG = { js: 1000, php: 300 };
const BUDGET_SLACK = 1.05;

const bin = (name) => join(ROOT, 'node_modules/.bin', name);
const rel = (file) => relative(ROOT, file);
const readJson = (name, fallback) =>
  existsSync(join(BASE, name)) ? JSON.parse(readFileSync(join(BASE, name), 'utf8')) : fallback;
const writeJson = (name, data) => writeFileSync(join(BASE, name), `${JSON.stringify(data, null, 2)}\n`);
const sorted = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, test, out);
    else if (test(entry.name)) out.push(path);
  }

  return out;
}

const lineCount = (file) => {
  const text = readFileSync(file, 'utf8');

  return text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
};

/** A set baseline: what is listed may stay, nothing new may come. --update keeps only what is still there. */
function setCheck(name, current, describe) {
  const file = `${name}.json`;
  const base = readJson(file, null);

  if (!base) {
    writeJson(file, [...current].sort());

    return { ok: true, note: `baseline created: ${current.size}` };
  }

  const known = new Set(base);
  const added = [...current].filter((k) => !known.has(k));
  const gone = base.filter((k) => !current.has(k));

  if (UPDATE && !added.length && gone.length)
    writeJson(
      file,
      base.filter((k) => current.has(k))
    );

  return {
    ok: !added.length,
    note: `${current.size} (baseline ${base.length}${gone.length ? `, ${gone.length} fixed${UPDATE ? ' and removed' : ': run --update'}` : ''})`,
    detail: added.slice(0, 25).map(describe),
    more: Math.max(0, added.length - 25),
  };
}

/** A count baseline per key: no key may grow; a new key may not appear. --update lowers. */
function countCheck(name, current, describe) {
  const file = `${name}.json`;
  const base = readJson(file, null);

  if (!base) {
    writeJson(file, sorted(current));

    return { ok: true, note: `baseline created: ${Object.keys(current).length} files` };
  }

  const worse = Object.entries(current).filter(([k, n]) => n > (base[k] ?? 0));
  const total = (o) => Object.values(o).reduce((s, n) => s + n, 0);

  if (UPDATE && !worse.length) {
    writeJson(
      file,
      sorted(
        Object.fromEntries(
          Object.entries(base)
            .map(([k, n]) => [k, Math.min(n, current[k] ?? 0)])
            .filter(([, n]) => n > 0)
        )
      )
    );
  }

  return {
    ok: !worse.length,
    note: `${Object.keys(current).length} files, ${total(current)} in all (baseline ${Object.keys(base).length} files, ${total(base)})`,
    detail: worse.slice(0, 25).map(([k, n]) => describe(k, n, base[k] ?? 0)),
  };
}

const checks = {
  js: {
    eslint() {
      const run = spawnSync(
        bin('eslint'),
        ['.', '--quiet', '--cache', '--cache-location', join(ROOT, '.eslintcache'), '--format', 'json'],
        { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
      );
      if (run.status === 0 && UPDATE) spawnSync(bin('eslint'), ['.', '--prune-suppressions'], { cwd: ROOT });
      let lines;
      try {
        lines = JSON.parse(run.stdout).flatMap((file) =>
          file.messages.map((m) => `${rel(file.filePath)}:${m.line}:${m.column} ${m.message} (${m.ruleId})`)
        );
      } catch {
        lines = [(run.stderr || run.stdout || '').trim().split('\n')[0]];
      }

      return {
        ok: run.status === 0,
        note: run.status === 0 ? 'no new errors' : `${lines.length} new`,
        detail: lines.slice(0, 25),
      };
    },

    async prettier() {
      const prettier = await import(join(ROOT, 'node_modules/prettier/index.mjs'));
      const files = [
        ...walk(join(ROOT, 'resources/js'), (n) => /\.(js|mjs|vue|css)$/.test(n)),
        ...walk(join(ROOT, 'scripts'), (n) => /\.(js|mjs)$/.test(n)),
        ...walk(join(ROOT, 'tests'), (n) => /\.(js|mjs)$/.test(n)),
        ...readdirSync(ROOT)
          .filter((n) => /\.(js|mjs)$/.test(n))
          .map((n) => join(ROOT, n)),
      ];
      const unformatted = new Set();

      for (const file of files) {
        const info = await prettier.getFileInfo(file, { ignorePath: join(ROOT, '.prettierignore') });
        if (info.ignored || !info.inferredParser) continue;
        const options = await prettier.resolveConfig(file);
        if (!(await prettier.check(readFileSync(file, 'utf8'), { ...options, filepath: file })))
          unformatted.add(rel(file));
      }

      return setCheck('prettier', unformatted, (f) => `${f} is not formatted: npx prettier --write ${f}`);
    },

    knip() {
      const keys = new Set();
      for (const strict of ['0', '1']) {
        const run = spawnSync(bin('knip'), ['--reporter', 'json', '--no-exit-code'], {
          cwd: ROOT,
          encoding: 'utf8',
          env: { ...process.env, KNIP_STRICT: strict },
          maxBuffer: 64 * 1024 * 1024,
        });
        for (const issue of JSON.parse(run.stdout).issues) {
          for (const [kind, list] of Object.entries(issue)) {
            if (!Array.isArray(list)) continue;
            for (const item of list)
              keys.add(
                kind === 'files' ? `file ${issue.file}` : `${kind} ${issue.file}${item.name ? `#${item.name}` : ''}`
              );
          }
        }
      }

      return setCheck('knip', keys, (k) => `unused: ${k}`);
    },

    jscpd() {
      const out = mkdtempSync(join(tmpdir(), 'sve-jscpd-'));
      spawnSync(
        bin('jscpd'),
        [
          '--min-lines',
          '8',
          '--min-tokens',
          '70',
          '--reporters',
          'json',
          '--output',
          out,
          '--silent',
          '--ignore',
          '**/dist/**,**/node_modules/**,**/vendor/**',
          'resources/js',
          'src',
          'resources/views',
          'resources/css',
        ],
        { cwd: ROOT, encoding: 'utf8' }
      );
      const report = JSON.parse(readFileSync(join(out, 'jscpd-report.json'), 'utf8'));
      rmSync(out, { recursive: true, force: true });
      const total = report.statistics.total;
      const current = { clones: total.clones, lines: total.duplicatedLines };
      const base = readJson('jscpd.json', null);

      if (!base) {
        writeJson('jscpd.json', current);

        return { ok: true, note: `baseline created: ${current.clones} clones` };
      }

      const ok = current.clones <= base.clones && current.lines <= base.lines;
      if (UPDATE && ok)
        writeJson('jscpd.json', {
          clones: Math.min(base.clones, current.clones),
          lines: Math.min(base.lines, current.lines),
        });
      const newest = report.duplicates
        .slice(-5)
        .map(
          (d) =>
            `${d.firstFile.name}:${d.firstFile.start} = ${d.secondFile.name}:${d.secondFile.start} (${d.lines} lines)`
        );

      return {
        ok,
        note: `${current.clones} clones, ${current.lines} lines (baseline ${base.clones}, ${base.lines})`,
        detail: ok
          ? []
          : ['copied code grew; run npx jscpd --reporters console … to see where. Last found:', ...newest],
      };
    },

    bigfiles() {
      const files = [
        ...walk(join(ROOT, 'resources/js'), (n) => /\.(js|mjs|vue)$/.test(n)).map((f) => [f, BIG.js]),
        ...walk(join(ROOT, 'src'), (n) => n.endsWith('.php')).map((f) => [f, BIG.php]),
      ];
      const exceptions = readJson('exceptions.json', { bigFiles: {} }).bigFiles;
      const current = {};
      for (const [file, limit] of files) {
        const n = lineCount(file);
        if (n > limit && !exceptions[rel(file)]) current[rel(file)] = n;
      }

      return countCheck('bigfiles', current, (f, n, was) =>
        was
          ? `${f} grew ${was} → ${n} lines: put the new code in a new file`
          : `${f} is ${n} lines, over the limit (${f.endsWith('.php') ? BIG.php : BIG.js}): split it`
      );
    },

    catches() {
      const current = {};
      for (const file of walk(join(ROOT, 'resources/js'), (n) => /\.(js|mjs|vue)$/.test(n))) {
        const src = readFileSync(file, 'utf8');
        const re = /\bcatch\s*(\([^)]*\))?\s*\{/g;
        let silent = 0;
        while (re.exec(src) !== null) {
          let i = re.lastIndex;
          let depth = 1;
          while (i < src.length && depth) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            i++;
          }
          const body = src
            .slice(re.lastIndex, i - 1)
            .replaceAll(/\/\*[\s\S]*?\*\//g, '')
            .replaceAll(/\/\/.*$/gm, '')
            .trim();
          if (!body) silent++;
        }
        if (silent) current[rel(file)] = silent;
      }

      return countCheck(
        'catches',
        current,
        (f, n, was) => `${f}: ${was} → ${n} silent catches. Log the error or handle it; a comment is not handling`
      );
    },

    budgets() {
      const manifest = JSON.parse(readFileSync(join(ROOT, 'resources/dist/build/manifest.json'), 'utf8'));
      const size = (file) => {
        const path = join(ROOT, 'resources/dist/build', file);

        return existsSync(path) ? statSync(path).size : 0;
      };
      const closure = (key, seen = new Set()) => {
        if (seen.has(key) || !manifest[key]) return seen;
        seen.add(key);
        for (const dep of manifest[key].imports || []) closure(dep, seen);

        return seen;
      };
      const roots = new Set(
        Object.entries(manifest)
          .filter(([, e]) => e.isEntry)
          .map(([k]) => k)
      );
      for (const entry of Object.values(manifest)) for (const dyn of entry.dynamicImports || []) roots.add(dyn);
      const current = {};
      for (const key of roots) {
        let bytes = 0;
        for (const k of closure(key))
          bytes += size(manifest[k].file) + (manifest[k].css || []).reduce((s, c) => s + size(c), 0);
        current[key] = Math.round(bytes / 1024);
      }
      const base = readJson('budgets.json', null);

      if (!base) {
        writeJson('budgets.json', sorted(current));

        return { ok: true, note: `baseline created: ${roots.size} entries and lazy chunks` };
      }

      const over = Object.entries(current).filter(
        ([k, kb]) => base[k] !== undefined && kb > Math.ceil(base[k] * BUDGET_SLACK)
      );
      const fresh = Object.keys(current).filter((k) => base[k] === undefined);
      if (UPDATE && !over.length)
        writeJson(
          'budgets.json',
          sorted({
            ...Object.fromEntries(fresh.map((k) => [k, current[k]])),
            ...Object.fromEntries(
              Object.entries(base)
                .filter(([k]) => current[k] !== undefined)
                .map(([k, kb]) => [k, Math.min(kb, current[k])])
            ),
          })
        );
      const label = {
        'resources/js/addon.js': 'CP boot',
        'resources/js/overlay-host.js': 'Live Preview host',
        'resources/js/bridge.js': 'preview bridge',
        'resources/js/preview.js': 'preview',
      };

      return {
        ok: !over.length,
        note: `${Object.keys(current).length} chunks; CP boot ${current['resources/js/addon.js']} KB (budget ${Math.ceil((base['resources/js/addon.js'] || 0) * BUDGET_SLACK)})${fresh.length ? `; ${fresh.length} new chunk(s) without a budget: ${fresh.slice(0, 3).join(', ')}${UPDATE ? ' (added)' : ' (run --update)'}` : ''}`,
        detail: over.map(
          ([k, kb]) =>
            `${label[k] || k}: ${kb} KB with its imports, budget ${Math.ceil(base[k] * BUDGET_SLACK)} KB (baseline ${base[k]} + 5 %)`
        ),
      };
    },
  },

  php: {
    phpstan() {
      const run = spawnSync(
        join(ROOT, 'vendor/bin/phpstan'),
        ['analyse', '--no-progress', '--memory-limit=2G', '--error-format=raw'],
        { cwd: ROOT, encoding: 'utf8' }
      );
      if (run.status === 0 && UPDATE)
        spawnSync(
          join(ROOT, 'vendor/bin/phpstan'),
          ['analyse', '--no-progress', '--memory-limit=2G', '--generate-baseline', 'phpstan-baseline.neon'],
          { cwd: ROOT }
        );
      const lines = (run.stdout || '').split('\n').filter((l) => /\.php:\d+:/.test(l));

      return {
        ok: run.status === 0,
        note: run.status === 0 ? 'no new errors' : `${lines.length} new`,
        detail: lines.slice(0, 25).map((l) => l.replace(`${ROOT}/`, '')),
      };
    },

    pint() {
      const run = spawnSync(join(ROOT, 'vendor/bin/pint'), ['--test', '--format=json'], {
        cwd: ROOT,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      });
      const files = new Set(
        (JSON.parse(run.stdout || '{}').files || [])
          .map((f) => (typeof f === 'string' ? f : f.name || f.path))
          .map((f) => (f.startsWith('/') ? rel(f) : f))
      );

      return setCheck('pint', files, (f) => `${f} is not formatted: vendor/bin/pint ${f}`);
    },

    rector() {
      const run = spawnSync(
        join(ROOT, 'vendor/bin/rector'),
        ['process', '--dry-run', '--output-format=json', '--no-progress-bar'],
        { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
      );
      const current = {};
      for (const diff of JSON.parse(run.stdout || '{}').file_diffs || [])
        current[diff.file] = diff.applied_rectors.length;

      return countCheck(
        'rector',
        current,
        (f, n, was) => `${f}: ${was} → ${n} Rector findings. vendor/bin/rector process --dry-run ${f} shows them`
      );
    },
  },
};

const groups = scope === 'all' ? ['js', 'php'] : [scope];
if (!groups.every((g) => checks[g])) {
  console.error('usage: node scripts/quality.mjs [js|php|all] [--update]');
  process.exit(2);
}

let failed = 0;
for (const group of groups) {
  for (const [name, check] of Object.entries(checks[group])) {
    const t0 = Date.now();
    let result;
    try {
      result = await check();
    } catch (error) {
      result = { ok: false, note: `could not run: ${error.message.split('\n')[0]}` };
    }
    if (!result.ok) failed++;
    console.log(
      `${result.ok ? 'ok  ' : 'FAIL'} ${name.padEnd(9)} ${result.note} (${((Date.now() - t0) / 1000).toFixed(1)} s)`
    );
    for (const line of result.detail || []) console.log(`       ${line}`);
    if (result.more) console.log(`       … and ${result.more} more`);
  }
}

if (failed) {
  console.log(
    `\nquality: ${failed} check(s) failed. Fix the new findings; old ones are in quality-baseline/ and may stay.`
  );
  process.exit(1);
}
