/**
 * The Antlers tags in a template, whole: a tag ends at the `}}` that answers
 * its own `{{`, so `{{ svg src="{{ logo }}" class="…" }}` is one tag — not
 * one that ends at the inner `}}` with ` class="…" }}` left over as text,
 * which is what a lazy `\{\{[\s\S]*?\}\}` made of it (the dock read the <li>
 * around such a tag as the tag at the caret, 12 Oct 2026). A comment ends
 * at `#}}`. A tag still being typed, with no `}}` to come, runs to the end.
 *
 * @typedef {{ from: number, to: number, name: string, body: string, comment: boolean, closer: boolean, closed: boolean }} AntlersTag
 */

/** @returns {AntlersTag[]} top-level tags, in order; a tag inside another's parameter is part of the outer one */
export function antlersTags(html) {
  const text = String(html || '');
  const out = [];
  let i = 0;
  let start;

  while ((start = text.indexOf('{{', i)) !== -1) {
    let j;
    let closed;

    if (text[start + 2] === '#') {
      const end = text.indexOf('#}}', start + 3);

      closed = end !== -1;
      j = closed ? end + 3 : text.length;
      out.push({ from: start, to: j, name: '', body: '', comment: true, closer: false, closed });
      i = j;
      continue;
    }

    let depth = 0;

    j = start;

    while (j < text.length) {
      if (text[j] === '{' && text[j + 1] === '{') {
        depth++;
        j += 2;
      } else if (text[j] === '}' && text[j + 1] === '}') {
        depth--;
        j += 2;

        if (!depth) {
          break;
        }
      } else {
        j++;
      }
    }

    closed = depth === 0;

    const body = text.slice(start + 2, closed ? j - 2 : j).trim();
    const name = (body.match(/^\/?([a-zA-Z0-9_:.-]+)/) || [])[1] || '';

    out.push({ from: start, to: j, name, body, comment: false, closer: body.startsWith('/'), closed });
    i = j;
  }

  return out;
}

/** The tag `pos` is inside, or null — on its `{{` and up to (not past) its `}}`. */
export function antlersTagAt(html, pos) {
  return antlersTags(html).find((tag) => pos >= tag.from && pos <= tag.to) || null;
}

/** Antlers blanked to spaces, so offsets hold and nothing inside a tag reads as markup. */
export function maskAntlers(html) {
  const text = String(html || '');
  let out = '';
  let i = 0;

  for (const tag of antlersTags(text)) {
    out += text.slice(i, tag.from) + ' '.repeat(tag.to - tag.from);
    i = tag.to;
  }

  return out + text.slice(i);
}
