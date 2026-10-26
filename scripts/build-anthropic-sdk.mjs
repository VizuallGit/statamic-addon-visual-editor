// Bundles Anthropic's SDK into scripts/bundled/anthropic-sdk.mjs, the one
// file the Claude runner (claude-agent.mjs) imports. Bundled and committed,
// so a site needs no `npm install` for the AI on Claude — the Composer
// package brings it, on the server as anywhere.
//
// Run when the SDK version changes:
//   SVE_SDK_DIR=<a folder with node_modules/@anthropic-ai/sdk> node scripts/build-anthropic-sdk.mjs
// (default: this addon's own node_modules).

import { build } from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const modules = process.env.SVE_SDK_DIR ? join(process.env.SVE_SDK_DIR, 'node_modules') : join(here, '..', 'node_modules');

await build({
  stdin: { contents: "export { default } from '@anthropic-ai/sdk';", resolveDir: here, loader: 'js' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  nodePaths: [modules],
  outfile: join(here, 'bundled', 'anthropic-sdk.mjs'),
  legalComments: 'eof',
  logLevel: 'warning',
});

console.log('scripts/bundled/anthropic-sdk.mjs written');
