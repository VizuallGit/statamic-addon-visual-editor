/**
 * The class names in an Antlers file, as Tailwind candidates.
 *
 * Unlike the old PHP bake this does *not* blank `{{ … }}` first: a partial
 * call carries real classes — `{{ partial:components/image class="h-full" }}`
 * — and blanking the tag was why those never got any CSS. What is dropped is
 * an Antlers expression *inside* the value, because `bg-{{ color }}` is not a
 * class name anyone can compile.
 */
export function twCandidates(html) {
  const source = String(html || '');
  const attr = /\bclass\s*=\s*("([^"]*)"|'([^']*)')/gi;
  const out = new Set();
  let match;

  while ((match = attr.exec(source))) {
    const value = (match[2] ?? match[3] ?? '').replace(/\{\{[\s\S]*?\}\}/g, ' ');

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
