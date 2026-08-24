/**
 * Vite must not be able to delete the hashed file addon.js still imports.
 * A build of overlay-host alone did that and the whole editor vanished.
 */
import { existsSync, readFileSync, readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const IMPORT_RE = /from\s*["']\.\/([^"']+\.js)["']/g;

function addonImports(assetsDir) {
  if (!existsSync(assetsDir)) {
    return [];
  }

  const names = [];

  for (const file of readdirSync(assetsDir)) {
    if (!/^addon-[A-Za-z0-9_-]+\.js$/.test(file)) {
      continue;
    }

    const source = readFileSync(join(assetsDir, file), 'utf8');
    let match;

    while ((match = IMPORT_RE.exec(source))) {
      names.push(match[1]);
    }
  }

  return [...new Set(names)];
}

export function keepImportedChunks() {
  return {
    name: 'sve-keep-imported-chunks',
    apply: 'build',
    closeBundle() {
      const assetsDir = join(process.cwd(), 'resources/dist/build/assets');
      const lockedDir = join(process.cwd(), 'resources/dist/locked');
      const missing = [];

      mkdirSync(lockedDir, { recursive: true });

      for (const name of addonImports(assetsDir)) {
        const live = join(assetsDir, name);
        const locked = join(lockedDir, name);

        if (!existsSync(live) && existsSync(locked)) {
          copyFileSync(locked, live);
        }

        if (!existsSync(live)) {
          missing.push(name);
        } else {
          copyFileSync(live, locked);
        }
      }

      if (missing.length) {
        throw new Error(
          'Visual Editor build deleted a file addon.js still imports: ' +
            missing.join(', ') +
            '. Never rebuild overlay-host, preview or bridge alone.'
        );
      }
    },
  };
}
