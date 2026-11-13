/**
 * The bus's names: every name asked for is answered, by one owner.
 *
 * ask() on a name nobody registered returns undefined and says nothing
 * (tests/js/bus.test.js). That is right for a surface that is switched off,
 * and wrong for a typo or a handler that was moved away: the caller goes
 * quiet and nothing fails. So the names are checked here, in the source:
 *
 *   - each name passed to ask() is passed to register() somewhere;
 *   - by one file only: two owners of one name means the last one loaded wins.
 *
 * Read from the source, not run: the files import the whole CP.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const JS = fileURLToPath(new URL('../../resources/js/', import.meta.url));

/**
 * Calls whose name is not written at the call: the file, the argument as it
 * stands there, and the names it stands for. Each is checked like any other.
 */
const INDIRECT = {
  // append(readKey, writeKey, …) is called twice, with these four names.
  'section-create.js': { readKey: ['dock:css', 'dock:js'], writeKey: ['dock:set-css', 'dock:set-js'] },
};

function sources(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);

    if (statSync(path).isDirectory()) {
      sources(path, out);
    } else if (/\.(js|vue)$/.test(name)) {
      out.push(path);
    }
  }

  return out;
}

/** Does this file import `name` from the bus (cp/bus.js, by any relative path)? */
function importsFromBus(source, name) {
  const re = /import\s*\{([^}]*)\}\s*from\s*['"](?:\.\.?\/)+(?:cp\/)?bus\.js['"]/g;
  let match;

  while ((match = re.exec(source))) {
    if (match[1].split(',').some((part) => part.trim() === name)) {
      return true;
    }
  }

  return false;
}

/** The names a file passes to `fn(`: literals, its own string constants, and INDIRECT. */
function namesPassedTo(fn, source, file, unknown) {
  const names = [];
  const re = new RegExp(`(?<![\\w.$])${fn}\\(\\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\\w$]*))`, 'g');
  let match;

  while ((match = re.exec(source))) {
    const literal = match[1] ?? match[2];

    if (literal) {
      names.push(literal);

      continue;
    }

    const ident = match[3];
    const constant = new RegExp(`const\\s+${ident}\\s*=\\s*['"]([^'"]+)['"]`).exec(source);

    if (constant) {
      names.push(constant[1]);
    } else if (INDIRECT[file]?.[ident]) {
      names.push(...INDIRECT[file][ident]);
    } else {
      unknown.push(`${file}: ${fn}(${ident}`);
    }
  }

  return names;
}

const asked = new Map();
const owners = new Map();
const unknown = [];

for (const path of sources(JS)) {
  const file = relative(JS, path);
  const source = readFileSync(path, 'utf8');

  if (importsFromBus(source, 'ask')) {
    for (const name of namesPassedTo('ask', source, file, unknown)) {
      asked.set(name, [...(asked.get(name) || []), file]);
    }
  }

  if (importsFromBus(source, 'register')) {
    for (const name of namesPassedTo('register', source, file, unknown)) {
      owners.set(name, new Set([...(owners.get(name) || []), file]));
    }
  }
}

test('the scan finds the bus in use (or it checks nothing)', () => {
  assert.ok(asked.size > 30, `only ${asked.size} names asked for`);
  assert.ok(owners.size > 30, `only ${owners.size} names registered`);
  assert.ok(asked.has('lp:replay') && owners.has('lp:replay'));
});

test('every ask() and register() names its name where this test can read it', () => {
  assert.deepEqual(unknown, [], 'write the name as a string, a constant of the file, or add the call to INDIRECT');
});

test('every name asked for is registered', () => {
  const nobody = [...asked]
    .filter(([name]) => !owners.has(name))
    .map(([name, files]) => `${name} (asked in ${files[0]})`);

  assert.deepEqual(nobody, [], 'ask() on these returns undefined in silence');
});

test('a name has one owner: it is registered in one file', () => {
  const shared = [...owners]
    .filter(([, files]) => files.size > 1)
    .map(([name, files]) => `${name}: ${[...files].join(', ')}`);

  assert.deepEqual(shared, []);
});

test('the shell answers header:apply, and panels reach it through lib/header-tab.js', () => {
  assert.deepEqual([...owners.get('header:apply')], ['cp-shell/header-toolbar.js']);
  assert.deepEqual(asked.get('header:apply'), ['lib/header-tab.js']);
});
