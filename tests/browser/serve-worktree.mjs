/**
 * Serve this checkout's build into the Control Panel instead of the installed one.
 *
 * The CP's HTML names the hashes the installed manifest lists. Its entries
 * (addon, bridge, preview, overlay-host and their CSS) are answered from the
 * working tree's manifest by stem, whatever hash was asked for — an old file of
 * that exact name may still sit in the working tree (`emptyOutDir: false`) and
 * would otherwise silently prove the previous build. Only the names the
 * installed manifest lists as entries are mapped that way: a stray request for
 * some other `addon-*.js` (a stale chunk a script names by hand) is served as
 * itself, exactly as production would, or the run proves a CP that does not
 * exist. Every other chunk is requested by the name a served file imports, so
 * exact name is right; shared chunks such as CodeMirror's index-*.js collide on
 * the stem and are never mapped by it.
 *
 * Lazy chunks import the entry by ITS name (`./addon-<worktree hash>.js`). Left
 * alone, the browser would load the entry a second time under that URL — two
 * copies of the editor's state — so every served body has the working tree's
 * entry names rewritten to the installed ones. One URL per module, as shipped.
 *
 * The standalone scripts (`ServiceProvider::$scripts`, served from
 * /vendor/visual-editor/js/) come from the checkout's resources/js too; one the
 * checkout no longer has gets a 404, as does any build file it does not have —
 * never the installed copy.
 *
 * Usage:
 *   const served = await serveWorktreeBuild(page, { buildDir, installedManifest, scriptsDir, extra }); … served()
 *   buildDir           the build to prove (…/resources/dist/build)
 *   installedManifest  the manifest the site serves (public/vendor/visual-editor/build/manifest.json)
 *   scriptsDir         the checkout's resources/js (optional)
 *   extra(req)         may answer a request itself first (return true when it did)
 */
import { readFileSync, existsSync } from 'node:fs';

const stemOf = (name) => name.replace(/-[\w-]+(\.\w+)$/, '$1');
const entryFiles = (manifest) => Object.values(manifest).filter((e) => e.isEntry).flatMap((e) => [e.file, ...(e.css || [])]);
const types = { js: 'application/javascript', css: 'text/css', json: 'application/json', woff2: 'font/woff2', svg: 'image/svg+xml' };

export async function serveWorktreeBuild(page, { buildDir, installedManifest, scriptsDir = null, extra = null }) {
  if (!buildDir || !installedManifest) throw new Error('serveWorktreeBuild: buildDir and installedManifest are required');
  const manifest = JSON.parse(readFileSync(`${buildDir}/manifest.json`, 'utf8'));
  const installed = JSON.parse(readFileSync(installedManifest, 'utf8'));
  const byStem = {};
  for (const rel of entryFiles(manifest)) byStem[stemOf(rel.split('/').pop())] = rel;
  // installed entry name → working-tree file, and working-tree entry name → installed name
  const mapped = new Map();
  const renames = [];
  for (const rel of entryFiles(installed)) {
    const name = rel.split('/').pop();
    const ours = byStem[stemOf(name)];
    if (!ours) continue;
    mapped.set(name, ours);
    if (ours.split('/').pop() !== name) renames.push([ours.split('/').pop(), name]);
  }
  const rewrite = (body) => renames.reduce((text, [from, to]) => text.split(from).join(to), body);
  let served = 0;
  const answer = (req, file) => {
    if (!existsSync(file)) { req.respond({ status: 404, contentType: 'text/plain', body: `not in the working tree: ${file}` }); return; }
    served++;
    const ext = file.split('.').pop();
    const body = ext === 'js' || ext === 'css' ? rewrite(readFileSync(file, 'utf8')) : readFileSync(file);
    req.respond({ status: 200, contentType: types[ext] || 'application/octet-stream', body });
  };
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (extra && extra(req)) return;
    const url = req.url();
    const script = scriptsDir && url.match(/\/vendor\/visual-editor\/js\/([\w-]+\.js)(?:[?#]|$)/);
    if (script) { answer(req, `${scriptsDir}/${script[1]}`); return; }
    // The CP loads from /vendor/visual-editor/build/…; the preview document loads
    // the bridge from the addon's own route, /!/sve/build/… — both must be served,
    // or the kernel is never under test.
    const m = url.match(/(?:\/vendor\/visual-editor\/build|\/!\/sve\/build)\/(assets\/[^?#]+|manifest\.json)/);
    if (!m) { req.continue(); return; }
    const name = m[1].split('/').pop();
    answer(req, mapped.has(name) ? `${buildDir}/${mapped.get(name)}` : `${buildDir}/${m[1]}`);
  });
  return () => served;
}
