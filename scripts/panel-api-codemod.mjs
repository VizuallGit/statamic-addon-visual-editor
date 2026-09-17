#!/usr/bin/env node
/**
 * One WP4 step for one panel: every function other files reach through the
 * `sve` registry becomes a direct import; the panel's registry lines go, except
 * where a standalone CP script (ServiceProvider::$scripts, cannot import) still
 * reads the name; live properties nobody reads go too.
 *
 *   node scripts/panel-api-codemod.mjs focus-panel.js          # dry run, prints the plan
 *   node scripts/panel-api-codemod.mjs focus-panel.js --apply
 *
 * Then: npm run cp:build (check "✓ built"), npm run check, and
 * SVE_WORKTREE=1 npm run test:browser before committing.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = join(REPO, 'resources/js');
const PANEL = process.argv[2]; const APPLY = process.argv.includes('--apply');
if (!PANEL) { console.error('usage: node scripts/panel-api-codemod.mjs <panel.js> [--apply]'); process.exit(1); }
const STANDALONE = new Set(readFileSync(join(REPO, 'src/ServiceProvider.php'), 'utf8').match(/[a-z0-9-]+\.js/g));
const KERNEL = new Set(['preview.js', 'overlay-host.js', 'bridge.js', 'html-pick-align.js', 'ai-text-bridge.js', 'ai-text-icon.js']);
const files = []; (function walk(d) { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) { if (n !== 'lib') walk(p); } else if (/\.(js|vue)$/.test(n)) files.push(p.slice(ROOT.length + 1)); } })(ROOT);
const src = new Map(); const log = [];
const read = (f) => { if (!src.has(f)) src.set(f, readFileSync(join(ROOT, f), 'utf8')); return src.get(f); };
const write = (f, s) => src.set(f, s);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const panelSrc = read(PANEL);
const registry = [...panelSrc.matchAll(/^\s*sve\.(\w+)\s*=[^=]/gm)].map((m) => m[1]);
const props = [...panelSrc.matchAll(/Object\.defineProperty\(sve,\s*'(\w+)'/g)].map((m) => m[1]);
const isFn = (n) => new RegExp(`^export (?:async )?function ${esc(n)}\\(`, 'm').test(panelSrc);
const readers = (n) => files.filter((f) => f !== PANEL && new RegExp(`\\bsve\\.${esc(n)}\\b(?!\\s*=[^=])`).test(read(f)));
const plan = { importable: [], keepCompat: [], dropDead: [], dropProps: [], leave: [] };
for (const n of registry) {
  const r = readers(n); const stand = r.filter((f) => STANDALONE.has(f));
  if (!r.length) plan.dropDead.push(n);
  else if (!isFn(n)) plan.leave.push(n + ' (not an exported function)');
  else { plan.importable.push(n); if (stand.length) plan.keepCompat.push(n); }
}
for (const p of props) { if (!readers(p).length) plan.dropProps.push(p); else plan.leave.push(p + ' (live prop read by ' + readers(p).join(',') + ')'); }
console.log(`${PANEL}: registry ${registry.length}, props ${props.length}`);
console.log(`  importable functions: ${plan.importable.length} (${plan.keepCompat.length} also kept on the registry for standalone scripts: ${plan.keepCompat.join(' ') || '-'})`);
console.log(`  dead registry lines: ${plan.dropDead.length}  dead live props: ${plan.dropProps.length}`);
if (plan.leave.length) console.log(`  left as is: ${plan.leave.join(' | ')}`);
function specFor(file, target) { const depth = file.split('/').length - 1; return `${depth ? '../'.repeat(depth) : './'}${target}`; }
function addImport(f, target, names) {
  if (!names.length) return; let s = read(f); const spec = specFor(f, target);
  const re = new RegExp(`^import \\{([^}]*)\\} from '${esc(spec)}';$`, 'm'); const m = s.match(re);
  if (m) { const all = [...new Set([...m[1].split(',').map((x) => x.trim()).filter(Boolean), ...names])].sort(); write(f, s.replace(re, `import { ${all.join(', ')} } from '${spec}';`)); return; }
  const line = `import { ${[...new Set(names)].sort().join(', ')} } from '${spec}';`; const lines = s.split('\n'); let last = -1;
  for (let i = 0; i < lines.length; i++) if (/^import\b/.test(lines[i])) { let j = i; while (!/;\s*$/.test(lines[j]) && j < lines.length - 1) j++; last = j; i = j; }
  if (last === -1) { let j = 0; if (/^\/\*\*/.test(lines[0])) { while (!/\*\/\s*$/.test(lines[j])) j++; j++; } lines.splice(j, 0, line); } else lines.splice(last + 1, 0, line);
  write(f, lines.join('\n')); log.push(`${f}: + ${line}`);
}
// panel: registry lines
{ let s = read(PANEL);
  for (const n of [...plan.dropDead, ...plan.importable.filter((x) => !plan.keepCompat.includes(x))]) s = s.replace(new RegExp(`^\\s*sve\\.${esc(n)}\\s*=[^=][^\\n]*\\n`, 'm'), '');
  for (const n of plan.keepCompat) s = s.replace(new RegExp(`^\\s*sve\\.${esc(n)}\\s*=[^=][^\\n]*\\n`, 'm'), `sve.${n} = ${n}; // standalone scripts still read this off window.sve — goes with WP6\n`);
  for (const p of plan.dropProps) s = s.replace(new RegExp(`^\\s*Object\\.defineProperty\\(sve,\\s*'${esc(p)}'[^\\n]*\\n`, 'm'), '');
  write(PANEL, s); }
// consumers
for (const f of files) { if (STANDALONE.has(f) || KERNEL.has(f) || f === PANEL) continue; let s = read(f); const need = new Set(); let n = 0;
  for (const fn of plan.importable) { s = s.replace(new RegExp(`\\bsve\\.${esc(fn)}\\?\\.\\(`, 'g'), () => { n++; need.add(fn); return `${fn}(`; }); s = s.replace(new RegExp(`\\bsve\\.${esc(fn)}\\b(?!\\s*=[^=])`, 'g'), () => { n++; need.add(fn); return fn; }); }
  if (n) { write(f, s); addImport(f, PANEL, [...need]); log.push(`${f}: sve.<${PANEL.replace('.js', '')}> -> import x${n}`); } }
if (APPLY) for (const [f, s] of src) writeFileSync(join(ROOT, f), s);
console.log(log.join('\n')); console.log(APPLY ? 'written' : 'dry run');
