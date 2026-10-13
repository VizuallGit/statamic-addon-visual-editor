/**
 * The class names in an Antlers file, as Tailwind candidates.
 *
 * Unlike the old PHP bake this does *not* blank `{{ … }}` first: a partial
 * call carries real classes — `{{ partial:components/image class="h-full" }}`
 * — and blanking the tag was why those never got any CSS.
 *
 * An Antlers expression *inside* the value keeps only its string literals:
 * `{{ highlighted ?= 'btn px-1!' }}` and `{{ on ? 'a' : 'b' }}` carry real
 * classes — the same text Oxide picks up for `npm run build` — while
 * `bg-{{ color }}` is not a class name anyone can compile.
 */
export function twCandidates(html) {
  const source = String(html || '');
  // `_class` and `props_class` are a component call's class (component-props.js `CLASS_PARAMS`).
  const attr = /\b(?:props_|_)?class\s*=\s*(["'])/gi;
  const out = new Set();
  let match;

  while ((match = attr.exec(source))) {
    const start = attr.lastIndex;
    const end = valueEnd(source, start, match[1]);
    const value = source
      .slice(start, end)
      .replace(/\{\{([\s\S]*?)\}\}/g, (_, expr) => ` ${antlersStrings(expr).join(' ')} `)
      .replace(/\{\{[\s\S]*$/, ' ');

    attr.lastIndex = end;

    for (const token of value.split(/\s+/)) {
      const name = token.trim();

      // `[` and `]` are the CSS pane's scope brackets, not a utility.
      if (!name || name === '[' || name === ']' || name.includes('{') || name.includes('}')) {
        continue;
      }

      out.add(name);
    }
  }

  return [...out];
}

/**
 * Where an attribute value ends: its own quote, outside `{{ … }}`. A quote
 * inside the tag is Antlers' — `class="{{ on ?= "px-1" }}"` is valid.
 */
function valueEnd(source, from, quote) {
  let i = from;

  while (i < source.length) {
    if (source.startsWith('{{', i)) {
      const close = source.indexOf('}}', i + 2);

      // A tag still being typed: its `}}` is missing, or the one found
      // belongs to a later Antlers or HTML tag. The value ends at the next quote.
      if (close === -1 || /\{\{|<[a-z/!]/i.test(source.slice(i + 2, close))) {
        break;
      }

      i = close + 2;
      continue;
    }

    if (source[i] === quote) {
      return i;
    }

    i++;
  }

  const plain = source.indexOf(quote, i);

  return plain === -1 ? source.length : plain;
}

/** The text of every `'…'` / `"…"` literal in one Antlers expression. */
function antlersStrings(expr) {
  return [...expr.matchAll(/'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"/g)].map((m) => m[1] ?? m[2]);
}

/** `@utility name { … }` in the site's own CSS — those belong to site.css. */
export function twSiteUtilities(css) {
  const re = /@utility\s+([A-Za-z0-9_-]+)/g;
  const out = new Set();
  let match;

  while ((match = re.exec(String(css || '')))) {
    out.add(match[1]);
  }

  return out;
}
