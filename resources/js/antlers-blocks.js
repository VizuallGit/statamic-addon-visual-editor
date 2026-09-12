/**
 * The Antlers a template's shape depends on: conditions and loops.
 *
 * A section reads as a list of tags, but what actually renders is decided by
 * `{{ if type == 'content' }}` and `{{ blocks }}` — and neither is visible in a
 * tree of tags. They get rows of their own, so the shape of the page can be
 * read without reading the code.
 *
 * Each branch of a condition is its own row. `{{ if }} … {{ elseif }} … {{ /if }}`
 * is three things that can happen, not one, and a reader picking through a
 * template wants to see which branch a tag sits in.
 */

/**
 * Antlers names that open a pair but are not a field loop. `partial` and the
 * `sve_*` tags are single tags; the rest are control flow with rows of their
 * own, or noise nobody needs a row for.
 */
export const NOT_A_LOOP = new Set([
  'if',
  'elseif',
  'else',
  'endif',
  'unless',
  'foreach',
  'forelse',
  'noparse',
  'once',
  'cache',
  'nocache',
  'section',
  'yield',
  'partial',
  'slot',
  'switch',
  'case',
  'vite',
  'sve_html',
  'sve_css',
  'sve_js',
  'sve_tw',
  'sve_prop',
  'style_push',
  'script_push',
  'visual_edit',
  'responsive_css',
]);

const TAG = /\{\{\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.-]*)((?::[^\s}]*)?[\s\S]*?)\}\}/g;

/**
 * How a loop is sorted and how much of it renders.
 *
 * The two kinds of loop say this in different languages, measured rather than
 * assumed: a collection takes `sort="title:desc" limit="3"` as tag parameters,
 * while a field loop ignores those and needs modifiers — `| sort:title`,
 * `| reverse`, `| shuffle`, `| limit:3`. Both are read here into one shape so
 * the panel only has to know one.
 *
 * @returns {{sortField: string, sortDir: string, limit: string}}
 *   `sortDir` is 'asc', 'desc', 'random', or '' for unsorted.
 */
export function loopOptions(rest, collection) {
  const raw = String(rest || '');
  const out = { sortField: '', sortDir: '', limit: '' };

  if (collection) {
    const sort = raw.match(/\bsort\s*=\s*["']([^"']*)["']/);
    const limit = raw.match(/\blimit\s*=\s*["']?(\d+)["']?/);

    if (sort) {
      const value = sort[1].trim();

      if (value.toLowerCase() === 'random') {
        out.sortDir = 'random';
      } else if (value) {
        const parts = value.split(':');
        const last = parts[parts.length - 1].toLowerCase();
        const hasDir = last === 'asc' || last === 'desc';

        out.sortField = (hasDir ? parts.slice(0, -1) : parts).join(':');
        out.sortDir = hasDir ? last : 'asc';
      }
    }

    if (limit) {
      out.limit = limit[1];
    }

    return out;
  }

  const sort = raw.match(/\|\s*sort\s*:\s*([A-Za-z_][A-Za-z0-9_.-]*)/);
  const limit = raw.match(/\|\s*limit\s*:\s*(\d+)/);

  if (/\|\s*shuffle\b/.test(raw)) {
    out.sortDir = 'random';
  } else if (sort) {
    out.sortField = sort[1];
    out.sortDir = /\|\s*reverse\b/.test(raw) ? 'desc' : 'asc';
  }

  if (limit) {
    out.limit = limit[1];
  }

  return out;
}

function expression(raw) {
  return String(raw || '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @returns {Array<{kind: string, name: string, expr: string, from: number, to: number, openTo: number}>}
 *   Ranges into `html`, outermost first. A pair that never closes is dropped —
 *   half a block is not a shape anyone can read.
 */
export function findAntlersBlocks(html) {
  const text = String(html || '');
  const out = [];
  const stack = [];

  TAG.lastIndex = 0;

  let match;

  while ((match = TAG.exec(text))) {
    const closing = !!match[1];
    const name = match[2].toLowerCase();
    const from = match.index;
    const openTo = from + match[0].length;

    if (closing || name === 'endif') {
      const wanted = name === 'endif' ? 'if' : name;

      for (let i = stack.length - 1; i >= 0; i -= 1) {
        // `{{ /if }}` closes whichever branch is open — by then the top of the
        // stack is the `elseif`, not the `if` that started it.
        const hit =
          wanted === 'if' ? stack[i].branchOf === 'if' : stack[i].name === wanted;

        if (!hit) {
          continue;
        }

        // Only the pair that actually closed is a block. Anything still open
        // above it was never a loop — `{{ id }}` inside an attribute reads like
        // one until the file ends without a `{{ /id }}`.
        out.push({ ...stack[i], to: openTo });
        stack.length = i;
        break;
      }

      continue;
    }

    if (name === 'if' || name === 'unless') {
      stack.push({
        kind: 'if',
        loopKind: '',
        name,
        handle: '',
        params: '',
        expr: expression(match[3]),
        from,
        openTo,
        branchOf: name,
      });

      continue;
    }

    // A branch closes the one before it and opens its own, under the same `if`.
    if (name === 'elseif' || name === 'else') {
      // Not the top of the stack: a `{{ title }}` between the branches sits
      // above it, and is a value that never closes — dropped here with it.
      let at = -1;

      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (stack[i].branchOf === 'if') {
          at = i;
          break;
        }
      }

      if (at === -1) {
        continue;
      }

      out.push({ ...stack[at], to: from });
      stack.length = at + 1;
      stack[at] = {
        kind: 'if',
        loopKind: '',
        name,
        handle: '',
        params: '',
        expr: expression(match[3]),
        from,
        openTo,
        branchOf: 'if',
      };

      continue;
    }

    if (NOT_A_LOOP.has(name) || match[3].trim().startsWith('=')) {
      continue;
    }

    // `{{ blocks }} … {{ /blocks }}` is a loop; `{{ title }}` on its own is a
    // value, and only turns out to be a loop when its closing tag shows up.
    //
    // A collection is a loop with a source: `{{ collection:blog }}` or
    // `{{ collection from="blog" }}`. The two are the same thing written twice,
    // and the panel offers one control for both.
    const rest = match[3] || '';
    const colon = rest.match(/^:([A-Za-z0-9_-]+)/);
    const from_ = rest.match(/\bfrom\s*=\s*["']([A-Za-z0-9_-]+)["']/);
    const handle = colon?.[1] || from_?.[1] || '';
    const collection = name === 'collection';

    stack.push({
      kind: 'loop',
      loopKind: collection ? 'collection' : 'field',
      name,
      handle,
      // Kept so a rewrite does not drop what the site put there: tag
      // parameters for a collection, the modifier chain for a field loop.
      params: collection ? rest.replace(/^:[A-Za-z0-9_-]+/, '').trim() : rest.trim(),
      expr: collection ? handle : name,
      ...loopOptions(rest, collection),
      from,
      openTo,
      branchOf: null,
    });
  }

  return out
    .filter((item) => item.to > item.openTo)
    .sort((a, b) => a.from - b.from || b.to - a.to);
}

/**
 * The loops a spot in the template stands inside, outermost first.
 *
 * What a template can print somewhere is decided by the loops around it: inside
 * `{{ collection:services }}` the handles are a service entry's, not the
 * section's, and inside `{{ gallery }}` they are one image's. The field picker
 * asks this so it can offer those instead of a list nothing in it would render.
 *
 * A spot *on* a loop's own opening tag is outside it — that is where the loop's
 * own handle is written, and that handle belongs to the scope around it. Which
 * is what the tree's loop and condition rows need, since they are asking what
 * they may be built out of.
 *
 * @returns {Array<{kind: string, handle: string}>}
 */
export function loopScopeAt(html, at) {
  const pos = Number(at);

  if (!Number.isFinite(pos)) {
    return [];
  }

  return findAntlersBlocks(html)
    .filter((block) => block.kind === 'loop' && pos >= block.openTo && pos < block.to)
    .map((block) => ({
      kind: block.loopKind,
      handle: block.loopKind === 'collection' ? block.handle : block.name,
    }))
    .filter((step) => !!step.handle);
}
