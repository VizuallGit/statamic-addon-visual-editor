/**
 * Rewrite a condition or a loop from its row in the tree.
 *
 * Only the tag itself is touched — never what it wraps. A loop is renamed at
 * both ends, because `{{ blocks }}` without its `{{ /blocks }}` is a broken
 * template, and the tree would be the thing that broke it.
 */

/** The open tag with a new expression, or null when nothing would change. */
export function writeAntlersExpression(html, node, value) {
  const text = String(html || '');

  if (!node || node.kind !== 'antlers') {
    return text;
  }

  const next = String(value || '').replace(/\s+/g, ' ').trim();

  if (node.antlers === 'loop') {
    return renameLoop(text, node, next);
  }

  // `{{ else }}` takes no expression; anything typed for it is dropped.
  if (node.tag === 'else' || !next) {
    return text;
  }

  return (
    text.slice(0, node.from) + `{{ ${node.tag} ${next} }}` + text.slice(node.openTo)
  );
}

/**
 * Point a loop somewhere else.
 *
 * `kind` is what the reader picked: a field on the page, or one of the site's
 * collections. Both ends of the pair are rewritten together, because half a
 * loop is a broken template.
 */
export function writeLoopSource(html, node, kind, value) {
  return writeLoopTag(html, node, { kind, name: value });
}

/**
 * Rewrite a loop's opening tag: where it reads from, how it is sorted, how much
 * of it renders. Both ends of the pair move together, because half a loop is a
 * broken template.
 *
 * The two kinds say the same things differently — measured, not assumed. A
 * collection takes tag parameters (`sort="title:desc" limit="3"`); a field loop
 * ignores those and needs modifiers (`| sort:title | reverse | limit:3`). Only
 * this function knows that; everywhere else there is one shape.
 *
 * Options left out keep what the tag already had, so changing the sort does not
 * quietly drop the limit.
 */
export function writeLoopTag(html, node, changes = {}) {
  const text = String(html || '');

  if (!node || node.antlers !== 'loop') {
    return text;
  }

  const current = node.loopKind === 'collection' ? 'collection' : 'field';
  const kind = changes.kind ?? current;
  const name = String(changes.name ?? node.expr ?? '').trim();

  if (!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(name)) {
    return text;
  }

  const dir = changes.sortDir ?? node.sortDir ?? '';
  const field = String(changes.sortField ?? node.sortField ?? '').trim();
  const limit = String(changes.limit ?? node.limit ?? '').trim();
  const range = closingRange(text, node);

  if (!range) {
    return text;
  }

  // What is kept only means anything to the kind that wrote it. A collection's
  // `from="artister"` is a tag parameter, not a modifier, and `| limit:3` is a
  // modifier, not a tag parameter — carried across the switch they turn into
  // `{{ artister | from="artister" }}`. Changing kind starts the tag clean;
  // sorting and limit still cross, because the panel holds those itself.
  const params = kind === current ? node.params : '';
  const open =
    kind === 'collection'
      ? collectionTag(name, field, dir, limit, params)
      : fieldTag(name, field, dir, limit, params);
  const close = kind === 'collection' ? 'collection' : name;

  return (
    text.slice(0, node.from) +
    open +
    text.slice(node.openTo, range.from) +
    `{{ /${close} }}` +
    text.slice(range.to)
  );
}

function collectionTag(handle, field, dir, limit, params) {
  // Anything the site put on the tag that is not ours to manage stays.
  const kept = stripFrom(params)
    .replace(/\bsort\s*=\s*["'][^"']*["']/g, '')
    .replace(/\blimit\s*=\s*["']?\d+["']?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // `from="…"` and not `collection:…`, for one reason that matters: the pair
  // has to close. `{{ collection:services }}` closes with
  // `{{ /collection:services }}`, and this function writes `{{ /collection }}`
  // — which was a broken template every time a collection loop was written.
  // The `from` form makes the plain closer the right one, and puts the source
  // where every other parameter on the tag already is.
  const parts = [`collection from="${handle}"`];

  if (dir === 'random') {
    parts.push('sort="random"');
  } else if (field) {
    parts.push(`sort="${field}${dir === 'desc' ? ':desc' : ':asc'}"`);
  }

  if (limit) {
    parts.push(`limit="${limit}"`);
  }

  if (kept) {
    parts.push(kept);
  }

  return `{{ ${parts.join(' ')} }}`;
}

function fieldTag(name, field, dir, limit, params) {
  const kept = String(params || '')
    .split('|')
    .map((part) => part.trim())
    .filter(
      (part) =>
        part &&
        // `from` belongs to a collection tag and never to a field loop, so it
        // goes even when a tag written before this was fixed still carries one.
        !/^from\s*=/.test(part) &&
        !/^sort\s*:/.test(part) &&
        !/^reverse$/.test(part) &&
        !/^shuffle$/.test(part) &&
        !/^limit\s*:/.test(part)
    );

  const parts = [name, ...kept];

  if (dir === 'random') {
    parts.push('shuffle');
  } else if (field) {
    parts.push(`sort:${field}`);

    if (dir === 'desc') {
      parts.push('reverse');
    }
  }

  if (limit) {
    parts.push(`limit:${limit}`);
  }

  return `{{ ${parts.join(' | ')} }}`;
}

function stripFrom(params) {
  return String(params || '')
    .replace(/\bfrom\s*=\s*["'][A-Za-z0-9_-]+["']/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Where the pair's closing tag sits, or null when there is not one. */
function closingRange(text, node) {
  const inner = text.slice(node.from, node.to);
  const match = inner.match(/\{\{\s*(?:\/[A-Za-z_][A-Za-z0-9_.:-]*|endif)\s*\}\}\s*$/);

  if (!match) {
    return null;
  }

  return { from: node.from + match.index, to: node.from + match.index + match[0].length };
}

function renameLoop(text, node, next) {
  return writeLoopTag(text, node, { name: next });
}

/**
 * Add an `{{ elseif }}` or `{{ else }}` to a condition, right before it closes.
 *
 * The new branch is empty on purpose: it is a place to put something, made by
 * clicking rather than by knowing where the closing tag is.
 */
export function addAntlersBranch(html, node, kind) {
  const text = String(html || '');

  if (!node || node.antlers !== 'if' || node.tag === 'else') {
    return text;
  }

  const range = closingRange(text, node);

  if (!range) {
    return text;
  }

  const line = text.slice(0, range.from).split('\n').pop() || '';
  const indent = line.match(/^[ \t]*/)[0];
  // Same as the toolbar's `if`: an `{{ elseif }}` with no expression is not
  // valid Antlers, and would throw on the very next render.
  const branch = kind === 'else' ? '{{ else }}' : '{{ elseif true }}';

  return `${text.slice(0, range.from)}${branch}\n${indent}${text.slice(range.from)}`;
}
