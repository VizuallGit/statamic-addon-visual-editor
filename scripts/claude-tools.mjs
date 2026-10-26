import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, join, normalize, relative, sep } from 'node:path';

/*
 * What the AI chat's agent may look at when it runs on Claude: the site's
 * files, read only. On Cursor the SDK brings its own read, grep and ls; on
 * Claude these three take their place, in the same shape as the gate's
 * tools (ai-write-gate.mjs), so one loop runs both.
 *
 * Secrets and bulk stay out of reach, whatever the path says: .env, the
 * addon settings (they hold the API keys), the users folder (password
 * hashes), git, vendor, node_modules and storage.
 */

const HIDDEN = [
  /^\.env/,
  /^\.git(\/|$)/,
  /^node_modules(\/|$)/,
  /^vendor(\/|$)/,
  /^storage(\/|$)/,
  /^users(\/|$)/,
  /^resources\/addons(\/|$)/,
  /(^|\/)auth\.json$/,
  /\.(key|pem)$/,
];

/** Characters of one file the agent is handed at most. */
export const READ_LIMIT = 200000;

/** Matching lines one search returns at most. */
export const MATCH_LIMIT = 100;

/** A file bigger than this is not searched. */
const SEARCH_BYTES = 1000000;

/** Files one search looks at, at most. */
const SEARCH_FILES = 5000;

export function hidden(rel) {
  return HIDDEN.some((pattern) => pattern.test(rel));
}

/** Reads the site at `cwd` and nothing else. */
export function siteReader(cwd) {
  const root = realpathSync(cwd);

  /** A path as the agent gave it, relative to the site root; null when it leaves the site or is hidden. */
  function locate(path = '') {
    if (typeof path !== 'string' || path.includes('\0')) {
      return null;
    }

    const given = path.trim();
    const fromRoot = isAbsolute(given) ? relative(isAbsolute(relative(cwd, given)) || relative(cwd, given).startsWith('..') ? root : cwd, given) : given;
    const rel = normalize(fromRoot || '.').split(sep).join('/').replace(/^\.\/?/, '').replace(/\/$/, '');

    if (rel.startsWith('..') || isAbsolute(rel) || (rel !== '' && hidden(rel))) {
      return null;
    }

    const abs = join(root, rel);

    // A symlink inside the site may not carry a read out of it.
    try {
      const real = realpathSync(abs);

      if (real !== root && !real.startsWith(root + sep)) {
        return null;
      }
    } catch {
      // Missing: the caller says so.
    }

    return { rel, abs };
  }

  function readFile({ path, offset, limit } = {}) {
    const at = locate(path);

    if (!at || at.rel === '') {
      return refused(`${path} cannot be read.`);
    }

    let text;

    try {
      text = readFileSync(at.abs, 'utf8');
    } catch {
      return refused(`${at.rel} does not exist or is not a file.`);
    }

    if (offset || limit) {
      const lines = text.split('\n');
      const from = Math.max(1, Number(offset) || 1);
      const to = limit ? from - 1 + Math.max(1, Number(limit)) : lines.length;

      text = lines.slice(from - 1, to).join('\n');
    }

    return text.length > READ_LIMIT ? `${text.slice(0, READ_LIMIT)}\n… (cut at ${READ_LIMIT} characters; read a part with offset and limit)` : text;
  }

  function listFiles({ path = '' } = {}) {
    const at = locate(path);

    if (!at) {
      return refused(`${path} cannot be listed.`);
    }

    let entries;

    try {
      entries = readdirSync(at.abs, { withFileTypes: true });
    } catch {
      return refused(`${at.rel || '.'} is not a folder.`);
    }

    const names = entries
      .map((entry) => ({ name: entry.name, dir: entry.isDirectory(), rel: at.rel ? `${at.rel}/${entry.name}` : entry.name }))
      .filter((entry) => !hidden(entry.rel))
      .map((entry) => (entry.dir ? `${entry.name}/` : entry.name))
      .sort();

    return names.length ? names.join('\n') : '(empty)';
  }

  function searchFiles({ pattern, path = '' } = {}) {
    const at = locate(path);
    let regex;

    try {
      regex = new RegExp(String(pattern ?? ''), 'i');
    } catch {
      return refused(`${pattern} is not a regular expression.`);
    }

    if (!at || !String(pattern ?? '')) {
      return refused('Give a pattern and a folder inside the site.');
    }

    const matches = [];
    const queue = [at.rel];
    let seen = 0;

    while (queue.length && matches.length < MATCH_LIMIT && seen < SEARCH_FILES) {
      const rel = queue.shift();
      const abs = join(root, rel);
      let stats;

      try {
        stats = statSync(abs);
      } catch {
        continue;
      }

      if (stats.isDirectory()) {
        for (const entry of readdirSync(abs).sort()) {
          const child = rel ? `${rel}/${entry}` : entry;

          if (!hidden(child)) {
            queue.push(child);
          }
        }

        continue;
      }

      seen += 1;

      if (stats.size > SEARCH_BYTES) {
        continue;
      }

      const text = readFileSync(abs, 'utf8');

      if (text.includes('\0')) {
        continue;
      }

      text.split('\n').forEach((line, index) => {
        if (matches.length < MATCH_LIMIT && regex.test(line)) {
          matches.push(`${rel}:${index + 1}: ${line.trim().slice(0, 200)}`);
        }
      });
    }

    return matches.length ? matches.join('\n') : 'No matches.';
  }

  return { readFile, listFiles, searchFiles };
}

/** The three, as tools: `{ description, inputSchema, execute }` like gateTools(). */
export function readTools(reader) {
  return {
    read_file: {
      description: 'Read a file of the site. Paths are relative to the site root. offset (first line, from 1) and limit (lines) read a part of a long file.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'e.g. resources/views/partials/page_sections/hero/style_2.antlers.html' },
          offset: { type: 'integer' },
          limit: { type: 'integer' },
        },
        required: ['path'],
      },
      execute: (args) => reader.readFile(args),
    },
    list_files: {
      description: 'List a folder of the site: its files, and its folders with a trailing /. An empty path is the site root.',
      inputSchema: {
        type: 'object',
        properties: { path: { type: 'string', description: 'e.g. resources/views/partials/page_sections' } },
      },
      execute: (args) => reader.listFiles(args),
    },
    search_files: {
      description: 'Search the files under a folder for a regular expression (case-insensitive). Returns path:line: text for each matching line.',
      inputSchema: {
        type: 'object',
        properties: {
          pattern: { type: 'string' },
          path: { type: 'string', description: 'The folder to search; empty is the whole site.' },
        },
        required: ['pattern'],
      },
      execute: (args) => reader.searchFiles(args),
    },
  };
}

function refused(text) {
  return { content: [{ type: 'text', text }], isError: true };
}
