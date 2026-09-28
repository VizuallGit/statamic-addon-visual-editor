/**
 * Reading HTML tags out of the template pane's text.
 *
 * Pure on purpose — no CodeMirror, no Vue, nothing the dock mounts — so what
 * the toolbar's element buttons decide from it can be unit tested. Antlers
 * expressions and HTML comments are noise here: a tag inside one is not a tag.
 * A tag ends at its first `>`, quoted or not.
 *
 * May import: nothing.
 */

export function skipHtmlNoise(text, i) {
  if (text.startsWith('{{', i)) {
    const end = text.indexOf('}}', i + 2);

    return end === -1 ? text.length : end + 2;
  }

  if (text.startsWith('<!--', i)) {
    const end = text.indexOf('-->', i + 4);

    return end === -1 ? text.length : end + 3;
  }

  return i;
}

export function readHtmlTag(text, i) {
  if (text[i] !== '<') {
    return null;
  }

  const close = text.indexOf('>', i + 1);

  if (close === -1) {
    return null;
  }

  const chunk = text.slice(i, close + 1);
  const closing = chunk.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);

  if (closing) {
    return { kind: 'close', name: closing[1].toLowerCase(), from: i, to: close + 1 };
  }

  const opening = chunk.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);

  if (!opening) {
    return { kind: 'other', from: i, to: close + 1 };
  }

  const name = opening[1].toLowerCase();
  const self =
    /\/\s*>$/.test(chunk) ||
    ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(
      name
    );

  return { kind: self ? 'void' : 'open', name, from: i, to: close + 1 };
}

export function findHtmlClose(text, name, from) {
  let depth = 1;
  let i = from;

  while (i < text.length) {
    const next = skipHtmlNoise(text, i);

    if (next !== i) {
      i = next;
      continue;
    }

    if (text[i] !== '<') {
      i += 1;
      continue;
    }

    const tag = readHtmlTag(text, i);

    if (!tag) {
      break;
    }

    if (tag.kind === 'open' && tag.name === name) {
      depth += 1;
    } else if (tag.kind === 'close' && tag.name === name) {
      depth -= 1;

      if (depth === 0) {
        return tag;
      }
    }

    i = tag.to;
  }

  return null;
}

/**
 * The tag the caret sits inside — between its `<` and its `>` — and the
 * element that tag belongs to.
 *
 * Strictly inside: a caret just before the `<` or just after the `>` is in
 * the content around the tag, not in it. Content, an Antlers expression, an
 * HTML comment, an unfinished tag or a `<!doctype>` all give `null`.
 *
 * `at` says which of the element's two tags holds the caret. The other one is
 * found by name — the matching closing tag after an opening one, the last
 * unclosed opening tag of that name before a closing one — and is `null` when
 * there is none: a void tag, an element never closed, a stray `</div>`.
 *
 * Pure: text and a position in, the tag out. Unit tested.
 */
export function tagAtCursor(text, pos) {
  const stack = [];
  let i = 0;

  while (i < pos) {
    const next = skipHtmlNoise(text, i);

    if (next !== i) {
      i = next;
      continue;
    }

    if (text[i] !== '<') {
      i += 1;
      continue;
    }

    const tag = readHtmlTag(text, i);

    if (!tag) {
      return null;
    }

    if (pos < tag.to) {
      if (tag.kind === 'open') {
        return { name: tag.name, open: tag, close: findHtmlClose(text, tag.name, tag.to), at: 'open' };
      }

      if (tag.kind === 'void') {
        return { name: tag.name, open: tag, close: null, at: 'open' };
      }

      if (tag.kind === 'close') {
        let open = null;

        for (let s = stack.length - 1; s >= 0; s -= 1) {
          if (stack[s].name === tag.name) {
            open = stack[s];
            break;
          }
        }

        return { name: tag.name, open, close: tag, at: 'close' };
      }

      return null;
    }

    if (tag.kind === 'open') {
      stack.push(tag);
    } else if (tag.kind === 'close') {
      for (let s = stack.length - 1; s >= 0; s -= 1) {
        if (stack[s].name === tag.name) {
          stack.splice(s);
          break;
        }
      }
    }

    i = tag.to;
  }

  return null;
}
