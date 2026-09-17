import { readFileSync } from 'node:fs';
import { parseAst } from 'vite';
/**
 * How tightly a god file's `// ===== region =====` blocks hang together:
 * per region, the names it uses that another region declares, and every
 * top-level `let` written from a region other than its own (the state that
 * has to become shared before the file can be split).
 *
 *   node scripts/measure-regions.mjs resources/js/cp.js
 */
const src = readFileSync(process.argv[2] || 'resources/js/cp.js', 'utf8');
const ast = parseAst(src);
const markers = [...src.matchAll(/^\/\/ ===== ([\w-]+) =====/gm)].map((m) => ({ name: m[1], start: m.index }));
const regionAt = (pos) => { let r = 'head'; for (const m of markers) if (pos >= m.start) r = m.name; return r; };
const decl = {};
for (const node of ast.body) {
  const n = node.type === 'ExportNamedDeclaration' ? node.declaration : node;
  if (node.type === 'ImportDeclaration') { for (const sp of node.specifiers) decl[sp.local.name] = { region: 'import', kind: 'import' }; continue; }
  if (!n) continue;
  if (n.type === 'FunctionDeclaration') decl[n.id.name] = { region: regionAt(node.start), kind: 'function' };
  else if (n.type === 'VariableDeclaration') for (const d of n.declarations) if (d.id.type === 'Identifier') decl[d.id.name] = { region: regionAt(node.start), kind: n.kind };
}
function walk(node, fn) { if (!node || typeof node.type !== 'string') return; fn(node); for (const key of Object.keys(node)) { if (key === 'type' || key === 'loc') continue; const v = node[key]; if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && walk(c, fn)); else if (v && typeof v.type === 'string') walk(v, fn); } }
const regions = {}; const assignsAcross = {};
for (const node of ast.body) {
  const r = regionAt(node.start); regions[r] ||= { refs: {}, lines: 0, exports: 0, fns: 0 };
  regions[r].lines += src.slice(node.start, node.end).split('\n').length;
  if (node.type === 'ExportNamedDeclaration') regions[r].exports++;
  if ((node.declaration || node).type === 'FunctionDeclaration') regions[r].fns++;
  walk(node, (n) => {
    if (n.type === 'Identifier' && decl[n.name] && decl[n.name].region !== r && decl[n.name].region !== 'import') { const k = decl[n.name].region + ':' + n.name; regions[r].refs[k] = (regions[r].refs[k] || 0) + 1; }
    if (n.type === 'AssignmentExpression' && n.left.type === 'Identifier' && decl[n.left.name]?.kind === 'let' && decl[n.left.name].region !== r) (assignsAcross[n.left.name] ||= new Set()).add(`${r}→${decl[n.left.name].region}`);
    if (n.type === 'UpdateExpression' && n.argument.type === 'Identifier' && decl[n.argument.name]?.kind === 'let' && decl[n.argument.name].region !== r) (assignsAcross[n.argument.name] ||= new Set()).add(`${r}→${decl[n.argument.name].region}`);
  });
}
console.log('region          lines  fns  exports  distinct other-region names it uses');
for (const [r, v] of Object.entries(regions)) { const by = {}; for (const k of Object.keys(v.refs)) { const [reg] = k.split(':'); by[reg] = (by[reg] || 0) + 1; } console.log(`${r.padEnd(15)}${String(v.lines).padStart(6)}${String(v.fns).padStart(5)}${String(v.exports).padStart(9)}  ${Object.entries(by).map(([k, c]) => `${k}:${c}`).join(' ') || '-'}`); }
console.log('\ntop-level `let` written from another region:');
for (const [n, s] of Object.entries(assignsAcross)) console.log(`  ${n}  ${[...s].join(' ')}`); if (!Object.keys(assignsAcross).length) console.log('  (none)');
console.log('\nall top-level lets:', Object.entries(decl).filter(([, d]) => d.kind === 'let').map(([n, d]) => `${n}@${d.region}`).join(' '));
