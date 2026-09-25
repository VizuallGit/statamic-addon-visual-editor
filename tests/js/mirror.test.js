import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MIRRORED, MSG } from '../../resources/js/lib/protocol.js';

/**
 * mirror.js — the breakpoint overview's copies of the preview.
 *
 * What holds it together: a copy runs the preview's morph and the bridge's
 * video hold and nothing else of the bridge; the preview hands its renders on
 * through one hook that exists only while the overview is open; and the built
 * mirror.js is one file, with bridge.js and preview.js as single as before.
 */
const JS = join(dirname(fileURLToPath(import.meta.url)), '../../resources/js');
const BUILD = join(JS, '../dist/build');

/** The relative imports of a module under resources/js, resolved against it. Comments are not imports. */
function imports(rel) {
  const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/') + 1) : '';
  const text = readFileSync(join(JS, rel), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  return [...text.matchAll(/(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g)].map((m) => {
    const out = [];

    for (const part of (dir + m[1]).split('/')) {
      if (part === '..') {
        out.pop();
      } else if (part !== '.') {
        out.push(part);
      }
    }

    return out.join('/');
  });
}

function graph(rel, seen = new Set()) {
  if (!seen.has(rel)) {
    seen.add(rel);
    imports(rel).forEach((dep) => graph(dep, seen));
  }

  return seen;
}

const ALLOWED = ['mirror.js', 'preview.js', 'bridge/video-hold.js', 'bridge/state.js', 'html-pick-align.js'];

test('a copy takes in the preview’s morph and the bridge’s video hold, and nothing else of the bridge', () => {
  const modules = [...graph('mirror.js')];

  assert.ok(modules.includes('preview.js'));
  assert.ok(modules.includes('bridge/video-hold.js'));

  const beyond = modules.filter((m) => !m.startsWith('lib/') && !ALLOWED.includes(m));

  assert.deepEqual(beyond, [], `mirror.js reaches ${beyond.join(', ')}`);
});

test('bridge/video-hold.js does not import the bridge barrel — a copy would run the whole bridge', () => {
  assert.ok(!imports('bridge/video-hold.js').includes('bridge.js'));
});

test('the protocol names the mirrored render, and a video hold is what every frame shows', () => {
  assert.equal(MSG.SVE_MIRROR, 'sve-mirror');
  assert.deepEqual([...MIRRORED], [MSG.SVE_VIDEO_HOLD]);
});

test('preview.js hands a render on through the one hook the overview sets, after its own morph', () => {
  const preview = readFileSync(join(JS, 'preview.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const overview = readFileSync(join(JS, 'breakpoint-overview.js'), 'utf8');

  // Two things go through the one hook: a render after a morph, and the sections a
  // deletion took off the page while an inline edit held the full render back.
  assert.equal((preview.match(/__sveMirror/g) || []).length, 2, 'a render and a removal, nothing else, in preview.js');
  assert.ok(/window\.__sveMirror\?\.\(\{ html: text/.test(preview), 'the render: an optional call — closed, the property does not exist');
  assert.ok(/window\.__sveMirror\?\.\(\{ removed: ids \}\)/.test(preview), 'the removal: the same optional call');
  assert.ok(/mainWin\.__sveMirror = mirror;/.test(overview), 'the overview sets it on the preview’s window');
  assert.ok(/delete mainWin\.__sveMirror;/.test(overview), 'and takes it away again');
});

// --- Built ---------------------------------------------------------------------

const manifestPath = join(BUILD, 'manifest.json');
const built = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;

/** Chunk names a built file pulls in: `from "./x.js"` and `import("./x.js")`. */
const chunkImports = (source) => [...source.matchAll(/(?:from\s*|import\()\s*["']\.\/([^"']+\.js)["']/g)].map((m) => m[1]);

/** What mirror.js duplicates: a chunk by one of these names would be a module the plugin failed to keep apart. */
const DUPLICATED = /^(mirror|preview|video-hold|state|morph|module)-/;

test('built: mirror.js is one self-contained file, and nothing it reuses became a chunk bridge.js or preview.js loads', { skip: built ? false : 'no build in resources/dist/build' }, () => {
  const mirrorFile = built['resources/js/mirror.js']?.file;

  assert.ok(mirrorFile, 'resources/js/mirror.js is in the manifest');
  assert.deepEqual(chunkImports(readFileSync(join(BUILD, mirrorFile), 'utf8')), [], `${mirrorFile} imports a chunk`);

  // bridge.js and preview.js share small chunks with the CP bundle (protocol,
  // html-pick-align, ai-text-icon) and did before the copies existed. What
  // must not appear is a chunk made of what mirror.js reuses from them.
  for (const entry of ['resources/js/bridge.js', 'resources/js/preview.js']) {
    const file = built[entry]?.file;

    assert.ok(file, `${entry} is in the manifest`);

    const shared = chunkImports(readFileSync(join(BUILD, file), 'utf8'));

    assert.deepEqual(shared.filter((name) => DUPLICATED.test(name)), [], `${file} imports ${shared.join(', ')}`);
  }
});
