#!/usr/bin/env node
/**
 * Split a god file along its `// ===== region =====` markers into one module
 * per region, and turn the original into a barrel that re-exports them all.
 *
 *   node scripts/split-regions.mjs resources/js/cp.js cp-shell          # dry run
 *   node scripts/split-regions.mjs resources/js/cp.js cp-shell --apply
 *
 * Each region file gets: the original imports it actually uses, imports of the
 * names it uses from sibling regions (which are then exported there), and its
 * statements verbatim. Top-level statements keep their order, so the barrel's
 * import order (region order) preserves evaluation order. The dry run reports
 * every top-level initializer that reads a sibling region's name — the one
 * thing an ESM cycle cannot do safely — so it can be hoisted first.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { parseAst } from 'vite';

const [, , FILE, DIR] = process.argv;
const APPLY = process.argv.includes('--apply');
if (!FILE || !DIR) { console.error('usage: node scripts/split-regions.mjs <file.js> <subdir> [--apply]'); process.exit(1); }
const src = readFileSync(FILE, 'utf8');
const ast = parseAst(src);
const markers = [...src.matchAll(/^\/\/ ===== ([\w-]+) =====[^\n]*\n/gm)].map((m) => ({ name: m[1], start: m.index, end: m.index + m[0].length }));
const regionAt = (pos) => { let r = 'head'; for (const m of markers) if (pos >= m.start) r = m.name; return r; };
const regionNames = ['head', ...markers.map((m) => m.name)];

// ---- declarations per region, imports
const declared = {}; // name -> { region, node, exported }
const importSpecs = []; // { node, names: [{local, text}] }
for (const node of ast.body) {
  if (node.type === 'ImportDeclaration') { importSpecs.push({ node, names: node.specifiers.map((sp) => sp.local.name) }); continue; }
  const inner = node.type === 'ExportNamedDeclaration' ? node.declaration : node;
  if (!inner) continue;
  const region = regionAt(node.start);
  const exported = node.type === 'ExportNamedDeclaration';
  if (inner.type === 'FunctionDeclaration' || inner.type === 'ClassDeclaration') declared[inner.id.name] = { region, node, exported, kind: inner.type };
  else if (inner.type === 'VariableDeclaration') for (const d of inner.declarations) if (d.id.type === 'Identifier') declared[d.id.name] = { region, node, exported, kind: inner.kind };
}
function walk(node, fn, parent = null) { if (!node || typeof node.type !== 'string') return; fn(node, parent); for (const key of Object.keys(node)) { if (key === 'type' || key === 'loc') continue; const v = node[key]; if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && walk(c, fn, node)); else if (v && typeof v.type === 'string') walk(v, fn, node); } }
/** Identifiers that are real references (not property keys / member names). */
function isReference(n, parent) {
  if (!parent) return true;
  if (parent.type === 'MemberExpression' && parent.property === n && !parent.computed) return false;
  if (parent.type === 'Property' && parent.key === n && !parent.computed && !parent.shorthand) return false;
  if (parent.type === 'MethodDefinition' && parent.key === n) return false;
  if (parent.type === 'PropertyDefinition' && parent.key === n) return false;
  return true;
}

// ---- per region: statements, used imports, used sibling names, TDZ risks
const regions = Object.fromEntries(regionNames.map((r) => [r, { statements: [], usesImport: new Set(), usesSibling: {}, tdz: [] }]));
for (const node of ast.body) {
  if (node.type === 'ImportDeclaration') continue;
  const r = regionAt(node.start); regions[r].statements.push(node);
  const topLevelInit = node.type === 'VariableDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration?.type === 'VariableDeclaration') || node.type === 'ExpressionStatement';
  walk(node, (n, parent) => {
    if (n.type !== 'Identifier' || !isReference(n, parent)) return;
    const d = declared[n.name];
    // A sibling's function declaration is initialised before any module body runs,
    // so a top-level call into one is safe; only const/let/class bindings are TDZ.
    if (d && d.region !== r) { (regions[r].usesSibling[d.region] ||= new Set()).add(n.name); if (topLevelInit && d.kind !== 'FunctionDeclaration' && !insideFunction(node, n)) regions[r].tdz.push(`${n.name} (${d.kind} from ${d.region}) in a top-level statement`); }
    for (const imp of importSpecs) if (imp.names.includes(n.name)) regions[r].usesImport.add(n.name);
  });
}
function insideFunction(root, target) { let found = false; (function rec(n, depth) { if (found || !n || typeof n.type !== 'string') return; if (n === target) { found = depth > 0; return; } const enters = /Function|ArrowFunctionExpression/.test(n.type) ? depth + 1 : depth; for (const key of Object.keys(n)) { if (key === 'type' || key === 'loc') continue; const v = n[key]; if (Array.isArray(v)) v.forEach((c) => rec(c, enters)); else if (v && typeof v.type === 'string') rec(v, enters); } })(root, 0); return found; }

// ---- evaluation-time statements that reach into a sibling region (a boot call at the
// end of the file, typically) cannot stay in a region file: a region may be evaluated
// early as another region's dependency, before the barrel and its siblings have run.
// They move to the barrel, after every `export *`, in their original order.
const bootStatements = [];
for (const r of regionNames) {
  if (r === 'head') continue;
  for (const node of regions[r].statements) {
    if (node.type !== 'ExpressionStatement') continue;
    const uses = new Set();
    walk(node, (n, parent) => { if (n.type === 'Identifier' && isReference(n, parent) && declared[n.name] && declared[n.name].region !== r) uses.add(n.name); });
    if (uses.size) bootStatements.push({ node, region: r, uses });
  }
}
for (const b of bootStatements) for (const n of b.uses) declared[n].exported = true;

// ---- report
for (const r of regionNames) {
  const v = regions[r]; if (!v.statements.length) continue;
  console.log(`${r}: ${v.statements.length} statements, imports used: ${v.usesImport.size}, sibling names: ${Object.entries(v.usesSibling).map(([k, s]) => `${k}(${s.size})`).join(' ') || '-'}${v.tdz.length ? '\n   TDZ RISK: ' + v.tdz.join('; ') : ''}`);
}
if (bootStatements.length) console.log(`boot statements moved to the barrel: ${bootStatements.map((b) => `${src.slice(b.node.start, b.node.end).slice(0, 40)} (from ${b.region})`).join('; ')}`);
const risky = regionNames.flatMap((r) => regions[r].tdz);
if (risky.length) { console.error('\nRefusing: top-level initializers read sibling regions. Hoist these first.'); process.exit(2); }

// ---- emit
const outDir = join(dirname(FILE), DIR);
const importText = (imp, names) => {
  const kept = imp.node.specifiers.filter((sp) => names.has(sp.local.name));
  if (!kept.length) return null;
  if (kept.every((sp) => sp.type === 'ImportSpecifier')) return `import { ${kept.map((sp) => sp.imported.name === sp.local.name ? sp.local.name : `${sp.imported.name} as ${sp.local.name}`).join(', ')} } from ${src.slice(imp.node.source.start, imp.node.source.end)};`;
  return src.slice(imp.node.start, imp.node.end); // default / namespace imports: keep verbatim
};
const files = {};
for (const r of regionNames) {
  if (r === 'head' || !regions[r].statements.length) continue;
  const v = regions[r];
  const lines = [];
  lines.push(`/**\n * ${basename(FILE)} — region "${r}", split out in WP5. Same statements, same order;\n * only the imports are new. See the barrel ${basename(FILE)} for what the shell exports.\n */`);
  for (const imp of importSpecs) { const t = importText(imp, v.usesImport); if (t) lines.push(t.replace(/from '\.\//g, "from '../").replace(/from "\.\//g, 'from "../')); }
  for (const [sib, names] of Object.entries(v.usesSibling)) { const target = sib === 'head' ? `../${basename(FILE)}` : `./${sib}.js`; lines.push(`import { ${[...names].sort().join(', ')} } from '${target}';`); for (const n of names) declared[n].exported = true; }
  lines.push('');
  files[`${outDir}/${r}.js`] = { header: lines.join('\n'), region: r };
}
// Region text is the verbatim source slice (comments and blank lines included), with
// `export ` inserted in front of declarations a sibling region imports.
const bounds = {};
for (let i = 0; i < regionNames.length; i++) { const r = regionNames[i]; const startAt = r === 'head' ? 0 : markers.find((m) => m.name === r).start; const next = markers.find((m) => m.start > startAt); bounds[r] = [startAt, next ? next.start : src.length]; }
const originallyExported = new Set(Object.entries(declared).filter(([, d]) => d.node.type === 'ExportNamedDeclaration').map(([n]) => n));
function regionText(r) {
  const [from, to] = bounds[r];
  let text = src.slice(from, to);
  const edits = []; // { at, insert } or { from, to, insert }
  for (const [name, d] of Object.entries(declared)) {
    if (d.region !== r || !d.exported || originallyExported.has(name) || d.node.type === 'ExportNamedDeclaration') continue;
    if (!edits.some((e) => e.at === d.node.start)) edits.push({ at: d.node.start, insert: 'export ' });
  }
  if (r === 'head') for (const imp of importSpecs) edits.push({ from: imp.node.start, to: imp.node.end + (src[imp.node.end] === '\n' ? 1 : 0), insert: '' });
  for (const b of bootStatements) if (b.region === r) edits.push({ from: b.node.start, to: b.node.end + (src[b.node.end] === '\n' ? 1 : 0), insert: '' });
  edits.sort((a, b) => (b.at ?? b.from) - (a.at ?? a.from));
  for (const e of edits) { if (e.at !== undefined) text = text.slice(0, e.at - from) + e.insert + text.slice(e.at - from); else text = text.slice(0, e.from - from) + text.slice(e.to - from); }
  // Paths inside the region text (dynamic imports, `export … from './x.js'`) now sit one level deeper.
  if (r !== 'head') text = text.replace(/import\('\.\//g, "import('../").replace(/(export \{[^}]*\} from ')\.\//g, '$1../');
  return text.replace(/^\n+/, '').replace(/\n*$/, '\n');
}
for (const [path, meta] of Object.entries(files)) files[path].text = meta.header + '\n' + regionText(meta.region);
const headImports = importSpecs.map((imp) => importText(imp, regions.head.usesImport)).filter(Boolean);
const bootImports = {};
for (const b of bootStatements) for (const n of b.uses) { const reg = declared[n].region; if (reg !== 'head') (bootImports[reg] ||= new Set()).add(n); }
const bootLines = bootStatements.length ? ['', '// Runs after every region above has been evaluated — the only safe place for it.', ...bootStatements.map((b) => src.slice(b.node.start, b.node.end))] : [];
const barrel = [`/**\n * ${basename(FILE)} — the CP shell's barrel. The code lives in ${DIR}/*.js, one file per\n * region; this file keeps the import surface panels already use, plus the two\n * overlay entry points that stay here. Region order below is evaluation order.\n */`, ...headImports, ...Object.entries(bootImports).map(([reg, names]) => `import { ${[...names].sort().join(', ')} } from './${DIR}/${reg}.js';`), '', regionText('head'), ...regionNames.filter((r) => r !== 'head' && regions[r].statements.length).map((r) => `export * from './${DIR}/${r}.js';`), ...bootLines, ''].join('\n');
if (APPLY) { if (!existsSync(outDir)) mkdirSync(outDir); for (const [path, meta] of Object.entries(files)) writeFileSync(path, meta.text); writeFileSync(FILE, barrel); console.log(`written: ${Object.keys(files).length} region files + barrel`); }
else { for (const [path, meta] of Object.entries(files)) console.log(`${path}: ${meta.text.split('\n').length} lines`); console.log(`barrel: ${barrel.split('\n').length} lines`); }
