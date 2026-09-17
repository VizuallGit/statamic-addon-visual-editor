#!/usr/bin/env node
/**
 * Move module-level `let` state into one exported object, scope-aware.
 *
 *   node scripts/hoist-state.mjs <file.js> <state-module> <object> name,name,…   # dry run
 *   … --apply
 *
 * Every reference that resolves to the module-scope binding of a listed name
 * becomes `<object>.name`; locals that happen to share the name are left alone.
 * The declarations move to <state-module> as properties with their initialisers.
 * Afterwards the result is parsed again and checked: no listed name may still
 * resolve to module scope, and none may dangle unresolved.
 *
 * Why: a file split along regions cannot share `let` bindings across modules —
 * ESM imports are read-only. An object shared by import is the honest shape.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, relative, join } from 'node:path';
import { parseAst } from 'vite';

const [, , FILE, STATE_FILE, OBJ, LIST] = process.argv;
const APPLY = process.argv.includes('--apply');
if (!FILE || !STATE_FILE || !OBJ || !LIST) { console.error('usage: hoist-state.mjs <file> <state-module> <object> a,b,c [--apply]'); process.exit(1); }
const NAMES = new Set(LIST.split(',').map((s) => s.trim()).filter(Boolean));

// ---------- scope analysis over ESTree ----------
class Scope { constructor(kind, parent, node) { this.kind = kind; this.parent = parent; this.node = node; this.names = new Set(); } has(n) { return this.names.has(n); } functionScope() { let s = this; while (s.kind === 'block') s = s.parent; return s; } }
function patternNames(p, out = []) { if (!p) return out; switch (p.type) { case 'Identifier': out.push(p.name); break; case 'ObjectPattern': for (const pr of p.properties) patternNames(pr.type === 'RestElement' ? pr.argument : pr.value, out); break; case 'ArrayPattern': for (const el of p.elements) patternNames(el, out); break; case 'AssignmentPattern': patternNames(p.left, out); break; case 'RestElement': patternNames(p.argument, out); break; } return out; }
const isFn = (n) => n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression';
const childKeys = (n) => Object.keys(n).filter((k) => k !== 'type' && k !== 'loc' && k !== 'start' && k !== 'end' && k !== 'range');
function forEachChild(n, fn) { for (const k of childKeys(n)) { const v = n[k]; if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') fn(c, k); } else if (v && typeof v.type === 'string') fn(v, k); } }

/** Pass 1: build scopes and declare names. Returns Map<node, Scope> for scope-owning nodes. */
function buildScopes(ast) {
  const scopes = new Map(); const root = new Scope('module', null, ast); scopes.set(ast, root);
  function declareIn(scope, names) { for (const n of names) scope.names.add(n); }
  function visit(n, scope) {
    let own = scope;
    if (isFn(n)) { own = new Scope('function', scope, n); scopes.set(n, own); if (n.type === 'FunctionExpression' && n.id) own.names.add(n.id.name); for (const p of n.params) declareIn(own, patternNames(p)); }
    else if (n.type === 'BlockStatement' || n.type === 'SwitchStatement' || n.type === 'ForStatement' || n.type === 'ForInStatement' || n.type === 'ForOfStatement' || n.type === 'CatchClause' || n.type === 'StaticBlock') { own = new Scope('block', scope, n); scopes.set(n, own); if (n.type === 'CatchClause' && n.param) declareIn(own, patternNames(n.param)); }
    if (n.type === 'FunctionDeclaration' && n.id) scope.names.add(n.id.name);
    if (n.type === 'ClassDeclaration' && n.id) scope.names.add(n.id.name);
    if (n.type === 'VariableDeclaration') { const target = n.kind === 'var' ? own.functionScope() : own; for (const d of n.declarations) declareIn(target, patternNames(d.id)); }
    if (n.type === 'ImportDeclaration') for (const sp of n.specifiers) root.names.add(sp.local.name);
    forEachChild(n, (c) => visit(c, own));
  }
  // a function body BlockStatement shares the function's scope for params; we let the block be its own child scope (fine for resolution)
  visit(ast, root);
  return { scopes, root };
}
function isReference(n, parent, key) {
  if (!parent) return true;
  if (parent.type === 'MemberExpression' && key === 'property' && !parent.computed) return false;
  if (parent.type === 'Property' && key === 'key' && !parent.computed) return false; // shorthand handled by caller
  if (parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') return key !== 'key' || parent.computed;
  if (parent.type === 'LabeledStatement' || parent.type === 'BreakStatement' || parent.type === 'ContinueStatement') return false;
  if (parent.type === 'ImportSpecifier' || parent.type === 'ImportDefaultSpecifier' || parent.type === 'ImportNamespaceSpecifier') return false;
  if (parent.type === 'ExportSpecifier') return key === 'local';
  if (parent.type === 'VariableDeclarator' && key === 'id') return false;
  if ((parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression' || parent.type === 'ClassDeclaration') && key === 'id') return false;
  if (isFn(parent) && key === 'params') return false;
  if (parent.type === 'AssignmentPattern' && key === 'left') return false;
  if (parent.type === 'RestElement' || parent.type === 'ArrayPattern' || parent.type === 'ObjectPattern') return false;
  if (parent.type === 'CatchClause' && key === 'param') return false;
  return true;
}
/** Pass 2: every Identifier reference with the scope it resolves in (or null). */
function resolveReferences(ast, scopes, root) {
  const refs = [];
  function visit(n, scope, parent, key) {
    const own = scopes.get(n) || scope;
    if (n.type === 'Identifier' && isReference(n, parent, key)) {
      let s = own; while (s && !s.has(n.name)) s = s.parent;
      refs.push({ node: n, parent, key, scope: s, shorthand: parent?.type === 'Property' && parent.shorthand && parent.value === n });
    }
    forEachChild(n, (c, k) => visit(c, own, n, k));
  }
  visit(ast, root, null, null);
  return refs;
}

// ---------- rewrite ----------
const src = readFileSync(FILE, 'utf8');
const ast = parseAst(src);
const { scopes, root } = buildScopes(ast);
const refs = resolveReferences(ast, scopes, root);
const decls = {};
for (const node of ast.body) {
  const d = node.type === 'VariableDeclaration' ? node : null;
  if (!d || d.kind !== 'let') continue;
  for (const dec of d.declarations) if (dec.id.type === 'Identifier' && NAMES.has(dec.id.name)) {
    if (d.declarations.length !== 1) { console.error(`refusing: ${dec.id.name} shares a declaration statement`); process.exit(2); }
    decls[dec.id.name] = { node, init: dec.init ? src.slice(dec.init.start, dec.init.end) : 'undefined' };
  }
}
const missing = [...NAMES].filter((n) => !decls[n]);
if (missing.length) { console.error('not module-level let:', missing.join(' ')); process.exit(2); }
// The object name must be free everywhere in the file: a local `const dock = …` would
// capture `dock.x` and turn state reads into property reads on the wrong thing.
const taken = refs.filter((r) => r.node.name === OBJ);
const declaredAsObj = [...scopes.values()].some((sc) => sc.has(OBJ));
if (taken.length || declaredAsObj) { console.error(`refusing: "${OBJ}" is already an identifier in ${FILE} (${taken.length} references). Pick a name nothing in the file uses.`); process.exit(2); }
const edits = []; const stats = {};
for (const r of refs) {
  if (!NAMES.has(r.node.name)) continue;
  stats[r.node.name] ||= { module: 0, local: 0, unresolved: 0 };
  if (r.scope === root) { stats[r.node.name].module++; edits.push(r.shorthand ? { from: r.node.start, to: r.node.end, text: `${r.node.name}: ${OBJ}.${r.node.name}` } : { from: r.node.start, to: r.node.end, text: `${OBJ}.${r.node.name}` }); }
  else if (r.scope) stats[r.node.name].local++;
  else stats[r.node.name].unresolved++;
}
for (const [n, d] of Object.entries(decls)) { let end = d.node.end; while (src[end] === '\n') end++; let start = d.node.start; const before = src.slice(0, start); const doc = before.match(/(?:\/\*\*(?:(?!\*\/)[\s\S])*\*\/\n|(?:\/\/[^\n]*\n)+)$/); if (doc) start -= doc[0].length; edits.push({ from: start, to: end, text: '' }); }
edits.sort((a, b) => b.from - a.from);
let out = src; for (const e of edits) out = out.slice(0, e.from) + e.text + out.slice(e.to);
// import line for the state object
const rel = './' + relative(dirname(FILE), STATE_FILE).replace(/\\/g, '/');
const importLine = `import { ${OBJ} } from '${rel}';`;
{ const lines = out.split('\n'); let last = -1; for (let i = 0; i < lines.length; i++) if (/^import\b/.test(lines[i])) { let j = i; while (!/;\s*$/.test(lines[j]) && j < lines.length - 1) j++; last = j; i = j; } lines.splice(last + 1, 0, importLine); out = lines.join('\n'); }
// state module
const stateText = `/**\n * Shared mutable state of ${FILE.split('/').pop().replace('.js', '')}, one object so every region can read and\n * write it. Hoisted by scripts/hoist-state.mjs; the initialisers are the original ones.\n *\n * May import: nothing.\n */\nexport const ${OBJ} = {\n${Object.entries(decls).map(([n, d]) => `  ${n}: ${d.init},`).join('\n')}\n};\n`;

// ---------- verify on the result ----------
const ast2 = parseAst(out); const { scopes: s2, root: r2 } = buildScopes(ast2); const refs2 = resolveReferences(ast2, s2, r2);
const bad = refs2.filter((r) => NAMES.has(r.node.name) && (r.scope === r2 || !r.scope));
console.log('name                    module refs → ' + OBJ + '.x   locals left alone');
for (const [n, s] of Object.entries(stats)) console.log(`${n.padEnd(24)}${String(s.module).padStart(6)}${String(s.local).padStart(22)}${s.unresolved ? '   UNRESOLVED ' + s.unresolved : ''}`);
console.log(`\n${edits.length} edits; after rewrite: ${bad.length} listed names still resolve to module scope or dangle`);
if (bad.length) { console.error(bad.slice(0, 5).map((r) => `${r.node.name}@${r.node.start}`).join(' ')); process.exit(3); }
if (APPLY) { writeFileSync(FILE, out); writeFileSync(STATE_FILE, stateText); console.log(`written: ${FILE}, ${STATE_FILE}`); }
