#!/usr/bin/env node
/**
 * The quality pass's numbers, measured the same way every round so they can
 * only be compared, never re-estimated (docs/kvalitetsrunde-brief.md in the
 * site, §5 and §0.1). Read-only.
 *
 *   node scripts/quality-numbers.mjs [addon dir] [site dir]
 *
 * Silent catches: a `catch` whose body is empty once comments are taken out.
 * "Returns nothing": a body that is only `return`, `return null`, `false`,
 * `undefined`, '', [] , {} or 0.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const addon = process.argv[2] || process.cwd();
const site = process.argv[3] || `${process.env.HOME}/Sites/vizuall-skabelon`;
const walk = (dir, exts, skip = []) => {
  const out = [];
  const go = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (skip.some((s) => p.includes(s))) continue;
      if (e.isDirectory()) go(p);
      else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
    }
  };
  go(dir);
  return out;
};
const lines = (f) =>
  fs.readFileSync(f, 'utf8').split('\n').length - (fs.readFileSync(f, 'utf8').endsWith('\n') ? 1 : 0);
const rel = (f) => path.relative(addon, f);
const count = (files, re) => files.reduce((s, f) => s + (fs.readFileSync(f, 'utf8').match(re) || []).length, 0);

const js = walk(path.join(addon, 'resources/js'), ['.js', '.vue', '.mjs']);
const php = walk(path.join(addon, 'src'), ['.php']);
const jsLines = js.map((f) => [rel(f), lines(f)]).sort((a, b) => b[1] - a[1]);
const phpLines = php.map((f) => [rel(f), lines(f)]).sort((a, b) => b[1] - a[1]);
const sum = (a) => a.reduce((s, [, n]) => s + n, 0);

// catch blocks: body empty (comments do not count) / only returns "nothing"
let catches = 0,
  silent = 0,
  nothing = 0;
const silentFiles = new Map();
for (const f of js) {
  const src = fs.readFileSync(f, 'utf8');
  const re = /\bcatch\s*(\([^)]*\))?\s*\{/g;
  while (re.exec(src) !== null) {
    catches++;
    let i = re.lastIndex,
      depth = 1;
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
    if (body === '') {
      silent++;
      silentFiles.set(rel(f), (silentFiles.get(rel(f)) || 0) + 1);
    } else if (/^return\s*(null|undefined|false|''|""|\[\]|\{\}|0)?\s*;?$/.test(body)) nothing++;
  }
}

const allow = JSON.parse(fs.readFileSync(path.join(addon, 'scripts/isolation-allowlist.json'), 'utf8'));
const sh = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 1 << 30 });
const distFiles = walk(path.join(addon, 'resources/dist'), ['']);
const distBytes = distFiles.reduce((s, f) => s + fs.statSync(f).size, 0);
const archiveBytes = Number(sh('sh', ['-c', 'git archive --format=tar HEAD | wc -c'], addon).trim());

const out = {
  addon: {
    head: sh('git', ['log', '-1', '--format=%h %cs', 'HEAD'], addon).trim(),
    tag: sh('git', ['describe', '--tags', '--abbrev=0'], addon).trim(),
    jsFiles: js.length,
    jsLines: sum(jsLines),
    phpLines: sum(phpLines),
    jsOver1000: jsLines.filter(([, n]) => n > 1000).length,
    jsTop10: jsLines.slice(0, 10),
    phpOver300: phpLines.filter(([, n]) => n > 300).length,
    phpTop5: phpLines.slice(0, 5),
    setTimeout: count(js, /setTimeout/g),
    mutationObserver: count(js, /new MutationObserver/g),
    windowSve: [...new Set(js.flatMap((f) => fs.readFileSync(f, 'utf8').match(/window\.__sve\w*/g) || []))].length,
    sveBag: count(
      js.filter((f) => f.endsWith('.js')),
      /^\s*sve\.\w+\s*=[^=]/gm
    ),
    addEventListener: count(js, /addEventListener\(/g),
    removeEventListener: count(js, /removeEventListener\(/g),
    catches,
    silentCatches: silent,
    returnNothingCatches: nothing,
    silentTop5: [...silentFiles].sort((a, b) => b[1] - a[1]).slice(0, 5),
    ownStylesheets: count(js, /createElement\(\s*['"]style['"]\s*\)|new CSSStyleSheet\(/g),
    isolationAllowlist: {
      files: Object.keys(allow).length,
      breaks: Object.values(allow).reduce((s, v) => s + (Array.isArray(v) ? v.length : 1), 0),
    },
    tests: {
      phpunitFiles: walk(path.join(addon, 'tests'), ['Test.php']).length,
      jsTestFiles: walk(path.join(addon, 'tests/js'), ['.test.js']).length,
      browserScripts: walk(path.join(addon, 'tests/browser'), ['.mjs']).length,
    },
    distMB: +(distBytes / 1e6).toFixed(1),
    distFileCount: distFiles.length,
    packageMB: +(archiveBytes / 1e6).toFixed(1),
  },
};

if (fs.existsSync(site)) {
  const app = walk(path.join(site, 'app'), ['.php'])
    .map((f) => [path.relative(site, f), lines(f)])
    .sort((a, b) => b[1] - a[1]);
  const partials = walk(path.join(site, 'resources/views/partials/page_sections'), ['.antlers.html']);
  const used = new Set(
    walk(path.join(site, 'content/collections'), ['.md'])
      .flatMap((f) => fs.readFileSync(f, 'utf8').match(/^\s+type: [a-z_]+\/[a-z_0-9]+$/gm) || [])
      .map((l) => l.trim().slice(6))
  );
  out.site = {
    sectionPartials: partials.length,
    sectionTypesUsedInContent: used.size,
    appPhpLines: app.reduce((s, [, n]) => s + n, 0),
    appTop3: app.slice(0, 3),
    appOver300: app.filter(([, n]) => n > 300).length,
    tests: walk(path.join(site, 'tests'), ['Test.php']).length,
    copyFiles: walk(path.join(site, 'resources'), [''])
      .filter((f) => / copy|\.old\b|\.explained\b/.test(path.basename(f)))
      .map((f) => path.relative(site, f)),
  };
}
console.log(JSON.stringify(out, null, 1));
