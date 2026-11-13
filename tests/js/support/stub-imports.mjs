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
 *
 * `family` (optional): URL prefixes of modules that are the target too — a
 * module split into a folder (tw-classes.js and tw-classes/*.js). Their imports
 * are stubbed the same way, and they load each other for real.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

let target = '';
let keep = [];
let family = [];
const importsOf = new Map();

export async function initialize(data) {
  target = data.target;
  keep = data.keep || [];
  family = data.family || [];
}

const isTarget = (url) => url === target || family.some((prefix) => url.startsWith(prefix));

/** The names `parent` (the target, or one of its family) imports from `specifier`, read from its own source. */
function namesFor(parent, specifier) {
  if (!importsOf.has(parent)) {
    const source = readFileSync(fileURLToPath(parent), 'utf8');
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

      if (
        clause
          .replace(/\{[\s\S]*\}/, '')
          .replace(/,/g, '')
          .trim()
      ) {
        names.push('default');
      }

      map.set(m[2], names);
    }

    importsOf.set(parent, map);
  }

  return importsOf.get(parent).get(specifier) || [];
}

export async function resolve(specifier, context, nextResolve) {
  if (context.parentURL && isTarget(context.parentURL)) {
    const url = new URL(specifier, context.parentURL).href;

    if (!isTarget(url) && !keep.some((suffix) => url.endsWith(suffix))) {
      return {
        url: `sve-stub:${encodeURIComponent(specifier)}?${namesFor(context.parentURL, specifier).join(',')}`,
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
