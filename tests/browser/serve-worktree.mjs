/**
 * Serve this checkout's build into the Control Panel instead of the installed one.
 *
 * The CP asks for the hashes the installed manifest names. Real entries (addon,
 * bridge, preview, overlay-host and their CSS) are answered from the working
 * tree's manifest by stem, whatever hash was asked for — an old file of that
 * exact name may still sit in the working tree (`emptyOutDir: false`) and would
 * otherwise silently prove the previous build. Every other chunk is requested by
 * a name the new entries import, so exact name is right; shared chunks such as
 * CodeMirror's index-*.js collide on the stem and must never be mapped that way.
 *
 * Usage: const served = await serveWorktreeBuild(page, buildDir, extra); … served()
 * `extra(req)` may answer a request itself first (return true when it did).
 */
import { readFileSync, existsSync } from 'node:fs';

export async function serveWorktreeBuild(page, buildDir, extra = null) {
  const manifest = JSON.parse(readFileSync(`${buildDir}/manifest.json`, 'utf8'));
  const byStem = {};
  for (const entry of Object.values(manifest)) {
    if (!entry.isEntry) continue;
    for (const rel of [entry.file, ...(entry.css || [])]) byStem[rel.split('/').pop().replace(/-[\w-]+(\.\w+)$/, '$1')] = rel;
  }
  const types = { js: 'application/javascript', css: 'text/css', json: 'application/json', woff2: 'font/woff2', svg: 'image/svg+xml' };
  let served = 0;
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (extra && extra(req)) return;
    // The CP loads from /vendor/visual-editor/build/…; the preview document loads
    // the bridge from the addon's own route, /!/sve/build/… — both must be served,
    // or the kernel is never under test.
    const m = req.url().match(/(?:\/vendor\/visual-editor\/build|\/!\/sve\/build)\/(assets\/[^?]+|manifest\.json)/);
    if (!m) { req.continue(); return; }
    const name = m[1].split('/').pop();
    const stem = name.replace(/-[\w-]+(\.\w+)$/, '$1');
    const file = byStem[stem] ? `${buildDir}/${byStem[stem]}` : `${buildDir}/${m[1]}`;
    if (!existsSync(file)) { req.continue(); return; }
    served++;
    req.respond({ status: 200, contentType: types[file.split('.').pop()] || 'application/octet-stream', body: readFileSync(file) });
  });
  return () => served;
}
