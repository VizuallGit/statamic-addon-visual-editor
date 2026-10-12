import { existsSync, mkdirSync, readFileSync, realpathSync, renameSync, writeFileSync } from 'node:fs';
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
 *   rules   — the rules file, which is only ever appended to (add_rule)
 *
 * page_sections.yaml is not in any of them: a new section is registered by
 * PHP after the run (register_section only records the request), so the list
 * every page depends on is never rewritten by a model.
 */

const NEW_FILE = /\.(ya?ml|antlers\.html)$/;

export const LOCKED_HINT =
  'Tell the user which file you need to change and why, and stop. They open it by naming the file in their next message (for example "you may change site.css").';

/**
 * @param {string} cwd  the site root
 * @param {{files?: string[], create?: string[], rules?: string|null}} scope
 */
export function createGate(cwd, scope) {
  const root = realpathSync(cwd);
  const files = new Set((scope.files || []).map((path) => clean(path)).filter(Boolean));
  const create = (scope.create || []).map((path) => clean(path).replace(/\/?$/, '/')).filter((path) => path !== '/');
  const rules = scope.rules ? clean(scope.rules) : null;
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

  /** May this run change the file that is there now? */
  function mayChange(rel) {
    return rel !== '' && (files.has(rel) || made.has(rel)) && inside(rel);
  }

  /** May this run make a file that is not there yet? */
  function mayCreate(rel) {
    return rel !== '' && NEW_FILE.test(rel) && create.some((folder) => rel.startsWith(folder)) && inside(rel);
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

  return {
    writeFile,
    editFile,
    addRule,
    registerSection,
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
