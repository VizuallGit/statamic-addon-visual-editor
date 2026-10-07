/**
 * Module hooks for running one dock module in node with its imports stubbed.
 *
 * The dock regions import CodeMirror, Vue surfaces and the rest of the CP, none
 * of which loads in node. This replaces every import of ONE target module with a
 * stub — except the modules listed in `keep`, which load for real — so the
 * target's own code runs as written. Each stubbed export is whatever
 * `globalThis.__sveStub(specifier, name)` returns when the stub is evaluated.
 *
 * register('./support/stub-imports.mjs', import.meta.url, { data: { target, keep } })
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

let target = '';
let keep = [];
const importsOf = new Map();

export async function initialize(data) {
  target = data.target;
  keep = data.keep || [];
}

/** The names the target imports from `specifier`, read from its own source. */
function namesFor(specifier) {
  if (!importsOf.has(target)) {
    const source = readFileSync(fileURLToPath(target), 'utf8');
    const map = new Map();
    const re = /^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/gm;
    let m;

    while ((m = re.exec(source))) {
      const clause = m[1];
      const names = [];
      const named = clause.match(/\{([\s\S]*)\}/);

      if (named) {
        for (const part of named[1].split(',')) {
          const name = part.trim().split(/\s+as\s+/)[0];

          if (name) {
            names.push(name);
          }
        }
      }

      if (clause.replace(/\{[\s\S]*\}/, '').replace(/,/g, '').trim()) {
        names.push('default');
      }

      map.set(m[2], names);
    }

    importsOf.set(target, map);
  }

  return importsOf.get(target).get(specifier) || [];
}

export async function resolve(specifier, context, nextResolve) {
  if (context.parentURL === target) {
    const url = new URL(specifier, target).href;

    if (!keep.some((suffix) => url.endsWith(suffix))) {
      return {
        url: `sve-stub:${encodeURIComponent(specifier)}?${namesFor(specifier).join(',')}`,
        shortCircuit: true,
      };
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.startsWith('sve-stub:')) {
    return nextLoad(url, context);
  }

  const [spec, list] = url.slice('sve-stub:'.length).split('?');
  const from = JSON.stringify(decodeURIComponent(spec));
  const source = list
    .split(',')
    .filter(Boolean)
    .map((name) =>
      name === 'default'
        ? `export default globalThis.__sveStub(${from}, 'default');`
        : `export const ${name} = globalThis.__sveStub(${from}, ${JSON.stringify(name)});`
    )
    .join('\n');

  return { format: 'module', source, shortCircuit: true };
}
