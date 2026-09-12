/**
 * Which screen size a piece of CSS belongs to.
 *
 * The dock's CSS pane edits the very files the sections are hand-written in,
 * and those files spell the same boundary two ways: `{{ responsive_css }}`
 * generates `(max-width: 1023.98px)`, the hand-written sections say
 * `(width < 64em)`. Both mean "narrower than the tablet edge", so both have to
 * be recognised — otherwise clicking Tablet builds a second tablet block
 * beside the one that is already there.
 *
 * So a query is matched by the boundary it describes, not by its spelling: the
 * number is pulled out, converted to pixels, and compared to the size's own
 * edge with a pixel of slack (1023.98px and 64em are the same line).
 *
 * Nothing here rewrites CSS. These functions find ranges; what the panel does
 * with them — fold them away, put the caret in one — is its own business.
 */

/** How close two boundaries may be and still be the same one. */
const SLACK = 1.5;

/** Root font size. `64em` is 1024px unless someone has moved it, and nobody has. */
const ROOT_PX = 16;

function toPx(value, unit) {
  const n = parseFloat(value);

  if (!Number.isFinite(n)) {
    return null;
  }

  return unit === 'em' || unit === 'rem' ? n * ROOT_PX : n;
}

/**
 * The upper bound a query describes, in pixels — or null if it has none.
 *
 * `(max-width: 1023.98px)`, `(width < 64em)` and `(width <= 1023.98px)` all
 * come back as about 1024. A `min-width` query has no upper bound and is not
 * one of ours: mobile-first is not how these templates are written, and a
 * query nobody can place is better left alone than filed under a guess.
 */
export function queryUpperPx(query) {
  const text = String(query || '').toLowerCase();

  if (/\bmin-width\b|\bwidth\s*>=?/.test(text)) {
    return null;
  }

  let m = text.match(/\bmax-width\s*:\s*([\d.]+)(px|em|rem)/);

  if (m) {
    return toPx(m[1], m[2]);
  }

  m = text.match(/\bwidth\s*<=?\s*([\d.]+)(px|em|rem)/);

  if (m) {
    return toPx(m[1], m[2]);
  }

  m = text.match(/([\d.]+)(px|em|rem)\s*>=?\s*width\b/);

  return m ? toPx(m[1], m[2]) : null;
}

/**
 * Which size a media query belongs to, or '' for one that is none of ours.
 *
 * `sizes` are the breakpoint rows: `{ handle, base, max }`, `max` being the
 * edge as a CSS length. A query no size claims — `print`, `prefers-reduced-
 * motion`, a boundary this site does not use — belongs to no size, and is
 * therefore shown at every size rather than hidden at all of them.
 */
export function sizeOfQuery(query, sizes) {
  const px = queryUpperPx(query);

  if (px === null) {
    return '';
  }

  for (const size of sizes || []) {
    if (size.base) {
      continue;
    }

    const edge = toPx(String(size.max || '').replace(/[a-z]+$/i, ''), (String(size.max || '').match(/[a-z]+$/i) || [''])[0]);

    if (edge !== null && Math.abs(edge - px) <= SLACK) {
      return size.handle;
    }
  }

  return '';
}

/**
 * Comments, strings and Antlers blanked out, character for character.
 *
 * Used on the text in front of a `{` before deciding what kind of block it
 * opens. A comment sitting above `@media` is part of that text, and without
 * this the block reads as starting with `/*` and is not recognised at all —
 * which is exactly how a commented-out size once hid the live one below it.
 * Blanking rather than removing keeps every offset where it was.
 */
function maskNoise(text) {
  let out = '';
  let i = 0;

  while (i < text.length) {
    const next = skipNoise(text, i);

    if (next !== i) {
      out += ' '.repeat(next - i);
      i = next;
      continue;
    }

    out += text[i];
    i += 1;
  }

  return out;
}

/** Step over a comment, a string, or an Antlers `{{ … }}` — none hold braces we count. */
function skipNoise(css, i) {
  if (css.startsWith('/*', i)) {
    const end = css.indexOf('*/', i + 2);

    return end === -1 ? css.length : end + 2;
  }

  if (css.startsWith('{{', i)) {
    const end = css.indexOf('}}', i + 2);

    return end === -1 ? css.length : end + 2;
  }

  if (css[i] === '"' || css[i] === "'") {
    const quote = css[i];

    for (let j = i + 1; j < css.length; j += 1) {
      if (css[j] === '\\') {
        j += 1;
      } else if (css[j] === quote) {
        return j + 1;
      }
    }

    return css.length;
  }

  return i;
}

/**
 * Every `@media` block, wherever it sits, with where it starts and ends.
 *
 * At any depth, because that is where these templates keep them: a section is
 * written as one `#id-… { … }` rule with the sizes nested inside it, and
 * `@scope(.card) { @media … }` is the other half of the same habit. An earlier
 * version only looked at the top level and quietly found nothing in the
 * templates it was written for.
 *
 * Depth costs nothing here: the panel folds these ranges away and puts the
 * cursor in one. Neither cares how deeply nested the block is.
 */
export function cssMediaBlocks(css) {
  const source = String(css || '');
  const out = [];

  const walk = (from, to, depth = 0) => {
    let i = from;
    let chunkStart = i;

    while (i < to) {
      const skipped = skipNoise(source, i);

      if (skipped !== i) {
        i = skipped;
        continue;
      }

      if (source[i] === ';') {
        i += 1;
        chunkStart = i;
        continue;
      }

      if (source[i] === '}') {
        return;
      }

      if (source[i] !== '{') {
        i += 1;
        continue;
      }

      const masked = maskNoise(source.slice(chunkStart, i));
      const prelude = masked.trim();
      const close = matchBrace(source, i, to);

      if (close === -1) {
        return;
      }

      if (/^@media\b/i.test(prelude)) {
        out.push({
          query: prelude.replace(/^@media\s*/i, '').trim(),
          // Where `@media` itself starts, not where the chunk did: a comment
          // above it is not part of the block being folded away.
          from: chunkStart + masked.search(/\S/),
          to: close + 1,
          bodyFrom: i + 1,
          bodyTo: close,
          depth,
        });

        // A size inside a size is somebody's deliberate narrowing. Left alone:
        // folding the outer one takes it with it, which is what you want.
      } else if (!/^@(?:import|charset|use)\b/i.test(prelude)) {
        // Everything else that opens a block — a style rule, `@scope`,
        // `@supports`, `@layer` — can have sizes inside it, and in these
        // templates usually does.
        walk(i + 1, close, depth + 1);
      }

      i = close + 1;
      chunkStart = i;
    }
  };

  walk(0, source.length, 0);

  return out;
}

function matchBrace(css, openIdx, limit) {
  let depth = 0;

  for (let i = openIdx; i < limit; i += 1) {
    const skipped = skipNoise(css, i);

    if (skipped !== i) {
      i = skipped - 1;
      continue;
    }

    if (css[i] === '{') {
      depth += 1;
    } else if (css[i] === '}') {
      depth -= 1;

      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * The blocks of a stylesheet as a tree — every `{ … }`, nested as written.
 *
 * `cssMediaBlocks` is this walk flattened to the media queries; the tree is
 * what the size view needs, because hiding one size means knowing which rule
 * each block sits in and what else that rule holds.
 *
 * @returns {Array<{prelude: string, media: boolean, from: number, to: number, bodyFrom: number, bodyTo: number, children: Array}>}
 */
export function cssBlockTree(css) {
  const source = String(css || '');

  const walk = (from, to) => {
    const out = [];
    let i = from;
    let chunkStart = i;

    while (i < to) {
      const skipped = skipNoise(source, i);

      if (skipped !== i) {
        i = skipped;
        continue;
      }

      if (source[i] === ';') {
        i += 1;
        chunkStart = i;
        continue;
      }

      if (source[i] === '}') {
        return out;
      }

      if (source[i] !== '{') {
        i += 1;
        continue;
      }

      const masked = maskNoise(source.slice(chunkStart, i));
      const prelude = masked.trim();
      const close = matchBrace(source, i, to);

      if (close === -1) {
        return out;
      }

      out.push({
        prelude,
        media: /^@media\b/i.test(prelude),
        query: prelude.replace(/^@media\s*/i, '').trim(),
        from: chunkStart + masked.search(/\S/),
        to: close + 1,
        bodyFrom: i + 1,
        bodyTo: close,
        children: /^@(?:import|charset|use)\b/i.test(prelude) ? [] : walk(i + 1, close),
      });

      i = close + 1;
      chunkStart = i;
    }

    return out;
  };

  return walk(0, source.length);
}

/**
 * What to fold away so only one screen size is left on screen.
 *
 * At the base size that is every size block: the base is what is left when
 * none of them apply. At a narrower size it is everything else — the other
 * sizes, and the base declarations too, because at Mobile a desktop
 * declaration is not "context", it is another size's answer to the same
 * question. What stays is the skeleton: the selectors and braces around what
 * you are looking at, so you can still see which rule you are inside.
 *
 * A rule holding nothing for this size folds whole. `''` folds nothing — that
 * is All, the view where you want the file.
 *
 * @returns {Array<{from: number, to: number}>}
 */
export function foldRangesForSize(css, sizes, active) {
  const source = String(css || '');

  if (!active) {
    return [];
  }

  const base = (sizes || []).find((size) => size.base);
  const tree = cssBlockTree(source);
  const out = [];

  /** Does this block, or anything inside it, belong to the size being shown? */
  const holds = (node) => {
    if (node.media) {
      return sizeOfQuery(node.query, sizes) === active;
    }

    return node.children.some(holds);
  };

  if (base && active === base.handle) {
    // The base is everything outside the size blocks, so only they go away —
    // the whole block, query line included. Leaving `@media (width < 64em) {…}`
    // on screen at the base is showing another size's answer while claiming to
    // show only this one.
    const hideAll = (nodes) => {
      for (const node of nodes) {
        if (node.media && sizeOfQuery(node.query, sizes)) {
          out.push({ from: node.from, to: node.to });
          continue;
        }

        hideAll(node.children);
      }
    };

    hideAll(tree);

    return out;
  }

  /**
   * Fold the stretches of a container that hold nothing for this size.
   *
   * Written as runs rather than block by block so a page of base declarations
   * collapses into one placeholder instead of a row of them.
   */
  const walk = (nodes, from, to) => {
    const keep = [];

    for (const node of nodes) {
      if (node.media && sizeOfQuery(node.query, sizes) === active) {
        // This size itself: shown whole, nothing folded inside it.
        keep.push({ from: node.from, to: node.to, into: null });
        continue;
      }

      if (holds(node)) {
        // A rule on the way to this size: its own braces stay, its contents
        // are sifted the same way.
        keep.push({ from: node.from, to: node.to, into: node });
      }
    }

    if (!keep.length) {
      // Nothing here belongs to this size. One fold for the lot.
      if (to > from) {
        out.push({ from, to });
      }

      return;
    }

    let at = from;

    for (const item of keep) {
      if (item.from > at) {
        out.push({ from: at, to: item.from });
      }

      if (item.into) {
        walk(item.into.children, item.into.bodyFrom, item.into.bodyTo);
      }

      at = item.to;
    }

    if (to > at) {
      out.push({ from: at, to });
    }
  };

  walk(tree, 0, source.length);

  // A fold of nothing but whitespace is a placeholder where there was already
  // nothing to see.
  return out.filter((range) => source.slice(range.from, range.to).trim() !== '');
}

/**
 * Drop size blocks that have nothing in them.
 *
 * Clicking Tablet on a rule that has never had a tablet answer puts an empty
 * `@media` in front of you to write in. If you write nothing, nothing should
 * reach the file: an empty media query is noise in a stylesheet, and a file
 * that fills up with them every time someone looks around is worse than one
 * that makes you type the query yourself.
 *
 * So the block is real while you have it open, and is taken out again on the
 * way to disk unless you put something in it. Whitespace and comments do not
 * count as something.
 */
export function stripEmptySizeBlocks(css, sizes) {
  const source = String(css || '');
  const drop = [];

  const walk = (nodes) => {
    for (const node of nodes) {
      if ((node.media && sizeOfQuery(node.query, sizes)) || /^#id-/.test(node.prelude)) {
        const body = maskNoise(source.slice(node.bodyFrom, node.bodyTo)).trim();

        if (body === '') {
          drop.push(node);
          continue;
        }
      }

      walk(node.children);
    }
  };

  walk(cssBlockTree(source));

  if (!drop.length) {
    return source;
  }

  let out = source;

  // Back to front, so an earlier removal cannot move a later one.
  for (const node of drop.sort((a, b) => b.from - a.from)) {
    let from = node.from;
    let to = node.to;

    // Take the line it sat on with it, and the blank line above if that
    // leaves two in a row.
    const lineStart = out.lastIndexOf('\n', from - 1) + 1;

    if (out.slice(lineStart, from).trim() === '') {
      from = lineStart;
    }

    while (out[to] === ' ' || out[to] === '\t') {
      to += 1;
    }

    if (out[to] === '\n') {
      to += 1;
    }

    out = out.slice(0, from) + out.slice(to);
  }

  return out;
}

/**
 * Blocks the panel opened but nobody has written in — size or instance rule.
 *
 * Drawn faded and dropped on the way to disk. The two are the same promise:
 * here is somewhere to write; write nothing and nothing is written.
 *
 * @returns {Array<{from: number, to: number}>}
 */
export function emptySizeBlocks(css, sizes) {
  const source = String(css || '');
  const out = [];
  const empty = (node) => maskNoise(source.slice(node.bodyFrom, node.bodyTo)).trim() === '';

  const walk = (nodes) => {
    for (const node of nodes) {
      const ours = (node.media && sizeOfQuery(node.query, sizes)) || /^#id-/.test(node.prelude);

      if (ours && empty(node)) {
        out.push({ from: node.from, to: node.to });
        continue;
      }

      walk(node.children);
    }
  };

  walk(cssBlockTree(source));

  return out;
}

/**
 * The per-instance rule — `#id-{{ id }}` — and what to fold to see only it.
 *
 * The second of the two layers these sections are written in: the design lives
 * in `@scope(.{{ _class }})` and is the same for every section of this type,
 * while this one holds what the editor filled in on THIS section, handed to
 * the design as custom properties. Two different things, edited apart.
 */
export function idRuleBlocks(css) {
  const source = String(css || '');
  const out = [];

  const walk = (nodes) => {
    for (const node of nodes) {
      // `#id-{{ id }}` masks to `#id-`, and `{{ responsive_css }}` writes the
      // same rule without naming it — both are this section's own rule.
      if (/^#id-/.test(node.prelude) || /^#\s*$/.test(node.prelude)) {
        out.push(node);
        continue;
      }

      walk(node.children);
    }
  };

  walk(cssBlockTree(source));

  return out;
}

/**
 * Fold everything that is not the per-instance rule.
 *
 * Same shape as `foldRangesForSize`: the skeleton around what you are looking
 * at stays, the rest goes away. A file with no such rule folds to nothing —
 * there is nothing to show, and the panel offers to make one.
 */
export function foldRangesForValues(css) {
  const source = String(css || '');
  const keep = idRuleBlocks(source);

  if (!keep.length) {
    return [];
  }

  const out = [];
  let at = 0;

  for (const node of keep.sort((a, b) => a.from - b.from)) {
    if (node.from > at) {
      out.push({ from: at, to: node.from });
    }

    at = node.to;
  }

  if (source.length > at) {
    out.push({ from: at, to: source.length });
  }

  return out.filter((range) => source.slice(range.from, range.to).trim() !== '');
}

/** The blocks belonging to one size, in file order. */
export function blocksForSize(css, sizes, handle) {
  return cssMediaBlocks(css).filter((block) => sizeOfQuery(block.query, sizes) === handle);
}

/**
 * The blocks to put away while looking at one size.
 *
 * At the base that is every size block, because the base is what is left when
 * none of them apply. At a narrower size it is the other sizes' blocks — its
 * own stays open, and so does anything no size claims.
 */
export function blocksToHide(css, sizes, handle) {
  return cssMediaBlocks(css).filter((block) => {
    const size = sizeOfQuery(block.query, sizes);

    return size !== '' && size !== handle;
  });
}
