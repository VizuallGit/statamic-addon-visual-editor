/**
 * HTML tags in an Antlers file — not Antlers tags, not the rendered page.
 *
 * `{{ … }}` is blanked to spaces of the same length so offsets still match
 * the source, then a tag scanner walks the result. Closing tags never become
 * rows; void / self-closing tags are leaves.
 *
 * An HTML comment that wraps tags is a hidden subtree: the tags stay in the
 * tree (dimmed) and the comment is what live preview skips.
 */

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
 * @returns {Array<{ id: string, tag: string, klass: string, path: string, label: string, from: number, to: number, hidden: boolean, wrapFrom?: number, wrapTo?: number, children: Array }>}
 */
export function parseHtmlTree(html) {
  const source = String(html || '');
  const masked = maskAntlers(source);

  return parseRange(source, masked, 0, masked.length);
}

export function flattenHtmlTree(nodes, collapsed, depth = 0, out = []) {
  for (const node of nodes) {
    const hasChildren = node.children.length > 0;
    const shut = collapsed.has(node.id);

    out.push({
      id: node.id,
      tag: node.tag,
      klass: node.klass || '',
      path: node.path,
      label: node.label,
      from: node.from,
      to: node.to,
      hidden: !!node.hidden,
      wrapFrom: node.wrapFrom,
      wrapTo: node.wrapTo,
      depth,
      hasChildren,
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
