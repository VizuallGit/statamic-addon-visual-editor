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
  // Not a loop of its own: the pager a paginated collection hands its body.
  // Given a row, it would read as a second loop inside the first.
  'paginate',
]);

const TAG = /\{\{\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.-]*)((?::[^\s}]*)?[\s\S]*?)\}\}/g;

/**
 * The pages collection's own tree, as `{{ nav }}` names it.
 *
 * Statamic reads a bare `{{ nav }}` as this, and the double colon is what the
 * `handle` parameter wants — the single-colon `{{ nav:collection:pages }}` form
 * is the wildcard's spelling of the same thing.
 */
export const NAV_PAGES = 'collection::pages';

/**
 * Which structure a nav loop reads: a navigation's handle, or the pages tree.
 *
 * Three spellings reach the same place — `{{ nav }}`, `{{ nav:collection:pages }}`
 * and `handle="collection::pages"` — so they are read into the one sentinel and
 * the panel never has to know which was typed.
 */
export function navSource(rest) {
  const raw = String(rest || '');
  const param = raw.match(/\bhandle\s*=\s*["']([A-Za-z0-9_:-]+)["']/);
  const colon = raw.match(/^:((?:collection::?)?[A-Za-z0-9_-]+)/);
  const found = (param?.[1] || colon?.[1] || '').trim();

  if (!found || /^collection::?pages$/.test(found)) {
    return NAV_PAGES;
  }

  return found;
}

/**
 * How deep a nav loop goes, and whether the front page is in it.
 *
 * These are the two of Statamic's nav parameters the panel offers. The tag has
 * no `sort` and no `limit` at all — a navigation's order is the order it was
 * dragged into — so the loop panel shows neither for this kind.
 *
 * `navDepth` and not `depth`, because a tree row's `depth` is already how far
 * it is indented — a different number that would quietly win the merge.
 *
 * @returns {{navDepth: string, includeHome: boolean}}
 */
export function navOptions(rest) {
  const raw = String(rest || '');
  const depth = raw.match(/\bmax_depth\s*=\s*["']?(\d+)["']?/);
  const home = raw.match(/\binclude_home\s*=\s*["']?(true|false)["']?/i);

  return {
    navDepth: depth ? depth[1] : '',
    includeHome: home ? home[1].toLowerCase() === 'true' : false,
  };
}

/**
 * How a loop is sorted and how much of it renders.
 *
 * The two kinds of loop say this in different languages, measured rather than
 * assumed: a collection takes `sort="title:desc" limit="3" offset="2"` as tag
 * parameters, while a field loop ignores those and needs modifiers —
 * `| sort:title`, `| reverse`, `| shuffle`, `| limit:3`, `| offset:2`. Both are
 * read here into one shape so the panel only has to know one.
 *
 * Only a collection pages. `paginate` is on for `paginate="true"` and for the
 * older `paginate="12"`, which Statamic still reads as twelve to a page; the
 * alias is what `as="…"` names, because a paginated body loops over that.
 *
 * @returns {{sortField: string, sortDir: string, limit: string, offset: string, paginate: boolean, alias: string}}
 *   `sortDir` is 'asc', 'desc', 'random', or '' for unsorted.
 */
export function loopOptions(rest, collection) {
  const raw = String(rest || '');
  const out = { sortField: '', sortDir: '', limit: '', offset: '', paginate: false, alias: '' };

  if (collection) {
    const sort = raw.match(/\bsort\s*=\s*["']([^"']*)["']/);
    const limit = raw.match(/\blimit\s*=\s*["']?(\d+)["']?/);
    const offset = raw.match(/\boffset\s*=\s*["']?(\d+)["']?/);
    const paginate = raw.match(/(?:^|\s)paginate\s*=\s*["']([^"']*)["']/);
    const alias = raw.match(/(?:^|\s)as\s*=\s*["']([^"']*)["']/);

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

    if (offset) {
      out.offset = offset[1];
    }

    out.paginate = !!paginate && /^(?:true|[1-9]\d*)$/i.test(paginate[1].trim());
    out.alias = alias ? alias[1].trim() : '';

    return out;
  }

  const sort = raw.match(/\|\s*sort\s*:\s*([A-Za-z_][A-Za-z0-9_.-]*)/);
  const limit = raw.match(/\|\s*limit\s*:\s*(\d+)/);
  const offset = raw.match(/\|\s*offset\s*:\s*(\d+)/);

  if (/\|\s*shuffle\b/.test(raw)) {
    out.sortDir = 'random';
  } else if (sort) {
    out.sortField = sort[1];
    out.sortDir = /\|\s*reverse\b/.test(raw) ? 'desc' : 'asc';
  }

  if (limit) {
    out.limit = limit[1];
  }

  if (offset) {
    out.offset = offset[1];
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
    const collection = name === 'collection';
    // `{{ nav }}` is a loop over a structure, not over a field on the page, and
    // it takes neither of the field loop's languages — see navOptions.
    const nav = name === 'nav';
    const handle = nav ? navSource(rest) : colon?.[1] || from_?.[1] || '';

    stack.push({
      kind: 'loop',
      loopKind: collection ? 'collection' : nav ? 'nav' : 'field',
      name,
      handle,
      // Kept so a rewrite does not drop what the site put there: tag
      // parameters for a collection or a nav, the modifier chain for a field
      // loop. A nav's own three are stripped, because the panel writes them.
      params: collection
        ? rest.replace(/^:[A-Za-z0-9_-]+/, '').trim()
        : nav
          ? rest
              .replace(/^:(?:collection::?)?[A-Za-z0-9_-]+/, '')
              .replace(/\bhandle\s*=\s*["'][A-Za-z0-9_:-]+["']/, '')
              .replace(/\bmax_depth\s*=\s*["']?\d+["']?/, '')
              .replace(/\binclude_home\s*=\s*["']?(?:true|false)["']?/i, '')
              .replace(/\s+/g, ' ')
              .trim()
          : rest.trim(),
      expr: collection || nav ? handle : name,
      ...loopOptions(rest, collection),
      ...(nav ? navOptions(rest) : { navDepth: '', includeHome: false }),
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
