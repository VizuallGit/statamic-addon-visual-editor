/**
 * HTML tags in an Antlers file — not Antlers tags, not the rendered page.
 *
 * One Antlers tag is the exception: `{{ partial:… }}`. A partial is a piece of
 * the page with a name, so it earns a row — a component node, with the call's
 * own offsets, sitting where the call sits. It has no children here: what is
 * inside it belongs to that file, and is edited by opening it.
 *
 * `{{ … }}` is blanked to spaces of the same length so offsets still match
 * the source, then a tag scanner walks the result. Closing tags never become
 * rows; void / self-closing tags are leaves.
 *
 * An HTML comment that wraps tags is a hidden subtree: the tags stay in the
 * tree (dimmed) and the comment is what live preview skips.
 */

import { findPartials } from './dock-partials.js';
import { findAntlersBlocks } from './antlers-blocks.js';

const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export function maskAntlers(html) {
  return String(html || '').replace(/\{\{[\s\S]*?\}\}/g, (chunk) => ' '.repeat(chunk.length));
}

function firstClass(openTag) {
  const match = openTag.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);

  if (!match) {
    return '';
  }

  const inner = match[2].match(/\[\s*([\s\S]*?)\s*\]/);

  if (inner) {
    const name = inner[1]
      .replace(/\{\{[\s\S]*?\}\}/g, ' ')
      .split(/\s+/)
      .find((item) => /^[a-zA-Z_][\w-]*$/.test(item));

    if (name) {
      return name;
    }
  }

  return (match[2].trim().split(/\s+/)[0] || '').replace(/\[|\]/g, '');
}

function hideTree(node, wrapFrom, wrapTo, isWrapRoot) {
  node.hidden = true;

  if (isWrapRoot) {
    node.wrapFrom = wrapFrom;
    node.wrapTo = wrapTo;
  }

  for (const child of node.children) {
    hideTree(child, wrapFrom, wrapTo, false);
  }
}

function parseRange(source, masked, rangeStart, rangeEnd) {
  const roots = [];
  const stack = [];
  let i = rangeStart;
  let n = 0;

  const push = (node) => {
    if (stack.length) {
      stack[stack.length - 1].children.push(node);
    } else {
      roots.push(node);
    }
  };

  while (i < rangeEnd) {
    if (masked[i] !== '<') {
      i += 1;
      continue;
    }

    if (masked.startsWith('<!--', i)) {
      const close = masked.indexOf('-->', i + 4);
      const innerEnd = close === -1 || close > rangeEnd ? rangeEnd : close;
      const wrapTo = close === -1 || close + 3 > rangeEnd ? rangeEnd : close + 3;
      const inner = parseRange(source, masked, i + 4, innerEnd);

      for (const node of inner) {
        hideTree(node, i, wrapTo, true);
        push(node);
      }

      i = wrapTo;
      continue;
    }

    if (masked.startsWith('<!', i) || masked.startsWith('<?', i)) {
      const gt = masked.indexOf('>', i + 2);
      i = gt === -1 || gt + 1 > rangeEnd ? rangeEnd : gt + 1;
      continue;
    }

    const close = masked[i + 1] === '/';
    const tagMatch = masked.slice(i, rangeEnd).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);

    if (!tagMatch) {
      i += 1;
      continue;
    }

    const tag = tagMatch[1].toLowerCase();
    const gt = masked.indexOf('>', i);

    if (gt === -1 || gt >= rangeEnd) {
      break;
    }

    const raw = masked.slice(i, gt + 1);
    const selfClosing = !close && (VOID.has(tag) || /\/\s*>$/.test(raw));

    if (close) {
      for (let depth = stack.length - 1; depth >= 0; depth -= 1) {
        if (stack[depth].tag === tag) {
          stack[depth].to = gt + 1;
          stack.length = depth;
          break;
        }
      }

      i = gt + 1;
      continue;
    }

    const klass = firstClass(source.slice(i, gt + 1));
    const parent = stack.length ? stack[stack.length - 1] : null;
    const siblings = parent ? parent.children : roots;
    const path = parent ? `${parent.path}/${siblings.length}:${tag}` : `${siblings.length}:${tag}`;
    const node = {
      id: `${tag}-${i}-${n}`,
      tag,
      klass,
      path,
      label: klass,
      from: i,
      to: gt + 1,
      openTo: gt + 1,
      hidden: false,
      children: [],
    };

    n += 1;
    push(node);

    if (selfClosing) {
      node.to = gt + 1;
    } else {
      stack.push(node);
    }

    i = gt + 1;
  }

  while (stack.length) {
    stack.pop().to = rangeEnd;
  }

  return roots;
}

/**
 * `components/hero_card` reads as `hero_card`.
 *
 * A dynamic call keeps its folder — `blocks/{type}` alone would read as
 * `{type}`, which says what decides the file but not where to look for it.
 */
export function componentName(src) {
  const value = String(src || '');

  return /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(value) ? value : value.split('/').pop() || '';
}

/**
 * The deepest tag whose body holds this offset. Body, not element: a call
 * inside an opening tag's attributes is not a child of it.
 */
function deepestHost(nodes, from, to) {
  for (const node of nodes || []) {
    if (from < node.openTo || to > node.to) {
      continue;
    }

    return deepestHost(node.children, from, to) || node;
  }

  return null;
}

/**
 * Condition and loop rows, with the tags they wrap moved underneath them.
 *
 * Outermost first, so a loop inside a branch lands inside the branch's row.
 * A block whose range cuts across a tag — opening inside one element and
 * closing inside another — is skipped: there is no honest place to draw it,
 * and drawing it wrong would put every edit made through the row on the wrong
 * range.
 *
 * The tags keep the `path` the tag parse gave them. Preview alignment walks
 * that path, and re-numbering siblings here would point every one of them at
 * the wrong element.
 */
function addAntlersBlocks(roots, source) {
  for (const block of findAntlersBlocks(source)) {
    const host = deepestHost(roots, block.from, block.to);
    const siblings = host ? host.children : roots;
    const inside = [];
    let crosses = false;

    for (const child of siblings) {
      const from = child.wrapFrom ?? child.from;
      const to = child.wrapTo ?? child.to;

      if (to <= block.from || from >= block.to) {
        continue;
      }

      if (from < block.from || to > block.to) {
        crosses = true;
        break;
      }

      inside.push(child);
    }

    if (crosses) {
      continue;
    }

    const label =
      block.loopKind === 'collection'
        ? `collection: ${block.handle || '?'}`
        : block.kind === 'loop'
          ? block.name
          : block.expr;
    const node = {
      id: `antlers-${block.from}`,
      tag: block.name,
      kind: 'antlers',
      antlers: block.kind,
      loopKind: block.loopKind || '',
      handle: block.handle || '',
      params: block.params || '',
      sortField: block.sortField || '',
      sortDir: block.sortDir || '',
      limit: block.limit || '',
      expr: block.expr,
      klass: label,
      path: `${host ? `${host.path}/` : ''}a${block.from}:${block.name}`,
      label,
      from: block.from,
      to: block.to,
      openTo: block.openTo,
      hidden: !!host?.hidden,
      children: inside,
    };

    const at = inside.length
      ? siblings.indexOf(inside[0])
      : siblings.findIndex((item) => item.from > block.from);

    siblings.splice(at === -1 ? siblings.length : at, inside.length, node);
  }

  return roots;
}

/**
 * Component rows are added after the tags are parsed, never during — so every
 * tag keeps the sibling index its path is built from, and a template that gains
 * a component does not renumber the rows around it.
 */
function addComponents(roots, source) {
  for (const call of findPartials(source)) {
    const host = deepestHost(roots, call.from, call.to);
    const siblings = host ? host.children : roots;
    const name = componentName(call.src);

    const node = {
      id: `component-${call.from}`,
      tag: 'component',
      kind: 'component',
      src: call.src,
      klass: name,
      path: `${host ? `${host.path}/` : ''}c${call.from}:component`,
      label: name,
      from: call.from,
      to: call.to,
      openTo: call.to,
      hidden: !!host?.hidden,
      children: [],
    };

    let at = siblings.findIndex((item) => item.from > call.from);

    if (at === -1) {
      at = siblings.length;
    }

    siblings.splice(at, 0, node);
  }

  return roots;
}

/**
 * Tags only. The CSS scope pane and the Tailwind class pane both walk this,
 * and both write into the tag a row stands for — so a partial call, which has
 * no tag to write into, must not appear here.
 *
 * @returns {Array<{ id: string, tag: string, klass: string, path: string, label: string, from: number, to: number, openTo: number, hidden: boolean, wrapFrom?: number, wrapTo?: number, children: Array }>}
 */
export function parseHtmlTree(html) {
  const source = String(html || '');
  const masked = maskAntlers(source);

  return parseRange(source, masked, 0, masked.length);
}

/** Tags, conditions, loops and components — what the HTML tree panel shows. */
export function parseTemplateTree(html) {
  const source = String(html || '');

  return addComponents(addAntlersBlocks(parseHtmlTree(source), source), source);
}

export function flattenHtmlTree(nodes, collapsed, depth = 0, out = []) {
  for (const node of nodes) {
    const hasChildren = node.children.length > 0;
    const shut = collapsed.has(node.id);

    out.push({
      id: node.id,
      tag: node.tag,
      kind: node.kind || '',
      antlers: node.antlers || '',
      loopKind: node.loopKind || '',
      handle: node.handle || '',
      params: node.params || '',
      sortField: node.sortField || '',
      sortDir: node.sortDir || '',
      limit: node.limit || '',
      expr: node.expr || '',
      src: node.src || '',
      klass: node.klass || '',
      path: node.path,
      label: node.label,
      from: node.from,
      to: node.to,
      openTo: node.openTo,
      hidden: !!node.hidden,
      wrapFrom: node.wrapFrom,
      wrapTo: node.wrapTo,
      // Which file around an open component the row belongs to (html-tree.js
      // sets it on the cloned context rows); unset on the open file's own.
      ctxLevel: node.ctxLevel,
      depth,
      hasChildren,
      // A condition or loop with nothing in it yet. It still opens and closes,
      // and it still shows where content goes — an empty block that looked
      // like a leaf would read as somewhere you cannot put anything.
      emptyBlock: node.kind === 'antlers' && !hasChildren,
      shut,
    });

    if (hasChildren && !shut) {
      flattenHtmlTree(node.children, collapsed, depth + 1, out);
    }
  }

  return out;
}

export function isVoidTag(tag) {
  return VOID.has(String(tag || '').toLowerCase());
}
