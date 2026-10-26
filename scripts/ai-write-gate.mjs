import { existsSync, mkdirSync, readFileSync, realpathSync, renameSync, writeFileSync } from 'node:fs';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { dirname, isAbsolute, join, normalize, relative, sep } from 'node:path';

/*
 * The only way the AI chat's agent can change a file.
 *
 * The agent runs without a shell and without Cursor's own edit and delete
 * tools. What it gets instead are the tools below, and each one checks the
 * path against the scope PHP worked out for this run (AiChat\WriteScope)
 * before anything touches the disk. A file outside the scope is refused, not
 * written and rolled back afterwards: there is nothing to undo, and a file
 * the editor saves while the agent is thinking is never looked at.
 *
 *   files   — existing files this run may change (the selected section,
 *             files the user named in the message)
 *   create  — folders a new file may be made in; never an existing file
 *             (new sections, collections, blueprints, entries, saved sections)
 *   assets  — the folder images from a web page are saved in (save_image),
 *             new files only
 *   rules   — the rules file, which is only ever appended to (add_rule)
 *
 * A web page the user points at is read with fetch_page, and its images
 * saved with save_image — public addresses only, never the server's own
 * network.
 *
 * page_sections.yaml is not in any of them: a new section is registered by
 * PHP after the run (register_section only records the request), so the list
 * every page depends on is never rewritten by a model.
 */

const NEW_FILE = /\.(ya?ml|antlers\.html|md)$/;

/** Images save_image may make. */
const IMAGE = /\.(jpe?g|png|webp|gif|svg|avif)$/i;

/** Characters of a web page's text fetch_page hands back. */
export const PAGE_CHARS = 30000;

/** The largest image save_image downloads. */
const IMAGE_BYTES = 15 * 1024 * 1024;

export const LOCKED_HINT =
  'That file is closed to the AI — a secret, an installed or built file, or the site\'s own PHP. Say what you would change there and why, and carry on with the rest.';

/** Files the open part of the site may hold: content, theme and markup — never PHP. */
const OPEN_FILE = /\.(ya?ml|md|html?|css|js|mjs|json|txt|svg|xml)$/i;

/** Never written, wherever they are. */
const SECRET = /(^|\/)\.env|(^|\/)auth\.json$|\.(key|pem|php)$/i;

/**
 * @param {string} cwd  the site root
 * @param {{files?: string[], create?: string[], rules?: string|null}} scope
 */
export function createGate(cwd, scope) {
  const root = realpathSync(cwd);
  const files = new Set((scope.files || []).map((path) => clean(path)).filter(Boolean));
  const create = (scope.create || []).map((path) => clean(path).replace(/\/?$/, '/')).filter((path) => path !== '/');
  const rules = scope.rules ? clean(scope.rules) : null;
  const open = (scope.open || []).filter((prefix) => typeof prefix === 'string' && prefix !== '');
  const closed = (scope.closed || []).filter((prefix) => typeof prefix === 'string' && prefix !== '');
  const assets = scope.assets ? clean(scope.assets).replace(/\/?$/, '/') : null;
  const made = new Set();
  const written = [];
  const register = [];

  /** A path as the agent gave it, relative to the site root and without `..`; '' when it leaves the site. */
  function clean(path) {
    if (typeof path !== 'string' || path.trim() === '' || path.includes('\0')) {
      return '';
    }

    const given = path.trim();
    // An absolute path may name the site as it was given or as it really is
    // (a symlinked home folder, /var → /private/var).
    const outside = (rel) => rel.startsWith('..') || isAbsolute(rel);
    const fromCwd = isAbsolute(given) ? relative(cwd, given) : given;
    const rel = normalize(isAbsolute(given) && outside(fromCwd) ? relative(root, given) : fromCwd).split(sep).join('/');

    return rel === '' || rel === '.' || rel.startsWith('../') || rel === '..' || isAbsolute(rel) ? '' : rel.replace(/^\.\//, '');
  }

  /** The real folder a path would land in is still inside the site — a symlink cannot carry a write out. */
  function inside(rel) {
    let dir = dirname(join(root, rel));

    while (!existsSync(dir)) {
      dir = dirname(dir);
    }

    const real = realpathSync(dir);

    return real === root || real.startsWith(root + sep);
  }

  function absolute(rel) {
    return join(root, rel);
  }

  function noted(rel) {
    if (!written.includes(rel)) {
      written.push(rel);
    }
  }

  function locked(rel) {
    return refuse(`LOCKED: ${rel || 'that path'} is not open in this run. ${LOCKED_HINT}`);
  }

  /** In the open part of the site (Build mode: content and theme), and not closed inside it. */
  function opened(rel) {
    return (
      rel !== '' &&
      OPEN_FILE.test(rel) &&
      !SECRET.test(rel) &&
      open.some((prefix) => rel.startsWith(prefix)) &&
      !closed.some((prefix) => rel === prefix || rel.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`))
    );
  }

  /** May this run change the file that is there now? */
  function mayChange(rel) {
    return rel !== '' && (files.has(rel) || made.has(rel) || opened(rel)) && inside(rel);
  }

  /** May this run make a file that is not there yet? */
  function mayCreate(rel) {
    return rel !== '' && ((NEW_FILE.test(rel) && create.some((folder) => rel.startsWith(folder))) || opened(rel)) && inside(rel);
  }

  function put(rel, content) {
    const path = absolute(rel);
    const tmp = `${path}.${process.pid}.sve-tmp`;

    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(tmp, content);
    renameSync(tmp, path);
    noted(rel);
  }

  function writeFile({ path, content } = {}) {
    const rel = clean(path);

    if (typeof content !== 'string') {
      return refuse('content must be the whole file as a string.');
    }

    if (existsSync(absolute(rel))) {
      if (!mayChange(rel)) {
        return locked(rel);
      }
    } else if (mayCreate(rel)) {
      made.add(rel);
    } else if (!mayChange(rel)) {
      return locked(rel);
    }

    put(rel, content);

    return `Wrote ${rel}.`;
  }

  function editFile({ path, old_string: before, new_string: after, replace_all: all = false } = {}) {
    const rel = clean(path);

    if (!mayChange(rel)) {
      return locked(rel);
    }

    if (!existsSync(absolute(rel))) {
      return refuse(`${rel} does not exist. Use write_file to make it.`);
    }

    if (typeof before !== 'string' || before === '' || typeof after !== 'string') {
      return refuse('old_string must be text that is in the file now, new_string what replaces it.');
    }

    const now = readFileSync(absolute(rel), 'utf8');
    const count = now.split(before).length - 1;

    if (count === 0) {
      return refuse(`old_string is not in ${rel}. Read the file again and copy the text exactly.`);
    }

    if (count > 1 && !all) {
      return refuse(`old_string is in ${rel} ${count} times. Give more of the surrounding text, or set replace_all.`);
    }

    put(rel, all ? now.split(before).join(after) : now.replace(before, () => after));

    return `Edited ${rel}.`;
  }

  function addRule({ text } = {}) {
    const line = typeof text === 'string' ? text.trim().replace(/\s*\n\s*/g, ' ') : '';

    if (!rules) {
      return refuse('The rules file is not open in this run.');
    }

    if (line === '') {
      return refuse('text is the rule, one sentence or a few.');
    }

    const now = existsSync(absolute(rules)) ? readFileSync(absolute(rules), 'utf8') : '';
    const numbers = [...now.matchAll(/^(\d+)\.\s/gm)].map((match) => Number(match[1]));
    const next = (numbers.length ? Math.max(...numbers) : 0) + 1;

    put(rules, `${now.replace(/\s*$/, '')}\n${next}. ${line}\n`);

    return `Added rule ${next} to ${rules}.`;
  }

  function registerSection({ group, handle, display, fieldset } = {}) {
    const ok =
      typeof group === 'string' && /^[a-z0-9_]+$/.test(group) &&
      typeof handle === 'string' && /^[a-z0-9_]+\/[a-z0-9_]+$/.test(handle) &&
      typeof display === 'string' && display.trim() !== '' &&
      typeof fieldset === 'string' && /^[a-z0-9_]+(\.[a-z0-9_]+)+$/.test(fieldset);

    if (!ok) {
      return refuse('group is a group handle from page_sections.yaml, handle is folder/name (the partial under page_sections/), display the name editors see, fieldset folder.name of the fieldset the set imports.');
    }

    if (!register.some((row) => row.handle === handle)) {
      register.push({ group, handle, display: display.trim(), fieldset });
    }

    return `${handle} will be added to the "${group}" group in page_sections.yaml when you are done. Do not edit page_sections.yaml yourself.`;
  }

  /** A web page as text the agent can use: its title, its images, its words. */
  async function fetchPage({ url } = {}) {
    const res = await publicFetch(url);

    if (typeof res === 'string') {
      return refuse(res);
    }

    return pageText(await res.text(), res.url || url);
  }

  /** An image from the web saved in the assets folder, as a new file. */
  async function saveImage({ url, path } = {}) {
    const rel = clean(path);

    if (!assets || !rel.startsWith(assets) || !IMAGE.test(rel) || !inside(rel)) {
      return refuse(`path must be a new image file (.jpg, .png, .webp, .gif, .svg, .avif) under ${assets || 'the assets folder'}.`);
    }

    if (existsSync(absolute(rel))) {
      return refuse(`${rel} is there already — give the new image another name.`);
    }

    const res = await publicFetch(url);

    if (typeof res === 'string') {
      return refuse(res);
    }

    if (!String(res.headers.get('content-type') || '').startsWith('image/')) {
      return refuse(`${url} is not an image.`);
    }

    const bytes = Buffer.from(await res.arrayBuffer());

    if (bytes.length > IMAGE_BYTES) {
      return refuse(`${url} is larger than ${IMAGE_BYTES / 1024 / 1024} MB.`);
    }

    put(rel, bytes);

    return `Saved ${rel} (${Math.round(bytes.length / 1024)} KB). In an assets field it is ${rel.slice(assets.length)}.`;
  }

  return {
    writeFile,
    editFile,
    addRule,
    registerSection,
    fetchPage,
    saveImage,
    get written() {
      return [...written];
    },
    get register() {
      return [...register];
    },
  };
}

function refuse(text) {
  return { content: [{ type: 'text', text }], isError: true };
}

/** An address on the server's own machine or network — never fetched for the agent. */
export function privateAddress(ip) {
  const v4 = ip.startsWith('::ffff:') ? ip.slice(7) : ip;

  if (isIP(v4) === 4) {
    const [a, b] = v4.split('.').map(Number);

    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b < 128) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b < 32) || (a === 192 && b === 168);
  }

  const v6 = ip.toLowerCase();

  return v6 === '::' || v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80');
}

/**
 * GET a public http(s) address, following up to five redirects, each checked:
 * the response, or why not as a string.
 */
async function publicFetch(url) {
  let next = String(url || '');

  for (let hop = 0; hop < 6; hop += 1) {
    let parsed;

    try {
      parsed = new URL(next);
    } catch {
      return `${next} is not a web address.`;
    }

    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.hostname === 'localhost') {
      return `${next} is not a public web address.`;
    }

    const host = parsed.hostname.replace(/^\[|\]$/g, '');
    const addresses = isIP(host) ? [host] : (await lookup(host, { all: true }).catch(() => [])).map((row) => row.address);

    if (!addresses.length || addresses.some(privateAddress)) {
      return `${next} is not a public web address.`;
    }

    const res = await fetch(parsed.href, {
      redirect: 'manual',
      signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': 'Mozilla/5.0 (Statamic Visual Editor)', Accept: 'text/html,image/*,*/*' },
    }).catch((err) => `${parsed.href} could not be reached: ${err?.message || err}`);

    if (typeof res === 'string') {
      return res;
    }

    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      next = new URL(res.headers.get('location'), parsed.href).href;

      continue;
    }

    return res.ok ? res : `${parsed.href} answered ${res.status}.`;
  }

  return `${url} redirects too many times.`;
}

/** A page's title, images (with their alt text) and words, for the agent. */
export function pageText(html, base) {
  const absolute = (src) => {
    try {
      return new URL(src, base).href;
    } catch {
      return null;
    }
  };
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const images = [];

  for (const [tag] of html.matchAll(/<img\b[^>]*>|<meta\b[^>]*og:image[^>]*>/gi)) {
    const src = (tag.match(/\s(?:data-src|src|content)=["']([^"']+)["']/i) || [])[1];
    const alt = (tag.match(/\salt=["']([^"']*)["']/i) || [])[1] || '';
    const href = src && !src.startsWith('data:') ? absolute(src) : null;

    if (href && !images.some((row) => row.href === href)) {
      images.push({ href, alt });
    }
  }

  const text = html
    .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|section|article|li|h[1-6]|tr|br)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();

  return [
    `Title: ${decodeTitle(title)}`,
    `URL: ${base}`,
    '',
    `Images (${images.length}):`,
    ...images.slice(0, 80).map((row) => `- ${row.href}${row.alt ? ` — ${row.alt}` : ''}`),
    '',
    'Text:',
    text.length > PAGE_CHARS ? `${text.slice(0, PAGE_CHARS)}\n… (cut at ${PAGE_CHARS} characters)` : text,
  ].join('\n');
}

function decodeTitle(title) {
  return title.replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim();
}

/** The gate as the SDK's custom tools. */
export function gateTools(gate, { rules = false } = {}) {
  const tools = {
    write_file: {
      description: 'Write a whole file: change an existing file this run may change, or make a new section file (.yaml / .antlers.html). Paths are relative to the site root. Anything else is refused as LOCKED.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'e.g. resources/views/partials/page_sections/hero/style_2.antlers.html' },
          content: { type: 'string', description: 'The complete new contents of the file.' },
        },
        required: ['path', 'content'],
      },
      execute: (args) => gate.writeFile(args),
    },
    edit_file: {
      description: 'Replace text in a file this run may change. old_string must match the file exactly. Anything else is refused as LOCKED.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          old_string: { type: 'string', description: 'Text that is in the file now.' },
          new_string: { type: 'string', description: 'What replaces it.' },
          replace_all: { type: 'boolean', description: 'Replace every occurrence instead of exactly one.' },
        },
        required: ['path', 'old_string', 'new_string'],
      },
      execute: (args) => gate.editFile(args),
    },
    register_section: {
      description: 'Add a new section type to the page builder (page_sections.yaml). Call it once the partial and fieldset are written. The list itself is written after you finish; never edit page_sections.yaml.',
      inputSchema: {
        type: 'object',
        properties: {
          group: { type: 'string', description: 'An existing group handle in page_sections.yaml, e.g. hero.' },
          handle: { type: 'string', description: 'folder/name — the partial under resources/views/partials/page_sections/.' },
          display: { type: 'string', description: 'The name editors see.' },
          fieldset: { type: 'string', description: 'folder.name of the fieldset the set imports, e.g. hero.style_3.' },
        },
        required: ['group', 'handle', 'display', 'fieldset'],
      },
      execute: (args) => gate.registerSection(args),
    },
  };

  tools.fetch_page = {
    description: 'Read a web page the user points at: its title, its images (with their addresses and alt text) and its text. Public web addresses only.',
    inputSchema: {
      type: 'object',
      properties: { url: { type: 'string', description: 'The page\'s full address, https://…' } },
      required: ['url'],
    },
    execute: (args) => gate.fetchPage(args),
  };

  tools.save_image = {
    description: 'Save an image from the web as a new file in the site\'s assets folder, to use in an assets field. Never replaces a file.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The image\'s address, as fetch_page listed it.' },
        path: { type: 'string', description: 'Where it goes, a new file under the assets folder, e.g. public/assets/employees/jane-doe.jpg' },
      },
      required: ['url', 'path'],
    },
    execute: (args) => gate.saveImage(args),
  };

  if (rules) {
    tools.add_rule = {
      description: 'Append one numbered rule to the site\'s AI rules (how this site wants things built). Existing rules are never changed.',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string', description: 'The rule, in the user\'s words.' } },
        required: ['text'],
      },
      execute: (args) => gate.addRule(args),
    };
  }

  return tools;
}
