/**
 * Which CSS rules belong to a piece of markup.
 *
 * A component that leaves its styling behind is not a component — it only
 * looks right in the section it was born in. So when markup moves out, the
 * rules that describe it move with it.
 *
 * Three outcomes per rule, and the safe one wins ties:
 *   - it describes only the extracted markup → it moves out
 *   - it describes that markup and what stays → it is copied, not moved
 *   - it describes neither → it stays put
 *
 * Nothing is ever removed from the section unless the extracted markup is the
 * only thing it could have been styling.
 */

const AT_NESTED = /^@(media|supports|container|layer|scope)\b/i;

/** Top-level blocks of a stylesheet, in source order, with the text between them. */
export function cssBlocks(css) {
  const text = String(css || '');
  const out = [];
  let i = 0;
  let start = 0;

  while (i < text.length) {
    // Antlers inside CSS is not a brace to count.
    if (text[i] === '{' && text[i + 1] === '{') {
      const end = text.indexOf('}}', i + 2);
      i = end === -1 ? text.length : end + 2;
      continue;
    }

    if (text[i] === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 2;
      continue;
    }

    if (text[i] === '"' || text[i] === "'") {
      const quote = text[i];
      i += 1;

      while (i < text.length && text[i] !== quote) {
        i += text[i] === '\\' ? 2 : 1;
      }

      i += 1;
      continue;
    }

    if (text[i] !== '{') {
      i += 1;
      continue;
    }

    let depth = 1;
    let j = i + 1;

    while (j < text.length && depth > 0) {
      if (text[j] === '{' && text[j + 1] === '{') {
        const end = text.indexOf('}}', j + 2);
        j = end === -1 ? text.length : end + 2;
        continue;
      }

      if (text[j] === '/' && text[j + 1] === '*') {
        const end = text.indexOf('*/', j + 2);
        j = end === -1 ? text.length : end + 2;
        continue;
      }

      if (text[j] === '"' || text[j] === "'") {
        const quote = text[j];
        j += 1;

        while (j < text.length && text[j] !== quote) {
          j += text[j] === '\\' ? 2 : 1;
        }

        j += 1;
        continue;
      }

      if (text[j] === '{') {
        depth += 1;
      } else if (text[j] === '}') {
        depth -= 1;
      }

      j += 1;
    }

    out.push({
      selector: text.slice(start, i).trim(),
      body: text.slice(i + 1, j - 1),
      from: start,
      to: j,
      text: text.slice(start, j).trim(),
    });

    i = j;
    start = j;
  }

  return out;
}

/** Class, id and tag names a piece of markup actually contains. */
export function markupTokens(html) {
  const text = String(html || '');
  const classes = new Set();
  const ids = new Set();
  const tags = new Set();

  for (const match of text.matchAll(/\sclass\s*=\s*(["'])([\s\S]*?)\1/gi)) {
    for (const name of match[2].replace(/\{\{[\s\S]*?\}\}/g, ' ').split(/[\s[\]]+/)) {
      // `md:flex` and `hover:bg-x` are Tailwind — the escaped form is what a
      // stylesheet would have to write, so both spellings are remembered.
      if (name) {
        classes.add(name);
        classes.add(name.replace(/([:./%!#()[\],])/g, '\\$1'));
      }
    }
  }

  for (const match of text.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi)) {
    if (match[2].trim()) {
      ids.add(match[2].trim());
    }
  }

  for (const match of text.matchAll(/<([a-zA-Z][a-zA-Z0-9:-]*)/g)) {
    tags.add(match[1].toLowerCase());
  }

  return { classes, ids, tags };
}

/**
 * Does one selector describe markup with these tokens?
 *
 * Every class and id it names has to be there. A selector with neither — a
 * bare `p`, say — falls back to its tag names, which is why such a rule is
 * only ever copied, never moved out from under the section.
 */
export function selectorHits(selector, tokens) {
  const text = String(selector || '')
    .replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ');

  const classes = [...text.matchAll(/\.((?:\\.|[\w-])+)/g)].map((m) => m[1]);
  const ids = [...text.matchAll(/#((?:\\.|[\w-])+)/g)].map((m) => m[1]);

  if (classes.length || ids.length) {
    const unescape = (name) => name.replace(/\\(.)/g, '$1');

    return (
      classes.every((name) => tokens.classes.has(name) || tokens.classes.has(unescape(name))) &&
      ids.every((name) => tokens.ids.has(unescape(name)))
    );
  }

  const tags = [...text.matchAll(/(^|[\s>+~,])([a-zA-Z][a-zA-Z0-9-]*)/g)].map((m) =>
    m[2].toLowerCase()
  );

  return tags.length > 0 && tags.every((name) => tokens.tags.has(name));
}

function selectorParts(selector) {
  return String(selector || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function verdict(selector, block, rest) {
  const parts = selectorParts(selector);

  if (!parts.length) {
    return 'keep';
  }

  const hitsBlock = parts.filter((part) => selectorHits(part, block));

  if (!hitsBlock.length) {
    return 'keep';
  }

  const onlyBlock =
    hitsBlock.length === parts.length && !parts.some((part) => selectorHits(part, rest));

  return onlyBlock ? 'move' : 'copy';
}

/**
 * @returns {{ move: string, keep: string }} the component's CSS, and what the
 * section is left with.
 */
export function splitCssForBlock(css, blockHtml, restHtml) {
  const text = String(css || '');
  const block = markupTokens(blockHtml);
  const rest = markupTokens(restHtml);
  const move = [];
  const keep = [];
  let cursor = 0;

  for (const rule of cssBlocks(text)) {
    // Blocks are contiguous, so a rule's own slice carries the blank line that
    // came before it — dropping the rule drops that blank line with it.
    const whole = text.slice(rule.from, rule.to);
    const lead = whole.match(/^\s*/)[0];

    cursor = rule.to;

    // Nested at-rules are split by what is inside them, so a component keeps
    // its own breakpoints and the section keeps the rest of that query.
    if (AT_NESTED.test(rule.selector)) {
      const inner = splitCssForBlock(rule.body, blockHtml, restHtml);

      if (inner.move.trim()) {
        move.push(`${rule.selector} {\n${inner.move.trim()}\n}`);
      }

      if (inner.keep.trim()) {
        keep.push(`${lead}${rule.selector} {\n${inner.keep.trim()}\n}`);
      }

      continue;
    }

    const call = rule.selector.startsWith('@') ? 'keep' : verdict(rule.selector, block, rest);

    if (call === 'move') {
      move.push(rule.text);
      continue;
    }

    if (call === 'copy') {
      move.push(rule.text);
    }

    keep.push(whole);
  }

  keep.push(text.slice(cursor));

  return {
    move: move.join('\n\n').trim(),
    keep: keep.join('').replace(/\n{3,}/g, '\n\n').trim(),
  };
}
